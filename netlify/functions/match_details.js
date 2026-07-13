exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { id } = event.queryStringParameters || {};

  try {
    // Seed randomization based on ID so same match always gets same odds
    const seed = id ? parseInt(id.replace(/[^0-9]/g, '') || '1') : 1;
    const baseOdd = 1.5 + (seed % 15) / 10; // between 1.5 and 2.9

    const markets = [
      {
        id: 'm1',
        title: 'Maç Sonucu',
        category: 'Ana Bahisler',
        selections: [
          { label: '1', odds: baseOdd.toFixed(2) },
          { label: 'X', odds: (baseOdd * 1.5).toFixed(2) },
          { label: '2', odds: (baseOdd * 1.8).toFixed(2) }
        ]
      },
      {
        id: 'm2',
        title: 'Çifte Şans',
        category: 'Ana Bahisler',
        selections: [
          { label: '1X', odds: (baseOdd * 0.4).toFixed(2) },
          { label: '12', odds: '1.25' },
          { label: 'X2', odds: (baseOdd * 0.6).toFixed(2) }
        ]
      },
      {
        id: 'm3',
        title: 'Toplam Gol Alt/Üst 2.5',
        category: 'Goller',
        selections: [
          { label: 'Üst', odds: '1.85' },
          { label: 'Alt', odds: '1.95' }
        ]
      },
      {
        id: 'm4',
        title: 'Karşılıklı Gol',
        category: 'Goller',
        selections: [
          { label: 'Evet', odds: '1.75' },
          { label: 'Hayır', odds: '2.05' }
        ]
      },
      {
        id: 'm5',
        title: '1. Yarı Sonucu',
        category: 'Yarılar',
        selections: [
          { label: '1', odds: (baseOdd * 1.2).toFixed(2) },
          { label: 'X', odds: '2.10' },
          { label: '2', odds: (baseOdd * 2).toFixed(2) }
        ]
      },
      {
        id: 'm6',
        title: 'Toplam Korner Alt/Üst 9.5',
        category: 'Kornerler',
        selections: [
          { label: 'Üst', odds: '1.90' },
          { label: 'Alt', odds: '1.80' }
        ]
      },
      {
        id: 'm7',
        title: 'İlk Korneri Kim Kullanır',
        category: 'Kornerler',
        selections: [
          { label: 'Ev Sahibi', odds: '1.65' },
          { label: 'Deplasman', odds: '2.15' }
        ]
      },
      {
        id: 'm8',
        title: 'Toplam Sarı Kart Alt/Üst 4.5',
        category: 'Kartlar',
        selections: [
          { label: 'Üst', odds: '2.20' },
          { label: 'Alt', odds: '1.60' }
        ]
      },
      {
        id: 'm9',
        title: 'Oyuncu Gol Atar (Öne Çıkan)',
        category: 'Oyuncu',
        selections: [
          { label: 'Forvet 1', odds: '2.40' },
          { label: 'Forvet 2', odds: '3.10' },
          { label: 'Orta Saha 1', odds: '4.50' }
        ]
      },
      {
        id: 'm10',
        title: 'Doğru Skor',
        category: 'Ana Bahisler',
        selections: [
          { label: '1-0', odds: '6.50' },
          { label: '2-0', odds: '8.00' },
          { label: '2-1', odds: '8.50' },
          { label: '0-0', odds: '9.00' },
          { label: '1-1', odds: '6.00' },
          { label: '0-1', odds: '7.50' }
        ]
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: {
          matchId: id,
          markets: markets,
          categories: ['Tümü', 'Ana Bahisler', 'Goller', 'Yarılar', 'Kornerler', 'Kartlar', 'Oyuncu']
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
