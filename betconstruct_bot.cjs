const WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

// Using the same credentials from seed_matches_direct
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eaxtuvjcanakaqetuqlc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0';
const supabase = createClient(supabaseUrl, supabaseKey);

const wsUrl = 'wss://eu-swarm-newm.atekbet279.com/';
let ws;
let sessionId = null;

const liveMatchesMap = new Map();
const prematchMatchesMap = new Map();

// Helper to extract nested markets easily
function extractOdds(marketsObj) {
  let odds = { "1": 1.1, "X": 1.1, "2": 1.1, "tU": 1.1, "tA": 1.1, "cs1X": 1.1, "cs12": 1.1, "csX2": 1.1 };
  if (!marketsObj) return odds;

  for (const mId in marketsObj) {
    const market = marketsObj[mId];
    if (!market || !market.event) continue;
    
    // Match Winner (1X2) typically has type "P1XP2" or "MatchResult" or "P1P2"
    if (market.type === "P1XP2" || market.type === "MatchResult" || market.type === "P1P2") {
      Object.values(market.event).forEach(ev => {
        if (ev.type === "P1" || ev.type === "W1" || ev.name === "W1") odds["1"] = ev.price || 1.1;
        if (ev.type === "X" || ev.type === "Draw" || ev.name === "X") odds["X"] = ev.price || 1.1;
        if (ev.type === "P2" || ev.type === "W2" || ev.name === "W2") odds["2"] = ev.price || 1.1;
      });
    }
    
    // Total Over/Under (type typically "Total" or "TotalGoals" or "OverUnder")
    if (market.type === "Total" || market.type === "TotalGoals" || market.type === "OverUnder") {
       Object.values(market.event).forEach(ev => {
           if (ev.type === "Over") odds["tU"] = ev.price || 1.1;
           if (ev.type === "Under") odds["tA"] = ev.price || 1.1;
       });
    }

    // Double Chance ("1X12X2" or "DoubleChance")
    if (market.type === "1X12X2" || market.type === "DoubleChance") {
        Object.values(market.event).forEach(ev => {
            if (ev.type === "1X") odds["cs1X"] = ev.price || 1.1;
            if (ev.type === "12") odds["cs12"] = ev.price || 1.1;
            if (ev.type === "X2") odds["csX2"] = ev.price || 1.1;
        });
    }
  }
  return odds;
}

function processSwarmData(dataObj, isLive) {
  if (!dataObj || !dataObj.sport) return [];
  const extracted = [];
  
  for (const sportId in dataObj.sport) {
    const sport = dataObj.sport[sportId];
    const sportName = (sport.name || '').trim().toLowerCase();
    if (!sportName.includes('football') && !sportName.includes('soccer') && !sportName.includes('futbol')) {
      continue;
    }
    if (!sport.region) continue;
    
    for (const regionId in sport.region) {
      const region = sport.region[regionId];
      if (!region.competition) continue;
      
      for (const compId in region.competition) {
        const comp = region.competition[compId];
        if (!comp.game) continue;
        
        for (const gameId in comp.game) {
          const game = comp.game[gameId];
          if (!game || !game.team1_name) continue;

          let scoreHome = 0, scoreAway = 0, matchMin = '';
          if (game.stats && game.stats.score_set1) {
              scoreHome = parseInt(game.stats.score_set1.team1_value) || 0;
              scoreAway = parseInt(game.stats.score_set1.team2_value) || 0;
          } else if (game.info) {
              scoreHome = parseInt(game.info.score1) || 0;
              scoreAway = parseInt(game.info.score2) || 0;
              matchMin = game.info.current_game_time || '';
          }

          const odds = extractOdds(game.market);
          
          if (game.stats) {
             odds.stats = {
                 attack: game.stats.attack || { team1_value: 0, team2_value: 0 },
                 dangerous_attack: game.stats.dangerous_attack || { team1_value: 0, team2_value: 0 },
                 shot_on_target: game.stats.shot_on_target || { team1_value: 0, team2_value: 0 },
                 corner: game.stats.corner || { team1_value: 0, team2_value: 0 }
             };
          }

          extracted.push({
            id: isLive ? `live_${game.id}` : `pre_${game.id}`,
            sport_category: sport.name.trim(),
            league: comp.name,
            team_home: game.team1_name || 'Ev Sahibi',
            team_away: game.team2_name || 'Deplasman',
            match_date: game.start_ts ? new Date(game.start_ts * 1000).toISOString() : new Date().toISOString(),
            is_live: isLive,
            score_home: scoreHome,
            score_away: scoreAway,
            match_minute: matchMin || (isLive ? 'Canlı' : ''),
            odds: odds,
            status: 'active'
          });
        }
      }
    }
  }
  return extracted;
}

