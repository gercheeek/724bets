const fs = require('fs');
const code = fs.readFileSync('components/RewardsPage.tsx', 'utf8');
const lines = code.split('\n');

const heroBannerLines = lines.slice(53, 305);
const howItWorksLines = lines.slice(336, 388);

const vipHero = `import React, { useRef, useState } from 'react';
import { Zap, ArrowRight, Star, ChevronRight, Info, Crown } from 'lucide-react';

${heroBannerLines.join('\n')}

export default HeroBanner;
`;

const howItWorks = `import React from 'react';

export default function HowItWorksCards() {
  return (
    <div className="w-full">
${howItWorksLines.join('\n')}
    </div>
  );
}
`;

fs.writeFileSync('components/VIPHeroBanner.tsx', vipHero);
fs.writeFileSync('components/HowItWorksCards.tsx', howItWorks);

console.log("Extraction complete.");
