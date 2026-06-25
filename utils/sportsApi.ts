export interface SportsEvent {
    idEvent: string;
    strEvent: string;
    strHomeTeam: string;
    strAwayTeam: string;
    intHomeScore: string | null;
    intAwayScore: string | null;
    strLeague: string;
    strThumb: string;
    dateEvent: string;
    strTime: string;
    strStatus: string;
    strHomeTeamBadge?: string;
    strAwayTeamBadge?: string;
}

const API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

export const fetchTodaysMatches = async (sport: string = 'Soccer'): Promise<SportsEvent[]> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `sports_api_today_${sport}_${today}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < 1000 * 60 * 60) { // 1 saat geçerli
                return data;
            }
        }

        const res = await fetch(`${API_BASE}/eventsday.php?d=${today}&s=${sport}`);
        
        if (!res.ok) throw new Error('Failed to fetch from TheSportsDB');
        
        const data = await res.json();
        
        if (!data.events) {
            localStorage.setItem(cacheKey, JSON.stringify({ data: [], timestamp: Date.now() }));
            return [];
        }
        
        const result = data.events.slice(0, 20);
        localStorage.setItem(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
        return result;
    } catch (error) {
        console.error('Error fetching matches from TheSportsDB:', error);
        return [];
    }
};

// Helper to fetch details for a specific team (useful for getting team badges)
export const fetchTeamDetails = async (teamId: string) => {
    try {
        const res = await fetch(`${API_BASE}/lookupteam.php?id=${teamId}`);
        if (!res.ok) throw new Error('Failed to fetch team details');
        const data = await res.json();
        return data.teams ? data.teams[0] : null;
    } catch (error) {
        console.error(`Error fetching team details for ${teamId}:`, error);
        return null;
    }
};
