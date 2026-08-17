import React, { useState } from 'react';

const PRIZES = [
  { label: '100 XP', color: '#ff00ff', text: '#000000' },
  { label: '50 USDT', color: '#06b6d4', text: '#000000' },
  { label: 'BOŞ', color: '#ff8c00', text: '#000000' },
  { label: '+1 SPIN', color: '#00ffff', text: '#000000' },
  { label: '500 XP', color: '#ff00ff', text: '#000000' },
  { label: '10 USDT', color: '#06b6d4', text: '#000000' },
];

const SLICE_ANGLE = 360 / PRIZES.length;

const RetroWheel: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const spinWheel = () => {
    if (isSpinning) return;
    
    // // TODO: Play 8-bit spin sound start

    setIsSpinning(true);
    setWinner(null);

    // Randomize the prize index
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    
    // We want the chosen slice's center to end up at the top (0 degrees).
    // The center of slice `i` is at `(i * SLICE_ANGLE) + (SLICE_ANGLE / 2)`.
    const sliceCenterAngle = (prizeIndex * SLICE_ANGLE) + (SLICE_ANGLE / 2);
    
    // Add 5 full spins for effect, then offset by the required angle so the center hits top.
    // 360 - sliceCenterAngle rotates it backwards to top.
    const spins = 5 * 360;
    const finalRotation = rotation + spins + (360 - (rotation % 360)) + (360 - sliceCenterAngle);

    setRotation(finalRotation);

    // Wait for animation to finish (5 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(PRIZES[prizeIndex].label);
      // // TODO: Play 8-bit win sound
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-full p-4">
      
      {/* Pointer */}
      <div className="relative z-20 mb-[-15px] flex flex-col items-center">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-bounce"></div>
      </div>

      {/* The Wheel */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 pixel-border border-[6px] rounded-full p-1 bg-black overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.3)]">
        <div 
          className="w-full h-full rounded-full relative transition-transform ease-[cubic-bezier(0.1,0.9,0.2,1)] duration-[5000ms]"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {PRIZES.map((prize, idx) => {
            const currentRotation = idx * SLICE_ANGLE;
            // Using a simple skew/rotate trick to draw slices, 
            // but for 6 slices conic-gradient is cleaner. Let's combine both!
            // Actually, just placing the text inside a div rotated correctly over a conic-gradient is easiest.
            return (
              <div 
                key={idx}
                className="absolute w-full h-full rounded-full"
                style={{
                  clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 20%)', 
                  // Wait, clip-path is tricky for dynamic slices. 
                  // Let's just use CSS conic-gradient for the background.
                }}
              ></div>
            );
          })}
          
          {/* Background Slices using Conic Gradient */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(
                ${PRIZES[0].color} 0deg 60deg,
                ${PRIZES[1].color} 60deg 120deg,
                ${PRIZES[2].color} 120deg 180deg,
                ${PRIZES[3].color} 180deg 240deg,
                ${PRIZES[4].color} 240deg 300deg,
                ${PRIZES[5].color} 300deg 360deg
              )`
            }}
          ></div>

          {/* Texts overlay */}
          {PRIZES.map((prize, idx) => {
             const angle = (idx * SLICE_ANGLE) + (SLICE_ANGLE / 2);
             return (
               <div 
                 key={idx}
                 className="absolute inset-0 flex justify-center items-start pt-[15%] md:pt-[20%]"
                 style={{ transform: `rotate(${angle}deg)` }}
               >
                 <span 
                   className="retro-font-secondary text-lg md:text-2xl font-black drop-shadow-md"
                   style={{ color: prize.text, textShadow: '2px 2px 0px rgba(255,255,255,0.5)' }}
                 >
                   {prize.label}
                 </span>
               </div>
             )
          })}
          
          {/* Center Hub */}
          <div className="absolute inset-0 m-auto w-12 h-12 md:w-16 md:h-16 bg-black border-4 border-white rounded-full flex items-center justify-center z-10">
            <div className="w-4 h-4 bg-[color:var(--theme-accent)] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Controls & Status */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <button 
          onClick={spinWheel}
          disabled={isSpinning}
          className={`pixel-border bg-black text-[color:var(--theme-accent)] border-[color:var(--theme-accent)] retro-font-primary text-sm md:text-base px-6 py-3 cursor-pointer transition-none ${isSpinning ? 'opacity-50' : 'hover:bg-[color:var(--theme-accent)] hover:text-black retro-text-glow'}`}
        >
          {isSpinning ? 'SPINNING...' : '[ SPIN NOW ]'}
        </button>

        <div className="h-10">
          {winner && (
            <div className="retro-font-secondary text-2xl text-[#ff00ff] retro-text-glow-purple animate-bounce">
              YOU WON: {winner}!
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default RetroWheel;
