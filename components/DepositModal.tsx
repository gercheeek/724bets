import React, { useState } from 'react';
import { X, Copy, CheckCircle2, Wallet, Building2, QrCode, ArrowRight, ShieldCheck } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string; // The logged-in user's username
}

export function DepositModal({ isOpen, onClose, username }: DepositModalProps) {
  const [method, setMethod] = useState<'bank' | 'crypto'>('bank');
  const [amount, setAmount] = useState('');
  const [identifier, setIdentifier] = useState(''); // senderName for bank, txHash for crypto
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Dummy config, can be fetched from DB later
  const bankConfig = { bank: 'Ziraat Bankası', iban: 'TR12 3456 7890 1234 5678 9012 34', holder: '724 Bahis Teknolojileri A.Ş.' };
  const cryptoConfig = { network: 'USDT TRC-20', address: 'TUz2k4zW2t9qjUu6C7kABC123XYZ' };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // Supabase'e kaydet (deposits tablosu)
      const { data, error } = await supabase
        .from('deposits')
        .insert([
          { 
            username, 
            method, 
            amount: parseFloat(amount), 
            tx_hash: identifier,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setMessage('Yatırım bildiriminiz başarıyla alındı. Yönetici onayından sonra bakiyenize eklenecektir.');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setAmount('');
        setIdentifier('');
        setMessage('');
      }, 4000);
    } catch (err: any) {
      console.error('Deposit submit error:', err);
      setStatus('error');
      setMessage(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-zinc-950 border border-zinc-800/80 rounded-[2rem] w-full max-w-md relative shadow-2xl overflow-hidden">
        {/* Header Background Glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />
        
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 p-2 rounded-full backdrop-blur-sm z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Yatırım Yap</h2>
              <p className="text-zinc-400 text-sm">Bakiyenizi güvenle yükseltin</p>
            </div>
          </div>

          {/* Method Tabs */}
          <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg mb-8 border border-zinc-800/50">
            <button
              onClick={() => setMethod('bank')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${method === 'bank' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Building2 className="w-4 h-4" /> Havale / EFT
            </button>
            <button
              onClick={() => setMethod('crypto')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${method === 'crypto' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <QrCode className="w-4 h-4" /> Kripto
            </button>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-5 mb-8 backdrop-blur-sm">
            {method === 'bank' ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-wider">Banka Adı</p>
                  <p className="text-white font-medium">{bankConfig.bank}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-wider">Alıcı Adı Soyadı</p>
                  <p className="text-white font-medium">{bankConfig.holder}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-wider">IBAN Numarası</p>
                  <div className="flex items-center justify-between bg-black/50 p-3 rounded-lg border border-zinc-800/80">
                    <span className="text-blue-400 font-mono text-sm tracking-wider">{bankConfig.iban}</span>
                    <button onClick={() => handleCopy(bankConfig.iban)} className="text-zinc-400 hover:text-white transition-colors">
                      {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-wider">Ağ (Network)</p>
                  <div className="inline-flex px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-bold border border-blue-500/20">
                    {cryptoConfig.network}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold mb-1 uppercase tracking-wider">Cüzdan Adresi</p>
                  <div className="flex items-center justify-between bg-black/50 p-3 rounded-lg border border-zinc-800/80">
                    <span className="text-blue-400 font-mono text-xs truncate mr-2">{cryptoConfig.address}</span>
                    <button onClick={() => handleCopy(cryptoConfig.address)} className="text-zinc-400 hover:text-white transition-colors shrink-0">
                      {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">Yatırılan Tutar ({method === 'bank' ? 'TL' : 'USDT'})</label>
              <div className="relative">
                <input 
                  type="number" 
                  required
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800 text-white rounded-lg pl-4 pr-12 py-3.5 focus:outline-none focus:border-blue-500 transition-colors font-medium text-lg placeholder-zinc-700"
                  placeholder="0.00"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                  {method === 'bank' ? '₺' : '$'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 ml-1">
                {method === 'bank' ? 'Gönderici Adı Soyadı' : 'İşlem Özeti (TXID)'}
              </label>
              <input 
                type="text" 
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 text-white rounded-lg px-4 py-3.5 focus:outline-none focus:border-blue-500 transition-colors font-medium placeholder-zinc-700"
                placeholder={method === 'bank' ? 'Adınız Soyadınız' : 'Örn: 8a7b6c5d4e3f...'}
              />
            </div>

            {status === 'error' && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
                {message}
              </div>
            )}
            
            {status === 'success' && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-emerald-400 text-sm font-medium">{message}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-lg transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
            >
              {status === 'loading' ? 'İşleniyor...' : (
                <>BİLDİRİMİ GÖNDER <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
