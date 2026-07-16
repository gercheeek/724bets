import React, { useEffect, useState, useRef } from 'react';
import { CustomBetSlip } from './CustomBetSlip';
import { Activity, Clock, ShieldCheck } from 'lucide-react';

export const LiveSportsBulletin = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to our Node.js Proxy
    const ws = new WebSocket('ws://localhost:4000');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ Connected to Local Proxy');
      setIsConnected(true);
      setError(null);
      
      // Proxy sunucusuna (ve dolayısıyla Tarafbet'e) bağlandığımız anda subscribe mesajını gönder
      console.log('📡 Sending LiveEvents subscribe request...');
      ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
    };

    ws.onmessage = (event) => {
      const msg = event.data.toString();
      console.log('⬇️ Received from proxy:', msg.substring(0, 100));

      if (msg.startsWith('42[')) {
        try {
          const parsed = JSON.parse(msg.substring(2));
          const eventName = parsed[0];
          const payload = parsed[1];
          
          if (payload && payload.events) {
            setEvents(payload.events);
          }
        } catch (e) {
          console.error('Error parsing 42 message:', e);
        }
      }
    };

    ws.onclose = () => {
      console.log('❌ Disconnected from Local Proxy');
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error('WebSocket Error:', err);
      setError('Bağlantı kurulamadı. Proxy sunucusunun (localhost:4000) çalıştığından emin olun.');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-[#09090b] text-white overflow-hidden">
      
      {/* Left Sidebar (Leagues) */}
      <div className="w-64 bg-[#15181E] border-r border-white/5 flex flex-col hidden lg:flex shrink-0">
        <div className="p-4 border-b border-white/5">
          <div className="bg-[#1C2028] rounded-md p-2 flex items-center gap-2 border border-white/5">
            <span className="text-zinc-400 text-sm">Arama Yapın...</span>
          </div>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <div className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Popüler Ligler</div>
          {['Şampiyonlar Ligi', 'Premier Lig', 'La Liga', 'Serie A', 'Süper Lig'].map(league => (
            <div key={league} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">⚽</div>
              <span className="text-sm font-semibold text-zinc-300">{league}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content (Matches) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#15181E] border-b border-white/5 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-[#10B981]" />
            <h1 className="text-xl font-black uppercase tracking-wider">Canlı Bahis</h1>
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${isConnected ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-red-500/20 text-red-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#10B981] animate-pulse' : 'bg-red-500'}`}></div>
              {isConnected ? 'Canlı Bağlantı' : 'Bağlantı Koptu'}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 m-4 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {events.length === 0 && !error ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
              <div className="w-16 h-16 border-4 border-white/10 border-t-[#10B981] rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium">Canlı veriler bekleniyor...</p>
              <p className="text-xs mt-1">Eğer proxy sunucusundan subscribe komutu eksikse, lütfen konsolu kontrol edin.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="bg-[#1C2028] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#10B981] text-xs font-bold bg-[#10B981]/10 px-2 py-1 rounded">{event.data?.sport?.name || 'Spor'}</span>
                      <span className="text-zinc-400 text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(event.data?.time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className="text-zinc-500 text-xs font-semibold">{event.data?.tournament?.name}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                        <span className="font-bold text-lg">{event.data?.participants?.home}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                        <span className="font-bold text-lg">{event.data?.participants?.away}</span>
                      </div>
                    </div>

                    {/* Quick Odds */}
                    <div className="flex gap-2">
                      <button className="bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[80px] transition-colors">
                        <span className="text-zinc-400 text-xs font-bold mb-1">1</span>
                        <span className="text-[#10B981] font-black text-lg">2.10</span>
                      </button>
                      <button className="bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[80px] transition-colors">
                        <span className="text-zinc-400 text-xs font-bold mb-1">X</span>
                        <span className="text-[#10B981] font-black text-lg">3.40</span>
                      </button>
                      <button className="bg-[#232833] hover:bg-[#2A2F3D] border border-white/5 px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[80px] transition-colors">
                        <span className="text-zinc-400 text-xs font-bold mb-1">2</span>
                        <span className="text-[#10B981] font-black text-lg">2.80</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar (Bet Slip) */}
      <div className="w-[320px] bg-[#15181E] border-l border-white/5 p-4 shrink-0 hidden xl:block">
        <CustomBetSlip />
      </div>

    </div>
  );
};
