const fs = require('fs');
let content = fs.readFileSync('components/sports/GercekView.tsx', 'utf8');

content = content.replace(
  `{/* Desktop Headers */}
                          <div className="hidden lg:flex items-center justify-between px-6 text-[10px] text-zinc-500 font-medium mb-1">
                             <span className="w-[70px] text-center">1</span>
                             <span className="w-[70px] text-center">X</span>
                             <span className="w-[70px] text-center">2</span>
                             <span className="w-[45px]"></span>
                          </div>`,
  `{/* Desktop Headers */}
                          {index === 0 && (
                            <div className="hidden lg:flex items-center justify-between px-6 text-[10px] text-zinc-500 font-medium mb-1 absolute -top-[18px] right-0 w-[275px]">
                               <span className="w-[70px] text-center">1</span>
                               <span className="w-[70px] text-center">X</span>
                               <span className="w-[70px] text-center">2</span>
                               <span className="w-[45px]"></span>
                            </div>
                          )}`
);

content = content.replace(
  `<div className="flex flex-col gap-1 shrink-0 mt-3 lg:mt-0 lg:w-auto w-full">`,
  `<div className="flex flex-col gap-1 shrink-0 mt-3 lg:mt-0 lg:w-auto w-full relative">`
);

fs.writeFileSync('components/sports/GercekView.tsx', content);
