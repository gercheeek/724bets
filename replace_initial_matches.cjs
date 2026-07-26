const fs = require('fs');

let content = fs.readFileSync('components/sports/GercekView.tsx', 'utf8');

const startIndex = content.indexOf('const INITIAL_MATCHES: Match[] = [');
const endIndex = content.indexOf('];\n\n\nconst FEATURED_DUMMY');

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find boundaries");
    process.exit(1);
}

const leagues = [
    'Türkiye › Trendyol Süper Lig',
    'İngiltere › Premier League',
    'İspanya › La Liga',
    'Almanya › Bundesliga',
    'İtalya › Serie A',
    'Fransa › Ligue 1',
    'Şampiyonlar Ligi › Son 16',
    'Avrupa Ligi › Gruplar'
];
const teams = [
    'Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor', 
    'Arsenal', 'Chelsea', 'Man City', 'Liverpool',
    'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla',
    'Bayern Munich', 'B. Dortmund', 'RB Leipzig', 'B. Leverkusen',
    'Juventus', 'AC Milan', 'Inter', 'Napoli',
    'PSG', 'Marseille', 'Lyon', 'Lille'
];

let generatedMatches = 'const INITIAL_MATCHES: Match[] = [\n';
for (let i = 0; i < 15; i++) {
    const league = leagues[i % leagues.length];
    const team1 = teams[i % teams.length];
    const team2 = teams[(i + 13) % teams.length];
    const score1 = Math.floor(Math.random() * 4);
    const score2 = Math.floor(Math.random() * 4);
    const minute = Math.floor(Math.random() * 90);
    
    const odd1 = (Math.random() * 2 + 1.1).toFixed(2);
    const oddX = (Math.random() * 2 + 2.5).toFixed(2);
    const odd2 = (Math.random() * 4 + 1.5).toFixed(2);
    
    generatedMatches += `  {
    id: 'c_m${i}',
    sport: 'futbol',
    league: '${league}',
    minute: "${minute}'",
    period: 'Canlı',
    hasStream: true,
    hasStats: true,
    team1: { name: '${team1}', score: ${score1}, logo: '⚽', color: '#ef4444' },
    team2: { name: '${team2}', score: ${score2}, logo: '⚽', color: '#3b82f6' },
    odds: { home: '${odd1}', draw: '${oddX}', away: '${odd2}' },
    totalMarkets: ${Math.floor(Math.random() * 50) + 20},
    isFavorite: false
  }${i === 14 ? '' : ','}\n`;
}

generatedMatches += ']';

content = content.slice(0, startIndex) + generatedMatches + content.slice(endIndex + 1);

fs.writeFileSync('components/sports/GercekView.tsx', content);
console.log("INITIAL_MATCHES replaced.");
