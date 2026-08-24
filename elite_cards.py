import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Upgrade Card Container Styles
# Replace the style block of the card container
old_card_style = """                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${method.theme.bg} 0%, #11151f 100%)` 
                          : '#121722',
                        borderColor: isSelected ? method.theme.color : 'rgba(255,255,255,0.05)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                      }}"""

new_card_style = """                      style={{
                        background: isSelected 
                          ? `linear-gradient(145deg, ${method.theme.bg} 0%, #0d111a 100%)` 
                          : '#10141d',
                        borderColor: isSelected ? method.theme.color + '80' : 'rgba(255,255,255,0.03)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        boxShadow: isSelected 
                          ? `inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.5), 0 15px 35px ${method.theme.color}30, 0 0 15px ${method.theme.color}10` 
                          : 'inset 0 1px 1px rgba(255,255,255,0.02), inset 0 -1px 1px rgba(0,0,0,0.4)',
                      }}"""
content = content.replace(old_card_style, new_card_style)

# 2. Upgrade the Button inside the card
old_button = """                          <div 
                            className={`w-full py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-300 mt-auto ${
                              isSelected 
                                ? 'text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                : 'border border-white/10 text-white/50 group-hover:text-white/80 group-hover:border-white/30'
                            }`}
                            style={{
                              backgroundColor: isSelected ? method.theme.color : 'transparent',
                            }}
                          >
                            {isSelected ? 'Seçildi' : method.badge}
                          </div>"""

new_button = """                          <div 
                            className={`w-full py-1.5 rounded-[8px] text-[10px] font-black tracking-widest uppercase transition-all duration-300 mt-auto flex items-center justify-center ${
                              isSelected 
                                ? 'text-white' 
                                : 'text-white/40 group-hover:text-white/70'
                            }`}
                            style={{
                              background: isSelected 
                                ? `linear-gradient(180deg, ${method.theme.color} 0%, ${method.theme.color}aa 100%)` 
                                : 'rgba(0,0,0,0.4)',
                              boxShadow: isSelected
                                ? `inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.4), 0 5px 15px ${method.theme.color}50`
                                : 'inset 1px 1px 3px rgba(0,0,0,0.8), inset -1px -1px 1px rgba(255,255,255,0.03)',
                              border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.02)',
                              textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.8)' : 'none',
                              letterSpacing: '0.15em'
                            }}
                          >
                            {isSelected ? 'SEÇİLDİ' : method.badge}
                          </div>"""
content = content.replace(old_button, new_button)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
