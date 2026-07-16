import React, { useState } from 'react';
import { Ticket, Gift, CheckCircle2, XCircle, Loader2, Zap, Lock, Trophy } from 'lucide-react';
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
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0B0E14] to-[#151821] min-h-screen relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-[#10B981]/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-6 sm:pt-12 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#111317] rounded-2xl flex items-center justify-center border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] group relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
            <Ticket className="w-8 h-8 sm:w-12 sm:h-12 text-[#10B981] drop-shadow-[0_0_15px_rgba(0,255,163,0.5)] transform group-hover:scale-110 transition-transform duration-500" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight drop-shadow-xl mt-4">Kodu <span className="text-[#10B981] drop-shadow-[0_0_20px_rgba(0,255,163,0.4)]">Kullan</span></h1>
          <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base px-2 font-medium">
            Elindeki promosyon kodunu aşağıya gir ve anında bedava bakiye veya free spin kazan!
          </p>
        </div>

        <div className="max-w-md mx-auto bg-[#111317] border border-white/5 p-6 sm:p-8 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group/form">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent group-hover/form:via-[#10B981]/80 transition-all duration-700"></div>
          
          <div className="space-y-5 sm:space-y-6 relative z-10">
            <div>
              <label className="block text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 ml-1">Promosyon Kodu</label>
              <div className="relative group">
                  <input 
                    type="text" 
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ÖRN: BONUS2026"
                    className="w-full bg-[#0A0C10] border-2 border-white/5 focus:border-[#10B981]/50 focus:shadow-[0_0_20px_rgba(0,255,163,0.15)] rounded-2xl py-3.5 sm:py-4 px-4 text-white text-base sm:text-lg font-black tracking-[0.2em] text-center transition-all outline-none placeholder:text-zinc-700"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-[#10B981]/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
              </div>
            </div>

            <button 
              onClick={handleCheckCode}
              disabled={loading || !code.trim()}
              className="w-full bg-[#10B981] hover:bg-[#00E693] text-black font-black py-3.5 sm:py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,163,0.2)] hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm sm:text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : 'KODU KONTROL ET'}
            </button>
          </div>

          {/* Result Modal / Area */}
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
        
        {/* Decorative elements */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pb-8 sm:pb-0">
          <div className="relative overflow-hidden bg-[#151821] p-5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,255,163,0.15)] transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center justify-center text-center">
            <Zap strokeWidth={1.5} className="absolute -right-4 -bottom-4 w-28 h-28 text-[#10B981]/5 group-hover:text-[#10B981]/10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12" />
            <h4 className="text-[#10B981] font-black text-[12px] sm:text-[13px] uppercase mb-1.5 group-hover:text-white transition-colors relative z-10">Anında Aktarım</h4>
            <p className="text-zinc-400 text-[11px] sm:text-[12px] leading-relaxed relative z-10">Kodlar anında onaylanır ve bakiyeniz saniyeler içinde güncellenir.</p>
          </div>
          <div className="relative overflow-hidden bg-[#151821] p-5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,255,163,0.15)] transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center justify-center text-center">
            <Lock strokeWidth={1.5} className="absolute -right-4 -bottom-4 w-28 h-28 text-[#10B981]/5 group-hover:text-[#10B981]/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
            <h4 className="text-[#10B981] font-black text-[12px] sm:text-[13px] uppercase mb-1.5 group-hover:text-white transition-colors relative z-10">Limitli Kodlar</h4>
            <p className="text-zinc-400 text-[11px] sm:text-[12px] leading-relaxed relative z-10">Hızlı davranın, özel kodlar kısa sürede tükenebilir.</p>
          </div>
          <div className="relative overflow-hidden bg-[#151821] p-5 rounded-2xl border border-white/5 hover:border-[#10B981]/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(0,255,163,0.15)] transition-all duration-300 hover:-translate-y-1 group flex flex-col items-center justify-center text-center sm:flex">
            <Trophy strokeWidth={1.5} className="absolute -right-4 -bottom-4 w-28 h-28 text-[#10B981]/5 group-hover:text-[#10B981]/10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6" />
            <h4 className="text-[#10B981] font-black text-[12px] sm:text-[13px] uppercase mb-1.5 group-hover:text-white transition-colors relative z-10">Büyük Ödüller</h4>
            <p className="text-zinc-400 text-[11px] sm:text-[12px] leading-relaxed relative z-10">Sosyal medya hesaplarımızdan paylaşılan sürpriz kodları kaçırmayın.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromoCodeView;
