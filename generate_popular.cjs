const fs = require('fs');

const FALLBACK_TEAMS = {
    "Süper Lig": [["Galatasaray", "Fenerbahçe"], ["Beşiktaş", "Trabzonspor"], ["Başakşehir", "Adana Demirspor"], ["Kasımpaşa", "Konyaspor"], ["Sivasspor", "Antalyaspor"]],
    "Premier League": [["Arsenal", "Chelsea"], ["Man City", "Liverpool"], ["Man United", "Tottenham"], ["Newcastle", "Aston Villa"], ["Brighton", "West Ham"]],
    "La Liga": [["Real Madrid", "Barcelona"], ["Atletico Madrid", "Sevilla"], ["Valencia", "Villarreal"], ["Real Sociedad", "Athletic Bilbao"], ["Real Betis", "Celta Vigo"]],
    "Bundesliga": [["Bayern Munich", "Dortmund"], ["Bayer Leverkusen", "RB Leipzig"], ["Stuttgart", "Eintracht Frankfurt"], ["Wolfsburg", "Werder Bremen"], ["Borussia M'gladbach", "Freiburg"]],
    "Serie A": [["Inter", "AC Milan"], ["Juventus", "AS Roma"], ["Napoli", "Lazio"], ["Atalanta", "Fiorentina"], ["Torino", "Bologna"]],
    "Ligue 1": [["PSG", "Marseille"], ["Monaco", "Lyon"], ["Lille", "Lens"], ["Rennes", "Nice"], ["Montpellier", "Nantes"]],
    "NBA": [["Lakers", "Warriors"], ["Celtics", "Heat"], ["Nuggets", "Suns"], ["Bucks", "76ers"], ["Mavericks", "Clippers"]]
};

const COUNTRIES = {
    "Süper Lig": "Turkey",
    "Premier League": "England",
    "La Liga": "Spain",
    "Bundesliga": "Germany",
    "Serie A": "Italy",
    "Ligue 1": "France",
    "NBA": "USA"
};

const generated = [];
let idCounter = 9000;

Object.entries(FALLBACK_TEAMS).forEach(([league, matches]) => {
    matches.forEach(([home, away]) => {
        idCounter++;
        const hOdd = (Math.random() * 2 + 1.2).toFixed(2);
        const dOdd = (Math.random() * 2 + 2.5).toFixed(2);
        const aOdd = (Math.random() * 3 + 1.5).toFixed(2);
        
        generated.push(`  {
    id: 'pop_${idCounter}',
    data: {
      status: 'not_started',
      sport: { name: '${league === 'NBA' ? 'Basketball' : 'Soccer'}' },
      tournament: { name: '${league}' },
      country: { name: '${COUNTRIES[league]}' },
      participants: { home: '${home}', away: '${away}' },
      start_time: '2026-08-25T19:00:00.000Z',
      group_markets: {
        'full_event|0': ['|1x2|~home~${hOdd}!~draw~${dOdd}!~away~${aOdd}']
      }
    }
  }`);
    });
});

fs.writeFileSync('popular_mock.ts', `export const POPULAR_MOCK_EVENTS = [\n${generated.join(',\n')}\n];\n`);
console.log("Done");
