import React, { useState, useEffect, useRef } from 'react';
import { Copy, ChevronDown, Headphones } from 'lucide-react';

const MyBetsEmptyState: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Son Bahisler');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [activeSubTab, setActiveSubTab] = useState('Açık Bahisler');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full flex flex-col min-h-[600px] text-center p-6 relative bg-transparent rounded-2xl overflow-hidden mt-4">
      
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6 mb-12">
        {/* Row 1: Title */}
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center border border-[#10b981]/20">
            <Copy className="w-4.5 h-4.5 text-[#10b981]" />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">Bahislerim</h2>
        </div>
        
        {/* Row 2: Tabs & Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold text-slate-300">
            {['Hepsi', 'Açık Bahisler', 'Kazanan', 'Kaybeden', 'Bozdurulan', 'İptal Edilen', 'Geri İade Edilen'].map((tab) => {
              const isActive = activeSubTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    isActive 
                      ? 'bg-[#2b85fa] text-white font-bold shadow-[0_0_15px_rgba(43,133,250,0.3)]' 
                      : 'bg-[#131722] hover:bg-[#1a2030] text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
          
          <div ref={dropdownRef} className="relative self-start lg:self-auto z-50">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-[#1b2030] text-white text-[13px] font-bold py-2.5 px-5 rounded-full flex items-center gap-6 border border-white/5 hover:bg-[#252a3a] transition-all whitespace-nowrap shadow-md min-w-[160px] justify-between"
            >
              <span>{selectedFilter}</span>
              {dropdownOpen ? (
                <span className="text-[10px] text-white">▲</span>
              ) : (
                <span className="text-[10px] text-slate-400">▼</span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-[280px] bg-[#161925] border border-white/5 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['Bugün', 'Geçen Hafta', 'Geçen Ay', 'Son Bahisler'].map((filter) => {
                    const isActive = selectedFilter === filter;
                    return (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setDropdownOpen(false);
                        }}
                        className={`py-2 px-3 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap text-center ${
                          isActive 
                            ? 'bg-[#2b85fa] text-white shadow-[0_0_12px_rgba(43,133,250,0.3)]' 
                            : 'bg-[#1c2234] hover:bg-[#252c42] text-slate-400 hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
                
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[11px] font-bold text-slate-400 px-1">Başlangıç Tarihi</label>
                    <input 
                      type="date" 
                      className="w-full bg-[#1c2234] border border-white/5 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#2b85fa] transition-colors [color-scheme:dark]" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[11px] font-bold text-slate-400 px-1">Bitiş Tarihi</label>
                    <input 
                      type="date" 
                      className="w-full bg-[#1c2234] border border-white/5 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#2b85fa] transition-colors [color-scheme:dark]" 
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFilter('Özel Tarih');
                      setDropdownOpen(false);
                    }}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl text-[13px] font-bold transition-all text-center bg-[#10b981] hover:bg-[#059669] text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                  >
                    Kayıtları Getir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        {/* Background Graphic Skeleton */}
        <div className="relative mb-8">
          <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="120" cy="120" r="100" stroke="#1075fc" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="8 8" className="animate-[spin_20s_linear_infinite]" />
            <circle cx="120" cy="120" r="80" stroke="#1075fc" strokeWidth="1" strokeOpacity="0.1" />
            
            {/* Top Slip */}
            <rect x="70" y="60" width="110" height="40" rx="4" fill="#334155" />
            <rect x="75" y="65" width="20" height="30" rx="2" fill="#475569" />
            <rect x="100" y="70" width="70" height="6" rx="3" fill="#64748b" />
            <rect x="100" y="80" width="40" height="6" rx="3" fill="#475569" />
            
            {/* Middle Slip */}
            <rect x="50" y="90" width="120" height="40" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
            <rect x="55" y="95" width="20" height="30" rx="2" fill="#334155" />
            <rect x="80" y="100" width="80" height="6" rx="3" fill="#475569" />
            <rect x="80" y="110" width="50" height="6" rx="3" fill="#334155" />

            {/* Bottom Slip */}
            <rect x="90" y="120" width="100" height="40" rx="4" fill="#334155" />
            <rect x="95" y="125" width="20" height="30" rx="2" fill="#475569" />
            <rect x="120" y="130" width="60" height="6" rx="3" fill="#64748b" />
            <rect x="120" y="140" width="30" height="6" rx="3" fill="#475569" />

            {/* Sparkles / Plus signs */}
            <path d="M60 40 L60 60 M50 50 L70 50" stroke="#1075fc" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            <path d="M180 100 L180 120 M170 110 L190 110" stroke="#1075fc" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5" />
            <path d="M150 40 L150 50 M145 45 L155 45" stroke="#1075fc" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
          </svg>
        </div>

        {/* Main Text */}
        <h3 className="text-[#8b95a5] text-[15px] font-medium mb-6">
          Bahislerinizi görmek için lütfen hesabınıza<br />giriş yapınız.
        </h3>

        {/* Login Button */}
        <button 
          onClick={() => {
             window.dispatchEvent(new CustomEvent('openLoginModal'));
          }}
          className="bg-[#2b85fa] hover:bg-[#1a74e9] text-white font-black text-[13px] tracking-wide py-2.5 px-12 rounded-full transition-colors shadow-[0_0_15px_rgba(43,133,250,0.3)] mb-4"
        >
          GİRİŞ
        </button>
        
        <p className="text-[#8b95a5] text-[12px]">
          Herhangi bir hesabınız yok mu ? <span onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }))} className="text-white font-medium hover:underline cursor-pointer">Hemen Üye Ol!</span>
        </p>
      </div>

      {/* Floating Support Button Mock (Bottom Right of Container) */}
      <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform hidden md:flex">
        <Headphones className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default MyBetsEmptyState;
