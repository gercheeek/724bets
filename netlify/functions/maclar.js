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
      let displayTime = item.match_time || item.status || "Canlı";
      
      // Parse score and exact time from status: "Canlı: 0-0 (61)"
      if (item.status && item.status.includes('Canlı:')) {
         const scoreMatch = item.status.match(/Canlı: (\d+)-(\d+)/);
         if (scoreMatch) {
           scoreHome = parseInt(scoreMatch[1], 10);
           scoreAway = parseInt(scoreMatch[2], 10);
         }
         const timeMatch = item.status.match(/\(([^)]+)\)/);
         if (timeMatch) {
           displayTime = timeMatch[1] + "'";
         }
      }

      return {
        id: item.id || Math.random().toString(),
        sport: 'futbol', 
        time: displayTime,
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
