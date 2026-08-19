import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Lock, X, RefreshCw, AlertCircle, Ban } from 'lucide-react';

interface FraudAlert {
    id: string;
    severity: string;
    reason: string;
    isResolved: boolean;
    createdAt: string;
    user: {
        id: string;
        username: string;
        riskScore: number;
        status: string;
    };
}

export default function AdminFraudTab() {
    const [alerts, setAlerts] = useState<FraudAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [resolvingId, setResolvingId] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [scanMessage, setScanMessage] = useState('');

    const fetchAlerts = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/admin/fraud');
            const data = await res.json();
            if (data.success) {
                setAlerts(data.alerts);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching fraud alerts:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleResolve = async (id: string) => {
        setResolvingId(id);
        try {
            const res = await fetch(`http://localhost:3001/api/admin/fraud/${id}/resolve`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isResolved: true, resolvedBy: 'admin' })
            });
            const data = await res.json();
            if (data.success) {
                setAlerts(alerts.map(a => a.id === id ? { ...a, isResolved: true } : a));
            }
        } catch (err) {
            console.error("Resolve error:", err);
        }
        setResolvingId(null);
    };

    const handleRunScan = async () => {
        setIsScanning(true);
        setScanMessage('');
        try {
            const res = await fetch('http://localhost:3001/api/admin/fraud/scan', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setScanMessage(data.message);
                fetchAlerts();
            }
        } catch (err) {
            console.error("Scan error:", err);
        }
        setTimeout(() => setIsScanning(false), 1500);
    };

    const handleBanUser = async (userId: string) => {
        if(window.confirm('Bu kullanıcıyı banlamak istediğinize emin misiniz?')) {
            alert('Kullanıcı banlandı! (Simülasyon)');
        }
    };

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/10 border-red-500/50 text-red-500';
            case 'high': return 'bg-orange-500/10 border-orange-500/50 text-orange-500';
            case 'medium': return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500';
            default: return 'bg-blue-500/10 border-blue-500/50 text-blue-500';
        }
    };

    return (
        <div className="p-4 sm:p-6 text-white space-y-6 relative h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                        <ShieldAlert className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-red-400 tracking-wide uppercase">Fraud Radarı</h2>
                        <p className="text-sm text-gray-400">Yapay Zeka Destekli Anti-Fraud ve Kara Para Aklama (AML) Tarama Merkezi</p>
                    </div>
                </div>
                <button 
                    onClick={handleRunScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50"
                >
                    <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
                    {isScanning ? 'Taranıyor...' : 'Manuel Tarama Başlat'}
                </button>
            </div>

            {scanMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in shrink-0">
                    <CheckCircle2 className="w-5 h-5" /> {scanMessage}
                </div>
            )}

            <div className="flex-1 bg-[#161a22] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-[#1a1d24] border-b border-zinc-800">
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tarih</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Kullanıcı & Risk Skoru</th>
                                <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Alarm Sebebi</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Aksiyon</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-zinc-500">Yükleniyor...</td>
                                </tr>
                            ) : alerts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-zinc-500">
                                        <ShieldAlert className="w-12 h-12 text-emerald-500/20 mx-auto mb-3" />
                                        Sistem temiz. Hiçbir Fraud alarmı bulunamadı.
                                    </td>
                                </tr>
                            ) : alerts.map(alert => (
                                <tr key={alert.id} className={`hover:bg-white/[0.02] transition-colors ${alert.isResolved ? 'opacity-50' : ''}`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded text-xs font-bold border ${getSeverityStyles(alert.severity)}`}>
                                            {alert.severity.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                        {new Date(alert.createdAt).toLocaleString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="font-bold text-white">{alert.user?.username || 'Bilinmiyor'}</div>
                                            {alert.user?.riskScore > 50 ? (
                                                <span className="text-xs font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" /> Risk: {alert.user?.riskScore}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                                                    Risk: {alert.user?.riskScore || 0}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-zinc-300">
                                        {alert.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!alert.isResolved && (
                                                <button 
                                                    onClick={() => handleBanUser(alert.user.id)}
                                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-semibold rounded transition-colors text-xs flex items-center gap-1.5"
                                                >
                                                    <Ban className="w-3.5 h-3.5" /> Hesabı Kitle
                                                </button>
                                            )}
                                            {alert.isResolved ? (
                                                <span className="px-3 py-1.5 text-xs text-zinc-500 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Çözüldü</span>
                                            ) : (
                                                <button 
                                                    onClick={() => handleResolve(alert.id)}
                                                    disabled={resolvingId === alert.id}
                                                    className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded transition-colors text-xs disabled:opacity-50"
                                                >
                                                    {resolvingId === alert.id ? '...' : 'İşaretle (Güvenli)'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
