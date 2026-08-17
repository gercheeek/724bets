import React, { useState } from 'react';
import { Shield, TrendingDown, Target, Save, Users, ToggleLeft, ToggleRight, Settings, Plus, Trash2, ShieldCheck, Activity } from 'lucide-react';

export default function AdminBettingEngineTab() {
    const [saving, setSaving] = useState(false);
    
    // Mock State for Settings
    const [houseEdge, setHouseEdge] = useState(10);
    const [minBet, setMinBet] = useState(10);
    const [maxBet, setMaxBet] = useState(100000);
    
    // Mock State for Roles
    const [roles, setRoles] = useState([
        { id: 1, username: 'Kral_Alex', role: 'SUPER_ADMIN', addedDate: '2023-01-01' },
        { id: 2, username: 'Veli_Can', role: 'MODERATOR', addedDate: '2023-05-15' },
    ]);

    // Mock State for Sports
    const [sports, setSports] = useState([
        { id: 'football', name: 'Futbol', active: true },
        { id: 'basketball', name: 'Basketbol', active: true },
        { id: 'tennis', name: 'Tenis', active: true },
        { id: 'esports', name: 'E-Spor', active: false },
    ]);

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 800);
    };

    const toggleSport = (id: string) => {
        setSports(sports.map(s => s.id === id ? { ...s, active: !s.active } : s));
    };

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-wider">
                        <Settings className="w-8 h-8 text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
                        Sistem & Kar Marjı
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
                        Sistemin ana damarı olan oran algoritmasını, yetkilendirmeleri ve spor/lig bazlı açma-kapama ayarlarını buradan yönetebilirsiniz.
                    </p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00E5FF] hover:bg-[#33FFB5] text-black font-black uppercase tracking-widest text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(0,255,163,0.2)] hover:shadow-[0_0_25px_rgba(0,255,163,0.4)] disabled:opacity-50 w-full md:w-auto"
                >
                    {saving ? <Activity className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* 1. Kar Marjı (House Edge) */}
                <div className="xl:col-span-1 bg-[#0A0D14] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent pointer-events-none" />
                    
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2.5 bg-[#00E5FF]/10 rounded-xl border border-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                            <TrendingDown className="w-6 h-6 text-[#00E5FF]" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg uppercase tracking-wide">Kar Marjı (House Edge)</h3>
                            <p className="text-zinc-500 text-xs font-medium mt-0.5">Global Oran Kesintisi</p>
                        </div>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-semibold text-zinc-300">Sistem Kar Marjı (%)</label>
                                <span className="text-[#00E5FF] font-black text-xl drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                                    %{houseEdge}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="1" max="25" step="1" 
                                value={houseEdge}
                                onChange={(e) => setHouseEdge(parseInt(e.target.value))}
                                className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-[#00E5FF]"
                            />
                            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                                Cashout hesaplamalarında ve spor sağlayıcısından gelen ham oranlarda bu yüzdelik dilim kadar kesinti uygulanarak kullanıcıya sunulur. (Önerilen: %10)
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div>
                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Min. Bahis (₺)</label>
                                <input 
                                    type="number" 
                                    value={minBet}
                                    onChange={(e) => setMinBet(parseInt(e.target.value))}
                                    className="w-full bg-[#131823] border border-white/10 rounded-lg px-3 py-2.5 text-white font-bold text-sm focus:border-[#00E5FF]/50 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Max. Bahis (₺)</label>
                                <input 
                                    type="number" 
                                    value={maxBet}
                                    onChange={(e) => setMaxBet(parseInt(e.target.value))}
                                    className="w-full bg-[#131823] border border-white/10 rounded-lg px-3 py-2.5 text-white font-bold text-sm focus:border-[#00E5FF]/50 outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Yetkilendirme / Rol Yönetimi */}
                <div className="xl:col-span-2 bg-[#0A0D14] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#f0b90b]/10 rounded-xl border border-[#f0b90b]/20 shadow-[0_0_15px_rgba(240,185,11,0.1)]">
                                <Shield className="w-6 h-6 text-[#f0b90b]" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg uppercase tracking-wide">Yönetici Yetkilendirmesi</h3>
                                <p className="text-zinc-500 text-xs font-medium mt-0.5">Admin ve Moderatör atamaları</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-xs font-bold uppercase tracking-wider">
                            <Plus className="w-4 h-4" /> Yeni Yetkili
                        </button>
                    </div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-zinc-500 text-[10px] uppercase tracking-widest font-black">
                                    <th className="py-3 px-4">Kullanıcı Adı</th>
                                    <th className="py-3 px-4">Rol / Yetki</th>
                                    <th className="py-3 px-4">Ekleme Tarihi</th>
                                    <th className="py-3 px-4 text-right">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {roles.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 bg-[#12161e]/50 hover:bg-[#1f2430]/60 transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center border border-white/10">
                                                    <Users className="w-4 h-4 text-zinc-400" />
                                                </div>
                                                <span className="text-white font-bold tracking-wide">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                                                user.role === 'SUPER_ADMIN' 
                                                ? 'bg-[#f0b90b]/10 text-[#f0b90b] border-[#f0b90b]/30' 
                                                : 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-zinc-500 font-medium text-xs">
                                            {user.addedDate}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. Spor & Lig Açma Kapama */}
                <div className="xl:col-span-3 bg-[#0A0D14] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2.5 bg-[#ef4444]/10 rounded-xl border border-[#ef4444]/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                            <ShieldCheck className="w-6 h-6 text-[#ef4444]" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg uppercase tracking-wide">Modül Kontrolü (Aç/Kapat)</h3>
                            <p className="text-zinc-500 text-xs font-medium mt-0.5">İstenmeyen sporları veya sistemleri global olarak devre dışı bırakın</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        {sports.map(sport => (
                            <div 
                                key={sport.id}
                                onClick={() => toggleSport(sport.id)}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                    sport.active 
                                    ? 'bg-[#12161e] border-white/10 hover:border-white/20' 
                                    : 'bg-red-500/5 border-red-500/20'
                                }`}
                            >
                                <span className={`font-bold tracking-wide ${sport.active ? 'text-white' : 'text-zinc-500 line-through'}`}>
                                    {sport.name}
                                </span>
                                {sport.active ? (
                                    <ToggleRight className="w-7 h-7 text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]" />
                                ) : (
                                    <ToggleLeft className="w-7 h-7 text-zinc-600" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
