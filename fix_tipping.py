import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace Tipping UI
old_tipping = """             <div className="relative bg-[#2D2A32] border border-[#d6a863]/60 rounded-[4px] p-3 my-4 shadow-md overflow-visible">
                {/* 3D Floating Coins Corner */}
                <div className="absolute -top-4 -right-3 text-3xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] z-10">
                   🪙
                   <span className="absolute top-1 right-3 text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] -z-10">🪙</span>
                </div>
                {/* Inner Bevel Box */}
                <div className="bg-[#1C1A1F] border-t border-[#d6a863]/30 border-b border-black/50 rounded-sm p-3 flex flex-col items-center gap-1.5 shadow-inner">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400">
                        <span className="text-[#d6a863]">{sender}</span>
                        <span>gönderdi</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#0D0C0F] px-4 py-1.5 rounded-full border border-white/5 shadow-inner my-1">
                        <span className="text-white font-black text-[15px] tracking-wide">{parseFloat(amount).toFixed(2)}₺</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400">
                        <span>'e</span>
                        <span className="text-[#d6a863] flex items-center gap-1">
                            {recipient}
                            <svg className="w-3 h-3 text-[#d6a863]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        </span>
                    </div>
                </div>
             </div>"""

new_tipping = """             <div className="bg-[#111e29] border border-white/5 rounded-xl p-4 my-2 shadow-sm flex flex-col items-center gap-3 w-full max-w-[280px]">
                 <div className="text-emerald-500 mb-1">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                 </div>
                 <div className="text-zinc-400 text-[12px] font-bold flex items-center gap-1.5">
                     <span>Bahşiş gönder</span>
                     <span className="text-[#00E701]">@{recipient}</span>
                 </div>
                 <div className="bg-[#0b131a] w-full rounded-md py-3 flex items-center justify-center gap-2 border border-white/5 shadow-inner">
                     <span className="text-blue-500 text-[16px]">💎</span>
                     <span className="text-white font-black text-[16px]">${parseFloat(amount).toFixed(2)}</span>
                 </div>
             </div>"""

content = content.replace(old_tipping, new_tipping)

with open(filename, 'w') as f:
    f.write(content)
print("Updated Tipping UI")
