import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Clock, User, Share2, Twitter, Copy, ChevronRight } from 'lucide-react';
import { NewsArticle, NEWS_CATEGORIES } from '../types';
import { demoNews } from '../demoData';

interface NewsDetailViewProps {
    articleId: string;
    onViewChange?: (view: string) => void;
    onArticleClick?: (articleId: string) => void;
}

const NewsDetailView: React.FC<NewsDetailViewProps> = ({ articleId, onViewChange, onArticleClick }) => {
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('site_news');
            const parsed: NewsArticle[] = stored ? JSON.parse(stored) : [];
            const all = [...parsed, ...demoNews]
                .filter(a => a.status === 'published')
                .sort((a, b) => b.createdAt - a.createdAt);
            const unique = Array.from(new Map(all.map(a => [a.id, a])).values());
            setAllArticles(unique);
            const found = unique.find(a => a.id === articleId);
            if (found) {
                setArticle(found);
                // Increment views
                found.views += 1;
            }
        } catch {
            const found = demoNews.find(a => a.id === articleId);
            if (found) setArticle(found);
            setAllArticles(demoNews);
        }
    }, [articleId]);

    const getCategoryColor = (cat: string) => {
        return NEWS_CATEGORIES.find(c => c.name === cat)?.color || '#f0b90b';
    };

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = article?.title || '';
        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="text-5xl">📰</div>
                <p className="text-zinc-500 font-bold text-sm">Haber bulunamadı.</p>
                <button onClick={() => onViewChange?.('news')} className="text-[#f0b90b] text-xs font-bold underline">
                    Haberlere Dön
                </button>
            </div>
        );
    }

    const sameCategory = allArticles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 4);
    const latestNews = allArticles.filter(a => a.id !== article.id).slice(0, 5);

    return (
        <div style={{ minHeight: '100vh', padding: '0 0 80px' }}>
            {/* Cover Image */}
            <div className="relative w-full" style={{ height: '350px', maxHeight: '45vh' }}>
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                {/* Back button */}
                <button
                    onClick={() => onViewChange?.('news')}
                    className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                {/* Category badge */}
                <span
                    className="absolute top-4 right-4 z-10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                    style={{ background: getCategoryColor(article.category), boxShadow: `0 0 15px ${getCategoryColor(article.category)}50` }}
                >
                    {article.category}
                </span>
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                    <h1 className="text-white font-black text-xl md:text-3xl lg:text-4xl leading-tight max-w-[900px]">
                        {article.title}
                    </h1>
                </div>
            </div>

            {/* Content area */}
            <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-zinc-800/60">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                                    <User className="w-4 h-4 text-zinc-400" />
                                </div>
                                <span className="text-zinc-300 text-xs font-bold">{article.authorName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                <Clock className="w-3 h-3" />
                                {formatDate(article.createdAt)}
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                <Eye className="w-3 h-3" />
                                {article.views.toLocaleString('tr')} görüntülenme
                            </div>
                        </div>

                        {/* Article body */}
                        <div
                            className="news-article-content text-zinc-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Share buttons */}
                        <div className="mt-10 pt-6 border-t border-zinc-800/60">
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Share2 className="w-3 h-3" /> PAYLAŞ
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="px-4 py-2 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 text-[#1DA1F2] text-[10px] font-black uppercase tracking-widest hover:bg-[#1DA1F2]/20 transition-all"
                                >
                                    𝕏 Twitter
                                </button>
                                <button
                                    onClick={() => handleShare('whatsapp')}
                                    className="px-4 py-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] text-[10px] font-black uppercase tracking-widest hover:bg-[#25D366]/20 transition-all"
                                >
                                    📱 WhatsApp
                                </button>
                                <button
                                    onClick={() => handleShare('copy')}
                                    className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all flex items-center gap-1.5"
                                >
                                    <Copy className="w-3 h-3" />
                                    {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-[320px] flex-shrink-0 space-y-8">
                        {/* Latest */}
                        <div className="rounded-2xl p-5" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                📰 Son Haberler
                            </h3>
                            <div className="space-y-4">
                                {latestNews.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => onArticleClick?.(n.id)}
                                        className="flex gap-3 cursor-pointer group"
                                    >
                                        <img src={n.image} alt={n.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                                        <div className="min-w-0">
                                            <p className="text-zinc-300 text-[11px] font-bold leading-snug line-clamp-2 group-hover:text-[#f0b90b] transition-colors">
                                                {n.title}
                                            </p>
                                            <p className="text-zinc-600 text-[9px] font-bold mt-1">{formatDate(n.createdAt)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Same category */}
                        {sameCategory.length > 0 && (
                            <div className="rounded-2xl p-5" style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: getCategoryColor(article.category) }}
                                    />
                                    {article.category} Haberleri
                                </h3>
                                <div className="space-y-4">
                                    {sameCategory.map(n => (
                                        <div
                                            key={n.id}
                                            onClick={() => onArticleClick?.(n.id)}
                                            className="flex gap-3 cursor-pointer group"
                                        >
                                            <img src={n.image} alt={n.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                                            <div className="min-w-0">
                                                <p className="text-zinc-300 text-[11px] font-bold leading-snug line-clamp-2 group-hover:text-[#f0b90b] transition-colors">
                                                    {n.title}
                                                </p>
                                                <p className="text-zinc-600 text-[9px] font-bold mt-1">{formatDate(n.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default NewsDetailView;
