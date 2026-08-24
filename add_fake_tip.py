import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_fake = """                const fakeMessages = [
                    { id: 'msg-1', channel_id: activeChannel.id, username: 'KriptoKral', role: 'VIP_DIAMOND', message: 'BTC 70k oldu, kasa katlıyoruz beyler 🚀', created_at: new Date(Date.now() - 50000).toISOString() },
                    { id: 'msg-2', channel_id: activeChannel.id, username: 'CanS', role: 'USER', message: 'Plinko oynayan var mı?', created_at: new Date(Date.now() - 40000).toISOString() },
                    { id: 'msg-3', channel_id: activeChannel.id, username: 'Yönetici', role: 'ADMIN', message: '@CanS Şansın bol olsun.', created_at: new Date(Date.now() - 30000).toISOString() },
                    { id: 'msg-4', channel_id: activeChannel.id, username: 'Ahmet99', role: 'VIP_GOLD', message: 'Brezilya maçına banko üst girilir.', created_at: new Date(Date.now() - 20000).toISOString() }
                ];"""

new_fake = """                const fakeMessages = [
                    { id: 'msg-1', channel_id: activeChannel.id, username: 'KriptoKral', role: 'VIP_DIAMOND', message: 'BTC 70k oldu, kasa katlıyoruz beyler 🚀', created_at: new Date(Date.now() - 50000).toISOString() },
                    { id: 'msg-2', channel_id: activeChannel.id, username: 'CanS', role: 'USER', message: 'Plinko oynayan var mı?', created_at: new Date(Date.now() - 40000).toISOString() },
                    { id: 'msg-3', channel_id: activeChannel.id, username: 'Yönetici', role: 'ADMIN', message: '@CanS Şansın bol olsun.', created_at: new Date(Date.now() - 30000).toISOString() },
                    { id: 'msg-4', channel_id: activeChannel.id, username: 'Ahmet99', role: 'VIP_GOLD', message: 'Brezilya maçına banko üst girilir.', created_at: new Date(Date.now() - 20000).toISOString() },
                    { id: 'msg-5', channel_id: activeChannel.id, username: 'Bautista17', role: 'VIP_PLATINUM', message: '[TIP] Bautista17 sent 100₺ to Fuentes20!', created_at: new Date(Date.now() - 10000).toISOString() }
                ];"""

content = content.replace(old_fake, new_fake)
with open(filename, 'w') as f:
    f.write(content)
print("Added fake tip")
