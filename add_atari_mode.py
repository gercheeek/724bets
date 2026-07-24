import re

with open('/Users/alex/Desktop/7_24bets-landing-page/index.css', 'a') as f:
    f.write("""

/* =========================================
   ATARI / 90s ARCADE GAME MODE OVERRIDES 
   ========================================= */

.atari-game-mode {
    font-family: 'Press Start 2P', monospace !important;
}

/* Add a CRT scanline effect over the entire game container */
.atari-game-mode::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    z-index: 50;
    background-size: 100% 3px, 3px 100%;
    pointer-events: none;
    opacity: 0.8;
}

/* A slight flicker animation for authenticity */
@keyframes crt-flicker {
    0% { opacity: 0.95; }
    5% { opacity: 0.85; }
    10% { opacity: 0.95; }
    15% { opacity: 1; }
    100% { opacity: 1; }
}
.atari-game-mode {
    animation: crt-flicker 0.15s infinite;
}

/* Force 90s fonts on all text inside the game */
.atari-game-mode * {
    font-family: 'Press Start 2P', monospace !important;
    letter-spacing: -1px;
}

/* Override sleek sidebars and backgrounds to pure black/neon */
.atari-game-mode > div {
    background-color: #000000 !important;
}

/* Override specific colors (like the grey sidebars in Plinko) */
.atari-game-mode [class*="bg-[#222E3A]"], 
.atari-game-mode [class*="bg-[#10171E]"] {
    background-color: #050505 !important;
    border-color: #00ffff !important;
}

/* Override inputs and selects */
.atari-game-mode input, .atari-game-mode select {
    background-color: #000 !important;
    border: 2px solid #ff00ff !important;
    border-radius: 0 !important;
    color: #00ffff !important;
    box-shadow: inset 0 0 10px rgba(255,0,255,0.3);
    padding: 10px !important;
}
.atari-game-mode input:focus, .atari-game-mode select:focus {
    border-color: #00ffff !important;
    box-shadow: inset 0 0 10px rgba(0,255,255,0.5);
    outline: none !important;
}

/* Blocky Retro Buttons */
.atari-game-mode button {
    border-radius: 0 !important;
    text-transform: uppercase !important;
    transition: all 0.1s !important;
}

/* The main Bet buttons */
.atari-game-mode button[class*="bg-emerald-500"],
.atari-game-mode button[class*="bg-[#00E701]"] {
    background-color: transparent !important;
    border: 3px solid #00ffff !important;
    color: #00ffff !important;
    box-shadow: 4px 4px 0px rgba(0, 255, 255, 0.7) !important;
    text-shadow: 0 0 5px rgba(0,255,255,0.5);
}

.atari-game-mode button[class*="bg-emerald-500"]:active,
.atari-game-mode button[class*="bg-[#00E701]"]:active {
    box-shadow: 0px 0px 0px rgba(0, 255, 255, 0.7) !important;
    transform: translate(4px, 4px);
}

/* Small half/double buttons */
.atari-game-mode button.px-3 {
    border-left: 2px solid #ff00ff !important;
    background-color: #111 !important;
    color: #ff00ff !important;
}
.atari-game-mode button.px-3:hover {
    background-color: #ff00ff !important;
    color: #000 !important;
}

/* Tab buttons */
.atari-game-mode button.bg-\[\#324555\] {
    background-color: #00ffff !important;
    color: #000 !important;
    border-radius: 0 !important;
}
.atari-game-mode div.bg-\[\#151D24\] {
    background-color: transparent !important;
    border: 2px solid #333 !important;
    border-radius: 0 !important;
}

/* Text overrides */
.atari-game-mode label, .atari-game-mode span.text-gray-400 {
    color: #ff00ff !important;
    text-shadow: 0 0 5px rgba(255,0,255,0.3);
    font-size: 8px !important;
}

.atari-game-mode span.text-gray-300 {
    color: #00ffff !important;
    font-size: 8px !important;
}
""")

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

old_container = """<div className="w-full rounded-2xl overflow-hidden border-2 border-[#00ffff]/30 shadow-[0_0_50px_rgba(0,255,255,0.15)] relative flex flex-col bg-[#050505]" style={{ minHeight: '650px' }}>"""
new_container = """<div className="w-full rounded-none overflow-hidden border-4 border-[#00ffff] shadow-[0_0_50px_rgba(0,255,255,0.3),_inset_0_0_20px_rgba(255,0,255,0.2)] relative flex flex-col bg-[#000000] atari-game-mode" style={{ minHeight: '650px' }}>"""

content = content.replace(old_container, new_container)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)

