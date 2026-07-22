import React, { useState } from 'react';
import { 
    ClipboardList, Search, Filter, ShieldAlert, ArrowUpRight, 
    Settings, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';

interface AuditLog {
    id: string;
    timestamp: Date;
    adminName: string;
    role: 'SUPER_ADMIN' | 'SUPPORT' | 'MODERATOR';
    actionType: 'BAKİYE_EKLEME' | 'ÇEKİM_ONAYLAMA' | 'AYAR_DEĞİŞTİRME' | 'KULLANICI_YASAKLAMA' | 'RTP_GÜNCELLEME';
    target: string;
    details: string;
}

const mockLogs: AuditLog[] = [
    { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 5), adminName: 'alex_admin', role: 'SUPER_ADMIN', actionType: 'ÇEKİM_ONAYLAMA', target: 'whale_007', details: 'Kullanıcının 125.000₺ değerindeki (1.85 BTC) çekim talebi onaylandı.' },
    { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 18), adminName: 'support_ayse', role: 'SUPPORT', actionType: 'BAKİYE_EKLEME', target: 'crypto_king', details: 'Sistemsel hata telafisi olarak 500₺ bakiye eklendi.' },
    { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 45), adminName: 'alex_admin', role: 'SUPER_ADMIN', actionType: 'RTP_GÜNCELLEME', target: 'Sistem - Global RTP', details: 'Global RTP oranı %95 seviyesinden %94 seviyesine çekildi. (Master PIN ile onaylandı)' },
    { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 120), adminName: 'mod_burak', role: 'MODERATOR', actionType: 'KULLANICI_YASAKLAMA', target: 'anon_user', details: 'Sohbet kanalında spam sebebiyle 24 saatlik ban atıldı.' },
    { id: '5', timestamp: new Date(Date.now() - 1000 * 60 * 180), adminName: 'alex_admin', role: 'SUPER_ADMIN', actionType: 'AYAR_DEĞİŞTİRME', target: 'Kampanyalar', details: '100.000$ Haftalık Yarış havuzu aktif edildi.' },
    { id: '6', timestamp: new Date(Date.now() - 1000 * 60 * 300), adminName: 'support_ayse', role: 'SUPPORT', actionType: 'BAKİYE_EKLEME', target: 'lucky_strike', details: 'Kullanıcıya %10 Kayıp Bonusu (250₺) tanımlandı.' },
    { id: '7', timestamp: new Date(Date.now() - 1000 * 60 * 500), adminName: 'alex_admin', role: 'SUPER_ADMIN', actionType: 'ÇEKİM_ONAYLAMA', target: 'bet_master99', details: 'Kullanıcının 8.500₺ değerindeki çekim talebi onaylandı.' },
    { id: '8', timestamp: new Date(Date.now() - 1000 * 60 * 750), adminName: 'mod_burak', role: 'MODERATOR', actionType: 'KULLANICI_YASAKLAMA', target: 'scammer_x', details: 'Multi-account tespiti sebebiyle kalıcı olarak uzaklaştırıldı.' },
    { id: '9', timestamp: new Date(Date.now() - 1000 * 60 * 1200), adminName: 'alex_admin', role: 'SUPER_ADMIN', actionType: 'AYAR_DEĞİŞTİRME', target: 'Sistem - Chat', details: 'Rain (Yağmur) etkinliği başlatıldı (5000₺ havuz, 100 kişi).' },
    { id: '10', timestamp: new Date(Date.now() - 1000 * 60 * 1440), adminName: 'support_ayse', role: 'SUPPORT', actionType: 'BAKİYE_EKLEME', target: 'slot_hunter', details: 'Canlı destek üzerinden manuel 100₺ eklendi.' }
];

export default function AdminAuditLogsTab() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<string>('ALL');

    const actionTypes = ['ALL', 'BAKİYE_EKLEME', 'ÇEKİM_ONAYLAMA', 'AYAR_DEĞİŞTİRME', 'KULLANICI_YASAKLAMA', 'RTP_GÜNCELLEME'];

    const filteredLogs = mockLogs.filter(log => {
        const matchSearch = log.adminName.toLowerCase().includes(search.toLowerCase()) || 
                            log.target.toLowerCase().includes(search.toLowerCase()) || 
                            log.details.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filterType === 'ALL' || log.actionType === filterType;
        return matchSearch && matchFilter;
    });

    const getActionIcon = (type: string) => {
        switch(type) {
            case 'BAKİYE_EKLEME': return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
            case 'ÇEKİM_ONAYLAMA': return <CheckCircle2 className="w-4 h-4 text-amber-400" />;
            case 'AYAR_DEĞİŞTİRME': return <Settings className="w-4 h-4 text-indigo-400" />;
            case 'KULLANICI_YASAKLAMA': return <ShieldAlert className="w-4 h-4 text-red-400" />;
            case 'RTP_GÜNCELLEME': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
            default: return <ClipboardList className="w-4 h-4 text-zinc-400" />;
        }
    };

    const getActionColor = (type: string) => {
        switch(type) {
            case 'BAKİYE_EKLEME': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'ÇEKİM_ONAYLAMA': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'AYAR_DEĞİŞTİRME': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'KULLANICI_YASAKLAMA': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'RTP_GÜNCELLEME': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
        }
    };

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-indigo-500" />
                        İşlem Kayıtları (Audit Logs)
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">Sistem üzerindeki tüm idari eylemlerin değiştirilemez kayıtları.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder="Yönetici, hedef veya detay ara..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#111318] border border-zinc-800 text-white text-sm rounded-lg pl-9 pr-4 py-2.5 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                    
                    {/* Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <select 
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="bg-[#111318] border border-zinc-800 text-white text-sm rounded-lg pl-9 pr-8 py-2.5 outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                        >
                            {actionTypes.map(type => (
                                <option key={type} value={type}>{type === 'ALL' ? 'Tüm İşlemler' : type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="flex-1 bg-[#111318] border border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-[#1a1d24] border-b border-zinc-800">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tarih / Saat</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Yönetici Adı</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">İşlem Türü</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hedef</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Detay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-zinc-500 font-medium">
                                        Eşleşen işlem kaydı bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-zinc-300">
                                                {log.timestamp.toLocaleDateString('tr-TR')}
                                            </div>
                                            <div className="text-xs text-zinc-500 font-mono">
                                                {log.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-400">
                                                    {log.adminName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{log.adminName}</div>
                                                    <div className={`text-[10px] font-black tracking-wider ${
                                                        log.role === 'SUPER_ADMIN' ? 'text-indigo-400' : 
                                                        log.role === 'SUPPORT' ? 'text-emerald-400' : 'text-amber-400'
                                                    }`}>
                                                        {log.role}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border ${getActionColor(log.actionType)}`}>
                                                {getActionIcon(log.actionType)}
                                                {log.actionType.replace(/_/g, ' ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-zinc-300 font-medium bg-zinc-800/50 px-2 py-1 rounded">{log.target}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-zinc-400 leading-snug max-w-lg">{log.details}</p>
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
