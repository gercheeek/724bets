import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit3, Eye, EyeOff, Save, X, Users, ChevronDown, Sparkles, Send, Bot, User as UserIcon, Wand2, ArrowRight, AlertCircle, Upload, Image as ImageIcon, Link as LinkIcon, Bold, Italic, Heading2, List, Quote, Type, ImagePlus, ExternalLink, Copy, Check } from 'lucide-react';
import { NewsArticle, NewsAuthor, NEWS_CATEGORIES } from '../types';
import { supabase } from '../utils/supabase';

interface AdminNewsTabProps {
    role: string;
}

interface AiMessage {
    role: 'ai' | 'user';
    content: string;
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

interface AiGeneratedArticle {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    seoTitle: string;
    seoDesc: string;
}

// AI Content Generation Engine (OpenAI API integration)
const generateBulkAiArticles = async (newsList: string, apiKey: string): Promise<AiGeneratedArticle[]> => {
    try {
        // Sanitize apiKey to avoid ISO-8859-1 code point errors in headers
        const sanitizedKey = (apiKey || '').trim().replace(/[^\x20-\x7E]/g, ''); 
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sanitizedKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Sen profesyonel bir spor haberi editörüsün. Kullanıcının verdiği numaralandırılmış haber konuları listesini al ve her bir konu için ayrı, SEO uyumlu, yüksek kaliteli ve HTML formatında (<p>, <h2>, <strong> kullanarak) haberler yaz. 
Çıktıyı MUTLAKA şu yapıda bir JSON objesi olarak ver:
{
  "articles": [
    { 
      "title": "Başlık", 
      "excerpt": "120 karakterlik özet", 
      "content": "HTML içerik...", 
      "category": "Futbol/Basketbol/Tenis/Voleybol/Diğer", 
      "seoTitle": "SEO Başlığı", 
      "seoDesc": "SEO Açıklaması" 
    }
  ]
}`
                    },
                    {
                        role: 'user',
                        content: `Haber listesi:\n${newsList}`
                    }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API Hatası');
        }

        const data = await response.json();
        const rawContent = data.choices[0].message.content;
        const parsed = JSON.parse(rawContent);
        
        // Handle both root array and { articles: [...] }
        if (Array.isArray(parsed)) return parsed;
        if (parsed.articles && Array.isArray(parsed.articles)) return parsed.articles;
        if (parsed.news && Array.isArray(parsed.news)) return parsed.news;
        return [parsed];
    } catch (error: any) {
        throw new Error(error.message || 'Üretim sırasında bir hata oluştu.');
    }
};


const AdminNewsTab: React.FC<AdminNewsTabProps> = ({ role }) => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [authors, setAuthors] = useState<NewsAuthor[]>([]);
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showAuthors, setShowAuthors] = useState(false);
    const [showAiChat, setShowAiChat] = useState(false);
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
    const [formSeoKeywords, setFormSeoKeywords] = useState('');
    const [formSlug, setFormSlug] = useState('');
    const [formStatus, setFormStatus] = useState<'draft' | 'published'>('draft');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedMedia, setUploadedMedia] = useState<{url: string; name: string}[]>([]);
    const [contentImageUploading, setContentImageUploading] = useState(false);
    const [showMediaGallery, setShowMediaGallery] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState('');
    const contentRef = useRef<HTMLTextAreaElement>(null);

    // AI Bulk state
    const [aiBulkInput, setAiBulkInput] = useState('');
    const [aiPreviews, setAiPreviews] = useState<AiGeneratedArticle[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [openAiKey, setOpenAiKey] = useState('');
    const [aiError, setAiError] = useState('');

    const isAdmin = role === 'admin';

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.warn('Haberler yüklenemedi:', error.message);
                return;
            }
            
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
        } catch (err) {
            console.warn('Supabase bağlantı hatası:', err);
        }
    };

    useEffect(() => {
        fetchArticles();
        
        // Authors still in localStorage for simplicity unless user wants Auth migration too
        try {
            const storedAuthors = localStorage.getItem('site_news_authors');
            if (storedAuthors) setAuthors(JSON.parse(storedAuthors));
            const storedKey = localStorage.getItem('site_openai_key');
            if (storedKey) setOpenAiKey(storedKey);
        } catch { /* ignore */ }
    }, []);

    // Generic upload function
    const uploadImageToSupabase = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `news/${fileName}`;

        const { data, error } = await supabase.storage
            .from('news_images')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('news_images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    // Cover image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const url = await uploadImageToSupabase(file);
            setFormImage(url);
        } catch (error: any) {
            alert('Resim yüklenirken hata: ' + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    // Content image upload (for inline images)
    const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setContentImageUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const url = await uploadImageToSupabase(files[i]);
                setUploadedMedia(prev => [...prev, { url, name: files[i].name }]);
            }
        } catch (error: any) {
            alert('Resim yüklenirken hata: ' + error.message);
        } finally {
            setContentImageUploading(false);
        }
    };

    // Insert HTML snippet at cursor position in content textarea
    const insertAtCursor = (snippet: string) => {
        const textarea = contentRef.current;
        if (!textarea) {
            setFormContent(prev => prev + snippet);
            return;
        }
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = formContent.substring(0, start);
        const after = formContent.substring(end);
        const newContent = before + snippet + after;
        setFormContent(newContent);
        // Restore cursor after inserted text
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
        }, 0);
    };

    // Wrap selected text with tags
    const wrapSelection = (tagOpen: string, tagClose: string) => {
        const textarea = contentRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = formContent.substring(start, end) || 'metin';
        const wrapped = tagOpen + selectedText + tagClose;
        const before = formContent.substring(0, start);
        const after = formContent.substring(end);
        setFormContent(before + wrapped + after);
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = start + tagOpen.length;
            textarea.selectionEnd = start + tagOpen.length + selectedText.length;
        }, 0);
    };

    const insertImageToContent = (url: string) => {
        insertAtCursor(`\n<figure style="margin:20px 0">\n  <img src="${url}" alt="" style="width:100%;border-radius:12px" />\n  <figcaption style="text-align:center;color:#999;font-size:13px;margin-top:8px">Resim açıklaması</figcaption>\n</figure>\n`);
    };

    const insertLinkedImage = (imageUrl: string, linkUrl: string) => {
        insertAtCursor(`\n<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${imageUrl}" alt="" style="width:100%;border-radius:12px;cursor:pointer" />\n</a>\n`);
    };

    const handleInsertLink = () => {
        if (!linkUrl.trim()) return;
        const text = linkText.trim() || linkUrl;
        insertAtCursor(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color:#f0b90b;font-weight:bold">${text}</a>`);
        setLinkUrl('');
        setLinkText('');
        setShowLinkModal(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedUrl(text);
        setTimeout(() => setCopiedUrl(''), 2000);
    };

    const resetForm = () => {
        setFormTitle(''); setFormExcerpt(''); setFormCategory('Futbol');
        setFormImage(''); setFormContent(''); setFormSeoTitle('');
        setFormSeoDesc(''); setFormSeoKeywords(''); setFormSlug(''); setFormStatus('draft');
        setEditingArticle(null);
        setUploadedMedia([]); setShowMediaGallery(false);
        setShowLinkModal(false); setLinkUrl(''); setLinkText('');
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
        setFormSeoKeywords(article.seoKeywords || '');
        setFormSlug(article.slug);
        setFormStatus(article.status);
        setShowForm(true);
    };

    const handleSaveArticle = async () => {
        if (!formTitle.trim()) return;
        const slug = formSlug.trim() || generateSlug(formTitle);
        const nowStr = new Date().toISOString();

        const item = {
            title: formTitle,
            slug,
            excerpt: formExcerpt,
            category: formCategory,
            image: formImage,
            content: formContent,
            seo_title: formSeoTitle,
            seo_description: formSeoDesc,
            seo_keywords: formSeoKeywords,
            status: formStatus,
            updated_at: nowStr,
            author_id: role,
            author_name: role === 'admin' ? 'Admin' : role.replace('author_', ''),
        };

        if (editingArticle) {
            const { error } = await supabase
                .from('news')
                .update(item)
                .eq('id', editingArticle.id);
            if (error) alert('Hata: ' + error.message);
        } else {
            const { error } = await supabase
                .from('news')
                .insert([{ ...item, views: 0, created_at: nowStr }]);
            if (error) alert('Hata: ' + error.message);
        }
        
        fetchArticles();
        setShowForm(false);
        resetForm();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (error) alert('Silme hatası: ' + error.message);
        fetchArticles();
    };

    const handleToggleStatus = async (article: NewsArticle) => {
        const nextStatus = article.status === 'published' ? 'draft' : 'published';
        const { error } = await supabase
            .from('news')
            .update({ status: nextStatus, updated_at: new Date().toISOString() })
            .eq('id', article.id);
        if (error) alert('Hata: ' + error.message);
        fetchArticles();
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
        const updated = [...authors, newAuthor];
        setAuthors(updated);
        localStorage.setItem('site_news_authors', JSON.stringify(updated));
        setNewAuthorUsername(''); setNewAuthorPassword(''); setNewAuthorDisplayName('');
    };

    const handleDeleteAuthor = (id: string) => {
        if (!window.confirm('Yazarı silmek istediğinize emin misiniz?')) return;
        const updated = authors.filter(a => a.id !== id);
        setAuthors(updated);
        localStorage.setItem('site_news_authors', JSON.stringify(updated));
    };

    // AI Bulk Functions
    const startAiChat = () => {
        setShowAiChat(true);
        setAiBulkInput('');
        setAiPreviews([]);
        setAiError('');
    };

    const handleGenerateBulk = async () => {
        if (!aiBulkInput.trim()) return;
        if (!openAiKey) {
            setAiError('Lütfen önce OpenAI API anahtarınızı girin.');
            return;
        }

        setIsGenerating(true);
        setAiError('');
        try {
            const results = await generateBulkAiArticles(aiBulkInput, openAiKey);
            setAiPreviews(results);
        } catch (error: any) {
            setAiError(error.message || 'Haberler üretilirken bir hata oluştu.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImportArticle = async (preview: AiGeneratedArticle) => {
        const now = Date.now();
        const title = preview.title;
        const slug = generateSlug(title);
        
        const { error } = await supabase.from('news').insert([{
            title: title,
            slug,
            excerpt: preview.excerpt,
            content: preview.content,
            category: preview.category || 'Futbol',
            image: `https://picsum.photos/seed/${slug}/800/450`,
            author_id: role,
            author_name: role === 'admin' ? 'Admin' : role.replace('author_', ''),
            views: 0,
            status: 'draft',
            seo_title: preview.seoTitle,
            seo_description: preview.seoDesc,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }]);
        
        if (!error) fetchArticles();
        setAiPreviews(prev => prev.filter(p => p !== preview));
    };

    const handleImportAll = () => {
        aiPreviews.forEach(p => handleImportArticle(p));
        setShowAiChat(false);
    };

    const inputClass = "w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-[#f0b90b] transition-colors outline-none placeholder-zinc-600";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">📰 Haber Yönetimi</h2>
                    <p className="text-zinc-500 text-xs font-bold mt-1">{articles.length} haber mevcut</p>
                </div>
                <div className="flex gap-3 flex-wrap">
                    {isAdmin && (
                        <button
                            onClick={() => setShowAuthors(!showAuthors)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all"
                        >
                            <Users className="w-3.5 h-3.5" /> Yazarlar
                        </button>
                    )}
                    <button
                        onClick={startAiChat}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/30"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> AI ile Yaz
                    </button>
                    <button
                        onClick={openNewForm}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-[#f0b90b] text-black hover:bg-[#f0b90b]/90 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" /> Yeni Haber
                    </button>
                </div>
            </div>

            {/* AI Bulk Panel */}
            {showAiChat && (
                <div className="rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.15)] bg-[#0a0a0f]">
                    {/* AI Header */}
                    <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-purple-300" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm uppercase">AI Toplu Haber Hazırlayıcı</h3>
                                <p className="text-purple-300 text-[10px] font-bold">Listelediğiniz haberleri AI tek tek yazar</p>
                            </div>
                        </div>
                        <button onClick={() => setShowAiChat(false)} className="text-zinc-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {!openAiKey && (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-3">
                                <p className="text-red-400 text-xs font-bold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> OpenAI API anahtarınız eksik!
                                </p>
                                <div className="flex gap-3">
                                    <input 
                                        type="password"
                                        placeholder="sk-..."
                                        className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-white text-xs outline-none focus:border-[#f0b90b]"
                                        onChange={(e) => {
                                            const key = e.target.value.trim().replace(/[^\x20-\x7E]/g, '');
                                            if (key.startsWith('sk-')) {
                                                setOpenAiKey(key);
                                                localStorage.setItem('site_openai_key', key);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest pl-1">Haber Listesi (Numaralandırılmış)</label>
                            <textarea
                                value={aiBulkInput}
                                onChange={e => setAiBulkInput(e.target.value)}
                                placeholder="Örn:\n1. Galatasaray bugün antrenman yaptı\n2. Fenerbahçe'de yeni transfer gelişmesi\n3. NBA'de gecenin sonuçları..."
                                className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-purple-500 transition-colors outline-none placeholder-zinc-700 resize-none font-medium"
                                disabled={isGenerating}
                            />
                        </div>

                        {aiError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                                {aiError}
                            </div>
                        )}

                        <button
                            onClick={handleGenerateBulk}
                            disabled={isGenerating || !aiBulkInput.trim() || !openAiKey}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-purple-900/40 disabled:opacity-40 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Haberler Yazılıyor...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Yapay Zekaya Yazdır
                                </>
                            )}
                        </button>

                        {/* Previews List */}
                        {aiPreviews.length > 0 && (
                            <div className="mt-8 space-y-4 pt-6 border-t border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-white font-black text-xs uppercase tracking-widest">Hazırlanan Haberler ({aiPreviews.length})</h4>
                                    <button 
                                        onClick={handleImportAll}
                                        className="text-[10px] font-black uppercase text-emerald-400 hover:text-emerald-300 transition-colors"
                                    >
                                        Hepsini Aktar
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {aiPreviews.map((p, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                                            <div className="flex items-start justify-between gap-3">
                                                <h5 className="text-white text-xs font-bold leading-tight">{p.title}</h5>
                                                <button 
                                                    onClick={() => handleImportArticle(p)}
                                                    className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-all"
                                                    title="Aktar"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-zinc-500 text-[10px] line-clamp-2">{p.excerpt}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

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

                    {/* ═══ KAPAK FOTOĞRAFI BÖLÜMÜ ═══ */}
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                        <label className="text-[#f0b90b] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5" /> Kapak Fotoğrafı
                        </label>
                        {formImage ? (
                            <div className="relative rounded-xl overflow-hidden border border-zinc-700" style={{ maxHeight: '200px' }}>
                                <img src={formImage} className="w-full h-full object-cover" alt="Kapak" style={{ maxHeight: '200px' }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                                    <label className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all cursor-pointer">
                                        <Upload className="w-3.5 h-3.5" /> Değiştir
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                    </label>
                                    <button onClick={() => setFormImage('')} className="px-4 py-2 rounded-lg bg-red-500/20 backdrop-blur-sm text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <label className="flex-1 flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed border-zinc-700 hover:border-[#f0b90b]/50 bg-zinc-900/50 hover:bg-[#f0b90b]/5 transition-all cursor-pointer group">
                                    <div className="w-12 h-12 rounded-full bg-[#f0b90b]/10 border border-[#f0b90b]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5 text-[#f0b90b]" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white text-xs font-bold">Dosya Yükle</p>
                                        <p className="text-zinc-600 text-[9px] mt-0.5">JPG, PNG, WEBP · Max 5MB</p>
                                    </div>
                                    {isUploading && <div className="w-5 h-5 border-2 border-[#f0b90b]/30 border-t-[#f0b90b] rounded-full animate-spin" />}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                                </label>
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">veya URL yapıştır</label>
                                    <input value={formImage} onChange={e => setFormImage(e.target.value)} placeholder="https://ornek.com/resim.jpg" className={inputClass + " flex-1"} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ İÇERİK EDİTÖRÜ ═══ */}
                    <div className="rounded-xl border border-zinc-800 overflow-hidden">
                        {/* Biçimlendirme Araç Çubuğu */}
                        <div className="bg-zinc-950 border-b border-zinc-800 px-3 py-2 flex items-center gap-1 flex-wrap">
                            <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mr-2">Biçim:</span>
                            <button onClick={() => wrapSelection('<strong>', '</strong>')} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all" title="Kalın"><Bold className="w-3.5 h-3.5" /></button>
                            <button onClick={() => wrapSelection('<em>', '</em>')} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all" title="İtalik"><Italic className="w-3.5 h-3.5" /></button>
                            <button onClick={() => insertAtCursor('\n<h2>Alt Başlık</h2>\n')} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all" title="Alt Başlık"><Heading2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => insertAtCursor('\n<p>Yeni paragraf...</p>\n')} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all" title="Paragraf"><Type className="w-3.5 h-3.5" /></button>
                            <button onClick={() => insertAtCursor('\n<ul>\n  <li>Madde 1</li>\n  <li>Madde 2</li>\n  <li>Madde 3</li>\n</ul>\n')} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all" title="Liste"><List className="w-3.5 h-3.5" /></button>
                            <button onClick={() => insertAtCursor('\n<blockquote style="border-left:3px solid #f0b90b;padding:12px 16px;background:rgba(240,185,11,0.05);border-radius:8px;margin:16px 0;font-style:italic;color:#ccc">Alıntı metni...</blockquote>\n')} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all" title="Alıntı"><Quote className="w-3.5 h-3.5" /></button>
                            
                            <div className="w-px h-5 bg-zinc-800 mx-1" />
                            
                            <span className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mr-2">Medya:</span>
                            <button onClick={() => setShowLinkModal(!showLinkModal)} className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-[#f0b90b] hover:bg-zinc-800 transition-all" title="Link Ekle"><LinkIcon className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setShowMediaGallery(!showMediaGallery)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${showMediaGallery ? 'text-[#f0b90b] bg-[#f0b90b]/10' : 'text-zinc-400 hover:text-[#f0b90b] hover:bg-zinc-800'}`} title="Medya Kütüphanesi"><ImagePlus className="w-3.5 h-3.5" /></button>
                            <label className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition-all cursor-pointer" title="Hızlı Resim Yükle">
                                {contentImageUploading ? <div className="w-3.5 h-3.5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleContentImageUpload} disabled={contentImageUploading} />
                            </label>
                        </div>

                        {/* Link Ekleme Modal */}
                        {showLinkModal && (
                            <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 space-y-2">
                                <div className="flex gap-2">
                                    <input value={linkText} onChange={e => setLinkText(e.target.value)} placeholder="Link metni (ör: Buraya tıklayın)" className="flex-1 bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-[#f0b90b]" />
                                    <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className="flex-1 bg-black border border-zinc-800 rounded-lg py-2 px-3 text-white text-xs outline-none focus:border-[#f0b90b]" />
                                    <button onClick={handleInsertLink} className="px-4 py-2 rounded-lg bg-[#f0b90b] text-black text-[10px] font-black uppercase hover:bg-[#f0b90b]/90 transition-all">Ekle</button>
                                    <button onClick={() => setShowLinkModal(false)} className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-all"><X className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        )}

                        {/* Medya Kütüphanesi */}
                        {showMediaGallery && (
                            <div className="bg-zinc-950 border-b border-zinc-800 p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#f0b90b] text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><ImagePlus className="w-3 h-3" /> Medya Kütüphanesi</span>
                                    <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600/30 transition-all cursor-pointer">
                                        {contentImageUploading ? 'Yükleniyor...' : <><Upload className="w-3 h-3" /> Yeni Resim Yükle</>}
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleContentImageUpload} disabled={contentImageUploading} />
                                    </label>
                                </div>
                                {uploadedMedia.length === 0 ? (
                                    <p className="text-zinc-600 text-[10px] text-center py-4">Henüz resim yüklenmedi. Yukarıdan resim yükleyin.</p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {uploadedMedia.map((media, idx) => (
                                            <div key={idx} className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-[#f0b90b]/50 transition-all">
                                                <img src={media.url} alt={media.name} className="w-full h-24 object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                                    <button onClick={() => insertImageToContent(media.url)} className="w-full py-1.5 rounded-lg bg-[#f0b90b] text-black text-[8px] font-black uppercase hover:bg-[#f0b90b]/90 transition-all">Makaleye Ekle</button>
                                                    <button onClick={() => { setShowLinkModal(true); setLinkUrl(''); insertLinkedImage(media.url, prompt('Resme link ver (URL):') || '#'); }} className="w-full py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase hover:bg-blue-500/30 transition-all">Linkli Ekle</button>
                                                    <button onClick={() => copyToClipboard(media.url)} className="w-full py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-[8px] font-black uppercase hover:bg-zinc-700 transition-all flex items-center justify-center gap-1">
                                                        {copiedUrl === media.url ? <><Check className="w-2.5 h-2.5" /> Kopyalandı</> : <><Copy className="w-2.5 h-2.5" /> URL Kopyala</>}
                                                    </button>
                                                </div>
                                                <div className="absolute top-1 right-1">
                                                    <button onClick={() => setUploadedMedia(prev => prev.filter((_, i) => i !== idx))} className="w-5 h-5 rounded-full bg-black/60 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-xs">×</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* İçerik Alanı */}
                        <div className="relative">
                            <textarea
                                ref={contentRef}
                                value={formContent}
                                onChange={e => setFormContent(e.target.value)}
                                placeholder={'Makalenizi buraya yazın...\n\nÖrnek kullanım:\n<h2>Alt Başlık</h2>\n<p>Paragraf metni...</p>\n\n💡 İpucu: Yukarıdaki araç çubuğunu kullanarak\nkalın, italik, başlık, resim ve link ekleyebilirsiniz.'}
                                rows={18}
                                className={inputClass + " font-mono text-xs rounded-none border-0 border-t-0 resize-y min-h-[300px]"}
                                style={{ borderRadius: '0 0 12px 12px' }}
                            />
                        </div>
                    </div>

                    {/* İçerik Önizleme */}
                    {formContent.trim() && (
                        <details className="group">
                            <summary className="text-zinc-500 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                                <Eye className="w-3 h-3" /> İçerik Önizleme
                            </summary>
                            <div className="mt-3 p-5 rounded-xl bg-zinc-950 border border-zinc-800 prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formContent }} style={{ lineHeight: '1.8', color: '#d4d4d8' }} />
                        </details>
                    )}

                    {/* SEO Fields */}
                    <details className="group">
                        <summary className="text-zinc-500 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-zinc-300 transition-colors flex items-center gap-1.5">
                            <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" /> SEO Ayarları
                        </summary>
                        <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                            <div>
                                <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1.5 ml-1">Meta Title</label>
                                <input value={formSeoTitle} onChange={e => setFormSeoTitle(e.target.value)} placeholder="Arama motoru başlığı..." className={inputClass} />
                            </div>
                            <div>
                                <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1.5 ml-1">Meta Description</label>
                                <textarea value={formSeoDesc} onChange={e => setFormSeoDesc(e.target.value)} placeholder="Arama motoru açıklaması..." rows={2} className={inputClass} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1.5 ml-1">Meta Keywords (SEO)</label>
                                    <input value={formSeoKeywords} onChange={e => setFormSeoKeywords(e.target.value)} placeholder="anahtar, kelimeler, spor, haber" className={inputClass} />
                                </div>
                                <div>
                                    <label className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block mb-1.5 ml-1">URL / Slug</label>
                                    <input value={formSlug} onChange={e => setFormSlug(e.target.value)} placeholder="haber-linki-yapisi" className={inputClass} />
                                </div>
                            </div>
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
                {articles.length === 0 && !showForm && !showAiChat && (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3">📰</div>
                        <p className="text-zinc-500 text-sm font-bold">Henüz haber eklenmedi.</p>
                        <p className="text-zinc-600 text-xs mt-1">Yukarıdaki "Yeni Haber" veya "AI ile Yaz" butonuyla başlayın.</p>
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
                            <button onClick={() => handleToggleStatus(article)} className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" title={article.status === 'published' ? 'Taslağa çevir' : 'Yayınla'}>
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
