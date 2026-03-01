import React, { useState, useEffect } from 'react';
import { SiteUser, UserLoyalty, PaymentRequest } from '../types';
import {
    Users, Search, Trash2, Ban, CheckCircle2, Coins, Ticket,
    Mail, Phone, ChevronDown, ChevronUp, Edit3, Save, X, Plus, Eye
} from 'lucide-react';

function getAllMembers(): SiteUser[] {
    try { return JSON.parse(localStorage.getItem('site_members') || '[]'); } catch { return []; }
}
function saveMember(updated: SiteUser) {
    const members = getAllMembers().map(m => m.id === updated.id ? updated : m);
    localStorage.setItem('site_members', JSON.stringify(members));
}
function deleteMember(id: string) {
    const members = getAllMembers().filter(m => m.id !== id);
    localStorage.setItem('site_members', JSON.stringify(members));
}
function getMemberLoyalty(userId: string): UserLoyalty {
    const stored = localStorage.getItem(`loyalty_${userId}`);
    if (stored) return JSON.parse(stored);
    return { userId, coins: 0, pendingTickets: 0, tickets: 0, totalEarned: 0, transactions: [], lastVolumeResetDate: '', dailyVolumeAccumulated: 0 };
}
function setMemberLoyalty(loyalty: UserLoyalty) {
    localStorage.setItem(`loyalty_${loyalty.userId}`, JSON.stringify(loyalty));
}
function getPaymentRequests(): PaymentRequest[] {
    try { return JSON.parse(localStorage.getItem('site_payment_requests') || '[]'); } catch { return []; }
}

interface MemberRowProps {
    member: SiteUser;
    onRefresh: () => void;
}

