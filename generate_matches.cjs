const fs = require('fs');
const path = require('path');

const groupedMatchesData = [
  {
    leagueName: "İsveç - Allsvenskan",
    matches: [
      { id: 101, date: "20.07.2026", time: "20:00", homeTeam: "Orgryte Goteborg", awayTeam: "Djurgarden", odds: { "1": 7.70, "X": 5.25, "2": 1.33 }, moreOdds: "+ 238" },
      { id: 102, date: "20.07.2026", time: "20:00", homeTeam: "Kalmar", awayTeam: "Malmo", odds: { "1": 2.56, "X": 3.58, "2": 2.49 }, moreOdds: "+ 245" }
    ]
  },
  {
    leagueName: "Bulgaristan - Premier Lig",
    matches: [
      { id: 103, date: "20.07.2026", time: "19:15", homeTeam: "Slavia Sofia", awayTeam: "CSKA Sofia", odds: { "1": 6.60, "X": 4.20, "2": 1.45 }, moreOdds: "+ 183" },
      { id: 104, date: "20.07.2026", time: "21:30", homeTeam: "Botev Plovdiv", awayTeam: "Lokomotiv Sofia", odds: { "1": 1.77, "X": 3.55, "2": 4.30 }, moreOdds: "+ 187" }
    ]
  },
  {
    leagueName: "Ekvador - Serie A",
    matches: [
      { id: 105, date: "20.07.2026", time: "22:00", homeTeam: "Mushuc Runa", awayTeam: "Orense", odds: { "1": 1.84, "X": 3.34, "2": 3.74 }, moreOdds: "+ 159" }
    ]
  },
  {
    leagueName: "Finlandiya - Veikkausliiga",
    matches: [
      { id: 106, date: "20.07.2026", time: "19:00", homeTeam: "Mariehamn", awayTeam: "Lahti", odds: { "1": 5.75, "X": 4.40, "2": 1.49 }, moreOdds: "+ 238" }
    ]
  },
  {
    leagueName: "Romanya - Romanya 1. Ligi",
    matches: [
      { id: 107, date: "20.07.2026", time: "18:30", homeTeam: "Corvinul", awayTeam: "Csikszereda Miercurea Ciuc", odds: { "1": 2.10, "X": 3.20, "2": 3.44 }, moreOdds: "+ 203" },
      { id: 108, date: "20.07.2026", time: "21:30", homeTeam: "Rapid Bucharest", awayTeam: "Sepsi", odds: { "1": 1.69, "X": 3.64, "2": 4.70 }, moreOdds: "+ 202" }
    ]
  },
  {
    leagueName: "İsveç - Superettan",
    matches: [
      { id: 109, date: "20.07.2026", time: "20:00", homeTeam: "Norrby", awayTeam: "Sundsvall", odds: { "1": 1.95, "X": 3.42, "2": 3.65 }, moreOdds: "+ 186" }
    ]
  },
  {
    leagueName: "İzlanda - Urvalsdeild",
    matches: [
      { id: 110, date: "20.07.2026", time: "22:15", homeTeam: "Keflavik IF", awayTeam: "IA Akranes", odds: { "1": 2.32, "X": 3.64, "2": 2.68 }, moreOdds: "+ 247" },
      { id: 111, date: "20.07.2026", time: "22:15", homeTeam: "FH Hafnarfjordur", awayTeam: "Breidablik", odds: { "1": 2.76, "X": 3.98, "2": 2.15 }, moreOdds: "+ 252" }
    ]
  },
  {
    leagueName: "Finlandiya - Ykkonen",
    matches: [
      { id: 112, date: "20.07.2026", time: "18:30", homeTeam: "KPV Kokkola", awayTeam: "Rovaniemi", odds: { "1": 9.20, "X": 5.70, "2": 1.21 }, moreOdds: "+ 181" }
    ]
  },
  {
    leagueName: "Letonya - Virsliga",
    matches: [
      { id: 113, date: "20.07.2026", time: "19:00", homeTeam: "Super Nova", awayTeam: "SC Grobina", odds: { "1": 2.51, "X": 2.97, "2": 2.65 }, moreOdds: "+ 149" }
    ]
  },
  {
    leagueName: "Rusya - 1. Lig",
    matches: [
      { id: 114, date: "20.07.2026", time: "19:30", homeTeam: "Rotor Volgograd", awayTeam: "SKA Khabarovsk", odds: { "1": 1.53, "X": 3.75, "2": 6.30 }, moreOdds: "+ 235" }
    ]
  },
  {
    leagueName: "Uluslararası (Kulüpler) - Hazırlık Maçları",
    matches: [
      { id: 115, date: "20.07.2026", time: "18:30", homeTeam: "Al-Sailiya SC", awayTeam: "Al Nasr", odds: { "1": 3.68, "X": 3.70, "2": 1.75 }, moreOdds: "+ 68" },
      { id: 116, date: "20.07.2026", time: "19:00", homeTeam: "Atus Velden", awayTeam: "Wolfsberger AC", odds: { "1": 16.50, "X": 11.25, "2": 1.04 }, moreOdds: "+ 56" },
      { id: 117, date: "20.07.2026", time: "19:00", homeTeam: "Epitsentr", awayTeam: "Al-Ula", odds: { "1": 1.56, "X": 4.20, "2": 5.20 }, moreOdds: "+ 132" },
      { id: 118, date: "20.07.2026", time: "19:30", homeTeam: "Biel", awayTeam: "Breitenrain", odds: { "1": 1.45, "X": 4.05, "2": 5.65 }, moreOdds: "+ 66" },
      { id: 119, date: "20.07.2026", time: "21:30", homeTeam: "Young Boys II", awayTeam: "FC Solothurn", odds: { "1": 1.73, "X": 4.15, "2": 3.42 }, moreOdds: "+ 68" },
      { id: 120, date: "20.07.2026", time: "21:45", homeTeam: "Redbridge", awayTeam: "Welwyn Garden City", odds: { "1": 1.80, "X": 3.55, "2": 3.40 }, moreOdds: "+ 102" },
      { id: 121, date: "20.07.2026", time: "22:15", homeTeam: "Sporting", awayTeam: "Strasbourg", odds: { "1": 1.65, "X": 4.10, "2": 4.50 }, moreOdds: "+ 202" }
    ]
  },
  {
    leagueName: "Bolivya - Profesyonel Ligi",
    matches: [
      { id: 122, date: "20.07.2026", time: "22:00", homeTeam: "SA Bulo Bulo", awayTeam: "Academia del Balompie", odds: { "1": 1.65, "X": 3.80, "2": 3.80 }, moreOdds: "+ 114" }
    ]
  },
  {
    leagueName: "Letonya - 1. Lig",
    matches: [
      { id: 123, date: "20.07.2026", time: "19:00", homeTeam: "Tukums 2000 II", awayTeam: "RFS II", odds: { "1": 2.40, "X": 3.50, "2": 2.35 }, moreOdds: "+ 102" }
    ]
  },
  {
    leagueName: "İzlanda - 1. Bölüm",
    matches: [
      { id: 124, date: "20.07.2026", time: "22:15", homeTeam: "HK Kopavogur", awayTeam: "Vestri", odds: { "1": 1.42, "X": 4.75, "2": 5.05 }, moreOdds: "+ 184" }
    ]
  },
  {
    leagueName: "Uruguay - Reserve League",
    matches: [
      { id: 125, date: "20.07.2026", time: "20:00", homeTeam: "Deportivo Maldonado Reserve", awayTeam: "Oriental Reserve", odds: { "1": 1.68, "X": 3.48, "2": 4.33 }, moreOdds: "+ 66" },
      { id: 126, date: "20.07.2026", time: "21:00", homeTeam: "CA Progreso Reserve", awayTeam: "River Plate Montevideo Reserve", odds: { "1": 2.21, "X": 3.20, "2": 2.88 }, moreOdds: "+ 65" },
      { id: 127, date: "20.07.2026", time: "21:00", homeTeam: "CA Penarol Reserve", awayTeam: "Racing Montevideo Reserve", odds: { "1": 2.13, "X": 3.13, "2": 3.10 }, moreOdds: "+ 66" },
      { id: 128, date: "20.07.2026", time: "21:00", homeTeam: "Colon FC Reserve", awayTeam: "Boston River Reserve", odds: { "1": 2.95, "X": 3.18, "2": 2.18 }, moreOdds: "+ 66" },
      { id: 129, date: "20.07.2026", time: "21:00", homeTeam: "La Luz Reserve", awayTeam: "Defensor Sporting Reserve", odds: { "1": 2.64, "X": 3.45, "2": 2.25 }, moreOdds: "+ 68" }
    ]
  },
  {
    leagueName: "Litvanya - Birinci Ligi",
    matches: [
      { id: 130, date: "20.07.2026", time: "18:45", homeTeam: "Suduva", awayTeam: "Hegelmann Litauen", odds: { "1": 1.62, "X": 3.30, "2": 5.25 }, moreOdds: "+ 125" }
    ]
  },
  {
    leagueName: "Paraguay - İkinci Lig",
    matches: [
      { id: 131, date: "20.07.2026", time: "23:00", homeTeam: "Tacuary", awayTeam: "Deportivo Capiata", odds: { "1": 2.60, "X": 2.95, "2": 2.45 }, moreOdds: "+ 101" }
    ]
  },
  {
    leagueName: "İzlanda - Bayanlar Birinci Ligi",
    matches: [
      { id: 132, date: "20.07.2026", time: "22:15", homeTeam: "Grindavik (w)", awayTeam: "Throttur Reykjavik (w)", odds: { "1": 3.10, "X": 3.40, "2": 1.95 }, moreOdds: "+ 102" }
    ]
  },
  {
    leagueName: "Peru - 1. Ligi",
    matches: [
      { id: 133, date: "20.07.2026", time: "19:00", homeTeam: "Pirata FC", awayTeam: "Deportivo San Martin", odds: { "1": 2.20, "X": 3.05, "2": 2.85 }, moreOdds: "+ 101" }
    ]
  },
  {
    leagueName: "Brezilya - Paulista Kupası, 3. Grup",
    matches: [
      { id: 134, date: "20.07.2026", time: "21:00", homeTeam: "Sao Caetano SP", awayTeam: "Sao Jose SP", odds: { "1": 6.25, "X": 3.65, "2": 1.45 }, moreOdds: "+ 98" }
    ]
  },
  {
    leagueName: "Brezilya - Copa do Brasil (Kadınlar)",
    matches: [
      { id: 135, date: "20.07.2026", time: "22:00", homeTeam: "Coritiba PR (w)", awayTeam: "SC Internacional RS (w)", odds: { "1": 7.60, "X": 5.15, "2": 1.27 }, moreOdds: "+ 65" }
    ]
  },
  {
    leagueName: "Arjantin - Primera Division (Kadınlar)",
    matches: [
      { id: 136, date: "20.07.2026", time: "21:00", homeTeam: "Union de Santa Fe (w)", awayTeam: "Newells Old Boys (w)", odds: { "1": 3.25, "X": 2.95, "2": 2.05 }, moreOdds: "+ 47" }
    ]
  },
  {
    leagueName: "Paraguay - Primera Division (Kadınlar)",
    matches: [
      { id: 137, date: "20.07.2026", time: "19:30", homeTeam: "Cerro Porteno (w)", awayTeam: "Sportivo San Lorenzo (w)", odds: { "1": 1.05, "X": 9.90, "2": 17.50 }, moreOdds: "+ 59" }
    ]
  }
];

