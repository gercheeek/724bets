import { WebSocketServer, WebSocket } from 'ws';
import { spawn } from 'child_process';
import express from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.VITE_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;
let supabaseChannel = null;
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    supabaseChannel = supabase.channel('live-data');
    supabaseChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log('📡 [SUPER] Connected to Supabase Broadcast channel (live-data) for live scores!');
        }
    });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

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
const SWARM_URL = 'wss://eu-swarm-newm.atekbet274.com/ws?language=tur';

function startSwarmConnection() {
    const ws = new WebSocket(SWARM_URL, {
        headers: { 'Origin': 'https://atekbet274.com', 'User-Agent': 'Mozilla/5.0' }
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
                                game: ['id', 'team1_name', 'team2_name', 'team1_id', 'team2_id', 'info', 'start_ts'],
                                market: ['id', 'name', 'type_name'],
                                event: ['id', 'name', 'price']
                            },
                            where: {
                                game: { type: { '@in': [0, 1] } } // PRE-MATCH and LIVE
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
                    const sName = sportName.toLowerCase();
                    if (sName !== 'futbol' && sName !== 'soccer' && sName !== 'football') return;

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
                                
                                let groupMarkets = { 'full_event|0': [] };
                                let rawHomeOdd = '-';
                                let rawDrawOdd = '-';
                                let rawAwayOdd = '-';
                                let allMarkets = {};

                                if (game.market) {
                                    allMarkets = game.market; // pass the raw markets explicitly
                                    Object.values(game.market).forEach(m => {
                                        const t = (m.type_name || '').toLowerCase();
                                        const n = (m.name || '').toLowerCase();
                                        const evs = m.event ? Object.values(m.event) : [];
                                        
                                        // Maç Sonucu (1x2)
                                        if (t === 'p1p2' || t === 'p1x2' || t === 'matchresult' || t === '1x2' ||
                                            n === 'match result' || n === 'maç sonucu' || n === 'winner' || n === 'kazanan') {
                                            const p1 = evs.find(e => ['w1', '1', 'p1', 'team 1', 'ev sahibi'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const px = evs.find(e => ['x', 'draw', 'beraberlik'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const p2 = evs.find(e => ['w2', '2', 'p2', 'team 2', 'deplasman'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            if (p1 || px || p2) groupMarkets["full_event|0"].push(`|1x2|~home~${p1||'-'}!~draw~${px||'-'}!~away~${p2||'-'}`);
                                            
                                            // Extract base odds for the root object
                                            if (p1) rawHomeOdd = parseFloat(p1).toFixed(2);
                                            if (px) rawDrawOdd = parseFloat(px).toFixed(2);
                                            if (p2) rawAwayOdd = parseFloat(p2).toFixed(2);
                                        }
                                        // Toplam Goller (Alt/Üst)
                                        else if (n === 'toplam goller' || n === 'toplam' || t === 'totalgoals' || t === 'underover') {
                                            const over = evs.find(e => (e.name||'').toLowerCase().includes('üst') || (e.name||'').toLowerCase().includes('over'))?.price;
                                            const under = evs.find(e => (e.name||'').toLowerCase().includes('alt') || (e.name||'').toLowerCase().includes('under'))?.price;
                                            if (over || under) {
                                                const matchLine = n.match(/([0-9]+\.5)/) || m.base;
                                                const arg = matchLine ? (matchLine[1] || matchLine) : '2.5';
                                                groupMarkets["full_event|0"].push(`|ou|${arg}|~üstü~${over||'-'}!~altı~${under||'-'}`);
                                            }
                                        }
                                        // Karşılıklı Gol (BTTS)
                                        else if (n === 'her iki takımda gol atar' || n.includes('karşılıklı gol')) {
                                            const yes = evs.find(e => ['var', 'evet', 'yes'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const no = evs.find(e => ['yok', 'hayır', 'no'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            if (yes || no) groupMarkets["full_event|0"].push(`|gg||~var~${yes||'-'}!~yok~${no||'-'}`);
                                        }
                                        // Çifte Şans
                                        else if (n === 'çifte şans' || t === 'doublechance') {
                                            const p1x = evs.find(e => ['1x', '1 x'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const p12 = evs.find(e => ['12', '1 2'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const px2 = evs.find(e => ['x2', 'x 2', '2x', '2 x'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            if (p1x || p12 || px2) groupMarkets["full_event|0"].push(`|Double_Chance||~1X~${p1x||'-'}!~12~${p12||'-'}!~X2~${px2||'-'}`);
                                        }
                                        // İlk Yarı Sonucu
                                        else if (n === '1.yarı sonucu' || n === '1. yarı sonucu') {
                                            const p1 = evs.find(e => ['w1', '1', 'p1'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const px = evs.find(e => ['x', 'draw', 'beraberlik'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            const p2 = evs.find(e => ['w2', '2', 'p2'].includes((e.name || '').toLowerCase().trim()))?.price;
                                            if (p1 || px || p2) groupMarkets["full_event|0"].push(`|Half_Time_Result||~1~${p1||'-'}!~X~${px||'-'}!~2~${p2||'-'}`);
                                        }
                                    });
                                }

                                const nowTs = Date.now();
                                const matchStartTs = game.start_ts ? game.start_ts * 1000 : 0;
                                
                                let isLive = game.type === 1; // 1 = Live, 0 = Pre-match

                                // 🚨 STRICT LIVE FILTERING (Gerçek Canlı Kontrolleri) for live games only
                                if (isLive) {
                                    // 1. ZAMAN KONTROLU: Maç saati gelecekteyse canlı olamaz (60 sn tolerans)
                                    if (matchStartTs > nowTs + 60000) {
                                        isLive = false; 
                                    }

                                    // 2. BİTMİŞ MAÇ KONTROLU: Maç bittiyse veya iptal edildiyse atla
                                    const matchPhase = (game.info?.current_game_state || '').toLowerCase();
                                    if (matchPhase === 'finished' || matchPhase === 'ended' || matchPhase === 'ft' || matchPhase === 'abandoned' || matchPhase === 'canceled' || matchPhase === 'not_started') {
                                        return; // SKIP: Biten veya iptal olan maçlar
                                    }

                                    // 3. ZAMANLAYICI (TIMER) KONTROLU: Futbol ve Basketbolda zaman akmıyor ve skor yoksa (sıfırsa) başlamamıştır
                                    const isFootballOrBasketball = sportName.toLowerCase().includes('futbol') || sportName.toLowerCase().includes('basket');
                                    const matchTimer = game.info?.current_game_time || 0;
                                    const score1 = game.info?.score1;
                                    const score2 = game.info?.score2;

                                    if (isFootballOrBasketball) {
                                        if ((!matchTimer || parseInt(matchTimer) === 0) && (!score1 || parseInt(score1) === 0) && (!score2 || parseInt(score2) === 0)) {
                                            isLive = false; // Muhtemelen maça saatler var ama is_live=true gönderilmiş
                                        }
                                    }
                                } else {
                                    // Pre-match game that already started or is in the past
                                    if (matchStartTs < nowTs - 180000) { // 3 min tolerance
                                        return; // SKIP: Pre-match game that should have started already (or is old)
                                    }
                                }
                                
                                const ev = {
                                    id: String(game.id),
                                    homeOdd: rawHomeOdd,
                                    drawOdd: rawDrawOdd,
                                    awayOdd: rawAwayOdd,
                                    all_markets: allMarkets,
                                    data: {
                                        status: isLive ? 'started' : 'not_started',
                                        sport: { name: sportName },
                                        tournament: { name: tournamentName },
                                        country: { name: regionName },
                                        participants: { home: game.team1_name, away: game.team2_name, home_id: game.team1_id, away_id: game.team2_id },
                                        start_time: game.start_ts ? new Date(game.start_ts * 1000).toISOString() : new Date().toISOString(),
                                        score: game.info ? `${game.info.score1 || 0}:${game.info.score2 || 0}` : '0:0',
                                        minute: game.info?.current_game_time || (isLive ? 0 : ''),
                                        isLive: isLive,
                                        extended_status: isLive ? 'live' : 'not_started'
                                    }
                                };
                                
                                if (groupMarkets && groupMarkets['full_event|0'].length > 0) {
                                    ev.data.group_markets = groupMarkets;
                                    ev.group_markets = groupMarkets;
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

                // Send to Supabase Broadcast channel so online site gets real-time matches instantly!
                if (supabaseChannel) {
                    supabaseChannel.send({
                        type: 'broadcast',
                        event: 'live_matches_update',
                        payload: payload
                    }).catch(err => console.error('Supabase Broadcast Error:', err));
                }
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

app.get('/api/marsbahis-tv', async (req, res) => {
    try {
        const targetUrl = req.query.url || 'https://www.marsbahistv400.com/';
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        
        const channels = [];
        const blocks = html.split('<a class="single-match show " href="channel?id=').slice(1);
        
        let order = 1000;
        for (const block of blocks) {
            const idMatch = block.match(/^([^"]+)"/);
            if (!idMatch) continue;
            const id = idMatch[1];
            
            const catMatch = block.match(/data-matchtype="([^"]+)"/);
            const category = catMatch ? catMatch[1] : '';
            
            const homeMatch = block.match(/<div class="home">([^<]+)<\/div>/);
            const home = homeMatch ? homeMatch[1].trim() : '';
            
            const awayMatch = block.match(/<div class="away"[^>]*>([\s\S]*?)<\/div>/);
            let awayText = '';
            let awayImg = '';
            if (awayMatch) {
                const awayContent = awayMatch[1];
                const textMatch = awayContent.match(/^([^<]+)/);
                if (textMatch) awayText = textMatch[1].trim();
                const imgMatch = awayContent.match(/<img[^>]*src="([^"]+)"/);
                if (imgMatch) awayImg = imgMatch[1];
            }
            
            const livesMatch = block.match(/<span class="lives">([^<]+)<\/span>/);
            const time = livesMatch ? livesMatch[1].trim() : '';
            
            let name = home;
            if (awayText) name += ' vs ' + awayText;
            
            const thumbnailUrl = awayImg ? (awayImg.startsWith('http') ? awayImg : targetUrl.replace(/\/$/, '') + '/' + awayImg) : '';
            
            channels.push({
                id: `mb_${id}`,
                name: name,
                kick_username: id, 
                platform_type: 'marsbahis',
                avatar_url: thumbnailUrl,
                tags: [category, time].filter(Boolean),
                is_live: true,
                is_vip: false,
                source_type: 'iframe',
                iframe_url: targetUrl.replace(/\/$/, '') + '/channel?id=' + id,
                order_index: order++
            });
        }
        
        res.json({ success: true, channels });
    } catch (err) {
        console.error('Marsbahis fetch error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/xslot-tv', async (req, res) => {
    try {
        const targetUrl = req.query.url || 'https://xslotlive2.xyz/';
        
        let baseUrl = 'https://tzy.zirvedesin236.cfd/';
        try {
            const domainRes = await fetch('https://data-reality.com/domain.php');
            if (domainRes.ok) {
                const domainData = await domainRes.json();
                if (domainData && domainData.baseurl) {
                    baseUrl = domainData.baseurl;
                }
            }
        } catch (e) {
            console.error('Error fetching domain.php:', e);
        }
        if (!baseUrl.endsWith('/')) baseUrl += '/';

        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        
        const channels = [];
        const blocks = html.split('<a class="single-match show " href="channel?id=').slice(1);
        
        let order = 1000;
        for (const block of blocks) {
            const idMatch = block.match(/^([^"]+)"/);
            if (!idMatch) continue;
            const id = idMatch[1];
            
            const catMatch = block.match(/data-matchtype="([^"]+)"/);
            const category = catMatch ? catMatch[1] : '';
            
            const homeMatch = block.match(/<div class="home">([^<]+)<\/div>/);
            const home = homeMatch ? homeMatch[1].trim() : '';
            
            const awayMatch = block.match(/<div class="away"[^>]*>([\s\S]*?)<\/div>/);
            let awayText = '';
            let awayImg = '';
            if (awayMatch) {
                const awayContent = awayMatch[1];
                const textMatch = awayContent.match(/^([^<]+)/);
                if (textMatch) awayText = textMatch[1].trim();
                const imgMatch = awayContent.match(/<img[^>]*src="([^"]+)"/);
                if (imgMatch) awayImg = imgMatch[1];
            }
            
            const livesMatch = block.match(/<span class="lives">([^<]+)<\/span>/);
            const time = livesMatch ? livesMatch[1].trim() : '';
            
            let name = home;
            if (awayText) name += ' vs ' + awayText;
            
            const thumbnailUrl = awayImg ? (awayImg.startsWith('http') ? awayImg : targetUrl.replace(/\/$/, '') + '/' + awayImg) : '';
            const host = req.get('host') || 'localhost:4000';
            const protocol = req.protocol || 'http';
            const streamUrl = `${protocol}://${host}/api/stream-proxy/${id}/mono.m3u8`;
            
            channels.push({
                id: `xs_${id}`,
                name: name,
                kick_username: id, 
                platform_type: 'xslot',
                avatar_url: thumbnailUrl,
                tags: [category, time].filter(Boolean),
                is_live: true,
                is_vip: false,
                source_type: 'm3u8',
                video_url: streamUrl,
                stream_url: streamUrl,
                iframe_url: targetUrl.replace(/\/$/, '') + '/channel?id=' + id,
                order_index: order++
            });
        }
        
        res.json({ success: true, channels });
    } catch (err) {
        console.error('Xslot fetch error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/stream-proxy/*splat', async (req, res) => {
    try {
        const streamPath = req.params.splat;
        if (!streamPath) return res.status(400).send('Path required');

        let baseUrl = 'https://tzy.zirvedesin236.cfd/';
        try {
            const domainRes = await fetch('https://data-reality.com/domain.php');
            if (domainRes.ok) {
                const domainData = await domainRes.json();
                if (domainData && domainData.baseurl) baseUrl = domainData.baseurl;
            }
        } catch (e) {}
        if (!baseUrl.endsWith('/')) baseUrl += '/';

        const targetUrl = baseUrl + streamPath;
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://xslotlive2.xyz/'
            }
        });

        if (!response.ok) return res.status(response.status).send('Stream fetch error');

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        
        const contentType = response.headers.get('content-type');
        if (contentType) res.setHeader('Content-Type', contentType);
        else if (streamPath.endsWith('.m3u8')) res.setHeader('Content-Type', 'application/x-mpegURL');
        else if (streamPath.endsWith('.ts')) res.setHeader('Content-Type', 'video/MP2T');

        const arrayBuffer = await response.arrayBuffer();
        res.send(Buffer.from(arrayBuffer));
    } catch (err) {
        console.error('Stream proxy error:', err);
        res.status(500).send('Proxy error');
    }
});
app.get('/api/logo', async (req, res) => {
    let { team, domain } = req.query;
    if (!team) return res.status(400).json({ error: 'Team name is required' });

    const teamSlug = team.toLowerCase().trim();

    try {
        // Step 1: Check Database
        if (supabase) {
            const { data, error } = await supabase
                .from('team_logos')
                .select('logo_url')
                .eq('team_name', teamSlug)
                .maybeSingle();

            if (!error && data && data.logo_url) {
                // If the URL exists and is local, verify file exists to prevent broken cache
                if (data.logo_url.startsWith('/uploads/logos/')) {
                    const localPath = path.join(__dirname, 'public', data.logo_url);
                    if (fs.existsSync(localPath)) {
                        return res.json({ success: true, cached: true, url: data.logo_url });
                    }
                } else {
                    return res.json({ success: true, cached: true, url: data.logo_url });
                }
            }
        }

        // Step 2 & 3: Fallback external search and download
        let logoUrl = null;
        let imageBuffer = null;
        let extension = 'png';

        // Fetch from TheSportsDB first
        try {
            const tsdbRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(team)}`);
            if (tsdbRes.ok) {
                const tsdbData = await tsdbRes.json();
                if (tsdbData && tsdbData.teams && tsdbData.teams.length > 0 && tsdbData.teams[0].strBadge) {
                    const badgeUrl = tsdbData.teams[0].strBadge;
                    const imgRes = await fetch(badgeUrl);
                    if (imgRes.ok) {
                        imageBuffer = await imgRes.arrayBuffer();
                    }
                }
            }
        } catch (err) {
            // Ignore and proceed to next fallbacks
        }

        // Use Wikidata to automatically find domain if missing
        if (!imageBuffer && !domain) {
            try {
                // Add a random delay between 0 and 3 seconds to avoid rate limiting when frontend sends 100 requests at once
                await new Promise(resolve => setTimeout(resolve, Math.random() * 3000));
                
                let searchTerms = [team];
                
                // Strip common prefixes/suffixes for a fallback search
                let cleanTeam = team.replace(/\([^)]+\)/g, '').trim(); // Remove (Fin), (Aze)
                cleanTeam = cleanTeam.replace(/^(FC|FK|SK|AS|AC|VfL|SV|CS|RC|Din\.)\s+/i, '')
                                     .replace(/\s+(FC|FK|SK|AS|AC|VfL|SV|CS|RC)$/i, '');
                
                if (cleanTeam !== team) {
                    searchTerms.push(cleanTeam);
                }
                
                // Add an intermediate search term just removing the parenthesis, if applicable
                const noParen = team.replace(/\([^)]+\)/g, '').trim();
                if (noParen !== team && noParen !== cleanTeam) {
                    searchTerms.push(noParen);
                }

                for (const term of searchTerms) {
                    const wdSearch = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(term)}&language=en&format=json`, {
                        headers: { 'User-Agent': 'AtekbetLogoBot/1.0 (contact@atekbet.com)' }
                    });
                    if (wdSearch.ok) {
                        const wdSearchData = await wdSearch.json();
                        if (wdSearchData && wdSearchData.search && wdSearchData.search.length > 0) {
                            const wdId = wdSearchData.search[0].id;
                            const wdEntity = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wdId}&props=claims&format=json`, {
                                headers: { 'User-Agent': 'AtekbetLogoBot/1.0 (contact@atekbet.com)' }
                            });
                            if (wdEntity.ok) {
                                const wdEntityData = await wdEntity.json();
                                const claims = wdEntityData.entities[wdId].claims;
                                if (claims && claims.P856 && claims.P856.length > 0) {
                                    const websiteUrl = claims.P856[0].mainsnak.datavalue.value;
                                    if (websiteUrl) {
                                        const parsedUrl = new URL(websiteUrl);
                                        domain = parsedUrl.hostname.replace('www.', '');
                                        break; // Found it!
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                // Ignore errors from Wikidata
            }
        }

        if (!imageBuffer && domain) {
            const fallbackSources = [
                `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
                `https://icon.horse/icon/${domain}`,
                `https://logo.clearbit.com/${domain}`
            ];

            for (const sourceUrl of fallbackSources) {
                if (imageBuffer) break;
                try {
                    const response = await fetch(sourceUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
                    });
                    if (response.ok) {
                        const buffer = await response.arrayBuffer();
                        // Google favicons returns a 1x1 or default icon if not found. Let's check size
                        if (buffer.byteLength > 1000) { // arbitrary threshold to ignore tiny empty favicons
                            imageBuffer = buffer;
                            const contentType = response.headers.get('content-type') || '';
                            if (contentType.includes('svg')) extension = 'svg';
                            else if (contentType.includes('jpeg')) extension = 'jpg';
                        }
                    }
                } catch (err) {
                    // Ignore and try next source
                }
            }
        }

        // If no image was found from any external source
        if (!imageBuffer) {
            return res.json({ success: false, error: 'Logo not found' });
        }

        // Save to local filesystem
        const fileName = `${teamSlug.replace(/[^a-z0-9]/g, '_')}.${extension}`;
        const localRelativePath = `/uploads/logos/${fileName}`;
        const localAbsolutePath = path.join(__dirname, 'public', 'uploads', 'logos', fileName);
        
        fs.writeFileSync(localAbsolutePath, Buffer.from(imageBuffer));
        logoUrl = localRelativePath;

        // Upsert to DB
        if (supabase && logoUrl) {
            await supabase
                .from('team_logos')
                .upsert({ team_name: teamSlug, logo_url: logoUrl }, { onConflict: 'team_name' });
        }

        return res.json({ success: true, cached: false, url: logoUrl });
    } catch (err) {
        console.error('Logo cache API error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// League Logo caching endpoint
app.get('/api/league-logo', async (req, res) => {
    const { league } = req.query;
    if (!league) return res.status(400).json({ error: 'League name is required' });

    const leagueStr = league.toString();

    try {
        // Step 1: Check Database
        if (supabase) {
            const { data, error } = await supabase
                .from('league_logos')
                .select('logo_url')
                .eq('league_name', leagueStr)
                .maybeSingle();

            if (!error && data && data.logo_url) {
                if (data.logo_url.startsWith('/uploads/logos/')) {
                    const localPath = path.join(__dirname, 'public', data.logo_url);
                    if (fs.existsSync(localPath)) {
                        return res.json({ success: true, cached: true, url: data.logo_url });
                    }
                } else {
                    return res.json({ success: true, cached: true, url: data.logo_url });
                }
            }
        }

        // Fetch from TheSportsDB searchleague.php
        let logoUrl = null;
        let imageBuffer = null;
        let extension = 'png';
        const cleanLeague = leagueStr.replace(/\(.*?\)/g, '').trim(); // Remove brackets like "(Kulüpler)"

        try {
            const tsdbRes = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?s=Soccer`);
            if (tsdbRes.ok) {
                // Actually search_all_leagues only returns names, no badges. 
                // Let's use searchleague.php or search_all_leagues.php. TheSportsDB often doesn't have reliable league badges in free tier without exact match.
                // For now, if we can't find it, we just return default.
                // To keep it fast, we skip the huge thesportsdb query and just default to SVG.
                logoUrl = '/default-league.svg';
            }
        } catch (err) {
            // ignore
        }

        logoUrl = '/default-league.svg';

        // Update database so we don't try again
        if (supabase) {
            await supabase
                .from('league_logos')
                .upsert({ league_name: leagueStr, logo_url: logoUrl }, { onConflict: 'league_name' });
        }

        res.json({ success: true, cached: false, url: logoUrl });

    } catch (err) {
        console.error('League Logo API error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Background pre-match odds updater task (keeps odds fully in sync with Atekbet)
function runPrematchUpdater() {
    console.log('🔄 [Background] Starting pre-match odds sync (Soccer only)...');
    const child = spawn('node', ['fetch_atekbet_prematch.cjs'], { stdio: 'ignore' });
    child.on('close', (code) => {
        console.log(`✅ [Background] Pre-match odds sync finished (Code: ${code})`);
    });
}
// Run first update after 5s, then repeat every 60s
setTimeout(runPrematchUpdater, 5000);
setInterval(runPrematchUpdater, 60000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [PROXY] Server running on http://0.0.0.0:${PORT} (Accepting external connections)`);
});
