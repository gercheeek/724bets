import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Ticket, BarChart2, ChevronRight, Play } from 'lucide-react';
import { Coupon } from '../types';
import { ALL_GAMES } from '../data/games';

interface SearchModalProps {
    onClose: () => void;
    coupons?: Coupon[];
    onNavigate?: (view: string) => void;
}

interface SearchResult {
    type: 'coupon' | 'analysis' | 'league' | 'game';
    title: string;
    subtitle: string;
    meta?: string;
    action: () => void;
    icon: React.ReactNode;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose, coupons = [], onNavigate }) => {
    const [query, setQuery] = useState('');
    const [visible, setVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const t = setTimeout(() => {
            setVisible(true);
            inputRef.current?.focus();
        }, 30);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    // ─── Build searchable results ───────────────────────────────────────
    const results: SearchResult[] = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q || q.length < 2) return [];

        const hits: SearchResult[] = [];

        // Search coupons
        coupons.forEach(coupon => {
            const searchStr = `${coupon.homeTeam ?? ''} ${coupon.awayTeam ?? ''} ${coupon.league ?? ''} ${coupon.tip ?? ''}`.toLowerCase();
            if (searchStr.includes(q)) {
                hits.push({
                    type: 'coupon',
                    title: `${coupon.homeTeam ?? '?'} vs ${coupon.awayTeam ?? '?'}`,
                    subtitle: coupon.league ?? 'Lig',
                    meta: `Tahmin: ${coupon.tip ?? '-'} · Oran: ${coupon.odd ?? '-'}`,
                    icon: <Ticket className="w-4 h-4 text-[#f0b90b]" />,
                    action: () => {
                        onNavigate?.('home');
                        setTimeout(() => {
                            const el = document.getElementById('daily-coupons');
                            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 15, behavior: 'smooth' });
                        }, 150);
                        handleClose();
                    },
                });
            }
        });

        // Search Games
        ALL_GAMES.forEach(game => {
            if (game.name.toLowerCase().includes(q) || game.provider.toLowerCase().includes(q)) {
                hits.push({
                    type: 'game',
                    title: game.name,
                    subtitle: game.provider,
                    meta: `Kategori: ${game.category.toUpperCase()} · RTP: ${game.rtp || '-'}`,
                    icon: <Play className="w-4 h-4 text-[#10B981]" />,
                    action: () => {
                        onNavigate?.('casino');
                        // In a real app we'd dispatch an event to open this specific game
                        setTimeout(() => {
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 150);
                        handleClose();
                    },
                });
            }
        });

        // Sort by type (coupons first, then games)
        hits.sort((a, b) => {
            if (a.type === 'coupon' && b.type === 'game') return -1;
            if (a.type === 'game' && b.type === 'coupon') return 1;
            return 0;
        });

        return hits.slice(0, 12); // max 12 results
    }, [query, coupons]);

    // Suggestions when query empty
    const suggestions = ['Sweet Bonanza', 'Galatasaray', 'Gates of Olympus', 'NBA', 'Fenerbahçe', 'Lightning Roulette', 'Crazy Time'];

    return (
        <div
            className="fixed inset-0 z-[9500] flex items-start justify-center pt-[10vh] px-4"
            style={{
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                opacity: visible ? 1 : 0,
                transition: 'opacity 0.25s ease',
            }}
            onClick={handleClose}
        >
            <div
                className="w-full max-w-2xl rounded-lg overflow-hidden flex flex-col"
                style={{
                    background: 'linear-gradient(145deg, #0e0e0e, #141414)',
                    border: '1.5px solid rgba(240,185,11,0.3)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 30px rgba(240,185,11,0.08)',
                    transform: visible ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.97)',
                    transition: 'transform 0.3s cubic-bezier(0.34,1.3,0.64,1)',
                    maxHeight: '70vh',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Search input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/80">
                    <Search className="w-5 h-5 text-[#f0b90b] flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Takım, lig veya maç ara..."
                        className="flex-1 bg-transparent text-white text-lg font-bold outline-none placeholder-zinc-600"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="text-zinc-600 hover:text-zinc-400 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={handleClose}
                        className="ml-1 px-3 py-1 rounded-lg text-zinc-600 text-xs font-black uppercase tracking-widest hover:text-zinc-400 transition-colors border border-zinc-800 hover:border-zinc-700"
                    >
                        ESC
                    </button>
                </div>

                {/* Results / Suggestions */}
                <div className="overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                    {query.length >= 2 ? (
                        results.length > 0 ? (
                            <div className="p-3 space-y-1">
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 pb-2">
                                    {results.length} Sonuç Bulundu
                                </p>
                                {results.map((r, i) => (
                                    <button
                                        key={i}
                                        onClick={r.action}
                                        className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all group hover:bg-white/[0.04]"
                                        style={{ border: '1px solid transparent' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(240,185,11,0.15)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; }}
                                    >
                                        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                                            style={{ background: r.type === 'coupon' ? 'rgba(240,185,11,0.08)' : r.type === 'game' ? 'rgba(0,255,163,0.08)' : 'rgba(16,185,129,0.08)' }}>
                                            {r.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-white font-black text-sm truncate">{r.title}</div>
                                            <div className="text-zinc-500 text-[11px] font-bold truncate">{r.subtitle}</div>
                                            {r.meta && <div className="text-zinc-600 text-[10px] mt-0.5 truncate">{r.meta}</div>}
                                        </div>
                                        <div className="flex-shrink-0 flex items-center gap-1.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                                style={{
                                                    background: r.type === 'coupon' ? 'rgba(240,185,11,0.1)' : 'rgba(99,102,241,0.1)',
                                                    color: r.type === 'coupon' ? '#f0b90b' : '#818cf8',
                                                }}>
                                                {r.type === 'coupon' ? 'Kupon' : 'Tahmin'}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <Search className="w-10 h-10 text-zinc-800" />
                                <p className="text-zinc-500 font-bold text-sm">"{query}" için sonuç bulunamadı</p>
                                <p className="text-zinc-700 text-xs">Farklı bir takım veya lig adı deneyin</p>
                            </div>
                        )
                    ) : (
                        <div className="p-5">
                            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Popüler Aramalar</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setQuery(s)}
                                        className="px-4 py-2 rounded-lg text-sm font-black text-zinc-400 transition-all hover:text-[#f0b90b]"
                                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(240,185,11,0.2)'; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-6 grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Günün Kuponları', icon: <Ticket className="w-4 h-4" />, action: () => { onNavigate?.('home'); setTimeout(() => { const el = document.getElementById('daily-coupons'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 15, behavior: 'smooth' }); }, 150); handleClose(); } },
                                    { label: 'Analizler', icon: <BarChart2 className="w-4 h-4" />, action: () => { onNavigate?.('analysis'); handleClose(); } },
                                ].map((item, i) => (
                                    <button key={i} onClick={item.action}
                                        className="flex items-center justify-center gap-2 py-3 rounded-lg font-black text-xs text-zinc-500 transition-all hover:text-white"
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
