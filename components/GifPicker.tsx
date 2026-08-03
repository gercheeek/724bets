import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';

const GIPHY_API_KEY = 'GlVGYHqc3SyCEwsg5VDKLS2B5k2mNnU2'; 

const FALLBACK_GIFS = [
    "https://media1.giphy.com/media/xTiTnqUxyWbsAXq7Ju/giphy.gif",
    "https://media2.giphy.com/media/3o6Zt481isNvuFI1Ec/giphy.gif",
    "https://media3.giphy.com/media/l0HlOBZcl7mbj54QO/giphy.gif",
    "https://media4.giphy.com/media/3o72FkiK6GjzfwCkVq/giphy.gif",
    "https://media1.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif",
    "https://media2.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif",
    "https://media3.giphy.com/media/l41lO62nC6E25b5yU/giphy.gif",
    "https://media4.giphy.com/media/l0HlPtbQa59VVsL3q/giphy.gif"
];

interface GifPickerProps {
    onSelect: (gifUrl: string) => void;
}

export default function GifPicker({ onSelect }: GifPickerProps) {
    const [gifs, setGifs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        let isMounted = true;
        const fetchGifs = async () => {
            setLoading(true);
            try {
                const endpoint = search.trim() 
                    ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(search)}&limit=20`
                    : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20`;
                
                const res = await fetch(endpoint);
                const data = await res.json();
                
                if (isMounted) {
                    if (data.data && data.data.length > 0) {
                        const parsedGifs = data.data.map((g: any) => g.images.fixed_height_small.url || g.images.original.url);
                        setGifs(parsedGifs);
                    } else {
                        setGifs(FALLBACK_GIFS);
                    }
                }
            } catch (err) {
                if (isMounted) setGifs(FALLBACK_GIFS);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const timeout = setTimeout(fetchGifs, 400);
        return () => {
            isMounted = false;
            clearTimeout(timeout);
        };
    }, [search]);

    return (
        <div className="absolute bottom-[50px] right-0 bg-[#161a24] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] w-[280px] overflow-hidden flex flex-col">
            <div className="p-2 border-b border-white/5 relative bg-[#0A0D14]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input 
                    type="text" 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tenor'da Ara" 
                    className="w-full bg-[#1A1F29] rounded border border-white/5 py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF]/50"
                />
            </div>
            <div className="h-[220px] overflow-y-auto p-2 custom-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-1.5">
                        {gifs.map((gif, idx) => (
                            <div key={idx} onClick={() => onSelect(gif)} className="cursor-pointer overflow-hidden rounded border border-white/5 hover:border-[#00E5FF]/50 transition-colors group relative h-20 bg-black/40">
                                <img src={gif} alt="gif" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="px-3 py-1.5 bg-[#0A0D14] border-t border-white/5 flex justify-between items-center">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    Powered by 
                    <span className="text-white font-black tracking-normal">GIPHY</span>
                </span>
            </div>
        </div>
    );
}
