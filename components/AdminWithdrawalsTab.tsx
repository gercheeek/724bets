import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle2, XCircle, RefreshCw, AlertCircle, Clock } from 'lucide-react';

interface WithdrawalRequest {
  id: string;
  userId: string;
  user?: { username: string };
  method: string;
  amount: number;
  txHash: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminWithdrawalsTab() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWithdrawals = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/admin/payments/pending?type=withdraw');
      const data = await res.json();
      if (data.success) {
        setRequests(data.pending);
      } else {
        setError(data.error || 'API Hatası');
      }
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      setError('Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const endpoint = action === 'approve' 
        ? '/api/admin/payments/approve' 
        : '/api/admin/payments/reject';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminNote: '' })
      });
      const data = await res.json();
      
      if (data.success) {
        setRequests(prev => prev.filter(req => req.id !== id));
      } else {
        alert(data.error || 'İşlem güncellenirken hata oluştu.');
      }
    } catch (err) {
      console.error('Error updating withdrawal status:', err);
      alert('İşlem güncellenirken bir hata oluştu.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Wallet className="w-6 h-6 text-indigo-400" />
            Para Çekme (Withdraw) Talepleri
          </h2>
          <p className="text-zinc-400 mt-1">Kullanıcılardan gelen bekleyen çekim talepleri (Prisma API)</p>
        </div>
        <button 
          onClick={fetchWithdrawals}
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
                <th className="p-4 font-semibold">Cüzdan / IBAN</th>
                <th className="p-4 font-semibold">Tutar</th>
                <th className="p-4 font-semibold text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">Yükleniyor...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 flex flex-col items-center">
                    <Wallet className="w-12 h-12 text-gray-700 mb-3" />
                    Bekleyen çekim talebi bulunmuyor.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(req.createdAt).toLocaleString('tr-TR')}
                    </td>
                    <td className="p-4 font-medium text-white">
                      {req.user?.username || req.userId}
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-[#00E5FF] font-medium">{req.method}</span>
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-400">
                      {req.txHash}
                    </td>
                    <td className="p-4 font-black text-indigo-400">
                      {req.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleAction(req.id, 'approve')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981] hover:text-white rounded-lg font-medium transition-all text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Onayla (Gönderildi)
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'reject')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-medium transition-all text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          İptal Et (İade)
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
