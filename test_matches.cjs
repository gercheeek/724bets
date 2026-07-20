const fs = require('fs');
const prelive = JSON.parse(fs.readFileSync('public/prelive_matches.json'));
console.log("Prelive matches:", prelive.length);
