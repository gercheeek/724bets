import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useRainEvent } from '../hooks/useRainEvent';
import { CloudRain, DollarSign, Clock, Users, Zap, ShieldAlert, X, Settings, Lock, Unlock, MessageSquareX, Timer, MicOff, MessageSquare } from 'lucide-react';

const AdminChatControl: React.FC<{ adminId: string, onClose?: () => void }> = ({ adminId, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rain' | 'mod' | 'broadcast'>('rain');

  // --- RAIN STATE ---
  const [amount, setAmount] = useState(5000);
  const [duration, setDuration] = useState(60); 
  const [maxParticipants, setMaxParticipants] = useState(100);
  const [loading, setLoading] = useState(false);
  const { activeEvent, participantsCount, timeLeft } = useRainEvent(adminId);

  // --- MODERATION STATE ---
  const [chatLocked, setChatLocked] = useState(false);
  const [slowMode, setSlowMode] = useState(0);
  const [broadcastMsg, setBroadcastMsg] = useState(''); // 0 means off, otherwise seconds

  useEffect(() => {
    // In a real app, you would sync `chatLocked` and `slowMode` with Supabase/Realtime here.
    // For now, we simulate reading from localStorage for instant feedback.
    setChatLocked(localStorage.getItem('chat_locked') === 'true');
    setSlowMode(Number(localStorage.getItem('chat_slow_mode') || 0));
  }, []);

  const handleStartRain = async () => {
    if (amount <= 0 || duration <= 0) return alert('Geçerli değerler girin.');
    setLoading(true);
    try {
      const endsAt = new Date();
      endsAt.setSeconds(endsAt.getSeconds() + duration);
      const { error } = await supabase.from('rain_events').insert({
        status: 'active',
        total_amount: amount,
        duration_seconds: duration,
        max_participants: maxParticipants,
        ends_at: endsAt.toISOString()
      });
      if (error) throw error;
    } catch (err: any) {
      alert('Başlatılamadı: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKillRain = async () => {
    if (!window.confirm('Aktif tüm yağmurları iptal etmek istediğinize emin misiniz?')) return;
    setLoading(true);
    try {
      await supabase.from('rain_events').update({ status: 'cancelled' }).eq('status', 'active');
    } catch (err: any) {
      alert('Durdurulamadı: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Moderation Handlers
  const toggleChatLock = () => {
    const newState = !chatLocked;
    setChatLocked(newState);
    localStorage.setItem('chat_locked', String(newState));
    window.dispatchEvent(new Event('chat_settings_changed')); // Notify ModernChat
  };

  const changeSlowMode = (sec: number) => {
    setSlowMode(sec);
    localStorage.setItem('chat_slow_mode', String(sec));
    window.dispatchEvent(new Event('chat_settings_changed'));
  };

  const clearChat = () => {
    if (!window.confirm('Sohbet ekranını herkes için temizlemek istediğinize emin misiniz?')) return;
    // Broadcast a clear_chat event (Simulated by setting local storage flag)
    localStorage.setItem('clear_chat_trigger', Date.now().toString());
    window.dispatchEvent(new Event('clear_chat'));
  };

  return (
    <div className="bg-gradient-to-b from-[#1A2436] to-[#0B0E14] border border-white/5 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col gap-4 w-full relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/10 blur-[50px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white m-0 leading-tight">Admin Komuta</h3>
              <p className="text-[11px] text-indigo-400/70 font-semibold tracking-wider m-0 uppercase">Yönetici Paneli</p>
            </div>
        </div>
        {onClose && (
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-[#06080C] p-1 rounded-xl relative z-10 border border-white/5 shadow-inner">
        <button onClick={() => setActiveTab('rain')} className={`w-full py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'rain' ? 'bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
          <CloudRain className="w-4 h-4" /> 
          <span className="text-[9px] font-black uppercase tracking-wider">Yağmur</span>
        </button>
        <button onClick={() => setActiveTab('mod')} className={`w-full py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'mod' ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
          <ShieldAlert className="w-4 h-4" /> 
          <span className="text-[9px] font-black uppercase tracking-wider">Mod</span>
        </button>
        <button onClick={() => setActiveTab('broadcast')} className={`w-full py-2 flex flex-col items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'broadcast' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
          <MessageSquare className="w-4 h-4" /> 
          <span className="text-[9px] font-black uppercase tracking-wider">Duyuru</span>
        </button>
      </div>
      
      {/* Tab Contents */}
      <div className="relative z-10 min-h-[300px]">
        {activeTab === 'rain' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {activeEvent && (
                <div className="bg-[#06080C] border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">AKTİF YAĞMUR</span>
                        </div>
                        <span className="text-xs font-bold text-zinc-400">Kalan: <span className="text-white">{timeLeft}s</span></span>
                    </div>
                </div>
            )}
            
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Havuz Tutarı
              </label>
              <div className="flex gap-2">
                {[1000, 5000, 10000].map(val => (
                    <button key={val} onClick={() => setAmount(val)} className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${amount === val ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300'}`}>
                      {val.toLocaleString()}₺
                    </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Süre
              </label>
               <div className="flex gap-2">
                {[60, 180, 300].map(val => (
                    <button key={val} onClick={() => setDuration(val)} className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${duration === val ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300'}`}>
                      {val / 60} Dk
                    </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
                <button onClick={handleStartRain} disabled={loading || !!activeEvent} className="col-span-2 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#10B981] to-[#34D399] text-black font-black uppercase tracking-widest rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                    <Zap className="w-5 h-5" /> {activeEvent ? 'YAĞMUR DEVAM EDİYOR' : 'YAĞMURU BAŞLAT'}
                </button>
                <button onClick={handleKillRain} className="col-span-2 py-2 bg-red-500/10 text-red-500 border border-red-500/30 font-bold uppercase rounded-xl transition-all hover:bg-red-500/20">Kill Switch</button>
            </div>
          </div>
        )}

        {activeTab === 'mod' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Sohbeti Kilitle */}
             <div className={`p-4 rounded-xl flex items-center justify-between border transition-all ${chatLocked ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'bg-[#06080C] border-white/5'}`}>
                <div>
                    <h4 className={`text-sm font-black flex items-center gap-2 ${chatLocked ? 'text-rose-400' : 'text-white'}`}>
                        {chatLocked ? <Lock className="w-4 h-4"/> : <Unlock className="w-4 h-4 text-emerald-500"/>}
                        {chatLocked ? 'SOHBET KİLİTLİ' : 'Sohbeti Kilitle'}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1 font-semibold">Sadece yetkililer mesaj gönderebilir.</p>
                </div>
                <button 
                    onClick={toggleChatLock}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all shadow-inner ${chatLocked ? 'bg-gradient-to-r from-rose-500 to-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-zinc-800 border border-white/10'}`}
                >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${chatLocked ? 'translate-x-8 shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'translate-x-1 shadow-md'}`} />
                </button>
             </div>

             {/* Yavaş Mod */}
             <div className="bg-[#06080C] border border-white/5 p-4 rounded-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]">
                <h4 className="text-xs font-black text-zinc-300 flex items-center gap-2 mb-3 uppercase tracking-wider">
                    <Timer className="w-4 h-4 text-amber-500"/>
                    Yavaş Mod (Spam Koruması)
                </h4>
                <div className="flex gap-2">
                    {[0, 3, 5, 10].map(sec => (
                        <button 
                            key={sec} 
                            onClick={() => changeSlowMode(sec)}
                            className={`flex-1 py-2 rounded-lg border text-xs font-black transition-all ${
                                slowMode === sec 
                                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                                : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {sec === 0 ? 'KAPALI' : `${sec} Sn`}
                        </button>
                    ))}
                </div>
             </div>

             {/* Sohbeti Temizle */}
             <button 
                onClick={clearChat}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-rose-500/20 hover:to-rose-600/20 text-zinc-300 hover:text-rose-500 border border-white/10 hover:border-rose-500/50 font-black uppercase tracking-widest rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-md group"
             >
                 <MessageSquareX className="w-5 h-5 group-hover:animate-bounce" /> SOHBET EKRANINI TEMİZLE
             </button>
          </div>
        )}
        
        {activeTab === 'broadcast' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="bg-[#06080C] border border-white/5 p-4 rounded-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)]">
                <h4 className="text-xs font-black text-amber-400 flex items-center gap-2 mb-3 uppercase tracking-wider">
                    <Zap className="w-4 h-4"/>
                    Mega Duyuru Gönder
                </h4>
                <p className="text-[11px] text-zinc-500 font-semibold mb-3">
                    Göndereceğiniz mesaj sohbette standart bir yazı olarak değil, herkesin ekranında parlayan dev bir duyuru balonu şeklinde gözükecektir.
                </p>
                <textarea
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    placeholder="Duyuru metnini yazın..."
                    className="w-full bg-[#1A2436]/50 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all min-h-[80px] resize-none placeholder:text-zinc-600 font-medium"
                />
             </div>
             
             <button 
                onClick={() => {
                    if (!broadcastMsg.trim()) return;
                    window.dispatchEvent(new CustomEvent('send_mega_broadcast', { detail: broadcastMsg }));
                    setBroadcastMsg('');
                }}
                disabled={!broadcastMsg.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                 <MessageSquare className="w-5 h-5" /> DUYURUYU FIRLAT
             </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminChatControl;
