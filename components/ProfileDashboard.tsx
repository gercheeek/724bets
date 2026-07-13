import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  User, Bell, Users, ShieldCheck, Settings, Lock, Link as LinkIcon, FileText, LogOut,
  ChevronRight, Upload, HelpCircle, Info, ChevronDown, CheckCircle2, ChevronLeft,
  Coins, Gamepad2, AlertCircle, Plus
} from 'lucide-react';
import { SiteUser } from '../types';
import { supabase } from '../utils/supabase';

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
      content: "Değerli üyemiz, güvenliğiniz bizim için her şeyden önemli. Resmi sitemiz sadece 724bets.net ve 724bahis.net'tir. Bizi taklit eden dolandırıcı sitelere (phishing) karşı dikkatli olun ve şifrenizi asla başka yerlerde paylaşmayın."
    },
    {
      id: 4,
      title: "📱 Sosyal Medya ve Telegram",
      date: "Az önce",
      content: "En güncel adreslerimiz, bedava bonus kodları (promocode) ve sürpriz çekilişler için bizi Telegram ve resmi sosyal medya hesaplarımızdan takip etmeyi unutmayın. Sağ alttaki ikonlardan resmi kanallarımıza ulaşabilirsiniz!"
    }
  ];

  const handleLogout = () => {
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
    { id: 'inbox', label: 'Gelen Kutusu', icon: <Bell className="w-5 h-5" /> },
    { id: 'affiliates', label: 'İştirakler', icon: <Users className="w-5 h-5" /> },
    { id: 'verification', label: 'Doğrulamalar', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-5 h-5" /> },
    { id: 'privacy', label: 'Gizlilik', icon: <Lock className="w-5 h-5" /> },
    { id: 'links', label: 'Bağlantılar', icon: <LinkIcon className="w-5 h-5" /> },
    { id: 'transactions', label: 'İşlemler', icon: <FileText className="w-5 h-5" /> },
  ];

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
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="w-3.5 h-3.5 bg-orange-300 rounded shadow-sm" />
                   <span className="text-white/90 text-sm font-bold">Bronz 1</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 w-full">
              <div className="flex items-center justify-between text-white font-bold text-xs mb-1.5">
                <span>0.00%</span>
                <div className="flex items-center gap-1">
                  <div className="w-3.5 h-3.5 bg-orange-500 rounded shadow-sm" />
                  <span>Bronz 2</span>
                </div>
              </div>
              <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ width: '0%' }} />
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
                      ? 'bg-[#151A25] text-[#00FFA3] shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/5' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <div className={isActive ? 'text-[#00FFA3]' : 'text-zinc-500'}>
                    {item.icon}
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'inbox' && (
                    <span className="bg-[#00FFA3] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
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
                    <div className="w-16 h-16 rounded-xl bg-black overflow-hidden border-2 border-zinc-800 shrink-0">
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
                            isSelected ? 'border-[#00FFA3] scale-110 shadow-[0_0_15px_rgba(0,255,163,0.3)]' : 'border-zinc-800 hover:border-zinc-600 hover:scale-105 opacity-70 hover:opacity-100'
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
                      className="flex-1 bg-[#12161E] border border-[#202532] rounded-xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
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
                      className="flex-1 bg-[#12161E] border border-[#202532] rounded-xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
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
                      className="flex-1 bg-[#12161E] border border-[#202532] rounded-xl px-5 py-3.5 text-white font-bold focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
                    />
                    <button 
                      onClick={handlePasswordSave}
                      disabled={isSavingPassword || !password}
                      className={`font-bold px-6 py-3.5 rounded-xl transition-colors ${
                        passwordSaveStatus === 'success' ? 'bg-[#00FFA3] text-black' :
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
                    <div className="flex-1 bg-[#12161E] border border-[#202532] rounded-xl px-4 py-3.5 flex items-center gap-3 focus-within:border-[#00FFA3]/50 transition-colors">
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
                      <Gamepad2 className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">$0.00</h4>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Toplam Ücret</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-500/20">
                      <Coins className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">$0.00</h4>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Bugün Bahis Yapılan<br/>Tutar</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-900/30 rounded-full flex items-center justify-center border border-yellow-500/20">
                      <Coins className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                  <div className="bg-[#12161E] border border-[#202532] rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-lg mb-0.5">$0.00</h4>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">Net Kazanç <Info className="w-3.5 h-3.5" /></p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-900/30 rounded-full flex items-center justify-center border border-yellow-500/20">
                      <Coins className="w-5 h-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* INBOX TAB */}
          {activeTab === 'inbox' && (
            <div className="animate-fade-in flex flex-col w-full space-y-6">
              <h1 className="text-2xl font-black text-white tracking-tight">Gelen Kutusu</h1>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-amber-500/90 text-sm font-medium leading-relaxed">
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
                        isExpanded ? 'bg-[#161B24] border-[#00FFA3]/30' : 'bg-[#12161E] border-[#202532] hover:bg-[#161B24]'
                      }`}
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className={`font-bold text-sm transition-colors ${isExpanded ? 'text-[#00FFA3]' : 'text-white'}`}>
                            {msg.title}
                          </span>
                          <span className="text-zinc-500 text-xs font-medium mt-1">{msg.date}</span>
                        </div>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isExpanded ? 'bg-[#00FFA3]/10 rotate-45' : 'bg-[#1A212D]'
                        }`}>
                          <Plus className={`w-4 h-4 transition-colors ${isExpanded ? 'text-[#00FFA3]' : 'text-zinc-400'}`} />
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
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${ambientMode ? 'bg-[#00FFA3]' : 'bg-[#2A3143]'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${ambientMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
                <div className="w-full h-px bg-[#202532]" />
                <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setNewsletters(!newsletters)}>
                  <span className="text-white font-bold text-sm">Haberler ve Teklifler Al</span>
                  <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${newsletters ? 'bg-[#00FFA3]' : 'bg-[#2A3143]'}`}>
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
                          className="bg-[#12161E] border border-[#202532] rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[#00FFA3]/30 transition-colors"
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
                        className="bg-[#00FFA3] hover:bg-[#00E676] text-black font-black px-6 py-3 rounded-xl transition-colors h-full whitespace-nowrap"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="text-zinc-500 font-bold text-xs uppercase">Sohbet Geçmişi Uzunluğu</label>
                    <div className="bg-[#12161E] border border-[#202532] rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-[#00FFA3]/30 transition-colors">
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
                <h2 className="text-xl font-black text-white">2FA</h2>
                <button className="bg-[#00FFA3] hover:bg-[#00E676] text-black font-black text-sm px-6 py-3 rounded-xl w-max transition-colors">
                  2FA Kimlik Doğrulayıcıyı Etkinleştir
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-black text-white">Kendini Dışlama</h2>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-3xl">
                  Bu özelliği, belirlediğiniz zaman dilimi içerisinde para yatırmanızı ve kumar oynamanızı engellemek ama aynı zamanda para çekme ve sohbet etme gibi diğer özellikleri kullanmaya devam etmek için kullanabilirsiniz.
                </p>
                <div className="bg-[#1F170D] border border-orange-500/20 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-black flex items-center justify-center font-black text-xs shrink-0 mt-0.5">!</div>
                  <span className="text-orange-500 font-bold text-sm">Lütfen daha sonra fikrinizi değiştirseniz bile bu talebin HİÇBİR NEDENLE KALDIRILMAYACAĞINI unutmayın.</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button className="bg-[#1A212D] hover:bg-[#202836] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">1 gün</button>
                  <button className="bg-[#1A212D] hover:bg-[#202836] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">5 gün</button>
                  <button className="bg-[#1A212D] hover:bg-[#202836] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors">8 gün</button>
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
                          ? 'text-[#00FFA3] border-[#00FFA3]' 
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
                        { crypto: '214.4', fiat: '214.35', date: '10.05.2026, 13:14', icon: 'T', color: 'bg-emerald-500' },
                        { crypto: '285.5', fiat: '100.24', date: '09.05.2026, 16:44', icon: 'TRX', color: 'bg-red-500' },
                        { crypto: '149.4', fiat: '149.37', date: '03.05.2026, 14:23', icon: 'T', color: 'bg-emerald-500' },
                        { crypto: '24.4', fiat: '24.40', date: '02.05.2026, 20:35', icon: 'T', color: 'bg-emerald-500' },
                        { crypto: '99.99', fiat: '99.94', date: '30.04.2026, 20:31', icon: 'T', color: 'bg-emerald-500' },
                        { crypto: '99.99', fiat: '99.98', date: '28.04.2026, 14:31', icon: 'T', color: 'bg-emerald-500' },
                        { crypto: '9.99', fiat: '9.99', date: '27.04.2026, 18:01', icon: 'T', color: 'bg-emerald-500' },
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
                            <span className="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                              $ {tx.fiat}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-zinc-300 font-medium text-sm">{tx.date}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-md">
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
                    <button className="w-8 h-8 rounded-lg bg-[#151A25] text-[#00FFA3] font-bold text-sm border border-[#00FFA3]/20 flex items-center justify-center shadow">1</button>
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
