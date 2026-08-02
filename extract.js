const fs = require('fs');
const content = fs.readFileSync('components/CasinoLobby.tsx', 'utf8');

const startIndex = content.indexOf('export const DEMO_GAMES = [');
const endIndex = content.indexOf('];', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
    const demoGamesContent = content.substring(startIndex, endIndex).replace('export const DEMO_GAMES = [', 'export const ALL_GAMES: Game[] = [');
    
    // Write to games.ts
    const gamesContent = `import { Game } from '../types';\n\n${demoGamesContent}\n\nexport const DEMO_GAMES: Game[] = [];\nexport const CATEGORIES = [\n  { id: 'popular', name: 'Popüler', icon: '🔥' },\n  { id: 'slots', name: 'Slotlar', icon: '🎰' },\n  { id: 'live', name: 'Canlı Casino', icon: '🎲' },\n  { id: 'new', name: 'Yeni', icon: '✨' },\n];\n`;
    fs.writeFileSync('data/games.ts', gamesContent);
    
    // Remove from CasinoLobby.tsx
    const newCasinoLobbyContent = content.substring(0, startIndex) + content.substring(endIndex);
    fs.writeFileSync('components/CasinoLobby.tsx', newCasinoLobbyContent);
    
    console.log('Successfully moved games to data/games.ts and cleaned CasinoLobby.tsx');
} else {
    console.log('Failed to find DEMO_GAMES block');
}
