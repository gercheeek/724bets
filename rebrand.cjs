const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  content = content.replace(/Bahisbey/g, '724bets');
  content = content.replace(/BAHİSBEY/g, '724BETS');
  content = content.replace(/BAHISBEY/g, '724BETS');
  content = content.replace(/bahisbey\.com/g, '724bets.com');
  content = content.replace(/id: 'bahisbey'/g, "id: '724bets'");
  content = content.replace(/id: "bahisbey"/g, 'id: "724bets"');
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Rebranded: ' + filePath);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    try {
      let stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== 'dist' && file !== '.git' && file !== 'bot_profile') {
          walkDir(fullPath);
        }
      } else {
        if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.html')) {
          replaceInFile(fullPath);
        }
      }
    } catch(e) {}
  });
}

walkDir('.');
