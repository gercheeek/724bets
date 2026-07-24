import re

def add_gamdom_bg():
    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'r') as f:
        content = f.read()

    # The main container is: <div className="h-screen w-full flex flex-col bg-black text-white overflow-hidden relative">
    # Let's replace bg-black with bg-[#0b0e14] (Gamdom dark blue/gray base)
    content = content.replace('<div className="h-screen w-full flex flex-col bg-black text-white overflow-hidden relative">',
                              '<div className="h-screen w-full flex flex-col bg-[#0b0e14] text-white overflow-hidden relative">')

    # Then in the <main id="main-scroll-container" ...>
    # Let's add absolute positioned ambient glows inside the main scroll container
    # so they scroll with the content or stay fixed behind it.
    
    target_pattern = r'(<main[^>]*id="main-scroll-container"[^>]*>)'
    
    gamdom_bg = r"""\1
            {/* Gamdom Style Global Ambient Shading / Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00ffff]/[0.015] blur-[150px] rounded-full"></div>
                <div className="absolute top-[30%] right-[-10%] w-[40%] h-[60%] bg-[#880088]/[0.015] blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-[#00ff88]/[0.01] blur-[150px] rounded-full"></div>
                {/* Global subtle radial gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(255,255,255,0.01),transparent_70%)]"></div>
            </div>"""
    
    content = re.sub(target_pattern, gamdom_bg, content, count=1)

    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'w') as f:
        f.write(content)

add_gamdom_bg()
print("Gamdom background applied")

