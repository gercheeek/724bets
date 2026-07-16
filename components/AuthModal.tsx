import React, { useState, useEffect } from 'react';
import { Lock, User, X, LogIn, UserPlus, Shield, Mail, Phone, Clock, Loader2, Club, Eye, EyeOff } from 'lucide-react';
import { SiteUser, EditorAccount } from '../types';
import { supabase } from '../utils/supabase';

interface AuthModalProps {
    mode: 'member' | 'admin';
    onMemberLogin: (user: SiteUser) => void;
    onAdminLogin: (role: string) => void;
    onClose: () => void;
    hideMemberLogin?: boolean;
    initialMemberMode?: 'login' | 'register';
}

const InputField: React.FC<{
    icon: React.ReactNode; type: string; value: string;
    onChange: (v: string) => void; placeholder: string; required?: boolean;
}> = ({ icon, type, value, onChange, placeholder, required }) => (
    <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500">{icon}</div>
        <input
            type={type} value={value} onChange={e => onChange(e.target.value)}
            required={required}
            className="w-full bg-black border border-zinc-800 rounded-lg py-3.5 pl-11 pr-4 text-white text-[16px] md:text-sm focus:border-[#f0b90b] transition-colors outline-none placeholder-zinc-600"
            placeholder={placeholder}
        />
    </div>
);

