const WebSocket = require('ws');

// Test 1: Raw Swarm WebSocket (like Norabahis)
function testRaw() {
    console.log('--- Test 1: Raw WebSocket ---');
    const ws = new WebSocket('wss://eu-swarm-newm.atekbet273.com/ws?language=tur', {
        headers: { 'Origin': 'https://atekbet273.com', 'User-Agent': 'Mozilla/5.0' }
    });

    ws.on('open', () => {
        console.log('Raw WS Connected. Sending request_session...');
        ws.send(JSON.stringify({
            command: 'request_session',
            params: { language: 'tur', site_id: 1 },
            rid: 'req_session'
        }));
    });

    ws.on('message', (data) => {
        console.log('Raw WS Message:', data.toString().substring(0, 300));
        ws.close();
        testEio3();
    });

    ws.on('error', (err) => {
        console.log('Raw WS Error:', err.message);
        testEio3();
    });
}

// Test 2: Socket.io EIO=3
function testEio3() {
    console.log('\n--- Test 2: Socket.io EIO=3 ---');
    const ws = new WebSocket('wss://eu-swarm-newm.atekbet273.com/sport/?EIO=3&transport=websocket', {
        headers: { 'Origin': 'https://atekbet273.com', 'User-Agent': 'Mozilla/5.0' }
    });

    ws.on('open', () => {
        console.log('EIO=3 Connected. Waiting for data...');
    });

    ws.on('message', (data) => {
        console.log('EIO=3 Message:', data.toString().substring(0, 300));
        ws.close();
        testEio4();
    });

    ws.on('error', (err) => {
        console.log('EIO=3 Error:', err.message);
        testEio4();
    });
}

// Test 3: Socket.io EIO=4
function testEio4() {
    console.log('\n--- Test 3: Socket.io EIO=4 ---');
    const ws = new WebSocket('wss://eu-swarm-newm.atekbet273.com/ws?EIO=4&transport=websocket', {
        headers: { 'Origin': 'https://atekbet273.com', 'User-Agent': 'Mozilla/5.0' }
    });

    ws.on('open', () => {
        console.log('EIO=4 Connected. Waiting for data...');
    });

    ws.on('message', (data) => {
        console.log('EIO=4 Message:', data.toString().substring(0, 300));
        ws.close();
        process.exit(0);
    });

    ws.on('error', (err) => {
        console.log('EIO=4 Error:', err.message);
        process.exit(0);
    });
}

testRaw();

setTimeout(() => {
    console.log('Timeout. Exiting...');
    process.exit(0);
}, 10000);
