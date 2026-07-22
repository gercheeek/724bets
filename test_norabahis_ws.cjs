const WebSocket = require('ws');

const PRIMARY_WS_BASE = 'wss://eu-swarm-newm.norabahis779.com/ws?organization_id=928d43dd-1219-4ab0-b33f-0e180215781e&x-region=us-south1&partnerId=55&EIO=4&transport=websocket';

const headers = {
    'Origin': 'https://norabahis779.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
};

const ws = new WebSocket(PRIMARY_WS_BASE, { headers });

ws.on('open', () => {
    console.log('Connected to NoraBahis Swarm WS');
});

ws.on('message', (data) => {
    const msg = data.toString();
    console.log('Received message len:', msg.length);
    if (msg.startsWith('0')) {
        // Handshake packet 0{"sid":"..."}
        // Send 40
        ws.send('40');
    } else if (msg.startsWith('40')) {
        // Send request for live matches
        const req = [
            "request",
            {
                "command": "get",
                "params": {
                    "source": "betting",
                    "what": {
                        "sport": ["id", "name"],
                        "region": ["id", "name"],
                        "competition": ["id", "name"],
                        "game": [
                            "id", "team1_name", "team2_name", "info", "stats", "markets_count", "is_live"
                        ]
                    },
                    "where": {
                        "game": { "type": 1 }
                    }
                },
                "subscribe": false
            }
        ];
        ws.send('42' + JSON.stringify(req));
    } else if (msg.startsWith('42')) {
        console.log('REAL LIVE DATA RECEIVED:');
        console.log(msg.substring(0, 1000));
        process.exit(0);
    }
});

ws.on('error', (err) => {
    console.error('WS Error:', err);
});

setTimeout(() => {
    console.log('Timeout');
    process.exit(1);
}, 10000);
