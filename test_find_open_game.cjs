const crypto = require('crypto');
const mgcapi = require('./mgcapi.cjs');

const APP_KEY = '9f5f538a-121c-4bf1-846d-9b6c048a263f';
const APP_ID = 'cc49d408-decf-48c3-a75e-9ae61bc1cb59';
const HOST = 'https://mgcbot.mgcapi.com';

async function testAll() {
  const games = await mgcapi.getAllGames();
  console.log(`Total games available: ${games.length}`);
  
  // Pick sample games from different index ranges
  const samples = [
    games[0],
    games[5],
    games[10],
    games[50],
    games[100],
    games[200],
    games[300],
    games[500],
    games[800],
    games[1000],
    games[1100],
    games[1200]
  ].filter(Boolean);

  for (const g of samples) {
    const game_id = g.id || g.game_id;
    const request_time = Date.now().toString();
    const player_id = '1';
    const player_token = Buffer.from(JSON.stringify({ player_id: 1 })).toString('base64');
    const exit = 'https://www.724bets.net';
    const currency = 'TRY';
    const language = 'tr';
    const shop_id = '1';

    const str = `${encodeURIComponent(exit)}${game_id}${player_id}${shop_id}${player_token}${APP_ID}${language}${request_time}${currency}`;
    const sign = crypto.createHmac('md5', APP_KEY).update(str).digest('hex');

    const qs = new URLSearchParams({
      exit,
      game_id: game_id.toString(),
      player_id,
      shop_id,
      player_token,
      app_id: APP_ID,
      language,
      request_time,
      currency,
      sign
    }).toString();

    try {
      const res = await fetch(`${HOST}/api/v1/playGame?${qs}`);
      const data = await res.json();
      console.log(`Game [${game_id}] ${g.name}: result=${data.result}, url=${data.url ? data.url.substring(0, 40) + '...' : 'none'}, desc=${data.err_desc}`);
    } catch (e) {
      console.log(`Game [${game_id}] ${g.name}: fetch failed (${e.message})`);
    }
  }
}
testAll();
