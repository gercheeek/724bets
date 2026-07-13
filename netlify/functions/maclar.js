export const handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const SUPABASE_URL = "https://eaxtuvjcanakaqetuqlc.supabase.co";
    const SUPABASE_KEY = "sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0";
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/live_matches?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
       throw new Error("Supabase API hatası: " + res.statusText);
    }

    const liveMatches = await res.json();

    // Data cleaning & mapping
    const cleanedData = liveMatches.map(item => {
      let scoreHome = 0;
      let scoreAway = 0;
      let displayTime = item.match_time || "Canlı";
      let sport = "futbol";
      let rawStatus = item.status || "";

      // Extract sport if present, e.g. "BASKETBOL|Canlı: 40-45 (1. Çeyrek)"
      if (rawStatus.includes('|')) {
         const parts = rawStatus.split('|');
         sport = parts[0].toLowerCase();
         rawStatus = parts[1];
      }
      
      if (!item.match_time) {
          displayTime = rawStatus;
      }
      
      const popularLeagues = ['Türkiye Süper Lig', 'Şampiyonlar Ligi', 'Premier League', 'LaLiga', 'Serie A', 'Ligue 1', 'Bundesliga'];
      let league = popularLeagues[parseInt((item.id || "").replace(/[^0-9]/g, '') || "0") % popularLeagues.length];
      if (sport !== 'futbol') {
          league = sport === 'basketbol' ? 'NBA' : 'Wimbledon';
      }
      
      const isLive = rawStatus.includes('Canlı');
      
      // Parse score and exact time from status: "Canlı: 0-0 (61)"
      if (isLive) {
         const scoreMatch = rawStatus.match(/Canlı:\s*(\d+)-(\d+)/);
         if (scoreMatch) {
           scoreHome = parseInt(scoreMatch[1], 10);
           scoreAway = parseInt(scoreMatch[2], 10);
         }
         const timeMatch = rawStatus.match(/\(([^)]+)\)/);
         if (timeMatch) {
           displayTime = timeMatch[1] + "'";
         }
      }

      return {
        id: item.id || Math.random().toString(),
        sport: sport, 
        time: displayTime,
        isLive: isLive,
        home: item.home_team || "Ev Sahibi",
        away: item.away_team || "Deplasman",
        scoreHome: scoreHome,
        scoreAway: scoreAway,
        league: league,
        odds: [
          item.home_odd ? String(item.home_odd) : "-",
          item.draw_odd ? String(item.draw_odd) : "-",
          item.away_odd ? String(item.away_odd) : "-",
          "+72"
        ],
        marketsAvailable: 72
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: cleanedData,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Error fetching sports data in Netlify function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Sunucu hatası: Sağlayıcıdan veri alınamadı veya dönüştürülemedi.'
      })
    };
  }
};
