const fs = require('fs');

function upgradeFile(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // 1. League Container: Add glass edge
  content = content.replace(/className="bg-\[#101114\] border border-white\/5 rounded-xl overflow-hidden shadow-lg"/g, 'className="bg-[#101114] border border-white/5 border-t-white/10 rounded-xl overflow-hidden shadow-2xl"');

  // 2. Team Names: Make them font-black and slightly larger (14px -> 15px)
  content = content.replace(/className="text-sm font-bold text-white truncate"/g, 'className="text-[15px] font-black text-white truncate tracking-tight"');

  // 3. Scores: Put them in premium floating badges
  content = content.replace(/<span className="text-\[#4ade80\] font-black text-sm shrink-0">\{match.team1.score\}<\/span>/g, '<div className="bg-[#1a1b1e] border border-white/5 rounded px-2.5 py-0.5 min-w-[32px] flex items-center justify-center shadow-inner"><span className="text-[#10b981] font-black text-sm">{match.team1.score}</span></div>');
  content = content.replace(/<span className="text-\[#4ade80\] font-black text-sm shrink-0">\{match.team2.score\}<\/span>/g, '<div className="bg-[#1a1b1e] border border-white/5 rounded px-2.5 py-0.5 min-w-[32px] flex items-center justify-center shadow-inner"><span className="text-[#10b981] font-black text-sm">{match.team2.score}</span></div>');

  // 4. Odds Labels ('1', 'X', '2'): Make them look more like a professional sportsbook (dimmer, smaller)
  content = content.replace(/<span className="text-\[10px\] text-slate-500 font-medium leading-none mb-1">1<\/span>/g, '<span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">1</span>');
  content = content.replace(/<span className="text-\[10px\] text-slate-500 font-medium leading-none mb-1">X<\/span>/g, '<span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">X</span>');
  content = content.replace(/<span className="text-\[10px\] text-slate-500 font-medium leading-none mb-1">2<\/span>/g, '<span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">2</span>');

  // 5. Odds Values: Make them pop more
  content = content.replace(/<span className="text-sm font-bold leading-none">\{match.odds.home\}<\/span>/g, '<span className="text-[15px] font-black leading-none tracking-tight">{match.odds.home}</span>');
  content = content.replace(/<span className="text-sm font-bold leading-none">\{match.odds.draw\}<\/span>/g, '<span className="text-[15px] font-black leading-none tracking-tight">{match.odds.draw}</span>');
  content = content.replace(/<span className="text-sm font-bold leading-none">\{match.odds.away\}<\/span>/g, '<span className="text-[15px] font-black leading-none tracking-tight">{match.odds.away}</span>');

  // 6. Odds Buttons container radius
  content = content.replace(/className={\`flex-1 md:w-\[65px\] h-11 flex flex-col items-center justify-center rounded-lg border transition-all \$\{/g, 'className={`flex-1 md:w-[65px] h-[46px] flex flex-col items-center justify-center rounded-md border transition-all ${');

  // 7. Live Pulse badge text
  content = content.replace(/<span className="text-\[#10b981\] text-xs font-bold">\{match.minute\}<\/span>/g, '<span className="text-[#10b981] text-[13px] font-black tracking-tight">{match.minute}</span>');

  fs.writeFileSync(file, content);
}

upgradeFile('components/sports/GercekView.tsx');
upgradeFile('components/sports/MatchListV2.tsx');
upgradeFile('components/sports/MatchCardV2.tsx');
console.log("Ultra premium upgrades applied");
