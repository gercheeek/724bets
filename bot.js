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
            console.log('✅ Oturum açıldı. Canlı maç verileri çekilmeye başlanıyor...');
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
                                game: ['id', 'team1_name', 'team2_name', 'team1_id', 'team2_id', 'info', 'start_ts', 'stats'],
                                market: ['id', 'name', 'type_name', 'base'],
                                event: ['id', 'name', 'price', 'base']
                            },
                            where: { game: { type: 1 } } // Sadece CANLI maçlar
                        },
                        rid: 'get_live'
                    }));
                }
            }, 3000);
        } else if (msg.rid === 'get_live') {
            const data = msg.data?.data || msg.data || {};
            const newEvents = new Map();
            
            if (data.sport) {
                Object.values(data.sport).forEach(sport => {
                    const sportName = sport.name || 'Futbol';
                    const lowerSport = sportName.toLowerCase();
                    
                    // SADECE BELİRLİ SPORLARI KABUL ET
                    if (!lowerSport.includes('futbol') && !lowerSport.includes('football') && !lowerSport.includes('soccer') &&
                        !lowerSport.includes('basketbol') && !lowerSport.includes('basketball') &&
                        !lowerSport.includes('tenis') && !lowerSport.includes('tennis') &&
                        !lowerSport.includes('beyzbol') && !lowerSport.includes('baseball') &&
                        !lowerSport.includes('voleybol') && !lowerSport.includes('volleyball') &&
                        !lowerSport.includes('buz hokeyi') && !lowerSport.includes('ice hockey')) {
                        return;
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
                                
                                // E-SPOR / SANAL / CYBER KONTROLÜ (KESİN FİLTRE)
                                const combinedStr = `${sportName} ${tournamentName} ${regionName} ${game.team1_name} ${game.team2_name}`.toLowerCase();
                                const virtualKeywords = ['cyber', 'sanal', 'virtual', 'simulated', 'srl', 'esoccer', 'ebasketball', 'etennis', 'e-sports', 'esports', 'electronic', 'fifa', 'nba 2k', 'volta', 'penalty', 'h2h', 'gt sports'];
                                if (virtualKeywords.some(kw => combinedStr.includes(kw))) return;
                                
                                const isGamerTag = (name) => {
                                    const match = name.match(/\(([^)]+)\)/);
                                    if (!match) return false;
                                    const tag = match[1].toLowerCase();
                                    return tag !== 'kadınlar' && tag !== 'women' && tag !== 'u19' && tag !== 'u21' && tag !== 'u23' && tag !== 'reserves';
                                };
                                if (isGamerTag(game.team1_name) || isGamerTag(game.team2_name)) return;
                                
                                let oddsStr = null; // No longer used, handled in groupMarkets

                                let groupMarkets = [];
                                if (game.market) {
                                    Object.values(game.market).forEach(m => {
                                        const t = (m.type_name || '').toLowerCase();
                                        const n = (m.name || '').toLowerCase();
                                        if (!m.event) return;
                                        const evs = Object.values(m.event);
                                        const targetArray = groupMarkets;

                                        // 1x2 (Maç Sonucu)
                                        if (n === 'maç sonucu' || n === '1x2' || t === 'p1x2' || t === 'matchresult') {
                                            const p1 = evs.find(e => ['w1', '1', 'p1'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const px = evs.find(e => ['x', 'draw', 'beraberlik'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const p2 = evs.find(e => ['w2', '2', 'p2'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            if (p1 || px || p2) targetArray.push(`|1x2||~1~${p1||'-'}!~X~${px||'-'}!~2~${p2||'-'}`);
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
                                                targetArray.push(`|ou|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
                                            }
                                        }
                                        // Karşılıklı Gol (BTTS)
                                        else if (n === 'her iki takımda gol atar' || n.includes('karşılıklı gol') && !n.includes('yarı')) {
                                            const yes = evs.find(e => ['var', 'evet', 'yes'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const no = evs.find(e => ['yok', 'hayır', 'no'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            if (yes || no) targetArray.push(`|gg||~var~${yes||'-'}!~yok~${no||'-'}`);
                                        }
                                        // Çifte Şans (Double Chance)
                                        else if (n === 'çifte şans' || n === 'cifte sans' || t === 'doublechance') {
                                            const p1x = evs.find(e => ['1x', '1 x'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const p12 = evs.find(e => ['12', '1 2'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const px2 = evs.find(e => ['x2', 'x 2', '2x', '2 x'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            if (p1x || p12 || px2) targetArray.push(`|Double_Chance||~1X~${p1x||'-'}!~12~${p12||'-'}!~X2~${px2||'-'}`);
                                        }
                                        // İlk Yarı Sonucu (Half Time Result)
                                        else if (n === '1.yarı sonucu' || n === '1. yarı sonucu') {
                                            const p1 = evs.find(e => ['w1', '1', 'p1'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const px = evs.find(e => ['x', 'draw', 'beraberlik'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const p2 = evs.find(e => ['w2', '2', 'p2'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            if (p1 || px || p2) targetArray.push(`|Half_Time_Result||~1~${p1||'-'}!~X~${px||'-'}!~2~${p2||'-'}`);
                                        }
                                        // Kornerler (Corners)
                                        else if (n.includes('köşe vuruşları: toplam') || n === 'köşe vuruşları : sonuç') {
                                            if (n.includes('yarı') || n.includes('team')) return;
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
                                                targetArray.push(`|Corners|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
                                            }
                                        }
                                        // Kartlar (Cards)
                                        else if (n.includes('kartlar: toplam puan') || n.includes('toplam kartlar')) {
                                            if (n.includes('yarı') || n.includes('team')) return;
                                            const over = evs.find(e => (e.name||'').toLowerCase().includes('üst') || (e.name||'').toLowerCase().includes('over'))?.price;
                                            const under = evs.find(e => (e.name||'').toLowerCase().includes('alt') || (e.name||'').toLowerCase().includes('under'))?.price;
                                            if (over || under) {
                                                const matchLine = n.match(/([0-9]+\.5)/);
                                                let arg = matchLine ? matchLine[1] : m.base;
                                                if (arg === undefined || arg === null) arg = '';
                                                targetArray.push(`|Cards|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
                                            }
                                        }
                                        // Handikap
                                        else if (n === 'gol handikapı' || n === 'goller asya handikapı') {
                                            const p1 = evs.find(e => ['w1', '1', 'p1'].includes((e.name || '').toLowerCase().trim()));
                                            const p2 = evs.find(e => ['w2', '2', 'p2'].includes((e.name || '').toLowerCase().trim()));
                                            if (p1?.price || p2?.price) {
                                                const matchLine = n.match(/([+-]?[0-9]+\.5)/);
                                                let arg = matchLine ? matchLine[1] : m.base;
                                                if (arg === undefined || arg === null) arg = '';
                                                targetArray.push(`|Handicap|${arg}|~1~${p1?.price||'-'}!~2~${p2?.price||'-'}`);
                                            }
                                        }
                                    });
                                    // Aynı threshold'a sahip tekrar eden marketleri temizle
                                    let uniqueKeys = new Set();
                                    groupMarkets = groupMarkets.filter(item => {
                                        let parts = item.split('|');
                                        if (parts.length >= 3) {
                                            let key = parts[1] + '|' + parts[2];
                                            if (uniqueKeys.has(key)) return false;
                                            uniqueKeys.add(key);
                                        }
                                        return true;
                                    });
                                }
                                const ev = {
                                    id: String(game.id),
                                    isScraped: true,
                                    data: {
                                        status: 'started',
                                        sport: { name: sportName },
                                        tournament: { name: tournamentName },
                                        country: { name: regionName },
                                        participants: { home: game.team1_name, away: game.team2_name, home_id: game.team1_id, away_id: game.team2_id },
                                        start_time: game.start_ts ? new Date(game.start_ts * 1000).toISOString() : new Date().toISOString(),
                                        score: game.info ? `${game.info.score1 || 0}:${game.info.score2 || 0}` : '0:0',
                                        minute: game.info ? game.info.current_game_time : 0,
                                        info: game.info || {},
                                        isLive: true,
                                        extended_status: 'live',
                                        stats: game.stats || {}
                                    }
                                };
                                
                                // Maintain root level compatibility for BettingContext `normalizeEvent`
                                ev.sport = sportName;
                                ev.league = tournamentName;
                                ev.homeTeam = game.team1_name;
                                ev.awayTeam = game.team2_name;
                                ev.score = ev.data.score;
                                ev.timeStr = ev.data.minute ? `${ev.data.minute}'` : 'Canlı';
                                ev.isLive = true;
                                ev.matchStatus = 'live';

                                if (groupMarkets.length > 0) {
                                    ev.data.group_markets = { 'full_event|0': groupMarkets };
                                    ev.group_markets = { 'full_event|0': groupMarkets };
                                }
                                
                                newEvents.set(ev.id, ev);
                            });
                        });
                    });
                });
            }
            
            globalLiveEvents = newEvents;
            
            if (globalLiveEvents.size > 0) {
                const payload = Array.from(globalLiveEvents.values());
                // Send broadcast to frontend
                channel.send({
                    type: 'broadcast',
                    event: 'live_matches_update',
                    payload: payload
                }).catch(err => console.error('Supabase Broadcast Hatası:', err));
                
                console.log(`📡 [YAYINDA] Sitedeki oyunculara ${payload.length} canlı maç gönderildi.`);
            } else {
                // Eger mac yoksa bos array gonder
                channel.send({
                    type: 'broadcast',
                    event: 'live_matches_update',
                    payload: []
                }).catch(err => console.error('Supabase Broadcast Hatası:', err));
            }
        }
    });
    
    ws.on('close', () => {
        clearInterval(pollInterval);
        console.log('❌ Atekbet Bağlantısı Koptu. 3 saniye içinde yeniden bağlanılıyor...');
        setTimeout(startSwarmConnection, 3000);
    });
    ws.on('error', (err) => {
        console.error('Swarm Error:', err.message);
    });
}
