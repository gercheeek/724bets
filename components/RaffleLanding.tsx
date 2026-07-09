import React, { useState, useEffect, useCallback } from 'react';

interface RaffleLandingProps {
  onLoginRequired: () => void;
}

// Generate ticket data
const TICKET_COLORS = [
  { bg: 'linear-gradient(135deg,#1a1000,#0d0800)', border: 'rgba(245,166,35,0.4)', glow: 'rgba(245,166,35,0.15)' },
  { bg: 'linear-gradient(135deg,#0a0d1a,#060a14)', border: 'rgba(100,180,255,0.3)', glow: 'rgba(100,180,255,0.1)' },
  { bg: 'linear-gradient(135deg,#0d1a0a,#081406)', border: 'rgba(80,220,120,0.3)', glow: 'rgba(80,220,120,0.1)' },
  { bg: 'linear-gradient(135deg,#1a0a1a,#140614)', border: 'rgba(200,100,255,0.3)', glow: 'rgba(200,100,255,0.1)' },
];

const PRIZES = ['500 ₺', '1.000 ₺', '2.500 ₺', '5.000 ₺', '10.000 ₺', '25.000 ₺', '???', '🎁', '🎰', '💎'];

function generateTickets(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    number: String(100000 + Math.floor(Math.random() * 900000)),
    prize: PRIZES[Math.floor(Math.random() * PRIZES.length)],
    colorIdx: Math.floor(Math.random() * TICKET_COLORS.length),
    claimed: Math.random() > 0.6,
    isSpecial: Math.random() > 0.85,
  }));
}

