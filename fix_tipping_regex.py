import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

pattern = r'<div className="relative bg-\[#2D2A32\] border border-\[#d6a863\]/60.*?</div>\n             </div>'

new_tipping = """<div className="bg-[#111e29] border border-white/5 rounded-xl p-4 my-2 shadow-sm flex flex-col items-center gap-3 w-full max-w-[280px]">
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

content = re.sub(pattern, new_tipping, content, flags=re.DOTALL)

with open(filename, 'w') as f:
    f.write(content)
print("Updated Tipping UI")
