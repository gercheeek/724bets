const Redis = require('ioredis');
const redis = new Redis();
async function run() {
    const keys = await redis.keys('match:live:*');
    if (keys.length > 0) {
        console.log(`Found ${keys.length} live matches.`);
        const val = await redis.get(keys[0]);
        console.log("First Match:", JSON.parse(val).home, "vs", JSON.parse(val).away, "Sport:", JSON.parse(val).sport);
    } else {
        console.log("No live matches");
    }
    process.exit(0);
}
run();
