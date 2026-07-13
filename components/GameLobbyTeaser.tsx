import React, { useRef } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { CasinoLobbyGame } from '../types';

const FEATURED_GAMES = [
  { id: 'mines', name: 'Mines', icon: '💎', color: '#1e90ff', gradient: 'linear-gradient(145deg, #0a1a3a 0%, #0d2a5e 100%)', glowColor: 'rgba(30,144,255,0.3)', link: 'https://gamdom.com/r/724bahis' },
  { id: 'cark', name: 'Çark', icon: '🎡', color: '#20b2aa', gradient: 'linear-gradient(145deg, #051a18 0%, #0a3330 100%)', glowColor: 'rgba(32,178,170,0.3)', link: 'https://gamdom.com/r/724bahis' },
  { id: 'dice', name: 'Dice', icon: '🎲', color: '#cd853f', gradient: 'linear-gradient(145deg, #1a0f05 0%, #3a2010 100%)', glowColor: 'rgba(205,133,63,0.3)', link: 'https://gamdom.com/r/724bahis' },
  { id: 'blackjack', name: 'Blackjack', icon: '🃏', color: '#9370db', gradient: 'linear-gradient(145deg, #100a1a 0%, #1e1035 100%)', glowColor: 'rgba(147,112,219,0.3)', link: 'https://gamdom.com/r/724bahis' },
  { id: 'rulet', name: 'Rulet', icon: '🔴', color: '#dc143c', gradient: 'linear-gradient(145deg, #1a0506 0%, #3a0a10 100%)', glowColor: 'rgba(220,20,60,0.3)', link: 'https://gamdom.com/r/724bahis' },
];

