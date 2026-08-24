import re

filename = 'components/OriginalsSlider.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_data = """export const getOriginalsData = (t?: (key: string) => string): any[] => [
  { id: 'plinko', name: 'Plinko 724', category: 'Originals', provider: '724bets', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop', path: 'pool' },
  { id: 'mines', name: 'Mines 724', category: 'Originals', provider: '724bets', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop', path: 'pool' },
  { id: 'crash', name: 'Crash Aviator', category: 'Originals', provider: '724bets', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop', path: 'pool' },
  { id: 'dice', name: 'Dice Master', category: 'Originals', provider: '724bets', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=400&auto=format&fit=crop', path: 'pool' },
  { id: 'wheel', name: 'Fortune Wheel', category: 'Originals', provider: '724bets', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop', path: 'wheel' },
  { id: 'limbo', name: 'Limbo Rocket', category: 'Originals', provider: '724bets', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400&auto=format&fit=crop', path: 'pool' },
  { id: 'blackjack', name: 'Blackjack 21', category: 'Originals', provider: '724bets', img: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?q=80&w=400&auto=format&fit=crop', path: 'blackjack' },
  { id: 'raffle', name: 'Çekiliş Parkı', category: 'Originals', provider: '724bets', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&auto=format&fit=crop', path: 'raffle' },
];"""

new_data = """export const getOriginalsData = (t?: (key: string) => string): any[] => [
  { id: 'plinko', name: 'Plinko', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/Plinko.png', path: 'plinko' },
  { id: 'mines', name: 'Mines', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/spribe/mines.png', path: 'mines' },
  { id: 'crash', name: 'Crash Aviator', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/spribe/aviator.png', path: 'crash' },
  { id: 'dice', name: 'Dice Master', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/spribe/dice.png', path: 'dice' },
  { id: 'wheel', name: 'Fortune Wheel', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/FrenchRoulette.png', path: 'wheel' },
  { id: 'limbo', name: 'Limbo Rocket', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/SpaceXY.png', path: 'limbo' },
  { id: 'blackjack', name: 'Blackjack', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/BlackjackSurrender.png', path: 'blackjack' },
  { id: 'raffle', name: 'Çekiliş Parkı', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/LuckySweets.png', path: 'raffle' },
];"""

content = content.replace(old_data, new_data)
with open(filename, 'w') as f:
    f.write(content)
print("Updated OriginalsSlider images")