const generateMatches = () => {
    const formatted = [];
    groupedMatchesData.forEach(league => {
        const parts = league.leagueName.split(' - ');
        const country = parts[0] || 'Uluslararası';
        const tournament = parts[1] || parts[0];

        league.matches.forEach(m => {
            // Parse date & time to ISO format (assuming UTC+3, so 20:00 -> 17:00 UTC)
            const [day, month, year] = m.date.split('.').map(Number);
            const [hours, mins] = m.time.split(':').map(Number);
            
            // Generate UTC date
            const date = new Date(Date.UTC(year, month - 1, day, hours - 3, mins));

            formatted.push({
                id: String(m.id),
                data: {
                    status: 'not_started',
                    sport: { name: 'Soccer' },
                    tournament: { name: tournament },
                    country: { name: country },
                    participants: { home: m.homeTeam, away: m.awayTeam },
                    start_time: date.toISOString(),
                    group_markets: {
                        'full_event|0': [
                            `|1x2|~home~${m.odds['1'].toFixed(2)}!~draw~${m.odds['X'].toFixed(2)}!~away~${m.odds['2'].toFixed(2)}`
                        ]
                    }
                }
            });
        });
    });

    const outputPath = path.join(__dirname, 'public', 'prelive_matches.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(formatted, null, 2));
    
    // Also write to dist/prelive_matches.json just in case production server uses it
    const distPath = path.join(__dirname, 'dist', 'prelive_matches.json');
    if (fs.existsSync(path.dirname(distPath))) {
        fs.writeFileSync(distPath, JSON.stringify(formatted, null, 2));
    }

    console.log(`✅ [GENERATE] Generated ${formatted.length} prelive matches.`);
};

generateMatches();