async function broadcastToClients(matches) {
  // We can broadcast directly to Supabase channel 'live-data'
  // But wait, broadcasting from the server role requires secret keys.
  // Instead, since the frontend now polls via HTTP `fetchScraped`, we just write to DB.
  // Actually we will upsert to the database so any client refreshing gets it.
  
  // Format for DB Upsert:
  const upsertRows = matches.map(m => ({
    id: '00000000-0000-0000-0000-' + String(m.id).replace(/\D/g, '').padStart(12, '0'), // Fake UUID based on ID
    sport_category: m.sport_category,
    league: m.league,
    team_home: m.team_home,
    team_away: m.team_away,
    match_date: m.match_date,
    is_live: m.is_live,
    score_home: m.score_home,
    score_away: m.score_away,
    match_minute: m.match_minute,
    odds: m.odds,
    status: m.status
  }));
  
  if (upsertRows.length === 0) return;
  
  const { error } = await supabase.from('sports_matches').upsert(upsertRows, { onConflict: 'id' });
  if (error) {
    console.error('Supabase Upsert Error:', error);
  } else {
    console.log(`Upserted ${upsertRows.length} matches to DB.`);
    const channel = supabase.channel('live-data');
    await channel.send({
      type: 'broadcast',
      event: 'live_matches_update',
      payload: upsertRows
    });
    supabase.removeChannel(channel);
  }
}

function connect() {
  console.log(`Connecting to ${wsUrl}...`);
  ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    console.log('✅ Connected. Requesting Session...');
    ws.send(JSON.stringify({"command":"request_session","params":{"language":"tur","site_id":1}}));
  });

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      
      if (msg.data && msg.data.sid) {
          sessionId = msg.data.sid;
          console.log(`Session established: ${sessionId}. Subscribing...`);
          
          // Subscribe to Live matches
          ws.send(JSON.stringify({
            "command": "get",
            "params": {
              "source": "betting",
              "what": {
                "sport": ["id", "name"], "region": ["id", "name"], "competition": ["id", "name"],
                "game": ["id", "start_ts", "team1_name", "team2_name", "type", "info", "stats"],
                "market": ["id", "type", "name", "base"], "event": ["id", "price", "type", "name"]
              },
              "where": { "game": {"type": 1} }, // 1 = live
              "subscribe": true
            },
            "rid": "live_sub"
          }));

          // Subscribe to Prematch matches
          ws.send(JSON.stringify({
            "command": "get",
            "params": {
              "source": "betting",
              "what": {
                "sport": ["id", "name"], "region": ["id", "name"], "competition": ["id", "name"],
                "game": ["id", "start_ts", "team1_name", "team2_name", "type", "info", "stats"],
                "market": ["id", "type", "name", "base"], "event": ["id", "price", "type", "name"]
              },
              "where": { "game": {"type": {"@in": [0, 2]}} }, // 0/2 = upcoming
              "subscribe": true
            },
            "rid": "pre_sub"
          }));
      }

      // Handle Subscription initial responses
      if (msg.rid === "live_sub" && msg.data) {
          const extracted = processSwarmData(msg.data.data, true);
          extracted.forEach(m => liveMatchesMap.set(m.id, m));
          if (!global.pendingLiveBroadcast) {
              global.pendingLiveBroadcast = true;
              setTimeout(() => {
                  broadcastToClients(Array.from(liveMatchesMap.values()));
                  global.pendingLiveBroadcast = false;
              }, 3000);
          }
      }
      if (msg.rid === "pre_sub" && msg.data) {
          const extracted = processSwarmData(msg.data.data, false);
          extracted.forEach(m => prematchMatchesMap.set(m.id, m));
          if (!global.pendingPreBroadcast) {
              global.pendingPreBroadcast = true;
              setTimeout(() => {
                  broadcastToClients(Array.from(prematchMatchesMap.values()));
                  global.pendingPreBroadcast = false;
              }, 3000);
          }
      }

      // Handle Delta Updates (msg.data without rid might be a push update, or specific rid)
      // For simplicity in this demo, we'll re-fetch every 10 seconds instead of delta-merging.
      // Swarm delta-merging requires a deep object patch algorithm. 
      // Instead, we will let the subscription run, and parse it if it sends full tree diffs.
    } catch(e) {
      console.error('Error parsing WS message:', e.message);
    }
  });

  ws.on('close', () => {
    console.log('Connection closed. Reconnecting in 5s...');
    setTimeout(connect, 5000);
  });
  
  ws.on('error', (err) => {
    console.error('WS Error:', err.message);
  });
}

connect();
