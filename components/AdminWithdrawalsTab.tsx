import React, { useState, useEffect } from 'react';
import { 
    Wallet, ArrowDownToLine, ArrowUpFromLine, Bitcoin, ShieldAlert, ShieldCheck, 
    Check, X, Loader2, AlertCircle, Clock
} from 'lucide-react';

interface WithdrawalRequest {
    id: string;
    date: Date;
    username: string;
    amountTry: number;
    amountCrypto: number;
    cryptoSymbol: string;
    network: string;
    walletAddress: string;
    riskScore: 'safe' | 'risky';
    riskReason?: string;
    status: 'pending' | 'processing' | 'approved' | 'rejected';
}

export default function AdminWithdrawalsTab() {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    
    // Mock Hot Wallet Balances
    const hotWallets = [
        { name: 'USDT (Tether)', balance: 145250.50, usdValue: 145250.50, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { name: 'Bitcoin (BTC)', balance: 2.45, usdValue: 165000.00, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { name: 'Ethereum (ETH)', balance: 34.2, usdValue: 112000.00, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    ];

    useEffect(() => {
        // Generate mock pending withdrawals
        const mockData: WithdrawalRequest[] = [
            {
                id: 'w_1', date: new Date(Date.now() - 1000 * 60 * 5),
                username: 'crypto_king', amountTry: 15000, amountCrypto: 485.20, cryptoSymbol: 'USDT',
                network: 'TRC20', walletAddress: 'TKh...9vL2p', riskScore: 'safe', status: 'pending'
            },
            {
                id: 'w_2', date: new Date(Date.now() - 1000 * 60 * 15),
                username: 'whale_007', amountTry: 125000, amountCrypto: 1.85, cryptoSymbol: 'BTC',
                network: 'Bitcoin', walletAddress: 'bc1q...x2a', riskScore: 'risky', riskReason: 'Çevrim şartı eksik (%85)', status: 'pending'
            },
            {
                id: 'w_3', date: new Date(Date.now() - 1000 * 60 * 45),
                username: 'lucky99', amountTry: 2500, amountCrypto: 80.90, cryptoSymbol: 'USDT',
                network: 'ERC20', walletAddress: '0x71...C9bA', riskScore: 'safe', status: 'pending'
            },
            {
                id: 'w_4', date: new Date(Date.now() - 1000 * 60 * 120),
                username: 'anon_user', amountTry: 8500, amountCrypto: 0.12, cryptoSymbol: 'ETH',
                network: 'ERC20', walletAddress: '0x44...8dF1', riskScore: 'risky', riskReason: 'Farklı IP adresi girişi tespit edildi.', status: 'pending'
            }
        ];
        setRequests(mockData);
    }, []);

    const formatTRY = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
    const formatUSD = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        // Set to processing
        setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'processing' } : req));
        
        // Simulate API delay
        setTimeout(() => {
            setRequests(prev => prev.map(req => req.id === id ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req));
            
            // Remove from list after showing the success state briefly
            setTimeout(() => {
                setRequests(prev => prev.filter(req => req.id !== id));
            }, 2000);
        }, 1500);
    };

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-indigo-400" />
                    Çekim Talepleri & Kasa
                </h2>
                <p className="text-sm text-zinc-400 mt-1">Sıcak cüzdan likidite durumu ve bekleyen çekim onayları</p>
            </div>

            {/* TOP: Hot Wallet Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {hotWallets.map((wallet, i) => (
                    <div key={i} className="bg-[#111318] border border-zinc-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 ${wallet.bg} rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:opacity-100 opacity-50`}></div>
                        
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{wallet.name}</span>
                            <div className={`p-2 rounded-lg ${wallet.bg}`}>
                                <Wallet className={`w-4 h-4 ${wallet.color}`} />
                            </div>
                        </div>
                        
                        <div className="relative z-10">
                            <div className="text-2xl font-black text-white font-mono mb-1">
                                {wallet.balance.toLocaleString()} <span className="text-sm text-zinc-500 font-medium">{wallet.name.split(' ')[0] === 'USDT' ? '' : wallet.name.split(' ')[0]}</span>
                            </div>
                            <div className="text-sm text-zinc-500 font-mono">
                                ≈ {formatUSD(wallet.usdValue)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* BOTTOM: Pending Withdrawals Table */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#111318] border border-zinc-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-800 bg-[#15171e] flex items-center justify-between">
                    <h3 className="font-bold text-zinc-300 text-sm flex items-center gap-2 uppercase tracking-wider">
                        <ArrowUpFromLine className="w-4 h-4 text-amber-400" /> 
                        Onay Bekleyen Talepler
                    </h3>
                    <div className="bg-amber-500/10 text-amber-500 text-xs font-black px-2 py-1 rounded border border-amber-500/20">
                        {requests.filter(r => r.status === 'pending').length} TALEP
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#1a1d24] border-b border-zinc-800">
                                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Kullanıcı</th>
                                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Miktar</th>
                                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Ağ & Cüzdan</th>
                                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Risk Skoru</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-zinc-500">
                                        <Check className="w-8 h-8 text-emerald-500/50 mx-auto mb-3" />
                                        <p className="font-medium">Tüm çekim talepleri onaylandı.</p>
                                    </td>
                                </tr>
                            ) : (
                                requests.map(req => (
                                    <tr 
                                        key={req.id} 
                                        className={`transition-all duration-500 ${
                                            req.status === 'approved' ? 'bg-emerald-500/20 border-l-4 border-emerald-500' : 
                                            req.status === 'rejected' ? 'bg-red-500/20 border-l-4 border-red-500' :
                                            req.status === 'processing' ? 'bg-zinc-800/50 opacity-50' :
                                            'hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-zinc-300 font-medium flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                                                {req.date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit' })}
                                            </div>
                                            <div className="text-xs text-zinc-500">{req.date.toLocaleDateString('tr-TR')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-white">{req.username}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-white font-mono">{formatTRY(req.amountTry)}</div>
                                            <div className="text-xs text-zinc-500 font-mono">{req.amountCrypto.toLocaleString()} {req.cryptoSymbol}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded inline-block mb-1 border border-indigo-500/20">
                                                {req.network}
                                            </div>
                                            <div className="text-xs text-zinc-400 font-mono truncate max-w-[150px]">{req.walletAddress}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {req.riskScore === 'safe' ? (
                                                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> GÜVENLİ
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20 mb-1">
                                                        <ShieldAlert className="w-3.5 h-3.5" /> RİSKLİ - İNCELE
                                                    </div>
                                                    <div className="text-[10px] text-zinc-400 flex items-start gap-1 max-w-[200px] leading-tight">
                                                        <AlertCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                                                        {req.riskReason}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            {req.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleAction(req.id, 'reject')}
                                                        className="p-2 text-red-400 hover:text-white hover:bg-red-500 border border-red-500/30 rounded-lg transition-all"
                                                        title="Reddet"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(req.id, 'approve')}
                                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                                                    >
                                                        <Check className="w-4 h-4" /> Onayla
                                                    </button>
                                                </div>
                                            ) : req.status === 'processing' ? (
                                                <div className="inline-flex items-center gap-2 text-zinc-400 font-medium text-sm">
                                                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> İşleniyor...
                                                </div>
                                            ) : req.status === 'approved' ? (
                                                <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm">
                                                    <Check className="w-4 h-4" /> Onaylandı
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 text-red-400 font-bold text-sm">
                                                    <X className="w-4 h-4" /> Reddedildi
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
