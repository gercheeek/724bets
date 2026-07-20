const fs = require('fs');
const path = require('path');

const newMatches = [
  { "date": "21.08.2026", "time": "22:00", "home": "Arsenal", "away": "Coventry City", "odds": {"1": 1.17, "X": 8.10, "2": 19.50}, "more": "+ 151" },
  { "date": "22.08.2026", "time": "14:30", "home": "Hull City", "away": "Manchester United", "odds": {"1": 7.30, "X": 4.55, "2": 1.48}, "more": "+ 163" },
  { "date": "22.08.2026", "time": "17:00", "home": "Nottingham Forest", "away": "Leeds", "odds": {"1": 2.28, "X": 3.44, "2": 3.30}, "more": "+ 166" },
  { "date": "22.08.2026", "time": "17:00", "home": "Ipswich", "away": "Sunderland", "odds": {"1": 2.79, "X": 3.38, "2": 2.65}, "more": "+ 168" },
  { "date": "22.08.2026", "time": "17:00", "home": "Everton", "away": "Crystal Palace", "odds": {"1": 2.18, "X": 3.48, "2": 3.50}, "more": "+ 166" },
  { "date": "22.08.2026", "time": "19:30", "home": "Brentford", "away": "Tottenham", "odds": {"1": 2.31, "X": 3.86, "2": 2.94}, "more": "+ 181" },
  { "date": "23.08.2026", "time": "16:00", "home": "Brighton", "away": "Aston Villa", "odds": {"1": 2.30, "X": 3.70, "2": 3.06}, "more": "+ 182" },
  { "date": "23.08.2026", "time": "16:00", "home": "Manchester City", "away": "Bournemouth", "odds": {"1": 1.47, "X": 5.15, "2": 6.35}, "more": "+ 174" },
  { "date": "23.08.2026", "time": "18:30", "home": "Newcastle", "away": "Liverpool", "odds": {"1": 3.02, "X": 3.90, "2": 2.25}, "more": "+ 179" },
  { "date": "24.08.2026", "time": "22:00", "home": "Fulham", "away": "Chelsea", "odds": {"1": 3.08, "X": 3.72, "2": 2.28}, "more": "+ 177" }
];

const filePath = path.join(__dirname, 'public', 'prelive_matches.json');

if (!fs.existsSync(filePath)) {
  console.error("prelive_matches.json not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Filter out existing Premier League matches
const filteredData = data.filter(item => {
  return item.data.tournament.name !== 'Premier League';
});

// Format new matches
const formatted = newMatches.map((m, index) => {
  const [day, month, year] = m.date.split('.');
  const [hours, minutes] = m.time.split(':');
  // Create Date object in local time
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
  
  return {
    id: `scraped_pre_pl_user_${index}`,
    data: {
      status: "not_started",
      sport: {
        name: "Soccer"
      },
      tournament: {
        name: "Premier League"
      },
      country: {
        name: "England"
      },
      participants: {
        home: m.home,
        away: m.away
      },
      start_time: date.toISOString(),
      group_markets: {
        "full_event|0": [
          `|1x2|~home~${m.odds['1'].toFixed(2)}!~draw~${m.odds['X'].toFixed(2)}!~away~${m.odds['2'].toFixed(2)}`
        ]
      }
    }
  };
});

const finalData = [...filteredData, ...formatted];

fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2), 'utf8');
console.log(`Successfully added ${formatted.length} Premier League matches to prelive_matches.json`);
