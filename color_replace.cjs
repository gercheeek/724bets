const fs = require('fs');
let content = fs.readFileSync('components/sports/SportsDashboardWidget.tsx', 'utf8');

// Replace hex codes
content = content.replace(/#F59E0B/gi, '#06B6D4'); // Cyan 500
content = content.replace(/#D97706/gi, '#0891B2'); // Cyan 600

// Replace rgb/rgba
content = content.replace(/245,158,11/g, '6,182,212'); // Cyan 500 rgb
content = content.replace(/249,115,22/g, '14,165,233'); // Sky 500 rgb

// Replace tailwind classes
content = content.replace(/text-amber-/g, 'text-cyan-');
content = content.replace(/bg-amber-/g, 'bg-cyan-');
content = content.replace(/border-amber-/g, 'border-cyan-');
content = content.replace(/text-orange-/g, 'text-sky-');

// Also tone down the glass effect
content = content.replace(/background: 'linear-gradient\(145deg, #111111 0%, #080808 50%, #030303 100%\)'/g, "background: 'rgba(255,255,255,0.015)'");
content = content.replace(/boxShadow: '0 1px 0 rgba\(255,255,255,0.06\) inset, 0 20px 40px rgba\(0,0,0,0.7\)'/g, "boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.03)'");

content = content.replace(/background: 'linear-gradient\(180deg, rgba\(15,15,15,0.9\) 0%, rgba\(5,5,5,1\) 100%\)'/g, "background: 'rgba(0,0,0,0.2)'");
content = content.replace(/boxShadow: 'inset 0 3px 8px rgba\(0,0,0,0.8\), 0 1px 0 rgba\(255,255,255,0.05\)'/g, "boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.02)'");

fs.writeFileSync('components/sports/SportsDashboardWidget.tsx', content);
console.log('Colors replaced successfully.');
