import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_input = """        {userRole === 'GUEST' ? (
            <input 
                type="text"
                disabled
                placeholder="Mesaj göndermek için lütfen giriş yapın"
                className="w-full bg-[#161B26] border border-white/5 text-[13px] font-semibold text-center text-slate-500 rounded-xl h-[46px] cursor-not-allowed shadow-inner"
            />
        ) : ("""

new_input = """        {(!siteUser || userRole === 'GUEST') ? (
            <input 
                type="text"
                disabled
                placeholder="Sohbete katılmak için giriş yapmalısınız"
                className="w-full bg-[#161B26] border border-white/5 text-[13px] font-semibold text-center text-slate-500 rounded-xl h-[46px] cursor-not-allowed shadow-inner"
            />
        ) : (siteUser && (siteUser.totalWagered || 0) < 5000 && !['admin', 'editor', 'moderator'].includes((userRole || siteUser.role || '').toLowerCase())) ? (
            <div className="w-full bg-[#161B26] border border-amber-500/20 rounded-xl h-[46px] flex items-center justify-center shadow-inner cursor-not-allowed relative overflow-hidden group">
                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                <div className="flex flex-col items-center justify-center leading-tight">
                    <span className="text-[12px] font-black text-amber-500/90 flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                        Çevrim Şartı Yetersiz
                    </span>
                    <span className="text-[10px] font-bold text-amber-500/60">Mesaj yazmak için min. 5000 ₺ çevrim yapmalısınız</span>
                </div>
            </div>
        ) : ("""

content = content.replace(old_input, new_input)
with open(filename, 'w') as f:
    f.write(content)
print("Updated chat input validation UI")