const MemberRow: React.FC<MemberRowProps> = ({ member, onRefresh }) => {
    const [expanded, setExpanded] = useState(false);
    const [loyalty, setLoyalty] = useState<UserLoyalty>(() => getMemberLoyalty(member.id));
    const [editNotes, setEditNotes] = useState(member.notes || '');
    const [manualCoins, setManualCoins] = useState('');
    const [manualTickets, setManualTickets] = useState('');
    const [msg, setMsg] = useState('');

    const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

    const handleToggleStatus = () => {
        const next: SiteUser = { ...member, status: member.status === 'suspended' ? 'active' : 'suspended' };
        saveMember(next);
        showMsg(next.status === 'suspended' ? '⛔ Üye askıya alındı.' : '✅ Üye aktifleştirildi.');
        onRefresh();
    };

    const handleDeleteMember = () => {
        if (!window.confirm(`"${member.username}" üyesini silmek istediğinizden emin misiniz?`)) return;
        deleteMember(member.id);
        onRefresh();
    };

    const handleSaveNotes = () => {
        saveMember({ ...member, notes: editNotes });
        showMsg('✅ Not kaydedildi.');
        onRefresh();
    };

    const handleAddCoins = () => {
        const n = Number(manualCoins);
        if (!n || n <= 0) return;
        const updated: UserLoyalty = { ...loyalty, coins: loyalty.coins + n, totalEarned: loyalty.totalEarned + n, transactions: [{ id: String(Date.now()), userId: member.id, type: 'earn', amount: n, reason: 'Admin tarafından manuel eklendi', timestamp: Date.now() }, ...loyalty.transactions].slice(0, 50) };
        setMemberLoyalty(updated); setLoyalty(updated); setManualCoins('');
        showMsg(`✅ ${n} Coin eklendi.`);
    };

    const handleAddTickets = () => {
        const n = Number(manualTickets);
        if (!n || n <= 0) return;
        const updated: UserLoyalty = { ...loyalty, tickets: loyalty.tickets + n, transactions: [{ id: String(Date.now()), userId: member.id, type: 'earn', amount: 0, tickets: n, reason: 'Admin tarafından manuel bilet eklendi', timestamp: Date.now() }, ...loyalty.transactions].slice(0, 50) };
        setMemberLoyalty(updated); setLoyalty(updated); setManualTickets('');
        showMsg(`✅ ${n} Bilet eklendi.`);
    };

    const payments = getPaymentRequests().filter(p => p.userId === member.id);

    return (
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${member.status === 'suspended' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
            {/* Row Summary */}
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-all" onClick={() => setExpanded(e => !e)}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm"
                    style={{ background: member.status === 'suspended' ? 'rgba(239,68,68,0.1)' : 'rgba(240,185,11,0.1)', color: member.status === 'suspended' ? '#ef4444' : '#f0b90b' }}>
                    {member.username[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-black text-sm">{member.username}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full 
                            ${member.status === 'suspended' ? 'bg-red-500/10 text-red-400'
                                : member.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400'
                                    : 'bg-green-500/10 text-green-400'}`}>
                            {member.status === 'suspended' ? '⛔ ASKIDA' : member.status === 'pending' ? '⏳ BEKLİYOR' : '✅ AKTİF'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-zinc-600 text-[10px] flex items-center gap-1"><Mail className="w-3 h-3" />{member.email || '—'}</span>
                        <span className="text-zinc-600 text-[10px] flex items-center gap-1"><Phone className="w-3 h-3" />{member.phone || '—'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-[#f0b90b] font-black text-xs justify-end"><Coins className="w-3 h-3" />{loyalty.coins}</div>
                        <div className="flex items-center gap-1 text-purple-400 font-black text-[10px] justify-end"><Ticket className="w-3 h-3" />{loyalty.tickets} bilet</div>
                    </div>
                    <span className="text-zinc-700 text-[10px] font-bold hidden md:block">{new Date(member.createdAt).toLocaleDateString('tr-TR')}</span>
                    {expanded ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
                </div>
            </div>

            {/* Expanded Detail */}
            {expanded && (
                <div className="px-4 pb-4 border-t border-zinc-800/50 pt-3 space-y-3">
                    {msg && <div className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-green-500/10 border border-green-500/20">{msg}</div>}

                    {/* Manual coins/tickets */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(240,185,11,0.05)', border: '1px solid rgba(240,185,11,0.12)' }}>
                            <label className="text-zinc-500 text-[10px] font-black">Manuel Coin Ekle</label>
                            <div className="flex gap-2">
                                <input type="number" min={1} value={manualCoins} onChange={e => setManualCoins(e.target.value)}
                                    placeholder="Miktar" className="flex-1 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-bold outline-none w-0" />
                                <button onClick={handleAddCoins} className="px-3 py-1.5 rounded-lg font-black text-[10px] text-black bg-[#f0b90b] hover:bg-[#f0b90b]/80 transition-all"><Plus className="w-3 h-3" /></button>
                            </div>
                        </div>
                        <div className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
                            <label className="text-zinc-500 text-[10px] font-black">Manuel Bilet Ekle</label>
                            <div className="flex gap-2">
                                <input type="number" min={1} value={manualTickets} onChange={e => setManualTickets(e.target.value)}
                                    placeholder="Adet" className="flex-1 px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-bold outline-none w-0" />
                                <button onClick={handleAddTickets} className="px-3 py-1.5 rounded-lg font-black text-[10px] text-white bg-purple-500 hover:bg-purple-400 transition-all"><Plus className="w-3 h-3" /></button>
                            </div>
                        </div>
                    </div>

                    {/* Ticket history */}
                    {loyalty.transactions.filter(t => t.tickets && t.tickets > 0).length > 0 && (
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <div className="text-zinc-600 text-[10px] font-black uppercase mb-2">Bilet Geçmişi</div>
                            {loyalty.transactions.filter(t => t.tickets && t.tickets > 0).slice(0, 5).map(tx => (
                                <div key={tx.id} className="flex items-center justify-between py-1 border-b border-zinc-800/30 last:border-0">
                                    <span className="text-zinc-500 text-[10px]">{tx.reason}</span>
                                    <span className="text-purple-400 font-black text-[10px]">+{tx.tickets} 🎟️</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Payment count */}
                    {payments.length > 0 && (
                        <div className="text-zinc-600 text-[10px] font-bold px-1">💳 {payments.length} ödeme talebi ({payments.filter(p => p.status === 'pending').length} beklemede)</div>
                    )}

                    {/* Notes */}
                    <div className="flex gap-2">
                        <input type="text" value={editNotes} onChange={e => setEditNotes(e.target.value)}
                            placeholder="Yönetici notu..." className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold outline-none" />
                        <button onClick={handleSaveNotes} className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white transition-all"><Save className="w-3.5 h-3.5" /></button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                        {member.status === 'pending' ? (
                            <button onClick={() => { saveMember({ ...member, status: 'active' }); showMsg('✅ Üye onaylandı.'); onRefresh(); }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-[10px] uppercase transition-all bg-[#f0b90b] text-black hover:bg-[#f0b90b]/90 hover:scale-105">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Onayla
                            </button>
                        ) : (
                            <button onClick={handleToggleStatus}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${member.status === 'suspended' ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'}`}>
                                {member.status === 'suspended' ? <><CheckCircle2 className="w-3.5 h-3.5" /> Aktifleştir</> : <><Ban className="w-3.5 h-3.5" /> Askıya Al</>}
                            </button>
                        )}
                        <button onClick={handleDeleteMember}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-[10px] uppercase text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all">
                            <Trash2 className="w-3.5 h-3.5" /> Sil
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

interface AdminMembersTabProps { coinName?: string; }

const AdminMembersTab: React.FC<AdminMembersTabProps> = ({ coinName = 'Coin' }) => {
    const [members, setMembers] = useState<SiteUser[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');

    const refresh = () => setMembers(getAllMembers().sort((a, b) => b.createdAt - a.createdAt));
    useEffect(() => { refresh(); }, []);

    const filtered = members.filter(m => {
        const q = search.toLowerCase();
        const matchSearch = !q || m.username.toLowerCase().includes(q) || m.email?.includes(q) || m.phone?.includes(q);
        const matchFilter = filter === 'all' ||
            (filter === 'active' && m.status !== 'suspended' && m.status !== 'pending') ||
            m.status === filter;
        return matchSearch && matchFilter;
    });

    const totalCoins = members.reduce((sum, m) => sum + getMemberLoyalty(m.id).coins, 0);
    const totalTickets = members.reduce((sum, m) => sum + getMemberLoyalty(m.id).tickets, 0);

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <span className="text-3xl">👥</span>
                <div>
                    <h2 className="text-white font-black text-xl uppercase tracking-tight">Üye Yönetimi</h2>
                    <p className="text-zinc-500 text-xs font-bold">Tüm kayıtlı üyeler</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Toplam Üye', value: members.length, color: '#f0b90b' },
                    { label: `Toplam ${coinName}`, value: totalCoins.toLocaleString('tr'), color: '#f0b90b' },
                    { label: 'Toplam Bilet', value: totalTickets, color: '#a78bfa' },
                ].map((s, i) => (
                    <div key={i} className="p-3 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="font-black text-xl" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-0.5">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex gap-2 flex-wrap">
                <div className="flex-1 relative min-w-40">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Kullanıcı adı, e-posta, telefon..." className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold outline-none focus:border-zinc-700" />
                </div>
                {(['all', 'pending', 'active', 'suspended'] as const).map(f => {
                    const count = f === 'all' ? members.length
                        : f === 'active' ? members.filter(m => m.status !== 'suspended' && m.status !== 'pending').length
                            : members.filter(m => m.status === f).length;

                    return (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-3 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${filter === f ? 'bg-[#f0b90b] text-black' : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700'}`}>
                            {f === 'all' ? 'Tümü' : f === 'pending' ? 'Bekleyen' : f === 'active' ? 'Aktif' : 'Askıda'} ({count})
                        </button>
                    )
                })}
            </div>

            {/* List */}
            <div className="space-y-2">
                {filtered.length === 0 ? (
                    <div className="text-center py-12 text-zinc-700 font-bold text-sm">
                        {members.length === 0 ? '👤 Henüz kayıtlı üye yok' : '🔍 Sonuç bulunamadı'}
                    </div>
                ) : filtered.map(m => (
                    <MemberRow key={m.id} member={m} onRefresh={refresh} />
                ))}
            </div>
        </div>
    );
};

export default AdminMembersTab;
