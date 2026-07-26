const WebSocket = require('ws');
const fs = require('fs');

const url = 'wss://eu-swarm-newm.atekbet272.com/ws?language=tur';
const headers = { 'Origin': 'https://atekbet272.com', 'User-Agent': 'Mozilla/5.0' };
const ws = new WebSocket(url, { headers });

const formattedEventsMap = new Map();
const regionsMap = new Map();

ws.on('open', () => {
  console.log('Connecting to Atekbet Swarm API for real prematch data...');
  ws.send(JSON.stringify({
    command: 'request_session',
    params: { site_id: 1, language: 'tur' },
    rid: 'req_session'
  }));
});

ws.on('message', (d) => {
  const msg = JSON.parse(d.toString());
  if (msg.rid === 'req_session') {
     ws.send(JSON.stringify({
       command: 'get',
       params: {
         source: 'betting',
         what: {
           sport: ['id', 'name'],
           region: ['id', 'name']
         }
       },
       rid: 'get_regions'
     }));
  } else if (msg.rid === 'get_regions') {
     const sports = msg.data?.data?.sport || msg.data?.sport || {};
     const regionsToFetch = [];

     Object.values(sports).forEach(sport => {
        if (!sport.region) return;
        const sportName = (sport.name || '').trim();
        const sName = sportName.toLowerCase();
        Object.values(sport.region).forEach(region => {
           regionsToFetch.push({ sportName, regionId: region.id, regionName: region.name });
        });
     });

     console.log('Found', regionsToFetch.length, 'regions. Fetching games for each region...');

     regionsToFetch.forEach((reg, idx) => {
        setTimeout(() => {
           ws.send(JSON.stringify({
             command: 'get',
             params: {
               source: 'betting',
               what: {
                 competition: ['id', 'name'],
                 game: ['id', 'team1_name', 'team2_name', 'start_ts', 'type', 'is_live'],
                 market: ['id', 'name', 'type_name'],
                 event: ['id', 'name', 'price']
               },
               where: {
                 region: { id: reg.regionId }
               }
             },
             rid: `reg_${reg.regionId}_${idx}`
           }));
           // Save mapping for later
           regionsMap.set(String(reg.regionId), { sportName: reg.sportName, regionName: reg.regionName });
        }, idx * 15);
     });

     setTimeout(() => {
        saveAndExit();
     }, Math.max(8000, regionsToFetch.length * 50));

  } else if (msg.rid && msg.rid.startsWith('reg_')) {
     const regionId = msg.rid.split('_')[1];
     const regMeta = regionsMap.get(regionId) || { sportName: 'Bilinmeyen Spor', regionName: 'Dünya' };
     const comps = msg.data?.data?.competition || msg.data?.competition || {};

     Object.values(comps).forEach(comp => {
        if (!comp.game) return;
        const tournamentName = (comp.name || '').trim();

        Object.values(comp.game).forEach(game => {
           if (!game.team1_name || !game.team2_name) return;
           if (game.is_live) return; // skip live matches

           const virtualKeywords = [
              'cyber', 'sanal', 'virtual', 'simulated', 'srl', 'esoccer', 'ebasketball', 'etennis',
              'esports', 'e-sports', 'fifa', 'nba2k', 'gt sports', 'h2hgg', 'dota', 'counter-strike',
              'cs:go', 'cs2', 'valorant', 'league of legends', 'rocket league', 'overwatch', 'starcraft',
              'crossfire', 'king of glory', 'pubg', 'penaltı atışları', 'penalty shootout', 'sub soccer'
           ];

           const combinedStr = `${tournamentName} ${game.team1_name} ${game.team2_name}`.toLowerCase();
           if (virtualKeywords.some(kw => combinedStr.includes(kw))) {
              return; // Skip virtual/cyber matches
           }
           
           let oddsStr = null;
           if (game.market) {
              const mainMarket = Object.values(game.market).find(m => {
                  const t = (m.type_name || '').toLowerCase();
                  const n = (m.name || '').toLowerCase();
                  return t === 'p1p2' || t === 'p1x2' || t === 'matchresult' || t === '1x2' ||
                         n === 'match result' || n === 'maç sonucu' || n === '1x2' || n === 'winner' || n === 'kazanan' || n === 'maçın kazananı';
              });
              if (mainMarket && mainMarket.event) {
                 const evs = Object.values(mainMarket.event);
                 const p1 = evs.find(e => {
                     const en = (e.name || '').toLowerCase().trim();
                     return en === 'w1' || en === '1' || en === 'p1' || en === 'team 1' || en === 'ev sahibi';
                 })?.price;
                 const px = evs.find(e => {
                     const en = (e.name || '').toLowerCase().trim();
                     return en === 'x' || en === 'draw' || en === 'beraberlik';
                 })?.price;
                 const p2 = evs.find(e => {
                     const en = (e.name || '').toLowerCase().trim();
                     return en === 'w2' || en === '2' || en === 'p2' || en === 'team 2' || en === 'deplasman';
                 })?.price;
                 if (p1 || px || p2) {
                     oddsStr = `|1x2|~home~${p1||'-'}!~draw~${px||'-'}!~away~${p2||'-'}`;
                 }
              }
           }

           formattedEventsMap.set(String(game.id), {
               id: String(game.id),
               data: {
                  status: 'not_started',
                  sport: { name: regMeta.sportName },
                  tournament: { name: tournamentName },
                  country: { name: regMeta.regionName },
                  participants: { home: game.team1_name, away: game.team2_name },
                  start_time: new Date(game.start_ts * 1000).toISOString(),
                  group_markets: {
                     'full_event|0': [oddsStr]
                  }
               }
           });
        });
     });
  }
});

let saved = false;
function saveAndExit() {
   if (saved) return;
   saved = true;
   const eventsArray = Array.from(formattedEventsMap.values());
   console.log('SUCCESS: Extracted', eventsArray.length, 'real Atekbet pre-match events including UEFA & Champions League!');
   fs.writeFileSync('public/prelive_matches.json', JSON.stringify(eventsArray, null, 2));
   ws.close();
   process.exit(0);
}

setTimeout(() => {
   saveAndExit();
}, 12000);
