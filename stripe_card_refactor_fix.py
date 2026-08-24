import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Fix the broken EMV Chip on the 3D Credit Card Button
# I will use a simple regex search to find it, then use string replace to avoid re.sub escaping issues.
broken_chip_pattern = r'\{\/\* EMV Chip Simulation \*\/\}.*?<\/div>\s*\}\)'
match = re.search(broken_chip_pattern, content, flags=re.DOTALL)
if match:
    content = content.replace(match.group(0), '')

# Replace VISA text with the glowing VISA text
old_visa = '<span className={`font-black italic text-[16px] transition-all duration-500 ${selectedMethod?.id === \'creditcard\' ? \'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]\' : \'text-white/30\'}`}>VISA</span>'
new_visa = """<div className="relative">
                          {selectedMethod?.id === 'creditcard' && <div className="absolute inset-0 bg-white/20 blur-md rounded-full"></div>}
                          <span className={`relative font-black italic text-[18px] transition-all duration-500 ${selectedMethod?.id === 'creditcard\' ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]' : 'text-white/30'}`}>VISA</span>
                       </div>"""
content = content.replace(old_visa, new_visa)

# 2. Stripe-style Ultra Premium Credit Card Form for Deposit
deposit_form_pattern = r'\{\/\* CREDIT CARD FORM \(Deposit\) \*\/\}.*?(?=\{\/\* CREDIT CARD FORM \(Withdraw\) \*\/\})'
new_deposit_form = """{/* CREDIT CARD FORM (Deposit) - ULTRA PREMIUM STRIPE STYLE */}
                  {activeTab === 'deposit' && selectedMethod?.type === 'creditcard' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-2 uppercase flex items-center gap-2">
                         <Lock className="w-3 h-3 text-[#10B981]" /> Güvenli Ödeme Bilgileri
                      </h3>
                      
                      <div className="rounded-xl border border-white/10 bg-[#131A26] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus-within:ring-1 focus-within:ring-[#8B5CF6]/50 transition-all">
                        {/* Name on Card */}
                        <div className="border-b border-white/5 relative group">
                          <input type="text" value={ccName} onChange={e => setCcName(e.target.value.toUpperCase())} placeholder="KART ÜZERİNDEKİ İSİM" className="w-full bg-transparent py-3 px-4 text-white text-[13px] font-medium outline-none placeholder:text-white/30 group-hover:bg-white/[0.02] transition-colors" />
                        </div>
                        
                        {/* Card Number */}
                        <div className="border-b border-white/5 relative group">
                          <input type="text" maxLength={19} value={ccNumber} onChange={e => {
                            const val = e.target.value.replace(/\\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                            setCcNumber(val);
                          }} placeholder="KART NUMARASI (0000 0000 0000 0000)" className="w-full bg-transparent py-3 px-4 text-white text-[14px] font-mono tracking-widest outline-none placeholder:text-white/30 group-hover:bg-white/[0.02] transition-colors" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-50">
                             <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
                             <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
                          </div>
                        </div>
                        
                        {/* Expiry & CVC */}
                        <div className="flex w-full">
                          <div className="w-1/2 border-r border-white/5 relative group">
                            <input type="text" maxLength={5} value={ccExp} onChange={e => {
                              let val = e.target.value.replace(/\\D/g, '');
                              if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2,4);
                              setCcExp(val);
                            }} placeholder="SKT (AA/YY)" className="w-full bg-transparent py-3 px-4 text-white text-[14px] font-mono tracking-widest outline-none placeholder:text-white/30 group-hover:bg-white/[0.02] transition-colors" />
                          </div>
                          <div className="w-1/2 relative group">
                            <input type="password" maxLength={4} value={ccCvv} onChange={e => setCcCvv(e.target.value.replace(/\\D/g, ''))} placeholder="CVC (***)" className="w-full bg-transparent py-3 px-4 text-white text-[14px] font-mono tracking-widest outline-none placeholder:text-white/30 group-hover:bg-white/[0.02] transition-colors" />
                            <AlertCircle className="w-3.5 h-3.5 text-white/20 absolute right-4 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  """

match2 = re.search(deposit_form_pattern, content, flags=re.DOTALL)
if match2:
    content = content.replace(match2.group(0), new_deposit_form)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)

print("Applied Ultra Premium Stripe-style layout!")
