const fs = require('fs');

function fixShapes(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace Lucide Globe in League Header with a custom, high-tech geometric icon
  content = content.replace(/<Globe className="w-4 h-4 text-slate-400" \/>/g, 
  `<svg className="w-4 h-4 text-[#10b981]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 12h18M12 3v18" strokeDasharray="2 4" />
    <circle cx="12" cy="12" r="3" fill="#10b981" stroke="none" opacity="0.5" />
  </svg>`);

  // Update top navigation fonts: instead of generic text-xs or text-sm, use custom premium uppercase typography
  // Assuming the nav renders it like: <span className="text-sm font-bold text-slate-300">
  // We'll just search for the sport name span and replace its class
  content = content.replace(/className="text-xs font-bold whitespace-nowrap/g, 'className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap');
  content = content.replace(/className="text-sm font-bold/g, 'className="text-[11px] font-black uppercase tracking-[0.15em]');
  
  // Custom Abstract/Geometric SVGs for the top nav
  // Futbol
  content = content.replace(/<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1\.5"><circle cx="12" cy="12" r="10"\/>.*?<\/svg>/g,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 22 8 22 16 12 22 2 16 2 8 12 2" strokeLinejoin="round"/>
    <polygon points="12 6 17 10 17 15 12 19 7 15 7 10 12 6" strokeDasharray="1 2"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
  </svg>`);

  // Basketbol
  content = content.replace(/<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1\.5"><circle cx="12" cy="12" r="10"\/><path d="M2 12h20"\/><path d="M12 2.*?<\/svg>/g,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" strokeDasharray="4 2"/>
    <path d="M12 2v20M2 12h20"/>
    <path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" strokeDasharray="1 4"/>
  </svg>`);

  // Tenis
  content = content.replace(/<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1\.5"><circle cx="12" cy="12" r="6"\/><path d="M16 16l4\.5 4\.5"\/><path.*?<\/svg>/g,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 12l10 10 10-10L12 2z"/>
    <path d="M6 12h12M12 6v12" strokeDasharray="1 3"/>
  </svg>`);

  // Am. Futbolu
  content = content.replace(/<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1\.5"><ellipse cx="12" cy="12" rx="6" ry="10"\/><path.*?<\/svg>/g,
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 12C2 6 7 2 12 2s10 4 10 10-5 10-10 10S2 18 2 12z" strokeDasharray="5 2"/>
    <path d="M12 6v12"/>
    <path d="M9 10h6M9 14h6"/>
  </svg>`);

  fs.writeFileSync(file, content);
}

fixShapes('components/sports/GercekView.tsx');
fixShapes('components/sports/RainbetTopNav.tsx');
fixShapes('components/Spor724View.tsx');

console.log("Custom shapes and typography upgraded");
