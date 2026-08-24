const puppeteer = require('puppeteer');
const fs = require('fs');
const urls = [
"https://backoffice.aggregator.databetrix.com/documents/aggregator_get_games",
"https://backoffice.aggregator.databetrix.com/documents/aggregator_get_providers",
"https://backoffice.aggregator.databetrix.com/documents/aggregator_launch_game",
"https://backoffice.aggregator.databetrix.com/documents/operator_callback_format",
"https://backoffice.aggregator.databetrix.com/documents/operator_get_balance",
"https://backoffice.aggregator.databetrix.com/documents/operator_bet",
"https://backoffice.aggregator.databetrix.com/documents/operator_win",
"https://backoffice.aggregator.databetrix.com/documents/operator_rollback"
];

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    let allContent = '';
    
    for (const url of urls) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2' });
            // wait a little bit to ensure render
            await new Promise(r => setTimeout(r, 500));
            const content = await page.evaluate(() => {
                // Get the main content area (assuming it's not the sidebar)
                const main = document.querySelector('main') || document.body;
                return `\n\n# URL: ${window.location.href}\n\n${main.innerText}`;
            });
            allContent += content;
            console.log(`Fetched ${url}`);
        } catch (e) {
            console.error(`Error on ${url}:`, e.message);
        }
    }
    
    fs.writeFileSync('/Users/alex/.gemini/antigravity/brain/6ee62431-858f-47d4-9ee5-a252058b1b7b/scratch/databetrix_docs.md', allContent);
    console.log('Saved to scratch/databetrix_docs.md');
    await browser.close();
})();
