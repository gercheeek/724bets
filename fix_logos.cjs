const fs = require('fs');

function fixLogos(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // 1. Scores to white instead of green
  content = content.replace(/className="text-\[#10b981\] font-black text-sm">\{match\.team1\.score\}/g, 'className="text-white font-black text-sm">{match.team1.score}');
  content = content.replace(/className="text-\[#10b981\] font-black text-sm">\{match\.team2\.score\}/g, 'className="text-white font-black text-sm">{match.team2.score}');

  // 2. Wrap team logos in a sleek crest frame
  // Original: <span className="text-sm shrink-0">{match.team1.logo}</span>
  content = content.replace(/<span className="text-sm shrink-0">\{match\.team1\.logo\}<\/span>/g, '<div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a1b1e] to-[#121316] border border-white/10 flex items-center justify-center shadow-sm shrink-0"><span className="text-xs">{match.team1.logo}</span></div>');
  content = content.replace(/<span className="text-sm shrink-0">\{match\.team2\.logo\}<\/span>/g, '<div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a1b1e] to-[#121316] border border-white/10 flex items-center justify-center shadow-sm shrink-0"><span className="text-xs">{match.team2.logo}</span></div>');

  fs.writeFileSync(file, content);
}

fixLogos('components/sports/GercekView.tsx');
fixLogos('components/sports/MatchListV2.tsx');
fixLogos('components/sports/MatchCardV2.tsx');
console.log("Logos and scores upgraded");
