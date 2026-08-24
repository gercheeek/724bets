import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_block = """                const { data } = await supabase
                    .from('tv_chat')
                    .select('*')
                    .eq('channel_id', activeChannel.id)
                    .order('created_at', { ascending: false })
                    .limit(25);
                
                if (data) {
                    data.reverse();
                }"""

new_block = """                const { data } = await supabase
                    .from('tv_chat')
                    .select('*')
                    .eq('channel_id', activeChannel.id)
                    .order('created_at', { ascending: false })
                    .limit(25);
                
                let messagesData = data || [];
                messagesData.reverse();

                const fakeMessages = [
                    { id: 'msg-1', channel_id: activeChannel.id, username: 'KriptoKral', role: 'VIP_DIAMOND', message: 'BTC 70k oldu, kasa katlıyoruz beyler 🚀', created_at: new Date(Date.now() - 50000).toISOString() },
                    { id: 'msg-2', channel_id: activeChannel.id, username: 'CanS', role: 'USER', message: 'Plinko oynayan var mı?', created_at: new Date(Date.now() - 40000).toISOString() },
                    { id: 'msg-3', channel_id: activeChannel.id, username: 'Yönetici', role: 'ADMIN', message: '@CanS Şansın bol olsun.', created_at: new Date(Date.now() - 30000).toISOString() },
                    { id: 'msg-4', channel_id: activeChannel.id, username: 'Ahmet99', role: 'VIP_GOLD', message: 'Brezilya maçına banko üst girilir.', created_at: new Date(Date.now() - 20000).toISOString() }
                ];
                
                messagesData = [...fakeMessages, ...messagesData];"""

if old_block in content:
    content = content.replace(old_block, new_block)
    # Also we need to replace data with messagesData in the merged logic
    content = content.replace("const merged = [...(data || []), ...localBots];", "const merged = [...messagesData, ...localBots];")
    with open(filename, 'w') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FAILED TO MATCH")
