import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace the rain button block
old_rain_btn = """                    {/* Rain Button */}
                    <button 
                        onClick={() => {
                            if (isAuthorized(userRole)) {
                                setShowAdminRainControl(true);
                            } else {
                                triggerGlobalToast('Kripto Yağmuru (Rain) etkinlikleri rastgele başlar. Gözünü chatten ayırma!', 'info');
                            }
                        }}
                        className={`btn-icon-modern !w-8 !h-8 !rounded-lg transition-all ${isAuthorized(userRole) ? 'bg-[#10B981]/20 border border-[#10B981]/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'hover:bg-white/10'}`}
                        title={isAuthorized(userRole) ? "Admin Yağmur Kontrolü" : "Yağmur Etkinliği"}
                    >
                        <span className="text-xl">🌧️</span>
                    </button>"""

new_rain_btn = """                    {/* Admin Command Center Button */}
                    {isAuthorized(userRole) && (
                        <button 
                            onClick={() => setShowAdminRainControl(true)}
                            className="btn-icon-modern !w-8 !h-8 !rounded-lg transition-all bg-[#10B981]/20 border border-[#10B981]/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:bg-[#10B981]/30"
                            title="Admin Komuta Merkezi"
                        >
                            <span className="text-xl">🌧️</span>
                        </button>
                    )}"""

content = content.replace(old_rain_btn, new_rain_btn)

with open(filename, 'w') as f:
    f.write(content)
print("Hidden admin button from non-admins")
