import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Play, Filter, Grid2X2, Crown, MonitorPlay, Disc, Sparkles, Flame, Star, StarHalf } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CasinoLobbyGame } from '../types';
import { ALL_GAMES } from '../data/games';
import { useLanguage } from '../contexts/LanguageContext';
import { getOriginalsData } from './OriginalsSlider';
import { PopularLiveWidget } from './PopularLiveWidget';
import { GamePlayView } from './GamePlayView';

const TABS = [
  { id: 'all', label: 'Tümü', icon: <Grid2X2 size={16} /> },
  { id: 'popular', label: 'Popüler', icon: <Star size={16} /> },
  { id: 'slots', label: 'Slotlar', icon: <Flame size={16} /> },
  { id: 'originals', label: 'Orijinal Oyunlar', icon: <Crown size={16} /> },
  { id: 'live', label: 'Canlı Casino', icon: <MonitorPlay size={16} /> },
  { id: 'table', label: 'Masa Oyunları', icon: <Disc size={16} /> },
  { id: 'egt', label: 'EGT', icon: <Flame size={16} /> },
  { id: 'new', label: 'Yeni Eklenenler', icon: <Sparkles size={16} /> },
];

const BANNERS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=1200&auto=format&fit=crop', title: '5.000₺ Hoş Geldin Bonusu', sub: 'İlk yatırımınıza özel fırsatı kaçırmayın' },
  { id: 2, image: '/images/cashback_boss.jpg', title: 'Haftalık %20 Cashback', sub: 'Kayıplarınızı anında telafi edin' },
];

