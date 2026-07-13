import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3000;

// CORS configuration to allow all frontend origins
app.use(cors());
app.use(express.json());

// Root endpoint for health check
app.get('/', (req, res) => {
  res.send('724Bahis Sports Middleware is running. API endpoint is at /api/maclar');
});

// Main proxy endpoint
app.get('/api/maclar', async (req, res) => {
  try {
    // We are mocking an external API request as per instructions.
    // In production, this would be the real external provider URL.
    // const response = await axios.get('https://dummy-sports-api.com/raw');
    // const rawData = response.data;
    
    // For now, we simulate raw complex data coming from the provider
    const simulatedRawData = [
      {
        fixture_id: "FX_98213",
        sport_type: "soccer",
        league_name: "Russian Division 2",
        participants: { team_a: "Chelyabinsk", team_b: "SKA Khabarovsk" },
        clock: { status: "live", match_time: "47'" },
        score_data: { home_goals: 1, away_goals: 1 },
        markets: { 
          total_available: 72,
          main_1x2: { home: "2.38", draw: "2.47", away: "4.1" },
          extra_markets_count: 194
        }
      },
      {
        fixture_id: "FX_98214",
        sport_type: "soccer",
        league_name: "Russian Cup",
        participants: { team_a: "Ural", team_b: "Torpedo Moskova" },
        clock: { status: "halftime", match_time: "İlk Yarı" },
        score_data: { home_goals: 0, away_goals: 0 },
        markets: { 
          total_available: 72,
          main_1x2: { home: "2.39", draw: "2.17", away: "5.6" },
          extra_markets_count: 241
        }
      },
      {
        fixture_id: "FX_98215",
        sport_type: "soccer",
        league_name: "Club Friendlies",
        participants: { team_a: "Wolfsberger AC", team_b: "Hradec Kralove" },
        clock: { status: "live", match_time: "4'" },
        score_data: { home_goals: 0, away_goals: 0 },
        markets: { 
          total_available: 72,
          main_1x2: { home: "2.39", draw: "3.7", away: "2.63" },
          extra_markets_count: 265
        }
      },
      {
        fixture_id: "FX_BB_101",
        sport_type: "basketball",
        league_name: "U20 Eurobasket",
        participants: { team_a: "Belçika U20", team_b: "Hırvatistan U20" },
        clock: { status: "live", match_time: "10' 00\"" },
        score_data: { home_goals: 40, away_goals: 45 },
        markets: { 
          total_available: 72,
          main_1x2: { home: "4.5", draw: null, away: "1.16" },
          extra_markets_count: 223
        }
      },
      {
        fixture_id: "FX_TN_505",
        sport_type: "tennis",
        league_name: "ATP Challenger",
        participants: { team_a: "Raphael Collignon", team_b: "Timofey Skatov" },
        clock: { status: "not_started", match_time: "" },
        score_data: { home_goals: 1, away_goals: 1 },
        markets: { 
          total_available: 72,
          main_1x2: { home: "1.05", draw: null, away: "10.9" },
          extra_markets_count: 204
        }
      }
    ];

    // Data Cleaning & Mapping (Middleware Logic)
    // Convert the complex raw format into the clean format the frontend expects.
    const cleanedData = simulatedRawData.map(item => {
      let mappedSport = 'futbol';
      if (item.sport_type === 'basketball') mappedSport = 'basketbol';
      if (item.sport_type === 'tennis') mappedSport = 'tenis';

      const oddsArray = [];
      if (item.markets.main_1x2.home) oddsArray.push(item.markets.main_1x2.home);
      if (item.markets.main_1x2.draw) oddsArray.push(item.markets.main_1x2.draw);
      if (item.markets.main_1x2.away) oddsArray.push(item.markets.main_1x2.away);
      oddsArray.push(`+${item.markets.extra_markets_count}`);

      return {
        id: item.fixture_id,
        sport: mappedSport,
        time: item.clock.match_time,
        home: item.participants.team_a,
        away: item.participants.team_b,
        scoreHome: item.score_data.home_goals,
        scoreAway: item.score_data.away_goals,
        odds: oddsArray,
        marketsAvailable: item.markets.total_available
      };
    });

    res.json({
      success: true,
      data: cleanedData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching/parsing sports data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası: Sağlayıcıdan veri alınamadı veya dönüştürülemedi.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`[Proxy] Sports Middleware is running on http://localhost:${PORT}`);
});
