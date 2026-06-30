import { MatchAnalysis, NewsArticle } from './types';

// Helper to dynamically calculate future match dates relative to current load time
const getFutureDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const wcMatchesRaw = [
  {
    dateOffset: 0,
    time: '20:00',
    group: 'Son 32',
    home: '🇨🇮 Fildişi Sahili',
    away: '🇳🇴 Norveç',
    pred: 'KG Var',
    conf: 80,
    score: 8.0,
    odd: '1.75',
    tactical: "Fildişi, 4-3-3 dizilişiyle merkez orta sahayı kalabalık tutup Norveç’in merkezden oyun kurulumunu bloke etmeye çalışacak. Norveç ise 4-4-2’nin getirdiği kanat varyasyonlarıyla Fildişi'nin bek arkasında oluşan boşlukları değerlendirmeyi hedefliyor.",
    breaking: "Fildişi’nin merkezdeki pas trafiğini Norveç’in savunma yerleşimindeki kademe hatalarıyla bozduğu an, maçın seyrini değiştirir.",
    scenario: "Norveç’in hücum hattındaki efektiflik, savunma zaafını dengeleyecektir. Skor Tahmini: 1 - 2."
  },
  {
    dateOffset: 1,
    time: '00:00',
    group: 'Son 32',
    home: '🇫🇷 Fransa',
    away: '🇸🇪 İsveç',
    pred: 'MS 1',
    conf: 85,
    score: 8.5,
    odd: '1.45',
    tactical: "Fransa 4-2-3-1 ile topa sahip olma oranını %60’ın üzerinde tutmaya çalışırken, İsveç 4-5-1 bloğuyla merkez kanallarını daraltacak.",
    breaking: "Fransa’nın merkezdeki 'oyun kurucu' rolündeki oyuncusunun, İsveç'in iki hattı arasındaki boşluğa sızıp vereceği son pas maçı bitirir.",
    scenario: "İsveç'in düşük şut beklentisi, Fransa'nın kalesini gole kapatma ihtimalini yükseltiyor. Skor Tahmini: 2 - 0."
  },
  {
    dateOffset: 1,
    time: '04:00',
    group: 'Son 32',
    home: '🇲🇽 Meksika',
    away: '🇪🇨 Ekvador',
    pred: '2.5 Altı',
    conf: 75,
    score: 7.5,
    odd: '1.60',
    tactical: "İki takım da 3-5-2 benzeri dizilişlerle kanat beklerini çok ileri çıkarıyor. Bu durum orta sahada ciddi bir pres mücadelesine yol açacaktır.",
    breaking: "Orta sahada top kaybı yapan tarafın, defans bloğuna hızlı dönüş yapamadığı an yaşanacak 1v1 pozisyonlar.",
    scenario: "Teknik olarak birbirini nötralize edecekler. Skor Tahmini: 1 - 1."
  },
  {
    dateOffset: 1,
    time: '19:00',
    group: 'Son 32',
    home: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 İngiltere',
    away: '🇨🇩 DR Kongo',
    pred: 'MS 1',
    conf: 90,
    score: 9.0,
    odd: '1.25',
    tactical: "İngiltere'nin pas istasyonu görevi gören orta sahası, DR Kongo'nun fiziksel baskısına rağmen top dolaşımını yüksek tutacak.",
    breaking: "İngiltere'nin set hücumunda DR Kongo savunmasını yana genişleterek merkezde yaratacağı boşluklar maçın kilit noktası.",
    scenario: "İngiltere farka gider. Skor Tahmini: 3 - 0."
  },
  {
    dateOffset: 1,
    time: '23:00',
    group: 'Son 32',
    home: '🇧🇪 Belçika',
    away: '🇸🇳 Senegal',
    pred: 'KG Var',
    conf: 80,
    score: 8.0,
    odd: '1.80',
    tactical: "Belçika hücumda 3-4-3’e dönerek sayısal üstünlük kurmak isterken, Senegal yüksek savunma çizgisiyle ofsayt tuzağı kuracak.",
    breaking: "Belçika’nın stoperleri ile orta sahası arasındaki 30 metrelik alanın, Senegal’in hızlı hücumcuları tarafından işgali.",
    scenario: "KG Var, teknik verilere göre en mantıklı seçenek. Skor Tahmini: 2 - 1."
  },
  {
    dateOffset: 2,
    time: '03:00',
    group: 'Son 32',
    home: '🇺🇸 ABD',
    away: '🇧🇦 Bosna-Hersek',
    pred: 'MS 1',
    conf: 75,
    score: 7.5,
    odd: '1.55',
    tactical: "ABD 4-3-3 ile tempo odaklı, Bosna 4-4-2 ile blok savunma odaklı oynayacak.",
    breaking: "ABD’nin yoğun presiyle (PPDA değeri düşük tutularak) Bosna savunmasından kazanacağı toplar.",
    scenario: "ABD kazanır. Skor Tahmini: 2 - 0."
  },
  {
    dateOffset: 2,
    time: '22:00',
    group: 'Son 32',
    home: '🇪🇸 İspanya',
    away: '🇦🇹 Avusturya',
    pred: '2.5 Altı',
    conf: 85,
    score: 8.5,
    odd: '1.70',
    tactical: "İspanya %70+ topla oynama hedefiyle merkez orta sahayı domine ederken, Avusturya şiddetli pres (gegenpressing) uygulayacak.",
    breaking: "İspanya'nın presi kırmak için stoperleriyle yaptığı kısa pas trafiği.",
    scenario: "Az gol, çok taktik. Skor Tahmini: 1 - 0."
  },
  {
    dateOffset: 3,
    time: '02:00',
    group: 'Son 32',
    home: '🇵🇹 Portekiz',
    away: '🇭🇷 Hırvatistan',
    pred: 'Beraberlik',
    conf: 70,
    score: 7.0,
    odd: '3.10',
    tactical: "İki takımın da orta sahası, topun yönünü değiştiren (switch play) oyuncularla dolu.",
    breaking: "Duran top organizasyonları; iki takımın da hava topu savunması zafiyet gösterebilir.",
    scenario: "Beraberlik kokan bir teknik analiz. Skor Tahmini: 1 - 1."
  },
  {
    dateOffset: 3,
    time: '06:00',
    group: 'Son 32',
    home: '🇨🇭 İsviçre',
    away: '🇩🇿 Cezayir',
    pred: 'MS 1',
    conf: 80,
    score: 8.0,
    odd: '1.85',
    tactical: "İsviçre’nin hücum genişliği ile Cezayir’in merkezi kapatma planı çarpışacak.",
    breaking: "Cezayir’in kontra çıkarken topu kaybettiği anda İsviçre’nin yapacağı hızlı geçiş.",
    scenario: "İsviçre kazanır. Skor Tahmini: 2 - 1."
  },
  {
    dateOffset: 3,
    time: '21:00',
    group: 'Son 32',
    home: '🇦🇺 Avustralya',
    away: '🇪🇬 Mısır',
    pred: '1.5 Altı',
    conf: 75,
    score: 7.5,
    odd: '2.40',
    tactical: "Avustralya'nın fizik gücü ve hava topu istatistikleri, Mısır'ın dar alan savunmasını zorlayacak.",
    breaking: "Duran toplarda Avustralya’nın getirdiği uzun oyuncuların yarattığı kaos.",
    scenario: "1.5 Altı seçeneği teknik olarak öne çıkıyor. Skor Tahmini: 0 - 1."
  },
  {
    dateOffset: 4,
    time: '01:00',
    group: 'Son 32',
    home: '🇦🇷 Arjantin',
    away: '🇨🇻 Cape Verde',
    pred: 'Hnd MS 1',
    conf: 95,
    score: 9.5,
    odd: '1.30',
    tactical: "Arjantin, rakibini derin blokta (low block) yakalayıp şut açısı arayacak.",
    breaking: "İlk golün erken gelmesi, Arjantin'in üzerindeki stresi atıp rahat oynamasını sağlar.",
    scenario: "Handikaplı Arjantin galibiyeti. Skor Tahmini: 4 - 0."
  },
  {
    dateOffset: 4,
    time: '04:30',
    group: 'Son 32',
    home: '🇨🇴 Kolombiya',
    away: '🇬🇭 Gana',
    pred: '2.5 Üstü',
    conf: 85,
    score: 8.5,
    odd: '1.75',
    tactical: "Kolombiya, yüksek tempo ve sürekli oyuncu değişimiyle Gana savunmasının dengesini bozacak.",
    breaking: "Kolombiya'nın kanat bindirmelerinde Gana beklerinin kademeye geç dönmesi.",
    scenario: "2.5 Üstü banko. Skor Tahmini: 3 - 1."
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
      analysis: `Dünya Kupası 2026 - Son 32 mücadelesi! ${m.home} ile ${m.away} çeyrek final biletini kapmak için sahaya çıkıyor. Telafisi olmayan bu eleme maçında iki takım da tüm gücüyle savaşacak.`,
      tacticalSummary: m.tactical,
      breakingPoint: m.breaking,
      bettingScenario: m.scenario,
      prediction: m.pred,
      confidence: m.conf,
      modelScore: m.score,
      recentHistory: `Eleme aşamasının bu kritik turunda sürprizlere yer yok.`,
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
