const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLive() {
    console.log("Tarayıcı başlatılıyor...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log("Tarafbet'e gidiliyor...");
    await page.goto('https://tarafbet981.com/tr/live/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log("Maçların yüklenmesi bekleniyor...");
    await page.waitForSelector('[class^="event-row_"], [class^="participants_"], .live-game-item, .game-list-item, .event-row', { timeout: 15000 }).catch(() => console.log("Seçici bulunamadı, mevcut DOM inceleniyor..."));
    
    // Get basic info from DOM and transform to grouped structure
    const data = await page.evaluate(() => {
        const grouped = [];
        let currentLeague = { leagueName: "Tüm Canlı Maçlar", matches: [] };
        grouped.push(currentLeague);

        // Prefix selectors handle dynamically hashed class names (e.g., participants_e723b)
        const elements = document.querySelectorAll('.sport-title-event-row-b, .event-row-bc, .game-list-item, .event-list-item, .league-title, [class^="competition-title_"], [class^="event-row_"], [class^="participants_"]');
        
        elements.forEach((el) => {
            const className = el.className || '';
            const lines = el.innerText.split('\n').map(t => t.trim()).filter(t => t.length > 0);
            
            if (lines.length === 0) return;

            // Detect if this is a league header (usually has 'title' in class or only 1-2 lines of text)
            if (className.includes('title') || (lines.length <= 2 && !lines.find(l => l.match(/^\d+\.\d{2}$/)))) {
                const leagueName = lines[0];
                currentLeague = { leagueName: leagueName, matches: [] };
                grouped.push(currentLeague);
                return;
            }
            
            // Detect if it is a match row
            if (lines.length >= 4 || className.includes('participants') || className.includes('event-row')) {
                let homeTeam = "Ev Sahibi";
                let awayTeam = "Deplasman";
                let score = "0 - 0";
                let minute = "1'";
                let odds = { "1": 1.00, "X": 1.00, "2": 1.00 };
                let moreOdds = "+ 99";
                
                // Parse score (e.g. "1 - 0" or "0-0")
                const scoreMatch = lines.find(l => l.match(/^\d+\s*-\s*\d+$/));
                if (scoreMatch) score = scoreMatch;
                
                // Parse minute (contains ' or is Yarı/Devre/HT)
                const minuteMatch = lines.find(l => l.includes("'") || l.includes("Yarı") || l.includes("Devre"));
                if (minuteMatch) minute = minuteMatch;
                
                // Parse odds (matches decimal pattern like 1.95)
                const decimals = lines.filter(l => l.match(/^\d+\.\d{2,3}$/));
                if (decimals.length >= 3) {
                    odds["1"] = parseFloat(decimals[decimals.length - 3]);
                    odds["X"] = parseFloat(decimals[decimals.length - 2]);
                    odds["2"] = parseFloat(decimals[decimals.length - 1]);
                }
                
                // Parse more odds (e.g. "+ 245")
                const plusOdds = lines.find(l => l.startsWith('+'));
                if (plusOdds) moreOdds = plusOdds;
                
                // Parse teams using strict rules
                const teamLines = lines.filter(text => {
                    if (text.length <= 2) return false;
                    if (text.match(/^[0-9.\-+' ]+$/)) return false;
                    const lower = text.toLowerCase();
                    if (lower.includes('logo') || lower.includes('yarı') || lower.includes('devre') || lower.match(/^1x2|alt|üst|tek|çift$/)) return false;
                    return true;
                });
                
                if (teamLines.length >= 2) {
                    homeTeam = teamLines[0];
                    awayTeam = teamLines[1];
                }

                // Generate random ID for mock purpose or extract if exists in DOM
                const matchId = Math.random().toString(36).substr(2, 9);
                const time = new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
                
                currentLeague.matches.push({
                    id: matchId,
                    time: time,
                    minute: minute,
                    score: score,
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    odds: odds,
                    moreOdds: moreOdds
                });
            }
        });
        
        // Filter out empty leagues
        return grouped.filter(g => g.matches.length > 0);
    });
    
    console.log(`Bulunan maç sayısı (Ham): ${data.length}`);
    
    await browser.close();
    
    if (data.length > 0) {
        fs.writeFileSync('public/tarafbet_dump.json', JSON.stringify(data, null, 2));
        console.log("Veriler public/tarafbet_dump.json dosyasına kaydedildi.");
    } else {
        console.log("Maç bulunamadı.");
    }
}

scrapeLive().catch(console.error);
