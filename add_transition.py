import re

def add_transition():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'r') as f:
        content = f.read()

    # Add state for loading
    # Need to import useState if not there
    if 'useState' not in content:
        content = content.replace("import React from 'react';", "import React, { useState } from 'react';")
    else:
        # Check if useState is used
        pass

    # Add loading state variables
    # const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);
    # -> 
    # const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);
    # const [isLoadingGame, setIsLoadingGame] = useState<string | null>(null);
    
    content = content.replace('const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);', 
                              'const [hoveredGameId, setHoveredGameId] = useState<string | null>(null);\n  const [isLoadingGame, setIsLoadingGame] = useState<string | null>(null);')

    # Add the loading overlay to the return statement.
    # Where does it return? At the top of the component return:
    # return (
    #   <div className="relative w-full rounded-3xl overflow-hidden ...
    
    loader_overlay = """
      {isLoadingGame && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] animate-fade-in backdrop-blur-md">
          <div className="flex flex-col items-center gap-6 animate-pulse">
            <img src="/logo.png" alt="724BETS" className="h-16 md:h-20 drop-shadow-[0_0_20px_rgba(0,255,136,0.5)] animate-bounce" />
            <div className="text-[#00ff88] font-arcade text-xl md:text-2xl tracking-widest drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
              OYUN YÜKLENIYOR...
            </div>
            {/* Loading Bar */}
            <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-gradient-to-r from-[#00ff88] to-[#a855f7] animate-[shimmer_3s_ease-in-out_forwards] w-full" style={{ transformOrigin: 'left', animationName: 'scaleX', animationDuration: '3s' }}></div>
            </div>
          </div>
        </div>
      )}
"""
    content = content.replace('      {/* Breathing Mesh / Cinematic Particle Background */}', loader_overlay + '\n      {/* Breathing Mesh / Cinematic Particle Background */}')

    # Change onClick handler
    # onClick={() => { window.dispatchEvent(new CustomEvent('openGame', { detail: game.id })) }}
    # ->
    # onClick={() => { handlePlayGame(game.id) }}
    
    # We need to add handlePlayGame before return
    handle_play_game = """
  const handlePlayGame = (gameId: string) => {
    setIsLoadingGame(gameId);
    setTimeout(() => {
      setIsLoadingGame(null);
      // Try to open standard game if possible, otherwise dispatch custom event
      window.dispatchEvent(new CustomEvent('openGame', { detail: gameId }));
      // Let's also dispatch navigate event since it might be an original game
      const path = gameId === 'plinko' ? 'plinko' : gameId === 'limbo' ? 'mission' : gameId;
      window.dispatchEvent(new CustomEvent('navigate', { detail: path }));
    }, 3000);
  };
"""
    content = content.replace('  return (', handle_play_game + '\n  return (')
    content = content.replace("onClick={() => { window.dispatchEvent(new CustomEvent('openGame', { detail: game.id })) }}", "onClick={() => handlePlayGame(game.id)}")
    
    # Also update the Hemen Oyna button onClick so it does the same instead of bubbling (or it will bubble to the card anyway, so let's just make the button pointer-events-none or let it bubble)
    # The button currently: <button className="... Hemen Oyna ...">
    content = content.replace('<button className="bg-[#00ff88]/10', '<button onClick={(e) => { e.stopPropagation(); handlePlayGame(game.id); }} className="bg-[#00ff88]/10')

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GamesHeroBanner.tsx', 'w') as f:
        f.write(content)

add_transition()
print("Added transition loader")
