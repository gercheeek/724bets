import React, { createContext, useContext, ReactNode } from 'react';
import { SiteUser } from '../types';
import { supabase } from '../utils/supabase';

interface UserContextProps {
  siteUser: SiteUser | null;
  setSiteUser: React.Dispatch<React.SetStateAction<SiteUser | null>>;
  placeBet: (amount: number, selections: any[], totalOdds: number) => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode, siteUser: SiteUser | null, setSiteUser: React.Dispatch<React.SetStateAction<SiteUser | null>> }> = ({ children, siteUser, setSiteUser }) => {
  
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
    
    // Update Supabase if real user
    if (siteUser.id !== 'admin-session' && !String(siteUser.id).startsWith('guest_')) {
      const { error } = await supabase.from('members').update({ balance: newBalance }).eq('id', siteUser.id);
      if (error) throw new Error('Veritabanı bağlantı hatası: ' + error.message);
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

  return (
    <UserContext.Provider value={{ siteUser, setSiteUser, placeBet }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
