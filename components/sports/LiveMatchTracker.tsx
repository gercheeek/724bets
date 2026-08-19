import React, { useState, useEffect, useRef } from 'react';

interface LiveMatchTrackerProps {
  homeTeam: string;
  awayTeam: string;
}

type MatchEvent = 'SAFE' | 'HOME_ATTACK' | 'AWAY_ATTACK' | 'HOME_DANGER' | 'AWAY_DANGER' | 'CORNER_HOME' | 'CORNER_AWAY';

const LiveMatchTracker: React.FC<LiveMatchTrackerProps> = ({ homeTeam, awayTeam }) => {
  const [currentEvent, setCurrentEvent] = useState<MatchEvent>('SAFE');
  const [eventText, setEventText] = useState('Top Hakimiyeti');
  const [ballStats, setBallStats] = useState({ home: 50, away: 50 });
  const pitchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Advanced Mock Engine
    const interval = setInterval(() => {
      const events: { type: MatchEvent, text: string }[] = [
        { type: 'SAFE', text: 'Top Hakimiyeti (Orta Saha)' },
        { type: 'HOME_ATTACK', text: `${homeTeam} Hücumu` },
        { type: 'AWAY_ATTACK', text: `${awayTeam} Hücumu` },
        { type: 'HOME_DANGER', text: '🔥 TEHLİKELİ ATAK 🔥' },
        { type: 'AWAY_DANGER', text: '🔥 TEHLİKELİ ATAK 🔥' },
        { type: 'CORNER_HOME', text: 'Korner Vuruşu' },
        { type: 'CORNER_AWAY', text: 'Korner Vuruşu' },
        { type: 'SAFE', text: 'Taç Atışı' },
      ];

      const weightedEvents = [0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7];
      const randomIdx = weightedEvents[Math.floor(Math.random() * weightedEvents.length)];
      const nextEvent = events[randomIdx];

      setCurrentEvent(nextEvent.type);
      setEventText(nextEvent.text);
      
      // Randomize stats slightly
      if (nextEvent.type.includes('HOME')) setBallStats({ home: 65, away: 35 });
      else if (nextEvent.type.includes('AWAY')) setBallStats({ home: 35, away: 65 });
      else setBallStats({ home: 50, away: 50 });

    }, 3800);

    return () => clearInterval(interval);
  }, [homeTeam, awayTeam]);

  // 2D Coordinates & Settings
  let ballLeft = '50%';
  let ballTop = '50%';
  let overlayGradient = '';
  let eventColor = 'text-white';
  let scannerActive = false;

  switch (currentEvent) {
    case 'SAFE':
      ballLeft = '50%'; ballTop = '50%';
      eventColor = 'text-gray-300';
      break;
    case 'HOME_ATTACK':
      ballLeft = '25%'; ballTop = '40%';
      overlayGradient = 'bg-gradient-to-l from-transparent to-blue-500/10';
      eventColor = 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]';
      break;
    case 'AWAY_ATTACK':
      ballLeft = '75%'; ballTop = '60%';
      overlayGradient = 'bg-gradient-to-r from-transparent to-blue-500/10';
      eventColor = 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]';
      break;
    case 'HOME_DANGER':
      ballLeft = '12%'; ballTop = '50%';
      overlayGradient = 'bg-gradient-to-l from-transparent via-red-600/10 to-red-600/30';
      eventColor = 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,1)]';
      scannerActive = true;
      break;
    case 'AWAY_DANGER':
      ballLeft = '88%'; ballTop = '50%';
      overlayGradient = 'bg-gradient-to-r from-transparent via-red-600/10 to-red-600/30';
      eventColor = 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,1)]';
      scannerActive = true;
      break;
    case 'CORNER_HOME':
      ballLeft = '2%'; ballTop = '2%';
      overlayGradient = 'bg-gradient-to-br from-yellow-500/20 to-transparent';
      eventColor = 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]';
      break;
    case 'CORNER_AWAY':
      ballLeft = '98%'; ballTop = '98%';
      overlayGradient = 'bg-gradient-to-tl from-yellow-500/20 to-transparent';
      eventColor = 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]';
      break;
  }

  return (
    <div className="w-full bg-[#05080c] rounded-xl overflow-hidden border border-[#1b2228] mb-6 relative flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.8)] group">
      
      {/* Cyber Grid Background behind everything */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      {/* Ultra-Premium Header */}
      <div className="flex justify-between items-center px-5 py-3 bg-gradient-to-b from-[#101720] to-transparent border-b border-white/5 relative z-20 backdrop-blur-sm">
        <div className="w-[35%] text-left">
          <span className={`text-[13px] font-black uppercase truncate block tracking-widest transition-all duration-500 ${currentEvent.includes('HOME') ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-105 origin-left' : 'text-gray-500'}`}>
            {homeTeam}
          </span>
          <div className="h-1 w-full bg-gray-800 rounded-full mt-1 overflow-hidden">
             <div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${ballStats.home}%`}}></div>
          </div>
        </div>
        
        <div className="w-[30%] text-center flex flex-col items-center">
          <div className="relative">
            {/* Glowing neon background for event text */}
            <div className={`absolute inset-0 blur-md opacity-50 transition-colors duration-500 ${eventColor.replace('text-', 'bg-')}`}></div>
            <div className={`relative text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 px-4 py-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md ${eventColor}`}>
              {eventText}
            </div>
          </div>
        </div>

        <div className="w-[35%] text-right">
          <span className={`text-[13px] font-black uppercase truncate block tracking-widest transition-all duration-500 ${currentEvent.includes('AWAY') ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-105 origin-right' : 'text-gray-500'}`}>
            {awayTeam}
          </span>
          <div className="h-1 w-full bg-gray-800 rounded-full mt-1 overflow-hidden flex justify-end">
             <div className="h-full bg-red-500 transition-all duration-1000" style={{width: `${ballStats.away}%`}}></div>
          </div>
        </div>
      </div>

      {/* 2D Viewport (Professional Sportradar Style) */}
      <div className="relative w-full aspect-[1.8/1] sm:aspect-[2.2/1] max-h-[280px] overflow-hidden flex items-center justify-center p-3 sm:p-5">
        
        {/* The Cyber Pitch (Sleek 2D) */}
        <div className="relative w-full h-full border-[1.5px] border-white/30 rounded-sm overflow-hidden"
             style={{
               boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
               backgroundImage: 'repeating-linear-gradient(90deg, #104222, #104222 10%, #0e3b1e 10%, #0e3b1e 20%)'
             }}>
          
          {/* Dynamic Attack Overlay Gradient */}
          <div className={`absolute inset-0 transition-all duration-700 ${overlayGradient} z-0 mix-blend-screen pointer-events-none`}></div>

          {/* --- PRECISION 2D PITCH LINES --- */}
          {/* Outer Boundary */}
          <div className="absolute inset-[3%] border-[1.5px] border-white/60 pointer-events-none">
            
            {/* Center Line & Circle */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-white/60 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute left-1/2 top-1/2 h-[35%] aspect-square border-[1.5px] border-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            {/* LEFT Penalty Area */}
            <div className="absolute left-0 top-1/2 w-[16%] h-[55%] border-[1.5px] border-l-0 border-white/60 -translate-y-1/2 pointer-events-none flex items-center">
              {/* Goal Area */}
              <div className="absolute left-0 top-1/2 w-[35%] h-[45%] border-[1.5px] border-l-0 border-white/60 -translate-y-1/2 pointer-events-none"></div>
              {/* Penalty Arc */}
              <div className="absolute left-[100%] top-1/2 h-[45%] aspect-square border-[1.5px] border-l-0 border-white/60 rounded-r-full -translate-y-1/2 pointer-events-none" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)', transform: 'translateX(-50%) translateY(-50%)' }}></div>
              {/* Penalty Spot */}
              <div className="absolute left-[75%] top-1/2 w-1 h-1 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            </div>

            {/* RIGHT Penalty Area */}
            <div className="absolute right-0 top-1/2 w-[16%] h-[55%] border-[1.5px] border-r-0 border-white/60 -translate-y-1/2 pointer-events-none flex items-center justify-end">
              {/* Goal Area */}
              <div className="absolute right-0 top-1/2 w-[35%] h-[45%] border-[1.5px] border-r-0 border-white/60 -translate-y-1/2 pointer-events-none"></div>
              {/* Penalty Arc */}
              <div className="absolute right-[100%] top-1/2 h-[45%] aspect-square border-[1.5px] border-r-0 border-white/60 rounded-l-full -translate-y-1/2 pointer-events-none" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)', transform: 'translateX(50%) translateY(-50%)' }}></div>
              {/* Penalty Spot */}
              <div className="absolute right-[75%] top-1/2 w-1 h-1 bg-white rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </div>

            {/* Corner Arcs */}
            <div className="absolute top-0 left-0 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-white/60 rounded-br-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-white/60 rounded-tr-full pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-white/60 rounded-bl-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-white/60 rounded-tl-full pointer-events-none"></div>
            
            {/* Goals (Outside the lines) */}
            <div className="absolute left-0 top-1/2 h-[20%] w-[3%] -translate-x-full -translate-y-1/2 border-[1.5px] border-r-0 border-gray-400/80 bg-black/30 pointer-events-none"></div>
            <div className="absolute right-0 top-1/2 h-[20%] w-[3%] translate-x-full -translate-y-1/2 border-[1.5px] border-l-0 border-gray-400/80 bg-black/30 pointer-events-none"></div>
          </div>

          {/* THE 2D BALL */}
          <div 
            className="absolute transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] z-50 pointer-events-none"
            style={{
              left: ballLeft,
              top: ballTop,
              transform: `translate(-50%, -50%)`
            }}
          >
            {/* The actual sphere/glowing dot */}
            <div className="w-4 h-4 bg-white rounded-full relative shadow-[0_0_10px_rgba(255,255,255,1),inset_-2px_-2px_4px_rgba(0,0,0,0.4)] border border-gray-200">
              
              {/* Glow tail */}
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-40 blur-[1px]"></div>

              {/* Danger Ripple Effect */}
              {scannerActive && (
                <>
                  <div className="absolute inset-[-4px] rounded-full border-2 border-red-500 animate-[ripple_1.5s_ease-out_infinite]"></div>
                  <div className="absolute inset-[-4px] rounded-full border-2 border-red-500 animate-[ripple_1.5s_ease-out_infinite_0.5s]"></div>
                </>
              )}
            </div>
            
            {/* Floating Info Tag above the ball */}
            {currentEvent !== 'SAFE' && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 bg-black/80 border border-white/20 rounded shadow-lg text-[9px] font-bold text-white tracking-wider backdrop-blur-md opacity-100 transition-opacity duration-300">
                {ballStats.home > ballStats.away ? 'ATK' : 'ATK'}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-white/20"></div>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Required keyframes for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(500%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; border-width: 2px; }
          100% { transform: scale(4); opacity: 0; border-width: 0px; }
        }
      `}} />
    </div>
  );
};

export default LiveMatchTracker;
