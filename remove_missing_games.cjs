const fs = require('fs');
const path = require('path');

const gamesTsPath = path.join(__dirname, 'data', 'games.ts');

async function main() {
  let content = fs.readFileSync(gamesTsPath, 'utf8');
  
  // Extract all games using a regex that captures the game block
  const blockRegex = /{\s*"id":\s*(\d+),\s*"name":\s*"([^"]+)"([^}]+)"image":\s*"([^"]+)"([^}]+)},?/g;
  
  const matches = [...content.matchAll(blockRegex)];
  
  let updatedContent = content;
  let removedCount = 0;
  
  for (const match of matches) {
    const fullMatch = match[0];
    const name = match[2];
    const currentImage = match[4];
    
    if (currentImage.includes('unsplash.com')) {
      console.log(`Removing ${name} because it lacks an original CDN image...`);
      updatedContent = updatedContent.replace(fullMatch, '');
      removedCount++;
    }
  }
  
  // Fix any trailing commas in the array if needed (though usually fine in TS if there's a trailing comma before ], but let's be safe)
  updatedContent = updatedContent.replace(/,\s*\]/, '\n]');
  
  fs.writeFileSync(gamesTsPath, updatedContent, 'utf8');
  console.log(`Finished updating games.ts. Removed ${removedCount} games.`);
}

main().catch(console.error);
