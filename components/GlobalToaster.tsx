import React, { useState, useEffect } from 'react';
import { X, Bell, Trophy, Gift, AlertTriangle } from 'lucide-react';

export interface ToastEvent {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'vip';
  title?: string;
  duration?: number;
}

export const triggerGlobalToast = (toast: Omit<ToastEvent, 'id'>) => {
  const event = new CustomEvent('globalToast', {
    detail: { ...toast, id: Math.random().toString(36).substr(2, 9) }
  });
  window.dispatchEvent(event);
};

export default function GlobalToaster() {
  const [toasts, setToasts] = useState<ToastEvent[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEvent>;
      const newToast = customEvent.detail;
      
      setToasts(prev => [...prev, newToast]);
      
      if (newToast.duration !== 0) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, newToast.duration || 5000);
      }
    };

    window.addEventListener('globalToast', handleToast);
    return () => window.removeEventListener('globalToast', handleToast);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => {
        let borderColor = 'rgba(245,166,35,0.3)';
        let bgGradient = 'linear-gradient(135deg, rgba(30,37,48,0.95), rgba(20,27,37,0.98))';
        let icon = <Bell className="w-5 h-5 text-[#F5A623]" />;

        if (toast.type === 'success') {
          borderColor = 'rgba(34,197,94,0.4)';
          icon = <Trophy className="w-5 h-5 text-green-500" />;
        } else if (toast.type === 'vip') {
          borderColor = 'rgba(245,166,35,0.6)';
          bgGradient = 'linear-gradient(135deg, rgba(40,30,10,0.95), rgba(20,15,5,0.98))';
          icon = <Gift className="w-5 h-5 text-[#F5A623]" />;
        } else if (toast.type === 'warning') {
          borderColor = 'rgba(239,68,68,0.4)';
          icon = <AlertTriangle className="w-5 h-5 text-red-500" />;
        }

        return (
          <div key={toast.id} style={{
            background: bgGradient,
            border: `1px solid ${borderColor}`,
            borderRadius: 12,
            padding: '16px 20px',
            width: 320,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            pointerEvents: 'auto',
            animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Shimmer */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)', animation: 'shimmerLine 3s infinite' }} />
            
            <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
            
            <div style={{ flex: 1 }}>
              {toast.title && <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{toast.title}</div>}
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.4 }}>{toast.message}</div>
            </div>

            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0 }}
            >
              <X className="w-4 h-4 hover:text-white transition-colors" />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
