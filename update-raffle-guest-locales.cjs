const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'i18n', 'locales');
const languages = ['tr', 'en', 'pt-BR', 'es'];

const translations = {
  tr: {
    guest_title: "Çekilişe Nasıl Katılırım?",
    guest_step1_title: "1. Ücretsiz Kayıt Ol",
    guest_step1_desc: "Saniyeler içinde hesabını oluştur.",
    guest_step2_title: "2. İlk Yatırımını Yap",
    guest_step2_desc: "Hesabına bakiye yükleyerek şansını başlat.",
    guest_step3_title: "3. Biletlerini Topla!",
    guest_step3_desc: "Her 50$'lık yatırıma 1 bilet kazan.",
    guest_cta: "Hemen Kayıt Ol & Bilet Al"
  },
  en: {
    guest_title: "How to Participate?",
    guest_step1_title: "1. Register for Free",
    guest_step1_desc: "Create your account in seconds.",
    guest_step2_title: "2. Make a Deposit",
    guest_step2_desc: "Fund your account to unlock your luck.",
    guest_step3_title: "3. Collect Tickets!",
    guest_step3_desc: "Get 1 ticket for every $50 deposited.",
    guest_cta: "Register Now & Get Tickets"
  },
  'pt-BR': {
    guest_title: "Como Participar?",
    guest_step1_title: "1. Cadastre-se Grátis",
    guest_step1_desc: "Crie sua conta em segundos.",
    guest_step2_title: "2. Faça um Depósito",
    guest_step2_desc: "Adicione fundos para ativar sua sorte.",
    guest_step3_title: "3. Colete Ingressos!",
    guest_step3_desc: "Ganhe 1 ingresso a cada $50 depositados.",
    guest_cta: "Cadastre-se Agora e Ganhe"
  },
  es: {
    guest_title: "¿Cómo Participar?",
    guest_step1_title: "1. Regístrate Gratis",
    guest_step1_desc: "Crea tu cuenta en segundos.",
    guest_step2_title: "2. Haz un Depósito",
    guest_step2_desc: "Agrega fondos para activar tu suerte.",
    guest_step3_title: "3. ¡Reúne Boletos!",
    guest_step3_desc: "Gana 1 boleto por cada $50 depositados.",
    guest_cta: "Regístrate Ahora y Gana"
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.raffle = { ...(data.raffle || {}), ...translations[lang] };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json with guest locales`);
  }
});
