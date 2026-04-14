import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronDown } from 'lucide-react';

// ─────────────── KNOWLEDGE BASE ───────────────
const WHATSAPP_LINK = 'https://wa.me/905XXXXXXXXX?text=724bahis.net.net%20sitesinden%20destek%20istiyorum';

interface Message {
    from: 'bot' | 'user';
    text: string;
    time: string;
}

const now = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

const MATCH_SCHEDULE: Record<string, string[]> = {
    '1 Mart': [
        '🏀 NBA — OKC Thunder vs Denver Nuggets\n🕒 Saat: 04:00 TSİ\n📺 Yayın: 724bahis.net.net',
        '🏀 EuroLeague — Anadolu Efes Maçı\n🕒 Saat: 20:30 TSİ\n📺 Yayın: 724bahis.net.net',
    ],
    '2 Mart': [
        '🏀 BSL — Bursaspor Maçı\n🕒 Saat: 19:00 TSİ\n📺 Yayın: 724bahis.net.net',
        '🏀 NBA — Golden State Warriors Maçı\n🕒 Saat: 04:30 TSİ\n📺 Yayın: 724bahis.net.net',
    ],
};

const SUPPORT_TRIGGERS = ['ödeme', 'üyelik sorunu', 'reklam', 'iş birliği', 'canlı destek', 'canlı destekle', 'görüşmek istiyorum', 'yardım'];

