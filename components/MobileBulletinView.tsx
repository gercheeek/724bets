import React, { useState } from 'react';
import { Loader } from 'lucide-react';

interface MobileBulletinViewProps {
  onBack: () => void;
}

const MobileBulletinView: React.FC<MobileBulletinViewProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col w-full h-full bg-[#0A0D14]">
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#12151C]">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Mobil <span className="text-[#00FFA3]">Bülten</span>
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          Geri Dön
        </button>
      </div>

      <div className="relative flex-1 w-full h-[calc(100vh-73px)] min-h-[800px]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0D14] z-10">
            <Loader className="w-8 h-8 text-[#00FFA3] animate-spin mb-4" />
            <span className="text-white/60 font-medium">Bülten Yükleniyor...</span>
          </div>
        )}
        <iframe
          src="https://9e902c.r136778.net/stc--321532259/stc--321532259"
          className="w-full h-full border-none"
          title="Mobil Bülten"
          onLoad={() => setIsLoading(false)}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default MobileBulletinView;
