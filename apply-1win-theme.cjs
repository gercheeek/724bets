const fs = require('fs');
const path = require('path');

const applyTheme = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Sidebar active backgrounds
    content = content.replace(/bg-\[#1e2230\]/g, 'bg-white/10');
    content = content.replace(/bg-\[#f59e0b\]/g, 'bg-blue-600');
    content = content.replace(/bg-\[#181c2b\]/g, 'bg-blue-600');
    content = content.replace(/text-\[#5b8def\]/g, 'text-white');
    
    // Header & Chat Buttons
    content = content.replace(/bg-\[#38b75e\] hover:bg-\[#2fa350\]/g, 'bg-blue-600 hover:bg-blue-700');
    content = content.replace(/bg-\[#38b75e\]/g, 'bg-blue-600');
    content = content.replace(/text-\[#38b75e\]/g, 'text-blue-500');
    content = content.replace(/border-\[#38b75e\]\/40/g, 'border-blue-500/40');
    
    // Texts and Icons
    content = content.replace(/text-zinc-400/g, 'text-gray-400');
    content = content.replace(/text-zinc-500/g, 'text-gray-500');
    content = content.replace(/text-emerald-400/g, 'text-blue-500');
    content = content.replace(/text-amber-400/g, 'text-gray-400'); // Neutralize amber
    content = content.replace(/bg-emerald-500\/20/g, 'bg-blue-500/20');
    
    content = content.replace(/text-\[#94a3b8\]/g, 'text-gray-400');
    content = content.replace(/bg-\[#131926\]/g, 'bg-black');
    content = content.replace(/border-\[#1b2335\]/g, 'border-white/5');
    
    // Chat Mod tags
    content = content.replace(/bg-amber-500\/5/g, 'bg-blue-500/10');
    content = content.replace(/border-amber-500\/10/g, 'border-blue-500/20');
    
    // Remove extra borders in ModernChat
    content = content.replace(/border-emerald-500\/30/g, 'border-white/5');
    content = content.replace(/border-emerald-500\/50/g, 'border-blue-500/50');
    content = content.replace(/border-emerald-500\/40/g, 'border-blue-500/50');
    content = content.replace(/hover:border-emerald-500\/50/g, 'hover:border-blue-500/50');
    content = content.replace(/text-emerald-400/g, 'text-blue-500');

    // Header Borders and backgrounds
    content = content.replace(/bg-\[#121721\]/g, 'bg-black');
    content = content.replace(/border-\[#1e2330\]/g, 'border-white/5');
    content = content.replace(/hover:bg-\[#181c2b\]/g, 'hover:bg-white/5');
    
    fs.writeFileSync(filePath, content);
};

applyTheme(path.join(__dirname, 'components/Sidebar.tsx'));
applyTheme(path.join(__dirname, 'components/Header.tsx'));
applyTheme(path.join(__dirname, 'components/ModernChat.tsx'));

console.log("Applied 1win theme styles successfully.");
