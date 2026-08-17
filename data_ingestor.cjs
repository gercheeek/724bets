const WebSocket = require('ws');
const Redis = require('ioredis');
const { logError, logInfo } = require('./logger.cjs');

const redis = new Redis(); // Default connects to localhost:6379

const wsUrl = 'wss://eu-swarm-newm.vbettr.com/';
let ws;
let sessionId = null;

const liveMatchesMap = new Map();
const prematchMatchesMap = new Map();

// Filter matches by Elite Teams
const vipTeams = [
    'galatasaray', 'fenerbahçe', 'fenerbahce', 'beşiktaş', 'besiktas', 'trabzonspor', 'başakşehir', 'basaksehir',
    'manchester city', 'arsenal', 'liverpool', 'manchester united', 'chelsea', 'tottenham', 'newcastle', 'aston villa',
    'west ham united', 'brighton', 'everton', 'crystal palace', 'brentford',
    'real madrid', 'barcelona', 'atletico madrid', 'girona', 'athletic bilbao', 'real sociedad',
    'sevilla', 'valencia', 'villarreal', 'real betis',
    'inter', 'ac milan', 'milan', 'juventus', 'napoli', 'roma', 'lazio', 'atalanta',
    'fiorentina', 'bologna', 'torino',
    'bayern munich', 'bayern münih', 'bayer leverkusen', 'borussia dortmund', 'rb leipzig', 'stuttgart',
    'eintracht frankfurt', 'wolfsburg', 'borussia mönchengladbach', 'werder bremen',
    'psg', 'paris saint-germain', 'monaco', 'marseille', 'lille', 'lyon',
    'lens', 'rennes', 'nice',
    'inter miami', 'boca juniors', 'river plate', 'flamengo',
    'palmeiras', 'são paulo', 'corinthians', 'fluminense', 'atletico mineiro', 'botafogo',
    'racing club', 'independiente',
    'al nassr', 'al-nassr', 'al hilal',
    'ajax', 'psv', 'feyenoord', 'benfica', 'sporting cp', 'porto', 'celtic', 'rangers',
    'braga', 'vitoria guimaraes', 'az alkmaar', 'fc twente', 'club brugge', 'anderlecht', 'genk', 'royal antwerp',
    'olympiacos', 'panathinaikos', 'aek athens', 'paok'
];

function isEliteMatch(home, away) {
    if (!home || !away) return false;
    const h = home.toLowerCase();
    const a = away.toLowerCase();
    
    return vipTeams.some(team => h.includes(team) || team.includes(h) || a.includes(team) || team.includes(a));
}

