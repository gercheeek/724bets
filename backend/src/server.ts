import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { OneXBetFetcher } from './fetchers/OneXBetFetcher';
import { Match724 } from './types/Match';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production e.g. ["https://724bets.net", "http://localhost:3000"]
    methods: ["GET", "POST"]
  }
});

let liveMatches: Match724[] = [];
let preMatches: Match724[] = [];

async function updateDataEngine() {
    try {
        const fetchedLive = await OneXBetFetcher.fetchLiveMatches();
        liveMatches = [...fetchedLive];
        io.emit('liveMatchesUpdate', liveMatches);

        const fetchedPre = await OneXBetFetcher.fetchPreMatches();
        preMatches = [...fetchedPre];
        io.emit('preMatchesUpdate', preMatches);
        
        console.log(`[Data Engine] Broadcasted ${liveMatches.length} Live | ${preMatches.length} Pre-match`);
    } catch (e) {
        console.error("[Data Engine] Critical Update Error:", e);
    }
}

// Initial fetch and start interval
updateDataEngine();
setInterval(updateDataEngine, 3000);

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.emit('liveMatchesUpdate', liveMatches);
    socket.emit('preMatchesUpdate', preMatches);

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🚀 724Bets Data Engine V2.0 is running on port ${PORT}`);
});
