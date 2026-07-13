import React, { useState, useEffect } from 'react';
import { Users, Copy, CheckCircle2, DollarSign, ArrowRight, Share2, Shield } from 'lucide-react';
import { SiteUser } from '../types';
import { supabase } from '../utils/supabase';

interface ReferralViewProps {
  siteUser: SiteUser | null;
  onNavigate: (view: string) => void;
}

const ReferralView: React.FC<ReferralViewProps> = ({ siteUser, onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // We are using the username as the referral code for simplicity and uniqueness.
  const referralCode = siteUser?.username || '';
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  useEffect(() => {
    if (siteUser) {
      fetchReferrals();
    } else {
      setLoading(false);
    }
  }, [siteUser]);

  const fetchReferrals = async () => {
    if (!siteUser) return;
    try {
      const { data, error } = await supabase
        .from('referral_history')
        .select('*')
        .eq('referrer_username', siteUser.username)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setReferrals(data);
      }
    } catch (err) {
      console.error('Error fetching referrals:', err);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!siteUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] min-h-screen">
        <div className="text-center p-8 bg-zinc-900 rounded-2xl border border-zinc-800">
          <Users className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Giriş Yapın</h2>
          <p className="text-zinc-400 mb-6">Arkadaşlarınızı davet etmek için lütfen önce giriş yapın.</p>
        </div>
      </div>
    );
  }

  const totalBonus = referrals.reduce((acc, curr) => acc + (Number(curr.bonus_amount) || 0), 0);
  const completedCount = referrals.filter(r => r.deposit_status === 'completed').length;

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-[#0a0a0a] to-[#0a0a0a] border-b border-indigo-500/20 pt-10 pb-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
              <Shield className="w-4 h-4" /> Güvenli Referans Sistemi
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Arkadaşını Getir <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">%10 Nakit Kazan!</span>
            </h1>
            <p className="text-zinc-400 max-w-lg mx-auto md:mx-0 text-sm sm:text-base leading-relaxed">
              Kendi davet linkinle arkadaşlarını 724BAHİS'e üye yap. T.C. doğrulamalı her yeni arkadaşının yapacağı <strong className="text-white">ilk yatırımın tam %10'u</strong> anında hesabına nakit olarak eklensin!
            </p>
          </div>
          
          <div className="w-full md:w-auto bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-sm">
            <div className="mb-4">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Senin Özel Davet Linkin</label>
              <div className="flex items-center bg-black border border-zinc-800 rounded-lg p-1">
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink}
                  className="flex-1 bg-transparent border-none text-white text-sm px-3 py-2 outline-none font-mono"
                />
                <button 
                  onClick={handleCopy}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-md transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" /> LİNKİ PAYLAŞ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 mt-4">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Toplam Davet</p>
              <p className="text-2xl font-black text-white">{referrals.length}</p>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Yatırım Yapanlar</p>
              <p className="text-2xl font-black text-white">{completedCount}</p>
            </div>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-[#f0b90b]/10 rounded-xl flex items-center justify-center border border-[#f0b90b]/20">
              <DollarSign className="w-6 h-6 text-[#f0b90b]" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Kazanılan Nakit</p>
              <p className="text-2xl font-black text-[#f0b90b]">{totalBonus.toFixed(2)} ₺</p>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Davet Geçmişi</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-zinc-500">Yükleniyor...</div>
          ) : referrals.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400 font-medium mb-2">Henüz kimseyi davet etmediniz.</p>
              <p className="text-zinc-600 text-sm">Linkinizi paylaşarak arkadaşlarınızı davet etmeye başlayın.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/30 border-b border-zinc-800">
                    <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-widest">Tarih</th>
                    <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-widest">Arkadaşın</th>
                    <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-widest">Durum</th>
                    <th className="p-4 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">Kazanılan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm text-zinc-400">
                        {new Date(ref.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="p-4 text-sm font-bold text-white">
                        {ref.referred_username.substring(0, 3)}***
                      </td>
                      <td className="p-4">
                        {ref.deposit_status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Yatırım Yaptı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold border border-zinc-700">
                            <Clock className="w-3.5 h-3.5" /> Bekleniyor
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {ref.deposit_status === 'completed' ? (
                          <span className="text-[#f0b90b] font-black">{Number(ref.bonus_amount).toFixed(2)} ₺</span>
                        ) : (
                          <span className="text-zinc-600 font-medium">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Rules Box */}
        <div className="mt-8 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h4 className="text-white font-black uppercase mb-4 text-sm tracking-widest">Kurallar & Şartlar</h4>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 font-black">•</span>
              Yeni üyenin kaydolurken T.C. Kimlik numarasını doğru girmesi zorunludur. Aynı T.C. numarası ile mükerrer üyelik açılamaz.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 font-black">•</span>
              Bonus, davet edilen kişinin yapacağı <strong className="text-white">İLK YATIRIM</strong> işlemi onaylandığında otomatik olarak hesabınıza Nakit Bakiye olarak aktarılır.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 font-black">•</span>
              Bu kampanyadan kazanılacak ödülün çevrim şartı yoktur, doğrudan çekilebilir nakit bakiyedir.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 font-black">•</span>
              Suistimal veya çoklu hesap (multi-accounting) tespit edilen durumlarda bonuslar iptal edilir.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Assuming Clock was missed in imports, adding it just in case:
import { Clock } from 'lucide-react';

export default ReferralView;
