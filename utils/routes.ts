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
  social: 'sosyal'
};

export const pathToView: Record<string, string> = Object.entries(viewToPath).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);
