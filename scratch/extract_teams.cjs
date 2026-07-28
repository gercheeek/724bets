const fs = require('fs');
const path = require('path');

const extractTeams = (file) => {
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const teams = new Set();
  data.forEach(ev => {
    if (ev && ev.data && ev.data.participants) {
      if (ev.data.participants.home) teams.add(ev.data.participants.home);
      if (ev.data.participants.away) teams.add(ev.data.participants.away);
    }
  });
  return Array.from(teams);
};

const liveTeams = extractTeams(path.join(__dirname, '../public/live_matches.json'));
const preliveTeams = extractTeams(path.join(__dirname, '../public/prelive_matches.json'));
const allTeams = Array.from(new Set([...liveTeams, ...preliveTeams]));
console.log(`Found ${allTeams.length} unique teams.`);
fs.writeFileSync(path.join(__dirname, 'site_teams.json'), JSON.stringify(allTeams, null, 2));
