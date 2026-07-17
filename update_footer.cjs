const fs = require('fs');

const contextFile = '/Users/alex/Desktop/7_24bets-landing-page/contexts/LanguageContext.tsx';
let content = fs.readFileSync(contextFile, 'utf8');

const newTranslations = {
  footer_desc: { tr: 'Premium kripto ve havale odaklı casino deneyimi. Güvenli, hızlı ve adil oyun anlayışıyla sektörün en yenilikçi platformu.', en: 'Premium crypto and fiat focused casino experience. The most innovative platform in the industry with a secure, fast, and fair gaming approach.', es: 'Experiencia de casino premium enfocada en cripto y fiat. La plataforma más innovadora de la industria con un enfoque de juego seguro, rápido y justo.', pt: 'Experiência de cassino premium com foco em criptomoedas e fiduciárias. A plataforma mais inovadora do setor com uma abordagem de jogo segura, rápida e justa.' },
  footer_license: { tr: 'Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş bir Curacao eGaming (Lisans No: 1668/JAZ) lisansı altında faaliyet göstermektedir.', en: 'This website operates under a Curacao eGaming license (License No: 1668/JAZ) authorized and regulated by the Government of Curacao.', es: 'Este sitio web opera bajo una licencia de eGaming de Curazao (Licencia No: 1668/JAZ) autorizada y regulada por el Gobierno de Curazao.', pt: 'Este site opera sob uma licença Curacao eGaming (Licença nº: 1668/JAZ) autorizada e regulamentada pelo Governo de Curaçao.' },
  payment_methods: { tr: 'Ödeme Yöntemleri', en: 'Payment Methods', es: 'Métodos de Pago', pt: 'Métodos de Pagamento' },
  bank_transfer: { tr: 'HAVALE / EFT', en: 'BANK TRANSFER', es: 'TRANSFERENCIA', pt: 'TRANSFERÊNCIA' },
  trusted_providers: { tr: 'Güvenilir Sağlayıcılar', en: 'Trusted Providers', es: 'Proveedores Confiables', pt: 'Provedores Confiáveis' },
  responsible_gaming: { tr: 'Sorumlu Oyun', en: 'Responsible Gaming', es: 'Juego Responsable', pt: 'Jogo Responsável' },
  gambling_addictive: { tr: 'Kumar bağımlılık yapabilir.', en: 'Gambling can be addictive.', es: 'El juego puede ser adictivo.', pt: 'O jogo pode ser viciante.' },
  gambling_limits: { tr: 'Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın.', en: 'Please know your limits and play responsibly.', es: 'Conozca sus límites y juegue responsablemente.', pt: 'Conheça seus limites e jogue com responsabilidade.' },
  gambling_help_1: { tr: 'Yardım için', en: 'You can contact', es: 'Puede contactar a las', pt: 'Você pode entrar em contato com' },
  gambling_help_link: { tr: 'destek kurumlarına', en: 'support agencies', es: 'agencias de apoyo', pt: 'agências de suporte' },
  gambling_help_2: { tr: 'başvurabilirsiniz.', en: 'for help.', es: 'para obtener ayuda.', pt: 'para obter ajuda.' },
  terms_conditions: { tr: 'Kullanım Şartları', en: 'Terms of Use', es: 'Términos de Uso', pt: 'Termos de Uso' },
  privacy_policy: { tr: 'Gizlilik Politikası', en: 'Privacy Policy', es: 'Política de Privacidad', pt: 'Política de Privacidade' },
  kyc_policy: { tr: 'KYC Politikası', en: 'KYC Policy', es: 'Política KYC', pt: 'Política KYC' },
  all_rights_reserved: { tr: '© 2026 724BETS. Tüm Hakları Saklıdır.', en: '© 2026 724BETS. All Rights Reserved.', es: '© 2026 724BETS. Todos los derechos reservados.', pt: '© 2026 724BETS. Todos os direitos reservados.' }
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

const footerFile = '/Users/alex/Desktop/7_24bets-landing-page/components/Footer.tsx';
let footerContent = fs.readFileSync(footerFile, 'utf8');

if (!footerContent.includes('import { useLanguage }')) {
    footerContent = footerContent.replace("import { ShieldCheck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';", "import { ShieldCheck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';\nimport { useLanguage } from '../contexts/LanguageContext';");
}
footerContent = footerContent.replace('const Footer: React.FC = () => {', 'const Footer: React.FC = () => {\n  const { t } = useLanguage();');

footerContent = footerContent.replace('Premium kripto ve havale odaklı casino deneyimi. Güvenli, hızlı ve adil oyun anlayışıyla sektörün en yenilikçi platformu.', '{t("footer_desc")}');
footerContent = footerContent.replace('Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş bir Curacao eGaming (Lisans No: 1668/JAZ) lisansı altında faaliyet göstermektedir.', '{t("footer_license")}');
footerContent = footerContent.replace('>Ödeme Yöntemleri<', '>{t("payment_methods")}<');
footerContent = footerContent.replace('>HAVALE / EFT<', '>{t("bank_transfer")}<');
footerContent = footerContent.replace('>Güvenilir Sağlayıcılar<', '>{t("trusted_providers")}<');
footerContent = footerContent.replace(/>Sorumlu Oyun<\/h3>/, '>{t("responsible_gaming")}</h3>');
footerContent = footerContent.replace('>Kumar bağımlılık yapabilir.<', '>{t("gambling_addictive")}<');

const helpStr = `Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın. Yardım için <a href="#" className="text-white hover:text-[#10B981] underline">destek kurumlarına</a> başvurabilirsiniz.`;
const newHelpStr = `{t('gambling_limits')} {t('gambling_help_1')} <a href="#" className="text-white hover:text-[#10B981] underline">{t('gambling_help_link')}</a> {t('gambling_help_2')}`;
footerContent = footerContent.replace(helpStr, newHelpStr);

footerContent = footerContent.replace('>Kullanım Şartları<', '>{t("terms_conditions")}<');
footerContent = footerContent.replace('>Gizlilik Politikası<', '>{t("privacy_policy")}<');
footerContent = footerContent.replace(/>Sorumlu Oyun<\/a>/, '>{t("responsible_gaming")}</a>');
footerContent = footerContent.replace('>KYC Politikası<', '>{t("kyc_policy")}<');
footerContent = footerContent.replace('>© 2026 724BETS. Tüm Hakları Saklıdır.<', '>{t("all_rights_reserved")}<');

fs.writeFileSync(footerFile, footerContent);
