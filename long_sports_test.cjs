const puppeteer = require('puppeteer');

(async () => {
    console.log("🚀 Spor Bölümü Uzun Performans Testi Başlatılıyor...");
    const browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    
    const page = await browser.newPage();
    let errorCount = 0;
    let consoleWarnings = 0;
    const errors = [];
    
    // Performans metriklerini toplamak için
    const metrics = {
        JSHeapUsedSize: [],
        Nodes: [],
        JSEventListeners: []
    };

    // Hataları dinle
    page.on('pageerror', error => {
        errorCount++;
        if (!errors.includes(error.message)) {
            errors.push(error.message);
        }
        console.log('❌ BROWSER_ERROR:', error.message);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            errorCount++;
            console.log('❌ CONSOLE_ERROR:', msg.text());
            if (!errors.includes(msg.text())) errors.push(msg.text());
        } else if (msg.type() === 'warning') {
            consoleWarnings++;
        }
    });

    console.log("🌐 http://localhost:3002/ adresine gidiliyor...");
    await page.goto('http://localhost:3002/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log("🖱️ SPOR sekmesine tıklanıyor...");
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button, a, div'));
        const sporBtn = btns.find(b => b.innerText && b.innerText.toUpperCase().includes('SPOR'));
        if (sporBtn) sporBtn.click();
    });

    console.log("⏱️ Spor bölümünde performans metrikleri toplanıyor (30 saniye)...");
    
    for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 2000));
        
        try {
            const client = await page.target().createCDPSession();
            await client.send('Performance.enable');
            const perfMetrics = await client.send('Performance.getMetrics');
            
            const jsHeapUsedSize = perfMetrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
            const nodes = perfMetrics.metrics.find(m => m.name === 'Nodes')?.value || 0;
            const listeners = perfMetrics.metrics.find(m => m.name === 'JSEventListeners')?.value || 0;
            
            metrics.JSHeapUsedSize.push(jsHeapUsedSize / (1024 * 1024)); // MB
            metrics.Nodes.push(nodes);
            metrics.JSEventListeners.push(listeners);

            console.log(`[T+${(i+1)*2}s] Bellek: ${(jsHeapUsedSize / (1024 * 1024)).toFixed(2)} MB | DOM Düğümü: ${nodes} | Dinleyiciler: ${listeners}`);
            
            // Rastgele scroll yapalım ki re-render olsun
            await page.evaluate(() => {
                window.scrollBy(0, 500);
            });
        } catch (e) {
            console.log("Metrik okuma hatası:", e.message);
        }
    }
    
    console.log("\n📊 --- TEST SONUÇLARI --- 📊");
    console.log(`Toplam Hata: ${errorCount}`);
    console.log(`Toplam Uyarı: ${consoleWarnings}`);
    console.log("Benzersiz Hatalar:");
    errors.forEach((e, idx) => console.log(`  ${idx + 1}. ${e.substring(0, 200)}`));
    
    const maxHeap = Math.max(...metrics.JSHeapUsedSize).toFixed(2);
    const minHeap = Math.min(...metrics.JSHeapUsedSize).toFixed(2);
    const maxNodes = Math.max(...metrics.Nodes);
    const minNodes = Math.min(...metrics.Nodes);
    
    console.log(`\nBellek Kullanımı: ${minHeap} MB -> ${maxHeap} MB (Fark: ${(maxHeap - minHeap).toFixed(2)} MB)`);
    console.log(`DOM Düğümleri: ${minNodes} -> ${maxNodes} (Fark: ${maxNodes - minNodes})`);
    
    if (maxHeap - minHeap > 50) {
        console.log("⚠️ UYARI: Ciddi bellek kaçağı (Memory Leak) şüphesi! Bellek kullanımı test süresince çok arttı.");
    }
    if (maxNodes - minNodes > 5000) {
        console.log("⚠️ UYARI: Ciddi DOM şişmesi şüphesi! DOM düğümleri sürekli artıyor.");
    }

    await browser.close();
    console.log("✅ Test Tamamlandı.");
})();
