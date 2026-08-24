import re

filename = 'components/AdminProviderTab.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace header block to include Casino API Status
old_header = """            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Gamepad2 className="w-6 h-6 text-[#a855f7]" />
                        Sağlayıcı & RTP Radarı
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1 font-mono">DURUM: <span className="text-[#a855f7]">CANLI ANALİZ</span></p>
                </div>
            </div>"""

new_header = """            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-white/5 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Gamepad2 className="w-6 h-6 text-[#a855f7]" />
                        Sağlayıcı & RTP Radarı
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1 font-mono">DURUM: <span className="text-[#a855f7]">CANLI ANALİZ</span></p>
                </div>
            </div>
            
            {/* API 2 Status Banner */}
            <div className="bg-[#1e1b4b]/60 border border-[#a855f7]/30 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center">
                        <span className="text-2xl animate-pulse">🔌</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg tracking-wide uppercase">API 2 (Casino Hub)</h3>
                        <p className="text-sm text-zinc-400">Durum: <span className="text-yellow-400 font-bold">Entegrasyon Bekleniyor</span> • Gateway hazır.</p>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                    <button className="px-4 py-2 rounded text-sm font-bold bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/30 hover:bg-[#a855f7]/20 transition-all">Gateway Test Et</button>
                </div>
            </div>"""

content = content.replace(old_header, new_header)

# Theme Background adjustments
content = content.replace("bg-[#050608]", "bg-transparent")
content = content.replace("bg-[#0b0c10]", "bg-[#1e1b4b]/60 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]")

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
