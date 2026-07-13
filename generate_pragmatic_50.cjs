const fs = require('fs');

const top50 = [
  { name: "Sweet Bonanza", symbol: "vs20sweetbonanza", img: "https://images.unsplash.com/photo-1579619226297-b247f52ee6c2?w=2160&q=100" }, // Candies
  { name: "Gates of Olympus", symbol: "vs20olympgate", img: "https://images.unsplash.com/photo-1590131464303-31fbf85cb355?w=2160&q=100" }, // Zeus/Greek
  { name: "Sugar Rush", symbol: "vs20sugarrush", img: "https://images.unsplash.com/photo-1534080391025-097b03b2af3f?w=2160&q=100" }, // Sweets
  { name: "Starlight Princess", symbol: "vs20starlight", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=2160&q=100" }, // Anime/Magic
  { name: "Big Bass Bonanza", symbol: "vs10bbbonanza", img: "https://images.unsplash.com/photo-1506527581177-33e3870bb80d?w=2160&q=100" }, // Fishing
  { name: "Big Bass Splash", symbol: "vs10txbigbass", img: "https://images.unsplash.com/photo-1544721477-742a03e1e92d?w=2160&q=100" }, // Fishing Splash
  { name: "The Dog House", symbol: "vs20doghouse", img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=2160&q=100" }, // Dogs
  { name: "The Dog House Megaways", symbol: "vswaysdogs", img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=2160&q=100" }, // Dogs
  { name: "Fruit Party", symbol: "vs20fruitparty", img: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=2160&q=100" }, // Fruits
  { name: "Madame Destiny Megaways", symbol: "vswaysmadame", img: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=2160&q=100" }, // Fortune Teller/Gypsy
  { name: "Gems Bonanza", symbol: "vs20goldfever", img: "https://images.unsplash.com/photo-1582181519504-207d57c74dbd?w=2160&q=100" }, // Gems/Aztec
  { name: "Wild West Gold", symbol: "vs40wildwest", img: "https://images.unsplash.com/photo-1522857468603-62547b7bb693?w=2160&q=100" }, // Wild West
  { name: "Buffalo King Megaways", symbol: "vswaysbufking", img: "https://images.unsplash.com/photo-1545653457-37d45e415fb5?w=2160&q=100" }, // Buffalo
  { name: "Cleocatra", symbol: "vs20cleocatra", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=2160&q=100" }, // Cats/Egypt
  { name: "Juicy Fruits", symbol: "vs50juicyfr", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=2160&q=100" }, // Juicy Fruits
  { name: "Wolf Gold", symbol: "vs25wolfgold", img: "https://images.unsplash.com/photo-1563456381270-b1d7d0a27329?w=2160&q=100" }, // Wolf
  { name: "Great Rhino Megaways", symbol: "vswaysrhino", img: "https://images.unsplash.com/photo-1536643198084-257a7993a4bc?w=2160&q=100" }, // Rhino
  { name: "John Hunter and the Tomb of the Scarab Queen", symbol: "vs25scarabqueen", img: "https://images.unsplash.com/photo-1539655823528-76c24388e630?w=2160&q=100" }, // Egypt/Explorer
  { name: "Mustang Gold", symbol: "vs25mustang", img: "https://images.unsplash.com/photo-1553198940-d9d59a7217dc?w=2160&q=100" }, // Horses
  { name: "Chilli Heat", symbol: "vs25chilli", img: "https://images.unsplash.com/photo-1588107936155-27a4d5386dd2?w=2160&q=100" }, // Chilli/Mexico
  { name: "Sweet Bonanza 1000", symbol: "vs20sb1000", img: "https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=2160&q=100" },
  { name: "Gates of Olympus 1000", symbol: "vs20olympgate", img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=2160&q=100" },
  { name: "Sugar Rush 1000", symbol: "vs20sugarrush", img: "https://images.unsplash.com/photo-1550060934-8c88f3424168?w=2160&q=100" },
  { name: "Starlight Princess 1000", symbol: "vs20starlight", img: "https://images.unsplash.com/photo-1531602161304-4c405904de22?w=2160&q=100" },
  { name: "Big Bass Amazon Xtreme", symbol: "vs10bbextreme", img: "https://images.unsplash.com/photo-1518020353457-3a131b712361?w=2160&q=100" },
  { name: "Bigger Bass Bonanza", symbol: "vs12bbonanza", img: "https://images.unsplash.com/photo-1506527581177-33e3870bb80d?w=2160&q=100" },
  { name: "Big Bass Keeping it Reel", symbol: "vs10bbkir", img: "https://images.unsplash.com/photo-1544721477-742a03e1e92d?w=2160&q=100" },
  { name: "Club Tropicana", symbol: "vs12tropicana", img: "https://images.unsplash.com/photo-1516766432025-a1c22fbab119?w=2160&q=100" },
  { name: "Wild Wild Riches", symbol: "vs576treasures", img: "https://images.unsplash.com/photo-1516086705705-cb6d56d11e5a?w=2160&q=100" },
  { name: "Release the Kraken", symbol: "vs20kraken", img: "https://images.unsplash.com/photo-1589115797316-2c525f2b8f88?w=2160&q=100" },
  { name: "Release the Kraken 2", symbol: "vs20kraken2", img: "https://images.unsplash.com/photo-1549480017-d774619d8544?w=2160&q=100" },
  { name: "Fruit Party 2", symbol: "vs20fparty2", img: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=2160&q=100" },
  { name: "5 Lions Megaways", symbol: "vswayslions", img: "https://images.unsplash.com/photo-1548671168-953a63319047?w=2160&q=100" },
  { name: "Rise of Giza PowerNudge", symbol: "vs10nudgeit", img: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=2160&q=100" },
  { name: "Chicken Drop", symbol: "vs20chickdrop", img: "https://images.unsplash.com/photo-1548550023-268e3ccdc5c5?w=2160&q=100" },
  { name: "The Hand of Midas", symbol: "vs20midas", img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=2160&q=100" },
  { name: "Floating Dragon", symbol: "vs10floatdrg", img: "https://images.unsplash.com/photo-1533662580796-0391d182283e?w=2160&q=100" },
  { name: "Power of Thor Megaways", symbol: "vswayshammthor", img: "https://images.unsplash.com/photo-1587841584323-b18868dfd6b1?w=2160&q=100" },
  { name: "Hot Fiesta", symbol: "vs25hotfiesta", img: "https://images.unsplash.com/photo-1588107936155-27a4d5386dd2?w=2160&q=100" },
  { name: "Extra Juicy", symbol: "vs10extjuicy", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=2160&q=100" },
  { name: "Peaky Blinders", symbol: "vs20peaky", img: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=2160&q=100" },
  { name: "Curse of the Werewolf Megaways", symbol: "vswayswerewolf", img: "https://images.unsplash.com/photo-1508216335198-5085d7b56dc6?w=2160&q=100" },
  { name: "Star Bounty", symbol: "vs50starbounty", img: "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=2160&q=100" },
  { name: "Voodoo Magic", symbol: "vs40voodoo", img: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?w=2160&q=100" },
  { name: "Congo Cash", symbol: "vs432congocash", img: "https://images.unsplash.com/photo-1536643198084-257a7993a4bc?w=2160&q=100" },
  { name: "Eye of the Storm", symbol: "vs10eyestorm", img: "https://images.unsplash.com/photo-1539655823528-76c24388e630?w=2160&q=100" },
  { name: "Fishin' Reels", symbol: "vs10fishinreels", img: "https://images.unsplash.com/photo-1506527581177-33e3870bb80d?w=2160&q=100" },
  { name: "Temujin Treasures", symbol: "vs1024temuj", img: "https://images.unsplash.com/photo-1522857468603-62547b7bb693?w=2160&q=100" },
  { name: "Joker King", symbol: "vs25jokerking", img: "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?w=2160&q=100" },
  { name: "Spartan King", symbol: "vs40spartanking", img: "https://images.unsplash.com/photo-1590131464303-31fbf85cb355?w=2160&q=100" }
];

let allGames = [];
let idCounter = 1;

// Pragmatic slots (TOP 50)
top50.forEach(g => {
  allGames.push({
    id: idCounter++,
    name: g.name,
    provider: "Pragmatic Play",
    category: "slots",
    image: g.img,
    demoSymbol: g.symbol,
    rtp: (95 + Math.random() * 3).toFixed(2) + "%",
    players: Math.floor(Math.random() * 15000) + 1000,
    isPopular: true,
    isNew: Math.random() > 0.8
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
console.log("data/games.ts created with " + allGames.length + " HIGH QUALITY 4K games.");
