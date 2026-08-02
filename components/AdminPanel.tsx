import React, { useState, useEffect } from 'react';
import { X, Settings, Bot, Activity, Save, Trophy, TrendingUp, ShieldCheck, Globe, Monitor, Users, ShieldAlert, Gift, Network, Lock, ArrowDownToLine, Gamepad2, MessageSquare, Wallet, Target, ChevronDown, ChevronRight } from 'lucide-react';
import AdminLuckyWheelTab from './AdminLuckyWheelTab';
import AdminMembersTab from './AdminMembersTab';
import AdminRiskTab from './AdminRiskTab';
import AdminLiveRadarTab from './AdminLiveRadarTab';
import AdminMarketingTab from './AdminMarketingTab';
import AdminWithdrawalsTab from './AdminWithdrawalsTab';
import AdminAuditLogsTab from './AdminAuditLogsTab';
import AdminSportsTab from './AdminSportsTab';
import AdminOddsEngineTab from './AdminOddsEngineTab';
import AdminTVTab from './AdminTVTab';
import AdminDashboardTab from './AdminDashboardTab';
import AdminWhaleTab from './AdminWhaleTab';
import AdminLiquidityTab from './AdminLiquidityTab';
import AdminProviderTab from './AdminProviderTab';
import AdminCommunityTab from './AdminCommunityTab';
import AdminKralTab from './AdminKralTab';
import { LuckyWheelConfig } from '../types';

interface AdminPanelProps {
    luckyWheelConfig?: LuckyWheelConfig;
    onSaveLuckyWheelConfig?: (cfg: LuckyWheelConfig) => void;
    onClose: () => void;
    onNavigateHome?: () => void;
}

