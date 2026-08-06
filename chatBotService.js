import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

export const SYSTEM_PROMPT = `Sen bir bahis ve casino sitesinin canlı sohbet (chat) alanında takılan sıradan bir Türk oyuncusun. Amacın sana verilen güncel haberi veya sohbet geçmişini okuyup, bir oyuncu gibi anlık ve doğal bir tepki vermektir.

KESİN KURALLAR (BUNLARA UYMAZSAN SİSTEM ÇÖKER):

Asla AI Olduğunu Belli Etme: 'Yapay zeka olarak', 'Bir dil modeli olarak', 'Size nasıl yardımcı olabilirim' gibi ifadeleri ASLA kullanma. Sen gerçek bir insansın. Robotik kelimeler (bununla birlikte, öte yandan vb.) kullanma.

Kısa ve Doğal Yaz: En fazla 1 veya 2 kısa cümle kur. Yazım kurallarına dikkat etme, bahisçi gibi sokak ağzı konuş. Noktalama işaretlerine pek dikkat etme, büyük/küçük harf kuralına uyma. Kelimeleri uzat (örnek: abi, walla, yeminleee, beyler, ulan, kanka, harbiden, aga).

Gündem Kısıtlaması: Sadece spor maçları, iddaa oranları, transferler, slot oyunları (Sweet Bonanza, Plinko, Rulet vb.) ve kripto piyasası hakkında konuş.

ÖNEMLİ: Siyaset, ekonomi, asgari ücret ve seçim konuşmak KESİNLİKLE YASAKTIR. Bu konular açılırsa tersle ve konuyu hemen iddaaya/kriptoya çevir.

ÖNEMLİ: KESİNLİKLE sana verilen haber başlığını veya metnini kopyalayıp yapıştırma. Sen bir haber spikeri veya bülten değilsin. Haberdeki veriyi (oyuncu adı, takım vb.) sıradan bir bahisçi gibi sokak ağzıyla, cümlenin içine yedirerek söyle.

Eğer birisi sana haberin detayını sorarsa veya yalanlarsa, sana verilen güncel haber detayındaki İSİM ve BİLGİLERİ kullanarak kendini savun. Asla uydurma (halüsinasyon) isim verme, sadece sana verilen haber verisini kullan.

Yasaklı Kelimeler: 'Öte yandan', 'Bununla birlikte', 'Sonuç olarak', 'Özetle', 'Unutmamak gerekir ki' gibi makale kelimelerini kullanmak yasaktır.`;

// 1. API Parametre Güncellemesi (Tekrarı Kırmak İçin)
export async function callLLM(promptText) {
    // LLM API Config
    const llmConfig = {
        temperature: 0.85, 
        topK: 50, 
        topP: 0.90, 
        frequency_penalty: 1.0 
    };
    // return await geminiClient.generateContent({ contents: promptText, ...llmConfig });
}

export const PERSONAS = {
    'Tetikci_Kemal': "Karakterin: Senin adın Tetikci_Kemal. Agresif, sabırsız, kasası dolu ve hep büyük oynayan birisin. Sürekli kazandığını iddia edip diğer oyuncuları eziklersin. Ağlayanlara ve mızmızlananlara tahammülün yok.",
    'Kadir_Baba': "Karakterin: Senin adın Kadir_Baba. Sürekli şanssızlığından şikayet eden, küçük bütçeyle oynayıp kasasını hep sıfırlayan, mızmız birisin. Hep 'şans yok bizde', 'yine yattık' modundasın.",
    'Sefa_Dayi': "Karakterin: Senin adın Sefa_Dayi. Yaşlı, eski toprak bir iddaacısın. Sürekli sürpriz kuponlar kovalar, gençlere öğütler verirsin. Mesajlarında tecrübeli bir abi havası olsun."
};

export const FALLBACK_SCENARIOS = [
    'Sweet Bonanza veya Gates of Olympus oynadığını ve oyunun durumunu (çok kazandırdı veya hiç ödemedi) söyle.',
    'Sitenin (Ahbapbet) para çekme hızını veya kripto yatırım hızını öv.',
    'Hayali bir canlı maça (örneğin İngiltere alt ligi veya basketbol) canlı bahis aldığını ve heyecanlı olduğunu yaz.',
    'Şanssızlığından şikayet et veya diğer oyunculara hangi oyuna girmesi gerektiğini sor.',
    'Sohbet geçmişindeki bir oyuncunun mesajına takıl veya ona laf at.'
];

