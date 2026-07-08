import { MatchAnalysis, NewsArticle } from './types';

// Helper to dynamically calculate future match dates relative to current load time
const getFutureDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const wcMatchesRaw = [
  {
    exactDate: '2026-07-07', time: '19:00',
    home: '🇦🇷 Arjantin', away: '🇪🇬 Mısır',
    odds1: '1.38', oddsX: '4.90', odds2: '9.50',
    oddsOver: '2.06', oddsUnder: '1.83',
    odds1X: '1.07', odds12: '1.21', oddsX2: '3.15'
  },
  {
    exactDate: '2026-07-07', time: '19:00',
    home: '🇦🇲 Ararat-Ermenistan', away: '🇱🇻 Riga FC',
    odds1: '2.80', oddsX: '3.10', odds2: '2.40',
    oddsOver: '2.00', oddsUnder: '1.72',
    odds1X: '1.48', odds12: '1.29', oddsX2: '1.36'
  },
  {
    exactDate: '2026-07-07', time: '19:00',
    home: '🇱🇹 FK Kauno Zalgiris', away: '🇽🇰 Drita (KOS)',
    odds1: '1.84', oddsX: '3.30', odds2: '3.90',
    oddsOver: '2.00', oddsUnder: '1.70',
    odds1X: '1.19', odds12: '1.25', oddsX2: '1.82'
  },
  {
    exactDate: '2026-07-07', time: '20:00',
    home: '🇲🇰 Vardar Skopje', away: '🇫🇮 KuPS',
    odds1: '2.30', oddsX: '3.30', odds2: '2.80',
    oddsOver: '1.94', oddsUnder: '1.78',
    odds1X: '1.36', odds12: '1.27', oddsX2: '1.50'
  },
  {
    exactDate: '2026-07-07', time: '20:15',
    home: '🇱🇺 UNA Strassen', away: '🇸🇲 La Fiorita',
    odds1: '1.26', oddsX: '5.00', odds2: '9.50',
    oddsOver: '1.72', oddsUnder: '2.00',
    odds1X: '1.01', odds12: '1.11', oddsX2: '3.30'
  },
  {
    exactDate: '2026-07-07', time: '20:30',
    home: '🇲🇹 Floriana', away: '🇮🇪 Shamrock Rovers',
    odds1: '2.95', oddsX: '3.20', odds2: '2.25',
    oddsOver: '2.05', oddsUnder: '1.68',
    odds1X: '1.54', odds12: '1.28', oddsX2: '1.32'
  },
  {
    exactDate: '2026-07-07', time: '21:30',
    home: '🇧🇦 Borac Banja Luka', away: '🇧🇬 Levski Sofia',
    odds1: '3.20', oddsX: '3.00', odds2: '2.20',
    oddsOver: '1.68', oddsUnder: '2.05',
    odds1X: '1.56', odds12: '1.31', oddsX2: '1.28'
  },
  {
    exactDate: '2026-07-07', time: '21:45',
    home: '🇫🇴 Klaksvik', away: '🇱🇺 FC Atert Bissen',
    odds1: '1.46', oddsX: '4.00', odds2: '6.00',
    oddsOver: '1.84', oddsUnder: '1.86',
    odds1X: '1.07', odds12: '1.18', oddsX2: '2.45'
  },
  {
    exactDate: '2026-07-07', time: '22:00',
    home: '🇮🇸 Vikingur Reykjavik', away: '🇭🇺 Gyori ETO',
    odds1: '2.55', oddsX: '3.30', odds2: '2.45',
    oddsOver: '1.72', oddsUnder: '2.00',
    odds1X: '1.45', odds12: '1.26', oddsX2: '1.42'
  },
  {
    exactDate: '2026-07-07', time: '23:00',
    home: '🇨🇭 İsviçre', away: '🇨🇴 Kolombiya',
    odds1: '3.65', oddsX: '3.15', odds2: '2.27',
    oddsOver: '1.72', oddsUnder: '2.22',
    odds1X: '1.73', odds12: '1.35', oddsX2: '1.34'
  },
  {
    exactDate: '2026-07-08', time: '18:00',
    home: '🇰🇿 Kairat Almaty', away: '🇲🇪 Sutjeska',
    odds1: '1.29', oddsX: '4.80', odds2: '9.00',
    oddsOver: '1.76', oddsUnder: '1.96',
    odds1X: '1.02', odds12: '1.12', oddsX2: '3.10'
  },
  {
    exactDate: '2026-07-08', time: '20:00',
    home: '🇧🇾 ML Vitebsk', away: '🇷🇴 Univ. Craiova',
    odds1: '3.40', oddsX: '3.10', odds2: '2.05',
    oddsOver: '2.05', oddsUnder: '1.68',
    odds1X: '1.64', odds12: '1.29', oddsX2: '1.24'
  },
  {
    exactDate: '2026-07-08', time: '21:00',
    home: '🇺🇦 Ukrayna U19', away: '🇩🇪 Almanya U19',
    odds1: '3.60', oddsX: '3.60', odds2: '1.95',
    oddsOver: '1.74', oddsUnder: '2.02',
    odds1X: '1.79', odds12: '1.26', oddsX2: '1.26'
  },
  {
    exactDate: '2026-07-09', time: '20:00',
    home: '🇺🇦 Dinamo Kiev', away: '🇷🇴 Univ. Cluj',
    odds1: '1.58', oddsX: '3.80', odds2: '5.00',
    oddsOver: '1.72', oddsUnder: '2.00',
    odds1X: '1.12', odds12: '1.20', oddsX2: '2.15'
  },
  {
    exactDate: '2026-07-09', time: '21:00',
    home: '🇷🇸 Vojvodina', away: '🇭🇺 Ferencvaros',
    odds1: '2.85', oddsX: '3.30', odds2: '2.25',
    oddsOver: '1.68', oddsUnder: '2.05',
    odds1X: '1.52', odds12: '1.26', oddsX2: '1.35'
  },
  {
    exactDate: '2026-07-09', time: '23:00',
    home: '🇫🇷 Fransa', away: '🇲🇦 Fas',
    odds1: '1.60', oddsX: '3.85', odds2: '6.55',
    oddsOver: '2.05', oddsUnder: '1.84',
    odds1X: '1.13', odds12: '1.29', oddsX2: '2.42'
  }
];

