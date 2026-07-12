import React, { useState } from 'react';
import { User, Lock, Wallet, ShieldCheck, Mail, Phone, Key, Save, AlertCircle } from 'lucide-react';
import { SiteUser } from '../types';
import { supabase } from '../utils/supabase';

interface ProfileDashboardProps {
  siteUser: SiteUser;
  setSiteUser: React.Dispatch<React.SetStateAction<SiteUser | null>>;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ siteUser, setSiteUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  
  // Form States
  const [email, setEmail] = useState(siteUser.email || '');
  const [phone, setPhone] = useState(siteUser.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // Basic verification of old password before changing (simulated or real depending on backend)
      if (newPassword && !currentPassword) {
        throw new Error('Yeni şifre belirlemek için mevcut şifrenizi girmelisiniz.');
      }
      if (newPassword && currentPassword !== siteUser.password) {
        throw new Error('Mevcut şifrenizi yanlış girdiniz.');
      }
      
      const updates: Partial<SiteUser> = {
        email,
        phone,
      };
      
      if (newPassword) {
        updates.password = newPassword;
      }
      
      // Update in Supabase
      const { error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', siteUser.id);
        
      if (error) throw error;
      
      // Update local state
      const updatedUser = { ...siteUser, ...updates };
      setSiteUser(updatedUser);
      localStorage.setItem('site_current_member', JSON.stringify(updatedUser));
      localStorage.setItem('site_member', JSON.stringify(updatedUser));
      
      setSaveMessage({ type: 'success', text: 'Profil ayarlarınız başarıyla güncellendi!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message || 'Güncelleme sırasında bir hata oluştu.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto px-4 py-8 space-y-8" style={{ minHeight: '100vh' }}>
      {/* Top Member Card Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#141822] to-[#0A0C10] w-full p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center gap-6 border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Avatar & Info */}
        <div className="flex items-center gap-5 z-10 w-full md:w-auto">
          <div className="w-20 h-20 rounded-2xl bg-[#1A1D24] border-2 border-[#00FFA3] p-1 shadow-[0_0_20px_rgba(0,255,163,0.35)] flex-shrink-0">
            <img src={(siteUser as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${siteUser.username}`} className="w-full h-full rounded-xl object-cover" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              {siteUser.username}
              <span className="w-2.5 h-2.5 bg-[#00FFA3] rounded-full animate-ping" />
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-gradient-to-r from-orange-400 to-amber-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                {(siteUser as any).loyaltyLevel || 'BRONZ 2'}
              </span>
              <span className="text-zinc-400 text-xs font-bold px-2 py-1 bg-white/5 rounded-md">ID: {siteUser.id?.substring(0,6).toUpperCase() || 'USER'}</span>
            </div>
          </div>
        </div>
        
        {/* Balance & Stats */}
        <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 z-10 mt-4 md:mt-0 md:ml-4">
          <div className="bg-[#0A0C10]/80 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-inner hover:border-[#00FFA3]/20 transition-all duration-300">
            <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1.5">Cüzdan</div>
            <div className="text-[#00FFA3] text-lg md:text-xl font-black font-mono">₺{(siteUser.balance || 0).toLocaleString('tr-TR')}</div>
          </div>
          <div className="bg-[#0A0C10]/80 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-inner hover:border-[#00FFA3]/20 transition-all duration-300">
            <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1.5">Sadakat Puanı</div>
            <div className="text-white text-lg md:text-xl font-black font-mono">{(siteUser as any).loyaltyPoints || '1,450'} <span className="text-xs text-zinc-500 font-bold">XP</span></div>
          </div>
          <div className="bg-[#0A0C10]/80 backdrop-blur-md rounded-xl p-4 border border-white/5 shadow-inner col-span-2 flex flex-col justify-center">
            <div className="flex justify-between items-center text-xs font-bold mb-2.5">
              <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Sonraki Seviye: <span className="text-white">GÜMÜŞ 1</span></span>
              <span className="text-[#00FFA3] font-black">65%</span>
            </div>
            <div className="w-full h-2 bg-black rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00FFA3] to-emerald-400 shadow-[0_0_10px_#00FFA3] rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-black text-sm uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'overview' 
              ? 'border-[#00FFA3] text-[#00FFA3] bg-[#00FFA3]/5' 
              : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
          }`}
        >
          Genel Bakış
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 font-black text-sm uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'settings' 
              ? 'border-[#00FFA3] text-[#00FFA3] bg-[#00FFA3]/5' 
              : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
          }`}
        >
          Ayarlar
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Account Information Card */}
          <div className="lg:col-span-2 bg-[#161822]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl flex flex-col space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <User className="w-5 h-5 text-[#00FFA3]" />
              <h3 className="text-white text-lg font-black uppercase tracking-wider">Hesap Bilgileri</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Kullanıcı Adı</span>
                <div className="bg-[#0A0C10]/50 rounded-xl px-4 py-3 border border-white/5 text-white font-bold text-sm">{siteUser.username}</div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">E-Posta</span>
                <div className="bg-[#0A0C10]/50 rounded-xl px-4 py-3 border border-white/5 text-white font-bold text-sm truncate">{siteUser.email || '—'}</div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Telefon Numarası</span>
                <div className="bg-[#0A0C10]/50 rounded-xl px-4 py-3 border border-white/5 text-white font-bold text-sm">{siteUser.phone || '—'}</div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Kayıt Tarihi</span>
                <div className="bg-[#0A0C10]/50 rounded-xl px-4 py-3 border border-white/5 text-white font-bold text-sm">
                  {new Date(siteUser.createdAt || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Üyelik Rolü</span>
                <div className="bg-[#0A0C10]/50 rounded-xl px-4 py-3 border border-white/5 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  {siteUser.role || 'MEMBER'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Hesap Durumu</span>
                <div className="bg-[#0A0C10]/50 rounded-xl px-4 py-3 border border-white/5 text-[#00FFA3] font-bold text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
                  AKTİF
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Security */}
          <div className="bg-[#161822]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-2xl flex flex-col space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Lock className="w-5 h-5 text-[#00FFA3]" />
              <h3 className="text-white text-lg font-black uppercase tracking-wider">Güvenlik & İşlemler</h3>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => window.dispatchEvent(new Event('openDepositModal'))}
                className="w-full bg-[#1475E1] hover:bg-[#1a85ff] text-white font-black py-4 px-6 rounded-xl text-sm transition-all shadow-lg shadow-[#1475E1]/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Cüzdana Bakiye Ekle
              </button>

              <div className="p-4 rounded-xl border border-white/5 bg-[#0A0C10]/40 flex flex-col space-y-3">
                <h4 className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Hesap Doğrulaması</h4>
                <p className="text-zinc-500 text-xs leading-relaxed">Hesabınızın güvenliği ve hızlı ödeme alabilmeniz için kimlik doğrulamanız tamamlanmıştır.</p>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black">
                  <ShieldCheck className="w-4 h-4" />
                  DOĞRULANMIŞ HESAP
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="bg-[#161822]/40 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white/5 shadow-2xl animate-fade-in max-w-3xl">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-8">
            <User className="w-6 h-6 text-[#00FFA3]" />
            <div>
              <h3 className="text-white text-xl font-black uppercase tracking-wider">Profili Düzenle</h3>
              <p className="text-zinc-500 text-xs mt-1 font-medium">Kişisel bilgilerinizi ve güvenlik ayarlarınızı buradan güncelleyebilirsiniz.</p>
            </div>
          </div>

          {saveMessage && (
            <div className={`p-4 rounded-xl flex items-start gap-3 mb-8 ${saveMessage.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <AlertCircle className={`w-5 h-5 shrink-0 ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`} />
              <p className={`text-sm font-bold ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>{saveMessage.text}</p>
            </div>
          )}

          <div className="space-y-8">
            {/* İletişim Bilgileri */}
            <div className="space-y-4">
              <h4 className="text-zinc-400 text-xs font-black uppercase tracking-widest border-b border-white/5 pb-2">İletişim Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" /> E-Posta Adresi
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-zinc-800 focus:border-[#00FFA3]/50 text-white font-bold text-sm rounded-xl px-4 py-3 outline-none transition-all"
                    placeholder="ornek@mail.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> Telefon Numarası
                  </label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-zinc-800 focus:border-[#00FFA3]/50 text-white font-bold text-sm rounded-xl px-4 py-3 outline-none transition-all"
                    placeholder="5XX XXX XX XX"
                  />
                </div>
              </div>
            </div>

            {/* Güvenlik (Şifre) */}
            <div className="space-y-4">
              <h4 className="text-zinc-400 text-xs font-black uppercase tracking-widest border-b border-white/5 pb-2">Güvenlik (Şifre Değiştir)</h4>
              <p className="text-zinc-600 text-xs font-medium italic mb-2">* Şifrenizi değiştirmek istemiyorsanız bu alanları boş bırakın.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Key className="w-3 h-3 text-red-400" /> Mevcut Şifre
                  </label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-zinc-800 focus:border-red-500/50 text-white font-bold text-sm rounded-xl px-4 py-3 outline-none transition-all"
                    placeholder="Mevcut şifreniz"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Key className="w-3 h-3 text-emerald-400" /> Yeni Şifre
                  </label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-zinc-800 focus:border-emerald-500/50 text-white font-bold text-sm rounded-xl px-4 py-3 outline-none transition-all"
                    placeholder="Yeni şifreniz (min 6 karakter)"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#00FFA3] hover:bg-[#00E690] text-black font-black py-3 px-8 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(0,255,163,0.3)] hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileDashboard;
