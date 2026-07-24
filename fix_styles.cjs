const fs = require('fs');

// 1. SportsBanners.tsx: Fix KAYIT OL button styling & Image Weight
let sb = fs.readFileSync('components/SportsBanners.tsx', 'utf8');
// Fix KAYIT OL button to solid green
sb = sb.replace(
  /bg-black\/60 border border-white\/20 hover:\$\{banner\.borderColor\} \$\{banner\.hoverBg\} text-white/g,
  "bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#00E676] hover:to-[#10b981] text-black border-none shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]"
);

// Fix width distribution
sb = sb.replace(/w-\[90%\] md:w-\[75%\] h-full relative/g, "w-[80%] md:w-[60%] lg:w-[50%] h-full relative");
sb = sb.replace(/w-\[95%\] md:w-\[60%\] lg:w-\[50%\]/g, "w-[95%] md:w-[70%] lg:w-[60%]");

fs.writeFileSync('components/SportsBanners.tsx', sb);

// 2. GuestLanding.tsx: Fix text sizes and Play button glow
let gl = fs.readFileSync('components/GuestLanding.tsx', 'utf8');
// Reduce font sizes
gl = gl.replace(/text-sm sm:text-base lg:text-xl xl:text-2xl/g, 'text-xs sm:text-sm lg:text-base xl:text-lg');
// Play buttons
gl = gl.replace(
  /absolute inset-\[6px\] bg-white\/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-\[\#eab308\] shadow-lg group-hover:shadow-\[0_0_20px_rgba\(234,179,8,0\.6\)\] transition-all duration-500 cursor-pointer group-hover:scale-110/g,
  "absolute inset-[6px] bg-[#10b981]/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all duration-500 cursor-pointer group-hover:scale-110"
);
gl = gl.replace(
  /absolute inset-\[6px\] bg-white\/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-\[\#d946ef\] shadow-lg group-hover:shadow-\[0_0_20px_rgba\(217,70,239,0\.6\)\] transition-all duration-500 cursor-pointer group-hover:scale-110/g,
  "absolute inset-[6px] bg-[#10b981]/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all duration-500 cursor-pointer group-hover:scale-110"
);
gl = gl.replace(
  /absolute inset-\[6px\] bg-white\/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-\[\#06b6d4\] shadow-lg group-hover:shadow-\[0_0_20px_rgba\(6,182,212,0\.6\)\] transition-all duration-500 cursor-pointer group-hover:scale-110/g,
  "absolute inset-[6px] bg-[#10b981]/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all duration-500 cursor-pointer group-hover:scale-110"
);
gl = gl.replace(
  /absolute inset-\[6px\] bg-white\/5 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-\[\#10b981\] shadow-lg group-hover:shadow-\[0_0_20px_rgba\(16,185,129,0\.6\)\] transition-all duration-500 cursor-pointer group-hover:scale-110/g,
  "absolute inset-[6px] bg-[#10b981]/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all duration-500 cursor-pointer group-hover:scale-110"
);
fs.writeFileSync('components/GuestLanding.tsx', gl);

// 4. Header Vertical Alignment
let header = fs.readFileSync('components/Header.tsx', 'utf8');
// Align logo and buttons properly
header = header.replace(/className="flex items-center gap-1 md:gap-2"/g, 'className="flex items-center gap-1 md:gap-2 self-center"');
header = header.replace(/className="flex items-center gap-3 ml-2 lg:ml-8 mt-1"/g, 'className="flex items-center gap-3 ml-2 lg:ml-8 self-center"'); // Remove mt-1 to align
fs.writeFileSync('components/Header.tsx', header);

console.log("Success");
