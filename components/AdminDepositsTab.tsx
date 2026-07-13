import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { CheckCircle2, XCircle, Clock, RefreshCw, Wallet, QrCode, Building2 } from 'lucide-react';

interface Deposit {
  id: string;
  username: string;
  method: 'bank' | 'crypto';
  amount: number;
  tx_hash: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDepositsTab() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setDeposits(data as Deposit[]);
    } catch (err) {
      console.error('Error fetching deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const deposit = deposits.find(d => d.id === id);
      if (!deposit) return;

      const { error } = await supabase
        .from('deposits')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Handle Referral Bonus on First Deposit
      if (newStatus === 'approved') {
        const { data: member } = await supabase.from('members').select('referred_by, balance').eq('username', deposit.username).single();
        if (member && member.referred_by) {
          // Check if it's their FIRST approved deposit (other than this one we just approved)
          const { data: otherDeposits } = await supabase
            .from('deposits')
            .select('id')
            .eq('username', deposit.username)
            .eq('status', 'approved')
            .neq('id', id);
          
          if (!otherDeposits || otherDeposits.length === 0) {
            // First deposit! Give 10% bonus
            const bonusAmount = Number(deposit.amount) * 0.10;
            
            // Insert history
            await supabase.from('referral_history').insert([{
              referrer_username: member.referred_by,
              referred_username: deposit.username,
              deposit_status: 'completed',
              bonus_amount: bonusAmount
            }]);

            // Add balance to referrer
            const { data: referrer } = await supabase.from('members').select('id, balance').eq('referral_code', member.referred_by).single();
            if (referrer) {
              await supabase.from('members').update({
                balance: (Number(referrer.balance) || 0) + bonusAmount
              }).eq('id', referrer.id);
            }
          }
        }
      }

      // Update local state
      setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (err) {
      console.error('Error updating deposit status:', err);
      alert('İşlem güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Wallet className="w-6 h-6 text-blue-500" />
            Finans ve Yatırımlar
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Kullanıcılardan gelen yatırım bildirimlerini yönetin.
          </p>
        </div>
        <button 
          onClick={fetchDeposits}
          className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
          title="Yenile"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-black/20 border border-zinc-800/50 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Tarih</th>
                <th className="p-4 font-bold">Kullanıcı Adı</th>
                <th className="p-4 font-bold">Yöntem</th>
                <th className="p-4 font-bold">Tutar</th>
                <th className="p-4 font-bold">İşlem Özeti / Ad-Soyad</th>
                <th className="p-4 font-bold">Durum</th>
                <th className="p-4 font-bold text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-zinc-800/50">
              {loading && deposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">Yükleniyor...</td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">Henüz bir yatırım bildirimi bulunmuyor.</td>
                </tr>
              ) : (
                deposits.map(deposit => (
                  <tr key={deposit.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 text-zinc-400 whitespace-nowrap">
                      {new Date(deposit.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {deposit.username}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-zinc-300 bg-zinc-800/50 px-2 py-1 rounded-lg inline-flex text-xs font-medium">
                        {deposit.method === 'bank' ? <Building2 className="w-3.5 h-3.5 text-blue-400" /> : <QrCode className="w-3.5 h-3.5 text-orange-400" />}
                        {deposit.method === 'bank' ? 'Havale/EFT' : 'Kripto'}
                      </div>
                    </td>
                    <td className="p-4 font-black text-emerald-400">
                      {deposit.amount} {deposit.method === 'bank' ? '₺' : 'USDT'}
                    </td>
                    <td className="p-4 text-zinc-300 font-mono text-xs">
                      {deposit.tx_hash}
                    </td>
                    <td className="p-4">
                      {deposit.status === 'pending' && (
                        <span className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg text-xs font-bold inline-flex">
                          <Clock className="w-3.5 h-3.5" /> Bekliyor
                        </span>
                      )}
                      {deposit.status === 'approved' && (
                        <span className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg text-xs font-bold inline-flex">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Onaylandı
                        </span>
                      )}
                      {deposit.status === 'rejected' && (
                        <span className="flex items-center gap-1.5 text-red-500 bg-red-500/10 px-2 py-1 rounded-lg text-xs font-bold inline-flex">
                          <XCircle className="w-3.5 h-3.5" /> Reddedildi
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {deposit.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(deposit.id, 'approved')}
                            className="p-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors title='Onayla'"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(deposit.id, 'rejected')}
                            className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors title='Reddet'"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
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
}
