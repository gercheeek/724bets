const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const { logError, logInfo } = require('./logger.cjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const wsUrl = 'wss://eu-swarm-newm.vbettr.com/';
let ws;
let sessionId = null;

const liveMatchesMap = new Map();
const prematchMatchesMap = new Map();
const outrightsMap = new Map();

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
        if (!foundGG) {
            console.log("Unmapped GG market:", market.type, "Events:", JSON.stringify(market.event));
        }
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
    const sportName = sport.name ? sport.name.trim().toLowerCase() : (sportId === '1' ? 'futbol' : '');
    
    // Sadece gerçek futbol istiyoruz. e-spor, siber, volta vs. hariç.
    const isEport = sportName.includes('cyber') || sportName.includes('e-') || sportName.includes('esport') || sportName.includes('volta') || sportName.includes('ebattle');
    
    if (isEport || (!sportName.includes('football') && !sportName.includes('soccer') && !sportName.includes('futbol'))) {
      // Delta updatelerde sport name gelmeyebilir, sportId 1 ise futboldur devam et
      if (sportId !== '1') continue;
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
          const matchKey = isLive ? `live_${game.id || gameId}` : `pre_${game.id || gameId}`;
          const existingMatch = isLive ? liveMatchesMap.get(matchKey) : prematchMatchesMap.get(matchKey);

          if (!game || (!game.team1_name && !existingMatch)) continue;

          const teamHome = game.team1_name || existingMatch?.team_home || '';
          const teamAway = game.team2_name || existingMatch?.team_away || '';
          const compName = comp.name || existingMatch?.league || '';

          // Filter out women's football matches
          const isWomen = (
              compName.toLowerCase().includes('women') || 
              compName.toLowerCase().includes('kadınlar') || 
              compName.toLowerCase().includes('(w)') || 
              teamHome.toLowerCase().includes('(w)') || 
              teamAway.toLowerCase().includes('(w)') || 
              teamHome.toLowerCase().includes('women') || 
              teamAway.toLowerCase().includes('women') ||
              teamHome.toLowerCase().includes('kadınlar') ||
              teamAway.toLowerCase().includes('kadınlar')
          );

          // Filter out virtual and simulated matches
          const isVirtual = (
              compName.toLowerCase().includes('virtual') ||
              compName.toLowerCase().includes('srl') ||
              teamHome.toLowerCase().includes('virtual') ||
              teamAway.toLowerCase().includes('virtual') ||
              teamHome.toLowerCase().includes('srl') ||
              teamAway.toLowerCase().includes('srl')
          );
          
          if (isWomen || isVirtual) continue;

          const startTs = game.start_ts || existingMatch?.start_ts;
          
          let scoreHome = existingMatch ? existingMatch.score_home : 0;
          let scoreAway = existingMatch ? existingMatch.score_away : 0;
          let matchMin = existingMatch ? existingMatch.match_minute : (isLive ? 'Canlı' : '');
          
          let gameState = existingMatch ? existingMatch.game_state : 'playing';
          if (game.info) {
              if (game.info.score1 !== undefined) scoreHome = parseInt(game.info.score1) || 0;
              if (game.info.score2 !== undefined) scoreAway = parseInt(game.info.score2) || 0;
              if (game.info.current_game_time !== undefined) matchMin = String(game.info.current_game_time);
              if (game.info.current_game_state !== undefined) gameState = game.info.current_game_state;
          }
          
          let newInternalSeconds = existingMatch ? existingMatch.internal_seconds || 0 : 0;
          let parsedMin = parseInt(matchMin);
          if (!isNaN(parsedMin)) {
             let incomingSeconds = parsedMin * 60;
             // Never jump backwards within the same half
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

          let newOdds = existingMatch ? { ...existingMatch.odds } : {};
          if (game.market) {
              const extractedNewOdds = extractOdds(game.market);
              newOdds = { ...newOdds, ...extractedNewOdds };
          }
          
          let newStats = existingMatch ? existingMatch.odds.stats : undefined;
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
            sport_category: sport.name ? sport.name.trim() : (existingMatch ? existingMatch.sport_category : 'Futbol'),
            league: comp.name || (existingMatch ? existingMatch.league : ''),
            team_home: teamHome,
            team_away: teamAway,
            start_ts: startTs,
            match_date: startTs ? new Date(startTs * 1000).toISOString() : (existingMatch ? existingMatch.match_date : new Date().toISOString()),
            is_live: isLive,
            score_home: scoreHome,
            score_away: scoreAway,
            match_minute: matchMin,
            internal_seconds: newInternalSeconds,
            game_state: gameState,
            last_update_ts: Date.now(),
            odds: newOdds,
            status: isLive ? 'in_progress' : 'active'
          });
        }
      }
    }
  }
  return extracted;
}

