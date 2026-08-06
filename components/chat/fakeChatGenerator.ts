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
    "LFG!", "spin it", "fucking rigged", "shit game", "wtf",
    "gg", "omg yes", "cash out now", "buy bonus", "fuck this",
    "scam", "moon 🚀", "hahaha", "gl all", "nice hit",
    "fucking finally", "bs", "ez money", "rip balance", "let's go bitches",
    "any drops?", "bored", "send tips", "lmao", "ded"
];

const EN_LONG = [
    "Bro I just lost my entire paycheck on this fucking slot, what the actual fuck is this rtp 💀💀",
    "This is why I always tell you guys to stop chasing losses. I deposited $100 and cashed out $2000, easy money bitches 🤑🔥",
    "Does anyone know when the next rain is dropping? I swear I've been waiting for hours and nothing is happening",
    "Can someone explain how the VIP system works? I've been playing every day and I'm still not getting any good cashback..."
];

// --- TURKISH (TR) ---
const TR_SHORT = [
    "amk", "kasa katlandı", "sikecem böyle işi", "oynatma", "sg",
    "ananı sikeyim", "gg", "helal", "bas bas", "orospu cocuklari",
    "lan", "yine yattık amk", "valla billa", "hadi lan", "ver ulan",
    "şansımı sikeyim", "yok böyle bişey", "aq", "kasayı sıfırladık", "siktir git",
    "helal lan size", "patladı", "geliyor gelmekte olan", "kodumun oyunu", "hahaha amk"
];

const TR_LONG = [
    "Oğlum sabahtan beri aynı slota basıyorum yemin ederim bir kere bile bonus vermedi, anasını sikeyim böyle rtp'nin amk 🤬💀",
    "Beyler sakın hırs yapmayın bak, 500 lira attım tek spinde 10k çektim. Çıkmasını bileceksin siktirip gideceksin bu kadar basit 💸🚀",
    "Ya amına koyayım dünden beri rain bekliyoruz hala adminler bi bok atmadı, ne cimri adamlarsınız lan siz",
    "Şu siktiğimin çarkından bir kere bile düzgün bir şey çıkmadı, hep boş hep boş yeter ulan 🤡"
];

// --- PORTUGUESE (BR) ---
const BR_SHORT = [
    "pqp", "caralho", "bora", "fudeu", "tomanocu",
    "kkkkkk", "lixo de jogo", "vtnc", "paga", "faz o pix",
    "merda", "socorro", "vamo porra", "vai tomar no cu", "aff",
    "pagou mt", "slc", "deu ruim", "foda", "roubo",
    "me fudi", "tá de sacanagem", "chupa", "bora ganhar", "tamo junto"
];

const BR_LONG = [
    "Mano, perdi todo o meu dinheiro nessa porra de jogo, vai tomar no cu desse rtp lixo do caralho 🤬💀",
    "Falei pra vocês, só ter paciência! Coloquei 50 pila e já saquei 2k, faz o pix porra 🤑🚀",
    "Alguém sabe que horas vai ter chuva de moeda? Tô aqui desde cedo igual um otário esperando kkkkk",
    "Esse vip não serve pra bosta nenhuma, tô jogando igual um condenado e não ganho nada de cashback, tnc"
];

// --- SPANISH (AR) ---
const AR_SHORT = [
    "puta madre", "vamos", "mierda", "joder", "la concha",
    "jajaja", "hijo de puta", "paga ya", "vete a la mierda", "estafa",
    "qué asco", "vamos carajo", "que robo", "la ctm", "dale boludo",
    "la puta que te pario", "che", "tremendo", "me cago en todo", "anda a cagar",
    "ganancia", "suerte", "maldita sea", "que locura", "no mames"
];

const AR_LONG = [
    "Boludo perdí todo mi sueldo en esta mierda de juego, la puta madre que lo parió con este rtp de mierda 🤬💀",
    "Se los dije hijos de puta, metí 10 lucas y ya saqué como 100k, a mamarla todos 🤑🚀",
    "¿Alguien sabe cuándo carajo van a tirar plata en el chat? Estoy acá desde hace mil horas y nada",
    "Me cago en el sistema VIP de mierda este, juego todo el día y no te devuelven una mierda loco"
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