export const PROMPT_TEMPLATE = `Girdi:
Son Sohbetler: {CHAT_HISTORY}
Yanıtladığın Kişi: {TARGET_USER}
Onun Mesajı: {TARGET_MESSAGE}
{CONTEXTUAL_REPLY}
{NEWS_OR_FALLBACK}
{DEBATE_CONTEXT}
Görev: Şimdi '{CHARACTER_NAME}' olarak bu sohbete veya habere en fazla 15 kelimelik bir cevap yaz.`;

// Zincirleme Tartışma Durumu (Debate State)
let activeDebate = null; // { topic: string, details: string, stage: 'NEW' | 'CHALLENGED' | 'VALIDATED', targetUser: string }

// Global veya servis seviyesinde hafıza dizisi (Tekrarları önlemek için)
const recentBotMessages = [];

// Oto-Pilot destekli tam teşekküllü LLM Mesaj Üretici
export async function generateMessageWithLLM(characterName, chatHistory) {
    let newsOrFallback = '';
    let debateContext = '';
    let contextualReply = '';
    
    // Eğer halihazırda devam eden bir tartışma varsa:
    if (activeDebate) {
        if (activeDebate.stage === 'NEW' && Math.random() < 0.30) {
            // İtiraz Mekanizması (Challenge System) %30 ihtimal
            activeDebate.stage = 'CHALLENGED';
            contextualReply = `Yanıtladığın Kişi: ${activeDebate.targetUser}\nOnun Mesajı: ${activeDebate.topic}\nGörev: ${activeDebate.targetUser} adlı kişinin mesajına doğrudan cevap ver (katıl veya itiraz et). Kendi yorumunu yaparken haber bilgisini laf arasında kullan.`;
            debateContext = `Tartışma Detayı (Context): ${activeDebate.details}\nRolün: Bu habere inanma ve yalanla. '${activeDebate.targetUser}' adlı kullanıcıya sert çıkış ve haberin kolpa olduğunu iddia et (Örn: 'hangi transfer aq', 'kolpa haber o').`;
            newsOrFallback = `Gündem (Tartışılan Konu): ${activeDebate.topic}`; // Sadece tartışma konusu ver, yeni haber verme!
        } else if (activeDebate.stage === 'CHALLENGED') {
            // Kanıtlama (Evidence System)
            activeDebate.stage = 'VALIDATED';
            debateContext = `Tartışma Detayı (Context): ${activeDebate.details}\nRolün: Bu haberi yalanlayanlara karşı elindeki Context bilgisindeki isim/kaynak detayını kullanarak haberi savun (Örn: '@Vurguncu yeminle detaylar boyle'). Asla uydurma isim verme.`;
            newsOrFallback = `Gündem (Tartışılan Konu): ${activeDebate.topic}`; 
        } else if (activeDebate.stage === 'VALIDATED') {
            // Üçüncü Kaynak Onayı
            activeDebate = null; // Tartışma bitti
            debateContext = `Rolün: Bu haberi üçüncü bir kaynak olarak onayla. (Örn: 'harbiden oyle beyler NTV sporda da yazdi az once okudum').`;
        } else {
            activeDebate = null;
        }
    }
    
    if (!activeDebate && !debateContext) {
        // Yeni Haber veya Oto-Pilot
        let freshNews = lastNews ? lastNews.filter(n => !n.used) : [];
        if (freshNews.length > 0) {
            const newsItem = freshNews[Math.floor(Math.random() * freshNews.length)];
            newsItem.used = true; // Veriyi işaretle
            
            const cleanTitle = newsItem.title.split(' - ')[0];
            
            if (recentBotMessages.includes(cleanTitle)) {
                // Aynı konu son 10 dakika içinde konuşulduysa atla veya başka konu seç
                return;
            }
            recentBotMessages.push(cleanTitle);
            if (recentBotMessages.length > 20) recentBotMessages.shift(); // Sadece son 20 konuyu hafızada tut

            const details = newsItem.contentSnippet || newsItem.content || cleanTitle;
            newsOrFallback = `Güncel Gelen Haber: ${cleanTitle}`;
            
            // Tartışma başlat!
            activeDebate = { topic: cleanTitle, details: details, stage: 'NEW', targetUser: characterName };
        } else {
            // Dış veri yoksa Oto-Pilot senaryosuna geç
            const fallback = FALLBACK_SCENARIOS[Math.floor(Math.random() * FALLBACK_SCENARIOS.length)];
            
            if (recentBotMessages.includes(fallback)) {
                return;
            }
            recentBotMessages.push(fallback);
            if (recentBotMessages.length > 20) recentBotMessages.shift();

            newsOrFallback = `Gündem/Durum: ${fallback}`;
        }
    }

    // 3. Prompt Şablonunu Dinamikleştir
    let finalPrompt = PROMPT_TEMPLATE
        .replace('{CHAT_HISTORY}', chatHistory)
        .replace('{TARGET_USER}', activeDebate ? activeDebate.targetUser : '')
        .replace('{TARGET_MESSAGE}', activeDebate ? activeDebate.topic : '')
        .replace('{CONTEXTUAL_REPLY}', contextualReply)
        .replace('{NEWS_OR_FALLBACK}', newsOrFallback)
        .replace('{DEBATE_CONTEXT}', debateContext)
        .replace('{CHARACTER_NAME}', characterName);
        
    return await callLLM(finalPrompt);
}

