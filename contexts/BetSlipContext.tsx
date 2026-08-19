import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface BetSelection {
  id: string; // The odd ID (e.g., h_123, d_123)
  matchId: string; // The match ID (e.g., 123)
  matchName: string; // e.g., Team A vs Team B
  selectionName: string; // e.g., Maç Sonucu : 1
  odd: number;
  isSpecialCombo?: boolean;
  legs?: { match: string; selection: string; market: string }[];
}

export type BetType = 'tekli' | 'kombine' | 'sistem';

interface BetSlipContextProps {
  betSlip: BetSelection[];
  betAmount: number;
  setBetAmount: (amount: number) => void;
  betType: BetType;
  setBetType: (type: BetType) => void;
  isLocked: boolean;
  addSelection: (selection: BetSelection) => void;
  removeSelection: (id: string) => void;
  clearBetSlip: () => void;
  totalOdds: number;
  potentialPayout: number;
  accumulatorBoost: number; // 0.05 for 5%, etc.
  isTurboMode: boolean;
  setIsTurboMode: (val: boolean) => void;
}

const BetSlipContext = createContext<BetSlipContextProps | undefined>(undefined);

export const BetSlipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [betSlip, setBetSlip] = useState<BetSelection[]>([]);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [betType, setBetType] = useState<BetType>('kombine');
  const [isTurboMode, setIsTurboMode] = useState<boolean>(false);

  const isLocked = betSlip.length === 1 && !!betSlip[0].isSpecialCombo;

  const addSelection = (newSelection: BetSelection) => {
    // TURBO MODE CHECK
    if (isTurboMode) {
      console.log(`⚡ TURBO BAHİS KABUL EDİLDİ: ${newSelection.matchName} - ${newSelection.selectionName}`);
      // Do not add to normal slip, it's instant!
      return;
    }
    // If trying to add a special combo
    if (newSelection.isSpecialCombo) {
      if (betSlip.length === 1 && betSlip[0].id === newSelection.id) {
        // Toggle it off
        setBetSlip([]);
        return;
      }
      window.dispatchEvent(new CustomEvent('betSlipSelectionAdded'));
      setBetSlip([newSelection]);
      setBetType('sistem'); // Switch to Sistem tab
      return;
    }

    // If the bet slip is locked by a special combo, prevent normal additions
    if (isLocked) {
      triggerGlobalToast({ type: 'warning', message: 'Sistem kuponu aktifken ekleme yapamazsınız.' });
      return;
    }

    setBetSlip(prev => {
      // 1. If exactly the same selection is clicked again, remove it (toggle off)
      const existingSelection = prev.find(s => s.id === newSelection.id);
      if (existingSelection) {
        return prev.filter(s => s.id !== newSelection.id);
      }
      
      window.dispatchEvent(new CustomEvent('betSlipSelectionAdded'));

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

  const accumulatorBoost = isLocked ? 0 : getBoostPercentage(betSlip.length);
  const basePayout = totalOdds * betAmount;
  const potentialPayout = totalOdds > 0 ? basePayout + (basePayout * accumulatorBoost) : 0;

  return (
    <BetSlipContext.Provider value={{
      betSlip, 
      betAmount, 
      setBetAmount,
      betType,
      setBetType,
      isLocked,
      addSelection, 
      removeSelection, 
      clearBetSlip, 
      totalOdds, 
      potentialPayout,
      accumulatorBoost,
      isTurboMode,
      setIsTurboMode
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
