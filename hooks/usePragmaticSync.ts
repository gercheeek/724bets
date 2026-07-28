import { useState, useEffect, RefObject } from 'react';
import { countUp } from '../utils/countUp';

interface SyncOptions {
  initialBalance: number;
  iframeRef: RefObject<HTMLIFrameElement>;
  onInsufficientFunds?: () => void;
  onBalanceChange?: (newBalance: number) => void;
}

export const usePragmaticSync = ({ initialBalance, iframeRef, onInsufficientFunds, onBalanceChange }: SyncOptions) => {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [displayBalance, setDisplayBalance] = useState<number>(initialBalance);
  const [status, setStatus] = useState<'win' | 'loss' | null>(null);

  useEffect(() => {
    // initialBalance değişirse (örn: dışarıdan para yatırma), state'i güncelle
    setBalance(initialBalance);
    setDisplayBalance(initialBalance);
  }, [initialBalance]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Güvenlik: İzin verilen domainleri filtreleyebilirsiniz (Örn: pragmaticplay.net)
      // if (event.origin !== 'https://demogamesfree.pragmaticplay.net') return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // Pragmatic Play veya benzeri standart olay yapıları
        if (data && data.type) {
          switch (data.type) {
            case 'PRAGMATIC_BET':
              handleBet(data.amount);
              break;
            case 'PRAGMATIC_WIN':
              handleWin(data.amount);
              break;
            case 'PRAGMATIC_SYNC':
              // Sadece bakiyeyi eşitle
              setBalance(data.balance);
              setDisplayBalance(data.balance);
              break;
            case 'SPIN_START':
              // İhtiyaç varsa spin animasyon tetikleyicisi
              break;
            default:
              break;
          }
        }
      } catch (e) {
        // Parse error for non-json messages, safely ignore
      }
    };

    const handleBet = (amount: number) => {
      setBalance((prevBalance) => {
        if (prevBalance < amount) {
          // Bakiye yetersiz
          if (onInsufficientFunds) onInsufficientFunds();
          
          // Iframe'e yetersiz bakiye sinyali gönder
          if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              JSON.stringify({ type: 'INSUFFICIENT_FUNDS' }), 
              '*' // Production'da belirli bir origin verilmeli
            );
          }
          return prevBalance; // Bakiye düşmez
        }
        
        // Bakiye yeterli, anında (Optimistic) düş
        const newBalance = prevBalance - amount;
        setDisplayBalance(newBalance); // Ekranda anında düşsün
        setStatus('loss');
        // Reset status quickly so animation can re-trigger next time
        setTimeout(() => setStatus(null), 500);
        
        if (onBalanceChange) onBalanceChange(newBalance);
        return newBalance;
      });
    };

    const handleWin = (amount: number) => {
      setBalance((prevBalance) => {
        const newBalance = prevBalance + amount;
        
        // Animasyonlu artış (CountUp)
        countUp(prevBalance, newBalance, 1500, (currentVal) => {
          setDisplayBalance(currentVal);
        });
        
        setStatus('win');
        setTimeout(() => setStatus(null), 1500);
        
        if (onBalanceChange) onBalanceChange(newBalance);
        return newBalance;
      });
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [iframeRef, onInsufficientFunds]);

  return {
    balance,
    displayBalance,
    status
  };
};
