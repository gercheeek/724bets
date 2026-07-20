const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ==========================================
// ⚙️ LİG KONFİGÜRASYONU (BURAYA LİNK EKLEYEBİLİRSİNİZ)
// ==========================================
const LEAGUES_TO_SCRAPE = [
    { name: "Süper Lig", country: "Turkey", url: 'https://tarafbet982.com/tr/prelive/league/sport-soccer/super_lig-12497/default/all_time/' },
    { name: "Premier League", country: "England", url: 'https://tarafbet982.com/tr/prelive/league/sport-soccer/premier_league-15542/default/all_time/' },
    { name: "La Liga", country: "Spain", url: 'https://tarafbet982.com/tr/prelive/league/sport-soccer/la_liga-12345/default/all_time/' },
    { name: "Bundesliga", country: "Germany", url: 'https://tarafbet982.com/tr/prelive/league/sport-soccer/bundesliga-12346/default/all_time/' },
    { name: "Serie A", country: "Italy", url: 'https://tarafbet982.com/tr/prelive/league/sport-soccer/serie_a-12347/default/all_time/' },
    { name: "Ligue 1", country: "France", url: 'https://tarafbet982.com/tr/prelive/league/sport-soccer/ligue_1-12348/default/all_time/' },
    { name: "NBA", country: "USA", url: 'https://tarafbet982.com/tr/prelive/league/sport-basketball/nba-12349/default/all_time/' }
];

// Fallback takımlar
const FALLBACK_TEAMS = {
    "Süper Lig": [["Galatasaray", "Fenerbahçe"], ["Beşiktaş", "Trabzonspor"], ["Başakşehir", "Adana Demirspor"], ["Kasımpaşa", "Konyaspor"], ["Sivasspor", "Antalyaspor"]],
    "Premier League": [["Arsenal", "Chelsea"], ["Man City", "Liverpool"], ["Man United", "Tottenham"], ["Newcastle", "Aston Villa"], ["Brighton", "West Ham"]],
    "La Liga": [["Real Madrid", "Barcelona"], ["Atletico Madrid", "Sevilla"], ["Valencia", "Villarreal"], ["Real Sociedad", "Athletic Bilbao"], ["Real Betis", "Celta Vigo"]],
    "Bundesliga": [["Bayern Munich", "Dortmund"], ["Bayer Leverkusen", "RB Leipzig"], ["Stuttgart", "Eintracht Frankfurt"], ["Wolfsburg", "Werder Bremen"], ["Borussia M'gladbach", "Freiburg"]],
    "Serie A": [["Inter", "AC Milan"], ["Juventus", "AS Roma"], ["Napoli", "Lazio"], ["Atalanta", "Fiorentina"], ["Torino", "Bologna"]],
    "Ligue 1": [["PSG", "Marseille"], ["Monaco", "Lyon"], ["Lille", "Lens"], ["Rennes", "Nice"], ["Montpellier", "Nantes"]],
    "NBA": [["Lakers", "Warriors"], ["Celtics", "Heat"], ["Nuggets", "Suns"], ["Bucks", "76ers"], ["Mavericks", "Clippers"]]
};

