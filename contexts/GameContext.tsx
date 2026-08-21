import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import rawCasinoData from '../data/slotra_casino.json';

export interface Game {
  id: string | number;
  name: string;
  provider: string;
  category: string;
  img: string;
  image: string;
  vendorCode: string;
  gameCode: string;
  isActive?: boolean;
  isMapped?: boolean;
  isNew?: boolean;
}

interface GameContextType {
  games: Game[];
  isLoading: boolean;
  error: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const mapGames = (gamesToMap: any[]) => {
      return gamesToMap.map((g: any) => {
        const validImage = (g.image || g.img || '').trim();
        const finalImg = validImage.length > 5 ? validImage : '';
        
        return {
          id: g.id || Math.random().toString(),
          name: g.name || 'Unknown Game',
          provider: g.provider || 'Unknown',
          category: g.type === 'live' ? 'live' : 'slots',
          img: finalImg,
          image: finalImg,
          vendorCode: g.vendorCode || '',
          gameCode: g.gameCode || '',
          isActive: g.isActive !== false,
          isMapped: g.isMapped === true,
          isNew: g.isNew === true
        };
      });
    };

    const fetchGames = async () => {
      try {
        const res = await fetch('/api/casino/games');
        if (!res.ok) throw new Error('Failed to fetch games');
        const data = await res.json();
        
        if (isMounted) {
          if (data.success && Array.isArray(data.games) && data.games.length > 0) {
            setGames(mapGames(data.games));
            setError(null);
          } else {
            // Fallback if success false or empty array
            console.warn('API returned no games, falling back to local JSON data.');
            setGames(mapGames(rawCasinoData));
            setError('Using local fallback data');
          }
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('GameContext fetch error, falling back to local JSON data:', err);
          setGames(mapGames(rawCasinoData));
          setError(err.message || 'Using local fallback data due to fetch error');
          setIsLoading(false);
        }
      }
    };

    fetchGames();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <GameContext.Provider value={{ games, isLoading, error }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GameProvider');
  }
  return context;
};
