const fs = require('fs');

const contextFile = '/Users/alex/Desktop/7_24bets-landing-page/contexts/LanguageContext.tsx';
let content = fs.readFileSync(contextFile, 'utf8');

const newTranslations = {
  header_spor724: { tr: 'SPOR724', en: 'SPORTS724', es: 'DEPORTES724', pt: 'ESPORTES724' },
  header_gercek: { tr: 'Gerçek', en: 'Real', es: 'Real', pt: 'Real' },
  header_mbulten: { tr: 'M.Bülten', en: 'M.Bulletin', es: 'Boletín M.', pt: 'Boletim M.' },
  header_kuponlar: { tr: 'Kuponlar', en: 'Coupons', es: 'Cupones', pt: 'Cupons' },
  header_siteler: { tr: 'Siteler', en: 'Sites', es: 'Sitios', pt: 'Sites' },
  header_guvenilir: { tr: 'Güvenilir', en: 'Trusted', es: 'Confiable', pt: 'Confiável' },
  header_toto: { tr: '724TOTO', en: '724TOTO', es: '724TOTO', pt: '724TOTO' },
  header_casino: { tr: 'Casino', en: 'Casino', es: 'Casino', pt: 'Cassino' },
  header_gorevler: { tr: 'Görevler', en: 'Quests', es: 'Misiones', pt: 'Missões' },
  
  wallet_cuzdan: { tr: 'Cüzdan', en: 'Wallet', es: 'Billetera', pt: 'Carteira' },
  wallet_ara: { tr: 'Para Birimi Ara', en: 'Search Currency', es: 'Buscar Moneda', pt: 'Buscar Moeda' },
  wallet_ayarlar: { tr: 'Cüzdan Ayarları', en: 'Wallet Settings', es: 'Ajustes de Billetera', pt: 'Configurações da Carteira' },
  
  profile_profil: { tr: 'Profil', en: 'Profile', es: 'Perfil', pt: 'Perfil' },
  profile_gelenkutusu: { tr: 'Gelen Kutusu', en: 'Inbox', es: 'Bandeja de entrada', pt: 'Caixa de entrada' },
  profile_istirakler: { tr: 'İştirakler', en: 'Affiliates', es: 'Afiliados', pt: 'Afiliados' },
  profile_dogrulamalar: { tr: 'Doğrulamalar', en: 'Verifications', es: 'Verificaciones', pt: 'Verificações' },
  profile_ayarlar: { tr: 'Ayarlar', en: 'Settings', es: 'Ajustes', pt: 'Configurações' },
  profile_gizlilik: { tr: 'Gizlilik', en: 'Privacy', es: 'Privacidad', pt: 'Privacidade' },
  profile_baglantilar: { tr: 'Bağlantılar', en: 'Links', es: 'Enlaces', pt: 'Links' },
  profile_islemler: { tr: 'İşlemler', en: 'Transactions', es: 'Transacciones', pt: 'Transações' },
  profile_cikis: { tr: 'Çıkış yap', en: 'Log out', es: 'Cerrar sesión', pt: 'Sair' }
};

let translationsStr = '';
for (const [k, v] of Object.entries(newTranslations)) {
  translationsStr += `  ${k}: {
    tr: '${v.tr}',
    en: '${v.en}',
    es: '${v.es}',
    pt: '${v.pt}'
  },\n`;
}

content = content.replace('const translations: Translations = {', 'const translations: Translations = {\n' + translationsStr);
fs.writeFileSync(contextFile, content);

const headerFile = '/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx';
let headerContent = fs.readFileSync(headerFile, 'utf8');

// Replace categories labels
headerContent = headerContent.replace(/label: 'SPOR724'/g, "label: t('header_spor724')");
headerContent = headerContent.replace(/label: 'Gerçek'/g, "label: t('header_gercek')");
headerContent = headerContent.replace(/label: 'M.Bülten'/g, "label: t('header_mbulten')");
headerContent = headerContent.replace(/label: 'Kuponlar'/g, "label: t('header_kuponlar')");
headerContent = headerContent.replace(/label: 'Siteler'/g, "label: t('header_siteler')");
headerContent = headerContent.replace(/label: 'Güvenilir'/g, "label: t('header_guvenilir')");
headerContent = headerContent.replace(/label: '724TOTO'/g, "label: t('header_toto')");
headerContent = headerContent.replace(/label: 'Casino'/g, "label: t('header_casino')");
headerContent = headerContent.replace(/label: 'Görevler'/g, "label: t('header_gorevler')");

// Replace Wallet labels
headerContent = headerContent.replace(/>Cüzdan</g, ">{t('wallet_cuzdan')}<");
headerContent = headerContent.replace(/placeholder="Para Birimi Ara"/g, 'placeholder={t("wallet_ara")}');
headerContent = headerContent.replace(/Cüzdan Ayarları/g, "{t('wallet_ayarlar')}");

// Replace Profile labels
headerContent = headerContent.replace(/>Profil</g, ">{t('profile_profil')}<");
headerContent = headerContent.replace(/>Gelen Kutusu</g, ">{t('profile_gelenkutusu')}<");
headerContent = headerContent.replace(/>İştirakler</g, ">{t('profile_istirakler')}<");
headerContent = headerContent.replace(/>Doğrulamalar</g, ">{t('profile_dogrulamalar')}<");
headerContent = headerContent.replace(/>Ayarlar</g, ">{t('profile_ayarlar')}<");
headerContent = headerContent.replace(/>Gizlilik</g, ">{t('profile_gizlilik')}<");
headerContent = headerContent.replace(/>Bağlantılar</g, ">{t('profile_baglantilar')}<");
headerContent = headerContent.replace(/>İşlemler</g, ">{t('profile_islemler')}<");
headerContent = headerContent.replace(/>Çıkış yap</g, ">{t('profile_cikis')}<");

fs.writeFileSync(headerFile, headerContent);
