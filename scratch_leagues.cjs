const WebSocket = require('ws');

const ws = new WebSocket('wss://eu-swarm-newm.vbettr.com/');
ws.on('open', () => {
    ws.send(JSON.stringify({
        "command": "request_session",
        "params": {
            "language": "tur",
            "site_id": 1
        }
    }));
});

ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.data && msg.data.sid) {
        ws.send(JSON.stringify({
            "command": "get",
            "params": {
                "source": "betting",
                "what": {
                    "sport": ["id", "name"],
                    "region": ["id", "name"],
                    "competition": ["id", "name"]
                },
                "where": {
                    "sport": { "id": 1 } // Football only
                }
            }
        }));
    } else if (msg.data && msg.data.data && msg.data.data.sport) {
        const sport = msg.data.data.sport['1'];
        if (sport && sport.region) {
            for (const rId in sport.region) {
                const region = sport.region[rId];
                console.log(`Region: ${region.name}`);
                if (region.competition) {
                    for (const cId in region.competition) {
                        console.log(`  - Comp: ${region.competition[cId].name}`);
                    }
                }
            }
        }
        process.exit(0);
    }
});