// Helper to extract nested markets easily
function extractOdds(marketsObj) {
  let odds = { 
     "1": '-', "X": '-', "2": '-', "tU": '-', "tA": '-', "cs1X": '-', "cs12": '-', "csX2": '-', "gg": '-', "ng": '-',
     "ht1": '-', "htX": '-', "ht2": '-', "htO05": '-', "htU05": '-', "htO15": '-', "htU15": '-',
     "cr1": '-', "crX": '-', "cr2": '-', "crO75": '-', "crU75": '-', "crO85": '-', "crU85": '-'
  };
  if (!marketsObj) return odds;

  for (const mId in marketsObj) {
    const market = marketsObj[mId];
    if (!market || !market.event) continue;
    
    // MATCH RESULT
    if (market.type === "P1XP2" || market.type === "MatchResult" || market.type === "P1P2") {
      Object.values(market.event).forEach(ev => {
        if (ev.type === "P1" || ev.type === "W1" || ev.name === "W1") odds["1"] = ev.price || '-';
        if (ev.type === "X" || ev.type === "Draw" || ev.name === "X") odds["X"] = ev.price || '-';
        if (ev.type === "P2" || ev.type === "W2" || ev.name === "W2") odds["2"] = ev.price || '-';
      });
    }
    
    // TOTAL GOALS
    if (market.type === "Total" || market.type === "TotalGoals" || market.type === "OverUnder") {
       Object.values(market.event).forEach(ev => {
           if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst" || ev.name === "Üstü") odds["tU"] = ev.price || '-';
           if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt" || ev.name === "Altı") odds["tA"] = ev.price || '-';
       });
    }

    // GG / NG
    if (market.type === "GoalGoal" || market.type === "BothTeamsToScore" || market.type === "YesNo") {
        let foundGG = false;
        Object.values(market.event).forEach(ev => {
            if (ev.type === "Yes" || ev.name === "Yes" || ev.name === "Var" || ev.name === "Evet") { odds["gg"] = ev.price || '-'; foundGG = true; }
            if (ev.type === "No" || ev.name === "No" || ev.name === "Yok" || ev.name === "Hayır") { odds["ng"] = ev.price || '-'; foundGG = true; }
        });
    }

    // DOUBLE CHANCE
    if (market.type === "1X12X2" || market.type === "DoubleChance") {
        Object.values(market.event).forEach(ev => {
            if (ev.type === "1X") odds["cs1X"] = ev.price || '-';
            if (ev.type === "12") odds["cs12"] = ev.price || '-';
            if (ev.type === "X2") odds["csX2"] = ev.price || '-';
        });
    }

    // FIRST HALF RESULT (ht1, htX, ht2)
    const mName = (market.name || '').toLowerCase();
    if (market.type === "HalfTimeResult" || market.type === "FirstHalfResult" || mName.includes("1. yarı sonucu") || mName.includes("1st half result")) {
        Object.values(market.event).forEach(ev => {
            if (ev.type === "P1" || ev.type === "W1" || ev.name === "W1") odds["ht1"] = ev.price || '-';
            if (ev.type === "X" || ev.type === "Draw" || ev.name === "X") odds["htX"] = ev.price || '-';
            if (ev.type === "P2" || ev.type === "W2" || ev.name === "W2") odds["ht2"] = ev.price || '-';
        });
    }

    // FIRST HALF TOTAL GOALS (htO05, htU05, htO15, htU15)
    if (market.type === "FirstHalfTotal" || mName.includes("1. yarı toplam") || mName.includes("1st half total")) {
        Object.values(market.event).forEach(ev => {
            const evBase = ev.base || market.base || '';
            if (String(evBase).includes('0.5')) {
                if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst") odds["htO05"] = ev.price || '-';
                if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt") odds["htU05"] = ev.price || '-';
            }
            if (String(evBase).includes('1.5')) {
                if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst") odds["htO15"] = ev.price || '-';
                if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt") odds["htU15"] = ev.price || '-';
            }
        });
    }

    // CORNERS RESULT (cr1, crX, cr2)
    if (market.type === "CornersResult" || mName === "kornerler" || mName.includes("maç sonucu (kornerler)")) {
        Object.values(market.event).forEach(ev => {
            if (ev.type === "P1" || ev.type === "W1" || ev.name === "W1") odds["cr1"] = ev.price || '-';
            if (ev.type === "X" || ev.type === "Draw" || ev.name === "X") odds["crX"] = ev.price || '-';
            if (ev.type === "P2" || ev.type === "W2" || ev.name === "W2") odds["cr2"] = ev.price || '-';
        });
    }

    // CORNERS TOTAL (crO75, crU75, crO85, crU85)
    if (market.type === "TotalCorners" || mName.includes("toplam korner") || mName.includes("total corners")) {
        Object.values(market.event).forEach(ev => {
            const evBase = ev.base || market.base || '';
            if (String(evBase).includes('7.5')) {
                if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst") odds["crO75"] = ev.price || '-';
                if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt") odds["crU75"] = ev.price || '-';
            }
            if (String(evBase).includes('8.5')) {
                if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst") odds["crO85"] = ev.price || '-';
                if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt") odds["crU85"] = ev.price || '-';
            }
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
    if (!sport) continue;
    const sportName = sport.name ? sport.name.trim().toLowerCase() : (sportId === '1' ? 'futbol' : '');
    
    // Sadece gerçek futbol istiyoruz. e-spor, siber, volta vs. hariç.
    const isEport = sportName.includes('cyber') || sportName.includes('e-') || sportName.includes('esport') || sportName.includes('volta') || sportName.includes('ebattle');
    
    if (isEport || (!sportName.includes('football') && !sportName.includes('soccer') && !sportName.includes('futbol'))) {
      if (sportId !== '1') continue;
    }
    if (!sport.region) continue;
    
    for (const regionId in sport.region) {
      const region = sport.region[regionId];
      if (!region || !region.competition) continue;
      
      for (const compId in region.competition) {
        const comp = region.competition[compId];
        if (!comp || !comp.game) continue;
        
        for (const gameId in comp.game) {
          const game = comp.game[gameId];
          if (!game) continue;
          const tempLiveMatch = liveMatchesMap.get(`live_${game.id || gameId}`);
          const tempPreMatch = prematchMatchesMap.get(`pre_${game.id || gameId}`);
          const existingMatchFixed = tempLiveMatch || tempPreMatch;
          
          const isLiveGame = game.type === 1 || (existingMatchFixed ? existingMatchFixed.is_live : isLive);
          const matchKey = isLiveGame ? `live_${game.id || gameId}` : `pre_${game.id || gameId}`;

          if (!game || (!game.team1_name && !existingMatchFixed)) continue;

          const teamHome = game.team1_name || existingMatchFixed?.team_home || '';
          const teamAway = game.team2_name || existingMatchFixed?.team_away || '';
          const compName = comp.name || existingMatchFixed?.league || '';

          const isVirtual = teamHome.toLowerCase().includes('virtual') || teamAway.toLowerCase().includes('virtual') || compName.toLowerCase().includes('virtual') || compName.toLowerCase().includes('srl');
          if (isVirtual) continue;

          const startTs = game.start_ts || existingMatchFixed?.start_ts;
          
          let scoreHome = existingMatchFixed ? existingMatchFixed.score_home : 0;
          let scoreAway = existingMatchFixed ? existingMatchFixed.score_away : 0;
          let matchMin = existingMatchFixed ? existingMatchFixed.match_minute : (isLiveGame ? 'Canlı' : '');
          
          let gameState = existingMatchFixed ? existingMatchFixed.game_state : 'playing';
          if (game.info) {
              if (game.info.score1 !== undefined) scoreHome = parseInt(game.info.score1) || 0;
              if (game.info.score2 !== undefined) scoreAway = parseInt(game.info.score2) || 0;
              if (game.info.current_game_time !== undefined) matchMin = String(game.info.current_game_time);
              if (game.info.current_game_state !== undefined) gameState = game.info.current_game_state;
          }
          
          let newInternalSeconds = existingMatchFixed ? existingMatchFixed.internal_seconds || 0 : 0;
          let parsedMin = parseInt(matchMin);
          if (!isNaN(parsedMin)) {
             let incomingSeconds = parsedMin * 60;
             if (incomingSeconds > newInternalSeconds) {
                 newInternalSeconds = incomingSeconds;
             }
          }
          
          if (game.stats && game.stats.score_set1 && sportName !== 'futbol' && sportName !== 'football' && sportId !== '1') {
              const sHome = parseInt(game.stats.score_set1.team1_value);
              const sAway = parseInt(game.stats.score_set1.team2_value);
              if (!isNaN(sHome)) scoreHome = sHome;
              if (!isNaN(sAway)) scoreAway = sAway;
          }

          let newOdds = existingMatchFixed ? { ...existingMatchFixed.odds } : {};
          if (game.market) {
              const extractedNewOdds = extractOdds(game.market);
              newOdds = { ...newOdds, ...extractedNewOdds };
          }
          
          let newStats = existingMatchFixed ? existingMatchFixed.odds?.stats : undefined;
          if (game.stats) {
             newStats = {
                 ...(newStats || {}),
                 attack: game.stats.attack || (newStats?.attack || { team1_value: 0, team2_value: 0 }),
                 dangerous_attack: game.stats.dangerous_attack || (newStats?.dangerous_attack || { team1_value: 0, team2_value: 0 }),
                 shot_on_target: game.stats.shot_on_target || (newStats?.shot_on_target || { team1_value: 0, team2_value: 0 }),
                 corner: game.stats.corner || (newStats?.corner || { team1_value: 0, team2_value: 0 })
             };
             newOdds.stats = newStats;
          }

          extracted.push({
            id: matchKey,
            sport_category: sport.name ? sport.name.trim() : (existingMatchFixed ? existingMatchFixed.sport_category : 'Futbol'),
            league: comp.name || (existingMatchFixed ? existingMatchFixed.league : ''),
            team_home: teamHome,
            team_away: teamAway,
            start_ts: startTs,
            match_date: startTs ? new Date(startTs * 1000).toISOString() : (existingMatchFixed ? existingMatchFixed.match_date : new Date().toISOString()),
            is_live: isLiveGame,
            score_home: scoreHome,
            score_away: scoreAway,
            match_minute: matchMin,
            internal_seconds: newInternalSeconds,
            game_state: gameState,
            last_update_ts: Date.now(),
            odds: newOdds,
            status: isLiveGame ? 'in_progress' : 'active'
          });
        }
      }
    }
  }
  return extracted;
}

// DELTA CALCULATION STATE
let previousMatchesMap = new Map();

// INGESTOR TICKER MOTOR & REDIS SYNC
setInterval(async () => {
    let changed = false;
    const now = Date.now();
    const syncPayload = [];
    
    liveMatchesMap.forEach((match, key) => {
        const stateLower = (match.game_state || '').toLowerCase();
        const minStr = (match.match_minute || '').toLowerCase();
        
        // CLEANUP: Remove finished or orphaned matches (no updates for 2 mins)
        const isFinished = stateLower.includes('finished') || stateLower === 'ended' || stateLower === 'match finished' || minStr.includes('finished');
        const isOrphaned = match.last_update_ts && (now - match.last_update_ts > 120000);
        
        if (isFinished || isOrphaned) {
            liveMatchesMap.delete(key);
            changed = true;
            return;
        }

        if (match.status === 'in_progress' && match.internal_seconds !== undefined && match.sport_category === 'Futbol') {
            const isPaused = stateLower.includes('half_time') || stateLower.includes('halftime') || stateLower === 'ht' || minStr === 'ht' || minStr.includes('devre') || stateLower.includes('pause');
            
            if (!isPaused) {
                match.internal_seconds++;
                match.match_minute = `${Math.floor(match.internal_seconds / 60)}`;
                changed = true;
            } else {
                if (match.match_minute !== 'HT') {
                    match.match_minute = 'HT';
                    changed = true;
                }
            }

            syncPayload.push({
               id: match.id,
               seconds: match.internal_seconds,
               minute: match.match_minute,
               state: match.game_state
            });
        }
    });
    
    // Format and sync to Redis
    const matches = [...Array.from(liveMatchesMap.values()), ...Array.from(prematchMatchesMap.values())];
    
    const formattedMatches = matches.map(dbMatch => ({
        id: dbMatch.id,
        isScraped: true,
        data: {
          sport: { name: dbMatch.sport_category },
          tournament: { name: dbMatch.league },
          participants: {
            home: dbMatch.team_home,
            away: dbMatch.team_away
          },
          start_ts: dbMatch.start_ts,
          start_time: dbMatch.match_date,
          status: dbMatch.status,
          score: dbMatch.is_live ? `${dbMatch.score_home || 0}:${dbMatch.score_away || 0}` : undefined,
          match_minute: dbMatch.match_minute,
          stats: dbMatch.odds?.stats,
          odds: dbMatch.odds,
          group_markets: {
            "full_event|0": [
              `|1x2|!1~home~${dbMatch.odds?.['1'] || '-'}!x~draw~${dbMatch.odds?.['X'] || '-'}!2~away~${dbMatch.odds?.['2'] || '-'}`,
              `|ou|2.5|!1~over~${dbMatch.odds?.['tU'] || '-'}!2~under~${dbMatch.odds?.['tA'] || '-'}`,
              `|Double_Chance|!1x~1X~${dbMatch.odds?.['cs1X'] || '-'}!12~12~${dbMatch.odds?.['cs12'] || '-'}!x2~X2~${dbMatch.odds?.['csX2'] || '-'}`,
              `|gg|!1~var~${dbMatch.odds?.['gg'] || '-'}!2~yok~${dbMatch.odds?.['ng'] || '-'}`
            ]
          }
        }
    }));

    // DELTA CALCULATION
    const currentMatchesMap = new Map();
    const updated = [];
    const removed = [];
    
    formattedMatches.forEach(m => {
        currentMatchesMap.set(m.id, m);
        const prev = previousMatchesMap.get(m.id);
        if (!prev || JSON.stringify(prev) !== JSON.stringify(m)) {
            updated.push(m);
        }
    });
    
    previousMatchesMap.forEach((prev, id) => {
        if (!currentMatchesMap.has(id)) {
            removed.push(id);
        }
    });
    
    previousMatchesMap = currentMatchesMap;

    try {
        await redis.set('matches:all', JSON.stringify(formattedMatches));
        // Publish to let broadcaster know there's new data
        if (updated.length > 0 || removed.length > 0) {
             await redis.publish('matches_delta', JSON.stringify({ updated, removed }));
        }
        if (syncPayload.length > 0) {
             await redis.publish('time_sync', JSON.stringify(syncPayload));
        }
    } catch (e) {
        logError("Redis Sync Error: " + e.message);
    }
}, 1000);

let lastSwarmActivity = Date.now();
let heartbeatInterval = null;

function connectSwarm() {
    logInfo(`Connecting to Betconstruct Swarm API (Atekbet)...`);
    
    // vbettr yerine atekbet279 adresine bağlanıyoruz
    ws = new WebSocket('wss://eu-swarm-newm.atekbet279.com/');
    
    ws.on('open', () => {
      logInfo("Connected to Betconstruct Swarm API. Requesting Session...");
      ws.send(JSON.stringify({"command":"request_session","params":{"language":"tur","site_id":1116}}));
  });

  ws.on('message', (data) => {
    try {
      lastSwarmActivity = Date.now();
      const msg = JSON.parse(data.toString());
      
      if (msg.data && msg.data.sid) {
          sessionId = msg.data.sid;
          logInfo(`Session established: ${sessionId}. Subscribing to Football matches...`);
          
          const sportsToFetch = [1, 2, 3, 4, 5, 6, 11, 13];
          
          sportsToFetch.forEach(sportId => {
              ws.send(JSON.stringify({
                "command": "get",
                "params": {
                  "source": "betting",
                  "what": {
                    "sport": ["id", "name"], "region": ["id", "name"], "competition": ["id", "name"],
                    "game": ["id", "start_ts", "team1_name", "team2_name", "type", "info", "stats"],
                    "market": ["id", "type", "name", "base"], "event": ["id", "price", "type", "name"]
                  },
                  "where": { 
                      "sport": {"id": sportId},
                      "game": {"type": 1}
                  },
                  "subscribe": true
                },
                "rid": `live_sub_${sportId}`
              }));

              const nowTs = Math.floor(Date.now() / 1000);
              ws.send(JSON.stringify({
                "command": "get",
                "params": {
                  "source": "betting",
                  "what": {
                    "sport": ["id", "name"], "region": ["id", "name"], "competition": ["id", "name"],
                    "game": ["id", "start_ts", "team1_name", "team2_name", "type", "info", "stats"],
                    "market": ["id", "type", "name", "base"], "event": ["id", "price", "type", "name"]
                  },
                  "where": { 
                      "sport": {"id": sportId},
                      "game": {
                          "type": {"@in": [0, 2]},
                          "start_ts": {"@gte": nowTs, "@lt": nowTs + 86400 * 3}
                      }
                  },
                  "subscribe": true
                },
                "rid": `pre_sub_${sportId}`
              }));
          });
      }

      // Handle Subscriptions & Deltas
      if (msg.data && typeof msg.data === 'object' && !msg.data.sport && !msg.data.data) {
          // It's a delta keyed by subid
          Object.values(msg.data).forEach(subData => {
              if (subData && subData.sport) {
                  const extracted = processSwarmData(subData, true);
                  extracted.forEach(m => {
                      if (m.is_live) liveMatchesMap.set(m.id, m);
                      else prematchMatchesMap.set(m.id, m);
                  });
              }
          });
      } else if (msg.data && msg.data.data && msg.data.data.sport) {
          const isLive = String(msg.rid).startsWith("live_sub");
          const extracted = processSwarmData(msg.data.data, isLive);
          
          extracted.forEach(m => {
              if (m.is_live) liveMatchesMap.set(m.id, m);
              else prematchMatchesMap.set(m.id, m);
          });
      }
      
    } catch (e) {
      logError("WebSocket Message Parse Error: " + e.message);
    }
  });

  ws.on('close', () => {
    logError("Betconstruct Swarm API disconnected. Reconnecting in 5s...");
    setTimeout(connectSwarm, 5000);
  });

  ws.on('error', (err) => {
    logError("Betconstruct WebSocket Error: " + err.message);
  });
}

connectSwarm();

// Keepalive / Watchdog
setInterval(() => {
    if (Date.now() - lastSwarmActivity > 30000) {
        logError("No activity from Swarm for 30s. Force reconnecting...");
        if (ws) ws.terminate();
    }
}, 10000);
