export interface LiveWin {
  id: string;
  gameName: string;
  provider: string;
  image: string;
  username: string;
  amount: number;
  isOriginal: boolean;
}

const ORIGINAL_GAMES = [
  { name: 'DICE', image: '/images/dice_premium.jpg', isOriginal: true },
  { name: 'LIMBO', image: '/images/limbo_premium.jpg', isOriginal: true },
  { name: 'KENO', image: '/images/keno_premium.jpg', isOriginal: true },
  { name: 'MINES', image: '/images/mines_premium.jpg', isOriginal: true },
  { name: 'PLINKO', image: '/images/plinko_premium.jpg', isOriginal: true },
  { name: 'CRASH', image: '/images/crash_premium.jpg', isOriginal: true },
  { name: 'ROULETTE', image: '/images/roulette_premium.jpg', isOriginal: true },
  { name: 'BLACKJACK', image: '/images/blackjack_premium.jpg', isOriginal: true },
];

const SLOT_GAMES = [
  { name: 'GATES OF OLYMPUS', provider: 'PRAGMATIC PLAY', image: 'https://cdn.softswiss.net/i/s3/pragmaticexternal/GatesofOlympus.png', isOriginal: false },
  { name: 'SWEET BONANZA', provider: 'PRAGMATIC PLAY', image: 'https://cdn.softswiss.net/i/s3/pragmaticexternal/SweetBonanza.png', isOriginal: false },
  { name: 'BOOK OF TIME', provider: 'HACKSAW', image: 'https://cdn.softswiss.net/i/s3/hacksaw/book_of_time.png', isOriginal: false },
  { name: 'SUGAR RUSH', provider: 'PRAGMATIC PLAY', image: 'https://cdn.softswiss.net/i/s3/pragmaticexternal/SugarRush.png', isOriginal: false },
  { name: 'STARLIGHT PRINCESS', provider: 'PRAGMATIC PLAY', image: 'https://cdn.softswiss.net/i/s3/pragmaticexternal/StarlightPrincess.png', isOriginal: false },
  { name: 'THE DOG HOUSE', provider: 'PRAGMATIC PLAY', image: 'https://cdn.softswiss.net/i/s3/pragmaticexternal/TheDogHouse.png', isOriginal: false },
];

const NAME_PREFIXES = ['Al', 'Tess', 'Jeer', 'GYKa', 'Sach', 'Snar', 'Pcmb', 'Mxgu', 'rfbo', 'Gizli', 'Can', 'Mert', 'Kral', 'Ahmet', 'Mehmet', 'Eda', 'Aylin', 'Bet', 'Win'];
const NAME_SUFFIXES = ['99', '12', 'x', 'y', 'z', '88', '77', 'K', 'Pro'];

const generateUsername = () => {
    const type = Math.random();
    if (type < 0.2) return 'Gizli';
    if (type < 0.5) return `Üye: ${Math.floor(Math.random() * 90000) + 10000}`;
    
    const p1 = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)];
    if (type < 0.75) return `${p1}...`;
    
    const p2 = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)];
    return `${p1}${p2}`;
};

const generateAmount = (isOriginal: boolean) => {
    // Originals usually have smaller but frequent wins
    if (isOriginal) {
        return Number((Math.random() * 400 + 10).toFixed(2)); // 10 to 410
    } else {
        return Number((Math.random() * 4500 + 50).toFixed(2)); // 50 to 4550
    }
};

export const generateLiveWins = (count = 250): LiveWin[] => {
    const wins: LiveWin[] = [];
    for (let i = 0; i < count; i++) {
        const isOriginal = Math.random() < 0.6; // 60% chance for original games
        const game = isOriginal 
            ? ORIGINAL_GAMES[Math.floor(Math.random() * ORIGINAL_GAMES.length)] 
            : SLOT_GAMES[Math.floor(Math.random() * SLOT_GAMES.length)];
        
        wins.push({
            id: `win-${i}-${Date.now()}`,
            gameName: game.name,
            provider: game.isOriginal ? '724games' : game.provider!,
            image: game.image,
            username: generateUsername(),
            amount: generateAmount(game.isOriginal),
            isOriginal: game.isOriginal
        });
    }
    return wins;
};
