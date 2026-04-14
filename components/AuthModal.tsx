import React, { useState } from 'react';
import { Lock, User, X, LogIn, UserPlus, Shield, Mail, Phone, Clock, Loader2 } from 'lucide-react';
import { SiteUser, EditorAccount, UserLoyalty } from '../types';
import { supabase } from '../utils/supabase';

interface AuthModalProps {
    mode: 'member' | 'admin';
    onMemberLogin: (user: SiteUser) => void;
    onAdminLogin: (role: string) => void;
    onClose: () => void;
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
            className="w-full bg-black border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-white text-sm focus:border-[#f0b90b] transition-colors outline-none placeholder-zinc-600"
            placeholder={placeholder}
        />
    </div>
);

const AuthModal: React.FC<AuthModalProps> = ({ mode, onMemberLogin, onAdminLogin, onClose }) => {
    const [activeTab, setActiveTab] = useState<'member' | 'admin'>(mode);
    const [memberMode, setMemberMode] = useState<'login' | 'register'>('login');

    const [mUsername, setMUsername] = useState('');
    const [mEmail, setMEmail] = useState('');
    const [mPhone, setMPhone] = useState('');
    const [mPassword, setMPassword] = useState('');
    const [mPasswordConfirm, setMPasswordConfirm] = useState('');
    const [mError, setMError] = useState('');
    const [mSuccess, setMSuccess] = useState('');
    const [registrationPending, setRegistrationPending] = useState(false);

    const [aUsername, setAUsername] = useState('');
    const [aPassword, setAPassword] = useState('');
    const [aError, setAError] = useState('');

    const [loading, setLoading] = useState(false);

    const getEditors = (): EditorAccount[] => {
        try { return JSON.parse(localStorage.getItem('site_editors') || '[]'); } catch { return []; }
    };

    const handleMemberSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMError(''); setMSuccess('');
        setLoading(true);
        const uname = mUsername.trim().toLowerCase();

        if (memberMode === 'login') {
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
                role: found.role || 'member'
            });
        } else {
            if (uname.length < 3) { setMError('Kullanıcı adı en az 3 karakter olmalı.'); setLoading(false); return; }
            if (!mEmail.includes('@')) { setMError('Geçerli bir e-posta adresi girin.'); setLoading(false); return; }
            if (mPhone.replace(/\D/g, '').length < 10) { setMError('Geçerli bir telefon numarası girin.'); setLoading(false); return; }
            if (mPassword.length < 6) { setMError('Şifre en az 6 karakter olmalı.'); setLoading(false); return; }
            if (mPassword !== mPasswordConfirm) { setMError('Şifreler eşleşmiyor.'); setLoading(false); return; }

            // Check existing
            const { data: existing } = await supabase
                .from('members')
                .select('username, email')
                .or(`username.eq.${mUsername.trim()},email.eq.${mEmail.trim().toLowerCase()}`);
            
            if (existing && existing.length > 0) {
                if (existing.some(u => u.username.toLowerCase() === uname)) {
                    setMError('Bu kullanıcı adı zaten alınmış!');
                } else {
                    setMError('Bu e-posta zaten kayıtlı!');
                }
                setLoading(false);
                return;
            }

            const { data: newUser, error: insertError } = await supabase.from('members').insert([{
                username: mUsername.trim(),
                email: mEmail.trim().toLowerCase(),
                phone: mPhone.trim(),
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

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 transition-colors z-10">
                    <X className="w-4 h-4" />
                </button>

                {/* Tabs */}
                <div className="flex border-b border-zinc-800">
                    <button onClick={() => { setActiveTab('member'); setMError(''); }}
                        className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === 'member' ? 'text-[#f0b90b] bg-[#f0b90b]/5 border-b-2 border-[#f0b90b]' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        <User className="w-4 h-4" /> Üye Girişi
                    </button>
                    <button onClick={() => { setActiveTab('admin'); setAError(''); }}
                        className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === 'admin' ? 'text-[#f0b90b] bg-[#f0b90b]/5 border-b-2 border-[#f0b90b]' : 'text-zinc-500 hover:text-zinc-300'}`}>
                        <Shield className="w-4 h-4" /> Yönetici / Editör
                    </button>
                </div>

                <div className="p-8">
                    {/* Member Tab */}
                    {activeTab === 'member' && (
                        <div>
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-14 h-14 bg-[#f0b90b]/10 rounded-full flex items-center justify-center border border-[#f0b90b]/20">
                                    {memberMode === 'login' ? <LogIn className="w-7 h-7 text-[#f0b90b]" /> : <UserPlus className="w-7 h-7 text-[#f0b90b]" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">{memberMode === 'login' ? 'TEKRAR HOŞGELDİN' : 'HEMEN KATIL'}</h2>
                                    <p className="text-xs text-zinc-500">{memberMode === 'login' ? 'Hesabınla giriş yap' : 'Ücretsiz üye ol, analizlere eriş'}</p>
                                </div>
                            </div>

                            {registrationPending ? (
                                <div className="text-center py-8 space-y-4">
                                    <div className="w-20 h-20 mx-auto bg-[#f0b90b]/10 rounded-full flex items-center justify-center mb-4">
                                        <Clock className="w-10 h-10 text-[#f0b90b] animate-pulse" />
                                    </div>
                                    <h3 className="text-white font-black text-xl">Kayıt Alındı!</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">
                                        Üyeliğiniz başarıyla oluşturuldu.<br />
                                        <strong className="text-white">Ekibimiz en kısa sürede onaylayacaktır.</strong><br />
                                        Onaylandıktan sonra giriş yapabilirsiniz.
                                    </p>
                                    <button onClick={onClose}
                                        className="mt-6 w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-sm rounded-xl transition-all">
                                        ANLADIM
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex bg-zinc-900 rounded-xl p-1 mb-5">
                                        <button onClick={() => { setMemberMode('login'); setMError(''); setMSuccess(''); }}
                                            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${memberMode === 'login' ? 'bg-[#f0b90b] text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>
                                            GİRİŞ YAP
                                        </button>
                                        <button onClick={() => { setMemberMode('register'); setMError(''); setMSuccess(''); }}
                                            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${memberMode === 'register' ? 'bg-[#f0b90b] text-black' : 'text-zinc-500 hover:text-zinc-300'}`}>
                                            KAYIT OL
                                        </button>
                                    </div>

                                    <form onSubmit={handleMemberSubmit} className="space-y-3">
                                        <InputField icon={<User className="w-4 h-4" />} type="text" value={mUsername}
                                            onChange={setMUsername} placeholder="Kullanıcı adı" required />

                                        {memberMode === 'register' && (
                                            <>
                                                <InputField icon={<Mail className="w-4 h-4" />} type="email" value={mEmail}
                                                    onChange={setMEmail} placeholder="E-posta adresi (zorunlu)" required />
                                                <InputField icon={<Phone className="w-4 h-4" />} type="tel" value={mPhone}
                                                    onChange={setMPhone} placeholder="Telefon numarası (zorunlu)" required />
                                            </>
                                        )}

                                        <InputField icon={<Lock className="w-4 h-4" />} type="password" value={mPassword}
                                            onChange={setMPassword} placeholder="Şifre" required />

                                        {memberMode === 'register' && (
                                            <InputField icon={<Lock className="w-4 h-4" />} type="password" value={mPasswordConfirm}
                                                onChange={setMPasswordConfirm} placeholder="Şifreyi tekrarla" required />
                                        )}

                                        {mError && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{mError}</p>}
                                        {mSuccess && <p className="text-emerald-500 text-xs font-bold text-center bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">{mSuccess}</p>}

                                        <button type="submit" disabled={loading}
                                            className="w-full bg-[#f0b90b] hover:bg-[#f0b90b]/90 text-black font-black py-3.5 rounded-xl transition-all text-sm tracking-widest uppercase mt-1 flex items-center justify-center gap-2">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (memberMode === 'login' ? 'GİRİŞ YAP' : 'KAYIT OL')}
                                        </button>
                                    </form>

                                    {memberMode === 'register' && (
                                        <p className="text-center text-[10px] text-zinc-700 mt-3 font-bold">
                                            📧 E-posta ve telefon numarası güvenlik doğrulaması için zorunludur.
                                        </p>
                                    )}

                                    {memberMode === 'login' && (
                                        <p className="text-center text-xs text-zinc-600 mt-4">
                                            Hesabın yok mu?{' '}
                                            <button onClick={() => setMemberMode('register')} className="text-[#f0b90b] font-bold hover:underline">
                                                Hemen kayıt ol
                                            </button>
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {/* Admin Tab */}
                    {activeTab === 'admin' && (
                        <div>
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                                    <Shield className="w-7 h-7 text-zinc-300" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-white">YÖNETİCİ/EDİTÖR</h2>
                                    <p className="text-xs text-zinc-500">Yetkili personel girişi</p>
                                </div>
                            </div>
                            <form onSubmit={handleAdminSubmit} className="space-y-4">
                                <InputField icon={<User className="w-4 h-4" />} type="text" value={aUsername}
                                    onChange={setAUsername} placeholder="Kullanıcı adı" required />
                                <InputField icon={<Lock className="w-4 h-4" />} type="password" value={aPassword}
                                    onChange={setAPassword} placeholder="Şifre" required />
                                {aError && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{aError}</p>}
                                <button type="submit"
                                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-3.5 rounded-xl transition-all text-sm tracking-widest uppercase mt-2 border border-zinc-700">
                                    GİRİŞ YAP
                                </button>
                            </form>
                            <div className="mt-4 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 text-center">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">🔐 Sadece yetkili personel için</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
