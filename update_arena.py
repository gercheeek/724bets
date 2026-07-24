import re

def update_raffle():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/RaffleView.tsx', 'r') as f:
        content = f.read()

    # 1. Add new icons to import
    content = content.replace(
        "import { Ticket, Trophy, Clock, Coins, Info, Users, ChevronDown, ChevronUp, Shield, AlertTriangle, CheckCircle } from 'lucide-react';",
        "import { Ticket, Trophy, Clock, Coins, Info, Users, ChevronDown, ChevronUp, Shield, AlertTriangle, CheckCircle, Lock, X, Search } from 'lucide-react';"
    )

    # 2. Update TicketSlot
    old_ticket_slot = """const TicketSlot = React.memo(({ index, isSold, isMe, username, onSelect }: { index: number, isSold: boolean, isMe: boolean, username: string, onSelect: (idx: number) => void }) => {
    return (
        <div
            title={isSold ? (isMe ? 'Sizin' : username) : `Bilet ${index + 1} (Boş)`}
            onClick={() => !isSold && onSelect(index)}
            className={`
                relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 group
                ${isSold 
                    ? (isMe 
                        ? 'bg-gradient-to-br from-amber-300 to-amber-500 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)] cursor-default transform scale-95' 
                        : 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 shadow-inner cursor-default'
                      ) 
                    : 'bg-[#101014] border-white/5 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] cursor-pointer hover:-translate-y-1'
                }
            `}
            style={{ minHeight: 64 }}
        >
            {isSold ? (
                <>
                    <Ticket className={`w-5 h-5 mb-1 ${isMe ? 'text-amber-900' : 'text-zinc-500'}`} />
                    <div className={`font-black text-[9px] text-center tracking-wider uppercase ${isMe ? 'text-amber-950' : 'text-zinc-400'}`}>
                        {isMe ? 'SİZİN' : username.substring(0, 6)}
                    </div>
                    <div className={`text-[8px] font-mono mt-0.5 ${isMe ? 'text-amber-900/70 font-bold' : 'text-white/30'}`}>#{String(index + 1).padStart(3, '0')}</div>
                </>
            ) : (
                <>
                    <Ticket className="w-5 h-5 text-white/10 mb-1 group-hover:text-amber-400 transition-colors" />
                    <div className="text-white/20 text-[9px] font-bold text-center group-hover:text-amber-400 transition-colors">
                        AL
                    </div>
                </>
            )}
            
            {/* Hover Glare Effect */}
            {!isSold && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            )}
        </div>
    );
});"""

    new_ticket_slot = """const TicketSlot = React.memo(({ index, isSold, isMe, username, onSelect }: { index: number, isSold: boolean, isMe: boolean, username: string, onSelect: (idx: number) => void }) => {
    return (
        <div
            title={isSold ? (isMe ? 'Sizin' : username) : `Bilet ${index + 1} (Boş)`}
            onClick={() => !isSold && onSelect(index)}
            className={`
                relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 group
                ${isSold 
                    ? (isMe 
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.6)] cursor-default transform scale-95' 
                        : 'bg-gradient-to-br from-zinc-900 to-black border-zinc-800 opacity-40 cursor-default'
                      ) 
                    : 'bg-[#101014] border-white/5 hover:bg-[#1a1a24] hover:border-amber-400 hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] cursor-pointer hover:-translate-y-1'
                }
            `}
            style={{ minHeight: 64 }}
        >
            {isSold ? (
                <>
                    {isMe ? <Ticket className="w-5 h-5 mb-1 text-emerald-950" /> : <Lock className="w-4 h-4 mb-1 text-zinc-600" />}
                    <div className={`font-black text-[9px] text-center tracking-wider uppercase ${isMe ? 'text-emerald-950' : 'text-zinc-500'}`}>
                        {isMe ? 'SİZİN' : 'DOLU'}
                    </div>
                    <div className={`text-[8px] font-mono mt-0.5 ${isMe ? 'text-emerald-900/70 font-bold' : 'text-white/20'}`}>#{String(index + 1).padStart(3, '0')}</div>
                </>
            ) : (
                <>
                    <Ticket className="w-5 h-5 text-white/10 mb-1 group-hover:text-amber-400 transition-colors" />
                    <div className="text-white/30 text-[10px] font-bold text-center font-mono group-hover:text-amber-400 transition-colors">
                        {String(index + 1).padStart(3, '0')}
                    </div>
                </>
            )}
            
            {/* Hover Glare Effect */}
            {!isSold && (
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            )}
        </div>
    );
});"""
    content = content.replace(old_ticket_slot, new_ticket_slot)

    # 3. Add state for Arena Modal
    content = content.replace(
        "const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);",
        "const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);\n    const [isArenaModalOpen, setIsArenaModalOpen] = useState(false);\n    const [searchQuery, setSearchQuery] = useState('');"
    )

    # 4. Filter logic for tickets inside useMemo
    # We will replace the inline arena with a null output in the main render, 
    # and append the Arena Modal at the end of RaffleView.
    
    # First, let's inject the onOpenArenaModal to VIPRafflePromo
    content = content.replace(
        '<VIPRafflePromo ',
        '<VIPRafflePromo \n                    onOpenArenaModal={() => setIsArenaModalOpen(true)}'
    )

    # Second, remove the inline arena.
    # The inline arena starts with `{/* ═══ The Arena: Ticket Matrix ═══ */}` and ends before `{/* ═══ Stats & Activity ═══ */}`
    
    arena_start = content.find('{/* ═══ The Arena: Ticket Matrix ═══ */}')
    arena_end = content.find('{/* ═══ Stats & Activity ═══ */}')
    
    if arena_start != -1 and arena_end != -1:
        # We replace the inline arena with nothing
        content = content[:arena_start] + content[arena_end:]

    # Third, add the Modal at the bottom before final closing tags
    modal_code = """
            {/* ═══ ARENA MODAL ═══ */}
            {isArenaModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsArenaModalOpen(false)} />
                    
                    <div className="relative w-full max-w-5xl bg-[#0a0d14]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden animate-[scaleIn_0.3s_ease-out]">
                        
                        {/* Header & Search */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-white/5 bg-white/[0.02] gap-4 shrink-0">
                            <h3 className="text-white text-xl font-black uppercase tracking-wider flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
                                Bilet Seçimi
                            </h3>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <div className="relative w-full sm:w-48">
                                    <input 
                                        type="number"
                                        placeholder="Bilet Ara (1-1000)"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 transition-all"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                </div>
                                <button 
                                    onClick={() => setIsArenaModalOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Ticket Grid */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                            {/* Animated Background */}
                            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[100px]" />
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 relative z-10">
                                {useMemo(() => {
                                    return Array.from({ length: TOTAL_POOL_SIZE }, (_, index) => {
                                        // filter logic
                                        if (searchQuery && !String(index + 1).includes(searchQuery)) {
                                            return null;
                                        }
                                        const found = ticketPool.find(t => t.slot === index);
                                        return (
                                            <TicketSlot 
                                                key={index} 
                                                index={index} 
                                                isSold={!!found} 
                                                isMe={found?.userId === userId} 
                                                username={found?.username || ''} 
                                                onSelect={(idx) => {
                                                    handleSelectSlot(idx);
                                                    setIsArenaModalOpen(false); // Close on select
                                                }} 
                                            />
                                        );
                                    });
                                }, [ticketPool, userId, handleSelectSlot, searchQuery])}
                            </div>
                        </div>

                        {/* Footer / Legend */}
                        <div className="p-4 border-t border-white/5 bg-black/50 shrink-0 flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-zinc-900 border border-zinc-800" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Dolu</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sizin</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Boş</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}
"""
    # Insert modal before final `</div>` which wraps the whole RaffleView
    last_div_index = content.rfind('</div>')
    if last_div_index != -1:
        content = content[:last_div_index] + modal_code + content[last_div_index:]

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/RaffleView.tsx', 'w') as f:
        f.write(content)

update_raffle()
print("RaffleView updated with Arena Modal.")

