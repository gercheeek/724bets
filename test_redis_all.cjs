const Redis = require('ioredis');
const redis = new Redis();
async function run() {
    const val = await redis.get('matches:all');
    if (val) {
        const matches = JSON.parse(val);
        console.log(`Found ${matches.length} matches in matches:all`);
        const liveFutbol = matches.filter(m => m.data.sport.name.toLowerCase().includes('futbol') || m.data.sport.name.toLowerCase().includes('football'));
        console.log(`Live Football: ${liveFutbol.length}`);
        if(liveFutbol.length > 0) console.log(liveFutbol[0].data.participants.home, "vs", liveFutbol[0].data.participants.away);
    } else {
        console.log("No matches:all");
    }
    process.exit(0);
}
run();
