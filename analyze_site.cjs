const puppeteer = require('puppeteer');

(async () => {
  console.log('Tarayıcı başlatılıyor...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  // Fake user agent to bypass some bot protections
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const wsUrls = new Set();
  
  // Intercept network requests to find WebSockets
  page.on('request', request => {
    if (request.url().startsWith('ws://') || request.url().startsWith('wss://')) {
      wsUrls.add(request.url());
    }
  });

  try {
    console.log('Yankibet105.com adresine gidiliyor...');
    await page.goto('https://yankibet105.com', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('Sayfa yüklendi.');
    
    // Extract some basic info
    const title = await page.title();
    console.log('Site Başlığı:', title);
    
    // Look for common iGaming framework traces
    const framework = await page.evaluate(() => {
      if (window.React) return 'React (Global)';
      if (document.querySelector('[data-reactroot], [data-reactid]')) return 'React';
      if (window.__NUXT__) return 'Vue/Nuxt';
      if (window.angular) return 'Angular';
      const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src).join(' ');
      if (scripts.includes('react')) return 'React (Scripts)';
      if (scripts.includes('vue')) return 'Vue (Scripts)';
      return 'Bilinmiyor';
    });
    console.log('Kullanılan Frontend Çerçevesi (Tahmini):', framework);
    
  } catch (err) {
    console.log('Sayfa yüklenirken hata oluştu (muhtemelen Cloudflare veya Timeout):', err.message);
  }

  console.log('\n--- TESPİT EDİLEN WEBSOCKET (CANLI VERİ) ADRESLERİ ---');
  if (wsUrls.size > 0) {
    wsUrls.forEach(url => console.log('- ' + url));
  } else {
    console.log('Hiç WebSocket bağlantısı tespit edilemedi.');
  }

  await browser.close();
})();