dotenv.config();

// -- BOT CONFIGURATION --
let botConfig = {
    isActive: true,
    speedMin: 15000,
    speedMax: 45000,
    sloppyRate: 0.7,
    emojiRate: 0.4
};

// -- EXPRESS SERVER SETUP --
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/bot-config', (req, res) => {
    res.json(botConfig);
});

app.post('/api/bot-config', (req, res) => {
    botConfig = { ...botConfig, ...req.body };
    console.log('[API] Bot ayarları güncellendi:', botConfig);
    res.json({ success: true, config: botConfig });
});

app.listen(3001, () => {
    console.log('📡 Bot API Server 3001 portunda başlatıldı');
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://eaxtuvjcanakaqetuqlc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0';

const supabase = createClient(supabaseUrl, supabaseKey);
const GLOBAL_CHANNEL_ID = 'global';

const globalUsers = [
    "Pushpa_007", "Rajesh__1", "Kalu_girl", "AllamaIqbal", "Ferozz_khan", "Shikari_3X",
    "Dream_969K", "Mr___Hero", "BC_PRIME", "ALTO2026", "Dani1236", "Eswnlevlluac",
    "BC_LEXTS3", "Danish Noori", "Sonia_Khan", "BC_KING_KONG_2", "BC_EXPORT544", "Captain010",
    "SAMI__shehzadi654", "Nasro10", "Sohyel😎💓", "RxRobin", "TheReal_chif", "MiLaD1",
    "Alina______Queen786", "Hoorbeauty_BCGAME", "Sedar_sy", "Riya__", "ZENITH_X12",
    "JAGGU_KHAN90", "Manal______Queen786", "Mateus_BR7", "Lucas_SP", "Thiago_Rabelo",
    "Fernanda_Vip", "Diego_Mex", "Carlos_Lima", "Gabriel_Pro", "Valentina_X",
    "Rodrigo_BC", "Camila_Bet", "Santiago_Win", "Guillermo_99", "Nico_Apostador",
    "Joao_Bet", "Bruno_Vip", "Arthur_C", "Felipe_Slots", "Rafael_High", "Mariana_G"
];

const globalMessagesPool = [
    // Portuguese (Brezilya / Portekiz)
    "Boa sorte a todos rapaziada! 🚀",
    "Hoje o bagulho ta insano no crash!!",
    "Bora dobrar essa banca meu povo!",
    "Alguém aí pegou essa vela de 50x?",
    "Boa noite tropa, lucrando muito hoje 🔥",
    "Caraca mano, essa rodada foi surreal!",
    "Valeu pela força galera, bora pra cima!",
    "Pagou lindo demais, multiplicador bruto!",
    "Quem ta no lucro manda um GG no chat 😎",
    "Hoje a sorte ta do nosso lado galera!",
    "Jogo da bomba ta pagando muito hoje rapaziada 💣",
    "Quem nao arrisca nao petisca bora subir a banca!",
    "Mano que rodada insana, valeu demais!",
    "Bateu a meta por hoje, ate amanha tropa! 🙏",
    "Se essa vela passar de 10x eu pago um lanche pra geral hahaha",
    "Esse jogo e bom demais pra quem tem paciencia!",
    "Subi de 20 pra 500 em 10 minutos, slk!",
    "Cuidado com a ganancia rapaziada, tira o lucro no verde! 💚",

    // Spanish (İspanyolca / Latin Amerika)
    "La verdad es que este chat va demasiado rápido hoy jajaja",
    "Buena suerte a todos amigos, a ganar en grande 🍀",
    "Vamos por ese multiplicador alto hoy 🔥",
    "Increíble cómo pagó esa ronda, felicidades a los ganadores!",
    "Alguien jugando ruleta ahora mismo?",
    "Buena racha hoy muchachos, no paremos!",
    "Saludos desde México compas, mucha suerte a todos 🇲🇽",
    "El juego está picante hoy ehhh 🔥",
    "Vamos con toda hoy mi gente 🚀",
    "Qué buena victoria hermano, a seguir sumando!",
    "Aca reportandome desde Colombia, hoy se gana si o si 🇨🇴",
    "Quien mas metio su apuesta en el multiplicador?",
    "Excelente plataforma la verdad, de las mejores 👑",
    "Vamos mi gente no se rindan que la suerte cambia en un segundo!",
    "Hoy es noche de ganancias señores 😎",
    "Que racha tan buena llevo en las tragamonedas hoy!",

    // English (Global / İngilizce)
    "Sending luck your way... good day!",
    "Keep it up to you all! 👊",
    "Just positive and keep winning 🚀",
    "Best of luck to you tomorrow!",
    "Love 💕💕💕 you all",
    "That's awesome 👍",
    "Cool 🆒🆒🆒😎",
    "Wow that's a great idea",
    "Good luck guys have fun 😊👍",
    "Keep printing green 🤢🍏🍏🍏",
    "May the odds be with you all ❤️",
    "Big wins for everyone... enjoy best gaming experience 😉",
    "Keep pushing, keep winning.. keep rolling bro!",
    "Have a golden day everyone 🌟",
    "Awesome platform, best experience so far 🎯",
    "GG everyone, massive profit today!",
    "Who is ready for the next big multiplier? 🚀",
    "Stay blessed and keep winning!",
    "To the moon 🚀🚀🚀",
    "Nice catch bro, well deserved!",

    // Hindi / Asian
    "Bhai aaj to alag hi profit ho raha hai 🚂",
    "Best of luck friends stay blessed 💕",
    "Engine i like to invest, profit here 🎯 🎮",
    "Good night friends sweet dreams 🌃",
    "Aaj barish kab aayegi mod bhai 🌧️",
    "Keep winning guys stay cool 👊",
    "Bahut badhiya bhai aise hi win karte raho 👍",
    "Good luck to all players, happy gaming 😊",
    "Sabka time aayega doston khush raho 👑",
    "Khush raho doston sabko badhai ho 🎉",
    "Bhai mera bhi tukka lag gaya aaj mast profit 💸",
    "Aap sabhi ko bohot bohot mubarak ho win 🎉",

    // Mod & Bot Special Alerts
    "XavierBCGAME [Mod]: ✅ Never share links not related to 724bets. ✅ Refrain from asking rains, drops, tips, loans. ✅ Respect everyone's space. 🟢 For deposit & withdrawal issues, visit Live Support.",
    "BBCview: Crash Big Hit | 4570.48 USDT | Multiplier 10.00x!",
    "BBCview: Crash Vay Anasına | 1488.03 USDT | Multiplier 2.22x",
    "BC_70cr: Yağmur yağdı ve bir mesaj bıraktı: \"Rainer Rainer, Tavuk Yemeği\" @User1: 9.5 USDT | @User2: 0.1 USDT. Tebrikler! 🍗",
    "bc.game: Tebrikler! @VIP_Player Won $4570.48 in Crash! 💧 İşte şanslı yağmur geliyor 💧"
];

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Dynamic Username Generator for Realistic Players
const namePrefixes = ["Alex", "Mateus", "Pedro", "Lucas", "Javi", "Sandro", "David", "Chris", "John", "Carlos", "Tomi", "Leo", "Max", "Gabi", "Nico", "Diego", "Beto", "Felipe", "Kiko", "Zeca", "Toni", "Dani", "Sam", "Vic", "Marco", "Rafa", "Hugo", "Ivan", "Eric", "Alan"];
const nameSuffixes = ["_99", "_BR", "_77", "_pro", "_win", "_x", "88", "95", "001", "_vip", "777", "_sp", "_mx", "12", "07", "_bet", "_play", "99", "_real", "23", "_king", ""];

function getRandomUsername() {
    if (Math.random() < 0.35) {
        return pick(globalUsers);
    }
    const pre = pick(namePrefixes);
    const suf = pick(nameSuffixes);
    return `${pre}${suf}`;
}

// Rain Event Beggars / Trigger Words
const rainTriggers = [
    "rain", "rain pls", "rain 🌧️", "rain bot", "rain event", "pls rain", "rain rain", 
    "free rain", "give rain", "rain drop", "rain 💸", "rain mod pls", "rain???", 
    "rain rain rain", "rain drop plz", "rain 🌧️🌧️", "rain rain chicken dinner", 
    "chova", "chuva", "chuva pls", "lluvia", "lluvia por fa", "rain ☔"
];

// Swear & Rant at Site / Rigged Games
const siteRants = [
    "rigged", "rigged site", "scam", "scam site", "site lixo", "lixo de jogo", 
    "scammm", "game is rigged ffs", "site de mda", "puta madre", "mierda de juego", 
    "rigged game", "fck this site", "shitty game", "carajo", "site lixo dms", 
    "estafa total", "jogo roubado", "nao paga nada", "que lixo", "fucking rigged", 
    "scammmers", "worst luck ever ffs", "que estafa mano", "so rigged wtf",
    "kasa hep yutuyor", "site lixo do krl", "toma no cu site lixo", "vai se foder",
    "scam site don't play", "fake odds ffs"
];

// Short Words & Swears & Reactions
const shortReactions = [
    "wtf", "nooo", "fck", "omg", "bruh", "lol", "ffs", "shiiit", "puta", "mierda", 
    "caramba", "pnc", "kkt", "wth", "smh", "gg", "nah", "pff", "mdr", "kkkkk", 
    "jajaja", "afff", "nossa", "vtnc", "chora", "manooo", "mano", "queee", "ala"
];

// Pure Emoji Messages
const emojiMessages = [
    "🔥🔥🔥", "🌧️🌧️🌧️", "🤬🤬🤬", "🤡🤡🤡", "💩💩💩", "💸💸💸", "😭😂😭", "😡😡", 
    "🖕🖕", "🚀🚀🚀", "👍👍", "🙏🙏", "💎💎💎", "🎉🎉🎉", "👀👀👀", "💔💔", "😴😴",
    "💯💯", "💰💰💰", "👎👎"
];

function getRandomMessage() {
    const roll = Math.random();
    
    // 35% chance: Curated rich global messages
    if (roll < 0.35) {
        return pick(globalMessagesPool);
    }
    // 20% chance: Rain beggars / trigger words
    if (roll < 0.55) {
        return pick(rainTriggers);
    }
    // 15% chance: Swear / Rant at the site / game
    if (roll < 0.70) {
        return pick(siteRants);
    }
    // 15% chance: Short reactions & short swears
    if (roll < 0.85) {
        return pick(shortReactions);
    }
    // 15% chance: Pure emojis
    return pick(emojiMessages);
}

const BR_CHANNEL_ID = 'br';
const AR_CHANNEL_ID = 'ar';

// --- BRAZIL (BR) DYNAMIC ENGINE & FOOTBALL FIGHTS ---
const brUsers = [
    "Mengao_King", "Verdao_SP", "Gamba_Lixo", "Vascaino_Depressao", "Tricolor_Tri", 
    "Gabigol_BR", "Zezinho_SP", "Pedrinho_RJ", "Mateus_Musa", "Lucas_Tigrinho", 
    "Fernanda_Minas", "Thiago_Carioca", "Bruninho_01", "Rafaela_Vip", "Carlos_Bahia", 
    "Diego_Fut", "Vinicius_BR", "Marcelo_Palmeiras", "Rodrigo_Mengao", "Joao_Apostador", 
    "Caio_Slots", "Guilherme_Fortuna", "Matheus_Pix", "Renan_Bet", "Leo_Flamengo",
    "Urubu_Safado", "Gamba_Sem_Mundial", "Palmeiras_Nao_Tem", "Porra_Timao", "Vasco_SerieB"
];

const brLaughs = ["kkkkkkkkkkkk", "kkkkkk", "ksksksksks", "huhuahuahua", "kkkkk", "hahahaha", "kkkkkkkkk!"];

const brFootballFights = [
    "palmeiras nao tem mundial kkkkkkkkkkkkk",
    "vai se foder seu gamba do caralho timao e o maior do brasil!!",
    "cheirinho de novo mengao lixo vtnc kkkkkk",
    "lixo e a sua mae porra vasco vai cair pra serie b dnv",
    "chora mulambo kkkkkkkkkk palmeiras e campeao de tudo",
    "respeita o tri da libertadores caralho sao paulo e gigante",
    "urubu safado roubado pelo juiz como sempre vsf",
    "gambazeiro lixo paga as marmita kkkkkkk",
    "porra de jogo chato do caralho mengao fregues",
    "vai dar se mal seu merda respeita o maior do rio!",
    "kkkkkkkkk os caras briga por futebol em site de aposta tmnc",
    "corinthians vai falir kkkkkkkkk time endividado da porra",
    "palmeiras comprou o juiz ctz vtnc fdp",
    "mengao fregues do tricolor kkkkk chora mulambada",
    "respeita a historia do vascao porra time de tradiçao!",
    "gambazada chorona kkkkk leva goleada e culpa o juiz vsf"
];

const brNeatMessages = [
    "Prezados, alguém saberia informar se o saque via Pix está processando normalmente no momento?",
    "Uma boa noite a todos os apostadores da comunidade brasileira!",
    "Recomendo a todos gerenciarem a banca com cautela, a ganância pode ser prejudicial aos lucros.",
    "A partida entre Palmeiras e Flamengo no final de semana promete ser um grande espetáculo tático.",
    "Excelente plataforma de entretenimento, pagamentos caindo rapidamente na conta bancária.",
    "Consegui obter um excelente multiplicador na roleta ao vivo da Evolution agora há pouco.",
    "Desejo uma excelente racha de vitórias e muito sucesso a todos os participantes do chat!"
];

const brSlangMessages = [
    "Fala tropa, suave? Como tao os lucros hoje?",
    "Mano o Jogo do Tigrinho soltou uma carta linda de 250x de tarde kkkkk",
    "Alguem assistindo o jogo do Mengao hoje? Bati a aposta no primeiro tempo!",
    "Caraca Zezinho, tu deu uma sorte danada naquela rodada do Spaceman em!",
    "Pix caindo em menos de 1 minuto na conta, essa plataforma e diferenciada demais 🚀",
    "Rapaziada quem ta no lucro manda um salve no chat 💚",
    "Peguei x50 no Sweet Bonanza com compra de bonus, mt bom!",
    "Ta voando baixo o saque irmao, fiz um de 1.2k caiu na hora!",
    "Gente, chuva hoje na sala BR ou so na Global?",
    "Mano essa roleta da Evolution me tirou 100 conto em 2 minutos seloco 🤦‍♂️",
    "Dobrar a banca e meter o pe, essa e a regra de ouro!",
    "Alguem ai jogando Crazy Time agr? A roleta ta girando insana!",
    "Alguem recomenda um jogo bom pra apostar 50 reais?",
    "Testa o Plinko no modo medio mano, costuma pagar bem!",
    "Hoje o dia foi produtivo rapaziada, 300 de lucro limpo no bolso",
    "Quem ai curte aposta esportiva de escanteios? Rendeu mt hj",
    "Nossa senhora, que multiplicador foi esse de 120x?! Sensacional!"
];

function getDynamicBrMessage() {
    const roll = Math.random();
    const laugh = pick(brLaughs);
    
    // 35% chance: Football team fights & Swearing
    if (roll < 0.35) {
        return `${pick(brFootballFights)}`;
    }
    // 30% chance: Slang & Informal gaming chats
    if (roll < 0.65) {
        return `${pick(brSlangMessages)} ${Math.random() < 0.5 ? laugh : ''}`;
    }
    // 20% chance: Neat & Proper Portuguese sentences
    if (roll < 0.85) {
        return pick(brNeatMessages);
    }
    // 15% chance: Short laughs + Swears
    const shortSwears = ["vtnc", "vsf", "pqp fdp", "slk krl", "tmnc", "porra kkkkkk", "que lixo", "timao porra"];
    return `${pick(shortSwears)} ${laugh}`;
}

// --- ARGENTINA (AR) ROOM DATASET ---
const arUsers = [
    "Nico_Boca", "Luciano_River", "Santiago_Arg", "Tomas_BsAs", "Mateo_Rosario", 
    "Valentina_Cordoba", "Joaquin_X", "Agustin_Aposta", "Guillermo_Copa", "Gonzalo_Scaloneta", 
    "Facundo_Bet", "Franco_Mendoza", "Juan_Rojo", "Bautista_Vip", "Ezequiel_77"
];

const arMessagesPool = [
    "Buenas noches banda, cómo vienen esas jugadas hoy?",
    "Che alguno vio el golazo de River hoy? Me salvo el boleto a ultimo minuto!",
    "Hermano meti 5 lucas en la Scaloneta y cobré hermoso jajaja",
    "Alguien jugando al Crash? Vi una vela de 80x recién, tremendo!",
    "Mercado Pago acreditando al instante, que golazo loco 🚀",
    "Ojo con el casino de noche muchachos, jueguen con cabeza y retiren a tiempo",
    "Boca juega el domingo y no me decido si meterle a victoria directa o a tiros de esquina",
    "Nico amigo robaste lindo con ese multiplicador de Sweet Bonanza ehhh",
    "Cual es el juego que mas esta pagando hoy che?",
    "Spaceman viene metiendo unos multiplicadores zarpados hoy a la tarde!",
    "Habra lluvia en la sala AR mas tarde o solo en Global?",
    "Retiro aprobado en 2 minutos, Impecable el servicio la verdad 👏",
    "Tranquilo Tomas que la suerte da vueltas, no te calientes que se recupera!",
    "Hoy estamos todos de fiesta loco, que linda racha metimos!",
    "Buenas vibras para todos en el chat, a ganar en grande hoy 🍀",
    "Recomiendan jugar ruleta o meterle a la combinada de futbol?",
    "La combinada de Champions pagó hermoso hoy hermano!",
    "Un abrazo enorme a toda la comunidad argentina por aca!"
];

async function sendNextMessage() {
    try {
        if (!botConfig.isActive) {
            setTimeout(sendNextMessage, 3000);
            return;
        }

        const sender = getRandomUsername();
        const finalMsg = getRandomMessage();
        const role = sender.includes('[Mod]') ? 'MODERATOR' : (sender.includes('Admin') || sender === 'bc.game' || sender === 'BBCview' || sender === 'BC_70cr' ? 'ADMIN' : 'MEMBER');

        const payload = {
            username: sender,
            role: role,
            message: finalMsg,
            channel_id: GLOBAL_CHANNEL_ID
        };

        const { error } = await supabase.from('tv_chat').insert(payload);
        if (!error) {
            console.log(`[GLOBAL BOT] Gönderildi: ${sender} -> ${finalMsg}`);
        }

        // Hyper-fast live stream delay (1.2 - 3.2 seconds)
        const delay = Math.floor(Math.random() * 2000) + 1200;
        setTimeout(sendNextMessage, delay);

    } catch (err) {
        console.error('Bot loop error:', err);
        setTimeout(sendNextMessage, 4000); 
    }
}

// Slower Brazil Chat Loop (4 - 9 seconds)
async function sendNextBrMessage() {
    try {
        if (!botConfig.isActive) {
            setTimeout(sendNextBrMessage, 5000);
            return;
        }
        const sender = pick(brUsers);
        const finalMsg = getDynamicBrMessage();

        await supabase.from('tv_chat').insert({
            username: sender,
            role: 'MEMBER',
            message: finalMsg,
            channel_id: BR_CHANNEL_ID
        });
        console.log(`[BR BOT] ${sender}: ${finalMsg}`);

        const delay = Math.floor(Math.random() * 5000) + 4000; // 4-9 sec
        setTimeout(sendNextBrMessage, delay);
    } catch (e) {
        setTimeout(sendNextBrMessage, 6000);
    }
}

// Slower Argentina Chat Loop (5 - 10 seconds)
async function sendNextArMessage() {
    try {
        if (!botConfig.isActive) {
            setTimeout(sendNextArMessage, 5000);
            return;
        }
        const sender = pick(arUsers);
        const finalMsg = pick(arMessagesPool);

        await supabase.from('tv_chat').insert({
            username: sender,
            role: 'MEMBER',
            message: finalMsg,
            channel_id: AR_CHANNEL_ID
        });
        console.log(`[AR BOT] ${sender}: ${finalMsg}`);

        const delay = Math.floor(Math.random() * 5000) + 5000; // 5-10 sec
        setTimeout(sendNextArMessage, delay);
    } catch (e) {
        setTimeout(sendNextArMessage, 6000);
    }
}

console.log('🤖 Multi-Room Chat Bot Başlatıldı (Global + Brazil + Argentina)...');
sendNextMessage();
sendNextBrMessage();
sendNextArMessage();

// --- YAĞMUR (HYPE) SİSTEMİ ---
let isRainActive = false;
let rainParticipants = new Set();

function scheduleNextRain() {
    // 60 dakikalık (3600000 ms) dilim içinde rastgele bir an
    const oneHour = 60 * 60 * 1000;
    const randomTime = Math.floor(Math.random() * oneHour);
    
    console.log(`[HYPE] Sonraki yağmur ${Math.floor(randomTime / 60000)} dakika ${Math.floor((randomTime % 60000) / 1000)} saniye sonra!`);
    
    setTimeout(() => {
        startRainEvent();
    }, randomTime);
}

async function startRainEvent() {
    isRainActive = true;
    rainParticipants.clear();
    
    // Anons
    await sendSystemMessage('🚨 BÜYÜK YAĞMUR GELİYOR! Son 10 Saniye! Kazanmak için hemen sohbete yaz! 🚨');
    
    // Geri sayım (10'dan 1'e)
    for (let i = 10; i > 0; i--) {
        await new Promise(r => setTimeout(r, 1000));
        await sendSystemMessage(`⏳ ${i}...`);
    }
    
    // Süre Bitti
    isRainActive = false;
    await sendSystemMessage('🛑 SÜRE BİTTİ! Kazananlar Hesaplanıyor...');
    await new Promise(r => setTimeout(r, 2000)); // Hype bekleyişi
    
    let participants = Array.from(rainParticipants);
    if (participants.length === 0) {
        await sendSystemMessage('😔 Kimse katılmadı! Yağmur iptal edildi.');
    } else {
        // En fazla 10 kişi seç
        let winners = [];
        let maxWinners = Math.min(10, participants.length);
        
        for (let i = 0; i < maxWinners; i++) {
            let rndIdx = Math.floor(Math.random() * participants.length);
            winners.push(participants[rndIdx]);
            participants.splice(rndIdx, 1);
        }
        
        let rewardOptions = ['100₺', '250₺', '500₺', '1000₺', '50 FreeSpin'];
        let reward = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
        let winnerNames = winners.map(w => `@${w}`).join(', ');
        
        await sendSystemMessage(`[RAIN_EVENT_END] 🎉 Yağmur bitti! Kesemize bereket! Kazanan şanslılar: ${winnerNames}... Gözünüz sohbette olsun, yenisi her an gelebilir!`);
    }
    
    // Sonraki saati kur
    scheduleNextRain();
}

async function sendSystemMessage(msg) {
    const payload = {
        username: 'SystemAdmin',
        role: 'ADMIN',
        message: msg,
        channel_id: TR_CHANNEL_ID
    };
    await supabase.from('tv_chat').insert(payload);
    console.log(`[HYPE] SystemAdmin -> ${msg}`);
}

// Supabase Listener for Hype
supabase.channel('public:tv_chat')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tv_chat' }, payload => {
        if (isRainActive) {
            let username = payload.new.username;
            if (username !== 'SystemAdmin') {
                rainParticipants.add(username);
            }
        }
    })
    .subscribe();

// Başlangıçta zamanlayıcıyı kur
// scheduleNextRain();
