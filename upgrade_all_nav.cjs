const fs = require('fs');

function upgradeFile(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix the rendering structure in GercekView
  // Replace the circle background
  content = content.replace(
    /className="w-\[64px\] h-\[64px\] md:w-\[72px\] md:h-\[72px\] rounded-full bg-\[#18191c\] border border-\[#252b3b\] shadow-lg flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-\[0_15px_30px_rgba\(0,0,0,0\.5\)\] group-hover:border-\[#30374b\] group-hover:bg-\[#25262b\]"/g,
    'className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-full bg-gradient-to-b from-[#1a1b1e] to-[#121316] border border-white/5 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover:border-white/20 group-hover:from-[#202126] group-hover:to-[#1a1b1e] relative overflow-hidden"'
  );

  // Replace count badge
  content = content.replace(
    /className="absolute -top-1 -right-2 bg-\[#25262b\] text-white\/80 text-\[11px\] md:text-xs font-black px-2 py-0\.5 rounded-full border border-\[#1a1f2e\] shadow-sm"/g,
    'className="absolute -top-1 -right-1 backdrop-blur-md bg-white/10 text-white text-[10px] md:text-[11px] font-black px-2 py-0.5 rounded-full border border-white/10 shadow-xl"'
  );

  // Replace sport name text
  content = content.replace(
    /className="text-sm md:text-\[15px\] font-black text-\[#8a94a6\] group-hover:text-white transition-colors"/g,
    'className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#8a94a6] group-hover:text-white transition-colors"'
  );

  // Fix SVGs for Hokey, Beyzbol, Masa Tenisi, Dövüş San., Voleybol, Kriket
  
  // Hokey - Abstract crossed lines
  content = content.replace(
    /<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1\.5"><path d="M16 4l-6 12h-4a2 2 0 0 0 0 4h5l7-14z"\/><circle cx="7" cy="12" r="2" fill="currentColor"\/><\/svg>/g,
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 20L20 4M20 20L4 4" strokeLinecap="square"/><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M4 4h4v4H4z" fill="currentColor"/></svg>`
  );

  // Beyzbol - Abstract diamond grid
  content = content.replace(
    /<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1\.5">[\s]*<polygon points="12 2 22 8 22 16 12 22 2 16 2 8 12 2" strokeLinejoin="round"\/>[\s]*<polygon points="12 6 17 10 17 15 12 19 7 15 7 10 12 6" strokeDasharray="1 2"\/>[\s]*<circle cx="12" cy="12" r="2" fill="currentColor"\/>[\s]*<\/svg>/g,
    // Note: since the previous script replaced Beyzbol and Voleybol with the Futbol SVG, this regex will match the FUTBOL SVG under Beyzbol.
    // Actually it's safer to just replace the whole SPORTS_NAV block.
    // I will replace it below.
    ''
  );

  fs.writeFileSync(file, content);
}

upgradeFile('components/sports/GercekView.tsx');

let gercekContent = fs.readFileSync('components/sports/GercekView.tsx', 'utf8');

const newSportsNav = `const SPORTS_NAV = [
  { id: 'futbol', name: 'Futbol', count: '99+', color: '#ffffff', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 22 8 22 16 12 22 2 16 2 8 12 2" strokeLinejoin="round"/>
      <polygon points="12 6 17 10 17 15 12 19 7 15 7 10 12 6" strokeDasharray="1 2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  )},
  { id: 'basketbol', name: 'Basketbol', count: '28', color: '#fb923c', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" strokeDasharray="4 2"/>
      <path d="M12 2v20M2 12h20"/>
      <path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" strokeDasharray="1 4"/>
    </svg>
  )},
  { id: 'tenis', name: 'Tenis', count: '99+', color: '#bef264', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 12l10 10 10-10L12 2z"/>
      <path d="M6 12h12M12 6v12" strokeDasharray="1 3"/>
    </svg>
  )},
  { id: 'amfutbol', name: 'Am. Futbolu', count: '67', color: '#f87171', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12C2 6 7 2 12 2s10 4 10 10-5 10-10 10S2 18 2 12z" strokeDasharray="5 2"/>
      <path d="M12 6v12"/>
      <path d="M9 10h6M9 14h6"/>
    </svg>
  )},
  { id: 'hokey', name: 'Hokey', count: '37', color: '#22d3ee', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 20L20 4M20 20L4 4" strokeLinecap="square"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
      <path d="M4 4h4v4H4z" fill="currentColor"/>
    </svg>
  )},
  { id: 'beyzbol', name: 'Beyzbol', count: '14', color: '#fbbf24', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L22 12L12 22L2 12Z" strokeDasharray="2 3"/>
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  )},
  { id: 'masatenisi', name: 'Masa Tenisi', count: '99+', color: '#4ade80', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="10" width="16" height="4" rx="1"/>
      <path d="M12 14v6M10 20h4"/>
      <circle cx="12" cy="6" r="2" fill="currentColor"/>
    </svg>
  )},
  { id: 'mma', name: 'Dövüş San.', count: '53', color: '#f43f5e', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 19 9 12 16 5 9 12 2" />
      <polygon points="12 10 17 15 12 22 7 15 12 10" fill="currentColor"/>
    </svg>
  )},
  { id: 'voleybol', name: 'Voleybol', count: '7', color: '#a78bfa', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" strokeDasharray="3 3"/>
      <path d="M12 2c0 6 4 10 10 10M2 12c6 0 10 4 10 10M12 22c0-6-4-10-10-10M22 12c-6 0-10-4-10-10"/>
    </svg>
  )},
  { id: 'kriket', name: 'Kriket', count: '1', color: '#fcd34d', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 14l6-6M10 20l6-6" strokeDasharray="2 2"/>
      <rect x="14" y="4" width="6" height="6" fill="currentColor" transform="rotate(45 17 7)"/>
      <circle cx="6" cy="18" r="2"/>
    </svg>
  )}
];`;

const startIndex = gercekContent.indexOf('const SPORTS_NAV = [');
const endIndex = gercekContent.indexOf('export const GercekView: React.FC = () => {');

if (startIndex !== -1 && endIndex !== -1) {
  gercekContent = gercekContent.substring(0, startIndex) + newSportsNav + '\n\n' + gercekContent.substring(endIndex);
  fs.writeFileSync('components/sports/GercekView.tsx', gercekContent);
}

console.log("All geometric shapes and rendering updated");
