import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_tip = """             <div className="bg-[#161B26] border border-white/5 rounded-xl p-4 my-2 shadow-sm flex flex-col items-center gap-3 w-full max-w-[280px]">
                 <div className="text-[#00E5FF] mb-1">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                 </div>
                 <div className="text-zinc-400 text-[12px] font-bold flex items-center gap-1.5">
                     <span>Bahşiş gönder</span>
                     <span className="text-[#00E5FF]">@{recipient}</span>
                 </div>
                 <div className="bg-[#0A0C10] px-4 py-2 rounded-lg flex items-center gap-2 border border-white/5 w-full justify-center">
                     <span className="text-blue-500">💎</span>
                     <span className="text-white font-black text-[15px]">${amount}</span>
                 </div>
             </div>"""

new_tip = """             <div className="relative group overflow-hidden bg-gradient-to-br from-[#161B26] to-[#0A0D14] p-5 my-2 rounded-2xl border border-[#00E5FF]/20 flex flex-col items-center gap-3 w-full max-w-[280px] shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                 {/* Premium Glow Background */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#00E5FF] opacity-[0.08] blur-3xl rounded-full pointer-events-none"></div>
                 
                 <div className="relative z-10 flex flex-col items-center w-full">
                     <div className="mb-3 p-3 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 shadow-[0_0_20px_rgba(0,229,255,0.15)] flex items-center justify-center">
                         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                     </div>
                     
                     <div className="text-zinc-300 text-[13px] font-bold flex items-center gap-2 mb-3 tracking-wide">
                         <span>Bahşiş gönderildi</span>
                         <span className="px-2 py-1 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] text-[11px] uppercase tracking-wider border border-[#00E5FF]/20 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                             @{recipient}
                         </span>
                     </div>
                     
                     <div className="bg-[#0A0C10]/90 px-5 py-3 rounded-xl flex items-center gap-2.5 border border-[#00E5FF]/10 w-full justify-center shadow-inner relative overflow-hidden group-hover:border-[#00E5FF]/30 transition-colors">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                         <span className="text-[18px] drop-shadow-md">💎</span>
                         <span className="font-black text-[20px] bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300 tracking-tight">${amount}</span>
                     </div>
                 </div>
             </div>"""

content = content.replace(old_tip, new_tip)
with open(filename, 'w') as f:
    f.write(content)
print("Updated Tip UI")
