import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_msg_block = """                            {/* Message Content Column (Profil resimleri kaldırıldı, tam genişlik) */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                    {isAdmin ? (
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#00E5FF]/20 to-transparent text-[#00E5FF] px-2 py-0.5 rounded text-[9px] font-black tracking-widest border border-[#00E5FF]/50 uppercase shadow-sm">
                                            <Crown className="w-2.5 h-2.5 text-[#00E5FF]" /> KRAL
                                        </span>
                                    ) : isMod ? (
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#00E5FF]/20 to-transparent text-[#00E5FF] px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest border border-[#00E5FF]/30 uppercase">
                                            <Shield className="w-2.5 h-2.5" /> MOD
                                        </span>
                                    ) : isVip ? (
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-transparent text-zinc-300 px-1.5 py-0.5 rounded text-[8.5px] font-black tracking-widest border border-amber-500/30 uppercase">
                                            <Star className="w-2 h-2 fill-amber-400" /> VIP
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center justify-center bg-[#181C24] text-amber-400/90 border border-amber-500/20 px-1.5 py-0.5 rounded text-[9px] font-black leading-none shrink-0 shadow-sm">
                                            {romanVip}
                                        </span>
                                    )}

                                    <span 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (siteUser && userName !== siteUser.username) {
                                                setTippingUser(userName);
                                            }
                                        }}
                                        className={`font-black tracking-tight text-[12.5px] cursor-pointer hover:underline decoration-white/50 underline-offset-2 truncate max-w-full transition-all ${isAdmin ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'hover:scale-105'}`}
                                        style={{ color: isAdmin ? '#ffffff' : isVip ? '#FFD700' : userColor }}
                                    >
                                        {userName}
                                    </span>
                                    <span className="text-[9.5px] font-bold text-slate-500 ml-1">
                                        {new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <div className={`break-words antialiased text-[12.5px] leading-snug ${isVip ? 'text-zinc-300/90 font-medium' : isSystem ? 'text-zinc-300 font-bold' : 'text-[#e2e8f0]'}`}>
                                    {renderMessageText(msg, (betId, user, type) => setSelectedBet({ id: betId, user, type }))}
                                </div>"""

new_msg_block = """                            <div className="flex gap-2 w-full">
                                {/* Cybet Style Avatar */}
                                <div className="w-[34px] h-[34px] shrink-0 rounded-full border-[1.5px] border-white/5 bg-[#142333] shadow-sm flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${userName}&backgroundColor=transparent`} alt="avatar" className="w-[28px] h-[28px]" />
                                </div>

                                <div className="flex-1 flex flex-col min-w-0 pr-1">
                                    <div className="flex items-center justify-between w-full mb-1">
                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                            {isAdmin ? (
                                                <span className="inline-flex items-center gap-1 bg-[#2C1920] text-red-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">KRAL</span>
                                            ) : isMod ? (
                                                <span className="inline-flex items-center gap-1 bg-[#142C33] text-[#00E5FF] px-1.5 py-0.5 rounded text-[8px] font-black uppercase">MOD</span>
                                            ) : (
                                                <div className="relative flex items-center justify-center w-4 h-4 shrink-0" title="Level">
                                                    <svg viewBox="0 0 24 24" fill="currentColor" className={`absolute inset-0 w-full h-full drop-shadow-md ${isVip ? 'text-[#d6a863]' : 'text-slate-400'}`}>
                                                        <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" stroke="currentColor" strokeWidth="1.5" fill={isVip ? '#451a03' : '#1e293b'} strokeOpacity="0.8" />
                                                    </svg>
                                                    <span className="relative z-10 text-[7px] font-black text-white leading-none mt-[1px]">{msg.id ? parseInt(msg.id.replace(/\\D/g, '') || '0') % 99 || 1 : 1}</span>
                                                </div>
                                            )}

                                            <span 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (siteUser && userName !== siteUser.username) {
                                                        setTippingUser(userName);
                                                    }
                                                }}
                                                className="font-bold tracking-tight text-[12px] cursor-pointer hover:underline text-[#7B92A7] truncate"
                                            >
                                                {userName}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-[#4B5E71] shrink-0 pl-2">
                                            {new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <div className="bg-[#142333] text-[#e2e8f0] px-3 py-2.5 rounded-xl rounded-tl-sm w-fit break-words antialiased text-[13px] leading-snug shadow-sm max-w-full">
                                        {renderMessageText(msg, (betId, user, type) => setSelectedBet({ id: betId, user, type }))}
                                    </div>"""

content = content.replace(old_msg_block, new_msg_block)
with open(filename, 'w') as f:
    f.write(content)
print("Updated Message bubble block")
