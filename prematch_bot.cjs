const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const PRELIVE_JSON_PATH = path.join(__dirname, 'public', 'prelive_matches.json');
const FETCH_INTERVAL_MS = 10 * 60 * 1000; // Her 10 dakikada bir

console.log('🤖 [Prematch Bot] Başlatılıyor...');
console.log(`📌 Veriler şu konuma kaydedilecek: ${PRELIVE_JSON_PATH}`);

function fetchPrematchData() {
    console.log('🔄 [Prematch Bot] Atekbet Swarm\'a bağlanılıyor (Prematch Verisi İçin)...');
    const ws = new WebSocket('wss://eu-swarm-newm.atekbet273.com/ws?language=tur');

    let matches = [];
    let responsesReceived = 0;
    const expectedResponses = 2; 

    ws.on('open', () => {
        console.log('✅ [Prematch Bot] Swarm bağlantısı kuruldu. Oturum açılıyor...');
        ws.send(JSON.stringify({ command: 'request_session', params: { site_id: 1, language: 'tur' }, rid: 'req_session' }));
    });

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data.toString());

            if (msg.rid === 'req_session') {
                console.log('📦 [Prematch Bot] Oturum açıldı. Futbol ligleri çekiliyor...');
                ws.send(JSON.stringify({
                    command: 'get',
                    params: {
                        source: 'betting',
                        what: { competition: ['id', 'name'] },
                        where: { sport: { id: 1 }, game: { type: { '@in': [0, 2] } } }
                    },
                    rid: 'get_comps'
                }));
            }

            if (msg.rid === 'get_comps') {
                const comps = msg.data.data.competition || {};
                const eliteIds = [];
                Object.values(comps).forEach(c => {
                    if (!c.name) return;
                    const n = c.name.toLowerCase();
                    if (n.includes('şampiyonlar ligi') || n.includes('champions league') || 
                        n.includes('avrupa ligi') || n.includes('europa league') || 
                        n.includes('konferans') || n.includes('dostluk') || n.includes('friendly') || 
                        n.includes('premier') || n.includes('süper lig') || 
                        n.includes('laliga') || n.includes('serie a') || n.includes('bundesliga')) {
                        eliteIds.push(c.id);
                    }
                });
                console.log(`🔍 [Prematch Bot] ${eliteIds.length} adet popüler/eleme ligi bulundu. Maçlar isteniyor...`);

                // İstek 1: Type 0 (Yakın Maçlar) - Tüm Sporlar
                ws.send(JSON.stringify({
                    command: 'get',
                    params: {
                        source: 'betting',
                        what: {
                            sport: ['id', 'name'],
                            region: ['id', 'name'],
                            competition: ['id', 'name'],
                            game: ['id', 'team1_name', 'team2_name', 'team1_id', 'team2_id', 'start_ts'],
                            market: ['id', 'name', 'type_name'],
                            event: ['id', 'name', 'price']
                        },
                        where: { game: { type: 0 } }
                    },
                    rid: 'get_prematch_type0'
                }));

                // İstek 2: Type 2 (Gelecek Maçlar) - Sadece Popüler/Eleme Ligleri
                ws.send(JSON.stringify({
                    command: 'get',
                    params: {
                        source: 'betting',
                        what: {
                            sport: ['id', 'name'],
                            region: ['id', 'name'],
                            competition: ['id', 'name'],
                            game: ['id', 'team1_name', 'team2_name', 'team1_id', 'team2_id', 'start_ts'],
                            market: ['id', 'name', 'type_name'],
                            event: ['id', 'name', 'price']
                        },
                        where: { 
                            game: { type: 2 },
                            competition: { id: { '@in': eliteIds } }
                        }
                    },
                    rid: 'get_prematch_type2'
                }));
            }

            if (msg.rid === 'get_prematch_type0' || msg.rid === 'get_prematch_type2') {
                const responseData = msg.data.data || msg.data || {};
                responsesReceived++;

                console.log(`📥 [Prematch Bot] Veri alındı (${msg.rid})...`);
                if (typeof msg.data === 'number') {
                    console.error(`❌ [Prematch Bot] API Hatası veya Payload Çok Büyük: Code ${msg.data}`);
                }

                if (responseData.sport) {
                    Object.values(responseData.sport).forEach(sport => {
                        const sportName = (sport.name || 'Futbol').trim();
                        if (!['Futbol', 'Basketbol', 'Tenis', 'Voleybol', 'Buz Hokeyi'].includes(sportName)) return;

                        if (sport.region) {
                            Object.values(sport.region).forEach(region => {
                                if (region.competition) {
                                    Object.values(region.competition).forEach(comp => {
                                        if (comp.game) {
                                            Object.values(comp.game).forEach(game => {
                                                if (!game.team1_name || !game.team2_name) return;

                                                const matchObj = {
                                                    id: String(game.id),
                                                    isScraped: true,
                                                    data: {
                                                        id: game.id,
                                                        status: 'not_started',
                                                        sport: { name: sportName },
                                                        tournament: { name: comp.name },
                                                        country: { name: region.name },
                                                        participants: {
                                                            home: game.team1_name,
                                                            away: game.team2_name,
                                                            home_id: game.team1_id,
                                                            away_id: game.team2_id
                                                        },
                                                        start_time: game.start_ts ? new Date(game.start_ts * 1000).toISOString() : new Date().toISOString(),
                                                        start_ts: game.start_ts,
                                                        group_markets: { "full_event|0": [] }
                                                    }
                                                };

                                                if (game.market) {
                                                    Object.values(game.market).forEach(m => {
                                                        const t = (m.type_name || '').toLowerCase();
                                                        const n = (m.name || '').toLowerCase();
                                                        
                                                        if (t === 'p1p2' || t === 'p1x2' || t === 'matchresult' || t === '1x2' || n === 'match result' || n === 'maç sonucu' || n === '1x2' || n === 'winner' || n === 'kazanan') {
                                                            if (m.event) {
                                                                const evs = Object.values(m.event);
                                                                const p1 = evs.find(e => ['w1', '1', 'p1', 'team 1', 'ev sahibi'].includes((e.name || '').toLowerCase().trim()))?.price;
                                                                const px = evs.find(e => ['x', 'draw', 'beraberlik'].includes((e.name || '').toLowerCase().trim()))?.price;
                                                                const p2 = evs.find(e => ['w2', '2', 'p2', 'team 2', 'deplasman'].includes((e.name || '').toLowerCase().trim()))?.price;
                                                                if (p1 || px || p2) matchObj.data.group_markets["full_event|0"].push(`|1x2||~home~${p1||'-'}!~draw~${px||'-'}!~away~${p2||'-'}`);
                                                            }
                                                        }
                                                        else if (n.includes('alt') || n.includes('üst') || n.includes('under') || n.includes('over') || t.includes('total') || t.includes('ou')) {
                                                            if (m.event) {
                                                                const evs = Object.values(m.event);
                                                                const over = evs.find(e => (e.name||'').toLowerCase().includes('üst') || (e.name||'').toLowerCase().includes('over'))?.price;
                                                                const under = evs.find(e => (e.name||'').toLowerCase().includes('alt') || (e.name||'').toLowerCase().includes('under'))?.price;
                                                                if (over || under) {
                                                                    const matchLine = n.match(/([0-9]+\.5)/);
                                                                    const arg = matchLine ? matchLine[1] : '';
                                                                    matchObj.data.group_markets["full_event|0"].push(`|ou|${arg}|~over~${over||'-'}!~under~${under||'-'}`);
                                                                }
                                                            }
                                                        }
                                                        else if (n.includes('karşılıklı gol') || n.includes('btts') || n.includes('both teams')) {
                                                            if (m.event) {
                                                                const evs = Object.values(m.event);
                                                                const yes = evs.find(e => ['var', 'evet', 'yes'].includes((e.name || '').toLowerCase().trim()))?.price;
                                                                const no = evs.find(e => ['yok', 'hayır', 'no'].includes((e.name || '').toLowerCase().trim()))?.price;
                                                                if (yes || no) {
                                                                    matchObj.data.group_markets["full_event|0"].push(`|gg||~yes~${yes||'-'}!~no~${no||'-'}`);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                                if (matchObj.data.group_markets["full_event|0"].length > 0) matches.push(matchObj);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }

                if (responsesReceived === expectedResponses) {
                    console.log(`✅ [Prematch Bot] Toplam ${matches.length} maç ayrıştırıldı.`);
                    fs.writeFileSync(PRELIVE_JSON_PATH, JSON.stringify(matches, null, 2), 'utf-8');
                    console.log(`💾 [Prematch Bot] Veriler ${PRELIVE_JSON_PATH} dosyasına başarıyla kaydedildi!`);
                    ws.close();
                }
            }
        } catch (e) {
            console.error('❌ [Prematch Bot] Hata:', e);
        }
    });

    ws.on('error', (err) => {
        console.error('❌ [Prematch Bot] WebSocket hatası:', err);
    });

    ws.on('close', () => {
        console.log('🔌 [Prematch Bot] WebSocket bağlantısı kapandı.');
    });
}

// İlk çalıştırma
fetchPrematchData();

// Döngüye al
setInterval(() => {
    fetchPrematchData();
}, FETCH_INTERVAL_MS);
