import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const NOTIFICATION_INTERVAL_MIN = 8000; // 8 seconds
const NOTIFICATION_INTERVAL_MAX = 20000; // 20 seconds
const NOTIFICATION_DURATION = 5000; // 5 seconds

const USERS = ['Joao***', 'Metin***', 'Alex***', 'Sergey***', 'Yilmaz***', 'Carlos***', 'Maria***', 'Ali***'];
const GAMES = ['Sweet Bonanza', 'Zeus vs Hades', 'Gates of Olympus', 'Sugar Rush', 'Blackjack Live', 'Crazy Time', 'Lightning Roulette', 'Football', 'Basketball'];

export default function FomoNotifications() {
  const { t } = useLanguage();
  const [notification, setNotification] = useState<{ id: number, text: string, type: 'win' | 'bet', amount: string, user: string, game: string } | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const showRandomNotification = () => {
      const isWin = Math.random() > 0.5;
      const user = USERS[Math.floor(Math.random() * USERS.length)];
      const game = GAMES[Math.floor(Math.random() * GAMES.length)];
      const amount = (Math.floor(Math.random() * 50000) + 500).toLocaleString() + ' TRY';
      
      setNotification({
        id: Date.now(),
        type: isWin ? 'win' : 'bet',
        user,
        game,
        amount,
        text: isWin ? 'won' : 'bet'
      });

      // Hide after duration
      setTimeout(() => {
        setNotification(null);
      }, NOTIFICATION_DURATION);

      // Schedule next notification
      const nextDelay = Math.random() * (NOTIFICATION_INTERVAL_MAX - NOTIFICATION_INTERVAL_MIN) + NOTIFICATION_INTERVAL_MIN;
      timeoutId = setTimeout(showRandomNotification, nextDelay);
    };

    // Initial trigger
    const initialDelay = Math.random() * 5000 + 2000;
    timeoutId = setTimeout(showRandomNotification, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!notification) return null;

  return (
    <div 
      className="fixed bottom-20 md:bottom-6 left-4 md:left-auto md:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-[280px] w-auto"
    >
      <div className="bg-[#13161c]/90 backdrop-blur-md border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.6)] rounded-full pl-2 pr-4 py-1.5 flex items-center gap-3 relative cursor-pointer hover:bg-[#1a1d24] transition-colors">
        
        <div className="shrink-0">
          {notification.type === 'win' ? (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00FFA3]/20 to-[#00FFA3]/5 border border-[#00FFA3]/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,163,0.2)]">
              <Trophy className="w-3.5 h-3.5 text-[#00FFA3]" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-baseline gap-1.5 leading-none mb-1">
            <span className="text-gray-200 font-semibold text-[11px] truncate">{notification.user}</span>
            <span className="text-gray-500 text-[10px]">{notification.type === 'win' ? (t('just_won') || 'just won') : (t('just_bet') || 'just bet')}</span>
          </div>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className={`font-bold text-xs ${notification.type === 'win' ? 'text-[#00FFA3]' : 'text-white'}`}>
              {notification.amount}
            </span>
            <span className="text-gray-400 text-[10px] truncate">
              {t('in') || 'in'} {notification.game}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