const DEMO_GAMES = [
  { id: 1167, name: 'Big Bass Rock and Roll', provider: 'Pragmatic Play', img: 'https://mediumrare.imgix.net/49950a8148c358e88455c78d8dd1abfbeb8d2dd31a7b7971f5515ae4091b6429?w=300&h=400&fit=min&auto=format', category: 'popular', rtp: '96.50%', customDemoUrl: 'https://demogamesfree.mknyxfbxou.net/gs2c/html5Game.do?extGame=1&symbol=vs10bbrrh&gname=Big%20Bass%20Rock%20and%20Roll&jurisdictionID=99&lobbyUrl=https%3A%2F%2Fstake.com%2Fcasino%2Fhome&mgckey=stylename@rare_stake~SESSION@2686b1a0-7131-4bb4-876f-b16b67d01483' },
  { id: 1168, name: 'Sweet Bonanza 2500', provider: 'Pragmatic Play', img: 'https://mediumrare.imgix.net/76411df1039d658a8b9c9f90c14467c7ca7c240feeed97274ea73208d786484e?w=300&h=400&fit=min&auto=format', category: 'popular', rtp: '96.48%', customDemoUrl: 'https://demogamesfree.mknyxfbxou.net/gs2c/html5Game.do?extGame=1&symbol=vs20swbon2500&gname=Sweet%20Bonanza%202500&jurisdictionID=99&lobbyUrl=https%3A%2F%2Fstake.com%2Fcasino%2Fhome&mgckey=stylename@rare_stake~SESSION@7066ab78-b1aa-4060-b2e2-6c141cd7723e' },
  { id: 101, name: 'Gates of Olympus', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Gates-of-Olympus-PragmaticPlay/Vertical/GatesofOlympus_20250328152430427.webp', category: 'slots', rtp: '96.50%' },
  { id: 102, name: 'Sweet Bonanza', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/Sweet-Bonanza-PragmaticPlay/VerticalSweetBonanza_20251014122142773.webp', category: 'slots', rtp: '96.48%' },
  { id: 103, name: 'Crazy Time', provider: 'Evolution', img: 'https://images.unsplash.com/photo-1606167668511-8785bbbe5761?w=500&q=80', category: 'live', rtp: '95.40%' },
  { id: 104, name: 'Lightning Roulette', provider: 'Evolution', img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=500&q=80', category: 'live', rtp: '97.30%' },
  { id: 105, name: 'Sugar Rush 1000', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Sugar-Rush-1000-Pragmatic/Vertical/SugarRush1000_20250328152633077.webp', category: 'slots', rtp: '96.53%' },
  { id: 106, name: 'Big Bass Splash', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Big-Bass-Splash-Pragmatic/Vertical/BigBassSplash_20250312175247779.webp', category: 'slots', rtp: '96.71%' },
  { id: 107, name: 'Starlight Princess', provider: 'Pragmatic Play', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/partners/1217/Games/Starlight-Princess-1000-Pragmatic-Play/Vertical/StarlightPrincess1000_20250312174636784.webp', category: 'slots', rtp: '96.50%' },
  { id: 108, name: '40 Super Hot', provider: 'Amusnet', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/Vertical/40SuperHotBellLink.webp', category: 'slots', rtp: '95.81%' },
  { id: 109, name: 'XXXTreme Lightning', provider: 'Evolution', img: 'https://images.unsplash.com/photo-1517594422361-5e18d033339f?w=500&q=80', category: 'live', rtp: '97.30%' },
  { id: 115, name: '12 Coins', provider: 'Wazdan', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/12-Coins-Grand-Gold-Edition-Santas-Jackpots-Wazdan/Vertical/12CoinsGrandGoldEditionSantasJackpots.webp', category: 'new', rtp: '96.15%' },
  { 
    id: 1160, 
    name: 'Out of the Woods', 
    provider: 'Pragmatic Play', 
    img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5523109e9fec840eaeed00', 
    category: 'new', 
    rtp: '96.50%',
    demoSymbol: 'vs25bstackwild'
  },
  { 
    id: 1161, 
    name: 'Legion Gold And The Throne Of Dead', 
    provider: 'Play\'n GO', 
    img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5523235229c24dca9f40d6', 
    category: 'new', 
    rtp: '96.20%',
    customDemoUrl: 'https://acccw.playngonetwork.com/casino/ContainerLauncher?pid=1857&brand=b2b_anj&gid=throneofdead&practice=1&lang=en_GB&div=gameWrapper&embedmode=iframe&channel=mobile&origin=https%3A%2F%2Fslotra.com'
  },
  { 
    id: 1162, 
    name: 'Big Bass Blast', 
    provider: 'Pragmatic Play', 
    img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a4f6a30db4d711f8d6a96e9', 
    category: 'new', 
    rtp: '96.71%',
    demoSymbol: 'vs10bbasblitz'
  },
  { 
    id: 1163, 
    name: 'The Dog House Megaways 1000', 
    provider: 'Pragmatic Play', 
    img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5524d03da928ad473ccbc8', 
    category: 'new', 
    rtp: '96.55%',
    demoSymbol: 'vswaysdh1000'
  },
  { 
    id: 1164, 
    name: 'Grug Make Fire', 
    provider: 'Hacksaw Gaming', 
    img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5524e39666981d0311ce45', 
    category: 'new', 
    rtp: '96.30%',
    customDemoUrl: 'https://d2sx83al1f82za.cloudfront.net/2309/1.4.4/index.html?language=en&channel=mobile&gameid=2309&mode=2&token=123token&partner=slotra&env=https://d2sx83al1f82za.cloudfront.net/demo/api&realmoneyenv=https://d2sx83al1f82za.cloudfront.net/api&alwaysredirect=true'
  },
  { id: 117, name: 'Flaming Hot Extreme BL', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69b3a92380f01cf4dddc7eed', category: 'egt', rtp: '95.96%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FHEBLSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 118, name: '100 Super Hot BL', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a55240deeda3ed51d7aca39', category: 'egt', rtp: '95.89%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=OTSDHRSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 119, name: 'Shining Crown', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e8844955d051294f1569', category: 'egt', rtp: '96.37%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=SHCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 120, name: '40 Super Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddaf97e037f36376e74121', category: 'egt', rtp: '95.81%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FSHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 121, name: 'Burning Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6983438a9ed28916ad210658', category: 'egt', rtp: '96.45%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=BHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 122, name: '20 Super Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e92f4955d051294f1571', category: 'egt', rtp: '95.79%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=TSHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 123, name: 'Supreme Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68cdbd74bfb6f26555f52e36', category: 'egt', rtp: '96.24%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=SHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 124, name: 'Zodiac Wheel', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69493065dcf61d4bac414608', category: 'egt', rtp: '96.45%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=ZWSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 125, name: 'Extra Stars', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d8668c1a6e8f6e1da85eba', category: 'egt', rtp: '95.78%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=ESSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 126, name: '5 Dazzling Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/698342be9ed28916ad210656', category: 'egt', rtp: '95.74%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FDHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 127, name: 'Vampire Night', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/694916f1e19e953297a1122e', category: 'egt', rtp: '95.98%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=VNSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 128, name: '40 Burning Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e8ece037f36376e39345', category: 'egt', rtp: '95.93%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FBHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 129, name: '20 Burning Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a42640a84773277a44f8a73', category: 'egt', rtp: '95.88%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=TBHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 130, name: 'Dice & Roll', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddafa9e037f36376e74122', category: 'egt', rtp: '95.76%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=DRSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 131, name: 'More Dice & Roll', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a1c8d56d79c19c5568f380c', category: 'egt', rtp: '95.76%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=MDRSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 132, name: 'Flaming Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69b3a92380f01cf4dddc7eed', category: 'egt', rtp: '95.53%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 133, name: 'Rise of Ra', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b8eedcf61d4bac430fdb', category: 'egt', rtp: '95.97%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=RORSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 134, name: 'Amazon\'s Battle', provider: 'EGT Digital', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/AmazonsBattle.webp', category: 'egt', rtp: '96.17%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=ABSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 135, name: 'Ultimate Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6968c7f10688c3f239ebe829', category: 'egt', rtp: '95.51%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=UHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 136, name: 'Versailles Gold', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddaf414955d05129541b8b', category: 'egt', rtp: '96.09%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=VGSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 137, name: 'Royal Secrets', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e8a74955d051294f156b', category: 'egt', rtp: '96.38%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=RSSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 138, name: '10 Burning Heart', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69e53713cb196754219c2431', category: 'egt', rtp: '95.94%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=BHRTSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 139, name: 'Caramel Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a42646e2a354edf8dd2cfc7', category: 'egt', rtp: '95.77%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=CHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 140, name: 'Extremely Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddaf7de037f36376e74120', category: 'egt', rtp: '95.74%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=EHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 141, name: 'Blue Heart', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a42641eeb7a323414b2a97d', category: 'egt', rtp: '96.03%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=BHLSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 142, name: 'Frog Story', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e7344955d051294f1559', category: 'egt', rtp: '95.87%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FSSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 143, name: '20 Golden Coins', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e8b5e037f36376e39342', category: 'egt', rtp: '95.87%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=TGCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 144, name: 'Orient Story', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69493423dcf61d4bac414647', category: 'egt', rtp: '96.34%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=OSSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 145, name: 'Great 27', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6991bbf9a28de9631a0ebb85', category: 'egt', rtp: '95.95%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=G27Slot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 146, name: '27 Wins', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a55241e0a5a05bed8d41da8', category: 'egt', rtp: '95.96%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=TWSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 147, name: 'Black Diamond', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69497a8fe19e953297a21b01', category: 'egt', rtp: '95.90%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=BDSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 200, name: '100 Burning Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/698343259ed28916ad210657', category: 'egt', rtp: '96.44%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=OBHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 201, name: '40 Burning Hot 6 Reels', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e85f4955d051294f1567', category: 'egt', rtp: '96.13%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FBHSRSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 202, name: '100 Super Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d866d0dad88070959d2251', category: 'egt', rtp: '96.74%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=OSHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 203, name: 'Dazzling Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b196dcf61d4bac430f3a', category: 'egt', rtp: '96.44%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=DHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 204, name: '20 Dazzling Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d86f72dad88070959d226d', category: 'egt', rtp: '96.74%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=TDHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 205, name: '40 Shining Crown', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e7a2e037f36376e39338', category: 'egt', rtp: '96.58%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FSHCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 206, name: '40 Dice & Roll', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864ecdad88070959d2249', category: 'egt', rtp: '96.21%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FDRSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 207, name: 'Flaming Hot Extreme', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddaf644955d05129541b8c', category: 'egt', rtp: '96.95%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FHESlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 208, name: 'Egypt Sky', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949bcdae19e953297a21d36', category: 'egt', rtp: '96.11%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=ESSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 209, name: 'Majestic Forest', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69492325e19e953297a11333', category: 'egt', rtp: '96.90%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=MFSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 210, name: 'Secrets of Alchemy', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/694936d7e19e953297a113e8', category: 'egt', rtp: '96.34%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=SOASlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 211, name: 'Grace of Cleopatra', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/694933d3dcf61d4bac414646', category: 'egt', rtp: '96.46%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=GOCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 212, name: 'Olympus Glory', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949675bdcf61d4bac424a54', category: 'egt', rtp: '96.55%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=OGLSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 213, name: 'Kangaroo Land', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e996e037f36376e3934d', category: 'egt', rtp: '96.50%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=KLSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 214, name: 'Coral Island', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69492811dcf61d4bac4145d4', category: 'egt', rtp: '96.34%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=CISlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 215, name: 'Action Money', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b4b6dcf61d4bac430f69', category: 'egt', rtp: '96.84%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=AMSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 216, name: 'Aloha Party', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b658dcf61d4bac430f8a', category: 'egt', rtp: '96.46%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=APSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 217, name: 'Amazing Amazonia', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69495fc0e19e953297a1156f', category: 'egt', rtp: '96.75%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=AASlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 218, name: 'Brave Cat', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e850e037f36376e3933c', category: 'egt', rtp: '96.86%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=BCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 219, name: 'Candy Palace', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864401a6e8f6e1da85ea9', category: 'egt', rtp: '96.75%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=CPSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 220, name: 'Circus Brilliant', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b7fde19e953297a21cd4', category: 'egt', rtp: '96.60%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=CBSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 221, name: 'Cocktail Rush', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/694934cbe19e953297a113d5', category: 'egt', rtp: '96.11%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=CRSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 222, name: 'Dice High', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e86f4955d051294f1568', category: 'egt', rtp: '96.29%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=DHISlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 223, name: 'Dorothy\'s Fairyland', provider: 'EGT Digital', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/DorothysFairyland.webp', category: 'egt', rtp: '96.18%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=DFSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 224, name: 'Dragon Reborn', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949aff8e19e953297a21b8e', category: 'egt', rtp: '96.38%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=DRESlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 225, name: 'Emperor\'s Palace', provider: 'EGT Digital', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/EmperorsPalace.webp', category: 'egt', rtp: '96.18%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=EPSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 226, name: 'Extra Joker', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864cedad88070959d2247', category: 'egt', rtp: '96.52%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=EJSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 227, name: 'Fast Money', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e9514955d051294f1573', category: 'egt', rtp: '96.89%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FMSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 228, name: 'Flaming Dice', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864131a6e8f6e1da85ea7', category: 'egt', rtp: '96.99%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FDSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 229, name: 'Forest Band', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69539ac30d4a2223c3b45090', category: 'egt', rtp: '96.98%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FBSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 230, name: 'Forest Tale', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d86e5edad88070959d2265', category: 'egt', rtp: '96.90%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FTSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 231, name: 'Fortune Spells', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68cdbd74bfb6f26555f52e36', category: 'egt', rtp: '96.97%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FSPSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 232, name: 'Fruity Time', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a42646e2a354edf8dd2cfc7', category: 'egt', rtp: '96.49%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FTISlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 233, name: 'Game of Luck', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949bcdae19e953297a21d36', category: 'egt', rtp: '96.28%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=GOLSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 234, name: 'Genius of Leonardo', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/694934cbe19e953297a113d5', category: 'egt', rtp: '96.89%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=GOLOSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 235, name: 'Gladiator', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69b3a92380f01cf4dddc7eed', category: 'egt', rtp: '96.54%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=GLSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 236, name: 'Great Adventure', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b7fde19e953297a21cd4', category: 'egt', rtp: '96.52%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=GASlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 237, name: 'Great Empire', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a42640a84773277a44f8a73', category: 'egt', rtp: '96.49%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=GESlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 238, name: 'Greek Fortune', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e8a74955d051294f156b', category: 'egt', rtp: '96.64%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=GFSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 239, name: 'Halloween', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69493423dcf61d4bac414647', category: 'egt', rtp: '96.30%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=HALSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 240, name: 'Hot Deco', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e8a74955d051294f156b', category: 'egt', rtp: '96.93%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=HDSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 241, name: 'Ice Valley', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864ecdad88070959d2249', category: 'egt', rtp: '96.96%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=IVSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 242, name: 'Imperial Wars', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d8668c1a6e8f6e1da85eba', category: 'egt', rtp: '96.58%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=IWSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 243, name: 'Kashmir Gold', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6983438a9ed28916ad210658', category: 'egt', rtp: '96.17%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=KGSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 244, name: 'Legend of Cleopatra', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69539ac30d4a2223c3b45090', category: 'egt', rtp: '96.82%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=LOCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 245, name: 'Like a Diamond', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864cedad88070959d2247', category: 'egt', rtp: '96.53%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=LADSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 246, name: 'Lucky Buzz', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e8ece037f36376e39345', category: 'egt', rtp: '96.89%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=LBSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 247, name: 'Lucky Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864ecdad88070959d2249', category: 'egt', rtp: '96.31%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=LHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 248, name: 'Lucky Wood', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d86e5edad88070959d2265', category: 'egt', rtp: '96.51%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=LWSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 249, name: 'Magellan', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e8b5e037f36376e39342', category: 'egt', rtp: '96.94%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=MAGSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 250, name: 'Magic 81 Lines', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddaf644955d05129541b8c', category: 'egt', rtp: '96.84%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=M81LSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 251, name: 'Majestic Sea', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e850e037f36376e3933c', category: 'egt', rtp: '96.51%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=MSEASlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 252, name: 'Mythical Treasure', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864131a6e8f6e1da85ea7', category: 'egt', rtp: '96.43%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=MTSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 253, name: 'Ocean Rush', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/694916f1e19e953297a1122e', category: 'egt', rtp: '96.60%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=ORSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 254, name: 'Oil Company II', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/698342be9ed28916ad210656', category: 'egt', rtp: '96.15%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=OC2Slot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 255, name: 'Olympus Tales', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddaf414955d05129541b8b', category: 'egt', rtp: '96.69%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=OTSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 256, name: 'Penguin Style', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b4b6dcf61d4bac430f69', category: 'egt', rtp: '96.51%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=PSSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 257, name: 'Pin Up Queens', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d86f72dad88070959d226d', category: 'egt', rtp: '96.56%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=PUQSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 258, name: 'Queen of Rio', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69b3a92380f01cf4dddc7eed', category: 'egt', rtp: '96.25%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=QORSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 259, name: 'Retro Cabaret', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69492325e19e953297a11333', category: 'egt', rtp: '96.97%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=RCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 260, name: 'Rich World', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949bcdae19e953297a21d36', category: 'egt', rtp: '96.50%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=RWSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 261, name: 'Route of Mexico', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddaf7de037f36376e74120', category: 'egt', rtp: '96.55%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=ROMSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 262, name: 'Royal Gardens', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b658dcf61d4bac430f8a', category: 'egt', rtp: '96.42%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=RGSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 263, name: 'Savanna\'s Life', provider: 'EGT Digital', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/SavannasLife.webp', category: 'egt', rtp: '96.64%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=SLSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 264, name: 'Shining Dice', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949b658dcf61d4bac430f8a', category: 'egt', rtp: '96.60%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=SDSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 265, name: 'Summer Bliss', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d866d0dad88070959d2251', category: 'egt', rtp: '96.61%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=SBSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 266, name: 'Super 20', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d8668c1a6e8f6e1da85eba', category: 'egt', rtp: '96.85%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=S20Slot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 267, name: 'Sweet Cheese', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a55240deeda3ed51d7aca39', category: 'egt', rtp: '96.23%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=SCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 268, name: 'Thumbelina\'s Dream', provider: 'EGT Digital', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/ThumbelinasDream.webp', category: 'egt', rtp: '96.49%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=TDSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 269, name: 'Venezia D\'oro', provider: 'EGT Digital', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/VeneziaDoro.webp', category: 'egt', rtp: '96.79%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=VDOSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 270, name: 'Wonder Tree', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d864401a6e8f6e1da85ea9', category: 'egt', rtp: '96.16%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=WTSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 271, name: '40 Mega Clover', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68ddaf414955d05129541b8b', category: 'egt', rtp: '96.21%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=FMCSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 272, name: '20 Mega Slot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d86e5edad88070959d2265', category: 'egt', rtp: '96.55%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=TMSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 273, name: 'Age of Troy', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949675bdcf61d4bac424a54', category: 'egt', rtp: '96.72%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=AOTSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 274, name: 'Book of Magic', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a55240deeda3ed51d7aca39', category: 'egt', rtp: '96.47%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=BOMSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 275, name: 'Casino Mania', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6949aff8e19e953297a21b8e', category: 'egt', rtp: '96.42%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=CMSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 276, name: 'Cats Royal', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6968c7f10688c3f239ebe829', category: 'egt', rtp: '96.11%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=CRSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 277, name: 'Dark Queen', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a55240deeda3ed51d7aca39', category: 'egt', rtp: '96.78%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=DQSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 278, name: 'Dragon Hot', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a42640a84773277a44f8a73', category: 'egt', rtp: '96.68%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=DGHSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 279, name: 'Gold Dust', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/68d7e7a2e037f36376e39338', category: 'egt', rtp: '96.80%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=GDSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
  { id: 280, name: 'Aztec Glory', provider: 'EGT Digital', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/69493423dcf61d4bac414647', category: 'egt', rtp: '96.94%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=AGSlot&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },
];
// End of Mock Data

const getDemoUrl = (game: any): string | null => {
  if (!game) return null;
  if (game.customDemoUrl) return game.customDemoUrl;
  
  const nameString = (game.name || game.img || game.image || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let symbol = game.demoSymbol || 'vs20olympx'; // Fallback

  if (!game.demoSymbol) {
    if (nameString.includes('sweetbonanza1000')) symbol = 'vs20sbonz1000';
    else if (nameString.includes('sweetbonanza')) symbol = 'vs20fruitsw';
    else if (nameString.includes('gatesofolympus1000')) symbol = 'vs20olympgate1000';
    else if (nameString.includes('gatesofolympus')) symbol = 'vs20olympgate';
    else if (nameString.includes('sugarrush1000')) symbol = 'vs20sugarrushx';
    else if (nameString.includes('sugarrush')) symbol = 'vs20sugarrush';
    else if (nameString.includes('starlightprincess1000')) symbol = 'vs20starlightx';
    else if (nameString.includes('starlightprincess')) symbol = 'vs20starlight';
    else if (nameString.includes('bigbasssplash')) symbol = 'vs10txbigbass';
    else if (nameString.includes('bigbassbonanza')) symbol = 'vs10bbbonanza';
    else if (nameString.includes('zeus') || nameString.includes('hades')) symbol = 'vs20zeushades';
    else if (nameString.includes('doghouse')) symbol = 'vs20doghouse';
    else if (nameString.includes('fruitparty')) symbol = 'vs20fruitparty';
  }
  
  return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${symbol}&websiteUrl=https%3A%2F%2Fdemogamesfree.pragmaticplay.net&jurisdiction=99&enviroment=PREPROD&m=1`;
};

const getDisplayGameName = (game: any) => {
  if (game.name && game.name !== 'Yeni Slot Oyunu' && game.name !== 'Yeni Canlı Masa' && game.name !== 'Yeni Spor') {
    return game.name;
  }
  // Try to extract from URL if name is default
  const url = game.img || game.image || '';
  if (url) {
    const match = url.match(/\/Games\/([^\/]+)\//i);
    if (match && match[1]) {
      return match[1].replace(/-/g, ' ').replace(/PragmaticPlay|Pragmatic Play/ig, '').trim();
    }
  }
  return game.name || 'Casino Slot';
};

const getGameColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('sweet') || n.includes('sugar') || n.includes('candy') || n.includes('fruit')) return '#E91E63'; // Pink
  if (n.includes('zeus') || n.includes('olympus') || n.includes('thor') || n.includes('gods') || n.includes('kraken')) return '#2962FF'; // Blue
  if (n.includes('bass') || n.includes('splash') || n.includes('fisherman') || n.includes('catch')) return '#00C853'; // Green
  if (n.includes('party') || n.includes('fiesta') || n.includes('magic')) return '#AA00FF'; // Purple
  if (n.includes('gold') || n.includes('dog') || n.includes('rhino') || n.includes('buffalo') || n.includes('lion')) return '#FF6D00'; // Orange
  if (n.includes('gem') || n.includes('diamond') || n.includes('crystal')) return '#00B8D4'; // Cyan
  return '#1565C0'; // Default Blue
};

const GameCard: React.FC<{ game: any, onClick: () => void, onDemoClick?: () => void }> = ({ game, onClick, onDemoClick }) => {
  const randomPlayers = React.useMemo(() => Math.floor(Math.random() * 500) + 100, []);
  const players = game.players || randomPlayers;
  
  return (
    <div 
      className="group relative flex flex-col cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:z-10 border border-white/5 hover:border-[#00E5FF]/50 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(0,229,255,0.3)] hover:-translate-y-2 bg-[#0A0D14]"
      tabIndex={0}
      onClick={() => onClick()}
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl">
        <img src={game.img || game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy" />
        
        {/* Inner Glow / Glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10"></div>
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[#00E5FF]/50 rounded-2xl z-20 pointer-events-none transition-all duration-500"></div>

        {/* Tags */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {game.rtp && (
            <div className="bg-[#0A0D14]/80 backdrop-blur-md border border-[#00E5FF]/30 text-[#00E5FF] text-[9px] sm:text-[10px] font-black px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
              RTP {game.rtp}
            </div>
          )}
        </div>
        
        {/* Play Overlay with Real and Demo Buttons */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 bg-[#0A0D14]/70 backdrop-blur-[3px]">
          <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] hover:brightness-110 text-[#0A0D14] font-black text-[11px] sm:text-xs px-4 sm:px-6 py-2.5 rounded-lg shadow-[0_0_20px_rgba(0,229,255,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300 w-[85%] flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            GERÇEK OYNA
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onDemoClick ? onDemoClick() : onClick(); }}
            className="bg-[#1A1D24]/80 hover:bg-[#252A36] border border-white/10 hover:border-white/20 text-white font-bold text-[10px] sm:text-xs px-4 sm:px-6 py-2 rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300 w-[85%]"
          >
            EĞLENCE MODU
          </button>
        </div>
        
        {/* Provider Tag Bottom Right */}
        <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#0A0D14]/80 backdrop-blur-md border border-white/10 text-white/80 text-[8px] sm:text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1 uppercase tracking-wider">
            {game.provider?.charAt(0) || 'P'} {game.provider || 'Pragmatic'}
          </div>
        </div>
      </div>
    </div>
  );
};

// New Games specific card to match screenshot
const NewGameCard: React.FC<{ game: any, onClick: () => void, onDemoClick?: () => void }> = ({ game, onClick, onDemoClick }) => {
  return (
    <div 
      className="group relative flex flex-col cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:z-10 border border-white/5 hover:border-[#10B981]/50 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.25)] hover:-translate-y-2 bg-[#0A0D14]"
      style={{ aspectRatio: '4/5' }}
      tabIndex={0}
      onClick={() => onClick()}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <img 
          src={game.img || game.image} 
          alt={game.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" loading="lazy"
        />
        
        {/* Inner Glow / Glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10B981]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10"></div>
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[#10B981]/50 rounded-2xl z-20 pointer-events-none transition-all duration-500"></div>

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-20 flex flex-col items-center text-center group-hover:opacity-0 transition-opacity duration-300 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/80 to-transparent">
          <h3 className="text-white font-black text-[13px] sm:text-[15px] leading-tight tracking-tight uppercase mb-1 drop-shadow-lg">
            {getDisplayGameName(game)}
          </h3>
          <div className="w-full flex items-center justify-center">
             <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider truncate text-center">
              {game.provider || 'Pragmatic Play'}
            </span>
          </div>
        </div>

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 bg-[#0A0D14]/70 backdrop-blur-[3px]">
          <button 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="bg-gradient-to-r from-[#10B981] to-[#00E676] hover:brightness-110 text-[#0A0D14] font-black text-[11px] sm:text-xs px-4 sm:px-6 py-2.5 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300 w-[85%] flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            GERÇEK OYNA
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDemoClick ? onDemoClick() : onClick(); }}
            className="bg-[#1A1D24]/80 hover:bg-[#252A36] border border-white/10 hover:border-white/20 text-white font-bold text-[10px] sm:text-xs px-4 sm:px-6 py-2 rounded-lg transform scale-90 group-hover:scale-100 transition-all duration-300 w-[85%]"
          >
            EĞLENCE MODU
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string, icon?: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center justify-between mb-4 mt-8">
    <div className="flex items-center gap-2">
      {icon && <div className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">{icon}</div>}
      <h2 className="text-white text-lg font-black tracking-tight drop-shadow-md">{title}</h2>
    </div>
    <div className="flex gap-2">
      <button className="w-8 h-8 rounded bg-[#0A0D14] border border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[0_0_10px_rgba(0,229,255,0.3)] flex items-center justify-center text-[#848B9D] hover:text-[#00E5FF] transition-all duration-300">
        <ChevronLeft size={18} />
      </button>
      <button className="w-8 h-8 rounded bg-[#0A0D14] border border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[0_0_10px_rgba(0,229,255,0.3)] flex items-center justify-center text-[#848B9D] hover:text-[#00E5FF] transition-all duration-300">
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

const SliderSection: React.FC<{ title: string, icon?: React.ReactNode, games: any[], onSelect: (g: any) => void, onDemo: (g: any) => void }> = ({ title, icon, games, onSelect, onDemo }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2">
          {icon && <div className="text-white">{icon}</div>}
          <h2 className="text-white text-lg font-bold tracking-tight drop-shadow-md">{title}</h2>
        </div>
        <div className="flex gap-2 items-center">
          <button className="px-3 h-8 flex items-center justify-center text-[#848B9D] hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all duration-300 text-[13px] font-medium">
            Tümünü gör
          </button>
          <button onClick={() => scroll('left')} className="w-7 h-7 rounded bg-[#0A0D14] border border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[0_0_10px_rgba(0,229,255,0.3)] flex items-center justify-center text-[#848B9D] hover:text-[#00E5FF] transition-all duration-300">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="w-7 h-7 rounded bg-[#0A0D14] border border-white/10 hover:border-[#00E5FF]/50 hover:shadow-[0_0_10px_rgba(0,229,255,0.3)] flex items-center justify-center text-[#848B9D] hover:text-[#00E5FF] transition-all duration-300">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      <div ref={scrollRef} className="overflow-x-auto hide-scrollbar -mx-4 px-4 pb-6 pt-2" style={{ scrollSnapType: 'x mandatory' }}>
        <div className="flex gap-3 md:gap-4 min-w-max">
          {games.map((game, i) => (
            <div key={`${game.id}-${i}`} className="w-[110px] sm:w-[120px] md:w-[130px] lg:w-[140px] xl:w-[150px]" style={{ flexShrink: 0, scrollSnapAlign: 'start' }}>
              <GameCard game={game} onClick={() => onSelect(game)} onDemoClick={() => onDemo(game)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function CasinoLobby({ 
  onNavigate, 
  customGames = [],
  isLoggedIn = false,
  initialTab
}: { 
  onNavigate: (view: string, gameData?: any) => void, 
  customGames?: any[],
  isLoggedIn?: boolean,
  initialTab?: string
}) {
  const { t } = useLanguage();
  const dynamicOriginals = getOriginalsData(t).map((game, i) => ({
    id: 1000 + i,
    name: game.name,
    provider: 'Originals',
    img: game.image,
    category: 'originals',
    rtp: game.rtp || '99.00%',
    path: game.path
  }));

  const [activeTab, setActiveTab] = useState(initialTab || 'all');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showDemoIframe, setShowDemoIframe] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleGameSelect = (game: any) => {
    if (game.category === 'originals' || game.provider === 'Originals' || game.name === 'Plinko' || game.name === 'Chicken Run' || game.name === 'Mission Uncrossable') {
      let path = game.name.toLowerCase().replace(/\s+/g, '-');
      if (path === 'mission-uncrossable') path = 'chicken-run';
      if (onNavigate) {
        onNavigate(path);
      }
    } else {
      setSelectedGame(game);
      setShowDemoIframe(true);
    }
  };

  const handleAction = () => {
    if (isLoggedIn) {
      window.dispatchEvent(new Event('openDepositModal'));
    } else {
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'login' }));
    }
  };

  // Combine ALL_GAMES, DEMO_GAMES, dynamicOriginals, and customGames
  const allGames = [...ALL_GAMES, ...DEMO_GAMES, ...dynamicOriginals, ...customGames.map(cg => ({ ...cg, img: cg.image, category: cg.lobbyCategory || 'slots' }))];

  const filteredGames = allGames.filter(game => {
    const matchesTab = activeTab === 'all' || game.category === activeTab;
    const matchesSearch = !searchQuery || (game.name && game.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Group games for the 'all' view
  const popularGames = allGames.filter(g => g.isPopular || g.players > 2000).slice(0, 18);
  const liveGames = allGames.filter(g => g.category === 'live').slice(0, 12);
  const newGames = allGames.filter(g => g.category === 'new' || g.isNew).slice(0, 12);

  const handleGameClick = (game: any) => {
    if (game.provider === 'Originals') {
      if (game.name === 'Blackjack') {
        onNavigate && onNavigate('blackjack-pro');
      } else if (game.name === 'Plinko') {
        onNavigate && onNavigate('plinko');
      } else {
        setSelectedGame(game);
        setShowDemoIframe(true);
      }
      return;
    }
    setSelectedGame(game);
  };

  const handleDemoClick = (game: any) => {
    if (game.provider === 'Originals') {
      handleGameClick(game);
      return;
    }
    setSelectedGame(game);
    setShowDemoIframe(true);
  };

  if (selectedGame && showDemoIframe) {
    return (
      <GamePlayView 
        game={selectedGame}
        demoUrl={getDemoUrl(selectedGame) || ''}
        onClose={() => { setShowDemoIframe(false); setSelectedGame(null); }}
        onViewChange={onNavigate}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-white min-w-0">
      {/* 1. TOP NAVBAR (Neon Stake Style) */}
      <div className="sticky top-0 z-40 bg-[#0A0D14]/90 backdrop-blur-xl border-b border-[#00E5FF]/10 px-4 md:px-8 py-0 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent"></div>
        <div className="max-w-[1600px] mx-auto flex items-center justify-center md:justify-center gap-4 md:gap-8 overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 py-4 px-2 whitespace-nowrap text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' 
                  : 'text-[#848B9D] hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]'
              }`}
            >
              <div className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110 text-[#00E5FF]' : ''}`}>
                {tab.icon}
              </div>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] rounded-t-full shadow-[0_-2px_15px_rgba(0,229,255,0.7)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-6 min-w-0">
        {/* 2. HERO BANNER */}
        {activeTab === 'all' && !searchQuery && (
          <div className="relative w-full aspect-[21/9] md:aspect-[32/9] rounded-xl overflow-hidden mb-8 group bg-[#111111]">
            {BANNERS.map((banner, idx) => (
              <div 
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-700 ${currentBanner === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F121A] via-[#0F121A]/80 to-transparent" />
                
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[90%] md:w-full max-w-3xl text-center px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2 md:mb-4 tracking-tight leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-[#848B9D] text-sm md:text-lg mb-6 font-medium">
                    {banner.sub}
                  </p>
                  <button onClick={() => handleAction()} className="bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] hover:brightness-110 text-[#0A0D14] px-8 py-3 rounded-lg font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] mx-auto block">
                    Hemen Katıl
                  </button>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {BANNERS.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentBanner(idx)}
                  className={`h-1.5 rounded-full transition-all ${currentBanner === idx ? 'w-6 bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3. FILTERS AND SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#0A0D14] hover:bg-[#111622] border border-white/5 hover:border-[#00E5FF]/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] rounded-lg text-white font-bold transition-all duration-300">
            <Filter size={18} className="text-[#00E5FF]" />
            Sağlayıcılar
          </button>

          <div className="relative w-full md:w-[320px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848B9D] group-focus-within:text-[#00E5FF] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Oyun Ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0D14] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border border-white/5 focus:border-[#00E5FF]/50 rounded-lg py-3 pl-12 pr-4 text-white placeholder-[#848B9D] focus:outline-none focus:ring-1 focus:ring-[#00E5FF]/30 transition-all duration-300 font-medium"
            />
          </div>
        </div>

        {/* 4. GAME GRIDS */}
        {searchQuery || activeTab !== 'all' ? (
          <div>
            <SectionHeader title={searchQuery ? 'Arama Sonuçları' : TABS.find(t => t.id === activeTab)?.label || 'Oyunlar'} />
            
            {activeTab === 'egt' && !searchQuery ? (
              <div className="w-full overflow-hidden relative py-4 group [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
                <style>{`
                  @keyframes egt-marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .animate-egt-marquee {
                    animation: egt-marquee 120s linear infinite;
                  }
                  .group:hover .animate-egt-marquee {
                    animation-play-state: paused;
                  }
                `}</style>
                <div className="flex w-max animate-egt-marquee gap-3 sm:gap-4">
                  {/* First Set */}
                  <div className="grid grid-rows-2 grid-flow-col gap-3 sm:gap-4">
                    {filteredGames.map(game => (
                      <div key={`set1-${game.id}`} className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[150px] xl:w-[160px]">
                        <GameCard game={game} onClick={() => handleGameSelect(game)} />
                      </div>
                    ))}
                  </div>
                  {/* Duplicate Set for Infinite Scroll */}
                  <div className="grid grid-rows-2 grid-flow-col gap-3 sm:gap-4">
                    {filteredGames.map(game => (
                      <div key={`set2-${game.id}`} className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[150px] xl:w-[160px]">
                        <GameCard game={game} onClick={() => handleGameSelect(game)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} onClick={() => handleGameSelect(game)} />
                ))}
              </div>
            )}
            
            {filteredGames.length === 0 && (
              <div className="w-full py-20 flex flex-col items-center justify-center text-[#848B9D]">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Oyun bulunamadı</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* NEW GAMES SLIDER SECTION (Moved to top) */}
            <SliderSection 
              title="Yeni Eklenenler" 
              icon={<Sparkles className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />} 
              games={newGames} 
              onSelect={handleGameSelect}
              onDemo={(game) => { setSelectedGame(game); setShowDemoIframe(true); }}
            />

            {/* POPULAR GAMES SLIDER SECTION */}
            <SliderSection 
              title="Popüler Oyunlar" 
              icon={<Flame className="text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" fill="#10B981" />} 
              games={popularGames} 
              onSelect={handleGameSelect}
              onDemo={(game) => { setSelectedGame(game); setShowDemoIframe(true); }}
            />


            <SliderSection 
              title="Çok Kazandıranlar" 
              icon={<Flame className="text-[#f0b90b] drop-shadow-[0_0_8px_rgba(240,185,11,0.8)]" fill="#f0b90b" />} 
              games={allGames.filter(g => g.type === 'slot' || g.category === 'slots').sort((a, b) => b.players - a.players).slice(12, 24)} 
              onSelect={handleGameSelect}
              onDemo={(game) => { setSelectedGame(game); setShowDemoIframe(true); }}
            />
          </div>
        )}
      </div>


    </div>
  );
};

