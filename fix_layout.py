import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Fix Header margin
content = content.replace('className="flex items-center justify-between mb-8 shrink-0"', 'className="flex items-center justify-between mb-6 shrink-0"')

# Fix Method Cards sizing to prevent squishing
content = content.replace('className={`relative flex flex-col p-4 rounded-xl transition-all', 'className={`relative flex flex-col p-3.5 rounded-xl transition-all')
content = content.replace('className={`w-8 h-8 rounded-lg flex', 'className={`w-7 h-7 rounded-lg flex')
content = content.replace('className="w-4 h-4 text-white drop-shadow-sm"', 'className="w-3.5 h-3.5 text-white drop-shadow-sm"')
content = content.replace('className="text-[14px] font-bold mb-1', 'className="text-[13px] font-bold mb-1')
content = content.replace('className={`text-[10px] font-semibold transition-colors', 'className={`text-[9.5px] font-semibold transition-colors')

# Fix info box background
content = content.replace('className="p-4 rounded-xl bg-[#3B82F6]/5 border border-[#3B82F6]/20', 'className="p-3.5 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20')

# Fix Amount Input sizing
content = content.replace('py-5 px-3 text-white text-3xl', 'py-3.5 px-3 text-white text-2xl')

# Fix Quick Amounts buttons style
quick_amount_old = """                      <button
                        key={q}
                        onClick={() => setAmount(String(q))}
                        className={`py-2 rounded-lg text-[12px] font-medium transition-all duration-200 border ${
                          amount === String(q)
                            ? `bg-[${selectedMethod?.theme?.color}]/10 border-[${selectedMethod?.theme?.color}] text-white`
                            : 'bg-transparent border-white/10 text-white/50 hover:bg-white/5 hover:text-white'
                        }`}
                      >"""

quick_amount_new = """                      <button
                        key={q}
                        onClick={() => setAmount(String(q))}
                        className={`py-2 rounded-lg text-[12px] font-medium transition-all duration-200 border ${
                          amount === String(q)
                            ? `bg-[${selectedMethod?.theme?.color}]/15 border-[${selectedMethod?.theme?.color}] text-white shadow-[0_0_10px_${selectedMethod?.theme?.color}30]`
                            : 'bg-white/[0.03] border-white/5 text-white/60 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
                        }`}
                      >"""
content = content.replace(quick_amount_old, quick_amount_new)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

print("Layout fixed")
