import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add state variables for moderation
mod_state_addition = """    const [chatLocked, setChatLocked] = useState(false);
    const [slowMode, setSlowMode] = useState(0);
    const [lastMessageTime, setLastMessageTime] = useState(0);

    useEffect(() => {
        const checkSettings = () => {
            setChatLocked(localStorage.getItem('chat_locked') === 'true');
            setSlowMode(Number(localStorage.getItem('chat_slow_mode') || 0));
        };
        
        const handleClear = () => {
            setMessages([]); // Clears all current messages from the screen
        };

        checkSettings(); // Initial load
        
        window.addEventListener('chat_settings_changed', checkSettings);
        window.addEventListener('clear_chat', handleClear);
        return () => {
            window.removeEventListener('chat_settings_changed', checkSettings);
            window.removeEventListener('clear_chat', handleClear);
        };
    }, []);"""

content = content.replace("    const [tippingUser, setTippingUser] = useState<string | null>(null);", "    const [tippingUser, setTippingUser] = useState<string | null>(null);\n\n" + mod_state_addition)


# Modify handleSendMessage to respect lock and slow mode
old_send = """    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;"""

new_send = """    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // Moderation Checks (Admins bypass these)
        if (!isAuthorized(userRole)) {
            if (chatLocked) {
                triggerGlobalToast('Sohbet şu anda yöneticiler tarafından kilitlendi.', 'error');
                return;
            }
            if (slowMode > 0) {
                const now = Date.now();
                if (now - lastMessageTime < slowMode * 1000) {
                    triggerGlobalToast(`Yavaş mod aktif. Lütfen ${slowMode} saniye bekleyin.`, 'warning');
                    return;
                }
            }
        }
        
        setLastMessageTime(Date.now());"""

content = content.replace(old_send, new_send)

# Modify the input area to show if chat is locked
old_input = """                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Bir mesaj gönder..."
                                className="w-full bg-transparent border-none text-[#E2E8F0] text-sm focus:outline-none focus:ring-0 placeholder-[#64748B]"
                                maxLength={200}
                            />"""

new_input = """                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={chatLocked && !isAuthorized(userRole) ? "Sohbet kilitli..." : "Bir mesaj gönder..."}
                                disabled={chatLocked && !isAuthorized(userRole)}
                                className="w-full bg-transparent border-none text-[#E2E8F0] text-sm focus:outline-none focus:ring-0 placeholder-[#64748B] disabled:opacity-50 disabled:cursor-not-allowed"
                                maxLength={200}
                            />"""
content = content.replace(old_input, new_input)

with open(filename, 'w') as f:
    f.write(content)

print("Updated ModernChat with Moderation logic")
