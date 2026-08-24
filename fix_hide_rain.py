import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# I will use a regex to replace the entire button block
pattern = r'\{\/\* Rain Event Button \(Admin can control, users can view status\) \*\/\}.*?<\/button>'
replacement = """{/* Admin Command Center Button */}
                    {isAuthorized(userRole) && (
                        <button 
                            onClick={() => setShowAdminRainControl(true)}
                            className="btn-icon-modern !w-8 !h-8 !rounded-lg transition-all bg-[#10B981]/20 border border-[#10B981]/50 shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:bg-[#10B981]/30"
                            title="Admin Komuta Merkezi"
                        >
                            <span className="text-xl">🌧️</span>
                        </button>
                    )}"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(filename, 'w') as f:
    f.write(content)
print("Regex replace applied")
