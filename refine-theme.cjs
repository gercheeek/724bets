const fs = require('fs');
const path = require('path');

const applyRefinements = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    const isSidebar = filePath.includes('Sidebar.tsx');
    const isHeader = filePath.includes('Header.tsx');
    const isChat = filePath.includes('ModernChat.tsx');

    if (isSidebar) {
        // Fix active menu items from bg-blue-600 text-white to a premium subtle blue
        content = content.replace(/bg-blue-600 text-white shadow-md/g, 'bg-blue-500/15 text-blue-400 shadow-sm');
        
        // Fix hover states on inactive items
        content = content.replace(/hover:bg-blue-600/g, 'hover:bg-white/5');
        
        // Remove bg-blue-600 from anywhere else in sidebar that shouldn't be bright
        content = content.replace(/bg-blue-600/g, 'bg-white/5'); 
    }

    if (isHeader) {
        // Fix hover:bg-blue-600 on dropdowns and icon buttons
        content = content.replace(/hover:bg-blue-600/g, 'hover:bg-white/5');
        
        // Deposit button (line 429 area)
        content = content.replace(
            /bg-blue-600 hover:bg-blue-700 text-white font-bold h-\[38px\] md:h-\[42px\] px-3 md:px-5 rounded-lg text-\[13px\] md:text-\[14px\] transition-colors flex items-center justify-center gap-2/g,
            'bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 font-bold h-[38px] md:h-[42px] px-3 md:px-5 rounded-lg text-[13px] md:text-[14px] transition-colors flex items-center justify-center gap-2 border border-blue-500/20 hover:border-blue-500/40'
        );
    }

    if (isChat) {
        // Chat input button was bg-blue-600
        content = content.replace(/text-white bg-blue-600 disabled:bg-\[#121212\] disabled:text-gray-600 hover:bg-blue-700/g, 'text-blue-400 bg-blue-500/15 disabled:bg-[#121212] disabled:text-gray-600 hover:bg-blue-500/25 border border-blue-500/20');
        // If it was already modified or missed by previous script, target this:
        content = content.replace(/text-white bg-blue-600/g, 'text-blue-400 bg-blue-500/15 border border-blue-500/20');
    }

    fs.writeFileSync(filePath, content);
};

applyRefinements(path.join(__dirname, 'components/Sidebar.tsx'));
applyRefinements(path.join(__dirname, 'components/Header.tsx'));
applyRefinements(path.join(__dirname, 'components/ModernChat.tsx'));

console.log("Refined theme styles successfully.");
