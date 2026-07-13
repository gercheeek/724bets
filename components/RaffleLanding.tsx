import React, { useState, useEffect } from 'react';

interface RaffleLandingProps {
  onLoginRequired: () => void;
}

export default function RaffleLanding({ onLoginRequired }: RaffleLandingProps) {
  const [liveCount, setLiveCount] = useState(981124);
  const [feedItems, setFeedItems] = useState([
    { user: 'u*****k', action: 'Bilet aldı', ago: '3 sn önce' },
    { user: 'a*****r', action: 'Üye oldu', ago: '12 sn önce' },
    { user: 'm*****n', action: 'Bilet aldı', ago: '28 sn önce' },
    { user: 'b*****y', action: 'Yatırım yaptı', ago: '45 sn önce' },
  ]);

  // Simulate prize pool growing slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => c + Math.floor(Math.random() * 250 + 50));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Simulate live feed
  useEffect(() => {
    const names = ['u*****k','a*****r','m*****n','b*****y','e*****m','h*****a','k*****s','r*****z'];
    const actions = ['Bilet aldı', 'Üye oldu', 'Yatırım yaptı', 'Bilet aldı', 'Bilet aldı'];
    const interval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      setFeedItems(prev => [{ user: name, action: action, ago: 'az önce' }, ...prev.slice(0, 3)]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: 'linear-gradient(135deg, #050C18 0%, #0A1428 50%, #050C18 100%)', minHeight: '100vh', overflowX: 'hidden', paddingBottom: 40, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes shimmerLine { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes feedSlide { 0%{transform:translateY(-100%);opacity:0} 20%{transform:translateY(0);opacity:1} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 40px rgba(245,166,35,0.2)} 50%{box-shadow:0 0 80px rgba(245,166,35,0.5)} }
        @keyframes scaleIn { 0%{transform:scale(0.95);opacity:0} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* Massive Hero Banner */}
      <section style={{ 
        position: 'relative', zIndex: 1, padding: '40px 16px', maxWidth: 1100, margin: '0 auto', flex: 1, 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh'
      }}>
        {/* Glow effect behind */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'radial-gradient(ellipse at center, rgba(245,166,35,0.15) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
        
        <div style={{ 
          textAlign: 'center', animation: 'scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'linear-gradient(145deg, rgba(30,37,48,0.4), rgba(20,27,37,0.8))',
          border: '1px solid rgba(245,166,35,0.3)',
          borderRadius: 24, padding: '60px 40px', width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Shimmer overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(245,166,35,0.03) 50%, transparent 70%)', animation: 'shimmerLine 3s ease-in-out infinite' }} />

          <div style={{ color: '#F5A623', fontWeight: 900, fontSize: 16, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: 20 }}>
            🎰 724TOTO BÜYÜK ÇEKİLİŞ
          </div>
          
          <h1 style={{ 
            fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 64px)', 
            lineHeight: 1.1, color: '#fff', letterSpacing: '-1px', margin: '0 0 16px 0',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            Milyonluk Ödül Havuzu <br/>
            <span style={{ background: 'linear-gradient(135deg,#F5A623,#FFD580)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 2px 10px rgba(245,166,35,0.3))' }}>
              Seni Bekliyor!
            </span>
          </h1>

          <div style={{ 
            display: 'inline-block', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.4)', 
            borderRadius: 100, padding: '8px 24px', marginBottom: 30,
            boxShadow: '0 0 20px rgba(245,166,35,0.15)'
          }}>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>Güncel Havuz: </span>
            <span style={{ color: '#F5A623', fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px' }}>{liveCount.toLocaleString('tr-TR')} TL</span>
          </div>

          <p style={{ 
            color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(14px, 1.5vw, 18px)', margin: '0 auto 40px auto', 
            lineHeight: 1.6, maxWidth: 700, fontWeight: 500
          }}>
            Hemen Üye Ol, 1.000 TL Yatırım Yap, Biletini Seç ve Canlı Yayındaki Büyük Çekilişe Katıl! <br/>
            <span style={{ color: '#F5A623', fontWeight: 700 }}>(Maksimum 10 Bilet)</span>
          </p>

          <button onClick={onLoginRequired} style={{
            background: 'linear-gradient(135deg,#F5A623,#D4900A)', color: '#000', fontWeight: 900, fontSize: 18,
            padding: '20px 48px', borderRadius: 16, border: 'none', cursor: 'pointer',
            textTransform: 'uppercase', letterSpacing: '1px',
            animation: 'pulseGlow 2s infinite', transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            HEMEN ÜYE OL VE KATIL
          </button>
        </div>
      </section>

      {/* Bottom: Info Cards + Feed */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 16px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          
          {/* How to join (Updated Steps) */}
          <div style={{ background: '#1E2530', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1', '@media (min-width: 768px)': { gridColumn: 'span 2' } as any }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 24 }}>🧭</span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 18, textTransform: 'uppercase', letterSpacing: '1px' }}>Nasıl Katılırım?</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { s: '01', title: 'Üye Ol', t: 'Katıl ve giriş yap.' },
                { s: '02', title: 'Yatırım Yap', t: 'Bilet hakkı kazanmak için hesabına yatırım yap.' },
                { s: '03', title: 'Biletini Seç', t: 'Sana özel tanımlanan biletleri havuzdan kendin seç.' },
                { s: '04', title: 'Çekilişi Bekle', t: 'Canlı yayındaki büyük ödül heyecanına ortak ol.' },
              ].map((item, idx) => (
                <div key={item.s} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#141B25', padding: 16, borderRadius: 12, border: '1px solid rgba(245,166,35,0.1)' }}>
                  <div style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', fontWeight: 900, fontSize: 14, borderRadius: 8, padding: '6px 10px', flexShrink: 0 }}>
                    {item.s}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 1.4 }}>{item.t}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live feed */}
          <div style={{ background: '#1E2530', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>Canlı Akış</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {feedItems.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10,
                  background: i === 0 ? 'rgba(245,166,35,0.05)' : '#141B25',
                  border: i === 0 ? '1px solid rgba(245,166,35,0.15)' : '1px solid rgba(255,255,255,0.03)',
                  animation: i === 0 ? 'feedSlide 0.5s ease' : 'none',
                }}>
                  <span style={{ fontSize: 16 }}>{item.action.includes('Üye') ? '👤' : item.action.includes('Bilet') ? '🎟️' : '💸'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#F5A623', fontWeight: 800, fontSize: 12 }}>{item.user}</div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{item.action}</div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>{item.ago}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
