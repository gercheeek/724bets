const fs = require('fs');

function startMockScraper() {
    console.log("🚀 Starting Mock Data Generator for LIVE Matches (1-second updates)...");
    
    // Load existing matches
    let matches = [];
    try {
        const data = fs.readFileSync('public/live_matches.json', 'utf8');
        matches = JSON.parse(data);
        console.log(`Loaded ${matches.length} matches from live_matches.json`);
    } catch (e) {
        console.error("Failed to load live_matches.json", e);
        return;
    }

    setInterval(() => {
        // Randomly fluctuate odds to simulate live updates
        matches = matches.map(match => {
            const fluctuate = (val) => {
                if (val === '-' || !val) return val;
                const num = parseFloat(val);
                if (isNaN(num)) return val;
                // 30% chance to change
                if (Math.random() < 0.3) {
                    const diff = (Math.random() - 0.5) * 0.1;
                    return (Math.max(1.01, num + diff)).toFixed(2);
                }
                return val;
            };

            // Also increment minute for soccer matches occasionally
            let newMinute = match.data.minute;
            if (newMinute && newMinute !== 'Live' && newMinute.includes("'")) {
                if (Math.random() < 0.05) {
                    const m = parseInt(newMinute.replace("'", ""));
                    if (!isNaN(m) && m < 90) {
                        newMinute = `${m + 1}'`;
                    }
                }
            }

            return {
                ...match,
                data: {
                    ...match.data,
                    homeOdd: fluctuate(match.data.homeOdd),
                    drawOdd: fluctuate(match.data.drawOdd),
                    awayOdd: fluctuate(match.data.awayOdd),
                    minute: newMinute
                }
            };
        });

        // Write back to file
        fs.writeFileSync('public/live_matches.json', JSON.stringify(matches, null, 2));
    }, 2000); // every 2 seconds
}

startMockScraper();
