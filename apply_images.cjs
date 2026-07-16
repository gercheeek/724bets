const fs = require('fs');
const file = 'components/CasinoLobby.tsx';
let content = fs.readFileSync(file, 'utf8');

const hashPool = [
  "69b3a92380f01cf4dddc7eed", "68d7e8844955d051294f1569", "6983438a9ed28916ad210658",
  "68ddaf97e037f36376e74121", "69493065dcf61d4bac414608", "68d7e92f4955d051294f1571",
  "6a55240deeda3ed51d7aca39", "6968c7f10688c3f239ebe829", "68d8668c1a6e8f6e1da85eba",
  "68d7e8ece037f36376e39345", "68ddafa9e037f36376e74122", "694916f1e19e953297a1122e",
  "6a42640a84773277a44f8a73", "698342be9ed28916ad210656", "698343259ed28916ad210657",
  "68d7e85f4955d051294f1567", "68d86f72dad88070959d226d", "6949b196dcf61d4bac430f3a",
  "68d7e7a2e037f36376e39338", "68d864ecdad88070959d2249", "6949bcdae19e953297a21d36",
  "6a1c8d56d79c19c5568f380c", "6949b8eedcf61d4bac430fdb", "68ddaf414955d05129541b8b",
  "68d7e8a74955d051294f156b", "69e53713cb196754219c2431", "6a42646e2a354edf8dd2cfc7",
  "68ddaf7de037f36376e74120", "6a42641eeb7a323414b2a97d", "68cdbd74bfb6f26555f52e36",
  "68d7e7344955d051294f1559", "68d7e8b5e037f36376e39342", "69493423dcf61d4bac414647",
  "6991bbf9a28de9631a0ebb85", "6a55241e0a5a05bed8d41da8", "69497a8fe19e953297a21b01",
  "68d866d0dad88070959d2251", "68ddaf644955d05129541b8c", "69492325e19e953297a11333",
  "694936d7e19e953297a113e8", "694933d3dcf61d4bac414646", "6949675bdcf61d4bac424a54",
  "68d7e996e037f36376e3934d", "69492811dcf61d4bac4145d4", "6949b4b6dcf61d4bac430f69",
  "6949b658dcf61d4bac430f8a", "69495fc0e19e953297a1156f", "68d7e850e037f36376e3933c",
  "68d864401a6e8f6e1da85ea9", "6949b7fde19e953297a21cd4", "694934cbe19e953297a113d5",
  "68d7e86f4955d051294f1568", "6949aff8e19e953297a21b8e", "68d864cedad88070959d2247",
  "68d7e9514955d051294f1573", "68d864131a6e8f6e1da85ea7", "69539ac30d4a2223c3b45090",
  "68d86e5edad88070959d2265"
];

// Explicit mapping for top games
const specificMap = {
  "Flaming Hot Extreme BL": "69b3a92380f01cf4dddc7eed",
  "Shining Crown": "68d7e8844955d051294f1569",
  "Burning Hot": "6983438a9ed28916ad210658",
  "40 Super Hot": "68ddaf97e037f36376e74121",
  "Zodiac Wheel": "69493065dcf61d4bac414608",
  "20 Super Hot": "68d7e92f4955d051294f1571",
  "100 Super Hot BL": "6a55240deeda3ed51d7aca39",
  "Ultimate Hot": "6968c7f10688c3f239ebe829",
  "Extra Stars": "68d8668c1a6e8f6e1da85eba",
  "40 Burning Hot": "68d7e8ece037f36376e39345",
  "Dice & Roll": "68ddafa9e037f36376e74122",
  "Vampire Night": "694916f1e19e953297a1122e",
  "20 Burning Hot": "6a42640a84773277a44f8a73",
  "5 Dazzling Hot": "698342be9ed28916ad210656",
  "100 Burning Hot": "698343259ed28916ad210657",
  "40 Burning Hot 6 Reels": "68d7e85f4955d051294f1567",
  "20 Dazzling Hot": "68d86f72dad88070959d226d",
  "Dazzling Hot": "6949b196dcf61d4bac430f3a",
  "40 Shining Crown": "68d7e7a2e037f36376e39338",
  "40 Dice & Roll": "68d864ecdad88070959d2249",
  "Egypt Sky": "6949bcdae19e953297a21d36",
  "Flaming Hot": "69b3a92380f01cf4dddc7eed", 
  "Supreme Hot": "68cdbd74bfb6f26555f52e36",
};

let usedHashes = new Set(Object.values(specificMap));
let remainingHashes = hashPool.filter(h => !usedHashes.has(h));
let hashIndex = 0;

// Replace lines in CasinoLobby.tsx
const regex = /({ id: \d+, name: '([^']+)', provider: 'EGT Digital', img: ')([^']+)('.*?})/g;
let newContent = content.replace(regex, (match, p1, gameName, oldImgUrl, p4) => {
  let hash = specificMap[gameName];
  if (!hash) {
    if (hashIndex < remainingHashes.length) {
      hash = remainingHashes[hashIndex++];
    } else {
      // Loop over hashPool if we run out
      hash = hashPool[Math.floor(Math.random() * hashPool.length)];
    }
  }
  const newImgUrl = `https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/${hash}`;
  return `${p1}${newImgUrl}${p4}`;
});

fs.writeFileSync(file, newContent, 'utf8');
console.log('Images updated with original hashes.');
