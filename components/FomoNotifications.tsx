import React, { useState, useEffect } from 'react';
import { Trophy, Flame, ChevronRight } from 'lucide-react';

const NOTIFICATION_INTERVAL_MIN = 8000; // 8 seconds
const NOTIFICATION_INTERVAL_MAX = 20000; // 20 seconds
const NOTIFICATION_DURATION = 5000; // 5 seconds

const USERS = ['Joao***', 'Metin***', 'Alex***', 'Sergey***', 'Yilmaz***', 'Carlos***', 'Maria***', 'Ali***'];
const GAMES = ['Sweet Bonanza', 'Zeus vs Hades', 'Gates of Olympus', 'Sugar Rush', 'Blackjack Live', 'Crazy Time', 'Lightning Roulette', 'Football', 'Basketball'];

export default function FomoNotifications() {
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
        text: isWin ? 'won' : 'placed a bet on'
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
      className="fixed bottom-20 md:bottom-6 left-4 md:left-auto md:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-[320px] w-[calc(100%-2rem)] md:w-auto"
    >
      <div className="bg-[#1a1d24] border border-[#2a2d35] shadow-[0_8px_30px_rgba(0,0,0,0.5)] rounded-lg p-3 flex items-start gap-3 relative overflow-hidden group cursor-pointer hover:bg-[#232833] transition-colors">
        {/* Glow effect */}
        <div className={`absolute top-0 left-0 w-1 h-full ${notification.type === 'win' ? 'bg-[#00E701]' : 'bg-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}></div>
        
        <div className="mt-0.5">
          {notification.type === 'win' ? (
            <div className="w-8 h-8 rounded-full bg-[#00E701]/10 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#00E701]" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#F59E0B]/10 flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#F59E0B]" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-white font-bold text-sm truncate">{notification.user}</span>
            <span className="text-gray-400 text-xs">just {notification.text}</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-black text-sm ${notification.type === 'win' ? 'text-[#00E701]' : 'text-white'}`}>
              {notification.amount}
            </span>
            <span className="text-gray-300 text-xs truncate">
              in {notification.game}
            </span>
          </div>
        </div>
        
        <div className="self-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
