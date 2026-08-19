const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { logError, logInfo } = require('./logger.cjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const API_URL = 'https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=50&lng=tr&gr=1110&mode=4&country=180&partner=85&virtualSports=true&noFilterBlockEvent=true';

let liveMatches = [];

async function fetch1xBetLive() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://1xframemxz.com/tr/live'
      }
    });
    const data = await res.json();
    
    if (data && data.Value) {
      liveMatches = data.Value.map(match => {
        // Parse odds array E: [{T: 1, C: 2.10}, {T: 2, C: 3.4}, {T: 3, C: 2.8} ...]
        let odds = { 
          "1": '-', "X": '-', "2": '-', 
          "tU": '-', "tA": '-', 
          "cs1X": '-', "cs12": '-', "csX2": '-', 
          "gg": '-', "ng": '-'
        };
        
        if (match.E) {
          match.E.forEach(odd => {
            if (odd.T === 1) odds["1"] = odd.C; // 1
            if (odd.T === 2) odds["X"] = odd.C; // X
            if (odd.T === 3) odds["2"] = odd.C; // 2
            if (odd.T === 9) odds["tU"] = odd.C; // Over
            if (odd.T === 10) odds["tA"] = odd.C; // Under
            if (odd.T === 4) odds["cs1X"] = odd.C; // 1X
            if (odd.T === 5) odds["cs12"] = odd.C; // 12
            if (odd.T === 6) odds["csX2"] = odd.C; // X2
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
          odds: odds
        };
      });
      
      io.emit('1xbetLiveMatches', liveMatches);
      // console.log(`[1xBet] Pushed ${liveMatches.length} matches to frontend`);
    }
  } catch (err) {
    console.error('[1xBet] Fetch Error:', err.message);
  }
}

// Fetch every 5 seconds
setInterval(fetch1xBetLive, 5000);
fetch1xBetLive();

const PORT = 4001; // Run on 4001 to not conflict with existing 4000
server.listen(PORT, () => {
  console.log(`🚀 1xBet Feed Service started on port ${PORT}`);
});
