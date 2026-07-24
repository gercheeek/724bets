const WebSocket = require('ws');

const url = 'wss://eu-swarm-newm.norabahis779.com/ws?organization_id=928d43dd-1219-4ab0-b33f-0e180215781e&x-region=us-south1';
const headers = { 'Origin': 'https://norabahis779.com', 'User-Agent': 'Mozilla/5.0' };
const ws = new WebSocket(url, { headers });

ws.on('open', () => {
  console.log('Connected to Norabahis Swarm API for LIVE data test...');
  ws.send(JSON.stringify({
    command: 'request_session',
    params: { site_id: 55, language: 'tur' },
    rid: 'req_session'
  }));
});

ws.on('message', (d) => {
  const msg = JSON.parse(d.toString());
  
  if (msg.rid === 'req_session') {
     console.log('Session established. Subscribing to Live Games...');
     ws.send(JSON.stringify({
       command: 'get',
       subscribe: true,
       params: {
         source: 'betting',
         what: {
           sport: ['id', 'name', 'alias'],
           region: ['id', 'name'],
           competition: ['id', 'name'],
           game: ['id', 'team1_name', 'team2_name', 'start_ts', 'is_live', 'info'],
           market: ['id', 'name', 'type_name'],
           event: ['id', 'name', 'price']
         },
         where: {
           game: { type: 1 } // 1 is Live
         }
       },
       rid: 'sub_live'
     }));
  } else if (msg.rid === 'sub_live' || (msg.data && msg.data.sport)) {
     console.log('\n--- LIVE DATA RECEIVED ---');
     if (!msg.data) {
         console.log('MSG DATA IS NULL. Full message:', JSON.stringify(msg, null, 2));
         process.exit(1);
     }
     const data = msg.data.data || msg.data;
     let gameCount = 0;
     
     if (data.sport) {
         Object.values(data.sport).forEach(sport => {
             if (!sport.region) return;
             Object.values(sport.region).forEach(region => {
                 if (!region.competition) return;
                 Object.values(region.competition).forEach(comp => {
                     if (!comp.game) return;
                     Object.values(comp.game).forEach(game => {
                         gameCount++;
                         if (gameCount <= 3) {
                             console.log(`\nGame: ${game.team1_name} vs ${game.team2_name}`);
                             if (game.info) {
                                 console.log(`Score: ${game.info.score1}:${game.info.score2}, Time: ${game.info.current_game_time}`);
                             }
                             
                             if (game.market) {
                                 const mainMarket = Object.values(game.market).find(m => m.type_name === 'P1P2' || m.type_name === 'P1X2' || m.type_name === 'MatchResult' || m.name === 'Match Result');
                                 if (mainMarket && mainMarket.event) {
                                     const evs = Object.values(mainMarket.event);
                                     const p1 = evs.find(e => e.name === 'W1' || e.name === '1')?.price;
                                     const px = evs.find(e => e.name === 'X' || e.name === 'Draw')?.price;
                                     const p2 = evs.find(e => e.name === 'W2' || e.name === '2')?.price;
                                     console.log(`Odds: 1:[${p1 || '-'}] X:[${px || '-'}] 2:[${p2 || '-'}]`);
                                 } else {
                                     console.log(`Main market not found or no events. Market keys: ${Object.values(game.market).map(m=>m.type_name).join(', ')}`);
                                 }
                             }
                         }
                     });
                 });
             });
         });
     }
     console.log(`Total Live Games Found: ${gameCount}`);
     process.exit(0);
  }
});

setTimeout(() => {
   console.log('Timeout');
   process.exit(1);
}, 5000);
