const fs = require('fs');
let content = fs.readFileSync('components/sports/DualRightPanel.tsx', 'utf8');

// Import useBetting
if (!content.includes('useBetting')) {
  content = content.replace(
    "import { useBetSlip } from '../../contexts/BetSlipContext';",
    "import { useBetSlip } from '../../contexts/BetSlipContext';\nimport { useBetting } from '../../contexts/BettingContext';"
  );
}

// Inside DualRightPanel component:
// const { events } = useBetting();
// const internalPopularMatches = popularMatches.length > 0 ? popularMatches : (events || []).slice(0, 5).map(e => ({ id: e.id, home: e.home, away: e.away, score: e.score, minute: e.minute, league: e.league, isLive: true }));
content = content.replace(
  "const { siteUser, placeBet } = useUser();",
  "const { siteUser, placeBet } = useUser();\n  const { events } = useBetting();\n  const displayMatches = popularMatches && popularMatches.length > 0 ? popularMatches : (events || []).slice(0, 5).map(e => ({ id: e.id, home: e.data?.home?.name || 'Ev', away: e.data?.away?.name || 'Dep', score: '0-0', minute: '45\\'', league: e.data?.league?.name || 'Lig', isLive: true }));"
);

// Replace popularMatches.slice(0, 5).map with displayMatches.map
content = content.replace(
  /popularMatches\.slice\(0,\s*5\)\.map/g,
  'displayMatches.map'
);

fs.writeFileSync('components/sports/DualRightPanel.tsx', content);
console.log("DualRightPanel data source fixed");
