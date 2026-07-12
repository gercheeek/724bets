const fs = require('fs');

const pragmaticGames = [
  { name: "Sweet Bonanza", symbol: "vs20sweetbonanza" },
  { name: "Sweet Bonanza 1000", symbol: "vs20sb1000" },
  { name: "Gates of Olympus", symbol: "vs20olympgate" },
  { name: "Gates of Olympus 1000", symbol: "vs20olympgate" },
  { name: "Sugar Rush", symbol: "vs20sugarrush" },
  { name: "Sugar Rush 1000", symbol: "vs20sugarrush" },
  { name: "Starlight Princess", symbol: "vs20starlight" },
  { name: "Starlight Princess 1000", symbol: "vs20starlight" },
  { name: "Big Bass Bonanza", symbol: "vs10bbbonanza" },
  { name: "Big Bass Splash", symbol: "vs10txbigbass" },
  { name: "Big Bass Amazon Xtreme", symbol: "vs10bbextreme" },
  { name: "The Dog House", symbol: "vs20doghouse" },
  { name: "The Dog House Megaways", symbol: "vswaysdogs" },
  { name: "Fruit Party", symbol: "vs20fruitparty" },
  { name: "Madame Destiny Megaways", symbol: "vswaysmadame" },
  { name: "Gems Bonanza", symbol: "vs20goldfever" },
  { name: "Juicy Fruits", symbol: "vs50juicyfr" },
  { name: "Wild West Gold", symbol: "vs40wildwest" },
  { name: "Buffalo King Megaways", symbol: "vswaysbufking" },
  { name: "Cleocatra", symbol: "vs20cleocatra" }
];

const hacksawGames = [
  "Wanted Dead or a Wild", "Le Bandit", "RIP City", "Chaos Crew", 
  "Chaos Crew 2", "Gladiator Legends", "Hand of Anubis", 
  "Drop'em", "Stack'em", "Stick'em", "Outlaws Inc", "Densho", 
  "Dork Unit", "Bloodthirst", "Cubes 2", "Rotten", "Toshi Video Club",
  "Bowery Boys", "Double Rainbow", "Itero"
];

const nolimitGames = [
  "San Quentin xWays", "Mental", "Tombstone RIP", "Fire in the Hole xBomb", 
  "Deadwood", "Punk Rocker", "East Coast vs West Coast", "Das Boot",
  "El Paso Gunfight", "Infectious 5 xWays", "True Grit Redemption",
  "Misery Mining", "Remember Gulag", "Road Rage", "Serial",
  "Blood & Shadow", "Bounty Hunters", "Gluttony", "Disturbed", "DJ Psycho"
];

const pushGaming = [
  "Jammin' Jars", "Jammin' Jars 2", "Razor Shark", "Razor Returns", 
  "Fat Rabbit", "Fat Santa", "Mystery Museum", "Big Bamboo", 
  "Retro Tapes", "Giga Jar", "Boss Bear", "Fish 'n' Nudge",
  "10 Swords", "Dino P.D.", "Crystal Catcher", "Mad Cars",
  "Generous Jack", "Nightfall", "Bison Battle", "Fire Hopper"
];

const evolutionLive = [
  "Lightning Roulette", "Crazy Time", "Monopoly Live", "XXXtreme Lightning Roulette",
  "Immersive Roulette", "Mega Ball", "Dream Catcher", "Cash or Crash",
  "Crazy Coin Flip", "Gonzo's Treasure Hunt", "Lightning Blackjack",
  "Free Bet Blackjack", "Infinite Blackjack", "Power Blackjack",
  "Speed Baccarat", "Lightning Baccarat", "Golden Wealth Baccarat",
  "Super Sic Bo", "Bac Bo", "Dragon Tiger"
];

const originals = [
  "Crash", "Dice", "Plinko", "Mines", "Tower", "Keno", "Limbo", "Wheel",
  "HiLo", "Roulette", "Video Poker", "Baccarat", "Blackjack", "Slide", "Tome of Life"
];

let allGames = [];
let idCounter = 1;

// Pragmatic slots
pragmaticGames.forEach(g => {
  allGames.push({
    id: idCounter++,
    name: g.name,
    provider: "Pragmatic Play",
    category: "slots",
    image: `https://picsum.photos/seed/${idCounter}/500/500`,
    demoSymbol: g.symbol,
    rtp: (94 + Math.random() * 4).toFixed(2) + "%",
    players: Math.floor(Math.random() * 5000) + 100,
    isPopular: Math.random() > 0.5,
    isNew: Math.random() > 0.8
  });
});

// Hacksaw slots
hacksawGames.forEach(name => {
  allGames.push({
    id: idCounter++,
    name: name,
    provider: "Hacksaw Gaming",
    category: "slots",
    image: `https://picsum.photos/seed/${idCounter}/500/500`,
    demoSymbol: null,
    rtp: (94 + Math.random() * 4).toFixed(2) + "%",
    players: Math.floor(Math.random() * 4000) + 50,
    isPopular: Math.random() > 0.6,
    isNew: Math.random() > 0.7
  });
});

// Nolimit slots
nolimitGames.forEach(name => {
  allGames.push({
    id: idCounter++,
    name: name,
    provider: "Nolimit City",
    category: "slots",
    image: `https://picsum.photos/seed/${idCounter}/500/500`,
    demoSymbol: null,
    rtp: (94 + Math.random() * 4).toFixed(2) + "%",
    players: Math.floor(Math.random() * 3000) + 50,
    isPopular: Math.random() > 0.7,
    isNew: Math.random() > 0.8
  });
});

// Push Gaming slots
pushGaming.forEach(name => {
  allGames.push({
    id: idCounter++,
    name: name,
    provider: "Push Gaming",
    category: "slots",
    image: `https://picsum.photos/seed/${idCounter}/500/500`,
    demoSymbol: null,
    rtp: (94 + Math.random() * 4).toFixed(2) + "%",
    players: Math.floor(Math.random() * 3000) + 50,
    isPopular: Math.random() > 0.7,
    isNew: Math.random() > 0.8
  });
});

// Live Casino
evolutionLive.forEach(name => {
  allGames.push({
    id: idCounter++,
    name: name,
    provider: "Evolution",
    category: "live",
    image: `https://picsum.photos/seed/${idCounter}/500/500`,
    demoSymbol: null,
    rtp: (97 + Math.random() * 2).toFixed(2) + "%",
    players: Math.floor(Math.random() * 15000) + 1000,
    isPopular: true,
    isNew: false
  });
});

// Originals
originals.forEach(name => {
  allGames.push({
    id: idCounter++,
    name: name,
    provider: "724BETS",
    category: "originals",
    image: `https://picsum.photos/seed/${idCounter}/500/500`,
    demoSymbol: null,
    rtp: "99.00%",
    players: Math.floor(Math.random() * 8000) + 500,
    isPopular: true,
    isNew: false
  });
});

const tsContent = `export interface Game {
  id: string | number;
  name: string;
  provider: string;
  category: 'slots' | 'live' | 'table' | 'originals' | 'new';
  image: string;
  demoSymbol?: string | null;
  rtp?: string;
  players?: number;
  isPopular?: boolean;
  isNew?: boolean;
}

export const ALL_GAMES: Game[] = ${JSON.stringify(allGames, null, 2)};
`;

fs.writeFileSync('data/games.ts', tsContent);
console.log("data/games.ts created with " + allGames.length + " games.");
