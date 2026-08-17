const WebSocket = require('ws');
const ws = new WebSocket('wss://eu-swarm-newm.atekbet279.com/ws?language=tur');
ws.on('open', () => {
    ws.send(JSON.stringify({"command":"request_session","params":{"language":"tur","site_id":1}}));
});
ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.data && msg.data.sid) {
        ws.send(JSON.stringify({
            "command": "get",
            "params": {
                "source": "betting",
                "what": { "game": ["team1_name", "team2_name"] },
                "where": { "sport": {"id": 1}, "game": {"type": 1} }
            },
            "rid": "live_sub"
        }));
    } else if (msg.rid === "live_sub") {
        const games = msg.data.data.game || {};
        const matches = Object.values(games).map(g => `${g.team1_name} vs ${g.team2_name}`);
        console.log("Live Football Matches:");
        console.log(matches.slice(0, 15).join('\n'));
        if(matches.some(m => m.includes("Arsenal"))) console.log("ARSENAL FOUND!");
        process.exit(0);
    }
});
