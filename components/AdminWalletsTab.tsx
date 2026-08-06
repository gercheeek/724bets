import React, { useState, useEffect } from 'react';
import { Wallet, Save, CheckCircle2 } from 'lucide-react';

export function AdminWalletsTab() {
    const [addresses, setAddresses] = useState({
        ETH: '',
        BTC: '',
        USDT: '',
        USDC: ''
    });
    
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('admin_wallet_addresses');
        if (stored) {
            try {
                setAddresses(JSON.parse(stored));
            } catch (e) {
                console.error("Parse error", e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('admin_wallet_addresses', JSON.stringify(addresses));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-6 bg-[#0F131A] min-h-full font-sans text-slate-300">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                        <Wallet className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Kripto Cüzdan Ayarları</h2>
                        <p className="text-sm text-zinc-500 mt-1">Kullanıcıların para yatıracağı deposit cüzdan adreslerini belirleyin.</p>
                    </div>
                </div>
                
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00E5FF] hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-emerald-500/20"
                >
                    {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? 'Kaydedildi' : 'Kaydet'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {/* ETH */}
                <div className="bg-[#1A1F29] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-[#627EEA] flex items-center justify-center text-white text-[10px] font-bold">Ξ</div>
                        <h3 className="font-semibold text-white">Ethereum (ERC20)</h3>
                    </div>
                    <input 
                        type="text" 
                        value={addresses.ETH}
                        onChange={(e) => setAddresses({...addresses, ETH: e.target.value})}
                        placeholder="0x..."
                        className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:border-blue-500 outline-none transition-colors"
                    />
                </div>

                {/* BTC */}
                <div className="bg-[#1A1F29] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-white text-[10px] font-bold">₿</div>
                        <h3 className="font-semibold text-white">Bitcoin</h3>
                    </div>
                    <input 
                        type="text" 
                        value={addresses.BTC}
                        onChange={(e) => setAddresses({...addresses, BTC: e.target.value})}
                        placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                        className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors"
                    />
                </div>

                {/* USDT */}
                <div className="bg-[#1A1F29] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-[#26A17B] flex items-center justify-center text-white text-[10px] font-bold">₮</div>
                        <h3 className="font-semibold text-white">Tether USDT (TRC20/ERC20)</h3>
                    </div>
                    <input 
                        type="text" 
                        value={addresses.USDT}
                        onChange={(e) => setAddresses({...addresses, USDT: e.target.value})}
                        placeholder="T..."
                        className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:border-teal-500 outline-none transition-colors"
                    />
                </div>

                {/* USDC */}
                <div className="bg-[#1A1F29] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full bg-[#2775CA] flex items-center justify-center text-white text-[10px] font-bold">$</div>
                        <h3 className="font-semibold text-white">USDC (ERC20)</h3>
                    </div>
                    <input 
                        type="text" 
                        value={addresses.USDC}
                        onChange={(e) => setAddresses({...addresses, USDC: e.target.value})}
                        placeholder="0x..."
                        className="w-full bg-[#0F131A] border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:border-blue-500 outline-none transition-colors"
                    />
                </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl max-w-4xl">
                <p className="text-sm text-blue-200">
                    <strong>Bilgi:</strong> Buraya girdiğiniz adresler, kullanıcılar "Para Yatır" (Depozito) butonuna tıkladığında gösterilecek olan cüzdan adresleridir. Değişiklikler anında canlıya yansır.
                </p>
            </div>
        </div>
    );
}
