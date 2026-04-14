import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { demoNews } from '../demoData';
import { NewsArticle, NEWS_CATEGORIES } from '../types';
import { ChevronRight, Clock, Star } from 'lucide-react';

interface HomeNewsWidgetProps {
    onViewChange: (view: string) => void;
    onArticleClick: (id: string) => void;
}

const HomeNewsWidget: React.FC<HomeNewsWidgetProps> = ({ onViewChange, onArticleClick }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            const { data } = await supabase
                .from('news')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .limit(4);
            
            if (data && data.length > 0) {
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
            } else {
                setArticles(demoNews.slice(0, 4));
            }
        };
        fetchNews();
    }, []);

    const getCategoryColor = (cat: string) => {
        return NEWS_CATEGORIES.find(c => c.name === cat)?.color || '#f0b90b';
    };

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        const diffH = Math.floor((Date.now() - ts) / 3600000);
        if (diffH < 24) return `${Math.max(1, diffH)} sa önce`;
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    if (articles.length === 0) return null;

    return (
        <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-2xl p-3 md:p-3.5 h-auto flex flex-col">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/50">
                <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-[#f0b90b] fill-[#f0b90b]" />
                    <h3 className="text-white font-black uppercase tracking-widest text-[11px]">SON HABERLER</h3>
                </div>
                <button 
                    onClick={() => onViewChange('news')}
                    className="text-[10px] text-zinc-400 hover:text-[#f0b90b] font-black uppercase tracking-widest flex items-center transition-colors"
                >
                    TÜMÜ <ChevronRight className="w-3 h-3" />
                </button>
            </div>

            <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                {articles.map((article, index) => (
                    <article 
                        key={article.id}
                        onClick={() => onArticleClick(article.id)}
                        className="group flex gap-2.5 cursor-pointer p-1 -mx-0.5 rounded-xl hover:bg-zinc-800/40 transition-all duration-300"
                    >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative border border-zinc-800 group-hover:border-[#f0b90b]/30">
                            <img 
                                src={article.image} 
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <div className="flex flex-col justify-between py-0 flex-1 min-w-0">
                            <h4 className="text-white text-[10px] font-bold leading-tight line-clamp-2 group-hover:text-[#f0b90b] transition-colors">{article.title}</h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span 
                                    className="px-1 py-0.5 rounded-[3px] text-[6px] font-black uppercase text-white tracking-widest"
                                    style={{ background: getCategoryColor(article.category) }}
                                >
                                    {article.category}
                                </span>
                                <span className="text-[7px] text-zinc-500 font-bold flex items-center gap-0.5">
                                    <Clock className="w-1.5 h-1.5" />
                                    {formatDate(article.createdAt)}
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            
            <button
                onClick={() => onViewChange('news')}
                className="w-full mt-3 py-1.5 rounded-lg bg-zinc-800/40 border border-zinc-700/30 hover:border-[#f0b90b]/50 text-zinc-500 hover:text-[#f0b90b] text-[8px] font-black uppercase tracking-widest transition-all duration-300"
            >
                HABERLER
            </button>
        </div>
    );
};

export default HomeNewsWidget;
