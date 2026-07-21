const fs = require('fs');
let content = fs.readFileSync('components/TV724View.tsx', 'utf8');

// 1. Add states for Matches and the new Tabs
const stateInjection = `    const [activeTab, setActiveTab] = useState<'channels' | 'vods'>('channels');`;
const newStates = `    const [tvTab, setTvTab] = useState<'maclar' | 'kanallar' | 'sohbet'>('maclar');
    const [tvMatches, setTvMatches] = useState<any[]>([]);

    useEffect(() => {
        fetch('/prelive_matches.json')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    // Sadece en yakın 20 maçı alalım
                    setTvMatches(data.slice(0, 20));
                }
            }).catch(e => console.log('Matches fetch error:', e));
    }, []);

    const [activeTab, setActiveTab] = useState<'channels' | 'vods'>('channels');`;

content = content.replace(stateInjection, newStates);

// 2. Replace the render body
const renderStartMarker = `    return (\n        <div ref={wrapperRef}`;
const renderEndMarker = `export default TV724View;`;

const renderStartIndex = content.indexOf(renderStartMarker);
const renderEndIndex = content.lastIndexOf(renderEndMarker);

if (renderStartIndex === -1 || renderEndIndex === -1) {
    console.error('Markers not found!');
    process.exit(1);
}

