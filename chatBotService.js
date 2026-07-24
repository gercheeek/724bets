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
const TR_CHANNEL_ID = '00000000-0000-0000-0000-000000000000';

const users = [
    // İngilizce / Global Tarz
    "AceHunter", "RiverRat", "DealerBust", "Spin2Win", "JackpotJunkie", 
    "BetMaverick", "CryptoWhale", "SlotSniper", "LuckyStrike777", "BlackJackKing", 
    "VegasVibe", "NeonNights", "HighRollerZ", "AllInManiac", "ChipsNCoins", 
    "RoyalFlushX", "DiceWhisperer", "SpinCartel", "MaxBetRider", "CardShark99",
    "DoubleDownPro", "SplitTheEights", "BustTheDealer", "PitBoss", "WheelOfFortune",
    // Türkçe Casino / Argo Tarzı
    "KasaBuken", "MasaMubtelasi", "CarkCeviren", "AsGeldii", "Yirmibir21", 
    "CiftSifir", "KirmiziSiyah", "SekerZengini", "DedeVurgunu", "KatlamaSanati", 
    "KasaKatili", "ZarTutan", "MakineCildirdi", "SonSpinci", "BlackjackBasi", 
    "RestCeken", "KartSayan", "BonusAvcisi", "PatlayanKasa", "KirmiziAs", 
    "MacaKizi", "KupaBesi", "SinekVale", "OlymposYikicisi", "VurgunGecesi"
];

const casinoMessages = [
    // Blackjack Mesajları
    "ulan kasaya 5 geldi yanına 16 çekti yine 21 yaptı, bu oyun adamı deli eder!",
    "kasa hep mi 20 çeker arkadaş, 19'da kaldık patladık yine",
    "ikiye katladık (double down) as geldi, masayı sildim süpürdüm valla",
    "abi blackjackte yan bahis (side bet) girmeyen harbi kaybeder, perfect pairs candır",
    "böl (split) baba böl, 8'leri bölmezsen ne anladın sen bu oyundan",
    "krupiye resmen bizimle dalga geçiyor üst üste 3 kere blackjack mi yapar bi insan",
    "masada ugursuz biri var arkadas adam yuzunden kasa 21 bulup duruyor",
    "16'da çektim 5 geldi, ulan kalbim duracaktı az kalsın",
    "evolution masaları yeminle kilitlendi, yer yok yer",

    // Slot Mesajları (Dede, Sweet Bonanza, Sugar Rush)
    "dede (gates of olympus) bugün çok cimri, x100 atıp duruyor ama birleştirmiyor",
    "sugar rush'ta x500 düştü kalbim duracaktı az kalsın yeminle",
    "sweet bonanza yine boş geçiyor, free spinleri yedi bitirdi namussuz",
    "abi max bet girdim makine çıldırdı, ekran coin doldu resmen!",
    "spaceman'de tam 10x beklerken 1.1x'de patladık yine şaka gibi...",
    "dog house megaways girmeyin beyler bugün fena yutuyor makine",
    "ulan satın alma (bonus buy) yapıyorum 100 liralık ödeme veriyor dalga geçer gibi",
    "pragmatic oyunlarında saat 12'den sonra bi bereket geliyor sanki",
    "dede elini kaldırdı ama yıldırım atmadı, o anki hayal kırıklığı yeminle hiçbir şeyde yok",
    "hacksaw oyunları bi açılırsa tam açılıyor, dünden beri x1000 kovalıyorum"
];

const emojis = ['😂', '🔥', '🚀', '💸', '🤑', '😅', '🤬', '🤦‍♂️', '👀', '⚽️', '🎯', '🎰', '🎲'];

let lastCrypto = [];
let lastNews = [];
let usedNewsTitles = new Set(); 

async function fetchLiveData() {
    try {
        console.log("Canlı veriler çekiliyor (Binance & Google News)...");
        try {
            const cryptoRes = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT"]');
            if (cryptoRes.ok) {
                lastCrypto = await cryptoRes.json();
            }
        } catch (err) {}

        try {
            const parser = new Parser();
            const feed = await parser.parseURL('https://news.google.com/rss/headlines/section/topic/SPORTS?hl=tr&gl=TR&ceid=TR:tr');
            if (feed && feed.items) {
                lastNews = feed.items; 
            }
        } catch (err) {}
    } catch (e) {}
}

