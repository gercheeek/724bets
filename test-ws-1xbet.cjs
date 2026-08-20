const { io } = require("socket.io-client");
const socket = io("https://724bahis.net");
socket.on("connect", () => {
    console.log("Connected to https://724bahis.net");
});
socket.on("1xbetLiveMatches", (payload) => {
    console.log("Got 1xbetLiveMatches: ", payload.length, "matches");
    if(payload.length > 0) {
        console.log("Sample event ID:", payload[0].id);
    }
    process.exit(0);
});
socket.on("connect_error", (err) => {
    console.log("Connection Error: ", err.message);
    process.exit(1);
});
