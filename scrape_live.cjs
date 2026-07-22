const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLive() {
    console.log("🚀 Starting Puppeteer for LIVE Matches...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        console.log(`🌐 Navigating to Live Matches...`);
        await page.goto('https://sekabet1624.com/tr/live/', { waitUntil: 'networkidle2', timeout: 30000 });
        console.log(`⏳ Page loaded. Waiting 10 seconds for sportsbook to render...`);
        await new Promise(r => setTimeout(r, 10000)); 

        console.log(`🔄 Scrolling down to load all lazy-loaded matches...`);
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 300; // Scroll 300px each time
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    // Stop scrolling after 15 seconds or if we reached the bottom (though infinite scrolls might not have a bottom)
                    if(totalHeight >= 15000){ 
                        clearInterval(timer);
                        resolve();
                    }
                }, 200); // every 200ms
            });
        });
        await new Promise(r => setTimeout(r, 2000)); 

        const matches = await page.evaluate(() => {
            const results = [];
            const leagueHeaders = document.querySelectorAll('[class*="league-header_"]');

            leagueHeaders.forEach((headerEl, headerIndex) => {
                try {
                    const headerText = headerEl.innerText.trim();
                    const lines = headerText.split('\n');
                    
                    let sport = lines.length > 0 ? lines[0].trim() : 'Futbol';
                    let country = lines.length > 1 ? lines[1].trim() : 'Dünya';
                    let tournament = lines.length > 2 ? lines[2].trim() : 'Canlı Ligler';

                    // Next sibling is usually events-wrapper
                    let nextEl = headerEl.nextElementSibling;
                    if (nextEl && nextEl.className && nextEl.className.includes('events-wrapper')) {
                        const rows = nextEl.querySelectorAll('[class*="event-row_"]');
                        
                        rows.forEach((row, rowIndex) => {
                            try {
                                // Time / Minute
                                const timeEl = row.querySelector('[class*="event-time_"]');
                                const minute = timeEl ? timeEl.innerText.trim() : "Live";

                                // Teams
                                let homeTeam = "Takım A";
                                let awayTeam = "Takım B";
                                const teamContainer = row.querySelector('[class*="participants_"] > div') || row.querySelector('[class*="participant_"] > div');
                                if (teamContainer && teamContainer.children.length >= 2) {
                                    homeTeam = teamContainer.children[0].innerText.trim();
                                    awayTeam = teamContainer.children[1].innerText.trim();
                                } else {
                                    // Fallback
                                    const allDivs = Array.from(row.querySelectorAll('div'));
                                    for (let d of allDivs) {
                                        if (d.children.length === 2 && !d.className.includes('score') && !d.className.includes('logo')) {
                                            homeTeam = d.children[0].innerText.trim();
                                            awayTeam = d.children[1].innerText.trim();
                                            if (homeTeam.length > 2 && isNaN(homeTeam)) break;
                                        }
                                    }
                                }

                                // Score
                                let score = "0 - 0";
                                const scoreItems = row.querySelectorAll('[class*="score-item_"]');
                                if (scoreItems.length >= 2) {
                                    score = `${scoreItems[0].innerText.trim()} - ${scoreItems[1].innerText.trim()}`;
                                }

                                // Logos
                                const logos = row.querySelectorAll('img');
                                let homeLogoUrl = logos.length > 0 ? logos[0].src : '';
                                let awayLogoUrl = logos.length > 1 ? logos[1].src : '';

                                // Odds
                                const oddsBtns = row.querySelectorAll('[class*="outcome_"]');
                                let homeOdd = oddsBtns.length > 0 ? oddsBtns[0].innerText.trim() : '1.85';
                                let drawOdd = oddsBtns.length > 1 ? oddsBtns[1].innerText.trim() : '3.40';
                                let awayOdd = oddsBtns.length > 2 ? oddsBtns[2].innerText.trim() : '3.80';

                                if (!homeTeam || homeTeam.length < 2 || !isNaN(homeTeam)) return; // Skip invalid rows

                                const safeHome = homeTeam.replace(/[^a-zA-Z0-9]/g, '');
                                const safeAway = awayTeam.replace(/[^a-zA-Z0-9]/g, '');

                                results.push({
                                    id: `live_${safeHome}_${safeAway}_${headerIndex}_${rowIndex}`,
                                    data: {
                                        status: 'in_progress',
                                        is_live_betting: true,
                                        sport: { name: sport },
                                        tournament: { name: tournament },
                                        country: { name: country },
                                        participants: { 
                                            home: homeTeam, 
                                            away: awayTeam,
                                            ByNumber: {
                                                '1': { LogoPath: homeLogoUrl },
                                                '2': { LogoPath: awayLogoUrl }
                                            }
                                        },
                                        current_score: score,
                                        minute: minute,
                                        start_time: new Date().toISOString(),
                                        group_markets: {
                                            'full_event|0': [`|1x2|~home~${homeOdd}!~draw~${drawOdd}!~away~${awayOdd}`]
                                        }
                                    }
                                });
                            } catch(e) {}
                        });
                    }
                } catch(e) {}
            });

            return results;
        });

        if (matches.length > 0) {
            console.log(`📊 Successfully scraped ${matches.length} LIVE matches!`);
            fs.writeFileSync('public/live_matches.json', JSON.stringify(matches, null, 2));
        } else {
            console.log("No live matches found in DOM.");
        }
        await browser.close();

    } catch (err) {
        console.error(`❌ Failed to scrape (${err.message}).`);
        if (browser) await browser.close();
    }
}

scrapeLive();
