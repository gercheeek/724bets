export const viewToPath: Record<string, string> = {
  home: 'anasayfa',
  sports: 'spor',
  'live-casino': 'canli-casino',
  casino: 'casino',
  slots: 'slotlar',
  promotions: 'promosyonlar',
  promo: 'promosyonlar',
  'vip-club': 'vip-kulubu',
  originals: 'orijinal-oyunlar',
  favorites: 'favoriler',
  support: 'canli-destek',
  '724tv': '724-tv',
  affiliate: 'ortaklik',
  'affiliate/overview': 'ortaklik',
  social: 'sosyal',
  '1xbet-live': 'canli-1xbet'
};

export const pathToView: Record<string, string> = Object.entries(viewToPath).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

export const getDerivedView = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  const validLangs = ['tr', 'en', 'pt', 'es', 'ar', 'ru'];
  const hasLang = parts[0] && validLangs.includes(parts[0]);
  const cleanParts = hasLang ? parts.slice(1) : parts;
  const cleanPath = '/' + cleanParts.join('/');
  
  if (cleanPath === '/' || cleanPath === '/anasayfa') return 'home';
  if (cleanPath.startsWith('/spor')) return 'spor724';
  if (cleanPath.startsWith('/casino') && !cleanPath.includes('demo')) return 'casino';
  if (cleanPath.startsWith('/canli-casino')) return 'live-casino';
  if (cleanPath === '/demo-oyunlar' || cleanPath === '/casino/demo' || cleanPath === '/demo') return 'demo';
  if (cleanPath === '/raffles') return 'cekilis';
  if (cleanPath === '/bilet') return 'raffle';
  if (cleanPath === '/canli') return 'sports';
  if (cleanPath === '/lucky-wheel' || cleanPath === '/luckywheel' || cleanPath === '/cark') return 'luckywheel';
  if (cleanPath === '/brands' || cleanPath === '/trusted-sites') return 'trusted-sites';
  if (cleanPath === '/admin') return 'admin';
  if (cleanPath === '/analysis') return 'analysis';
  if (cleanPath === '/coupons') return 'coupons';
  if (cleanPath === '/724tv') return '724tv';
  if (cleanPath === '/trusted-detail') return 'trusted-detail';
  if (cleanPath === '/bulten') return 'bulten';
  if (cleanPath.startsWith('/tahmin/')) return 'tahmin-detay';
  
  const rawView = cleanParts[0] || '';
  return pathToView[rawView] || rawView || 'home';
};
