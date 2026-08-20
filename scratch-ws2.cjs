const { io } = require("socket.io-client");
const socket = io("http://85.121.178.80:3001");
socket.on("connect", () => {
    console.log("Connected");
});
socket.on("matches_update", (payload) => {
    console.log("Got matches_update: ", payload.length, "matches");
    if(payload.length > 0) {
        console.log("Sample event:", JSON.stringify(payload[0], null, 2));
    }
    process.exit(0);
});
