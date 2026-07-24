const fs = require('fs');

let content = fs.readFileSync('components/RewardsPage.tsx', 'utf8');

// Restore Left Column text sizes
content = content.replace(/text-xl md:text-2xl lg:text-3xl font-black/g, 'text-3xl md:text-4xl lg:text-5xl font-black');
content = content.replace(/text-\[11px\] md:text-xs text-zinc-400 font-medium leading-relaxed max-w-xs/g, 'text-sm md:text-base text-zinc-400 font-medium leading-relaxed max-w-md');
content = content.replace(/text-\[8px\] font-black uppercase tracking-\[0\.15em\]/g, 'text-[10px] font-black uppercase tracking-[0.25em]');
content = content.replace(/px-5 py-2\.5 rounded-full text-xs/g, 'px-5 py-2.5 rounded-full text-sm');
content = content.replace(/text-\[6px\] text-green-400 font-bold tracking-tighter opacity-70 z-10/g, 'text-[7px] text-green-400 font-bold tracking-tighter opacity-70 z-10');

// Restore Right Column text sizes
content = content.replace(/text-\[9px\] md:text-\[10px\] font-arcade tracking-widest/g, 'text-[11px] md:text-xs font-arcade tracking-widest');
content = content.replace(/text-\[7px\] font-arcade text-zinc-600 font-bold uppercase mt-0\.5 tracking-wider/g, 'text-[10px] font-arcade text-zinc-600 font-bold uppercase mt-0.5 tracking-wider');
content = content.replace(/text-\[7px\] font-arcade retro-green-text font-bold uppercase mt-0\.5 tracking-wider/g, 'text-[10px] font-arcade retro-green-text font-bold uppercase mt-0.5 tracking-wider');
content = content.replace(/text-\[6px\] md:text-\[7px\] text-zinc-400 font-arcade tracking-wider mt-1/g, 'text-[8px] md:text-[9px] text-zinc-400 font-arcade tracking-wider mt-1');
content = content.replace(/text-\[7px\] md:text-\[8px\] font-arcade retro-green-text drop-shadow-\[0_0_5px_rgba\(74,222,128,0\.5\)\] px-1 py-0\.5/g, 'text-[9px] md:text-[10px] font-arcade retro-green-text drop-shadow-[0_0_5px_rgba(74,222,128,0.5)] px-1 py-0.5');

content = content.replace(/text-\[6px\] md:text-\[8px\] text-zinc-500 font-arcade uppercase mt-1/g, 'text-[7px] md:text-[8px] text-zinc-500 font-arcade uppercase mt-1');
content = content.replace(/text-\[7px\] md:text-\[8px\] font-arcade text-zinc-300 drop-shadow-\[0_0_5px_rgba\(255,255,255,0\.2\)\] px-1 py-0\.5/g, 'text-[8px] md:text-[9px] font-arcade text-zinc-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] px-1 py-0.5');

// Icons in rank cards
content = content.replace(/w-6 h-6 flex items-center justify-center text-sm rounded-md/g, 'w-8 h-8 flex items-center justify-center text-xl rounded-md');

fs.writeFileSync('components/RewardsPage.tsx', content);

console.log('Restored text sizes, kept frames small.');
