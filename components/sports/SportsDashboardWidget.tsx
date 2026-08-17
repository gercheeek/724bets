import React, { useState } from 'react';
import { Flame, Target, CalendarDays, ChevronLeft, ChevronRight, Activity, Zap } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { useBetting } from '../../contexts/BettingContext';
import teamLogosData from '../../utils/team_logos.json';

const teamLogos: Record<string, string> = teamLogosData;

export default function SportsDashboardWidget({ matches = [], onSelectMatch }: { matches?: any[], onSelectMatch?: (m: any) => void }) {
    const { addSelection, setBetAmount } = useBetSlip();
    const { outrights = [] } = useBetting();
    
    // Quick Amount logic
    const [comboAmount, setComboAmount] = useState<number>(10);
    const [eventAmount, setEventAmount] = useState<number>(10);

    const amounts = [10, 50, 100, 500];

    // Hot Combos Dynamic Logic
    const hotComboMatches = React.useMemo(() => {
        if (!matches || matches.length === 0) return [];
        const upcoming = matches.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-');
        const sorted = upcoming.sort((a, b) => parseFloat(a.homeOdd) - parseFloat(b.homeOdd));
        const ideal = sorted.filter(m => parseFloat(m.homeOdd) >= 1.30 && parseFloat(m.homeOdd) <= 2.50);
        
        if (ideal.length >= 3) {
            return ideal.slice(0, 3);
        } else {
            return sorted.slice(0, 3);
        }
    }, [matches]);

    // Top Event Dynamic Logic
    const topEventMatch = React.useMemo(() => {
        if (!matches || matches.length === 0) return null;

        const validMatches = matches.filter(m => m.homeOdd && m.homeOdd !== '-' && m.drawOdd && m.drawOdd !== '-' && m.awayOdd && m.awayOdd !== '-');
        if (validMatches.length === 0) return null;

        const normalizeName = (name: string) => name ? name.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '') : '';
        const hasLogo = (name: string) => !!teamLogos[normalizeName(name)] || !!teamLogos[name ? name.toLowerCase() : ''];

        const validMatchesWithLogos = validMatches.filter(m => 
            (m.homeLogo && m.awayLogo) || (hasLogo(m.home) && hasLogo(m.away))
        );

        const isTurkishMatch = (m: any) => {
            const country = (m.country || '').trim().toLowerCase();
            const league = (m.league || '').trim().toLowerCase();
            return country === 'turkey' || country === 'türkiye' || 
                   league === 'turkey' || league === 'türkiye' || 
                   league === 'süper lig' || league === 'trendyol süper lig' || 
                   league === 'super lig' || league === 'tff 1. lig' || league === '1. lig';
        };

        // 1. Logolu Türk Maçı (Canlı)
        const turkishLiveLogo = validMatchesWithLogos.filter(m => m.isLive && isTurkishMatch(m));
        if (turkishLiveLogo.length > 0) return turkishLiveLogo[0];

        // 2. Logolu Türk Maçı (Yaklaşan)
        const turkishUpcomingLogo = validMatchesWithLogos.filter(m => !m.isLive && isTurkishMatch(m));
        if (turkishUpcomingLogo.length > 0) return turkishUpcomingLogo[0];

        // 3. Logolu Herhangi Bir Maç (Canlı)
        const liveLogo = validMatchesWithLogos.filter(m => m.isLive);
        if (liveLogo.length > 0) return liveLogo[0];

        // 4. Logolu Herhangi Bir Maç (Yaklaşan)
        const upcomingLogo = validMatchesWithLogos.filter(m => !m.isLive);
        if (upcomingLogo.length > 0) return upcomingLogo[0];

        // 5. Hiçbir maçta logo yoksa kuralları gevşet
        const turkishLive = validMatches.filter(m => m.isLive && isTurkishMatch(m));
        if (turkishLive.length > 0) return turkishLive[0];

        const turkishUpcoming = validMatches.filter(m => !m.isLive && isTurkishMatch(m));
        if (turkishUpcoming.length > 0) return turkishUpcoming[0];

        const liveAny = validMatches.filter(m => m.isLive);
        if (liveAny.length > 0) return liveAny[0];
        
        const upcomingAny = validMatches.filter(m => !m.isLive);
        return upcomingAny[0] || null;
    }, [matches]);

    // Triple Combo Dynamic Logic
    const tripleComboMatches = React.useMemo(() => {
        if (!matches || matches.length === 0) return [];
        const upcoming = matches.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-' && parseFloat(m.homeOdd) > 1.10 && parseFloat(m.homeOdd) <= 1.60);
        return upcoming.sort((a, b) => parseFloat(a.homeOdd) - parseFloat(b.homeOdd)).slice(0, 3);
    }, [matches]);
    
    const tripleComboTotalOdd = tripleComboMatches.reduce((acc, m) => acc * parseFloat(m.homeOdd), 1);
    const rawTotalOdd = hotComboMatches.reduce((acc, m) => acc * parseFloat(m.homeOdd), 1);
    const boostedTotalOdd = rawTotalOdd * 1.15;

    const handlePlayHotCombo = () => {
        hotComboMatches.forEach((m, idx) => {
            addSelection({ 
                id: m.id || `hc_${idx}`, 
                matchId: m.id || `hc_${idx}`, 
                matchName: `${m.home} vs ${m.away}`, 
                selectionName: 'Maç Sonucu: 1', 
                odd: parseFloat(m.homeOdd) 
            });
        });
        window.dispatchEvent(new CustomEvent('open-betslip'));
    };

    const [outrightIndex, setOutrightIndex] = useState(0);

    const activeOutrightsData = React.useMemo(() => {
        if (!outrights || outrights.length === 0) return [];
        return outrights;
    }, [outrights]);

    const outrigtTabs = ["Futbol", "Basketbol", "Tenis", "Buz Hokeyi"];
    const [activeTab, setActiveTab] = useState("Futbol");

    const currentOutright = activeOutrightsData[outrightIndex] || null;

    const handleNextLeague = () => {
        if (activeOutrightsData.length === 0) return;
        setOutrightIndex((prev) => (prev + 1) % activeOutrightsData.length);
    };

    const handlePrevLeague = () => {
        if (activeOutrightsData.length === 0) return;
        setOutrightIndex((prev) => (prev - 1 + activeOutrightsData.length) % activeOutrightsData.length);
    };

    const handlePlayTripleCombo = () => {
        if (tripleComboMatches.length === 0) return;
        tripleComboMatches.forEach((m, idx) => {
            addSelection({ 
                id: m.id || `tc_${idx}`, 
                matchId: m.id || `tc_${idx}`, 
                matchName: `${m.home} vs ${m.away}`, 
                selectionName: 'Maç Sonucu: 1', 
                odd: parseFloat(m.homeOdd) 
            });
        });
        window.dispatchEvent(new CustomEvent('open-betslip'));
    };

    const getFallbackLogo = (name: string, url?: string) => {
        if (url && url !== '') return url;
        if (!name) return `https://ui-avatars.com/api/?name=?&background=121626&color=fff&rounded=true&bold=true&size=64`;
        
        const normalized = name.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
        if (teamLogos[normalized]) return teamLogos[normalized];
        if (teamLogos[name.toLowerCase()]) return teamLogos[name.toLowerCase()];
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=121626&color=fff&rounded=true&bold=true&size=64`;
    };

    return (
        <div className="flex flex-col gap-6 w-full h-full bg-sports-main rounded-sports-card p-4">
            {/* 3 COLUMNS SECTION */}
            <div className="w-full flex flex-col xl:flex-row gap-5">
                
                {/* COLUMN 1: Hot Combos */}
                <div className="flex-1 min-w-[280px] flex flex-col h-full bg-transparent">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="w-5 h-5 text-red-500" fill="currentColor" />
                        <h2 className="text-white text-lg font-bold tracking-wide">Popüler Kombineler</h2>
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                        {hotComboMatches.length === 0 ? (
                            <div className="flex items-center justify-center h-32 bg-sports-card border-sports-subtle rounded-sports-card text-zinc-500 font-bold text-sm">
                                Uygun kombine bulunamadı.
                            </div>
                        ) : (
                            hotComboMatches.map((m, idx) => (
                                <div key={m.id || idx} className="bg-sports-card rounded-sports-card p-3 relative overflow-hidden group cursor-pointer bg-sports-hover transition-colors border-sports-subtle" onClick={() => onSelectMatch && onSelectMatch(m)}>
                                    <div className="flex justify-between items-start pl-2">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                                                <Activity className="w-3.5 h-3.5" />
                                                <span className="text-xs font-bold text-white truncate max-w-[150px]">{m.home}</span>
                                            </div>
                                            <span className="text-[11px] text-zinc-400 font-medium truncate max-w-[150px]">{m.home} vs {m.away}</span>
                                            <span className="text-[10px] text-zinc-500 font-bold mt-1 uppercase">1x2</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-zinc-400 font-medium mb-1">{m.startTime || 'Tomorrow, 03:00'}</span>
                                            <span className="text-white font-bold text-[15px] mt-2">{m.homeOdd}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Combo Boost Badge */}
                    <div className="border border-sports-accent bg-sports-card rounded-sports-card p-2 flex justify-between items-center mb-3 relative overflow-hidden">
                        <span className="text-white text-xs font-bold z-10">x1.15 Ekstra Oran</span>
                        <span className="bg-sports-accent px-2 py-0.5 rounded-sports-pill text-[9px] uppercase absolute right-0 top-0 rounded-bl-sm z-10">COMBOBOOST</span>
                    </div>

                    {/* Amount Input */}
                    <div className="flex bg-sports-card border-sports-subtle rounded-sports-pill h-10 w-full mb-3 overflow-hidden transition-colors focus-within:border-sports-accent">
                        <input 
                            type="number" 
                            value={comboAmount || ''}
                            onChange={(e) => setComboAmount(Number(e.target.value))}
                            className="w-full bg-transparent text-white px-3 outline-none font-bold text-sm text-right"
                        />
                        <div className="flex items-center text-zinc-400 font-bold pr-3 pl-1 text-sm">₺</div>
                    </div>

                    {/* Quick Amounts */}
                    <div className="flex gap-2 mb-4">
                        {amounts.map(amt => (
                            <button
                                key={amt}
                                onClick={() => setComboAmount(amt)}
                                className={`flex-1 h-9 rounded-sports-pill font-bold text-sm transition-colors ${
                                    comboAmount === amt 
                                    ? 'bg-sports-accent' 
                                    : 'bg-sports-card text-white bg-sports-hover'
                                }`}
                            >
                                {amt}
                            </button>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-zinc-400 text-xs font-bold">Toplam Oran</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                            <span className="text-zinc-500 line-through">{rawTotalOdd.toFixed(3)}</span>
                            <span className="text-sports-accent">{boostedTotalOdd.toFixed(3)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-zinc-400 text-xs font-bold">Olası Kazanç</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                            <span className="text-zinc-500 line-through">{(comboAmount * rawTotalOdd).toFixed(2)} ₺</span>
                            <span className="text-white">{(comboAmount * boostedTotalOdd).toFixed(2)} ₺</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button onClick={handlePlayHotCombo} className="w-full h-11 bg-sports-card bg-sports-hover border-sports-subtle text-zinc-400 hover:text-white rounded-sports-pill font-bold text-sm transition-colors uppercase tracking-wide">
                        BAHİS YAP
                    </button>
                </div>

                {/* COLUMN 2: Top Events */}
                <div className="flex-[1.2] min-w-[320px] flex flex-col h-full bg-transparent">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-sports-accent" />
                        <h2 className="text-white text-lg font-bold tracking-wide">Öne Çıkan Maçlar</h2>
                    </div>

                    <div className="bg-sports-card border-sports-subtle rounded-sports-card p-4 flex flex-col mb-4 h-full">
                        {!topEventMatch ? (
                            <div className="flex flex-col items-center justify-center h-48 text-zinc-500 text-sm font-bold">
                                Şu an öne çıkan maç bulunmuyor.
                            </div>
                        ) : (
                            <>
                                {/* Top Info */}
                                <div className="flex justify-between items-center mb-6 text-xs font-medium text-zinc-400">
                                    <div className="flex items-center gap-1.5">
                                        <Activity className="w-3.5 h-3.5" />
                                        <span>{topEventMatch.country ? `${topEventMatch.country} • ` : ''}{topEventMatch.league}</span>
                                    </div>
                                    <div className={`flex items-center gap-1.5 ${topEventMatch.isLive ? 'text-red-500' : 'text-zinc-500'} font-bold`}>
                                        {topEventMatch.isLive && <Activity className="w-3 h-3 animate-pulse" />}
                                        <span>{topEventMatch.isLive ? topEventMatch.minute || 'Live' : topEventMatch.startTime}</span>
                                    </div>
                                </div>

                                {/* Scoreboard: Two Large Blocks matching screenshot */}
                                <div className="flex gap-2 mb-6">
                                    <div className="flex-1 bg-[#222428] rounded-sports-card p-4 flex flex-col items-center justify-center min-h-[140px] text-center border-sports-subtle">
                                        <img src={getFallbackLogo(topEventMatch.home, topEventMatch.homeLogo)} alt={topEventMatch.home} className="w-12 h-12 mb-3 rounded-full object-contain" />
                                        <span className="text-white font-bold text-sm leading-tight mb-2">{topEventMatch.home}</span>
                                        {topEventMatch.isLive && (
                                            <span className="text-2xl font-black text-white">{String(topEventMatch.score || '-').split(' - ')[0] || '0'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 bg-[#222428] rounded-sports-card p-4 flex flex-col items-center justify-center min-h-[140px] text-center border-sports-subtle">
                                        <img src={getFallbackLogo(topEventMatch.away, topEventMatch.awayLogo)} alt={topEventMatch.away} className="w-12 h-12 mb-3 rounded-full object-contain" />
                                        <span className="text-white font-bold text-sm leading-tight mb-2">{topEventMatch.away}</span>
                                        {topEventMatch.isLive && (
                                            <span className="text-2xl font-black text-white">{String(topEventMatch.score || '-').split(' - ')[1] || '0'}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold mb-2">
                                    <span className="uppercase tracking-wider">1X2</span>
                                    <span 
                                        onClick={() => onSelectMatch && onSelectMatch(topEventMatch)}
                                        className="cursor-pointer hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        Maça Git <ChevronRight className="w-3 h-3" />
                                    </span>
                                </div>
                                
                                {/* 1 X 2 Pills */}
                                <div className="flex items-center gap-1.5 w-full mb-4">
                                  {[{id: topEventMatch.homeId, name: '1', odd: topEventMatch.homeOdd}, 
                                    {id: topEventMatch.drawId, name: 'X', odd: topEventMatch.drawOdd}, 
                                    {id: topEventMatch.awayId, name: '2', odd: topEventMatch.awayOdd}].map((btn) => (
                                      <button
                                        key={btn.id || btn.name}
                                        onClick={() => btn.odd && btn.odd !== '-' && addSelection({ id: btn.id || `${topEventMatch.id}_${btn.name}`, matchId: topEventMatch.id, matchName: `${topEventMatch.home} vs ${topEventMatch.away}`, selectionName: `Maç Sonucu: ${btn.name}`, odd: parseFloat(btn.odd) })}
                                        className={`flex-1 flex flex-row items-center justify-between px-3 py-2 rounded-sports-pill transition-all border border-transparent ${
                                          btn.odd && btn.odd !== '-'
                                              ? 'bg-[#222428] hover:bg-[#2a2d33] text-white border-sports-subtle'
                                              : 'bg-[#1a1c21] text-zinc-600 cursor-not-allowed border-sports-subtle'
                                        }`}
                                      >
                                        <span className={`text-[12px] font-medium text-zinc-400`}>{btn.name}</span>
                                        <div className="font-bold text-[13px]">{btn.odd && btn.odd !== '-' ? btn.odd : '-'}</div>
                                      </button>
                                  ))}
                                </div>

                                {/* Amount Input */}
                                <div className="flex bg-[#131517] rounded-sports-pill border-sports-subtle h-10 w-full mb-3 overflow-hidden focus-within:border-sports-accent transition-colors">
                                    <input 
                                        type="number" 
                                        value={eventAmount || ''}
                                        onChange={(e) => setEventAmount(Number(e.target.value))}
                                        className="w-full bg-transparent text-white px-3 outline-none font-bold text-sm text-right"
                                    />
                                    <div className="flex items-center text-zinc-400 font-bold pr-3 pl-1 text-sm">₺</div>
                                </div>

                                {/* Quick Amounts */}
                                <div className="flex gap-2 mb-4">
                                    {amounts.map(amt => (
                                        <button
                                            key={amt}
                                            onClick={() => setEventAmount(amt)}
                                            className={`flex-1 h-9 rounded-sports-pill font-bold text-sm transition-colors ${
                                                eventAmount === amt 
                                                ? 'bg-sports-accent' 
                                                : 'bg-[#131517] text-white hover:bg-[#1a1c21] border-sports-subtle border'
                                            }`}
                                        >
                                            {amt}
                                        </button>
                                    ))}
                                </div>

                                {/* Potential Win */}
                                <div className="flex justify-between items-center mb-auto pt-2">
                                    <span className="text-zinc-400 text-xs font-bold">Olası Kazanç</span>
                                    <span className="text-white text-xs font-bold">{(eventAmount * (parseFloat(topEventMatch.homeOdd) || 1)).toFixed(2)} ₺</span>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                                    <button className="w-11 h-11 bg-[#131517] text-zinc-500 rounded-sports-pill flex items-center justify-center bg-sports-hover transition-colors border-sports-subtle border">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            addSelection({ id: topEventMatch.homeId || topEventMatch.id+'_1', matchId: topEventMatch.id, matchName: `${topEventMatch.home} vs ${topEventMatch.away}`, selectionName: 'Maç Sonucu: 1', odd: parseFloat(topEventMatch.homeOdd) || 1 });
                                            window.dispatchEvent(new CustomEvent('open-betslip'));
                                        }}
                                        className="flex-1 h-11 bg-[#131517] border border-sports-subtle text-zinc-400 rounded-sports-pill font-bold text-sm bg-sports-hover hover:text-white transition-colors uppercase tracking-wide"
                                    >
                                        BAHİS YAP
                                    </button>
                                    <button className="w-11 h-11 bg-[#131517] text-zinc-500 rounded-sports-pill flex items-center justify-center bg-sports-hover transition-colors border-sports-subtle border">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* COLUMN 3: Top Outrights */}
                <div className="flex-1 min-w-[280px] flex flex-col h-full bg-transparent">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-white text-lg font-bold tracking-wide">Uzun Vadeli Bahisler</h2>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-3">
                        {outrigtTabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-sports-pill text-[13px] font-bold whitespace-nowrap transition-colors border border-transparent ${
                                    activeTab === tab
                                    ? 'bg-sports-accent'
                                    : 'bg-sports-card text-white bg-sports-hover border-sports-subtle'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {currentOutright ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <button 
                                    onClick={handlePrevLeague}
                                    className="w-7 h-7 bg-sports-card rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors border-sports-subtle border"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <div className="flex flex-col items-center flex-1 mx-2 text-center overflow-hidden">
                                    <span className="text-white font-bold text-[14px] truncate w-full">{currentOutright.competition}</span>
                                    <span className="text-zinc-300 font-semibold text-[12px] mt-0.5">{currentOutright.market_name}</span>
                                    <span className="text-sports-accent font-medium text-[10px] mt-1 uppercase tracking-wider">
                                        Kapanış: {currentOutright.closes_at ? new Date(currentOutright.closes_at * 1000).toLocaleString() : 'Belirsiz'}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleNextLeague}
                                    className="w-7 h-7 bg-sports-card rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors border-sports-subtle border"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto max-h-[420px] custom-scrollbar pr-1">
                                {currentOutright.participants && currentOutright.participants.slice(0, 15).map((item: any, i: number) => (
                                    <div 
                                        key={i} 
                                        onClick={() => addSelection({ 
                                            id: item.id, 
                                            matchId: currentOutright.id, 
                                            matchName: `${currentOutright.competition} - ${currentOutright.market_name}`, 
                                            selectionName: item.name, 
                                            odd: item.price 
                                        })}
                                        className="flex justify-between items-center bg-sports-card border-sports-subtle border rounded-sports-pill px-4 py-2.5 cursor-pointer bg-sports-hover transition-colors group"
                                    >
                                        <span className="text-zinc-300 text-[13px] font-semibold">{item.name}</span>
                                        <span className="text-white text-[13px] font-bold group-hover:text-sports-accent transition-colors">{item.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-4">
                                <span className="cursor-pointer text-zinc-500 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-colors">
                                    Tüm Bahisleri Gör <ChevronRight className="w-3 h-3" />
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <CalendarDays className="w-10 h-10 text-zinc-600 mb-3" />
                            <span className="text-zinc-500 text-sm font-bold">Şu an aktif uzun vadeli bahis bulunamadı.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* TRIPLE COMBO SECTION */}
            <div className="w-full flex flex-col md:flex-row bg-sports-card rounded-sports-card overflow-hidden border border-sports-subtle">
                {/* Left Panel */}
                <div className="w-full md:w-[35%] bg-gradient-to-br from-[#1a1c21] to-[#131517] p-6 flex flex-col justify-between border-r border-sports-subtle">
                    <div>
                        <div className="inline-flex items-center gap-1.5 mb-4 border border-[#FF4500]/20 bg-[#FF4500]/10 px-3 py-1.5 rounded-sports-pill">
                            <Flame className="w-3.5 h-3.5 text-[#FF4500]" />
                            <span className="text-[#FF4500] font-bold text-[10px] tracking-widest uppercase">Günün Bankosu</span>
                        </div>
                        <h3 className="font-black uppercase leading-[1] text-[32px] md:text-[38px] tracking-tight mb-6">
                            <span className="text-white block">ÜÇLÜ</span>
                            <span className="text-sports-accent block">KOMBİNE</span>
                        </h3>
                    </div>
                    
                    <div>
                        <div className="flex flex-col mb-4">
                            <span className="text-zinc-500 font-medium text-[10px] uppercase tracking-widest mb-1">Toplam Oran</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sports-accent font-bold text-xl">x</span>
                                <span className="text-white font-black text-4xl">{tripleComboTotalOdd.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handlePlayTripleCombo}
                            className="w-full h-12 rounded-sports-pill bg-sports-accent font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                        >
                            KUPONU OYNA <Zap className="w-4 h-4" fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-[65%] p-4 flex flex-col gap-2 bg-transparent">
                    {tripleComboMatches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-sm font-bold p-8">
                            Şu an kombine için uygun maç bulunamadı.
                        </div>
                    ) : (
                        tripleComboMatches.map((m, idx) => (
                            <div key={m.id || idx} className="flex items-center justify-between p-4 rounded-sports-card bg-[#131517] border border-sports-subtle">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-white font-bold text-[15px]">{m.home}</span>
                                        <span className="text-zinc-600 font-medium text-[10px]">vs</span>
                                        <span className="text-white font-bold text-[15px]">{m.away}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-zinc-500 font-medium text-[10px] uppercase tracking-wider">{m.league}</span>
                                        <span className="text-zinc-600 text-[10px]">•</span>
                                        <span className="text-zinc-500 font-medium text-[10px]">{m.startTime}</span>
                                    </div>
                                </div>
                                <div className="bg-[#1a1c21] border border-sports-subtle rounded-sports-pill px-4 py-2 flex flex-col items-center min-w-[70px]">
                                    <span className="text-zinc-500 font-medium text-[10px] mb-0.5">MS 1</span>
                                    <span className="text-white font-bold text-[15px]">{m.homeOdd}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}
