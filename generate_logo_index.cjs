const fs = require('fs');
const path = require('path');

const logosDir = path.join(__dirname, 'public', 'assets', 'logos');
const outputFile = path.join(__dirname, 'public', 'assets', 'logo-index.json');

const files = fs.readdirSync(logosDir);
const validLogos = files
  .filter(f => f.endsWith('.png'))
  .map(f => f.replace('.png', ''));

fs.writeFileSync(outputFile, JSON.stringify(validLogos), 'utf8');
console.log(`Bitti! ${validLogos.length} logo logo-index.json içine kaydedildi.`);
