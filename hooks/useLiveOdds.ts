import { useState, useEffect } from 'react';

export type OddsTrend = 'up' | 'down' | 'none';

export interface MacDataWithTrends {
  mac_id: string;
  ev_sahibi: string;
  deplasman: string;
  oranlar: { [key: string]: number };
  oranTrendleri?: { [key: string]: OddsTrend };
  isLocked?: boolean;
  status?: string;
}

export function useLiveOddsSimulation(initialMatches: any[]) {
  const [liveMatches, setLiveMatches] = useState<MacDataWithTrends[]>(initialMatches);

  useEffect(() => {
    setLiveMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    if (!liveMatches || liveMatches.length === 0) return;

    const interval = setInterval(() => {
      setLiveMatches(currentMatches => {
        return currentMatches.map(match => {
          // 40% chance for a match to have an odds update
          if (Math.random() > 0.4) return match;

          let hasChanges = false;
          const newOranlar = { ...match.oranlar };
          const newTrendleri: any = { ...match.oranTrendleri };

          ['1', 'X', '2'].forEach(key => {
             if (newOranlar[key] && Math.random() < 0.5) { // 50% chance for this specific selection to change
                const change = (Math.random() * 0.15) + 0.01;
                const isUp = Math.random() > 0.5;
                const currentOdd = typeof newOranlar[key] === 'string' ? parseFloat(newOranlar[key]) : newOranlar[key];
                
                newOranlar[key] = Math.max(1.01, isUp ? currentOdd + change : currentOdd - change);
                newTrendleri[key] = isUp ? 'up' : 'down';
                hasChanges = true;
             } else {
                newTrendleri[key] = 'none';
             }
          });

          // 2% chance for a match to get temporarily locked (e.g. goal scored, VAR)
          const isLocked = Math.random() < 0.02;

          // Clear trends after 2s for the CSS animation to end
          if (hasChanges) {
             setTimeout(() => {
                setLiveMatches(matches => matches.map(m => {
                   if (m.mac_id === match.mac_id) {
                      return { ...m, oranTrendleri: {} }
                   }
                   return m;
                }));
             }, 2000);
          }

          if (isLocked) {
             setTimeout(() => {
                setLiveMatches(matches => matches.map(m => m.mac_id === match.mac_id ? {...m, isLocked: false} : m));
             }, 4000);
          }

          if (!hasChanges && match.isLocked === isLocked) return match;

          return {
            ...match,
            oranlar: newOranlar,
            oranTrendleri: newTrendleri,
            isLocked: match.isLocked || isLocked
          };
        });
      });
    }, 2500); // Simulate every 2.5 seconds

    return () => clearInterval(interval);
  }, [liveMatches.length]);

  return liveMatches;
}
