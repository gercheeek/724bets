import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { NewsArticle, NEWS_CATEGORIES } from '../types';
import { Clock, ExternalLink } from 'lucide-react';

interface PortalNewsTeaserProps {
    onViewChange: (view: string) => void;
    onArticleClick: (id: string) => void;
}

const PortalNewsTeaser: React.FC<PortalNewsTeaserProps> = ({ onViewChange, onArticleClick }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            const { data } = await supabase
                .from('news')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .limit(2);
            
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
        const diffH = Math.floor((Date.now() - ts) / 3600000);
        if (diffH < 24) return `${Math.max(1, diffH)} saat önce`;
        const d = new Date(ts);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    if (articles.length === 0) return null;

    return (
        <div className="mt-8 mb-6 px-4 md:px-0">
            <div className="portal-section-heading" style={{ marginBottom: '16px' }}>
                <span className="text-xl">🔥</span> DİKKAT ÇEKEN HABERLER
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map(article => (
                    <article 
                        key={article.id}
                        onClick={() => onArticleClick(article.id)}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer h-48 border border-zinc-800 hover:border-[#f0b90b]/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(240,185,11,0.15)]"
                    >
                        <img 
                            src={article.image} 
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        
                        <div className="absolute inset-x-0 bottom-0 p-4 pt-10 flex flex-col justify-end">
                            <span 
                                className="self-start px-2 py-1 rounded-md text-[9px] font-black uppercase text-white tracking-widest mb-2"
                                style={{ background: getCategoryColor(article.category) }}
                            >
                                {article.category}
                            </span>
                            <h4 className="text-white text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#f0b90b] transition-colors mb-2 text-shadow-md">
                                {article.title}
                            </h4>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(article.createdAt)}
                                </span>
                                <span className="text-[10px] font-black text-[#f0b90b] opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all flex items-center gap-1">
                                    DEVAMINI OKU <ExternalLink className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <button 
                onClick={() => onViewChange('news')}
                className="w-full mt-4 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 hover:bg-zinc-800/50 text-xs font-black tracking-widest uppercase transition-all"
            >
                TÜM HABERLERİ GÖR
            </button>
        </div>
    );
};

export default PortalNewsTeaser;
