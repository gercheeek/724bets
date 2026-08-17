const io = require('socket.io-client');
const socket = io('http://localhost:3001');

socket.on('connect', () => {
   console.log('Connected to socket server');
});

socket.on('matches_update', (matches) => {
   let ggCount = 0;
   for (const match of matches) {
      if (match.group_markets) {
         const fullEvent = match.group_markets['full_event|0'] || [];
         const ggStr = fullEvent.find(m => m.startsWith('|gg|'));
         if (ggStr) {
             const parts = ggStr.split('!');
             const varOdd = parts.find(p => p.includes('~var~'))?.split('~')[2];
             const yokOdd = parts.find(p => p.includes('~yok~'))?.split('~')[2];
             if (varOdd !== '-' && yokOdd !== '-') {
                 console.log(`Match ${match.home} vs ${match.away} has GG odds: var=${varOdd}, yok=${yokOdd}`);
                 ggCount++;
             }
         }
      }
   }
   console.log(`Found valid GG odds in ${ggCount} out of ${matches.length} matches.`);
   process.exit(0);
});
