import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  User, Bell, Users, ShieldCheck, Settings, Lock, Link as LinkIcon, FileText, LogOut,
  ChevronRight, Upload, HelpCircle, Info, ChevronDown, CheckCircle2, ChevronLeft,
  Coins, Gamepad2, AlertCircle, Plus
} from 'lucide-react';
import { SiteUser } from '../types';
import { supabase } from '../utils/supabase';
import { getUserRank } from '../utils/ranks';

interface ProfileDashboardProps {
  siteUser: SiteUser;
  setSiteUser: React.Dispatch<React.SetStateAction<SiteUser | null>>;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ siteUser, setSiteUser }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'inbox' | 'affiliates' | 'verification' | 'settings' | 'privacy' | 'links' | 'transactions'>('profile');
  
  const { language: globalLang, setLanguage: setGlobalLang, setIsAnimating, t } = useLanguage();

  // Profile Form States
  const [localLanguage, setLocalLanguage] = useState(globalLang === 'en' ? 'English' : 'Turkish');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [username, setUsername] = useState(siteUser.username || '');
  const [email, setEmail] = useState(siteUser.email || '');
  const [phone, setPhone] = useState(siteUser.phone || '');
  const [password, setPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSaveStatus, setPasswordSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Avatar Selection
  const presetAvatars = [
    "Felix", "Aneka", "Jasper", "Mimi", "Zoe", "Destiny", "George", "Trouble", "Baby", "Oliver"
  ];
  
  const handleAvatarSelect = (seed: string) => {
    // Save to local state and localStorage
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    const updatedUser = { ...siteUser, avatarUrl: newAvatarUrl };
    setSiteUser(updatedUser);
    localStorage.setItem('site_member', JSON.stringify(updatedUser));
    
    // Attempt DB update if column exists (it might fail if column doesn't exist yet, but won't break the app due to local state updating)
    supabase.from('members').update({ avatarUrl: newAvatarUrl }).eq('id', siteUser.id).then();
  };

  // Settings States
  const [ambientMode, setAmbientMode] = useState(true);
  const [newsletters, setNewsletters] = useState(false);

  // Transactions States
  const [txTab, setTxTab] = useState<'deposit'|'withdraw'|'tips'|'affiliate'>('deposit');

  // Inbox States
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  // Advanced Security & KYC States
  const [twoFactorStep, setTwoFactorStep] = useState<'idle' | 'setup' | 'active'>('idle');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [kycStatus, setKycStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified');

  const defaultMessages = [
    {
      id: 1,
      title: "724BETS'e Hoş Geldiniz! 🎉",
      date: "Az önce",
      content: "Aramıza katıldığınız için çok mutluyuz. Dünyanın en iyi oranları ve en popüler casino oyunlarıyla kazanmaya hazır olun! Herhangi bir sorunuz olursa Canlı Destek ekibimiz 7/24 hizmetinizdedir."
    },
    {
      id: 2,
      title: "🎁 İlk Yatırıma Özel %250 Bonus!",
      date: "Az önce",
      content: "Hemen cüzdanınıza gidin ve ilk yatırımınızı yapın. İlk yatırıma özel tam %250 bonus hesabınıza anında tanımlanacaktır! Kampanyalar sayfasından detaylara göz atmayı unutmayın."
    },
    {
      id: 3,
      title: "⚠️ Taklit Sitelere Dikkat Edin",
      date: "Az önce",
      content: "Değerli üyemiz, güvenliğiniz bizim için her şeyden önemli. Resmi sitemiz sadece 724bets.net ve 724bets.net'tir. Bizi taklit eden dolandırıcı sitelere (phishing) karşı dikkatli olun ve şifrenizi asla başka yerlerde paylaşmayın."
    },
    {
      id: 4,
      title: "📱 Sosyal Medya ve Telegram",
      date: "Az önce",
      content: "En güncel adreslerimiz, bedava bonus kodları (promocode) ve sürpriz çekilişler için bizi Telegram ve resmi sosyal medya hesaplarımızdan takip etmeyi unutmayın. Sağ alttaki ikonlardan resmi kanallarımıza ulaşabilirsiniz!"
    }
  ];

  const handleLogout = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    localStorage.removeItem('site_current_member');
    localStorage.removeItem('site_member');
    localStorage.removeItem('site_user_role');
    setSiteUser(null);
    window.location.reload();
  };

  const handlePasswordSave = async () => {
    if (!password || password.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!");
      return;
    }
    
    setIsSavingPassword(true);
    setPasswordSaveStatus('idle');
    
    const { error } = await supabase
      .from('members')
      .update({ password: password })
      .eq('id', siteUser.id);
      
    setIsSavingPassword(false);
    
    if (error) {
      setPasswordSaveStatus('error');
      alert("Şifre güncellenirken bir hata oluştu: " + error.message);
    } else {
      setPasswordSaveStatus('success');
      const updatedUser = { ...siteUser, password };
      setSiteUser(updatedUser);
      localStorage.setItem('site_member', JSON.stringify(updatedUser));
      setTimeout(() => setPasswordSaveStatus('idle'), 3000);
      setPassword('');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profil', icon: <User className="w-5 h-5" /> },
    { id: 'gamification', label: 'Sadakat & Ödüller', icon: <Trophy className="w-5 h-5" /> },
    { id: 'inbox', label: 'Gelen Kutusu', icon: <Bell className="w-5 h-5" /> },
    { id: 'affiliates', label: 'İştirakler', icon: <Users className="w-5 h-5" /> },
    { id: 'verification', label: 'Doğrulamalar', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-5 h-5" /> },
    { id: 'privacy', label: 'Gizlilik', icon: <Lock className="w-5 h-5" /> },
    { id: 'links', label: 'Bağlantılar', icon: <LinkIcon className="w-5 h-5" /> },
    { id: 'transactions', label: 'İşlemler', icon: <FileText className="w-5 h-5" /> },
  ];

  const userLevel = siteUser.loyalty?.level || 1;
  const userXp = siteUser.loyalty?.points || 0;
  const xpForNextLevel = userLevel * 1000;
  const progressPercent = Math.min((userXp / xpForNextLevel) * 100, 100);

  return (
    <div className="w-full min-h-screen bg-[#0A0C10] flex justify-center py-10 px-4">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-[280px] flex-shrink-0 flex flex-col gap-6">
          
          {/* User VIP Card */}
          <div className="w-full rounded-2xl p-5 relative overflow-hidden bg-gradient-to-br from-[#E28859] via-[#D26535] to-[#A23D15] shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <div className="flex items-center gap-4 mb-5 relative z-10">
              <div className="w-14 h-14 rounded-lg bg-black/40 border-2 border-white/20 overflow-hidden shadow-inner flex-shrink-0">
                <img src={(siteUser as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${siteUser.username}`} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-white font-black text-lg flex items-center gap-2">
                  {siteUser.username}
                  <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-8 h-8 rounded-full overflow-hidden drop-shadow-md border border-white/10 shrink-0">
                      <img src={getUserRank(siteUser.vipLevel).image} className="w-full h-full object-cover" alt="rank" />
                   </div>
                   <span className="text-white/90 text-sm font-bold uppercase tracking-wide">{getUserRank(siteUser.vipLevel).name}</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 w-full mt-2">
              <div className="flex items-center justify-between text-white font-bold text-xs mb-1.5">
                <span>{progressPercent.toFixed(1)}%</span>
                <span className="text-white/60">Seviye {userLevel} İlerlemesi ({userXp} / {xpForNextLevel} XP)</span>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col gap-1 w-full">
            {menuItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#151A25] text-[color:var(--theme-accent)] shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/5' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <div className={isActive ? 'text-[color:var(--theme-accent)]' : 'text-zinc-500'}>
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'inbox' && (
                    <span className="bg-[color:var(--theme-accent)] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                      4
                    </span>
                  )}
                </button>
              );
            })}
            
            <div className="w-full h-px bg-white/5 my-2" />
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 py-3.5 rounded-xl font-bold text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-5 h-5 text-zinc-500" />
              Çıkış yap
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in flex flex-col w-full space-y-8">
              <h1 className="text-2xl font-black text-white tracking-tight">Profil</h1>
              
              {/* Avatar Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 font-bold text-sm">Avatar Seçimi</label>
                <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-6 pb-4 border-b border-[#202532]">
                    <div className="w-16 h-16 rounded-xl bg-[#0A0C10] overflow-hidden border-2 border-zinc-800 shrink-0">
                      <img src={(siteUser as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${siteUser.username}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-bold">Mevcut Avatar</span>
                      <span className="text-zinc-500 text-xs">Sohbetlerde ve profilinizde görünecek yüzünüzü aşağıdan seçebilirsiniz.</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mt-2">
                    {presetAvatars.map((seed) => {
                      const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                      const isSelected = (siteUser as any).avatarUrl === url;
                      return (
                        <button
                          key={seed}
                          onClick={() => handleAvatarSelect(seed)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 bg-black/50 ${
                            isSelected ? 'border-[color:var(--theme-accent)] scale-110 shadow-[0_0_15px_rgba(0,255,163,0.3)]' : 'border-zinc-800 hover:border-zinc-600 hover:scale-105 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={url} className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 font-bold text-sm">Kullanıcı adınız</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 bg-[#12161E] border border-[#202532] rounded-xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-[color:var(--theme-accent)]/50 transition-colors"
                    />
                    <button className="bg-[#1A212D] text-zinc-500 font-bold px-6 py-3.5 rounded-xl cursor-not-allowed">
                      Kaydet
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 font-bold text-sm">E-posta adresi</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-[#12161E] border border-[#202532] rounded-xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-[color:var(--theme-accent)]/50 transition-colors"
                    />
                    <button className="bg-[#1A212D] text-zinc-500 font-bold px-6 py-3.5 rounded-xl cursor-not-allowed">
                      Kaydet
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 font-bold text-sm">Şifre Oluştur / Değiştir</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="password" 
                      placeholder="Yeni şifrenizi girin (Google ile girenler için)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-[#12161E] border border-[#202532] rounded-xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-[color:var(--theme-accent)]/50 transition-colors"
                    />
                    <button 
                      onClick={handlePasswordSave}
                      disabled={isSavingPassword || !password}
                      className={`font-bold px-6 py-3.5 rounded-xl transition-colors ${
                        passwordSaveStatus === 'success' ? 'bg-[color:var(--theme-accent)] text-black' :
                        passwordSaveStatus === 'error' ? 'bg-red-500 text-white' :
                        password ? 'bg-[#1A212D] text-white hover:bg-[#202532]' :
                        'bg-[#1A212D] text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      {isSavingPassword ? '...' : passwordSaveStatus === 'success' ? 'Kaydedildi ✓' : 'Kaydet'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-zinc-400 font-bold text-sm">Telefon numarası</label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-[#12161E] border border-[#202532] rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:border-[color:var(--theme-accent)]/50 transition-colors">
                      <div className="flex items-center gap-2 cursor-pointer border-r border-zinc-700 pr-3">
                        <img src="https://flagcdn.com/w20/th.png" alt="TH" className="w-5 h-auto rounded-sm" />
                        <span className="text-white font-bold">+66</span>
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Telefon numaranızı yazın"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white font-bold placeholder:text-zinc-600"
                      />
                    </div>
                    <button className="bg-[#1A212D] text-zinc-500 font-bold px-6 py-3.5 rounded-xl cursor-not-allowed">
                      Kaydet
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="pt-4">
                <h2 className="text-xl font-black text-white mb-4">{t('verification')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">{t('level')} 1</h4>
                      <p className="text-zinc-500 text-sm font-bold">{t('current')}</p>
                    </div>
                    <Lock className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between opacity-70">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">{t('level')} 2</h4>
                      <p className="text-zinc-500 text-sm font-bold">{t('locked')}</p>
                    </div>
                    <Lock className="w-6 h-6 text-zinc-500" />
                  </div>
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between opacity-70">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">{t('level')} 3</h4>
                      <p className="text-zinc-500 text-sm font-bold">{t('locked')}</p>
                    </div>
                    <Lock className="w-6 h-6 text-zinc-500" />
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="pt-4">
                <h2 className="text-xl font-black text-white mb-4">İstatistikler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">0</h4>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Oynanan oyunlar</p>
                    </div>
                    <div className="w-10 h-10 bg-amber-900/30 rounded-lg flex items-center justify-center -rotate-12">
                      <Gamepad2 className="w-6 h-6 text-zinc-300" />
                    </div>
                  </div>
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">$0.00</h4>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Toplam Ücret</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-500/20">
                      <Coins className="w-5 h-5 text-[#00E5FF]" />
                    </div>
                  </div>
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">$0.00</h4>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Bugün Bahis Yapılan<br/>Tutar</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-900/30 rounded-full flex items-center justify-center border border-yellow-500/20">
                      <Coins className="w-5 h-5 text-zinc-300" />
                    </div>
                  </div>
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">$0.00</h4>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">Net Kazanç <Info className="w-3.5 h-3.5" /></p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-900/30 rounded-full flex items-center justify-center border border-yellow-500/20">
                      <Coins className="w-5 h-5 text-zinc-300" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* GAMIFICATION TAB */}
          {activeTab === 'gamification' && (
            <div className="animate-fade-in flex flex-col w-full space-y-6">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-400" />
                Sadakat & Ödüller
              </h1>

              {/* Progress Section */}
              <div className="bg-[#12161E] border border-[#202532] rounded-xl p-6 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[color:var(--theme-accent)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex items-center justify-between z-10">
                  <div>
                    <h3 className="text-white font-black text-xl">Seviye {userLevel}</h3>
                    <p className="text-zinc-400 text-sm font-medium mt-1">Sonraki seviyeye {xpForNextLevel - userXp} XP kaldı.</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[color:var(--theme-accent)]/10 text-[color:var(--theme-accent)] flex items-center justify-center font-black text-2xl border border-[color:var(--theme-accent)]/20 shadow-[0_0_15px_rgba(0,255,163,0.2)]">
                    {userLevel}
                  </div>
                </div>
                
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden z-10 border border-white/5">
                  <div className="h-full bg-[color:var(--theme-accent)] shadow-[0_0_10px_rgba(0,255,163,0.5)] transition-all duration-1000 relative" style={{ width: `${progressPercent}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse w-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-10 pt-2">
                  <div className="bg-[#0A0C10] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Mevcut XP</div>
                      <div className="text-white font-black">{userXp}</div>
                    </div>
                  </div>
                  <div className="bg-[#0A0C10] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Sadakat Puanı</div>
                      <div className="text-white font-black">{siteUser.loyalty?.points || 0}</div>
                    </div>
                  </div>
                  <div className="bg-[#0A0C10] p-4 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Kazanılan Ödüller</div>
                      <div className="text-white font-black">3</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rewards Section */}
              <div className="bg-[#12161E] border border-[#202532] rounded-xl overflow-hidden">
                <div className="p-5 border-b border-[#202532] bg-[#1A212D]/50 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">Seviye Ödülleri</h3>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {[
                    { lvl: 2, reward: '50 TL Freebet', status: userLevel >= 2 ? 'completed' : 'locked' },
                    { lvl: 3, reward: '100 TL FreeSpin', status: userLevel >= 3 ? 'completed' : 'locked' },
                    { lvl: 4, reward: '250 TL Nakit Ödül', status: userLevel >= 4 ? 'completed' : 'locked' },
                    { lvl: 5, reward: 'VIP Müşteri Temsilcisi', status: userLevel >= 5 ? 'completed' : 'locked' }
                  ].map((item, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${item.status === 'completed' ? 'bg-[#00E5FF]/5 border-[#00E5FF]/20' : 'bg-[#0A0C10] border-white/5 opacity-60'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${item.status === 'completed' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 'bg-white/5 text-zinc-500'}`}>
                          {item.lvl}
                        </div>
                        <div>
                          <div className={`font-bold ${item.status === 'completed' ? 'text-white' : 'text-zinc-400'}`}>{item.reward}</div>
                          <div className={`text-xs ${item.status === 'completed' ? 'text-[#00E5FF]' : 'text-zinc-600'}`}>{item.status === 'completed' ? 'Alındı' : 'Kilitli'}</div>
                        </div>
                      </div>
                      <button 
                        disabled={item.status === 'completed' || item.status === 'locked'}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'text-[#00E5FF]' : 'bg-white/5 text-zinc-600'}`}
                      >
                        {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INBOX TAB */}
          {activeTab === 'inbox' && (
            <div className="animate-fade-in flex flex-col w-full space-y-6">
              <h1 className="text-2xl font-black text-white tracking-tight">Gelen Kutusu</h1>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
                <p className="text-zinc-300/90 text-sm font-medium leading-relaxed">
                  Yeni mesajlarınız var! Yönetim ekibimizden veya sistemden gelen önemli duyuruları buradan takip edebilirsiniz.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {defaultMessages.map((msg) => {
                  const isExpanded = expandedMsg === msg.id;
                  return (
                    <div 
                      key={msg.id}
                      onClick={() => setExpandedMsg(isExpanded ? null : msg.id)}
                      className={`border rounded-xl transition-all duration-200 overflow-hidden cursor-pointer ${
                        isExpanded ? 'bg-[#161B24] border-[color:var(--theme-accent)]/30' : 'bg-[#12161E] border-[#202532] hover:bg-[#161B24]'
                      }`}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className={`font-bold text-sm transition-colors ${isExpanded ? 'text-[color:var(--theme-accent)]' : 'text-white'}`}>
                            {msg.title}
                          </span>
                          <span className="text-zinc-500 text-xs font-medium mt-1">{msg.date}</span>
                        </div>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isExpanded ? 'bg-[color:var(--theme-accent)]/10 rotate-45' : 'bg-[#1A212D]'
                        }`}>
                          <Plus className={`w-4 h-4 transition-colors ${isExpanded ? 'text-[color:var(--theme-accent)]' : 'text-zinc-400'}`} />
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-5 pt-1 animate-fade-in">
                          <p className="text-zinc-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                            {msg.content}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in flex flex-col w-full space-y-8">
              <h1 className="text-2xl font-black text-white tracking-tight">Ayarlar</h1>
              
              <div className="flex flex-col gap-1 bg-[#12161E] border border-[#202532] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setAmbientMode(!ambientMode)}>
                  <span className="text-white font-bold text-sm">Casino oyunlarında amiyans modunu etkinleştirin</span>
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${ambientMode ? 'bg-[color:var(--theme-accent)]' : 'bg-[#2A3143]'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${ambientMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
                <div className="w-full h-px bg-[#202532]" />
                <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setNewsletters(!newsletters)}>
                  <span className="text-white font-bold text-sm">Haberler ve Teklifler Al</span>
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${newsletters ? 'bg-[color:var(--theme-accent)]' : 'bg-[#2A3143]'}`}>
                    <div className={`w-4 h-4 bg-zinc-400 rounded-full transition-transform ${newsletters ? 'translate-x-5 bg-white' : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-white">Diğerleri</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-zinc-500 font-bold text-xs uppercase">Dil</label>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <div 
                          onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                          className="bg-[#12161E] border border-[#202532] rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[color:var(--theme-accent)]/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <img src={localLanguage === 'Turkish' ? "https://flagcdn.com/w20/tr.png" : "https://flagcdn.com/w20/gb.png"} alt={localLanguage === 'Turkish' ? 'TR' : 'EN'} className="w-5 h-auto rounded-sm" />
                            <span className="text-white font-bold text-sm">{localLanguage}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {languageDropdownOpen && (
                          <div className="absolute top-full mt-2 w-full bg-[#12161E] border border-[#202532] rounded-xl shadow-xl overflow-hidden z-20">
                            <div 
                              onClick={() => { setLocalLanguage('Turkish'); setLanguageDropdownOpen(false); }}
                              className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                            >
                              <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-5 h-auto rounded-sm" />
                              <span className="text-white font-bold text-sm">Turkish</span>
                            </div>
                            <div 
                              onClick={() => { setLocalLanguage('English'); setLanguageDropdownOpen(false); }}
                              className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                            >
                              <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 h-auto rounded-sm" />
                              <span className="text-white font-bold text-sm">English</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => {
                           const targetLang = localLanguage === 'English' ? 'en' : 'tr';
                           if (targetLang !== globalLang) {
                             setIsAnimating(true);
                             setTimeout(() => {
                               setGlobalLang(targetLang);
                               setTimeout(() => setIsAnimating(false), 200);
                             }, 800);
                           }
                        }}
                        className="bg-[color:var(--theme-accent)] hover:bg-[#00E5FF] text-black font-black px-6 py-3 rounded-xl transition-colors h-full whitespace-nowrap"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-zinc-500 font-bold text-xs uppercase">Sohbet Geçmişi Uzunluğu</label>
                    <div className="bg-[#12161E] border border-[#202532] rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[color:var(--theme-accent)]/30 transition-colors">
                      <span className="text-white font-bold text-sm">50</span>
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>
                </div>
                <div className="bg-[#1F170D] border border-orange-500/20 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-black flex items-center justify-center font-black text-xs shrink-0">!</div>
                  <span className="text-orange-500 font-bold text-xs">Daha uzun sohbet geçmişi çökme performansını önemli ölçüde etkiler</span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-white">İki Faktörlü Doğrulama (2FA)</h2>
                {twoFactorStep === 'idle' && (
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-bold text-sm">Hesabınızı güvenceye alın</span>
                      <span className="text-zinc-500 text-xs">Para çekme işlemlerinde ve şüpheli girişlerde ek güvenlik sağlar.</span>
                    </div>
                    <button onClick={() => setTwoFactorStep('setup')} className="bg-[color:var(--theme-accent)] hover:bg-[#00E5FF] text-black font-black text-sm px-6 py-2.5 rounded-xl w-full md:w-max transition-colors whitespace-nowrap">
                      Etkinleştir
                    </button>
                  </div>
                )}
                {twoFactorStep === 'setup' && (
                  <div className="bg-[#12161E] border border-[color:var(--theme-accent)]/30 rounded-xl p-6 flex flex-col gap-6 animate-fade-in shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                      <div className="bg-white p-2 rounded-xl">
                        {/* Mock QR Code */}
                        <div className="w-32 h-32 bg-[#0A0C10] flex items-center justify-center text-white text-xs text-center border-4 border-white">
                          [QR KOD<br/>SİMÜLASYONU]
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 flex-1">
                        <h3 className="text-white font-bold">1. Uygulamayı İndirin</h3>
                        <p className="text-zinc-400 text-sm">Google Authenticator veya Authy uygulamasını indirin ve soldaki QR kodu taratın.</p>
                        
                        <h3 className="text-white font-bold mt-2">2. Kodu Girin</h3>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="6 haneli kod" 
                            className="bg-[#1A212D] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-[color:var(--theme-accent)] flex-1 font-mono tracking-widest"
                            maxLength={6}
                            value={twoFactorCode}
                            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                          />
                          <button 
                            onClick={() => {
                              if (twoFactorCode.length === 6) setTwoFactorStep('active');
                            }}
                            className="bg-[color:var(--theme-accent)] hover:bg-[#00d0e8] text-black font-bold px-6 py-2 rounded-lg transition-colors"
                          >
                            Doğrula
                          </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setTwoFactorStep('idle')} className="text-zinc-500 hover:text-white text-sm font-bold w-max transition-colors">Vazgeç</button>
                  </div>
                )}
                {twoFactorStep === 'active' && (
                  <div className="bg-[#00E5FF]/10 border border-[#00E676]/30 rounded-xl p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF]">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#00E5FF] font-bold text-sm">2FA Aktif</span>
                        <span className="text-zinc-400 text-xs">Hesabınız Google Authenticator ile korunuyor.</span>
                      </div>
                    </div>
                    <button onClick={() => setTwoFactorStep('idle')} className="bg-[#1A212D] border border-white/10 hover:border-red-500/50 hover:text-red-400 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors whitespace-nowrap">
                      Devre Dışı Bırak
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-white">Sorumlu Oyun (Responsible Gambling)</h2>
                
                {/* Deposit Limits */}
                <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">Para Yatırma Limitleri</h3>
                    <p className="text-zinc-500 text-xs">Bütçenizi kontrol altında tutmak için günlük, haftalık veya aylık limitler belirleyebilirsiniz.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400 text-xs font-bold">Günlük Limit ($)</label>
                      <input type="number" placeholder="Limit yok" className="bg-[#1A212D] border border-white/5 rounded-lg px-3 py-2 text-white outline-none focus:border-[color:var(--theme-accent)] text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400 text-xs font-bold">Haftalık Limit ($)</label>
                      <input type="number" placeholder="Limit yok" className="bg-[#1A212D] border border-white/5 rounded-lg px-3 py-2 text-white outline-none focus:border-[color:var(--theme-accent)] text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400 text-xs font-bold">Aylık Limit ($)</label>
                      <input type="number" placeholder="Limit yok" className="bg-[#1A212D] border border-white/5 rounded-lg px-3 py-2 text-white outline-none focus:border-[color:var(--theme-accent)] text-sm" />
                    </div>
                  </div>
                  <button className="bg-[#1A212D] hover:bg-[#202836] text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors w-max">Limitleri Kaydet</button>
                </div>

                {/* Self Exclusion */}
                <div className="bg-[#1F170D] border border-orange-500/20 rounded-xl p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-orange-500 font-black text-sm mb-1 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Kendini Dışlama (Self-Exclusion)
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      Belirlediğiniz süre boyunca hesabınıza para yatırmanızı ve oyun oynamanızı engeller. Bu işlem BAŞLATILDIKTAN SONRA İPTAL EDİLEMEZ.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 font-bold px-5 py-2 rounded-lg text-sm transition-colors">24 Saat</button>
                    <button className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 font-bold px-5 py-2 rounded-lg text-sm transition-colors">7 Gün</button>
                    <button className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 font-bold px-5 py-2 rounded-lg text-sm transition-colors">30 Gün</button>
                    <button className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold px-5 py-2 rounded-lg text-sm transition-colors">Kalıcı Kapat</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VERIFICATION (KYC) TAB */}
          {activeTab === 'verification' && (
            <div className="animate-fade-in flex flex-col w-full space-y-6">
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#00E5FF]" /> 
                Doğrulamalar (KYC)
              </h1>
              
              <div className="bg-[#12161E] border border-[#202532] rounded-xl overflow-hidden">
                <div className="p-6 border-b border-[#202532] bg-gradient-to-r from-[#1A212D] to-transparent">
                  <h3 className="text-white font-bold text-lg mb-2">Müşterini Tanı (KYC) Prosedürü</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
                    Hesabınızın güvenliğini sağlamak, kara para aklamayı önlemek ve lisans kurallarımıza uymak amacıyla kimlik doğrulama işlemi zorunludur. Tüm verileriniz şifrelenerek saklanır.
                  </p>
                </div>
                
                <div className="p-6 flex flex-col gap-6">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-4 bg-[#1A212D]/50 p-4 rounded-xl border border-white/5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      kycStatus === 'verified' ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 
                      kycStatus === 'pending' ? 'bg-amber-500/20 text-zinc-300' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {kycStatus === 'verified' ? <CheckCircle2 className="w-6 h-6" /> : 
                       kycStatus === 'pending' ? <AlertCircle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold">Hesap Durumu</span>
                      <span className={`text-sm font-bold ${
                        kycStatus === 'verified' ? 'text-[#00E5FF]' : 
                        kycStatus === 'pending' ? 'text-zinc-300' : 'text-red-500'
                      }`}>
                        {kycStatus === 'verified' ? 'Onaylandı - Sınırsız İşlem' : 
                         kycStatus === 'pending' ? 'İnceleniyor - Bekleyiniz' : 'Doğrulanmadı - İşlem Limitleri Geçerli'}
                      </span>
                    </div>
                  </div>

                  {/* Upload Area */}
                  {kycStatus === 'unverified' && (
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-2 border-dashed border-[#2A3143] hover:border-[color:var(--theme-accent)] bg-[#161B24] rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
                          <div className="w-12 h-12 bg-[#2A3143] group-hover:bg-[color:var(--theme-accent)]/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                            <FileText className="w-6 h-6 text-zinc-400 group-hover:text-[color:var(--theme-accent)] transition-colors" />
                          </div>
                          <h4 className="text-white font-bold mb-1">Kimlik Belgesi</h4>
                          <p className="text-zinc-500 text-xs">Pasaport, Kimlik Kartı veya Ehliyet (Ön ve Arka Yüz)</p>
                        </div>

                        <div className="border-2 border-dashed border-[#2A3143] hover:border-[color:var(--theme-accent)] bg-[#161B24] rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group">
                          <div className="w-12 h-12 bg-[#2A3143] group-hover:bg-[color:var(--theme-accent)]/20 rounded-full flex items-center justify-center mb-4 transition-colors">
                            <FileText className="w-6 h-6 text-zinc-400 group-hover:text-[color:var(--theme-accent)] transition-colors" />
                          </div>
                          <h4 className="text-white font-bold mb-1">Adres Belgesi</h4>
                          <p className="text-zinc-500 text-xs">Son 3 aya ait fatura veya e-Devlet İkametgah Belgesi</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setKycStatus('pending')}
                        className="bg-[color:var(--theme-accent)] hover:bg-[#00d0e8] text-black font-black py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                      >
                        Belgeleri Yükle ve Onaya Gönder
                      </button>
                    </div>
                  )}

                  {kycStatus === 'pending' && (
                    <div className="flex flex-col items-center justify-center py-10 bg-[#161B24] rounded-xl border border-white/5">
                      <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
                      <h4 className="text-white font-bold text-lg mb-2">Belgeleriniz İnceleniyor</h4>
                      <p className="text-zinc-400 text-sm text-center max-w-md">
                        Risk birimimiz gönderdiğiniz belgeleri inceliyor. Bu işlem genellikle 1-2 saat içinde sonuçlanır. Sonuç e-posta ile tarafınıza bildirilecektir.
                      </p>
                      <button 
                        onClick={() => setKycStatus('verified')}
                        className="mt-6 text-zinc-300 text-xs underline opacity-50 hover:opacity-100"
                      >
                        (Dev Test: Onaylandı Olarak İşaretle)
                      </button>
                    </div>
                  )}
                  
                  {kycStatus === 'verified' && (
                    <div className="flex flex-col items-center justify-center py-10 bg-gradient-to-b from-[#00E676]/10 to-transparent rounded-xl border border-[#00E676]/20">
                      <CheckCircle2 className="w-20 h-20 text-[#00E5FF] mb-4 drop-shadow-[0_0_15px_rgba(0,230,118,0.5)]" />
                      <h4 className="text-white font-black text-xl mb-2">Hesabınız Tamamen Onaylandı</h4>
                      <p className="text-zinc-300 text-sm text-center max-w-md mb-6">
                        Tebrikler! Sınır olmaksızın para yatırabilir, çekebilir ve yüksek limitli oyunlar oynayabilirsiniz.
                      </p>
                      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                        <div className="bg-[#1A212D] p-3 rounded-lg text-center">
                          <span className="block text-zinc-500 text-xs font-bold mb-1">Günlük Para Çekme</span>
                          <span className="text-[#00E5FF] font-bold">Limitsiz</span>
                        </div>
                        <div className="bg-[#1A212D] p-3 rounded-lg text-center">
                          <span className="block text-zinc-500 text-xs font-bold mb-1">Kimlik Teyidi</span>
                          <span className="text-[#00E5FF] font-bold">Onaylandı</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === 'transactions' && (
            <div className="animate-fade-in flex flex-col w-full space-y-6">
              <h1 className="text-2xl font-black text-white tracking-tight">İşlemler</h1>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#202532] pb-4">
                <div className="flex flex-wrap items-center gap-6">
                  {['deposit', 'withdraw', 'tips', 'affiliate'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setTxTab(tab as any)}
                      className={`text-sm font-bold pb-4 -mb-[17px] transition-colors border-b-2 ${
                        txTab === tab 
                          ? 'text-[color:var(--theme-accent)] border-[color:var(--theme-accent)]' 
                          : 'text-zinc-500 border-transparent hover:text-zinc-300'
                      }`}
                    >
                      {tab === 'deposit' && 'Mevduat'}
                      {tab === 'withdraw' && 'Para Çekme'}
                      {tab === 'tips' && 'İpuçları'}
                      {tab === 'affiliate' && 'Affiliate Claims'}
                    </button>
                  ))}
                </div>
                <button className="bg-[#1A212D] hover:bg-[#202836] text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors">
                  İhracat
                </button>
              </div>

              {txTab === 'deposit' && (
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-[#202532]">
                        <th className="py-4 px-4 text-zinc-500 text-[10px] font-black tracking-widest uppercase">KRİPTO DEĞERİ</th>
                        <th className="py-4 px-4 text-zinc-500 text-[10px] font-black tracking-widest uppercase">FİAT DEĞERİ</th>
                        <th className="py-4 px-4 text-zinc-500 text-[10px] font-black tracking-widest uppercase">TARİH</th>
                        <th className="py-4 px-4 text-zinc-500 text-[10px] font-black tracking-widest uppercase">DURUM</th>
                        <th className="py-4 px-4 text-zinc-500 text-[10px] font-black tracking-widest uppercase text-right">İŞLEM</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { crypto: '214.4', fiat: '214.35', date: '10.05.2026, 13:14', icon: 'T', color: 'bg-[#00E5FF]' },
                        { crypto: '285.5', fiat: '100.24', date: '09.05.2026, 16:44', icon: 'TRX', color: 'bg-red-500' },
                        { crypto: '149.4', fiat: '149.37', date: '03.05.2026, 14:23', icon: 'T', color: 'bg-[#00E5FF]' },
                        { crypto: '24.4', fiat: '24.40', date: '02.05.2026, 20:35', icon: 'T', color: 'bg-[#00E5FF]' },
                        { crypto: '99.99', fiat: '99.94', date: '30.04.2026, 20:31', icon: 'T', color: 'bg-[#00E5FF]' },
                        { crypto: '99.99', fiat: '99.98', date: '28.04.2026, 14:31', icon: 'T', color: 'bg-[#00E5FF]' },
                        { crypto: '9.99', fiat: '9.99', date: '27.04.2026, 18:01', icon: 'T', color: 'bg-[#00E5FF]' },
                      ].map((tx, idx) => (
                        <tr key={idx} className="border-b border-[#202532] hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-full ${tx.color} flex items-center justify-center text-white text-[10px] font-black`}>
                                {tx.icon}
                              </div>
                              <span className="text-white font-bold text-sm">{tx.crypto}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                              $ {tx.fiat}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-zinc-300 font-medium text-sm">{tx.date}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-[color:var(--theme-accent)]/10 text-[color:var(--theme-accent)] border border-[color:var(--theme-accent)]/20 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md">
                              COMPLETE
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button className="bg-[#1A212D] hover:bg-[#202836] text-white font-bold px-4 py-1.5 rounded-lg text-xs transition-colors">
                              Ayrıntılar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button className="w-8 h-8 rounded-lg bg-[#151A25] text-[color:var(--theme-accent)] font-bold text-sm border border-[color:var(--theme-accent)]/20 flex items-center justify-center shadow">1</button>
                    <button className="w-8 h-8 rounded-lg bg-transparent text-zinc-500 hover:text-white font-bold text-sm flex items-center justify-center transition-colors">2</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OTHER TABS PLACEHOLDERS */}
          {['affiliates', 'verification', 'privacy', 'links'].includes(activeTab) && (
            <div className="animate-fade-in flex flex-col w-full h-[50vh] items-center justify-center space-y-4 opacity-50">
               <AlertCircle className="w-12 h-12 text-zinc-600" />
               <h2 className="text-xl font-bold text-zinc-500">Bu bölüm yapım aşamasındadır</h2>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
