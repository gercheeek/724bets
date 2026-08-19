import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, RefreshCw, Wallet, Building2, AlertCircle } from 'lucide-react';

interface Deposit {
  id: string;
  userId: string;
  user?: { username: string };
  method: string;
  amount: number;
  txHash: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminDepositsTab() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDeposits = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://api.724bahis.net/api/admin/payments/pending?type=deposit');
      const data = await res.json();
      if (data.success) {
        setDeposits(data.pending);
      } else {
        setError(data.error || 'API Hatası');
      }
    } catch (err) {
      console.error('Error fetching deposits:', err);
      setError('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const endpoint = newStatus === 'approved' 
        ? 'https://api.724bahis.net/api/admin/payments/approve' 
        : 'https://api.724bahis.net/api/admin/payments/reject';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminNote: '' })
      });
      const data = await res.json();
      
      if (data.success) {
        // Remove from pending list
        setDeposits(prev => prev.filter(d => d.id !== id));
      } else {
        alert(data.error || 'İşlem güncellenirken hata oluştu.');
      }
    } catch (err) {
      console.error('Error updating deposit status:', err);
      alert('İşlem güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Wallet className="w-6 h-6 text-[#10b981]" />
            Para Yatırma (Deposit) Talepleri
          </h2>
          <p className="text-zinc-400 mt-1">Kullanıcılardan gelen bekleyen yatırım talepleri (Prisma API)</p>
        </div>
        <button 
          onClick={fetchDeposits}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-[#15171e] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Tarih</th>
                <th className="p-4 font-semibold">Kullanıcı</th>
                <th className="p-4 font-semibold">Yöntem</th>
                <th className="p-4 font-semibold">İşlem / Cüzdan No</th>
                <th className="p-4 font-semibold">Tutar</th>
                <th className="p-4 font-semibold text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Yükleniyor...</td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 flex flex-col items-center">
                    <Wallet className="w-12 h-12 text-gray-700 mb-3" />
                    Bekleyen yatırım talebi bulunmuyor.
                  </td>
                </tr>
              ) : (
                deposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(deposit.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      {deposit.user?.username || deposit.userId}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        <span className="capitalize">{deposit.method}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-400">
                      {deposit.txHash || '-'}
                    </td>
                    <td className="p-4 font-black text-[#10b981]">
                      {deposit.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(deposit.id, 'approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981] hover:text-white rounded-lg font-medium transition-all text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Onayla
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(deposit.id, 'rejected')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-all text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          Reddet
                        </button>
                      </div>
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
