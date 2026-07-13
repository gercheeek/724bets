import React from 'react';

const categories = [
  { id: 'spor', title: 'SPOR', image: '/menu-spor.webp', url: 'https://bahisbey1438.com/tr/sport/?btag=59649488_330539' },
  { id: 'canli-bahis', title: 'CANLI BAHİS', image: '/menu-canli.webp', url: 'https://bahisbey1438.com/tr/sport/live/football/?btag=59649488_330539' },
  { id: 'casino', title: 'CASINO', image: '/menu-casino.webp', url: 'https://bahisbey1438.com/tr/lobby/casino/?btag=59649488_330539' },
  { id: 'canli-casino', title: 'CANLI CASINO', image: '/menu-canli-casino.png', url: 'https://bahisbey1438.com/tr/lobby/livecasino/?btag=59649488_330539' },
  { id: 'haberler', title: 'HABERLER', image: '/menu-haberler.webp', url: 'https://bahisbey1438.com/tr/sport/sports/football/flt-1-1239-52530/?btag=59649488_330539' },
];

const CategoryNav: React.FC = () => {
  return (
    <div className="w-full bg-[#1e222d] py-6 px-4 my-4 flex justify-center">
      <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto hide-scrollbar max-w-[1200px] w-full justify-start md:justify-center">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0 w-[90px] sm:w-[100px] md:w-[120px]" 
            onClick={() => {
              const event = new CustomEvent('internal-navigate', { detail: { url: cat.url } });
              window.dispatchEvent(event);
            }}
          >
            {/* The square image container matching the provided images */}
            <div className="w-full aspect-square rounded-[24px] overflow-hidden bg-[#0d1f18] transition-transform duration-300 group-hover:scale-105 shadow-md">
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = '0';
                }}
              />
            </div>
            
            {/* Clean, bold white text centered below the icon */}
            <span className="text-white font-black text-[13px] tracking-wide uppercase text-center w-full">
              {cat.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
