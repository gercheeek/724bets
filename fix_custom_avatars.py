import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_avatars = """const GAMBLING_AVATARS = [
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

new_avatars = """const GAMBLING_AVATARS = [
    '/assets/avatars/rocket.jpg',
    '/assets/avatars/diamond.jpg',
    '/assets/avatars/coin.jpg',
    '/assets/avatars/crown.jpg'
];"""

# Also, the image tag in the JSX has `object-contain`. Because these have a solid #151A23 background, 
# we should make the img fill the container so the background blends perfectly.
# `className="w-[22px] h-[22px] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"`
# We should change it to: `className="w-full h-full object-cover"`
# Wait, let's just make it `w-full h-full object-cover` and remove drop shadow because it has its own background.

old_img_tag = """<div className="w-[34px] h-[34px] shrink-0 rounded-full border-[1.5px] border-white/10 bg-[#151A23] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden drop-shadow-md">
                                    <img src={getAvatarEmoji(userName)} alt="avatar" className="w-[22px] h-[22px] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                </div>"""

new_img_tag = """<div className="w-[34px] h-[34px] shrink-0 rounded-full border-[1.5px] border-white/10 bg-[#151A23] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden drop-shadow-md">
                                    <img src={getAvatarEmoji(userName)} alt="avatar" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                                </div>"""

content = content.replace(old_avatars, new_avatars)
content = content.replace(old_img_tag, new_img_tag)

with open(filename, 'w') as f:
    f.write(content)
print("Updated to Custom Rendered Emojis")
