const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://eaxtuvjcanakaqetuqlc.supabase.co';
const supabaseAnonKey = 'sb_publishable_nzbN9-CrSawHUxEZNYZBzg_WOlgQ9X0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const channels = [
    // ⚽ BEIN SPORTS GRUBU
    { name: 'BEIN SPORTS 1', iframe_url: 'https://tipobettv264.com/channel?id=zirve', platform_type: 'kick', source_type: 'iframe', tags: ['BEIN SPORTS GRUBU'], is_live: true, order_index: 1 },
    { name: 'BEIN SPORTS 2', iframe_url: 'https://tipobettv264.com/channel?id=b2', platform_type: 'kick', source_type: 'iframe', tags: ['BEIN SPORTS GRUBU'], is_live: true, order_index: 2 },
    { name: 'BEIN SPORTS 3', iframe_url: 'https://tipobettv264.com/channel?id=b3', platform_type: 'kick', source_type: 'iframe', tags: ['BEIN SPORTS GRUBU'], is_live: true, order_index: 3 },
    { name: 'BEIN SPORTS 4', iframe_url: 'https://tipobettv264.com/channel?id=b4', platform_type: 'kick', source_type: 'iframe', tags: ['BEIN SPORTS GRUBU'], is_live: true, order_index: 4 },
    { name: 'BEIN SPORTS 5', iframe_url: 'https://tipobettv264.com/channel?id=b5', platform_type: 'kick', source_type: 'iframe', tags: ['BEIN SPORTS GRUBU'], is_live: true, order_index: 5 },
    { name: 'BEIN SPORTS MAX 1', iframe_url: 'https://tipobettv264.com/channel?id=bm1', platform_type: 'kick', source_type: 'iframe', tags: ['BEIN SPORTS GRUBU'], is_live: true, order_index: 6 },
    { name: 'BEIN SPORTS MAX 2', iframe_url: 'https://tipobettv264.com/channel?id=bm2', platform_type: 'kick', source_type: 'iframe', tags: ['BEIN SPORTS GRUBU'], is_live: true, order_index: 7 },

    // 🏀 TİVİBU SPOR GRUBU
    { name: 'TIVIBU SPOR 1', iframe_url: 'https://tipobettv264.com/channel?id=t1', platform_type: 'kick', source_type: 'iframe', tags: ['TİVİBU SPOR GRUBU'], is_live: true, order_index: 8 },
    { name: 'TIVIBU SPOR 2', iframe_url: 'https://tipobettv264.com/channel?id=t2', platform_type: 'kick', source_type: 'iframe', tags: ['TİVİBU SPOR GRUBU'], is_live: true, order_index: 9 },
    { name: 'TIVIBU SPOR 3', iframe_url: 'https://tipobettv264.com/channel?id=t3', platform_type: 'kick', source_type: 'iframe', tags: ['TİVİBU SPOR GRUBU'], is_live: true, order_index: 10 },
    { name: 'TIVIBU SPOR 4', iframe_url: 'https://tipobettv264.com/channel?id=t4', platform_type: 'kick', source_type: 'iframe', tags: ['TİVİBU SPOR GRUBU'], is_live: true, order_index: 11 },

    // 🏆 TRT GRUBU
    { name: 'TRT SPOR', iframe_url: 'https://tipobettv264.com/channel?id=trtspor', platform_type: 'kick', source_type: 'iframe', tags: ['TRT GRUBU'], is_live: true, order_index: 12 },
    { name: 'TRT SPOR YILDIZ', iframe_url: 'https://tipobettv264.com/channel?id=trtspor2', platform_type: 'kick', source_type: 'iframe', tags: ['TRT GRUBU'], is_live: true, order_index: 13 },
    { name: 'TRT 1', iframe_url: 'https://tipobettv264.com/channel?id=trt1', platform_type: 'kick', source_type: 'iframe', tags: ['TRT GRUBU'], is_live: true, order_index: 14 },

    // 📺 TABİİ SPOR GRUBU
    { name: 'TABII SPOR', iframe_url: 'https://tipobettv264.com/channel?id=ex7', platform_type: 'kick', source_type: 'iframe', tags: ['TABİİ SPOR GRUBU'], is_live: true, order_index: 15 },
    { name: 'TABII SPOR 1', iframe_url: 'https://tipobettv264.com/channel?id=ex1', platform_type: 'kick', source_type: 'iframe', tags: ['TABİİ SPOR GRUBU'], is_live: true, order_index: 16 },
    { name: 'TABII SPOR 2', iframe_url: 'https://tipobettv264.com/channel?id=ex2', platform_type: 'kick', source_type: 'iframe', tags: ['TABİİ SPOR GRUBU'], is_live: true, order_index: 17 },
    { name: 'TABII SPOR 3', iframe_url: 'https://tipobettv264.com/channel?id=ex3', platform_type: 'kick', source_type: 'iframe', tags: ['TABİİ SPOR GRUBU'], is_live: true, order_index: 18 },
    { name: 'TABII SPOR 4', iframe_url: 'https://tipobettv264.com/channel?id=ex4', platform_type: 'kick', source_type: 'iframe', tags: ['TABİİ SPOR GRUBU'], is_live: true, order_index: 19 },
    { name: 'TABII SPOR 5', iframe_url: 'https://tipobettv264.com/channel?id=ex5', platform_type: 'kick', source_type: 'iframe', tags: ['TABİİ SPOR GRUBU'], is_live: true, order_index: 20 },
    { name: 'TABII SPOR 6', iframe_url: 'https://tipobettv264.com/channel?id=ex6', platform_type: 'kick', source_type: 'iframe', tags: ['TABİİ SPOR GRUBU'], is_live: true, order_index: 21 },

    // 🏎️ S SPORT GRUBU
    { name: 'S SPORT', iframe_url: 'https://tipobettv264.com/channel?id=ss', platform_type: 'kick', source_type: 'iframe', tags: ['S SPORT GRUBU'], is_live: true, order_index: 22 },
    { name: 'S SPORT 2', iframe_url: 'https://tipobettv264.com/channel?id=ss2', platform_type: 'kick', source_type: 'iframe', tags: ['S SPORT GRUBU'], is_live: true, order_index: 23 },

    // 🎾 SMART SPOR GRUBU
    { name: 'SMART SPOR', iframe_url: 'https://tipobettv264.com/channel?id=smarts', platform_type: 'kick', source_type: 'iframe', tags: ['SMART SPOR GRUBU'], is_live: true, order_index: 24 },
    { name: 'SMART SPOR 2', iframe_url: 'https://tipobettv264.com/channel?id=sms2', platform_type: 'kick', source_type: 'iframe', tags: ['SMART SPOR GRUBU'], is_live: true, order_index: 25 },

    // 🌍 DİĞER SPOR VE ULUSAL KANALLAR
    { name: 'EURO SPORT 1', iframe_url: 'https://tipobettv264.com/channel?id=eu1', platform_type: 'kick', source_type: 'iframe', tags: ['DİĞER SPOR VE ULUSAL KANALLAR'], is_live: true, order_index: 26 },
    { name: 'EURO SPORT 2', iframe_url: 'https://tipobettv264.com/channel?id=eu2', platform_type: 'kick', source_type: 'iframe', tags: ['DİĞER SPOR VE ULUSAL KANALLAR'], is_live: true, order_index: 27 },
    { name: 'A SPOR', iframe_url: 'https://tipobettv264.com/channel?id=as', platform_type: 'kick', source_type: 'iframe', tags: ['DİĞER SPOR VE ULUSAL KANALLAR'], is_live: true, order_index: 28 },
    { name: 'ATV', iframe_url: 'https://tipobettv264.com/channel?id=atv', platform_type: 'kick', source_type: 'iframe', tags: ['DİĞER SPOR VE ULUSAL KANALLAR'], is_live: true, order_index: 29 },
    { name: 'TV 8', iframe_url: 'https://tipobettv264.com/channel?id=tv8', platform_type: 'kick', source_type: 'iframe', tags: ['DİĞER SPOR VE ULUSAL KANALLAR'], is_live: true, order_index: 30 },
    { name: 'TV 8,5', iframe_url: 'https://tipobettv264.com/channel?id=tv85', platform_type: 'kick', source_type: 'iframe', tags: ['DİĞER SPOR VE ULUSAL KANALLAR'], is_live: true, order_index: 31 },
];

(async () => {
    console.log('Seeding channels into Supabase...');
    
    // First let's check if we can delete the current ones
    const { error: deleteError } = await supabase.from('streamers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.error('Failed to clear streamers table:', deleteError.message);
        console.log('SQL Migration code to run in Supabase Dashboard SQL Editor:\n');
        console.log('TRUNCATE TABLE streamers CASCADE;');
        console.log('INSERT INTO streamers (name, iframe_url, platform_type, source_type, tags, is_live, order_index) VALUES');
        const sqlRows = channels.map(c => `('${c.name}', '${c.iframe_url}', '${c.platform_type}', '${c.source_type}', '${JSON.stringify(c.tags)}'::jsonb, ${c.is_live}, ${c.order_index})`).join(',\n');
        console.log(sqlRows + ';');
        process.exit(1);
    }
    
    const { error: insertError } = await supabase.from('streamers').insert(channels);
    if (insertError) {
        console.error('Failed to insert channels:', insertError.message);
        process.exit(1);
    }
    
    console.log('Successfully seeded 31 grouped TV channels into Supabase streamers table!');
})();
