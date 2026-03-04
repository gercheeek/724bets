import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Eye, EyeOff, Save, X, Users, ChevronDown } from 'lucide-react';
import { NewsArticle, NewsAuthor, NEWS_CATEGORIES } from '../types';

interface AdminNewsTabProps {
    role: string;
}

const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 80);
};

const AdminNewsTab: React.FC<AdminNewsTabProps> = ({ role }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [authors, setAuthors] = useState<NewsAuthor[]>([]);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showAuthors, setShowAuthors] = useState(false);
    const [newAuthorUsername, setNewAuthorUsername] = useState('');
    const [newAuthorPassword, setNewAuthorPassword] = useState('');
    const [newAuthorDisplayName, setNewAuthorDisplayName] = useState('');

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formExcerpt, setFormExcerpt] = useState('');
    const [formCategory, setFormCategory] = useState('Futbol');
    const [formImage, setFormImage] = useState('');
    const [formContent, setFormContent] = useState('');
    const [formSeoTitle, setFormSeoTitle] = useState('');
    const [formSeoDesc, setFormSeoDesc] = useState('');
    const [formSlug, setFormSlug] = useState('');
    const [formStatus, setFormStatus] = useState<'draft' | 'published'>('draft');

    const isAdmin = role === 'admin';

    useEffect(() => {
        try {
            const storedArticles = localStorage.getItem('site_news');
            if (storedArticles) setArticles(JSON.parse(storedArticles));
            const storedAuthors = localStorage.getItem('site_news_authors');
            if (storedAuthors) setAuthors(JSON.parse(storedAuthors));
        } catch { /* ignore */ }
    }, []);

    const saveArticles = (updated: NewsArticle[]) => {
        setArticles(updated);
        localStorage.setItem('site_news', JSON.stringify(updated));
    };

    const saveAuthors = (updated: NewsAuthor[]) => {
        setAuthors(updated);
        localStorage.setItem('site_news_authors', JSON.stringify(updated));
    };

    const resetForm = () => {
        setFormTitle(''); setFormExcerpt(''); setFormCategory('Futbol');
        setFormImage(''); setFormContent(''); setFormSeoTitle('');
        setFormSeoDesc(''); setFormSlug(''); setFormStatus('draft');
        setEditingArticle(null);
    };

    const openNewForm = () => {
        resetForm();
        setShowForm(true);
    };

    const openEditForm = (article: NewsArticle) => {
        setEditingArticle(article);
        setFormTitle(article.title);
        setFormExcerpt(article.excerpt);
        setFormCategory(article.category);
        setFormImage(article.image);
        setFormContent(article.content);
        setFormSeoTitle(article.seoTitle || '');
        setFormSeoDesc(article.seoDescription || '');
        setFormSlug(article.slug);
        setFormStatus(article.status);
        setShowForm(true);
    };

    const handleSaveArticle = () => {
        if (!formTitle.trim()) return;
        const slug = formSlug.trim() || generateSlug(formTitle);
        const now = Date.now();

        if (editingArticle) {
            const updated = articles.map(a =>
                a.id === editingArticle.id
                    ? { ...a, title: formTitle, excerpt: formExcerpt, category: formCategory, image: formImage, content: formContent, seoTitle: formSeoTitle, seoDescription: formSeoDesc, slug, status: formStatus, updatedAt: now }
                    : a
            );
            saveArticles(updated);
        } else {
            const newArticle: NewsArticle = {
                id: 'news-' + now,
                title: formTitle,
                slug,
                excerpt: formExcerpt,
                content: formContent,
                category: formCategory,
                image: formImage || `https://picsum.photos/seed/${slug}/800/450`,
                authorId: role,
                authorName: role === 'admin' ? 'Admin' : role.replace('author_', ''),
                views: 0,
                status: formStatus,
                seoTitle: formSeoTitle,
                seoDescription: formSeoDesc,
                createdAt: now,
                updatedAt: now,
            };
            saveArticles([newArticle, ...articles]);
        }
        setShowForm(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (!window.confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
        saveArticles(articles.filter(a => a.id !== id));
    };

    const handleToggleStatus = (id: string) => {
        saveArticles(articles.map(a => a.id === id ? { ...a, status: a.status === 'published' ? 'draft' : 'published', updatedAt: Date.now() } : a));
    };

    const handleAddAuthor = () => {
        if (!newAuthorUsername.trim() || !newAuthorPassword.trim() || !newAuthorDisplayName.trim()) return;
        const newAuthor: NewsAuthor = {
            id: 'author-' + Date.now(),
            username: newAuthorUsername.trim().toLowerCase(),
            password: newAuthorPassword,
            displayName: newAuthorDisplayName.trim(),
            role: 'author',
        };
        saveAuthors([...authors, newAuthor]);
        setNewAuthorUsername(''); setNewAuthorPassword(''); setNewAuthorDisplayName('');
    };

    const handleDeleteAuthor = (id: string) => {
        if (!window.confirm('Yazarı silmek istediğinize emin misiniz?')) return;
        saveAuthors(authors.filter(a => a.id !== id));
    };

    const inputClass = "w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-[#f0b90b] transition-colors outline-none placeholder-zinc-600";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">📰 Haber Yönetimi</h2>
                    <p className="text-zinc-500 text-xs font-bold mt-1">{articles.length} haber mevcut</p>
                </div>
                <div className="flex gap-3">
                    {isAdmin && (
                        <button
                            onClick={() => setShowAuthors(!showAuthors)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all"
                        >
                            <Users className="w-3.5 h-3.5" /> Yazarlar
                        </button>
                    )}
                    <button
                        onClick={openNewForm}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[#f0b90b] text-black hover:bg-[#f0b90b]/90 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" /> Yeni Haber
                    </button>
                </div>
            </div>

            {/* Author Management (admin only) */}
            {isAdmin && showAuthors && (
                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                    <h3 className="text-white font-black text-sm uppercase tracking-widest">Yazar Yönetimi</h3>
                    <div className="flex flex-wrap gap-3">
                        <input value={newAuthorDisplayName} onChange={e => setNewAuthorDisplayName(e.target.value)} placeholder="Görünen Ad" className={inputClass + " max-w-[180px]"} />
                        <input value={newAuthorUsername} onChange={e => setNewAuthorUsername(e.target.value)} placeholder="Kullanıcı adı" className={inputClass + " max-w-[180px]"} />
                        <input value={newAuthorPassword} onChange={e => setNewAuthorPassword(e.target.value)} placeholder="Şifre" type="password" className={inputClass + " max-w-[150px]"} />
                        <button onClick={handleAddAuthor} className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-emerald-600 text-white hover:bg-emerald-500 transition-all">
                            Ekle
                        </button>
                    </div>
                    {authors.length > 0 && (
                        <div className="space-y-2 mt-3">
                            {authors.map(a => (
                                <div key={a.id} className="flex items-center justify-between px-4 py-2 rounded-xl bg-black border border-zinc-800">
                                    <div>
                                        <span className="text-white text-xs font-bold">{a.displayName}</span>
                                        <span className="text-zinc-500 text-[10px] ml-2">@{a.username}</span>
                                    </div>
                                    <button onClick={() => handleDeleteAuthor(a.id)} className="text-red-500 hover:text-red-400 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Default author info */}
                    <p className="text-zinc-600 text-[10px] font-bold">
                        💡 Varsayılan: yazar1 / 123456 (otomatik tanımlı)
                    </p>
                </div>
            )}

            {/* Article Form */}
            {showForm && (
                <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-black text-sm uppercase tracking-widest">
                            {editingArticle ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
                        </h3>
                        <button onClick={() => { setShowForm(false); resetForm(); }} className="text-zinc-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <input value={formTitle} onChange={e => { setFormTitle(e.target.value); if (!editingArticle) setFormSlug(generateSlug(e.target.value)); }} placeholder="Haber Başlığı" className={inputClass} />
                    <textarea value={formExcerpt} onChange={e => setFormExcerpt(e.target.value)} placeholder="Kısa açıklama (max 120 karakter)" maxLength={120} rows={2} className={inputClass} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-1.5">Kategori</label>
                            <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className={inputClass}>
                                {NEWS_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-1.5">Durum</label>
                            <select value={formStatus} onChange={e => setFormStatus(e.target.value as 'draft' | 'published')} className={inputClass}>
                                <option value="draft">Taslak</option>
                                <option value="published">Yayınlandı</option>
                            </select>
                        </div>
                    </div>

                    <input value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="Kapak fotoğrafı URL (boş bırakılırsa otomatik)" className={inputClass} />

                    <div>
                        <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-1.5">İçerik (HTML Destekli)</label>
                        <textarea value={formContent} onChange={e => setFormContent(e.target.value)} placeholder="<h2>Alt Başlık</h2><p>Paragraf metni...</p>" rows={10} className={inputClass + " font-mono text-xs"} />
                    </div>

                    {/* SEO Fields */}
                    <details className="group">
                        <summary className="text-zinc-500 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                            <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" /> SEO Ayarları
                        </summary>
                        <div className="mt-3 space-y-3">
                            <input value={formSeoTitle} onChange={e => setFormSeoTitle(e.target.value)} placeholder="Meta Title" className={inputClass} />
                            <input value={formSeoDesc} onChange={e => setFormSeoDesc(e.target.value)} placeholder="Meta Description" className={inputClass} />
                            <input value={formSlug} onChange={e => setFormSlug(e.target.value)} placeholder="Slug (otomatik)" className={inputClass} />
                        </div>
                    </details>

                    <div className="flex gap-3 pt-2">
                        <button onClick={handleSaveArticle} className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-[#f0b90b] text-black hover:bg-[#f0b90b]/90 transition-all">
                            <Save className="w-3.5 h-3.5" /> {editingArticle ? 'Güncelle' : 'Kaydet'}
                        </button>
                        <button onClick={() => { setShowForm(false); resetForm(); }} className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-all">
                            İptal
                        </button>
                    </div>
                </div>
            )}

            {/* Articles List */}
            <div className="space-y-3">
                {articles.length === 0 && !showForm && (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">📰</div>
                        <p className="text-zinc-500 text-sm font-bold">Henüz haber eklenmedi.</p>
                        <p className="text-zinc-600 text-xs mt-1">Yukarıdaki "Yeni Haber" butonuyla başlayın.</p>
                    </div>
                )}
                {articles.map(article => (
                    <div
                        key={article.id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                    >
                        <img src={article.image} alt={article.title} className="w-20 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white"
                                    style={{ background: NEWS_CATEGORIES.find(c => c.name === article.category)?.color || '#666' }}
                                >
                                    {article.category}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${article.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                                    {article.status === 'published' ? 'Yayında' : 'Taslak'}
                                </span>
                            </div>
                            <p className="text-white text-xs font-bold truncate">{article.title}</p>
                            <p className="text-zinc-600 text-[10px] mt-0.5">{article.views} görüntülenme · {new Date(article.createdAt).toLocaleDateString('tr-TR')}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => handleToggleStatus(article.id)} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" title={article.status === 'published' ? 'Taslağa çevir' : 'Yayınla'}>
                                {article.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => openEditForm(article)} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#f0b90b] transition-colors">
                                <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(article.id)} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminNewsTab;
