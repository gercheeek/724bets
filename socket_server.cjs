const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const { logError, logInfo } = require('./logger.cjs');

const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Logo Scraper Proxy
const { getLogo } = require('./logoScraper.cjs');
const path = require('path');
const fs = require('fs');

// OroPlay Integration
const oroplay = require('./oroplay.cjs');

app.get('/', (req, res) => {
    res.send('<h1 style="font-family:sans-serif;color:#10B981;text-align:center;margin-top:20%;">🚀 724Bets Backend API Sunucusu Başarıyla Çalışıyor!</h1>');
});

app.get('/api/casino/test-vps', (req, res) => {
    res.json({
        success: true,
        ip_verification: "BU YANIT DOĞRUDAN SİZİN OFFSHORE SUNUCUNUZDAN (85.121.178.80) GELMEKTEDİR!",
        vps_ip: "85.121.178.80",
        server_time: new Date().toISOString()
    });
});

// User balance store
const userBalances = {};
const INITIAL_BALANCE = 1000.00;

app.get('/api/casino/games', async (req, res) => {
    try {
        const games = await oroplay.getAllGames();
        res.json({ success: true, games: games || [] });
    } catch (err) {
        logError('Error fetching casino games from OroPlay', err);
        res.json({ success: true, games: [] });
    }
});

app.post('/api/casino/sync-user-balance', express.json(), (req, res) => {
    const { userCode, balance } = req.body;
    const code = userCode || 'testuser';
    if (typeof balance === 'number') {
        userBalances[code] = balance;
        logInfo(`[Balance Sync] Synced balance for ${code}: ${balance}`);
    }
    res.json({ success: true, balance: userBalances[code] || 0 });
});

app.post('/api/casino/launch', express.json(), async (req, res) => {
    const { vendorCode, gameCode, userCode, balance } = req.body;
    if (!vendorCode || !gameCode) {
        return res.status(400).json({ success: false, error: 'Missing vendorCode or gameCode' });
    }

    const code = userCode || 'testuser';
    if (typeof balance === 'number') {
        userBalances[code] = balance;
    } else if (userBalances[code] === undefined) {
        userBalances[code] = INITIAL_BALANCE;
    }

    const currentBalance = userBalances[code];

    try {
        // Note: OroPlay account is in Seamless Wallet mode.
        // Balance is managed via /api/casino/callback/api/balance and /api/casino/callback/api/transaction callbacks.
        // No need to call createUser/depositUser (Transfer Wallet mode).
        const url = await oroplay.getLaunchUrl(vendorCode, gameCode, code);
        logInfo(`[Casino Launch] Success for ${code}: vendor=${vendorCode}, game=${gameCode}`);
        res.json({ success: true, launchUrl: url });
    } catch (err) {
        logError(`[Casino Launch] Failed for vendor=${vendorCode}, game=${gameCode}`, err);
        res.status(500).json({ success: false, error: 'Bu oyun sağlayıcısı şu an kullanılamıyor.' });
    }
});



