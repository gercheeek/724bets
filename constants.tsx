
import React from 'react';
import { Brand, MarqueeConfig, WelcomePopupConfig, LiveOddsConfig, WheelConfig, SiteStatusConfig, RaffleConfig, PopularBetsConfig, NewsSliderConfig } from './types';
import { demoPopularBets } from './demoData';

export const BRANDS: Brand[] = [
  {
    id: 'marsbahis',
    name: 'MARSBAHİS',
    subtitle: 'MARSBAHİS BANKASIDIR',
    offerMain: 'ANINDA',
    offerSub: '%10 NAKİT İADE',
    bonusText: 'DENEME BONUSU',
    logo: 'https://picsum.photos/seed/mars/200/200',
    link: '#',
  },
  {
    id: 'stake',
    name: 'STAKE',
    subtitle: 'CASINO & SPORTS...',
    offerMain: 'GÜVEN',
    offerSub: 'OYNA KAZAN',
    bonusText: 'DENEME BONUSU',
    logo: 'https://picsum.photos/seed/stake/200/200',
    link: '#',
  },
  {
    id: 'misty',
    name: 'MİSTY CASİNO',
    subtitle: 'KAZANMANIN YERİ',
    offerMain: '100',
    offerSub: 'FREE SPIN',
    bonusText: 'DENEME BONUSU',
    logo: 'https://picsum.photos/seed/misty/200/200',
    link: '#',
  },
  {
    id: 'casitoros',
    name: 'CASİTOROS',
    subtitle: 'CASINO & SPORTS...',
    offerMain: '%10',
    offerSub: 'KRİPTO ARTIŞI',
    bonusText: 'DENEME BONUSU',
    logo: 'https://picsum.photos/seed/toros/200/200',
    link: '#',
  },
  {
    id: 'casitap',
    name: 'CASİTAP',
    subtitle: 'CASINO & SPORTS...',
    offerMain: '1000',
    offerSub: 'TL DENEME BONUSU',
    bonusText: 'DENEME BONUSU',
    logo: 'https://picsum.photos/seed/tap/200/200',
    link: '#',
  },
];

export const DEFAULT_MARQUEE_CONFIG: MarqueeConfig = {
  isActive: true,
  text: 'Hoş geldiniz! En yüksek oranlar ve anında ödeme 724BAHİS.NET güvencesiyle!',
  speed: 50,
  color: '#FFC107', // 724BAHİS.NET Yellow
  isBold: true,
};

export const DEFAULT_WELCOME_POPUP_CONFIG: WelcomePopupConfig = {
  isActive: true,
  title: '724BAHİS.NET',
  subtitle: "Türkiye'nin En Dinamik ve Güvenilir Bahis Platformu",
  offerMain: '%200 HOŞGELDİN BONUSU',
  offerSub: 'İlk yatırımınıza özel · Anında hesabınıza yüklenir',
  buttonText: '🚀 HEMEN KAYDOL — ÜCRETSİZ',
  buttonLink: 'https://724bahis.net',
};

export const DEFAULT_LIVE_ODDS_CONFIG: LiveOddsConfig = {
  isActive: true,
  matches: [],
};

export const DEFAULT_WHEEL_CONFIG: WheelConfig = {
  rewards: [
    { id: '1', label: '100 TL Nakit', color: '#f0b90b', weight: 1, type: 'nakit', value: '100' },
    { id: '2', label: '50 Free Spin', color: '#1a1a1a', weight: 2, type: 'freespin', value: '50' },
    { id: '3', label: '200 TL Bonus', color: '#f0b90b', weight: 1, type: 'bonus', value: '200' },
    { id: '4', label: 'Pas Geç', color: '#1a1a1a', weight: 3, type: 'pas', value: '0' },
    { id: '5', label: '10 TL Teselli', color: '#f0b90b', weight: 4, type: 'nakit', value: '10' },
  ],
  lastSpinTime: 0,
  spinCooldownHours: 6,
};

export const DEFAULT_SITE_STATUS_CONFIG: SiteStatusConfig = {
    isMaintenanceMode: false,
    maintenanceMessage: 'Değerli üyelerimiz, sistemlerimizde planlı bir bakım çalışması yürütülmektedir. Çok kısa bir süre sonra tekrar sizinle olacağız!',
};

