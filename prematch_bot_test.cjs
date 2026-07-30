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
                                                        if (!m.event) return;
                                                        const evs = Object.values(m.event);
                                                        const targetArray = matchObj.data.group_markets["full_event|0"];

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
                                                                const arg = matchLine ? matchLine[1] : (m.base || '');
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
                                                                const arg = matchLine ? matchLine[1] : (m.base || '');
                                                                targetArray.push(`|Corners|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
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
                                                                targetArray.push(`|Cards|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
                                                            }
                                                        }
                                                        // Handikap
                                                        else if (n === 'gol handikapı' || n === 'goller asya handikapı') {
                                                            const p1 = evs.find(e => ['w1', '1', 'p1'].includes((e.name || '').toLowerCase().trim()));
                                                            const p2 = evs.find(e => ['w2', '2', 'p2'].includes((e.name || '').toLowerCase().trim()));
                                                            if (p1?.price || p2?.price) {
                                                                const matchLine = n.match(/([+-]?[0-9]+\.5)/) || m.base;
                                                                const arg = matchLine ? (matchLine[1] || matchLine) : '';
                                                                targetArray.push(`|Handicap|${arg}|~1~${p1?.price||'-'}!~2~${p2?.price||'-'}`);
                                                            }
                                                        }
                                                    });
                                                    // Aynı threshold'a sahip tekrar eden marketleri temizle
                                                    if (matchObj.data.group_markets["full_event|0"]) {
                                                        console.log('BEFORE:', matchObj.data.group_markets['full_event|0'].length); let uniqueKeys = new Set();
                                                        matchObj.data.group_markets["full_event|0"] = matchObj.data.group_markets["full_event|0"].filter(item => {
                                                            let parts = item.split('|');
                                                            if (parts.length >= 3) {
                                                                let key = parts[1] + '|' + parts[2];
                                                                if (uniqueKeys.has(key)) return false;
                                                                uniqueKeys.add(key);
                                                            }
                                                            return true;
                                                        });
console.log('AFTER:', matchObj.data.group_markets['full_event|0'].length);
                                                    }
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
