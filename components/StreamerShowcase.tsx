import React from 'react';

const DUMMY_STREAMERS = [
  {
    id: 1,
    name: 'CASINO KRALI',
    isVip: true,
    viewers: '12.4K',
    tags: ['🎰 Slot', '🎲 Rulet'],
    avatar: 'https://i.pravatar.cc/150?img=11',
    cover: 'https://picsum.photos/400/225?random=1',
  },
  {
    id: 2,
    name: 'BetMaster',
    isVip: false,
    viewers: '3.2K',
    tags: ['⚽ Spor', '📈 Analiz'],
    avatar: 'https://i.pravatar.cc/150?img=33',
    cover: 'https://picsum.photos/400/225?random=2',
  },
  {
    id: 3,
    name: 'SlotKraliçesi',
    isVip: false,
    viewers: '8.5K',
    tags: ['🎰 Slot', '🔥 Bonanza'],
    avatar: 'https://i.pravatar.cc/150?img=5',
    cover: 'https://picsum.photos/400/225?random=3',
  },
  {
    id: 4,
    name: 'RuletUzmanı',
    isVip: false,
    viewers: '2.1K',
    tags: ['🎲 Rulet', '♠️ Blackjack'],
    avatar: 'https://i.pravatar.cc/150?img=12',
    cover: 'https://picsum.photos/400/225?random=4',
  },
  {
    id: 5,
    name: 'CanlıBahis',
    isVip: false,
    viewers: '5.6K',
    tags: ['⚽ Spor', '🎾 Tenis'],
    avatar: 'https://i.pravatar.cc/150?img=15',
    cover: 'https://picsum.photos/400/225?random=5',
  }
];

export const StreamerShowcase: React.FC = () => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto flex flex-nowrap gap-5 pb-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {DUMMY_STREAMERS.map((streamer, index) => {
          const isVip = streamer.isVip;

          return (
            <div
              key={streamer.id}
              className={`relative flex-shrink-0 group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]
                w-64 rounded-xl overflow-hidden
                bg-[#1a1a24] border border-white/5
                ${isVip ? 'ring-1 ring-yellow-500 shadow-lg shadow-yellow-500/20' : 'hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)]'}
              `}
            >
              {/* Cover Image (16:9 ratio) -> w-64 is 256px, h-36 is 144px */}
              <div className="h-36 w-full relative bg-black">
                <img 
                  src={streamer.cover} 
                  alt="Cover" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a24] to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
                  <div className="bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    CANLI
                  </div>
                  {isVip && (
                    <div className="bg-yellow-500/90 text-black text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                      👑 VIP
                    </div>
                  )}
                </div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transform scale-75 group-hover:scale-100 transition-transform duration-300 ease-out">
                    <svg className="w-5 h-5 ml-1 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="px-4 pb-5 pt-10 relative flex flex-col items-center text-center">
                
                {/* Centered Avatar overlapping the cover bottom edge */}
                {/* Avatar container size: 56px (w-14), absolute positioned at top: -28px */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                  <div className={`relative p-[2px] rounded-full bg-[#1a1a24] ${isVip ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : ''}`}>
                    <img 
                      src={streamer.avatar} 
                      alt={streamer.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#1a1a24]"
                    />
                  </div>
                </div>
                
                <h3 className="text-white font-bold text-[15px] flex items-center gap-1 mb-1 leading-tight mt-1">
                  {streamer.name}
                  {isVip && (
                    <svg className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  )}
                </h3>

                <p className="text-gray-400 text-[11px] mb-2.5 font-medium">
                  {streamer.viewers} İzleyici
                </p>

                <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                  {streamer.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold text-gray-300 bg-black/40 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>
      
      {/* Hide scrollbar styles for WebKit since inline styles don't cover ::-webkit-scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
    </div>
  );
};
