const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'i18n', 'locales');
const languages = ['tr', 'en', 'pt-BR', 'es'];

const translations = {
  tr: {
    common: {
      live: "CANLI",
      member: "Üye"
    }
  },
  en: {
    common: {
      live: "LIVE",
      member: "User"
    }
  },
  'pt-BR': {
    common: {
      live: "VIVO",
      member: "Membro"
    }
  },
  es: {
    common: {
      live: "VIVO",
      member: "Miembro"
    }
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.common = { ...(data.common || {}), ...translations[lang].common };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});
