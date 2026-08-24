import re

# 1. Update AdminRainControl.tsx to include onClose prop and an integrated X button
filename_admin = 'components/AdminRainControl.tsx'
with open(filename_admin, 'r') as f:
    content_admin = f.read()

# Add onClose to Props
content_admin = content_admin.replace(
    "const AdminRainControl: React.FC<{ adminId: string }> = ({ adminId }) => {",
    "import { X } from 'lucide-react';\n\nconst AdminRainControl: React.FC<{ adminId: string, onClose?: () => void }> = ({ adminId, onClose }) => {"
)

# Add the X button to the header
old_header = """      <div className="flex items-center gap-3 relative z-10 border-b border-white/5 pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 flex items-center justify-center border border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CloudRain className="w-5 h-5 text-[#10B981]" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white m-0 leading-tight">Yağmur Kontrol Merkezi</h3>
          <p className="text-[11px] text-emerald-400/70 font-semibold tracking-wider m-0 uppercase">Admin Ayrıcalığı</p>
        </div>
      </div>"""

new_header = """      <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 flex items-center justify-center border border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CloudRain className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white m-0 leading-tight">Yağmur Kontrol Merkezi</h3>
              <p className="text-[11px] text-emerald-400/70 font-semibold tracking-wider m-0 uppercase">Admin Ayrıcalığı</p>
            </div>
        </div>
        {onClose && (
            <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        )}
      </div>"""

content_admin = content_admin.replace(old_header, new_header)

# Make the quick select buttons highlight if they match the current value
old_amount_btns = """          <div className="flex gap-2 mt-2">
            {[1000, 5000, 10000].map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val)}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-bold text-zinc-300 transition-colors"
                >
                  {val.toLocaleString()}₺
                </button>
            ))}
          </div>"""

new_amount_btns = """          <div className="flex gap-2 mt-2">
            {[1000, 5000, 10000].map(val => (
                <button 
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`flex-1 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                      amount === val 
                      ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300'
                  }`}
                >
                  {val.toLocaleString()}₺
                </button>
            ))}
          </div>"""
content_admin = content_admin.replace(old_amount_btns, new_amount_btns)

old_duration_btns = """           <div className="flex gap-2 mt-2">
            {[60, 180, 300].map(val => (
                <button 
                  key={val}
                  onClick={() => setDuration(val)}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-bold text-zinc-300 transition-colors"
                >
                  {val / 60} Dk
                </button>
            ))}
          </div>"""

new_duration_btns = """           <div className="flex gap-2 mt-2">
            {[60, 180, 300].map(val => (
                <button 
                  key={val}
                  onClick={() => setDuration(val)}
                  className={`flex-1 py-1.5 rounded-lg border text-[11px] font-bold transition-all ${
                      duration === val 
                      ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                      : 'bg-white/5 hover:bg-white/10 border-white/5 text-zinc-300'
                  }`}
                >
                  {val / 60} Dk
                </button>
            ))}
          </div>"""
content_admin = content_admin.replace(old_duration_btns, new_duration_btns)

with open(filename_admin, 'w') as f:
    f.write(content_admin)

# 2. Update ModernChat.tsx to remove its own X button and use onClose prop
filename_chat = 'components/ModernChat.tsx'
with open(filename_chat, 'r') as f:
    content_chat = f.read()

old_modal_wrapper = """                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <button 
                            onClick={() => setShowAdminRainControl(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}
                        >
                            <X size={20} />
                        </button>
                        <AdminRainControl adminId={siteUser?.id || 'admin'} />
                    </div>"""

new_modal_wrapper = """                    <div className="relative w-full max-w-[400px] animate-in zoom-in-95 duration-200">
                        <AdminRainControl adminId={siteUser?.id || 'admin'} onClose={() => setShowAdminRainControl(false)} />
                    </div>"""
content_chat = content_chat.replace(old_modal_wrapper, new_modal_wrapper)

with open(filename_chat, 'w') as f:
    f.write(content_chat)

print("Updated AdminRainControl and ModernChat for better UI")
