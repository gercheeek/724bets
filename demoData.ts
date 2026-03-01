import { MatchAnalysis } from './types';

export const demoAnalyses: MatchAnalysis[] = [
    // FEBRUARY 27
    {
        id: 'wolverhampton-villa',
        league: 'Premier League',
        homeTeam: 'WOLVERHAMPTON',
        awayTeam: 'ASTON VILLA',
        matchTime: '18:00',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Premier League temposu yüksek bir Midlands derbisi. Aston Villa topa daha fazla sahip olmayı hedeflerken, Wolverhampton geçiş oyununda etkili olmaya çalışacaktır. Villa’nın hücum hattı üretken ancak savunma arkasında boşluk bırakabiliyor. Wolves iç sahada agresif başlar.',
        breakingPoint: 'İlk 25 dakika. Villa öne geçerse maç açılır. Wolves erken gol bulursa oyun tamamen karşılıklı hücuma döner.',
        bettingScenario: 'İki takımda skor üretmeye yatkın. Erken gol gelirse 3.5 üst barajı bile zorlanabilir. 0-0 giderken tempo yüksekse canlı 2.5 Üst değerlendirilebilir.',
        prediction: 'KG VAR / 2.5 ÜST',
        confidence: 82,
        modelScore: 88,
        recentHistory: '7 Kazanç',
        expectedGoals: '2.85',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.72', odd2: '1.85', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.78', odd2: '1.92', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'augsburg-koln',
        league: 'Bundesliga',
        homeTeam: 'AUGSBURG',
        awayTeam: 'KÖLN',
        matchTime: '16:30',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Bundesliga’da alt sıraları ilgilendiren dengeli bir mücadele. Augsburg iç sahada kontrollü, Köln ise deplasmanda savunma güvenliğini ön planda tutuyor. Risk seviyesi düşük bir oyun bekleniyor.',
        breakingPoint: 'İlk golü atan taraf skoru korumaya oynayacaktır. 60. dakikaya kadar dengeli giderse tempo düşebilir.',
        bettingScenario: 'Orta saha mücadelesi yüksek, pozisyon sayısı sınırlı bir maç. 2.5 Alt ana senaryo. 0-0 devre ihtimali değerlendirilebilir.',
        prediction: '2.5 ALT',
        confidence: 76,
        modelScore: 82,
        recentHistory: '6 Kazanç',
        expectedGoals: '1.95',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.85', odd2: '1.95', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.92', odd2: '2.05', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'parma-cagliari',
        league: 'Serie A',
        homeTeam: 'PARMA',
        awayTeam: 'CAGLIARI',
        matchTime: '19:00',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Serie A’da taktik disiplin ön planda. Parma evinde kontrollü, Cagliari deplasmanda kapanan yapıda. Oyun sıkışık orta saha mücadelesine dönebilir.',
        breakingPoint: 'İlk gol çok belirleyici olacak. Özellikle 55-70 arası oyuncu değişiklikleri tempoyu belirler.',
        bettingScenario: 'Düşük tempolu, az gollü senaryo ağır basıyor. Parma kaybetmez seçeneği güvenli duruyor.',
        prediction: '2.5 ALT / 1X',
        confidence: 79,
        modelScore: 85,
        recentHistory: '9 Kazanç',
        expectedGoals: '2.10',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.65', odd2: '1.75', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.72', odd2: '1.82', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'levante-alaves',
        league: 'La Liga 2',
        homeTeam: 'LEVANTE',
        awayTeam: 'ALAVÉS',
        matchTime: '21:00',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'İki ekip de savunmada kırılgan. Levante iç sahada baskılı oynarken Alavés kontra ataklarla etkili olabilir.',
        breakingPoint: 'İlk yarı son bölümü (30-45 dk). Bu aralıkta gol çıkma ihtimali yüksek.',
        bettingScenario: 'Karşılıklı gol olasılığı yüksek. Erken gol gelirse 2.5 Üst desteklenebilir.',
        prediction: 'KG VAR',
        confidence: 80,
        modelScore: 84,
        recentHistory: '7 Kazanç',
        expectedGoals: '2.40',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.75', odd2: '1.85', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.82', odd2: '1.92', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'strasbourg-lens',
        league: 'Ligue 1',
        homeTeam: 'STRASBOURG',
        awayTeam: 'LENS',
        matchTime: '22:00',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Lens tempolu ve önde basan bir ekip. Strasbourg iç sahada açık oyun oynuyor. Geçiş hücumları belirleyici olabilir.',
        breakingPoint: 'İlk 20 dakikada gol gelirse maç tamamen açılır.',
        bettingScenario: 'Yüksek tempo, bol pozisyon beklentisi. 2.5 Üst ön planda.',
        prediction: '2.5 ÜST',
        confidence: 84,
        modelScore: 89,
        recentHistory: '8 Kazanç',
        expectedGoals: '2.90',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.90', odd2: '2.00', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.98', odd2: '2.10', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'trabzon-karagumruk',
        league: 'Süper Lig',
        homeTeam: 'TRABZONSPOR',
        awayTeam: 'FATİH KARAGÜMRÜK',
        matchTime: '20:00',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Trabzonspor iç sahada baskılı başlar. Karagümrük açık oynarsa savunma arkası boşluklar oluşur.',
        breakingPoint: 'İlk gol Trabzon’dan gelirse fark açılabilir.',
        bettingScenario: 'Ev sahibi baskısı ve hücum gücü nedeniyle 2.5 Üst destekli galibiyet senaryosu güçlü.',
        prediction: 'TRABZONSPOR & 2.5 ÜST',
        confidence: 86,
        modelScore: 91,
        recentHistory: '10 Kazanç',
        expectedGoals: '3.15',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '2.10', odd2: '2.25', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '2.18', odd2: '2.35', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'basaksehir-konya',
        league: 'Süper Lig',
        homeTeam: 'BAŞAKŞEHİR',
        awayTeam: 'KONYASPOR',
        matchTime: '17:00',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Kontrollü ve taktik savaşı şeklinde geçmesi beklenen bir maç. Başakşehir set hücumunda zorlanabilir.',
        breakingPoint: 'Orta saha hakimiyeti maçın kaderini belirler.',
        bettingScenario: 'Risk düşük, tempo sınırlı. Alt senaryosu öne çıkıyor.',
        prediction: '2.5 ALT',
        confidence: 74,
        modelScore: 78,
        recentHistory: '5 Kazanç',
        expectedGoals: '1.80',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.68', odd2: '1.78', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.75', odd2: '1.85', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'porto-arouca',
        league: 'Liga Portugal',
        homeTeam: 'FC PORTO',
        awayTeam: 'AROUCA',
        matchTime: '21:30',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Porto iç sahada baskılı ve erken gol arayan bir ekip. Arouca savunmada zorlanabilir.',
        breakingPoint: 'Erken bir Porto golü direnci tamamen kıracaktır.',
        bettingScenario: 'Porto’nun domine edeceği bir maç. Handikaplı galibiyet ana hedef.',
        prediction: 'PORTO -1.5 H',
        confidence: 88,
        modelScore: 94,
        recentHistory: '9 Kazanç',
        expectedGoals: '3.40',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.55', odd2: '1.65', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.62', odd2: '1.72', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'sporting-estoril',
        league: 'Liga Portugal',
        homeTeam: 'SPORTING CP',
        awayTeam: 'ESTORIL',
        matchTime: '19:45',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Sporting tempolu başlar. Estoril savunması geçişlerde sorun yaşayabilir.',
        breakingPoint: 'İlk 15 dakikadaki baskı sonucu belirleyici olur.',
        bettingScenario: 'Erken gol gelirse fark büyüyebilir. Üst tercihi mantıklı.',
        prediction: '2.5 ÜST',
        confidence: 83,
        modelScore: 89,
        recentHistory: '8 Kazanç',
        expectedGoals: '3.10',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.45', odd2: '1.55', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.52', odd2: '1.62', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },
    {
        id: 'telstar-breda',
        league: 'Eerste Divisie',
        homeTeam: 'TELSTAR',
        awayTeam: 'NAC BREDA',
        matchTime: '21:00',
        matchDate: '2026-02-27',
        analysis: '',
        tacticalSummary: 'Eredivisie/Eerste tempolu ve gollü yapısıyla bilinir. Telstar iç sahada agresif.',
        breakingPoint: 'Hücum değişimleri ve kanat akınları.',
        bettingScenario: 'Karşılıklı gol ve üst senaryosu güçlü. Bol pozisyonlu maç.',
        prediction: '2.5 ÜST',
        confidence: 81,
        modelScore: 86,
        recentHistory: '7 Kazanç',
        expectedGoals: '3.25',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.70', odd2: '1.80', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.78', odd2: '1.88', link: 'https://google.com', isHighest: true }
        ],
        createdAt: 1772175957104
    },

    // FEBRUARY 28
    {
        id: 'manutd-newcastle',
        league: 'Premier League',
        homeTeam: 'MANCHESTER UNITED',
        awayTeam: 'NEWCASTLE',
        matchTime: '17:00',
        matchDate: '2026-02-28',
        analysis: '',
        tacticalSummary: 'United iç sahada baskılı başlasa da savunma geçişlerinde açık veriyor. Newcastle fizik gücü yüksek ve kontra atakta etkili. Orta saha temposu yüksek bir mücadele bekleniyor.',
        breakingPoint: 'İlk 30 dakika. Erken gol gelirse tempo artar ve karşılıklı oyun oluşur.',
        bettingScenario: 'İki takım da skor üretmeye yatkın. 1-1 senaryosu güçlü. 2.5 Üst ana tercih.',
        prediction: 'KG VAR / 2.5 ÜST',
        confidence: 84,
        modelScore: 87,
        recentHistory: '6 Kazanç',
        expectedGoals: '2.95',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.68', odd2: '1.75', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.75', odd2: '1.85', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'bayern-mainz',
        league: 'Bundesliga',
        homeTeam: 'BAYERN MÜNİH',
        awayTeam: 'MAİNZ',
        matchTime: '16:30',
        matchDate: '2026-02-28',
        analysis: '',
        tacticalSummary: 'Bayern iç sahada dominant oyun oynar. Mainz savunma hattı baskı altında hata yapabiliyor.',
        breakingPoint: 'İlk gol erken gelirse fark büyüyebilir.',
        bettingScenario: 'Bayern’in tempolu ve çok pozisyonlu oyunu nedeniyle gollü senaryo ağır basıyor.',
        prediction: 'BAYERN -1.5 H / 3.5 ÜST',
        confidence: 89,
        modelScore: 95,
        recentHistory: '8 Kazanç',
        expectedGoals: '3.80',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.45', odd2: '2.10', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.52', odd2: '2.25', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'inter-torino',
        league: 'Serie A',
        homeTeam: 'INTER',
        awayTeam: 'TORINO',
        matchTime: '21:45',
        matchDate: '2026-02-28',
        analysis: '',
        tacticalSummary: 'Inter topa sahip olarak sabırlı oynar. Torino savunma ağırlıklı yapıdadır.',
        breakingPoint: 'Inter ilk golü bulursa tempo düşer.',
        bettingScenario: 'Kontrollü galibiyet senaryosu. 2-0 / 1-0 skor olasılığı yüksek.',
        prediction: 'INTER KAZANIR & 2.5 ALT',
        confidence: 83,
        modelScore: 88,
        recentHistory: '9 Kazanç',
        expectedGoals: '1.85',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.60', odd2: '1.70', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.68', odd2: '1.78', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'sociedad-sevilla',
        league: 'La Liga',
        homeTeam: 'REAL SOCIEDAD',
        awayTeam: 'SEVILLA',
        matchTime: '19:30',
        matchDate: '2026-02-28',
        analysis: '',
        tacticalSummary: 'La Liga’da taktik disiplin ön planda. Dengeli ve az gollü bir mücadele bekleniyor.',
        breakingPoint: 'Savunma hataları ve duran toplar.',
        bettingScenario: 'Düşük tempolu maç beklentisi. 2.5 Alt ana senaryo.',
        prediction: '2.5 ALT',
        confidence: 78,
        modelScore: 82,
        recentHistory: '5 Kazanç',
        expectedGoals: '1.70',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.75', odd2: '1.65', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.82', odd2: '1.72', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'psg-lille',
        league: 'Ligue 1',
        homeTeam: 'PSG',
        awayTeam: 'LILLE',
        matchTime: '22:00',
        matchDate: '2026-02-28',
        analysis: '',
        tacticalSummary: 'PSG iç sahada tempolu ve hücum ağırlıklı. Lille kontra tehdidi yaratabilir.',
        breakingPoint: 'Mbappe ve Dembele hızı.',
        bettingScenario: 'Tempolu maç. PSG galibiyeti ve üst barajı.',
        prediction: '2.5 ÜST / PSG KAZANIR',
        confidence: 87,
        modelScore: 92,
        recentHistory: '8 Kazanç',
        expectedGoals: '3.10',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.55', odd2: '1.65', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.62', odd2: '1.72', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'benfica-braga',
        league: 'Liga Portugal',
        homeTeam: 'BENFICA',
        awayTeam: 'BRAGA',
        matchTime: '21:00',
        matchDate: '2026-02-28',
        analysis: '',
        tacticalSummary: 'İki ekip de hücum gücü yüksek. Açık futbol bekleniyor.',
        breakingPoint: 'Hücum hattındaki bireysel yetenekler.',
        bettingScenario: 'Karşılıklı gol senaryosu güçlü.',
        prediction: 'KG VAR',
        confidence: 82,
        modelScore: 86,
        recentHistory: '7 Kazanç',
        expectedGoals: '2.80',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.70', odd2: '1.80', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.78', odd2: '1.88', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'flamengo-mineiro',
        league: 'Serie A (BRA)',
        homeTeam: 'FLAMENGO',
        awayTeam: 'ATLÉTICO MINEIRO',
        matchTime: '23:00',
        matchDate: '2026-02-28',
        analysis: '',
        tacticalSummary: 'Brezilya ligi tempolu başlar. Flamengo evinde baskılı, Mineiro kontra tehditli.',
        breakingPoint: 'İlk yarıdaki yüksek baskı.',
        bettingScenario: 'Karşılıklı gol olasılığı yüksek.',
        prediction: 'KG VAR',
        confidence: 80,
        modelScore: 84,
        recentHistory: '7 Kazanç',
        expectedGoals: '2.60',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.80', odd2: '1.90', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.88', odd2: '1.98', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'river-rosario',
        league: 'Liga Profesional',
        homeTeam: 'RIVER PLATE',
        awayTeam: 'ROSARIO CENTRAL',
        matchTime: '02:00',
        matchDate: '2026-02-28',
        analysis: '',
        tacticalSummary: 'River iç sahada kontrollü kazanma eğiliminde.',
        breakingPoint: 'Savunma disiplini.',
        bettingScenario: 'River galibiyeti ve az gollü maç.',
        prediction: 'RIVER KAZANIR & 2.5 ALT',
        confidence: 85,
        modelScore: 89,
        recentHistory: '9 Kazanç',
        expectedGoals: '1.90',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.50', odd2: '1.60', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.58', odd2: '1.68', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },

    // MARCH 1
    {
        id: 'arsenal-tottenham',
        league: 'Premier League',
        homeTeam: 'ARSENAL',
        awayTeam: 'TOTTENHAM',
        matchTime: '16:30',
        matchDate: '2026-03-01',
        analysis: '',
        tacticalSummary: 'Londra derbisi yüksek tempolu geçer. İki takım da hücum gücü yüksek.',
        breakingPoint: 'İlk yarı son 15 dakika.',
        bettingScenario: 'Karşılıklı gol olasılığı yüksek. Erken gol çıkarsa 3.5 Üst denenebilir.',
        prediction: 'KG VAR / 2.5 ÜST',
        confidence: 86,
        modelScore: 91,
        recentHistory: '8 Kazanç',
        expectedGoals: '3.20',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.65', odd2: '1.75', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.72', odd2: '1.85', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'barca-valencia',
        league: 'La Liga',
        homeTeam: 'BARCELONA',
        awayTeam: 'VALENCIA',
        matchTime: '21:00',
        matchDate: '2026-03-01',
        analysis: '',
        tacticalSummary: 'Barcelona iç sahada baskılı ve topa sahip. Valencia savunmada kırılgan.',
        breakingPoint: 'Lamine Yamal ve Lewandowski etkinliği.',
        bettingScenario: 'Barcelona iç sahada baskılı ve topa sahip. Valencia savunmada kırılgan.',
        prediction: 'BARCELONA KAZANIR & 2.5 ÜST',
        confidence: 84,
        modelScore: 89,
        recentHistory: '7 Kazanç',
        expectedGoals: '3.00',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.45', odd2: '1.85', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.52', odd2: '1.95', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'juve-atalanta',
        league: 'Serie A',
        homeTeam: 'JUVENTUS',
        awayTeam: 'ATALANTA',
        matchTime: '19:00',
        matchDate: '2026-03-01',
        analysis: '',
        tacticalSummary: 'Atalanta tempolu, Juventus kontrollü ama skor buluyor.',
        breakingPoint: 'Orta saha presi.',
        bettingScenario: 'Atalanta tempolu, Juventus kontrollü ama skor buluyor.',
        prediction: 'KG VAR',
        confidence: 81,
        modelScore: 85,
        recentHistory: '6 Kazanç',
        expectedGoals: '2.45',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.75', odd2: '1.85', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.82', odd2: '1.92', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'dortmund-leipzig',
        league: 'Bundesliga',
        homeTeam: 'BORUSSIA DORTMUND',
        awayTeam: 'RB LEIPZIG',
        matchTime: '18:30',
        matchDate: '2026-03-01',
        analysis: '',
        tacticalSummary: 'Geçiş oyunları ve yüksek tempo bekleniyor.',
        breakingPoint: 'Savunma arkası koşular.',
        bettingScenario: 'Geçiş oyunları ve yüksek tempo bekleniyor.',
        prediction: '2.5 ÜST',
        confidence: 85,
        modelScore: 90,
        recentHistory: '9 Kazanç',
        expectedGoals: '3.30',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.60', odd2: '1.70', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.68', odd2: '1.78', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'marseille-monaco',
        league: 'Ligue 1',
        homeTeam: 'MARSEILLE',
        awayTeam: 'MONACO',
        matchTime: '22:00',
        matchDate: '2026-03-01',
        analysis: '',
        tacticalSummary: 'İki ekip de hücum kalitesi yüksek.',
        breakingPoint: 'Kanat hücumları.',
        bettingScenario: 'İki ekip de hücum kalitesi yüksek.',
        prediction: 'KG VAR',
        confidence: 83,
        modelScore: 87,
        recentHistory: '8 Kazanç',
        expectedGoals: '2.90',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.65', odd2: '1.75', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.72', odd2: '1.82', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'porto-sporting',
        league: 'Liga Portugal',
        homeTeam: 'FC PORTO',
        awayTeam: 'SPORTING CP',
        matchTime: '21:30',
        matchDate: '2026-03-01',
        analysis: '',
        tacticalSummary: 'Portekiz derbileri genelde kontrollü başlar.',
        breakingPoint: 'Savunma disiplini.',
        bettingScenario: 'Portekiz derbileri genelde kontrollü başlar.',
        prediction: '2.5 ALT',
        confidence: 77,
        modelScore: 81,
        recentHistory: '5 Kazanç',
        expectedGoals: '1.95',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.80', odd2: '1.70', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.88', odd2: '1.78', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'palmeiras-saopaulo',
        league: 'Serie A (BRA)',
        homeTeam: 'PALMEIRAS',
        awayTeam: 'SÃO PAULO',
        matchTime: '22:00',
        matchDate: '2026-03-01',
        analysis: '',
        tacticalSummary: 'Derbi temposu yüksek ama kontrollü başlar.',
        breakingPoint: 'Orta saha mücadelesi.',
        bettingScenario: 'Derbi temposu yüksek ama kontrollü başlar.',
        prediction: '2.5 ALT',
        confidence: 79,
        modelScore: 83,
        recentHistory: '6 Kazanç',
        expectedGoals: '1.80',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.85', odd2: '1.75', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.92', odd2: '1.82', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    },
    {
        id: 'boca-independiente',
        league: 'Liga Profesional',
        homeTeam: 'BOCA JUNIORS',
        awayTeam: 'INDEPENDIENTE',
        matchTime: '01:00',
        matchDate: '2026-03-01',
        analysis: '',
        tacticalSummary: 'Arjantin’de derbiler genelde sert ve az gollü geçer.',
        breakingPoint: 'Kartlar ve sertlik.',
        bettingScenario: 'Arjantin’de derbiler genelde sert ve az gollü geçer.',
        prediction: '2.5 ALT / 1X',
        confidence: 82,
        modelScore: 86,
        recentHistory: '7 Kazanç',
        expectedGoals: '1.60',
        bookieOdds: [
            { name: 'BETLİVO', odd1: '1.55', odd2: '1.65', link: 'https://google.com' },
            { name: 'MARSBAHİS', odd1: '1.62', odd2: '1.72', link: 'https://google.com', isHighest: true }
        ],
        createdAt: Date.now()
    }
];