function getBotReply(input: string): string {
    const msg = input.toLowerCase().trim();

    // WhatsApp / Support triggers
    if (SUPPORT_TRIGGERS.some(t => msg.includes(t))) {
        return `Size daha hızlı yardımcı olabilmemiz için lütfen 724bahis.net.net WhatsApp hattımıza yazın:\n\n👉 ${WHATSAPP_LINK}`;
    }

    // Match schedule queries
    if (msg.includes('1 mart') || msg.includes('yarın') && new Date().getDate() === 28) {
        return `📅 1 Mart Maç Programı:\n\n${MATCH_SCHEDULE['1 Mart'].join('\n\n')}`;
    }
    if (msg.includes('2 mart')) {
        return `📅 2 Mart Maç Programı:\n\n${MATCH_SCHEDULE['2 Mart'].join('\n\n')}`;
    }
    if (msg.includes('bugün') || msg.includes('bu gün') || msg.includes('maç var mı') || msg.includes('müsabaka')) {
        const today = new Date();
        const dayStr = `${today.getDate()} Mart`;
        const schedule = MATCH_SCHEDULE[dayStr];
        if (schedule) {
            return `📅 Bugünkü (${dayStr}) Maç Programı:\n\n${schedule.join('\n\n')}`;
        }
        return `Bugün için kayıtlı güncel yayın programım şu an mevcut değil. En güncel bilgi için WhatsApp hattımıza yazabilirsiniz:\n\n👉 ${WHATSAPP_LINK}`;
    }

    // NBA
    if (msg.includes('nba') || msg.includes('basketbol')) {
        return `🏀 NBA & Basketbol yayınlarımızı 724bahis.net.net üzerinden canlı takip edebilirsiniz!\n\nYaklaşan NBA maçları için günlük yayın akışını menüden görebilirsiniz. Özel maç sorularınız için:\n📅 1 Mart: OKC - Denver (04:00 TSİ)\n📅 2 Mart: GSW maçı (04:30 TSİ)`;
    }

    // Football
    if (msg.includes('futbol') || msg.includes('süper lig') || msg.includes('premier') || msg.includes('la liga')) {
        return `⚽ Futbol yayınları ve analizleri için 724bahis.net.net'in **Analizler** bölümünü inceleyin!\n\nGünlük maç tahminlerini ve istatistiksel analizlerimizi ücretsiz görüntüleyebilirsiniz.`;
    }

    // EuroLeague / BSL
    if (msg.includes('euroleague') || msg.includes('euro') || msg.includes('bsl') || msg.includes('efes') || msg.includes('anadolu')) {
        return `🏀 EuroLeague & BSL Yayınları:\n\n${MATCH_SCHEDULE['1 Mart'][1]}\n\n${MATCH_SCHEDULE['2 Mart'][0]}`;
    }

    // Odds / Predictions
    if (msg.includes('tahmin') || msg.includes('oran') || msg.includes('analiz')) {
        return `📊 Analizlerimiz istatistiksel veriler ve öne çıkan performanslara dayanmaktadır.\n\nKesin sonuç garantisi verilmez; bahis kendi kararınızdır. Güncel analizler için siteyi takipte kalın! 🎯`;
    }

    // Live betting
    if (msg.includes('canlı bahis') || msg.includes('live bet')) {
        return `🔴 Canlı bahis için partner bahis sitelerimizi incelemenizi öneririz.\n\n"Güvenilir Firmalar" bölümümüzden lisanslı ve güvenilir operatörlere ulaşabilirsiniz.`;
    }

    // Membership
    if (msg.includes('üye') || msg.includes('kayıt') || msg.includes('giriş') || msg.includes('şifre')) {
        return `🔐 Üyelik işlemleri için sağ üstteki **"Giriş Yap"** butonunu kullanabilirsiniz.\n\nSorun yaşıyorsanız WhatsApp destek hattımıza yazın:\n👉 ${WHATSAPP_LINK}`;
    }

    // Hello / Greeting
    if (msg.includes('merhaba') || msg.includes('selam') || msg.includes('hey') || msg === 'hi' || msg === 'hello') {
        return `Merhaba! 👋 Ben 724bahis.net.net asistanıyım.\n\nSize şu konularda yardımcı olabilirim:\n• 🏀 Maç saatleri & yayın programı\n• 📊 Analiz & tahmin bilgisi\n• 🔧 Teknik destek\n• 💬 Canlı destek yönlendirme\n\nNasıl yardımcı olabilirim?`;
    }

    // 724BAHİS.NET / sponsors
    if (msg.includes('724bahis.net') || msg.includes('sponsor') || msg.includes('reklam')) {
        return `✨ 724BAHİS.NET, sitemizin ana sponsorudur.\n\nAyrıcalıklı bonus ve kampanyalar için:\n🌐 724bahis.net.net\n\nİş birliği talepleriniz için:\n👉 ${WHATSAPP_LINK}`;
    }

    // Default
    return `Anlıyorum! Bu konuda size en hızlı şekilde yardımcı olmak için WhatsApp hattımıza yönlendirebilirim:\n\n👉 ${WHATSAPP_LINK}\n\nYa da şunları sorabilirsiniz:\n• "Bugün maç var mı?"\n• "1 Mart programı nedir?"\n• "NBA maçları ne zaman?"`;
}

const QUICK_REPLIES = [
    'Bugün maç var mı?',
    '1 Mart programı',
    'NBA maçları',
    'Canlı destek',
];

