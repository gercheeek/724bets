const fs = require('fs');

const xml = fs.readFileSync('/Users/alex/.gemini/antigravity/brain/ab361d36-852d-4858-a3ec-44771e5332a6/.system_generated/steps/1521/content.md', 'utf8');

const urlRegex = /<loc>(https:\/\/football-logos\.cc\/([^/]+)\/)<\/loc>/g;
const countries = new Set();
let match;
while ((match = urlRegex.exec(xml)) !== null) {
  // If the path doesn't contain another slash after the country name, it's a country page
  const path = match[2];
  if (path !== 'all' && path !== 'collections' && path !== 'license') {
     countries.add(match[1]);
  }
}

console.log(`Found ${countries.size} country pages.`);
fs.writeFileSync('scratch/country_pages.json', JSON.stringify(Array.from(countries), null, 2));
