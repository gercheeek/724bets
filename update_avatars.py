import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace the text emoji avatar logic with the new 3D PNG logic
old_avatar_logic = """const GAMBLING_AVATARS = ['🎰', '🎲', '🃏', '💰', '💎', '🏆', '👑', '🪙', '💵', '💸', '🎱', '🍀', '🧿', '🤑', '💳', '🚀', '🍒', '🍋', '🍉', '🔔', '🔮', '🐎', '🏎️', '🎯'];
const getAvatarEmoji = (name: string) => {
    if (!name) return '👤';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return GAMBLING_AVATARS[Math.abs(hash) % GAMBLING_AVATARS.length];
};"""

new_avatar_logic = """const GAMBLING_AVATARS = [
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
];
const getAvatarEmoji = (name: string) => {
    if (!name) return GAMBLING_AVATARS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return GAMBLING_AVATARS[Math.abs(hash) % GAMBLING_AVATARS.length];
};"""

content = content.replace(old_avatar_logic, new_avatar_logic)

old_avatar_div = """                                {/* Gambling Emoji Avatar */}
                                <div className="w-[34px] h-[34px] shrink-0 rounded-full border-[1.5px] border-white/10 bg-gradient-to-br from-[#161B26] to-[#0A0D14] shadow-sm flex items-center justify-center overflow-hidden text-[18px] drop-shadow-md">
                                    {getAvatarEmoji(userName)}
                                </div>"""

new_avatar_div = """                                {/* 3D Casino Avatar */}
                                <div className="w-[34px] h-[34px] shrink-0 rounded-full border-[1.5px] border-white/10 bg-[#151A23] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden drop-shadow-md">
                                    <img src={getAvatarEmoji(userName)} alt="avatar" className="w-[22px] h-[22px] object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                                </div>"""

content = content.replace(old_avatar_div, new_avatar_div)

with open(filename, 'w') as f:
    f.write(content)
print("Updated to 3D PNG avatars")
