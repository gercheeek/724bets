import re

filename = 'utils/liveWinsData.ts'
with open(filename, 'r') as f:
    content = f.read()

old_data = """const ORIGINAL_GAMES = [
  { name: 'DICE', image: 'https://cdn.softswiss.net/i/s3/spribe/dice.png', isOriginal: true },
  { name: 'LIMBO', image: 'https://cdn.softswiss.net/i/s3/bgaming/SpaceXY.png', isOriginal: true },
  { name: 'KENO', image: 'https://cdn.softswiss.net/i/s3/spribe/keno.png', isOriginal: true },
  { name: 'MINES', image: 'https://cdn.softswiss.net/i/s3/spribe/mines.png', isOriginal: true },
  { name: 'PLINKO', image: 'https://cdn.softswiss.net/i/s3/bgaming/Plinko.png', isOriginal: true },
  { name: 'CRASH', image: 'https://cdn.softswiss.net/i/s3/spribe/aviator.png', isOriginal: true },
  { name: 'WHEEL', image: 'https://cdn.softswiss.net/i/s3/pragmaticexternal/SweetBonanza.png', isOriginal: true },
];"""

new_data = """const ORIGINAL_GAMES = [
  { name: 'DICE', image: '/images/dice_premium.jpg', isOriginal: true },
  { name: 'LIMBO', image: '/images/limbo_premium.jpg', isOriginal: true },
  { name: 'KENO', image: '/images/keno_premium.jpg', isOriginal: true },
  { name: 'MINES', image: '/images/mines_premium.jpg', isOriginal: true },
  { name: 'PLINKO', image: '/images/plinko_premium.jpg', isOriginal: true },
  { name: 'CRASH', image: '/images/crash_premium.jpg', isOriginal: true },
  { name: 'ROULETTE', image: '/images/roulette_premium.jpg', isOriginal: true },
  { name: 'BLACKJACK', image: '/images/blackjack_premium.jpg', isOriginal: true },
];"""

content = content.replace(old_data, new_data)
with open(filename, 'w') as f:
    f.write(content)
print("Updated liveWinsData premium images")
