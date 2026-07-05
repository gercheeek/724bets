require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SYSTEM_PROMPT = `Sen 724bahis.com sitesinde takılan heyecanlı bir bahisçi ve spor analistisin. 
Canlı maçları takip edip skorlara göre tepki veriyorsun. Asla bir yapay zeka olduğunu belli etme.
Kısa, öz ve argo içermeyen sokak ağzıyla (kanka, aga, hoca vb.) spor/casino muhabbeti yap.
Mesajların maksimum 1-2 cümle olsun. Zaman zaman Gamdom, 21.com gibi casino sitelerini öv.`;

async function generateBotMessage() {
    // LLM entegrasyonu (Gemini veya OpenAI API)
    if (!GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY bulunamadı. Fallback mesajları kullanılıyor.');
        const fallbacks = [
            'Beyler Fenerbahçe maçında üst olur mu ne diyorsunuz?',
            'Gamdom yine kazandırdı helal olsun 💸',
            'Bugün kasayı katladık şükür.',
            'Canlıdan giren var mı agalar?',
            '21.com bonusları efsane ya, denemeyen kaldı mı?'
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: [{ parts: [{ text: "Sohbete heyecanlı bir bahis veya spor analizi mesajı at. Sadece mesajı yaz, ek açıklama yapma." }] }],
                generationConfig: { temperature: 0.9, maxOutputTokens: 100 }
            })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text.trim().replace(/^["']|["']$/g, '');
        }
    } catch (e) {
        console.error('LLM Hatası:', e);
    }
    return 'Maçlar çok heyecanlı bugün beyler!';
}

async function runBotScheduler() {
    console.log('[AI_BOT] Çalıştırılıyor...');
    
    // Rastgele bir bot kullanıcısı seç
    const { data: bots, error: botsError } = await supabase
        .from('members')
        .select('id, username, role')
        .eq('role', 'BOT')
        .eq('status', 'active');

    if (botsError || !bots || bots.length === 0) {
        console.log('[AI_BOT] Sistemde aktif BOT rolünde kullanıcı bulunamadı.');
        return;
    }

    const randomBot = bots[Math.floor(Math.random() * bots.length)];
    const messageText = await generateBotMessage();

    console.log(`[AI_BOT] Seçilen Bot: ${randomBot.username}`);
    console.log(`[AI_BOT] Üretilen Mesaj: ${messageText}`);

    // tv_chat tablosuna mesajı ekle
    const { error: insertError } = await supabase.from('tv_chat').insert({
        user_id: randomBot.id,
        username: randomBot.username,
        role: randomBot.role,
        message: messageText
    });

    if (insertError) {
        console.error('[AI_BOT] Mesaj eklenirken hata:', insertError.message);
    } else {
        console.log('[AI_BOT] Mesaj başarıyla gönderildi!');
    }
}

// Hemen bir kez çalıştır
runBotScheduler();

// İsteğe bağlı olarak sürekli çalışması için setInterval eklenebilir. 
// (Örnek: Her 5-15 dakika arası rastgele)
// setTimeout(runBotScheduler, Math.floor(Math.random() * 10 * 60 * 1000) + 5 * 60 * 1000);
