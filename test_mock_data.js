const match = {
  sport: 'Basketbol',
  minute: '12',
  homeOdd: '1.8',
  awayOdd: '2.1',
  marketsCount: 15
};

const homeStats = {};
const isFootball = match.sport?.toLowerCase().includes('futbol') || match.sport?.toLowerCase().includes('soccer');
const isBasketball = match.sport?.toLowerCase().includes('basketbol') || match.sport?.toLowerCase().includes('basketball');
const isTennis = match.sport?.toLowerCase().includes('tenis') || match.sport?.toLowerCase().includes('tennis');

console.log('isBasketball:', isBasketball);

const min = parseInt(match.minute) || 45;
const homeAdv = parseFloat(match.homeOdd) < parseFloat(match.awayOdd) ? 1.2 : 0.8;

let finalHomeStats, finalAwayStats;
if (isBasketball) {
  finalHomeStats = {
    '2P': Math.floor(min * 2 * homeAdv),
    '3P': Math.floor(min / 2 * homeAdv),
    Fouls: Math.floor(min / 5),
    FreeThrows: Math.floor(min / 3 * homeAdv)
  };
}
console.log('Stats:', finalHomeStats);
