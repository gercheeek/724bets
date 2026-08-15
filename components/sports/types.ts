export interface MatchInfo {
  id: string;
  home: string;
  away: string;
  isLive: boolean;
  isFinished: boolean;
  score: string;
  minute: string;
  timestamp?: number;
  startTime?: string;
  matchDate?: string;
  fullDate?: string;
  league: string;
  sport: string;
  country: string;
  homeOdd: string;
  drawOdd: string;
  awayOdd: string;
  homeId: string;
  drawId: string;
  awayId: string;
  homeLogo: string;
  awayLogo: string;
  marketsCount: number;
  info?: any;
  rawEvent?: any;
  stats?: any;
}
