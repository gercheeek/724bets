import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Parse .env.local manually
const envPath = './.env.local';
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const getFutureDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const wcMatchesRaw = [
  // Bugün (Perşembe - getFutureDate(0))
  {
    dateOffset: 0,
    time: '23:00',
    group: 'A Grubu',
    home: '🇨🇼 Curacao',
    away: '🇨🇮 Fildişi Sahili',
    pred: 'HMS 2 (-1)',
    conf: 85,
    score: 8.5,
    odd: '1.55',
    tactical: "Curacao'nun tamamen kendi yarı alanına çekilerek uygulayacağı derin savunmaya karşı, Fildişi Sahili'nin fiziksel üstünlüğü ve kanat organizasyonlarıyla kilidi açmaya çalışacağı bir eşleşme.",
    breaking: "Fildişi Sahili'nin duran toplarda veya ilk yarının başlarında bulacağı erken bir gol, Curacao'nun direncini tamamen kırıp maçın farklı bir boyuta taşınmasına neden olacaktır.",
    scenario: "İki takım arasındaki devasa kalite ve tecrübe farkı göz önüne alındığında, Fildişi Sahili'nin sahadan en az iki farklı galibiyetle ayrılması (Handikaplı MS 2) en rasyonel yatırım seçeneği olarak öne çıkıyor."
  },
  {
    dateOffset: 0,
    time: '23:00',
    group: 'A Grubu',
    home: '🇪🇨 Ekvador',
    away: '🇩🇪 Almanya',
    pred: 'KG VAR',
    conf: 75,
    score: 7.5,
    odd: '1.80',
    tactical: "Almanya'nın topa sahip olma ve pas istasyonlarıyla domine etme isteğine karşın, Ekvador'un atletik yapısıyla uygulayacağı şok pres ve dikey geçiş hücumlarına sahne olacak taktiksel bir savaş.",
    breaking: "Almanya'nın hücuma çıkarken orta sahada kaptıracağı toplar, Ekvador'un hızlı kanat oyuncuları tarafından bitirici kontra ataklarla cezalandırılabilir.",
    scenario: "Almanya favori olsa da savunma arkasında bırakacağı boşluklar Ekvador için büyük bir fırsat. İki takımın da hücum dinamikleri karşılıklı gol seçeneğini cazip kılıyor."
  },

  // Yarın (Cuma - getFutureDate(1))
  {
    dateOffset: 1,
    time: '02:00',
    group: 'B Grubu',
    home: '🇹🇳 Tunus',
    away: '🇳🇱 Hollanda',
    pred: 'Sadece Deplasman Gol Atar',
    conf: 80,
    score: 8.0,
    odd: '1.65',
    tactical: "Tunus'un riskten tamamen uzak, katı bir 5-4-1 bloğuyla bekleyeceği; Hollanda'nın ise yaratıcı ayaklarıyla bu kilidi açmak için sürekli set hücumları deneyeceği bir oyun.",
    breaking: "Hollanda'nın ceza sahası dışından atacağı şutlar veya beklerin bindirmeleriyle yaratılacak ekstra sayısal üstünlük, Tunus savunmasının dengesini bozacak ana unsurdur.",
    scenario: "Tunus'un ofansif gücünün Hollanda savunmasını aşması çok düşük bir ihtimal. Hollanda'nın gol yemeden rahat bir galibiyet alacağı senaryo en mantıklı liman."
  },
  {
    dateOffset: 1,
    time: '02:00',
    group: 'B Grubu',
    home: '🇯🇵 Japonya',
    away: '🇸🇪 İsveç',
    pred: 'MS 1',
    conf: 70,
    score: 7.0,
    odd: '1.91',
    tactical: "İsveç'in fizikli, durağan ve hava toplarına dayalı yapısına karşı, Japonya'nın bitmek bilmeyen enerjisi, kısa pas trafiği ve hızlı yön değiştirmeleriyle oynayacağı seyir zevki yüksek bir eşleşme.",
    breaking: "İsveç'in ağır stoperleri, Japon hücumcuların ceza sahası çevresindeki hızlı duvar pasları karşısında pozisyon hatası yapmaya çok müsait.",
    scenario: "Sistem Japonya'yı favori gösteriyor. Modern futbolun gereksinimi olan hız ve dinamizm avantajıyla Japonya galibiyeti bu oranla oldukça değerli bir tercih."
  },
  {
    dateOffset: 1,
    time: '05:00',
    group: 'C Grubu',
    home: '🇹🇷 Türkiye',
    away: '🇺🇸 ABD',
    pred: '2.5 ÜST',
    conf: 75,
    score: 7.5,
    odd: '1.85',
    tactical: "Amerika'nın atletizmi ve tempolu oyununa karşı, Türkiye'nin yetenekli ayaklarıyla reaksiyon vereceği, orta sahaların çabuk geçileceği açık ve git-gelli bir karşılaşma.",
    breaking: "İki takımın da savunma geçişlerinde yaşadığı zaaflar. Beklerin hücuma fazla katıldığı anlarda arkada bırakılacak devasa boşluklar iki taraf için de gol şansı yaratacaktır.",
    scenario: "Taraf bahsinin zor olduğu bu dengeli eşleşmede (Beraberlik oranı 4.15), hücum aksiyonlarının bolluğu ve iki takımın da gol bulma arzusu 2.5 Gol Üstü tercihini öne çıkarıyor."
  },
  {
    dateOffset: 1,
    time: '05:00',
    group: 'C Grubu',
    home: '🇵🇾 Paraguay',
    away: '🇦🇺 Avustralya',
    pred: '2.5 ALT',
    conf: 85,
    score: 8.5,
    odd: '1.50',
    tactical: "Güney Amerika'nın en katı savunma yapan ekiplerinden Paraguay ile disiplinli ve fizik gücü yüksek Avustralya'nın, yaratıcılıktan uzak ve fiziksel mücadeleye dayalı yıpratıcı maçı.",
    breaking: "Maçta akan oyunda pozisyon bulmak çok zor olacağı için, kilidi ancak duran top organizasyonlarından veya bireysel bir savunma hatasından gelecek tek bir gol açabilir.",
    scenario: "2.32'lik olağanüstü düşük beraberlik oranı, sistemin maçın tamamen kilitleneceğini öngördüğünün en büyük kanıtı. Taraf bahsi yerine az gollü bir senaryo en net yatırımdır."
  },

  // Cumartesi (27 Haziran 2026 - getFutureDate(2))
  {
    dateOffset: 2,
    time: '03:00',
    group: 'D Grubu',
    home: '🇨🇻 Kape Verde',
    away: '🇸🇦 Suudi Arabistan',
    pred: 'MS 1',
    conf: 65,
    score: 6.5,
    odd: '2.55',
    tactical: "Kape Verde'nin akıcı Afrika hücum stili ile Suudi Arabistan'ın sistem takımı olma çabası çarpışıyor. Kape Verde'nin bireysel yetenekleri bu maçta fark yaratabilir.",
    breaking: "Kape Verde'nin kanat organizasyonları ve bire birdeki üstünlük çabaları Suudi Arabistan savunma hattının dengesini bozacaktır.",
    scenario: "Oranın yüksekliği ve Kape Verde'nin bireysel yetenek kalitesi göz önüne alındığında, ev sahibi galibiyeti sürpriz kuponlar için cazip bir seçenek."
  },
  {
    dateOffset: 2,
    time: '03:00',
    group: 'D Grubu',
    home: '🇺🇾 Uruguay',
    away: '🇪🇸 İspanya',
    pred: 'KG VAR',
    conf: 75,
    score: 7.5,
    odd: '1.75',
    tactical: "İspanya'nın \"tiki-taka\" pas oyunu ve topa sahip olma arzusu, Uruguay'ın \"Garra Charrúa\" ruhu ve öldürücü kontra ataklarıyla test edilecek.",
    breaking: "İspanya'nın hücuma yerleşirken veya geriden oyun kurarken kaptıracağı kritik toplar, Uruguay'ın hızlı geçiş hücumlarıyla cezalandırılacaktır.",
    scenario: "Uruguay'ın sert ve geçiş hücumuna dayalı yapısı ile İspanya'nın topa sahip olup baskı kurma isteği karşılıklı gol seçeneğini ön plana çıkarıyor."
  },
  {
    dateOffset: 2,
    time: '06:00',
    group: 'E Grubu',
    home: '🇳🇿 Yeni Zelanda',
    away: '🇧🇪 Belçika',
    pred: 'İY/MS 2/2',
    conf: 80,
    score: 8.0,
    odd: '1.45',
    tactical: "Yeni Zelanda'nın direncini Belçika'nın altın jenerasyon kalıntıları ve elit hücum gücü erken kıracaktır. Belçika'nın ilk yarıdan fişi çekeceği bir senaryo.",
    breaking: "Belçika'nın maçın başında kuracağı yoğun baskı ve erken bulacağı gol, Yeni Zelanda'nın oyun planını tamamen altüst edecektir.",
    scenario: "Kadro kalitesindeki devasa fark göz önüne alındığında, Belçika'nın ilk yarıyı önde kapatıp maç sonucunda da galibiyete ulaşması (2/2) ideal bir oran sunuyor."
  },
  {
    dateOffset: 2,
    time: '06:00',
    group: 'E Grubu',
    home: '🇪🇬 Mısır',
    away: '🇮🇷 İran',
    pred: 'İlk Yarı 0.5 Alt',
    conf: 60,
    score: 6.0,
    odd: '2.40',
    tactical: "İki pragmatik ve savunma güvenliğini ön planda tutan teknik ekibin satranç maçı. Tarafların birbirini tartacağı ve risk almayacağı ilk yarıda golsüz eşitlik çok muhtemel.",
    breaking: "Takımların ilk devrede yapabileceği bireysel savunma hataları veya duran top konsantrasyon kayıpları bu kilit yapıyı bozabilir.",
    scenario: "İki ekibin de öncelikle gol yememeyi hedefleyeceği ilk 45 dakikalık dilimde gol çıkmaması yüksek oranıyla denemeye değer bir bahis seçeneğidir."
  },

  // Pazar (28 Haziran 2026 - getFutureDate(3))
  {
    dateOffset: 3,
    time: '00:00',
    group: 'F Grubu',
    home: '🇭🇷 Hırvatistan',
    away: '🇬🇭 Gana',
    pred: 'MS 1',
    conf: 75,
    score: 7.5,
    odd: '1.81',
    tactical: "Hırvatistan'ın tecrübeli ve elit orta sahası, oyunun temposunu tamamen dikte edecektir. Gana'nın atletizmi, Hırvatların oyun aklını alt etmeye yetmeyebilir.",
    breaking: "Hırvatistan'ın pas kalitesiyle Gana'nın pres hattını kırıp savunma arkasına atacağı akıl dolu paslar maçın kaderini belirleyecektir.",
    scenario: "Oyun zekası ve tecrübe avantajıyla Hırvatistan galibiyeti, bu oranla kuponlar için son derece değerli bir tercih haline geliyor."
  },
  {
    dateOffset: 3,
    time: '00:00',
    group: 'F Grubu',
    home: '🇵🇦 Panama',
    away: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 İngiltere',
    pred: 'Deplasman 2.5 Üst',
    conf: 80,
    score: 8.0,
    odd: '1.65',
    tactical: "İngiltere'nin geniş rotasyonu ve yıldızlarla dolu hücum hattı, zayıf Panama savunmasını farklı geçecektir. Panama'nın açık alan bırakması İngiltere için bir şölen.",
    breaking: "İngiltere'nin hızlı kanat oyuncularının Panama bekleri üzerindeki kuracağı bire bir üstünlükler kalede üst üste tehlikeler yaratacaktır.",
    scenario: "İngiltere'nin zayıf rakibi karşısında gol yollarında zorlanmayacağını ve en az üç gol bulacağını (Deplasman 2.5 Üst) öngörüyoruz."
  },
  {
    dateOffset: 3,
    time: '02:30',
    group: 'G Grubu',
    home: '🇨🇴 Kolombiya',
    away: '🇵🇹 Portekiz',
    pred: 'KG VAR',
    conf: 70,
    score: 7.0,
    odd: '1.70',
    tactical: "İki ekibin de hücum potansiyeli çok yüksek ancak savunmaları kırılgan. Kolombiya'nın coşkusu ile Portekiz'in sistemli hücumları karşılıklı sayılar üretecektir.",
    breaking: "Savunma arkasına atılan koşularda iki takımın da stoper yerleşimlerindeki aksamalar gol pozisyonlarını doğuracaktır.",
    scenario: "Taraf seçmenin güç olduğu bu üst düzey mücadelede, karşılıklı gol seçeneği iki takımın da ofansif silahları düşünüldüğünde en makul limandır."
  },
  {
    dateOffset: 3,
    time: '02:30',
    group: 'G Grubu',
    home: '🇨🇩 Demokratik Kongo',
    away: '🇺🇿 Özbekistan',
    pred: 'MS 1',
    conf: 65,
    score: 6.5,
    odd: '1.80',
    tactical: "Kongo'nun fiziksel baskısı ve ev sahibi kıta avantajına yakın atmosferi, Özbekistan'ın teknik kapasitesini sahaya yansıtmasını zorlaştıracaktır.",
    breaking: "Kongo'nun fiziksel yıpratıcı presi karşısında Özbekistan'ın yapacağı basit pas hataları hızlı geçiş hücumlarına dönüşecektir.",
    scenario: "Kongo'nun fiziki üstünlüğü ve ikili mücadelelerdeki agresif yapısı, onları iç saha atmosferinde galibiyete bir adım daha yakın kılıyor."
  },
  {
    dateOffset: 3,
    time: '05:00',
    group: 'H Grubu',
    home: '🇩🇿 Cezayir',
    away: '🇦🇹 Avusturya',
    pred: 'MS 2',
    conf: 60,
    score: 6.0,
    odd: '2.77',
    tactical: "Avusturya'nın Rangnick yönetimindeki yoğun presli ve boğucu oyunu (Gegenpressing), Cezayir'in kırılgan oyun yapısını bozmaya ve galibiyete uzanmaya yeterli görünüyor.",
    breaking: "Avusturya'nın ön alandaki şok preslerine Cezayir'in geriden oyun kurarak çıkmaya çalışırken yapacağı kritik hatalar.",
    scenario: "Rangnick'in pres sisteminin Cezayir'i hataya zorlayacağını düşünüyoruz; Avusturya galibiyeti bu yüksek oranla değerlendirilmesi gereken bir fırsattır."
  },
  {
    dateOffset: 3,
    time: '05:00',
    group: 'H Grubu',
    home: '🇯🇴 Ürdün',
    away: '🇦🇷 Arjantin',
    pred: 'HMS 2 (-2)',
    conf: 85,
    score: 8.5,
    odd: '1.90',
    tactical: "Arjantin'in yetenek seli karşısında Ürdün'ün yapabileceği tek şey farkı düşük tutmaya çalışmak. Arjantin hücum hattı set hücumlarıyla rahat bir skor bulacaktır.",
    breaking: "Arjantin'in ceza sahası çevresindeki kreatif paslaşmaları, Ürdün'ün yerleşik savunma blokunu ilk yarım saatte delecektir.",
    scenario: "İki takım arasındaki devasa kalite farkı göz önüne alındığında, Arjantin'in en az 3 farklı kazanması (Handikaplı 2) en mantıklı bahis senaryosudur."
  },
  {
    dateOffset: 3,
    time: '22:00',
    group: 'I Grubu',
    home: '🇿🇦 Güney Afrika',
    away: '🇨🇦 Kanada',
    pred: 'MS 2',
    conf: 70,
    score: 7.0,
    odd: '1.74',
    tactical: "Kanada'nın bireysel hızlara ve açık alan oyununa dayalı sistemi, Güney Afrika'nın organizasyon eksikliklerini cezalandırmak için mükemmel bir yapı sunuyor.",
    breaking: "Kanada'nın hızlı kanat oyuncularının Güney Afrika savunma hattının arkasına yapacağı koşular savunma dengesini altüst edecektir.",
    scenario: "Hızlı hücum aksiyonları ve bireysel oyuncu kalitesiyle Kanada, Güney Afrika karşısında galibiyete daha yakın olan taraf."
  }
];