let pendingBroadcast = false;

function broadcastToClients() {
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
          start_ts: dbMatch.start_ts, // Unix zaman damgasını frontend'e gönder
          start_time: dbMatch.match_date, // Geriye dönük uyumluluk için
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
              `|gg|!1~var~${dbMatch.odds?.['gg'] || '-'}!2~yok~${dbMatch.odds?.['ng'] || '-'}`,
              `|ht1x2|!1~home~${dbMatch.odds?.['ht1'] || '-'}!x~draw~${dbMatch.odds?.['htX'] || '-'}!2~away~${dbMatch.odds?.['ht2'] || '-'}`,
              `|htou|!1~over0.5~${dbMatch.odds?.['htO05'] || '-'}!2~under0.5~${dbMatch.odds?.['htU05'] || '-'}!3~over1.5~${dbMatch.odds?.['htO15'] || '-'}!4~under1.5~${dbMatch.odds?.['htU15'] || '-'}`,
              `|cr1x2|!1~home~${dbMatch.odds?.['cr1'] || '-'}!x~draw~${dbMatch.odds?.['crX'] || '-'}!2~away~${dbMatch.odds?.['cr2'] || '-'}`,
              `|crou|!1~over7.5~${dbMatch.odds?.['crO75'] || '-'}!2~under7.5~${dbMatch.odds?.['crU75'] || '-'}!3~over8.5~${dbMatch.odds?.['crO85'] || '-'}!4~under8.5~${dbMatch.odds?.['crU85'] || '-'}`
            ]
          }
        }
    }));

    console.log(`Broadcasting ${formattedMatches.length} matches... (Live: ${Array.from(liveMatchesMap.values()).length}, Pre: ${Array.from(prematchMatchesMap.values()).length})`);
    io.emit('matches_update', formattedMatches);
}

function processOutrightData(dataObj) {
  if (!dataObj || !dataObj.sport) return [];
  const extracted = [];
  
  for (const sId in dataObj.sport) {
    const sport = dataObj.sport[sId];
    if (!sport || !sport.region) continue;
    
    for (const rId in sport.region) {
      const region = sport.region[rId];
      if (!region || !region.competition) continue;
      
      for (const cId in region.competition) {
        const comp = region.competition[cId];
        if (!comp || !comp.game) continue;
        
        for (const gId in comp.game) {
          const game = comp.game[gId];
          if (!game || !game.market) continue;
          
          for (const mId in game.market) {
            const market = game.market[mId];
            if (!market || !market.event) continue;
            
            const participants = [];
            for (const eId in market.event) {
               const ev = market.event[eId];
               if (ev && ev.price && ev.name) {
                  participants.push({
                     id: ev.id,
                     name: ev.name,
                     price: ev.price
                  });
               }
            }
            
            if (participants.length > 0) {
               participants.sort((a, b) => a.price - b.price);
               
               extracted.push({
                 id: `${cId}_${mId}`,
                 sport: sport.name,
                 region: region.name,
                 competition: comp.name,
                 market_name: market.name || "Outright",
                 closes_at: game.start_ts,
                 participants: participants
               });
            }
          }
        }
      }
    }
  }
  return extracted;
}

// SERVER-SIDE TICKER MOTOR
setInterval(() => {
    let changed = false;
    const syncPayload = [];
    const now = Date.now();
    
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
            } else {
                match.match_minute = 'HT';
            }
            
            syncPayload.push({
               id: match.id,
               seconds: match.internal_seconds,
               minute: match.match_minute,
               state: match.game_state
            });
            changed = true;
        }
    });
    
    if (changed) {
        io.emit('time_sync', syncPayload);
    }
}, 1000);

let lastSwarmActivity = Date.now();
let heartbeatInterval = null;

