import React, { useEffect, useState, useCallback } from 'react';
import { createBrowserClient } from '../lib/supabase';
import type { Raffle } from '../types';
import CountdownTimer from './CountdownTimer';
import LiveCodeBox from './LiveCodeBox';
import HowToJoin from './HowToJoin';

interface RaffleWithMeta extends Raffle {
  total_tickets: number;
  max_tickets: number;
  image_url: string;
  end_date: string;
}

const FEATURED_RAFFLE: RaffleWithMeta = {
  id: 'featured-1',
  title: 'Fiat Egea',
  description: 'Sıfır km Fiat Egea Sedan! Katıl, kazan.',
  ticket_price: 8000,
  status: 'active',
  created_at: new Date().toISOString(),
  total_tickets: 6842,
  max_tickets: 10000,
  image_url: '/images/fiat-egea.png',
  end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
};

const SIDE_RAFFLES: RaffleWithMeta[] = [
  {
    id: 'side-1', title: 'iPhone 17 Pro', description: '256 GB Titanyum',
    ticket_price: 3000, status: 'active', created_at: new Date().toISOString(),
    total_tickets: 2100, max_tickets: 3000, image_url: '/images/iphone17.png',
    end_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'side-2', title: 'Monster Laptop', description: 'RTX 4070 · 32GB RAM',
    ticket_price: 5000, status: 'active', created_at: new Date().toISOString(),
    total_tickets: 3000, max_tickets: 3000, image_url: '/images/laptop.png',
    end_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'side-3', title: 'PlayStation 5', description: 'Digital Edition + 2 Oyun',
    ticket_price: 2500, status: 'active', created_at: new Date().toISOString(),
    total_tickets: 1540, max_tickets: 2500, image_url: '/images/ps5.png',
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const NeonBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 animate-pulse" stroke="currentColor" strokeWidth={2}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SideRaffleCard: React.FC<{ raffle: RaffleWithMeta; onBuy: (id: string, price: number) => void | Promise<void> }> = ({ raffle, onBuy }) => {
  const isFull = raffle.total_tickets >= raffle.max_tickets;
  const pct = Math.min((raffle.total_tickets / raffle.max_tickets) * 100, 100);

  return (
    <div className={`
      relative flex flex-col rounded-lg border overflow-hidden
      transition-all duration-300 group
      ${isFull
        ? 'border-zinc-700/40 bg-zinc-900/60 opacity-60 cursor-not-allowed'
        : 'border-zinc-700/60 bg-[#1E2530] hover:border-[#F5A623]/30 hover:shadow-[0_0_24px_rgba(245,166,35,0.08)]'
      }
    `}>
      <div className="relative h-40 bg-black/40 flex items-center justify-center overflow-hidden">
        <img
          src={raffle.image_url}
          alt={raffle.title}
          className="object-contain h-full w-full p-4 group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/280x160/111/333?text=' + encodeURIComponent(raffle.title); }}
        />
        {isFull && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-orange-400 font-black text-sm uppercase tracking-widest border border-orange-400/40 px-3 py-1 rounded-full">
              Bilet Limitine Ulaşıldı
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h3 className="text-white font-bold text-base leading-tight">{raffle.title}</h3>
          <p className="text-zinc-500 text-xs mt-0.5">{raffle.description}</p>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold mb-1.5 text-zinc-400">
            <span>{raffle.total_tickets.toLocaleString('tr-TR')} bilet</span>
            <span>{raffle.max_tickets.toLocaleString('tr-TR')} max</span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: isFull ? '#f97316' : 'linear-gradient(90deg, #F5A623, #FFD580)',
              }}
            />
          </div>
        </div>

        <button
          disabled={isFull}
          onClick={() => onBuy(raffle.id, raffle.ticket_price)}
          className={`
            w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-widest
            flex items-center justify-center gap-2 transition-all
            ${isFull
              ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
              : 'bg-[linear-gradient(135deg,#F5A623,#D4900A)] text-black border-none hover:shadow-[0_0_16px_rgba(245,166,35,0.4)]'
            }
          `}
        >
          <NeonBolt />
          {isFull ? 'Bilet Tükendi' : `Bilet Al — ${raffle.ticket_price.toLocaleString('tr-TR')} Coin`}
        </button>
      </div>
    </div>
  );
}

