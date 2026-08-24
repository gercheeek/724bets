import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

avatar_logic = """const GAMBLING_AVATARS = ['🎰', '🎲', '🃏', '💰', '💎', '🏆', '👑', '🪙', '💵', '💸', '🎱', '🍀', '🧿', '🤑', '💳', '🚀', '🍒', '🍋', '🍉', '🔔', '🔮', '🐎', '🏎️', '🎯'];
const getAvatarEmoji = (name: string) => {
    if (!name) return '👤';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return GAMBLING_AVATARS[Math.abs(hash) % GAMBLING_AVATARS.length];
};
"""

# Inject before ModernChat component
content = content.replace("const ModernChat: React.FC<ModernChatProps>", avatar_logic + "\nconst ModernChat: React.FC<ModernChatProps>")

old_avatar_div = """                                {/* Cybet Style Avatar */}
                                <div className="w-[34px] h-[34px] shrink-0 rounded-full border-[1.5px] border-white/5 bg-[#161B26] shadow-sm flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${userName}&backgroundColor=transparent`} alt="avatar" className="w-[28px] h-[28px]" />
                                </div>"""

new_avatar_div = """                                {/* Gambling Emoji Avatar */}
                                <div className="w-[34px] h-[34px] shrink-0 rounded-full border-[1.5px] border-white/10 bg-gradient-to-br from-[#161B26] to-[#0A0D14] shadow-sm flex items-center justify-center overflow-hidden text-[18px] drop-shadow-md">
                                    {getAvatarEmoji(userName)}
                                </div>"""

content = content.replace(old_avatar_div, new_avatar_div)

with open(filename, 'w') as f:
    f.write(content)
print("Updated Avatars to Gambling Emojis")
