import React, { useState } from 'react';
import { RaffleConfig } from '../types';
import { Ticket, Trophy, Trash2, Plus, Save, Clock, HelpCircle, Shield, AlertTriangle, CheckCircle, Info, Users, Sparkles, UserPlus, Grid } from 'lucide-react';

interface AdminRaffleTabProps {
    config: RaffleConfig;
    onSave: (config: RaffleConfig) => void;
}

const AdminRaffleTab: React.FC<AdminRaffleTabProps> = ({ config, onSave }) => {
    const [localConfig, setLocalConfig] = useState<RaffleConfig>(config);
    const [ticketPool, setTicketPool] = useState<{ slot: number, userId: string, username: string }[]>(() => {
        try { return JSON.parse(localStorage.getItem('site_ticket_pool') || '[]'); } catch { return []; }
    });
    const [members, setMembers] = useState<any[]>(() => {
        try { return JSON.parse(localStorage.getItem('site_members') || '[]'); } catch { return []; }
    });

    const [editingSlot, setEditingSlot] = useState<number | null>(null);
    const [assignUserId, setAssignUserId] = useState('');

    const handleSaveConfig = () => {
        onSave(localConfig);
        localStorage.setItem('site_ticket_pool', JSON.stringify(ticketPool));
        alert('Çekiliş ayarları ve bilet havuzu kaydedildi!');
    };

    const handleClearPool = () => {
        if (confirm('Tüm bilet havuzunu sıfırlamak istediğinize emin misiniz?')) {
            setTicketPool([]);
            localStorage.setItem('site_ticket_pool', '[]');
        }
    };

    const handleAssignTicket = () => {
        if (editingSlot === null || !assignUserId) return;
        
        const user = members.find(m => m.id === assignUserId || m.username === assignUserId);
        if (!user) {
            alert('Kullanıcı bulunamadı!');
            return;
        }

        const newPool = ticketPool.filter(t => t.slot !== editingSlot);
        newPool.push({
            slot: editingSlot,
            userId: user.id || user.userId,
            username: user.username
        });

        setTicketPool(newPool);
        setEditingSlot(null);
        setAssignUserId('');
    };

    const handleRemoveTicket = (slot: number) => {
        setTicketPool(ticketPool.filter(t => t.slot !== slot));
    };

    const handlePickWinner = () => {
        if (ticketPool.length === 0) {
            alert('Havuzda bilet yok!');
            return;
        }
        const winner = ticketPool[Math.floor(Math.random() * ticketPool.length)];
        alert(`🎉 Kazanan Talihli: ${winner.username} (Slot #${winner.slot + 1})`);
    };

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'Shield': return <Shield size={16} />;
            case 'AlertTriangle': return <AlertTriangle size={16} />;
            case 'CheckCircle': return <CheckCircle size={16} />;
            case 'Users': return <Users size={16} />;
            case 'Trophy': return <Trophy size={16} />;
            case 'Info': return <Info size={16} />;
            default: return <Info size={16} />;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black flex items-center gap-3">
                    <Ticket className="w-6 h-6 text-[#f0b90b]" /> BİLET HAVUZU YÖNETİMİ
                </h2>
                <div className="flex gap-2">
                    <button onClick={handlePickWinner} className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl text-xs font-bold border border-purple-500/30 hover:bg-purple-500/30 transition-all">
                        <Sparkles className="w-4 h-4" /> ÇEKİLİŞ YAP
                    </button>
                    <button onClick={handleSaveConfig} className="flex items-center gap-2 px-6 py-2 bg-[#f0b90b] text-black rounded-xl text-xs font-black hover:shadow-[0_0_20px_rgba(240,185,11,0.3)] transition-all">
                        <Save className="w-4 h-4" /> AYARLARI KAYDET
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: General Settings & Prizes */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Clock size={14}/> GENEL AYARLAR</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1 block mb-1">Çekiliş Tarihi & Saati</label>
                                <input 
                                    type="datetime-local" 
                                    value={localConfig.drawDate.slice(0, 16)} 
                                    onChange={e => setLocalConfig({...localConfig, drawDate: e.target.value})}
                                    className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white focus:border-[#f0b90b]/50 outline-none" 
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-zinc-800">
                                <span className="text-xs font-bold text-zinc-300">Sistem Aktif mi?</span>
                                <button 
                                    onClick={() => setLocalConfig({...localConfig, isActive: !localConfig.isActive})}
                                    className={`w-12 h-6 rounded-full transition-all relative ${localConfig.isActive ? 'bg-[#f0b90b]' : 'bg-zinc-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localConfig.isActive ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Trophy size={14}/> ÖDÜLLER</h3>
                            <button 
                                onClick={() => setLocalConfig({...localConfig, prizes: [...localConfig.prizes, { id: Date.now().toString(), rank: '', prize: '', emoji: '🎁', color: '#f0b90b' }]})}
                                className="p-1.5 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {localConfig.prizes.map((p, idx) => (
                                <div key={p.id} className="flex gap-2 items-center bg-black/30 p-2 rounded-xl border border-zinc-800/50">
                                    <input value={p.rank} onChange={e => {
                                        const updated = [...localConfig.prizes];
                                        updated[idx].rank = e.target.value;
                                        setLocalConfig({...localConfig, prizes: updated});
                                    }} placeholder="1." className="w-12 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs text-center" />
                                    <input value={p.prize} onChange={e => {
                                        const updated = [...localConfig.prizes];
                                        updated[idx].prize = e.target.value;
                                        setLocalConfig({...localConfig, prizes: updated});
                                    }} placeholder="Ödül ismi" className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 text-xs" />
                                    <button onClick={() => {
                                        setLocalConfig({...localConfig, prizes: localConfig.prizes.filter((_, i) => i !== idx)});
                                    }} className="text-zinc-600 hover:text-red-500 p-1"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTER: Bilet Havuzu (Slot Management) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><Grid size={14}/> BİLET HAVUZU SLOTLARI</h3>
                                <p className="text-[10px] text-zinc-500 font-bold mt-1">Slotları yönetmek için üzerine tıklayın. Toplam: {ticketPool.length} / 200</p>
                            </div>
                            <button onClick={handleClearPool} className="text-[10px] font-black text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 transition-all">
                                TÜMÜNÜ TEMİZLE
                            </button>
                        </div>

                        <div className="grid grid-cols-10 gap-1.5">
                            {Array.from({ length: 200 }).map((_, i) => {
                                const found = ticketPool.find(t => t.slot === i);
                                return (
                                    <div 
                                        key={i}
                                        onClick={() => setEditingSlot(i)}
                                        className={`h-8 rounded cursor-pointer transition-all flex items-center justify-center text-[8px] font-black border
                                            ${found 
                                                ? 'bg-[#f0b90b] border-[#f0b90b] text-black shadow-[0_0_8px_rgba(240,185,11,0.2)]' 
                                                : 'bg-black border-zinc-800 text-zinc-700 hover:border-zinc-500'}`}
                                        title={found ? found.username : `Boş Slot #${i+1}`}
                                    >
                                        {i + 1}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* FAQ & Rules Management */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><HelpCircle size={14}/> S.S.S.</h3>
                                <button onClick={() => setLocalConfig({...localConfig, faqs: [...localConfig.faqs, { q: '', a: '' }]})} className="p-1 bg-zinc-800 rounded text-zinc-400"><Plus size={12}/></button>
                            </div>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {localConfig.faqs.map((faq, idx) => (
                                    <div key={idx} className="space-y-2 p-3 bg-black/40 rounded-xl border border-zinc-800">
                                        <input value={faq.q} onChange={e => {
                                            const updated = [...localConfig.faqs];
                                            updated[idx].q = e.target.value;
                                            setLocalConfig({...localConfig, faqs: updated});
                                        }} placeholder="Soru" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-bold" />
                                        <textarea value={faq.a} onChange={e => {
                                            const updated = [...localConfig.faqs];
                                            updated[idx].a = e.target.value;
                                            setLocalConfig({...localConfig, faqs: updated});
                                        }} placeholder="Cevap" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-[10px] min-h-[60px]" />
                                        <button onClick={() => setLocalConfig({...localConfig, faqs: localConfig.faqs.filter((_, i) => i !== idx)})} className="text-[10px] text-red-500 font-bold">Sil</button>
                                    </div>
                                ))}
                            </div>
                         </div>

                         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Shield size={14}/> KURALLAR</h3>
                                <button onClick={() => setLocalConfig({...localConfig, rules: [...localConfig.rules, { icon: 'Info', text: '' }]})} className="p-1 bg-zinc-800 rounded text-zinc-400"><Plus size={12}/></button>
                            </div>
                            <div className="space-y-3">
                                {localConfig.rules.map((rule, idx) => (
                                    <div key={idx} className="flex gap-2 items-start bg-black/40 p-2 rounded-xl border border-zinc-800">
                                        <div className="mt-1 text-[#f0b90b]">{renderIcon(rule.icon)}</div>
                                        <textarea value={rule.text} onChange={e => {
                                            const updated = [...localConfig.rules];
                                            updated[idx].text = e.target.value;
                                            setLocalConfig({...localConfig, rules: updated});
                                        }} className="flex-1 bg-transparent border-none text-[10px] text-zinc-300 resize-none outline-none" rows={2} />
                                        <button onClick={() => setLocalConfig({...localConfig, rules: localConfig.rules.filter((_, i) => i !== idx)})} className="text-zinc-600 hover:text-red-500"><Trash2 size={12}/></button>
                                    </div>
                                ))}
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* SLOT EDIT MODAL */}
            {editingSlot !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-[32px] max-w-md w-full shadow-2xl relative">
                        <button onClick={() => setEditingSlot(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white">✕</button>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#f0b90b]/10 border border-[#f0b90b]/20 flex items-center justify-center">
                                <Ticket className="text-[#f0b90b]" />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-white">Slot #{editingSlot + 1} Yönetimi</h4>
                                <p className="text-xs text-zinc-500">Bu slotu bir kullanıcıya atayın veya boşaltın.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {ticketPool.find(t => t.slot === editingSlot) ? (
                                <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 mb-4">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">ŞU ANKİ SAHİBİ</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-[#f0b90b]">
                                                {ticketPool.find(t => t.slot === editingSlot)?.username[0].toUpperCase()}
                                            </div>
                                            <span className="font-black text-white">{ticketPool.find(t => t.slot === editingSlot)?.username}</span>
                                        </div>
                                        <button onClick={() => { handleRemoveTicket(editingSlot); setEditingSlot(null); }} className="text-xs font-bold text-red-500">BILETI KALDIR</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase ml-1 block mb-2">KULLANICI ATAMA</label>
                                    <div className="flex gap-2">
                                        <input 
                                            value={assignUserId} 
                                            onChange={e => setAssignUserId(e.target.value)}
                                            placeholder="User ID veya Kullanıcı Adı" 
                                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white" 
                                        />
                                        <button onClick={handleAssignTicket} className="bg-[#f0b90b] text-black px-4 rounded-xl flex items-center justify-center">
                                            <UserPlus size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-zinc-600 mt-2 px-1">* Kullanıcı adı tam eşleşmelidir.</p>
                                </div>
                            )}

                            <button onClick={() => setEditingSlot(null)} className="w-full py-3 bg-zinc-800 text-white rounded-xl text-xs font-bold mt-4 hover:bg-zinc-700">
                                KAPAT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRaffleTab;
