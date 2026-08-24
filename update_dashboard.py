import re

filename = 'components/AdminDashboardTab.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace backgrounds
content = content.replace("bg-[#0b0c10]", "bg-[#1A2436]/40 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]")
content = content.replace("bg-[#111216]", "bg-[#131b2b]/60")
content = content.replace("bg-[#1a1b1f]", "bg-[#1A2436]")

# Replace accent colors
content = content.replace("#00ff88", "#10B981")
content = content.replace("rgba(0,255,136,0.3)", "rgba(16,185,129,0.3)")
content = content.replace("rgba(0,255,136,0.6)", "rgba(16,185,129,0.6)")

# The Ticker (Whale Alert) - I will add a ticker at the top.
ticker_html = """
            <div className="w-full bg-[#1A2436]/80 border border-[#10B981]/20 rounded-lg p-2 mb-4 flex items-center gap-3 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <div className="bg-[#10B981]/20 text-[#10B981] px-2 py-1 rounded text-[10px] font-black tracking-widest shrink-0 animate-pulse border border-[#10B981]/30">
                    WHALE ALERT
                </div>
                <div className="flex-1 overflow-hidden relative">
                    <div className="whitespace-nowrap animate-[marquee_15s_linear_infinite] text-[11px] font-mono text-zinc-300">
                        <span className="text-[#10B981]">🐋 @KriptoKral</span> just deposited <span className="text-white font-bold">50,000 USDT</span> • 
                        <span className="text-[#10B981] ml-4">🐋 @Whale_99</span> won <span className="text-white font-bold">1.2 BTC</span> on Roulette • 
                        <span className="text-[#10B981] ml-4">🐋 @VipCan</span> requested <span className="text-white font-bold">120,000 TRY</span> withdrawal 
                    </div>
                </div>
            </div>
"""

content = content.replace('<div className="flex flex-col h-full bg-transparent p-2 md:p-4 animate-in fade-in zoom-in-95 overflow-hidden">', 
                          '<div className="flex flex-col h-full bg-transparent p-2 md:p-4 animate-in fade-in zoom-in-95 overflow-hidden">\n' + ticker_html)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated Dashboard in {filename}")
