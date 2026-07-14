const fs = require('fs');
const data = JSON.parse(fs.readFileSync('dump.json'));

data.forEach(ev => {
  const markets = ev.data?.group_markets?.["full_event|0"] || ev.group_markets?.["full_event|0"] || [];
  const targetMarket = markets.find((m) => m.includes('|1x2|') || m.includes('|12|') || m.includes('|match_winner|'));
  if (targetMarket) {
    console.log(ev.data.name);
    const parts = targetMarket.split('|');
    const selectionsPart = parts.find((p) => p.includes('~home~') || p.includes('~away~'));
    if (selectionsPart) {
      const selections = selectionsPart.split('!');
      selections.forEach(sel => {
        const selParts = sel.split('~');
        console.log(`  ${selParts[1]}: ${selParts[2]}`);
      });
    }
  }
});
