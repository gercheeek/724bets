const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'i18n', 'locales');
const languages = ['tr', 'en', 'pt-BR', 'es'];

const translations = {
  tr: {
    wallet: {
      title: "Cüzdan",
      deposit: "Para Yatır",
      withdraw: "Para Çek",
      two_factor_disabled: "Şu anda 2FA etkin değil",
      enable_2fa: "2FA'yı Etkinleştir",
      deposit_options: "Para Yatırma Seçenekleri",
      withdraw_options: "Para Çekme Seçenekleri",
      crypto_deposit: "Kripto Para Yatırma",
      crypto_withdraw: "Kripto Para Çekme",
      exchanges: "Borsalar ve Cüzdanlar",
      bank: "Banka hesabı",
      gift_cards: "Hediye Kartları",
      others: "Diğer",
      popular: "POPÜLER"
    }
  },
  en: {
    wallet: {
      title: "Wallet",
      deposit: "Deposit",
      withdraw: "Withdraw",
      two_factor_disabled: "2FA is currently disabled",
      enable_2fa: "Enable 2FA",
      deposit_options: "Deposit Options",
      withdraw_options: "Withdraw Options",
      crypto_deposit: "Crypto Deposit",
      crypto_withdraw: "Crypto Withdraw",
      exchanges: "Exchanges and Wallets",
      bank: "Bank Account",
      gift_cards: "Gift Cards",
      others: "Other",
      popular: "POPULAR"
    }
  },
  'pt-BR': {
    wallet: {
      title: "Carteira",
      deposit: "Depositar",
      withdraw: "Sacar",
      two_factor_disabled: "2FA está desativado",
      enable_2fa: "Ativar 2FA",
      deposit_options: "Opções de Depósito",
      withdraw_options: "Opções de Saque",
      crypto_deposit: "Depósito Cripto",
      crypto_withdraw: "Saque Cripto",
      exchanges: "Exchanges e Carteiras",
      bank: "Conta Bancária",
      gift_cards: "Cartões Presente",
      others: "Outros",
      popular: "POPULAR"
    }
  },
  es: {
    wallet: {
      title: "Cartera",
      deposit: "Depositar",
      withdraw: "Retirar",
      two_factor_disabled: "El 2FA está desactivado",
      enable_2fa: "Habilitar 2FA",
      deposit_options: "Opciones de Depósito",
      withdraw_options: "Opciones de Retiro",
      crypto_deposit: "Depósito de Cripto",
      crypto_withdraw: "Retiro de Cripto",
      exchanges: "Exchanges y Carteras",
      bank: "Cuenta Bancaria",
      gift_cards: "Tarjetas de Regalo",
      others: "Otros",
      popular: "POPULAR"
    }
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.wallet = { ...(data.wallet || {}), ...translations[lang].wallet };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json with wallet locales`);
  }
});
