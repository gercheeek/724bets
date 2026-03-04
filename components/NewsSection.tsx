import React, { useState, useEffect } from 'react';
import { ChevronRight, Eye, Clock } from 'lucide-react';
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
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, 6);
            setArticles(published);
        } catch {
            setArticles(demoNews.filter(a => a.status === 'published').slice(0, 6));
        }
    }, []);

    const getCategoryColor = (cat: string) => {
        return NEWS_CATEGORIES.find(c => c.name === cat)?.color || '#f0b90b';
    };

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (articles.length === 0) return null;

    return (
        <section className="news-section relative z-10" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-[32px] md:text-[40px] font-black text-white italic uppercase tracking-tighter">
                        SON SPOR <span className="text-[#f0b90b]">HABERLERİ</span>
                    </h2>
                    <div className="h-1 w-16 bg-[#f0b90b] mt-3 shadow-[0_0_15px_rgba(255,193,7,0.4)]" />
                </div>
                <button
                    onClick={() => onViewChange?.('news')}
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-[#f0b90b] border border-[#f0b90b]/30 hover:bg-[#f0b90b]/10 transition-all group"
                >
                    Tüm Haberler
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        onClick={() => onArticleClick?.(article.id)}
                        className="news-card group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                        style={{
                            background: 'linear-gradient(180deg, #111113 0%, #0a0a0c 100%)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        }}
                    >
                        {/* Image */}
                        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                            <img
                                src={article.image}
                                alt={article.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            {/* Category badge */}
                            <span
                                className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                                style={{ background: getCategoryColor(article.category), boxShadow: `0 0 12px ${getCategoryColor(article.category)}40` }}
                            >
                                {article.category}
                            </span>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                                <span className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-black bg-[#f0b90b] shadow-lg">
                                    Haberi Oku →
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-white font-black text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#f0b90b] transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-zinc-500 text-xs leading-relaxed mb-4 line-clamp-2">
                                {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(article.createdAt)}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-3 h-3" />
                                    {article.views.toLocaleString('tr')}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* Mobile CTA */}
            <div className="flex sm:hidden justify-center mt-8">
                <button
                    onClick={() => onViewChange?.('news')}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-[#f0b90b] border border-[#f0b90b]/30 hover:bg-[#f0b90b]/10 transition-all"
                >
                    Tüm Haberler
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </section>
    );
};

export default NewsSection;
