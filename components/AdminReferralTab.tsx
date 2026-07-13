import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Clock, Trash2, ArrowRight } from 'lucide-react';
import { supabase } from '../utils/supabase';

const AdminReferralTab: React.FC = () => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('referral_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setReferrals(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    try {
      await supabase.from('referral_history').delete().eq('id', id);
      fetchReferrals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Users className="w-6 h-6 text-indigo-400" />
          Davet Geçmişi (Referanslar)
        </h2>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Davet Eden (Referrer)</th>
                <th className="px-4 py-3">Davet Edilen (Referred)</th>
                <th className="px-4 py-3">Yatırım Durumu</th>
                <th className="px-4 py-3">Bonus (%10)</th>
                <th className="px-4 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Yükleniyor...</td></tr>
              ) : referrals.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Henüz kayıt yok.</td></tr>
              ) : (
                referrals.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-800/50">
                    <td className="px-4 py-3 text-sm text-zinc-400">
                      {new Date(r.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {r.referrer_username}
                    </td>
                    <td className="px-4 py-3 font-bold text-indigo-400 flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-zinc-500" />
                      {r.referred_username}
                    </td>
                    <td className="px-4 py-3">
                      {r.deposit_status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-emerald-500 bg-emerald-500/10 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Yatırım Yaptı
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-zinc-400 bg-zinc-800 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" /> Bekleniyor
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.deposit_status === 'completed' ? (
                        <span className="text-[#f0b90b] font-black">{r.bonus_amount} TL</span>
                      ) : (
                        <span className="text-zinc-600 font-medium">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(r.id)} className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReferralTab;
