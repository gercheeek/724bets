import React, { createContext, useContext, ReactNode } from 'react';
import { SiteUser } from '../types';
import { supabase } from '../utils/supabase';

interface UserContextProps {
  siteUser: SiteUser | null;
  setSiteUser: React.Dispatch<React.SetStateAction<SiteUser | null>>;
  isFunMode: boolean;
  setIsFunMode: React.Dispatch<React.SetStateAction<boolean>>;
  demoBalance: number;
  setDemoBalance: React.Dispatch<React.SetStateAction<number>>;
  placeBet: (amount: number, selections: any[], totalOdds: number) => Promise<void>;
  processGameBet: (betAmount: number, winAmount: number, gameName: string) => Promise<number>;
  playInstantGame: (betAmount: number, gameName: string, target?: number, condition?: string, payload?: any) => Promise<any>;
  startSessionGame: (betAmount: number, gameName: string, settings: any) => Promise<any>;
  playSessionMove: (gameId: string, move: any) => Promise<any>;
  cashoutSessionGame: (gameId: string) => Promise<any>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode, siteUser: SiteUser | null, setSiteUser: React.Dispatch<React.SetStateAction<SiteUser | null>> }> = ({ children, siteUser, setSiteUser }) => {
  const [isFunMode, setIsFunMode] = React.useState<boolean>(true); // Default to Eğlence Modu
  const [demoBalance, setDemoBalance] = React.useState<number>(10000); // 10.000 ₺ Demo Balance

  
  const sendDiscordNotification = async (payload: any) => {
    try {
      // Basic webhook sending mechanism mimicking existing logic
      const storedCfg = localStorage.getItem('site_cfg');
      const cfg = storedCfg ? JSON.parse(storedCfg) : { webhookUrl: '' };
      
      if (!cfg.webhookUrl) return;

      const discordPayload = {
        username: "724BAHİS BOT",
        embeds: [
          {
            title: `🎰 YENİ BAHİS: $${payload.amount.toFixed(2)}`,
            color: 16766720,
            fields: [
              { name: "👤 Üye ID", value: siteUser?.username || 'Bilinmiyor', inline: true },
              { name: "💰 Tutar", value: `$${payload.amount.toFixed(2)}`, inline: true },
              { name: "📈 Toplam Oran", value: payload.totalOdds.toFixed(2), inline: true },
              { name: "🎯 Olası Kazanç", value: `$${payload.potentialPayout.toFixed(2)}`, inline: true }
            ]
          }
        ]
      };

      await fetch('/api/send-discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: cfg.webhookUrl,
          payload: discordPayload
        })
      });
    } catch (err) {
      console.error('Error sending Discord notification:', err);
    }
  };

  const placeBet = async (amount: number, selections: any[], totalOdds: number) => {
    if (!siteUser) throw new Error('Oturum kapalı. Lütfen giriş yapın.');
    if ((siteUser.balance || 0) < amount) throw new Error('Yetersiz bakiye.');
    if (amount <= 0) throw new Error('Lütfen geçerli bir bahis tutarı girin.');
    if (selections.length === 0) throw new Error('Lütfen en az bir maç seçin.');
    
    const newBalance = (siteUser.balance || 0) - amount;
    
    // Update Supabase using RPC if real user
    if (siteUser.id !== 'admin-session' && !String(siteUser.id).startsWith('guest_')) {
      const { data: updatedBalance, error } = await supabase.rpc('process_game_bet', {
        p_user_id: siteUser.id,
        p_bet_amount: amount,
        p_win_amount: 0,
        p_game_name: 'Spor Bahisi'
      });
      if (error) throw new Error('Bakiye güncellenemedi: ' + error.message);
      // RPC returns the new verified balance, but we use the optimistic one if we want
    }
    
    const newBet = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      amount: amount,
      selections: selections,
      totalOdds: totalOdds,
      potentialPayout: amount * totalOdds,
      status: 'PENDING'
    };

    const existingBets = JSON.parse(localStorage.getItem('site_my_bets') || '[]');
    localStorage.setItem('site_my_bets', JSON.stringify([newBet, ...existingBets]));

    // Discord Notification asynchronously
    sendDiscordNotification(newBet);

    // Update Local State
    const updatedUser = { ...siteUser, balance: newBalance };
    setSiteUser(updatedUser);
    localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
    localStorage.setItem('site_member', JSON.stringify(updatedUser));
  };

  const processGameBet = async (betAmount: number, winAmount: number, gameName: string): Promise<number> => {
    if (!siteUser) throw new Error('Oturum kapalı. Lütfen giriş yapın.');
    if (betAmount > 0 && (siteUser.balance || 0) < betAmount) throw new Error('Yetersiz bakiye.');
    
    const optimisticBalance = (siteUser.balance || 0) - betAmount + winAmount;
    
    if (siteUser.id !== 'admin-session' && !String(siteUser.id).startsWith('guest_')) {
      const { data: updatedBalance, error } = await supabase.rpc('process_game_bet', {
        p_user_id: siteUser.id,
        p_bet_amount: betAmount,
        p_win_amount: winAmount,
        p_game_name: gameName
      });
      
      if (error) {
        console.error("RPC Error:", error);
        throw new Error('İşlem başarısız: ' + error.message);
      }
      
      // Update local state with the AUTHORITATIVE balance from DB
      const updatedUser = { ...siteUser, balance: updatedBalance };
      setSiteUser(updatedUser);
      localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
      localStorage.setItem('site_member', JSON.stringify(updatedUser));
      return updatedBalance;
    } else {
      // For guest/admin, just use optimistic balance
      const updatedUser = { ...siteUser, balance: optimisticBalance };
      setSiteUser(updatedUser);
      localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
      localStorage.setItem('site_member', JSON.stringify(updatedUser));
      return optimisticBalance;
    }
  };

  const playInstantGame = async (betAmount: number, gameName: string, target: number = 0, condition: string = 'none', payload: any = {}) => {
    if (!siteUser) throw new Error('Oturum kapalı. Lütfen giriş yapın.');
    if (betAmount > 0 && (siteUser.balance || 0) < betAmount) throw new Error('Yetersiz bakiye.');
    
    // UUID (v4) for bet_id
    const betId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    
    const { data, error } = await supabase.rpc('play_instant_game', {
      p_bet_id: betId,
      p_user_id: siteUser.id,
      p_bet_amount: betAmount,
      p_game_name: gameName,
      p_client_seed: 'seed123',
      p_target: target,
      p_condition: condition,
      p_payload: payload
    });
    
    if (error) throw new Error(error.message);
    
    if (data && data.success) {
      const updatedUser = { ...siteUser, balance: data.new_balance };
      setSiteUser(updatedUser);
      localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
      localStorage.setItem('site_member', JSON.stringify(updatedUser));
    }
    
    return data;
  };

  const startSessionGame = async (betAmount: number, gameName: string, settings: any) => {
    if (!siteUser) throw new Error('Oturum kapalı.');
    const { data, error } = await supabase.rpc('start_session_game', {
      p_user_id: siteUser.id,
      p_bet_amount: betAmount,
      p_game_name: gameName,
      p_settings: settings
    });
    if (error) throw new Error(error.message);
    if (data && data.success) {
      const updatedUser = { ...siteUser, balance: data.new_balance };
      setSiteUser(updatedUser);
      localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
      localStorage.setItem('site_member', JSON.stringify(updatedUser));
    }
    return data;
  };

  const playSessionMove = async (gameId: string, move: any) => {
    if (!siteUser) throw new Error('Oturum kapalı.');
    const { data, error } = await supabase.rpc('play_session_move', {
      p_game_id: gameId,
      p_user_id: siteUser.id,
      p_move: move
    });
    if (error) throw new Error(error.message);
    return data;
  };

  const cashoutSessionGame = async (gameId: string) => {
    if (!siteUser) throw new Error('Oturum kapalı.');
    const { data, error } = await supabase.rpc('cashout_session_game', {
      p_game_id: gameId,
      p_user_id: siteUser.id
    });
    if (error) throw new Error(error.message);
    if (data && data.success) {
      const updatedUser = { ...siteUser, balance: data.new_balance };
      setSiteUser(updatedUser);
      localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
      localStorage.setItem('site_member', JSON.stringify(updatedUser));
    }
    return data;
  };

  return (
    <UserContext.Provider value={{ siteUser, setSiteUser, isFunMode, setIsFunMode, demoBalance, setDemoBalance, placeBet, processGameBet, playInstantGame, startSessionGame, playSessionMove, cashoutSessionGame }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
