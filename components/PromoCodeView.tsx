import React, { useState } from 'react';
import { Ticket, Gift, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { SiteUser } from '../types';
import { supabase } from '../utils/supabase';

interface PromoCodeViewProps {
  siteUser: SiteUser | null;
  onNavigate: (view: string) => void;
}

const PromoCodeView: React.FC<PromoCodeViewProps> = ({ siteUser, onNavigate }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; rewardAmount?: number; rewardType?: string } | null>(null);

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
      // 1. Fetch promo code
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

      // 2. Check limits and expiry
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

      // 3. Check if user already used
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

      // 4. Record usage
      const { error: usageError } = await supabase.from('promo_code_usages').insert([{
        code_id: promo.id,
        username: siteUser.username
      }]);

      if (usageError) throw usageError;

      // 5. Update promo code counter
      await supabase.from('promo_codes').update({
        current_uses: promo.current_uses + 1
      }).eq('id', promo.id);

      // 6. Give reward (Simulated updating balance if reward type is balance)
      if (promo.reward_type === 'balance') {
        // Normally this would be a secure backend function, doing it on client for demo
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

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-12">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#f0b90b]/20 to-[#f0b90b]/5 rounded-full flex items-center justify-center border border-[#f0b90b]/30 mb-2 shadow-[0_0_30px_rgba(240,185,11,0.15)]">
            <Ticket className="w-10 h-10 text-[#f0b90b]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Kodu <span className="text-[#f0b90b]">Kullan</span></h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">
            Elindeki promosyon kodunu aşağıya gir ve anında bedava bakiye veya free spin kazan!
          </p>
        </div>

        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#f0b90b]/0 via-[#f0b90b] to-[#f0b90b]/0"></div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Promosyon Kodu</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ÖRN: BONUS2026"
                  className="w-full bg-black border-2 border-zinc-800 focus:border-[#f0b90b] rounded-xl py-4 px-5 text-white text-lg font-bold tracking-widest text-center transition-colors outline-none placeholder:text-zinc-700"
                />
              </div>
            </div>

            <button 
              onClick={handleCheckCode}
              disabled={loading || !code.trim()}
              className="w-full bg-gradient-to-r from-[#f0b90b] to-[#e5a900] hover:from-[#fada55] hover:to-[#f0b90b] text-black font-black py-4 rounded-xl transition-all shadow-lg shadow-[#f0b90b]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'KODU KONTROL ET'}
            </button>
          </div>

          {/* Result Modal / Area */}
          {result && (
            <div className={`mt-6 p-5 rounded-xl border ${result.success ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'} flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {result.success ? (
                <>
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
                    <Gift className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-emerald-500 font-black text-lg mb-1">{result.message}</h3>
                  <p className="text-zinc-400 text-xs">Ödül anında hesabınıza yansıtıldı. İyi oyunlar dileriz!</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-3">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-red-500 font-bold">{result.message}</h3>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <h4 className="text-[#f0b90b] font-bold text-sm uppercase mb-1">Anında Aktarım</h4>
            <p className="text-zinc-500 text-xs">Kodlar anında onaylanır ve bakiyeniz saniyeler içinde güncellenir.</p>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <h4 className="text-[#f0b90b] font-bold text-sm uppercase mb-1">Limitli Kodlar</h4>
            <p className="text-zinc-500 text-xs">Hızlı davranın, özel kodlar kısa sürede tükenebilir.</p>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-center">
            <h4 className="text-[#f0b90b] font-bold text-sm uppercase mb-1">Büyük Ödüller</h4>
            <p className="text-zinc-500 text-xs">Sosyal medya hesaplarımızdan paylaşılan sürpriz kodları kaçırmayın.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromoCodeView;
