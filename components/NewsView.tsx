import React, { useState, useEffect } from 'react';
import { ChevronRight, Eye, Clock, ArrowLeft } from 'lucide-react';
import { NewsArticle, NEWS_CATEGORIES } from '../types';
import { supabase } from '../utils/supabase';

interface NewsViewProps {
    onViewChange?: (view: string) => void;
    onArticleClick?: (articleId: string) => void;
}

const NewsView: React.FC<NewsViewProps> = ({ onViewChange, onArticleClick }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [activeCategory, setActiveCategory] = useState('Tümü');

    useEffect(() => {
        const fetchNews = async () => {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });
            
            if (data) {
                const mapped: NewsArticle[] = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    slug: item.slug,
                    excerpt: item.excerpt || '',
                    content: item.content || '',
                    category: item.category || 'Futbol',
                    image: item.image || '',
                    authorId: item.author_id || '',
                    authorName: item.author_name || 'Admin',
                    views: item.views || 0,
                    status: item.status || 'draft',
                    seoTitle: item.seo_title,
                    seoDescription: item.seo_description,
                    seoKeywords: item.seo_keywords,
                    createdAt: new Date(item.created_at).getTime(),
                    updatedAt: new Date(item.updated_at).getTime()
                }));
                setArticles(mapped);
            }
        };
        fetchNews();
    }, []);

    const getCategoryColor = (cat: string) => {
        return NEWS_CATEGORIES.find(c => c.name === cat)?.color || '#f0b90b';
    };

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const filtered = activeCategory === 'Tümü'
        ? articles
        : articles.filter(a => a.category === activeCategory);

    const categories = ['Tümü', ...NEWS_CATEGORIES.map(c => c.name)];

    return (
        <div style={{ minHeight: '100vh', padding: '20px 20px 80px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Back button + header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => onViewChange?.('home')}
                    className="w-10 h-10 rounded-full bg-theme-elevated border border-theme-subtle flex items-center justify-center text-zinc-400 hover:text-theme-primary hover:border-zinc-600 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h1 className="text-[28px] md:text-[36px] font-black text-theme-primary italic uppercase tracking-tighter">
                        SPOR <span className="text-[#f0b90b]">HABERLERİ</span>
                    </h1>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                        Güncel spor dünyasından en son gelişmeler
                    </p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                {categories.map(cat => {
                    const isActive = activeCategory === cat;
                    const catColor = cat === 'Tümü' ? '#f0b90b' : getCategoryColor(cat);
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className="flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
                            style={{
                                background: isActive ? catColor : 'rgba(255,255,255,0.04)',
                                color: isActive ? (cat === 'Tümü' ? '#000' : '#fff') : '#71717a',
                                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                boxShadow: isActive ? `0 0 15px ${catColor}40` : 'none',
                            }}
                        >
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Results count */}
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-6">
                {filtered.length} HABER BULUNDU
            </p>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((article) => (
                    <article
                        key={article.id}
                        onClick={() => onArticleClick?.(article.id)}
                        className="group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 bg-theme-main border-theme-subtle shadow-card"
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
                            <span
                                className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                                style={{ background: getCategoryColor(article.category), boxShadow: `0 0 12px ${getCategoryColor(article.category)}40` }}
                            >
                                {article.category}
                            </span>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                                <span className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-black bg-[#f0b90b] shadow-lg">
                                    Haberi Oku →
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <h3 className="text-theme-primary font-black text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#f0b90b] transition-colors">
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

            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="text-5xl">📰</div>
                    <p className="text-zinc-500 font-bold text-sm">Bu kategoride haber bulunamadı.</p>
                </div>
            )}
        </div>
    );
};

export default NewsView;