const newRender = `    return (
        <div ref={wrapperRef} className="tv-redesign-wrapper animate-fade-in" style={{ width: '100%', minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#050505', backgroundImage: 'radial-gradient(circle at 50% 0%, #1a0505 0%, #050505 70%)', position: 'relative', overflow: 'hidden' }}>
            {/* Neon glowing edges */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', boxShadow: 'inset 0 0 100px rgba(239, 68, 68, 0.03)', zIndex: 0 }} />
            
            {/* Floating balls / chips effect (CSS only) */}
            <div className="floating-elements" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.1, background: 'url(/splash-ball.png)', backgroundSize: '100px', animation: 'float-bg 60s linear infinite' }} />

            <style>{\`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
                @keyframes float-bg { 0% { background-position: 0 0; } 100% { background-position: 1000px 1000px; } }
                @keyframes pulse-red { 0%,100%{box-shadow:0 0 10px rgba(239,68,68,.2)} 50%{box-shadow:0 0 25px rgba(239,68,68,.5)} }
                .custom-scrollbar::-webkit-scrollbar { width:4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background:rgba(255,255,255,.02); border-radius:4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(239,68,68,.3); border-radius:4px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background:rgba(239,68,68,.5); }
                .tv-tab-btn { transition: all 0.2s; position: relative; }
                .tv-tab-btn::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #ef4444; transform: scaleX(0); transition: transform 0.2s; }
                .tv-tab-btn.active { color: #fff; }
                .tv-tab-btn.active::after { transform: scaleX(1); }
            \`}</style>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '10px' : '20px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Header Navbar (Like the screenshot) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: 'rgba(10, 10, 10, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Tv style={{ color: '#fff', width: 24, height: 24 }} />
                        </div>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>724<span style={{ color: '#ef4444' }}>TV</span></span>
                    </div>
                    
                    {!isMobile && (
                        <div style={{ display: 'flex', gap: '24px' }}>
                            {['Ana Sayfa', 'Bahis', 'Canlı Bahis', 'Canlı Casino', 'Slot Oyunu', 'Bonuslar'].map((item, idx) => (
                                <button key={idx} style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'color 0.2s' }} className="hover:text-white">
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Promo Banner */}
                <div style={{ width: '100%', background: 'linear-gradient(90deg, #110000 0%, #ef4444 50%, #110000 100%)', borderRadius: '12px', padding: '2px', animation: 'pulse-red 3s infinite' }}>
                    <div style={{ background: '#050505', borderRadius: '10px', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: isMobile ? '16px' : '22px' }}>%20 SINIRSIZ KAYIP BONUSU</span>
                        <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>Hemen Üye Ol</button>
                    </div>
                </div>

                {/* Main 2-Column Layout */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'stretch' }}>
                    
                    {/* LEFT: Video Player */}
                    <div style={{ flex: 1.8, minWidth: isMobile ? '100%' : '60%', position: 'relative' }}>
                        <div ref={playerContainerRef} style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            
                            {!activeChannel ? (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1a0505 0%, #000 100%)' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '2px solid rgba(239,68,68,0.3)' }}>
                                        <Play style={{ width: 32, height: 32, color: '#ef4444', marginLeft: '4px' }} />
                                    </div>
                                    <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>YAYIN BAŞLIYOR</h2>
                                    <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>Lütfen sağ taraftan bir maç veya kanal seçin.</p>
                                    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }}>
                                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>724<span style={{ color: '#ef4444' }}>TV</span></span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ width: '100%', height: '100%' }}>
                                    {getStreamEmbed()}
                                    
                                    {/* Custom Controls Bar */}
                                    <div className="ctrl-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', opacity: isMobile ? 1 : 0, transition: 'opacity 0.2s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                                {isPlaying ? <Pause style={{ width: 18, height: 18 }} /> : <Play style={{ width: 18, height: 18 }} />}
                                            </button>
                                            <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                                {isMuted ? <VolumeX style={{ width: 18, height: 18, color: '#ef4444' }} /> : <Volume2 style={{ width: 18, height: 18, color: '#22c55e' }} />}
                                            </button>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{activeChannel.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444' }}>CANLI</span>
                                            </div>
                                            <button onClick={() => {
                                                if (document.fullscreenElement) document.exitFullscreen();
                                                else playerContainerRef.current?.requestFullscreen();
                                            }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                                <Maximize style={{ width: 18, height: 18 }} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Watermark */}
                                    <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.5, pointerEvents: 'none' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>724<span style={{ color: '#ef4444' }}>TV</span></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Sidebar (Tabs + Content) */}
                    <div style={{ flex: 1, minWidth: isMobile ? '100%' : '340px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: isMobile ? '500px' : 'auto' }}>
                        
                        {/* Tabs Header */}
                        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            {[
                                { id: 'maclar', label: 'MAÇLAR' },
                                { id: 'kanallar', label: 'KANALLAR' },
                                { id: 'sohbet', label: 'SOHBET' }
                            ].map(t => (
                                <button 
                                    key={t.id} 
                                    className={\`tv-tab-btn \${tvTab === t.id ? 'active' : ''}\`}
                                    onClick={() => setTvTab(t.id as any)}
                                    style={{ flex: 1, padding: '16px 0', background: 'transparent', border: 'none', fontSize: '12px', fontWeight: 900, letterSpacing: '1px', color: tvTab === t.id ? '#fff' : '#6b7280', cursor: 'pointer' }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Tabs Content */}
                        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                            
                            {/* MAÇLAR TAB */}
                            {tvTab === 'maclar' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {tvMatches.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280', fontSize: '13px', fontWeight: 600 }}>Yükleniyor...</div>
                                    ) : (
                                        tvMatches.map(m => {
                                            const time = new Date(m.data.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                                            const isLive = new Date(m.data.start_time).getTime() < Date.now();
                                            
                                            return (
                                                <div key={m.id} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-[#1a1a1a] hover:border-red-500/30">
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase' }}>{m.data.sport?.name}</span>
                                                        <span style={{ fontSize: '10px', color: isLive ? '#ef4444' : '#6b7280', fontWeight: 800 }}>{isLive ? 'CANLI' : time} | {m.data.tournament?.name}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{m.data.participants?.home}</div>
                                                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{m.data.participants?.away}</div>
                                                        </div>
                                                        <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Play style={{ width: 14, height: 14, color: '#ef4444', marginLeft: '2px' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {/* KANALLAR TAB */}
                            {tvTab === 'kanallar' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Kanal ara..." 
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            style={{ width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 10px 10px 36px', color: '#fff', fontSize: '12px', outline: 'none' }}
                                        />
                                        <Search style={{ width: 14, height: 14, color: '#6b7280', position: 'absolute', left: '12px', top: '11px' }} />
                                    </div>
                                    
                                    {streamers.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(s => {
                                        const isActive = activeChannel?.id === s.id;
                                        return (
                                            <div 
                                                key={s.id}
                                                onClick={() => {
                                                    setActiveChannel({
                                                        id: s.id, name: s.name, slug: s.kick_username || '', platform: s.platform_type,
                                                        streamUrl: s.kick_username || '', thumbnailUrl: s.avatar_url || '',
                                                        category: s.tags?.[0] || 'CANLI YAYIN', isLive: s.is_live, isActive: true,
                                                        order: s.order_index, sourceType: s.source_type, platformType: s.platform_type,
                                                        platformUsername: s.kick_username, videoUrl: s.video_url, iframeUrl: s.iframe_url,
                                                        fallbackType: s.fallback_type, fallbackVideoUrl: s.fallback_video_url,
                                                        fallbackIframeUrl: s.fallback_iframe_url, viewer_count: s.viewer_count,
                                                    } as any);
                                                }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: isActive ? 'rgba(239,68,68,0.1)' : '#111', border: \`1px solid \${isActive ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)'}\`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                                                className="hover:bg-[#1a1a1a]"
                                            >
                                                <img 
                                                    src={getChannelLogo(s.name, s.avatar_url)} 
                                                    alt={s.name} 
                                                    style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'contain', background: '#000', padding: '4px' }}
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = \`https://ui-avatars.com/api/?name=\${encodeURIComponent(s.name)}&background=111&color=fff\`;
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 800, color: isActive ? '#fff' : '#e5e7eb' }}>{s.name}</div>
                                                    <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600 }}>{s.platform_type || 'TV'} {s.is_live ? '• CANLI' : ''}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* SOHBET TAB */}
                            {tvTab === 'sohbet' && (
                                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                                    {!activeChannel ? (
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '12px', fontWeight: 600 }}>
                                            Sohbeti görmek için bir yayın seçin.
                                        </div>
                                    ) : (
                                        <>
                                            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '60px' }}>
                                                {messages.length === 0 ? (
                                                    <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '12px' }}>Henüz mesaj yok. İlk yazan sen ol!</div>
                                                ) : (
                                                    messages.map(m => (
                                                        <div key={m.id} style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
                                                            <span style={{ color: '#6b7280', fontSize: '10px', marginTop: '2px' }}>{formatTime(m.timestamp)}</span>
                                                            <div style={{ flex: 1 }}>
                                                                <span style={{ fontWeight: 800, color: getRoleColor(m.role), marginRight: '6px' }}>{m.username}</span>
                                                                <span style={{ color: '#d1d5db', wordBreak: 'break-word' }}>{m.message}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                                <div ref={chatEndRef} />
                                            </div>
                                            
                                            {/* Chat Input */}
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                                                {siteUser ? (
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <input 
                                                            type="text" 
                                                            value={newMessage}
                                                            onChange={e => setNewMessage(e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            placeholder="Mesaj gönder..."
                                                            style={{ flex: 1, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '13px', outline: 'none' }}
                                                        />
                                                        <button 
                                                            onClick={() => sendMessage()}
                                                            style={{ width: '38px', height: '38px', background: '#ef4444', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                        >
                                                            <Send style={{ width: 16, height: 16, color: '#fff' }} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button onClick={onLoginRequired} style={{ width: '100%', padding: '10px', background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#ef4444', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                                                        Sohbet etmek için giriş yapın
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Bottom Promo Banner */}
                <div style={{ width: '100%', background: 'linear-gradient(90deg, #110000 0%, #ef4444 50%, #110000 100%)', borderRadius: '12px', padding: '2px', animation: 'pulse-red 3s infinite', marginTop: '10px' }}>
                    <div style={{ background: '#050505', borderRadius: '10px', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: isMobile ? '16px' : '22px' }}>%20 SINIRSIZ KAYIP BONUSU</span>
                        <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>Hemen Üye Ol</button>
                    </div>
                </div>

                {/* Bottom Links */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)', gap: '10px', marginTop: '10px' }}>
                    {['Bahis', 'Canlı Bahis', 'Casino', 'Canlı Casino', 'Slot Oyunu', 'Bonuslar'].map((item, idx) => (
                        <button key={idx} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} className="hover:bg-[#1a1a1a] hover:border-white/10">
                            {item}
                        </button>
                    ))}
                </div>

                {/* Bottom Center Logo */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '40px', opacity: 0.8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tv style={{ color: '#ef4444', width: 32, height: 32 }} />
                        <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>724<span style={{ color: '#ef4444' }}>TV</span></span>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default TV724View;
`;

const result = content.substring(0, renderStartIndex) + newRender;
fs.writeFileSync('components/TV724View.tsx', result, 'utf8');
console.log('Successfully refactored TV724View.tsx!');
