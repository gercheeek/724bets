import { MatchAnalysis, NewsArticle } from './types';

export const demoAnalyses: MatchAnalysis[] = [];

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
