import React, { useState } from 'react';
import { Ticket, Gift, XCircle, Loader2, Clock, PartyPopper, Wallet, TrendingUp, Calendar, RefreshCw, Cake } from 'lucide-react';
import { SiteUser } from '../types';
import { supabase } from '../utils/supabase';

interface PromoCodeViewProps {
  siteUser: SiteUser | null;
  onNavigate?: (view: string) => void;
  isEmbedded?: boolean;
}

const PromoCodeView: React.FC<PromoCodeViewProps> = ({ siteUser, onNavigate, isEmbedded }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; rewardAmount?: number; rewardType?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'casino' | 'spor'>('casino');

  const promos = [
    { title: 'Gece Bonusu (Çevrimsiz)', desc: 'Saat 02:00-05:00 arası yatırımlarınız freespinlerle ödüllendiriliyor.', icon: <Clock className="w-6 h-6 text-indigo-400" />, image: '/images/promos/promo_night.jpg' },
    { title: 'Hoş Geldin Bonusu (Çevrimsiz)', desc: '724BETS\'te yeniyseniz 100 Freespin ve 5.000 TL ekstra çekim hakkınız var.', icon: <PartyPopper className="w-6 h-6 text-yellow-400" />, image: '/images/promos/promo_welcome.jpg' },
    { title: 'İlk Çekime 2 Katı Ödeme (Çevrimsiz)', desc: 'İlk çekiminizi yaparken kazancınızın 2 katını gönderiyoruz.', icon: <Wallet className="w-6 h-6 text-emerald-400" />, image: '/images/promos/promo_2x.jpg' },
    { title: 'Günlük Prim (Çevrimsiz)', desc: 'Aktifliğinize göre hesabınızda her gün nakit bonuslar yatıyor.', icon: <Gift className="w-6 h-6 text-pink-400" />, image: '/images/promos/promo_gift.jpg' },
    { title: 'Haftalık Jest Bonusu (Çevrimsiz)', desc: 'Tüm haftaki performansınız her cumartesi ödüllendiriliyor.', icon: <Calendar className="w-6 h-6 text-blue-400" />, image: '/images/promos/promo_gift.jpg' },
    { title: 'Seviye Atlama Bonusu (Çevrimsiz)', desc: 'VIP seviyeniz yükseldikçe daha fazla ödül ve ayrıcalık sizi bekliyor.', icon: <TrendingUp className="w-6 h-6 text-green-400" />, image: '/images/promos/promo_levelup.jpg' },
    { title: 'Günlük Kayıp Bonusu (Çevrimsiz)', desc: 'Şanssız geçen her gün yeni bir başlangıça dönüşüyor.', icon: <RefreshCw className="w-6 h-6 text-red-400" />, image: '/images/promos/promo_cashback.jpg' },
    { title: 'Doğum Günü Bonusu (Çevrimsiz)', desc: 'Profil seviyenize özel nakit bonus hesabınıza otomatik ekleniyor.', icon: <Cake className="w-6 h-6 text-purple-400" />, image: '/images/promos/promo_birthday.jpg' },
    { title: 'Aylık Kayıp Bonusu (Çevrimsiz)', desc: '724BETS\'te her kayıp miktarı yeni bir geriye dönüş fırsatı.', icon: <RefreshCw className="w-6 h-6 text-orange-400" />, image: '/images/promos/promo_cashback.jpg' },
  ];

  const sporPromos = [
    { title: 'Spor Hoş Geldin Bonusu', desc: 'Spor bahislerine özel 5.000 TL\'ye varan ekstra bakiye ve freebet.', icon: <PartyPopper className="w-6 h-6 text-blue-400" />, image: '/images/promos/promo_sports_welcome.jpg' },
    { title: 'Kombine Çarpan Bonusu', desc: 'Kombine kuponlarınıza %50\'ye varan ekstra nakit kazanç şansı.', icon: <TrendingUp className="w-6 h-6 text-green-400" />, image: '/images/promos/promo_sports_combo.jpg' },
    { title: 'Spor Kayıp Bonusu', desc: 'Sporda şansınız yaver gitmediyse kayıplarınızın anında iadesi.', icon: <RefreshCw className="w-6 h-6 text-red-400" />, image: '/images/promos/promo_sports_cashback.jpg' },
  ];

  const activePromos = activeTab === 'casino' ? promos : sporPromos;

  const handleCheckCode = async () => {
    if (!siteUser) {
      setResult({ success: false, message: 'Lütfen önce giriş yapın.' });
      return;
    }
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);
    const upperCode = code.trim().toUpperCase();

    try {
      const { data: promo, error: promoError } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', upperCode)
        .single();

      if (promoError || !promo) {
        setResult({ success: false, message: 'Geçersiz promosyon kodu.' });
        setLoading(false);
        return;
      }

      if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
        setResult({ success: false, message: 'Bu kodun süresi dolmuş.' });
        setLoading(false);
        return;
      }
      if (promo.max_uses && promo.current_uses >= promo.max_uses) {
        setResult({ success: false, message: 'Bu kodun kullanım limiti dolmuş.' });
        setLoading(false);
        return;
      }

      const { data: usage } = await supabase
        .from('promo_code_usages')
        .select('*')
        .eq('code_id', promo.id)
        .eq('username', siteUser.username);

      if (usage && usage.length > 0) {
        setResult({ success: false, message: 'Bu kodu zaten kullandınız.' });
        setLoading(false);
        return;
      }

      const { error: usageError } = await supabase.from('promo_code_usages').insert([{
        code_id: promo.id,
        username: siteUser.username
      }]);

      if (usageError) throw usageError;

      await supabase.from('promo_codes').update({
        current_uses: promo.current_uses + 1
      }).eq('id', promo.id);

      if (promo.reward_type === 'balance') {
        const { data: member } = await supabase.from('members').select('balance').eq('id', siteUser.id).single();
        if (member) {
          await supabase.from('members').update({
            balance: (Number(member.balance) || 0) + Number(promo.reward_amount)
          }).eq('id', siteUser.id);
        }
      }

      setResult({ 
        success: true, 
        message: `Tebrikler! ${promo.reward_amount} ${promo.reward_type === 'balance' ? 'TL Bakiye' : 'Free Spin'} Hesabınıza Tanımlandı!`,
        rewardAmount: promo.reward_amount,
        rewardType: promo.reward_type
      });

    } catch (err: any) {
      console.error(err);
      setResult({ success: false, message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' });
    }

    setLoading(false);
  };

  const content = (
    <div className="relative">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float-custom {
          animation: float 5s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
      
      {!isEmbedded && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#00E5FF]/10 blur-[120px] pointer-events-none rounded-full" />
      )}
      
      <div className={`mx-auto relative z-10 ${isEmbedded ? 'w-full max-w-6xl' : 'max-w-5xl p-4 sm:p-6 lg:p-8 pt-6 sm:pt-12'}`}>
        
        {/* HERO SECTION */}
        {isEmbedded ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 w-full bg-[#0A0D14]/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-3 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/10 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-4 pl-4 z-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00E5FF] to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                <Ticket className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">KODU KULLAN</h2>
                <p className="text-xs text-zinc-400 font-medium">Anında bakiye veya free spin</p>
              </div>
            </div>

            <div className="flex-1 w-full md:max-w-md relative z-10">
              <div className="relative flex items-center w-full bg-[#05060A]/90 rounded-full border border-white/10 p-1.5 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all">
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Kodu Buraya Girin..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-white font-bold tracking-widest uppercase placeholder:text-zinc-600 text-sm"
                />
                <button 
                  onClick={handleCheckCode}
                  disabled={loading || !code.trim()}
                  className="h-10 px-6 rounded-full bg-[#00E5FF] text-black font-black text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-[0_0_10px_rgba(0,229,255,0.3)]"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ONAYLA'}
                </button>
              </div>
              
              {result && (
                <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-xl text-center text-xs font-bold backdrop-blur-md border ${result.success ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                  {result.message}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-b from-[#111317] to-[#0A0D14] rounded-3xl flex items-center justify-center border border-[#00E5FF]/20 shadow-[0_0_50px_rgba(0,229,255,0.2),inset_0_0_30px_rgba(0,229,255,0.1)] group relative overflow-hidden animate-float-custom">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
                <Ticket className="w-10 h-10 sm:w-14 sm:h-14 text-[#00E5FF] drop-shadow-[0_0_20px_rgba(0,229,255,0.8)] transform group-hover:scale-110 transition-transform duration-700 relative z-10" />
                <div className="absolute inset-1 border border-[#00E5FF]/10 rounded-[1.3rem] pointer-events-none"></div>
              </div>
              <h1 className="font-black text-white uppercase tracking-tight drop-shadow-xl mt-6 text-5xl sm:text-7xl">
                Kodu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-white drop-shadow-[0_0_30px_rgba(0,229,255,0.6)] relative inline-block group-hover:scale-105 transition-transform duration-500">Kullan</span>
              </h1>
              <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base px-2 font-medium leading-relaxed">
                Sana özel promosyon kodunu aşağıya gir, <span className="text-[#00E5FF]">anında</span> bedava bakiye veya free spin şansını yakala!
              </p>
            </div>

            <div className="max-w-lg mx-auto relative group/form">
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-[#00E5FF]/0 via-[#00E5FF]/50 to-[#00E5FF]/0 opacity-30 group-hover/form:opacity-100 blur-lg transition-all duration-1000 animate-spin-slow"></div>
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-b from-[#00E5FF]/0 via-[#00E5FF]/30 to-[#00E5FF]/0 opacity-30 group-hover/form:opacity-100 blur-md transition-all duration-1000 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>

              <div className="bg-[#0A0D14]/90 backdrop-blur-3xl border border-white/10 p-6 sm:p-10 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(0,229,255,0.05)] relative overflow-hidden z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF]/50 group-hover/form:via-[#00E5FF] to-transparent transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <div className="space-y-6 sm:space-y-8 relative z-10">
                  <div>
                    <label className="block text-[11px] sm:text-xs font-black text-[#00E5FF]/70 uppercase tracking-[0.3em] mb-3 ml-1 text-center">Promosyon Kodu</label>
                    <div className="relative group">
                        <input 
                          type="text" 
                          value={code}
                          onChange={(e) => setCode(e.target.value.toUpperCase())}
                          placeholder="ÖRN: BONUS2026"
                          className="w-full bg-[#111317]/80 backdrop-blur-md border-2 border-white/5 focus:border-[#00E5FF]/60 focus:shadow-[0_0_25px_rgba(0,229,255,0.2),inset_0_0_10px_rgba(0,229,255,0.1)] rounded-2xl py-3.5 sm:py-4 px-4 text-white text-base sm:text-lg font-black tracking-[0.2em] text-center transition-all outline-none placeholder:text-zinc-700 uppercase"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-[#00E5FF]/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckCode}
                    disabled={loading || !code.trim()}
                    className="w-full bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] text-[#0A0D14] font-black py-3.5 sm:py-4 rounded-2xl transition-all hover:brightness-110 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.7)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 text-sm sm:text-base relative overflow-hidden group/btn active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-[shine-sweep_2s_ease-in-out_infinite]" />
                    <span className="relative z-10 flex items-center gap-2">
                      {loading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : 'KODU KONTROL ET'}
                    </span>
                  </button>
                </div>

                {result && (
                  <div className={`mt-6 p-5 rounded-2xl border ${result.success ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30' : 'bg-red-500/10 border-red-500/30'} flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10`}>
                    {result.success ? (
                      <>
                        <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                          <Gift className="w-7 h-7 text-emerald-400" />
                        </div>
                        <h3 className="text-emerald-400 font-black text-lg mb-1">{result.message}</h3>
                        <p className="text-zinc-400 text-xs">Ödül anında hesabınıza yansıtıldı. İyi oyunlar dileriz!</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                          <XCircle className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-red-400 font-bold">{result.message}</h3>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* PROMOSYON KARTLARI (TABS + GRID) */}
        <div className={`mx-auto ${isEmbedded ? 'w-full mt-6 mb-2' : 'max-w-6xl mt-12 sm:mt-16 pb-12'}`}>
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <button 
              onClick={() => setActiveTab('casino')}
              className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-bold transition-all text-sm sm:text-base ${activeTab === 'casino' ? 'bg-[#00E5FF] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'bg-[#2A2E3D] text-gray-400 hover:text-white hover:bg-[#3A3E4D]'}`}
            >
              Casino
            </button>
            <button 
              onClick={() => setActiveTab('spor')}
              className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded-full font-bold transition-all text-sm sm:text-base ${activeTab === 'spor' ? 'bg-[#00E5FF] text-black shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'bg-[#2A2E3D] text-gray-400 hover:text-white hover:bg-[#3A3E4D]'}`}
            >
              Spor
            </button>
          </div>

          <div className={`grid ${isEmbedded ? 'grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'}`}>
            {activePromos.map((promo, idx) => (
              <div key={idx} className={`relative group cursor-pointer overflow-hidden rounded-[1.2rem] bg-[#11131A]/60 border border-white/5 hover:border-[#00E5FF]/30 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${isEmbedded ? 'h-32 sm:h-40 flex flex-row' : 'aspect-square sm:aspect-[4/5] flex-col'}`}>
                
                {/* Image Section - Left side for embedded, Top for standalone */}
                <div className={`relative overflow-hidden ${isEmbedded ? 'w-2/5 sm:w-1/3 h-full flex-shrink-0' : 'w-full h-[60%] sm:h-[65%]'}`}>
                  <img src={promo.image} alt={promo.title} className="w-full h-full object-cover object-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-gradient-to-${isEmbedded ? 'r' : 't'} from-[#11131A]/90 to-transparent z-10`}></div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
                </div>

                {/* Content Section */}
                <div className={`relative z-20 flex flex-col justify-center ${isEmbedded ? 'p-3 sm:p-4 flex-1' : 'p-6 sm:p-8 h-full justify-end'}`}>
                  {/* Icon Badge - Only show in standalone */}
                  {!isEmbedded && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="w-10 h-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl group-hover:bg-[#00E5FF]/20 group-hover:border-[#00E5FF]/50 transition-all duration-300">
                        {promo.icon}
                      </div>
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="flex flex-col gap-1 sm:gap-1.5 w-full">
                    <h3 className={`font-black leading-tight text-white group-hover:text-[#00E5FF] transition-colors ${isEmbedded ? 'text-xs sm:text-sm line-clamp-2' : 'text-lg sm:text-xl'}`}>
                      {promo.title.replace(' (Çevrimsiz)', '')}
                    </h3>
                    <p className={`text-zinc-500 font-medium ${isEmbedded ? 'text-[10px] sm:text-[11px] line-clamp-2' : 'text-sm line-clamp-3'}`}>
                      {promo.desc}
                    </p>
                  </div>
                  
                  {isEmbedded && (
                     <div className="mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                       <span className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider flex items-center gap-1">İncele &rarr;</span>
                     </div>
                  )}

                  {/* Standalone CTA */}
                  {!isEmbedded && (
                    <div className="absolute bottom-4 left-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                       <button className="w-full rounded-xl font-black transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] text-black shadow-[0_0_20px_rgba(0,229,255,0.5)] relative overflow-hidden group/cardbtn py-3.5 text-sm">
                         <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/cardbtn:animate-[shine-sweep_1.5s_ease-in-out_infinite]" />
                         <span className="relative z-10">İncele</span>
                       </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return <div className="w-full relative">{content}</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#050505] to-[#151821] min-h-screen relative">
      {content}
    </div>
  );
};

export default PromoCodeView;
