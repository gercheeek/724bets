import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_input = """        {userRole === 'GUEST' ? (
            <input 
                type="text"
                disabled
                placeholder={t('chat.login_required', 'Mesaj göndermek için lütfen giriş yapın')}
                className="w-full bg-[#0A0C10] border border-white/10 text-[12px] font-semibold text-center text-slate-500 rounded-full px-5 py-3.5 cursor-not-allowed shadow-inner"
            />
        ) : (
            <div className="flex flex-col gap-2">
                        {/* Tip & Rain Toolbar Removed - Will be moved to admin panel later */}
                        
                        <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#181B21] border border-transparent focus-within:bg-[#20242D] focus-within:border-white/5 rounded-full transition-all duration-300 h-[46px] overflow-hidden">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={t('chat.placeholder', 'Bir mesaj gönder...')}
                                className="flex-1 bg-transparent text-[13px] font-medium text-white focus:outline-none placeholder-zinc-500 pl-5 pr-3"
                            />
                            <div className="flex items-center pr-1.5 gap-1 h-full shrink-0 relative" ref={emojiPickerRef}>
                                <button type="button" onClick={() => { setShowEmojiPicker(!showEmojiPicker); }} className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
                                    <Smile className="w-4 h-4" />
                                </button>
                                
                                {showEmojiPicker && (
                                    <div className="absolute bottom-[50px] right-0 bg-[#161a24] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 z-[100] w-[260px]">
                                        <div className="grid grid-cols-7 gap-1 h-[200px] overflow-y-auto scrollbar-hide">
                                            {POPULAR_EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewMessage(prev => prev + emoji);
                                                        setShowEmojiPicker(false);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg cursor-pointer text-lg transition-colors"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="text-[#0A0D14] bg-[#00E5FF] disabled:bg-white/5 disabled:text-white/20 hover:brightness-110 transition-all p-2 rounded-full"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}"""

new_input = """        {userRole === 'GUEST' ? (
            <input 
                type="text"
                disabled
                placeholder="Mesaj göndermek için lütfen giriş yapın"
                className="w-full bg-[#111e29] border border-white/5 text-[13px] font-semibold text-center text-slate-500 rounded-xl h-[46px] cursor-not-allowed shadow-inner"
            />
        ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full mt-1">
                <div className="relative flex-1 flex items-center bg-[#111e29] border border-white/5 rounded-xl transition-all duration-300 h-[46px] overflow-hidden focus-within:border-white/10">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesaj yazın"
                        className="flex-1 bg-transparent text-[13px] font-medium text-white focus:outline-none placeholder-[#3D4F62] pl-4 pr-10"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={emojiPickerRef}>
                        <button type="button" onClick={() => { setShowEmojiPicker(!showEmojiPicker); }} className="text-[#3D4F62] hover:text-[#00E701] transition-colors p-1.5 rounded-full">
                            <Smile className="w-5 h-5" />
                        </button>
                        
                        {showEmojiPicker && (
                            <div className="absolute bottom-[50px] right-0 bg-[#161a24] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 z-[100] w-[260px]">
                                <div className="grid grid-cols-7 gap-1 h-[200px] overflow-y-auto scrollbar-hide">
                                    {POPULAR_EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => {
                                                setNewMessage(prev => prev + emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg cursor-pointer text-lg transition-colors"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <button type="button" className="shrink-0 w-[46px] h-[46px] rounded-xl bg-[#20293a] text-[#8fa0b5] hover:text-white flex items-center justify-center transition-colors border border-white/5 shadow-sm">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
                </button>
                
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="shrink-0 w-[46px] h-[46px] rounded-xl bg-[#00E701] disabled:bg-[#00E701]/30 text-white flex items-center justify-center transition-colors shadow-sm"
                >
                    <Send className="w-5 h-5 -ml-0.5" />
                </button>
            </form>
        )}"""

content = content.replace(old_input, new_input)
with open(filename, 'w') as f:
    f.write(content)
print("Updated input area")
