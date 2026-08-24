import re

filename = 'utils/liveWinsData.ts'
with open(filename, 'r') as f:
    content = f.read()

old_originals = """const ORIGINAL_GAMES = [
  { name: 'DICE', image: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', isOriginal: true },
  { name: 'LIMBO', image: 'linear-gradient(135deg, #FBBF24, #F59E0B)', isOriginal: true },
  { name: 'KENO', image: 'linear-gradient(135deg, #A855F7, #8B5CF6)', isOriginal: true },
  { name: 'MINES', image: 'linear-gradient(135deg, #10B981, #059669)', isOriginal: true },
  { name: 'PLINKO', image: 'linear-gradient(135deg, #EC4899, #DB2777)', isOriginal: true },
  { name: 'CRASH', image: 'linear-gradient(135deg, #3B82F6, #2563EB)', isOriginal: true },
  { name: 'WHEEL', image: 'linear-gradient(135deg, #14B8A6, #0D9488)', isOriginal: true },
];"""

new_originals = """const ORIGINAL_GAMES = [
  { name: 'DICE', image: 'https://cdn.softswiss.net/i/s3/spribe/dice.png', isOriginal: true },
  { name: 'LIMBO', image: 'https://cdn.softswiss.net/i/s3/bgaming/SpaceXY.png', isOriginal: true },
  { name: 'KENO', image: 'https://cdn.softswiss.net/i/s3/spribe/keno.png', isOriginal: true },
  { name: 'MINES', image: 'https://cdn.softswiss.net/i/s3/spribe/mines.png', isOriginal: true },
  { name: 'PLINKO', image: 'https://cdn.softswiss.net/i/s3/bgaming/Plinko.png', isOriginal: true },
  { name: 'CRASH', image: 'https://cdn.softswiss.net/i/s3/spribe/aviator.png', isOriginal: true },
  { name: 'WHEEL', image: 'https://cdn.softswiss.net/i/s3/pragmaticexternal/SweetBonanza.png', isOriginal: true },
];"""

content = content.replace(old_originals, new_originals)
with open(filename, 'w') as f:
    f.write(content)
print("Updated liveWinsData to use real images")
