import re

def fix_app_chat():
    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'r') as f:
        content = f.read()

    # Find the aside for chat
    # It starts with: <aside className={`hidden xl:flex flex-col bg-[#0b0e14] border-l border-white/5
    # Replace it with dynamic styling based on view === 'originals'

    target = r'<aside className={`hidden xl:flex flex-col bg-\[#0b0e14\] border-l border-white/5 shadow-\[-20px_0_50px_rgba\(0,0,0,0\.8\)\] h-full flex-shrink-0 relative z-20 transition-all duration-300 ease-in-out \$\{isChatOpen \? \'w-\[350px\]\' : \'w-0 overflow-hidden opacity-0\'\}`>.*?</aside>'
    
    replacement = """<aside className={`hidden xl:flex flex-col ${view === 'originals' ? 'bg-[#050510] border-l-4 border-[#880088] shadow-[-10px_0_30px_rgba(0,255,255,0.15)] font-mono' : 'bg-[#0b0e14] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.8)]'} h-full flex-shrink-0 relative z-20 transition-all duration-300 ease-in-out ${isChatOpen ? 'w-[350px]' : 'w-0 overflow-hidden opacity-0'}`}>
                <div className={`flex items-center justify-between p-4 border-b ${view === 'originals' ? 'border-[#880088] bg-[#0a0a1a]' : 'border-white/5 bg-black'} h-[70px] whitespace-nowrap`}>
                  <h3 className={`${view === 'originals' ? 'text-[#00ffff] font-[\\'Press_Start_2P\\'] text-[10px] drop-shadow-[2px_2px_0_#880088]' : 'text-white font-bold text-sm'} tracking-wider uppercase flex items-center gap-2`}>
                    <span className={`w-2 h-2 ${view === 'originals' ? 'bg-[#ff00ff] rounded-none shadow-[0_0_5px_#ff00ff]' : 'bg-amber-500 rounded-full'} animate-pulse`}></span>
                    Sohbet & Bildirimler
                  </h3>
                  <button onClick={() => setIsChatOpen(false)} className={`${view === 'originals' ? 'text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff]/10' : 'text-gray-400 hover:text-white hover:bg-white/10'} p-1 rounded-md transition-colors`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <ModernChat
                    open={isChatOpen}
                    onOpen={() => setIsChatOpen(true)}
                    onClose={() => setIsChatOpen(false)}
                    siteUser={siteUser}
                    userRole={userRole}
                    isMobile={false}
                    activeView={view}
                  />
                </div>
              </aside>"""

    content = re.sub(target, replacement, content, flags=re.DOTALL)

    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'w') as f:
        f.write(content)

fix_app_chat()
print("App.tsx updated")

