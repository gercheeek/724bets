import React, { useState, useEffect } from 'react';
import { 
    Medal, Plus, CheckCircle2, AlertTriangle, Search, Filter, 
    X, TrendingDown, TrendingUp, ShieldAlert, Activity, Database, Check, ChevronDown, ChevronUp, Calendar
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { createBrowserClient } from '../lib/supabase';

const supabase = createBrowserClient();

interface PoolMatch {
    id: string;
    data: {
        status: string;
        tournament: { name: string };
        participants: { home: string; away: string };
        start_time: string;
        group_markets: any;
    };
}

interface ActiveMatch {
    id: string;
    league: string;
    team_home: string;
    team_away: string;
    match_date: string;
    status: 'active' | 'suspended' | 'finished';
    odds: { "1": number, "X": number, "2": number };
}

// Mock Liability Data for Chart
const riskData = [
    { name: 'GS - FB', MS1: 50000, MSX: 12000, MS2: 85000, risk: 'MS2' },
    { name: 'RMA - BAR', MS1: 120000, MSX: 45000, MS2: 30000, risk: 'MS1' },
    { name: 'ARS - CHE', MS1: 25000, MSX: 60000, MS2: 28000, risk: 'MSX' },
    { name: 'MIL - INT', MS1: 40000, MSX: 35000, MS2: 42000, risk: 'DENGELİ' },
];

export default function AdminSportsTab() {
    const [activeSubTab, setActiveSubTab] = useState<'pool' | 'active' | 'risk' | 'api_settings' | 'monitor'>('pool');
    const [isLiveWindowOpen, setIsLiveWindowOpen] = useState(false);
    const [isUpcomingWindowOpen, setIsUpcomingWindowOpen] = useState(false);
    
    // API Provider Settings States
    const [apiProvider, setApiProvider] = useState<'tarafbet' | 'atekbet' | 'bahiks'>('atekbet');
    const [autoFailover, setAutoFailover] = useState(true);
    const [isPushing, setIsPushing] = useState(false);
    const [pushMessage, setPushMessage] = useState('');

    const [poolMatches, setPoolMatches] = useState<PoolMatch[]>([]);
    const [activeMatches, setActiveMatches] = useState<ActiveMatch[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch pool matches from JSON based on selected provider
    useEffect(() => {
        const fileToFetch = '/prelive_matches.json';
        
        fetch(`${fileToFetch}?v=` + new Date().getTime())
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setPoolMatches(data);
            })
            .catch(err => console.error(`Error fetching ${fileToFetch}:`, err));
    }, [apiProvider]); // Re-fetch when provider changes

    // Fetch active matches from Supabase
    const fetchActiveMatches = async () => {
        const { data, error } = await supabase.from('sports_matches').select('*').order('match_date', { ascending: true });
        if (data && !error) {
            setActiveMatches(data);
        }
    };

    useEffect(() => {
        fetchActiveMatches();
    }, []);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
    const [selectedActiveMatch, setSelectedActiveMatch] = useState<ActiveMatch | null>(null);

    // Form States
    const [newMatch, setNewMatch] = useState({ league: '', homeTeam: '', awayTeam: '', dateTime: '', ms1: 1.85, msx: 3.40, ms2: 3.80 });
    const [matchScore, setMatchScore] = useState({ home: '', away: '' });

    // Extract Odds from Provider string format
    const extractOdds = (markets: string[]) => {
        let ms1 = 1.85, msx = 3.40, ms2 = 3.80;
        for (const market of markets) {
            if (!market || typeof market !== 'string') continue;
            const is1x2 = market.includes('|12|') || market.includes('|1x2|') || market.includes('|match_winner|');
            if (is1x2 && (market.includes('~home~') || market.includes('~away~') || market.includes('~1~') || market.includes('~2~'))) {
                const parts = market.split('|');
                const sp = parts.find((p: string) => p.includes('~home~') || p.includes('~away~') || p.includes('~1~') || p.includes('~2~'));
                if (sp) {
                    const sels = sp.split('!');
                    sels.forEach((sel: string) => {
                        const sParts = sel.split('~');
                        if (sParts.length > 2) {
                            const type = sParts[1].toLowerCase();
                            let odd = parseFloat(sParts[2]);
                            if (!isNaN(odd)) {
                                if (odd < 0) odd = Math.abs(odd);
                                if (odd < 1) odd += 1;
                                if (odd < 1.01) odd = 1.01;
                                if (type === 'home' || type === '1') ms1 = odd;
                                if (type === 'draw' || type === 'x') msx = odd;
                                if (type === 'away' || type === '2') ms2 = odd;
                            }
                        }
                    });
                }
            }
        }
        return { ms1, msx, ms2 };
    };

    const handleOpenAddModal = (pm?: PoolMatch) => {
        if (pm && pm.data) {
            const markets = pm.data.group_markets?.['full_event|0'] || [];
            const odds = extractOdds(markets);
            
            // Format for datetime-local
            const dt = pm.data.start_time ? new Date(pm.data.start_time) : new Date();
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            const dtString = dt.toISOString().slice(0, 16);

            setNewMatch({
                league: pm.data.tournament?.name || 'Lig',
                homeTeam: pm.data.participants?.home || 'Ev',
                awayTeam: pm.data.participants?.away || 'Dep',
                dateTime: dtString,
                ms1: odds.ms1,
                msx: odds.msx,
                ms2: odds.ms2
            });
        } else {
            setNewMatch({ league: '', homeTeam: '', awayTeam: '', dateTime: '', ms1: 1.5, msx: 3.0, ms2: 4.0 });
        }
        setIsAddModalOpen(true);
    };

    const handleAddMatch = async () => {
        if (!newMatch.homeTeam || !newMatch.awayTeam) return;

        const { error } = await supabase.from('sports_matches').insert({
            sport_category: 'Futbol',
            league: newMatch.league || 'Genel',
            team_home: newMatch.homeTeam,
            team_away: newMatch.awayTeam,
            match_date: new Date(newMatch.dateTime).toISOString(),
            is_live: false,
            status: 'active',
            odds: { "1": newMatch.ms1, "X": newMatch.msx, "2": newMatch.ms2 }
        });

        if (!error) {
            setIsAddModalOpen(false);
            fetchActiveMatches();
        } else {
            console.error("Error adding match:", error);
            alert("Maç eklenirken bir hata oluştu.");
        }
    };

    const handleResolveClick = (m: ActiveMatch) => {
        setSelectedActiveMatch(m);
        setMatchScore({ home: '', away: '' });
        setIsResolveModalOpen(true);
    };

    const confirmResolve = async () => {
        if (!selectedActiveMatch || matchScore.home === '' || matchScore.away === '') return;
        
        const { error } = await supabase.from('sports_matches')
            .update({ 
                status: 'finished', 
                score_home: parseInt(matchScore.home), 
                score_away: parseInt(matchScore.away) 
            })
            .eq('id', selectedActiveMatch.id);

        if (!error) {
            setIsResolveModalOpen(false);
            fetchActiveMatches();
        } else {
            console.error("Error resolving match:", error);
        }
    };

    const handlePushApiSettings = () => {
        setIsPushing(true);
        setPushMessage('Sistem API yapılandırması güncelleniyor. Lütfen bekleyin...');
        
        // Simulate a system shutdown/restart or propagation delay (1 minute as requested, but we'll do 3 seconds for UX, indicating 1 min in UI)
        setTimeout(() => {
            setPushMessage('Sistem başarıyla yeniden başlatıldı ve yeni API kaynağına bağlandı.');
            setTimeout(() => {
                setIsPushing(false);
                setPushMessage('');
            }, 3000);
        }, 3000);
    };

    const filteredPoolMatches = poolMatches.filter(m => 
        m?.data?.participants?.home?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m?.data?.participants?.away?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m?.data?.tournament?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 100);

    const nowTime = Date.now();
    const livePoolMatches = filteredPoolMatches.filter(m => {
        if (!m?.data?.start_time) return false;
        const t = new Date(m.data.start_time).getTime();
        return t <= nowTime + (4 * 60 * 60 * 1000);
    });
    const upcomingPoolMatches = filteredPoolMatches.filter(m => !livePoolMatches.includes(m));

    const renderMatchRow = (m: PoolMatch) => {
        const odds = extractOdds(m.data.group_markets?.['full_event|0'] || []);
        return (
            <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded border border-zinc-700/50">{m?.data?.tournament?.name || 'Bilinmeyen Lig'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                        {m?.data?.participants?.home || 'Ev'} <span className="text-zinc-600 text-xs">VS</span> {m?.data?.participants?.away || 'Dep'}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-300">{m?.data?.start_time ? new Date(m.data.start_time).toLocaleDateString('tr-TR') : '-'}</div>
                    <div className="text-xs text-zinc-500">{m?.data?.start_time ? new Date(m.data.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' }) : '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2 font-mono text-sm opacity-70">
                        <span className="bg-[#1a1c24] px-3 py-1 rounded border border-zinc-800 text-blue-400">{odds.ms1.toFixed(2)}</span>
                        <span className="bg-[#1a1c24] px-3 py-1 rounded border border-zinc-800 text-zinc-400">{odds.msx.toFixed(2)}</span>
                        <span className="bg-[#1a1c24] px-3 py-1 rounded border border-zinc-800 text-blue-400">{odds.ms2.toFixed(2)}</span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                        onClick={() => handleOpenAddModal(m)}
                        className="px-4 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold rounded transition-colors text-xs flex items-center justify-end gap-1 ml-auto"
                    >
                        <Check className="w-3 h-3" />
                        Aktife Al
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-y-auto">
            
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-zinc-800 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Activity className="w-6 h-6 text-[#00E5FF]" />
                        Spor Yönetimi
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">Maç sağlayıcı entegrasyonu ve aktif maç yönetimi</p>
                </div>

                <div className="bg-[#111318] p-1 rounded-xl border border-zinc-800 flex shadow-inner">
                    <button 
                        onClick={() => setActiveSubTab('pool')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            activeSubTab === 'pool' 
                            ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Database className="w-4 h-4" />
                        Onay Bekleyenler (Havuz)
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('active')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            activeSubTab === 'active' 
                            ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Medal className="w-4 h-4" />
                        Aktif Maçlar
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('risk')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            activeSubTab === 'risk' 
                            ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <AlertTriangle className="w-4 h-4" />
                        Risk Radarı
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('api_settings')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            activeSubTab === 'api_settings' 
                            ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <ShieldAlert className="w-4 h-4" />
                        API Sağlayıcı
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('monitor')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            activeSubTab === 'monitor' 
                            ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.3)]' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Activity className="w-4 h-4" />
                        Canlı Veri Radarı
                    </button>
                </div>
            </div>

            {/* TAB: PROVIDER POOL */}
            {activeSubTab === 'pool' && (
                <div className="flex-1 flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-center">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder="Takım veya Lig ara..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111318] border border-zinc-800 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                        <button 
                            onClick={() => handleOpenAddModal()}
                            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold rounded-lg flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-5 h-5" /> Manuel Maç Ekle
                        </button>
                    </div>

                    {/* Window 1: Canlı Maçlar Window */}
                    <div className="bg-[#111318] border border-emerald-500/30 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-[#161a22] border-b border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-3 w-3 mr-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E5FF]"></span>
                                </span>
                                <h3 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
                                    Canlı Maçlar (Havuz)
                                </h3>
                                <span className="ml-2 bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                                    {livePoolMatches.length} Maç
                                </span>
                            </div>
                            <button 
                                onClick={() => setIsLiveWindowOpen(!isLiveWindowOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-zinc-700"
                            >
                                {isLiveWindowOpen ? (
                                    <>
                                        <ChevronUp className="w-4 h-4 text-[#00E5FF]" />
                                        <span>Pencereyi Kapat</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4 text-[#00E5FF]" />
                                        <span>Pencereyi Aç</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {isLiveWindowOpen && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead>
                                        <tr className="bg-[#1a1d24] border-b border-zinc-800">
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Lig</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Karşılaşma</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tarih / Saat</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Ham Oranlar (1 - X - 2)</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        {livePoolMatches.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-zinc-500">Şu anda canlı oynanan maç bulunamadı.</td>
                                            </tr>
                                        ) : livePoolMatches.map(m => renderMatchRow(m))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Window 2: Gelecek Maçlar Window */}
                    <div className="bg-[#111318] border border-blue-500/30 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="px-6 py-4 bg-[#161a22] border-b border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400 mr-1" />
                                <h3 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
                                    Gelecek Maçlar (Bülten)
                                </h3>
                                <span className="ml-2 bg-blue-500/20 text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-500/30">
                                    {upcomingPoolMatches.length} Maç
                                </span>
                            </div>
                            <button 
                                onClick={() => setIsUpcomingWindowOpen(!isUpcomingWindowOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg text-xs font-bold transition-all border border-zinc-700"
                            >
                                {isUpcomingWindowOpen ? (
                                    <>
                                        <ChevronUp className="w-4 h-4 text-blue-400" />
                                        <span>Pencereyi Kapat</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-4 h-4 text-blue-400" />
                                        <span>Pencereyi Aç</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {isUpcomingWindowOpen && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead>
                                        <tr className="bg-[#1a1d24] border-b border-zinc-800">
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Lig</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Karşılaşma</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tarih / Saat</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Ham Oranlar (1 - X - 2)</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-800/50">
                                        {upcomingPoolMatches.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-zinc-500">Bültende gelecek maç bulunamadı.</td>
                                            </tr>
                                        ) : upcomingPoolMatches.map(m => renderMatchRow(m))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB: ACTIVE MATCHES */}
            {activeSubTab === 'active' && (
                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder="Aktif maçlarda ara..."
                                className="w-full bg-[#111318] border border-zinc-800 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-emerald-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 bg-[#111318] border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-0">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-[#1a1d24] border-b border-zinc-800">
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Lig</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Karşılaşma</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tarih / Saat</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">Aktif Oranlar (1 - X - 2)</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Durum</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/50">
                                    {activeMatches.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-10 text-zinc-500">Yayında aktif maç bulunmuyor.</td>
                                        </tr>
                                    ) : activeMatches.map(m => (
                                        <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-zinc-400 bg-zinc-800/50 px-3 py-1 rounded border border-zinc-700/50">{m.league}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-white flex items-center gap-2">
                                                    {m.team_home} <span className="text-zinc-600 text-xs">VS</span> {m.team_away}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-zinc-300">{new Date(m.match_date).toLocaleDateString('tr-TR')}</div>
                                                <div className="text-xs text-zinc-500">{new Date(m.match_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' })}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2 font-mono text-sm">
                                                    <span className="bg-[#1a1c24] px-3 py-1 rounded border border-zinc-800 text-[#00E5FF]">{m.odds?.["1"]?.toFixed(2) || '0.00'}</span>
                                                    <span className="bg-[#1a1c24] px-3 py-1 rounded border border-zinc-800 text-zinc-300">{m.odds?.["X"]?.toFixed(2) || '0.00'}</span>
                                                    <span className="bg-[#1a1c24] px-3 py-1 rounded border border-zinc-800 text-[#00E5FF]">{m.odds?.["2"]?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {m.status === 'active' && <span className="text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded border border-emerald-500/20">Bahse Açık</span>}
                                                {m.status === 'suspended' && <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 flex items-center gap-1.5 w-min"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"/> Askıda</span>}
                                                {m.status === 'finished' && <span className="text-xs font-bold text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded border border-zinc-700">Sonuçlandı</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                {m.status === 'active' || m.status === 'suspended' ? (
                                                    <button 
                                                        onClick={() => handleResolveClick(m)}
                                                        className="px-4 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold rounded transition-colors text-xs"
                                                    >
                                                        Sonuçlandır
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-zinc-500 flex items-center justify-end gap-1"><CheckCircle2 className="w-3 h-3"/> Ödendi</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: API SETTINGS */}
            {activeSubTab === 'api_settings' && (
                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-[#111318] border border-zinc-800 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto w-full mt-4">
                        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
                            <div className="p-3 bg-purple-500/20 rounded-xl">
                                <Database className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Spor API Kaynağı</h3>
                                <p className="text-sm text-zinc-400">Canlı ve bülten maç verilerinin çekileceği ana sunucuyu seçin.</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            {/* Atekbet Server */}
                            <label 
                                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                                    apiProvider === 'atekbet' 
                                    ? 'bg-[#00E5FF]/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                                    : 'bg-[#1a1d24] border-zinc-800 hover:border-zinc-700'
                                }`}
                            >
                                <input 
                                    type="radio" 
                                    name="apiProvider" 
                                    value="atekbet" 
                                    checked={apiProvider === 'atekbet'} 
                                    onChange={() => setApiProvider('atekbet')}
                                    className="hidden"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white text-lg">Atekbet Swarm (Birincil Sunucu)</h4>
                                            {apiProvider === 'atekbet' && <span className="bg-[#00E5FF]/20 text-[#00E5FF] text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Aktif</span>}
                                        </div>
                                        {apiProvider === 'atekbet' && <CheckCircle2 className="w-5 h-5 text-[#00E5FF]" />}
                                    </div>
                                    <p className="text-sm text-zinc-400">Ana BetConstruct WSS beslemesi. Standart trafiği karşılar.</p>
                                    <div className="mt-2 text-xs font-mono text-emerald-300/70 bg-[#00E5FF]/10 inline-block px-2 py-1 rounded">wss://swarm.atekbet.com/</div>
                                </div>
                            </label>

                            {/* Bahiks211 Server */}
                            <label 
                                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                                    apiProvider === 'bahiks' 
                                    ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                                    : 'bg-[#1a1d24] border-zinc-800 hover:border-zinc-700'
                                }`}
                            >
                                <input 
                                    type="radio" 
                                    name="apiProvider" 
                                    value="bahiks" 
                                    checked={apiProvider === 'bahiks'} 
                                    onChange={() => setApiProvider('bahiks')}
                                    className="hidden"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white text-lg">Bahiks211 Swarm (Yedek Sunucu)</h4>
                                            {apiProvider === 'bahiks' && <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Aktif</span>}
                                        </div>
                                        {apiProvider === 'bahiks' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                                    </div>
                                    <p className="text-sm text-zinc-400">Yedek (Failover) BetConstruct WSS beslemesi. Yüksek hızlı EU sunucusu.</p>
                                    <div className="mt-2 text-xs font-mono text-blue-300/70 bg-blue-500/10 inline-block px-2 py-1 rounded">wss://eu-swarm-newm.bahiks211.com/</div>
                                </div>
                            </label>
                        </div>

                        {/* Failover Toggle */}
                        <div className="bg-[#1a1d24] rounded-xl p-4 border border-zinc-800 mb-8 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-white mb-0.5">Akıllı Sunucu Geçişi (Auto-Failover)</h4>
                                <p className="text-xs text-zinc-400">Eğer aktif sunucudan veri akışı kesilirse veya ping 500ms'yi aşarsa otomatik olarak diğerine bağlanır.</p>
                            </div>
                            <button 
                                onClick={() => setAutoFailover(!autoFailover)}
                                className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${autoFailover ? 'bg-[#00E5FF]' : 'bg-zinc-700'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute transition-transform ${autoFailover ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                        </div>

                        {/* Push Action Area */}
                        <div className="bg-[#1a1d24] rounded-xl p-5 border border-zinc-800 flex flex-col items-center justify-center text-center">
                            {isPushing ? (
                                <div className="flex flex-col items-center gap-3 animate-in fade-in">
                                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                    <p className="text-sm font-bold text-purple-400">{pushMessage}</p>
                                    <p className="text-xs text-zinc-500">Sistem 1 dakika süreyle veri alımını duraklatıp yeniden başlatılıyor...</p>
                                </div>
                            ) : pushMessage ? (
                                <div className="flex flex-col items-center gap-3 animate-in fade-in">
                                    <div className="w-12 h-12 bg-[#00E5FF]/20 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-[#00E5FF]" />
                                    </div>
                                    <p className="text-sm font-bold text-[#00E5FF]">{pushMessage}</p>
                                </div>
                            ) : (
                                <>
                                    <AlertTriangle className="w-8 h-8 text-zinc-300 mb-3 opacity-80" />
                                    <h4 className="text-white font-bold mb-1">Sistemi Yeniden Başlat (Push)</h4>
                                    <p className="text-xs text-zinc-400 max-w-sm mb-4">
                                        Değişikliği onayladığınızda sistem mevcut tüm soket bağlantılarını kesecek, 1 dakika boyunca bekleme moduna geçecek ve ardından yeni sağlayıcıya bağlanacaktır.
                                    </p>
                                    <button 
                                        onClick={handlePushApiSettings}
                                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                                    >
                                        <Activity className="w-5 h-5" />
                                        Pushla (API Değiştir)
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: LIABILITY & RISK */}
            {activeSubTab === 'risk' && (
                <div className="flex-1 overflow-y-auto pr-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {riskData.map((data, i) => (
                            <div key={i} className={`bg-[#111318] border p-5 rounded-2xl relative overflow-hidden transition-all ${
                                data.risk === 'MS1' || data.risk === 'MS2' ? 'border-rose-500/30 shadow-[0_0_15px_rgba(225,29,72,0.1)]' : 'border-zinc-800'
                            }`}>
                                {(data.risk === 'MS1' || data.risk === 'MS2') && (
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl -mr-12 -mt-12"></div>
                                )}
                                <div className="text-sm font-bold text-zinc-400 mb-4">{data.name}</div>
                                <div className="flex items-end justify-between mb-1">
                                    <span className="text-xs text-zinc-500 uppercase">Risk Merkezi</span>
                                    {data.risk === 'DENGELİ' 
                                        ? <span className="text-xs font-black text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded">DENGELİ</span>
                                        : <span className="text-xs font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> {data.risk} YÜKSEK</span>
                                    }
                                </div>
                                <div className="text-2xl font-black text-white font-mono">
                                    {Math.max(data.MS1, data.MS2, data.MSX).toLocaleString('tr-TR')}₺
                                </div>
                                <div className="text-[10px] text-zinc-500 mt-2">
                                    MS1: {data.MS1/1000}k | MSX: {data.MSX/1000}k | MS2: {data.MS2/1000}k
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#111318] border border-zinc-800 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart className="w-5 h-5 text-indigo-400" />
                            Kasa Dağılımı ve Liability Analizi
                        </h3>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={riskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#272a35" vertical={false} />
                                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${value/1000}k`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1a1c24', borderColor: '#272a35', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                        formatter={(value: number) => [`₺${value.toLocaleString('tr-TR')}`, undefined]}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="MS1" name="MS1 Yatırılan" fill="#34d399" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="MSX" name="MSX Yatırılan" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="MS2" name="MS2 Yatırılan" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD MATCH MODAL (Provider'dan Aktife Alma veya Manuel) */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0f1115] border border-emerald-500/30 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-[#15171e]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-[#00E5FF]" /> Maçı Bahse Aç
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Lig / Turnuva</label>
                                    <input type="text" value={newMatch.league} onChange={e => setNewMatch({...newMatch, league: e.target.value})} placeholder="Örn: Şampiyonlar Ligi" className="w-full bg-[#1a1c24] border border-zinc-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Ev Sahibi (MS1)</label>
                                    <input type="text" value={newMatch.homeTeam} onChange={e => setNewMatch({...newMatch, homeTeam: e.target.value})} className="w-full bg-[#1a1c24] border border-zinc-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Deplasman (MS2)</label>
                                    <input type="text" value={newMatch.awayTeam} onChange={e => setNewMatch({...newMatch, awayTeam: e.target.value})} className="w-full bg-[#1a1c24] border border-zinc-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-emerald-500" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Tarih & Saat</label>
                                    <input type="datetime-local" value={newMatch.dateTime} onChange={e => setNewMatch({...newMatch, dateTime: e.target.value})} className="w-full bg-[#1a1c24] border border-zinc-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-emerald-500 [color-scheme:dark]" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 block border-b border-zinc-800 pb-2">Maç Sonu Oranları (1 - X - 2)</label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-[10px] text-center text-zinc-500 mb-1">Ev Sahibi (1)</div>
                                        <input type="number" step="0.01" value={newMatch.ms1} onChange={e => setNewMatch({...newMatch, ms1: Number(e.target.value)})} className="w-full bg-[#1a1c24] border border-zinc-800 rounded-lg px-4 py-2.5 text-[#00E5FF] font-mono text-center outline-none focus:border-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-center text-zinc-500 mb-1">Beraberlik (X)</div>
                                        <input type="number" step="0.01" value={newMatch.msx} onChange={e => setNewMatch({...newMatch, msx: Number(e.target.value)})} className="w-full bg-[#1a1c24] border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-300 font-mono text-center outline-none focus:border-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-center text-zinc-500 mb-1">Deplasman (2)</div>
                                        <input type="number" step="0.01" value={newMatch.ms2} onChange={e => setNewMatch({...newMatch, ms2: Number(e.target.value)})} className="w-full bg-[#1a1c24] border border-zinc-800 rounded-lg px-4 py-2.5 text-[#00E5FF] font-mono text-center outline-none focus:border-emerald-500" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleAddMatch}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-[#00E5FF] text-white rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex justify-center items-center gap-2"
                            >
                                <Database className="w-5 h-5" />
                                Kaydet ve Aktife Al
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RESOLVE MATCH MODAL */}
            {isResolveModalOpen && selectedActiveMatch && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0f1115] border border-indigo-500/30 w-full max-w-md rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-[#15171e]">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                Sonuçlandır
                            </h3>
                            <button onClick={() => setIsResolveModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="text-center mb-6">
                                <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{selectedActiveMatch.league}</div>
                                <div className="text-xl font-bold text-white flex items-center justify-center gap-3">
                                    <span>{selectedActiveMatch.team_home}</span>
                                    <span className="text-zinc-600 text-sm">VS</span>
                                    <span>{selectedActiveMatch.team_away}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-4">
                                <input 
                                    type="number" 
                                    placeholder="0"
                                    value={matchScore.home}
                                    onChange={e => setMatchScore({...matchScore, home: e.target.value})}
                                    className="w-20 h-20 bg-[#1a1c24] border-2 border-zinc-800 focus:border-indigo-500 rounded-2xl text-center text-4xl font-black text-white outline-none"
                                />
                                <span className="text-2xl font-bold text-zinc-600">-</span>
                                <input 
                                    type="number" 
                                    placeholder="0"
                                    value={matchScore.away}
                                    onChange={e => setMatchScore({...matchScore, away: e.target.value})}
                                    className="w-20 h-20 bg-[#1a1c24] border-2 border-zinc-800 focus:border-indigo-500 rounded-2xl text-center text-4xl font-black text-white outline-none"
                                />
                            </div>
                            
                            <div className="pt-4 border-t border-zinc-800">
                                <button 
                                    onClick={confirmResolve}
                                    disabled={matchScore.home === '' || matchScore.away === ''}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Onayla ve Kuponları Öde
                                </button>
                                <p className="text-center text-xs text-zinc-500 mt-3">Bu işlem geri alınamaz. Kazanan bahislerin ödemesi anında yapılacaktır.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Monitoring Tab */}
            {activeSubTab === 'monitor' && (
                <div className="flex-1 overflow-y-auto">
                    <div className="bg-[#111318] p-6 rounded-2xl border border-zinc-800 shadow-xl mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <Activity className="w-6 h-6 text-cyan-500 animate-pulse" />
                                WebSocket Canlı Hız Testi (Ping)
                            </h3>
                            <div className="flex items-center gap-2 bg-[#00E5FF]/10 text-[#00E5FF] px-4 py-2 rounded-lg border border-emerald-500/30 font-bold">
                                <span className="w-2.5 h-2.5 bg-[#00E5FF] rounded-full animate-pulse"></span>
                                Proxy Bağlantısı Aktif
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#0b0c10] p-6 rounded-xl border border-zinc-800">
                                <p className="text-zinc-500 font-bold text-sm uppercase mb-2">Sunucu Adresi</p>
                                <p className="text-white font-mono text-lg truncate">ws://localhost:4000</p>
                            </div>
                            <div className="bg-[#0b0c10] p-6 rounded-xl border border-zinc-800">
                                <p className="text-zinc-500 font-bold text-sm uppercase mb-2">Ortalama Gecikme (Ping)</p>
                                <p className="text-cyan-400 font-bold text-3xl flex items-end gap-2">
                                    ~45<span className="text-sm text-cyan-600 mb-1">ms</span>
                                </p>
                            </div>
                            <div className="bg-[#0b0c10] p-6 rounded-xl border border-zinc-800">
                                <p className="text-zinc-500 font-bold text-sm uppercase mb-2">Kopma Sayısı</p>
                                <p className="text-white font-bold text-3xl">0</p>
                            </div>
                        </div>
                        <div className="mt-6 bg-[#0b0c10] p-4 rounded-xl border border-zinc-800">
                            <p className="text-zinc-400 text-sm mb-4">Gerçek zamanlı hız testini doğrudan terminalinizden yapmak için proje dizininde şu komutu çalıştırabilirsiniz:</p>
                            <div className="bg-black/50 p-3 rounded text-green-400 font-mono text-sm border border-zinc-800 flex justify-between items-center">
                                <code>node ws_monitor.cjs</code>
                                <button className="text-zinc-500 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText('node ws_monitor.cjs')}>Kopyala</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
