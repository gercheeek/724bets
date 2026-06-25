import { MatchAnalysis, NewsArticle } from './types';

// Helper to dynamically calculate future match dates relative to current load time
const getFutureDate = (offsetDays: number): string => {
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
    home: 'Curacao',
    away: 'Fildişi Sahili',
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
    home: 'Ekvador',
    away: 'Almanya',
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
    home: 'Tunus',
    away: 'Hollanda',
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
    home: 'Japonya',
    away: 'İsveç',
    pred: 'MS 1',
    conf: 70,
    score: 7.0,
    odd: '1.91',
    tactical: "İsveç'in fizikli, durağan ve hava toplarına dayalı yapısına karşı, Japonya'nın bitmek bilmeyen enerjisi, kısa pas trafiği ve hızlı yön değiştirmeleriyle oynayacağı seyir zevki yüksek bir eşleşme.",
    breaking: "İsveç'in ağır stoperleri, Japon hücumcuların ceza sahası çevresindeki hızlı duvar pasları karşısında pozisyon hatası yapmaya çok müsait.",
    scenario: "Sistem Japonya'yı favori gösteriyor. Modern futbolun gereksinimi olan hız and dinamizm avantajıyla Japonya galibiyeti bu oranla oldukça değerli bir tercih."
  },
  {
    dateOffset: 1,
    time: '05:00',
    group: 'C Grubu',
    home: 'Türkiye',
    away: 'Amerika Birleşik Devletleri',
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
    home: 'Paraguay',
    away: 'Avustralya',
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
    home: 'Cape Verde',
    away: 'Suudi Arabistan',
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
    home: 'Uruguay',
    away: 'İspanya',
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
    home: 'Yeni Zelanda',
    away: 'Belçika',
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
    home: 'Mısır',
    away: 'İran',
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
    home: 'Hırvatistan',
    away: 'Gana',
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
    home: 'Panama',
    away: 'İngiltere',
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
    home: 'Kolombiya',
    away: 'Portekiz',
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
    home: 'Demokratik Kongo',
    away: 'Özbekistan',
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
    home: 'Cezayir',
    away: 'Avusturya',
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
    home: 'Ürdün',
    away: 'Arjantin',
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
    home: 'Güney Afrika',
    away: 'Kanada',
    pred: 'MS 2',
    conf: 70,
    score: 7.0,
    odd: '1.74',
    tactical: "Kanada'nın bireysel hızlara ve açık alan oyununa dayalı sistemi, Güney Afrika'nın organizasyon eksikliklerini cezalandırmak için mükemmel bir yapı sunuyor.",
    breaking: "Kanada'nın hızlı kanat oyuncularının Güney Afrika savunma hattının arkasına yapacağı koşular savunma dengesini altüst edecektir.",
    scenario: "Hızlı hücum aksiyonları ve bireysel oyuncu kalitesiyle Kanada, Güney Afrika karşısında galibiyete daha yakın olan taraf."
  }
];