export default function AdminPanel(props: AdminPanelProps) {
    const { onClose, onNavigateHome } = props;
    const [config, setConfig] = useState({
        isActive: true,
        speedMin: 15000,
        speedMax: 45000,
        sloppyRate: 0.7,
        emojiRate: 0.4
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'bot' | 'luckywheel' | 'members' | 'risk' | 'radar' | 'marketing' | 'withdrawals' | 'deposits' | 'audit' | 'sports' | 'tv' | 'whale' | 'liquidity' | 'provider' | 'community' | 'kral' | 'odds'>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [expandedGroups, setExpandedGroups] = useState<string[]>(['CASINO YÖNETİMİ', 'PAZARLAMA & BONUS', 'SPOR YÖNETİMİ', 'GÜVENLİK & FRAUD', 'FİNANS & MÜŞTERİ', 'SİSTEM', 'DİĞER']);
    const toggleGroup = (group: string) => setExpandedGroups(prev => prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]);

    // RBAC: Rol Bazlı Yetki Yönetimi
    const currentAdminRole = 'SUPER_ADMIN'; // test için 'SUPPORT' da yapılabilir.

    useEffect(() => {
        // Fetch current config from bot API
        fetch('http://localhost:3001/api/bot-config')
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Hatası:", err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch('http://localhost:3001/api/bot-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            setTimeout(() => setSaving(false), 500);
        } catch (err) {
            console.error("API Kaydetme Hatası:", err);
            setSaving(false);
        }
    };

    const handleGoToSite = () => {
        if (onNavigateHome) {
            onNavigateHome();
        }
        onClose();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full h-full min-h-[100dvh] flex flex-col bg-[#050608] overflow-hidden font-sans text-slate-300 relative z-[100]">
                
                {/* Header */}
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-800 flex flex-wrap md:flex-nowrap justify-between items-center bg-[#15171e] gap-3">
                    <div className="flex items-center gap-2 md:gap-3">
                        <button 
                            className="md:hidden p-2 bg-white/5 rounded-lg text-white"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Monitor className="w-5 h-5" />
                        </button>
                        <div className="p-1.5 md:p-2 bg-emerald-500/20 rounded-lg">
                            <Settings className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-white hidden sm:block">Yönetim Paneli</h2>
                        
                        <button 
                            onClick={() => { setActiveTab('kral'); setIsSidebarOpen(false); }} 
                            className={`ml-1 md:ml-4 px-3 md:px-4 py-1.5 rounded-xl font-black italic tracking-widest text-[10px] md:text-sm transition-all flex items-center gap-1.5 md:gap-2 shadow-lg hover:-translate-y-0.5 ${activeTab === 'kral' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'bg-[#1e2330] hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500'}`}
                        >
                            👑 <span className="hidden sm:inline">KRAL</span>
                        </button>

                        <button 
                            onClick={handleGoToSite} 
                            className="ml-2 md:ml-3 px-2.5 md:px-3.5 py-1.5 bg-[#1e2330] hover:bg-emerald-500/20 border border-[#2b3548] hover:border-emerald-500/40 text-slate-200 hover:text-emerald-400 rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center gap-1.5 md:gap-2 shadow-sm group cursor-pointer"
                            title="Siteye Git / Paneli Kapat"
                        >
                            <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                            <span className="hidden sm:inline">Siteye Git</span>
                        </button>
                    </div>
                    <button onClick={onClose} className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white ml-auto">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden relative">
                    
                    {/* Pro Sidebar Navigation */}
                    {/* Mobile Overlay */}
                    {isSidebarOpen && (
                        <div 
                            className="absolute inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        ></div>
                    )}
                    
                    <div className={`absolute md:relative z-50 h-full w-56 bg-[#090a0f] border-r border-white/5 p-3 flex flex-col gap-1 overflow-y-auto shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] custom-scrollbar select-none transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                        
                        {/* CASINO YÖNETİMİ */}
                        <div onClick={() => toggleGroup('CASINO YÖNETİMİ')} className="flex items-center justify-between cursor-pointer group mt-2 mb-1 px-2">
                            <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] group-hover:text-zinc-400 transition-colors">CASINO YÖNETİMİ</div>
                            {expandedGroups.includes('CASINO YÖNETİMİ') ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />}
                        </div>
                        {expandedGroups.includes('CASINO YÖNETİMİ') && (
                            <div className="flex flex-col gap-1 mb-2 animate-in slide-in-from-top-2 duration-200">
                                <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'dashboard' ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 shadow-[0_0_10px_rgba(0,255,136,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Activity className="w-3.5 h-3.5" /> Casino Komuta
                                </button>
                                <button onClick={() => { setActiveTab('provider'); setIsSidebarOpen(false); }} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'provider' ? 'bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Gamepad2 className="w-3.5 h-3.5" /> Sağlayıcı RTP
                                </button>
                                <button onClick={() => { setActiveTab('risk'); setIsSidebarOpen(false); }} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'risk' ? 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <ShieldCheck className="w-3.5 h-3.5" /> Casino Risk
                                </button>
                            </div>
                        )}

                        {/* PAZARLAMA & BONUS */}
                        <div onClick={() => toggleGroup('PAZARLAMA & BONUS')} className="flex items-center justify-between cursor-pointer group mt-2 mb-1 px-2">
                            <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] group-hover:text-zinc-400 transition-colors">PAZARLAMA & BONUS</div>
                            {expandedGroups.includes('PAZARLAMA & BONUS') ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />}
                        </div>
                        {expandedGroups.includes('PAZARLAMA & BONUS') && (
                            <div className="flex flex-col gap-1 mb-2 animate-in slide-in-from-top-2 duration-200">
                                <button onClick={() => { setActiveTab('bonus'); setIsSidebarOpen(false); }} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'bonus' ? 'bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Gift className="w-3.5 h-3.5" /> Bonus & Kampanya
                                </button>
                                <button onClick={() => setActiveTab('affiliate')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'affiliate' ? 'bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Network className="w-3.5 h-3.5" /> Affiliate (Bayi)
                                </button>
                            </div>
                        )}

                        {/* SPOR YÖNETİMİ */}
                        <div onClick={() => toggleGroup('SPOR YÖNETİMİ')} className="flex items-center justify-between cursor-pointer group mt-2 mb-1 px-2">
                            <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] group-hover:text-zinc-400 transition-colors">SPOR YÖNETİMİ</div>
                            {expandedGroups.includes('SPOR YÖNETİMİ') ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />}
                        </div>
                        {expandedGroups.includes('SPOR YÖNETİMİ') && (
                            <div className="flex flex-col gap-1 mb-2 animate-in slide-in-from-top-2 duration-200">
                                <button onClick={() => setActiveTab('sports')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'sports' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Trophy className="w-4 h-4" /> SPOR YÖNETİMİ
                                </button>
                                <button onClick={() => setActiveTab('odds')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'odds' ? 'bg-[#06b6d4]/10 text-[#06b6d4] border border-[#06b6d4]/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Settings className="w-4 h-4" /> ORAN MOTORU
                                </button>
                                <button onClick={() => setActiveTab('radar')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'radar' ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] border border-[#8b5cf6]/30 shadow-[0_0_10px_rgba(139,92,246,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Target className="w-3.5 h-3.5" /> Canlı Oran Takip
                                </button>
                                <button onClick={() => setActiveTab('sports-risk')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'sports-risk' ? 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <ShieldAlert className="w-3.5 h-3.5" /> Kupon Radarı
                                </button>
                            </div>
                        )}

                        {/* GÜVENLİK & FRAUD */}
                        <div onClick={() => toggleGroup('GÜVENLİK & FRAUD')} className="flex items-center justify-between cursor-pointer group mt-2 mb-1 px-2">
                            <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] group-hover:text-zinc-400 transition-colors">GÜVENLİK & FRAUD</div>
                            {expandedGroups.includes('GÜVENLİK & FRAUD') ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />}
                        </div>
                        {expandedGroups.includes('GÜVENLİK & FRAUD') && (
                            <div className="flex flex-col gap-1 mb-2 animate-in slide-in-from-top-2 duration-200">
                                <button onClick={() => setActiveTab('fraud')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'fraud' ? 'bg-[#dc2626]/10 text-[#dc2626] border border-[#dc2626]/30 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Lock className="w-3.5 h-3.5" /> Fraud Radarı
                                </button>
                            </div>
                        )}

                        {/* FİNANS & MÜŞTERİ */}
                        <div onClick={() => toggleGroup('FİNANS & MÜŞTERİ')} className="flex items-center justify-between cursor-pointer group mt-2 mb-1 px-2">
                            <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] group-hover:text-zinc-400 transition-colors">FİNANS & MÜŞTERİ</div>
                            {expandedGroups.includes('FİNANS & MÜŞTERİ') ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />}
                        </div>
                        {expandedGroups.includes('FİNANS & MÜŞTERİ') && (
                            <div className="flex flex-col gap-1 mb-2 animate-in slide-in-from-top-2 duration-200">
                                {currentAdminRole === 'SUPER_ADMIN' && (
                                    <button onClick={() => setActiveTab('liquidity')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'liquidity' ? 'bg-[#26a17b]/10 text-[#26a17b] border border-[#26a17b]/30 shadow-[0_0_10px_rgba(38,161,123,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                        <Wallet className="w-3.5 h-3.5" /> Likidite Matrisi
                                    </button>
                                )}
                                <button onClick={() => setActiveTab('whale')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'whale' ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Target className="w-3.5 h-3.5" /> VIP Balina Radarı
                                </button>
                                <button onClick={() => setActiveTab('members')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'members' ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Users className="w-3.5 h-3.5" /> Müşteri & KYC
                                </button>
                            </div>
                        )}

                        {/* SİSTEM */}
                        <div onClick={() => toggleGroup('SİSTEM')} className="flex items-center justify-between cursor-pointer group mt-2 mb-1 px-2">
                            <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] group-hover:text-zinc-400 transition-colors">SİSTEM</div>
                            {expandedGroups.includes('SİSTEM') ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />}
                        </div>
                        {expandedGroups.includes('SİSTEM') && (
                            <div className="flex flex-col gap-1 mb-2 animate-in slide-in-from-top-2 duration-200">
                                {currentAdminRole === 'SUPER_ADMIN' && (
                                    <>
                                        <button onClick={() => setActiveTab('withdrawals')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'withdrawals' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                            <TrendingUp className="w-3.5 h-3.5" /> Çekim Talepleri
                                        </button>
                                        <button onClick={() => setActiveTab('deposits')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'deposits' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                            <ArrowDownToLine className="w-3.5 h-3.5" /> Yatırım Talepleri
                                        </button>
                                        <button onClick={() => setActiveTab('audit')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'audit' ? 'bg-zinc-100/10 text-white border border-white/30' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                            <Monitor className="w-3.5 h-3.5" /> İşlem Kayıtları
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {/* DİĞER */}
                        <div onClick={() => toggleGroup('DİĞER')} className="flex items-center justify-between cursor-pointer group mt-2 mb-1 px-2">
                            <div className="text-[9px] font-black text-zinc-600 tracking-[0.2em] group-hover:text-zinc-400 transition-colors">DİĞER EKSTRALAR</div>
                            {expandedGroups.includes('DİĞER') ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />}
                        </div>
                        {expandedGroups.includes('DİĞER') && (
                            <div className="flex flex-col gap-1 mb-2 animate-in slide-in-from-top-2 duration-200">
                                <button onClick={() => setActiveTab('bot')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'bot' ? 'bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/30 shadow-[0_0_10px_rgba(20,184,166,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <Bot className="w-3.5 h-3.5" /> AI Chatbot
                                </button>
                                <button onClick={() => setActiveTab('community')} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2.5 transition-all ${activeTab === 'community' ? 'bg-[#ec4899]/10 text-[#ec4899] border border-[#ec4899]/30 shadow-[0_0_10px_rgba(236,72,153,0.1)]' : 'bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                                    <MessageSquare className="w-3.5 h-3.5" /> Topluluk & Chat
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-[#050608] custom-scrollbar relative">
                        
                        {/* RBAC Yetki Kontrolü İçin Yardımcı Render Fonksiyonu */}
                    {(() => {
                        const isRestricted = ['risk', 'withdrawals', 'audit', 'sports', 'tv', 'liquidity', 'odds'].includes(activeTab);
                        
                        if (isRestricted && currentAdminRole !== 'SUPER_ADMIN') {
                            return (
                                <div className="h-[75vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95">
                                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                        <X className="w-10 h-10 text-red-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white mb-2">Erişim Engellendi</h2>
                                    <p className="text-zinc-400 max-w-md">
                                        Bu sayfayı görüntüleme yetkiniz yok. Bu alana sadece <strong>SUPER_ADMIN</strong> rolüne sahip yöneticiler erişebilir.
                                    </p>
                                </div>
                            );
                        }

                        // Eğer yetki varsa veya sayfa herkese açıksa, ilgili tabı render et:
                        return (
                            <>
                                {activeTab === 'dashboard' && (
                                    <AdminDashboardTab />
                                )}

                                {/* İleri Düzey Modüller (Placeholders) */}
                                {['bonus', 'affiliate', 'fraud', 'deposits'].includes(activeTab) && (
                                    <div className="h-full flex items-center justify-center text-center p-8">
                                        <div className="max-w-md bg-[#0b0c10] border border-white/5 rounded-2xl p-8 shadow-2xl">
                                            <div className="w-16 h-16 bg-[#06b6d4]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#06b6d4]/30">
                                                <Lock className="w-8 h-8 text-[#06b6d4]" />
                                            </div>
                                            <h2 className="text-xl font-black text-white mb-2 uppercase tracking-wider">Modül Hazırlanıyor</h2>
                                            <p className="text-sm text-zinc-400">Bu modül (Pazarlama/Güvenlik) şu anda geliştirme aşamasındadır. Ana komuta merkezindeki (Casino Komuta) SLA ve API sağlık durumlarını inceleyebilirsiniz.</p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'kral' && (
                                    <div className="h-full w-full">
                                        <AdminKralTab />
                                    </div>
                                )}

                                {activeTab === 'members' && (
                                    <div className="h-[75vh]">
                                        <AdminMembersTab />
                                    </div>
                                )}

                                {activeTab === 'luckywheel' && props.luckyWheelConfig && props.onSaveLuckyWheelConfig && (
                                    <div className="h-[60vh]">
                                        <AdminLuckyWheelTab config={props.luckyWheelConfig} onSave={props.onSaveLuckyWheelConfig} />
                                    </div>
                                )}

                                {activeTab === 'risk' && (
                                    <div className="h-[75vh] overflow-y-auto">
                                        <AdminRiskTab />
                                    </div>
                                )}

                                {activeTab === 'radar' && (
                                    <div className="h-[75vh]">
                                        <AdminLiveRadarTab />
                                    </div>
                                )}

                                {activeTab === 'marketing' && (
                                    <div className="h-[75vh]">
                                        <AdminMarketingTab />
                                    </div>
                                )}

                                {activeTab === 'withdrawals' && (
                                    <div className="h-[75vh]">
                                        <AdminWithdrawalsTab />
                                    </div>
                                )}

                                {activeTab === 'audit' && (
                                    <div className="h-[75vh]">
                                        <AdminAuditLogsTab />
                                    </div>
                                )}

                                {activeTab === 'whale' && (
                                    <AdminWhaleTab />
                                )}

                                {activeTab === 'liquidity' && (
                                    <AdminLiquidityTab />
                                )}

                                {activeTab === 'provider' && (
                                    <AdminProviderTab />
                                )}

                                {activeTab === 'community' && (
                                    <AdminCommunityTab />
                                )}

                                {activeTab === 'sports' && (
                                    <div className="animate-fade-in h-full">
                                        <AdminSportsTab />
                                    </div>
                                )}
                                
                                {activeTab === 'odds' && (
                                    <div className="animate-fade-in h-full">
                                        <AdminOddsEngineTab />
                                    </div>
                                )}

                                {activeTab === 'tv' && (
                                    <div className="h-full p-6">
                                        <AdminTVTab />
                                    </div>
                                )}

                                {activeTab === 'bot' && (
                                    <>
                                        <div className="mb-6 flex items-center gap-2 text-emerald-400">
                                            <Bot className="w-5 h-5" />
                                            <h3 className="text-lg font-semibold text-white">Sohbet Botu Yönetimi</h3>
                                        </div>

                                        {loading ? (
                                            <div className="text-center py-12 text-gray-400">
                                                <Activity className="w-8 h-8 animate-spin mx-auto mb-3" />
                                                <p>Bot sunucusuna bağlanılıyor...</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {/* Bot Durumu */}
                                                <div className="bg-[#111318] p-5 rounded-xl border border-gray-800 flex items-center justify-between">
                                                    <div>
                                                        <div className="font-semibold text-white mb-1">Bot Aktifliği</div>
                                                        <div className="text-sm text-gray-500">Bot sohbete katılsın mı?</div>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer"
                                                            checked={config.isActive}
                                                            onChange={(e) => setConfig({...config, isActive: e.target.checked})}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                                    </label>
                                                </div>

                                                {/* Hız Ayarları */}
                                                <div className="bg-[#111318] p-5 rounded-xl border border-gray-800 space-y-4">
                                                    <div>
                                                        <div className="font-semibold text-white mb-4">Mesaj Hızı (Milisaniye)</div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-xs text-gray-500 mb-1 block">Minimum Bekleme</label>
                                                                <input 
                                                                    type="number" 
                                                                    value={config.speedMin}
                                                                    onChange={(e) => setConfig({...config, speedMin: parseInt(e.target.value)})}
                                                                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-gray-500 mb-1 block">Maksimum Bekleme</label>
                                                                <input 
                                                                    type="number" 
                                                                    value={config.speedMax}
                                                                    onChange={(e) => setConfig({...config, speedMax: parseInt(e.target.value)})}
                                                                    className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white focus:border-emerald-500 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Davranış Ayarları */}
                                                <div className="bg-[#111318] p-5 rounded-xl border border-gray-800 space-y-4">
                                                    <div className="font-semibold text-white mb-4">Davranış Ayarları</div>
                                                    
                                                    <div className="mb-4">
                                                        <label className="text-xs text-gray-500 mb-1 flex justify-between">
                                                            <span>Gevşek/Sıradan Konuşma Oranı</span>
                                                            <span className="text-emerald-400">{Math.round(config.sloppyRate * 100)}%</span>
                                                        </label>
                                                        <input 
                                                            type="range" 
                                                            min="0" max="1" step="0.1" 
                                                            value={config.sloppyRate}
                                                            onChange={(e) => setConfig({...config, sloppyRate: parseFloat(e.target.value)})}
                                                            className="w-full accent-emerald-500"
                                                        />
                                                        <div className="text-xs text-gray-500 mt-1">Noktalama işaretlerini atlama, küçük harf kullanma olasılığı.</div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 flex justify-between">
                                                            <span>Emoji Kullanım Oranı</span>
                                                            <span className="text-emerald-400">{Math.round(config.emojiRate * 100)}%</span>
                                                        </label>
                                                        <input 
                                                            type="range" 
                                                            min="0" max="1" step="0.1" 
                                                            value={config.emojiRate}
                                                            onChange={(e) => setConfig({...config, emojiRate: parseFloat(e.target.value)})}
                                                            className="w-full accent-emerald-500"
                                                        />
                                                        <div className="text-xs text-gray-500">Kullanıcıların mesaj sonuna emoji ekleme sıklığı.</div>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        );
                    })()}
                    </div>
                </div>

                {/* Footer */}
                {activeTab === 'bot' && (
                    <div className="p-4 border-t border-gray-800 bg-[#15171e] flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={loading || saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                        >
                            {saving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                        </button>
                    </div>
                )}
            </div>
    );
}
