const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'pt-BR', 'es'];
const dir = path.join(__dirname, 'i18n', 'locales');

const newContent = {
  tr: {
    promo_view: {
      day: "GÜN",
      hour: "SAAT",
      minute: "DAKİKA",
      gates_title: "Gates of Olympus Turnuvası",
      gates_desc: "Daha yüksek kazanma çarpanı için...",
      le_series_title: "Le Serisi Turnuvası",
      le_series_desc: "Daha yüksek kazanma çarpanı için...",
      weekend_title: "HAFTASONU ÇARPAN TURNUVASI 5.000 EURO",
      weekend_desc: "Daha yüksek kazanma çarpanı için...",
      hacksaw_title: "Hacksaw Turnuvası",
      hacksaw_desc: "Bahislerin toplamına göre puanlar,...",
      slide1_title: "Milyonluk Turnuvalar",
      slide1_h1: "Toplam ",
      slide1_hhl: "25.000.000₺",
      slide1_h2: " Nakit Ödül!",
      slide1_sub: "ŞİMDİ PAYINI AL",
      slide1_desc: "Her gün binlerce kullanıcı dev nakit ödüller ve bedava dönüşler kazanıyor. Hayatını değiştirecek o büyük ödülü sadece tek bir spinde sen kazan! Hemen üye ol, sınırsız nakit yağmuruna katıl.",
      slide2_title: "Efsanevi Ödüller",
      slide2_h1: "Zeus'un Öfkesiyle ",
      slide2_hhl: "Çarpanları",
      slide2_h2: " Yakala!",
      slide2_sub: "BÜYÜK VURGUN ZAMANI",
      slide2_desc: "Olimpos'un kapıları devasa kazançlar için aralandı. En yüksek çarpanları bul, liderlik tablosuna adını yazdır ve Zeus'un hazinesinden payını hemen al!",
      slide3_title: "Tatlı Kazançlar",
      slide3_h1: "Şeker Gibi ",
      slide3_hhl: "Bedava Dönüşler",
      slide3_h2: " Seni Bekliyor!",
      slide3_sub: "SINIRSIZ EĞLENCE",
      slide3_desc: "Rengarenk şekerlerin ardındaki dev kazançları keşfet. Her patlayan şekerle ödül havuzuna bir adım daha yaklaş. Bu tatlı serüvende yerini ayırt!",
      slide4_title: "Karanlık Tema",
      slide4_h1: "Vahşi Batı'da ",
      slide4_hhl: "Büyük Ödül",
      slide4_h2: " Avı!",
      slide4_sub: "KURALLARI SEN KOY",
      slide4_desc: "Karanlık sokaklarda, vahşi batının acımasız atmosferinde hayatta kal ve büyük ikramiyeyi vur. Cesaretin varsa, bu ölümcül turnuvada yerini al!"
    }
  },
  en: {
    promo_view: {
      day: "DAY",
      hour: "HOUR",
      minute: "MINUTE",
      gates_title: "Gates of Olympus Tournament",
      gates_desc: "For a higher win multiplier...",
      le_series_title: "Le Series Tournament",
      le_series_desc: "For a higher win multiplier...",
      weekend_title: "WEEKEND MULTIPLIER TOURNAMENT 5,000 EURO",
      weekend_desc: "For a higher win multiplier...",
      hacksaw_title: "Hacksaw Tournament",
      hacksaw_desc: "Points according to total bets,...",
      slide1_title: "Million Dollar Tournaments",
      slide1_h1: "Total ",
      slide1_hhl: "25,000,000₺",
      slide1_h2: " Cash Prize!",
      slide1_sub: "GET YOUR SHARE NOW",
      slide1_desc: "Thousands of users win huge cash prizes and free spins every day. Win the life-changing big prize in just one spin! Join now, participate in the unlimited cash rain.",
      slide2_title: "Legendary Rewards",
      slide2_h1: "Catch ",
      slide2_hhl: "Multipliers",
      slide2_h2: " with Zeus's Wrath!",
      slide2_sub: "TIME FOR A BIG HIT",
      slide2_desc: "The gates of Olympus are open for huge wins. Find the highest multipliers, get your name on the leaderboard, and take your share of Zeus's treasure!",
      slide3_title: "Sweet Wins",
      slide3_h1: "Sweet ",
      slide3_hhl: "Free Spins",
      slide3_h2: " Are Waiting For You!",
      slide3_sub: "UNLIMITED FUN",
      slide3_desc: "Discover giant wins behind colorful candies. Get one step closer to the prize pool with every popping candy. Book your place in this sweet adventure!",
      slide4_title: "Dark Theme",
      slide4_h1: "Big Prize ",
      slide4_hhl: "Hunt",
      slide4_h2: " in the Wild West!",
      slide4_sub: "YOU SET THE RULES",
      slide4_desc: "Survive on dark streets in the ruthless atmosphere of the wild west and hit the jackpot. If you dare, take your place in this deadly tournament!"
    }
  },
  'pt-BR': {
    promo_view: {
      day: "DIA",
      hour: "HORA",
      minute: "MINUTO",
      gates_title: "Torneio Gates of Olympus",
      gates_desc: "Para um multiplicador de vitória maior...",
      le_series_title: "Torneio Le Series",
      le_series_desc: "Para um multiplicador de vitória maior...",
      weekend_title: "TORNEIO MULTIPLICADOR DE FIM DE SEMANA 5.000 EUROS",
      weekend_desc: "Para um multiplicador de vitória maior...",
      hacksaw_title: "Torneio Hacksaw",
      hacksaw_desc: "Pontos de acordo com as apostas totais,...",
      slide1_title: "Torneios Milionários",
      slide1_h1: "Prêmio Total de ",
      slide1_hhl: "25.000.000₺",
      slide1_h2: " em Dinheiro!",
      slide1_sub: "PEGUE SUA PARTE AGORA",
      slide1_desc: "Milhares de usuários ganham grandes prêmios em dinheiro e giros grátis todos os dias. Ganhe o grande prêmio que mudará sua vida em apenas um giro! Junte-se agora, participe da chuva de dinheiro ilimitada.",
      slide2_title: "Recompensas Lendárias",
      slide2_h1: "Pegue os ",
      slide2_hhl: "Multiplicadores",
      slide2_h2: " com a Fúria de Zeus!",
      slide2_sub: "HORA DE UM GRANDE GOLPE",
      slide2_desc: "Os portões do Olimpo estão abertos para grandes vitórias. Encontre os multiplicadores mais altos, coloque seu nome na tabela de classificação e leve sua parte do tesouro de Zeus!",
      slide3_title: "Vitórias Doces",
      slide3_h1: "Giros Grátis ",
      slide3_hhl: "Doces",
      slide3_h2: " Estão Esperando por Você!",
      slide3_sub: "DIVERSÃO ILIMITADA",
      slide3_desc: "Descubra vitórias gigantes por trás de doces coloridos. Chegue um passo mais perto da premiação a cada doce que estoura. Reserve seu lugar nesta doce aventura!",
      slide4_title: "Tema Sombrio",
      slide4_h1: "Caça ao Grande ",
      slide4_hhl: "Prêmio",
      slide4_h2: " no Velho Oeste!",
      slide4_sub: "VOCÊ DEFINE AS REGRAS",
      slide4_desc: "Sobreviva nas ruas escuras na atmosfera implacável do velho oeste e ganhe o jackpot. Se você tiver coragem, ocupe seu lugar neste torneio mortal!"
    }
  },
  es: {
    promo_view: {
      day: "DÍA",
      hour: "HORA",
      minute: "MINUTO",
      gates_title: "Torneo Gates of Olympus",
      gates_desc: "Para un multiplicador de victoria mayor...",
      le_series_title: "Torneo Le Series",
      le_series_desc: "Para un multiplicador de victoria mayor...",
      weekend_title: "TORNEO MULTIPLICADOR DE FIN DE SEMANA 5.000 EUROS",
      weekend_desc: "Para un multiplicador de victoria mayor...",
      hacksaw_title: "Torneo Hacksaw",
      hacksaw_desc: "Puntos de acuerdo con las apuestas totales,...",
      slide1_title: "Torneos Millonarios",
      slide1_h1: "¡Premio Total de ",
      slide1_hhl: "25.000.000₺",
      slide1_h2: " en Efectivo!",
      slide1_sub: "CONSIGUE TU PARTE AHORA",
      slide1_desc: "Miles de usuarios ganan enormes premios en efectivo y giros gratis todos los días. ¡Gana el gran premio que cambiará tu vida en un solo giro! Únete ahora, participa en la lluvia de efectivo ilimitada.",
      slide2_title: "Recompensas Legendarias",
      slide2_h1: "¡Atrapa ",
      slide2_hhl: "Multiplicadores",
      slide2_h2: " con la Ira de Zeus!",
      slide2_sub: "HORA DE UN GRAN GOLPE",
      slide2_desc: "Las puertas del Olimpo están abiertas para obtener grandes ganancias. ¡Encuentra los multiplicadores más altos, pon tu nombre en la tabla de clasificación y llévate tu parte del tesoro de Zeus!",
      slide3_title: "Dulces Victorias",
      slide3_h1: "¡",
      slide3_hhl: "Tiradas Gratis",
      slide3_h2: " Dulces Te Están Esperando!",
      slide3_sub: "DIVERSIÓN ILIMITADA",
      slide3_desc: "Descubre ganancias gigantes detrás de caramelos coloridos. Acércate un paso más a la bolsa de premios con cada caramelo que estalla. ¡Reserva tu lugar en esta dulce aventura!",
      slide4_title: "Tema Oscuro",
      slide4_h1: "¡Caza del ",
      slide4_hhl: "Gran Premio",
      slide4_h2: " en el Lejano Oeste!",
      slide4_sub: "TÚ PONES LAS REGLAS",
      slide4_desc: "Sobrevive en calles oscuras en la despiadada atmósfera del viejo oeste y llévate el premio gordo. Si te atreves, ¡ocupa tu lugar en este torneo mortal!"
    }
  }
};

for (const lang of locales) {
  const filePath = path.join(dir, `${lang}.json`);
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {}
  
  data.promo_view = { ...data.promo_view, ...newContent[lang].promo_view };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log("Promo dummy locales updated.");
