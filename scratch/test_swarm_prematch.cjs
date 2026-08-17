const WebSocket = require('ws');
const ws = new WebSocket('wss://eu-swarm-newm.atekbet279.com/', {
  headers: {
    'Origin': 'https://atekbet279.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  }
});

ws.on('open', () => {
    ws.send(JSON.stringify({"command":"request_session","params":{"language":"tur","site_id":1}}));
});

ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.data && msg.data.sid) {
        console.log('Session', msg.data.sid);
        ws.send(JSON.stringify({
            "command": "get",
            "params": {
                "source": "betting",
                "what": { "game": ["id", "type", "start_ts", "team1_name"] },
                "where": { 
                    "sport": {"id": 1},
                    "game": {"type": 0} // Test type 0
                }
            },
            "rid": "test"
        }));
    }
    if (msg.rid === "test") {
        console.log("Response:", Object.keys(msg.data.data.game || {}).length, "matches found for type 0");
        ws.close();
    }
});
