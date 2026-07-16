const fs = require('fs');
const file = 'components/CasinoLobby.tsx';
let content = fs.readFileSync(file, 'utf8');

const games = [
  "100 Burning Hot|OBHSlot",
  "40 Burning Hot 6 Reels|FBHSRSlot",
  "100 Super Hot|OSHSlot",
  "Dazzling Hot|DHSlot",
  "20 Dazzling Hot|TDHSlot",
  "40 Shining Crown|FSHCSlot",
  "40 Dice & Roll|FDRSlot",
  "Flaming Hot Extreme|FHESlot",
  "Egypt Sky|ESSlot",
  "Majestic Forest|MFSlot",
  "Secrets of Alchemy|SOASlot",
  "Grace of Cleopatra|GOCSlot",
  "Olympus Glory|OGLSlot",
  "Kangaroo Land|KLSlot",
  "Coral Island|CISlot",
  "Action Money|AMSlot",
  "Aloha Party|APSlot",
  "Amazing Amazonia|AASlot",
  "Brave Cat|BCSlot",
  "Candy Palace|CPSlot",
  "Circus Brilliant|CBSlot",
  "Cocktail Rush|CRSlot",
  "Dice High|DHISlot",
  "Dorothy's Fairyland|DFSlot",
  "Dragon Reborn|DRESlot",
  "Emperor's Palace|EPSlot",
  "Extra Joker|EJSlot",
  "Fast Money|FMSlot",
  "Flaming Dice|FDSlot",
  "Forest Band|FBSlot",
  "Forest Tale|FTSlot",
  "Fortune Spells|FSPSlot",
  "Fruity Time|FTISlot",
  "Game of Luck|GOLSlot",
  "Genius of Leonardo|GOLOSlot",
  "Gladiator|GLSlot",
  "Great Adventure|GASlot",
  "Great Empire|GESlot",
  "Greek Fortune|GFSlot",
  "Halloween|HALSlot",
  "Hot Deco|HDSlot",
  "Ice Valley|IVSlot",
  "Imperial Wars|IWSlot",
  "Kashmir Gold|KGSlot",
  "Legend of Cleopatra|LOCSlot",
  "Like a Diamond|LADSlot",
  "Lucky Buzz|LBSlot",
  "Lucky Hot|LHSlot",
  "Lucky Wood|LWSlot",
  "Magellan|MAGSlot",
  "Magic 81 Lines|M81LSlot",
  "Majestic Sea|MSEASlot",
  "Mythical Treasure|MTSlot",
  "Ocean Rush|ORSlot",
  "Oil Company II|OC2Slot",
  "Olympus Tales|OTSlot",
  "Penguin Style|PSSlot",
  "Pin Up Queens|PUQSlot",
  "Queen of Rio|QORSlot",
  "Retro Cabaret|RCSlot",
  "Rich World|RWSlot",
  "Route of Mexico|ROMSlot",
  "Royal Gardens|RGSlot",
  "Savanna's Life|SLSlot",
  "Shining Dice|SDSlot",
  "Summer Bliss|SBSlot",
  "Super 20|S20Slot",
  "Sweet Cheese|SCSlot",
  "Thumbelina's Dream|TDSlot",
  "Venezia D'oro|VDOSlot",
  "Wonder Tree|WTSlot",
  "40 Mega Clover|FMCSlot",
  "20 Mega Slot|TMSlot",
  "Age of Troy|AOTSlot",
  "Book of Magic|BOMSlot",
  "Casino Mania|CMSlot",
  "Cats Royal|CRSlot",
  "Dark Queen|DQSlot",
  "Dragon Hot|DGHSlot",
  "Gold Dust|GDSlot",
  "Aztec Glory|AGSlot"
];

let idCounter = 200;
let newEntries = '';

games.forEach(g => {
  const [name, key] = g.split('|');
  const imgName = name.replace(/[^a-zA-Z0-9]/g, '');
  newEntries += `  { id: ${idCounter++}, name: '${name.replace(/'/g, "\\'")}', provider: 'EGT Digital', img: 'https://cdn.bahisbey1438.com/plat/prd/Img/Games/EGTDigital/${imgName}.webp', category: 'egt', rtp: '96.${Math.floor(Math.random()*90 + 10)}%', customDemoUrl: 'https://vegangsterslotra-gc-prod.fppcdn.courses/?gameKey=${key}&currencyCode=USD&language=en&closeUrl=https%3A%2F%2Flaunchgame2me.com%2Flobby%2Fexit%3Fredirect_url%3Dhttps%253A%252F%252Fslotra.com&mode=mobile&demo=true', containImg: true },\n`;
});

content = content.replace('];\n// End of Mock Data', newEntries + '];\n// End of Mock Data');

fs.writeFileSync(file, content, 'utf8');
console.log('Added ' + games.length + ' EGT games.');
