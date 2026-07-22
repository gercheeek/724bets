import React, { useState, useEffect } from 'react';
import { X, Settings, Bot, Activity, Save, Trophy, TrendingUp, ShieldCheck, Globe } from 'lucide-react';
import AdminLuckyWheelTab from './AdminLuckyWheelTab';
import AdminMembersTab from './AdminMembersTab';
import AdminRiskTab from './AdminRiskTab';
import AdminLiveRadarTab from './AdminLiveRadarTab';
import AdminMarketingTab from './AdminMarketingTab';
import AdminWithdrawalsTab from './AdminWithdrawalsTab';
import AdminAuditLogsTab from './AdminAuditLogsTab';
import AdminSportsTab from './AdminSportsTab';
import { LuckyWheelConfig } from '../types';

interface AdminPanelProps {
    luckyWheelConfig?: LuckyWheelConfig;
    onSaveLuckyWheelConfig?: (cfg: LuckyWheelConfig) => void;
    onClose: () => void;
}

export default function AdminPanel(props: AdminPanelProps) {
    const { onClose } = props;
    const [config, setConfig] = useState({
        isActive: true,
        speedMin: 15000,
        speedMax: 45000,
        sloppyRate: 0.7,
        emojiRate: 0.4
    });
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'bot' | 'luckywheel' | 'members' | 'risk' | 'radar' | 'marketing' | 'withdrawals' | 'audit' | 'sports'>('members');

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1c24] w-[95vw] max-w-7xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#15171e]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Settings className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Yönetim Paneli</h2>
                        <button 
                            onClick={onClose} 
                            className="ml-3 px-3.5 py-1.5 bg-[#1e2330] hover:bg-emerald-500/20 border border-[#2b3548] hover:border-emerald-500/40 text-slate-200 hover:text-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm group cursor-pointer"
                            title="Siteye Git / Paneli Kapat"
                        >
                            <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                            <span>Siteye Git</span>
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4 overflow-x-auto">
                        <button 
                            onClick={() => setActiveTab('members')} 
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'members' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            Üyeler
                        </button>
                        <button 
                            onClick={() => setActiveTab('bot')} 
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'bot' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            <Bot className="w-4 h-4" /> Sohbet Botu
                        </button>
                        <button 
                            onClick={() => setActiveTab('luckywheel')} 
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'luckywheel' ? 'bg-[#0ea5e9] text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            <Trophy className="w-4 h-4" /> Lucky Wheel
                        </button>
                        {currentAdminRole === 'SUPER_ADMIN' && (
                            <button 
                                onClick={() => setActiveTab('risk')} 
                                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'risk' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                            >
                                Risk Yönetimi
                            </button>
                        )}
                        <button 
                            onClick={() => setActiveTab('radar')} 
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'radar' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            Canlı Radar
                        </button>
                        <button 
                            onClick={() => setActiveTab('marketing')} 
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'marketing' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                        >
                            Etkinlik & Chat
                        </button>

                        {currentAdminRole === 'SUPER_ADMIN' && (
                            <>
                                <button 
                                    onClick={() => setActiveTab('withdrawals')} 
                                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'withdrawals' ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                >
                                    Çekim Talepleri
                                </button>
                                <button 
                                    onClick={() => setActiveTab('audit')} 
                                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'audit' ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                >
                                    <ShieldCheck className="w-4 h-4" /> İşlem Kayıtları
                                </button>
                                <button 
                                    onClick={() => setActiveTab('sports')} 
                                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'sports' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                                >
                                    <Activity className="w-4 h-4" /> Spor Yönetimi
                                </button>
                            </>
                        )}
                        
                        <div className="flex-1" />
                        
                        {currentAdminRole === 'SUPER_ADMIN' && (
                            <button 
                                onClick={() => {
                                    props.onClose?.();
                                    window.dispatchEvent(new CustomEvent('open-finance'));
                                }} 
                                className="px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all ml-auto"
                            >
                                <TrendingUp className="w-4 h-4" /> Finans Paneli (Yeni)
                            </button>
                        )}
                    </div>

                    {/* RBAC Yetki Kontrolü İçin Yardımcı Render Fonksiyonu */}
                    {(() => {
                        const isRestricted = ['risk', 'withdrawals', 'audit', 'sports'].includes(activeTab);
                        
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

                                {activeTab === 'sports' && (
                                    <div className="h-[75vh]">
                                        <AdminSportsTab />
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
        </div>
    );
}
