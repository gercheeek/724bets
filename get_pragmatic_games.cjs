const { getAllGames } = require('./oroplay.cjs');

async function test() {
    try {
        const games = await getAllGames();
        const sweetGames = games.filter(g => g.vendorCode === 'slot-pragmatic' && (g.name.toLowerCase().includes('sweet') || g.name.toLowerCase().includes('bonanza') || g.name.toLowerCase().includes('olympus') || g.name.toLowerCase().includes('rush')));
        console.log(JSON.stringify(sweetGames, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
