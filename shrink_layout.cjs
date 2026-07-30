const fs = require('fs');
const path = '/Users/alex/Desktop/7_24bets-landing-page/components/VIPRafflePromo.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace banner size
content = content.replace(
    /min-h-\[140px\] md:min-h-\[180px\]/g,
    'h-[90px] md:h-[110px] min-h-[90px]'
);

content = content.replace(
    /p-4 md:p-12/g,
    'p-2 md:p-4'
);

content = content.replace(
    /h-\[120px\] md:h-\[140px\]/g,
    'h-[80px] md:h-[90px]'
);

content = content.replace(
    /px-6 py-3 md:px-10 md:py-4/g,
    'px-4 py-1.5 md:px-6 md:py-2'
);

content = content.replace(
    /text-xl md:text-2xl lg:text-3xl font-black text-white\/90 leading-tight mb-0\.5 tracking-tight/g,
    'text-base md:text-lg lg:text-xl font-black text-white/90 leading-tight mb-0 tracking-tight'
);

content = content.replace(
    /text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-transparent/g,
    'text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-transparent'
);

content = content.replace(
    /bottom-8/g,
    'bottom-2'
);

// Vertical content container
content = content.replace(
    /gap-6 py-6 px-4 md:px-6/g,
    'gap-2 py-2 px-2 md:px-4'
);

content = content.replace(
    /mb-4/g,
    'mb-1'
);

content = content.replace(
    /gap-3 mb-4/g,
    'gap-2 mb-1 scale-75 origin-top'
);

// Main Card padding
content = content.replace(
    /p-5 lg:p-6/g,
    'p-3 lg:p-4'
);
content = content.replace(
    /gap-4/g,
    'gap-2'
);

content = content.replace(
    /text-xl md:text-2xl drop-shadow/g,
    'text-sm md:text-base drop-shadow'
);

content = content.replace(
    /px-4 py-2 rounded-lg/g,
    'px-3 py-1.5 rounded-md'
);
content = content.replace(
    /text-xs md:text-sm/g,
    'text-[10px] md:text-[11px]'
);

// Middle column -> row layout
content = content.replace(
    /\{\/\* MIDDLE COLUMN: Prizes \*\/}/g,
    `{/* HORIZONTAL WRAPPER FOR PRIZES AND STATUS */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Prizes Column */}`
);

// The `items-center justify-start` on the middle column to `w-full`
content = content.replace(
    /<div className="flex flex-col items-center justify-start relative">/g,
    (match, offset, string) => {
        // We only want to change the second occurrence which is right after `Prizes Column`
        return `<div className="flex flex-col flex-1 relative w-full">`;
    }
);

content = content.replace(
    /\{\/\* LEFT COLUMN: Your Status \(Şans Metresi & Bakiye\) \*\/}\n\s*<div className="flex flex-col gap-4">/g,
    `{/* Your Status Column */}
          <div className="flex flex-col flex-1 gap-2 w-full">`
);

content = content.replace(
    /<\/div>\n\n\s*\{\/\* FOOTER: Mini Activity Feed \*\/}/g,
    `</div>\n          </div>\n\n          {/* FOOTER: Mini Activity Feed */}`
);

// Prize gap
content = content.replace(
    /<div className="w-full flex flex-col gap-3">/g,
    '<div className="w-full flex flex-col gap-1.5">'
);

// Prize padding
content = content.replace(
    /p-4 lg:p-5/g,
    'p-2'
);

content = content.replace(
    /w-10 h-10/g,
    'w-7 h-7'
);
content = content.replace(
    /w-5 h-5/g,
    'w-3.5 h-3.5'
);

content = content.replace(
    /w-8 h-8/g,
    'w-6 h-6'
);
content = content.replace(
    /w-4 h-4/g,
    'w-3 h-3'
);
content = content.replace(
    /text-[9px] font-black uppercase/g,
    'text-[8px] font-black uppercase'
);
content = content.replace(
    /text-base drop-shadow/g,
    'text-sm drop-shadow'
);
content = content.replace(
    /text-xl font-black text-transparent/g,
    'text-sm font-black text-transparent'
);

content = content.replace(
    /text-lg font-black text-slate-200/g,
    'text-sm font-black text-slate-200'
);

content = content.replace(
    /py-3/g,
    'py-1.5'
);

// Glass panel padding (Senin Durumun)
content = content.replace(
    /glass-panel rounded-2xl p-4 lg:p-5/g,
    'glass-panel rounded-xl p-2.5'
);


fs.writeFileSync(path, content, 'utf8');
console.log('Layout shrunk successfully!');
