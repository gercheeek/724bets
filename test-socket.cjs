const { io } = require("socket.io-client");
const fs = require("fs");

const socket = io("http://localhost:3001");

socket.on("connect", () => {
    console.log("Connected to local socket server");
});

socket.on("matches_update", (payload) => {
    console.log("Received matches, saving to data.json...");
    fs.writeFileSync("data.json", JSON.stringify(payload, null, 2));
    socket.disconnect();
    process.exit(0);
});

socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
    process.exit(1);
});
