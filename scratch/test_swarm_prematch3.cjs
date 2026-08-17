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
        const nowTs = Math.floor(Date.now() / 1000);
        ws.send(JSON.stringify({
            "command": "get",
            "params": {
              "source": "betting",
              "what": {
                "sport": ["id", "name"], "region": ["id", "name"], "competition": ["id", "name"],
                "game": ["id", "start_ts", "team1_name", "team2_name", "type", "info", "stats"],
                "market": ["id", "type", "name", "base"], "event": ["id", "price", "type", "name"]
              },
              "where": { 
                  "sport": {"id": 1},
                  "game": {
                      "type": {"@in": [0, 2]},
                      "start_ts": {"@gte": nowTs, "@lt": nowTs + 86400} 
                  },
                  "market": {
                      "type": {"@in": ["P1P2", "MatchResult", "P1XP2", "TotalGoals", "BothTeamsToScore"]}
                  }
              },
              "subscribe": false
            },
            "rid": "pre_sub"
        }));
    }
    if (msg.rid === "pre_sub") {
        console.log("Response code:", msg.code);
        if (msg.data && msg.data.data && msg.data.data.sport) {
            let count = 0;
            for(let r in msg.data.data.sport[1].region) {
                for(let c in msg.data.data.sport[1].region[r].competition) {
                    count += Object.keys(msg.data.data.sport[1].region[r].competition[c].game || {}).length;
                }
            }
            console.log("Matches:", count);
        } else {
            console.log("No data");
        }
        ws.close();
    }
});
