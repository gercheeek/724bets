import React, { useState } from 'react';
import { X, Star, BarChart2 } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';

export const MatchDetailModal: React.FC<{ match: any; onClose: () => void }> = ({ match, onClose }) => {
  const { betSelections, toggleBetSelection } = useBetting();
  const [activeTab, setActiveTab] = useState('full_event|0');

  if (!match || !match.data) return null;

  const mData = match.data;
  const homeTeam = mData.tournament?.competitors?.home?.name || 'Ev Sahibi';
  const awayTeam = mData.tournament?.competitors?.away?.name || 'Deplasman';
  const score = mData.score ? `${mData.score.home} - ${mData.score.away}` : '0 - 0';
  const status = mData.status === 'started' ? 'Canlı' : 'Başlamadı';
  const minute = mData.minute ? `${mData.minute}'` : '';

  const groupMarkets = mData.group_markets || {};
  const groupKeys = Object.keys(groupMarkets);

  const formatGroupName = (key: string) => {
    if (key.includes('full_event')) return 'Maç Sonucu';
    if (key.includes('half_time|1')) return '1. Yarı';
    if (key.includes('half_time|2')) return '2. Yarı';
    if (key.includes('current')) return 'Canlı Marketler';
    return key;
  };

  const getMarketsFromGroup = (groupKey: string) => {
    const marketsStrs = groupMarkets[groupKey] || [];
    const parsedMarkets: Record<string, any[]> = {};

    marketsStrs.forEach((mStr: string) => {
      const parts = mStr.split('|');
      if (parts.length < 3) return;
      const marketName = parts[1]; // e.g. "1x2", "Alt/Üst"
      const selectionsStr = parts.slice(2).join('|'); // e.g. "~home~1.17~...~1~"
      
      const selections: any[] = [];
      const regex = /~([^~]+)~([\d.]+)~[\d.]+~[\d.]+~1~/g;
      let matchExec;
      while ((matchExec = regex.exec(selectionsStr)) !== null) {
        selections.push({
          name: matchExec[1],
          odd: parseFloat(matchExec[2])
        });
      }

      if (selections.length > 0) {
        if (!parsedMarkets[marketName]) parsedMarkets[marketName] = [];
        parsedMarkets[marketName].push(...selections);
      }
    });

    return parsedMarkets;
  };

  const activeMarkets = getMarketsFromGroup(activeTab);

  const formatSelectionName = (name: string) => {
    if (name === 'home') return homeTeam;
    if (name === 'away') return awayTeam;
    if (name === 'draw' || name === 'x') return 'Beraberlik';
    if (name === 'over') return 'Üst';
    if (name === 'under') return 'Alt';
    if (name === 'yes') return 'Evet';
    if (name === 'no') return 'Hayır';
    return name;
  };

  const isSelected = (marketName: string, selName: string) => {
    return betSelections.some(b => 
      b.matchId === match.id && 
      b.marketName === marketName && 
      b.selectionName === selName
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#1A1D24] rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#20252D] border-b border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {homeTeam} <span className="text-[#10B981] mx-2">{score}</span> {awayTeam}
              </h2>
              <div className="text-xs text-zinc-400 flex items-center gap-2">
                <span className="text-[#10B981] font-bold">{status} {minute}</span>
                <span>•</span>
                <span>{mData.tournament?.category?.name} - {mData.tournament?.name}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white">
              <BarChart2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-[#10B981]">
              <Star className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#1A1D24] p-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-white/5 scrollbar-hide">
            {groupKeys.map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-bold rounded-xl transition-colors ${
                  activeTab === key 
                    ? 'bg-[#10B981] text-black' 
                    : 'bg-[#2A313C] text-zinc-400 hover:bg-[#323A47] hover:text-white'
                }`}
              >
                {formatGroupName(key)}
              </button>
            ))}
          </div>

          {/* Markets List */}
          <div className="flex flex-col gap-4">
            {Object.keys(activeMarkets).length === 0 && (
              <div className="text-center py-10 text-zinc-500">Bu kategori için market bulunamadı.</div>
            )}
            
            {Object.entries(activeMarkets).map(([marketName, selections]) => (
              <div key={marketName} className="bg-[#20252D] rounded-xl border border-white/5 overflow-hidden">
                <div className="px-4 py-3 bg-[#2A313C] border-b border-white/5 font-bold text-sm text-zinc-200">
                  {marketName}
                </div>
                <div className="p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selections.map((sel, idx) => {
                    const fName = formatSelectionName(sel.name);
                    const selected = isSelected(marketName, fName);
                    return (
                      <button
                        key={`${sel.name}-${idx}`}
                        onClick={() => toggleBetSelection(match, marketName, fName, sel.odd)}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors border ${
                          selected 
                            ? 'bg-[#10B981]/10 border-[#10B981] text-white' 
                            : 'bg-[#1A1D24] border-white/5 text-zinc-400 hover:bg-[#2A313C] hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-semibold">{fName}</span>
                        <span className={`text-sm font-bold ${selected ? 'text-[#10B981]' : 'text-white'}`}>
                          {sel.odd.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
