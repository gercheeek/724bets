const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'i18n', 'locales');
const languages = ['tr', 'en', 'pt-BR', 'es'];

const translations = {
  tr: {
    toast_just: "az önce",
    toast_deposited: "yatırdı ve",
    toast_tickets: "bilet",
    toast_won: "kazandı!"
  },
  en: {
    toast_just: "just",
    toast_deposited: "deposited and",
    toast_tickets: "tickets",
    toast_won: "won!"
  },
  'pt-BR': {
    toast_just: "acabou de",
    toast_deposited: "depositar e",
    toast_tickets: "bilhetes",
    toast_won: "ganhou!"
  },
  es: {
    toast_just: "acaba de",
    toast_deposited: "depositar y",
    toast_tickets: "boletos",
    toast_won: "ganó!"
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.raffle = { ...(data.raffle || {}), ...translations[lang] };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json with toast pieces`);
  }
});
