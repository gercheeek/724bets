import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameCard } from './GameCards';
import { ALL_GAMES, DEMO_GAMES } from '../data/games';

export default function DynamicPopularGames({ onGameSelect, onViewChange }: { onGameSelect: (game: any) => void, onViewChange?: (view: string) => void }) {
  const [dynamicPopularGames, setDynamicPopularGames] = useState<any[]>([]);

  const shuffleGamesList = (gamesArray: any[]) => {
    const arr = [...gamesArray];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/casino/games');
        const data = await res.json();
        if (data.success && Array.isArray(data.games)) {
          // Normal API verisini formatla
          const mapped = data.games.map((g: any) => ({
            id: g.id,
            name: g.name,
            provider: g.provider,
            category: g.type === 'live' ? 'live' : 'slots',
            img: g.image,
            image: g.image,
            vendorCode: g.vendorCode,
            gameCode: g.gameCode
          }));

          // Premium Oyunların tam ve kesin isimleri (varyasyon kirliliğini önlemek için)
          const premiumExactNames = [
            'gates of olympus 1000', 'gates of olympus super scatter', 'sweet bonanza', 'sweet bonanza 1000', 
            'le bandit', 'sweet bonanza 2500', 'sugar rush 1000', 'big bass bonanza 1000', 'gates of olympus', 
            'starlight princess super scatter', 'sweet bonanza dice', 'skull fiesta', 'sweet bonanza xmas', 
            'duck hunters: happy hour', 'starlight princess 1000', 'le santa', 'big bass splash 1000', 
            'big bass vegas double down deluxe', 'big bass bonanza', 'sugar rush super scatter', 
            'bigger bass bonanza', 'shining dice', 'gates of olympus xmas 1000', 'flaming hot extreme bell link', 
            'clover gold', 'big bass halloween', 'sweet rush bonanza', 'mythical treasure', 
            'sweet bonanza super scatter', 'big bass splash', 'gold party', '7 clovers of fortune', 
            'better barn house bonanza', 'big bass secrets of the golden lake', 'wisdom of athena 1000 xmas', 
            'the dog house megaways 1000', 'christmas big bass bonanza', 'big bass christmas – frozen lake', 
            'fortune of olympus', 'wisdom of athena 1000', 'wild wild riches', 'big bass - hold & spinner', 
            '777 wheel blitz', 'epic ze zeus', '40 super hot bell link', '40 burning hot bell link', 
            'tanked', 'lobster house', 'dork unit', '40 shining crown bell link', 'queenie', 'seker bey bell link', 
            'shining crown', 'duck hunters', 'wild wild riches megaways', 'monkey warrior', 'aztec treasure', 
            'vampires vs wolves', 'hot chilli', 'tree of riches', 'john hunter and the tomb of the scarab queen', 
            'super joker', 'fire strike', 'hercules and pegasus', 'greek gods', 'money mouse', 'buffalo king', 
            'magic journey', 'release the kraken', 'super 7s', 'master joker', 'lucky dragons', 'journey to the west', 
            'jurassic giants', '888 dragons', '3 genie wishes', 'hercules son of zeus', 'dragon kingdom', 
            'ancient egypt classic', 'triple dragons', 'dwarven gold deluxe', 'romeo and juliet', 
            'hockey league wild match'
          ];

          const topGames: any[] = [];
          const otherGames: any[] = [];

          // Tekrarı önlemek için (Örn: iki tane Sweet Bonanza çıkmasın diye) base kelimeleri takip et
          const usedBases = new Set<string>();

          mapped.forEach((game) => {
            const gameName = (game.name || '').toLowerCase().trim();
            const normGameName = gameName.replace(/[^a-z0-9 ]/g, "");
            
            // Eğer resim yoksa veya hatalı bir görsel URL'si ise bu oyunu tamamen atla
            const hasValidImage = game.img && typeof game.img === 'string' && game.img.length > 15 && !game.img.includes('placeholder');
            
            if (hasValidImage) {
               // Tam eşleşme kontrolü (Sweet Bonanza Dice vb. varyasyonları elemek için)
               const hitIndex = premiumExactNames.findIndex(name => {
                 const normName = name.replace(/[^a-z0-9 ]/g, "");
                 return normName === normGameName || normName.includes(normGameName) || normGameName.includes(normName);
               });
               
               if (hitIndex !== -1) {
                 topGames.push({ ...game, hitIndex });
               } else {
                 // Sadece çok bilinen kelimeleri barındırıp varyant olanları (Dice vb.) ayıkla
                 const isSpamVariant = gameName.includes('dice') || gameName.includes('candyland') || gameName.includes('auto');
                 
                 if (!isSpamVariant) {
                   otherGames.push(game);
                 }
               }
            }
          });

          // Top oyunları belirlediğimiz kalite sırasına göre diz
          topGames.sort((a, b) => a.hitIndex - b.hitIndex);
          
          // Geriye kalan oyunları karıştır (rastgelelik hissi için)
          const shuffledOthers = shuffleGamesList(otherGames);

          // Top oyunları en başa al, sonuna karıştırılmış diğer oyunları ekle, toplam 16 oyun slider için
          const finalPopularList = [...topGames, ...shuffledOthers].slice(0, 16);

          setDynamicPopularGames(finalPopularList);
        }
      } catch (e) {
        console.error('Failed to fetch popular games:', e);
      }
    };
    fetchGames();
  }, []);

  if (dynamicPopularGames.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Star size={24} className="text-[#FFC107] animate-pulse" />
          <h2 className="text-xl md:text-2xl font-black text-white">Popüler Oyunlar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onViewChange?.('casino')}
            className="text-[11px] md:text-xs font-black text-white hover:text-white transition-all flex items-center gap-1 group cursor-pointer border border-[#00E5FF]/30 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/30 px-3.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] uppercase tracking-wider"
          >
            <span>Tümünü Gör</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform text-[#00E5FF] drop-shadow-[0_0_3px_#00E5FF]" />
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="w-full overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar" style={{ scrollBehavior: 'smooth' }}>
        <div className="grid grid-rows-2 grid-flow-col gap-2 md:gap-3 min-w-max animate-fade-in relative px-1 md:px-0">
          {dynamicPopularGames.map((game) => (
            <div key={game.id} className="animate-in fade-in duration-500 w-[110px] sm:w-[130px] md:w-[150px] lg:w-[170px] shrink-0 snap-start">
              <GameCard game={game} onClick={() => onGameSelect(game)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
