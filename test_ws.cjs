const WebSocket = require('ws');

const ws = new WebSocket('wss://eu-swarm-newm.atekbet279.com/');

ws.on('open', () => {
    console.log("Connected to Atekbet Swarm!");
    // Send a standard Betconstruct session request
    const req = {
        command: "request_session",
        params: {
            language: "tur",
            site_id: 1 // We can guess site_id or just leave it out to see if it responds
        }
    };
    ws.send(JSON.stringify(req));
});

ws.on('message', (data) => {
    console.log("Received:", data.toString());
    ws.close();
});

ws.on('error', (err) => {
    console.error("Error:", err.message);
});
