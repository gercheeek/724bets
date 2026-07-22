import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { X, TrendingUp, DollarSign, Activity, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface FinanceDashboardProps {
  onClose: () => void;
}

const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWagered: 0,
    totalPayout: 0,
    ggr: 0, // Gross Gaming Revenue
    rtp: 0, // Return to Player %
    totalBets: 0
  });

  const [dailyData, setDailyData] = useState<any[]>([]);
  const [gameData, setGameData] = useState<any[]>([]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      // 1. Yeni RPC fonksiyonunu çağırarak ana metrikleri (GGR, Wager, vb.) süper hızlı çek
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_finance_dashboard_stats');
      
      if (rpcError) {
        console.warn('RPC bulunamadı veya hata verdi:', rpcError);
      } else if (rpcData) {
        setStats({
          totalWagered: rpcData.total_wager || 0,
          totalPayout: rpcData.total_payout || 0,
          ggr: rpcData.ggr || 0,
          rtp: rpcData.rtp || 0,
          totalBets: 0
        });
      }

      // 2. Grafikler için son 2000 işlemi çek (Tüm veritabanını çekmek tarayıcıyı dondurur)
      const { data: historyData, error } = await supabase
        .from('game_history')
        .select('bet_amount, win_amount, created_at, game_name')
        .order('created_at', { ascending: false })
        .limit(2000);

      if (error) throw error;
      if (!historyData || historyData.length === 0) {
        setLoading(false);
        return;
      }

      const dayMap: Record<string, { date: string, wagered: number, ggr: number }> = {};
      const gameMap: Record<string, { name: string, wagered: number, ggr: number }> = {};

      // Eskiden yeniye sırala ki çizgi grafikte zaman soldan sağa aksın
      [...historyData].reverse().forEach(row => {
        const bet = Number(row.bet_amount) || 0;
        const win = Number(row.win_amount) || 0;
        
        const dateStr = new Date(row.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
        
        if (!dayMap[dateStr]) {
          dayMap[dateStr] = { date: dateStr, wagered: 0, ggr: 0 };
        }
        dayMap[dateStr].wagered += bet;
        dayMap[dateStr].ggr += (bet - win);

        const game = row.game_name || 'Unknown';
        if (!gameMap[game]) {
          gameMap[game] = { name: game, wagered: 0, ggr: 0 };
        }
        gameMap[game].wagered += bet;
        gameMap[game].ggr += (bet - win);
      });

      // Eğer RPC verisi gelmediyse fallback olarak eski usul JS hesaplamasını kullan
      if (!rpcData) {
        let wagered = 0, payout = 0;
        historyData.forEach(r => { wagered += Number(r.bet_amount); payout += Number(r.win_amount); });
        setStats({
          totalWagered: wagered, totalPayout: payout, ggr: wagered - payout, rtp: wagered > 0 ? (payout / wagered) * 100 : 0, totalBets: historyData.length
        });
      }

      setDailyData(Object.values(dayMap));
      setGameData(Object.values(gameMap).sort((a, b) => b.ggr - a.ggr));

    } catch (err) {
      console.error('Error fetching finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 font-sans">
      <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">Finans & Analiz Paneli</h2>
              <p className="text-xs text-zinc-400">Canlı Kasa Karlılığı ve Oyun İstatistikleri</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchFinanceData}
              className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-semibold hidden sm:block">Yenile</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Toplam Hacim (Wager)</h3>
              </div>
              <div className="text-2xl font-black text-white">{formatMoney(stats.totalWagered)}</div>
              <div className="mt-2 text-xs text-zinc-500 font-mono">Sistemde dönen toplam para</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-2">
                <ArrowDownRight className="w-5 h-5 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Dağıtılan Ödül (Payout)</h3>
              </div>
              <div className="text-2xl font-black text-white">{formatMoney(stats.totalPayout)}</div>
              <div className="mt-2 text-xs text-zinc-500 font-mono">Kullanıcılara ödenen miktar</div>
            </div>

            <div className={`bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden group ${stats.ggr >= 0 ? 'hover:border-emerald-500/50' : 'hover:border-red-500/50'} transition-colors`}>
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-all ${stats.ggr >= 0 ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'}`}></div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className={`w-5 h-5 ${stats.ggr >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Net Kasa Karı (GGR)</h3>
              </div>
              <div className={`text-2xl font-black ${stats.ggr >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.ggr > 0 ? '+' : ''}{formatMoney(stats.ggr)}
              </div>
              <div className="mt-2 text-xs text-zinc-500 font-mono">Gross Gaming Revenue</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
              <div className="flex items-center gap-3 mb-2">
                <PieChartIcon className="w-5 h-5 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">RTP (Oyuncuya Dönüş)</h3>
              </div>
              <div className="text-2xl font-black text-white">{stats.rtp.toFixed(2)}%</div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${Math.min(stats.rtp, 100)}%` }}></div>
                </div>
                <span className="text-xs text-zinc-500 font-mono">Edge: {(100 - stats.rtp).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Area Chart */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Günlük Kasa Performansı
              </h3>
              <div className="h-[300px] w-full">
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGgr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="date" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value >= 1000 ? (value/1000).toFixed(1)+'k' : value} ₺`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [formatMoney(value), 'Net Kar']}
                      />
                      <Area type="monotone" dataKey="ggr" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorGgr)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">Veri bulunamadı</div>
                )}
              </div>
            </div>

            {/* Pie Chart (Game Profitability) */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-blue-400" />
                Oyun Bazlı Kasa Karı
              </h3>
              <div className="flex-1 min-h-[200px]">
                {gameData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gameData.filter(d => d.ggr > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="ggr"
                      >
                        {gameData.filter(d => d.ggr > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                        formatter={(value: number) => [formatMoney(value), 'Kasa Karı']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">Veri bulunamadı</div>
                )}
              </div>
              {/* List of games below pie chart */}
              <div className="mt-4 max-h-[120px] overflow-y-auto pr-2 space-y-2">
                {gameData.map((game, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-md bg-black/20">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                      <span className="text-zinc-300 font-medium">{game.name}</span>
                    </div>
                    <span className={`font-mono font-bold ${game.ggr >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatMoney(game.ggr)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
