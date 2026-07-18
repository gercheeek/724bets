const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'components'),
  __dirname
];

const replacements = [
  { regex: /#3b82f6/gi, replace: '#10b981' },
  { regex: /#60a5fa/gi, replace: '#34d399' },
  { regex: /bg-blue-500/g, replace: 'bg-[#10b981]' },
  { regex: /text-blue-500/g, replace: 'text-[#10b981]' },
  { regex: /border-blue-500/g, replace: 'border-[#10b981]' },
  { regex: /blue-500/g, replace: '#10b981' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  if (dir === __dirname) {
    // Only process specific files in root to avoid touching everything unnecessarily
    const rootFiles = ['App.tsx', 'index.css'];
    for (const file of rootFiles) {
      const fullPath = path.join(__dirname, file);
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        for (const { regex, replace } of replacements) {
          if (regex.test(content)) {
            content = content.replace(regex, replace);
            modified = true;
          }
        }
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  } else {
    processDirectory(dir);
  }
}
