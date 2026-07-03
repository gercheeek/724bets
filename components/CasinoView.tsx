import React, { useState, useEffect } from 'react';
import { Play, Search, X, Spade, Sparkles, Tv, HelpCircle, Star, Users, Gamepad2, ArrowLeft } from 'lucide-react';
import { CasinoLobbyGame } from '../types';

interface CasinoViewProps {
  games: CasinoLobbyGame[];
  siteUser: any;
  userRole: string | null;
  onBack: () => void;
}

const CasinoView: React.FC<CasinoViewProps> = ({ games = [], siteUser, userRole, onBack }) => {
  const [activeGame, setActiveGame] = useState<CasinoLobbyGame | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'slot' | 'live'>('all');

  // Set the first active game if available
  useEffect(() => {
    if (games.length > 0 && !activeGame) {
      const active = games.find(g => g.isActive);
      if (active) setActiveGame(active);
    }
  }, [games]);

  const filteredGames = games.filter(g => {
    if (!g.isActive) return false;
    if (selectedType !== 'all' && g.type !== selectedType) return false;
    if (searchQuery.trim()) {
      return (
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#040507', fontFamily: "'Inter', sans-serif", paddingBottom: '80px', color: '#fff' }}>
      <style>{`
        .casino-wrap { max-width: 1400px; margin: 0; width: 100%; padding: 16px; display: flex; flex-direction: column; gap: 20px; }
        .casino-main-row { display: flex; gap: 20px; width: 100%; align-items: stretch; }
        .game-iframe-wrap { flex: 1; aspect-ratio: 16/9; min-width: 280px; position: relative; background: #000; border-radius: 18px; border: 1px solid rgba(240, 185, 11, 0.15); box-shadow: 0 12px 40px rgba(0,0,0,0.6); overflow: hidden; }
        .game-list-wrap { width: 340px; position: relative; flex-shrink: 0; }
        .game-list-inner { position: absolute; inset: 0; width: 100%; height: 100%; display: flex; flex-direction: column; background: rgba(8,10,16,0.95); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); overflow: hidden; }
        .game-list-scroll { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        
        .game-card { display: flex; alignItems: center; gap: 12px; padding: 10px 14px; borderRadius: 12px; cursor: pointer; transition: all 0.2s; }
        
        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,.01); border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(240,185,11,.2); border-radius: 99px; }

        @media (max-width: 900px) {
          .casino-main-row { flex-direction: column; }
          .game-list-wrap { width: 100%; height: 380px; }
          .game-list-inner { position: relative; }
        }
      `}</style>

      <div className="casino-wrap">
        {/* ═══ Top Carousel/Hero Header ═══ */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', userSelect: 'none', background: 'linear-gradient(135deg, #0f0c20 0%, #150e10 100%)', border: '1px solid rgba(240,185,11,0.15)', minHeight: '180px', display: 'flex', alignItems: 'center', padding: '30px 40px' }}>
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ background: '#F0B90B', color: '#000', fontSize: '9px', fontWeight: 900, padding: '4px 10px', borderRadius: '20px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                🎰 CASINO LOBİSİ
              </span>
              <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>{games.filter(g => g.isActive).length} aktif oyun</span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', margin: '0 0 8px', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.5px' }}>
              DEMO SLOT OYUNLARI
            </h1>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 16px', fontWeight: 500 }}>
              Kayıt olmadan, yatırım yapmadan en popüler casino oyunlarını hemen test etmeye başla!
            </p>
            <button onClick={onBack} style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '11px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} /> GERİ DÖN
            </button>
          </div>
          <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', fontSize: '100px', opacity: 0.1, pointerEvents: 'none' }}>🎰</div>
        </div>

        {/* ═══ Main Playing Area ═══ */}
        <div className="casino-main-row">
          {/* Left Iframe Box */}
          <div className="game-iframe-wrap">
            {activeGame ? (
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <iframe
                  src={activeGame.link}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen={true}
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  title={activeGame.name}
                />
              </div>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F0B90B', gap: '12px' }}>
                <Gamepad2 style={{ width: 48, height: 48, opacity: 0.5 }} />
                <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>Lütfen listeden bir oyun seçiniz.</p>
              </div>
            )}
          </div>

          {/* Right Game List Sidebar */}
          <div className="game-list-wrap">
            <div className="game-list-inner">
              {/* Type Switch Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.05)', background: 'rgba(255,255,255,.02)', flexShrink: 0 }}>
                {[
                  { id: 'all', label: 'TÜMÜ', icon: '🎰' },
                  { id: 'slot', label: 'SLOTLAR', icon: '🍒' },
                  { id: 'live', label: 'CANLI CASINO', icon: '🎡' },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setSelectedType(tab.id as any)}
                    style={{ flex: 1, padding: '12px 2px', border: 'none', background: selectedType === tab.id ? 'rgba(240,185,11,.1)' : 'transparent', color: selectedType === tab.id ? '#F0B90B' : '#9ca3af', borderBottom: `2px solid ${selectedType === tab.id ? '#F0B90B' : 'transparent'}`, cursor: 'pointer', transition: 'all .2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                    <span style={{ fontSize: '9px', fontWeight: 900 }}>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,.05)', flexShrink: 0 }}>
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#6b7280' }} />
                  <input type="text" placeholder="Oyun veya sağlayıcı ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '10px', padding: '10px 10px 10px 36px', color: '#fff', fontSize: '13px', outline: 'none' }} />
                </div>
              </div>

              {/* Scrollable Game List */}
              <div className="game-list-scroll custom-scrollbar">
                {filteredGames.length === 0 && <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', marginTop: '20px' }}>Oyun bulunamadı.</div>}
                {filteredGames.map(game => {
                  const isActive = activeGame?.id === game.id;
                  return (
                    <div
                      key={game.id}
                      onClick={() => setActiveGame(game)}
                      className="game-card"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: isActive ? 'rgba(240,185,11,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? '#F0B90B' : 'rgba(255,255,255,0.05)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {/* Image Thumbnail */}
                      <div style={{ width: '60px', height: '40px', borderRadius: '6px', background: 'rgba(0,0,0,0.5)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                        {game.image ? (
                          <img src={game.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #111 0%, #222 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>🎰</div>
                        )}
                      </div>

                      {/* Description */}
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: isActive ? '#F0B90B' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {game.name}
                        </div>
                        <div style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {game.provider}
                        </div>
                      </div>

                      {/* Play Button Indicator */}
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isActive ? '#F0B90B' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Play size={10} color={isActive ? '#000' : '#fff'} style={{ marginLeft: '1px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CasinoView;
