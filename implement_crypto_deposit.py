import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Upgrade CustomSelect Design
old_select_trigger = 'className="w-full bg-[#1A1F2E] hover:bg-[#22283A] py-1.5 px-3 rounded-lg text-white text-[14px] font-medium flex justify-between items-center cursor-pointer transition-colors"'
new_select_trigger = """className="w-full py-2 px-3 rounded-xl text-white text-[14px] font-medium flex justify-between items-center cursor-pointer transition-all hover:ring-1 hover:ring-white/10"
        style={{ 
          background: 'rgba(0,0,0,0.3)', 
          boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}"""
content = content.replace(old_select_trigger, new_select_trigger)

old_dropdown_menu = 'className="absolute top-full left-0 w-full mt-2 bg-[#1A1F2E] border border-white/5 rounded-lg shadow-2xl z-50 max-h-56 overflow-y-auto py-2 custom-scrollbar"'
new_dropdown_menu = 'className="absolute top-full left-0 w-full mt-2 border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-50 max-h-56 overflow-y-auto py-2 custom-scrollbar backdrop-blur-xl" style={{ background: "rgba(20,25,35,0.95)" }}'
content = content.replace(old_dropdown_menu, new_dropdown_menu)

# 2. Add State Variables for Crypto Deposit
state_injection = """  const [iban, setIban] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [cryptoTag, setCryptoTag] = useState('');
  
  // New Crypto Deposit States
  const [depositCryptoCoin, setDepositCryptoCoin] = useState('Tether (USDT)');
  const [depositCryptoNetwork, setDepositCryptoNetwork] = useState('TRC20 (Tron)');"""
content = content.replace("  const [iban, setIban] = useState('');\n  const [cryptoAddress, setCryptoAddress] = useState('');\n  const [cryptoTag, setCryptoTag] = useState('');", state_injection)

# 3. Add UI for Crypto Deposit Options
# Locate where to inject: Just below the Info Alert in the deposit section.
# The deposit section doesn't have a dedicated form block like withdraw, it just goes from Info Alert straight to Amount Section.
# Wait, let's look at the structure:
# {/* 2. DYNAMIC FORM AREA */}
# <div>
#   {selectedMethod?.type === 'crypto' && (
#     <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-2.5 flex gap-3 items-center">
#       ...
#     </div>
#   )}
#   {activeTab === 'withdraw' && ...}
# </div>
# {/* 3. AMOUNT SECTION (Premium 3D Glass) */}

# I will find the end of the `selectedMethod?.type === 'crypto'` alert, and inject the deposit form.
crypto_alert_pattern = r"(\{selectedMethod\?\.type === 'crypto' && \(\s*<div className=\"bg-\[\#F59E0B\]/10.*?</div>\s*\)\})"
new_crypto_area = r"""\1
                  {activeTab === 'deposit' && selectedMethod?.type === 'crypto' && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <CustomSelect 
                        label="Kripto Para Birimi" 
                        options={['Tether (USDT)', 'Bitcoin (BTC)', 'Ethereum (ETH)', 'Tron (TRX)', 'Litecoin (LTC)']} 
                        value={depositCryptoCoin} 
                        onChange={setDepositCryptoCoin} 
                      />
                      {depositCryptoCoin === 'Tether (USDT)' && (
                        <CustomSelect 
                          label="Ağ (Network)" 
                          options={['TRC20 (Tron)', 'ERC20 (Ethereum)', 'BEP20 (BSC)', 'Polygon']} 
                          value={depositCryptoNetwork} 
                          onChange={setDepositCryptoNetwork} 
                        />
                      )}
                    </div>
                  )}"""

content = re.sub(crypto_alert_pattern, new_crypto_area, content, flags=re.DOTALL)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