function connectSwarm() {
  console.log(`Connecting to Betconstruct Swarm API...`);
  ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    logInfo("Connected to Betconstruct Swarm API. Requesting Session...");
    ws.send(JSON.stringify({"command":"request_session","params":{"language":"tur","site_id":1116}}));
  });

  ws.on('message', (data) => {
    try {
      lastSwarmActivity = Date.now(); // ANY message counts as activity
      const msg = JSON.parse(data.toString());
      
      if (msg.data && msg.data.sid) {
          sessionId = msg.data.sid;
          logInfo(`Session established: ${sessionId}. Subscribing to Football matches...`);
          
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
                  "sport": {"id": 1},
                  "game": {"type": 1},
                  "market": {"type": {"@in": ["P1P2", "MatchResult", "P1XP2", "TotalGoals", "BothTeamsToScore", "Total", "OverUnder", "GoalGoal", "YesNo"]}}
              }, // 1 = live
              "subscribe": true
            },
            "rid": "live_sub"
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
                  "sport": {"id": 1},
                  "game": {
                      "type": {"@in": [0, 2]},
                      "start_ts": {"@gte": nowTs, "@lt": nowTs + 86400 * 3} // Next 3 days
                  },
                  "market": {"type": {"@in": ["P1P2", "MatchResult", "P1XP2", "TotalGoals", "BothTeamsToScore", "Total", "OverUnder", "GoalGoal", "YesNo"]}}
              },
              "subscribe": true
            },
            "rid": "pre_sub"
          }));

          // Outrights Subscription
          ws.send(JSON.stringify({
            "command": "get",
            "params": {
              "source": "betting",
              "what": {
                "sport": ["id", "name"], "region": ["id", "name"], "competition": ["id", "name"],
                "game": ["id", "start_ts", "team1_name", "team2_name", "type"],
                "market": ["id", "type", "name", "base"], "event": ["id", "price", "type", "name"]
              },
              "where": { 
                  "game": { "type": {"@in": [0, 1, 2, 3]} },
                  "market": {"type": "Outright"}
              },
              "subscribe": true
            },
            "rid": "outrights_sub"
          }));
      }

      // Handle Subscriptions & Deltas
      if ((msg.rid === "live_sub" || msg.rid === "pre_sub") && msg.data) {
          const isLive = msg.rid === "live_sub";
          const extracted = processSwarmData(msg.data.data || msg.data, isLive);
          
          extracted.forEach(m => {
              if (isLive) liveMatchesMap.set(m.id, m);
              else prematchMatchesMap.set(m.id, m);
          });
          
          // Throttle Socket Broadcast to max 1 per 500ms for INSTANT updates
          if (!pendingBroadcast) {
              pendingBroadcast = true;
              setTimeout(() => {
                  broadcastToClients();
                  pendingBroadcast = false;
              }, 500);
          }
      }

      if (msg.rid === "outrights_sub" && msg.data) {
          const extracted = processOutrightData(msg.data.data || msg.data);
          extracted.forEach(o => outrightsMap.set(o.id, o));
          
          io.emit('outrights_update', Array.from(outrightsMap.values()));
      }
    } catch(e) {
        logError("Error parsing or processing swarm message", { error: e.message, data: data.toString().substring(0, 100) });
    }
  });

  ws.on('close', () => {
    logInfo('Connection closed. Reconnecting in 5s...');
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    setTimeout(connectSwarm, 5000);
  });
  
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
      if (Date.now() - lastSwarmActivity > 30000) {
          logError("Heartbeat missed! Swarm connection looks dead. Reconnecting...");
          ws.terminate();
      } else if (ws.readyState === WebSocket.OPEN) {
          // Send a benign ping to keep connection alive
          ws.send(JSON.stringify({"command":"ping"}));
      }
  }, 10000);
  
  ws.on('error', (err) => {
      logError("WebSocket Error", { error: err.message });
  });
}

connectSwarm();

// Client connection handling
io.on('connection', (socket) => {
    console.log(`Frontend client connected: ${socket.id}`);
    
    // Immediately send existing matches
    if (liveMatchesMap.size > 0 || prematchMatchesMap.size > 0) {
        broadcastToClients();
    }

    socket.on('disconnect', () => {
        console.log(`Frontend client disconnected: ${socket.id}`);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Socket.io Server running on port ${PORT}`);
});