const DEFAULT_CASINO_GAMES: CasinoLobbyGame[] = [
  { id: 'fruit_party', name: 'Fruit Party', provider: 'Pragmatic Play', type: 'slot', themeColor: 'from-[#FF1744] to-[#FF8F00]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 1 },
  { id: 'sugar_rush', name: 'Sugar Rush', provider: 'Pragmatic Play', type: 'slot', themeColor: 'from-[#E040FB] to-[#FF4081]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 2 },
  { id: 'shining_crown', name: 'Shining Crown', provider: 'Amusnet', type: 'slot', themeColor: 'from-[#FFD54F] to-[#8D6E63]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 3 },
  { id: 'big_bass', name: 'Big Bass Bonanza', provider: 'Reel Kingdom', type: 'slot', themeColor: 'from-[#00E5FF] to-[#1A237E]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 4 },
  { id: 'gates_olympus', name: 'Gates of Olympus', provider: 'Pragmatic Play', type: 'slot', themeColor: 'from-[#F5A623] to-[#3E2723]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 5 },
  { id: 'le_bandit', name: 'Le Bandit', provider: 'Hacksaw Gaming', type: 'slot', themeColor: 'from-[#78909C] to-[#263238]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 6 },
  { id: 'rip_city', name: 'R.I.P. City', provider: 'Hacksaw Gaming', type: 'slot', themeColor: 'from-[#37474F] to-[#000000]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 7 },
  { id: 'sweet_candyland', name: 'Sweet Bonanza Candyland', provider: 'Pragmatic Play', type: 'live', themeColor: 'from-[#F50057] to-[#F50057]/40', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 8 },
  { id: 'crazy_time', name: 'Crazy Time', provider: 'Evolution Gaming', type: 'live', themeColor: 'from-[#FF3D00] to-[#FFEA00]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 9 },
  { id: 'baccarat_live', name: 'Baccarat Live', provider: 'Evolution Gaming', type: 'live', themeColor: 'from-[#D50000] to-[#000000]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 10 },
  { id: 'candy_wheel', name: 'Candy Wheel Live', provider: 'Pragmatic Play', type: 'live', themeColor: 'from-[#AA00FF] to-[#311B92]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 11 },
  { id: 'lightning_roulette', name: 'Lightning Roulette', provider: 'Evolution Gaming', type: 'live', themeColor: 'from-[#FFD54F] to-[#00E5FF]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 12 },
  { id: 'speed_baccarat', name: 'Speed Baccarat', provider: 'Evolution Gaming', type: 'live', themeColor: 'from-[#C51162] to-[#1A237E]', image: '', link: 'https://gamdom.com/r/724bahis', isActive: true, order: 13 }
];

interface GameLobbyTeaserProps {
  games?: CasinoLobbyGame[];
  onViewChange: (view: any) => void;
  onPlayGame?: (gameId: string) => void;
}

const GameLobbyTeaser: React.FC<GameLobbyTeaserProps> = ({ games = [], onViewChange, onPlayGame }) => {
  const slotsScrollRef = useRef<HTMLDivElement>(null);
  const liveScrollRef = useRef<HTMLDivElement>(null);

  const activeGamesList = games.length > 0 ? games : DEFAULT_CASINO_GAMES;

  const slotGames = activeGamesList
    .filter(g => g.type === 'slot' && g.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const liveGames = activeGamesList
    .filter(g => g.type === 'live' && g.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const scroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const handleCardClick = (game: CasinoLobbyGame) => {
    if (game.link) window.open(game.link, '_blank');
  };

  const siteGold = '#f2a900';
  const liveGreen = '#00E676';

  const sectionStyle: React.CSSProperties = {
    background: 'linear-gradient(160deg, #040a04 0%, #060e06 100%)',
    border: '1px solid rgba(242, 169, 0, 0.15)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    position: 'relative',
    overflow: 'hidden',
  };

  const navBtnStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s',
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0px', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .game-card-hover { transition: transform 0.3s ease; }
        .game-card-hover:hover { transform: translateY(-3px); }
        .game-tile-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .game-tile-hover:hover { transform: scale(1.06); }
        .game-hover-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.85); opacity: 0; transition: opacity 0.3s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
        .game-card-hover:hover .game-hover-overlay { opacity: 1; }
      `}</style>

      {/* ══════════ OYUNLAR (Featured Games) ══════════ */}
      <div style={sectionStyle}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(242, 169, 0, 0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '4px', height: '20px', background: siteGold, borderRadius: '2px', boxShadow: `0 0 8px ${siteGold}` }} />
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '2px' }}>OYUNLAR</span>
          </div>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>Gamdom ile oyna</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', position: 'relative', zIndex: 2 }}>
          {FEATURED_GAMES.map((game) => (
            <a
              key={game.id}
              href={game.link}
              target={game.id === 'blackjack' && onPlayGame ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="game-tile-hover"
              onClick={(e) => {
                if (game.id === 'blackjack' && onPlayGame) {
                  e.preventDefault();
                  onPlayGame('blackjack');
                }
              }}
              style={{
                background: game.gradient,
                border: `1px solid ${game.color}33`,
                borderRadius: '8px',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                textDecoration: 'none',
                boxShadow: `0 4px 20px ${game.glowColor}`,
                aspectRatio: '1 / 1.35',
              }}
            >
              <span style={{ fontSize: '28px', lineHeight: 1, filter: `drop-shadow(0 0 8px ${game.glowColor})` }}>{game.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>{game.name}</span>
            </a>
          ))}
          {/* Tüm Oyunlar tile */}
          <a
            href="https://gamdom.com/r/724bahis"
            target="_blank"
            rel="noopener noreferrer"
            className="game-tile-hover"
            style={{
              background: 'rgba(242, 169, 0, 0.05)',
              border: '1px solid rgba(242, 169, 0, 0.2)',
              borderRadius: '8px',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              textDecoration: 'none',
              aspectRatio: '1 / 1.35',
            }}
          >
            <span style={{ fontSize: '22px', color: siteGold }}>→</span>
            <span style={{ fontSize: '9px', fontWeight: 900, color: siteGold, textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', lineHeight: 1.2 }}>TÜM OYUNLAR</span>
          </a>
        </div>
      </div>

      {/* ══════════ SLOT GAMES ══════════ */}
      {slotGames.length > 0 && (
        <div style={sectionStyle}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 50%, rgba(242, 169, 0, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '20px', background: '#F5A623', borderRadius: '2px', boxShadow: '0 0 8px rgba(255,193,7,0.5)' }} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '2px' }}>SLOT OYUNLARI</span>
                <p style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', margin: '2px 0 0' }}>En çok kazandıran slotlar</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => scroll(slotsScrollRef, 'left')} style={navBtnStyle}>
                <ChevronLeft style={{ width: '14px', height: '14px' }} />
              </button>
              <button onClick={() => scroll(slotsScrollRef, 'right')} style={navBtnStyle}>
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>

          <div ref={slotsScrollRef} className="scrollbar-none" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', position: 'relative', zIndex: 2 }}>
            {slotGames.map(game => (
              <div
                key={game.id}
                onClick={() => handleCardClick(game)}
                className="game-card-hover"
                style={{
                  minWidth: '130px', width: '130px', height: '100px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                  background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,193,7,0.1)', position: 'relative',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)', flexShrink: 0,
                }}
              >
                {game.image ? (
                  <img src={game.image} alt={game.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#0d0d0d' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px', background: 'rgba(0,0,0,0.3)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#fff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{game.name}</span>
                  <span style={{ fontSize: '7px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{game.provider}</span>
                </div>
                <div className="game-hover-overlay">
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F5A623', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(255,193,7,0.4)' }}>
                    <Play style={{ width: '14px', height: '14px', color: '#000', fill: '#000' }} />
                  </div>
                  <span style={{ fontSize: '7px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>HEMEN OYNA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ LIVE CASINO ══════════ */}
      {liveGames.length > 0 && (
        <div style={sectionStyle}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 80%, rgba(242, 169, 0, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '20px', background: siteGold, borderRadius: '2px', boxShadow: `0 0 8px ${siteGold}` }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#e0e0e0', textTransform: 'uppercase', letterSpacing: '2px' }}>CANLI CASINO</span>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: liveGreen, boxShadow: `0 0 8px ${liveGreen}` }} />
                </div>
                <p style={{ fontSize: '9px', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', margin: '2px 0 0' }}>Canlı masalara katıl</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => scroll(liveScrollRef, 'left')} style={navBtnStyle}>
                <ChevronLeft style={{ width: '14px', height: '14px' }} />
              </button>
              <button onClick={() => scroll(liveScrollRef, 'right')} style={navBtnStyle}>
                <ChevronRight style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>

          <div ref={liveScrollRef} className="scrollbar-none" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', position: 'relative', zIndex: 2 }}>
            {liveGames.map(game => (
              <div
                key={game.id}
                onClick={() => handleCardClick(game)}
                className="game-card-hover"
                style={{
                  minWidth: '130px', width: '130px', height: '100px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                  background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(242, 169, 0, 0.1)', position: 'relative',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.4)', flexShrink: 0,
                }}
              >
                {game.image ? (
                  <img src={game.image} alt={game.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#0d0d0d' }} />
                )}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px', background: 'rgba(0,0,0,0.3)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#fff', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>{game.name}</span>
                  <span style={{ fontSize: '7px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{game.provider}</span>
                </div>
                <div className="game-hover-overlay">
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: siteGold, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 15px ${siteGold}66` }}>
                    <Play style={{ width: '14px', height: '14px', color: '#000', fill: '#000' }} />
                  </div>
                  <span style={{ fontSize: '7px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>HEMEN OYNA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLobbyTeaser;
