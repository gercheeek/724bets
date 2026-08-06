const fs = require('fs');
const path = require('path');

const prelivePath = path.join(__dirname, 'public/prelive_matches.json');

try {
    if (!fs.existsSync(prelivePath)) {
        console.log('prelive_matches.json does not exist. Please run fetch_atekbet_prematch.cjs first.');
        process.exit(1);
    }
    
    const fileContent = fs.readFileSync(prelivePath, 'utf8');
    const events = JSON.parse(fileContent);
    
    console.log(`Successfully loaded ${events.length} prelive events.`);
    
    if (events.length > 0) {
        console.log('Event keys:', Object.keys(events[0]));
        console.log('Sample event:', JSON.stringify(events[0], null, 2));
    }
    
    // Find a soccer event
    const soccerEvent = events.find(e => {
        const sName = (e.sport?.name || e.sport || e.sportName || '').toLowerCase();
        return sName === 'soccer' || sName === 'futbol' || sName === 'football' || e.home; // Fallback to any event
    });
    
    if (soccerEvent) {
        console.log('\n=============================================');
        console.log(`EVENT: ${soccerEvent.home} vs ${soccerEvent.away}`);
        console.log(`SPORT: ${soccerEvent.sport?.name} | LEAGUE: ${soccerEvent.league}`);
        console.log('=============================================');
        
        const allMarkets = soccerEvent.rawEvent?.all_markets || {};
        const marketsArray = Object.values(allMarkets);
        
        console.log(`Found ${marketsArray.length} markets. Listing them:\n`);
        
        const summary = marketsArray.map(m => {
            return {
                id: m.id,
                type_name: m.type_name || 'N/A',
                name: m.name || 'N/A',
                base: m.base || '',
                events: m.event ? Object.values(m.event).map(e => `${e.name} (${e.price})`).join(', ') : 'None'
            };
        });
        
        console.table(summary);
        
    } else {
        console.log('No soccer events found in prelive_matches.json');
    }
} catch (e) {
    console.error('Failed to parse prelive_matches.json:', e.message);
}
