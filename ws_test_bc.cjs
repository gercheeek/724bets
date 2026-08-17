const WebSocket = require('ws');
const ws = new WebSocket('wss://eu-swarm-newm.vbettr.com/');
ws.on('open', () => {
    ws.send(JSON.stringify({"command":"request_session","params":{"language":"tur","site_id":1116}}));
});
ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.data && msg.data.sid) {
        ws.send(JSON.stringify({
            "command": "get",
            "params": {
              "source": "betting",
              "what": {
                "game": [] // Get all fields
              },
              "where": { 
                  "game": {"type": 1}
              }
            },
            "rid": "live_sub"
        }));
    } else if (msg.rid === "live_sub") {
        if(msg.data && msg.data.data && msg.data.data.game) {
           const game = Object.values(msg.data.data.game)[0];
           console.log(Object.keys(game));
           process.exit(0);
        } else {
           console.log(msg);
           process.exit(1);
        }
    }
});
