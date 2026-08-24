import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_fetch = """            try {
                const { data } = await supabase
                    .from('tv_chat')
                    .select('*')
                    .eq('channel_id', activeChannel.id)
                    .order('created_at', { ascending: false })
                    .limit(25);

                if (data) {
                    setMessages(data.reverse());
                }
            }"""

new_fetch = """            try {
                const { data } = await supabase
                    .from('tv_chat')
                    .select('*')
                    .eq('channel_id', activeChannel.id)
                    .order('created_at', { ascending: false })
                    .limit(25);

                const fakeMessages = [
                    { id: 'msg-1', channel_id: activeChannel.id, username: 'System', role: 'system_win', message: '724Bets Global Odasına Hoş Geldiniz! Lütfen saygılı olun.', created_at: new Date(Date.now() - 60000).toISOString() },
                    { id: 'msg-2', channel_id: activeChannel.id, username: 'CryptoWhale', role: 'VIP_DIAMOND', message: 'BTC uçuyor, bahisleri USDT ile alın beyler 🚀', created_at: new Date(Date.now() - 50000).toISOString() },
                    { id: 'msg-3', channel_id: activeChannel.id, username: 'AhmetK', role: 'USER', message: 'Plinko oynayan var mı? Son 10 elde 130x geldi', created_at: new Date(Date.now() - 40000).toISOString() },
                    { id: 'msg-4', channel_id: activeChannel.id, username: 'Yönetici', role: 'ADMIN', message: 'Tebrikler @AhmetK! Bugün şanslı günündesin. 🔥', created_at: new Date(Date.now() - 30000).toISOString() },
                    { id: 'msg-5', channel_id: activeChannel.id, username: 'Can_99', role: 'VIP_GOLD', message: 'Monaco maçına banko üst girilir.', created_at: new Date(Date.now() - 20000).toISOString() }
                ];

                if (data && data.length > 0) {
                    setMessages([...fakeMessages, ...data.reverse()]);
                } else {
                    setMessages(fakeMessages);
                }
            }"""
content = content.replace(old_fetch, new_fetch)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
