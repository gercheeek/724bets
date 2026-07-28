import React from 'react';

interface TeamLogoPlaceholderProps {
  teamName: string;
  className?: string;
}

const knownColors: Record<string, [string, string]> = {
  // Türkiye
  'galatasaray': ['#a32638', '#f3a000'],
  'fenerbahçe': ['#00105b', '#f9db00'],
  'fenerbahce': ['#00105b', '#f9db00'],
  'beşiktaş': ['#000000', '#ffffff'],
  'besiktas': ['#000000', '#ffffff'],
  'trabzonspor': ['#800000', '#0099cc'],
  'başakşehir': ['#ff6600', '#000066'],
  
  // Avrupa
  'real madrid': ['#ffffff', '#00529f'],
  'barcelona': ['#004d98', '#a50044'],
  'atletico madrid': ['#cb3524', '#ffffff'],
  'manchester united': ['#da291c', '#000000'],
  'manchester city': ['#6cabdd', '#ffffff'],
  'arsenal': ['#ef0107', '#ffffff'],
  'chelsea': ['#034694', '#ffffff'],
  'liverpool': ['#c8102e', '#f6eb61'],
  'bayern': ['#dc052d', '#0066b2'],
  'dortmund': ['#fde100', '#000000'],
  'juventus': ['#000000', '#ffffff'],
  'milan': ['#fb090b', '#000000'],
  'inter': ['#005ca5', '#000000'],
  'napoli': ['#12a0d7', '#ffffff'],
  'roma': ['#8e1f2f', '#f0b515'],
  'cannes': ['#cc0000', '#ffffff'], // AS Cannes usually red/white
  'paris': ['#004170', '#da291c'],
};

const colors = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', 
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', 
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#1e293b', '#ffffff'
];

const getColorsForTeam = (name: string | undefined): [string, string] => {
  if (!name) return ['#334155', '#475569']; // Fallback slate colors
  const normalized = name.toLowerCase().trim();
  
  // Check known teams
  for (const key in knownColors) {
    if (normalized.includes(key)) {
      return knownColors[key];
    }
  }

  // Hash-based fallback
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const idx1 = Math.abs(hash) % colors.length;
  const idx2 = Math.abs(hash * 31) % colors.length;
  
  return [colors[idx1], colors[idx2 !== idx1 ? idx2 : (idx1 + 1) % colors.length]];
};

export const TeamLogoPlaceholder: React.FC<TeamLogoPlaceholderProps> = ({ teamName, className = "w-5 h-5" }) => {
  const [color1, color2] = getColorsForTeam(teamName);
  const initials = teamName ? teamName.substring(0, 2).toUpperCase() : '??';

  return (
    <div className={`relative flex items-center justify-center drop-shadow-md rounded-full overflow-hidden ${className}`}>
      {/* Background segments (parça parça look) */}
      <div className="absolute inset-0" style={{ backgroundColor: color1 }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full" style={{ backgroundColor: color2 }}></div>
      <div className="absolute bottom-0 left-0 w-full h-1/2" style={{ backgroundColor: color2, opacity: 0.8 }}></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2" style={{ backgroundColor: color1 }}></div>
      
      {/* Inner shadow/overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
      
      {/* Initials */}
      <span className="relative z-10 text-white font-black tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" style={{ fontSize: '45%', lineHeight: 1 }}>
        {initials}
      </span>
    </div>
  );
};
