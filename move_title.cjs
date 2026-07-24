const fs = require('fs');

let content = fs.readFileSync('components/GuestLanding.tsx', 'utf8');

const titleRegex = /\s*\{\/\* Welcome Title \*\/\}\s*<div className="w-full text-left mb-4 mt-2 pl-1">\s*<h2 className="text-3xl md:text-\[42px\] font-black tracking-tight drop-shadow-md flex flex-wrap gap-2">\s*<span className="text-white">724bets'e<\/span> <span className="text-\[\#10b981\] drop-shadow-\[0_0_10px_rgba\(16,185,129,0\.4\)\]">Hoş Geldiniz!<\/span>\s*<\/h2>\s*<\/div>/;

// Remove the title from its original position
if (content.match(titleRegex)) {
    content = content.replace(titleRegex, '');
    
    // Insert it before LiveWinsTicker
    const targetString = '<LiveWinsTicker />';
    const replacement = `{/* Welcome Title */}
              <div className="w-full text-left mb-4 pl-1">
                 <h2 className="text-3xl md:text-[42px] font-black tracking-tight drop-shadow-md flex flex-wrap gap-2">
                   <span className="text-white">724bets'e</span> <span className="text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">Hoş Geldiniz!</span>
                 </h2>
              </div>
              <LiveWinsTicker />`;
              
    content = content.replace(targetString, replacement);
    fs.writeFileSync('components/GuestLanding.tsx', content);
    console.log('Title moved successfully.');
} else {
    console.log('Title regex did not match.');
}

