const fs = require('fs');

// 1. GuestLanding.tsx - Add Welcome Header
let guestLanding = fs.readFileSync('components/GuestLanding.tsx', 'utf8');
guestLanding = guestLanding.replace(
  '{/* Category Navigation Cards (Web: 3 cols, Mobile: grid) */}',
  `{/* Welcome Title */}
            <div className="w-full text-left mb-3 mt-2 pl-1">
               <h2 className="text-3xl md:text-[42px] font-black tracking-tight drop-shadow-md flex flex-wrap gap-2">
                 <span className="text-white">724bets'e</span> <span className="text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">Hoş Geldiniz!</span>
               </h2>
            </div>
            
            {/* Category Navigation Cards (Web: 3 cols, Mobile: grid) */}`
);
fs.writeFileSync('components/GuestLanding.tsx', guestLanding);

// 2. RewardsPage.tsx - HeroTitle, CTA Hover, VIP Opacity, Bronze Padding, Info Cards Flex Center
let rewardsPage = fs.readFileSync('components/RewardsPage.tsx', 'utf8');

rewardsPage = rewardsPage.replace(
  `            {/* Dot Texture & Gamified Neon Green */}
            <span className="retro-green-text drop-shadow-[0_0_20px_rgba(74,222,128,0.4)] hover:brightness-125 transition-all">`,
  `            {/* Neon Green Glow */}
            <span className="text-[#10b981] drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:brightness-125 transition-all">`
);

rewardsPage = rewardsPage.replace(
  `hover:shadow-[0_0_40px_rgba(74,222,128,0.5)] hover:border-green-400`,
  `hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:scale-[1.02] hover:border-green-400`
);

rewardsPage = rewardsPage.replace(
  `opacity-40 grayscale z-0`,
  `opacity-[0.65] grayscale z-0`
);

rewardsPage = rewardsPage.replace(
  `relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[calc(1rem-1px)] z-10 flex flex-col p-3`,
  `relative bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[calc(1rem-1px)] z-10 flex flex-col p-4 md:p-5`
);

rewardsPage = rewardsPage.replace(
  /bg-\[\#050505\]\/95 backdrop-blur-2xl rounded-\[calc\(1\.5rem-1px\)\] p-6 flex flex-col items-center text-center gap-4 h-full relative z-10 border border-white\/5 group-hover:bg-\[\#0a0a0a\]\/95 transition-colors/g,
  `bg-[#050505]/95 backdrop-blur-2xl rounded-[calc(1.5rem-1px)] p-6 flex flex-col items-center justify-center text-center gap-4 h-full relative z-10 border border-white/5 group-hover:bg-[#0a0a0a]/95 transition-colors`
);

fs.writeFileSync('components/RewardsPage.tsx', rewardsPage);

// 3. Sidebar.tsx - Hover transitions to green, margin/divider between logical blocks
let sidebar = fs.readFileSync('components/Sidebar.tsx', 'utf8');

// Replace hover:text-white with hover:text-[#10b981] for smoother transition to main green
sidebar = sidebar.replace(/hover:text-white/g, 'hover:text-[#10b981]');

// Make dividers slightly thicker and more spaced
sidebar = sidebar.replace(
  /<div className="h-px bg-white\/5 w-full my-2" \/>/g,
  `<div className="h-px bg-white/10 w-full my-4" />`
);

fs.writeFileSync('components/Sidebar.tsx', sidebar);
console.log('Successfully applied style modifications.');
