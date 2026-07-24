const fs = require('fs');

function fixRealLogos(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace the crest frame with the UI-avatars image
  // It currently looks like:
  // <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1a1b1e] to-[#121316] border border-white/10 flex items-center justify-center shadow-sm shrink-0"><span className="text-xs">{match.team1.logo}</span></div>
  
  content = content.replace(/<div className="w-6 h-6 rounded-full bg-gradient-to-br from-\[#1a1b1e\] to-\[#121316\] border border-white\/10 flex items-center justify-center shadow-sm shrink-0"><span className="text-xs">\{match\.team1\.logo\}<\/span><\/div>/g, 
  '<img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team1.name)}&background=random&color=fff&rounded=true&bold=true&size=48`} className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm shrink-0" alt={match.team1.name} />');

  content = content.replace(/<div className="w-6 h-6 rounded-full bg-gradient-to-br from-\[#1a1b1e\] to-\[#121316\] border border-white\/10 flex items-center justify-center shadow-sm shrink-0"><span className="text-xs">\{match\.team2\.logo\}<\/span><\/div>/g, 
  '<img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team2.name)}&background=random&color=fff&rounded=true&bold=true&size=48`} className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm shrink-0" alt={match.team2.name} />');

  // Also catch if I missed it in some places
  content = content.replace(/<span className="text-sm shrink-0">\{match\.team1\.logo\}<\/span>/g, 
  '<img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team1.name)}&background=random&color=fff&rounded=true&bold=true&size=48`} className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm shrink-0" alt={match.team1.name} />');

  content = content.replace(/<span className="text-sm shrink-0">\{match\.team2\.logo\}<\/span>/g, 
  '<img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team2.name)}&background=random&color=fff&rounded=true&bold=true&size=48`} className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm shrink-0" alt={match.team2.name} />');

  fs.writeFileSync(file, content);
}

fixRealLogos('components/sports/GercekView.tsx');
fixRealLogos('components/sports/MatchListV2.tsx');
fixRealLogos('components/sports/MatchCardV2.tsx');
console.log("Real logos via ui-avatars added");
