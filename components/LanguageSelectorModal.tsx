import React from 'react';
import { X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const languages = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { i18n, t } = useTranslation();
  const { setLanguage } = useLanguage();

  if (!isOpen) return null;

  const currentLang = i18n.language;

  const handleLanguageSelect = (code: string) => {
    i18n.changeLanguage(code);
    const legacyCode = code === 'pt-BR' ? 'pt' : code;
    setLanguage(legacyCode as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#060911] border border-white/10 rounded-3xl w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-white font-bold text-lg">{t('sidebar.language', 'Dil')}</h2>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          {languages.map((lang) => {
            const isActive = currentLang === lang.code || (currentLang.startsWith('pt') && lang.code === 'pt-BR');
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className={`flex items-center justify-between w-full p-4 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-[#00E5FF]/10 border border-[#00E5FF]/20 text-white shadow-[0_0_15px_rgba(0,229,255,0.1)]' 
                    : 'hover:bg-white/5 border border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{lang.flag}</span>
                  <span className="font-bold tracking-wide text-[14px]">{lang.label}</span>
                </div>
                {isActive && <Check size={18} className="text-[#00E5FF]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorModal;
