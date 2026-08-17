const fs = require('fs');

let content = fs.readFileSync('components/Spor724View.tsx', 'utf8');

// 1. Add formatLeagueName function
const formatLeagueStr = `
const formatLeagueName = (name: string, country: string) => {
  if (!name) return name;
  let cleaned = name;
  const parts = cleaned.split(' - ').map(p => p.trim());
  if (parts.length > 1 && (parts[0] === parts[1] || parts[0] === country)) {
    parts.shift();
  }
  // Remove "(Simulated Reality)" or other long suffixes if needed
  let finalName = parts.join(' - ');
  if (finalName.includes('Simulated')) finalName = 'SRL - ' + finalName.replace(' (Simulated Reality League)', '').replace('Simulated Reality', '');
  return finalName;
};
`;

if (!content.includes('const formatLeagueName')) {
  content = content.replace('const getCountryFlag = (country: string) => {', formatLeagueStr + '\nconst getCountryFlag = (country: string) => {');
}

// 2. Use formatLeagueName in parseMatchData
content = content.replace(
  "const league = countryName ? `${countryName} - ${tournamentName}` : tournamentName;",
  "const rawLeague = countryName ? `${countryName} - ${tournamentName}` : tournamentName;\n  const league = formatLeagueName(rawLeague, countryName);"
);

// 3. Improve getMatchPriorityScore check to aggressively push women/youth down
content = content.replace(
  "const scoreB = getMatchPriorityScore(b.home, b.away);",
  `const scoreB = getMatchPriorityScore(b.home, b.away);
          
          // Demote women/youth even if they are in a good league
          const isLowerA = a.home.includes('Kadınlar') || a.home.includes('U19') || a.league.includes('Kadınlar');
          const isLowerB = b.home.includes('Kadınlar') || b.home.includes('U19') || b.league.includes('Kadınlar');
          
          let finalScoreA = scoreA;
          let finalScoreB = scoreB;
          
          if (isLowerA && scoreA === 0) finalScoreA -= 20;
          if (isLowerB && scoreB === 0) finalScoreB -= 20;
          
          if (finalScoreA !== finalScoreB) return finalScoreB - finalScoreA;`
);

// 4. Split generic leagues in groupedByLeague so Elite friendlies are separated from Amateur friendlies
content = content.replace(
  `grouped[match.league].push(match);`,
  `let groupKey = match.league;
      const isElite = getMatchPriorityScore(match.home, match.away) > 0;
      const isWomen = match.home.includes('Kadınlar') || match.league.includes('Kadınlar');
      
      // Break out massive generic leagues
      if (groupKey.includes('Kulüp Hazırlık') || groupKey.includes('Club Friendly')) {
         if (isElite) groupKey = '⭐ Öne Çıkan Hazırlık Maçları';
         else if (isWomen) groupKey = 'Kulüp Hazırlık Maçları (Kadınlar)';
         else groupKey = 'Diğer Hazırlık Maçları';
      }
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(match);`
);

fs.writeFileSync('components/Spor724View.tsx', content);
console.log('Fixed Spor724View.tsx');
