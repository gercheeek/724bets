import { WebSocket } from 'ws';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const channel = supabase.channel('live-data');

channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
        console.log('✅ Supabase Broadcast kanalına (live-data) bağlanıldı!');
        startSwarmConnection();
    }
});

let globalLiveEvents = new Map();
let targetGameId = null;
const SWARM_URL = 'wss://eu-swarm-newm.atekbet273.com/ws?language=tur';

function startSwarmConnection() {
    const ws = new WebSocket(SWARM_URL, {
        headers: { 'Origin': 'https://atekbet273.com', 'User-Agent': 'Mozilla/5.0' }
    });
    
    let pollInterval;

    ws.on('open', () => {
        console.log('✅ Atekbet Swarm WebSocket Bağlantısı Başarılı!');
        ws.send(JSON.stringify({
            command: 'request_session',
            params: { site_id: 1, language: 'tur' },
            rid: 'req_session'
        }));
    });
    
    ws.on('message', (d) => {
        const msg = JSON.parse(d.toString());
        if (msg.rid === 'req_session') {
            console.log('✅ Oturum açıldı. BEŞİKTAŞ maçı aranıyor...');
            pollInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    if (!targetGameId) {
                        ws.send(JSON.stringify({
                            command: 'get',
                            params: {
                                source: 'betting',
                                what: {
                                    sport: ['id', 'name'],
                                    region: ['id', 'name'],
                                    competition: ['id', 'name'],
                                    game: ['id', 'team1_name', 'team2_name']
                                },
                                where: { game: { type: 1 } }
                            },
                            rid: 'get_live_find_target'
                        }));
                    } else {
                        // Sürekli pazar verilerini çek
                        ws.send(JSON.stringify({
                            command: 'get',
                            params: {
                                source: 'betting',
                                what: {
                                    game: ['id', 'team1_name', 'team2_name', 'info', 'start_ts', 'stats'],
                                    market: [],
                                    event: []
                                },
                                where: { game: { id: targetGameId } }
                            },
                            rid: 'get_target_markets'
                        }));
                    }
                }
            }, 3000);
        } else if (msg.rid === 'get_live_find_target') {
            const data = msg.data?.data || msg.data || {};
            
            if (data.sport) {
                Object.values(data.sport).forEach(sport => {
                    if (!sport.region) return;
                    Object.values(sport.region).forEach(region => {
                        if (!region.competition) return;
                        Object.values(region.competition).forEach(comp => {
                            if (!comp.game) return;
                            Object.values(comp.game).forEach(game => {
                                const t1 = (game.team1_name || '').toLowerCase();
                                const t2 = (game.team2_name || '').toLowerCase();
                                if (t1.includes('beşikta') || t2.includes('beşikta') || 
                                    t1.includes('besikta') || t2.includes('besikta')) {
                                    targetGameId = game.id;
                                    console.log(`🔥 BEŞİKTAŞ MAÇI BULUNDU! ID: ${targetGameId} (${game.team1_name} vs ${game.team2_name})`);
                                }
                            });
                        });
                    });
                });
            }
            
            if (!targetGameId) {
                console.log('⏳ Canlıda Beşiktaş maçı bulunamadı. Bekleniyor...');
            }
        } else if (msg.rid === 'get_target_markets') {
            const data = msg.data?.data || msg.data || {};
            const newEvents = new Map();
            
            if (data.market) {
                let gameData = null;
                let sportName = 'Futbol';
                let compName = 'Lig';
                let regionName = 'Dünya';
                
                if (data.sport) {
                    const sportObj = Object.values(data.sport)[0];
                    if (sportObj) {
                        sportName = sportObj.name || 'Futbol';
                        const regionObj = Object.values(sportObj.region || {})[0];
                        if (regionObj) {
                            regionName = regionObj.name || 'Dünya';
                            const compObj = Object.values(regionObj.competition || {})[0];
                            if (compObj) {
                                compName = compObj.name || 'Lig';
                                gameData = Object.values(compObj.game || {})[0];
                            }
                        }
                    }
                }

                if (gameData) {
                    const ev = {
                        id: String(gameData.id),
                        isScraped: true,
                        data: {
                            status: 'started',
                            sport: { name: sportName },
                            tournament: { name: compName },
                            country: { name: regionName },
                            participants: { home: gameData.team1_name, away: gameData.team2_name },
                            start_time: gameData.start_ts ? new Date(gameData.start_ts * 1000).toISOString() : new Date().toISOString(),
                            score: gameData.info ? `${gameData.info.score1 || 0}:${gameData.info.score2 || 0}` : '0:0',
                            minute: gameData.info ? gameData.info.current_game_time : 0,
                            info: gameData.info || {},
                            isLive: true,
                            extended_status: 'live',
                            stats: gameData.stats || {}
                        },
                        sport: sportName,
                        league: compName,
                        homeTeam: gameData.team1_name,
                        awayTeam: gameData.team2_name,
                        score: gameData.info ? `${gameData.info.score1 || 0}:${gameData.info.score2 || 0}` : '0:0',
                        timeStr: (gameData.info && gameData.info.current_game_time) ? `${gameData.info.current_game_time}'` : 'Canlı',
                        isLive: true,
                        matchStatus: 'live',
                        markets: gameData.market // Full market list from swarm!
                    };
                    
                    newEvents.set(ev.id, ev);
                }
            }
            
            globalLiveEvents = newEvents;
            const payload = Array.from(globalLiveEvents.values());
            
            if (payload.length > 0) {
                const game = payload[0];
                const marketCount = game.markets ? Object.keys(game.markets).length : 0;
                console.log(`📡 [CANLI BEŞİKTAŞ GÜNCELLEMESİ] ${game.homeTeam} - ${game.awayTeam} | Skor: ${game.score} | Market: ${marketCount}`);
                
                channel.send({
                    type: 'broadcast',
                    event: 'live_matches_update',
                    payload: payload
                }).catch(err => console.error('Supabase Broadcast Hatası:', err));
            } else {
                console.log('⚠️ Beşiktaş maçı için market verisi gelmedi veya maç bitti.');
                targetGameId = null; // Reset and search again
            }
        }
    });
    
    ws.on('close', () => {
        clearInterval(pollInterval);
        console.log('❌ Atekbet Bağlantısı Koptu. 3 saniye içinde yeniden bağlanılıyor...');
        targetGameId = null;
        setTimeout(startSwarmConnection, 3000);
    });
    ws.on('error', (err) => {
        console.error('Swarm Error:', err.message);
    });
}

