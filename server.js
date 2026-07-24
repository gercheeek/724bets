import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

process.on('uncaughtException', (err) => {
    console.error('🔥 [CRITICAL] Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 [CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let globalLiveEvents = new Map();

// Atekbet Swarm Connection
const SWARM_URL = 'wss://eu-swarm-newm.atekbet272.com/ws?language=tur';

function startSwarmConnection() {
    const ws = new WebSocket(SWARM_URL, {
        headers: { 'Origin': 'https://atekbet272.com', 'User-Agent': 'Mozilla/5.0' }
    });
    
    let pollInterval;

    ws.on('open', () => {
        console.log('✅ Connected to Atekbet Swarm API for LIVE data!');
        ws.send(JSON.stringify({
            command: 'request_session',
            params: { site_id: 1, language: 'tur' },
            rid: 'req_session'
        }));
    });
    
    ws.on('message', (d) => {
        const msg = JSON.parse(d.toString());
        if (msg.rid === 'req_session') {
            console.log('✅ Session established. Starting live polling...');
            pollInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        command: 'get',
                        params: {
                            source: 'betting',
                            what: {
                                sport: ['id', 'name'],
                                region: ['id', 'name'],
                                competition: ['id', 'name'],
                                game: ['id', 'team1_name', 'team2_name', 'info', 'start_ts'],
                                market: ['id', 'name', 'type_name'],
                                event: ['id', 'name', 'price']
                            },
                            where: {
                                game: { type: 1 } // LIVE
                            }
                        },
                        rid: 'get_live'
                    }));
                }
            }, 3000); // 3 saniyede bir canli veriyi çek
        } else if (msg.rid === 'get_live') {
            const data = msg.data?.data || msg.data || {};
            const newEvents = new Map();
            
            if (data.sport) {
                Object.values(data.sport).forEach(sport => {
                    const sportName = sport.name || 'Futbol';
                    
                    // ONLY FOOTBALL FILTER
                    const sName = sportName.toLowerCase();
                    if (!sName.includes('futbol') && !sName.includes('soccer') && !sName.includes('football')) {
                        return; // Skip non-football sports
                    }

                    if (!sport.region) return;
                    Object.values(sport.region).forEach(region => {
                        const regionName = region.name || 'Dünya';
                        if (!region.competition) return;
                        Object.values(region.competition).forEach(comp => {
                            const tournamentName = comp.name || 'Lig';
                            if (!comp.game) return;
                            Object.values(comp.game).forEach(game => {
                                if (!game.team1_name || !game.team2_name) return;
                                
                                // Filter out virtual/cyber/fake matches & FIFA player gamer tags
                                const combinedStr = `${sportName} ${tournamentName} ${regionName} ${game.team1_name} ${game.team2_name}`.toLowerCase();
                                const virtualKeywords = [
                                    'cyber', 'sanal', 'virtual', 'simulated', 'srl', 'esoccer', 'ebasketball', 'etennis',
                                    'e-sports', 'esports', 'electronic', 'fifa', 'nba 2k', 'volta', 'penalty', 'h2h', 'gt sports'
                                ];
                                if (virtualKeywords.some(kw => combinedStr.includes(kw))) {
                                    return; // Skip virtual matches
                                }

                                // Skip FIFA gamer tag matches like "England (Douglas)" vs "Italy (Cristian)"
                                const isGamerTag = (name) => {
                                    const match = name.match(/\(([^)]+)\)/);
                                    if (!match) return false;
                                    const tag = match[1].toLowerCase();
                                    return tag !== 'kadınlar' && tag !== 'women' && tag !== 'u19' && tag !== 'u21' && tag !== 'u23' && tag !== 'reserves';
                                };

                                if (isGamerTag(game.team1_name) || isGamerTag(game.team2_name)) {
                                    return; // Skip console/esports player matches
                                }
                                
                                let oddsStr = null;
                                if (game.market) {
                                    const mainMarket = Object.values(game.market).find(m => m.type_name === 'P1P2' || m.type_name === 'P1X2' || m.type_name === 'MatchResult' || m.name === 'Match Result' || m.name === 'Maç Sonucu');
                                    if (mainMarket && mainMarket.event) {
                                        const evs = Object.values(mainMarket.event);
                                        const p1 = evs.find(e => e.name === 'W1' || e.name === '1')?.price;
                                        const px = evs.find(e => e.name === 'X' || e.name === 'Draw')?.price;
                                        const p2 = evs.find(e => e.name === 'W2' || e.name === '2')?.price;
                                        if (p1 || px || p2) {
                                            oddsStr = `|1x2|~home~${p1||'-'}!~draw~${px||'-'}!~away~${p2||'-'}`;
                                        }
                                    }
                                }
                                
                                const ev = {
                                    id: String(game.id),
                                    data: {
                                        status: 'started',
                                        sport: { name: sportName },
                                        tournament: { name: tournamentName },
                                        country: { name: regionName },
                                        participants: { home: game.team1_name, away: game.team2_name },
                                        start_time: game.start_ts ? new Date(game.start_ts * 1000).toISOString() : new Date().toISOString(),
                                        score: game.info ? `${game.info.score1 || 0}:${game.info.score2 || 0}` : '0:0',
                                        minute: game.info ? game.info.current_game_time : 0,
                                        isLive: true,
                                        extended_status: 'live'
                                    }
                                };
                                
                                if (oddsStr) {
                                    ev.data.group_markets = { 'full_event|0': [oddsStr] };
                                    ev.group_markets = { 'full_event|0': [oddsStr] };
                                }
                                
                                newEvents.set(ev.id, ev);
                            });
                        });
                    });
                });
            }
            
            globalLiveEvents = newEvents;
            
            // Broadcast to all clients
            if (globalLiveEvents.size > 0) {
                const payload = Array.from(globalLiveEvents.values());
                const socketIoString = `42["subscribe-LiveEvents",{"events":${JSON.stringify(payload)}}]`;
                
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(socketIoString);
                    }
                });
            }
        }
    });
    
    ws.on('close', () => {
        clearInterval(pollInterval);
        console.log('❌ Swarm API disconnected. Reconnecting in 3s...');
        setTimeout(startSwarmConnection, 3000);
    });
    ws.on('error', (err) => {
        console.error('Swarm Error:', err.message);
    });
}

startSwarmConnection();

wss.on('connection', (ws) => {
    console.log('💻 [LOCAL] Frontend connected.');
    // Hemen mevcut canli maclari gonder
    if (globalLiveEvents.size > 0) {
        const payload = Array.from(globalLiveEvents.values());
        ws.send(`42["subscribe-LiveEvents",{"events":${JSON.stringify(payload)}}]`);
    }
    
    ws.on('message', () => {
        // Istemci mesaj gönderirse yoksay, sadece broadcast yapıyoruz.
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [PROXY] Server running on http://0.0.0.0:${PORT} (Accepting external connections)`);
});