function FeaturedRaffleCard({
  raffle,
  onTicketCountChange,
  onBuy
}: {
  raffle: RaffleWithMeta;
  onTicketCountChange: (count: number) => void;
  onBuy: (id: string, price: number) => void;
}) {
  const [ticketCount, setTicketCount] = useState(raffle.total_tickets);
  const pct = Math.min((ticketCount / raffle.max_tickets) * 100, 100);

  useEffect(() => {
    onTicketCountChange(ticketCount);
  }, [ticketCount, onTicketCountChange]);

  return (
    <div className="relative rounded-lg border border-[#F5A623]/25 bg-gradient-to-br from-[#1E2530] to-[#141B25] overflow-hidden shadow-[0_0_60px_rgba(245,166,35,0.08)]">
      <div className="absolute top-0 right-0 w-[380px] h-[380px] rounded-full bg-[#F5A623]/5 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-10">
        <div className="flex-1 flex flex-col gap-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5A623] mb-2 block">
              🏆 Öne Çıkan Çekiliş
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {raffle.title}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">{raffle.description}</p>
          </div>

          <CountdownTimer endDate={raffle.end_date} />

          <div>
            <div className="flex justify-between text-xs font-bold mb-2 text-zinc-400">
              <span>
                <span className="text-[#F5A623] text-sm font-black">{ticketCount.toLocaleString('tr-TR')}</span> bilet satıldı
              </span>
              <span>{raffle.max_tickets.toLocaleString('tr-TR')} max</span>
            </div>
            <div className="h-2.5 rounded-full bg-black/40 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(245,166,35,0.5)]"
                style={{
                  width: `${pct}%`,
                  background: 'linear-gradient(90deg, #F5A623 0%, #FFD580 100%)',
                }}
              />
            </div>
          </div>

          <button 
            onClick={() => onBuy(raffle.id, raffle.ticket_price)}
            className="
              group flex items-center justify-center gap-3 w-full md:w-auto
              px-8 py-4 rounded-lg font-black text-base uppercase tracking-widest
              bg-[linear-gradient(135deg,#F5A623_0%,#D4900A_100%)] text-black border-none
              hover:shadow-[0_0_40px_rgba(245,166,35,0.5)] hover:scale-[1.02]
              active:scale-[0.98] transition-all duration-200
            "
          >
            <NeonBolt />
            Bilet Al — {raffle.ticket_price.toLocaleString('tr-TR')} Coin
          </button>
        </div>

        <div className="flex items-center justify-center md:w-72 md:h-72">
          <img
            src={raffle.image_url}
            alt={raffle.title}
            className="object-contain w-full h-full drop-shadow-2xl"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/280x280/1a1000/F5A623?text=🚗'; }}
          />
        </div>
      </div>
    </div>
  );
}

interface CekilisCenterViewProps {
  config?: any;
  loyaltyConfig?: any;
  userId: string;
  onNavigate: (v: string) => void;
}

export default function CekilisCenterView({ userId, onNavigate }: CekilisCenterViewProps) {
  const supabase = createBrowserClient();
  const [sideRaffles, setSideRaffles] = useState<RaffleWithMeta[]>(SIDE_RAFFLES);
  const [featured, setFeatured] = useState<RaffleWithMeta>(FEATURED_RAFFLE);

  const handleFeaturedTicketChange = useCallback((count: number) => {
    setFeatured(prev => ({ ...prev, total_tickets: count }));
  }, []);

  const handleBuyTicket = async (raffleId: string, price: number) => {
    if (!userId || userId === 'guest') {
      alert('Bilet almak için giriş yapmalısınız.');
      return;
    }
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('coin_balance')
        .eq('id', userId)
        .single();
      
      if (userError || !userData) {
        alert('Kullanıcı bakiyesi alınamadı. Lütfen giriş yaptığınızdan emin olun.');
        return;
      }

      if (userData.coin_balance < price) {
        alert('Yetersiz bakiye! Canlı yayın şifrelerini girerek veya görevleri tamamlayarak coin kazanabilirsiniz.');
        return;
      }

      const { error: ticketError } = await supabase
        .from('tickets')
        .insert({
          user_id: userId,
          raffle_id: raffleId,
          win_chance_multiplier: 1
        });

      if (ticketError) {
        alert('Bilet alımı başarısız oldu: ' + ticketError.message);
        return;
      }

      const { error: balanceError } = await supabase
        .from('users')
        .update({ coin_balance: userData.coin_balance - price })
        .eq('id', userId);

      if (balanceError) {
        console.error('Bakiye güncellenemedi:', balanceError);
      } else {
        alert('Tebrikler! Bilet başarıyla alındı.');
      }
    } catch (err: any) {
      alert('Bir hata oluştu: ' + err.message);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('raffle-tickets-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tickets' },
        (payload) => {
          const newTicket = payload.new as { raffle_id: string };

          if (newTicket.raffle_id === FEATURED_RAFFLE.id) {
            setFeatured(prev => ({
              ...prev,
              total_tickets: prev.total_tickets + 1,
            }));
          }

          setSideRaffles(prev =>
            prev.map(r =>
              r.id === newTicket.raffle_id
                ? { ...r, total_tickets: r.total_tickets + 1 }
                : r
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <main className="min-h-screen font-sans" style={{ background: 'linear-gradient(135deg, #050C18 0%, #0A1428 50%, #050C18 100%)' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F5A623]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-[900px] mx-auto px-4 py-10 space-y-12">
        <LiveCodeBox userId={userId} />

        <FeaturedRaffleCard
          raffle={featured}
          onTicketCountChange={handleFeaturedTicketChange}
          onBuy={handleBuyTicket}
        />

        <section>
          <h2 className="text-lg font-black uppercase tracking-widest text-zinc-400 mb-5">
            Aktif Çekilişler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sideRaffles.map(r => (
              <SideRaffleCard key={r.id} raffle={r} onBuy={handleBuyTicket} />
            ))}
          </div>
        </section>

        <HowToJoin />
      </div>
    </main>
  );
}