function sloppyfy(text) {
    if (Math.random() > botConfig.sloppyRate) return text;
    let t = text.toLowerCase();
    t = t.replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');
    t = t.replace(/v/g, 'w').replace(/vallahi/g, 'walla').replace(/evet/g, 'aynen');
    t = t.replace(/,/g, '').replace(/\./g, '').replace(/\?/g, '??').replace(/!/g, '!!');
    t = t.replace(/kardeşim/g, 'kardesim').replace(/ne diyorsunuz/g, 'ne dionuz');
    if (Math.random() > 0.5) t = t + t.slice(-1) + t.slice(-1);
    return t;
}

function addEmoji(text) {
    if (Math.random() < botConfig.emojiRate) {
        const emoji = emojis[Math.random() * emojis.length | 0];
        if (Math.random() > 0.5) return `${text} ${emoji}`;
        return `${emoji} ${text}`;
    }
    return text;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// =========================================================
// CUSTOM SCENARIO GENERATOR (10 TOPICS x 1000s OF VARIATIONS)
// =========================================================
function getGenerativeSentence() {
    const topics = [
        'england_france', 'deschamps_zidane', 'world_cup_final', 'galatasaray_mctominay', 
        'fener_david', 'besiktas_antony', 'trabzon_champ', 'argentina_referee', 
        'crypto_boom', 'superlig_fixture', 'casino', 'finans'
    ];
    
    // Rastgele konulardan birini veya canli veriyi sec
    const chosenTopic = pick(topics);
    
    const intro = ['beyler', 'agalar', 'arkadaslar', 'valla', 'yeminle', 'harbiden', 'ulan', ''];
    const reaction = ['saka gibi', 'inanamadim', 'yok artik', 'ne dionuz bu ise', 'sasirtmadi gerci', 'efsane valla', 'vay be'];

    if (chosenTopic === 'england_france') {
        const statements = [
            'abi dün ingiltere maçına 7+ gol bastım, 23 oran yakaladım borçları kapattım valla.',
            'fransa ms1 girmiştim, 4 gol atıp nasıl yenildiler çıldıracağım yeminle.',
            'o 4-6 biten çılgın ingiltere maçında karşılıklı gol girenler voleyi vurdu.',
            'tarihi maç oldu yemin ediyorum, fransa nın 4 atıp yenilmesi şaka gibi.',
            'ingiltere fransa maçı sayesinde hayatım kurtuldu 7+ gol ne demek abi ya.'
        ];
        return statements[Math.floor(Math.random() * statements.length)];
    }
    
    if (chosenTopic === 'deschamps_zidane') {
        const desc = ['deschamps i', 'fransa teknik direktorunu', 'deschamps babayi', 'fransanin hocayi'];
        const action = ['kovmuslar', 'paketlemisler', 'harcamislar 6 gol yiyince', 'kovdular mac biter bitmez'];
        const zid = ['zidane', 'zizou', 'kel zidane', 'zinedine zidane'];
        const zAction = ['parise ucuyomus diyolar.', 'takimin basina geciyormus.', 'anlasmis bile.', 'yeni hoca oluyormus.'];
        return `${pick(intro)} ${pick(desc)} ${pick(action)} ${pick(zid)} ${pick(zAction)}`;
    }
    
    if (chosenTopic === 'world_cup_final') {
        const team1 = ['ispanya', 'yamal', 'ispanyollar'];
        const team2 = ['arjantin', 'messi', 'messi nin son dansi'];
        const act = ['kupa efsane olacak', 'final ne heyecanli olur', 'bahis siteleri kilitlenmis', 'bu aksam nefesler tutuldu'];
        const guess = ['ben messi alir diyorum', 'ispanya parcalar bence', 'arjantin birakmaz', 'yamal sov yapar'];
        return `${pick(intro)} ${pick(team1)} mi ${pick(team2)} mi? ${pick(act)} ${pick(guess)}.`;
    }
    
    if (chosenTopic === 'galatasaray_mctominay') {
        const gs = ['galatasaray', 'cim bom', 'gs', 'aslan'];
        const player = ['mctominay icin', 'mctominayi almak icin', 'manchesterli mctominay a'];
        const act = ['ingiltereye ucmus', 'cikaarma yapmis baskan', 'teklif yapmislar'];
        const react = ['gelirse ortasaha ucar', 'torreira ile muthis olurlar', 'zor transfer bence', 'yok artik gelir mi sence'];
        return `${pick(intro)} ${pick(gs)} ${pick(player)} ${pick(act)}... ${pick(react)}`;
    }
    
    if (chosenTopic === 'fener_david') {
        const fb = ['fener', 'fenerbahce', 'mourinho', 'mourinho baba'];
        const act = ['jonathan david e', 'lille golcusu david e', 'david ile bizzat'];
        const res = ['keseyi acmis diyolar.', 'gorusmus diyolar.', 'kancayi takmis.'];
        const guess = ['gelse dzeko yedege duser.', 'efsane forvet olur valla.', 'forvet hatti inanilmaz olur.'];
        return `${pick(intro)} ${pick(fb)} ${pick(act)} ${pick(res)} ${pick(guess)}`;
    }
    
    if (chosenTopic === 'besiktas_antony') {
        const bjk = ['besiktas', 'kartal', 'bjk'];
        const p = ['manchesterli antony i', 'antony sürprizini', 'kanat icin antony i'];
        const act = ['kiralik bitirmis', 'buyuk asama kaydetmis', 'anlasmaya varilmis diyolar'];
        const r = ['sag kanat efsane olur', 'o adam tr de is yapar', 'pek umudum yok ama hayirlisi'];
        return `${pick(intro)} ${pick(bjk)} ${pick(p)} ${pick(act)}... ${pick(r)}`;
    }
    
    if (chosenTopic === 'trabzon_champ') {
        const ts = ['trabzonspor', 'trabzon', 'ts yonetimi'];
        const talk = ['sampiyonluk kupasi trabzona gelecek dedi', 'sampiyon biziz diyo', 'kupayi alacaz diyolar'];
        const r = ['transferler fena gerci', 'takim cabuk uyum saglamis', 'bu sene yaris kizisacak valla', 'trabzon zorlar bu sezon'];
        return `${pick(intro)} ${pick(ts)} ${pick(talk)}! ${pick(r)}`;
    }
    
    if (chosenTopic === 'argentina_referee') {
        const arg = ['arjantin basini', 'arjantin kampi', 'messiler'];
        const blame = ['ispanya lobisi yapiyor demis', 'fifayi topa tutmus', 'hakemlere baski var diyomus'];
        const r = ['mac oncesi algi yapiyolar', 'arjantin hakemlere agliyor', 'klasik final oncesi krizleri', 'hakem kurbani olmak istemiyolar'];
        return `${pick(intro)} ${pick(arg)} ${pick(blame)}.. ${pick(r)}`;
    }
    
    if (chosenTopic === 'crypto_boom') {
        const btc = ['bitcoin', 'btc'];
        const price = ['64 bin 600 leri', '64.600 usd uzerini', '64 bin bariyerini'];
        const act = ['gorunce', 'test edince', 'kirdikca'];
        const usdt = ['tether (usdt) hacmi', 'kripto yatirimlari', 'site bakiye hareketleri'];
        const res = ['rekor kirmis diyolar', 'ucmus gitmis resmen', 'tavan yapmis'];
        return `${pick(intro)} ${pick(btc)} ${pick(price)} ${pick(act)} ${pick(usdt)} ${pick(res)}!`;
    }

    if (chosenTopic === 'superlig_fixture') {
        const fikstur = ['2026-2027 fiksturu', 'yeni sezon fiksturu', 'super lig kuralari'];
        const derbi = ['5. haftadaki gs-trabzon', 'galatasaray trabzon 5. hafta', 'trabzon - gs derbisi ilk mactan'];
        const r = ['efsane olacak', 'fikstur muthis valla', 'super bi sezon bizi bekliyor', 'baslasa da mac alsak artik'];
        return `${pick(intro)} ${pick(fikstur)} cekilmis, ${pick(derbi)} ${pick(r)}`;
    }

    if (chosenTopic === 'casino') {
        const game = ['sugar rush', 'sweet bonanza', 'gates of olympus', 'plinko', 'crazy time'];
        const action = ['oynayan var mi', 'giren oldu mu', 'deneyen var mi'];
        const outcome = ['cok iyi odeme veriyor suan', 'patladi iyice kazandirmiyor', 'x1000 verdi demin inanamadim'];
        return `${pick(intro)} ${pick(game)} ${pick(action)}? ${pick(outcome)}`;
    }
    
    if (chosenTopic === 'finans') {
        const method = ['tether', 'papara', 'payco', 'banka havalesi', 'kripto'];
        const action = ['ile para cektim', 'ile yatirim yaptim', 'cekimi verdim'];
        const result = ['2 dakikada yatti', 'aninda gecti hesaba', 'hizi cok iyi'];
        return `${pick(intro)} ${pick(method)} ${pick(action)} demin, ${pick(result)}.`;
    }
}

function generateMessages() {
    let baseMessages = [];
    
    // 2. Haber ve Veri Tüketim Mantığı (Queue Sistemi)
    if (lastNews && lastNews.length > 0) {
        let freshNews = lastNews.filter(n => !n.used);
        if (freshNews.length > 0) {
            const newsItem = pick(freshNews);
            newsItem.used = true; // Veriyi 'kullanıldı' olarak işaretle
            
            const cleanTitle = newsItem.title.split(' - ')[0].replace(/["']/g, '');
            const intros = ['Haberlere baktınız mı?', 'Gördünüz mü beyler', 'Şimdi okudum:', 'Yok artık:', 'Az önce düştü:', 'Son dakika diyolar:'];
            baseMessages.push(`${pick(intros)} ${cleanTitle}`);
        }
    }

    // Üretken motordan farklı konular cekiyoruz
    baseMessages.push(getGenerativeSentence());
    baseMessages.push(getGenerativeSentence());
    baseMessages.push(getGenerativeSentence());
    baseMessages.push(getGenerativeSentence());
    
    // Slot/Blackjack mesajlarını havuza ekliyoruz
    baseMessages.push(pick(casinoMessages));
    
    // Bet Share Pop-up (Casino/Spor Bahis Paylaşımı)
    if (Math.random() < 0.25) {
        // %25 ihtimalle bir bahis paylaşımı ekle
        const id1 = Math.floor(Math.random() * 900) + 100;
        const id2 = Math.floor(Math.random() * 900) + 100;
        const id3 = Math.floor(Math.random() * 900) + 100;
        const id4 = Math.floor(Math.random() * 900) + 100;
        const betId = `${id1}.${id2}.${id3}.${id4}`;
        
        const shareTexts = [
            'tam 10k yiyor 10k atıyor yemeden atsana aq oyunu',
            'beyler bu oyunda 65 carpan var sembol yok aq oyununda',
            'sonunda be! max win geldi yeminle ellerim titriyor',
            'abi 100x beklerken patladik yine, kasayi sifirladi',
            'su oyunu oynayanin aklina sasarim',
            'vurgun boyle yapilir agalar izleyin',
            'bugun makine cok comert herkese dagitiyor'
        ];
        
        const type = Math.random() < 0.8 ? 'Casino' : 'Spor';
        baseMessages.push(`${type}: #${betId} ${pick(shareTexts)}`);
    }
    
    return baseMessages;
}

let messageQueue = [];
let mode = 'NORMAL';
let normalMsgCount = 0;
let fightIndex = 0;
let postMuteIndex = 0;
let recentSenders = [];

// Admin Kavgasi Senaryosu
let fightQueue = [
    { u: 'Kadir_Baba', m: 'abi bu Gates of Olympus yuzunden kupon bile yapamiyoruz artik kasa eridi bitti walla', r: 'MEMBER' },
    { u: 'Tetikci_Kemal', m: '@Kadir_Baba oynamayi bilmiyosan oynama kardesim burasi bahis sitesi git baska yerde agla', r: 'MEMBER' },
    { u: 'Kadir_Baba', m: '@Tetikci_Kemal ne agliycam birader gercekleri soyluyorum sen max bet vurdugun icin tuzu kuru takiliyosun heralde', r: 'MEMBER' },
    { u: 'Ege_Efesi', m: 'beyler birbirinize girmeyin bosverin hafta sonu maclarinda gorusuruz', r: 'MEMBER' },
    { u: 'Tetikci_Kemal', m: '@Ege_Efesi klavye delikanliligi yapmayin lan bana adamsaniz ozelden yazin numaranizi', r: 'MEMBER' },
    { u: 'Kadir_Baba', m: 'sen kimsinde numara istiyosun oglum klavye basindan havlama', r: 'MEMBER' },
    { u: 'SystemAdmin', m: 'Burada küfürleşmek ve kavga etmek KESİNLİKLE YASAKTIR! Herkese 2 dakika konuşma yasağı (MUTE) verdim. Herkes sakinleşsin.', r: 'ADMIN' }
];

let postMuteQueue = [
    { u: 'Umut_07', m: 'admin kardes sakin ya bisey demedik ki biz', r: 'MEMBER' },
    { u: 'Yasar_Usta', m: 'admin abi haklisin ozur dileriz tansiyon yukseldi genclerde bi an', r: 'MEMBER' },
    { u: 'Tetikci_Kemal', m: 'neyse maca donelim beyler bosverin..', r: 'MEMBER' },
    { u: 'Zalim_Kuponcu', m: 'harbi iddaaya odaklanalim bence hic gerek yok kavgaya', r: 'MEMBER' }
];

// 8 Saatlik simülasyon kontrolcüsü
const SIMULATION_DURATION = 8 * 60 * 60 * 1000; // 8 saat
const startTime = Date.now();

async function sendNextMessage() {
    try {
        let sender, finalMsg, role = 'MEMBER', delay;
        
        if (Date.now() - startTime > SIMULATION_DURATION) {
            console.log("8 saatlik sohbet simülasyonu tamamlandı.");
            return;
        }

        if (mode === 'NORMAL') {
            // Eğer bot inaktifse, bir sonraki döngüde kontrol et (ama bekle)
            if (!botConfig.isActive) {
                setTimeout(sendNextMessage, 5000);
                return;
            }

            if (messageQueue.length === 0) {
                await fetchLiveData();
                messageQueue = generateMessages().sort(() => 0.5 - Math.random());
            }
            let rawMsg = messageQueue.pop();
            finalMsg = sloppyfy(rawMsg);
            finalMsg = finalMsg.replace(/["']/g, ''); // Anti-Spiker Regex
            finalMsg = addEmoji(finalMsg);
            sender = pick(users);
            
            // Habere Anında Yanıt Sistemi (Etkileşim)
            let isNews = ['Haberlere', 'Gördünüz mü', 'Şimdi okudum', 'Yok artık', 'Az önce', 'Son dakika'].some(k => finalMsg.includes(k));
            if (isNews && Math.random() < 0.70) {
                // Habere tepki veren birini sıraya hemen kaynak ekle! (Sıradaki pop() bunu alacak)
                const followUps = ['ne o acikla aq diye merakta birakma', 'hangi gelisme la detay ver', 'link var mi beyler nedir olay', 'kolpa haber o gecin bunlari', 'hadi canim ordan harbiden mi', 'neler oluyo yeminle bi biz bilmiyoruz'];
                messageQueue.push(`@${sender} ${pick(followUps)}`); 
            } else if (Math.random() > 0.6 && recentSenders.length > 0) {
                // Son konusanlara gercekci yanit
                let targetUser = pick(recentSenders);
                if (targetUser !== sender && !finalMsg.includes('@')) {
                    finalMsg = `@${targetUser} ${finalMsg}`;
                }
            }

            recentSenders.push(sender);
            if (recentSenders.length > 5) recentSenders.shift();

            normalMsgCount++;
            if (normalMsgCount > 25) { 
                mode = 'FIGHT';
                fightIndex = 0;
                normalMsgCount = 0;
            }
            // Delay mantığı: 2-3 dk aralarında bazen 5 (120 sn ile 300 sn arası)
            const minDelay = 120 * 1000;
            const maxDelay = 300 * 1000;
            // %20 ihtimalle hızlı tartışma (30-90 sn)
            delay = Math.random() < 0.20 
                ? Math.floor(Math.random() * 60000) + 30000 // 30-90 sn
                : Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

        } else if (mode === 'FIGHT') {
            let fightData = fightQueue[fightIndex];
            sender = fightData.u;
            finalMsg = addEmoji(sloppyfy(fightData.m));
            role = fightData.r;
            fightIndex++;
            
            if (role === 'ADMIN') {
                mode = 'MUTED';
                finalMsg = fightData.m;
                delay = 120000; 
                console.log('--- 2 DAKİKA MUTE BAŞLADI ---');
            } else {
                delay = Math.floor(Math.random() * 5000) + 3000;
            }

        } else if (mode === 'MUTED') {
            mode = 'POST_MUTE';
            postMuteIndex = 0;
            let postData = postMuteQueue[postMuteIndex];
            sender = postData.u;
            finalMsg = addEmoji(sloppyfy(postData.m));
            role = postData.r;
            postMuteIndex++;
            delay = 3000;
            
        } else if (mode === 'POST_MUTE') {
            let postData = postMuteQueue[postMuteIndex];
            sender = postData.u;
            finalMsg = addEmoji(sloppyfy(postData.m));
            role = postData.r;
            postMuteIndex++;
            delay = Math.floor(Math.random() * 15000) + 5000;
            if (postMuteIndex >= postMuteQueue.length) {
                mode = 'NORMAL';
            }
        }

        const payload = {
            username: sender,
            role: role,
            message: finalMsg,
            channel_id: TR_CHANNEL_ID
        };

        const { error } = await supabase.from('tv_chat').insert(payload);
        if (!error) {
            console.log(`[BOT] Gönderildi: ${sender} [${role}] -> ${finalMsg}`);
        }

        setTimeout(sendNextMessage, delay);

    } catch (err) {
        console.error('Bot loop error:', err);
        setTimeout(sendNextMessage, 10000); 
    }
}

fetchLiveData().then(() => {
    console.log('🤖 24/7 Chat Bot Başlatıldı (10 Güncel Senaryolu Sınırsız Üretken Motor)...');
    sendNextMessage();
});

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
