import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, RefreshCw } from 'lucide-react';

export default function AdminBlackjackTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBets: 0,
    volume: 0,
    payout: 0,
    profit: 0
  });

  const loadData = () => {
    try {
      const data = JSON.parse(localStorage.getItem('site_blackjack_bets') || '[]');
      // Sort newest first
      data.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setLogs(data);

      let volume = 0;
      let payout = 0;
      data.forEach((bet: any) => {
        volume += (bet.betAmount || 0);
        payout += (bet.winAmount || 0);
      });

      setStats({
        totalBets: data.length,
        volume,
        payout,
        profit: volume - payout
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span className="text-3xl">🃏</span>
            Blackjack Yönetimi (PRO)
          </h2>
          <p className="text-gray-400 text-sm mt-1">Gerçek zamanlı bakiye ile oynanan Blackjack oyunlarının istatistikleri ve logları.</p>
        </div>
        <button 
          onClick={loadData}
          className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-colors border border-white/10"
        >
          <RefreshCw className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#151821] p-6 rounded-xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
             <Activity className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-gray-400 text-sm font-semibold mb-2">Toplam Oyun (El)</p>
          <p className="text-3xl font-black text-white">{stats.totalBets}</p>
        </div>

        <div className="bg-[#151821] p-6 rounded-xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
             <TrendingUp className="w-12 h-12 text-yellow-500" />
          </div>
          <p className="text-gray-400 text-sm font-semibold mb-2">Toplam Hacim</p>
          <p className="text-3xl font-black text-white">${stats.volume.toFixed(2)}</p>
        </div>

        <div className="bg-[#151821] p-6 rounded-xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl">
             💸
          </div>
          <p className="text-gray-400 text-sm font-semibold mb-2">Toplam Ödenen</p>
          <p className="text-3xl font-black text-white">${stats.payout.toFixed(2)}</p>
        </div>

        <div className="bg-[#151821] p-6 rounded-xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
             <TrendingUp className="w-12 h-12 text-[#27D26D]" />
          </div>
          <p className="text-gray-400 text-sm font-semibold mb-2">Kasa Kâr / Zarar</p>
          <p className={`text-3xl font-black ${stats.profit >= 0 ? 'text-[#27D26D]' : 'text-red-500'}`}>
            ${stats.profit.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#151821] rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-[#1A1D29]">
          <h3 className="text-white font-bold">Son Oynanan Eller (Log)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111317] border-b border-white/5 text-xs text-gray-400">
                <th className="py-3 px-4 font-semibold">Tarih</th>
                <th className="py-3 px-4 font-semibold">Kullanıcı</th>
                <th className="py-3 px-4 font-semibold">Bahis</th>
                <th className="py-3 px-4 font-semibold">Sonuç</th>
                <th className="py-3 px-4 font-semibold">Kullanıcı Kazancı</th>
                <th className="py-3 px-4 font-semibold">Kâr (Kasa)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                    Henüz oynanan bir Blackjack eli yok.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-gray-400">
                      {new Date(log.time).toLocaleString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {log.username || 'Gizli Üye'} <span className="text-[10px] text-gray-500">({log.userId})</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      ${log.betAmount?.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        log.result === 'win' || log.result === 'blackjack' ? 'bg-[#27D26D]/20 text-[#27D26D]' : 
                        log.result === 'push' ? 'bg-gray-500/20 text-gray-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-bold">
                      ${log.winAmount?.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 font-bold ${log.profit >= 0 ? 'text-[#27D26D]' : 'text-red-500'}`}>
                      ${log.profit?.toFixed(2)}
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
