import React from 'react';
import { Star, Headphones } from 'lucide-react';

const FavoritesEmptyState: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[600px] text-center p-6 relative bg-transparent rounded-2xl overflow-hidden mt-4">
      {/* Background Graphic Skeleton */}
      <div className="relative mb-8 mt-10">
        <svg width="340" height="180" viewBox="0 0 340 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="340" height="180" rx="8" fill="#141926" />
          
          <rect x="12" y="12" width="24" height="10" rx="2" fill="#20273a" />
          <rect x="304" y="12" width="24" height="10" rx="2" fill="#20273a" />
          
          <rect x="12" y="32" width="160" height="12" rx="4" fill="#20273a" />
          
          <rect x="12" y="56" width="16" height="16" rx="4" fill="#20273a" />
          <rect x="36" y="56" width="190" height="16" rx="4" fill="#20273a" />
          <rect x="316" y="56" width="12" height="16" rx="4" fill="#20273a" />
          
          <rect x="12" y="80" width="16" height="16" rx="4" fill="#20273a" />
          <rect x="36" y="80" width="130" height="16" rx="4" fill="#20273a" />
          <rect x="316" y="80" width="12" height="16" rx="4" fill="#20273a" />
          
          <rect x="12" y="112" width="45" height="50" rx="4" fill="#20273a" />
          <rect x="62" y="112" width="45" height="50" rx="4" fill="#20273a" />
          <rect x="112" y="112" width="45" height="50" rx="4" fill="#20273a" />
          <rect x="162" y="112" width="45" height="50" rx="4" fill="#20273a" />
          <rect x="212" y="112" width="45" height="50" rx="4" fill="#20273a" />
          <rect x="262" y="112" width="66" height="50" rx="4" fill="#20273a" />
        </svg>

        {/* Glowing Star in concentric circles */}
        <div className="absolute -top-10 -right-4 flex items-center justify-center">
          <div className="absolute w-[100px] h-[100px] rounded-full border border-[#f59e0b]/10 animate-[ping_3s_ease-in-out_infinite]"></div>
          <div className="absolute w-[80px] h-[80px] rounded-full border border-[#f59e0b]/20"></div>
          <div className="absolute w-[60px] h-[60px] rounded-full border border-[#f59e0b]/30"></div>
          <div className="w-[48px] h-[48px] rounded-full bg-[#1b2230] border border-[#f59e0b]/40 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Star className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" />
          </div>
        </div>
      </div>

      {/* Main Text */}
      <h3 className="text-[#8b95a5] text-[15px] font-medium mb-6">
        Favori müsabakalarınızı görmek için giriş<br />yapmalısınız.
      </h3>

      {/* Login Button */}
      <button 
        onClick={() => {
           window.dispatchEvent(new CustomEvent('openLoginModal'));
        }}
        className="bg-[#2b85fa] hover:bg-[#1a74e9] text-white font-black text-[13px] tracking-wide py-2.5 px-12 rounded-full transition-colors shadow-[0_0_15px_rgba(43,133,250,0.3)] mb-20"
      >
        GİRİŞ
      </button>

      {/* Floating Support Button Mock (Bottom Right of Container) */}
      <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform hidden md:flex">
        <Headphones className="w-6 h-6 text-white" />
      </div>
    </div>
  );
};

export default FavoritesEmptyState;
