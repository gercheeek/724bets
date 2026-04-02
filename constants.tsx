
import React from 'react';
import { Brand, MarqueeConfig, WelcomePopupConfig, LiveOddsConfig } from './types';

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
  text: 'Hoş geldiniz! En yüksek oranlar sadece 724bets.net adresinde!',
  speed: 50,
  color: '#f0b90b',
  isBold: true,
};

export const DEFAULT_WELCOME_POPUP_CONFIG: WelcomePopupConfig = {
  isActive: true,
  title: 'BETLIVO',
  subtitle: "Türkiye'nin En Güvenilir Bahis Platformu",
  offerMain: '%100 HOŞGELDİN BONUSU',
  offerSub: 'İlk yatırımınıza özel · Anında hesabınıza yükler',
  buttonText: '🚀 HEMEN KAYDOL — ÜCRETSİZ',
  buttonLink: 'https://betlivo.com',
};

export const DEFAULT_LIVE_ODDS_CONFIG: LiveOddsConfig = {
  isActive: true,
  matches: [
    { id: 'lo1', homeTeam: 'Galatasaray', awayTeam: 'Fenerbahçe', league: 'Süper Lig', matchTime: '21:00', odd1: '2.10', oddX: '3.40', odd2: '3.25', isLive: true, link: 'https://t.ly/GercekLivo' },
    { id: 'lo2', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga', matchTime: '22:00', odd1: '2.45', oddX: '3.30', odd2: '2.80', isLive: false, link: 'https://t.ly/GercekLivo' },
    { id: 'lo3', homeTeam: 'Beşiktaş', awayTeam: 'Trabzonspor', league: 'Süper Lig', matchTime: '19:00', odd1: '1.85', oddX: '3.50', odd2: '4.10', isLive: true, link: 'https://t.ly/GercekLivo' },
    { id: 'lo4', homeTeam: 'Man City', awayTeam: 'Liverpool', league: 'Premier League', matchTime: '20:00', odd1: '1.95', oddX: '3.60', odd2: '3.50', isLive: false, link: 'https://t.ly/GercekLivo' },
    { id: 'lo5', homeTeam: 'Bayern', awayTeam: 'Dortmund', league: 'Bundesliga', matchTime: '21:30', odd1: '1.70', oddX: '3.90', odd2: '4.50', isLive: false, link: 'https://t.ly/GercekLivo' },
  ],
};
