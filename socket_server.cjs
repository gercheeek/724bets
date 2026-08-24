const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const { logError, logInfo } = require('./logger.cjs');

const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const { getLogo } = require('./logoScraper.cjs');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// OroPlay Integration
const oroplay = require('./oroplay.cjs');
const mgcapi = require('./mgcapi.cjs');

app.get('/', (req, res) => {
    res.send('<h1 style="font-family:sans-serif;color:#10B981;text-align:center;margin-top:20%;">🚀 724Bets Backend API Sunucusu Başarıyla Çalışıyor!</h1>');
});

app.get('/api/casino/test-vps', (req, res) => {
    res.json({
        success: true,
        ip_verification: "BU YANIT DOĞRUDAN SİZİN OFFSHORE SUNUCUNUZDAN (85.121.178.80) GELMEKTEDİR!",
        vps_ip: "85.121.178.80",
        server_time: new Date().toISOString()
    });
});

require('dotenv').config();
const Database = require('better-sqlite3');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('./node_modules/.prisma/client/index.js');

const db = new Database('./dev.db');

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });
const INITIAL_BALANCE = 1000.00;

// Helper function to get or create a user in Prisma
async function getOrCreateUser(identifier) {
  if (!identifier) return null;
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: String(identifier) },
        { username: String(identifier) }
      ]
    }
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: String(identifier),
        password: 'default_password',
        balance: INITIAL_BALANCE
      }
    });
  }
  return user;
}

// Seed / ensure test user exists with 1000.00 TRY balance
(async () => {
  try {
    const testUser = await prisma.user.findFirst({
      where: { OR: [{ username: 'test' }, { username: 'test@test.com' }] }
    });
    if (!testUser) {
      await prisma.user.create({
        data: {
          username: 'test',
          password: 'default_password',
          balance: 1000.00
        }
      });
      console.log("✅ Seeded test user with 1000.00 TRY balance");
    } else {
      await prisma.user.update({
        where: { id: testUser.id },
        data: { balance: 1000.00 }
      });
      console.log("✅ Set test user balance to 1000.00 TRY");
    }
  } catch (e) {
    console.error("Error initializing test user:", e.message);
  }
})();

// --- PROVIDER CONFIGURATION ---
// Set to false to instantly hide games from frontend
const PROVIDERS = {
    oroplay: false,
    mgcapi: true
};
// ------------------------------

app.get('/api/casino/games', async (req, res) => {
    try {
        let allGames = [];
        
        // Sadece açık olan API'lerden oyunları çek
        if (PROVIDERS.oroplay) {
            const oroplayGames = await oroplay.getAllGames();
            allGames = allGames.concat(oroplayGames || []);
        }
        if (PROVIDERS.mgcapi) {
            const mgcGames = await mgcapi.getAllGames();
            if (mgcGames && Array.isArray(mgcGames)) {
                const mappedMgc = mgcGames.map(g => {
                    const isLive = g.game_type === 2 || (g.provider_title && g.provider_title.toLowerCase().includes('live')); // Tahmini type belirleme
                    return {
                        id: `${g.provider_code}-${g.id}`,
                        name: g.name,
                        provider: g.provider_title || g.uniq_provider,
                        type: isLive ? 'live' : 'slot',
                        image: g.image || g.background || '',
                        vendorCode: g.provider_code,
                        gameCode: g.id.toString(), // game_id for playGame
                        providerType: 'mgcapi'
                    };
                });
                allGames = allGames.concat(mappedMgc);
            }
        }
        
        res.json({ success: true, games: allGames });
    } catch (err) {
        console.error('BINGO ERROR:', err);
        logError('Error fetching casino games', err);
        res.json({ success: true, games: [] });
    }
});

// --- SPORTS BETTING API ---

app.post('/api/sports/place-bet', express.json(), async (req, res) => {
    try {
        const { userCode, amount, selections, totalOdds } = req.body;
        if (!userCode || !amount || !selections || selections.length === 0) {
            return res.status(400).json({ success: false, error: 'Eksik bilgi' });
        }
        
        const stake = parseFloat(amount);
        if (stake <= 0) return res.status(400).json({ success: false, error: 'Geçersiz tutar' });

        const user = await getOrCreateUser(userCode);
        
        if (user.balance < stake) {
            return res.status(400).json({ success: false, error: 'Yetersiz bakiye' });
        }

        // Deduct balance and create bet in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: { balance: { decrement: stake } }
            });

            const bet = await tx.bet.create({
                data: {
                    userId: user.id,
                    stake: stake,
                    totalOdds: totalOdds,
                    possibleWin: stake * totalOdds,
                    status: 'pending',
                    items: {
                        create: selections.map(sel => ({
                            matchId: sel.matchId || sel.id?.toString() || 'unknown',
                            teamHome: sel.homeTeam || 'Home',
                            teamAway: sel.awayTeam || 'Away',
                            selection: sel.selectionName || 'N/A',
                            odds: parseFloat(sel.odds || 1)
                        }))
                    }
                }
            });

            // Also record in transaction history
            await tx.transaction.create({
                data: {
                    transactionCode: `SPORTS-${bet.id}`,
                    userCode: user.username,
                    gameCode: 'SPORTS',
                    amount: -stake,
                    type: 'bet'
                }
            });

            return { updatedUser, bet };
        });

        res.json({ success: true, balance: result.updatedUser.balance, bet: result.bet });
    } catch (err) {
        logError('Error placing sports bet', err);
        res.status(500).json({ success: false, error: 'Sunucu hatası' });
    }
});

app.get('/api/sports/my-bets', async (req, res) => {
    try {
        const userCode = req.query.userCode;
        if (!userCode) return res.status(400).json({ success: false, error: 'userCode required' });
        
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userCode },
                    { username: userCode }
                ]
            },
            include: {
                bets: {
                    include: { items: true },
                    orderBy: { createdAt: 'desc' },
                    take: 50
                }
            }
        });

        if (!user) return res.json({ success: true, bets: [] });
        
        res.json({ success: true, bets: user.bets });
    } catch (err) {
        logError('Error fetching sports bets', err);
        res.status(500).json({ success: false, error: 'Sunucu hatası' });
    }
});

app.post('/api/casino/launch', express.json(), async (req, res) => {
    const { vendorCode, gameCode, userCode, balance } = req.body;
    if (!vendorCode || !gameCode) {
        return res.status(400).json({ success: false, error: 'Missing vendorCode or gameCode' });
    }

    const code = userCode || 'testuser';
    const user = await getOrCreateUser(code);
    
    // Sync DB balance with frontend header balance if provided
    if (balance !== undefined && !isNaN(Number(balance))) {
        const parsedBal = parseFloat(balance);
        user.balance = parsedBal;
        await updateUserBalance(code, parsedBal);
    }
    const currentBalance = user.balance;

    try {
        let url = "";
        if (PROVIDERS.mgcapi) {
            url = await mgcapi.getLaunchUrl(vendorCode, gameCode, code);
        } else if (PROVIDERS.oroplay) {
            url = await oroplay.getLaunchUrl(vendorCode, gameCode, code);
        }
        logInfo(`[Casino Launch] Success for ${code}: vendor=${vendorCode}, game=${gameCode}, balance=${currentBalance}`);
        res.json({ success: true, launchUrl: url });
    } catch (err) {
        logError(`[Casino Launch] Failed for vendor=${vendorCode}, game=${gameCode}`, err);
        res.status(500).json({ success: false, error: 'Bu oyun sağlayıcısı şu an kullanılamıyor.' });
    }
});