export const DEFAULT_RAFFLE_CONFIG: RaffleConfig = {
    drawDate: '2024-04-20T21:00:00',
    isActive: true,
    prizes: [
        { id: '1', rank: '1.', prize: 'iPhone 17 Pro Max', emoji: '📱', color: '#f0b90b' },
        { id: '2', rank: '2.', prize: '5,000 TL Nakit', emoji: '💵', color: '#10b981' },
        { id: '3', rank: '3.', prize: '1,000 TL Bonus', emoji: '🎁', color: '#8b5cf6' },
        { id: '4', rank: '4-10.', prize: '250 TL Freespin', emoji: '🎰', color: '#f59e0b' },
    ],
    rules: [
        { icon: 'Shield', text: 'Her kullanıcı en fazla 10 bilet satın alabilir.' },
        { icon: 'AlertTriangle', text: 'Bilet satın alımı geri iade edilemez.' },
        { icon: 'CheckCircle', text: 'Her 500 TL yatırım = 1 Bilet hakkı kazandırır.' },
        { icon: 'Users', text: 'Çekiliş sonuçları şeffaf algoritma ile belirlenir.' },
        { icon: 'Trophy', text: 'Kazananlar çekiliş gününde canlı olarak açıklanır.' },
        { icon: 'Info', text: 'Bilet havuzundaki slot numaranız çekilişte kullanılır.' },
    ],
    faqs: [
        { q: "Bilet nasıl kazanılır?", a: "Sponsor sitemiz 724BAHİS.NET'e yatırımlar yaparak veya Görevler sekmesindeki etkinlikleri tamamlayarak bilet kazanabilirsiniz." },
        { q: "Bilet talebi nasıl oluşturulur?", a: "Görevler sayfasındaki form aracılığıyla 724BAHİS.NET kullanıcı adınızı, yatırım miktarınızı ve tarihini girerek talep oluşturabilirsiniz." },
        { q: "Yatırım tarihi ve saati neden isteniyor?", a: "Yatırımınızın sistem tarafından teyit edilebilmesi için talep edilmektedir." },
        { q: "Bilet talebim ne kadar sürede onaylanır?", a: "Talepleriniz uzman ekibimiz tarafından kontrol edilip en kısa sürede otomatik olarak onaylanır." },
        { q: "Bilet liderliği nasıl çalışır?", a: "Bilet havuzumuzdan, en fazla bilete sahip olan kullanıcıların biletleri sıralı olarak sergilenir." },
        { q: "Çekiliş nasıl yapılır?", a: "Çekiliş günlerinde bilet havuzundaki biletler arasından şeffaf bir bilgisayar algoritması ile kazananlar belirlenir." },
        { q: "Sponsor bilgisi neden isteniyor?", a: "Çekilişlerimiz partnerimiz 724BAHİS.NET sponsorluğunda gerçekleştiği için oyuncu teyiti zorunludur." },
        { q: "Telefon doğrulaması neden gerekli?", a: "Sadece gerçek kişilerin ödül alabilmesi ve multi hesapların engellenmesi için istenmektedir." }
    ]
};

export const DEFAULT_POPULAR_BETS_CONFIG: PopularBetsConfig = {
    isActive: true,
    bets: demoPopularBets
};

export const DEFAULT_NEWS_SLIDER_CONFIG: NewsSliderConfig = {
    isActive: true,
    autoPlayInterval: 5000,
    slides: [
        {
            id: 'ns-1',
            imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop',
            link: '#',
            title: 'Real Madrid - Manchester City Maçı Öncesi Son Dakika Gelişmeleri',
            category: 'ŞAMPİYONLAR LİGİ',
            isActive: true,
            order: 1
        },
        {
            id: 'ns-2',
            imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
            link: '#',
            title: 'Süper Lig\'de Şampiyonluk Yarışında Kritik Haftaya Girildi',
            category: 'SÜPER LİG',
            isActive: true,
            order: 2
        },
        {
            id: 'ns-3',
            imageUrl: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop',
            link: '#',
            title: 'Euro 2024 Öncesi A Milli Takım\'da Hazırlıklar Tam Gaz Sürüyor',
            category: 'A MİLLİ TAKIM',
            isActive: true,
            order: 3
        }
    ]
};
