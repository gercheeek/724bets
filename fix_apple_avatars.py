import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_avatars = """const GAMBLING_AVATARS = [
    '/assets/avatars/bell_3d.png',
    '/assets/avatars/lemon_3d.png',
    '/assets/avatars/cherries_3d.png',
    '/assets/avatars/money_bag_3d.png',
    '/assets/avatars/coin_3d.png',
    '/assets/avatars/gem_stone_3d.png',
    '/assets/avatars/crown_3d.png',
    '/assets/avatars/trophy_3d.png',
    '/assets/avatars/fire_3d.png',
    '/assets/avatars/rocket_3d.png',
    '/assets/avatars/four_leaf_clover_3d.png'
];"""

new_avatars = """const GAMBLING_AVATARS = [
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f514.png', // Bell
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f4b0.png', // Money Bag
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f352.png', // Cherry
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f34b.png', // Lemon
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f525.png', // Fire
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f680.png', // Rocket
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f48e.png', // Gem
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f451.png', // Crown
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f3c6.png', // Trophy
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f340.png', // Clover
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1fa99.png', // Coin
    'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/14.0.0/img/apple/64/1f0cf.png'  // Joker
];"""

content = content.replace(old_avatars, new_avatars)
with open(filename, 'w') as f:
    f.write(content)
print("Updated to Apple Emojis")
