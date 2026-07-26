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
    { title: 'Gece Bonusu (Çevrimsiz)', desc: 'Saat 02:00-05:00 arası yatırımlarınız freespinlerle ödüllendiriliyor.', icon: <Clock className="w-8 h-8 text-indigo-400" /> },
    { title: 'Hoş Geldin Bonusu (Çevrimsiz)', desc: '724BETS\'te yeniyseniz 100 Freespin ve 5.000 TL ekstra çekim hakkınız var.', icon: <PartyPopper className="w-8 h-8 text-yellow-400" /> },
    { title: 'İlk Çekime 2 Katı Ödeme (Çevrimsiz)', desc: 'İlk çekiminizi yaparken kazancınızın 2 katını gönderiyoruz.', icon: <Wallet className="w-8 h-8 text-emerald-400" /> },
    { title: 'Günlük Prim (Çevrimsiz)', desc: 'Aktifliğinize göre hesabınızda her gün nakit bonuslar yatıyor.', icon: <Gift className="w-8 h-8 text-pink-400" /> },
    { title: 'Haftalık Jest Bonusu (Çevrimsiz)', desc: 'Tüm haftaki performansınız her cumartesi ödüllendiriliyor.', icon: <Calendar className="w-8 h-8 text-blue-400" /> },
    { title: 'Seviye Atlama Bonusu (Çevrimsiz)', desc: 'VIP seviyeniz yükseldikçe daha fazla ödül ve ayrıcalık sizi bekliyor.', icon: <TrendingUp className="w-8 h-8 text-green-400" /> },
    { title: 'Günlük Kayıp Bonusu (Çevrimsiz)', desc: 'Şanssız geçen her gün yeni bir başlangıça dönüşüyor.', icon: <RefreshCw className="w-8 h-8 text-red-400" /> },
    { title: 'Doğum Günü Bonusu (Çevrimsiz)', desc: 'Profil seviyenize özel nakit bonus hesabınıza otomatik ekleniyor.', icon: <Cake className="w-8 h-8 text-purple-400" /> },
    { title: 'Aylık Kayıp Bonusu (Çevrimsiz)', desc: '724BETS\'te her kayıp miktarı yeni bir geriye dönüş fırsatı.', icon: <RefreshCw className="w-8 h-8 text-orange-400" /> },
  ];

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
    <>
      {!isEmbedded && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#06b6d4]/5 blur-[120px] pointer-events-none rounded-full" />
      )}
      
      <div className={`max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10 ${isEmbedded ? 'pt-0 pb-0' : 'pt-6 sm:pt-12'}`}>
        <div className={`flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 ${isEmbedded ? 'mb-6 sm:mb-8' : 'mb-8 sm:mb-12'}`}>
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#111317] rounded-2xl flex items-center justify-center border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] group relative">
            <div className={`absolute inset-0 bg-gradient-to-tr ${isEmbedded ? 'from-emerald-500/20' : 'from-[#06b6d4]/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
            <Ticket className={`w-8 h-8 sm:w-12 sm:h-12 ${isEmbedded ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'text-[#06b6d4] drop-shadow-[0_0_15px_rgba(0,255,163,0.5)]'} transform group-hover:scale-110 transition-transform duration-500`} />
          </div>
          <h1 className={`font-black text-white uppercase tracking-tight drop-shadow-xl mt-4 ${isEmbedded ? 'text-3xl sm:text-4xl' : 'text-3xl sm:text-5xl'}`}>
            Kodu <span className={isEmbedded ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'text-[#06b6d4] drop-shadow-[0_0_20px_rgba(0,255,163,0.4)]'}>Kullan</span>
          </h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base px-2 font-medium">
            Elindeki promosyon kodunu aşağıya gir ve anında bedava bakiye veya free spin kazan!
          </p>
        </div>

        <div className="max-w-md mx-auto bg-[#111317] border border-white/5 p-6 sm:p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group/form">
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${isEmbedded ? 'via-emerald-500/30 group-hover/form:via-emerald-500/80' : 'via-[#06b6d4]/30 group-hover/form:via-[#06b6d4]/80'} to-transparent transition-all duration-700`}></div>
          
          <div className="space-y-5 sm:space-y-6 relative z-10">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Promosyon Kodu</label>
              <div className="relative group">
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ÖRN: BONUS2026"
                    className={`w-full bg-[#0A0C10] border-2 border-white/5 ${isEmbedded ? 'focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'focus:border-[#06b6d4]/50 focus:shadow-[0_0_20px_rgba(0,255,163,0.15)]'} rounded-2xl py-3.5 sm:py-4 px-4 text-white text-base sm:text-lg font-black tracking-[0.2em] text-center transition-all outline-none placeholder:text-zinc-700`}
                  />
                  <div className={`absolute inset-0 rounded-2xl ${isEmbedded ? 'bg-emerald-500/5' : 'bg-[#06b6d4]/5'} opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300`}></div>
              </div>
            </div>

            <button 
              onClick={handleCheckCode}
              disabled={loading || !code.trim()}
              className={`w-full ${isEmbedded ? 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]' : 'bg-[#06b6d4] hover:bg-[#00E693] shadow-[0_0_20px_rgba(0,255,163,0.2)] hover:shadow-[0_0_30px_rgba(0,255,163,0.5)]'} text-black font-black py-3.5 sm:py-4 rounded-2xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm sm:text-base`}
            >
              {loading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : 'KODU KONTROL ET'}
            </button>
          </div>

          {result && (
            <div className={`mt-6 p-5 rounded-2xl border ${result.success ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'} flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-300 relative z-10`}>
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
        
        <div className={`max-w-6xl mx-auto ${isEmbedded ? 'mt-8 sm:mt-10 pb-4' : 'mt-12 sm:mt-16 pb-12'}`}>
          <div className="flex items-center gap-2 mb-8">
            <button 
              onClick={() => setActiveTab('casino')}
              className={`px-8 py-2.5 rounded-full font-bold transition-all ${activeTab === 'casino' ? (isEmbedded ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#4361EE] text-white shadow-lg') : 'bg-[#2A2E3D] text-gray-400 hover:text-white hover:bg-[#3A3E4D]'}`}
            >
              Casino
            </button>
            <button 
              onClick={() => setActiveTab('spor')}
              className={`px-8 py-2.5 rounded-full font-bold transition-all ${activeTab === 'spor' ? (isEmbedded ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#4361EE] text-white shadow-lg') : 'bg-[#2A2E3D] text-gray-400 hover:text-white hover:bg-[#3A3E4D]'}`}
            >
              Spor
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {promos.map((promo, idx) => (
              <div key={idx} className="relative group cursor-pointer rounded-[2rem] overflow-hidden bg-[#0A0D14] border border-white/5 flex flex-col items-center p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-white/10 aspect-square sm:aspect-[4/5]">
                
                {/* Ambient Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent z-0 pointer-events-none"></div>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150px] rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none ${isEmbedded ? 'bg-emerald-500' : 'bg-[#06b6d4]'}`}></div>
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0"></div>

                {/* Icon Container */}
                <div className="relative z-10 mt-2 sm:mt-6 mb-auto group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] bg-gradient-to-br from-[#1A1F27] to-[#111317] border border-white/5 flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr ${isEmbedded ? 'from-emerald-500/10' : 'from-[#06b6d4]/10'} to-transparent`}></div>
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                      {React.cloneElement(promo.icon as React.ReactElement, { className: 'w-10 h-10 sm:w-12 sm:h-12' })}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="relative z-10 w-full text-center flex flex-col gap-3 mt-8 transform group-hover:-translate-y-4 transition-transform duration-500">
                  <h3 className={`font-black text-lg sm:text-xl leading-tight transition-colors ${isEmbedded ? 'text-white group-hover:text-emerald-400' : 'text-white group-hover:text-[#06b6d4]'}`}>
                    {promo.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                    {promo.desc}
                  </p>
                </div>

                {/* CTA Button overlay (appears on hover) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                   <button className={`w-full py-3.5 rounded-xl font-black text-sm transition-all hover:scale-[1.02] active:scale-95 ${isEmbedded ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-[#06b6d4] text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]'}`}>
                     Fırsatı İncele
                   </button>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
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
