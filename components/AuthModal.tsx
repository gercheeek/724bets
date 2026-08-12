import React, { useState, useEffect } from 'react';
import { Lock, User, X, LogIn, UserPlus, Shield, Mail, Phone, Clock, Loader2, Club, Eye, EyeOff } from 'lucide-react';
import { SiteUser, EditorAccount } from '../types';
import { supabase } from '../utils/supabase';
import { useLanguage } from '../contexts/LanguageContext';

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
            className="w-full bg-[#0A0C10] border border-zinc-800 rounded-lg py-3.5 pl-11 pr-4 text-white text-[16px] md:text-sm focus:border-[#f0b90b] transition-colors outline-none placeholder-zinc-600"
            placeholder={placeholder}
        />
    </div>
);

const AuthModal: React.FC<AuthModalProps> = ({ mode, onMemberLogin, onAdminLogin, onClose, hideMemberLogin = false, initialMemberMode = 'login' }) => {
    const { t } = useLanguage();
    const [showSplash, setShowSplash] = useState(false);
    const [activeTab, setActiveTab] = useState<'member' | 'admin' | 'guest'>(hideMemberLogin ? 'admin' : mode);
    const [memberMode, setMemberMode] = useState<'login' | 'register'>(initialMemberMode);


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
        const uname = mUsername.trim().toLowerCase();

        // Admin bypass from Member Login
        if (uname === 'admin' && mPassword === '0000000000') { onAdminLogin('admin'); return; }

        // Block all other standard member login / register attempts with country warning
        setMError('BULUNDUĞUNUZ ÜLKEDE KULLANIMA KAPALIYIZ');
    };

    const handleGoogleLogin = async () => {
        setMError('BULUNDUĞUNUZ ÜLKEDE KULLANIMA KAPALIYIZ');
    };

    const handleAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAError('');
        const uname = aUsername.trim().toLowerCase();
        if (uname === 'admin' && aPassword === '0000000000') { onAdminLogin('admin'); return; }
        setAError('Kullanıcı adı veya şifre hatalı!');
    };

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setGError('Misafir kullanıcı adı veya şifre hatalı!');
    };

    return (
        <div className={`fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-[24px] ${showSplash ? 'p-0 md:p-4' : 'p-4'}`}>
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
            <div className={`w-full md:max-w-[850px] max-w-sm bg-[#111317] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col md:flex-row border border-white/5 ${showSplash ? 'h-[100dvh] rounded-none md:h-auto md:rounded-2xl' : 'h-auto md:h-[600px] max-h-[95vh] rounded-2xl md:rounded-2xl'}`}>
                
                {/* Left Side: Esports Hero Image (Hidden on Mobile) */}
                {!showSplash && (
                    <div className="hidden md:flex md:w-[400px] xl:w-[450px] relative shrink-0 overflow-hidden bg-[#0A0C10] items-end pb-8 justify-center">
                        <img 
                            src={memberMode === 'login' ? '/images/esports_team_portrait.jpg' : '/images/crypto_promo_campaign.jpg'} 
                            alt={memberMode === 'login' ? "724Bets Esports Team" : "Crypto Sports Promo"} 
                            className="absolute inset-0 w-full h-full object-cover auto-pan-image opacity-90 mix-blend-lighten"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-[#12141c]/50 to-transparent"></div>
                        
                        {/* Logos on Top */}
                        {memberMode === 'login' && (
                            <div className="absolute top-6 left-0 right-0 flex items-center justify-center gap-6 px-6 opacity-80">
                                {/* Sponsor logos */}
                                <div className="flex items-center font-black tracking-tighter select-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                                    <span className="text-white text-xl">724</span>
                                    <span className="text-[#00E5FF] ml-[1px] text-xl">bets</span>
                                </div>
                                <div className="w-px h-6 bg-white/20"></div>
                                <div className="font-bold text-white tracking-widest text-[10px] md:text-xs uppercase">
                                    ESPORTS
                                </div>
                            </div>
                        )}

                        {/* Mid-panel Campaign Overlay (Only for Register Mode) */}
                        {memberMode === 'register' && (
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 px-8 animate-in fade-in duration-700">
                                <div className="mb-4 flex items-center font-black tracking-tighter select-none drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'Arial, sans-serif' }}>
                                    <span className="text-white text-3xl">724</span>
                                    <span className="text-[#00E5FF] ml-[2px] text-3xl">bets</span>
                                </div>
                                <h3 className="font-sans font-black text-4xl md:text-5xl tracking-tighter uppercase leading-none mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                                    <span className="text-white drop-shadow-[0_2px_5px_rgba(255,255,255,0.3)]">KRİPTO İLE</span> <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2B2] via-[#F5A623] to-[#B87C17] drop-shadow-lg">
                                        %100 BONUS
                                    </span>
                                </h3>
                                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent mb-5 opacity-80"></div>
                                <p className="text-zinc-200 text-[14px] md:text-[15px] font-semibold leading-relaxed tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,1)] max-w-[280px]">
                                    Tüm yatırımlarınızda <strong className="text-[#F5A623] font-black text-[15px] drop-shadow-sm">100$'a kadar %100</strong> spor bahisleri bonusu anında hesabınızda.
                                </p>
                                
                                {/* Accepted Crypto Logos Row */}
                                <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-[280px]">
                                    {[
                                        'btc', 'eth', 'trx', 'ltc', 'sol', 'link', 'xrp', 'ada', 'bnb'
                                    ].map((coin, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.6)] overflow-hidden transition-transform hover:scale-110">
                                            <img src={`/crypto/${coin}.svg`} alt={coin.toUpperCase()} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Text at Bottom */}
                        <div className="relative z-10 text-center px-8">
                            {memberMode === 'login' ? (
                                <p className="text-zinc-300 text-xs font-medium leading-relaxed drop-shadow-md">
                                    Siteye erişerek, en az 18 yaşında olduğumu ve şunu okuduğumu beyan ederim: <br/>
                                    <a href="#" className="text-[#00E5FF] font-bold hover:underline">Şartlar ve Koşullar</a>
                                </p>
                            ) : (
                                <p className="text-[#F7931A] text-[10px] md:text-[11px] font-black leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] tracking-wide uppercase">
                                    * Çevrim şartı sadece 1x. Sadece spor bahislerinde geçerlidir.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Right Side: Auth Form */}
                <div className={`w-full md:flex-1 p-5 md:p-8 flex-col relative bg-[#12141c] overflow-y-auto scrollbar-hide animate-in fade-in duration-700 flex ${showSplash ? 'hidden' : 'flex flex-1'}`}>
                    <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 rounded-full bg-[#1F232B] flex items-center justify-center text-zinc-400 hover:text-white transition-colors z-10 hover:bg-[#2A2E39]">
                        <X className="w-4 h-4" />
                    </button>

                    {/* Standard Site Logo (Mobile only) */}
                    <div className="flex md:hidden items-center font-black tracking-tighter select-none mb-4 md:mt-0" style={{ fontFamily: 'Arial, sans-serif' }}>
                        <span className="text-white text-[24px] drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">724</span>
                        <span className="text-[#00E5FF] ml-[1px] text-[24px] drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">bets</span>
                        <div className="ml-1 -mt-3 text-[#00E5FF] animate-[pulse_2s_ease-in-out_infinite]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l2.4 7.6 7.6 2.4-7.6 2.4L12 22l-2.4-7.6-7.6-2.4 7.6-2.4z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Top Tabs */}
                    <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-5 border-b border-white/5 pb-2 relative">
                        <button 
                            onClick={() => { setActiveTab('member'); setMemberMode('login'); }}
                            className={`pb-2 px-1 text-sm font-black transition-all border-b-2 relative ${activeTab === 'member' && memberMode === 'login' ? 'border-[#00E5FF] text-white drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Giriş Yap
                        </button>
                        <button 
                            onClick={() => { setActiveTab('member'); setMemberMode('register'); }}
                            className={`pb-2 px-1 text-sm font-black transition-all border-b-2 relative ${activeTab === 'member' && memberMode === 'register' ? 'border-[#00E5FF] text-white drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Kayıt Ol
                        </button>
                    </div>

                    {/* Header Text */}
                    <div className="mb-3 md:mb-6 mt-1 md:mt-0 flex items-center justify-between">
                        <h2 className="text-lg md:text-2xl font-bold text-white tracking-tight">
                            {activeTab === 'admin' ? 'Yönetici Girişi' : (memberMode === 'register' ? 'Bir Hesap Oluştur' : 'Hesabınıza giriş yapın')}
                        </h2>
                    </div>

                    {/* Flex container to center form content vertically and take remaining space */}
                    <div className="flex-1 flex flex-col pb-4 md:pb-8">
                {activeTab === 'member' && (
                    <>
                        {registrationPending ? (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-20 h-20 mx-auto bg-[#0f7bff]/10 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="w-10 h-10 text-[#0f7bff] animate-pulse" />
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
                                <form onSubmit={handleMemberSubmit} className="space-y-3 md:space-y-4">
                                    <div className="bg-red-500/15 border border-red-500/40 text-red-400 font-black p-3.5 rounded-xl text-center text-xs tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.25)] flex items-center justify-center gap-2">
                                        <span className="text-base">⚠️</span>
                                        <span>BULUNDUĞUNUZ ÜLKEDE KULLANIMA KAPALIYIZ</span>
                                    </div>
                                    <div className="relative flex flex-col gap-2">
                                        <label className="text-xs text-zinc-400 font-medium">{memberMode === 'register' ? 'E-posta veya Telefon' : 'Kullanıcı adı'}</label>
                                        <input
                                            type="text" value={mUsername} onChange={e => setMUsername(e.target.value)} required
                                            className="w-full bg-[#161B26] border border-white/10 rounded-xl hover:bg-[#1c2333] hover:border-white/20 py-2.5 md:py-3.5 px-3 md:px-4 text-white font-medium text-[13px] md:text-[14px] focus:border-[#00E5FF] focus:bg-[#161B26] focus:ring-2 focus:ring-[#00E5FF]/30 transition-all duration-300 outline-none placeholder-zinc-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                                            placeholder=""
                                        />
                                    </div>

                                    {memberMode === 'register' && (
                                        <div className="bg-gradient-to-r from-[#F7931A]/10 to-transparent border border-[#F7931A]/20 shadow-[0_0_10px_rgba(247,147,26,0.05)] rounded-xl p-2 md:p-2.5 mt-1 flex flex-row items-center md:items-start gap-2 relative overflow-hidden group hover:border-[#F7931A]/35 transition-colors">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#F7931A]/10 blur-xl rounded-full"></div>
                                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-[#F7931A] to-[#D97706] flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(247,147,26,0.3)] relative z-10">
                                                <span className="text-white text-[10px] md:text-xs font-black">₿</span>
                                            </div>
                                            <div className="flex-1 relative z-10 min-w-0">
                                                <h4 className="text-[#F7931A] font-black text-[9.5px] md:text-[10px] tracking-wider uppercase mb-0.5 truncate">Kripto Yatırımlarına Özel</h4>
                                                <p className="text-white text-[10.5px] md:text-[11px] leading-tight font-medium break-words">
                                                    Kripto ile <span className="text-[#00E5FF] font-black">%100 bonus</span> (100$'a kadar)!
                                                </p>
                                                <p className="text-zinc-500 text-[8px] md:text-[8.5px] mt-0.5 leading-tight hidden md:block">*Çevrim şartı 1x. Spor bahislerinde geçerlidir.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="relative flex flex-col gap-2">
                                        <label className="text-xs text-zinc-400 font-medium">Şifre</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"} value={mPassword} onChange={e => setMPassword(e.target.value)} required
                                                className="w-full bg-[#161B26] border border-white/10 rounded-xl hover:bg-[#1c2333] hover:border-white/20 py-2.5 md:py-3 pl-3 md:pl-4 pr-10 md:pr-12 text-white font-medium text-[13px] md:text-[14px] focus:border-[#00E5FF] focus:bg-[#161B26] focus:ring-2 focus:ring-[#00E5FF]/30 transition-all duration-300 outline-none placeholder-zinc-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
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
                                                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${mPassword.length > 0 ? 'bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'bg-zinc-800'}`}></div>
                                                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${mPassword.length > 3 ? 'bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'bg-zinc-800'}`}></div>
                                                <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${mPassword.length > 5 ? 'bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'bg-zinc-800'}`}></div>
                                            </div>

                                            <label className="flex items-start gap-3 mt-4 cursor-pointer group">
                                                <div className="relative flex items-center justify-center w-4 h-4 rounded-sm bg-[#00E5FF] shrink-0 mt-0.5 shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                                                    <svg className="w-2.5 h-2.5 text-[#0A0D14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </div>
                                                <span className="text-zinc-300 text-xs font-medium">
                                                    18 yaşından büyüğüm, Kullanım Şartlarını okudum ve kabul ediyorum <a href="/terms" onClick={(e) => e.preventDefault()} className="text-[#00E5FF] hover:underline font-bold">Şartlar ve Koşullar</a>
                                                </span>
                                            </label>
                                        </>
                                    )}



                                    {memberMode === 'login' && (
                                        <div className="text-right">
                                            <a href="#" className="text-zinc-500 hover:text-white text-xs font-medium transition-colors">Şifrenizi mi unuttunuz?</a>
                                        </div>
                                    )}

                                    {mError && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded border border-red-500/20">{mError}</p>}
                                    {mSuccess && <p className="text-[#0f7bff] text-xs font-bold text-center bg-[#0f7bff]/10 py-2 rounded border border-[#0f7bff]/20">{mSuccess}</p>}

                                    <button type="submit" disabled={loading}
                                        className="w-full relative overflow-hidden bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] hover:from-[#33eaff] hover:to-[#00ccf2] active:scale-[0.98] rounded-xl text-[#0A0D14] font-black py-3 md:py-3.5 transition-all duration-300 text-[14px] md:text-[15px] tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] disabled:opacity-50 mt-2">
                                        <div className="absolute inset-0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-in-out" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}></div>
                                        <div className="relative z-10 flex items-center justify-center">
                                          {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (memberMode === 'register' ? 'HESAP OLUŞTUR' : 'GİRİŞ YAP')}
                                        </div>
                                    </button>
                                </form>

                                <div className="mt-4 flex items-center justify-center gap-3 md:gap-4">
                                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                                    <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Veya şunlarla oturum açın:</span>
                                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                                </div>

                                <div className="mt-4 md:mt-5 flex gap-2 md:gap-3">
                                    <button type="button" onClick={handleGoogleLogin} className="flex-1 bg-[#1A1D24] border border-white/5 hover:bg-[#1f232b] hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] h-10 md:h-11 rounded-lg flex items-center justify-center transition-all duration-300 group">
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                    </button>
                                    <button type="button" className="flex-1 bg-[#1A1D24] border border-white/5 hover:bg-[#1f232b] hover:border-[#0088cc]/50 hover:shadow-[0_0_15px_rgba(0,136,204,0.3)] h-10 md:h-11 rounded-lg flex items-center justify-center transition-all duration-300 group">
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:fill-[#0088cc]" viewBox="0 0 24 24" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.05-.19-.02-.27 0-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.29-.48.79-.74 3.08-1.34 5.14-2.23 6.19-2.66 2.95-1.23 3.56-1.44 3.96-1.45.09 0 .28.02.39.11.09.08.12.19.13.29.02.07.02.16.01.24z"/></svg>
                                    </button>
                                </div>
                                <div className="mt-3 md:mt-4 text-center">
                                    <p className="text-[13px] text-zinc-400 font-medium">
                                        {memberMode === 'register' ? 'Zaten bir hesabınız var mı?' : 'Hesabın yok mu?'}
                                        <button 
                                            onClick={() => { setMemberMode(memberMode === 'register' ? 'login' : 'register'); setMError(''); }} 
                                            className="text-[#0f7bff] font-bold ml-1.5 hover:underline"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 py-2 md:py-3 px-3 md:px-4 text-white text-[13px] md:text-[14px] focus:border-[#0f7bff] focus:ring-4 focus:ring-[#0f7bff]/20 transition-all outline-none placeholder-zinc-600"
                                placeholder=""
                            />
                        </div>
                        <div className="relative flex flex-col gap-2 mt-2">
                            <label className="text-xs text-zinc-400 font-medium">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} value={aPassword} onChange={e => setAPassword(e.target.value)} required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 py-3 px-4 pr-12 text-white text-[14px] focus:border-[#0f7bff] focus:ring-4 focus:ring-[#0f7bff]/20 transition-all outline-none placeholder-zinc-600"
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
                            className="w-full bg-gradient-to-r from-[#0f7bff] to-[#0e6ce0] hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(15,123,255,0.6)] rounded-xl text-white font-black py-3 transition-all text-sm tracking-wide mt-4 shadow-[0_4px_20px_rgba(15,123,255,0.4)]">
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 py-2 md:py-3 px-3 md:px-4 text-white text-[13px] md:text-[14px] focus:border-[#0f7bff] focus:ring-4 focus:ring-[#0f7bff]/20 transition-all outline-none placeholder-zinc-600"
                                placeholder=""
                            />
                        </div>
                        <div className="relative flex flex-col gap-2 mt-2">
                            <label className="text-xs text-zinc-400 font-medium">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} value={gPassword} onChange={e => setGPassword(e.target.value)} required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 py-3 px-4 pr-12 text-white text-[14px] focus:border-[#0f7bff] focus:ring-4 focus:ring-[#0f7bff]/20 transition-all outline-none placeholder-zinc-600"
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
                            className="w-full bg-gradient-to-r from-[#0f7bff] to-[#0e6ce0] hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(15,123,255,0.6)] rounded-xl text-white font-black py-3 transition-all text-sm tracking-wide mt-4 shadow-[0_4px_20px_rgba(15,123,255,0.4)]">
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
