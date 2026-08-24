const USERNAMES = [
    "Alex_99", "BetKing", "Crazy_Gamer", "NOOR____3", "VIP_Master",
    "LuckyStrike", "CryptoWhale", "BigWin", "GamerTR", "SlotQueen",
    "MaxBet", "RichBoy", "DarkKnight", "CasinoBoss", "PlayMaker",
    "WinHunter", "GoldenTicket", "RollerHigh", "MegaJackpot", "LuckyCharm"
];

// Emojis for random insertion
const EMOJIS = ["😂", "🔥", "🚀", "💀", "🤑", "🤬", "💸", "🎰", "❤️", "💯", "🤡", "😎", "🤝", "💪"];

// --- ENGLISH (GLOBAL) ---
const EN_SHORT = [
    "LFG!", "spin it", "let's go", "good luck", "gg",
    "omg yes", "nice win", "wow", "any drops?", "bored",
    "moon 🚀", "hahaha", "gl all", "nice hit", "finally",
    "ez", "let's go friends", "fun game", "send tips", "nice"
];

const EN_LONG = [
    "I just hit a crazy multiplier on this slot! 🚀🔥",
    "This is why I always tell you guys to be patient. Deposited $100 and cashed out $2000, have a good day everyone 🤑",
    "Does anyone know when the next rain is dropping? Been waiting for it 🌧️",
    "The VIP system is actually really nice, just got a huge cashback!"
];

// --- TURKISH (TR) ---
const TR_SHORT = [
    "kasa katlandı", "harika oyun", "bol şans", "gg", "helal",
    "bas bas", "şansımız döndü", "geliyor gelmekte olan", "hadi bakalım", "vay canına",
    "helal olsun", "tebrikler", "bugün çok iyi", "selamlar", "hoş bulduk",
    "vip avantajları harika", "çarkı çevirdim", "çok eğlenceli", "iyi oyunlar", "kazananlara tebrikler"
];

const TR_LONG = [
    "Arkadaşlar Sweet Bonanza bugün çok iyi veriyor, kesinlikle denemelisiniz 🚀🔥",
    "Sabreden derviş muradına ermiş derler. 500 lira attım tek spinde 10k çektim. Herkese bol şans 💸",
    "Yağmur (Rain) etkinliği ne zaman başlar acaba? Bilen var mı moderatör bey? 🌧️",
    "VIP iademi aldım, 724Bets gerçekten çok güvenilir bir sistem kurmuş, teşekkürler."
];

// --- PORTUGUESE (BR) ---
const BR_SHORT = [
    "bora", "muito bom", "kkkkkk", "paga", "faz o pix",
    "vamo", "aff", "pagou mt", "slc", "boa sorte",
    "tamo junto", "bora ganhar", "bom jogo", "ganhei", "incrível"
];

const BR_LONG = [
    "Mano, acabei de ganhar um multiplicador gigante nesse jogo, que loucura 🚀🔥",
    "Falei pra vocês, só ter paciência! Coloquei 50 pila e já saquei 2k, faz o pix 🤑",
    "Alguém sabe que horas vai ter chuva de moeda? Tô aqui esperando kkkkk",
    "Esse sistema VIP é muito bom, o cashback caiu na hora!"
];

// --- SPANISH (AR) ---
const AR_SHORT = [
    "vamos", "jajaja", "paga ya", "vamos carajo", "che",
    "tremendo", "ganancia", "suerte", "que locura", "excelente",
    "bien jugado", "dale", "buena suerte", "increíble", "saludos"
];

const AR_LONG = [
    "Acabo de pegar un multiplicador re loco en este juego, no lo puedo creer 🚀🔥",
    "Se los dije muchachos, paciencia. Metí 10 lucas y ya saqué como 100k, vamos 🤑",
    "¿Alguien sabe cuándo tiran plata en el chat? Estoy acá esperando 🌧️",
    "El sistema VIP es excelente, me devolvieron al instante, recomendadísimo."
];

function getRandomItem(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomEmojis() {
    const num = Math.random();
    if (num > 0.7) return ""; // 70% chance no emoji
    const count = Math.floor(Math.random() * 3) + 1;
    let res = "";
    for(let i=0; i<count; i++) {
        res += getRandomItem(EMOJIS);
    }
    return " " + res;
}

const recentMessages = new Map<string, string[]>();
const recentUsers = new Map<string, string[]>();

export function generateRandomChat(server: string) {
    const isLong = Math.random() < 0.05; // 5% chance
    
    let shorts = EN_SHORT;
    let longs = EN_LONG;
    
    if (server === 'tr') { shorts = TR_SHORT; longs = TR_LONG; }
    else if (server === 'br') { shorts = BR_SHORT; longs = BR_LONG; }
    else if (server === 'ar') { shorts = AR_SHORT; longs = AR_LONG; }
    
    // --- Message Repetition Prevention ---
    let history = recentMessages.get(server) || [];
    let pool = isLong ? longs : shorts;
    let available = pool.filter(m => !history.includes(m));
    
    // Fallback if we run out of unique messages
    if (available.length === 0) {
        available = pool; 
        history = []; 
    }
    let baseMsg = getRandomItem(available);
    
    history.push(baseMsg);
    if (history.length > 15) history.shift(); // Remember last 15 messages
    recentMessages.set(server, history);
    
    // --- User Repetition Prevention ---
    let userHistory = recentUsers.get(server) || [];
    let availableUsers = USERNAMES.filter(u => !userHistory.includes(u));
    
    if (availableUsers.length === 0) {
        availableUsers = USERNAMES;
        userHistory = [];
    }
    let baseUser = getRandomItem(availableUsers);
    
    userHistory.push(baseUser);
    if (userHistory.length > 5) userHistory.shift(); // Prevent same user posting back-to-back
    recentUsers.set(server, userHistory);

    let msg = baseMsg;
    // Sometimes add random emojis to short messages
    if (!isLong && Math.random() > 0.5) {
        msg += getRandomEmojis();
    }

    return {
        id: `fake_${Date.now()}_${Math.random()}`,
        username: baseUser + (Math.random() > 0.5 ? Math.floor(Math.random() * 99) : ''),
        role: 'USER',
        message: msg,
        created_at: new Date().toISOString()
    };
}
