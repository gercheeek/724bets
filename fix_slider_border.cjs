const fs = require('fs');

let sb = fs.readFileSync('components/SportsBanners.tsx', 'utf8');

sb = sb.replace(
  /border border-white\/5/g,
  ''
);

fs.writeFileSync('components/SportsBanners.tsx', sb);
console.log("Success");
