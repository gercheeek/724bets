const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/prelive_matches.json', 'utf8'));

let count = 0;
for (const ev of data) {
  const rawGroupMarkets = ev.data.group_markets || ev.group_markets;
  const rawMarkets = rawGroupMarkets?.['full_event|0'] || rawGroupMarkets?.['game_full_event|0'] || rawGroupMarkets?.['set|1'];
  const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
  
  let homeOdd = '-';
  let drawOdd = '-';
  let awayOdd = '-';

  for (const market of markets) {
     const is1x2 = market.includes('|12|') || market.includes('|1x2|') || market.includes('|match_winner|');
     if (is1x2 && (market.includes('~home~') || market.includes('~away~'))) {
        const parts = market.split('|');
        const selectionsPart = parts.find(p => p.includes('~home~') || p.includes('~away~'));
        
        if (selectionsPart) {
           const selections = selectionsPart.split('!');
           selections.forEach(sel => {
              const sParts = sel.split('~');
              if (sParts.length > 2) {
                 const type = sParts[1].toLowerCase();
                 const odd = parseFloat(sParts[2]);
                 if (!isNaN(odd)) {
                     const oddStr = odd.toFixed(2);
                     if (type === 'home' || type === '1') { homeOdd = oddStr; }
                     if (type === 'draw' || type === 'x') { drawOdd = oddStr; }
                     if (type === 'away' || type === '2') { awayOdd = oddStr; }
                 }
              }
           });
           if (homeOdd !== '-' || awayOdd !== '-') {
              break;
           }
         }
      }
  }

  if (homeOdd !== '-' || awayOdd !== '-') {
    count++;
  }
}
console.log('Matches with valid odds:', count, 'out of', data.length);
