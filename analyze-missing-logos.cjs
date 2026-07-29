const fs = require('fs');

const normalize = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/\s+(fc|afc|sc|asd|cf|fk|nk|hnk|us|as|sk|ik)$/i, '')
    .replace(/^(fc|afc|sc|asd|cf|fk|nk|hnk|us|as|sk|ik|cd|sd)\s+/i, '')
    .replace(/[^\w\sğüşıöç]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const getTeams = (filename) => {
  if (!fs.existsSync(filename)) return [];
  const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  const teams = new Set();
  data.forEach(match => {
    if (match.data && match.data.participants) {
      if (match.data.participants.home) teams.add(match.data.participants.home);
      if (match.data.participants.away) teams.add(match.data.participants.away);
    }
    if (match.home) teams.add(match.home);
    if (match.away) teams.add(match.away);
  });
  return Array.from(teams);
};

const allTeams = [...new Set([...getTeams('./public/prelive_matches.json'), ...getTeams('./public/live_matches.json')])];

const missing = [];
allTeams.forEach(team => {
  const norm = normalize(team);
  if (!fs.existsSync(`./public/assets/logos/${norm}.png`)) {
    missing.push({ team, norm });
  }
});

console.log(`Total unique teams in current matches: ${allTeams.length}`);
console.log(`Teams missing logos: ${missing.length}`);
console.log('Top 20 missing teams:');
console.log(missing.slice(0, 20).map(m => m.team).join(', '));
fs.writeFileSync('./missing-teams.json', JSON.stringify(missing, null, 2));
