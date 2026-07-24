import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'r') as f:
    content = f.read()

# Add imports
imports = """import VIPHeroBanner from './VIPHeroBanner';
import GamesHeroBanner from './GamesHeroBanner';
import HowItWorksCards from './HowItWorksCards';

import PlinkoView from './PlinkoView';
import LimboView from './LimboView';
import RouletteView from './RouletteView';
import BlackjackProView from './BlackjackProView';
import KenoView from './KenoView';
import ChickenRunView from './ChickenRunView';
import DiceView from './DiceView';
import MinesView from './MinesView';
import WarView from './WarView';
import HiLoView from './HiLoView';
import CrashTurboView from './CrashTurboView';
import TurboMinesView from './TurboMinesView';"""

content = re.sub(r"import VIPHeroBanner from './VIPHeroBanner';\nimport GamesHeroBanner from './GamesHeroBanner';\nimport HowItWorksCards from './HowItWorksCards';", imports, content)

# Change signature
old_sig = "export default function OriginalsHub({ onNavigate, isLoggedIn }: { onNavigate: (v: string) => void, isLoggedIn?: boolean }) {"
new_sig = "export default function OriginalsHub({ onNavigate, isLoggedIn, siteUser, setSiteUser, onAuthRequired }: any) {"
content = content.replace(old_sig, new_sig)

# Add activeGame state and handleInternalPlay
old_state = "const [selectedGame, setSelectedGame] = useState<GameData | null>(null);"
new_state = """const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
    const [activeGame, setActiveGame] = useState<string | null>(null);

    const handleInternalPlay = (path: string) => {
        const supported = ['plinko', 'limbo', 'roulette', 'blackjack-pro', 'keno', 'chicken-run', 'dice', 'mines', 'war', 'hilo', 'crash-turbo', 'turbo-mines'];
        if (supported.includes(path)) {
            setActiveGame(path);
        } else {
            onNavigate(path);
        }
    };"""
content = content.replace(old_state, new_state)

# Replace VIP & GamesHeroBanner section
old_vip = """                {/* VIP Dashboard & Hero Banner */}
                <div className="w-full my-4">
                   <VIPHeroBanner />
                   <div className="mt-8">
                     <GamesHeroBanner onNavigate={onNavigate} />
                   </div>
                </div>"""

new_vip = """                {/* VIP Dashboard & Hero Banner */}
                <div className="w-full my-4">
                   <VIPHeroBanner />
                   
                   <div className="mt-8 relative z-[100] transition-all duration-500 animate-fade-in">
                      {activeGame ? (
                          <div className="w-full flex flex-col">
                             <div className="w-full flex justify-between items-center mb-4">
                                <h3 className="text-[#00ffff] font-arcade text-lg tracking-widest">{activeGame.toUpperCase()}</h3>
                                <button 
                                  onClick={() => setActiveGame(null)}
                                  className="text-[#ff0055] hover:text-white transition-colors bg-[#ff0055]/10 border border-[#ff0055]/30 hover:bg-[#ff0055]/20 px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,85,0.2)]"
                                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }}
                                >
                                   <span className="font-black">X OYUNU KAPAT</span>
                                </button>
                             </div>
                             <div className="w-full rounded-2xl overflow-hidden border-2 border-[#00ffff]/30 shadow-[0_0_50px_rgba(0,255,255,0.15)] relative flex flex-col bg-[#050505]" style={{ minHeight: '650px' }}>
                                 {activeGame === 'plinko' && <PlinkoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'limbo' && <LimboView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'roulette' && <RouletteView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'blackjack-pro' && <BlackjackProView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'keno' && <KenoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'chicken-run' && <ChickenRunView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'dice' && <DiceView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'mines' && <MinesView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'war' && <WarView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'hilo' && <HiLoView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'crash-turbo' && <CrashTurboView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                                 {activeGame === 'turbo-mines' && <TurboMinesView siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={onAuthRequired} />}
                             </div>
                          </div>
                      ) : (
                          <GamesHeroBanner onNavigate={handleInternalPlay} />
                      )}
                   </div>
                </div>"""
content = content.replace(old_vip, new_vip)

# Also update the bottom Retro Arcade Game Cards onNavigate
old_retro_onnav = "onClick={() => onNavigate(game.path)}"
new_retro_onnav = "onClick={() => handleInternalPlay(game.path)}"
content = content.replace(old_retro_onnav, new_retro_onnav)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsHub.tsx', 'w') as f:
    f.write(content)