const generateDemoAnalyses = (): MatchAnalysis[] => {
  return wcMatchesRaw.map((m, index) => {
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
};

export const demoAnalyses = generateDemoAnalyses();

export const demoCoupons: any[] = [
    {
        id: 'coupon-1',
        title: 'Günün Bankosu',
        date: new Date().toISOString().split('T')[0],
        riskLevel: 'LOW',
        category: 'Futbol',
        totalOdd: '3.45',
        matches: [
            { homeTeam: 'Arsenal', awayTeam: 'Liverpool', prediction: 'MS 1', odd: '1.85', analysis: 'Arsenal iç sahada dominant bir oyun sergiliyor. Liverpool ise savunmada eksiklerle boğuşuyor.' },
            { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', prediction: '2.5 ÜST', odd: '1.65', analysis: 'El Clasico mücadeleleri genelde bol gollü geçer, iki takımın da hücum hattı formda.' }
        ]
    },
    {
        id: 'coupon-2',
        title: 'NBA Gecesi',
        date: new Date().toISOString().split('T')[0],
        riskLevel: 'MEDIUM',
        category: 'Basketbol',
        totalOdd: '4.10',
        matches: [
            { homeTeam: 'LA Lakers', awayTeam: 'GS Warriors', prediction: 'MS 1', odd: '1.90', analysis: 'Lakers, LeBron ve Davis\'in dönüşüyle ivme yakaladı.' },
            { homeTeam: 'Miami Heat', awayTeam: 'NY Knicks', prediction: '215.5 ÜST', odd: '2.15', analysis: 'İki takımın da tempolu oyunları baremin aşılmasını sağlayacaktır.' }
        ]
    },
    {
        id: 'coupon-3',
        title: 'Hafta Sonu Sürprizi',
        date: new Date().toISOString().split('T')[0],
        riskLevel: 'HIGH',
        category: 'Futbol',
        totalOdd: '12.50',
        matches: [
            { homeTeam: 'Dortmund', awayTeam: 'Bayern Münih', prediction: 'MS 1', odd: '3.20', analysis: 'Dortmund bu sezon evinde devlere geçit vermiyor.' },
            { homeTeam: 'Napoli', awayTeam: 'Juventus', prediction: 'KG VAR', odd: '1.95', analysis: 'Napoli savunması son haftalarda hata yapıyor, Juve boş geçmez.' }
        ]
    }
];

export const demoNews: NewsArticle[] = [
    {
        id: 'news-3',
        title: 'Verstappen, Cidde\'de Rakipsiz: Red Bull Dublesi Kapıda mı?',
        slug: 'verstappen-cidde-rakipsiz-red-bull-duble',
        excerpt: 'Suudi Arabistan Grand Prix\'sinde baskın performans sergileyen Max Verstappen, pole pozisyonunu alarak rakiplerine gözdağı verdi.',
        content: '<h2>Red Bull Dominansı Devam Ediyor</h2><p>2026 Formula 1 sezonunun ikinci yarışı olan Suudi Arabistan GP\'sinde sıralama turları heyecanı yaşandı. Max Verstappen, en yakın rakibi Charles Leclerc\'e 0.3 saniye fark atarak zirveye yerleşti.</p><p>Sergio Perez\'in de üçüncü sıradan start alacak olması, Red Bull\'un Cidde\'de yeni bir duble yapabileceği sinyallerini veriyor.</p>',
        category: 'Formula 1',
        image: 'https://picsum.photos/seed/f1-ver/800/450',
        authorId: 'author-1',
        authorName: 'Spor Editörü',
        views: 2150,
        status: 'published',
        createdAt: Date.now() - 259200000,
        updatedAt: Date.now() - 259200000,
    },
    {
        id: 'news-4',
        title: 'Marc Marquez, MotoGP Katar\'da Muhteşem Dönüş Yaptı',
        slug: 'marc-marquez-motogp-katar-donus',
        excerpt: 'Ducati formasıyla Marquez, Lusail\'de podyuma çıkarak geri dönüşünü ilan etti.',
        content: '<h2>Marquez Geri Döndü!</h2><p>MotoGP 2026 sezonu Katar GP\'si, Marc Marquez\'in muhteşem dönüşüne sahne oldu. Ducati resmi takımıyla yarışan İspanyol pilot, ikinci sıradan start alarak podyumda bitirdi.</p><p>Yarışı kazanan Bagnaia olurken, üçüncülüğü Martin aldı. Marquez\'in Ducati\'deki uyum süreci beklentilerin ötesinde ilerliyor.</p>',
        category: 'MotoGP',
        image: 'https://picsum.photos/seed/motogp-mm/800/450',
        authorId: 'author-1',
        authorName: 'Spor Editörü',
        views: 678,
        status: 'published',
        createdAt: Date.now() - 345600000,
        updatedAt: Date.now() - 345600000,
    },
    {
        id: 'news-5',
        title: 'Toprak Razgatlıoğlu, Superbike Şampiyonasında Liderliğini Sürdürüyor',
        slug: 'toprak-razgatlioglu-superbike-liderlik',
        excerpt: 'Türk pilot, Phillip Island\'da çifte zaferle puan farkını açtı.',
        content: '<h2>Türk Bayrağı Zirvede</h2><p>Superbike Dünya Şampiyonası\'nda BMW formasıyla yarışan Toprak Razgatlıoğlu, Avustralya\'nın Phillip Island pistinde iki yarışı da kazanarak liderliğini pekiştirdi.</p><p>Toprak, son 5 yarışın 4\'ünü kazanarak rakiplerinin 45 puan önüne geçti. BMW M1000RR ile mükemmel uyum sağlayan Türk pilot, ikinci şampiyonluğuna doğru emin adımlarla ilerliyor.</p>',
        category: 'Superbike',
        image: 'https://picsum.photos/seed/sbk-tr/800/450',
        authorId: 'author-1',
        authorName: 'Spor Editörü',
        views: 1560,
        status: 'published',
        createdAt: Date.now() - 432000000,
        updatedAt: Date.now() - 432000000,
    },
    {
        id: 'news-6',
        title: 'Djokovic, Indian Wells\'te Alcaraz\'ı Devirerek Şampiyon Oldu',
        slug: 'djokovic-indian-wells-alcaraz-sampiyon',
        excerpt: 'Sırp tenisçi, finalde Alcaraz\'ı 3 sette geçerek 98. ATP şampiyonluğuna ulaştı.',
        content: '<h2>Efsane Durmak Bilmiyor</h2><p>Novak Djokovic, Indian Wells Masters 1000 finalinde Carlos Alcaraz\'ı 7-5, 4-6, 6-3 skoruyla mağlup ederek turnuvanın şampiyonu oldu.</p><p>37 yaşındaki Sırp tenisçi, kariyerinin 98. ATP zaferine ulaşırken, genç rakibi Alcaraz\'a nesiller arası bir ders verdi.</p><h2>Sıradaki Hedef</h2><p>Djokovic, 100. zafer barajını Miami Open\'da kırmayı hedefliyor.</p>',
        category: 'Tenis',
        image: 'https://picsum.photos/seed/tennis-dj/800/450',
        authorId: 'author-1',
        authorName: 'Spor Editörü',
        views: 934,
        status: 'published',
        createdAt: Date.now() - 518400000,
        updatedAt: Date.now() - 518400000,
    },
    {
        id: 'news-7',
        title: 'Beşiktaş-Galatasaray Derbisi: Taktik Savaş Bekleniyor',
        slug: 'besiktas-galatasaray-derbisi-taktik',
        excerpt: 'Süper Lig\'in en ateşli derbisinde iki teknik adam arasında taktik satranç oynanacak.',
        content: '<h2>Derbi Ateşi Yanıyor</h2><p>Süper Lig\'in 28. haftasında Beşiktaş ile Galatasaray, Tüpraş Stadyumu\'nda karşı karşıya gelecek.</p><p>Beşiktaş\'ın iç saha performansı bu sezon dikkat çekerken, Galatasaray\'ın deplasman galibiyetleri de göz dolduruyor. İki takımın da savunma disiplinine verdiği önem nedeniyle düşük skorlu bir maç bekleniyor.</p><h2>Kadrolar</h2><p>Her iki takımda da eksik oyuncu bulunmuyor, bu da derbinin kalitesini artıracak.</p>',
        category: 'Futbol',
        image: 'https://picsum.photos/seed/bjk-gs/800/450',
        authorId: 'author-1',
        authorName: 'Spor Editörü',
        views: 2890,
        status: 'published',
        createdAt: Date.now() - 43200000,
        updatedAt: Date.now() - 43200000,
    },
    {
        id: 'news-8',
        title: 'Milano Derbisi: AC Milan ve Inter Arasında Ateşli Gece',
        slug: 'milano-derbisi-ac-milan-inter',
        excerpt: 'Serie A\'nın en büyük derbisinde San Siro\'da gol düellosu bekleniyor.',
        content: '<h2>Derby della Madonnina</h2><p>İtalya futbolunun en ateşli karşılaşması olan Milano Derbisi, bu hafta sonu San Siro\'da oynanacak. AC Milan ve Inter, şampiyonluk yarışında kritik bir virajda.</p><p>Milan\'ın son haftalardaki formu dikkat çekerken, Inter\'in Lautaro Martinez liderliğindeki hücum hattı her maç gol atıyor.</p><h2>İstatistikler</h2><p>Son 10 Milano derbisinin 8\'inde karşılıklı gol çıktı. KG Var seçeneği bu maç için de güçlü duruyor.</p>',
        category: 'Futbol',
        image: 'https://picsum.photos/seed/milan-derby/800/450',
        authorId: 'author-1',
        authorName: 'Spor Editörü',
        views: 1780,
        status: 'published',
        createdAt: Date.now() - 21600000,
        updatedAt: Date.now() - 21600000,
    },
];

export const demoPopularBets: any[] = [
    {
        id: 'pb-1',
        homeTeam: 'Sarpsborg 08',
        awayTeam: 'Bodo Glimt',
        matchTime: 'Bugün 20:00',
        prediction: 'İlk Yarı/Maç Sonucu:',
        predictionShort: '1/2',
        odds: 16.65,
        playCount: 131,
        isHot: true,
        affiliateUrl: 'https://724bahis.net',
        league: 'Norveç'
    },
    {
        id: 'pb-2',
        homeTeam: 'Ballymena U',
        awayTeam: 'Bangor FC',
        matchTime: 'Bugün 21:45',
        prediction: 'İlk Yarı/Maç Sonucu:',
        predictionShort: '2/1',
        odds: 23.50,
        playCount: 128,
        isHot: true,
        affiliateUrl: 'https://724bahis.net',
        league: 'K. İrlanda'
    },
    {
        id: 'pb-3',
        homeTeam: 'Tromso IL',
        awayTeam: 'Lillestrom',
        matchTime: 'Bugün 20:00',
        prediction: 'İlk Yarı/Maç Sonucu:',
        predictionShort: '2/1',
        odds: 22.25,
        playCount: 114,
        isHot: true,
        affiliateUrl: 'https://724bahis.net',
        league: 'Norveç'
    },
    {
        id: 'pb-4',
        homeTeam: 'AZ Alkmaar',
        awayTeam: 'Shakhtar Donetsk',
        matchTime: 'Yarın 19:45',
        prediction: 'Altı/Üstü 2,5 ve Karşılıklı Gol:',
        predictionShort: 'Üst ve Var',
        odds: 1.76,
        playCount: 82,
        isHot: true,
        affiliateUrl: 'https://724bahis.net',
        league: 'UEFA'
    }
];
