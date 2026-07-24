const fs = require('fs');

let content = fs.readFileSync('components/RewardsPage.tsx', 'utf8');

// Left Column Modifications
content = content.replace(/space-y-5/g, 'space-y-3');
content = content.replace(/px-4 py-1\.5 rounded-full/g, 'px-3 py-1 rounded-full');
content = content.replace(/text-\[10px\] font-black uppercase tracking-\[0\.25em\]/g, 'text-[9px] font-black uppercase tracking-[0.2em]');
content = content.replace(/text-3xl md:text-4xl lg:text-5xl font-black/g, 'text-2xl md:text-3xl lg:text-4xl font-black');
content = content.replace(/text-sm md:text-base text-zinc-400 font-medium leading-relaxed max-w-md/g, 'text-[13px] md:text-sm text-zinc-400 font-medium leading-relaxed max-w-sm');
content = content.replace(/px-8 py-4 rounded-full text-sm transition-all duration-300 group flex items-center gap-2 mt-2/g, 'px-6 py-3 rounded-full text-[13px] transition-all duration-300 group flex items-center gap-1.5 mt-1');
content = content.replace(/w-14 h-14/g, 'w-10 h-10 -bottom-2 -right-2');
content = content.replace(/text-\[7px\]/g, 'text-[6px]');

// Right Column Modifications
content = content.replace(/gap-2\.5 w-full/g, 'gap-2 w-full');
content = content.replace(/p-4 md:p-5/g, 'p-3 md:p-4');
content = content.replace(/w-10 h-10 flex items-center justify-center text-xl rounded-xl/g, 'w-8 h-8 flex items-center justify-center text-base rounded-lg');
content = content.replace(/text-\[11px\] md:text-xs font-arcade/g, 'text-[10px] md:text-[11px] font-arcade');
content = content.replace(/text-\[10px\] font-arcade text-zinc-600 font-bold uppercase mt-1/g, 'text-[8px] font-arcade text-zinc-600 font-bold uppercase mt-0.5');
content = content.replace(/text-\[10px\] font-arcade retro-green-text font-bold uppercase mt-1/g, 'text-[8px] font-arcade retro-green-text font-bold uppercase mt-0.5');
content = content.replace(/max-h-\[120px\] opacity-100 mt-3 pt-3/g, 'max-h-[100px] opacity-100 mt-2 pt-2');
content = content.replace(/text-\[8px\] md:text-\[9px\] text-zinc-400/g, 'text-[7px] md:text-[8px] text-zinc-400');
content = content.replace(/text-\[9px\] md:text-\[10px\] font-arcade/g, 'text-[8px] md:text-[9px] font-arcade');
content = content.replace(/px-1\.5 py-1/g, 'px-1 py-0.5');
content = content.replace(/h-2\.5 w-full/g, 'h-2 w-full');

fs.writeFileSync('components/RewardsPage.tsx', content);

console.log('Done scaling down hero section.');
