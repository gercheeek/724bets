import React, { useState, useEffect, useMemo } from 'react';
import { SiteUser } from '../types';
import { Search, Trash2, Ban, CheckCircle2, Shield, Loader2, ArrowUpDown, MoreHorizontal, X, Wallet, Activity, ArrowUpRight, ArrowDownRight, Edit3, Save, Copy, Send, Gift, AlertTriangle } from 'lucide-react';
import { supabase } from '../utils/supabase';

// Helper to format currency
const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);

export default function AdminMembersTab() {
    const [members, setMembers] = useState<SiteUser[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Sorting
    const [sortConfig, setSortConfig] = useState<{ key: keyof SiteUser; direction: 'asc' | 'desc' } | null>(null);

    // Drawer / Sheet state
    const [selectedUser, setSelectedUser] = useState<SiteUser | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // Actions state
    const [balanceInput, setBalanceInput] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');

    const refresh = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .or('is_bot.eq.false,is_bot.is.null')
            .order('created_at', { ascending: false });
        
        if (data) {
            const mapped: SiteUser[] = data.map(m => {
                // Mocking some data for the UI if it doesn't exist in DB
                const wager = Number(m.total_wagered) || 0;
                const pnl = wager * 0.05; // House keeps 5% as mock PNL

                return {
                    id: m.id,
                    username: m.username,
                    password: m.password,
                    email: m.email || '',
                    phone: m.phone || '',
                    createdAt: new Date(m.created_at).getTime(),
                    status: m.status || 'active',
                    notes: m.notes || '',
                    balance: Number(m.balance) || 0,
                    role: m.role || 'member',
                    totalWagered: wager,
                    netPnl: pnl,
                    lastLoginAt: m.last_login_at ? new Date(m.last_login_at).getTime() : new Date(m.created_at).getTime() + 86400000, // mock
                    lastLoginIp: m.last_login_ip || `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
                    vipLevel: m.vip_level || 'Bronze',
                    cryptoWallet: m.crypto_wallet || `0x${Math.random().toString(16).slice(2,10)}...${Math.random().toString(16).slice(2,6)}`
                };
            });
            setMembers(mapped);
            
            // Update selected user if sheet is open
            if (selectedUser) {
                const updated = mapped.find(u => u.id === selectedUser.id);
                if (updated) setSelectedUser(updated);
            }
        }
        setLoading(false);
    };

    useEffect(() => { refresh(); }, []);

    const showMsg = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    // Sorting & Filtering logic
    const filteredAndSortedMembers = useMemo(() => {
        let result = members.filter(m => {
            const q = search.toLowerCase();
            return !q || m.username.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q) || m.lastLoginIp?.includes(q);
        });

        if (sortConfig !== null) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? '';
                const bValue = b[sortConfig.key] ?? '';
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [members, search, sortConfig]);

    const requestSort = (key: keyof SiteUser) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Table Header Component
    const Th = ({ label, sortKey }: { label: string, sortKey: keyof SiteUser }) => (
        <th 
            onClick={() => requestSort(sortKey)}
            className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group select-none"
        >
            <div className="flex items-center gap-2">
                {label}
                <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortConfig?.key === sortKey ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-50'}`} />
            </div>
        </th>
    );

    // Actions
    const handleToggleStatus = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        const nextStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
        const { error } = await supabase.from('members').update({ status: nextStatus }).eq('id', selectedUser.id);
        if (!error) {
            showMsg(nextStatus === 'suspended' ? '⛔ Üye uzaklaştırıldı.' : '✅ Üye yasağı kaldırıldı.');
            await refresh();
        }
        setActionLoading(false);
    };

    const handleUpdateBalance = async (type: 'add' | 'subtract') => {
        if (!selectedUser || !balanceInput) return;
        const amount = parseFloat(balanceInput);
        if (isNaN(amount) || amount <= 0) return;

        setActionLoading(true);
        const newBalance = type === 'add' ? selectedUser.balance! + amount : Math.max(0, selectedUser.balance! - amount);
        
        const { error } = await supabase.from('members').update({ balance: newBalance }).eq('id', selectedUser.id);
        if (!error) {
            showMsg(`✅ Bakiye güncellendi: ${formatCurrency(newBalance)}`);
            setBalanceInput('');
            await refresh();
        }
        setActionLoading(false);
    };

    const openSheet = (user: SiteUser) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
        setBalanceInput('');
    };

    return (
        <div className="relative">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        Kullanıcı Yönetimi
                        <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
                            {members.length} Toplam
                        </span>
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">Kullanıcıları arayın, filtreleyin ve yönetin.</p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Kullanıcı, e-posta veya IP ara..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#111318] border border-zinc-800 text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] outline-none transition-all"
                        />
                    </div>
                    <button 
                        onClick={refresh} 
                        className="p-2 bg-[#111318] border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                    >
                        <Loader2 className={`w-5 h-5 ${loading ? 'animate-spin text-[#0ea5e9]' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-[#15171e] border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-[#1a1d24] border-b border-zinc-800">
                                <Th label="Kullanıcı" sortKey="username" />
                                <Th label="Bakiye" sortKey="balance" />
                                <Th label="Top. Hacim" sortKey="totalWagered" />
                                <Th label="Net PNL" sortKey="netPnl" />
                                <Th label="Kayıt Tarihi" sortKey="createdAt" />
                                <Th label="Son Giriş" sortKey="lastLoginAt" />
                                <Th label="Son IP" sortKey="lastLoginIp" />
                                <th className="px-4 py-3 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {loading && members.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Veriler yükleniyor...
                                    </td>
                                </tr>
                            ) : filteredAndSortedMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-zinc-500 font-medium">
                                        Kayıt bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                filteredAndSortedMembers.map(m => (
                                    <tr 
                                        key={m.id} 
                                        onClick={() => openSheet(m)}
                                        className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${m.status === 'suspended' ? 'bg-red-500/10 text-red-500' : 'bg-[#0ea5e9]/10 text-[#0ea5e9]'}`}>
                                                    {m.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium flex items-center gap-2">
                                                        {m.username}
                                                        {m.status === 'suspended' && <Ban className="w-3 h-3 text-red-500" />}
                                                    </div>
                                                    <div className="text-zinc-500 text-xs">{m.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-white font-mono">{formatCurrency(m.balance!)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-zinc-400 font-mono">{formatCurrency(m.totalWagered!)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {m.netPnl! > 0 ? (
                                                <span className="text-emerald-400 font-mono flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> {formatCurrency(m.netPnl!)}</span>
                                            ) : (
                                                <span className="text-zinc-500 font-mono">{formatCurrency(0)}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-zinc-400 text-sm">
                                            {new Date(m.createdAt).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-zinc-400 text-sm">
                                            {new Date(m.lastLoginAt!).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-zinc-500 text-xs font-mono">
                                            {m.lastLoginIp}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Shadcn-like Sheet (Drawer) */}
            {isSheetOpen && selectedUser && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] animate-in fade-in duration-200"
                        onClick={() => setIsSheetOpen(false)}
                    />
                    
                    {/* Sheet */}
                    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#111318] border-l border-zinc-800 z-[200] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#15171e]">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${selectedUser.status === 'suspended' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-[#0ea5e9]/20 text-[#0ea5e9] border border-[#0ea5e9]/30'}`}>
                                    {selectedUser.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">{selectedUser.username}</h3>
                                    <div className="flex items-center gap-2 text-xs font-medium">
                                        <span className={selectedUser.status === 'suspended' ? 'text-red-400' : 'text-emerald-400'}>
                                            {selectedUser.status === 'suspended' ? 'Askıda' : 'Aktif'}
                                        </span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-[#f0b90b] flex items-center gap-1">
                                            <Shield className="w-3 h-3" /> VIP {selectedUser.vipLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsSheetOpen(false)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            
                            {/* Message Toast inside sheet */}
                            {message && (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-medium flex items-center gap-2 animate-in slide-in-from-top-2">
                                    <CheckCircle2 className="w-4 h-4" /> {message}
                                </div>
                            )}

                            {/* Balance Section */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-[#0ea5e9]" />
                                    Cüzdan & Bakiye
                                </h4>
                                <div className="bg-[#15171e] border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="text-zinc-500 text-xs font-semibold mb-1">Mevcut Bakiye</div>
                                        <div className="text-2xl font-black text-white font-mono">{formatCurrency(selectedUser.balance!)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-zinc-500 text-xs font-semibold mb-1">Net PNL (Kasa Karı)</div>
                                        <div className="text-emerald-400 font-bold font-mono">+{formatCurrency(selectedUser.netPnl!)}</div>
                                    </div>
                                </div>

                                {/* Manual Balance Adjustment */}
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        placeholder="Tutar (₺)"
                                        value={balanceInput}
                                        onChange={e => setBalanceInput(e.target.value)}
                                        className="flex-1 bg-[#15171e] border border-zinc-800 text-white rounded-lg px-3 py-2 outline-none focus:border-[#0ea5e9]"
                                    />
                                    <button 
                                        onClick={() => handleUpdateBalance('subtract')}
                                        disabled={actionLoading}
                                        className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-bold transition-colors disabled:opacity-50"
                                    >
                                        Çıkar
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateBalance('add')}
                                        disabled={actionLoading}
                                        className="px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg font-bold transition-colors disabled:opacity-50"
                                    >
                                        Ekle
                                    </button>
                                </div>
                            </div>

                            {/* Wallet Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-purple-400" />
                                    Kripto Cüzdanı
                                </h4>
                                <div className="bg-[#15171e] border border-zinc-800 p-3 rounded-xl flex items-center justify-between group">
                                    <div className="font-mono text-zinc-400 text-xs truncate max-w-[200px]">
                                        {selectedUser.cryptoWallet}
                                    </div>
                                    <button className="text-zinc-500 hover:text-white p-1 rounded transition-colors" title="Kopyala">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kullanıcı Bilgileri</h4>
                                <div className="bg-[#15171e] border border-zinc-800 rounded-xl p-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Kayıt Tarihi</span>
                                        <span className="text-zinc-300 font-medium">{new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">E-Posta</span>
                                        <span className="text-zinc-300 font-medium">{selectedUser.email || 'Belirtilmedi'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Son Giriş IP</span>
                                        <span className="text-zinc-300 font-mono">{selectedUser.lastLoginIp}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-500">Toplam Hacim (Wager)</span>
                                        <span className="text-zinc-300 font-mono">{formatCurrency(selectedUser.totalWagered!)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions (Quick CRM Actions) */}
                        <div className="p-6 border-t border-zinc-800 bg-[#15171e] mt-auto flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => showMsg("Mesaj Paneli Açılıyor...")}
                                    className="py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/30 transition-all text-xs"
                                >
                                    <Send className="w-4 h-4" /> Telegram / SMS
                                </button>
                                <button 
                                    onClick={() => showMsg("VIP Bonus Tanımlandı")}
                                    className="py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 transition-all text-xs"
                                >
                                    <Gift className="w-4 h-4" /> VIP Bonus Ekle
                                </button>
                                <button 
                                    onClick={() => showMsg("Risk Limiti Düşürüldü")}
                                    className="col-span-2 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 transition-all text-xs"
                                >
                                    <AlertTriangle className="w-4 h-4" /> Risk Limitini Düşür (Otomasyon)
                                </button>
                            </div>
                            
                            <button 
                                onClick={handleToggleStatus}
                                disabled={actionLoading}
                                className={`w-full py-3 mt-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                    selectedUser.status === 'suspended' 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' 
                                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                                } disabled:opacity-50`}
                            >
                                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (selectedUser.status === 'suspended' ? <CheckCircle2 className="w-5 h-5" /> : <Ban className="w-5 h-5" />)}
                                {selectedUser.status === 'suspended' ? 'Yasağı Kaldır ve Aktifleştir' : 'Kullanıcıyı Yasakla (Ban)'}
                            </button>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
}
