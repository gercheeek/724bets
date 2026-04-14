import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { demoNews } from '../demoData';
import { NewsArticle, NEWS_CATEGORIES } from '../types';
import { Clock, ExternalLink, ArrowRight } from 'lucide-react';

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
                .limit(3);
            
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
                setArticles(demoNews.slice(0, 3));
            }
        };
        fetchNews();
    }, []);

    const getCategoryColor = (cat: string) => {
        return NEWS_CATEGORIES.find(c => c.name === cat)?.color || '#f0b90b';
    };

    const formatDate = (ts: number) => {
        const diffH = Math.floor((Date.now() - ts) / 3600000);
        if (diffH < 24) return `${Math.max(1, diffH)} sa önce`;
        const d = new Date(ts);
        return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    };

    if (articles.length === 0) return null;

    return (
        <div style={{ margin: '0 0 12px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '3px', height: '14px', background: '#f0b90b', borderRadius: '2px' }} />
                    <span style={{ color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Gündem</span>
                </div>
                <button 
                    onClick={() => onViewChange('news')}
                    style={{ background: 'none', border: 'none', color: '#f0b90b', fontSize: '9px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                    TÜMÜ <ArrowRight style={{ width: 10, height: 10 }} />
                </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {articles.map(article => (
                    <article 
                        key={article.id}
                        onClick={() => onArticleClick(article.id)}
                        className="group"
                        style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', height: '120px', border: '1px solid #1a1a1a', transition: 'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,185,11,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <img 
                            src={article.image} 
                            alt={article.title}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)' }} />
                        
                        <div style={{ position: 'absolute', insetInline: 0, bottom: 0, padding: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                            <span 
                                style={{ 
                                    alignSelf: 'flex-start', padding: '1px 5px', borderRadius: '3px', fontSize: '6px', fontWeight: 900, textTransform: 'uppercase', color: '#fff', letterSpacing: '1px', marginBottom: '3px',
                                    background: getCategoryColor(article.category) 
                                }}
                            >
                                {article.category}
                            </span>
                            <h4 style={{ color: '#fff', fontSize: '10px', fontWeight: 700, lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, marginBottom: '2px' }}>
                                {article.title}
                            </h4>
                            <span style={{ fontSize: '7px', color: '#666', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock style={{ width: 8, height: 8 }} />
                                {formatDate(article.createdAt)}
                            </span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default PortalNewsTeaser;
