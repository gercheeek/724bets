import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Add state variables
state_vars_str = """
  const [depositCryptoCoin, setDepositCryptoCoin] = useState(CRYPTO_COINS[0]);
  const [depositCryptoNetwork, setDepositCryptoNetwork] = useState(CRYPTO_NETWORKS[0]);

  const [ccNumber, setCcNumber] = useState('');
  const [ccName, setCcName] = useState('');
  const [ccExp, setCcExp] = useState('');
  const [ccCvv, setCcCvv] = useState('');
"""
content = re.sub(r'const \[depositCryptoCoin, setDepositCryptoCoin\].*?const \[depositCryptoNetwork, setDepositCryptoNetwork\].*?;', state_vars_str, content, flags=re.DOTALL)

# 2. Update isFormValid
valid_fn_str = """  const isFormValid = () => {
    const amt = parseFloat(amount);
    const isAmountValid = !isNaN(amt) && amt >= 100;
    if (activeTab === 'deposit') {
        if (selectedMethod.type === 'creditcard') {
             return isAmountValid && ccNumber.length >= 16 && ccName.length > 3 && ccExp.length >= 4 && ccCvv.length >= 3;
        }
        return isAmountValid;
    }
    if (activeTab === 'withdraw') {
      if (selectedMethod.type === 'banktransfer') return isAmountValid && fullName.length > 3 && iban.length > 15;
      if (selectedMethod.type === 'crypto') return isAmountValid && cryptoAddress.length > 10;
      if (selectedMethod.type === 'creditcard') return isAmountValid && ccNumber.length >= 16 && ccName.length > 3;
    }
    return false;
  };"""
content = re.sub(r'const isFormValid = \(\) => \{.*?(?=  const NAV_ITEMS = \[)', valid_fn_str + '\n\n', content, flags=re.DOTALL)

# 3. Inject new forms
forms_str = """                {/* DYNAMIC FORMS */}
                <div className="flex flex-col flex-1 space-y-4">
                  
                  {activeTab === 'deposit' && selectedMethod?.type === 'crypto' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                      <CustomSelect label="Para Birimi" options={CRYPTO_COINS} value={depositCryptoCoin} onChange={setDepositCryptoCoin} />
                      <CustomSelect label="Ağ (Network)" options={CRYPTO_NETWORKS} value={depositCryptoNetwork} onChange={setDepositCryptoNetwork} />
                    </div>
                  )}

                  {activeTab === 'withdraw' && selectedMethod?.type === 'banktransfer' && (
                    <div className="space-y-4 animate-in fade-in">
                      <CustomSelect label="Banka Seçin" options={BANK_OPTIONS} value={bank} onChange={setBank} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Çekim Adresi (Ad Soyad)</h3>
                          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Banka hesabınızdaki ad" className="w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-medium outline-none border border-white/5 focus:border-[#10B981]/50 bg-[#131927]" />
                        </div>
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">IBAN</h3>
                          <input type="text" value={iban} onChange={e => setIban(e.target.value)} placeholder="TR..." className="w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-medium outline-none border border-white/5 focus:border-[#10B981]/50 bg-[#131927]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'withdraw' && selectedMethod?.type === 'crypto' && (
                    <div className="space-y-4 animate-in fade-in">
                      <CustomSelect label="Kripto Ağı Seçin" options={CRYPTO_NETWORKS} value={depositCryptoNetwork} onChange={setDepositCryptoNetwork} />
                      <div>
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Cüzdan Adresi</h3>
                        <input type="text" value={cryptoAddress} onChange={e => setCryptoAddress(e.target.value)} placeholder="Örn: T9yD1P..." className="w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-mono outline-none border border-white/5 focus:border-[#10B981]/50 bg-[#131927]" />
                      </div>
                    </div>
                  )}

                  {/* CREDIT CARD FORM (Deposit) */}
                  {activeTab === 'deposit' && selectedMethod?.type === 'creditcard' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div>
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Kart Üzerindeki İsim</h3>
                        <input type="text" value={ccName} onChange={e => setCcName(e.target.value.toUpperCase())} placeholder="AD SOYAD" className="w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-medium outline-none border border-white/5 focus:border-[#8B5CF6]/50 bg-[#131927] placeholder:text-white/20" />
                      </div>
                      <div>
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Kart Numarası</h3>
                        <input type="text" maxLength={19} value={ccNumber} onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCcNumber(val);
                        }} placeholder="0000 0000 0000 0000" className="w-full py-3.5 px-4 rounded-xl text-white text-[14px] font-mono outline-none border border-white/5 focus:border-[#8B5CF6]/50 bg-[#131927] tracking-widest placeholder:text-white/20" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">SKT (AA/YY)</h3>
                          <input type="text" maxLength={5} value={ccExp} onChange={e => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2,4);
                            setCcExp(val);
                          }} placeholder="12/28" className="w-full py-3.5 px-4 rounded-xl text-white text-[14px] font-mono outline-none border border-white/5 focus:border-[#8B5CF6]/50 bg-[#131927] text-center tracking-widest placeholder:text-white/20" />
                        </div>
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">CVC Kodu</h3>
                          <input type="text" maxLength={4} value={ccCvv} onChange={e => setCcCvv(e.target.value.replace(/\D/g, ''))} placeholder="***" className="w-full py-3.5 px-4 rounded-xl text-white text-[14px] font-mono outline-none border border-white/5 focus:border-[#8B5CF6]/50 bg-[#131927] text-center tracking-widest placeholder:text-white/20" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CREDIT CARD FORM (Withdraw) */}
                  {activeTab === 'withdraw' && selectedMethod?.type === 'creditcard' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div>
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Kart Sahibi (Ad Soyad)</h3>
                        <input type="text" value={ccName} onChange={e => setCcName(e.target.value.toUpperCase())} placeholder="Banka kartınızdaki isim" className="w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-medium outline-none border border-white/5 focus:border-[#8B5CF6]/50 bg-[#131927] placeholder:text-white/20" />
                      </div>
                      <div>
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Çekim Yapılacak Kart Numarası</h3>
                        <input type="text" maxLength={19} value={ccNumber} onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCcNumber(val);
                        }} placeholder="0000 0000 0000 0000" className="w-full py-3.5 px-4 rounded-xl text-white text-[14px] font-mono outline-none border border-white/5 focus:border-[#8B5CF6]/50 bg-[#131927] tracking-widest placeholder:text-white/20" />
                      </div>
                    </div>
                  )}"""

content = re.sub(r'\{\/\* DYNAMIC FORMS \*\/\}.*?(?=\{\/\* AMOUNT & QUICK AMOUNTS \*\/\})', forms_str + '\n\n                  ', content, flags=re.DOTALL)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

print("Added credit card forms")
