import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add TippingModal import
if 'import TippingModal' not in content:
    content = content.replace("import AdminRainControl from './AdminRainControl';", "import AdminRainControl from './AdminRainControl';\nimport TippingModal from './chat/TippingModal';")

# Add state
if 'const [tippingUser, setTippingUser]' not in content:
    content = content.replace('const [showAdminRainControl, setShowAdminRainControl] = useState(false);', 'const [showAdminRainControl, setShowAdminRainControl] = useState(false);\n    const [tippingUser, setTippingUser] = useState<string | null>(null);')

# Make the rain button open a general "Rain Status" or user-funded rain if they are not admin.
# Wait, the user already said it's "pasif". I will make the Rain button open a nice tooltip or modal.
old_rain_btn = """                    {/* Admin Rain Control Button */}
                    {isAuthorized(userRole) && (
                        <button 
                            onClick={() => setShowAdminRainControl(true)}
                            className="btn-icon-modern !w-8 !h-8 !rounded-lg"
                            title="Admin Yağmur Kontrolü"
                        >
                            <span className="text-xl">🌧️</span>
                        </button>
                    )}"""

new_rain_btn = """                    {/* Rain Event Button (Admin can control, users can view status) */}
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
content = content.replace(old_rain_btn, new_rain_btn)

# Add Tip click handler to username span
# Replace the old `span className="font-black...` with an interactive one.
old_span = """                                    <span 
                                        className={`font-black tracking-tight text-[12.5px] hover:underline decoration-white/20 underline-offset-2 truncate max-w-full ${isAdmin ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`}
                                        style={{ color: isAdmin ? '#ffffff' : isVip ? '#FFD700' : userColor }}
                                    >
                                        {userName}
                                    </span>"""

new_span = """                                    <span 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (siteUser && userName !== siteUser.username) {
                                                setTippingUser(userName);
                                            }
                                        }}
                                        className={`font-black tracking-tight text-[12.5px] cursor-pointer hover:underline decoration-white/50 underline-offset-2 truncate max-w-full transition-all ${isAdmin ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'hover:scale-105'}`}
                                        style={{ color: isAdmin ? '#ffffff' : isVip ? '#FFD700' : userColor }}
                                    >
                                        {userName}
                                    </span>"""
content = content.replace(old_span, new_span)

# Add Tip message rendering
old_betshare = """                        const isBetShare = (msg.message || '').startsWith('[BET_SHARE:');"""
new_betshare = """                        const isBetShare = (msg.message || '').startsWith('[BET_SHARE:');
                        const isTip = (msg.message || '').startsWith('[TIP]');"""
content = content.replace(old_betshare, new_betshare)

# Render [TIP] message beautifully
# Find: if (text.startsWith('[RAIN_EVENT]'))
old_rain_msg = """  if (text.startsWith('[RAIN_EVENT]')) {
      const rainMsg = text.replace('[RAIN_EVENT]', '').trim();
      return <RainDropMessage rainMsg={rainMsg} />;
  }"""

new_rain_msg = """  if (text.startsWith('[RAIN_EVENT]')) {
      const rainMsg = text.replace('[RAIN_EVENT]', '').trim();
      return <RainDropMessage rainMsg={rainMsg} />;
  }

  if (text.startsWith('[TIP]')) {
      return (
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-3 my-2 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-3">
              <div className="text-2xl animate-bounce">💸</div>
              <div className="text-[#10B981] font-bold text-sm leading-tight">
                  {text.replace('[TIP]', '').trim()}
              </div>
          </div>
      );
  }"""
content = content.replace(old_rain_msg, new_rain_msg)

# Render the TippingModal
# Right after AdminRainControl
old_modals = """                    {showAdminRainControl && (
                        <AdminRainControl adminId={siteUser?.id || 'admin'} />
                    )}"""

new_modals = """                    {showAdminRainControl && (
                        <AdminRainControl adminId={siteUser?.id || 'admin'} />
                    )}
                    {tippingUser && siteUser && (
                        <TippingModal 
                            recipientUsername={tippingUser} 
                            senderUsername={siteUser.username || 'Gizli'} 
                            onClose={() => setTippingUser(null)} 
                            onSuccess={(amount) => {
                                triggerGlobalToast(`Başarıyla ${amount}₺ bahşiş gönderdiniz!`, 'success');
                            }}
                        />
                    )}"""
content = content.replace(old_modals, new_modals)

with open(filename, 'w') as f:
    f.write(content)
print("Updated ModernChat.tsx with Tipping logic")
