import re

filename = 'components/AdminChatControl.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add Broadcast Tab State
content = content.replace("const [slowMode, setSlowMode] = useState(0);", "const [slowMode, setSlowMode] = useState(0);\n  const [broadcastMsg, setBroadcastMsg] = useState('');")

# Update tabs logic to include broadcast
old_tabs = """      {/* Tabs */}
      <div className="flex bg-[#06080C] p-1 rounded-xl relative z-10 border border-white/5">
        <button onClick={() => setActiveTab('rain')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'rain' ? 'bg-[#1A2436] text-emerald-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <CloudRain className="w-3.5 h-3.5" /> Yağmur
        </button>
        <button onClick={() => setActiveTab('mod')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'mod' ? 'bg-[#1A2436] text-rose-400 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <ShieldAlert className="w-3.5 h-3.5" /> Moderasyon
        </button>
      </div>"""

new_tabs = """      {/* Tabs */}
      <div className="flex bg-[#06080C] p-1 rounded-xl relative z-10 border border-white/5 shadow-inner">
        <button onClick={() => setActiveTab('rain')} className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'rain' ? 'bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <CloudRain className="w-3.5 h-3.5" /> Yağmur
        </button>
        <button onClick={() => setActiveTab('mod')} className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'mod' ? 'bg-rose-500/20 border border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <ShieldAlert className="w-3.5 h-3.5" /> Moderasyon
        </button>
        <button onClick={() => setActiveTab('broadcast')} className={`flex-1 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'broadcast' ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <MessageSquare className="w-3.5 h-3.5" /> Duyuru
        </button>
      </div>"""
content = content.replace(old_tabs, new_tabs)

# Improve Moderation Tab UI
old_mod_tab = """        {activeTab === 'mod' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Sohbeti Kilitle */}
             <div className="bg-[#06080C] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {chatLocked ? <Lock className="w-4 h-4 text-rose-500"/> : <Unlock className="w-4 h-4 text-emerald-500"/>}
                        Sohbeti Kilitle
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">Sadece yetkililer mesaj gönderebilir.</p>
                </div>
                <button 
                    onClick={toggleChatLock}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${chatLocked ? 'bg-rose-500' : 'bg-zinc-700'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${chatLocked ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>

             {/* Yavaş Mod */}
             <div className="bg-[#06080C] border border-white/5 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <Timer className="w-4 h-4 text-amber-500"/>
                    Yavaş Mod (Slow Mode)
                </h4>
                <div className="flex gap-2">
                    {[0, 3, 5, 10].map(sec => (
                        <button 
                            key={sec} 
                            onClick={() => changeSlowMode(sec)}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                slowMode === sec 
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' 
                                : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
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
                className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-rose-500/10 text-zinc-300 hover:text-rose-500 border border-white/5 hover:border-rose-500/30 font-bold uppercase rounded-xl transition-all"
             >
                 <MessageSquareX className="w-5 h-5" /> Sohbeti Temizle
             </button>
          </div>
        )}"""

new_mod_tab = """        {activeTab === 'mod' && (
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
        )}"""
content = content.replace(old_mod_tab, new_mod_tab)

with open(filename, 'w') as f:
    f.write(content)

print("Updated AdminChatControl with premium moderation design and broadcast tab")
