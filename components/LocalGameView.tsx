import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';
import { ArrowLeft, RefreshCw, Volume2, VolumeX } from 'lucide-react';

interface LocalGameViewProps {
  siteUser: any;
  userRole: string | null;
  onBack: () => void;
}

const LocalGameView: React.FC<LocalGameViewProps> = ({ siteUser, userRole, onBack }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  // 1. Fetch user's current balance from database (profiles table - coin_balance)
  const fetchBalance = async () => {
    if (!siteUser?.id) {
      setBalance(10000); // Demo mode balance for guest
      setLoading(false);
      return;
    }

    setSyncStatus('syncing');
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('coin_balance')
        .eq('id', siteUser.id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setBalance(data.coin_balance || 0);
      }
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error fetching balance:', err);
      setSyncStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [siteUser]);

  // 2. Setup PostMessage bridge to listen for spin (bet) and win events from the Sweet Bonanza iframe
  useEffect(() => {
    const handleGameMessage = async (event: MessageEvent) => {
      // Validate origin if needed, or check message prefix
      const msg = event.data;
      if (!msg || typeof msg !== 'object') return;

      if (!siteUser?.id) {
        // Guest mode / Demo simulation: update state only
        if (msg.type === 'sb_bet') {
          setBalance(prev => Math.max(0, prev - (msg.amount || 0)));
        } else if (msg.type === 'sb_win') {
          setBalance(prev => prev + (msg.amount || 0));
        }
        return;
      }

      // Member mode: Update actual database balance
      if (msg.type === 'sb_bet' || msg.type === 'sb_win') {
        setSyncStatus('syncing');
        try {
          // Fetch fresh balance first to prevent race conditions
          const { data } = await supabase.from('profiles').select('coin_balance').eq('id', siteUser.id).single();
          const currentBal = data?.coin_balance || 0;
          let nextBal = currentBal;

          if (msg.type === 'sb_bet') {
            nextBal = Math.max(0, currentBal - (msg.amount || 0));
            console.log(`Spin placed. Bet: ${msg.amount}, Old Balance: ${currentBal}, New: ${nextBal}`);
          } else if (msg.type === 'sb_win') {
            nextBal = currentBal + (msg.amount || 0);
            console.log(`Win payout. Gain: ${msg.amount}, Old Balance: ${currentBal}, New: ${nextBal}`);
          }

          // Save back to DB
          const { error } = await supabase
            .from('profiles')
            .update({ coin_balance: nextBal })
            .eq('id', siteUser.id);

          if (error) throw error;

          setBalance(nextBal);
          setSyncStatus('synced');

          // Send updated balance back to iframe to keep display synced
          sendBalanceToIframe(nextBal);
        } catch (err) {
          console.error('Failed to update balance on game event:', err);
          setSyncStatus('error');
        }
      } else if (msg.type === 'sb_request_sync') {
        // Iframe is asking for fresh balance init
        sendBalanceToIframe(balance);
      }
    };

    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, [siteUser, balance]);

  // 3. Send balance message helper
  const sendBalanceToIframe = (bal: number) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'sb_init_balance', balance: bal },
        '*' // Replace '*' with target origin for production security
      );
    }
  };

  // Triggered when iframe loads completely
  const handleIframeLoad = () => {
    sendBalanceToIframe(balance);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#040507', color: '#fff', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '12px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700 }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
              <ArrowLeft size={16} /> Lobiye Dön
            </button>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 900, letterSpacing: '0.5px', color: '#F0B90B' }}>SWEET BONANZA (YEREL SÜRÜM)</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Balance HUD */}
            <div style={{ background: 'rgba(240,185,11,0.08)', border: '1px solid rgba(240,185,11,0.25)', borderRadius: '8px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#F0B90B', letterSpacing: '1px' }}>BAKİYE:</span>
              <strong style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>
                {loading ? '...' : `${balance.toLocaleString('tr-TR')} Coin`}
              </strong>
            </div>

            {/* Sync status indicator */}
            <button onClick={fetchBalance} style={{ background: 'transparent', border: 'none', color: syncStatus === 'syncing' ? '#F0B90B' : '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <RefreshCw size={14} className={syncStatus === 'syncing' ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Game Iframe Container */}
        <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '18px', border: '1px solid rgba(240,185,11,0.15)', overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.8)' }}>
          <iframe
            ref={iframeRef}
            src="/games/sweet-bonanza/index.html"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen={true}
            allow="autoplay; fullscreen; encrypted-media"
            onLoad={handleIframeLoad}
            title="Sweet Bonanza Game"
          />
        </div>

      </div>
    </div>
  );
};

export default LocalGameView;
