const fs = require('fs');
const prelive = JSON.parse(fs.readFileSync('public/prelive_matches.json'));
let homeOdd = '-';
let isLive = false;
console.log("Prelive matches count:", prelive.length);
