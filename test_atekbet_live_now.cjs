const WebSocket = require('ws');

const ws = new WebSocket('wss://eu-swarm-newm.atekbet272.com/ws?language=tur', {
    headers: { 'Origin': 'https://atekbet272.com', 'User-Agent': 'Mozilla/5.0' }
});

ws.on('open', () => {
    ws.send(JSON.stringify({
        command: 'request_session',
        params: { site_id: 1, language: 'tur' },
        rid: 'req'
    }));
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.rid === 'req') {
        // Request live games
        ws.send(JSON.stringify({
            command: 'get',
            params: {
                source: 'betting',
                what: {
                    game: ['id', 'team1_name', 'team2_name', 'info', 'market'],
                    sport: ['name'],
                    region: ['name'],
                    competition: ['name']
                },
                where: {
                    game: { type: 1 } // LIVE
                }
            },
            rid: 'live_data'
        }));
    } else if (msg.rid === 'live_data') {
        const sports = msg.data?.data?.sport || {};
        let totalGames = 0;
        console.log('=== ATEKBET ANLIK CANLI MAÇLAR ===');
        for (const sId in sports) {
            const sport = sports[sId];
            for (const rId in sport.region || {}) {
                const region = sport.region[rId];
                for (const cId in region.competition || {}) {
                    const comp = region.competition[cId];
                    for (const gId in comp.game || {}) {
                        const game = comp.game[gId];
                        
                        const combinedStr = `${sport.name} ${comp.name} ${region.name} ${game.team1_name} ${game.team2_name}`.toLowerCase();
                        const virtualKeywords = [
                            'cyber', 'sanal', 'virtual', 'simulated', 'srl', 'esoccer', 'ebasketball', 'etennis',
                            'e-sports', 'esports', 'electronic', 'fifa', 'nba 2k', 'volta', 'penalty'
                        ];
                        if (virtualKeywords.some(kw => combinedStr.includes(kw))) {
                            continue;
                        }

                        totalGames++;
                        if (totalGames <= 5) {
                            console.log(`⚽ [${sport.name}] ${game.team1_name} vs ${game.team2_name} | Skor: ${game.info?.score1 || 0}:${game.info?.score2 || 0}`);
                        }
                    }
                }
            }
        }
        console.log(`\nTOTAL ANLIK CANLI MAÇ SAYISI: ${totalGames}`);
        ws.close();
        process.exit(0);
    }
});

setTimeout(() => process.exit(0), 5000);
