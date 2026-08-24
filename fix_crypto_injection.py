import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# I will find the end of the deposit alert block:
alert_pattern = r"(\{activeTab === 'deposit' && \(\s*<div className=\"p-4 rounded-lg flex gap-4 items-center\".*?</div>\s*\)\})"
new_injection = r"""\1
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

content = re.sub(alert_pattern, new_injection, content, flags=re.DOTALL)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
