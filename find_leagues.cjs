const puppeteer = require('puppeteer');

async function findLeagues() {
    console.log("Starting Puppeteer to find league URLs...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        const url = 'https://tarafbet982.com/tr/prelive/sport/soccer/';
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise(resolve => setTimeout(resolve, 5000)); // wait for DOM

        const leagues = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));
            return links.map(a => ({
                text: a.innerText.trim(),
                href: a.href
            })).filter(l => l.href.includes('/prelive/') && l.text.length > 0);
        });
        
        // Let's filter for popular ones or just print unique ones
        const unique = {};
        leagues.forEach(l => {
            if (!unique[l.text]) unique[l.text] = l.href;
        });

        console.log(JSON.stringify(unique, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
}

findLeagues();
