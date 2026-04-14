
import React from 'react';
import { Brand, MarqueeConfig, WelcomePopupConfig, LiveOddsConfig, WheelConfig, SiteStatusConfig } from './types';

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
