import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 900; // 15 minutes cache

export async function GET() {
  try {
    const parser = new Parser();

    const [cryptoResponse, rssFeed] = await Promise.all([
      // 1. Kripto verisi (Binance API)
      fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', {
        next: { revalidate: 900 }
      }).then(res => {
        if (!res.ok) throw new Error('Binance API response was not ok');
        return res.json();
      }).catch(err => {
        console.error('Binance API Error:', err);
        return null;
      }),

      // 2. Spor Haberleri (RSS)
      parser.parseURL('https://www.ntvspor.net/rss').catch(err => {
        console.error('RSS Parser Error:', err);
        return null;
      })
    ]);

    let cryptoData = null;
    if (cryptoResponse && cryptoResponse.lastPrice && cryptoResponse.priceChangePercent) {
      cryptoData = {
        lastPrice: parseFloat(cryptoResponse.lastPrice).toFixed(2),
        priceChangePercent: parseFloat(cryptoResponse.priceChangePercent).toFixed(2),
      };
    }

    let newsData: any[] = [];
    if (rssFeed && rssFeed.items) {
      newsData = rssFeed.items.slice(0, 5).map(item => ({
        title: item.title,
        link: item.link
      }));
    }

    return NextResponse.json({
      crypto: cryptoData,
      news: newsData
    });

  } catch (error) {
    // Tüm sistemi koruyan Fallback bloğu
    console.error('Live Trends API Critical Error:', error);
    return NextResponse.json({
      crypto: null,
      news: []
    });
  }
}
