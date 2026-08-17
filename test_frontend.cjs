const Redis = require('ioredis');
const redis = new Redis();

async function run() {
    const d = await redis.get('matches:all');
    const payload = JSON.parse(d || '[]');
    
    console.log("Total payload:", payload.length);
    const liveItems = payload.filter(m => m.id.startsWith('live_'));
    console.log("Live items in payload:", liveItems.length);
    
    if (liveItems.length > 0) {
        console.log("Sample live item status:", liveItems[0].data.status);
    }
    
    const activeSport = 'Futbol';
    const viewMode = 'live';

    const result = liveItems.filter(ev => {
        const data = ev.data || ev;
        if (!data || !data.participants) {
            console.log("Fails at participants");
            return false;
        }
        
        let isLive = ev.isLive;
        if (data.status === 'not_started' || data.status === 'postponed' || data.status === 'canceled') isLive = false;
        
        const m = { isLive, sport: ev.sport || data.sport?.name || 'Futbol' };
        
        if (viewMode === 'live') {
            if (!m.isLive && !(ev.id && typeof ev.id === 'string' && ev.id.startsWith('live_'))) {
                console.log("Fails at live check. isLive:", m.isLive, "id:", ev.id);
                return false;
            }
        }
        
        if (activeSport !== 'Tüm Sporlar') {
            let sName = m.sport || '';
            if (sName.toLowerCase() !== activeSport.toLowerCase()) {
                console.log("Fails at sport name. expected:", activeSport, "got:", sName);
                return false;
            }
        }
        return true;
    });

    console.log("Filtered live matches count:", result.length);
    process.exit(0);
}
run();
