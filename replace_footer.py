import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Main Container: Make flex-col instead of md:flex-row
content = content.replace('flex flex-col md:flex-row rounded-2xl', 'flex flex-col rounded-2xl')

# 2. Replace Right Panel with Bottom Footer
start_marker = "        {/* ═══ RIGHT PANEL (Clean Info) ═══ */}"
end_marker = "      </div>\n    </div>\n  );\n};"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    footer_code = """        {/* ═══ BOTTOM FOOTER (Security & Partners) ═══ */}
        <div className="w-full bg-[#121722] border-t border-white/5 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
           
           {/* Badges */}
           <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide w-full sm:w-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex items-center gap-2 shrink-0">
                <ShieldCheck strokeWidth={2.5} className="w-4 h-4 text-white/50" />
                <span className="text-white/60 text-[11px] font-bold">Güvenli Altyapı</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Zap strokeWidth={2.5} className="w-4 h-4 text-white/50" />
                <span className="text-white/60 text-[11px] font-bold">Otonom Transfer</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Lock strokeWidth={2.5} className="w-4 h-4 text-white/50" />
                <span className="text-white/60 text-[11px] font-bold">256-bit Şifreleme</span>
              </div>
           </div>

           {/* Partner */}
           <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Partner</span>
              <img src="/neopays-logo.png" alt="NeoPAYS" className="h-4 object-contain filter invert opacity-40 hover:opacity-100 transition-opacity" />
           </div>

        </div>

"""
    new_content = content[:start_idx] + footer_code + content[end_idx:]
    with open('components/WalletModal.tsx', 'w') as f:
        f.write(new_content)
else:
    print("Could not find markers")
