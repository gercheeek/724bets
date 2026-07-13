import React, { useEffect, useState } from 'react';
import { PlayCircle, LogIn, X } from 'lucide-react';

interface OnboardingPopupProps {
  onStartTour: () => void;
  onClose: () => void;
}

const OnboardingPopup: React.FC<OnboardingPopupProps> = ({ onStartTour, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay for animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      <div className={`relative bg-[#111727] border border-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlayCircle size={40} className="text-emerald-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            724BAHİS'e Hoş Geldiniz!
          </h2>
          
          <p className="text-gray-400 mb-8 leading-relaxed">
            Sitemizin sunduğu eşsiz bahis deneyimini, özel analizleri ve hediye kodlarını (gift) keşfetmek ister misiniz?
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onStartTour, 300);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20"
            >
              <PlayCircle className="group-hover:scale-110 transition-transform" />
              <span>Site Turuna Başla</span>
            </button>
            
            <button
              onClick={handleClose}
              className="w-full bg-[#1a2235] hover:bg-[#232d45] text-white font-bold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2 border border-gray-700"
            >
              <LogIn size={20} />
              <span>Normal Giriş Yap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPopup;