async function seed() {
  console.log('Generating World Cup matches...');
  const allMatches = wcMatchesRaw.map((m, index) => {
    const matchDate = getFutureDate(m.dateOffset);
    const odd2 = (parseFloat(m.odd) * 1.6).toFixed(2);
    return {
      id: `wc-2026-${index}-${m.home.replace(/[^a-zA-Z0-9]/g, '')}`,
      league: `Dünya Kupası 2026 - ${m.group}`,
      homeTeam: m.home,
      awayTeam: m.away,
      matchTime: m.time,
      matchDate,
      analysis: `Dünya Kupası 2026 grup aşamasında kritik randevu. ${m.home} ile ${m.away} kozlarını paylaşıyor. Turnuvanın bu aşamasında puan kaybı yaşamak istemeyen iki dev ekip de sahaya tam kadro çıkıyor.`,
      tacticalSummary: m.tactical,
      breakingPoint: m.breaking,
      bettingScenario: m.scenario,
      prediction: m.pred,
      confidence: m.conf,
      modelScore: m.score,
      recentHistory: `İki ülke arasında oynanan son karşılaşmalarda kıran kırana mücadeleler ve bol pozisyonlu anlar izlendi.`,
      expectedGoals: '2.10 - 1.10',
      bookieOdds: [
        { name: '21.com', odd1: m.odd, odd2, link: 'https://prod.trk21.com/click?domain=21.com', isHighest: true }
      ],
      createdAt: Date.now(),
      sport: 'Futbol'
    };
  });

  console.log(`Generated total of ${allMatches.length} World Cup matches.`);

  const { error } = await supabase
    .from('site_configs')
    .upsert({ key: 'site_analyses', value: allMatches, updated_at: new Date().toISOString() });

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Successfully updated site_analyses in site_configs with World Cup matches.');
  }
}

seed();
