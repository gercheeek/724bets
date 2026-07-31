const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'pt-BR', 'es'];
const dir = path.join(__dirname, 'i18n', 'locales');

const newContent = {
  tr: {
    vip: {
      slide1_title: "VIP KULÜBÜNÜN KAPILARI",
      slide1_highlight: "SİZİN İÇİN ARALANIYOR",
      slide1_desc: "Sadece bahis yapmazsınız; oynadıkça nakit iade, özel menajer ve lüks ödüller kazanırsınız. Sizi bekleyen ayrıcalıkları hemen keşfedin.",
      slide2_title: "724BETS",
      slide2_highlight: "VIP KULÜBÜ",
      slide2_desc: "Sadakatinizin karşılığını altın standartta alın. Görevleri tamamlayın, seviye atlayın ve ayrıcalıkların kilidini açın.",
      slide3_title: "ÖZEL",
      slide3_highlight: "ETKİNLİKLER",
      slide3_desc: "Sadece VIP üyelere özel turnuvalar, sürpriz tatiller ve lüks ödüllerle dolu bir dünya sizi bekliyor.",
      slide4_title: "KİŞİSEL",
      slide4_highlight: "ASİSTAN",
      slide4_desc: "7/24 size özel hizmet veren kişisel hesap yöneticiniz ile tüm işlemlerinizde öncelik kazanın.",
      badge_private: "Özel VIP Kulübü",
      first_deposit: "İLK YATIRIMINIZI YAPIN",
      monthly_volume: "Aylık Tahmini Hacminiz",
      reached_level: "Ulaşacağınız Seviye",
      cashback: "Nakit İade",
      cashback_upper: "NAKİT İADE",
      current_level: "Mevcut Seviyeniz",
      next_level: "Sonraki Seviye",
      xp_left: "Sonraki seviyeye",
      xp_left_2: "kaldı",
      reach_peak: "LÜKSÜN ZİRVESİNE ULAŞIN",
      peak_desc: "VIP Kulübü, sadakatinizi en yüksek oranlar ve eşsiz ayrıcalıklarla ödüllendirir. Seviyeleri tırmanın, gücünüzü katlayın.",
      withdrawal_speed: "ÇEKİM HIZI",
      support: "DESTEK",
      join_club: "KULÜBE KATIL VE AYRICALIKLARI YAŞA",
      support_standard: "Standart",
      support_priority: "Öncelikli",
      support_vip: "VIP",
      support_manager: "Özel Menajer",
      withdrawal_normal: "Normal",
      withdrawal_fast: "Hızlı",
      withdrawal_very_fast: "Çok Hızlı",
      withdrawal_instant: "Anında",
      withdrawal_unlimited: "Limitsiz & Anında"
    }
  },
  en: {
    vip: {
      slide1_title: "THE DOORS OF VIP CLUB",
      slide1_highlight: "ARE OPENING FOR YOU",
      slide1_desc: "You don't just bet; you earn cashback, get a personal manager, and luxury rewards as you play. Discover your privileges now.",
      slide2_title: "724BETS",
      slide2_highlight: "VIP CLUB",
      slide2_desc: "Get the gold standard reward for your loyalty. Complete tasks, level up, and unlock privileges.",
      slide3_title: "EXCLUSIVE",
      slide3_highlight: "EVENTS",
      slide3_desc: "A world full of exclusive tournaments, surprise holidays, and luxury rewards awaits you.",
      slide4_title: "PERSONAL",
      slide4_highlight: "ASSISTANT",
      slide4_desc: "Get priority on all your transactions with your 24/7 personal account manager.",
      badge_private: "Exclusive VIP Club",
      first_deposit: "MAKE YOUR FIRST DEPOSIT",
      monthly_volume: "Estimated Monthly Volume",
      reached_level: "Level You Will Reach",
      cashback: "Cashback",
      cashback_upper: "CASHBACK",
      current_level: "Your Current Level",
      next_level: "Next Level",
      xp_left: "",
      xp_left_2: "XP left for next level",
      reach_peak: "REACH THE PEAK OF LUXURY",
      peak_desc: "The VIP Club rewards your loyalty with the highest odds and unique privileges. Climb the levels, multiply your power.",
      withdrawal_speed: "WITHDRAWAL SPEED",
      support: "SUPPORT",
      join_club: "JOIN THE CLUB & EXPERIENCE PRIVILEGES",
      support_standard: "Standard",
      support_priority: "Priority",
      support_vip: "VIP",
      support_manager: "Personal Manager",
      withdrawal_normal: "Normal",
      withdrawal_fast: "Fast",
      withdrawal_very_fast: "Very Fast",
      withdrawal_instant: "Instant",
      withdrawal_unlimited: "Unlimited & Instant"
    }
  },
  'pt-BR': {
    vip: {
      slide1_title: "AS PORTAS DO CLUBE VIP",
      slide1_highlight: "ESTÃO SE ABRINDO PARA VOCÊ",
      slide1_desc: "Você não apenas aposta; você ganha cashback, gerente pessoal e recompensas de luxo enquanto joga. Descubra seus privilégios agora.",
      slide2_title: "724BETS",
      slide2_highlight: "CLUBE VIP",
      slide2_desc: "Receba a recompensa padrão ouro por sua lealdade. Conclua tarefas, suba de nível e desbloqueie privilégios.",
      slide3_title: "EVENTOS",
      slide3_highlight: "EXCLUSIVOS",
      slide3_desc: "Um mundo cheio de torneios exclusivos, férias surpresas e recompensas de luxo espera por você.",
      slide4_title: "ASSISTENTE",
      slide4_highlight: "PESSOAL",
      slide4_desc: "Tenha prioridade em todas as suas transações com o seu gerente de conta pessoal 24/7.",
      badge_private: "Clube VIP Exclusivo",
      first_deposit: "FAÇA SEU PRIMEIRO DEPÓSITO",
      monthly_volume: "Volume Mensal Estimado",
      reached_level: "Nível Que Você Alcançará",
      cashback: "Cashback",
      cashback_upper: "CASHBACK",
      current_level: "Seu Nível Atual",
      next_level: "Próximo Nível",
      xp_left: "",
      xp_left_2: "XP restante para o próximo nível",
      reach_peak: "ALCANCE O PICO DO LUXO",
      peak_desc: "O Clube VIP recompensa sua lealdade com as maiores probabilidades e privilégios únicos. Suba de nível, multiplique seu poder.",
      withdrawal_speed: "VELOCIDADE DE SAQUE",
      support: "SUPORTE",
      join_club: "JUNTE-SE AO CLUBE E VIVA OS PRIVILÉGIOS",
      support_standard: "Padrão",
      support_priority: "Prioridade",
      support_vip: "VIP",
      support_manager: "Gerente Pessoal",
      withdrawal_normal: "Normal",
      withdrawal_fast: "Rápido",
      withdrawal_very_fast: "Muito Rápido",
      withdrawal_instant: "Instante",
      withdrawal_unlimited: "Ilimitado e Instantâneo"
    }
  },
  es: {
    vip: {
      slide1_title: "LAS PUERTAS DEL CLUB VIP",
      slide1_highlight: "SE ESTÁN ABRIENDO PARA TI",
      slide1_desc: "No solo apuestas; ganas cashback, un gerente personal y recompensas de lujo mientras juegas. Descubre tus privilegios ahora.",
      slide2_title: "724BETS",
      slide2_highlight: "CLUB VIP",
      slide2_desc: "Obtenga la recompensa estándar de oro por su lealtad. Completa tareas, sube de nivel y desbloquea privilegios.",
      slide3_title: "EVENTOS",
      slide3_highlight: "EXCLUSIVOS",
      slide3_desc: "Te espera un mundo lleno de torneos exclusivos, vacaciones sorpresa y recompensas de lujo.",
      slide4_title: "ASISTENTE",
      slide4_highlight: "PERSONAL",
      slide4_desc: "Tenga prioridad en todas sus transacciones con su gerente de cuenta personal las 24 horas del día.",
      badge_private: "Club VIP Exclusivo",
      first_deposit: "HAZ TU PRIMER DEPÓSITO",
      monthly_volume: "Volumen Mensual Estimado",
      reached_level: "Nivel Que Alcanzarás",
      cashback: "Cashback",
      cashback_upper: "CASHBACK",
      current_level: "Tu Nivel Actual",
      next_level: "Próximo Nivel",
      xp_left: "",
      xp_left_2: "XP restante para el próximo nivel",
      reach_peak: "ALCANZA LA CUMBRE DEL LUJO",
      peak_desc: "El Club VIP recompensa tu lealtad con las cuotas más altas y privilegios únicos. Sube de nivel, multiplica tu poder.",
      withdrawal_speed: "VELOCIDAD DE RETIRO",
      support: "SOPORTE",
      join_club: "ÚNETE AL CLUB Y VIVE LOS PRIVILEGIOS",
      support_standard: "Estándar",
      support_priority: "Prioridad",
      support_vip: "VIP",
      support_manager: "Gerente Personal",
      withdrawal_normal: "Normal",
      withdrawal_fast: "Rápido",
      withdrawal_very_fast: "Muy Rápido",
      withdrawal_instant: "Instante",
      withdrawal_unlimited: "Ilimitado e Instantáneo"
    }
  }
};

for (const lang of locales) {
  const filePath = path.join(dir, `${lang}.json`);
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {}
  
  data.vip = newContent[lang].vip;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log("VIP locales updated.");