app.get('/api/casino/agent-balance', async (req, res) => {
    try {
        const balance = await oroplay.getAgentBalance();
        res.json({ success: true, agentBalance: balance });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/casino/user-balance', (req, res) => {
    const userCode = req.query.userCode || 'testuser';
    if (!userBalances[userCode]) {
        userBalances[userCode] = INITIAL_BALANCE;
    }
    res.json({ success: true, balance: userBalances[userCode] });
});

app.post('/api/casino/callback/api/balance', express.json(), (req, res) => {
    const { userCode } = req.body;
    if (!userBalances[userCode]) {
        userBalances[userCode] = INITIAL_BALANCE;
    }
    logInfo(`[Wallet API] Balance check for ${userCode}: ${userBalances[userCode]}`);
    res.json({
        success: true,
        message: userBalances[userCode],
        errorCode: 0
    });
});

app.post('/api/casino/callback/api/transaction', express.json(), (req, res) => {
    const { userCode, amount, transactionCode, gameCode } = req.body;
    if (!userBalances[userCode]) {
        userBalances[userCode] = INITIAL_BALANCE;
    }
    
    // amount is negative for bets, positive for wins
    const parsedAmount = parseFloat(amount || 0);
    userBalances[userCode] += parsedAmount;
    
    logInfo(`[Wallet API] Transaction for ${userCode} on ${gameCode}. Amount: ${parsedAmount}. New Balance: ${userBalances[userCode]}. Tx: ${transactionCode}`);
    
    res.json({
        success: true,
        message: userBalances[userCode],
        errorCode: 0
    });
});

app.get('/api/logo/:teamId', async (req, res) => {
  const teamId = req.params.teamId;
  const teamName = req.query.name;
  
  if (!teamName) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  const logosDir = path.join(__dirname, 'public', 'logos');
  const exactPath = path.join(logosDir, `${teamId}.png`);
  
  // 1. Check if 1xBet mapped logo exists
  if (fs.existsSync(exactPath)) {
    return res.sendFile(exactPath);
  }

  // 2. Check if Bulk Scraper downloaded it as "teamname.png"
  const slugName = teamName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
  const bulkPath = path.join(logosDir, slugName);
  
  if (fs.existsSync(bulkPath)) {
    // Copy it to teamId.png so it's instantly mapped for the future!
    fs.copyFileSync(bulkPath, exactPath);
    return res.sendFile(exactPath);
  }

  // 3. If neither exists, trigger the dynamic lazy-scraper
  try {
    const logoPath = await getLogo(teamId, teamName);
    if (logoPath && fs.existsSync(logoPath)) {
      res.sendFile(logoPath);
    } else {
      res.status(404).json({ error: 'Logo not found' });
    }
  } catch (err) {
    console.error(`[API] Error fetching logo for ${teamName}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch logo' });
  }
});

// Proxy for detailed match data
app.get('/api/1xbet/match/:id', async (req, res) => {
  const matchId = req.params.id;
  if (matchId === 'debug-list') return res.json(liveMatches1xBet);
  const cleanMatchId = matchId.replace(/^(pre_|live_|mock_)/, '');
  const isLive = req.query.isLive !== 'false' && !matchId.startsWith('pre_'); // Default to true if not explicitly false, unless prefixed with pre_
  const feedType = isLive ? 'LiveFeed' : 'LineFeed';
  
  try {
    const response = await fetch(`https://1xframemxz.com/service-api/${feedType}/GetGameZip?id=${cleanMatchId}&lng=tr&isSubGames=true&GroupEvents=true&allEventsGroupSubGames=true&countevents=250&partner=85`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': `https://1xframemxz.com/tr/${isLive ? 'live' : 'line'}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[1xBet Match Proxy Error]:', error.message);
    res.status(500).json({ error: 'Failed to fetch match details' });
  }
});

const wsUrl = 'wss://eu-swarm-newm.atekbet279.com/';
let ws;
let sessionId = null;

const liveMatchesMap = new Map();
const prematchMatchesMap = new Map();
const outrightsMap = new Map();

// 1xBet Feed Integration
const API_URL_1XBET = 'https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true';
let liveMatches1xBet = [];

async function fetch1xBetLive() {
  try {
    const res = await fetch(API_URL_1XBET, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://1xframemxz.com/tr/live'
      }
    });
    const text = await res.text();
    let data;
    try {
       data = JSON.parse(text);
    } catch(e) {
       console.error('[1xBet Live] JSON Parse Error. Raw response:', text.substring(0, 200));
       return;
    }
    
    if (data && data.Value) {
      liveMatches1xBet = data.Value.map(match => {
        let odds = { "1": '-', "X": '-', "2": '-', "tU": '-', "tA": '-', "tP": '2.5', "cs1X": '-', "cs12": '-', "csX2": '-', "gg": '-', "ng": '-' };
        if (match.E) {
          match.E.forEach(odd => {
            if (odd.T === 1) odds["1"] = odd.C; 
            if (odd.T === 2) odds["X"] = odd.C; 
            if (odd.T === 3) odds["2"] = odd.C; 
            if (odd.T === 9 && odds["tU"] === '-') { odds["tU"] = odd.C; odds["tP"] = odd.P || '2.5'; }
            if (odd.T === 10 && odds["tA"] === '-') { odds["tA"] = odd.C; }
            if (odd.T === 4) odds["cs1X"] = odd.C; 
            if (odd.T === 5) odds["cs12"] = odd.C; 
            if (odd.T === 6) odds["csX2"] = odd.C; 
          });
        }
        
        let scoreHome = 0;
        let scoreAway = 0;
        if (match.SC && match.SC.FS) {
           scoreHome = match.SC.FS.S1 || 0;
           scoreAway = match.SC.FS.S2 || 0;
        }

        return {
          id: match.I,
          sport: match.SN || match.SE || 'Futbol',
          league: match.L || match.LE,
          leagueId: match.LI,
          homeTeam: match.O1,
          homeTeamId: match.O1I,
          awayTeam: match.O2,
          awayTeamId: match.O2I,
          score: `${scoreHome}-${scoreAway}`,
          scoreHome: scoreHome,
          scoreAway: scoreAway,
          time: (match.SC && match.SC.TS) ? Math.floor(match.SC.TS / 60) + "'" : "LIVE",
          info: match.SC,
          odds: odds
        };
      });
      
      io.emit('1xbetLiveMatches', liveMatches1xBet);
      console.log(`[1xBet Live] Fetched ${liveMatches1xBet.length} matches`);
    }
  } catch (err) {
    console.error('[1xBet Live] Fetch Error:', err.message);
  }
}