const generateDemoAnalyses = (): MatchAnalysis[] => {
  return wcMatchesRaw.map((m, index) => {
    return {
      id: `analysis-${index}-${m.home.replace(/[^a-zA-Z0-9]/g, '')}`,
      league: `Öne Çıkan Maçlar`,
      homeTeam: m.home,
      awayTeam: m.away,
      matchTime: m.time,
      matchDate: m.exactDate,
      analysis: `${m.home} ile ${m.away} karşı karşıya geliyor. Uzman ekibimizin detaylı istatistiksel analizine göre bu maçta dikkat çeken fırsatlar var.`,
      tacticalSummary: "Her iki takımın da son maçlarındaki form durumları ve taktiksel dizilişleri bu karşılaşmanın yüksek tempoda geçeceğine işaret ediyor.",
      breakingPoint: "Orta sahadaki ikili mücadeleler ve kanat organizasyonları maçın kilidini çözecek olan en önemli faktörler.",
      bettingScenario: `Taraf bahsinde ${m.odds1 < m.odds2 ? 'ev sahibi' : 'deplasman'} takım bir adım önde. Gol beklentisi oranlara da yansımış durumda.`,
      prediction: parseFloat(m.odds1) < parseFloat(m.odds2) ? 'MS 1' : 'MS 2',
      confidence: 85,
      modelScore: 8.5,
      recentHistory: 'İki takım arasındaki rekabette son dönemdeki istatistikler ve mevcut kadro kaliteleri.',
      expectedGoals: '1.80 - 1.20',
      bookieOdds: [],
      createdAt: Date.now() - (index * 3600000),
      sport: 'Futbol',
      odds1: m.odds1,
      oddsX: m.oddsX,
      odds2: m.odds2,
      oddsOver: m.oddsOver,
      oddsUnder: m.oddsUnder,
      odds1X: m.odds1X,
      odds12: m.odds12,
      oddsX2: m.oddsX2
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
