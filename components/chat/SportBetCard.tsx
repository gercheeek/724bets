import React, { useState } from 'react';
import { MessageCircle, PlayCircle, Crown, Star, CheckCircle2, TrendingUp, TrendingDown, Users, Share2, Bot, Target, Flame, ChevronDown } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';

interface SportBetCardProps {
    bet: any;
    siteUser: any;
}

export default function SportBetCard({ bet, siteUser }: SportBetCardProps) {
    const [votes, setVotes] = useState({ hot: 45, cold: 12 });
    const [userVoted, setUserVoted] = useState<'hot' | 'cold' | null>(null);
    const [showThread, setShowThread] = useState(false);
    const [showCombo, setShowCombo] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default for a clean chat
    const [shared, setShared] = useState(false);
    const [comments, setComments] = useState([
        { id: '1', user: 'Ahmet99', text: 'Bu maç kesin yatar aga, Madrid eksik.', time: '12:05' },
        { id: '2', user: 'Veli_Can', text: 'Zor maç ama oran denemeye değer.', time: '12:07' }
    ]);
    const [newComment, setNewComment] = useState('');
    const [betAdded, setBetAdded] = useState(false);
    const { addSelection } = useBetSlip();
    
    // Interactions State
    const [reactions, setReactions] = useState(bet.reactions || { fire: 0, rocket: 0, money: 0, clown: 0 });
    const [userReaction, setUserReaction] = useState<string | null>(null);
    const [copyCount, setCopyCount] = useState(bet.copyCount || 0);

    // Gamification & Profile States
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handlePlayBet = () => {
        if (!siteUser) {
            window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { message: 'Bu efsane kuponu anında oynamak veya sohbete katılmak için hemen aramıza katıl!' } }));
            return;
        }
        if (betAdded) return;
        // Mock generating a selection from the chat bet
        const mockSelection = {
            id: `chat_bet_${Math.random().toString(36).substring(7)}`,
            match: bet.title || 'Sohbet Kuponu',
            pick: 'Maç Sonucu 1',
            odds: parseFloat(bet.odds) || 1.85,
        };
        addSelection(mockSelection);
        setBetAdded(true);
        setCopyCount(prev => prev + 1);
        setTimeout(() => setBetAdded(false), 3000);
    };
    
    const handleReaction = (type: string) => {
        if (!siteUser) {
            window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { message: 'Reaksiyon bırakmak için giriş yapmalısın!' } }));
            return;
        }
        
        if (userReaction === type) {
            // Remove reaction
            setReactions(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
            setUserReaction(null);
        } else {
            // Change or add reaction
            setReactions(prev => {
                const newReacts = { ...prev };
                if (userReaction) {
                    newReacts[userReaction] = Math.max(0, newReacts[userReaction] - 1);
                }
                newReacts[type] = (newReacts[type] || 0) + 1;
                return newReacts;
            });
            setUserReaction(type);
        }
    };

    const handleVote = (type: 'hot' | 'cold') => {
        if (!siteUser) {
            window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { message: 'Bu kuponu oylamak için hemen aramıza katıl!' } }));
            return;
        }
        if (userVoted === type) return;
        setVotes(prev => ({
            hot: type === 'hot' ? prev.hot + 1 : (userVoted === 'hot' ? prev.hot - 1 : prev.hot),
            cold: type === 'cold' ? prev.cold + 1 : (userVoted === 'cold' ? prev.cold - 1 : prev.cold)
        }));
        setUserVoted(type);
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setComments([...comments, { id: Math.random().toString(), user: siteUser?.username || 'Misafir', text: newComment, time: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}) }]);
        setNewComment('');
    };

    const totalVotes = votes.hot + votes.cold;
    const hotPercent = totalVotes > 0 ? Math.round((votes.hot / totalVotes) * 100) : 0;
    
    // Safe parse for amount and odds
    const parsedAmount = parseFloat(String(bet.amount || '0').replace(/\./g, '').replace(',', '.')) || 0;
    const parsedOdds = parseFloat(String(bet.odds || '0')) || 0;
    const potentialWin = (parsedAmount * parsedOdds).toLocaleString('tr-TR');
    
    const getUserColor = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 85%, 70%)`; // Pastel Neon Color
    };
    
    const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : 'B';
    
    const uName = bet.user || bet.username || 'Bettor';
    const uColor = getUserColor(uName);
    
    const isMythic = parsedOdds >= 50;

    return (
        <div className="relative w-full">
            {/* Profile Popover rendered OUTSIDE the overflow-hidden wrapper */}
            {showProfilePopup && (
                <div className="absolute top-12 left-4 w-[260px] bg-[#0B0E14]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.05)] z-[100] p-4 animate-fade-in" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] shadow-lg ${bet.role === 'ADMIN' ? 'border-yellow-500/80 shadow-yellow-500/20' : bet.role === 'VIP' ? 'border-purple-500/80 shadow-purple-500/20' : 'border-white/20'}`} style={{ background: `linear-gradient(135deg, ${uColor}40 0%, transparent 100%)`, color: uColor, textShadow: `0 0 12px ${uColor}` }}>
                            <span className="text-[18px] font-black">{getInitials(uName)}</span>
                        </div>
                        <div>
                            <h4 className="text-white font-black text-[16px] tracking-tight">{uName}</h4>
                            <p className={`text-[10px] font-black tracking-widest uppercase mt-0.5 ${bet.role === 'ADMIN' ? 'text-yellow-500' : bet.role === 'VIP' ? 'text-purple-400' : 'text-zinc-400'}`}>{bet.role === 'ADMIN' ? 'SİSTEM KRALI' : bet.role === 'VIP' ? 'VIP Bettor' : 'STANDART'}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-[#12151D] border border-white/5 rounded-xl p-2.5 text-center flex flex-col justify-center">
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Aylık Win Rate</div>
                            <div className="text-[16px] text-[#00E676] font-black tracking-tight drop-shadow-[0_0_5px_rgba(0,230,118,0.4)]">%{(Math.random() * 20 + 65).toFixed(1)}</div>
                        </div>
                        <div className="bg-[#12151D] border border-white/5 rounded-xl p-2.5 text-center flex flex-col justify-center">
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1">En Büyük Kazanç</div>
                            <div className="text-[13px] text-white font-black">{(Math.random() * 80000 + 20000).toLocaleString('tr-TR')} ₺</div>
                        </div>
                    </div>
                    <button className="w-full py-2.5 bg-gradient-to-r from-[#00E5FF] to-blue-500 text-[#06080C] font-black text-[13px] tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] transition-all">
                        TAKİP ET
                    </button>
                </div>
            )}

            {/* Trending Badge (Rendered OUTSIDE overflow-hidden) */}
            {(copyCount > 10 || Object.values(reactions).reduce((a,b)=>a+b,0) > 10) && (
                 <div className="absolute -top-3.5 left-3 z-[110] animate-fade-in pointer-events-none">
                     <div className="bg-[#1A0B05]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)] flex items-center gap-1.5 uppercase">
                         <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" /> 
                         <span className="text-[10px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">HOT TREND</span>
                     </div>
                 </div>
            )}

            <div className={`relative w-full bg-[#0F141E]/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-500 ease-out flex flex-col group hover:bg-[#121824]/90 ${isMythic ? 'border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(217,70,239,0.5)]' : 'border-white/[0.05] shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:border-[#00E5FF]/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(0,229,255,0.1)]'}`}>
                {isMythic && (
                    <div className="absolute inset-0 z-0 pointer-events-none rounded-2xl animate-pulse bg-gradient-to-tr from-transparent via-fuchsia-500/10 to-transparent"></div>
                )}
                 {/* User Info & Header (Clickable to Toggle) */}
                <div 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`px-3 flex items-center justify-between relative cursor-pointer group/header hover:bg-white/[0.01] transition-colors ${isExpanded ? 'py-2.5 border-b border-white/[0.02]' : 'py-2'}`}
                >
                    {/* Background glow for VIPs - Softened */}
                    {(bet.role === 'ADMIN' || bet.role === 'VIP') && (
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none rounded-3xl"></div>
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10 w-full">
                        {/* Avatar - Softened glows */}
                        <div className="relative shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); setShowProfilePopup(!showProfilePopup); }}>
                            <div className={`w-8 h-8 rounded-full bg-[#12151D] flex items-center justify-center border overflow-hidden ${bet.role === 'ADMIN' ? 'border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.15)]' : bet.role === 'VIP' ? 'border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.15)]' : 'border-white/10'}`}>
                                <div 
                                     className="w-full h-full flex items-center justify-center text-[12px] font-black tracking-wider shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                                 style={{ 
                                     background: `linear-gradient(135deg, ${uColor}20 0%, transparent 100%)`, 
                                     color: uColor,
                                     textShadow: `0 0 12px ${uColor}90` 
                                 }}
                             >
                                 {getInitials(uName)}
                             </div>
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#00E676] border-2 border-[#0F141E] rounded-full shadow-sm"></span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-1.5">
                            {/* User Name */}
                            <span className="font-bold tracking-wide truncate text-[13px] text-zinc-100">
                                {bet.user || bet.username}
                            </span>
                            {/* Badges act as the primary color indicator */}
                            {bet.role === 'ADMIN' && <Crown className="w-3.5 h-3.5 text-yellow-500 shrink-0 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]" />}
                            {bet.role === 'VIP' && <Star className="w-3.5 h-3.5 text-purple-400 shrink-0 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]" />}
                            
                            {/* Role Badges */}
                            {isExpanded && (bet.role === 'ADMIN' || bet.role === 'VIP') && (
                                <div className="flex gap-1 ml-1 opacity-80">
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-0.5">
                                        <Flame className="w-3 h-3 text-yellow-500" />
                                    </div>
                                    <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded p-0.5">
                                        <Target className="w-3 h-3 text-[#00E5FF]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sub-info */}
                        <div className="flex items-center gap-1 mt-0.5 truncate">
                            {isExpanded ? (
                                <>
                                    <span className="text-[10px] font-medium text-zinc-500">{bet.time}</span>
                                    {(bet.role === 'ADMIN' || bet.role === 'VIP') && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                            <span className="text-[9px] font-semibold tracking-wide text-[#00E676]">%82 Win Rate</span>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Preview */}
                                    <span className="text-[10px] text-zinc-300 font-medium truncate flex items-center gap-1">
                                        {bet.isBlurred && !isUnlocked ? (
                                            <span className="text-purple-400 font-bold">🔒 Gizemli VIP Kupon</span>
                                        ) : (
                                            <>
                                                <span className="text-zinc-500">{bet.isCombo ? '🔗' : '⚽'}</span>
                                                {bet.isCombo ? `${bet.matches?.length || 3} Maçlık Kombine` : 'Tekli Kupon'}
                                            </>
                                        )}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-white/10 shrink-0"></span>
                                    <span className="text-[10px] font-medium text-zinc-500 shrink-0">{bet.odds} Oran</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Win Amount & Chevron */}
                    <div className="flex items-center gap-3 shrink-0">
                        {!isExpanded && (
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[14px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-[#00C853] drop-shadow-[0_0_8px_rgba(0,230,118,0.3)]">{potentialWin} <span className="text-[#00E676] text-[11px]">₺</span></span>
                                {bet.status === 'cashed_out' ? (
                                    <span className="text-[8px] font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 backdrop-blur-md uppercase shadow-[0_0_10px_rgba(34,211,238,0.2)]">BOZDURULDU</span>
                                ) : bet.status === 'won' ? (
                                    <span className="text-[8px] font-black text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20 backdrop-blur-md uppercase shadow-[0_0_10px_rgba(234,179,8,0.2)]">KAZANDI</span>
                                ) : bet.isLive ? (
                                    <span className="text-[8px] font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20 backdrop-blur-md flex items-center gap-1 uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]"><span className="w-1 h-1 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>CANLI</span>
                                ) : (
                                    <span className="text-[8px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 uppercase">{bet.time || 'BAŞLAMADI'}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Bar (Copy & Odds) */}
            {!isExpanded && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent border-t border-white/[0.04] flex items-center justify-end">
                    <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setIsExpanded(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1 rounded-full text-[10px] font-black transition-all shadow-sm bg-gradient-to-r from-[#00E5FF] to-[#00B0FF] text-[#06080C] hover:from-[#00B0FF] hover:to-[#0091EA] border border-cyan-400/50 hover:border-cyan-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>GÖR</span>
                    </button>
                </div>
            )}


            {/* Expanded View (Full Details) */}
            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {/* Bet Details Area (Styled like Sports Bet Slip) */}
                <div className="px-4 py-3 relative">
                {bet.status === 'cashed_out' && (
                    <div className="absolute top-5 right-6 z-20 flex items-center justify-center pointer-events-none opacity-90">
                        <div className="w-[65px] h-[65px] border-[2px] border-cyan-500/60 rounded-full flex items-center justify-center transform rotate-12 bg-[#06080C]/40 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                            <span className="text-cyan-400 font-black text-[12px] tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] text-center leading-tight">CASH<br/>OUT</span>
                        </div>
                    </div>
                )}
                {bet.status === 'won' && (
                    <div className="absolute top-5 right-6 z-20 flex items-center justify-center pointer-events-none opacity-90">
                        <div className="w-[65px] h-[65px] border-[2px] border-yellow-500/60 rounded-full flex items-center justify-center transform rotate-12 bg-[#06080C]/40 backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                            <span className="text-yellow-400 font-black text-[14px] tracking-widest drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]">WIN</span>
                        </div>
                    </div>
                )}

                <div className={`relative bg-[#11141A] rounded-xl overflow-hidden border flex flex-col group transition-all ${bet.status === 'won' ? 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)]' : bet.status === 'cashed_out' ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]' : 'border-[#00E5FF]/20 shadow-[0_4px_15px_rgba(0,0,0,0.4)]'}`}>
                    {/* Left color bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${bet.status === 'won' ? 'from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.6)]' : bet.status === 'cashed_out' ? 'from-cyan-400 to-cyan-600 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : 'from-[#00E5FF] to-[#00b3cc] shadow-[0_0_10px_rgba(0,229,255,0.6)]'}`}></div>
                    
                    {/* Match & Odds */}
                    <div className="p-3 pl-4 relative">
                        {bet.isBlurred && !isUnlocked && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#06080C]/40 backdrop-blur-md rounded-r-xl p-4">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30 mb-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                    <span className="text-lg">🔒</span>
                                </div>
                                <span className="text-white font-black text-[13px] tracking-wide mb-0.5 text-center">GİZEMLİ VIP KUPON</span>
                                <span className="text-zinc-400 text-[10px] font-medium text-center mb-3">İçeriği görmek için kilidi aç</span>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setIsUnlocked(true); }}
                                    className="px-4 py-1.5 mt-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-bold text-[11px] shadow-lg hover:shadow-purple-500/50 transition-all"
                                >
                                    KİLİDİ AÇ
                                </button>
                            </div>
                        )}
                        
                        <div className={`transition-all duration-500 ${bet.isBlurred && !isUnlocked ? 'opacity-20 blur-[6px] select-none pointer-events-none' : 'opacity-100 blur-0'}`}>
                            {bet.isCombo ? (
                            <div className="flex flex-col gap-2">
                                {/* Show first match */}
                                <div className="flex items-start gap-2 w-full border-b border-white/5 pb-2">
                                    <span className={`rounded-full shadow-[0_0_5px_rgba(0,229,255,0.8)] shrink-0 mt-[6px] w-1.5 h-1.5 ${bet.status === 'won' ? 'bg-yellow-400' : 'bg-[#00E5FF]'}`} />
                                    <div className="text-white font-bold leading-tight flex-1 flex flex-col gap-1 text-[13px]">
                                        <span>{bet.matches[0].title}</span>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Seçim: <span className="text-white/80">{bet.matches[0].pick}</span></span>
                                            <span className="text-[#00E5FF] font-bold text-[11px]">{bet.matches[0].odds}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Toggle button for rest */}
                                <button onClick={() => setShowCombo(!showCombo)} className="flex items-center justify-between w-full py-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors">
                                    Tüm Maçları Gör ({bet.matches.length})
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCombo ? 'rotate-180' : ''}`} />
                                </button>
                                {/* Expanded matches */}
                                {showCombo && (
                                    <div className="flex flex-col gap-2 pt-1 animate-fade-in">
                                        {bet.matches.slice(1).map((m: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-2 w-full border-b border-white/5 pb-2 last:border-0 last:pb-0">
                                                <span className="rounded-full bg-zinc-600 shrink-0 mt-[6px] w-1.5 h-1.5" />
                                                <div className="text-white font-bold leading-tight flex-1 flex flex-col gap-1 text-[13px]">
                                                    <span>{m.title}</span>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">Seçim: <span className="text-white/80">{m.pick}</span></span>
                                                        <span className="text-[#00E5FF] font-bold text-[11px]">{m.odds}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5">
                                <div className="flex items-start gap-3 w-full relative">
                                    {/* Left vertical timeline indicator */}
                                    <div className="flex flex-col items-center mt-1.5 h-full">
                                        <span className={`rounded-full shrink-0 w-2 h-2 ${bet.status === 'won' ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)]'}`} />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/90 font-bold text-[13px] tracking-wide">{bet.title}</span>
                                            {bet.isLive && (
                                                <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                    <span className="text-[9px] font-black text-red-500 tracking-widest uppercase">Live</span>
                                                </div>
                                            )}
                                        </div>
                                        {bet.isLive && (
                                            <div className="text-[18px] font-black text-white tracking-tight drop-shadow-sm mt-0.5">{bet.matchScore}</div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-xl p-2.5 ml-5 mt-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-white/10 text-white/50 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">Seçim</span>
                                        <span className="text-white/90 font-bold text-[12px]">{bet.pick || 'Maç Sonucu 1'}</span>
                                    </div>
                                    <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded-lg px-2.5 py-0.5 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,229,255,0.1)]">
                                        <span className="font-black text-[13px] text-[#00E5FF]">
                                            {bet.odds}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Unified Wager/Win Strip inside the Match Box */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent border-t border-white/10 mt-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest whitespace-nowrap">Yatırılan:</span>
                            <span className="text-[13px] font-black text-white tracking-tight drop-shadow-md whitespace-nowrap">{bet.amount} ₺</span>
                        </div>
                        <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2 py-0.5 rounded text-[10px] font-black tracking-wider text-[#00E5FF] shadow-[inset_0_1px_3px_rgba(0,229,255,0.2)] whitespace-nowrap">
                            x{bet.odds}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[#00E676]/80 font-bold uppercase tracking-widest whitespace-nowrap">Kazanç:</span>
                            <span className="text-[14px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-[#00C853] drop-shadow-[0_0_8px_rgba(0,230,118,0.3)] whitespace-nowrap">{potentialWin} ₺</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interaction Bar (Voting & Actions) */}
            <div className="px-4 py-3 bg-[#06080C]/60 border-t border-white/[0.02] flex flex-col gap-3 relative">
                
                {/* Top Row: Voting segmented control & AI */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center p-1 bg-[#12151D] border border-white/5 rounded-2xl shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]">
                        <button 
                            onClick={() => handleVote('hot')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${userVoted === 'hot' ? 'bg-[#00E676]/10 text-[#00E676] shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <TrendingUp className={`w-4 h-4 ${userVoted === 'hot' ? 'text-[#00E676]' : ''}`} />
                            <span className="text-[12px] font-bold">{votes.hot}</span>
                        </button>
                        <div className="w-[1px] h-4 bg-white/5 mx-1"></div>
                        <button 
                            onClick={() => handleVote('cold')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${userVoted === 'cold' ? 'bg-red-500/10 text-red-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <TrendingDown className={`w-4 h-4 ${userVoted === 'cold' ? 'text-red-400' : ''}`} />
                            <span className="text-[12px] font-bold">{votes.cold}</span>
                        </button>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black tracking-tight text-[#00E676] drop-shadow-[0_0_5px_rgba(0,230,118,0.5)]">{hotPercent}%</span>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Tutar</span>
                        </div>
                        <div className="h-1.5 w-[70px] bg-[#12151D] rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] flex">
                            <div className="h-full bg-[#00E676] shadow-[0_0_8px_rgba(0,230,118,0.8)] transition-all duration-700 ease-out" style={{ width: `${hotPercent}%` }}></div>
                            <div className="h-full bg-red-500 transition-all duration-700 ease-out" style={{ width: `${100 - hotPercent}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Middle Row: Comments & AI Button */}
                <div className="flex items-center gap-3 mt-1">
                    <button 
                        onClick={() => {
                            if (!siteUser) {
                                window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { message: 'Yorumları görmek için hemen aramıza katıl!' } }));
                                return;
                            }
                            setShowThread(!showThread);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 text-zinc-400 hover:text-white bg-white/[0.02] border border-white/5 px-3 py-2 rounded-xl transition-all hover:bg-white/[0.05]"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-[12px] font-bold">{comments.length} Yorum</span>
                    </button>
                    
                    <button 
                        onClick={() => setShowAI(!showAI)}
                        className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all ${showAI ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-400'}`}
                        title="AI Analizi"
                    >
                        <Bot className="w-4 h-4" />
                    </button>
                </div>

                {/* Primary CTA Row (Full Width) */}
                <button 
                    onClick={handlePlayBet}
                    disabled={betAdded}
                    className={`group relative overflow-hidden flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-black text-[13px] tracking-wide transition-all shadow-lg hover:-translate-y-0.5 mt-1 w-full ${betAdded ? 'bg-white/10 text-white/50 cursor-default' : 'bg-gradient-to-r from-[#00E676] to-[#00C853] text-[#06080C] hover:shadow-[0_8px_25px_rgba(0,230,118,0.4)]'}`}
                >
                    {!betAdded && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                    
                    <div className="flex items-center gap-2 relative z-10">
                        {betAdded ? <CheckCircle2 className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        <span>{betAdded ? 'EKLENDİ' : 'KUPONU SEÇ VE OYNA'}</span>
                    </div>
                    
                    <div className={`absolute right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${betAdded ? 'bg-white/5' : 'bg-[#06080C]/20 text-white/90'}`}>
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold">58</span>
                    </div>
                </button>

                {/* AI Insight Box */}
                {showAI && (
                    <div className="mt-3 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 flex gap-2.5 animate-fade-in relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none"></div>
                        <Bot className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 relative z-10" />
                        <p className="text-[12px] text-purple-200/90 font-medium leading-relaxed relative z-10">
                            {bet.isCombo ? "Yapay Zeka: Kombinedeki tüm maçların ev sahibi takımları hücum formunda zirvede. Bu kuponun gelme ihtimali yapay zekaya göre %82." : "Yapay Zeka: Ev sahibi ekibin son 5 maçında Karşılıklı Gol oldu. Defans hattındaki eksikler bu maçın da gollü geçeceğini gösteriyor. Değerli oran!"}
                        </p>
                    </div>
                )}
            </div>

            </div> {/* End of Expanded View Wrapper */}

            {/* Comments Thread (Accordion) */}
            <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${showThread && isExpanded ? 'max-h-[500px] opacity-100 border-t border-white/[0.03]' : 'max-h-0 opacity-0'}`}>
                <div className="bg-[#0B0E14]/80 backdrop-blur-md p-4 flex flex-col gap-4">
                    {/* Thread Messages */}
                    <div className="flex flex-col gap-3.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-2" style={{ scrollbarWidth: 'thin' }}>
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#12151D] shrink-0 overflow-hidden shadow-[0_2px_5px_rgba(0,0,0,0.5)] border border-white/5">
                                    <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${c.user}`} alt={c.user} className="w-full h-full object-cover scale-110" />
                                </div>
                                <div className="flex flex-col bg-[#12151D]/60 border border-white/[0.03] rounded-2xl rounded-tl-sm px-4 py-3 flex-1 relative shadow-sm">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[13px] font-bold text-white">{c.user}</span>
                                        <span className="text-[11px] font-normal text-zinc-500">{c.time}</span>
                                    </div>
                                    <p className="text-[14px] text-slate-300 leading-relaxed font-normal">{c.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Comment Input */}
                    <form onSubmit={handleAddComment} className="relative mt-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Bu kupon hakkında ne düşünüyorsun?"
                            className="w-full bg-[#12151D] border border-white/5 rounded-2xl px-5 py-3.5 text-[14px] font-normal text-white focus:outline-none focus:border-[#00E5FF]/30 focus:bg-[#0B0E14] focus:shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_0_15px_rgba(0,229,255,0.08)] transition-all placeholder-zinc-500"
                        />
                    </form>
                </div>
            </div>

        </div>
        </div>
    );
}
