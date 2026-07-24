const fs = require('fs');

let sb = fs.readFileSync('components/SportsBanners.tsx', 'utf8');

// The image container is currently:
// <div className="absolute inset-0 z-0 flex justify-end">
//   <div className="w-[80%] md:w-[60%] lg:w-[50%] h-full relative">
//     <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10 w-[50%] md:w-[40%]"></div>
//     <img ... />
//   </div>
// </div>

sb = sb.replace(
  /<div className="absolute inset-0 z-0 flex justify-end">[\s\S]*?<div className="w-\[80%\] md:w-\[60%\] lg:w-\[50%\] h-full relative">[\s\S]*?<div className="absolute inset-0 bg-gradient-to-r from-\[\#050505\] via-\[\#050505\]\/60 to-transparent z-10 w-\[50%\] md:w-\[40%\]"><\/div>/m,
  `<div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          {/* Strong mask on the left to cover the image under the text */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10 w-[80%] md:w-[60%]"></div>`
);

// Optional: change the text area width so it matches the fade
sb = sb.replace(
  /<div className="relative z-20 p-6 md:p-12 flex flex-col justify-center h-full w-\[95%\] md:w-\[70%\] lg:w-\[60%\] gap-3 bg-gradient-to-r from-\[\#050505\] via-\[\#050505\]\/80 to-transparent">/m,
  '<div className="relative z-20 p-6 md:p-12 flex flex-col justify-center h-full w-[95%] md:w-[70%] lg:w-[50%] gap-3">'
);

fs.writeFileSync('components/SportsBanners.tsx', sb);
console.log("Success");
