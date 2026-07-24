import re

def fix_chat():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
        content = f.read()

    # The chat container bg:
    content = content.replace("className={`h-full w-full flex flex-col ${isRetroVIP ? 'border-l border-[#00ffff]/20 font-mono' : 'bg-transparent'}`}",
                              "className={`h-full w-full flex flex-col ${isRetroVIP ? 'border-l border-[#00ffff]/20 font-mono' : 'bg-[#0f121a]'}`}")
    
    # Message block:
    # <div key={msg.id || i} onMouseEnter... className={`group relative p-2.5 transition-colors flex items-start gap-3 ... `}>
    # I'll replace the message block layout.
    
    # We find the return statement of finalMessages.map
    target_pattern = r'return \(\s*<div[^>]*key=\{msg\.id \|\| i\}[^>]*onMouseEnter.*?<span className="text-\[#6C7381\] text-\[10px\] font-medium ml-auto">.*?</span>\s*</div>\s*<div className="text-gray-200 text-\[13px\] font-medium leading-relaxed break-words mt-0\.5">.*?</div>\s*</div>\s*</div>\s*\);'
    
    replacement = """return (
                            <div 
                                key={msg.id || i} 
                                onMouseEnter={() => setHoveredMsgId(msg.id)}
                                onMouseLeave={() => setHoveredMsgId(null)}
                                className={`group relative py-2 px-3 transition-colors flex items-start gap-3 ${isRetroVIP ? 'hover:bg-[#0a0a1a]' : 'hover:bg-[#161a22]'}`}
                            >
                                {/* Admin/Mod Hover Actions */}
                                {hoveredMsgId === msg.id && (
                                    <div className="absolute right-2 top-2 flex items-center gap-1 bg-[#1a1e28] border border-white/5 rounded-lg p-1 shadow-lg z-10">
                                        <button onClick={() => { setReplyTo({username: msg.username, text: msg.message}); }} className="p-1.5 text-gray-400 hover:text-[#00ff88] hover:bg-white/5 rounded-md transition-colors tooltip" title="Yanıtla">
                                            <Reply className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleMention(msg.username)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors tooltip" title="Bahset">
                                            <AtSign className="w-3.5 h-3.5" />
                                        </button>
                                        {isAuthorized(userRole) && (
                                            <>
                                                <button onClick={() => deleteMessage(msg.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white/5 rounded-md transition-colors" title="Mesajı Sil">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => muteUser(msg.username)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-white/5 rounded-md transition-colors" title="Sustur (Mute)">
                                                    <Ban className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="w-8 h-8 rounded-full bg-[#111111] overflow-hidden flex items-center justify-center">
                                        <img src={defaultAvatar} alt="avatar" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-4 h-4 flex-shrink-0">
                                            <img 
                                                src={getUserRank(msg.role || 'demir').image} 
                                                alt="rank" 
                                                className="w-full h-full object-contain"
                                                title={getUserRank(msg.role || 'demir').name}
                                            />
                                        </div>
                                        {isMod ? (
                                            <span className="text-amber-500 text-[10px] font-black uppercase flex items-center gap-1">
                                                <Shield className="w-3 h-3" /> YÖNETİCİ
                                            </span>
                                        ) : null}
                                        <span 
                                            onClick={() => handleMention(msg.username)}
                                            className={`font-semibold text-[13px] truncate max-w-[140px] cursor-pointer hover:underline ${isMod ? 'text-amber-500' : (isRetroVIP ? 'text-[#00ffff]' : 'text-slate-300')}`}
                                        >
                                            {maskUsername(msg.username)}
                                        </span>
                                        <span className="text-slate-500 text-[9px] font-medium ml-2">
                                            {time}
                                        </span>
                                    </div>
                                    <div className="text-slate-200 text-[13px] leading-[1.4] break-words">
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        );"""

    content = re.sub(target_pattern, replacement, content, flags=re.DOTALL)
    
    # Input Area styling
    content = content.replace("bg-[#111111] border border-white/5 rounded-xl focus-within:bg-[#1a1a1a] focus-within:ring-1 focus-within:ring-[#00E701]/30",
                              "bg-[#161a22] border-transparent rounded-lg focus-within:bg-[#1c222c] focus-within:ring-1 focus-within:ring-[#00ff88]/30")

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'w') as f:
        f.write(content)

fix_chat()
print("ModernChat updated")
