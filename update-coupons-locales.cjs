const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'i18n', 'locales');
const languages = ['tr', 'en', 'pt-BR', 'es'];

const translations = {
  tr: {
    coupons: {
      title: "Bahislerim",
      active_bets: "Aktif Bahisler",
      bet_history: "Bahis Geçmişi",
      subtab_all: "Tümü",
      subtab_prematch: "Ön Maç",
      subtab_live: "Canlı",
      subtab_single: "Tekliler",
      subtab_combo: "Kombineler",
      single: "Tekli",
      return_lbl: "Geri dönmek",
      stake: "Bahis",
      estimated_payout: "Tahmini Ödeme",
      early_cashout: "Erken ödeme",
      copy: "Kopyala",
      share_img: "Görsel Olarak Paylaş",
      share: "Paylaş"
    }
  },
  en: {
    coupons: {
      title: "My Bets",
      active_bets: "Active Bets",
      bet_history: "Bet History",
      subtab_all: "All",
      subtab_prematch: "Pre-Match",
      subtab_live: "Live",
      subtab_single: "Singles",
      subtab_combo: "Multiples",
      single: "Single",
      return_lbl: "Odds",
      stake: "Stake",
      estimated_payout: "Estimated Payout",
      early_cashout: "Early Cashout",
      copy: "Copy",
      share_img: "Share as Image",
      share: "Share"
    }
  },
  'pt-BR': {
    coupons: {
      title: "Minhas Apostas",
      active_bets: "Apostas Ativas",
      bet_history: "Histórico de Apostas",
      subtab_all: "Tudo",
      subtab_prematch: "Pré-Jogo",
      subtab_live: "Ao Vivo",
      subtab_single: "Simples",
      subtab_combo: "Múltiplas",
      single: "Simples",
      return_lbl: "Cotação",
      stake: "Aposta",
      estimated_payout: "Pagamento Estimado",
      early_cashout: "Encerrar Aposta",
      copy: "Copiar",
      share_img: "Compartilhar Imagem",
      share: "Compartilhar"
    }
  },
  es: {
    coupons: {
      title: "Mis Apuestas",
      active_bets: "Apuestas Activas",
      bet_history: "Historial de Apuestas",
      subtab_all: "Todo",
      subtab_prematch: "Prematch",
      subtab_live: "En Vivo",
      subtab_single: "Simples",
      subtab_combo: "Combinadas",
      single: "Simple",
      return_lbl: "Cuota",
      stake: "Apuesta",
      estimated_payout: "Pago Estimado",
      early_cashout: "Cerrar Apuesta",
      copy: "Copiar",
      share_img: "Compartir Imagen",
      share: "Compartir"
    }
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.coupons = { ...(data.coupons || {}), ...translations[lang].coupons };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});
