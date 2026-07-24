const fs = require('fs');
const path = require('path');

const dir = 'components/sports/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

// Also include LiveMatches.tsx, UpcomingMatchesView.tsx, Spor724View.tsx, GuestLanding.tsx, App.tsx just in case
const extraFiles = ['components/LiveMatches.tsx', 'components/UpcomingMatchesView.tsx', 'components/Spor724View.tsx', 'components/GuestLanding.tsx', 'App.tsx'];
const allFiles = [...files, ...extraFiles];

const replacements = [
  { regex: /bg-\[#0e1320\]/g, replace: 'bg-[#101114]' },
  { regex: /bg-\[#111621\]/g, replace: 'bg-[#101114]' },
  { regex: /bg-\[#121927\]/g, replace: 'bg-[#101114]' },
  { regex: /bg-\[#131926\]/g, replace: 'bg-[#101114]' },
  { regex: /bg-\[#141621\]/g, replace: 'bg-[#101114]' },
  { regex: /bg-\[#151c2c\]/g, replace: 'bg-[#18191c]' },
  { regex: /bg-\[#1a1d2c\]/g, replace: 'bg-[#18191c]' },
  { regex: /bg-\[#1a1f2e\]/g, replace: 'bg-[#18191c]' },
  { regex: /bg-\[#1b2336\]/g, replace: 'bg-[#18191c]' },
  { regex: /bg-\[#1c1e2d\]/g, replace: 'bg-[#18191c]' },
  { regex: /bg-\[#1c2230\]/g, replace: 'bg-[#18191c]' },
  { regex: /bg-\[#1f2638\]/g, replace: 'bg-[#25262b]' },
  { regex: /bg-\[#1f293e\]/g, replace: 'bg-[#25262b]' },
  { regex: /bg-\[#25283d\]/g, replace: 'bg-[#25262b]' },
  { regex: /bg-\[#252b3b\]/g, replace: 'bg-[#25262b]' },
  { regex: /bg-\[#252d3d\]/g, replace: 'bg-[#25262b]' },
  { regex: /bg-\[#0f121d\]/g, replace: 'bg-[#101114]' },
  { regex: /bg-\[#16192b\]/g, replace: 'bg-[#18191c]' },
  { regex: /bg-\[#1c2033\]/g, replace: 'bg-[#25262b]' },
  { regex: /border-\[#1f293e\]/g, replace: 'border-white/5' },
  { regex: /border-\[#1c2230\]/g, replace: 'border-white/5' },
  { regex: /border-\[#151c2c\]/g, replace: 'border-white/5' },
  { regex: /border-\[#1b2336\]/g, replace: 'border-white/5' },
  { regex: /hover:bg-\[#252d3d\]/g, replace: 'hover:bg-[#2c2d33]' },
  { regex: /hover:bg-\[#1f293e\]/g, replace: 'hover:bg-[#25262b]' },
  { regex: /hover:bg-\[#1c2230\]/g, replace: 'hover:bg-[#25262b]' }
];

allFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replace);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Removed deep blue from ${file}`);
  }
});
