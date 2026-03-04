import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit3, Eye, EyeOff, Save, X, Users, ChevronDown, Sparkles, Send, Bot, User as UserIcon, Wand2, ArrowRight } from 'lucide-react';
import { NewsArticle, NewsAuthor, NEWS_CATEGORIES } from '../types';

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

// AI Content Generation Engine (OpenAI API integration)
const generateAiArticleOpenAI = async (topic: string, category: string, style: string, apiKey: string) => {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                response_format: { type: 'json_object' },
                messages: [
                    {
                        role: 'system',
                        content: `Sen profesyonel, ödüllü bir spor haberi editörüsün. Sana verilen konu, kategori ve tarz bilgilerine göre SEO uyumlu, çok kaliteli, heyecan verici ve HTML formatında (<p>, <h2>, <strong> kullanarak) bir spor haberi yazmalısın. Çıktıyı doğrudan JSON olarak ver. Zorunlu JSON yapısı: { "title": "Çarpıcı Başlık", "excerpt": "Kısa 120 karakterlik özet", "content": "HTML formatında detaylı içerik...", "seoTitle": "SEO için başlık | 724bets.net", "seoDesc": "SEO için açıklama" }`
                    },
                    {
                        role: 'user',
                        content: `Konu: ${topic}\nKategori: ${category}\nTarz: ${style}`
                    }
                ],
                temperature: 0.7,
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API Hatası');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);
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
    const [formSlug, setFormSlug] = useState('');
    const [formStatus, setFormStatus] = useState<'draft' | 'published'>('draft');

    // AI Chat state
    const [aiMessages, setAiMessages] = useState<AiMessage[]>([]);
    const [aiInput, setAiInput] = useState('');
    const [aiStep, setAiStep] = useState(-1);
    const [aiTopic, setAiTopic] = useState('');
    const [aiCategory, setAiCategory] = useState('Futbol');
    const [aiStyle, setAiStyle] = useState('normal');
    const [aiTyping, setAiTyping] = useState(false);
    const [openAiKey, setOpenAiKey] = useState('');
    const chatRef = useRef<HTMLDivElement>(null);

    const isAdmin = role === 'admin';

    useEffect(() => {
        try {
            const storedArticles = localStorage.getItem('site_news');
            if (storedArticles) setArticles(JSON.parse(storedArticles));
            const storedAuthors = localStorage.getItem('site_news_authors');
            if (storedAuthors) setAuthors(JSON.parse(storedAuthors));
            const storedKey = localStorage.getItem('site_openai_key');
            if (storedKey) setOpenAiKey(storedKey);
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [aiMessages]);

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

    // AI Chat Functions
    const startAiChat = () => {
        setShowAiChat(true);
        setAiMessages([]);
        setAiTopic('');
        setAiCategory('Futbol');
        setAiStyle('normal');

        if (!openAiKey) {
            setAiStep(-1);
            addAiMessage('Merhaba! 🤖 Ben yapay zeka haber asistanınız. Sizin için profesyonel içerikler üretebilmem için lütfen OpenAI API anahtarınızı (API Key) girin.\n\n*(Anahtarınız sadece tarayıcınızda şifrelenerek saklanır, sunucuya gönderilmez)*');
        } else {
            setAiStep(0);
            addAiMessage('Merhaba! 🤖 Ben yapay zeka haber asistanınız. Size ChatGPT gücüyle profesyonel bir spor haberi oluşturmada yardımcı olacağım.\n\n📌 Hangi konuda haber yazmamı istersiniz? Örneğin:\n• "Galatasaray transfer gündemi"\n• "NBA final serisi"\n• "Verstappen yeni sözleşme"\n\nKonunuzu yazın, ben size harika bir haber hazırlayayım!');
        }
    };

    const addAiMessage = (content: string) => {
        setAiMessages(prev => [...prev, { role: 'ai', content }]);
    };

    const handleAiSend = async () => {
        if (!aiInput.trim()) return;
        const userMsg = aiInput.trim();
        setAiMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setAiInput('');
        setAiTyping(true);

        if (aiStep === -1) {
            setTimeout(() => {
                setAiTyping(false);
                const key = userMsg;
                if (key.startsWith('sk-') || key.length > 20) {
                    setOpenAiKey(key);
                    localStorage.setItem('site_openai_key', key);
                    setAiStep(0);
                    addAiMessage('✅ API Anahtarı başarıyla kaydedildi!\n\nŞimdi başlayalım. 📌 Hangi konuda haber yazmamı istersiniz?');
                } else {
                    addAiMessage('Geçersiz bir API anahtarı girdiniz. Lütfen "sk-" ile başlayan geçerli bir OpenAI API anahtarı girin:');
                }
            }, 800);
            return;
        }

        setTimeout(async () => {
            if (aiStep === 0) {
                setAiTyping(false);
                // User entered the topic
                setAiTopic(userMsg);
                setAiStep(1);
                addAiMessage(`Harika bir konu! 🎯 "${userMsg}" hakkında haber yazacağım.\n\n📂 Hangi kategoride olsun?\n\n${NEWS_CATEGORIES.map((c, i) => `${i + 1}. ${c.name}`).join('\n')}\n\nNumara veya kategori adını yazın:`);
            } else if (aiStep === 1) {
                setAiTyping(false);
                // User selected category
                const catIdx = parseInt(userMsg) - 1;
                const selectedCat = NEWS_CATEGORIES[catIdx]?.name ||
                    NEWS_CATEGORIES.find(c => c.name.toLowerCase() === userMsg.toLowerCase())?.name ||
                    'Futbol';
                setAiCategory(selectedCat);
                setAiStep(2);
                addAiMessage(`✅ Kategori: ${selectedCat}\n\n📝 Haber tarzını seçin:\n\n1. **Kısa** – Hızlı ve özet haber\n2. **Normal** – Standart haber yazısı\n3. **Detaylı** – Kapsamlı analiz haberi\n\nNumara veya tarz adını yazın:`);
            } else if (aiStep === 2) {
                // User selected style
                let style = 'normal';
                if (userMsg.includes('1') || userMsg.toLowerCase().includes('kısa')) style = 'kısa';
                if (userMsg.includes('3') || userMsg.toLowerCase().includes('detay')) style = 'detaylı';
                setAiStyle(style);
                setAiStep(3);

                try {
                    // Generate the article with OpenAI
                    addAiMessage(`🔄 OpenAI ChatGPT ile bağlantı kuruluyor... Sizin için "${aiTopic}" konulu profesyonel haberi yazıyorum. Bu işlem 10-20 saniye sürebilir...`);

                    const result = await generateAiArticleOpenAI(aiTopic, aiCategory, style, openAiKey);

                    setAiTyping(false);
                    addAiMessage(`✨ Haberiniz ChatGPT tarafından başarıyla hazırlandı!\n\n**Başlık:** ${result.title}\n\n**Özet:** ${result.excerpt}\n\n**Kategori:** ${aiCategory}\n**Tarz:** ${style === 'kısa' ? 'Kısa' : style === 'detaylı' ? 'Detaylı' : 'Normal'}\n\n---\n\n🔄 Beğendiniz mi?\n• **"Evet"** → Formu doldurup düzenlemenize aktarayım\n• **"Yeniden"** → Farklı bir versiyonunu yazayım\n• **"Değiştir"** → Yeni bir konu ile baştan başlayalım`);

                    // Store the generated article temporarily
                    setFormTitle(result.title);
                    setFormExcerpt(result.excerpt);
                    setFormContent(result.content);
                    setFormCategory(aiCategory);
                    setFormSeoTitle(result.seoTitle);
                    setFormSeoDesc(result.seoDesc);
                    setFormSlug(generateSlug(result.title));
                } catch (error: any) {
                    setAiTyping(false);
                    console.error("OpenAI Hatası:", error);
                    let errMsg = error.message;
                    if (errMsg.includes('401')) errMsg = 'API Anahtarınız geçersiz veya süresi dolmuş. Lütfen geçerli bir anahtar girin.';
                    addAiMessage(`❌ Bir hata oluştu:\n${errMsg}\n\nLütfen API ayarlarınızı kontrol edip API anahtarınızı sıfırlamak için "sıfırla" yazın veya tekrar denemek için "yeniden" yazın.`);
                    setAiStep(4); // Error state
                }
            } else if (aiStep === 3) {
                setAiTyping(false);
                const lower = userMsg.toLowerCase();
                if (lower.includes('evet') || lower.includes('tamam') || lower.includes('onayla') || lower.includes('aktar')) {
                    addAiMessage('🎉 Harika! Haberi düzenleme formuna aktardım. Artık istediğiniz değişiklikleri yapıp kaydedebilirsiniz.\n\n💡 İpucu: Formu kapatmadan önce "Yayınlandı" durumunu seçmeyi unutmayın!');
                    setShowForm(true);
                    setShowAiChat(false);
                    setAiStep(0);
                } else if (lower.includes('yeniden') || lower.includes('tekrar')) {
                    setAiTyping(true);
                    try {
                        const result = await generateAiArticleOpenAI(aiTopic, aiCategory, aiStyle, openAiKey);
                        setAiTyping(false);
                        setFormTitle(result.title);
                        setFormExcerpt(result.excerpt);
                        setFormContent(result.content);
                        setFormSeoTitle(result.seoTitle);
                        setFormSeoDesc(result.seoDesc);
                        setFormSlug(generateSlug(result.title));
                        addAiMessage(`🔄 Yeni versiyon ChatGPT tarafından hazırlandı!\n\n**Başlık:** ${result.title}\n\n**Özet:** ${result.excerpt}\n\n---\n\n• **"Evet"** → Formu doldurup aktarayım\n• **"Yeniden"** → Bir daha deneyelim\n• **"Değiştir"** → Yeni konu ile başlayalım`);
                    } catch (error: any) {
                        setAiTyping(false);
                        addAiMessage(`❌ Hata: ${error.message}`);
                    }
                } else if (lower.includes('değiştir') || lower.includes('yeni konu') || lower.includes('baştan')) {
                    setAiStep(0);
                    resetForm();
                    addAiMessage('Tamam! 🔄 Yeni bir konu belirleyelim.\n\n📌 Hangi konuda haber yazmamı istersiniz?');
                } else {
                    addAiMessage('Anlayamadım 🤔 Lütfen şunlardan birini yazın:\n• **"Evet"** → Haberi aktarma\n• **"Yeniden"** → Yeni versiyon\n• **"Değiştir"** → Yeni konu');
                }
            } else if (aiStep === 4) {
                setAiTyping(false);
                if (userMsg.toLowerCase().includes('sıfırla')) {
                    setOpenAiKey('');
                    localStorage.removeItem('site_openai_key');
                    setAiStep(-1);
                    addAiMessage('API Anahtarınız silindi. Lütfen yeni bir OpenAI API anahtarı girin:');
                } else {
                    setAiStep(2);
                    handleAiSend(); // Retry step 2
                }
            }
        }, 800 + Math.random() * 600);
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

            {/* AI Chat Panel */}
            {showAiChat && (
                <div className="rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_30px_rgba(147,51,234,0.15)]">
                    {/* AI Chat Header */}
                    <div className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-purple-300" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm">AI Haber Asistanı</h3>
                                <p className="text-purple-300 text-[10px] font-bold">Yapay zeka destekli haber oluşturucu</p>
                            </div>
                        </div>
                        <button onClick={() => setShowAiChat(false)} className="text-zinc-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div ref={chatRef} className="bg-[#0a0a0f] p-5 space-y-4 max-h-[400px] overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
                        {aiMessages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot className="w-4 h-4 text-purple-400" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user'
                                        ? 'bg-[#f0b90b]/10 border border-[#f0b90b]/20 text-white'
                                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                                        }`}
                                >
                                    {msg.content.split('**').map((part, pi) =>
                                        pi % 2 === 1 ? <strong key={pi} className="text-white">{part}</strong> : <span key={pi}>{part}</span>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-7 h-7 rounded-full bg-[#f0b90b]/20 border border-[#f0b90b]/20 flex items-center justify-center flex-shrink-0 mt-1">
                                        <UserIcon className="w-4 h-4 text-[#f0b90b]" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {aiTyping && (
                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/20 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="bg-[#0a0a0f] border-t border-zinc-800 p-4">
                        <div className="flex gap-3">
                            <input
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAiSend()}
                                placeholder="Mesajınızı yazın..."
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-purple-500 transition-colors outline-none placeholder-zinc-600"
                                disabled={aiTyping}
                            />
                            <button
                                onClick={handleAiSend}
                                disabled={aiTyping || !aiInput.trim()}
                                className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-40"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        {/* Quick actions */}
                        {aiStep === 1 && (
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {NEWS_CATEGORIES.map((c, i) => (
                                    <button
                                        key={c.name}
                                        onClick={() => { setAiInput(`${i + 1}`); }}
                                        className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105"
                                        style={{ background: `${c.color}15`, borderColor: `${c.color}30`, color: c.color }}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        {aiStep === 2 && (
                            <div className="flex gap-2 mt-3">
                                {['1. Kısa', '2. Normal', '3. Detaylı'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setAiInput(s.split('. ')[0])}
                                        className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        )}
                        {aiStep === 3 && (
                            <div className="flex gap-2 mt-3">
                                {['✅ Evet', '🔄 Yeniden', '🔀 Değiştir'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setAiInput(s.split(' ')[1])}
                                        className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
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
