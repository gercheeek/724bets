// 1xBet (BetB2B) Market Groups (G) and Event Types (T) Dictionary
// This file maps the numeric IDs to their human-readable Turkish translations.

export const MARKET_GROUP_NAMES: Record<number, string> = {
  1: 'Maç Sonucu (1x2)',
  2: 'Handikap',
  8: 'Çifte Şans',
  10: 'Doğru Skor',
  11: 'Ev Sahibi Toplam Alt/Üst',
  12: 'Deplasman Toplam Alt/Üst',
  14: '1. Yarı - Çifte Şans',
  15: 'Asya Toplam Alt/Üst',
  17: 'Toplam Alt/Üst',
  19: 'Karşılıklı Gol Var/Yok',
  20: '1. Yarı - Karşılıklı Gol Var/Yok',
  21: 'İlk Golü Kim Atar',
  22: 'Son Golü Kim Atar',
  26: 'En Çok Gol Olan Yarı',
  27: '1. Yarı - Handikap',
  62: 'Ev Sahibi İlk Yarı Alt/Üst',
  63: 'Deplasman İlk Yarı Alt/Üst',
  69: 'Tek/Çift',
  74: '1. Yarı Toplam Alt/Üst',
  75: '2. Yarı Toplam Alt/Üst',
  100: 'Maç/Set Kazanır',
  101: '1. Yarı Sonucu',
  102: '2. Yarı Sonucu',
  136: '1. Yarı - Korner Maç Sonucu',
  154: 'Korner - Tek/Çift',
  173: 'Asya Handikap',
  285: 'Asya Toplam Gol',
  1119: '1. Yarı - Asya Handikap',
  1120: '2. Yarı - Asya Handikap',
  2668: 'Korner - Toplam Alt/Üst',
  2854: 'Sonraki Golü Atan Takım',
  2880: '1. Yarı Korner Alt/Üst',
  3309: 'Sarı Kart - Maç Sonucu',
  3311: 'Sarı Kart - Alt/Üst',
  3559: 'İlk Yarı Doğru Skor',
  3561: 'İkinci Yarı Doğru Skor',
  7961: 'Oyuncu Bahisleri - Asist',
  8427: 'Korner - Çifte Şans',
  8429: 'Korner - Handikap',
  8801: 'Oyuncu Gol Atar',
  8803: 'Oyuncu İlk Golü Atar',
  9939: 'Sarı Kart - Handikap'
};

// Map T (Event Types) directly if known.
// There are thousands, so we use helper logic combined with specific ones.
export const EVENT_TYPE_NAMES: Record<number, string> = {
  1: '1',
  2: 'X',
  3: '2',
  4: '1X',
  5: '12',
  6: '2X',
  69: 'Tek',
  70: 'Çift',
  180: 'Evet',
  181: 'Hayır',
  794: '1',
  795: '2',
  1143: 'Üst',
  1144: 'Alt',
  1125: 'Üst',
  1126: 'Alt',
  1558: 'Üst',
  1559: 'Alt',
  1635: 'Üst',
  1636: 'Alt'
};

// Fallback logic for categorizing groups into tabs
export const getMarketCategory = (g: number): string => {
  if ([2, 27, 173, 1119, 1120].includes(g)) return 'Handikap';
  if ([17, 11, 12, 15, 74, 75, 62, 63, 285, 99].includes(g)) return 'Toplam Alt/Üst';
  if ([1, 8, 10, 100, 101, 102, 14, 3559, 3561].includes(g)) return 'Ana Bahisler';
  if ([19, 20, 21, 22, 26, 69, 2854, 8801, 8803].includes(g)) return 'Gol Bahisleri';
  if ([136, 154, 2668, 2880, 8427, 8429].includes(g)) return 'Korner';
  if ([3309, 3311, 9939].includes(g)) return 'Kartlar';
  return 'Diğer';
};

/**
 * Smart parser to deduce the name of the selection based on its `T` code and Group context.
 * Many Over/Under codes in 1xBet are odd/even pairs (e.g. 7, 9, 1143 are Over. 8, 10, 1144 are Under).
 */
export const getSelectionLabel = (t: number, p?: any): string => {
  if (EVENT_TYPE_NAMES[t]) {
    return p ? `${EVENT_TYPE_NAMES[t]} (${p})` : EVENT_TYPE_NAMES[t];
  }

  // Common Over/Under logic in 1xBet: Over is usually odd, Under is usually even for contiguous pairs
  if ([7, 9, 381, 382, 131, 133, 1143, 1125, 1558, 1635, 3827, 4962].includes(t)) {
    return `Üst ${p ? `(${p})` : ''}`.trim();
  }
  if ([8, 10, 380, 383, 132, 134, 1144, 1126, 1559, 1636, 3828, 4963].includes(t)) {
    return `Alt ${p ? `(${p})` : ''}`.trim();
  }
  
  // Home/Away Handicap or Totals
  if ([11, 384].includes(t)) {
    return `Ev Sahibi ${p ? `(${p})` : ''}`.trim();
  }
  if ([12, 385].includes(t)) {
    return `Deplasman ${p ? `(${p})` : ''}`.trim();
  }

  // If it's completely unknown but has a Parameter (P), it's probably a specific line
  return p ? `${p}` : `Seçenek ${t}`;
};
