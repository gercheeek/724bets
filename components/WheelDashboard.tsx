import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Crown, Sparkles, ChevronRight } from 'lucide-react';

const WheelDashboard: React.FC = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const controls = useAnimation();

  // Define wheel slices
  const slices = [
    { label: "100 TL", color: "bg-red-600", textColor: "text-white" },
    { label: "PAS", color: "bg-gray-800", textColor: "text-white" },
    { label: "50 FS", color: "bg-[#D4AF37]", textColor: "text-[#050505]" },
    { label: "%20 BONUS", color: "bg-emerald-600", textColor: "text-white" },
    { label: "250 TL", color: "bg-blue-600", textColor: "text-white" },
    { label: "PAS", color: "bg-gray-800", textColor: "text-white" },
    { label: "100 FS", color: "bg-purple-600", textColor: "text-white" },
    { label: "VIP UPGRADE", color: "bg-[#C5A017]", textColor: "text-[#050505]" },
    { label: "50 TL", color: "bg-orange-500", textColor: "text-white" },
    { label: "PAS", color: "bg-gray-800", textColor: "text-white" },
    { label: "25 FS", color: "bg-cyan-500", textColor: "text-white" },
    { label: "MEGA JACKPOT", color: "bg-rose-600", textColor: "text-white" },
  ];

  const SLICE_ANGLE = 360 / slices.length;

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const winningIndex = Math.floor(Math.random() * slices.length);
    const rotations = 5;
    const targetRotation = rotations * 360 + (360 - (winningIndex * SLICE_ANGLE));

    await controls.start({
      rotate: targetRotation,
      transition: { duration: 6, ease: [0.15, 0.85, 0.15, 1] }
    });

    setResult(slices[winningIndex].label);
    setSpinning(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b132b] text-white flex flex-col lg:flex-row overflow-hidden relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Left Panel: VIP Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 z-10 border-b lg:border-b-0 lg:border-r border-white/10 relative">
        {/* Radial Gold Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#D4AF37]/20 to-transparent blur-[50px] rounded-full pointer-events-none"></div>

        <div className="text-center mb-12 relative z-10">
          <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-yellow-200 to-[#C5A017] drop-shadow-lg">
            VIP CLUB
          </h1>
          <p className="text-lg text-gray-300 font-medium max-w-md mx-auto">
            Çarkı çevir, günlük ödülünü kap ve ayrıcalıklar dünyasına adım at.
          </p>
        </div>

        {/* Floating 3D VIP Card */}
        <motion.div 
          className="relative w-72 h-112 rounded-3xl p-[2px] bg-gradient-to-br from-[#D4AF37] via-yellow-200 to-[#C5A017] shadow-2xl z-10"
          animate={{ y: [0, -15, 0], rotateY: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Card Inner */}
          <div className="w-full h-full bg-[#0A0C10] rounded-[22px] p-6 flex flex-col justify-between relative overflow-hidden">
            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent skew-y-12 origin-top-left"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <Crown className="w-10 h-10 text-[#D4AF37]" />
              <div className="text-right">
                <div className="text-[#D4AF37] font-bold tracking-widest text-sm">BLACK</div>
                <div className="text-gray-400 text-xs">MEMBER</div>
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-sm text-gray-400 mb-1">CÜZDAN</div>
              <div className="text-3xl font-black text-white mb-6">45,000 TL</div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] mr-2" />
                  Günlük 1 Ücretsiz Çevirme
                </div>
                <div className="flex items-center text-sm font-medium">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] mr-2" />
                  Özel Nakit İadeler
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel: The Wheel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 z-10 relative">
        <div className="relative w-full max-w-[500px] aspect-square flex justify-center items-center">
          
          {/* Outer Gold Pulse Glow */}
          <div className="absolute inset-[-20px] rounded-full animate-pulse border-4 border-[#D4AF37]/30"></div>
          
          {/* Outer Gold Gradient Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#D4AF37] via-yellow-200 to-[#C5A017] p-3 shadow-2xl flex items-center justify-center">
            
            {/* LED Bulbs around the ring */}
            {[...Array(24)].map((_, i) => {
              const angleRad = (i * 15 * Math.PI) / 180;
              const yOffset = Math.cos(angleRad) * 48;
              const xOffset = Math.sin(angleRad) * 48;
              
              return (
                <div 
                  key={i} 
                  className="absolute w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#fff]"
                  style={{
                    top: `calc(50% - 1.5px - ${yOffset}%)`,
                    left: `calc(50% - 1.5px + ${xOffset}%)`,
                  }}
                ></div>
              );
            })}
            
            {/* Inner Wheel Container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#050505] bg-[#0A0C10]">
              <motion.div 
                className="w-full h-full relative"
                animate={controls}
                style={{ rotate: 0 }}
              >
                {/* Slices */}
                {slices.map((slice, i) => {
                  const angle = i * SLICE_ANGLE;
                  return (
                    <div 
                      key={i}
                      className="absolute top-0 left-0 w-full h-full"
                      style={{
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      {/* Slice Sector Background */}
                      <div className="absolute top-0 left-1/2 w-[50%] h-[50%] origin-bottom-left"
                           style={{ 
                             transform: `rotate(${-SLICE_ANGLE/2}deg) skewY(${90 - SLICE_ANGLE}deg)`,
                             backgroundColor: slice.color.includes('red') ? '#dc2626' : 
                                              slice.color.includes('gray') ? '#1f2937' : 
                                              slice.color.includes('#D4AF37') ? '#D4AF37' :
                                              slice.color.includes('#C5A017') ? '#C5A017' :
                                              slice.color.includes('emerald') ? '#059669' :
                                              slice.color.includes('blue') ? '#2563eb' :
                                              slice.color.includes('purple') ? '#9333ea' :
                                              slice.color.includes('orange') ? '#f97316' :
                                              slice.color.includes('cyan') ? '#06b6d4' : '#e11d48',
                             borderRight: '2px solid rgba(255,255,255,0.15)',
                           }}
                      ></div>
                      
                      {/* Slice Text */}
                      <div 
                        className={`absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center font-black text-sm lg:text-base ${slice.textColor} drop-shadow-md`}
                        style={{ height: '40%' }}
                      >
                        <span className="origin-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                          {slice.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
                
                {/* Center Hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-[#050505] border-4 border-[#D4AF37] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center z-20">
                  <Crown className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Top Pointer */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
             <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-t-white relative">
               <div className="absolute -top-[34px] -left-[18px] w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[36px] border-t-[#D4AF37] -z-10"></div>
             </div>
          </div>

        </div>
        
        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="mt-16 px-12 py-4 bg-gradient-to-r from-[#D4AF37] to-[#C5A017] text-[#050505] font-black text-2xl rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3 z-20 cursor-pointer"
        >
          {spinning ? 'ÇEVRİLİYOR...' : 'ŞİMDİ ÇEVİR'}
          {!spinning && <ChevronRight className="w-6 h-6" />}
        </button>
        
        {/* Result Banner */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-green-500/20 border border-green-500 rounded-xl backdrop-blur-md z-20"
          >
            <p className="text-green-400 font-bold text-xl text-center">Tebrikler! Kazandınız:</p>
            <p className="text-white font-black text-3xl text-center mt-1">{result}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WheelDashboard;