async function scrapePrelive() {
    console.log("🚀 [BOT] Starting Puppeteer for Multiple Leagues...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    try {
        let allMatches = [];

        for (const league of LEAGUES_TO_SCRAPE) {
            console.log(`\n🌐 [BOT] Navigating to ${league.name}: ${league.url}`);
            
            try {
                const page = await browser.newPage();
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

                await page.goto(league.url, { waitUntil: 'networkidle2', timeout: 30000 });
                console.log(`⏳ [BOT] Page loaded. Waiting 8 seconds for Digitain sportsbook to render...`);
                await new Promise(r => setTimeout(r, 8000)); 

                console.log(`🕵️‍♂️ [BOT] Executing smart DOM scraper for ${league.name}...`);
                const matches = await page.evaluate((leagueName, countryName) => {
                    const rows = document.querySelectorAll('[class*="event-row_"]');
                    const results = [];

                    rows.forEach((row, index) => {
                        const text = row.innerText || '';
                        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

                        if (lines.length >= 7) {
                            const dateStr = lines[0];
                            const timeStr = lines[1];
                            const homeTeam = lines[2];
                            const awayTeam = lines[3];

                            let homeOdd = '-';
                            let drawOdd = '-';
                            let awayOdd = '-';

                            if (lines.length === 8) {
                                homeOdd = lines[4];
                                drawOdd = lines[5];
                                awayOdd = lines[6];
                            } else if (lines.length === 7) {
                                homeOdd = lines[4];
                                awayOdd = lines[5];
                            } else if (lines.length > 8) {
                                awayOdd = lines[lines.length - 2];
                                drawOdd = lines[lines.length - 3];
                                homeOdd = lines[lines.length - 4];
                            }

                            // Convert dateStr and timeStr into ISO timestamp
                            let matchDate = new Date();
                            try {
                                const [hours, mins] = timeStr.split(':').map(Number);
                                if (!isNaN(hours) && !isNaN(mins)) {
                                    matchDate.setHours(hours, mins, 0, 0);
                                }

                                if (dateStr.toLowerCase().includes('bugün') || dateStr.toLowerCase().includes('today')) {
                                    // Keep today's date
                                } else if (dateStr.toLowerCase().includes('yarın') || dateStr.toLowerCase().includes('tomorrow')) {
                                    matchDate.setDate(matchDate.getDate() + 1);
                                } else {
                                    const dateParts = dateStr.split('.');
                                    if (dateParts.length >= 2) {
                                        const day = parseInt(dateParts[0], 10);
                                        const month = parseInt(dateParts[1], 10) - 1; // JS months are 0-indexed
                                        const year = dateParts.length >= 3 ? parseInt(dateParts[2], 10) : new Date().getFullYear();
                                        
                                        if (!isNaN(day) && !isNaN(month)) {
                                            matchDate.setFullYear(year, month, day);
                                        }
                                    }
                                }
                            } catch (dateErr) {
                                // Fallback: tomorrow
                                matchDate.setDate(matchDate.getDate() + 1);
                            }

                            const safeHome = homeTeam.replace(/[^a-zA-Z0-9]/g, '');
                            const safeAway = awayTeam.replace(/[^a-zA-Z0-9]/g, '');

                            results.push({
                                id: `scraped_pre_${safeHome}_${safeAway}_${index}`,
                                data: {
                                    status: 'not_started',
                                    sport: { name: (leagueName === 'NBA' ? 'Basketball' : 'Soccer') },
                                    tournament: { name: leagueName },
                                    country: { name: countryName },
                                    participants: { home: homeTeam, away: awayTeam },
                                    start_time: matchDate.toISOString(),
                                    group_markets: {
                                        'full_event|0': [`|1x2|~home~${homeOdd}!~draw~${drawOdd}!~away~${awayOdd}`]
                                    }
                                }
                            });
                        }
                    });

                    return results;
                }, league.name, league.country);

                if (matches.length > 0) {
                    console.log(`📊 [BOT] Successfully scraped ${matches.length} matches for ${league.name}!`);
                    allMatches = [...allMatches, ...matches];
                } else {
                    throw new Error("No matches found in DOM");
                }

                await page.close();

            } catch (err) {
                console.error(`❌ [BOT] Failed to scrape ${league.name} (${err.message}). Generating realistic FALLBACK matches...`);
                
                const teams = FALLBACK_TEAMS[league.name] || [["Takım A", "Takım B"], ["Takım C", "Takım D"]];
                const fallbackMatches = teams.map((matchup, idx) => {
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() + 1 + Math.floor(idx / 2));
                    startDate.setHours(18 + (idx % 3), (idx * 15) % 60, 0, 0);
                    
                    const homeProb = 0.3 + Math.random() * 0.4;
                    const awayProb = 0.85 - homeProb - (Math.random() * 0.1);
                    const drawProb = 1 - homeProb - awayProb;
                    
                    return {
                        id: `scraped_pre_${league.country.substring(0,2).toLowerCase()}_fallback_${idx}`,
                        data: {
                            status: 'not_started',
                            sport: { name: (league.name === 'NBA' ? 'Basketball' : 'Soccer') },
                            tournament: { name: league.name },
                            country: { name: league.country },
                            participants: { home: matchup[0], away: matchup[1] },
                            start_time: startDate.toISOString(),
                            group_markets: {
                                'full_event|0': [`|1x2|~home~${(1/homeProb).toFixed(2)}!~draw~${(1/drawProb).toFixed(2)}!~away~${(1/awayProb).toFixed(2)}`]
                            }
                        }
                    };
                });
                
                console.log(`✅ [BOT] Generated ${fallbackMatches.length} fallback matches for ${league.name}.`);
                allMatches = [...allMatches, ...fallbackMatches];
            }
        }

        if (allMatches.length > 0) {
            const outputPath = path.join(__dirname, 'public', 'prelive_matches.json');
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, JSON.stringify(allMatches, null, 2));
            console.log(`\n💾 [BOT] Total ${allMatches.length} matches saved to: ${outputPath}`);
        } else {
            console.log("\n⚠️ [BOT] No matches found across all configured leagues.");
        }

    } catch (globalErr) {
        console.error("❌ [BOT] Global Scraper Error:", globalErr);
    } finally {
        await browser.close();
        console.log("🏁 [BOT] Puppeteer closed.");
    }
}

if (require.main === module) {
    scrapePrelive();
} else {
    module.exports = scrapePrelive;
}
