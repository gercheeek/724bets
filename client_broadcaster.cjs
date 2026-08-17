const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const { PrismaClient } = require('@prisma/client');
const { logError, logInfo } = require('./logger.cjs');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Prisma Client with Adapter
const Database = require('better-sqlite3');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const connection = new Database('./dev.db');
const adapter = new PrismaBetterSqlite3(connection);
const prisma = new PrismaClient({ adapter });

// Redis client for reading data
const redis = new Redis();
// Redis client for PubSub subscriptions
const sub = new Redis();

async function getMatchesFromRedis() {
    try {
        const data = await redis.get('matches:all');
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        logError("Error reading matches from Redis: " + e.message);
    }
    return [];
}

// REST API ENDPOINTS FOR BETTING ENGINE
app.post('/api/user/mock', async (req, res) => {
    try {
        let user = await prisma.user.findUnique({ where: { username: "test_user" }});
        if (!user) {
            user = await prisma.user.create({
                data: { username: "test_user", password: "123", balance: 1000.0 }
            });
        }
        res.json({ success: true, user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/bet', async (req, res) => {
    const { userId, stake, items } = req.body;
    
    if (!userId || !stake || !items || items.length === 0) {
        return res.status(400).json({ error: "Eksik parametreler" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < stake) {
            return res.status(400).json({ error: "Yetersiz bakiye veya geçersiz kullanıcı" });
        }

        // Calculate total odds
        const totalOdds = items.reduce((acc, item) => acc * item.odds, 1);
        const possibleWin = stake * totalOdds;

        // Transaction to deduct balance and create bet
        const result = await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { balance: { decrement: stake } }
            }),
            prisma.bet.create({
                data: {
                    userId,
                    stake,
                    totalOdds,
                    possibleWin,
                    items: {
                        create: items.map(i => ({
                            matchId: i.matchId,
                            teamHome: i.teamHome,
                            teamAway: i.teamAway,
                            selection: i.selection,
                            odds: i.odds
                        }))
                    }
                },
                include: { items: true }
            })
        ]);

        res.json({ success: true, bet: result[1], newBalance: result[0].balance });
    } catch (e) {
        logError("Bet placement error: " + e.message);
        res.status(500).json({ error: "Kupon oynanırken bir hata oluştu" });
    }
});

// CASH OUT ALGORITHM
app.post('/api/cashout', async (req, res) => {
    const { userId, betId } = req.body;
    
    if (!userId || !betId) return res.status(400).json({ error: "Eksik parametreler" });

    try {
        const bet = await prisma.bet.findUnique({
            where: { id: betId },
            include: { items: true }
        });

        if (!bet) return res.status(404).json({ error: "Kupon bulunamadı" });
        if (bet.userId !== userId) return res.status(403).json({ error: "Yetkisiz işlem" });
        if (bet.status !== 'pending') return res.status(400).json({ error: "Bu kupon zaten sonuçlanmış veya bozdurulmuş" });

        // Get current live odds from Redis
        const liveMatchesData = await getMatchesFromRedis();
        let combinedCurrentOdds = 1;
        let isSuspended = false;

        for (const item of bet.items) {
            const liveMatch = liveMatchesData.find(m => m.id === item.matchId);
            if (!liveMatch || !liveMatch.data || !liveMatch.data.odds) {
                isSuspended = true;
                break;
            }

            // Map selection to current live odds
            // Selection examples: "1", "X", "2", "tU", "tA", "gg"
            let currentOdd = liveMatch.data.odds[item.selection];
            if (!currentOdd || parseFloat(currentOdd) <= 1.0) {
                isSuspended = true;
                break;
            }
            
            combinedCurrentOdds *= parseFloat(currentOdd);
        }

        if (isSuspended) {
            return res.status(400).json({ error: "Piyasa şu an kapalı, oranlar güncelleniyor. Bozdurma yapılamaz." });
        }

        // Financial Cashout Formula
        // Cashout Value = Stake * (Initial Total Odds / Current Total Odds) * (1 - House Edge)
        const margin = 0.10; // 10% House Edge
        const cashoutValue = bet.stake * (bet.totalOdds / combinedCurrentOdds) * (1 - margin);

        // Safety caps
        const finalCashout = Math.max(bet.stake * 0.1, Math.min(cashoutValue, bet.possibleWin));

        // Execute Cashout
        const result = await prisma.$transaction([
            prisma.user.update({
                where: { id: userId },
                data: { balance: { increment: finalCashout } }
            }),
            prisma.bet.update({
                where: { id: betId },
                data: { status: 'cashed_out' }
            })
        ]);

        res.json({ success: true, cashoutAmount: finalCashout, newBalance: result[0].balance });
    } catch (e) {
        logError("Cashout error: " + e.message);
        res.status(500).json({ error: "Bahis bozdurulurken bir hata oluştu" });
    }
});

// GET USER BETS
app.get('/api/bets', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Eksik parametre" });
    
    try {
        const bets = await prisma.bet.findMany({
            where: { userId: String(userId) },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, bets });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

io.on('connection', async (socket) => {
    logInfo(`New client connected: ${socket.id}`);
    
    // Send initial snapshot
    const initialData = await getMatchesFromRedis();
    socket.emit('matches_update', initialData);
    
    socket.on('disconnect', () => {
        logInfo(`Client disconnected: ${socket.id}`);
    });
});

// Subscribe to channels from ingestor
sub.subscribe('matches_delta', 'time_sync', (err, count) => {
    if (err) {
        logError("Failed to subscribe to Redis channels: " + err.message);
    } else {
        logInfo(`Subscribed successfully to ${count} Redis channels.`);
    }
});

sub.on('message', async (channel, message) => {
    if (channel === 'matches_delta') {
        const delta = JSON.parse(message);
        io.emit('matches_delta', delta);
    } 
    else if (channel === 'time_sync') {
        io.emit('time_sync', JSON.parse(message));
    }
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[BROADCASTER & API] Server running on http://0.0.0.0:${PORT}`);
});
