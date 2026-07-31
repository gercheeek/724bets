const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'i18n', 'locales');
const languages = ['tr', 'en', 'pt-BR', 'es'];

const translations = {
  tr: {
    raffle: {
      week_promo: "Haftanın Özel Çekilişi",
      grand: "BÜYÜK",
      prize_pool: "ÖDÜL HAVUZU",
      pool_desc: "$20.000 değerindeki lüks ödül havuzu hızla doluyor. Rolex Daytona ve binlerce dolarlık VIP ödüller sahiplerini bekliyor.",
      ticket_status: "BİLET HAVUZU DURUMU",
      tickets: "Bilet",
      winners: "Kazanan",
      pool_full: "Havuz dolduğu an canlı çekiliş başlar.",
      pick_ticket: "BİLETİNİ SEÇ",
      vip_showcase: "VIP Ödül Vitrini",
      winner_1: "1. ŞANSLI",
      winner_1_desc: "Zamanın ötesinde lüks tasarımıyla Rolex Daytona, büyük çekilişin 1 numaralı kazananına hediye edilecek.",
      value: "Değeri",
      winners_2_5: "2. - 5. Kazananlar",
      prize_silver: "Gümüş Kupa",
      winners_6_50: "6. - 50. Kazananlar",
      prize_cash: "Teselli Nakit",
      your_status: "Kişisel Durumunuz",
      your_tickets: "Biletleriniz",
      luck_meter: "Şans Metresi",
      deposit_progress: "Yatırım İlerlemesi",
      deposit_win: "Yatırım Yap & Kazan",
      live_stream: "Canlı Akış",
      next_draw: "Sonraki Çekiliş",
      day: "GÜN",
      hour: "SAAT",
      min: "DAK",
      sec: "SAN",
      yours: "SİZİN",
      taken: "DOLU"
    }
  },
  en: {
    raffle: {
      week_promo: "Special Weekly Raffle",
      grand: "GRAND",
      prize_pool: "PRIZE POOL",
      pool_desc: "The luxury prize pool worth $20,000 is filling up fast. Rolex Daytona and thousands of dollars in VIP prizes are waiting for their owners.",
      ticket_status: "TICKET POOL STATUS",
      tickets: "Tickets",
      winners: "Winners",
      pool_full: "Live draw begins as soon as the pool is full.",
      pick_ticket: "PICK YOUR TICKET",
      vip_showcase: "VIP Prize Showcase",
      winner_1: "1ST LUCKY",
      winner_1_desc: "With its timeless luxury design, Rolex Daytona will be gifted to the number 1 winner of the grand draw.",
      value: "Value",
      winners_2_5: "2nd - 5th Winners",
      prize_silver: "Silver Cup",
      winners_6_50: "6th - 50th Winners",
      prize_cash: "Consolation Cash",
      your_status: "Your Status",
      your_tickets: "Your Tickets",
      luck_meter: "Luck Meter",
      deposit_progress: "Deposit Progress",
      deposit_win: "Deposit & Win",
      live_stream: "Live Stream",
      next_draw: "Next Draw",
      day: "DAY",
      hour: "HRS",
      min: "MIN",
      sec: "SEC",
      yours: "YOURS",
      taken: "TAKEN"
    }
  },
  'pt-BR': {
    raffle: {
      week_promo: "Sorteio Especial da Semana",
      grand: "GRANDE",
      prize_pool: "PRÊMIO ACUMULADO",
      pool_desc: "O prêmio de luxo avaliado em $20.000 está se enchendo rapidamente. Rolex Daytona e milhares de dólares em prêmios VIP aguardam seus donos.",
      ticket_status: "STATUS DOS INGRESSOS",
      tickets: "Ingressos",
      winners: "Vencedores",
      pool_full: "O sorteio ao vivo começa assim que a piscina estiver cheia.",
      pick_ticket: "ESCOLHA SEU INGRESSO",
      vip_showcase: "Vitrine de Prêmios VIP",
      winner_1: "1º SORTUDO",
      winner_1_desc: "Com seu design luxuoso intemporal, o Rolex Daytona será presenteado ao vencedor número 1 do grande sorteio.",
      value: "Valor",
      winners_2_5: "2º - 5º Vencedores",
      prize_silver: "Taça de Prata",
      winners_6_50: "6º - 50º Vencedores",
      prize_cash: "Dinheiro de Consolação",
      your_status: "Seu Status",
      your_tickets: "Seus Ingressos",
      luck_meter: "Medidor de Sorte",
      deposit_progress: "Progresso de Depósito",
      deposit_win: "Deposite e Ganhe",
      live_stream: "Transmissão ao Vivo",
      next_draw: "Próximo Sorteio",
      day: "DIA",
      hour: "HRS",
      min: "MIN",
      sec: "SEG",
      yours: "SEU",
      taken: "CHEIO"
    }
  },
  es: {
    raffle: {
      week_promo: "Sorteo Especial de la Semana",
      grand: "GRAN",
      prize_pool: "POZO DE PREMIOS",
      pool_desc: "El pozo de premios de lujo de $20,000 se está llenando rápidamente. Rolex Daytona y miles de dólares en premios VIP esperan a sus dueños.",
      ticket_status: "ESTADO DE BOLETOS",
      tickets: "Boletos",
      winners: "Ganadores",
      pool_full: "El sorteo en vivo comienza tan pronto como se llene el pozo.",
      pick_ticket: "ELIGE TU BOLETO",
      vip_showcase: "Vitrina de Premios VIP",
      winner_1: "1ER AFORTUNADO",
      winner_1_desc: "Con su diseño de lujo atemporal, el Rolex Daytona será regalado al ganador número 1 del gran sorteo.",
      value: "Valor",
      winners_2_5: "2º - 5º Ganadores",
      prize_silver: "Copa de Plata",
      winners_6_50: "6º - 50º Ganadores",
      prize_cash: "Efectivo de Consuelo",
      your_status: "Tu Estado",
      your_tickets: "Tus Boletos",
      luck_meter: "Medidor de Suerte",
      deposit_progress: "Progreso de Depósito",
      deposit_win: "Depositar y Ganar",
      live_stream: "Transmisión en Vivo",
      next_draw: "Próximo Sorteo",
      day: "DÍA",
      hour: "HRS",
      min: "MIN",
      sec: "SEG",
      yours: "TUYO",
      taken: "LLENO"
    }
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.raffle = { ...(data.raffle || {}), ...translations[lang].raffle };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});
