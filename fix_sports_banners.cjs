const fs = require('fs');

let content = fs.readFileSync('components/SportsBanners.tsx', 'utf8');

content = content.replace(
    /className=\{\`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-1000 ease-in-out group \$\{\n\s*index === activeIndex \? 'pointer-events-auto' : 'pointer-events-none'\n\s*\}\`\}/,
    "className={`absolute inset-0 w-full h-full cursor-pointer transition-all duration-1000 ease-in-out group ${index === activeIndex ? 'opacity-100 pointer-events-auto visible z-10' : 'opacity-0 pointer-events-none invisible z-0'}`}"
);

content = content.replace(
    /style=\{\{\n\s*opacity: index === activeIndex \? 1 : 0,\n\s*zIndex: index === activeIndex \? 10 : 0\n\s*\}\}/,
    ""
);

fs.writeFileSync('components/SportsBanners.tsx', content);
console.log("Success");
