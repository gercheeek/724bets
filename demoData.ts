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
    time: '22:00',
    group: '32. Tur',
    home: '🇪🇸 İspanya',
    away: '🇦🇹 Avusturya',
    pred: 'KG Var',
    conf: 85,
    score: 8.5,
    odd: '1.80',
    tactical: "İspanya, klasik 4-3-3 dizilişiyle topa sahip olma oranını %65'in üzerine çıkarıp seti rakip yarı sahaya yıkmayı hedefleyecek. Avusturya ise Ralf Rangnick ekolünün getirdiği agresif 4-4-2 şok presiyle İspanya'nın geriden oyun kurmasını engellemeye çalışacak.",
    breaking: "İspanya merkez orta sahasının, Avusturya'nın ilk bölgedeki yoğun presini kırdığı veya Avusturya'nın kaptığı toplarla İspanya savunma arkasındaki boşlukları yakaladığı an maçın yönünü belirler.",
    scenario: "Avusturya'nın tempolu ve fiziksel oyunu İspanya savunmasını hataya zorlar ancak İspanya'nın hücum yaratıcılığı da golü bulacaktır. Skor Tahmini: 2 - 1."
  },
  {
    dateOffset: 1,
    time: '02:00',
    group: '32. Tur',
    home: '🇵🇹 Portekiz',
    away: '🇭🇷 Hırvatistan',
    pred: 'MS 1',
    conf: 75,
    score: 7.5,
    odd: '1.85',
    tactical: "Portekiz, 4-2-3-1 dizilişiyle kanat varyasyonlarını ve merkezdeki dinamizmi birleştirmek isteyecektir. Hırvatistan ise yaşlanan ama hala elit seviyedeki 4-3-3 merkez üçlüsüyle oyunun temposunu düşürüp Portekiz'in coşkusunu baltalamayı amaçlıyor.",
    breaking: "Maçın temposunun Hırvatistan'ın istediği gibi düşük mü kalacağı, yoksa Portekiz'in geçiş hücumlarıyla oyunu kaosa mı sürükleyeceği kritik eşiktir.",
    scenario: "Portekiz'in geniş ve kaliteli kadro derinliği ikinci yarıda ağırlığını hissettirir. Skor Tahmini: 2 - 0."
  },
  {
    dateOffset: 1,
    time: '06:00',
    group: '32. Tur',
    home: '🇨🇭 İsviçre',
    away: '🇩🇿 Cezayir',
    pred: '2.5 Alt',
    conf: 80,
    score: 8.0,
    odd: '1.95',
    tactical: "İsviçre, disiplinli 3-4-2-1 yapısıyla savunma güvenliğini ön planda tutan, katı bir turnuva takımı görüntüsünde. Cezayir ise 4-3-3 dizilişiyle kanatlardaki bireysel yeteneklerine güveniyor.",
    breaking: "Cezayir'in sabırsız hücumlarında kaptıracağı toplar sonrası, İsviçre'nin kanat bekleriyle yapacağı hızlı kontrataklar maçın kilidini açar.",
    scenario: "İki takımın da kontrollü başlayacağı, hata payının düşük olduğu bir taktik savaş bizi bekliyor. Skor Tahmini: 1 - 0."
  },
  {
    dateOffset: 1,
    time: '21:00',
    group: '32. Tur',
    home: '🇦🇺 Avustralya',
    away: '🇪🇬 Mısır',
    pred: '2.5 Alt',
    conf: 85,
    score: 8.5,
    odd: '2.91',
    tactical: "Avustralya, fiziksel üstünlüğe dayalı, duran toplarda etkili olan düz bir 4-4-2 tercih edecektir. Mısır ise tamamen kompakt bir 4-5-1 düzeniyle alanı daraltıp, ilerideki süper starının yaratacağı bireysel deha anlarına bel bağlayacak.",
    breaking: "Avustralya'nın duran top organizasyonlarında Mısır savunmasının yapacağı tek bir adam paylaşım hatası veya Mısır'ın kontra atakta Avustralya'nın ağır savunmasını eksik yakalaması.",
    scenario: "Mısır savunmayı sert tutacaktır, Avustralya ise kilidi açmakta zorlanır. Skor Tahmini: 1 - 1."
  },
  {
    dateOffset: 2,
    time: '01:00',
    group: '32. Tur',
    home: '🇦🇷 Arjantin',
    away: '🇨🇻 Cape Verde',
    pred: 'İlk Yarı 1',
    conf: 90,
    score: 9.0,
    odd: '1.70',
    tactical: "Arjantin, 4-3-3 asimetrik dizilişiyle tam saha pres yapıp maçı ilk 30 dakikada koparmak isteyecektir. Cape Verde ise derin bir 5-4-1 blok yerleşimiyle tamamen kendi ceza sahası çevresini savunup tarihi bir direniş göstermeye çalışacak.",
    breaking: "Arjantin'in erken bulacağı bir gol Cape Verde'nin tüm planını yıkar ve farka yol açar; gol geciktikçe Cape Verde'nin direnci ve özgüveni artar.",
    scenario: "Kalite farkı çok bariz. Arjantin ilk yarıdan fişi çeker. Skor Tahmini: 3 - 0."
  },
  {
    dateOffset: 2,
    time: '04:30',
    group: '32. Tur',
    home: '🇨🇴 Kolombiya',
    away: '🇬🇭 Gana',
    pred: 'MS 1',
    conf: 75,
    score: 7.5,
    odd: '1.90',
    tactical: "Kolombiya, 4-2-3-1 dizilişiyle Güney Amerika agresifliğini ve teknik becerisini sahaya yansıtacak. Gana ise atletik 4-3-3 dizilişiyle fiziksel ikili mücadelelerde üstünlük kurup, Kolombiya'nın yaratıcı ayaklarına sert baskı uygulayacaktır.",
    breaking: "Gana orta sahasının yapacağı sert fauller sonrası oyunun gerilmesi ve Kolombiya'nın duran top/serbest vuruş yeteneğiyle bu sertliği cezalandırdığı an.",
    scenario: "İki takımın da fiziksel gücü yüksek ancak Kolombiya taktiksel olgunluk ve bitiricilik konusunda bir adım önde. Skor Tahmini: 2 - 1."
  },
  {
    dateOffset: 2,
    time: '20:00',
    group: '16. Tur',
    home: '🇨🇦 Kanada',
    away: '🇲🇦 Fas',
    pred: 'MS 2',
    conf: 80,
    score: 8.0,
    odd: '1.65',
    tactical: "Kanada, Alphonso Davies önderliğinde tamamen hıza dayalı bir sol kanat hücum planı uyguluyor. Fas ise meşhur disiplinli 4-1-4-1 yerleşimiyle alan kapatmada usta.",
    breaking: "Fas'ın katı savunma hattının Kanada'nın patlayıcı atletizmine karşı vereceği esneklik sınavı. Hakimi-Davies eşleşmesinden kimin galip çıkacağı maçı çözer.",
    scenario: "Fas bu tarz eleme turlarında gol yemesi çok zor bir takıma dönüşüyor. Skor Tahmini: 0 - 1."
  },
  {
    dateOffset: 3,
    time: '00:00',
    group: '16. Tur',
    home: '🇵🇾 Paraguay',
    away: '🇫🇷 Fransa',
    pred: 'MS 2',
    conf: 85,
    score: 8.5,
    odd: '1.60',
    tactical: "Paraguay, geleneksel 4-4-2 katı savunma anlayışıyla Fransa'yı durdurup maçı uzatmalara/penaltılara taşımak isteyecek. Fransa ise akışkan hücum hattıyla Paraguay'ın savunma duvarını yıkmaya çalışacak.",
    breaking: "Paraguay'ın ceza sahası yayında yapacağı bir anlık kademe hatası veya Fransa'nın bireysel yeteneklerinin yaratacağı 1v1 çalımlar.",
    scenario: "Paraguay ne kadar dirense de Fransa'nın hücum gücü bu kilidi açacaktır. Skor Tahmini: 0 - 2."
  },
  {
    dateOffset: 3,
    time: '23:00',
    group: '16. Tur',
    home: '🇧🇷 Brezilya',
    away: '🇳🇴 Norveç',
    pred: 'KG Var',
    conf: 80,
    score: 8.0,
    odd: '1.72',
    tactical: "Brezilya, saf yetenek dolu 4-2-3-1 dizilişiyle Norveç savunmasını sürekli dengesiz yakalamaya çalışacak. Norveç ise Haaland'ı beslemek adına 4-4-2 oynayacak.",
    breaking: "Brezilya'nın hücum ederken arkada bıraktığı boşluklarda Haaland'ın topla buluşup kaleciyle karşı karşıya kaldığı anlar maçın kaderini çizer.",
    scenario: "Norveç'in hücum efektifliği savunma zaaflarını dengeler. Bol gollü bir maç bizi bekler. Skor Tahmini: 3 - 2."
  },
  {
    dateOffset: 4,
    time: '03:00',
    group: '16. Tur',
    home: '🇲🇽 Meksika',
    away: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 İngiltere',
    pred: 'MS 2',
    conf: 75,
    score: 7.5,
    odd: '1.68',
    tactical: "Meksika, yüksek enerjili 4-3-3 şok presiyle İngiltere'nin geriden pasla çıkmasını bozmak isteyecek. İngiltere ise sabırlı dizilişiyle topu kontrol edip pozisyon arayacak.",
    breaking: "Meksika'nın coşkulu presinin kırıldığı an, İngiltere'nin orta saha kalitesi dönen topları toplayıp Meksika'yı kendi yarı sahasına hapsedecektir.",
    scenario: "Meksika turnuva takımıdır ve İngiltere'yi çok zorlar ancak İngiltere daha soğukkanlı kalıp maçı kazanmayı bilir. Skor Tahmini: 0 - 1."
  },
  {
    dateOffset: 5,
    time: '03:00',
    group: '16. Tur',
    home: '🇺🇸 ABD',
    away: '🇧🇪 Belçika',
    pred: 'KG Var',
    conf: 80,
    score: 8.0,
    odd: '1.88',
    tactical: "ABD, genç ve dinamik dizilişiyle sahayı çok geniş kullanıp, Belçika'nın ağır savunma hattını yıpratmak isteyecek. Belçika ise De Bruyne'ün pas istasyonlarıyla oyun zekasını konuşturup ABD'nin tecrübesizlik alanlarını cezalandırmayı hedefliyor.",
    breaking: "ABD'nin yüksek temposuna Belçika orta sahasının fiziksel olarak yanıt verip veremeyeceği. De Bruyne'e yapılacak presin kırıldığı an Belçika tehlike yaratır.",
    scenario: "ABD atletizmle üstünlük kurabilir, Belçika ise tecrübeyle karşılık verir. Karşılıklı goller olası. Skor Tahmini: 2 - 2."
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
