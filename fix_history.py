import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Add ArrowDown and ArrowUp to lucide imports
if 'ArrowDown' not in content:
    content = content.replace('Wallet } from \'lucide-react\'', 'Wallet, ArrowDown, ArrowUp } from \'lucide-react\'')

# 2. Add MOCK_HISTORY constant
mock_history_code = """
const MOCK_HISTORY = [
  { id: 'tx-1', type: 'deposit', method: 'Kripto Para (USDT)', amount: 15000, date: '12 Ağu 2026, 14:30', status: 'completed' },
  { id: 'tx-2', type: 'withdraw', method: 'Banka Havalesi', amount: 8500, date: '10 Ağu 2026, 09:15', status: 'completed' },
  { id: 'tx-3', type: 'deposit', method: 'Kredi Kartı', amount: 2000, date: '08 Ağu 2026, 21:45', status: 'rejected' },
  { id: 'tx-4', type: 'deposit', method: 'Banka Havalesi', amount: 5000, date: '01 Ağu 2026, 11:20', status: 'completed' },
];
"""
if 'MOCK_HISTORY' not in content:
    content = content.replace('type TabId = \'deposit\' | \'withdraw\' | \'history\';', mock_history_code + '\ntype TabId = \'deposit\' | \'withdraw\' | \'history\';')

# 3. Replace the rendering logic for tabs
# We need to find `{!success ? (` and wrap it with `activeTab === 'history'` logic.
# Let's do a smart string replacement.

old_render = "{!success ? ("

new_render = """{activeTab === 'history' ? (
              <div className="animate-in fade-in duration-300 space-y-3">
                {MOCK_HISTORY.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl bg-[#1A1F2E] hover:bg-[#22283A] transition-colors border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${tx.type === 'deposit' ? 'bg-[#10B981]/10' : 'bg-[#EF4444]/10'}`}>
                         {tx.type === 'deposit' ? <ArrowDown className="w-5 h-5 text-[#10B981]" /> : <ArrowUp className="w-5 h-5 text-[#EF4444]" />}
                      </div>
                      <div>
                         <div className="text-white text-[14px] font-bold">{tx.type === 'deposit' ? 'Para Yatırma' : 'Para Çekme'}</div>
                         <div className="text-white/40 text-[11px] font-medium">{tx.method} &bull; {tx.date}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                       <div className={`text-[15px] font-black ${tx.type === 'deposit' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                         {tx.type === 'deposit' ? '+' : '-'}₺{tx.amount.toLocaleString('tr-TR')}
                       </div>
                       <div className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${tx.status === 'completed' ? 'text-[#10B981]' : tx.status === 'pending' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                         {tx.status === 'completed' ? 'BAŞARILI' : tx.status === 'pending' ? 'BEKLİYOR' : 'REDDEDİLDİ'}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !success ? ("""

content = content.replace(old_render, new_render)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
