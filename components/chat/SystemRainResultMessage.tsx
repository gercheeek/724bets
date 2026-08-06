import React, { useState } from 'react';
import { X, Trophy, Sparkles } from 'lucide-react';

interface RainWinner {
  user_id: string;
  username: string;
  amount: number;
  is_vip?: boolean;
}

interface SystemRainResultMessageProps {
  payload: {
    totalAmount: number;
    participantsCount: number;
    winners: RainWinner[];
  };
  currentUserId: string;
}

const SystemRainResultMessage: React.FC<SystemRainResultMessageProps> = ({ payload, currentUserId }) => {
  const [showModal, setShowModal] = useState(false);

  // Check if current user is among the winners
  const myWin = payload.winners.find(w => w.user_id === currentUserId);

  return (
    <div className="w-full my-3 px-1 chat-msg-animate">
      <div style={{
        position: 'relative',
        background: 'var(--bg-card)',
        border: '1px solid var(--gold-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px var(--gold-subtle)',
      }}>
        {/* Glow/Glassmorphism Background */}
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 80, height: 80,
          background: 'var(--gold-glow)', filter: 'blur(30px)', zIndex: 0
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Sparkles style={{ color: 'var(--gold-primary)' }} size={20} />
            <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 'bold' }}>
              Yağmur Tamamlandı!
            </h4>
            <Sparkles style={{ color: 'var(--gold-primary)' }} size={20} />
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-base)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dağıtılan</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>
                ₺{payload.totalAmount.toLocaleString()}
              </p>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border-card)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Katılımcı</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {payload.participantsCount}
              </p>
            </div>
          </div>

          {/* Personal Win Banner */}
          {myWin && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 'var(--radius-base)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'pulse 2s infinite'
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>Tebrikler! Sen Kazandın:</span>
              <span style={{ fontSize: '1.1rem', color: '#10B981', fontWeight: 900 }}>+₺{myWin.amount}</span>
            </div>
          )}

          {/* See All Button */}
          <button 
            onClick={() => setShowModal(true)}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              border: '1px solid var(--gold-border)',
              borderRadius: 'var(--radius-base)',
              color: 'var(--gold-primary)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--gold-subtle)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Trophy size={16} /> Tüm Kazananları Gör
          </button>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'var(--bg-overlay)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
        }}>
          <div style={{
            background: 'var(--bg-main)',
            width: '100%', maxWidth: '400px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-modal)',
            maxHeight: '80vh', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>🏆 Kazananlar Listesi</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {payload.winners.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Henüz kimse kazanmadı.</p>
              )}
              {payload.winners.map((w, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--radius-base)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>#{idx + 1}</span>
                    <span style={{ color: w.is_vip ? 'var(--primary)' : 'var(--text-primary)', fontWeight: 'bold' }}>
                      {w.username}
                      {w.is_vip && ' 🌟'}
                    </span>
                  </div>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 800 }}>₺{w.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemRainResultMessage;
