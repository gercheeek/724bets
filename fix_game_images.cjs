const fs = require('fs');
const https = require('https');
const path = require('path');

const gamesTsPath = path.join(__dirname, 'data', 'games.ts');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200);
      res.resume(); // consume response data to free up memory
    }).on('error', () => {
      resolve(false);
    });
  });
}

function generateVariations(name) {
  const clean = name.replace(/[^a-zA-Z0-9]/g, '');
  const cleanWithSpaces = name.replace(/[^a-zA-Z0-9\s]/g, '');
  const words = cleanWithSpaces.split(/\s+/);
  
  const pascal = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  const camel = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  const lower = clean.toLowerCase();
  
  // Specific tweaks for Gates of Olympus
  const variations = [
    pascal, // GatesOfOlympus
    pascal.replace('Of', 'of'), // GatesofOlympus
    lower, // gatesofolympus
    camel // gatesOfOlympus
  ];
  
  return [...new Set(variations)];
}

async function findWorkingImageUrl(gameName) {
  const variations = generateVariations(gameName);
  const baseUrls = [
    'https://cdn2.softswiss.net/i/s3/pragmaticexternal',
    'https://cdn.softswiss.net/i/s3/pragmaticexternal'
  ];

  for (const base of baseUrls) {
    for (const v of variations) {
      const url = `${base}/${v}.png`;
      const isWorking = await checkUrl(url);
      if (isWorking) {
        return url;
      }
    }
  }
  
  // Try finding pragmatic play game image by searching some common repos if we wanted, 
  // but for now return null if not found
  return null;
}

async function main() {
  let content = fs.readFileSync(gamesTsPath, 'utf8');
  
  // Extract all games using a regex that captures the game block
  const blockRegex = /{\s*"id":\s*(\d+),\s*"name":\s*"([^"]+)"([^}]+)"image":\s*"([^"]+)"([^}]+)}/g;
  
  const matches = [...content.matchAll(blockRegex)];
  console.log(`Found ${matches.length} games to process.`);
  
  let updatedContent = content;
  
  for (const match of matches) {
    const fullMatch = match[0];
    const name = match[2];
    const currentImage = match[4];
    
    if (currentImage.includes('unsplash.com')) {
      process.stdout.write(`Checking ${name}... `);
      const newUrl = await findWorkingImageUrl(name);
      if (newUrl) {
        console.log(`FOUND: ${newUrl}`);
        const newBlock = fullMatch.replace(`"image": "${currentImage}"`, `"image": "${newUrl}"`);
        updatedContent = updatedContent.replace(fullMatch, newBlock);
      } else {
        console.log(`NOT FOUND`);
        // Fallback for not found? We can use a generic placeholder or keep unsplash
      }
    }
  }
  
  fs.writeFileSync(gamesTsPath, updatedContent, 'utf8');
  console.log('Finished updating games.ts');
}

main().catch(console.error);
