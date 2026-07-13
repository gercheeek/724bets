export interface Game {
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

export const ALL_GAMES: Game[] = [
  {
    "id": 1,
    "name": "Sweet Bonanza",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/SweetBonanza.png",
    "demoSymbol": "vs20sweetbonanza",
    "rtp": "96.15%",
    "players": 13781,
    "isPopular": true,
    "isNew": false
  },
  
  {
    "id": 3,
    "name": "Sugar Rush",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/SugarRush.png",
    "demoSymbol": "vs20sugarrush",
    "rtp": "96.19%",
    "players": 15295,
    "isPopular": true,
    "isNew": true
  },
  {
    "id": 4,
    "name": "Starlight Princess",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/StarlightPrincess.png",
    "demoSymbol": "vs20starlight",
    "rtp": "95.07%",
    "players": 5662,
    "isPopular": true,
    "isNew": true
  },
  {
    "id": 5,
    "name": "Big Bass Bonanza",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/BigBassBonanza.png",
    "demoSymbol": "vs10bbbonanza",
    "rtp": "95.49%",
    "players": 15925,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 6,
    "name": "Big Bass Splash",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/BigBassSplash.png",
    "demoSymbol": "vs10txbigbass",
    "rtp": "96.37%",
    "players": 14547,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 7,
    "name": "The Dog House",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/TheDogHouse.png",
    "demoSymbol": "vs20doghouse",
    "rtp": "96.88%",
    "players": 5963,
    "isPopular": true,
    "isNew": false
  },
  
  
  
  
  {
    "id": 12,
    "name": "Wild West Gold",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/WildWestGold.png",
    "demoSymbol": "vs40wildwest",
    "rtp": "95.06%",
    "players": 15067,
    "isPopular": true,
    "isNew": false
  },
  
  {
    "id": 14,
    "name": "Cleocatra",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/Cleocatra.png",
    "demoSymbol": "vs20cleocatra",
    "rtp": "97.21%",
    "players": 6600,
    "isPopular": true,
    "isNew": true
  },
  {
    "id": 15,
    "name": "Juicy Fruits",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/JuicyFruits.png",
    "demoSymbol": "vs50juicyfr",
    "rtp": "96.89%",
    "players": 6903,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 16,
    "name": "Wolf Gold",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/WolfGold.png",
    "demoSymbol": "vs25wolfgold",
    "rtp": "96.49%",
    "players": 13709,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 17,
    "name": "Great Rhino Megaways",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/GreatRhinoMegaways.png",
    "demoSymbol": "vswaysrhino",
    "rtp": "95.43%",
    "players": 11735,
    "isPopular": true,
    "isNew": false
  },
  
  {
    "id": 19,
    "name": "Mustang Gold",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/MustangGold.png",
    "demoSymbol": "vs25mustang",
    "rtp": "95.99%",
    "players": 2513,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 20,
    "name": "Chilli Heat",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/ChilliHeat.png",
    "demoSymbol": "vs25chilli",
    "rtp": "95.35%",
    "players": 6713,
    "isPopular": true,
    "isNew": true
  },
  {
    "id": 21,
    "name": "Sweet Bonanza 1000",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/SweetBonanza1000.png",
    "demoSymbol": "vs20sb1000",
    "rtp": "95.68%",
    "players": 6011,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 22,
    "name": "Gates of Olympus 1000",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/GatesofOlympus1000.png",
    "demoSymbol": "vs20olympgate",
    "rtp": "95.66%",
    "players": 6056,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 23,
    "name": "Sugar Rush 1000",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/SugarRush1000.png",
    "demoSymbol": "vs20sugarrush",
    "rtp": "96.63%",
    "players": 6938,
    "isPopular": true,
    "isNew": true
  },
  {
    "id": 24,
    "name": "Starlight Princess 1000",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/StarlightPrincess1000.png",
    "demoSymbol": "vs20starlight",
    "rtp": "97.64%",
    "players": 6613,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 25,
    "name": "Big Bass Amazon Xtreme",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/BigBassAmazonXtreme.png",
    "demoSymbol": "vs10bbextreme",
    "rtp": "97.00%",
    "players": 9501,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 26,
    "name": "Bigger Bass Bonanza",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/BiggerBassBonanza.png",
    "demoSymbol": "vs12bbonanza",
    "rtp": "95.71%",
    "players": 8152,
    "isPopular": true,
    "isNew": false
  },
  
  {
    "id": 28,
    "name": "Club Tropicana",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/ClubTropicana.png",
    "demoSymbol": "vs12tropicana",
    "rtp": "96.65%",
    "players": 1939,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 29,
    "name": "Wild Wild Riches",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/WildWildRiches.png",
    "demoSymbol": "vs576treasures",
    "rtp": "97.60%",
    "players": 15089,
    "isPopular": true,
    "isNew": false
  },
  
  
  {
    "id": 32,
    "name": "Fruit Party 2",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/FruitParty2.png",
    "demoSymbol": "vs20fparty2",
    "rtp": "96.25%",
    "players": 12468,
    "isPopular": true,
    "isNew": false
  },
  
  
  {
    "id": 35,
    "name": "Chicken Drop",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/ChickenDrop.png",
    "demoSymbol": "vs20chickdrop",
    "rtp": "96.48%",
    "players": 2447,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 36,
    "name": "The Hand of Midas",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/TheHandOfMidas.png",
    "demoSymbol": "vs20midas",
    "rtp": "97.22%",
    "players": 2850,
    "isPopular": true,
    "isNew": true
  },
  
  {
    "id": 38,
    "name": "Power of Thor Megaways",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/PowerofThorMegaways.png",
    "demoSymbol": "vswayshammthor",
    "rtp": "95.52%",
    "players": 8087,
    "isPopular": true,
    "isNew": true
  },
  
  {
    "id": 40,
    "name": "Extra Juicy",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/ExtraJuicy.png",
    "demoSymbol": "vs10extjuicy",
    "rtp": "97.93%",
    "players": 11645,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 41,
    "name": "Peaky Blinders",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/PeakyBlinders.png",
    "demoSymbol": "vs20peaky",
    "rtp": "95.70%",
    "players": 11769,
    "isPopular": true,
    "isNew": false
  },
  
  {
    "id": 43,
    "name": "Star Bounty",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/StarBounty.png",
    "demoSymbol": "vs50starbounty",
    "rtp": "97.05%",
    "players": 9454,
    "isPopular": true,
    "isNew": true
  },
  {
    "id": 44,
    "name": "Voodoo Magic",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/VoodooMagic.png",
    "demoSymbol": "vs40voodoo",
    "rtp": "95.81%",
    "players": 1326,
    "isPopular": true,
    "isNew": false
  },
  
  
  {
    "id": 47,
    "name": "Fishin' Reels",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/FishinReels.png",
    "demoSymbol": "vs10fishinreels",
    "rtp": "97.32%",
    "players": 4276,
    "isPopular": true,
    "isNew": false
  },
  {
    "id": 48,
    "name": "Temujin Treasures",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/TemujinTreasures.png",
    "demoSymbol": "vs1024temuj",
    "rtp": "97.07%",
    "players": 4344,
    "isPopular": true,
    "isNew": false
  },
  
  {
    "id": 50,
    "name": "Spartan King",
    "provider": "Pragmatic Play",
    "category": "slots",
    "image": "https://cdn2.softswiss.net/i/s3/pragmaticexternal/SpartanKing.png",
    "demoSymbol": "vs40spartanking",
    "rtp": "97.02%",
    "players": 1097,
    "isPopular": true,
    "isNew": false
  }
];
