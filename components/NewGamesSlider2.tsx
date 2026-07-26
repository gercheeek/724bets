import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface Game {
  id: string | number;
  name: string;
  provider: string;
  img: string;
  players: number;
  demoSymbol?: string;
  customDemoUrl?: string;
}

const NEW_GAMES_2: Game[] = [
  { id: 1160, name: 'Out of the Woods', provider: 'Pragmatic Play', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5523109e9fec840eaeed00', demoSymbol: 'vs25bstackwild', players: 278 },
  { id: 1161, name: 'Legion Gold And The Throne Of Dead', provider: 'Play\'n GO', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5523235229c24dca9f40d6', customDemoUrl: 'https://acccw.playngonetwork.com/casino/ContainerLauncher?pid=1857&brand=b2b_anj&gid=throneofdead&practice=1&lang=en_GB&div=gameWrapper&embedmode=iframe&channel=mobile&origin=https%3A%2F%2Fslotra.com', players: 335 },
  { id: 1162, name: 'Big Bass Blast', provider: 'Pragmatic Play', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a4f6a30db4d711f8d6a96e9', demoSymbol: 'vs10bbasblitz', players: 190 },
  { id: 1163, name: 'The Dog House Megaways 1000', provider: 'Pragmatic Play', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5524d03da928ad473ccbc8', demoSymbol: 'vswaysdh1000', players: 371 },
  { id: 1164, name: 'Arena of Iron', provider: 'Hacksaw Gaming', img: 'https://zvrkntplm.com/media/pictures/290x342/quality/51/format/avif/6a5524e39666981d0311ce45', customDemoUrl: 'https://d2sx83al1f82za.cloudfront.net/2309/1.4.4/index.html?language=en&channel=mobile&gameid=2309&mode=2&token=123token&partner=slotra&env=https://d2sx83al1f82za.cloudfront.net/demo/api&realmoneyenv=https://d2sx83al1f82za.cloudfront.net/api&alwaysredirect=true', players: 449 },
  { id: 1165, name: 'Sugar Twist 1000', provider: 'Pragmatic Play', img: 'https://mediumrare.imgix.net/2782fa43a134b33c6c44f35edaa6850ef5cf9899a8a2efa9a2450ba5d30f5610?w=300&h=400&fit=min&auto=format', customDemoUrl: 'https://demogamesfree.mknyxfbxou.net/gs2c/html5Game.do?extGame=1&symbol=vsrar20twistrx&gname=Sugar%20Twist%201000&jurisdictionID=99&lobbyUrl=https%3A%2F%2Fstake.com%2Fcasino%2Fhome&mgckey=stylename@rare_stake~SESSION@1272df06-f6c4-4881-b06e-c2de368bd799', players: 512 },
  { id: 1166, name: 'Undead Farm', provider: 'Hacksaw Gaming', img: 'https://mediumrare.imgix.net/79a6b3ce1158894cb6b085dc8d6fed994321449e248d49796b52ff0e38a742e0?w=560&h=750&fit=min&auto=format', customDemoUrl: 'https://play.launcher-gg.com/game/undead-farm-v4/static/index.html?lang=tr&urlCdn=https%3A%2F%2Ftl-cdn-trlfb.click&mode=redirect&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtIjowLCJyZ3MiOiJodHRwczovL3BsYXkubGF1bmNoZXItZ2cuY29tL2dhbWUvdW5kZWFkLWZhcm0tdjQvIiwicyI6IkVVUnxzb2Z0c3dpc3N8ZWFzeWdvfGN1cmFjYW8iLCJnIjoidW5kZWFkLWZhcm0tOTYiLCJjIjoiRVVSIiwiaWF0IjoxNzg0Mjk4NDIxLCJleHAiOjE3ODQ0NzEyMjF9.ezQk7i5dDj5ZAvFKTCNsNTYYrBFRbI0tuAjRf0HeOr8', players: 384 },
  { id: 1167, name: 'Big Bass Rock and Roll', provider: 'Pragmatic Play', img: 'https://mediumrare.imgix.net/49950a8148c358e88455c78d8dd1abfbeb8d2dd31a7b7971f5515ae4091b6429?w=300&h=400&fit=min&auto=format', customDemoUrl: 'https://demogamesfree.mknyxfbxou.net/gs2c/html5Game.do?extGame=1&symbol=vs10bbrrh&gname=Big%20Bass%20Rock%20and%20Roll&jurisdictionID=99&lobbyUrl=https%3A%2F%2Fstake.com%2Fcasino%2Fhome&mgckey=stylename@rare_stake~SESSION@2686b1a0-7131-4bb4-876f-b16b67d01483', players: 485 },
  { id: 1168, name: 'Sweet Bonanza 2500', provider: 'Pragmatic Play', img: 'https://mediumrare.imgix.net/76411df1039d658a8b9c9f90c14467c7ca7c240feeed97274ea73208d786484e?w=300&h=400&fit=min&auto=format', customDemoUrl: 'https://demogamesfree.mknyxfbxou.net/gs2c/html5Game.do?extGame=1&symbol=vs20swbon2500&gname=Sweet%20Bonanza%202500&jurisdictionID=99&lobbyUrl=https%3A%2F%2Fstake.com%2Fcasino%2Fhome&mgckey=stylename@rare_stake~SESSION@7066ab78-b1aa-4060-b2e2-6c141cd7723e', players: 632 }
];

interface NewGamesSlider2Props {
  onPlayGame: (game: Game) => void;
}

export const NewGamesSlider2 = ({ onPlayGame }: NewGamesSlider2Props) => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
      setScrollPosition(newScroll);
    }
  };

  return (
    <div className="w-full mt-6 mb-8 px-2">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{t('newly_added')}</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {NEW_GAMES_2.map((game) => (
          <div key={game.id} className="shrink-0 snap-start flex flex-col items-center group">
            <div 
              onClick={() => onPlayGame(game)}
              className="w-[110px] h-[137px] sm:w-[120px] sm:h-[150px] md:w-[130px] md:h-[162px] lg:w-[140px] lg:h-[175px] xl:w-[150px] xl:h-[187px] relative rounded-2xl overflow-hidden cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_40px_rgba(54,255,196,0.25)] transition-all duration-500 transform group-hover:-translate-y-2 border border-white/5 hover:border-[#36ffc4]/30 bg-[#1a1c24]"
            >
              
              <img src={game.img} alt={game.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              
              {/* Glow behind image on hover */}
              <div className="absolute inset-0 bg-[#36ffc4]/0 group-hover:bg-[#36ffc4]/10 transition-colors duration-500 mix-blend-overlay z-10"></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

              {/* Play button appears on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-[#10b981] to-[#36ffc4] hover:from-[#00E676] hover:to-[#10b981] shadow-[0_0_20px_rgba(54,255,196,0.5)] flex items-center justify-center border border-white/20 transform scale-90 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-black fill-current ml-1" />
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
