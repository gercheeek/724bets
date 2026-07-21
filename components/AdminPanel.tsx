import React, { useState, useEffect } from 'react';
import { X, Settings, Bot, Activity, Save, Trophy } from 'lucide-react';
import AdminLuckyWheelTab from './AdminLuckyWheelTab';
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
    const [activeTab, setActiveTab] = useState<'bot' | 'luckywheel'>('luckywheel');

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
            <div className="bg-[#1a1c24] w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-[#15171e]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Settings className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Yönetim Paneli</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
                        <button 
                            onClick={() => setActiveTab('bot')} 
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'bot' ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            <Bot className="w-4 h-4" /> Sohbet Botu
                        </button>
                        <button 
                            onClick={() => setActiveTab('luckywheel')} 
                            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'luckywheel' ? 'bg-[#0ea5e9] text-white' : 'bg-gray-800 text-gray-400'}`}
                        >
                            <Trophy className="w-4 h-4" /> Lucky Wheel
                        </button>
                    </div>

                    {activeTab === 'luckywheel' && props.luckyWheelConfig && props.onSaveLuckyWheelConfig && (
                        <div className="h-[60vh]">
                            <AdminLuckyWheelTab config={props.luckyWheelConfig} onSave={props.onSaveLuckyWheelConfig} />
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