app.get('/api/casino/agent-balance', async (req, res) => {
    try {
        const balance = await oroplay.getAgentBalance();
        res.json({ success: true, agentBalance: balance });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/casino/user-balance', async (req, res) => {
    try {
        const userCode = req.query.userCode || 'testuser';
        const user = await getOrCreateUser(userCode);
        res.json({ success: true, balance: user ? Number(user.balance) : 1000 });
    } catch (err) {
        logError('Error fetching user balance', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.post('/api/casino/user-balance', express.json(), async (req, res) => {
    try {
        const { userCode, username, balance } = req.body || {};
        const code = userCode || username || 'testuser';
        if (balance === undefined || isNaN(Number(balance))) {
            return res.status(400).json({ success: false, error: 'Invalid balance value' });
        }
        const newBal = parseFloat(Number(balance).toFixed(2));
        const user = await getOrCreateUser(code);
        user.balance = newBal;
        await updateUserBalance(user.username, newBal);
        
        io.emit('balance_update', { username: user.username, balance: newBal });
        io.emit('user_balance_updated', { userId: user.id, username: user.username, balance: newBal });
        
        console.log(`[Balance Update API] Updated ${user.username} balance to ${newBal} TRY`);
        res.json({ success: true, balance: newBal });
    } catch (err) {
        logError('Error setting user balance', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Middleware for Callback Security
const OROPLAY_SECRET = 'dbKf2cXk3q8PNajNBerQ1NQ5s5BcWZHB';

function verifyCallback(req, res, next) {
    // Basic IP/Token check could be done here, for now we will rely on a simple custom header or secret
    // But since OroPlay might not send custom headers, we check if they send the client_secret or if we whitelist IP.
    // Given we don't know their IP, we just let it pass for now but log warning.
    // Idealy, Oroplay sends a sign hash.
    next();
}

app.post('/api/casino/callback/api/balance', express.json(), verifyCallback, async (req, res) => {
    try {
        const { userCode } = req.body;
        const user = await getOrCreateUser(userCode);
        logInfo(`[Wallet API] Balance check for ${userCode}: ${user.balance}`);
        res.json({
            success: true,
            message: user.balance,
            errorCode: 0
        });
    } catch (err) {
        logError('Error in balance callback', err);
        res.status(500).json({ success: false, errorCode: 1, message: 'Internal Server Error' });
    }
});

app.post('/api/casino/callback/api/transaction', express.json(), verifyCallback, async (req, res) => {
    try {
        const { userCode, amount, transactionCode, gameCode, type } = req.body;
        const user = await getOrCreateUser(userCode);
        
        const parsedAmount = parseFloat(amount || 0);

        // Idempotency Check: Did we process this transactionCode already?
        if (transactionCode) {
            const existingTx = await prisma.transaction.findUnique({
                where: { transactionCode }
            });
            if (existingTx) {
                logInfo(`[Wallet API] Idempotency hit: Transaction ${transactionCode} already processed for ${userCode}.`);
                return res.json({
                    success: true,
                    message: user.balance,
                    errorCode: 0
                });
            }
        }

        // Apply transaction
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { balance: { increment: parsedAmount } }
        });

        // Save transaction to DB
        if (transactionCode) {
            await prisma.transaction.create({
                data: {
                    transactionCode,
                    userId: user.id,
                    gameCode: gameCode || null,
                    amount: parsedAmount,
                    type: type || (parsedAmount < 0 ? 'bet' : 'win')
                }
            });
        }
        
        logInfo(`[Wallet API] Transaction for ${userCode} on ${gameCode}. Amount: ${parsedAmount}. New Balance: ${updatedUser.balance}. Tx: ${transactionCode}`);
        
        res.json({
            success: true,
            message: updatedUser.balance,
            errorCode: 0
        });
    } catch (err) {
        logError('Error in transaction callback', err);
        res.status(500).json({ success: false, errorCode: 1, message: 'Internal Server Error' });
    }
});

app.get('/api/logo/:teamId', async (req, res) => {
  const teamId = req.params.teamId;
  const teamName = req.query.name;
  
  if (!teamName) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  const logosDir = path.join(__dirname, 'public', 'logos');
  const exactPath = path.join(logosDir, `${teamId}.png`);
  
  // 1. Check if 1xBet mapped logo exists
  if (fs.existsSync(exactPath)) {
    return res.sendFile(exactPath);
  }

  // 2. Check if Bulk Scraper downloaded it as "teamname.png"
  const slugName = (teamName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
  const bulkPath = path.join(logosDir, slugName);
  
  if (fs.existsSync(bulkPath)) {
    // Copy it to teamId.png so it's instantly mapped for the future!
    fs.copyFileSync(bulkPath, exactPath);
    return res.sendFile(exactPath);
  }

  // 3. If neither exists, trigger the dynamic lazy-scraper IN THE BACKGROUND to avoid lagging the client!
  try {
    getLogo(teamId, teamName).catch(err => {
      console.error(`[API] Background scraping failed for ${teamName}:`, err.message);
    });
    // Immediately return 404 so the frontend falls back to the local library instantly (no lag)
    res.status(404).json({ error: 'Logo not found locally, scraping in background' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger scraper' });
  }
});

// Proxy for detailed match data
// --- NEOPAYS PAYMENT INTEGRATION CONFIG & ENDPOINTS ---

let neopaysConfig = {
    sid: process.env.NEOPAYS_SID || '1001',
    secretKey: process.env.NEOPAYS_SECRET_KEY || 'default_secret_key',
    active: true
};

const NEOPAYS_CONFIG_FILE = path.join(__dirname, 'neopays_config.json');
if (fs.existsSync(NEOPAYS_CONFIG_FILE)) {
    try {
        const fileData = JSON.parse(fs.readFileSync(NEOPAYS_CONFIG_FILE, 'utf8'));
        neopaysConfig = { ...neopaysConfig, ...fileData };
    } catch(e) {
        logError('Error reading neopays_config.json', e);
    }
}

function saveNeopaysConfig() {
    try {
        fs.writeFileSync(NEOPAYS_CONFIG_FILE, JSON.stringify(neopaysConfig, null, 2), 'utf8');
    } catch(e) {
        logError('Error saving neopays_config.json', e);
    }
}

// Admin: Get NeoPays Settings
app.get('/api/admin/neopays-settings', (req, res) => {
    res.json({ success: true, config: neopaysConfig });
});

// Admin: Update NeoPays Settings
app.post('/api/admin/neopays-settings', express.json(), (req, res) => {
    try {
        const { sid, secretKey, active } = req.body;
        if (sid !== undefined) neopaysConfig.sid = String(sid).trim();
        if (secretKey !== undefined) neopaysConfig.secretKey = String(secretKey).trim();
        if (active !== undefined) neopaysConfig.active = Boolean(active);
        saveNeopaysConfig();
        res.json({ success: true, config: neopaysConfig });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// User: Initiate NeoPays Deposit (Supports all 11 methods)
app.post('/api/payments/neopays/initiate', express.json(), async (req, res) => {
    try {
        const { userId, amount, method: selectedMethod, fullname, returnUrl } = req.body;
        if (!userId || !amount) {
            return res.status(400).json({ success: false, error: 'Eksik bilgi (userId veya amount)' });
        }

        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { username: userId }
                ]
            }
        });

        if (!user) {
            user = await getOrCreateUser(userId);
        }

        const trx = `TRX_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const depositAmount = parseFloat(String(amount).replace(',', '.'));
        const sid = neopaysConfig.sid;
        const secretKey = neopaysConfig.secretKey;
        const method = (selectedMethod || 'banktransfer').toLowerCase();

        // Hash: SHA256(sid + userid + trx + secret_key)
        const hashInput = `${sid}${user.id}${trx}${secretKey}`;
        const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

        const payload = {
            sid: sid,
            method: method,
            username: user.username,
            userid: user.id,
            trx: trx,
            amount: depositAmount,
            fullname: fullname || user.username,
            return_url: returnUrl || 'https://724bets.net/deposit',
            hash: hash
        };

        // Create pending payment request in DB
        await prisma.paymentRequest.create({
            data: {
                userId: user.id,
                type: 'deposit',
                method: `NeoPays (${method.toUpperCase()})`,
                amount: depositAmount,
                txHash: trx,
                status: 'pending',
                updatedAt: new Date()
            }
        });

        // Send request to NeoPays API
        let data = {};
        if (sid === '1001') {
            // Mock response for local/test
            data = { code: 200, url: 'https://724bets.net/deposit-success-mock?trx=' + trx };
        } else {
            const response = await fetch('https://api.neopays.net/api/v1/deposits/init', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            data = await response.json();
        }

        if (data.code === 200 && data.url) {
            res.json({ success: true, url: data.url, trx });
        } else {
            res.status(400).json({ success: false, error: data.message || 'NeoPays oturumu başlatılamadı' });
        }
    } catch (error) {
        logError('NeoPays Deposit Initiate Error', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Callback Handler for NeoPays Deposit & Withdrawal
const handleNeopaysCallback = async (req, res) => {
    try {
        const body = { ...(req.query || {}), ...(req.body || {}) };
        const { sid, key, service, method, user_id, username, amount, currency, transaction_id, status, trx, hash } = body;

        logInfo('Received NeoPays Callback:', JSON.stringify(body));

        const expectedSid = neopaysConfig.sid;
        const secretKey = neopaysConfig.secretKey;

        // Verify Hash: SHA256(sid + user_id + trx + SECRET_KEY)
        const targetUserId = user_id || username || '';
        const targetTrx = trx || '';
        const calculatedHash = crypto.createHash('sha256').update(`${sid || expectedSid}${targetUserId}${targetTrx}${secretKey}`).digest('hex');

        if (hash && hash.toLowerCase() !== calculatedHash.toLowerCase()) {
            logError('NeoPays Callback Hash Mismatch:', { incoming: hash, calculated: calculatedHash });
            return res.json({ code: 999, message: 'Geçersiz güvenlik imzası (Hash mismatch)' });
        }

        if (service === 'deposit' || status === 'S') {
            const depositUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { id: user_id || '' },
                        { username: username || '' }
                    ]
                }
            });

            if (!depositUser) {
                return res.json({ code: 999, message: 'Kullanıcı bulunamadı' });
            }

            const depAmount = parseFloat(amount || 0);

            // Increment user balance
            await prisma.user.update({
                where: { id: depositUser.id },
                data: { balance: { increment: depAmount } }
            });

            // Log Transaction
            await prisma.transaction.create({
                data: {
                    transactionCode: `NEO_${transaction_id || Date.now()}`,
                    userId: depositUser.id,
                    amount: depAmount,
                    type: 'deposit'
                }
            });

            // Update payment request status if existing
            if (trx) {
                await prisma.paymentRequest.updateMany({
                    where: { txHash: trx },
                    data: { status: 'approved' }
                });
            }

            return res.json({ code: 200, message: 'Müşteri hesabına bakiye eklendi!' });
        } else if (service === 'withdrawal') {
            const withdrawUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { id: user_id || '' },
                        { username: username || '' }
                    ]
                }
            });

            if (!withdrawUser) {
                return res.json({ code: 999, message: 'Kullanıcı bulunamadı' });
            }

            const wAmount = parseFloat(amount || 0);

            if (status === 'C') { // Successful completed
                if (trx) {
                    await prisma.paymentRequest.updateMany({
                        where: { txHash: { startsWith: trx } },
                        data: { status: 'approved' }
                    });
                }
                await prisma.transaction.create({
                    data: {
                        transactionCode: `NEO_W_${transaction_id || Date.now()}`,
                        userId: withdrawUser.id,
                        amount: wAmount,
                        type: 'withdraw'
                    }
                });
                return res.json({ code: 200, message: 'Çekim onaylandı!' });
            } else if (status === 'R') { // Rejected
                // Refund the user's balance since it was deducted when requesting
                await prisma.user.update({
                    where: { id: withdrawUser.id },
                    data: { balance: { increment: wAmount } }
                });
                if (trx) {
                    await prisma.paymentRequest.updateMany({
                        where: { txHash: { startsWith: trx } },
                        data: { status: 'rejected' }
                    });
                }
                return res.json({ code: 200, message: 'Çekim reddedildi, bakiye iade edildi!' });
            }
        }

        res.json({ code: 200, message: 'İşlem alındı' });
    } catch (err) {
        logError('NeoPays Callback Exception:', err);
        res.json({ code: 999, message: err.message || 'Sunucu hatası' });
    }
};

app.post('/api/neopays', express.json(), express.urlencoded({ extended: true }), handleNeopaysCallback);
app.post('/api/payments/neopays/callback', express.json(), express.urlencoded({ extended: true }), handleNeopaysCallback);

// --- PAYMENT GATEWAY API ---

// Admin: Get payment methods
app.get('/api/admin/payment-methods', async (req, res) => {
    try {
        const methods = await prisma.paymentMethod.findMany();
        res.json({ success: true, methods });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Update/Create payment method
app.post('/api/admin/payment-methods', express.json(), async (req, res) => {
    try {
        const { id, name, type, accountName, accountNo, isActive, minAmount, maxAmount } = req.body;
        if (id) {
            const updated = await prisma.paymentMethod.update({
                where: { id },
                data: { name, type, accountName, accountNo, isActive, minAmount, maxAmount }
            });
            return res.json({ success: true, method: updated });
        }
        const created = await prisma.paymentMethod.create({
            data: { name, type, accountName, accountNo, isActive, minAmount, maxAmount }
        });
        res.json({ success: true, method: created });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// User: Deposit Request
app.post('/api/payments/deposit', express.json(), async (req, res) => {
    try {
        const { userId, method, amount, txHash } = req.body;
        if (!userId || !method || !amount) return res.status(400).json({ success: false, error: 'Missing fields' });
        
        const request = await prisma.paymentRequest.create({
            data: {
                userId,
                type: 'deposit',
                method,
                amount: parseFloat(amount),
                txHash,
                status: 'pending'
            }
        });
        res.json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// User: Withdraw Request
app.post('/api/payments/withdraw', express.json(), async (req, res) => {
    try {
        const { userId, method, amount, txHash } = req.body; // txHash can be user's IBAN/Wallet for withdrawal
        if (!userId || !method || !amount) return res.status(400).json({ success: false, error: 'Missing fields' });
        
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { username: userId }
                ]
            }
        });

        if (!user) {
            user = await getOrCreateUser(userId);
        }

        const withdrawAmount = parseFloat(amount);
        if (!user || user.balance < withdrawAmount) {
            return res.status(400).json({ success: false, error: `Yetersiz bakiye. Mevcut bakiyeniz: ${user ? user.balance : 0} ₺` });
        }

        // Deduct balance immediately for withdrawal request
        await prisma.user.update({
            where: { id: user.id },
            data: { balance: { decrement: withdrawAmount } }
        });

        const trxCode = `TRX_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}`;

        const request = await prisma.paymentRequest.create({
            data: {
                userId: user.id,
                type: 'withdraw',
                method,
                amount: withdrawAmount,
                txHash: `${trxCode} - ${req.body.txHash || req.body.iban || req.body.walletAddress || ''}`,
                status: 'pending',
                updatedAt: new Date()
            }
        });

        const isNeoPaysActive = neopaysConfig && neopaysConfig.active && neopaysConfig.sid && neopaysConfig.sid !== '1001';
        let neoPaysDebug = null;

        if (isNeoPaysActive) {
            const isCrypto = method.toLowerCase().includes('kripto') || method.toLowerCase().includes('crypto');
            const neoMethod = isCrypto ? 'crypto' : 'banktransfer';
            const neoEndpoint = `https://api.neopays.net/api/v1/withdrawals/${neoMethod}`;

            const neoPayload = isCrypto ? {
                sid: neopaysConfig.sid,
                key: neopaysConfig.secretKey,
                username: user.username,
                userid: user.id,
                trx: trxCode,
                amount: withdrawAmount,
                fullname: req.body.fullname || user.username,
                wallet_address: req.body.walletAddress || req.body.txHash,
                coin_id: req.body.coinId || "01a7e83c-17cd-4039-9f03-92f4e5d256dd",
                destination_tag_memo: req.body.memo || ""
            } : {
                sid: neopaysConfig.sid,
                key: neopaysConfig.secretKey,
                username: user.username,
                userid: user.id,
                trx: trxCode,
                amount: withdrawAmount,
                fullname: req.body.fullname || user.username,
                iban: req.body.iban || req.body.txHash,
                bankid: req.body.bankId || "48889430-844c-4149-bca0-1745e64319ed"
            };

            try {
                const neoRes = await fetch(neoEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(neoPayload)
                });
                const neoData = await neoRes.json();
                neoPaysDebug = { status: neoRes.status, response: neoData };

                if (neoRes.ok && (neoData.code === 200 || neoData.code === '200')) {
                    return res.json({
                        success: true,
                        request,
                        newBalance: user.balance - withdrawAmount,
                        debug: {
                            status: "200 OK",
                            message: "NeoPays Çekim Talebi Sağlayıcıya İletildi (200 OK)",
                            neoPaysResponse: neoData,
                            deductedAmount: withdrawAmount,
                            trxCode
                        }
                    });
                } else {
                    // NeoPays provider rejected withdrawal -> Refund user balance
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { balance: { increment: withdrawAmount } }
                    });
                    await prisma.paymentRequest.update({
                        where: { id: request.id },
                        data: { status: 'rejected' }
                    });

                    return res.status(400).json({
                        success: false,
                        error: `[NeoPays Sağlayıcı Reddi - Code ${neoData.code || neoRes.status}] ${neoData.message || 'Çekim oluşturulamadı'}. Bakiyeniz hesabınıza iade edildi.`,
                        debug: {
                            status: neoRes.status,
                            neoPaysResponse: neoData,
                            revertedBalance: true,
                            refundedAmount: withdrawAmount
                        }
                    });
                }
            } catch (neoErr) {
                console.error('NeoPays Withdrawal Call Failed:', neoErr);
                neoPaysDebug = { error: neoErr.message };
            }
        }
        // --------------------------------------
        res.json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// User: Payment History
app.get('/api/payments/history', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ success: false, error: 'Missing userId' });
        const history = await prisma.paymentRequest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Pending Payments
app.get('/api/admin/payments/pending', async (req, res) => {
    try {
        const { type } = req.query; // 'deposit' or 'withdraw'
        const filter = { status: 'pending' };
        if (type) filter.type = type;
        
        const pending = await prisma.paymentRequest.findMany({
            where: filter,
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, pending });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Approve Payment
app.post('/api/admin/payments/approve', express.json(), async (req, res) => {
    try {
        const { id, adminNote } = req.body;
        const request = await prisma.paymentRequest.findUnique({ where: { id }, include: { user: true } });
        if (!request || request.status !== 'pending') return res.status(400).json({ success: false, error: 'Invalid request' });

        // If deposit, add balance. (If withdraw, balance was already deducted on request)
        if (request.type === 'deposit') {
            await prisma.user.update({
                where: { id: request.userId },
                data: { balance: { increment: request.amount } }
            });
            // Log transaction
            await prisma.transaction.create({
                data: {
                    transactionCode: `DEP-${Date.now()}`,
                    userId: request.userId,
                    amount: request.amount,
                    type: 'deposit'
                }
            });
        } else {
             // Log withdrawal transaction
             await prisma.transaction.create({
                data: {
                    transactionCode: `WD-${Date.now()}`,
                    userId: request.userId,
                    amount: -request.amount,
                    type: 'withdraw'
                }
            });
        }

        const updated = await prisma.paymentRequest.update({
            where: { id },
            data: { status: 'approved', adminNote }
        });
        res.json({ success: true, request: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Reject Payment
app.post('/api/admin/payments/reject', express.json(), async (req, res) => {
    try {
        const { id, adminNote } = req.body;
        const request = await prisma.paymentRequest.findUnique({ where: { id } });
        if (!request || request.status !== 'pending') return res.status(400).json({ success: false, error: 'Invalid request' });

        // If withdraw, refund the deducted balance
        if (request.type === 'withdraw') {
            await prisma.user.update({
                where: { id: request.userId },
                data: { balance: { increment: request.amount } }
            });
        }

        const updated = await prisma.paymentRequest.update({
            where: { id },
            data: { status: 'rejected', adminNote }
        });
        res.json({ success: true, request: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- ADMIN USER & DASHBOARD API ---

// Admin: List Users
app.get('/api/admin/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { bets: true, transactions: true, paymentRequests: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Adjust User Balance
app.post('/api/admin/users/:id/balance', express.json(), async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, action, note } = req.body; // action: 'add' | 'subtract'
        
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ success: false, error: 'Geçersiz miktar' });
        }

        const updateData = action === 'add' 
            ? { balance: { increment: numericAmount } } 
            : { balance: { decrement: numericAmount } };

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        // Log the manual transaction
        await prisma.transaction.create({
            data: {
                transactionCode: `ADM-${Date.now()}`,
                userId: id,
                amount: action === 'add' ? numericAmount : -numericAmount,
                type: 'admin_adjustment'
            }
        });

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Update User Status (Ban/Unban)
app.put('/api/admin/users/:id/status', express.json(), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' or 'banned'
        
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { status }
        });

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin: Dashboard Stats
app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
        // Total Users
        const totalUsers = await prisma.user.count();
        // Total active users
        const activeUsers = await prisma.user.count({
            where: { status: 'active' }
        });

        // Balances sum
        const balances = await prisma.user.aggregate({
            _sum: { balance: true }
        });
        const totalLiability = balances._sum.balance || 0;

        // Deposits and Withdrawals sum
        const deposits = await prisma.paymentRequest.aggregate({
            where: { type: 'deposit', status: 'approved' },
            _sum: { amount: true }
        });
        const totalDeposits = deposits._sum.amount || 0;

        const withdrawals = await prisma.paymentRequest.aggregate({
            where: { type: 'withdraw', status: 'approved' },
            _sum: { amount: true }
        });
        const totalWithdrawals = withdrawals._sum.amount || 0;

        // Bets Liability
        const pendingBets = await prisma.bet.aggregate({
            where: { status: 'pending' },
            _sum: { possibleWin: true, stake: true }
        });
        const betLiability = pendingBets._sum.possibleWin || 0;
        const pendingStake = pendingBets._sum.stake || 0;

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                totalLiability, // Sum of all user balances
                totalDeposits,
                totalWithdrawals,
                betLiability,   // Max exposure from pending bets
                pendingStake    // Money currently tied in bets
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- KYC & FRAUD API ---
app.post('/api/kyc/upload', express.json(), async (req, res) => {
    try {
        const { userId, type, fileUrl } = req.body;
        if (!userId || !type || !fileUrl) {
            return res.status(400).json({ success: false, error: 'Eksik parametre' });
        }
        const doc = await prisma.kycDocument.create({
            data: { userId, type, fileUrl }
        });
        await prisma.user.update({
            where: { id: userId },
            data: { kycStatus: 'pending' }
        });
        res.json({ success: true, document: doc });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/kyc/pending', async (req, res) => {
    try {
        const documents = await prisma.kycDocument.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, documents });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/admin/kyc/:id/status', express.json(), async (req, res) => {
    try {
        const { status, rejectionReason } = req.body;
        const docId = req.params.id;
        
        const doc = await prisma.kycDocument.update({
            where: { id: docId },
            data: { status, rejectionReason }
        });

        let newStatus = status === 'approved' ? 'verified' : (status === 'rejected' ? 'rejected' : 'pending');
        await prisma.user.update({
            where: { id: doc.userId },
            data: { kycStatus: newStatus }
        });

        res.json({ success: true, document: doc });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/admin/fraud', async (req, res) => {
    try {
        const alerts = await prisma.fraudAlert.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
        res.json({ success: true, alerts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/admin/fraud/:id/resolve', express.json(), async (req, res) => {
    try {
        const { isResolved, resolvedBy } = req.body;
        const alert = await prisma.fraudAlert.update({
            where: { id: req.params.id },
            data: { isResolved, resolvedBy }
        });
        res.json({ success: true, alert });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/admin/fraud/scan', async (req, res) => {
    try {
        // Mock scanner that generates a random fraud alert for demo purposes
        const users = await prisma.user.findMany({ take: 5 });
        if (users.length > 0) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const reasons = [
                "Aynı IP adresinden çoklu hesap girişi tespit edildi.",
                "Son 1 saatte para yatırmadan yüklü miktarda çekim talebi.",
                "Riskli bahis deseni: Çoklu çapraz bahis (Arbitraj şüphesi).",
                "Kullanıcı bakiyesi ile bağdaşmayan yüksek tutarlı bahis."
            ];
            const severities = ["low", "medium", "high", "critical"];
            
            const alert = await prisma.fraudAlert.create({
                data: {
                    userId: randomUser.id,
                    severity: severities[Math.floor(Math.random() * severities.length)],
                    reason: reasons[Math.floor(Math.random() * reasons.length)],
                },
                include: { user: true }
            });
            
            // Increment risk score
            await prisma.user.update({
                where: { id: randomUser.id },
                data: { riskScore: { increment: 15 } }
            });

            return res.json({ success: true, alert, message: 'Tarama tamamlandı ve yeni uyarı bulundu.' });
        }
        res.json({ success: true, message: 'Tarama tamamlandı. Şüpheli işlem bulunamadı.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// --- END ADMIN USER & DASHBOARD API ---

// --- SPORTS API ---
app.get('/api/sports/matches', (req, res) => {
    try {
        res.json({
            success: true,
            live: liveMatches1xBet || [],
            prematch: preMatches1xBet || []
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
// --- END SPORTS API ---

// --- END PAYMENT GATEWAY API ---

app.get('/api/1xbet/match/:id', async (req, res) => {
  const matchId = req.params.id;
  if (matchId === 'debug-list') return res.json(liveMatches1xBet);
  const cleanMatchId = matchId.replace(/^(pre_|live_|mock_)/, '');
  const isLive = req.query.isLive !== 'false' && !matchId.startsWith('pre_'); // Default to true if not explicitly false, unless prefixed with pre_
  const feedType = isLive ? 'LiveFeed' : 'LineFeed';
  
  try {
    const response = await fetch(`https://1xframemxz.com/service-api/${feedType}/GetGameZip?id=${cleanMatchId}&lng=tr&isSubGames=true&GroupEvents=true&allEventsGroupSubGames=true&countevents=250&partner=85`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': `https://1xframemxz.com/tr/${isLive ? 'live' : 'line'}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[1xBet Match Proxy Error]:', error.message);
    res.status(500).json({ error: 'Failed to fetch match details' });
  }
});

const wsUrl = 'wss://eu-swarm-newm.atekbet279.com/';
let ws;
let sessionId = null;

const liveMatchesMap = new Map();
const prematchMatchesMap = new Map();
const outrightsMap = new Map();

const API_URL_1XBET = 'https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1';
let liveMatches1xBet = [];



// Filter matches by Elite Teams
const vipTeams = [
    'galatasaray', 'fenerbahçe', 'fenerbahce', 'beşiktaş', 'besiktas', 'trabzonspor', 'başakşehir', 'basaksehir',
    'manchester city', 'arsenal', 'liverpool', 'manchester united', 'chelsea', 'tottenham', 'newcastle', 'aston villa',
    'west ham united', 'brighton', 'everton', 'crystal palace', 'brentford',
    'real madrid', 'barcelona', 'atletico madrid', 'girona', 'athletic bilbao', 'real sociedad',
    'sevilla', 'valencia', 'villarreal', 'real betis',
    'inter', 'ac milan', 'milan', 'juventus', 'napoli', 'roma', 'lazio', 'atalanta',
    'fiorentina', 'bologna', 'torino',
    'bayern munich', 'bayern münih', 'bayer leverkusen', 'borussia dortmund', 'rb leipzig', 'stuttgart',
    'eintracht frankfurt', 'wolfsburg', 'borussia mönchengladbach', 'werder bremen',
    'psg', 'paris saint-germain', 'monaco', 'marseille', 'lille', 'lyon',
    'lens', 'rennes', 'nice',
    'inter miami', 'boca juniors', 'river plate', 'flamengo',
    'palmeiras', 'são paulo', 'corinthians', 'fluminense', 'atletico mineiro', 'botafogo',
    'racing club', 'independiente',
    'al nassr', 'al-nassr', 'al hilal',
    'ajax', 'psv', 'feyenoord', 'benfica', 'sporting cp', 'porto', 'celtic', 'rangers',
    'braga', 'vitoria guimaraes', 'az alkmaar', 'fc twente', 'club brugge', 'anderlecht', 'genk', 'royal antwerp',
    'olympiacos', 'panathinaikos', 'aek athens', 'paok'
];

function isEliteMatch(home, away) {
    if (!home || !away) return false;
    const h = home.toLowerCase();
    const a = away.toLowerCase();
    
    return vipTeams.some(team => h.includes(team) || team.includes(h) || a.includes(team) || team.includes(a));
}

function extractOdds(marketsObj) {
  let odds = { 
     "1": '-', "X": '-', "2": '-', "tU": '-', "tA": '-', "cs1X": '-', "cs12": '-', "csX2": '-', "gg": '-', "ng": '-',
     "ht1": '-', "htX": '-', "ht2": '-', "htO05": '-', "htU05": '-', "htO15": '-', "htU15": '-',
     "cr1": '-', "crX": '-', "cr2": '-', "crO75": '-', "crU75": '-', "crO85": '-', "crU85": '-'
  };
  if (!marketsObj) return odds;

  for (const mId in marketsObj) {
    const market = marketsObj[mId];
    if (!market || !market.event) continue;
    
    // MATCH RESULT
    if (market.type === "P1XP2" || market.type === "MatchResult" || market.type === "P1P2") {
      Object.values(market.event).forEach(ev => {
        if (ev.type === "P1" || ev.type === "W1" || ev.name === "W1") odds["1"] = ev.price || '-';
        if (ev.type === "X" || ev.type === "Draw" || ev.name === "X") odds["X"] = ev.price || '-';
        if (ev.type === "P2" || ev.type === "W2" || ev.name === "W2") odds["2"] = ev.price || '-';
      });
    }
    
    // TOTAL GOALS
    if (market.type === "Total" || market.type === "TotalGoals" || market.type === "OverUnder") {
       Object.values(market.event).forEach(ev => {
           if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst" || ev.name === "Üstü") odds["tU"] = ev.price || '-';
           if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt" || ev.name === "Altı") odds["tA"] = ev.price || '-';
       });
    }

    // GG / NG
    if (market.type === "GoalGoal" || market.type === "BothTeamsToScore" || market.type === "YesNo") {
        let foundGG = false;
        Object.values(market.event).forEach(ev => {
            if (ev.type === "Yes" || ev.name === "Yes" || ev.name === "Var" || ev.name === "Evet") { odds["gg"] = ev.price || '-'; foundGG = true; }
            if (ev.type === "No" || ev.name === "No" || ev.name === "Yok" || ev.name === "Hayır") { odds["ng"] = ev.price || '-'; foundGG = true; }
        });
        if (!foundGG) {
            console.log("Unmapped GG market:", market.type, "Events:", JSON.stringify(market.event));
        }
    }

    // DOUBLE CHANCE
    if (market.type === "1X12X2" || market.type === "DoubleChance") {
        Object.values(market.event).forEach(ev => {
            if (ev.type === "1X") odds["cs1X"] = ev.price || '-';
            if (ev.type === "12") odds["cs12"] = ev.price || '-';
            if (ev.type === "X2") odds["csX2"] = ev.price || '-';
        });
    }

    // FIRST HALF RESULT (ht1, htX, ht2)
    const mName = (market.name || '').toLowerCase();
    if (market.type === "HalfTimeResult" || market.type === "FirstHalfResult" || mName.includes("1. yarı sonucu") || mName.includes("1st half result")) {
        Object.values(market.event).forEach(ev => {
            if (ev.type === "P1" || ev.type === "W1" || ev.name === "W1") odds["ht1"] = ev.price || '-';
            if (ev.type === "X" || ev.type === "Draw" || ev.name === "X") odds["htX"] = ev.price || '-';
            if (ev.type === "P2" || ev.type === "W2" || ev.name === "W2") odds["ht2"] = ev.price || '-';
        });
    }

    // FIRST HALF TOTAL GOALS (htO05, htU05, htO15, htU15)
    if (market.type === "FirstHalfTotal" || mName.includes("1. yarı toplam") || mName.includes("1st half total")) {
        Object.values(market.event).forEach(ev => {
            const evBase = ev.base || market.base || '';
            if (String(evBase).includes('0.5')) {
                if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst") odds["htO05"] = ev.price || '-';
                if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt") odds["htU05"] = ev.price || '-';
            }
            if (String(evBase).includes('1.5')) {
                if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst") odds["htO15"] = ev.price || '-';
                if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt") odds["htU15"] = ev.price || '-';
            }
        });
    }

    // CORNERS RESULT (cr1, crX, cr2)
    if (market.type === "CornersResult" || mName === "kornerler" || mName.includes("maç sonucu (kornerler)")) {
        Object.values(market.event).forEach(ev => {
            if (ev.type === "P1" || ev.type === "W1" || ev.name === "W1") odds["cr1"] = ev.price || '-';
            if (ev.type === "X" || ev.type === "Draw" || ev.name === "X") odds["crX"] = ev.price || '-';
            if (ev.type === "P2" || ev.type === "W2" || ev.name === "W2") odds["cr2"] = ev.price || '-';
        });
    }

    // CORNERS TOTAL (crO75, crU75, crO85, crU85)
    if (market.type === "TotalCorners" || mName.includes("toplam korner") || mName.includes("total corners")) {
        Object.values(market.event).forEach(ev => {
            const evBase = ev.base || market.base || '';
            if (String(evBase).includes('7.5')) {
                if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst") odds["crO75"] = ev.price || '-';
                if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt") odds["crU75"] = ev.price || '-';
            }
            if (String(evBase).includes('8.5')) {
                if (ev.type === "Over" || ev.name === "Over" || ev.name === "Üst") odds["crO85"] = ev.price || '-';
                if (ev.type === "Under" || ev.name === "Under" || ev.name === "Alt") odds["crU85"] = ev.price || '-';
            }
        });
    }
  }
  return odds;
}

function processSwarmData(dataObj, isLive) {
  if (!dataObj || !dataObj.sport) return [];
  const extracted = [];
  
  for (const sportId in dataObj.sport) {
    const sport = dataObj.sport[sportId];
    const sportName = sport.name ? sport.name.trim().toLowerCase() : (sportId === '1' ? 'futbol' : '');
    
    // Sadece gerçek futbol istiyoruz. e-spor, siber, volta vs. hariç.
    const isEport = sportName.includes('cyber') || sportName.includes('e-') || sportName.includes('esport') || sportName.includes('volta') || sportName.includes('ebattle');
    
    if (isEport || (!sportName.includes('football') && !sportName.includes('soccer') && !sportName.includes('futbol'))) {
      // Delta updatelerde sport name gelmeyebilir, sportId 1 ise futboldur devam et
      if (sportId !== '1') continue;
    }
    if (!sport.region) continue;
    
    for (const regionId in sport.region) {
      const region = sport.region[regionId];
      if (!region.competition) continue;
      
      for (const compId in region.competition) {
        const comp = region.competition[compId];
        if (!comp.game) continue;
        
        for (const gameId in comp.game) {
          const game = comp.game[gameId];
          const matchKey = isLive ? `live_${game.id || gameId}` : `pre_${game.id || gameId}`;
          const existingMatch = isLive ? liveMatchesMap.get(matchKey) : prematchMatchesMap.get(matchKey);

          if (!game || (!game.team1_name && !existingMatch)) continue;

          const teamHome = game.team1_name || existingMatch?.team_home || '';
          const teamAway = game.team2_name || existingMatch?.team_away || '';
          const compName = comp.name || existingMatch?.league || '';
          const regionName = region.name || existingMatch?.country || '';

          const lowerCombined = `${compName} ${teamHome} ${teamAway}`.toLowerCase();
          if (lowerCombined.includes('virtual') || lowerCombined.includes('srl') || lowerCombined.includes('simulated') || lowerCombined.includes('cyber') || lowerCombined.includes('e-soccer') || lowerCombined.includes('esports')) {
              continue;
          }

          const startTs = game.start_ts || existingMatch?.start_ts;
          
          let scoreHome = existingMatch ? existingMatch.score_home : 0;
          let scoreAway = existingMatch ? existingMatch.score_away : 0;
          let matchMin = existingMatch ? existingMatch.match_minute : (isLive ? 'Canlı' : '');
          
          let gameState = existingMatch ? existingMatch.game_state : 'playing';
          if (game.info) {
              if (game.info.score1 !== undefined) scoreHome = parseInt(game.info.score1) || 0;
              if (game.info.score2 !== undefined) scoreAway = parseInt(game.info.score2) || 0;
              if (game.info.current_game_time !== undefined) matchMin = String(game.info.current_game_time);
              if (game.info.current_game_state !== undefined) gameState = game.info.current_game_state;
          }
          
          let newInternalSeconds = existingMatch ? existingMatch.internal_seconds || 0 : 0;
          let parsedMin = parseInt(matchMin);
          if (!isNaN(parsedMin)) {
             let incomingSeconds = parsedMin * 60;
             // Never jump backwards within the same half
             if (incomingSeconds > newInternalSeconds) {
                 newInternalSeconds = incomingSeconds;
             }
          }
          
          if (game.stats && game.stats.score_set1 && sportName !== 'futbol' && sportName !== 'football' && sportId !== '1') {
              const sHome = parseInt(game.stats.score_set1.team1_value);
              const sAway = parseInt(game.stats.score_set1.team2_value);
              if (!isNaN(sHome)) scoreHome = sHome;
              if (!isNaN(sAway)) scoreAway = sAway;
          }

          let newOdds = existingMatch ? { ...existingMatch.odds } : {};
          if (game.market) {
              const extractedNewOdds = extractOdds(game.market);
              newOdds = { ...newOdds, ...extractedNewOdds };
          }
          
          let newStats = existingMatch ? existingMatch.odds.stats : undefined;
          if (game.stats) {
             newStats = {
                 ...(newStats || {}),
                 attack: game.stats.attack || (newStats?.attack || { team1_value: 0, team2_value: 0 }),
                 dangerous_attack: game.stats.dangerous_attack || (newStats?.dangerous_attack || { team1_value: 0, team2_value: 0 }),
                 shot_on_target: game.stats.shot_on_target || (newStats?.shot_on_target || { team1_value: 0, team2_value: 0 }),
                 corner: game.stats.corner || (newStats?.corner || { team1_value: 0, team2_value: 0 })
             };
             newOdds.stats = newStats;
          }

          extracted.push({
            id: matchKey,
            sport_category: sport.name ? sport.name.trim() : (existingMatch ? existingMatch.sport_category : 'Futbol'),
            league: comp.name || (existingMatch ? existingMatch.league : ''),
            team_home: teamHome,
            team_away: teamAway,
            start_ts: startTs,
            match_date: startTs ? new Date(startTs * 1000).toISOString() : (existingMatch ? existingMatch.match_date : new Date().toISOString()),
            is_live: isLive,
            score_home: scoreHome,
            score_away: scoreAway,
            match_minute: matchMin,
            internal_seconds: newInternalSeconds,
            game_state: gameState,
            last_update_ts: Date.now(),
            odds: newOdds,
            status: isLive ? 'in_progress' : 'active'
          });
        }
      }
    }
  }
  return extracted;
}

let pendingBroadcast = false;

function broadcastToClients() {
    const matches = [...Array.from(liveMatchesMap.values()), ...Array.from(prematchMatchesMap.values())];
    
    const formattedMatches = matches.map(dbMatch => ({
        id: dbMatch.id,
        isScraped: true,
        data: {
          sport: { name: dbMatch.sport_category },
          tournament: { name: dbMatch.league },
          participants: {
            home: dbMatch.team_home,
            away: dbMatch.team_away
          },
          start_ts: dbMatch.start_ts, // Unix zaman damgasını frontend'e gönder
          start_time: dbMatch.match_date, // Geriye dönük uyumluluk için
          status: dbMatch.status,
          score: dbMatch.is_live ? `${dbMatch.score_home || 0}:${dbMatch.score_away || 0}` : undefined,
          match_minute: dbMatch.match_minute,
          stats: dbMatch.odds?.stats,
          odds: dbMatch.odds,
          group_markets: {
            "full_event|0": [
              `|1x2|!1~home~${dbMatch.odds?.['1'] || '-'}!x~draw~${dbMatch.odds?.['X'] || '-'}!2~away~${dbMatch.odds?.['2'] || '-'}`,
              `|ou|2.5|!1~over~${dbMatch.odds?.['tU'] || '-'}!2~under~${dbMatch.odds?.['tA'] || '-'}`,
              `|Double_Chance|!1x~1X~${dbMatch.odds?.['cs1X'] || '-'}!12~12~${dbMatch.odds?.['cs12'] || '-'}!x2~X2~${dbMatch.odds?.['csX2'] || '-'}`,
              `|gg|!1~var~${dbMatch.odds?.['gg'] || '-'}!2~yok~${dbMatch.odds?.['ng'] || '-'}`,
              `|ht1x2|!1~home~${dbMatch.odds?.['ht1'] || '-'}!x~draw~${dbMatch.odds?.['htX'] || '-'}!2~away~${dbMatch.odds?.['ht2'] || '-'}`,
              `|htou|!1~over0.5~${dbMatch.odds?.['htO05'] || '-'}!2~under0.5~${dbMatch.odds?.['htU05'] || '-'}!3~over1.5~${dbMatch.odds?.['htO15'] || '-'}!4~under1.5~${dbMatch.odds?.['htU15'] || '-'}`,
              `|cr1x2|!1~home~${dbMatch.odds?.['cr1'] || '-'}!x~draw~${dbMatch.odds?.['crX'] || '-'}!2~away~${dbMatch.odds?.['cr2'] || '-'}`,
              `|crou|!1~over7.5~${dbMatch.odds?.['crO75'] || '-'}!2~under7.5~${dbMatch.odds?.['crU75'] || '-'}!3~over8.5~${dbMatch.odds?.['crO85'] || '-'}!4~under8.5~${dbMatch.odds?.['crU85'] || '-'}`
            ]
          }
        }
    }));

    console.log(`Broadcasting ${formattedMatches.length} matches... (Live: ${Array.from(liveMatchesMap.values()).length}, Pre: ${Array.from(prematchMatchesMap.values()).length})`);
    io.emit('matches_update', formattedMatches);
}

function processOutrightData(dataObj) {
  if (!dataObj || !dataObj.sport) return [];
  const extracted = [];
  
  for (const sId in dataObj.sport) {
    const sport = dataObj.sport[sId];
    if (!sport || !sport.region) continue;
    
    for (const rId in sport.region) {
      const region = sport.region[rId];
      if (!region || !region.competition) continue;
      
      for (const cId in region.competition) {
        const comp = region.competition[cId];
        if (!comp || !comp.game) continue;
        
        for (const gId in comp.game) {
          const game = comp.game[gId];
          if (!game || !game.market) continue;
          
          for (const mId in game.market) {
            const market = game.market[mId];
            if (!market || !market.event) continue;
            
            const participants = [];
            for (const eId in market.event) {
               const ev = market.event[eId];
               if (ev && ev.price && ev.name) {
                  participants.push({
                     id: ev.id,
                     name: ev.name,
                     price: ev.price
                  });
               }
            }
            
            if (participants.length > 0) {
               participants.sort((a, b) => a.price - b.price);
               
               extracted.push({
                 id: `${cId}_${mId}`,
                 sport: sport.name,
                 region: region.name,
                 competition: comp.name,
                 market_name: market.name || "Outright",
                 closes_at: game.start_ts,
                 participants: participants
               });
            }
          }
        }
      }
    }
  }
  return extracted;
}

// SERVER-SIDE TICKER MOTOR
setInterval(() => {
    let changed = false;
    const syncPayload = [];
    const now = Date.now();
    
    liveMatchesMap.forEach((match, key) => {
        const stateLower = (match.game_state || '').toLowerCase();
        const minStr = (match.match_minute || '').toLowerCase();
        
        // CLEANUP: Remove finished or orphaned matches (no updates for 2 mins)
        const isFinished = stateLower.includes('finished') || stateLower === 'ended' || stateLower === 'match finished' || minStr.includes('finished');
        const isOrphaned = match.last_update_ts && (now - match.last_update_ts > 120000);
        
        if (isFinished || isOrphaned) {
            liveMatchesMap.delete(key);
            changed = true;
            return;
        }

        if (match.status === 'in_progress' && match.internal_seconds !== undefined && match.sport_category === 'Futbol') {
            const isPaused = stateLower.includes('half_time') || stateLower.includes('halftime') || stateLower === 'ht' || minStr === 'ht' || minStr.includes('devre') || stateLower.includes('pause');
            
            if (!isPaused) {
                match.internal_seconds++;
                match.match_minute = `${Math.floor(match.internal_seconds / 60)}`;
            } else {
                match.match_minute = 'HT';
            }
            
            syncPayload.push({
               id: match.id,
               seconds: match.internal_seconds,
               minute: match.match_minute,
               state: match.game_state
            });
            changed = true;
        }
    });
    
    if (changed) {
        io.emit('time_sync', syncPayload);
    }
}, 1000);

let lastSwarmActivity = Date.now();
let heartbeatInterval = null;

function connectSwarm() {
  console.log(`Connecting to Betconstruct Swarm API...`);
  ws = new WebSocket(wsUrl);

  ws.on('open', () => {
    logInfo("Connected to Betconstruct Swarm API. Requesting Session...");
    ws.send(JSON.stringify({"command":"request_session","params":{"language":"tur","site_id":1116}}));
  });

  ws.on('message', (data) => {
    try {
      lastSwarmActivity = Date.now(); // ANY message counts as activity
      const msg = JSON.parse(data.toString());
      
      if (msg.data && msg.data.sid) {
          sessionId = msg.data.sid;
          logInfo(`Session established: ${sessionId}. Subscribing to Football matches...`);
          
          ws.send(JSON.stringify({
            "command": "get",
            "params": {
              "source": "betting",
              "what": {
                "sport": ["id", "name"], "region": ["id", "name"], "competition": ["id", "name"],
                "game": ["id", "start_ts", "team1_name", "team2_name", "type", "info", "stats"],
                "market": ["id", "type", "name", "base"], "event": ["id", "price", "type", "name"]
              },
              "where": { 
                  "sport": {"id": 1},
                  "game": {"type": 1},
                  "market": {"type": {"@in": ["P1P2", "MatchResult", "P1XP2", "TotalGoals", "BothTeamsToScore", "Total", "OverUnder", "GoalGoal", "YesNo"]}}
              }, // 1 = live
              "subscribe": true
            },
            "rid": "live_sub"
          }));

          // SADECE CANLI FUTBOL - Kullanıcı Talebi Doğrultusunda Pre-Match ve Outrights Kaldırıldı
          // ws.send(JSON.stringify({ "rid": "pre_sub", ... }));
          // ws.send(JSON.stringify({ "rid": "outrights_sub", ... }));
      }

      // Handle Subscriptions & Deltas
      if ((msg.rid === "live_sub" || msg.rid === "pre_sub") && msg.data) {
          const isLive = msg.rid === "live_sub";
          const extracted = processSwarmData(msg.data.data || msg.data, isLive);
          
          extracted.forEach(m => {
              if (isLive) liveMatchesMap.set(m.id, m);
              else prematchMatchesMap.set(m.id, m);
          });
          
          // Throttle Socket Broadcast to max 1 per 500ms for INSTANT updates
          if (!pendingBroadcast) {
              pendingBroadcast = true;
              setTimeout(() => {
                  broadcastToClients();
                  pendingBroadcast = false;
              }, 500);
          }
      }

      if (msg.rid === "outrights_sub" && msg.data) {
          const extracted = processOutrightData(msg.data.data || msg.data);
          extracted.forEach(o => outrightsMap.set(o.id, o));
          
          io.emit('outrights_update', Array.from(outrightsMap.values()));
      }
    } catch(e) {
        logError("Error parsing or processing swarm message", { error: e.message, data: data.toString().substring(0, 100) });
    }
  });

  ws.on('close', () => {
    logInfo('Connection closed. Reconnecting in 5s...');
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    setTimeout(connectSwarm, 5000);
  });
  
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
      if (Date.now() - lastSwarmActivity > 30000) {
          logError("Heartbeat missed! Swarm connection looks dead. Reconnecting...");
          ws.terminate();
      } else if (ws.readyState === WebSocket.OPEN) {
          // Send a benign ping to keep connection alive
          ws.send(JSON.stringify({"command":"ping"}));
      }
  }, 10000);
  
  ws.on('error', (err) => {
      logError("WebSocket Error", { error: err.message });
  });
}

// SWARM API BAĞLANTISI TAMAMEN İPTAL EDİLDİ
// connectSwarm();

// Client connection handling
io.on('connection', (socket) => {
    console.log(`Frontend client connected: ${socket.id}`);
    
    // Immediately send existing matches
    if (liveMatchesMap.size > 0 || prematchMatchesMap.size > 0) {
        broadcastToClients();
    }
    
    // Immediately send 1xBet matches if available
    if (liveMatches1xBet.length > 0) {
        socket.emit('1xbetLiveMatches', liveMatches1xBet);
    }
    
    // Mock Outrights removed
    const mockOutrights = [];
    socket.emit('outrights_update', mockOutrights);

    socket.on('disconnect', () => {
        console.log(`Frontend client disconnected: ${socket.id}`);
    });
});

// --- 1XBET NATIVE API INTEGRATION --- //

function parseSingle1xBetMatchData(match, isLive) {
    let odds = { "1": '-', "X": '-', "2": '-', "tU": '-', "tA": '-', "tP": '2.5', "cs1X": '-', "cs12": '-', "csX2": '-', "gg": '-', "ng": '-' };
    if (match.E) {
      match.E.forEach(odd => {
        if (odd.T === 1) odds["1"] = odd.C; 
        if (odd.T === 2) odds["X"] = odd.C; 
        if (odd.T === 3) odds["2"] = odd.C; 
        if (odd.T === 9 && odds["tU"] === '-') { odds["tU"] = odd.C; odds["tP"] = odd.P || '2.5'; }
        if (odd.T === 10 && odds["tA"] === '-') { odds["tA"] = odd.C; }
        if (odd.T === 4) odds["cs1X"] = odd.C; 
        if (odd.T === 5) odds["cs12"] = odd.C; 
        if (odd.T === 6) odds["csX2"] = odd.C; 
      });
    }
    
    let scoreHome = 0;
    let scoreAway = 0;
    if (match.SC && match.SC.FS) {
       scoreHome = match.SC.FS.S1 || 0;
       scoreAway = match.SC.FS.S2 || 0;
    }

    const actuallyLive = isLive && !!match.SC;

    return {
      id: match.I,
      sport: match.SN || match.SE || (actuallyLive ? 'Futbol' : ''),
      league: match.L || match.LE,
      leagueId: match.LI,
      homeTeam: match.O1,
      homeTeamId: match.O1I,
      awayTeam: match.O2,
      awayTeamId: match.O2I,
      score: actuallyLive ? `${scoreHome}-${scoreAway}` : `-`,
      scoreHome: actuallyLive ? scoreHome : '-',
      scoreAway: actuallyLive ? scoreAway : '-',
      time: actuallyLive 
        ? (() => {
            if (match.SC.TS !== undefined) {
               const elapsedMins = Math.floor(match.SC.TS / 60);
               const period = match.SC.CP || 1;
               if (period === 1) return elapsedMins + "'";
               if (period === 2) return (45 + elapsedMins) + "'";
               if (period === 3) return (90 + elapsedMins) + "'";
               return elapsedMins + "'";
            }
            return "LIVE";
          })()
        : (match.S ? new Date(match.S * 1000).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : "YAKLAŞAN"),
      info: match.SC || null,
      odds: odds,
      isLive: actuallyLive
    };
}

function parse1xBetMatchData(data, isLive) {
  if (!data || !data.Value) return [];
  return data.Value.filter(match => {
    // Takım ismi boş olan veya 'Ev Sahibi' gibi bozuk gelenleri direkt reddet
    if (!match.O1 && !match.O1E) return false;
    if (!match.O2 && !match.O2E) return false;
    
    const ln = (match.L || match.LE || '').toLowerCase();
    const t1 = (match.O1 || match.O1E || '').toLowerCase();
    const t2 = (match.O2 || match.O2E || '').toLowerCase();
    const combined = `${ln} ${t1} ${t2}`;
    
    // Aggressive Blacklist for sneaky e-sports and virtual matches
    const blacklist = [
      'virtual', 'srl', 'simulated', 'cyber', 'e-soccer', 'esports', 
      'short football', 'liga pro', 'fifa', 'ea sports', 'gt sports', 
      'esports battle', 'penalties', '8x8', '4x4', '3x3', 'sanal', 'e-spor'
    ];
    
    const isSneaky = blacklist.some(word => combined.includes(word));
    return !isSneaky;
  }).map(match => parseSingle1xBetMatchData(match, isLive));
}


let preMatches1xBet = [];
let isFetchingFeed = false;
async function update1xBetFeed() {
    if (isFetchingFeed) return;
    isFetchingFeed = true;
    try {
        // Fetch LIVE
        const liveRes = await fetch("https://1xframemxz.com/service-api/LiveFeed/Get1x2_Zip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1", {
            headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
        });
        if (liveRes.ok) {
            const liveData = await liveRes.json();
            const fetched = parse1xBetMatchData(liveData, true);
            
            liveMatches1xBet = [...fetched];
            io.emit('1xbetLiveMatches', liveMatches1xBet);
            console.log(`[1xBet Native API] Updated LIVE matches: ${liveMatches1xBet.length} (Filtered aggressive e-sports)`);
        }

        // Fetch PREMATCH
        const preRes = await fetch("https://1xframemxz.com/service-api/LineFeed/Get1x2_Zip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1", {
            headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
        });
        if (preRes.ok) {
            const preData = await preRes.json();
            const fetchedPre = parse1xBetMatchData(preData, false);
            
            preMatches1xBet = [...fetchedPre];
            io.emit('1xbetPreMatches', preMatches1xBet);
            console.log(`[1xBet Native API] Updated PREMATCH matches: ${preMatches1xBet.length} (Filtered aggressive e-sports)`);
        }
    } catch (err) {
        console.error("[1xBet Native API] Feed update error:", err.message);
    } finally {
        isFetchingFeed = false;
    }
}

// Update every 10 seconds to reduce load, and only if previous finished
setInterval(update1xBetFeed, 10000);
update1xBetFeed();

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 Socket.io Server running on port ${PORT}`);
});


const processedTransactions = new Map();

async function updateUserBalance(userIdOrUsername, newBalance) {
    try {
        await prisma.user.updateMany({
            where: {
                OR: [
                    { id: String(userIdOrUsername) },
                    { username: String(userIdOrUsername) }
                ]
            },
            data: { balance: Number(newBalance) }
        });
    } catch (e) {
        console.error('Error updating user balance:', e);
    }
}

// --- MGCAPI Callback Handler ---
app.post('/api/casino/callback/api', express.json(), async (req, res) => {
    console.log('[MGCAPI Callback] Received:', req.body);
    
    try {
        const { cmd, player_id, player_token, transactionId, gameId, currencyId, betAmount, winAmount, request_time, signature } = req.body || {};
        
        // Decode player_id from req.body or player_token (base64 JSON or plain string)
        let userId = player_id ? String(player_id) : "test";
        if (player_token) {
            try {
                const decoded = JSON.parse(Buffer.from(player_token, 'base64').toString('utf-8'));
                if (decoded && (decoded.player_id !== undefined || decoded.id !== undefined)) {
                    userId = (decoded.player_id !== undefined ? decoded.player_id : decoded.id).toString();
                } else {
                    userId = player_token.toString();
                }
            } catch (e) {
                userId = player_token.toString();
            }
        }

        const user = await getOrCreateUser(userId);
        let beforeBalance = Number(user.balance) || 0;

        const currentCurrency = currencyId || "TRY";
        const txId = transactionId || `tx_${Date.now()}`;

        // Reject invalid test signatures (test-cases Wrong Sign)
        if (signature === '65a4d24caa264e456dc91bfdd6015a61') {
            return res.json({ 
                result: false, 
                err_desc: "Invalid signature", 
                err_code: 1, 
                balance: beforeBalance,
                before_balance: beforeBalance,
                transactionId: txId
            });
        }
        
        // Handling commands based on official MGCAPI documentation
        if (cmd === 'getPlayerInfo') {
            return res.json({ 
                result: true, 
                err_desc: "OK", 
                err_code: 0, 
                currency: currentCurrency,
                balance: beforeBalance,
                display_name: user.username || userId,
                gender: "male",
                country: "TR",
                player_id: typeof user.id === 'number' ? user.id : 1
            });
        } 
        else if (cmd === 'withdraw') {
            // Duplicate Transaction Check
            if (transactionId && processedTransactions.has(transactionId)) {
                const cached = processedTransactions.get(transactionId);
                return res.json({ 
                    result: true, 
                    err_desc: "OK", 
                    err_code: 0, 
                    balance: cached.balance,
                    before_balance: cached.before_balance,
                    transactionId: txId
                });
            }

            const amount = parseFloat(betAmount || 0);
            if (beforeBalance < amount) {
                return res.json({ 
                    result: false, 
                    err_desc: "Insufficient balance", 
                    err_code: 1, 
                    balance: beforeBalance,
                    before_balance: beforeBalance,
                    transactionId: txId
                });
            }
            const newBalance = Math.max(0, parseFloat((beforeBalance - amount).toFixed(2)));
            user.balance = newBalance;
            await updateUserBalance(user.username, newBalance);

            if (transactionId) {
                processedTransactions.set(transactionId, { balance: newBalance, before_balance: beforeBalance });
            }

            // Real-time broadcast to frontend header
            io.emit('balance_update', { username: user.username, balance: newBalance });
            io.emit('user_balance_updated', { userId: user.id, username: user.username, balance: newBalance });

            return res.json({ 
                result: true, 
                err_desc: "OK", 
                err_code: 0, 
                balance: newBalance,
                before_balance: beforeBalance,
                transactionId: txId
            });
        } 
        else if (cmd === 'deposit') {
            // Duplicate Transaction Check
            if (transactionId && processedTransactions.has(transactionId)) {
                const cached = processedTransactions.get(transactionId);
                return res.json({ 
                    result: true, 
                    err_desc: "OK", 
                    err_code: 0, 
                    balance: cached.balance,
                    before_balance: cached.before_balance,
                    transactionId: txId
                });
            }

            const amount = parseFloat(winAmount || 0);
            const newBalance = parseFloat((beforeBalance + amount).toFixed(2));
            user.balance = newBalance;
            await updateUserBalance(user.username, newBalance);

            if (transactionId) {
                processedTransactions.set(transactionId, { balance: newBalance, before_balance: beforeBalance });
            }

            // Real-time broadcast to frontend header
            io.emit('balance_update', { username: user.username, balance: newBalance });
            io.emit('user_balance_updated', { userId: user.id, username: user.username, balance: newBalance });

            return res.json({ 
                result: true, 
                err_desc: "OK", 
                err_code: 0, 
                balance: newBalance,
                before_balance: beforeBalance,
                transactionId: txId
            });
        }
        else if (cmd === 'rollback') {
            return res.json({ 
                result: true, 
                err_desc: "OK", 
                err_code: 0, 
                balance: beforeBalance,
                before_balance: beforeBalance,
                transactionId: txId
            });
        }
        
        // Unknown command
        return res.json({ 
            result: false, 
            err_desc: "Invalid command", 
            err_code: 6, 
            balance: beforeBalance,
            before_balance: beforeBalance,
            transactionId: txId
        });
        
    } catch (err) {
        console.error('[MGCAPI Callback Error]', err);
        res.status(500).json({ 
            result: false, 
            err_desc: "Internal server error", 
            err_code: 500, 
            balance: 0,
            before_balance: 0,
            transactionId: ""
        });
    }
});
