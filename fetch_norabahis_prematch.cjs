const WebSocket = require('ws');
const fs = require('fs');

const url = 'wss://eu-swarm-newm.norabahis779.com/ws?organization_id=928d43dd-1219-4ab0-b33f-0e180215781e&x-region=us-south1';
const headers = { 'Origin': 'https://norabahis779.com', 'User-Agent': 'Mozilla/5.0' };
const ws = new WebSocket(url, { headers });

ws.on('open', () => {
  console.log('Connecting to Norabahis Swarm API for real prematch data...');
  ws.send(JSON.stringify({
    command: 'request_session',
    params: { site_id: 55, language: 'tur' },
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
           region: ['id', 'name'],
           competition: ['id', 'name'],
           game: ['id', 'team1_name', 'team2_name', 'start_ts', 'type'],
           market: ['id', 'name', 'type_name'],
           event: ['id', 'name', 'price']
         },
         where: {
           game: { type: 0 } // Prematch
         }
       },
       rid: 'get_games'
     }));
  } else if (msg.rid === 'get_games') {
     const sports = msg.data?.data?.sport || msg.data?.sport || {};
     const formattedEvents = [];

     Object.values(sports).forEach(sport => {
        if (!sport.region) return;
        const sportName = (sport.name || '').trim();
        
        Object.values(sport.region).forEach(region => {
           if (!region.competition) return;
           const countryName = (region.name || '').trim();

           Object.values(region.competition).forEach(comp => {
              if (!comp.game) return;
              const tournamentName = (comp.name || '').trim();

              Object.values(comp.game).forEach(game => {
                 if (!game.team1_name || !game.team2_name) return;
                 
                 let oddsStr = '|1x2|~home~1.85!~draw~3.40!~away~3.80';
                 if (game.market) {
                    const mainMarket = Object.values(game.market).find(m => m.type_name === 'P1P2' || m.type_name === 'P1X2' || m.name === 'Match Result' || m.name === 'Maç Sonucu');
                    if (mainMarket && mainMarket.event) {
                       const evs = Object.values(mainMarket.event);
                       const p1 = evs.find(e => e.name === 'W1' || e.name === '1')?.price || '1.85';
                       const px = evs.find(e => e.name === 'X' || e.name === 'Draw')?.price || '3.40';
                       const p2 = evs.find(e => e.name === 'W2' || e.name === '2')?.price || '3.80';
                       oddsStr = `|1x2|~home~${p1}!~draw~${px}!~away~${p2}`;
                    }
                 }

                 formattedEvents.push({
                    id: String(game.id),
                    data: {
                       status: 'not_started',
                       sport: { name: sportName },
                       tournament: { name: tournamentName },
                       country: { name: countryName },
                       participants: { home: game.team1_name, away: game.team2_name },
                       start_time: new Date(game.start_ts * 1000).toISOString(),
                       group_markets: {
                          'full_event|0': [oddsStr]
                       }
                    }
                 });
              });
           });
        });
     });

     console.log('SUCCESS: Extracted', formattedEvents.length, 'real Norabahis pre-match events!');
     // Save top 200 real Norabahis prematch events to prelive_matches.json
     fs.writeFileSync('public/prelive_matches.json', JSON.stringify(formattedEvents.slice(0, 200), null, 2));
     ws.close();
     process.exit(0);
  }
});
setTimeout(() => process.exit(0), 10000);
