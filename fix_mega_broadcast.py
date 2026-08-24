import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add event listener for send_mega_broadcast
broadcast_listener = """
        const handleBroadcast = (e: CustomEvent<string>) => {
            const newMsg: Message = {
                id: Date.now().toString(),
                user: {
                    id: 'system',
                    name: 'MEGA DUYURU',
                    role: 'admin',
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=system'
                },
                content: `[BROADCAST] ${e.detail}`,
                timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, newMsg]);
            setTimeout(scrollToBottom, 100);
        };

        window.addEventListener('send_mega_broadcast', handleBroadcast as EventListener);
"""

content = content.replace("window.addEventListener('clear_chat', handleClear);", "window.addEventListener('clear_chat', handleClear);\n" + broadcast_listener)
content = content.replace("window.removeEventListener('clear_chat', handleClear);", "window.removeEventListener('clear_chat', handleClear);\n            window.removeEventListener('send_mega_broadcast', handleBroadcast as EventListener);")

# Update renderMessage to catch [BROADCAST] and style it uniquely
old_render = """        if (msg.content.startsWith('[TIP]')) {
            return (
                <div className="w-full flex justify-center py-2">"""

new_render = """        if (msg.content.startsWith('[BROADCAST]')) {
            const broadcastText = msg.content.replace('[BROADCAST]', '').trim();
            return (
                <div className="w-full flex flex-col items-center justify-center my-4 relative animate-in zoom-in-95 duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 blur-xl"></div>
                    <div className="relative bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-y border-amber-500/50 w-full py-4 px-6 text-center shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />
                            <span className="text-sm font-black text-amber-500 tracking-[0.2em]">SİSTEM DUYURUSU</span>
                            <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />
                        </div>
                        <p className="text-lg font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)] leading-relaxed">
                            {broadcastText}
                        </p>
                    </div>
                </div>
            );
        }

        if (msg.content.startsWith('[TIP]')) {
            return (
                <div className="w-full flex justify-center py-2">"""
content = content.replace(old_render, new_render)
# need to import AlertCircle if not imported
if "import { X, Reply" in content and "AlertCircle" not in content:
    content = content.replace("import { X, Reply", "import { X, Reply, AlertCircle")
elif "AlertCircle" not in content:
    content = content.replace("from 'lucide-react';", "AlertCircle } from 'lucide-react';").replace("import { ", "import { AlertCircle, ")

with open(filename, 'w') as f:
    f.write(content)

print("Added Mega Broadcast logic to ModernChat")
