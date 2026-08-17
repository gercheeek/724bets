import React, { useState } from 'react';
import { getOddsEngineConfig, saveOddsEngineConfig } from '../utils/oddsEngineConfig';
import { Settings, ShieldAlert, Target, Clock, Zap, Users, LayoutDashboard, Flag } from 'lucide-react';

const AdminOddsEngineTab = () => {
    // We are just displaying the config for now. In a real backend this would send an update API call.
    const [config, setConfig] = useState(getOddsEngineConfig());
    const [savedMessage, setSavedMessage] = useState('');

    const handleSave = () => {
        saveOddsEngineConfig(config);
        setSavedMessage('Ayarlar belleğe kaydedildi! (Gerçek ortamda DB\'ye yazılır)');
        setTimeout(() => setSavedMessage(''), 3000);
    };

    return (
        <div className="flex flex-col h-full bg-[#0b0d14] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-[#12141c] border-b border-[#222635]">
                <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                        <Settings className="w-6 h-6 text-[color:var(--theme-accent)]" />
                        ORAN MOTORU VE SİSTEM İSKELETİ
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">Yapay zeka oran üretim motorunun ve elit takım yapılandırmalarının merkezi kontrol paneli.</p>
                </div>
                <div className="flex items-center gap-4">
                    {savedMessage && <span className="text-[#00E5FF] text-sm font-bold animate-fade-in">{savedMessage}</span>}
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 bg-[color:var(--theme-accent)] hover:bg-[#0891b2] text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4" />
                        AYARLARI KAYDET
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    {/* VIP TEAMS SETTINGS */}
                    <div className="bg-[#12141c] rounded-xl border border-[#222635] p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#eab308]/5 rounded-full blur-3xl"></div>
                        <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-[#222635] pb-3">
                            <Users className="w-5 h-5 text-[#eab308]" />
                            VIP 50 Takım (Elit Algoritma)
                        </h3>
                        <p className="text-xs text-zinc-500 mb-4">Bu takımların maçlarında her zaman API'den tüm veriler çekilir. Oran motoru bu takımlara UI'da süper öncelik tanır.</p>
                        
                        <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            {config.vipTeams.map((team, idx) => (
                                <div key={idx} className="px-3 py-1.5 bg-[#1e2333] border border-[#2c3245] rounded-md text-xs font-bold text-zinc-300 uppercase tracking-wider">
                                    {team}
                                </div>
                            ))}
                        </div>
                        <button className="mt-4 w-full py-2 bg-[#1e2333] hover:bg-[#2c3245] text-zinc-300 rounded-lg text-sm font-bold transition-colors border border-dashed border-[#2c3245]">
                            + YENİ TAKIM EKLE
                        </button>
                    </div>

                    {/* ALGORITHM RULES */}
                    <div className="flex flex-col gap-6">
                        
                        {/* TIME DECAY */}
                        <div className="bg-[#12141c] rounded-xl border border-[#222635] p-5">
                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-[#222635] pb-3">
                                <Clock className="w-5 h-5 text-[color:var(--theme-accent)]" />
                                Zaman Çarpanı (Time Decay)
                            </h3>
                            <p className="text-xs text-zinc-500 mb-4">Maç dakikasına göre üretilen oranların erime katsayıları.</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0b0d14] p-3 rounded-lg border border-[#222635]">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">Zaman Motoru</label>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${config.rules.timeDecayEnabled ? 'bg-[#00E5FF] shadow-[0_0_8px_#10b981]' : 'bg-red-500'}`}></div>
                                        <span className="text-sm font-bold text-white">{config.rules.timeDecayEnabled ? 'AKTİF' : 'KAPALI'}</span>
                                    </div>
                                </div>
                                <div className="bg-[#0b0d14] p-3 rounded-lg border border-[#222635]">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">Maksimum Dakika Limiti</label>
                                    <input type="number" value={config.rules.maxMinuteThreshold} readOnly className="bg-transparent text-white font-black text-lg outline-none w-full" />
                                </div>
                            </div>
                        </div>

                        {/* HOUSE EDGE */}
                        <div className="bg-[#12141c] rounded-xl border border-[#222635] p-5 shadow-[0_0_20px_rgba(0,229,255,0.05)]">
                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-[#222635] pb-3">
                                <Zap className="w-5 h-5 text-[#f59e0b]" />
                                Kâr Marjı (House Edge)
                            </h3>
                            <p className="text-xs text-zinc-500 mb-4">Bahis platformunun matematiksel avantajı. Oranlar bu marja göre otomatik olarak aşağı yönlü tıraşlanır (Vig/Juice). Profesyonel sitelerde %4 - %8 arasıdır.</p>
                            
                            <div className="bg-[#0b0d14] p-4 rounded-lg border border-[#222635]">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase block">Aktif Marj Yüzdesi</label>
                                    <span className="text-2xl font-black text-[#00E5FF]">{(config.rules.houseEdgePercentage * 100).toFixed(1)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.01" 
                                    max="0.20" 
                                    step="0.01" 
                                    value={config.rules.houseEdgePercentage} 
                                    onChange={(e) => setConfig({ ...config, rules: { ...config.rules, houseEdgePercentage: parseFloat(e.target.value) } })}
                                    className="w-full accent-[#00E5FF] h-2 bg-[#222635] rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-zinc-500 font-bold mt-2">
                                    <span>%1 (Agresif)</span>
                                    <span>%10 (Standart)</span>
                                    <span>%20 (Yüksek Kâr)</span>
                                </div>
                            </div>
                        </div>

                        {/* GOALS & CORNERS */}
                        <div className="bg-[#12141c] rounded-xl border border-[#222635] p-5">
                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-[#222635] pb-3">
                                <Target className="w-5 h-5 text-[#10b981]" />
                                Gol ve Korner Baremleri
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0b0d14] p-3 rounded-lg border border-[#222635]">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">Gol Taban Limiti (+x.5)</label>
                                    <input type="number" step="0.1" value={config.rules.goalBaseMargin} readOnly className="bg-transparent text-[#00E5FF] font-black text-lg outline-none w-full" />
                                </div>
                                <div className="bg-[#0b0d14] p-3 rounded-lg border border-[#222635]">
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-1 block">Başlangıç Korner Limiti</label>
                                    <input type="number" step="0.1" value={config.rules.cornerBaseMargin} readOnly className="bg-transparent text-[#00E5FF] font-black text-lg outline-none w-full" />
                                </div>
                                <div className="col-span-2 grid grid-cols-4 gap-2 mt-2 border-t border-[#222635] pt-4">
                                    <div className="bg-[#0b0d14] p-2 rounded border border-[#222635]">
                                        <label className="text-[9px] text-zinc-500 font-bold uppercase mb-1 block">+1 Gol İhtimali</label>
                                        <span className="text-white font-black text-sm">{(config.rules.goalProb1More * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="bg-[#0b0d14] p-2 rounded border border-[#222635]">
                                        <label className="text-[9px] text-zinc-500 font-bold uppercase mb-1 block">+2 Gol Çarpanı</label>
                                        <span className="text-white font-black text-sm">x{config.rules.goalProb2MoreMultiplier.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-[#0b0d14] p-2 rounded border border-[#222635]">
                                        <label className="text-[9px] text-zinc-500 font-bold uppercase mb-1 block">+3 Gol Çarpanı</label>
                                        <span className="text-white font-black text-sm">x{config.rules.goalProb3MoreMultiplier.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-[#0b0d14] p-2 rounded border border-[#222635]">
                                        <label className="text-[9px] text-zinc-500 font-bold uppercase mb-1 block">+4 Gol Çarpanı</label>
                                        <span className="text-white font-black text-sm">x{config.rules.goalProb4MoreMultiplier.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SUSPENSION RULES */}
                        <div className="bg-[#12141c] rounded-xl border border-red-500/30 p-5 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-red-500/20 pb-3">
                                <ShieldAlert className="w-5 h-5 text-red-500" />
                                Askıya Alma & Kilit Sistemi
                            </h3>
                            <p className="text-xs text-zinc-500 mb-4">Bu statülere veya sürelere ulaşan maçlarda bahis alımı yapay zeka tarafından otomatik kilitlenir.</p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-2 block">Tetikleyici Anahtar Kelimeler (Minute)</label>
                                    <div className="flex gap-2">
                                        {config.rules.lockKeywords.map(kw => (
                                            <span key={kw} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-bold rounded border border-red-500/20">{kw}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase mb-2 block">Kilitleyici Statüler (Status)</label>
                                    <div className="flex gap-2">
                                        {config.rules.suspendStatuses.map(st => (
                                            <span key={st} className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded border border-orange-500/20">{st}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOddsEngineTab;
