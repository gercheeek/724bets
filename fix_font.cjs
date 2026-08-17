const fs = require('fs');
let css = fs.readFileSync('index.css', 'utf8');

const fontImport = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');\n`;
if (!css.includes('fonts.googleapis.com/css2?family=Inter')) {
  css = fontImport + css;
}

const bodyRule = `
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

if (!css.includes("font-family: 'Inter'")) {
  css += bodyRule;
}

fs.writeFileSync('index.css', css);
console.log('Fixed font in index.css');
