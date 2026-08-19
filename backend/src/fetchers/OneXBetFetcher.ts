import axios from 'axios';
import { Match724 } from '../types/Match';

const BLACKLIST = [
  'virtual', 'srl', 'simulated', 'cyber', 'e-soccer', 'esports', 
  'short football', 'liga pro', 'fifa', 'ea sports', 'gt sports', 
  'esports battle', 'penalties', '8x8', '4x4', '3x3', 'sanal', 'e-spor',
  'mortal kombat', 'street fighter', 'tekken', 'injustice', 'pes'
];

function isSneakyMatch(leagueName: string, homeTeam: string, awayTeam: string): boolean {
    const combined = `${leagueName} ${homeTeam} ${awayTeam}`.toLowerCase();
    return BLACKLIST.some(word => combined.includes(word));
}

function parseOdds(matchEvents: any[]): any {
    const odds: any = { "1": "-", "X": "-", "2": "-", "over": "-", "under": "-" };
    let overUnderValue = "";

    if (!matchEvents || !Array.isArray(matchEvents)) return { odds, overUnderValue };

    for (const event of matchEvents) {
        if (event.T === 1) odds["1"] = event.C;
        if (event.T === 2) odds["X"] = event.C;
        if (event.T === 3) odds["2"] = event.C;
        
        // 1xBet usually uses T:9 for Over and T:10 for Under 2.5
        if (event.T === 9 && event.P === 2.5) {
            odds["over"] = event.C;
            overUnderValue = "2.5";
        }
        if (event.T === 10 && event.P === 2.5) {
            odds["under"] = event.C;
            overUnderValue = "2.5";
        }
    }
    
    return { odds, overUnderValue };
}

export class OneXBetFetcher {
    static async fetchLiveMatches(): Promise<Match724[]> {
        try {
            const url = "https://1xframemxz.com/service-api/LiveFeed/Get1x2_Zip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1";
            const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            
            if (!response.data || !response.data.Value) return [];

            return response.data.Value
                .filter((match: any) => {
                    const l = match.L || match.LE || '';
                    const h = match.O1 || match.O1E || '';
                    const a = match.O2 || match.O2E || '';
                    return !isSneakyMatch(l, h, a);
                })
                .map((match: any) => {
                    const { odds, overUnderValue } = parseOdds(match.E);
                    
                    let scoreHome = 0;
                    let scoreAway = 0;
                    if (match.SC && match.SC.FS) {
                       scoreHome = match.SC.FS.S1 || 0;
                       scoreAway = match.SC.FS.S2 || 0;
                    }

                    let timeStr = "LIVE";
                    if (match.SC) {
                        if (match.SC.TS) {
                            timeStr = Math.floor(match.SC.TS / 60) + "'";
                        } else if (match.SC.CPS) {
                            timeStr = match.SC.CPS;
                        } else if (match.SC.SLS) {
                            const minMatch = match.SC.SLS.match(/(\d+)/);
                            if (minMatch) timeStr = minMatch[1] + "'";
                        }
                    }

                    const matchObj: Match724 = {
                        id: match.I.toString(),
                        sport: "Futbol",
                        league: match.L || match.LE || "Diğer Ligler",
                        leagueId: match.LI,
                        homeTeam: match.O1 || match.O1E || "Ev Sahibi",
                        awayTeam: match.O2 || match.O2E || "Deplasman",
                        homeTeamId: match.O1I,
                        awayTeamId: match.O2I,
                        score: `${scoreHome}-${scoreAway}`,
                        scoreHome,
                        scoreAway,
                        time: timeStr,
                        isLive: true,
                        odds,
                        overUnderValue,
                        marketCount: match.EC || 145,
                        priorityScore: 0
                    };
                    return matchObj;
                });
        } catch (error) {
            console.error("[1xBet Fetcher] Error fetching LIVE matches:", error);
            return [];
        }
    }

    static async fetchPreMatches(): Promise<Match724[]> {
        try {
            const url = "https://1xframemxz.com/service-api/LineFeed/Get1x2_Zip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1";
            const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            
            if (!response.data || !response.data.Value) return [];

            return response.data.Value
                .filter((match: any) => {
                    const l = match.L || match.LE || '';
                    const h = match.O1 || match.O1E || '';
                    const a = match.O2 || match.O2E || '';
                    return !isSneakyMatch(l, h, a);
                })
                .map((match: any) => {
                    const { odds, overUnderValue } = parseOdds(match.E);

                    const matchObj: Match724 = {
                        id: match.I.toString(),
                        sport: "Futbol",
                        league: match.L || match.LE || "Diğer Ligler",
                        leagueId: match.LI,
                        homeTeam: match.O1 || match.O1E || "Ev Sahibi",
                        awayTeam: match.O2 || match.O2E || "Deplasman",
                        homeTeamId: match.O1I,
                        awayTeamId: match.O2I,
                        score: "0-0",
                        scoreHome: 0,
                        scoreAway: 0,
                        time: match.S ? new Date(match.S * 1000).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : "YAKLAŞAN",
                        isLive: false,
                        odds,
                        overUnderValue,
                        marketCount: match.EC || 145,
                        priorityScore: 0
                    };
                    return matchObj;
                });
        } catch (error) {
            console.error("[1xBet Fetcher] Error fetching PREMATCH matches:", error);
            return [];
        }
    }
}
