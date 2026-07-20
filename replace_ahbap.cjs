const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(path.join(dir, f));
        }
    });
}

let count = 0;
const dirsToWalk = ['./components', './src', '.'];
const seen = new Set();

dirsToWalk.forEach(dir => {
    walkDir(dir, function(filePath) {
        if (seen.has(filePath)) return;
        seen.add(filePath);
        
        if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('dist') || filePath.includes('package-lock.json') || filePath.includes('replace_ahbap.cjs')) return;
        
        if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.json') || filePath.endsWith('.html')) {
            let content = fs.readFileSync(filePath, 'utf8');
            // special check so we don't accidentally replace the Ahbapbet text in the LanguageTransition "ahbap" if we already did... wait, we didn't touch it.
            if (content.match(/ahbapbet/i)) {
                // Also replacing any 'ahbap' + 'bet' things we missed if it's explicitly 'ahbapbet'
                let newContent = content.replace(/ahbapbet/g, '724bets')
                                        .replace(/Ahbapbet/g, '724Bets')
                                        .replace(/AHBAPBET/g, '724BETS');
                fs.writeFileSync(filePath, newContent, 'utf8');
                count++;
                console.log("Updated:", filePath);
            }
        }
    });
});
console.log(`Replaced in ${count} files.`);
