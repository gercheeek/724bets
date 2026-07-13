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
        odds: [
          item.home_odd ? String(item.home_odd) : "-",
          item.draw_odd ? String(item.draw_odd) : "-",
          item.away_odd ? String(item.away_odd) : "-",
          "+72"
        ],
        marketsAvailable: 72
      };
    });

    const premiumUpcoming = [
      { id: 'pre-1', sport: 'futbol', time: 'Yarın 22:00', isLive: false, home: 'Arsenal', away: 'Manchester City', scoreHome: 0, scoreAway: 0, odds: ['2.45', '3.40', '2.80', '+114'], marketsAvailable: 114 },
      { id: 'pre-2', sport: 'futbol', time: 'Yarın 23:15', isLive: false, home: 'Real Madrid', away: 'Barcelona', scoreHome: 0, scoreAway: 0, odds: ['2.10', '3.50', '3.10', '+132'], marketsAvailable: 132 },
      { id: 'pre-3', sport: 'futbol', time: '15.07 21:45', isLive: false, home: 'Galatasaray', away: 'Fenerbahçe', scoreHome: 0, scoreAway: 0, odds: ['2.25', '3.30', '2.90', '+156'], marketsAvailable: 156 },
      { id: 'pre-4', sport: 'futbol', time: '16.07 22:00', isLive: false, home: 'Bayern Münih', away: 'Borussia Dortmund', scoreHome: 0, scoreAway: 0, odds: ['1.85', '3.80', '4.20', '+98'], marketsAvailable: 98 },
      { id: 'pre-5', sport: 'futbol', time: '17.07 20:30', isLive: false, home: 'Juventus', away: 'AC Milan', scoreHome: 0, scoreAway: 0, odds: ['2.60', '3.10', '2.70', '+84'], marketsAvailable: 84 },
      { id: 'pre-6', sport: 'futbol', time: '17.07 22:00', isLive: false, home: 'Chelsea', away: 'Liverpool', scoreHome: 0, scoreAway: 0, odds: ['2.80', '3.40', '2.40', '+102'], marketsAvailable: 102 },
      { id: 'pre-7', sport: 'basketbol', time: '16.07 03:00', isLive: false, home: 'Los Angeles Lakers', away: 'Golden State Warriors', scoreHome: 0, scoreAway: 0, odds: ['1.95', '-', '1.85', '+45'], marketsAvailable: 45 },
      { id: 'pre-8', sport: 'basketbol', time: '17.07 02:30', isLive: false, home: 'Boston Celtics', away: 'Miami Heat', scoreHome: 0, scoreAway: 0, odds: ['1.65', '-', '2.25', '+40'], marketsAvailable: 40 },
      { id: 'pre-9', sport: 'tenis', time: 'Yarın 15:00', isLive: false, home: 'Novak Djokovic', away: 'Carlos Alcaraz', scoreHome: 0, scoreAway: 0, odds: ['1.80', '-', '2.00', '+22'], marketsAvailable: 22 }
    ];

    const finalData = [...cleanedData, ...premiumUpcoming];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: finalData,
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
