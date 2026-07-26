import React, { createContext, useContext, useState, ReactNode } from 'react';
import { triggerGlobalToast } from '../components/GlobalToaster';

export interface BetSelection {
  id: string; // The odd ID (e.g., h_123, d_123)
  matchId: string; // The match ID (e.g., 123)
  matchName: string; // e.g., Team A vs Team B
  selectionName: string; // e.g., Maç Sonucu : 1
  odd: number;
}

interface BetSlipContextProps {
  betSlip: BetSelection[];
  betAmount: number;
  setBetAmount: (amount: number) => void;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (id: string) => void;
  clearBetSlip: () => void;
  totalOdds: number;
  potentialPayout: number;
  accumulatorBoost: number; // 0.05 for 5%, etc.
}

const BetSlipContext = createContext<BetSlipContextProps | undefined>(undefined);

export const BetSlipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [betSlip, setBetSlip] = useState<BetSelection[]>([]);
  const [betAmount, setBetAmount] = useState<number>(0);

  const addSelection = (newSelection: BetSelection) => {
    setBetSlip(prev => {
      // 1. If exactly the same selection is clicked again, remove it (toggle off)
      const existingSelection = prev.find(s => s.id === newSelection.id);
      if (existingSelection) {
        return prev.filter(s => s.id !== newSelection.id);
      }
      
      // 2. If a different selection from the SAME match is clicked, replace it (only 1 selection per match)
      const sameMatchSelection = prev.find(s => s.matchId === newSelection.matchId);
      if (sameMatchSelection) {
        triggerGlobalToast({ type: 'warning', message: 'Aynı maçtan sadece bir tercih eklenebilir, eski tercihiniz değiştirildi.' });
        const filtered = prev.filter(s => s.matchId !== newSelection.matchId);
        return [...filtered, newSelection];
      }
      
      return [...prev, newSelection];
    });
  };

  const removeSelection = (id: string) => {
    setBetSlip(prev => prev.filter(s => s.id !== id));
  };

  const clearBetSlip = () => {
    setBetSlip([]);
    setBetAmount(0);
  };

  const totalOdds = betSlip.length > 0 ? betSlip.reduce((acc, curr) => acc * curr.odd, 1) : 0;
  
  const getBoostPercentage = (count: number) => {
    if (count >= 5) return 0.15;
    if (count === 4) return 0.10;
    if (count === 3) return 0.05;
    return 0;
  };

  const accumulatorBoost = getBoostPercentage(betSlip.length);
  const basePayout = totalOdds * betAmount;
  const potentialPayout = totalOdds > 0 ? basePayout + (basePayout * accumulatorBoost) : 0;

  return (
    <BetSlipContext.Provider value={{
      betSlip, 
      betAmount, 
      setBetAmount, 
      addSelection, 
      removeSelection, 
      clearBetSlip, 
      totalOdds, 
      potentialPayout,
      accumulatorBoost
    }}>
      {children}
    </BetSlipContext.Provider>
  );
};

export const useBetSlip = () => {
  const context = useContext(BetSlipContext);
  if (!context) throw new Error('useBetSlip must be used within BetSlipProvider');
  return context;
};
