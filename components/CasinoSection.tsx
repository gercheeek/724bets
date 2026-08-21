import React, { useState, useRef } from 'react';
import { Play, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export interface CasinoProvider {
    id: string;
    name: string;
    logoUrl: string;
}

export interface CasinoGame {
    id: string;
    name: string;
    provider: string;
    imageUrl: string;
    category: string[];
    isNew?: boolean;
    isHot?: boolean;
}

const DUMMY_PROVIDERS: CasinoProvider[] = [
  { id: 'pragmatic', name: 'Pragmatic Play', logoUrl: '' },
  { id: 'hacksaw', name: 'Hacksaw Gaming', logoUrl: '' },
  { id: 'nolimit', name: 'Nolimit City', logoUrl: '' },
  { id: 'netent', name: 'NetEnt', logoUrl: '' },
  { id: 'evolution', name: 'Evolution', logoUrl: '' }
];

const DUMMY_GAMES: CasinoGame[] = [
  { id: '1', name: 'Harvest Moon Grave Profits', provider: 'Hacksaw Gaming', imageUrl: 'https://static.724bets.net/assets/gamdom/69619213e50005ce8b3ba6c8', category: ['Tümü', 'Yeni'], isNew: true },
  { id: '2', name: 'Epic Ze Zeus', provider: 'Hacksaw Gaming', imageUrl: 'https://static.724bets.net/assets/gamdom/696192e7e50005ce8b3ba6d8', category: ['Tümü', 'Popüler'], isHot: true },
  { id: '3', name: 'Sweet Bonanza 1000', provider: 'Pragmatic Play', imageUrl: 'https://static.724bets.net/assets/gamdom/69619239a785ba830d7fa571', category: ['Tümü', 'Popüler', 'Çok Kazandıranlar'] },
  { id: '4', name: 'Gates of Olympus', provider: 'Pragmatic Play', imageUrl: 'https://static.724bets.net/assets/gamdom/69619375e50005ce8b3ba6e3', category: ['Tümü', 'Popüler', 'Slotlar'] },
  { id: '5', name: 'Starlight Princess', provider: 'Pragmatic Play', imageUrl: 'https://static.724bets.net/assets/gamdom/696193b3e50005ce8b3ba6e8', category: ['Tümü', 'Slotlar'] },
  { id: '6', name: 'Le Santa', provider: 'Hacksaw Gaming', imageUrl: 'https://static.724bets.net/assets/gamdom/696fcef7a785ba830d807dfd', category: ['Tümü', 'Yeni'] },
  { id: '7', name: 'Sugar Rush', provider: 'Pragmatic Play', imageUrl: 'https://static.724bets.net/assets/gamdom/69619116e50005ce8b3ba6c3', category: ['Tümü', 'Popüler'] },
  { id: '8', name: 'Big Bass Splash', provider: 'Pragmatic Play', imageUrl: 'https://static.724bets.net/assets/gamdom/69871079a28de9631a0a5b9b', category: ['Tümü', 'Popüler'] },
  { id: '9', name: 'Lightning Roulette', provider: 'Evolution', imageUrl: 'https://static.724bets.net/assets/gamdom/69619198a785ba830d7fa56a', category: ['Tümü', 'Canlı Casino'] },
  { id: '10', name: 'Crazy Time', provider: 'Evolution', imageUrl: 'https://static.724bets.net/assets/gamdom/69619187a785ba830d7fa567', category: ['Tümü', 'Canlı Casino'] },
];

const CATEGORIES = ['Tümü', 'Popüler', 'Yeni', 'Slotlar', 'Canlı Casino', 'Çok Kazandıranlar', 'Bonus Satın Al'];

export default function CasinoSection() {
  const [activeCategory, setActiveCategory] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  
  const providersRef = useRef<HTMLDivElement>(null);

  const scrollProviders = (direction: 'left' | 'right') => {
    if (providersRef.current) {
      const scrollAmount = 200;
      providersRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredGames = DUMMY_GAMES.filter(game => {
    const cleanSearch = searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanGameName = game.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const matchesSearch = cleanSearch === '' || cleanGameName.includes(cleanSearch);
    const matchesCategory = activeCategory === 'Tümü' || game.category.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Search and Minimal Filter (Pills) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Slotra Style Tabs / Pills */}
        <div className="flex overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Minimal Search */}
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Oyun ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Providers Slider */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Sağlayıcılar
          </h2>
          <div className="flex gap-2">
            <button onClick={() => scrollProviders('left')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scrollProviders('right')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div 
          ref={providersRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {DUMMY_PROVIDERS.map(provider => (
            <div 
              key={provider.id} 
              className="flex-shrink-0 snap-start w-32 h-16 bg-[#1a202c] border border-white/5 rounded-xl flex items-center justify-center hover:border-blue-500/50 hover:bg-[#2d3748] transition-all cursor-pointer group"
            >
               <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors text-center px-2">{provider.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Games Grid (GameCard) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredGames.map(game => (
          <div 
            key={game.id} 
            className="group relative rounded-xl overflow-hidden bg-gray-900 border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 aspect-[3/4]"
          >
            <img 
              src={game.imageUrl} 
              alt={game.name} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400/1a202c/ffffff?text=7/24Bets';
              }}
            />
            
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {game.isNew && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">YENİ</span>}
              {game.isHot && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">POPÜLER</span>}
            </div>

            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4">
              <button className="bg-blue-500 hover:bg-blue-400 text-white rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-blue-500/50">
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </button>
              <div className="absolute bottom-4 left-0 right-0 text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                <p className="text-white font-bold text-sm truncate px-2">{game.name}</p>
                <p className="text-gray-300 text-xs truncate px-2">{game.provider}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
