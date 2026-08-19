export interface Match724 {
  id: string;
  sport: string;
  league: string;
  leagueId?: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId?: number;
  awayTeamId?: number;
  score: string;
  scoreHome: string | number;
  scoreAway: string | number;
  time: string;
  isLive: boolean;
  odds: {
    "1"?: string;
    "X"?: string;
    "2"?: string;
    "over"?: string;
    "under"?: string;
  };
  overUnderValue?: string;
  marketCount?: number;
  priorityScore?: number; // Internal ranking
}