export default function RaffleLanding({ onLoginRequired }: RaffleLandingProps) {
  const [tickets] = useState(() => generateTickets(30));
  const [hoveredTicket, setHoveredTicket] = useState<number | null>(null);
  const [revealedTickets, setRevealedTickets] = useState<Set<number>>(new Set());
  const [shakeTicket, setShakeTicket] = useState<number | null>(null);
  const [liveCount, setLiveCount] = useState(920000);
  const [feedItems, setFeedItems] = useState([
    { user: 'u*****k', tickets: 5, ago: '3 sn önce' },
    { user: 'a*****r', tickets: 2, ago: '12 sn önce' },
    { user: 'm*****n', tickets: 1, ago: '28 sn önce' },
    { user: 'b*****y', tickets: 7, ago: '45 sn önce' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 500 + 100));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const names = ['u*****k','a*****r','m*****n','b*****y','e*****m','h*****a','k*****s','r*****z'];
    const interval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const t = Math.floor(Math.random() * 8) + 1;
      setFeedItems(prev => [{ user: name, tickets: t, ago: 'az önce' }, ...prev.slice(0, 3)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTicketClick = useCallback((id: number) => {
    // Allow first 3 tickets to "reveal", rest require login
    if (revealedTickets.size < 3 && !revealedTickets.has(id)) {
      setRevealedTickets(prev => new Set([...prev, id]));
    } else if (revealedTickets.has(id)) {
      // Already revealed, do nothing
    } else {
      setShakeTicket(id);
      setTimeout(() => { setShakeTicket(null); onLoginRequired(); }, 400);
    }
  }, [revealedTickets, onLoginRequired]);

  return (
    <div style={{ background: 'linear-gradient(135deg, #050C18 0%, #0A1428 50%, #050C18 100%)', minHeight: '100vh', overflowX: 'hidden', paddingBottom: 20 }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes shimmerLine { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes feedSlide { 0%{transform:translateY(-100%);opacity:0} 20%{transform:translateY(0);opacity:1} }
        @keyframes ticketShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 50%{transform:translateX(4px)} 75%{transform:translateX(-4px)} }
        @keyframes ticketReveal { 0%{transform:rotateY(0)} 50%{transform:rotateY(90deg)} 100%{transform:rotateY(0)} }
        @keyframes sparkle { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        .ticket-mini { transition: all 0.2s ease; cursor: pointer; }
        .ticket-mini:hover { transform: translateY(-3px) scale(1.04); z-index: 10; }
      `}</style>

      {/* Compact Hero Banner */}
      <section style={{ position: 'relative', zIndex: 1, padding: '20px 16px 12px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {/* Mini mascot ticket */}
          <div style={{ animation: 'float 3s ease-in-out infinite', flexShrink: 0 }}>
            <div style={{
              width: 80, height: 100, borderRadius: 10,
              background: 'linear-gradient(145deg, #1a1000, #0d0800)',
              border: '1.5px solid rgba(245,166,35,0.5)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              boxShadow: '0 0 20px rgba(245,166,35,0.25)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(245,166,35,0.06) 50%, transparent 70%)', animation: 'shimmerLine 2.5s ease-in-out infinite' }} />
              <div style={{ fontSize: 18 }}>🎟️</div>
              <div style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 11, background: 'linear-gradient(135deg,#F5A623,#FFD580)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>724TOTO</div>
              <div style={{ color: '#F5A623', fontSize: 10, fontWeight: 900 }}>25K ₺</div>
            </div>
          </div>

          {/* Hero text */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ color: '#F5A623', fontWeight: 800, fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 4 }}>🎰 HAFTALIK BÜYÜK ÇEKİLİŞ</div>
            <h1 style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 22, lineHeight: 1.15, color: '#fff', letterSpacing: '-0.5px', margin: '0 0 6px 0' }}>
              Biletini Seç, <span style={{ background: 'linear-gradient(135deg,#F5A623,#FFD580)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Şansını Katla!</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0, lineHeight: 1.4 }}>
              İlk 3 bileti ücretsiz aç! Devamı için üye ol.
            </p>
          </div>

          {/* Stats + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#F5A623', fontWeight: 900, fontSize: 16 }}>{liveCount.toLocaleString('tr-TR')}</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 700 }}>TOPLAM ÖDÜL</div>
            </div>
            <button onClick={onLoginRequired} style={{
              background: 'linear-gradient(135deg,#F5A623,#D4900A)', color: '#000', fontWeight: 900, fontSize: 11,
              padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 16px rgba(245,166,35,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
            }}>🔑 Üye Ol</button>
          </div>
        </div>
      </section>

      {/* Interactive Ticket Grid */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 16px 16px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>🎫 Biletler</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>({revealedTickets.size}/3 ücretsiz açıldı)</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(245,166,35,0.3)', border: '1px solid rgba(245,166,35,0.5)' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Açık</span>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', marginLeft: 6 }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>Kilitli</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
          gap: 8,
        }}>
          {tickets.map(ticket => {
            const isRevealed = revealedTickets.has(ticket.id);
            const isHovered = hoveredTicket === ticket.id;
            const isShaking = shakeTicket === ticket.id;
            const color = TICKET_COLORS[ticket.colorIdx];
            const canRevealFree = revealedTickets.size < 3 && !isRevealed;

            return (
              <div
                key={ticket.id}
                className="ticket-mini"
                onClick={() => handleTicketClick(ticket.id)}
                onMouseEnter={() => setHoveredTicket(ticket.id)}
                onMouseLeave={() => setHoveredTicket(null)}
                style={{
                  background: isRevealed ? color.bg : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isRevealed ? color.border : isHovered ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 10,
                  padding: '10px 6px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  position: 'relative', overflow: 'hidden',
                  animation: isShaking ? 'ticketShake 0.3s ease' : isRevealed ? 'ticketReveal 0.5s ease' : 'none',
                  boxShadow: isRevealed ? `0 0 12px ${color.glow}` : isHovered ? '0 0 10px rgba(245,166,35,0.1)' : 'none',
                  minHeight: 80,
                }}
              >
                {/* Shimmer on hover */}
                {isHovered && !isRevealed && (
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(245,166,35,0.04) 50%, transparent 70%)', animation: 'shimmerLine 1.5s ease-in-out infinite' }} />
                )}

                {isRevealed ? (
                  <>
                    {/* Revealed state */}
                    <div style={{ fontSize: 16 }}>{ticket.isSpecial ? '💎' : '🎟️'}</div>
                    <div style={{ color: '#F5A623', fontWeight: 900, fontSize: 11, textAlign: 'center' }}>{ticket.prize}</div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 8, fontFamily: 'monospace' }}>#{ticket.number}</div>
                    {ticket.isSpecial && (
                      <div style={{ position: 'absolute', top: 3, right: 3 }}>
                        <span style={{ fontSize: 8, animation: 'sparkle 1.5s ease-in-out infinite' }}>✨</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Hidden state */}
                    <div style={{ fontSize: 18, filter: 'grayscale(0.5)', opacity: 0.6 }}>🎫</div>
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 9, fontWeight: 700, textAlign: 'center' }}>
                      {canRevealFree ? 'Tıkla!' : '🔒'}
                    </div>
                    {ticket.claimed && (
                      <div style={{
                        position: 'absolute', top: 3, right: 3,
                        background: 'rgba(245,166,35,0.15)', borderRadius: 4, padding: '1px 4px',
                        color: '#F5A623', fontSize: 7, fontWeight: 800,
                      }}>SICAK</div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Unlock message */}
        {revealedTickets.size >= 3 && (
          <div style={{
            marginTop: 12, padding: '12px 16px', borderRadius: 10,
            background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <div>
              <div style={{ color: '#F5A623', fontWeight: 800, fontSize: 12 }}>🔓 Tüm biletleri açmak için üye ol!</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>27 bilet daha seni bekliyor. Kayıt ol ve büyük ödülü kazan.</div>
            </div>
            <button onClick={onLoginRequired} style={{
              background: 'linear-gradient(135deg,#F5A623,#D4900A)', color: '#000', fontWeight: 900, fontSize: 11,
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 12px rgba(245,166,35,0.3)', textTransform: 'uppercase',
            }}>Kayıt Ol →</button>
          </div>
        )}
      </section>

      {/* Bottom: Info Cards + Feed in compact row */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 16px 16px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          {/* How to join */}
          <div style={{ background: '#1E2530', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>📦</span>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>Nasıl Katılırım?</span>
            </div>
            {[
              { s: '01', t: 'Üye ol veya giriş yap' },
              { s: '02', t: 'Görevleri tamamla, bilet kazan' },
              { s: '03', t: 'Çekiliş gününü bekle!' },
            ].map(item => (
              <div key={item.s} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5 }}>
                <div style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', fontWeight: 900, fontSize: 8, borderRadius: 4, padding: '2px 5px' }}>{item.s}</div>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{item.t}</div>
              </div>
            ))}
          </div>

          {/* Prize pool */}
          <div style={{ background: '#1E2530', borderRadius: 12, padding: 14, border: '1px solid rgba(245,166,35,0.1)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(245,166,35,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>💰</span>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>Ödül Havuzu</span>
            </div>
            <div style={{ color: '#F5A623', fontSize: 22, fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>
              {liveCount.toLocaleString('tr-TR')} TL
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ l: 'Hafta', v: '25K' }, { l: 'Ay', v: '80K' }].map(p => (
                <div key={p.l} style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.08)', borderRadius: 6, padding: '3px 8px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: 700 }}>{p.l}</div>
                  <div style={{ color: '#F5A623', fontWeight: 900, fontSize: 11 }}>{p.v} ₺</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live feed */}
          <div style={{ background: '#1E2530', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>Canlı</span>
            </div>
            {feedItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '4px 8px', borderRadius: 6, marginBottom: 4,
                background: i === 0 ? 'rgba(245,166,35,0.05)' : 'transparent',
                animation: i === 0 ? 'feedSlide 0.4s ease' : 'none',
              }}>
                <span style={{ fontSize: 10 }}>🎫</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, flex: 1 }}>
                  <span style={{ color: '#F5A623', fontWeight: 700 }}>{item.user}</span> {item.tickets} bilet
                </span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 8 }}>{item.ago}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(145deg,#1E2530,#141B25)', borderRadius: 12, padding: 14, border: '1px solid rgba(245,166,35,0.12)', display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 20 }}>🎰</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 13 }}>Kazanmaya Başla!</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}><span style={{ color: '#22C55E', fontWeight: 700 }}>1.247</span> kişi çevrimiçi</div>
              </div>
            </div>
            <button onClick={onLoginRequired} style={{
              background: 'linear-gradient(135deg,#F5A623,#D4900A)', color: '#000', fontWeight: 900, fontSize: 12,
              padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 14px rgba(245,166,35,0.3)', textTransform: 'uppercase', width: '100%',
            }}>🔑 Üye Ol / Giriş Yap</button>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {[{ n: '48K+', l: 'Üye' }, { n: '920K+', l: 'Ödül' }, { n: '100%', l: 'Güvenli' }].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ color: '#F5A623', fontWeight: 900, fontSize: 13 }}>{s.n}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <p style={{ color: 'rgba(255,255,255,0.12)', fontSize: 9, fontWeight: 500, margin: 0 }}>
          🔞 Bu web sitesi yalnızca bilgilendirme amaçlıdır. 18 yaşından küçüklerin katılımı yasaktır.
        </p>
      </footer>
    </div>
  );
}
