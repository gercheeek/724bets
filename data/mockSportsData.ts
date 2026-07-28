export interface MockMatchInfo {
  id: string;
  sport: string;
  slug: string; // The URL param equivalent, e.g., 'futbol'
  league: string;
  period: string; // 'Canlı' or 'Yaklaşan' or '1. Yarı' etc.
  time: string; // '45+' or '15:00'
  isLive: boolean;
  team1: { name: string; icon?: string };
  team2: { name: string; icon?: string };
  scores?: { t1: number; t2: number }; // Optional if pre-match
  matchDate?: string; // e.g. 'Bugün', 'Yarın'
  odds: Record<string, string>; // e.g. { '1': '1.50', 'X': '3.20', '2': '4.10' } for soccer, or { 'Üst': '1.85', 'Alt': '1.85' }
  extraMarkets?: number;
}

export const mockSportsData: MockMatchInfo[] = [];
