import React, { useState, useEffect } from 'react';
import { ChevronRight, Eye, Clock, Flame, ArrowRight, TrendingUp } from 'lucide-react';
import { NewsArticle, NEWS_CATEGORIES } from '../types';
import { demoNews } from '../demoData';

interface NewsSectionProps {
    onViewChange?: (view: string) => void;
    onArticleClick?: (articleId: string) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ onViewChange, onArticleClick }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('site_news');
            const parsed: NewsArticle[] = stored ? JSON.parse(stored) : [];
            const published = [...parsed, ...demoNews]
                .filter(a => a.status === 'published')
                .sort((a, b) => b.createdAt - a.createdAt);
            const unique = Array.from(new Map(published.map(a => [a.id, a])).values());
            setArticles(unique.slice(0, 7));
        } catch {
            setArticles(demoNews.filter(a => a.status === 'published').slice(0, 7));
        }
    }, []);

    const getCategoryColor = (cat: string) => {
        return NEWS_CATEGORIES.find(c => c.name === cat)?.color || '#f0b90b';
    };

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        const now = new Date();
        const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
        if (diffH < 1) return 'Az önce';
        if (diffH < 24) return `${diffH} saat önce`;
        const diffD = Math.floor(diffH / 24);
        if (diffD < 7) return `${diffD} gün önce`;
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    };

    if (articles.length === 0) return null;

    const featured = articles[0];
    const sideArticles = articles.slice(1, 3);
    const gridArticles = articles.slice(3, 7);

    return (
        <section className="news-section relative z-10" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(240,185,11,0.04) 0%, transparent 70%)' }} />

            {/* Header */}
            <div className="flex items-center justify-between mb-10 relative">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#f0b90b]/10 border border-[#f0b90b]/20 flex items-center justify-center">
                            <Flame className="w-4 h-4 text-[#f0b90b]" />
                        </div>
                        <span className="text-[#f0b90b] text-[10px] font-black uppercase tracking-[0.3em]">GÜNCEL HABERLER</span>
                    </div>
                    <h2 className="text-[32px] md:text-[40px] font-black text-white italic uppercase tracking-tighter leading-none">
                        SON SPOR <span className="text-[#f0b90b]">HABERLERİ</span>
                    </h2>
                    <p className="text-zinc-600 text-xs font-bold mt-2 max-w-md">
                        Spor dünyasından en güncel gelişmeler, transfer haberleri ve maç analizleri
                    </p>
                </div>
                <button
                    onClick={() => onViewChange?.('news')}
                    className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-black bg-[#f0b90b] hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] group"
                >
                    Tüm Haberler
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Featured Layout: big card + 2 side cards */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                {/* Featured Card */}
                <article
                    onClick={() => onArticleClick?.(featured.id)}
                    className="lg:col-span-3 news-card news-featured group cursor-pointer rounded-2xl overflow-hidden relative"
                    style={{
                        background: 'linear-gradient(180deg, #111113 0%, #0a0a0c 100%)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
                    }}
                >
                    <div className="relative overflow-hidden" style={{ height: '320px' }}>
                        <img
                            src={featured.image}
                            alt={featured.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <span
                            className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white badge-pulse"
                            style={{ background: getCategoryColor(featured.category), boxShadow: `0 0 15px ${getCategoryColor(featured.category)}50` }}
                        >
                            {featured.category}
                        </span>
                        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <TrendingUp className="w-3 h-3" /> ÖNE ÇIKAN
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="text-white font-black text-xl md:text-2xl leading-tight mb-3 group-hover:text-[#f0b90b] transition-colors">
                                {featured.title}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">{featured.excerpt}</p>
                            <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(featured.createdAt)}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-3 h-3" />
                                    {featured.views.toLocaleString('tr')}
                                </div>
                            </div>
                        </div>
                        {/* Hover CTA */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                            <span className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-black bg-[#f0b90b] shadow-lg shadow-[#f0b90b]/20">
                                Haberi Oku →
                            </span>
                        </div>
                    </div>
                </article>

                {/* Side Cards (2 stacked) */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {sideArticles.map((article) => (
                        <article
                            key={article.id}
                            onClick={() => onArticleClick?.(article.id)}
                            className="news-card group cursor-pointer rounded-2xl overflow-hidden flex-1"
                            style={{
                                background: 'linear-gradient(180deg, #111113 0%, #0a0a0c 100%)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                            }}
                        >
                            <div className="relative overflow-hidden" style={{ height: '140px' }}>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                <span
                                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                                    style={{ background: getCategoryColor(article.category) }}
                                >
                                    {article.category}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-black text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#f0b90b] transition-colors">
                                    {article.title}
                                </h3>
                                <div className="flex items-center gap-3 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{formatDate(article.createdAt)}</span>
                                    <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" />{article.views.toLocaleString('tr')}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Bottom Grid 4 cards */}
            {gridArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {gridArticles.map((article) => (
                        <article
                            key={article.id}
                            onClick={() => onArticleClick?.(article.id)}
                            className="news-card group cursor-pointer rounded-xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(180deg, #111113 0%, #0a0a0c 100%)',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <div className="relative overflow-hidden" style={{ height: '120px' }}>
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span
                                    className="absolute top-2 left-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white"
                                    style={{ background: getCategoryColor(article.category) }}
                                >
                                    {article.category}
                                </span>
                            </div>
                            <div className="p-3">
                                <h3 className="text-white font-bold text-xs leading-snug mb-1 line-clamp-2 group-hover:text-[#f0b90b] transition-colors">
                                    {article.title}
                                </h3>
                                <span className="text-zinc-600 text-[9px] font-bold">{formatDate(article.createdAt)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Mobile CTA */}
            <div className="flex sm:hidden justify-center mt-8">
                <button
                    onClick={() => onViewChange?.('news')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-black bg-[#f0b90b] hover:bg-[#f0b90b]/90 transition-all shadow-[0_0_15px_rgba(240,185,11,0.2)]"
                >
                    Tüm Haberleri Gör
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Engagement Banner */}
            <div className="mt-10 p-6 rounded-2xl border border-zinc-800/60 bg-gradient-to-r from-[#0f0e04]/60 via-transparent to-[#0f0e04]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="text-3xl">🏆</div>
                    <div>
                        <p className="text-white font-black text-sm">Günlük Spor Haberleri</p>
                        <p className="text-zinc-500 text-xs">Her gün güncellenen haber ve analizlerle bilgi sahibi olun</p>
                    </div>
                </div>
                <button
                    onClick={() => onViewChange?.('news')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#f0b90b] border border-[#f0b90b]/30 hover:bg-[#f0b90b]/10 transition-all whitespace-nowrap"
                >
                    Haberleri Keşfet <ChevronRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </section>
    );
};

export default NewsSection;