const ChatBot: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            from: 'bot',
            text: 'Merhaba! 👋 Ben Banu, 724bahis.net.net canlı destek asistanınızım. Size nasıl yardımcı olabilirim? 😊',
            time: now(),
        },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [unread, setUnread] = useState(1);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            setUnread(0);
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [open, messages]);

    const send = (text?: string) => {
        const msg = text || input.trim();
        if (!msg) return;
        setInput('');
        setMessages(prev => [...prev, { from: 'user', text: msg, time: now() }]);
        setTyping(true);
        setTimeout(() => {
            const reply = getBotReply(msg);
            setMessages(prev => [...prev, { from: 'bot', text: reply, time: now() }]);
            setTyping(false);
            if (!open) setUnread(u => u + 1);
        }, 800 + Math.random() * 600);
    };

    return (
        <>
            {/* Floating trigger button + Canlı Destek label */}
            <div className="fixed bottom-6 right-6 z-[9000] flex flex-col items-center gap-2">
                <button
                    onClick={() => setOpen(o => !o)}
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl"
                    style={{
                        background: 'linear-gradient(135deg, #f0b90b, #d4a017)',
                        boxShadow: '0 0 30px rgba(240,185,11,0.55)',
                    }}
                    title="Canlı Destek - Banu"
                >
                    {open ? <ChevronDown className="w-7 h-7 text-black" /> : <MessageCircle className="w-7 h-7 text-black" />}
                    {!open && unread > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                            {unread}
                        </span>
                    )}
                </button>
                <span
                    className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ background: 'rgba(240,185,11,0.12)', color: '#f0b90b', border: '1px solid rgba(240,185,11,0.3)' }}
                >
                    🟢 Canlı Destek
                </span>
            </div>

            {/* Chat panel */}
            <div
                className="fixed bottom-24 right-6 z-[8999] w-[340px] max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden flex flex-col"
                style={{
                    background: 'var(--bg-card)',
                    border: '1.5px solid var(--border-card)',
                    boxShadow: 'var(--shadow-modal)',
                    height: open ? '480px' : '0px',
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'all' : 'none',
                    transition: 'height 0.35s cubic-bezier(0.34,1.2,0.64,1), opacity 0.25s ease',
                }}
            >
                {/* Header */}
                <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
                    style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 12px rgba(240,185,11,0.4)' }}>
                        <span className="text-black font-black text-[8px] leading-tight uppercase text-center">724<br />BETS</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>Banu · Canlı Destek</div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-green-400 text-[10px] font-bold">Çevrimiçi · TSİ saatleri</span>
                        </div>
                    </div>
                    <button onClick={() => setOpen(false)} className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className="max-w-[85%]">
                                <div
                                    className="px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-line"
                                    style={msg.from === 'bot'
                                        ? {
                                            background: 'rgba(240,185,11,0.06)',
                                            border: '1px solid rgba(240,185,11,0.15)',
                                            color: 'var(--text-secondary)',
                                            borderRadius: '4px 18px 18px 18px',
                                        }
                                        : {
                                            background: 'linear-gradient(135deg, #f0b90b, #d4a017)',
                                            color: '#000',
                                            fontWeight: 700,
                                            borderRadius: '18px 4px 18px 18px',
                                        }
                                    }
                                >
                                    {msg.text.includes('wa.me') ? (
                                        <>
                                            {msg.text.split('\n\n👉 ')[0]}
                                            {'\n\n'}
                                            <a
                                                href={WHATSAPP_LINK}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 mt-2 px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider text-black"
                                                style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)', textDecoration: 'none' }}
                                            >
                                                💬 WhatsApp Desteği Aç
                                            </a>
                                        </>
                                    ) : msg.text}
                                </div>
                                <div className="text-[#9CA3AF] text-[9px] font-bold mt-1 px-1 text-right">{msg.time}</div>
                            </div>
                        </div>
                    ))}

                    {typing && (
                        <div className="flex justify-start">
                            <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                                style={{ background: 'rgba(240,185,11,0.05)', border: '1px solid rgba(240,185,11,0.12)', borderRadius: '4px 18px 18px 18px' }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#f0b90b]"
                                        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                {/* Quick replies */}
                <div className="flex-shrink-0 px-3 pb-2 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {QUICK_REPLIES.map(q => (
                        <button
                            key={q}
                            onClick={() => send(q)}
                            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all hover:border-[#f0b90b]/50 hover:text-[#f0b90b]"
                            style={{ border: '1px solid var(--border-card)', color: 'var(--text-muted)', background: 'transparent', whiteSpace: 'nowrap' }}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="flex-shrink-0 flex items-center gap-2 px-3 pb-3">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm placeholder-[#9CA3AF] outline-none transition-all"
                        style={{
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-card)',
                            color: 'var(--text-primary)',
                        }}
                        onFocus={e => { e.target.style.borderColor = 'rgba(240,185,11,0.4)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.08)'; }}
                    />
                    <button
                        onClick={() => send()}
                        disabled={!input.trim()}
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 disabled:opacity-30"
                        style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 12px rgba(240,185,11,0.3)' }}
                    >
                        <Send className="w-4 h-4 text-black" />
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
        </>
    );
};

export default ChatBot;
