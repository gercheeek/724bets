// One-time seed script for 15 matches across Pool, Analyses, and Coupons
// This file auto-runs once and seeds localStorage, then sets a flag to never run again.

import { MatchAnalysis, Coupon, CouponMatch, PoolConfig, PoolMatch } from './types';

const SEED_FLAG = 'ecosystem_seeded_v1';

export function seedEcosystemData() {
    if (localStorage.getItem(SEED_FLAG)) return; // already seeded

    const matches = [
        { home: 'WOLVES', away: 'LIVERPOOL', league: 'Premier Lig', date: '2026-03-03', time: '23:15', sport: 'Futbol' },
        { home: 'ASTON VILLA', away: 'CHELSEA', league: 'Premier Lig', date: '2026-03-04', time: '22:30', sport: 'Futbol' },
        { home: 'NEWCASTLE', away: 'MAN. UNITED', league: 'Premier Lig', date: '2026-03-04', time: '23:15', sport: 'Futbol' },
        { home: 'FENERBAHÇE BEKO', away: 'MONACO', league: 'EuroLeague', date: '2026-03-05', time: '21:45', sport: 'Basketbol' },
        { home: 'BAYERN MÜNİH', away: 'GLADBACH', league: 'Bundesliga', date: '2026-03-06', time: '22:30', sport: 'Futbol' },
        { home: 'PSG', away: 'MONACO', league: 'Ligue 1', date: '2026-03-06', time: '22:45', sport: 'Futbol' },
        { home: 'OLYMPIACOS', away: 'PANATHİNAİKOS', league: 'EuroLeague', date: '2026-03-06', time: '23:15', sport: 'Basketbol' },
        { home: 'ATLETİCO MADRİD', away: 'R. SOCİEDAD', league: 'La Liga', date: '2026-03-07', time: '20:30', sport: 'Futbol' },
        { home: 'ATHLETİC BİLBAO', away: 'BARCELONA', league: 'La Liga', date: '2026-03-07', time: '23:00', sport: 'Futbol' },
        { home: 'MİAMİ HEAT', away: 'BROOKLYN NETS', league: 'NBA', date: '2026-03-08', time: '04:00', sport: 'Basketbol' },
        { home: 'AC MİLAN', away: 'İNTER', league: 'Serie A', date: '2026-03-08', time: '22:45', sport: 'Futbol' },
        { home: 'DALLAS MAVERİCKS', away: 'PHOENİX SUNS', league: 'NBA', date: '2026-03-09', time: '03:30', sport: 'Basketbol' },
        { home: 'GALATASARAY', away: 'LİVERPOOL', league: 'Şampiyonlar Ligi', date: '2026-03-10', time: '23:00', sport: 'Futbol' },
        { home: 'NEWCASTLE', away: 'BARCELONA', league: 'Şampiyonlar Ligi', date: '2026-03-10', time: '23:00', sport: 'Futbol' },
        { home: 'ATLETİCO MADRİD', away: 'TOTTENHAM', league: 'Şampiyonlar Ligi', date: '2026-03-10', time: '23:00', sport: 'Futbol' },
    ];

    // ─── 1. SEED POOL ──────────────────────────────────────────────────────────
    const poolMatches: PoolMatch[] = matches.map((m, i) => ({
        id: `pm-${i}`,
        homeTeam: m.home,
        awayTeam: m.away,
        league: m.league,
        matchDate: `${m.date} ${m.time}`,
    }));

    const poolConfig: PoolConfig = {
        id: 'pool-seed-1',
        matches: poolMatches,
        entries: [],
        status: 'open',
        prizePool: 25000,
        prize15: 15000,
        prize14: 7000,
        prize13: 3000,
        freeEntryUsed: {},
        createdAt: Date.now(),
    };
    localStorage.setItem('site_pool_config', JSON.stringify(poolConfig));

    // ─── 2. SEED ANALYSES ──────────────────────────────────────────────────────
    const tacticals: Record<string, string> = {
        'WOLVES-LIVERPOOL': `Wolves son dönemde iç sahasında Nunez gibi isimleri bile tutacak savunma organizasyonu kuruyor. Liverpool ise Salah-Díaz kanadıyla her maç 2+ gol ortalamasıyla geliyor. Wolves\'un düşük blok savunmasını şu formda olan Liverpool\'un kırması an meselesi. Ancak deplasmanda Klopp ekibi zaman zaman konsantrasyon düşüklükleri yaşıyor.`,
        'ASTON VILLA-CHELSEA': `Aston Villa, Emery yönetiminde Villa Park\'ta tam bir cehennem yaratıyor. Chelsea ise Palmer merkezli hücum oyunuyla iddialı ama savunmada hala tutarsız. Villa\'nın fizik gücü ve set oyunlarıyla Chelsea\'nin teknik yeteneği çarpışacak. İlk yarıda kilitli bir mücadele bekleniyor.`,
        'NEWCASTLE-MAN. UNITED': `Newcastle St. James\' Park\'ta bu sezon kaybetmedi! İsak ve Gordon ikilisi hücumda yıkım makinası. Man. United rotasyondan kayıp defansif stabilitesini arıyor ama bulamıyor. Ten Hag\'ın çaresiz kaldığı bir deplasman, Newcastle favori ve acımasız olacak.`,
        'FENERBAHÇE BEKO-MONACO': `EuroLeague\'de sezonun en kritik maçlarından biri! Fenerbahçe Beko ev sahibi avantajıyla rakibini ezmeye çalışacak. Monaco dış atışlarda çok etkili ama Fener\'in pota altı hakimiyeti ve taraftar desteği karşısında zorlanacak. Tempo kontrolü maçın anahtarı.`,
        'BAYERN MÜNİH-GLADBACH': `Bayern evinde hiç affetmiyor. Müller ve Sané kanatlardan uçak gibi geliyor. Gladbach ise cesur futbol oynamayı seviyor ama bu cesaret Bayern karşısında felaket reçetesi olabilir. Yüksek tempolu, bol gollü bir gece bekleniyor.`,
        'PSG-MONACO': `Fransız derbisi! PSG Dembélé ve Mbappé\'siz bile ofansif gücünü koruyor. Monaco yılın sürpriz takımı olarak bu maça iddialı gelecek. Park des Princes\'te gol düellosu kaçınılmaz, iki takımın da savunma zaafiyetleri gollere davet çıkarıyor.`,
        'OLYMPIACOS-PANATHİNAİKOS': `Yunan basketbolunun en kanlı derbisi! Olympiacos evinde taraftar infernasını yaşatacak. Panathinaikos disiplinli savunmasıyla öne çıksa da bu atmosferde her takım erir. Pota altı savaşları ve faul yönetimi maçın kaderini belirler.`,
        'ATLETİCO MADRİD-R. SOCİEDAD': `Simeone\'nin Atletico\'su evinde duvar gibi savunuyor. Real Sociedad ise Oyarzabal\'la güzel futbol oynuyor ama Atletico\'nun fizik baskısı altında ezilme riski çok yüksek. Düşük skorlu, taktik ağırlıklı bir mücadele bekleniyor.`,
        'ATHLETİC BİLBAO-BARCELONA': `San Mames her büyük takım için kabus! Athletic Bilbao\'nun fizik futbolu Barcelona\'nın tiki-takasını alt edebilir. Ancak Barça\'nın Lamine Yamal\'ı bu sezon durdurulamıyor. Atmosfer, gol ve kırmızı kartların eksik olmayacağı müthiş bir karşılaşma.`,
        'MİAMİ HEAT-BROOKLYN NETS': `Heat evinde Butler\'ın liderliğinde seri peşinde. Nets ise genç kadrosuyla sürpriz yapma kapasitesine sahip ama Miami\'nin deneyimi ve savunma disiplini farkı ortaya koyacak. Alt/Üst dengesi çok kırılgan bir NBA gecesi.`,
        'AC MİLAN-İNTER': `Milano Derbisi! Serie A\'nın en ateşli karşılaşması. Milan San Siro\'da son maçlarda çok formda, Inter ise Lautaro\'nun golcü vasfıyla iddialı. Her iki takımın da savunma hataları yapacağı, gollerin bol olacağı bir dev kapışma. Tüy tüyleriniz diken diken olacak!`,
        'DALLAS MAVERİCKS-PHOENİX SUNS': `Luka Doncic vs Kevin Durant! NBA\'in en premium bireysel düellosu. Mavericks son maçlarda inanılmaz hücum basketbolu oynuyor. Suns ise Booker+Durant ikilisiyle her an patlayabilir. Yüksek sayılı, heyecan dolu bir gece garantisi.`,
        'GALATASARAY-LİVERPOOL': `Şampiyonlar Ligi\'nde Türk Telekom Stadyumu yangın yeri olacak! Galatasaray taraftar desteğiyle imkansızı başarmaya çalışacak. Liverpool favori ama bu cehennem atmosferinde her şey olabilir. Cimbom\'un motivasyonu tavanda, tarih yazmak istiyorlar.`,
        'NEWCASTLE-BARCELONA': `Şampiyonlar Ligi\'nin en çekişmeli eşleşmelerinden biri! Newcastle evinde inanılmaz güçlü, Barcelona ise topa sahip olma konusunda dünya lideri. İsak vs Lewandowski kapışması maça damga vuracak. Açık futbol ve bol pozisyon garantili.`,
        'ATLETİCO MADRİD-TOTTENHAM': `Simeone vs Postecoglou felsefe savaşı! Atletico\'nun beton savunması Tottenham\'ın hücum futboluna karşı. Son\'un bireysel kalitesi Atletico savunmasını test edecek. Düşük gollü ama inanılmaz gerilimli bir 90 dakika.`,
    };

    const breakingPoints: Record<string, string> = {
        'WOLVES-LIVERPOOL': `İlk 15 dakikada Liverpool\'un erken gol bulması halinde Wolves\'un plan B\'si yok, maç tek taraflı hale gelir. Ancak 0-0 giderse 70. dakikadan sonra Wolves ev sahibi enerjisiyle sürpriz yapabilir.`,
        'ASTON VILLA-CHELSEA': `Villa\'nın set toplarından bulacağı erken gol maçın seyrini tamamen değiştirir. Chelsea 60. dakikadan sonra yedek kulübesinin derinliğiyle baskı kurabilir ama Villa Park\'ın atmosferi Chelsea\'yi boğar.`,
        'NEWCASTLE-MAN. UNITED': `İlk yarıda Newcastle\'ın bulacağı gol United\'ın moralini tamamen çökertir. 70. dakikadan sonra United\'ın fiziksel olarak düşmesi Newcastle\'a kolay kontra fırsatları verecek.`,
        'FENERBAHÇE BEKO-MONACO': `3. çeyrekte Fener\'in taraftar desteğiyle yapacağı 10-0\'lık seri maçın kırılma noktası. Monaco\'nun dış atışları tutmazsa ikinci yarıda fark 20\'lere ulaşır.`,
        'BAYERN MÜNİH-GLADBACH': `İlk 20 dakikada Bayern\'in bulacağı 2 gol Gladbach\'ın cesaret futbolunu bitirir. Tek kırılma: Gladbach ilk 15\'te şok bir gol atarsa maç açılır ve kaotik hale gelir.`,
        'PSG-MONACO': `60-75 dakika arası kritik! Her iki takımın da yedek kulübesinden yapacağı hamleler maçın kaderini belirleyecek. İlk golü atan rakibine büyük baskı yapar.`,
        'OLYMPIACOS-PANATHİNAİKOS': `Son periyotta tribünler kaynayacak. Olympiacos seyirci desteğiyle serbest atışlara çok daha rahat gidecek. Panathinaikos\'un star oyuncusunun faul limiti maçın tek kırılma noktası.`,
        'ATLETİCO MADRİD-R. SOCİEDAD': `Atletico ilk golü bulursa otobüsü park edip maçı bitirir. Real Sociedad ancak set toplarından sürpriz yapabilir, 80. dakikadan sonra Atletico\'nun fizik üstünlüğü ezici olur.`,
        'ATHLETİC BİLBAO-BARCELONA': `San Mames\'te ilk 30 dakika kabus gibi olacak Barça için. Athletic\'in fizik baskısını atlatırlarsa ikinci yarı Lamine Yamal sahneye çıkar ve dengeleri değiştirir.`,
        'MİAMİ HEAT-BROOKLYN NETS': `3. çeyrekte Heat\'in savunma yoğunluğu Nets\'in genç oyuncularını bunaltacak. Butler\'ın bireysel performansı ve serbest atış çizgisi maçın asıl kırılma noktası.`,
        'AC MİLAN-İNTER': `Derby della Madonnina\'da ilk golü atan büyük avantaj yakalar. 35-55 dakika arası maçın en kaotik bölümü, her iki takım da bu dilimde en az 1 gol bulur. Kırmızı kart riski çok yüksek.`,
        'DALLAS MAVERİCKS-PHOENİX SUNS': `Son çeyrekte Doncic clutch moduna geçerse maç biter. Ancak Suns\'ın Durant+Booker ikilisi son 5 dakikada ateş açarsa triple-overtime bile görebiliriz.`,
        'GALATASARAY-LİVERPOOL': `İlk 10 dakikada Galatasaray\'ın tribün desteğiyle kuracağı baskı erken gol getirirse Liverpool\'un işi zorlaşır. Ancak Liverpool soğukkanlılığını korursa 60. dakikadan sonra Galatasaray\'ın fiziksel düşüşüyle farkı açar.`,
        'NEWCASTLE-BARCELONA': `İlk yarıda Newcastle\'ın fizik baskısıyla Barcelona\'nın topla buluşamaması en büyük risk. Ancak Barça 60+\'da kontrolü ele alırsa İsak\'ın bireysel kalitesi bile yetmez, top Barcelona\'da kalır.`,
        'ATLETİCO MADRİD-TOTTENHAM': `65. dakikadan sonra Atletico savunmasının yorulması Spurs\'ın en büyük şansı. Simeone bu dakikada savunmacı değişikliklerle kapanırsa Tottenham 90+ dakikaya kadar gol yolu bulamaz.`,
    };

    const predictions: Record<string, { pred: string; conf: number; odds: [string, string] }> = {
        'WOLVES-LIVERPOOL': { pred: 'M.S 2 & 1.5 ÜST', conf: 91, odds: ['1.85', '1.45'] },
        'ASTON VILLA-CHELSEA': { pred: 'KG VAR', conf: 82, odds: ['1.72', '1.68'] },
        'NEWCASTLE-MAN. UNITED': { pred: 'M.S 1', conf: 88, odds: ['1.55', '2.10'] },
        'FENERBAHÇE BEKO-MONACO': { pred: 'Ev Sahibi Handikap (-4.5)', conf: 85, odds: ['1.80', '1.75'] },
        'BAYERN MÜNİH-GLADBACH': { pred: 'M.S 1 & 2.5 ÜST', conf: 93, odds: ['1.40', '1.95'] },
        'PSG-MONACO': { pred: 'KG VAR & 2.5 ÜST', conf: 84, odds: ['1.90', '1.85'] },
        'OLYMPIACOS-PANATHİNAİKOS': { pred: 'M.S 1 Handikap', conf: 80, odds: ['1.70', '1.90'] },
        'ATLETİCO MADRİD-R. SOCİEDAD': { pred: '2.5 ALT', conf: 86, odds: ['1.65', '1.80'] },
        'ATHLETİC BİLBAO-BARCELONA': { pred: '2.5 ÜST', conf: 79, odds: ['1.95', '1.50'] },
        'MİAMİ HEAT-BROOKLYN NETS': { pred: 'M.S 1 & Üst (215.5)', conf: 83, odds: ['1.60', '2.05'] },
        'AC MİLAN-İNTER': { pred: 'KG VAR', conf: 87, odds: ['1.75', '1.65'] },
        'DALLAS MAVERİCKS-PHOENİX SUNS': { pred: 'Uzatmalar Dahil Üst', conf: 90, odds: ['1.55', '1.70'] },
        'GALATASARAY-LİVERPOOL': { pred: '2.5 ÜST', conf: 78, odds: ['2.20', '1.40'] },
        'NEWCASTLE-BARCELONA': { pred: 'KG VAR & 2.5 ÜST', conf: 85, odds: ['1.80', '1.60'] },
        'ATLETİCO MADRİD-TOTTENHAM': { pred: 'İlk Yarı 1.5 ALT', conf: 88, odds: ['1.55', '1.85'] },
    };

    const bettingScenarios: Record<string, string> = {
        'WOLVES-LIVERPOOL': `Liverpool bu sezonda deplasman galibiyetlerinde tutarlı. M.S 2 seçeneği kupona banko yazılır. Canlıcılar için ilk yarı İlk Gol 20 dakika altına dikkat — Liverpool erken vurabilir.`,
        'ASTON VILLA-CHELSEA': `Her iki takımın da gol atması çok muhtemel. KG VAR bahsi kuponlara güvenle yazılabilir. Taraf bahsi riskli, Villa Park faktörü Chelsea\'yi zorlayacak.`,
        'NEWCASTLE-MAN. UNITED': `Direkt M.S 1 kupona yazılır. Newcastle St. James' Park'ta acımasız. Handikaplı M.S 1 (-1.5) bile düşünülebilir, oran çok tatlı.`,
        'FENERBAHÇE BEKO-MONACO': `Fener evinde EuroLeague'de çok güçlü. Ev Sahibi Handikap (-4.5) tatlı oran sunuyor. Canlı bahisçiler 3. çeyrekte Fener farkını açtığında Alt/Üst değerlendirmeli.`,
        'BAYERN MÜNİH-GLADBACH': `Bayern evinde gol makinesi! 3.5 ÜST bile düşünülebilir. İlk Yarı M.S 1 seçeneği de çok güvenli, Bayern ilk düdükten itibaren baskı kurar.`,
        'PSG-MONACO': `Fransız futbolunun en gollü maçı olacak. KG VAR & 2.5 ÜST kombinasyonu mükemmel oran veriyor. İlk golü atan tarafı canlıdan kovalamak da mantıklı.`,
        'OLYMPIACOS-PANATHİNAİKOS': `Derbi maçlarında sürprizler olabilir ama Olympiacos ev sahibi avantajı çok ağır basıyor. M.S 1 güvenle oynanabilir. Sayı Alt/Üst bahisleri de cazip.`,
        'ATLETİCO MADRİD-R. SOCİEDAD': `Simeone'nin takımı golü bulunca kapanır. 2.5 ALT seçeneği neredeyse garanti. İlk Yarı 0.5 ALT bile düşünülebilir, çok kilitli başlayacak.`,
        'ATHLETİC BİLBAO-BARCELONA': `San Mames'te gol şöleni yaşanır! 2.5 ÜST kupona yazılır. KG VAR da çok mantıklı, Athletic evinde her zaman gol bulur, Barça da gol yemeden bırakmaz.`,
        'MİAMİ HEAT-BROOKLYN NETS': `Heat favori ve evinde kazanır. M.S 1 güvenle oynanır. Toplam sayı Üst bahsi de cazip, Nets savunması Heat hücumunu durduramayacak.`,
        'AC MİLAN-İNTER': `Derby della Madonnina'da KG VAR neredeyse kesin! İki takım da gol bulacak. Taraf bahsine bulaşmak riskli, gol marketlerine yönelmek en doğrusu.`,
        'DALLAS MAVERİCKS-PHOENİX SUNS': `İki yıldız dolu kadro karşı karşıya. Uzatmalar dahil Toplam Sayı Üst seçeneği kuponlara tereddütsüz yazılır. Hücum şöleni garantili.`,
        'GALATASARAY-LİVERPOOL': `Cimbom evinde farklı bir takım! Taraftar desteği Liverpool'u etkileyebilir ama kupona Galatasaray yazmak cesaret ister. 2.5 ÜST en güvenli seçenek, açık maç olacak.`,
        'NEWCASTLE-BARCELONA': `İki hücum takımı karşı karşıya. KG VAR & 2.5 ÜST mükemmel bir kombo. Canlı bahis için ilk gol zamanlaması çok kritik.`,
        'ATLETİCO MADRİD-TOTTENHAM': `Simeone klasik savunma futbolu oynatacak. İlk Yarı 1.5 ALT neredeyse garanti, iki takım da birbirini tanıyacak ilk 45'te. Bahis oynamanın en güvenli yolu gol alt marketleri.`,
    };

    const baseTime = Date.now();
    const analyses: MatchAnalysis[] = matches.map((m, i) => {
        const key = `${m.home}-${m.away}`;
        const p = predictions[key] || { pred: 'KG VAR', conf: 80, odds: ['1.70', '1.70'] };
        return {
            id: `seed-analysis-${i}`,
            league: m.league,
            homeTeam: m.home,
            awayTeam: m.away,
            matchTime: m.time,
            matchDate: m.date,
            analysis: `${m.home} - ${m.away} mücadelesinde tüm veriler incelendiğinde ${p.pred} seçeneği öne çıkıyor. Yapay zeka modelimiz %${p.conf} güven oranıyla bu tahmini destekliyor.`,
            tacticalSummary: tacticals[key] || `${m.home} ve ${m.away} arasında taktik açıdan dengeli bir mücadele bekleniyor.`,
            breakingPoint: breakingPoints[key] || `Maçın kırılma noktası 60. dakikadan sonraki 15 dakikalık dilimde olacak.`,
            bettingScenario: bettingScenarios[key] || `${p.pred} seçeneği kuponlara güvenle yazılabilir.`,
            prediction: p.pred,
            confidence: p.conf,
            modelScore: p.conf + (i % 5),
            recentHistory: `${5 + (i % 3)} Kazanç, ${1 + (i % 2)} Kayıp`,
            expectedGoals: m.sport === 'Basketbol' ? 'N/A' : (2.2 + (i % 10) / 10).toFixed(1),
            bookieOdds: [
                { name: 'BETLİVO', odd1: p.odds[0], odd2: p.odds[1], link: 'https://' },
                { name: 'BETKOM', odd1: (parseFloat(p.odds[0]) + 0.05).toFixed(2), odd2: (parseFloat(p.odds[1]) - 0.03).toFixed(2), link: 'https://' },
                { name: 'MARSBAHİS', odd1: (parseFloat(p.odds[0]) + 0.10).toFixed(2), odd2: (parseFloat(p.odds[1]) + 0.05).toFixed(2), link: 'https://', isHighest: true },
            ],
            createdAt: baseTime + i,
            sport: m.sport as 'Futbol' | 'Basketbol',
            editorId: 'admin',
        };
    });

    // Merge with existing analyses
    try {
        const existing = JSON.parse(localStorage.getItem('site_analyses') || '[]');
        localStorage.setItem('site_analyses', JSON.stringify([...analyses, ...existing]));
    } catch {
        localStorage.setItem('site_analyses', JSON.stringify(analyses));
    }

    // ─── 3. SEED COUPONS (grouped by date) ──────────────────────────────────────
    const dateGroups: Record<string, typeof matches> = {};
    matches.forEach(m => {
        if (!dateGroups[m.date]) dateGroups[m.date] = [];
        dateGroups[m.date].push(m);
    });

    const coupons: Coupon[] = [];

    // Risk map per date
    const riskMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH'> = {
        '2026-03-03': 'LOW',
        '2026-03-04': 'MEDIUM',
        '2026-03-05': 'LOW',
        '2026-03-06': 'MEDIUM',
        '2026-03-07': 'HIGH',
        '2026-03-08': 'MEDIUM',
        '2026-03-09': 'LOW',
        '2026-03-10': 'HIGH',
    };

    const titleMap: Record<string, string> = {
        LOW: 'GÜNÜN KASASI',
        MEDIUM: 'İDEAL KUPON',
        HIGH: 'SÜPER RİSK',
    };

    Object.entries(dateGroups).forEach(([date, dayMatches]) => {
        const couponMatches: CouponMatch[] = dayMatches.map((m, i) => {
            const key = `${m.home}-${m.away}`;
            const p = predictions[key] || { pred: 'KG VAR', conf: 80, odds: ['1.70', '1.70'] };
            const scenario = bettingScenarios[key] || `${p.pred} seçeneği değerlendirilmelidir.`;
            return {
                matchId: `cm-${date}-${i}`,
                homeTeam: m.home,
                awayTeam: m.away,
                prediction: p.pred,
                odd: p.odds[0],
                analysis: scenario,
                confidence: p.conf,
            };
        });

        let totalOdd = 1;
        couponMatches.forEach(cm => { totalOdd *= parseFloat(cm.odd); });

        const risk = riskMap[date] || 'MEDIUM';
        coupons.push({
            id: `coupon-${date}`,
            title: titleMap[risk],
            riskLevel: risk,
            matches: couponMatches,
            totalOdd: totalOdd.toFixed(2),
            date,
            editorId: 'admin',
        });
    });

    // Merge with existing coupons
    try {
        const existing = JSON.parse(localStorage.getItem('site_coupons') || '[]');
        localStorage.setItem('site_coupons', JSON.stringify([...coupons, ...existing]));
    } catch {
        localStorage.setItem('site_coupons', JSON.stringify(coupons));
    }

    localStorage.setItem(SEED_FLAG, 'true');
    console.log('✅ 724Bets ecosystem seeded: 15 pool matches, 15 analyses, ' + coupons.length + ' daily coupons');
}
