import React, { useState } from 'react';
import { Bell, MessageSquare, Send, Zap, Gift, AlertTriangle, Bot, Plus, Trash2, Edit3, Check, X, Clock, Settings, Save } from 'lucide-react';
import { triggerGlobalToast, ToastEvent } from './GlobalToaster';
import { supabase } from '../utils/supabase';
import { ChatBotConfig, BotScenario } from '../types';

const GLOBAL_CHANNEL_ID = '00000000-0000-0000-0000-000000000000';

interface AdminNotificationTabProps {
    botsConfig: ChatBotConfig[];
    onSaveBotsConfig?: (config: ChatBotConfig[]) => void;
}

const AdminNotificationTab: React.FC<AdminNotificationTabProps> = ({ botsConfig, onSaveBotsConfig }) => {
    // Sohbet Anonsu State
    const [chatMsg, setChatMsg] = useState('');
    const [chatRole, setChatRole] = useState('admin');
    const [chatUsername, setChatUsername] = useState('Yönetici');

    // Global Toast State
    const [toastTitle, setToastTitle] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<ToastEvent['type']>('info');
    const [toastDuration, setToastDuration] = useState('5000');

    // Bot Manager State
    const [localBots, setLocalBots] = useState<ChatBotConfig[]>(botsConfig || []);
    const [editingBotId, setEditingBotId] = useState<string | null>(null);
    const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);

    const handleSendChatMsg = async () => {
        if (!chatMsg.trim()) return;
        try {
            await supabase.from('tv_chat').insert([{
                message: chatMsg,
                username: chatUsername,
                role: chatRole,
                channel_id: GLOBAL_CHANNEL_ID,
                created_at: new Date().toISOString()
            }]);
            setChatMsg('');
            alert('Sohbet anonsu gönderildi!');
        } catch (e) {
            console.error('Error sending admin chat message', e);
            alert('Gönderim hatası!');
        }
    };

    const handleSendToast = () => {
        if (!toastMessage.trim()) return;
        triggerGlobalToast({
            title: toastTitle,
            message: toastMessage,
            type: toastType,
            duration: Number(toastDuration)
        });
        setToastTitle('');
        setToastMessage('');
        alert('Global bildirim fırlatıldı!');
    };

    const handleSaveBots = () => {
        if (onSaveBotsConfig) {
            onSaveBotsConfig(localBots);
            alert('Bot ayarları başarıyla kaydedildi!');
        }
    };

    const addBot = () => {
        const newBot: ChatBotConfig = {
            id: Date.now().toString(),
            name: 'YeniBot 🤖',
            role: 'SYSTEM',
            color: '#F5A623',
            isActive: false,
            scenarios: []
        };
        setLocalBots([...localBots, newBot]);
    };

    const removeBot = (id: string) => {
        setLocalBots(localBots.filter(b => b.id !== id));
    };

    const updateBot = (id: string, field: keyof ChatBotConfig, value: any) => {
        setLocalBots(localBots.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const addScenario = (botId: string) => {
        setLocalBots(localBots.map(b => {
            if (b.id === botId) {
                return {
                    ...b,
                    scenarios: [...b.scenarios, {
                        id: Date.now().toString(),
                        text: 'Yeni mesaj...',
                        intervalMinutes: 5,
                        isActive: true
                    }]
                };
            }
            return b;
        }));
    };

    const removeScenario = (botId: string, scenarioId: string) => {
        setLocalBots(localBots.map(b => {
            if (b.id === botId) {
                return {
                    ...b,
                    scenarios: b.scenarios.filter(s => s.id !== scenarioId)
                };
            }
            return b;
        }));
    };

    const updateScenario = (botId: string, scenarioId: string, field: keyof BotScenario, value: any) => {
        setLocalBots(localBots.map(b => {
            if (b.id === botId) {
                return {
                    ...b,
                    scenarios: b.scenarios.map(s => s.id === scenarioId ? { ...s, [field]: value } : s)
                };
            }
            return b;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-[#F5A623]" />
                <h3 className="text-lg font-bold text-white">Bildirim Merkezi (Notification Center)</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sohbet Anonsu */}
                <div className="bg-[#1A2332] p-6 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-4 h-4 text-sky-400" />
                        <h4 className="text-md font-bold text-white">Sohbet Anonsu Gönder</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Gönderen İsmi</label>
                            <input
                                type="text"
                                className="w-full bg-[#0D1320] text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5A623]"
                                value={chatUsername}
                                onChange={(e) => setChatUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Rol / Etiket</label>
                            <select
                                className="w-full bg-[#0D1320] text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5A623]"
                                value={chatRole}
                                onChange={(e) => setChatRole(e.target.value)}
                            >
                                <option value="admin">Admin (Kırmızı)</option>
                                <option value="SYSTEM">Sistem / Bot (Altın)</option>
                                <option value="vip">VIP (Mavi)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Mesaj (Bold ve Renkli Görünür)</label>
                            <textarea
                                rows={3}
                                className="w-full bg-[#0D1320] text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5A623]"
                                value={chatMsg}
                                onChange={(e) => setChatMsg(e.target.value)}
                                placeholder="Örn: Bu akşama özel yatırımlara x3 bilet!"
                            />
                        </div>
                        <button
                            onClick={handleSendChatMsg}
                            className="w-full bg-gradient-to-r from-[#F5A623] to-[#D4900A] text-black font-bold p-2 rounded-lg hover:from-amber-400 hover:to-amber-600 flex items-center justify-center gap-2 transition-all"
                        >
                            <Send className="w-4 h-4" /> Sohbete Gönder
                        </button>
                    </div>
                </div>

                {/* Global Toast */}
                <div className="bg-[#1A2332] p-6 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-md font-bold text-white">Global Pop-up (Toast) Fırlat</h4>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Bildirim Tipi</label>
                            <select
                                className="w-full bg-[#0D1320] text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5A623]"
                                value={toastType}
                                onChange={(e) => setToastType(e.target.value as any)}
                            >
                                <option value="info">Bilgi (Sarı)</option>
                                <option value="success">Başarı / Bilet (Yeşil)</option>
                                <option value="vip">VIP / Çekiliş (Altın Parıltılı)</option>
                                <option value="warning">Uyarı (Kırmızı)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Başlık (Opsiyonel)</label>
                            <input
                                type="text"
                                className="w-full bg-[#0D1320] text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5A623]"
                                value={toastTitle}
                                onChange={(e) => setToastTitle(e.target.value)}
                                placeholder="Örn: BÜYÜK FIRSAT!"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Süre (ms)</label>
                            <input
                                type="number"
                                className="w-full bg-[#0D1320] text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5A623]"
                                value={toastDuration}
                                onChange={(e) => setToastDuration(e.target.value)}
                                placeholder="5000"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Ekranda kalma süresi (0 = Kapatılana kadar kalır)</p>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Mesaj Metni</label>
                            <textarea
                                rows={2}
                                className="w-full bg-[#0D1320] text-white border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5A623]"
                                value={toastMessage}
                                onChange={(e) => setToastMessage(e.target.value)}
                                placeholder="Sitede gezen herkesin sağ alt köşesinde çıkacak mesaj..."
                            />
                        </div>
                        <button
                            onClick={handleSendToast}
                            className="w-full bg-emerald-500 text-white font-bold p-2 rounded-lg hover:bg-emerald-600 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        >
                            <Zap className="w-4 h-4" /> Global Pop-up Fırlat
                        </button>
                    </div>
                </div>
            </div>

            {/* BOT MANAGER SECTION */}
            <div className="bg-[#1A2332] p-6 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-lg font-bold text-white">Gelişmiş Bot & Senaryo Yönetimi</h4>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={addBot}
                            className="bg-[#0D1320] border border-white/10 text-white hover:text-[#F5A623] hover:border-[#F5A623]/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" /> Yeni Bot Yarat
                        </button>
                        <button 
                            onClick={handleSaveBots}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all shadow-lg shadow-indigo-600/20"
                        >
                            <Save className="w-3.5 h-3.5" /> Botları Kaydet
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {localBots.length === 0 ? (
                        <div className="text-center py-10 bg-[#0D1320] rounded-lg border border-white/5 border-dashed">
                            <Bot className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-400 font-medium">Henüz kayıtlı bir bot yok.</p>
                        </div>
                    ) : (
                        localBots.map((bot) => (
                            <div key={bot.id} className={`bg-[#0D1320] border ${bot.isActive ? 'border-indigo-500/30' : 'border-white/5'} rounded-lg p-4 transition-all relative overflow-hidden`}>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-4 flex-1">
                                        <button 
                                            onClick={() => updateBot(bot.id, 'isActive', !bot.isActive)}
                                            className={`w-10 h-5 rounded-full transition-all flex items-center p-0.5 ${bot.isActive ? 'bg-indigo-500' : 'bg-gray-700'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full bg-white transition-all ${bot.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                        
                                        <div className="flex gap-2 w-full max-w-2xl">
                                            <input 
                                                type="text" 
                                                value={bot.name}
                                                onChange={(e) => updateBot(bot.id, 'name', e.target.value)}
                                                className="bg-[#1A2332] text-white text-sm font-bold border border-white/10 rounded px-2 py-1 w-40 focus:border-[#F5A623] focus:outline-none"
                                                placeholder="Bot İsmi"
                                            />
                                            <select 
                                                value={bot.role}
                                                onChange={(e) => updateBot(bot.id, 'role', e.target.value)}
                                                className="bg-[#1A2332] text-gray-300 text-xs border border-white/10 rounded px-2 py-1 focus:border-[#F5A623] focus:outline-none"
                                            >
                                                <option value="SYSTEM">SİSTEM Etiketi</option>
                                                <option value="ADMIN">ADMİN Etiketi</option>
                                                <option value="VIP">VIP İkonu</option>
                                            </select>
                                            <div className="flex items-center gap-2 bg-[#1A2332] border border-white/10 rounded px-2 py-1">
                                                <input 
                                                    type="color" 
                                                    value={bot.color}
                                                    onChange={(e) => updateBot(bot.id, 'color', e.target.value)}
                                                    className="w-4 h-4 bg-transparent border-0 cursor-pointer p-0"
                                                />
                                                <span className="text-[10px] text-gray-400 font-mono">{bot.color}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeBot(bot.id)}
                                        className="text-rose-500 hover:text-white hover:bg-rose-500 p-1.5 rounded transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Scenarios */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Senaryolar (Zamanlanmış Mesajlar)
                                        </h5>
                                        <button 
                                            onClick={() => addScenario(bot.id)}
                                            className="text-[10px] font-bold text-indigo-400 hover:text-white hover:bg-indigo-500/20 px-2 py-1 rounded transition-all flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Mesaj Ekle
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {bot.scenarios.length === 0 ? (
                                            <p className="text-[11px] text-gray-500 italic">Bu bota henüz bir senaryo eklenmedi.</p>
                                        ) : (
                                            bot.scenarios.map((scen, idx) => (
                                                <div key={scen.id} className="flex gap-2 items-start bg-[#1A2332] p-2 rounded-lg border border-white/5 group">
                                                    <div className="pt-1">
                                                        <button 
                                                            onClick={() => updateScenario(bot.id, scen.id, 'isActive', !scen.isActive)}
                                                            className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border transition-colors ${scen.isActive ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}
                                                        >
                                                            {scen.isActive && <Check className="w-2.5 h-2.5 text-black" />}
                                                        </button>
                                                    </div>
                                                    <div className="flex-1">
                                                        <input 
                                                            type="text"
                                                            value={scen.text}
                                                            onChange={(e) => updateScenario(bot.id, scen.id, 'text', e.target.value)}
                                                            className="w-full bg-transparent text-sm text-gray-200 border-b border-transparent hover:border-white/10 focus:border-indigo-500 focus:outline-none py-0.5 px-1 transition-all"
                                                            placeholder="Gönderilecek mesajı buraya yazın..."
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <input 
                                                            type="number"
                                                            value={scen.intervalMinutes}
                                                            onChange={(e) => updateScenario(bot.id, scen.id, 'intervalMinutes', Number(e.target.value))}
                                                            className="w-12 bg-[#0D1320] text-center text-xs text-white border border-white/10 rounded py-1 focus:border-indigo-500 focus:outline-none"
                                                            min={1}
                                                        />
                                                        <span className="text-[10px] text-gray-500 font-medium w-6">dk'da bir</span>
                                                        <button 
                                                            onClick={() => removeScenario(bot.id, scen.id)}
                                                            className="text-gray-600 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            <div className="bg-[#1A2332] p-6 rounded-lg border border-white/5 mt-6">
               <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <h4 className="text-md font-bold text-white">Hedefli (Kişiye Özel) Bildirim</h4>
               </div>
               <p className="text-xs text-gray-400 mb-4">
                  (Bu özellik bir sonraki güncellemede doğrudan oyuncunun hesabına özel push-notification olarak entegre edilecektir. Şu anda test aşamasındadır.)
               </p>
            </div>
        </div>
    );
};

export default AdminNotificationTab;