// 1xBet Pre-Match Integration
const API_URL_1XBET_PRE = 'https://1xframemxz.com/service-api/LineFeed/Get1x2_VZip?count=50&lng=tr&tf=2200000&mode=4&country=180&partner=85&getEmpty=true';
let preMatches1xBet = [];

async function fetch1xBetPreMatch() {
  try {
    const res = await fetch(API_URL_1XBET_PRE, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://1xframemxz.com/tr/line'
      }
    });
    const data = await res.json();
    
    if (data && data.Value) {
      preMatches1xBet = data.Value.map(match => {
        let odds = { "1": '-', "X": '-', "2": '-', "tU": '-', "tA": '-', "tP": '2.5', "cs1X": '-', "cs12": '-', "csX2": '-', "gg": '-', "ng": '-' };
        if (match.E) {
          match.E.forEach(odd => {
            if (odd.T === 1) odds["1"] = odd.C; 
            if (odd.T === 2) odds["X"] = odd.C; 
            if (odd.T === 3) odds["2"] = odd.C; 
            if (odd.T === 9 && odds["tU"] === '-') { odds["tU"] = odd.C; odds["tP"] = odd.P || '2.5'; }
            if (odd.T === 10 && odds["tA"] === '-') { odds["tA"] = odd.C; }
            if (odd.T === 4) odds["cs1X"] = odd.C; 
            if (odd.T === 5) odds["cs12"] = odd.C; 
            if (odd.T === 6) odds["csX2"] = odd.C; 
          });
        }
        
        return {
          id: match.I,
          sport: match.SN || '', // Sport Name
          league: match.L || match.LE,
          leagueId: match.LI,
          homeTeam: match.O1,
          homeTeamId: match.O1I,
          awayTeam: match.O2,
          awayTeamId: match.O2I,
          score: `-`,
          scoreHome: '-',
          scoreAway: '-',
          time: match.S ? new Date(match.S * 1000).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : "YAKLAŞAN",
          info: match.SC || null,
          odds: odds,
          isLive: false
        };
      });
      
      io.emit('1xbetPreMatches', preMatches1xBet);
    }
  } catch (err) {
    console.error('[1xBet PreMatch] Fetch Error:', err.message);
  }
}

setInterval(fetch1xBetLive, 5000);
setInterval(fetch1xBetPreMatch, 15000);
fetch1xBetLive();
fetch1xBetPreMatch();

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
          const regionName = region.name || existingMatch?.country || '';

          // Tüm filtreler kaldırıldı (Kullanıcı Talebi: "TÜM FİLTRELRİ KALDIR.SADECE FUTBOLARI VER")
          // Zaten sportId == 1 kontrolü yukarıda yapıldığı için sadece Futbol maçları buraya düşüyor.

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

          // SADECE CANLI FUTBOL - Kullanıcı Talebi Doğrultusunda Pre-Match ve Outrights Kaldırıldı
          // ws.send(JSON.stringify({ "rid": "pre_sub", ... }));
          // ws.send(JSON.stringify({ "rid": "outrights_sub", ... }));
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
    
    // Immediately send 1xBet matches if available
    if (liveMatches1xBet.length > 0) {
        socket.emit('1xbetLiveMatches', liveMatches1xBet);
    }
    
    // Mock Outrights
    const mockOutrights = [
        {
            id: "out_superlig_1",
            sport: "Futbol",
            competition: "Türkiye Süper Lig 2024/2025",
            market_name: "Şampiyon Kim Olur?",
            closes_at: Math.floor(new Date("2025-05-25").getTime() / 1000),
            participants: [
                { id: "sel_gs", name: "Galatasaray", price: "1.85" },
                { id: "sel_fb", name: "Fenerbahçe", price: "2.10" },
                { id: "sel_bjk", name: "Beşiktaş", price: "6.50" },
                { id: "sel_ts", name: "Trabzonspor", price: "15.00" }
            ]
        },
        {
            id: "out_nba_1",
            sport: "Basketbol",
            competition: "NBA 2024/2025",
            market_name: "Şampiyonluk",
            closes_at: Math.floor(new Date("2025-06-10").getTime() / 1000),
            participants: [
                { id: "sel_bos", name: "Boston Celtics", price: "3.50" },
                { id: "sel_den", name: "Denver Nuggets", price: "4.20" },
                { id: "sel_mil", name: "Milwaukee Bucks", price: "6.00" }
            ]
        }
    ];
    socket.emit('outrights_update', mockOutrights);

    socket.on('disconnect', () => {
        console.log(`Frontend client disconnected: ${socket.id}`);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Socket.io Server running on port ${PORT}`);
});