export const demoCoupons: any[] = [ // Using any for simplicity or I can import Coupon type
    {
        id: 'low-risk-01',
        title: 'GÜNÜN KASASI',
        riskLevel: 'LOW',
        matches: [
            { matchId: 'porto-arouca', homeTeam: 'PORTO', awayTeam: 'AROUCA', prediction: '1.5 ÜST', odd: '1.25' },
            { matchId: 'trabzon-karagumruk', homeTeam: 'TRABZONSPOR', awayTeam: 'KARAGÜMRÜK', prediction: '1X', odd: '1.28' },
            { matchId: 'augsburg-koln', homeTeam: 'AUGSBURG', awayTeam: 'KÖLN', prediction: '3.5 ALT', odd: '1.35' }
        ],
        totalOdd: '2.16',
        date: '2026-03-01'
    },
    {
        id: 'medium-risk-01',
        title: 'İDEAL KUPON',
        riskLevel: 'MEDIUM',
        matches: [
            { matchId: 'wolverhampton-villa', homeTeam: 'WOLVES', awayTeam: 'ASTON VILLA', prediction: 'KG VAR', odd: '1.72' },
            { matchId: 'strasbourg-lens', homeTeam: 'STRASBOURG', awayTeam: 'LENS', prediction: '2.5 ÜST', odd: '1.90' }
        ],
        totalOdd: '3.26',
        date: '2026-03-01'
    },
    {
        id: 'high-risk-02',
        title: 'SİSTEM / SÜRPRİZ',
        riskLevel: 'HIGH',
        matches: [
            { matchId: 'levante-alaves', homeTeam: 'LEVANTE', awayTeam: 'ALAVÉS', prediction: 'İY 0', odd: '2.10' },
            { matchId: 'parma-cagliari', homeTeam: 'PARMA', awayTeam: 'CAGLIARI', prediction: 'MS 1', odd: '2.45' }
        ],
        totalOdd: '5.14',
        date: '2026-03-02'
    },
    {
        id: 'low-risk-03',
        title: 'GARANTİ KUPON',
        riskLevel: 'LOW',
        matches: [
            { matchId: 'city-utd', homeTeam: 'MAN CITY', awayTeam: 'MAN UTD', prediction: 'MS 1', odd: '1.40' },
            { matchId: 'real-barca', homeTeam: 'REAL MADRID', awayTeam: 'BARCELONA', prediction: '1.5 ÜST', odd: '1.22' }
        ],
        totalOdd: '1.71',
        date: '2026-03-03'
    }
];
