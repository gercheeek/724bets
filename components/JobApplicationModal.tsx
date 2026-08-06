import React, { useState } from 'react';
import { X, Send, User, Mail, Phone, MessageSquare, Briefcase, CheckCircle2 } from 'lucide-react';

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPosition?: 'support' | 'marketing';
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ isOpen, onClose, defaultPosition = 'support' }) => {
  const [position, setPosition] = useState<'support' | 'marketing'>(defaultPosition);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Update position if defaultPosition changes
  React.useEffect(() => {
    setPosition(defaultPosition);
    setIsSuccess(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
  }, [isOpen, defaultPosition]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#02050A]/90 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-[#0A0E17] rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header Ambient Glow */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#00E5FF]/10 to-transparent pointer-events-none" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8 flex-1 overflow-y-auto custom-scrollbar relative z-10">
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center">
              <Briefcase size={20} className="text-[#00E5FF]" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">İş Başvurusu</h2>
          </div>
          
          {!isSuccess ? (
            <>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                724bets ailesine katılmak için ilk adımı atın. Ön bilgilerinizi doldurun, insan kaynakları ekibimiz en kısa sürede size dönüş yapsın.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Position Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider pl-1">Başvurulan Pozisyon</label>
                  <div className="relative">
                    <select
                      name="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value as 'support' | 'marketing')}
                      className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00E5FF]/50 focus:bg-[#080B12] transition-all appearance-none cursor-pointer font-medium"
                      required
                    >
                      <option value="support">Canlı Destek (Türkiye Ekibi)</option>
                      <option value="marketing">Marketing Ekibi</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <Briefcase size={16} />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider pl-1">Ad Soyad</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Adınız ve Soyadınız"
                      className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white text-sm focus:outline-none focus:border-[#00E5FF]/50 focus:bg-[#080B12] transition-all placeholder:text-zinc-600"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <User size={16} />
                    </div>
                  </div>
                </div>

                {/* Contact Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider pl-1">E-Posta</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="E-posta adresiniz"
                        className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white text-sm focus:outline-none focus:border-[#00E5FF]/50 focus:bg-[#080B12] transition-all placeholder:text-zinc-600"
                        required
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <Mail size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider pl-1">Telefon</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Telefon numaranız"
                        className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white text-sm focus:outline-none focus:border-[#00E5FF]/50 focus:bg-[#080B12] transition-all placeholder:text-zinc-600"
                        required
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <Phone size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider pl-1">Kısa Ön Yazı / Neden Biz?</label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Kendinizi kısaca tanıtın..."
                      className="w-full bg-[#05070A] border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white text-sm focus:outline-none focus:border-[#00E5FF]/50 focus:bg-[#080B12] transition-all placeholder:text-zinc-600 min-h-[100px] resize-none"
                      required
                    />
                    <div className="absolute left-4 top-4 pointer-events-none text-zinc-500">
                      <MessageSquare size={16} />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-[#00E5FF] hover:bg-[#00cce6] text-[#002b30] font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(0,229,255,0.3)] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-[#002b30] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Başvuruyu Gönder</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-scale-in">
              <div className="w-20 h-20 bg-[#00E5FF]/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={40} className="text-[#00E5FF]" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Başvurunuz Alındı!</h3>
              <p className="text-zinc-400 text-sm max-w-[300px] leading-relaxed mb-8">
                Bilgileriniz insan kaynakları ekibimize başarıyla ulaştı. Özgeçmişiniz değerlendirildikten sonra en kısa sürede iletişime geçeceğiz.
              </p>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/15 text-white font-bold py-3 px-8 rounded-xl transition-colors"
              >
                Kapat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
