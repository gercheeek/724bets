const puppeteer = require('puppeteer');

async function testNewParser() {
    console.log("Testing new DOM text-splitting parser...");
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = 'https://tarafbet982.com/tr/prelive/league/sport-soccer/premier_league-15542/default/all_time/';
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise(r => setTimeout(r, 8000));
        
        const matches = await page.evaluate(() => {
            const rows = document.querySelectorAll('[class*="event-row_"]');
            const results = [];
            
            rows.forEach((row, index) => {
                const text = row.innerText || '';
                const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                
                // We expect at least 7 lines: Date, Time, Home, Away, Odd1, (OddX?), Odd2, Markets
                if (lines.length >= 7) {
                    const date = lines[0];
                    const time = lines[1];
                    const homeTeam = lines[2];
                    const awayTeam = lines[3];
                    
                    let homeOdd = '-';
                    let drawOdd = '-';
                    let awayOdd = '-';
                    let marketsText = '';
                    
                    if (lines.length === 8) {
                        homeOdd = lines[4];
                        drawOdd = lines[5];
                        awayOdd = lines[6];
                        marketsText = lines[7];
                    } else if (lines.length === 7) {
                        homeOdd = lines[4];
                        awayOdd = lines[5];
                        marketsText = lines[6];
                    } else if (lines.length > 8) {
                        // Sometimes there are extra lines (like live indicators or icons), try to guess by indexing from end
                        // Markets is always the last line
                        marketsText = lines[lines.length - 1];
                        awayOdd = lines[lines.length - 2];
                        drawOdd = lines[lines.length - 3];
                        homeOdd = lines[lines.length - 4];
                    }
                    
                    results.push({
                        date,
                        time,
                        homeTeam,
                        awayTeam,
                        homeOdd,
                        drawOdd,
                        awayOdd,
                        marketsText
                    });
                }
            });
            
            return results;
        });
        
        console.log("Parsed matches:", JSON.stringify(matches, null, 2));
    } catch (e) {
        console.error("Test failed:", e.message);
    } finally {
        await browser.close();
    }
}

testNewParser();
