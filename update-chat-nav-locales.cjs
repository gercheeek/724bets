const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'i18n', 'locales');
const languages = ['tr', 'en', 'pt-BR', 'es'];

const translations = {
  tr: {
    chat: {
      login_required: "Mesaj göndermek için lütfen giriş yapın",
      placeholder: "Bir mesaj gönder..."
    },
    nav: {
      lobby: "Lobi",
      esports: "E-Sporlar",
      my_bets: "Bahislerim",
      bet_slip: "Bahis kuponu",
      search: "Ara"
    }
  },
  en: {
    chat: {
      login_required: "Please log in to send a message",
      placeholder: "Send a message..."
    },
    nav: {
      lobby: "Lobby",
      esports: "E-Sports",
      my_bets: "My Bets",
      bet_slip: "Bet Slip",
      search: "Search"
    }
  },
  'pt-BR': {
    chat: {
      login_required: "Faça login para enviar uma mensagem",
      placeholder: "Enviar mensagem..."
    },
    nav: {
      lobby: "Lobby",
      esports: "E-Sports",
      my_bets: "Minhas Apostas",
      bet_slip: "Boletim",
      search: "Busca"
    }
  },
  es: {
    chat: {
      login_required: "Inicia sesión para enviar mensaje",
      placeholder: "Enviar un mensaje..."
    },
    nav: {
      lobby: "Lobby",
      esports: "E-Sports",
      my_bets: "Mis Apuestas",
      bet_slip: "Boleto",
      search: "Buscar"
    }
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.chat = { ...(data.chat || {}), ...translations[lang].chat };
    data.nav = { ...(data.nav || {}), ...translations[lang].nav };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json with chat and nav locales`);
  }
});
