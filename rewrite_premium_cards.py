import os

file_path = 'components/sports/MatchCard.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# I will completely rewrite the MatchCard component using a regex or simple string replacement.
# But string replacement is safer.
start_marker = "export const MatchCard: React.FC<MatchCardProps> = memo(({ match, isGoal, onSelect }) => {"
end_marker = "});"

start_idx = content.find(start_marker)
end_idx = content.rfind(end_marker) + len(end_marker)

new_match_card = """export const MatchCard: React.FC<MatchCardProps> = memo(({ match, isGoal, onSelect }) => {
  const { betSlip, addSelection } = useBetSlip();
  const isTennis = match.sport?.toLowerCase().includes('tenis') || match.sport?.toLowerCase().includes('tennis');

  const homeScore = isTennis ? (match.info?.score1 || '0') : (String(match.score || '-').split(' - ')[0] || '0');
  const awayScore = isTennis ? (match.info?.score2 || '0') : (String(match.score || '-').split(' - ')[1] || '0');

  const getStatusText = () => {
    if (match.isLive && match.minute) return match.minute;
    if (match.isLive) return "Live";
    if (match.matchDate) return `${match.matchDate}, ${match.startTime}`;
    return match.startTime;
  };

  const handleBetClick = (e: React.MouseEvent, id: string, name: string, odd: string, marketName: string) => {
    e.stopPropagation();
    if (!odd || odd === '-') return;
    addSelection({
      id: `${match.id}_${id}`,
      matchId: match.id,
      matchName: `${match.home} - ${match.away}`,
      marketName: marketName,
      selectionName: name,
      odd: parseFloat(odd)
    });
  };

  const isSelected = (id: string) => betSlip.some(s => s.id === `${match.id}_${id}`);

  return (
    <div 
      onClick={() => onSelect && onSelect(match)}
      className={`bg-[#161a20] p-3.5 flex flex-col gap-3 group relative transition-colors border-b border-white/5 hover:bg-[#1a1e24] cursor-pointer w-full mb-[1px]`}
    >
      {/* Goal Overlay */}
      {isGoal && (
        <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none border border-emerald-500/50 animate-pulse z-0"></div>
      )}

      {/* Header: League & Status */}
      <div className="flex justify-between items-center z-10 w-full mb-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8a929a] uppercase tracking-wider">
           <span className="truncate max-w-[200px]">{match.country ? `${match.country} • ` : ''}{match.league}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-bold ${match.isLive ? 'text-[#00ff87]' : 'text-[#8a929a]'}`}>
                {getStatusText()}
            </span>
            {match.isLive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff87] animate-pulse"></div>
            )}
        </div>
      </div>

      {/* Teams & Scores */}
      <div className="flex justify-between items-center z-10 w-full mb-2">
         {/* Teams */}
         <div className="flex flex-col gap-2.5 w-[60%]">
            <div className="flex items-center gap-3">
               <PlayerLogo name={match.home} url={match.homeLogo} isFootball={true} />
               <span className="text-[14px] font-semibold text-white truncate">{match.home}</span>
            </div>
            <div className="flex items-center gap-3">
               <PlayerLogo name={match.away} url={match.awayLogo} isFootball={true} />
               <span className="text-[14px] font-semibold text-white truncate">{match.away}</span>
            </div>
         </div>

         {/* Scores */}
         {match.isLive && (
             <div className="flex flex-col gap-2.5 items-end pr-4 w-[15%]">
                <span className="text-[15px] font-bold text-white">{homeScore}</span>
                <span className="text-[15px] font-bold text-white">{awayScore}</span>
             </div>
         )}

         {/* Odds Buttons */}
         <div className="flex items-center gap-1.5 w-[25%] ml-auto">
            {[{id: match.homeId, name: '1', odd: match.homeOdd}, 
              {id: match.drawId, name: 'X', odd: match.drawOdd}, 
              {id: match.awayId, name: '2', odd: match.awayOdd}].map((btn) => (
                <button
                  key={btn.id}
                  onClick={(e) => handleBetClick(e, btn.id, btn.name, btn.odd, 'Maç Sonucu')}
                  className={`flex-1 flex flex-col md:flex-row items-center justify-between px-2.5 py-2 rounded-md transition-all font-semibold text-[13px] border border-transparent ${
                    isSelected(btn.id)
                      ? 'bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                      : btn.odd && btn.odd !== '-'
                        ? 'bg-[#222730] hover:bg-[#2a303c] text-white hover:border-white/10'
                        : 'bg-[#1c2027] text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <span className={`text-[11px] ${isSelected(btn.id) ? 'text-black/70' : 'text-[#8a929a]'}`}>{btn.name}</span>
                  <div className={isSelected(btn.id) ? 'text-black font-bold' : ''}>
                    <AnimatedOdd value={btn.odd} />
                  </div>
                </button>
            ))}
         </div>
      </div>
    </div>
  );
});"""

final_content = content[:start_idx] + new_match_card + content[end_idx:]

with open(file_path, 'w') as f:
    f.write(final_content)
    
print("Updated MatchCard.tsx")