const AuthModal: React.FC<AuthModalProps> = ({ mode, onMemberLogin, onAdminLogin, onClose, hideMemberLogin = false, initialMemberMode = 'login' }) => {
    const [showSplash, setShowSplash] = useState(true);
    const [activeTab, setActiveTab] = useState<'member' | 'admin' | 'guest'>(hideMemberLogin ? 'admin' : mode);
    const [memberMode, setMemberMode] = useState<'login' | 'register'>(initialMemberMode);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const [mUsername, setMUsername] = useState('');
    const [mEmail, setMEmail] = useState('');
    const [mPhone, setMPhone] = useState('');
    const [mPassword, setMPassword] = useState('');
    const [mPasswordConfirm, setMPasswordConfirm] = useState('');
    const [mTcNo, setMTcNo] = useState('');
    const [mReferralCode, setMReferralCode] = useState('');
    const [mError, setMError] = useState('');
    const [mSuccess, setMSuccess] = useState('');
    const [registrationPending, setRegistrationPending] = useState(false);

    const [aUsername, setAUsername] = useState('');
    const [aPassword, setAPassword] = useState('');
    const [aError, setAError] = useState('');

    const [gUsername, setGUsername] = useState('');
    const [gPassword, setGPassword] = useState('');
    const [gError, setGError] = useState('');

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getEditors = (): EditorAccount[] => {
        try { return JSON.parse(localStorage.getItem('site_editors') || '[]'); } catch { return []; }
    };

    const handleMemberSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMError(''); setMSuccess('');
        setLoading(true);
        const uname = mUsername.trim().toLowerCase();

        if (memberMode === 'login') {
            // Guest login bypass
            if (uname === 'mersobahis' && mPassword === '123456') {
                onMemberLogin({
                    id: 'guest_mersobahis',
                    username: 'mersobahis',
                    password: '123456',
                    email: 'guest@724bahis.com',
                    phone: '05555555555',
                    createdAt: Date.now(),
                    status: 'active',
                    notes: 'Misafir Girişi',
                    role: 'member',
                    balance: 1000
                });
                setLoading(false);
                return;
            }

            const { data: found, error } = await supabase
                .from('members')
                .select('*')
                .eq('username', mUsername.trim())
                .eq('password', mPassword)
                .single();

            if (error || !found) {
                setMError('Kullanıcı adı veya şifre hatalı!');
                setLoading(false);
                return;
            }

            if (found.status === 'pending') {
                setMError('Hesabınız henüz onaylanmadı. Ekibimiz en kısa sürede inceleyecektir.');
                setLoading(false);
                return;
            }

            if (found.status === 'suspended') {
                setMError('Hesabınız askıya alınmıştır. Destek hattımızla iletişime geçin.');
                setLoading(false);
                return;
            }

            onMemberLogin({
                id: found.id,
                username: found.username,
                password: found.password,
                email: found.email || '',
                phone: found.phone || '',
                createdAt: new Date(found.created_at).getTime(),
                status: found.status || 'active',
                notes: found.notes || '',
                role: found.role || 'member',
                balance: found.balance || 0
            });
        } else {
            if (uname.length < 3) { setMError('Kullanıcı adı/E-posta en az 3 karakter olmalı.'); setLoading(false); return; }
            if (mPassword.length < 6) { setMError('Şifre en az 6 karakter olmalı.'); setLoading(false); return; }

            // Check existing
            const { data: existing } = await supabase
                .from('members')
                .select('username')
                .eq('username', mUsername.trim());
            
            if (existing && existing.length > 0) {
                setMError('Bu kullanıcı zaten kayıtlı!');
                setLoading(false);
                return;
            }

            const { data: newUser, error: insertError } = await supabase.from('members').insert([{
                username: mUsername.trim(),
                email: mUsername.trim().includes('@') ? mUsername.trim() : `${mUsername.trim().replace(/[^a-zA-Z0-9]/g, '')}@724bets.com`,
                phone: mUsername.trim().replace(/[^0-9]/g, '') || '05555555555',
                password: mPassword,
                status: 'pending'
            }]).select().single();

            if (insertError || !newUser) {
                setMError('Kayıt oluşturulurken bir hata oluştu: ' + insertError?.message);
                setLoading(false);
                return;
            }

            // Create initial loyalty record
            await supabase.from('loyalty').insert([{
                user_id: newUser.id,
                coins: 0,
                tickets: 0,
                pending_tickets: 0,
                total_earned: 0,
                transactions: [],
                last_volume_reset_date: '',
                daily_volume_accumulated: 0
            }]);

            setRegistrationPending(true);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`
                }
            });
            if (error) {
                setMError('Google ile giriş yapılırken bir hata oluştu: ' + error.message);
                setLoading(false);
            }
        } catch (err) {
            setMError('Beklenmeyen bir hata oluştu.');
            setLoading(false);
        }
    };

    const handleAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAError('');
        const uname = aUsername.trim().toLowerCase();
        if (uname === 'admin' && aPassword === '123456') { onAdminLogin('admin'); return; }
        const editors = getEditors();
        const editor = editors.find(ed => ed.username.toLowerCase() === uname && ed.password === aPassword);
        if (editor) { onAdminLogin(`editor_${editor.id}`); return; }
        if (['editor1', 'editor2', 'editor3'].includes(uname) && aPassword === '123456') { onAdminLogin(uname); return; }
        // Author login (yazar1/123456 default + dynamic authors)
        if (uname === 'yazar1' && aPassword === '123456') { onAdminLogin('author_yazar1'); return; }
        try {
            const newsAuthors = JSON.parse(localStorage.getItem('site_news_authors') || '[]');
            const author = newsAuthors.find((a: any) => a.username.toLowerCase() === uname && a.password === aPassword);
            if (author) { onAdminLogin(`author_${author.username}`); return; }
        } catch { /* ignore */ }
        setAError('Kullanıcı adı veya şifre hatalı!');
    };

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setGError('');
        const uname = gUsername.trim().toLowerCase();
        if (uname === 'mersobahis' && gPassword === '123456') { onAdminLogin('guest_bypass_mersobahis'); return; }
        try {
            const guests = JSON.parse(localStorage.getItem('site_guests') || '[]');
            const guest = guests.find((g: any) => g.username.toLowerCase() === uname && g.password === gPassword);
            if (guest) { onAdminLogin(`guest_bypass_${guest.username}`); return; }
        } catch { /* ignore */ }
        setGError('Misafir kullanıcı adı veya şifre hatalı!');
    };

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <style>{`
                @keyframes slowPanZoom {
                    0% { transform: scale(1) translate(0, 0); }
                    100% { transform: scale(1.12) translate(-1%, 2%); }
                }
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                .auto-pan-image {
                    animation: slowPanZoom 8s ease-out forwards;
                }
            `}</style>
            <div className="w-full max-w-4xl bg-[#111317] rounded-none md:rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col md:flex-row border-0 md:border border-white/5 h-[100dvh] md:h-auto md:min-h-[640px] max-h-[100dvh] md:max-h-[95vh]">
                
                {/* Left Side - Promo Graphic (Mobile Splash / Desktop Left Half) */}
                <div className={`flex-col justify-end relative overflow-hidden h-full transition-all duration-700 ease-in-out group ${showSplash ? 'flex w-full md:w-1/2 md:border-r border-white/5' : 'hidden md:flex w-1/2 border-r border-white/5'}`}>
                    
                    {/* Sleek, unobtrusive loading indicator for mobile splash */}
                    {showSplash && (
                        <div className="absolute bottom-32 left-0 w-full z-20 flex flex-col items-center justify-center md:hidden gap-3 px-4">
                            <span className="text-[#00FFA3] font-bold tracking-[0.3em] uppercase text-[9px] drop-shadow-[0_0_8px_rgba(0,255,163,0.8)] animate-pulse">
                                SİSTEM BAĞLANTISI KURULUYOR...
                            </span>
                            <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-[#00FFA3] w-1/3 rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]" style={{ boxShadow: '0 0 10px #00FFA3' }} />
                            </div>
                        </div>
                    )}

                    {/* Add a dynamic background image based on tab */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-normal transition-transform duration-[3000ms] ease-out group-hover:scale-110 auto-pan-image"
                        style={{ backgroundImage: `url('/images/${memberMode === 'register' ? 'esports_girls_register.jpg' : 'esports_girls_login.jpg'}')` }}
                    ></div>
                    {/* Gradients to ensure text is readable at top and bottom */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#111317]/90 via-transparent to-[#111317]/90 pointer-events-none"></div>

                    {/* Bottom Terms Text */}
                    <div className="relative z-10 w-full pb-8 px-8 flex justify-center">
                        <div className="bg-black/50 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:bg-black/60">
                            <p className="text-white/90 text-[11px] font-medium leading-relaxed max-w-[280px] text-center">
                                Siteye erişerek, en az 18 yaşında olduğumu ve şunu okuduğumu beyan ederim: <br/>
                                <span className="text-white font-bold cursor-pointer hover:text-[#00FFA3] transition-colors underline decoration-white/30 underline-offset-4 mt-1.5 inline-block">Şartlar ve Koşullar</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Auth Form */}
                <div className={`w-full md:w-1/2 p-6 md:p-10 flex-col relative bg-[#151821] overflow-y-auto h-full scrollbar-hide animate-in fade-in slide-in-from-right-8 duration-700 ${showSplash ? 'hidden md:flex' : 'flex'}`}>
                    <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#1F232B] flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10 hover:bg-[#2A2E39]">
                        <X className="w-4 h-4" />
                    </button>

                    {/* Top Tabs */}
                    <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-2">
                        <button 
                            onClick={() => { setActiveTab('member'); setMemberMode('login'); }}
                            className={`pb-2 px-1 text-sm font-bold transition-colors border-b-2 ${activeTab === 'member' && memberMode === 'login' ? 'border-[#00FFA3] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Giriş Yap
                        </button>
                        <button 
                            onClick={() => { setActiveTab('member'); setMemberMode('register'); }}
                            className={`pb-2 px-1 text-sm font-bold transition-colors border-b-2 ${activeTab === 'member' && memberMode === 'register' ? 'border-[#00FFA3] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Kayıt Ol
                        </button>
                        {!hideMemberLogin && (
                            <button 
                                onClick={() => setActiveTab('admin')}
                                className={`pb-2 px-1 text-sm font-bold transition-colors border-b-2 ml-auto ${activeTab === 'admin' ? 'border-[#00FFA3] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Yönetici
                            </button>
                        )}
                    </div>

                    {/* Header Text */}
                    <div className="mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            {activeTab === 'admin' ? 'Yönetici Girişi' : (memberMode === 'register' ? 'Bir Hesap Oluştur' : 'Hesabınıza giriş yapın')}
                        </h2>
                    </div>

                    {/* Flex container to center form content vertically and take remaining space */}
                    <div className="flex-1 flex flex-col pb-8">
                {activeTab === 'member' && (
                    <>
                        {registrationPending ? (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-20 h-20 mx-auto bg-[#00FFA3]/10 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="w-10 h-10 text-[#00FFA3] animate-pulse" />
                                </div>
                                <h3 className="text-white font-black text-xl">Kayıt Alındı!</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Üyeliğiniz başarıyla oluşturuldu.<br />
                                    <strong className="text-white">Ekibimiz en kısa sürede onaylayacaktır.</strong><br />
                                    Onaylandıktan sonra giriş yapabilirsiniz.
                                </p>
                                <button onClick={onClose}
                                    className="mt-6 w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-sm rounded-lg transition-all">
                                    ANLADIM
                                </button>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleMemberSubmit} className="space-y-4">
                                    <div className="relative flex flex-col gap-2">
                                        <label className="text-xs text-zinc-400 font-medium">{memberMode === 'register' ? 'E-posta veya Telefon' : 'Kullanıcı adı'}</label>
                                        <input
                                            type="text" value={mUsername} onChange={e => setMUsername(e.target.value)} required
                                            className="w-full bg-[#1A1D24] border border-[#252A35] rounded-lg py-3 px-4 text-white text-[14px] focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3] transition-all outline-none placeholder-zinc-600"
                                            placeholder=""
                                        />
                                    </div>

                                    {memberMode === 'register' && (
                                        <div className="bg-[#1A1D24] border border-white/5 rounded p-2.5 mt-1">
                                            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                                                Bonuslardan yararlanmak için e-posta adresinizin veya telefon numaranızın doğru olduğundan emin olun.
                                            </p>
                                        </div>
                                    )}

                                    <div className="relative flex flex-col gap-2">
                                        <label className="text-xs text-zinc-400 font-medium">Şifre</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"} value={mPassword} onChange={e => setMPassword(e.target.value)} required
                                                className="w-full bg-[#1A1D24] border border-[#252A35] rounded-lg py-3 pl-4 pr-12 text-white text-[14px] focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3] transition-all outline-none placeholder-zinc-600"
                                                placeholder=""
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {memberMode === 'register' && (
                                        <>
                                            {/* Password strength bars */}
                                            <div className="flex gap-1.5 mt-2">
                                                <div className={`h-1 flex-1 rounded-full ${mPassword.length > 0 ? 'bg-[#00FFA3]' : 'bg-zinc-800'}`}></div>
                                                <div className={`h-1 flex-1 rounded-full ${mPassword.length > 3 ? 'bg-[#00FFA3]' : 'bg-zinc-800'}`}></div>
                                                <div className={`h-1 flex-1 rounded-full ${mPassword.length > 5 ? 'bg-[#00FFA3]' : 'bg-zinc-800'}`}></div>
                                            </div>

                                            <label className="flex items-start gap-3 mt-4 cursor-pointer group">
                                                <div className="relative flex items-center justify-center w-5 h-5 rounded bg-[#00FFA3] shrink-0 mt-0.5">
                                                    <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </div>
                                                <p className="text-[13px] text-zinc-300 font-medium">
                                                    18 yaşından büyüğüm, Kullanım Şartlarını okudum ve kabul ediyorum <a href="#" className="text-[#00FFA3] hover:underline">Şartlar ve Koşullar</a>
                                                </p>
                                            </label>
                                        </>
                                    )}

                                    {/* Gamdom-style Cloudflare Placeholder */}
                                    <div className="bg-[#1A1D24] border border-[#252A35] rounded-lg p-3 flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            </div>
                                            <span className="text-zinc-300 text-sm font-medium">Başarılı!</span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[#F6821F] text-[10px] font-black uppercase tracking-wider">CLOUDFLARE</span>
                                            <span className="text-[9px] text-zinc-500 mt-0.5">Gizlilik • Yardım</span>
                                        </div>
                                    </div>

                                    {memberMode === 'login' && (
                                        <div className="text-right">
                                            <a href="#" className="text-zinc-500 hover:text-white text-xs font-medium transition-colors">Şifrenizi mi unuttunuz?</a>
                                        </div>
                                    )}

                                    {mError && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded border border-red-500/20">{mError}</p>}
                                    {mSuccess && <p className="text-[#00FFA3] text-xs font-bold text-center bg-[#00FFA3]/10 py-2 rounded border border-[#00FFA3]/20">{mSuccess}</p>}

                                    <button type="submit" disabled={loading}
                                        className="w-full bg-[#00FFA3] hover:bg-[#00e693] text-black font-black py-4 rounded-lg transition-all text-sm tracking-wide shadow-[0_0_15px_rgba(0,255,163,0.15)] disabled:opacity-50">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (memberMode === 'register' ? 'Hesap Oluştur' : 'Giriş Yap')}
                                    </button>
                                </form>

                                <div className="mt-8 flex items-center justify-center gap-4">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Veya şunlarla oturum açın:</span>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button type="button" onClick={handleGoogleLogin} className="flex-1 bg-[#1A1D24] border border-[#252A35] hover:border-white/20 h-12 rounded-lg flex items-center justify-center transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    </button>
                                    <button type="button" className="flex-1 bg-[#1A1D24] border border-[#252A35] hover:border-white/20 h-12 rounded-lg flex items-center justify-center transition-colors">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </button>
                                    <button type="button" className="flex-1 bg-[#1A1D24] border border-[#252A35] hover:border-white/20 h-12 rounded-lg flex items-center justify-center transition-colors">
                                        <span className="text-[#53FC18] font-black text-xl font-['Arial'] tracking-tighter" style={{ textShadow: '0 0 10px rgba(83,252,24,0.3)' }}>K</span>
                                    </button>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-[13px] text-zinc-400 font-medium">
                                        {memberMode === 'register' ? 'Zaten bir hesabınız var mı?' : 'Hesabın yok mu?'}
                                        <button 
                                            onClick={() => { setMemberMode(memberMode === 'register' ? 'login' : 'register'); setMError(''); }} 
                                            className="text-[#00FFA3] font-bold ml-1.5 hover:underline"
                                        >
                                            {memberMode === 'register' ? 'Giriş Yap' : 'Hemen Kayıt Ol'}
                                        </button>
                                    </p>
                                </div>
                            </>
                        )}
                    </>
                )}

                {activeTab === 'admin' && (
                    <form onSubmit={handleAdminSubmit} className="space-y-4">
                        <div className="relative flex flex-col gap-2">
                            <label className="text-xs text-zinc-400 font-medium">Kullanıcı adı</label>
                            <input
                                type="text" value={aUsername} onChange={e => setAUsername(e.target.value)} required
                                className="w-full bg-[#1A1D24] border border-[#252A35] rounded-lg py-3 px-4 text-white text-[14px] focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3] transition-all outline-none placeholder-zinc-600"
                                placeholder=""
                            />
                        </div>
                        <div className="relative flex flex-col gap-2 mt-2">
                            <label className="text-xs text-zinc-400 font-medium">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} value={aPassword} onChange={e => setAPassword(e.target.value)} required
                                    className="w-full bg-[#1A1D24] border border-[#252A35] rounded-lg py-3 px-4 pr-12 text-white text-[14px] focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3] transition-all outline-none placeholder-zinc-600"
                                    placeholder=""
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        {aError && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded border border-red-500/20">{aError}</p>}
                        <button type="submit"
                            className="w-full bg-[#00FFA3] hover:bg-[#00e693] text-black font-black py-3 rounded-lg transition-all text-sm tracking-wide mt-4 shadow-[0_0_15px_rgba(0,255,163,0.15)]">
                            Yönetici Girişi Yap
                        </button>
                    </form>
                )}

                {activeTab === 'guest' && (
                    <form onSubmit={handleGuestSubmit} className="space-y-4">
                        <div className="relative flex flex-col gap-2">
                            <label className="text-xs text-zinc-400 font-medium">Misafir Kullanıcı adı</label>
                            <input
                                type="text" value={gUsername} onChange={e => setGUsername(e.target.value)} required
                                className="w-full bg-[#1A1D24] border border-[#252A35] rounded-lg py-3 px-4 text-white text-[14px] focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3] transition-all outline-none placeholder-zinc-600"
                                placeholder=""
                            />
                        </div>
                        <div className="relative flex flex-col gap-2 mt-2">
                            <label className="text-xs text-zinc-400 font-medium">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} value={gPassword} onChange={e => setGPassword(e.target.value)} required
                                    className="w-full bg-[#1A1D24] border border-[#252A35] rounded-lg py-3 px-4 pr-12 text-white text-[14px] focus:border-[#00FFA3] focus:ring-1 focus:ring-[#00FFA3] transition-all outline-none placeholder-zinc-600"
                                    placeholder=""
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        {gError && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded border border-red-500/20">{gError}</p>}
                        <button type="submit"
                            className="w-full bg-[#00FFA3] hover:bg-[#00e693] text-black font-black py-3 rounded-lg transition-all text-sm tracking-wide mt-4 shadow-[0_0_15px_rgba(0,255,163,0.15)]">
                            Misafir Girişi Yap
                        </button>
                    </form>
                )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
