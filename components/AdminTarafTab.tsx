import React, { useState, useEffect, useRef } from 'react';
import { Settings, Target, Activity, Pause, Play, AlertTriangle, Calculator, Save, RefreshCw, Zap } from 'lucide-react';

export default function AdminTarafTab() {
  const [settings, setSettings] = useState({
    margin: 5,
    liveDelay: 8,
    minBet: 10,
    maxBet: 15000,
    isActive: true
  });
  
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  
  // Manual Override State
  const [manualMode, setManualMode] = useState(false);
  const [manualMinute, setManualMinute] = useState(0);
  const [manualHomeScore, setManualHomeScore] = useState(0);
  const [manualAwayScore, setManualAwayScore] = useState(0);
  
  // Accordion State
  const [expandedSports, setExpandedSports] = useState<Record<string, boolean>>({'Futbol': true});
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({});
  
  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('taraf_admin_settings');
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  const saveSettings = (newSettings: any) => {
    setSettings(newSettings);
    localStorage.setItem('taraf_admin_settings', JSON.stringify(newSettings));
    alert('Ayarlar kaydedildi!');
  };

  // Connect to WS for live tracking
  const wsRef = useRef<WebSocket | null>(null);
  const messageBufferRef = useRef<any[]>([]);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<any>(null);
  const processBufferIntervalRef = useRef<any>(null);

  useEffect(() => {
    const connectWs = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) return;
      
      const ws = new WebSocket('ws://localhost:4000');
      wsRef.current = ws;
      
      ws.onopen = () => {
        reconnectAttemptsRef.current = 0;
        ws.send('42["subscribe-LiveEvents",{"locale":"tr_TR"}]');
      };

      ws.onmessage = (event) => {
        const msg = event.data.toString();
        if (msg.startsWith('42[')) {
          try {
            const parsed = JSON.parse(msg.substring(2));
            const payload = parsed[1];
            if (payload && payload.events) {
              messageBufferRef.current.push(payload);
            }
          } catch (e) {}
        }
      };

      ws.onclose = () => {
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connectWs, timeout);
      };
      
      ws.onerror = () => ws.close();
    };

    connectWs();

    processBufferIntervalRef.current = setInterval(() => {
      if (messageBufferRef.current.length === 0) return;
      
      const payloads = [...messageBufferRef.current];
      messageBufferRef.current = [];
      
      setLiveEvents(prevEvents => {
        const newEvents = [...prevEvents];
        payloads.forEach(payload => {
          payload.events?.forEach((incomingEv: any) => {
            const existingIdx = newEvents.findIndex(e => e.id === incomingEv.id);
            if (existingIdx >= 0) {
              newEvents[existingIdx] = { ...newEvents[existingIdx], ...incomingEv };
            } else {
              newEvents.push(incomingEv);
            }
          });
        });
        return newEvents;
      });
    }, 1000);
    
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (processBufferIntervalRef.current) clearInterval(processBufferIntervalRef.current);
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    };
  }, []);

  const handleSelectMatch = (ev: any) => {
    setSelectedMatch(ev);
    
    // Check if this match has saved manual overrides
    const overrides = JSON.parse(localStorage.getItem('taraf_manual_overrides') || '{}');
    if (overrides[ev.id]) {
       setManualMode(true);
       setManualMinute(overrides[ev.id].minute || 0);
       setManualHomeScore(overrides[ev.id].homeScore || 0);
       setManualAwayScore(overrides[ev.id].awayScore || 0);
    } else {
       setManualMode(false);
       setManualMinute(ev.data?.minute || 0);
       const score = ev.data?.current_score || '0:0';
       setManualHomeScore(parseInt(score.split(':')[0] || '0'));
       setManualAwayScore(parseInt(score.split(':')[1] || '0'));
    }
  };

  const simulateAndPublish = () => {
    if (!selectedMatch) return;
    
    // Odds Simulation Engine (Math Logic)
    const remainingTime = Math.max(0, 90 - manualMinute);
    const timeFactor = remainingTime / 90; // 1.0 at start, 0.0 at end
    
    // Base probabilities
    let probHome = 0.4 + (manualHomeScore > manualAwayScore ? 0.3 : manualHomeScore < manualAwayScore ? -0.2 : 0);
    let probAway = 0.3 + (manualAwayScore > manualHomeScore ? 0.3 : manualAwayScore < manualHomeScore ? -0.2 : 0);
    let probDraw = 0.3;
    
    // As time runs out, the current state becomes much more likely
    if (manualHomeScore > manualAwayScore) {
       probHome += (1 - timeFactor) * 0.4;
       probDraw *= timeFactor;
       probAway *= timeFactor;
    } else if (manualAwayScore > manualHomeScore) {
       probAway += (1 - timeFactor) * 0.4;
       probDraw *= timeFactor;
       probHome *= timeFactor;
    } else {
       probDraw += (1 - timeFactor) * 0.5;
       probHome *= timeFactor;
       probAway *= timeFactor;
    }

    // Normalize
    const totalProb = probHome + probAway + probDraw;
    probHome /= totalProb; probAway /= totalProb; probDraw /= totalProb;
    
    // Calculate odds (1 / probability), add bookmaker margin built-in (0.95)
    const margin = 0.95;
    const oddHome = Math.max(1.01, (1 / probHome) * margin).toFixed(2);
    const oddDraw = Math.max(1.01, (1 / probDraw) * margin).toFixed(2);
    const oddAway = Math.max(1.01, (1 / probAway) * margin).toFixed(2);
    
    // Calculate Over/Under 2.5
    const totalGoals = manualHomeScore + manualAwayScore;
    let probOver25 = timeFactor * 0.6; // Base probability of another goal
    if (totalGoals >= 3) probOver25 = 0.99; // Already over
    let probUnder25 = 1 - probOver25;
    
    const oddOver25 = totalGoals >= 3 ? '-' : Math.max(1.01, (1 / probOver25) * margin).toFixed(2);
    const oddUnder25 = totalGoals >= 3 ? '-' : Math.max(1.01, (1 / probUnder25) * margin).toFixed(2);

    const simulationData = {
      isActive: manualMode,
      minute: manualMinute,
      homeScore: manualHomeScore,
      awayScore: manualAwayScore,
      score: `${manualHomeScore}-${manualAwayScore}`,
      odds: {
        '1x2': { home: oddHome, draw: oddDraw, away: oddAway },
        'ou25': { over: oddOver25, under: oddUnder25 }
      }
    };

    const overrides = JSON.parse(localStorage.getItem('taraf_manual_overrides') || '{}');
    if (manualMode) {
       overrides[selectedMatch.id] = simulationData;
    } else {
       delete overrides[selectedMatch.id];
    }
    
    localStorage.setItem('taraf_manual_overrides', JSON.stringify(overrides));
    alert(manualMode ? 'Simülasyon oranları kaydedildi ve yayına alındı!' : 'Manuel mod iptal edildi, Tarafbet verilerine dönüldü.');
  };

  return (
    <div className="w-full h-full flex flex-col xl:flex-row gap-6">
      
      {/* Left Col: Global Settings */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <div className="bg-[#12141a] border border-[#1f232b] rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#00FFA3]/10 flex items-center justify-center border border-[#00FFA3]/20">
               <Settings className="w-5 h-5 text-[#00FFA3]" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Taraf (Canlı Motor) Ayarları</h2>
              <p className="text-[#5c677d] text-sm font-medium">Genel kar marjı ve görünürlük</p>
            </div>
          </div>
          
          <div className="space-y-5">
             <div className="flex flex-col gap-2">
                <label className="text-white font-bold text-sm">Genel Kâr Marjı (Düşüş Oranı %)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full h-12 bg-[#0a0c10] border border-[#2c313c] rounded-lg px-4 text-white font-bold focus:border-[#00FFA3] transition-colors outline-none"
                    value={settings.margin}
                    onChange={(e) => setSettings({...settings, margin: parseFloat(e.target.value) || 0})}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c677d] font-bold">%</span>
                </div>
                <p className="text-[#5c677d] text-xs">Sağlayıcıdan gelen (Örn: 2.00) oran, girdiğiniz marj kadar (%5 = 1.90) düşürülerek kullanıcılara sunulur.</p>
             </div>
             
             <div className="flex flex-col gap-2">
                <label className="text-white font-bold text-sm">Canlı Bahis Kupon Onay Gecikmesi</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full h-12 bg-[#0a0c10] border border-[#2c313c] rounded-lg px-4 text-white font-bold focus:border-[#00FFA3] transition-colors outline-none"
                    value={settings.liveDelay}
                    onChange={(e) => setSettings({...settings, liveDelay: parseFloat(e.target.value) || 0})}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5c677d] font-bold">Saniye</span>
                </div>
                <p className="text-[#5c677d] text-xs">Gol/VAR iptali gibi arbitraj durumlarını önlemek için kupon onayı öncesi bekleme süresi.</p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                   <label className="text-white font-bold text-sm">Min Bahis (₺)</label>
                   <input 
                     type="number" 
                     className="w-full h-12 bg-[#0a0c10] border border-[#2c313c] rounded-lg px-4 text-white font-bold focus:border-[#00FFA3] transition-colors outline-none"
                     value={settings.minBet}
                     onChange={(e) => setSettings({...settings, minBet: parseFloat(e.target.value) || 0})}
                   />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-white font-bold text-sm">Max Bahis (₺)</label>
                   <input 
                     type="number" 
                     className="w-full h-12 bg-[#0a0c10] border border-[#2c313c] rounded-lg px-4 text-white font-bold focus:border-[#00FFA3] transition-colors outline-none"
                     value={settings.maxBet}
                     onChange={(e) => setSettings({...settings, maxBet: parseFloat(e.target.value) || 0})}
                   />
                </div>
             </div>

             <div className="flex items-center justify-between p-4 bg-[#0a0c10] border border-[#2c313c] rounded-lg">
                <span className="text-white font-bold text-sm">Taraf Motorunu Kapat (Bakım)</span>
                <button 
                  onClick={() => setSettings({...settings, isActive: !settings.isActive})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${!settings.isActive ? 'bg-[#FF1744]' : 'bg-[#2c313c]'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${!settings.isActive ? 'right-1' : 'left-1'}`}></div>
                </button>
             </div>
             
             <button 
               onClick={() => saveSettings(settings)}
               className="w-full h-12 bg-[#00FFA3] hover:bg-[#00e693] text-black font-black rounded-lg transition-colors flex items-center justify-center gap-2"
             >
               <Save className="w-5 h-5" />
               AYARLARI KAYDET
             </button>
          </div>
        </div>
      </div>

      {/* Center Col: Live Bulletin Tracker */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
         <div className="bg-[#12141a] border border-[#1f232b] rounded-xl p-6 shadow-xl h-full flex flex-col">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center border border-[#3b82f6]/20">
                  <Activity className="w-5 h-5 text-[#3b82f6]" />
               </div>
               <div>
                 <h2 className="text-white font-bold text-lg">Canlı Bülten</h2>
                 <p className="text-[#5c677d] text-sm font-medium">Manuel mod için maç seçin</p>
               </div>
             </div>
             <div className="flex items-center gap-2 text-[#00FFA3] bg-[#00FFA3]/10 px-3 py-1 rounded-full border border-[#00FFA3]/20">
                <div className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse"></div>
                <span className="text-xs font-bold">{liveEvents.length} Maç</span>
             </div>
           </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col max-h-[600px] bg-[#1a1d24] rounded-lg border border-[#2c313c]">
             {(() => {
                // Group by Sport -> Competition
                const grouped: Record<string, Record<string, any[]>> = {};
                liveEvents.forEach(ev => {
                   const sportName = ev.data?.sport?.name || 'Diğer';
                   const compName = ev.data?.competition?.name || 'Genel';
                   if (!grouped[sportName]) grouped[sportName] = {};
                   if (!grouped[sportName][compName]) grouped[sportName][compName] = [];
                   grouped[sportName][compName].push(ev);
                });
                
                return Object.entries(grouped).map(([sportName, comps]) => {
                   const sportCount = Object.values(comps).reduce((sum, arr) => sum + arr.length, 0);
                   const isSportExpanded = expandedSports[sportName];
                   
                   return (
                     <div key={sportName} className="flex flex-col border-b border-[#2c313c] last:border-0">
                       <div 
                         className="flex items-center justify-between p-3 cursor-pointer hover:bg-[#232833] transition-colors"
                         onClick={() => setExpandedSports(prev => ({...prev, [sportName]: !isSportExpanded}))}
                       >
                         <div className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-[#00FFA3]/20 text-[#00FFA3] flex items-center justify-center text-xs">⚽</div>
                           <span className="text-white font-bold">{sportName}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <div className="bg-[#2c313c] px-2 py-0.5 rounded text-xs font-bold text-white">{sportCount}</div>
                           <div className={`transform transition-transform ${isSportExpanded ? 'rotate-180' : ''}`}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M6 9l6 6 6-6"/></svg>
                           </div>
                         </div>
                       </div>
                       
                       {isSportExpanded && (
                         <div className="flex flex-col bg-[#12141a]">
                           {Object.entries(comps).map(([compName, evs]) => {
                              const compKey = `${sportName}-${compName}`;
                              const isCompExpanded = expandedLeagues[compKey];
                              
                              return (
                                <div key={compName} className="flex flex-col border-t border-[#1f232b]">
                                  <div 
                                    className="flex items-center justify-between p-2.5 pl-6 cursor-pointer hover:bg-[#1a1d24] transition-colors"
                                    onClick={() => setExpandedLeagues(prev => ({...prev, [compKey]: !isCompExpanded}))}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">🌍</div>
                                      <span className="text-gray-300 font-bold text-sm truncate max-w-[150px]">{compName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="bg-[#1f232b] px-2 py-0.5 rounded text-xs font-bold text-gray-400">{evs.length}</div>
                                      <div className={`transform transition-transform ${isCompExpanded ? 'rotate-180' : ''}`}>
                                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M6 9l6 6 6-6"/></svg>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {isCompExpanded && (
                                    <div className="flex flex-col gap-1 p-2 pl-8 bg-[#0a0c10]">
                                      {evs.map(ev => {
                                         const isSelected = selectedMatch?.id === ev.id;
                                         let home = ev.data?.participants?.home || ev.data?.name?.split(' - ')[0] || 'Ev Sahibi';
                                         let away = ev.data?.participants?.away || ev.data?.name?.split(' - ')[1] || 'Deplasman';
                                         return (
                                           <button 
                                             key={ev.id}
                                             onClick={() => handleSelectMatch(ev)}
                                             className={`w-full text-left p-2 rounded-lg border transition-all ${
                                               isSelected ? 'bg-[#3b82f6]/10 border-[#3b82f6]' : 'bg-[#12141a] border-[#1f232b] hover:border-[#424b5c]'
                                             }`}
                                           >
                                             <div className="flex justify-between items-center mb-1">
                                               <span className="text-[#00FFA3] text-[10px] font-bold">{ev.data?.minute ? `${ev.data.minute}'` : 'Canlı'}</span>
                                             </div>
                                             <div className="flex justify-between items-center">
                                                <span className="text-gray-300 font-bold text-xs truncate max-w-[80px]">{home}</span>
                                                <span className="text-white font-black text-xs mx-1 bg-[#1a1d24] px-1.5 rounded border border-[#2c313c]">{ev.data?.current_score || '0:0'}</span>
                                                <span className="text-gray-300 font-bold text-xs truncate max-w-[80px]">{away}</span>
                                             </div>
                                           </button>
                                         );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                           })}
                         </div>
                       )}
                     </div>
                   );
                });
             })()}
           </div>
         </div>
      </div>

      {/* Right Col: Manual Odds Engine */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
         <div className={`bg-[#12141a] border rounded-xl p-6 shadow-xl h-full transition-all ${
           manualMode ? 'border-[#FF1744]' : 'border-[#1f232b]'
         }`}>
           {!selectedMatch ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Target className="w-16 h-16 text-[#5c677d] mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">Maç Seçilmedi</h3>
                <p className="text-[#a0a5b5] text-sm max-w-[250px]">Manuel oran simülasyonu başlatmak için yandaki listeden bir maç seçin.</p>
             </div>
           ) : (
             <>
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                     manualMode ? 'bg-[#FF1744]/10 border-[#FF1744]/20' : 'bg-[#f59e0b]/10 border-[#f59e0b]/20'
                   }`}>
                      {manualMode ? <AlertTriangle className="w-5 h-5 text-[#FF1744]" /> : <Calculator className="w-5 h-5 text-[#f59e0b]" />}
                   </div>
                   <div>
                     <h2 className="text-white font-bold text-lg">Oran Simülatörü</h2>
                     <p className="text-[#5c677d] text-sm font-medium">Manuel skor/dakika girişi</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                   <span className="text-[#a0a5b5] text-xs font-bold">MANUEL MOD</span>
                   <button 
                     onClick={() => setManualMode(!manualMode)}
                     className={`w-12 h-6 rounded-full transition-colors relative ${manualMode ? 'bg-[#FF1744]' : 'bg-[#2c313c]'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${manualMode ? 'right-1' : 'left-1'}`}></div>
                   </button>
                 </div>
               </div>
               
               <div className="p-4 bg-[#0a0c10] border border-[#2c313c] rounded-lg mb-6">
                 <p className="text-white font-bold text-center mb-1 line-clamp-1">{selectedMatch.data?.participants?.home || selectedMatch.data?.name?.split(' - ')[0]}</p>
                 <p className="text-[#5c677d] font-bold text-center text-xs mb-1">VS</p>
                 <p className="text-white font-bold text-center line-clamp-1">{selectedMatch.data?.participants?.away || selectedMatch.data?.name?.split(' - ')[1]}</p>
               </div>
               
               <div className={`space-y-5 ${!manualMode ? 'opacity-30 pointer-events-none' : ''}`}>
                 <div className="flex flex-col gap-2">
                    <label className="text-white font-bold text-sm">Oynanan Dakika (Zaman Azaldıkça Oranlar Düşer)</label>
                    <input 
                      type="number" 
                      className="w-full h-12 bg-[#0a0c10] border border-[#2c313c] rounded-lg px-4 text-[#00FFA3] font-black focus:border-[#FF1744] transition-colors outline-none"
                      value={manualMinute}
                      min="0" max="120"
                      onChange={(e) => setManualMinute(parseInt(e.target.value) || 0)}
                    />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-white font-bold text-sm">Ev Sahibi Gol</label>
                       <input 
                         type="number" 
                         className="w-full h-12 bg-[#0a0c10] border border-[#2c313c] rounded-lg px-4 text-white font-black text-center focus:border-[#FF1744] transition-colors outline-none text-2xl"
                         value={manualHomeScore}
                         onChange={(e) => setManualHomeScore(parseInt(e.target.value) || 0)}
                       />
                    </div>
                    <div className="flex flex-col gap-2">
                       <label className="text-white font-bold text-sm">Deplasman Gol</label>
                       <input 
                         type="number" 
                         className="w-full h-12 bg-[#0a0c10] border border-[#2c313c] rounded-lg px-4 text-white font-black text-center focus:border-[#FF1744] transition-colors outline-none text-2xl"
                         value={manualAwayScore}
                         onChange={(e) => setManualAwayScore(parseInt(e.target.value) || 0)}
                       />
                    </div>
                 </div>
                 
                 <div className="pt-4">
                   <button 
                     onClick={simulateAndPublish}
                     className={`w-full h-14 font-black rounded-lg transition-all flex items-center justify-center gap-2 ${
                       manualMode 
                         ? 'bg-gradient-to-r from-[#FF1744] to-[#f43f5e] hover:brightness-110 text-white shadow-[0_0_15px_rgba(255,23,68,0.3)]'
                         : 'bg-[#2c313c] text-[#5c677d]'
                     }`}
                   >
                     <Zap className="w-5 h-5" />
                     {manualMode ? 'HESAPLA VE YAYINA AL' : 'MANUEL MOD KAPALI'}
                   </button>
                   <p className="text-[#5c677d] text-[11px] mt-3 text-center">Yapay zeka motoru, girdiğiniz skor ve dakikaya göre en gerçekçi Maç Sonucu ve Alt/Üst oranlarını uydurup otomatik olarak oyunculara sunacaktır.</p>
                 </div>
               </div>
             </>
           )}
         </div>
      </div>
      
    </div>
  );
}
