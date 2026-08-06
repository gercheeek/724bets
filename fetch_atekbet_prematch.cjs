const WebSocket = require('ws');
const fs = require('fs');

const url = 'wss://eu-swarm-newm.atekbet274.com/ws?language=tur';
const headers = { 'Origin': 'https://atekbet274.com', 'User-Agent': 'Mozilla/5.0' };
const ws = new WebSocket(url, { headers });

const formattedEventsMap = new Map();
const regionsMap = new Map();

ws.on('open', () => {
  console.log('Connecting to Atekbet Swarm API for ALL data (Live + Prematch)...');
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
        if (sName !== 'futbol' && sName !== 'soccer' && sName !== 'football') return;
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
                 game: ['id', 'team1_name', 'team2_name', 'team1_id', 'team2_id', 'start_ts', 'type', 'is_live', 'info'],
                 market: ['id', 'name', 'type_name', 'base'],
                 event: ['id', 'name', 'price', 'base']
               },
               where: {
                 region: { id: reg.regionId },
                 game: { type: { '@in': [0, 1, 2] } }
               }
             },
             rid: `reg_${reg.regionId}_${idx}`
           }));
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

           const virtualKeywords = [
              'cyber', 'sanal', 'virtual', 'simulated', 'srl', 'esoccer', 'ebasketball', 'etennis',
              'esports', 'e-sports', 'fifa', 'nba2k', 'gt sports', 'h2hgg', 'dota', 'counter-strike',
              'cs:go', 'cs2', 'valorant', 'league of legends', 'rocket league', 'overwatch', 'starcraft',
              'crossfire', 'king of glory', 'pubg', 'penaltı atışları', 'penalty shootout', 'sub soccer'
           ];

           const combinedStr = `${tournamentName} ${game.team1_name} ${game.team2_name}`.toLowerCase();
           if (virtualKeywords.some(kw => combinedStr.includes(kw))) {
              return;
           }

           const groupMarkets = { "full_event|0": [] };

           if (game.market) {
               Object.values(game.market).forEach(m => {
                   const t = (m.type_name || '').toLowerCase();
                   const n = (m.name || '').toLowerCase();
                   if (!m.event) return;
                   const evs = Object.values(m.event);

                   // 1x2 (Maç Sonucu)
                   if (n === 'maç sonucu' || n === '1x2' || t === 'p1x2' || t === 'matchresult') {
                       const p1 = evs.find(e => ['w1', '1', 'p1'].includes((e.name || '').toLowerCase().trim()))?.price;
                       const px = evs.find(e => ['x', 'draw', 'beraberlik'].includes((e.name || '').toLowerCase().trim()))?.price;
                       const p2 = evs.find(e => ['w2', '2', 'p2'].includes((e.name || '').toLowerCase().trim()))?.price;
                       if (p1 || px || p2) groupMarkets["full_event|0"].push(`|1x2||~1~${p1||'-'}!~X~${px||'-'}!~2~${p2||'-'}`);
                   }
                   // Alt/Üst (Over/Under)
                   else if (n === 'toplam goller' || n.includes('toplam gol') && !n.includes('yarı') && !n.includes('team')) {
                       const overEv = evs.find(e => (e.name||'').toLowerCase().includes('üst') || (e.name||'').toLowerCase().includes('over'));
                       const underEv = evs.find(e => (e.name||'').toLowerCase().includes('alt') || (e.name||'').toLowerCase().includes('under'));
                       const over = overEv?.price;
                       const under = underEv?.price;
                       if (over || under) {
                           let matchLine = n.match(/([0-9]+\.5)/);
                           if (!matchLine) {
                               const evName = (overEv?.name || underEv?.name || '').toLowerCase();
                               matchLine = evName.match(/([0-9]+\.5)/);
                           }
                           let arg = matchLine ? matchLine[1] : m.base;
                           if (arg === undefined || arg === null) arg = '';
                           if (arg === '') console.log("OU NULL:", n, "BASE:", m.base);
                           groupMarkets["full_event|0"].push(`|ou|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
                       }
                   }
                   // Karşılıklı Gol (BTTS)
                   else if (n === 'her iki takımda gol atar' || n.includes('karşılıklı gol') && !n.includes('yarı')) {
                       const yes = evs.find(e => ['var', 'evet', 'yes'].includes((e.name || '').toLowerCase().trim()))?.price;
                       const no = evs.find(e => ['yok', 'hayır', 'no'].includes((e.name || '').toLowerCase().trim()))?.price;
                       if (yes || no) groupMarkets["full_event|0"].push(`|gg||~var~${yes||'-'}!~yok~${no||'-'}`);
                   }
                   // Çifte Şans (Double Chance)
                   else if (n === 'çifte şans' || n === 'cifte sans' || t === 'doublechance') {
                       const p1x = evs.find(e => ['1x', '1 x'].includes((e.name || '').toLowerCase().trim()))?.price;
                       const p12 = evs.find(e => ['12', '1 2'].includes((e.name || '').toLowerCase().trim()))?.price;
                       const px2 = evs.find(e => ['x2', 'x 2', '2x', '2 x'].includes((e.name || '').toLowerCase().trim()))?.price;
                       if (p1x || p12 || px2) groupMarkets["full_event|0"].push(`|Double_Chance||~1X~${p1x||'-'}!~12~${p12||'-'}!~X2~${px2||'-'}`);
                   }
                   // İlk Yarı Sonucu (Half Time Result)
                   else if (n === '1.yarı sonucu' || n === '1. yarı sonucu') {
                       const p1 = evs.find(e => ['w1', '1', 'p1'].includes((e.name || '').toLowerCase().trim()))?.price;
                       const px = evs.find(e => ['x', 'draw', 'beraberlik'].includes((e.name || '').toLowerCase().trim()))?.price;
                       const p2 = evs.find(e => ['w2', '2', 'p2'].includes((e.name || '').toLowerCase().trim()))?.price;
                       if (p1 || px || p2) groupMarkets["full_event|0"].push(`|Half_Time_Result||~1~${p1||'-'}!~X~${px||'-'}!~2~${p2||'-'}`);
                   }
                   // Kornerler (Corners)
                   else if (n.includes('köşe vuruşları: toplam') || n === 'köşe vuruşları : sonuç') {
                       if (n.includes('yarı') || n.includes('team')) return; // skip half/team corners
                       const overEv = evs.find(e => (e.name||'').toLowerCase().includes('üst') || (e.name||'').toLowerCase().includes('over'));
                       const underEv = evs.find(e => (e.name||'').toLowerCase().includes('alt') || (e.name||'').toLowerCase().includes('under'));
                       const over = overEv?.price;
                       const under = underEv?.price;
                       if (over || under) {
                           let matchLine = n.match(/([0-9]+\.5)/);
                           if (!matchLine) {
                               const evName = (overEv?.name || underEv?.name || '').toLowerCase();
                               matchLine = evName.match(/([0-9]+\.5)/);
                           }
                           const arg = matchLine ? matchLine[1] : (m.base || '');
                           groupMarkets["full_event|0"].push(`|Corners|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
                       }
                   }
                   // Kartlar (Cards)
                   else if (n.includes('kartlar: toplam puan') || n.includes('toplam kartlar')) {
                       if (n.includes('yarı') || n.includes('team')) return;
                       const over = evs.find(e => (e.name||'').toLowerCase().includes('üst') || (e.name||'').toLowerCase().includes('over'))?.price;
                       const under = evs.find(e => (e.name||'').toLowerCase().includes('alt') || (e.name||'').toLowerCase().includes('under'))?.price;
                       if (over || under) {
                           const matchLine = n.match(/([0-9]+\.5)/) || m.base;
                           const arg = matchLine ? (matchLine[1] || matchLine) : '';
                           groupMarkets["full_event|0"].push(`|Cards|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
                       }
                   }
                   // Handikap
                   else if (n === 'gol handikapı' || n === 'goller asya handikapı') {
                       const p1 = evs.find(e => ['w1', '1', 'p1'].includes((e.name || '').toLowerCase().trim()));
                       const p2 = evs.find(e => ['w2', '2', 'p2'].includes((e.name || '').toLowerCase().trim()));
                       if (p1?.price || p2?.price) {
                           const matchLine = n.match(/([+-]?[0-9]+\.5)/) || m.base;
                           const arg = matchLine ? (matchLine[1] || matchLine) : '';
                           groupMarkets["full_event|0"].push(`|Handicap|${arg}|~1~${p1?.price||'-'}!~2~${p2?.price||'-'}`);
                       }
                   }
               });
               
               // Aynı threshold'a sahip tekrar eden marketleri temizle (örn. Toplam Alt/Üst (1) vs Toplam Alt/Üst (1))
               if (groupMarkets["full_event|0"]) {
                   let uniqueKeys = new Set();
                   groupMarkets["full_event|0"] = groupMarkets["full_event|0"].filter(item => {
                       let parts = item.split('|'); 
                       if (parts.length >= 3) {
                           let key = parts[1] + '|' + parts[2];
                           if (uniqueKeys.has(key)) return false;
                           uniqueKeys.add(key);
                       }
                       return true;
                   });
               }
           }
           
           if (game.team1_name.includes('Midtjylland') || game.team2_name.includes('Beşiktaş')) {
               // Dump this specific match for debugging
               fs.writeFileSync('public/raw_dump.json', JSON.stringify(game, null, 2));
           }

           let status = game.is_live === 1 || game.type === 1 ? 'in_progress' : 'not_started';
           let score = '-';
           let minute = 'Live';
           if (game.info) {
               if (game.info.score1 !== undefined && game.info.score2 !== undefined) {
                   score = `${game.info.score1} - ${game.info.score2}`;
               }
               if (game.info.current_game_time) {
                   minute = String(game.info.current_game_time);
               }
           }

           formattedEventsMap.set(String(game.id), {
               id: String(game.id),
               data: {
                  status: status,
                  isLive: status === 'in_progress',
                  sport: { name: regMeta.sportName },
                  tournament: { name: tournamentName },
                  country: { name: regMeta.regionName },
                  participants: { home: game.team1_name, away: game.team2_name, home_id: game.team1_id, away_id: game.team2_id },
                  start_time: new Date(game.start_ts * 1000).toISOString(),
                  score: score,
                  minute: minute,
                  group_markets: groupMarkets
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
   console.log('SUCCESS: Extracted', eventsArray.length, 'real Atekbet Live & Prematch events with ALL Markets!');
   fs.writeFileSync('public/prelive_matches.json', JSON.stringify(eventsArray, null, 2));
   ws.close();
   process.exit(0);
}

setTimeout(() => {
   saveAndExit();
}, 20000);
