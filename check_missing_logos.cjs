const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const logosDir = path.join(publicDir, 'assets', 'logos');

const normalize = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ fc$/i, '')
    .replace(/ afc$/i, '')
    .replace(/^fc /i, '')
    .replace(/[^\w\sğüşıöç]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const jsonFiles = [
  'prelive_matches.json',
  'live_matches.json',
  'maclar.json',
  'sekabet_prelive_matches.json'
];

const teamNames = new Set();

jsonFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for common BetConstruct team name patterns
    // e.g. "home": "Real Madrid  "
    const regex = /"(?:home|away)"\s*:\s*"([^"]+)"/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      teamNames.add(match[1].trim());
    }
  }
});

const missingTeams = [];
const foundTeams = [];

for (const team of teamNames) {
  const norm = normalize(team);
  if (!norm) continue;
  
  const pngPath = path.join(logosDir, `${norm}.png`);
  if (fs.existsSync(pngPath)) {
    foundTeams.push(team);
  } else {
    missingTeams.push(team);
  }
}

console.log("=== LOGOSU OLMAYAN TAKIMLAR ===");
missingTeams.sort().forEach(t => console.log(t));

console.log(`\nÖZET: ${foundTeams.length} takımın logosu var, ${missingTeams.length} takımın logosu eksik!`);
