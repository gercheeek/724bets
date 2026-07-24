const fs = require('fs');

let content = fs.readFileSync('components/RewardsPage.tsx', 'utf8');

// Left Column Modifications
content = content.replace(/space-y-3/g, 'space-y-2');
content = content.replace(/px-3 py-1 rounded-full/g, 'px-2.5 py-0.5 rounded-full');
content = content.replace(/text-\[9px\] font-black uppercase tracking-\[0\.2em\]/g, 'text-[8px] font-black uppercase tracking-[0.15em]');
content = content.replace(/text-2xl md:text-3xl lg:text-4xl font-black/g, 'text-xl md:text-2xl lg:text-3xl font-black');
content = content.replace(/text-\[13px\] md:text-sm text-zinc-400 font-medium leading-relaxed max-w-sm/g, 'text-[11px] md:text-xs text-zinc-400 font-medium leading-relaxed max-w-xs');
content = content.replace(/px-6 py-3 rounded-full text-\[13px\] transition-all duration-300 group flex items-center gap-1\.5 mt-1/g, 'px-5 py-2.5 rounded-full text-xs transition-all duration-300 group flex items-center gap-1.5 mt-0.5');

// Right Column Modifications
content = content.replace(/gap-2 w-full/g, 'gap-1.5 w-full');
content = content.replace(/p-3 md:p-4/g, 'p-2 md:p-3');
content = content.replace(/w-8 h-8 flex items-center justify-center text-base rounded-lg/g, 'w-6 h-6 flex items-center justify-center text-sm rounded-md');
content = content.replace(/text-\[10px\] md:text-\[11px\] font-arcade/g, 'text-[9px] md:text-[10px] font-arcade');
content = content.replace(/text-\[8px\] font-arcade text-zinc-600 font-bold uppercase mt-0\.5/g, 'text-[7px] font-arcade text-zinc-600 font-bold uppercase mt-0.5');
content = content.replace(/text-\[8px\] font-arcade retro-green-text font-bold uppercase mt-0\.5/g, 'text-[7px] font-arcade retro-green-text font-bold uppercase mt-0.5');
content = content.replace(/max-h-\[100px\] opacity-100 mt-2 pt-2/g, 'max-h-[80px] opacity-100 mt-1.5 pt-1.5');
content = content.replace(/text-\[7px\] md:text-\[8px\] text-zinc-400/g, 'text-[6px] md:text-[7px] text-zinc-400');
content = content.replace(/text-\[8px\] md:text-\[9px\] font-arcade/g, 'text-[7px] md:text-[8px] font-arcade');

fs.writeFileSync('components/RewardsPage.tsx', content);

console.log('Done scaling down hero section even more.');
