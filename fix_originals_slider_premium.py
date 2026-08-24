import re

filename = 'components/OriginalsSlider.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_data = """export const getOriginalsData = (t?: (key: string) => string): any[] => [
  { id: 'plinko', name: 'Plinko', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/Plinko.png', path: 'plinko' },
  { id: 'mines', name: 'Mines', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/spribe/mines.png', path: 'mines' },
  { id: 'crash', name: 'Crash Aviator', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/spribe/aviator.png', path: 'crash' },
  { id: 'dice', name: 'Dice Master', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/spribe/dice.png', path: 'dice' },
  { id: 'wheel', name: 'Fortune Wheel', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/FrenchRoulette.png', path: 'wheel' },
  { id: 'limbo', name: 'Limbo Rocket', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/SpaceXY.png', path: 'limbo' },
  { id: 'blackjack', name: 'Blackjack', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/BlackjackSurrender.png', path: 'blackjack' },
  { id: 'raffle', name: 'Çekiliş Parkı', category: 'Originals', provider: '724games', img: 'https://cdn.softswiss.net/i/s3/bgaming/LuckySweets.png', path: 'raffle' },
];"""

new_data = """export const getOriginalsData = (t?: (key: string) => string): any[] => [
  { id: 'plinko', name: 'Plinko', category: 'Originals', provider: '724games', img: '/images/plinko_premium.jpg', path: 'plinko' },
  { id: 'mines', name: 'Mines', category: 'Originals', provider: '724games', img: '/images/mines_premium.jpg', path: 'mines' },
  { id: 'crash', name: 'Crash', category: 'Originals', provider: '724games', img: '/images/crash_premium.jpg', path: 'crash' },
  { id: 'dice', name: 'Dice', category: 'Originals', provider: '724games', img: '/images/dice_premium.jpg', path: 'dice' },
  { id: 'wheel', name: 'Roulette', category: 'Originals', provider: '724games', img: '/images/roulette_premium.jpg', path: 'wheel' },
  { id: 'limbo', name: 'Limbo', category: 'Originals', provider: '724games', img: '/images/limbo_premium.jpg', path: 'limbo' },
  { id: 'blackjack', name: 'Blackjack', category: 'Originals', provider: '724games', img: '/images/blackjack_premium.jpg', path: 'blackjack' },
  { id: 'keno', name: 'Keno', category: 'Originals', provider: '724games', img: '/images/keno_premium.jpg', path: 'keno' },
];"""

content = content.replace(old_data, new_data)
with open(filename, 'w') as f:
    f.write(content)
print("Updated OriginalsSlider premium images")
