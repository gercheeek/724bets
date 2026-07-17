const fs = require('fs');

const contextFile = '/Users/alex/Desktop/7_24bets-landing-page/contexts/LanguageContext.tsx';
let content = fs.readFileSync(contextFile, 'utf8');

const newTranslations = {
  p_30kadar: { tr: "30$'A KADAR", en: "UP TO $30", es: "HASTA $30", pt: "ATÉ $30" },
  p_freespin: { tr: "FREE SPIN", en: "FREE SPIN", es: "GIROS GRATIS", pt: "GIROS GRÁTIS" },
  p_haftanin: { tr: "Haftanın Oyunu", en: "Game of the Week", es: "Juego de la Semana", pt: "Jogo da Semana" },
  p_hemen_oyna: { tr: "Hemen Oyna", en: "Play Now", es: "Jugar Ahora", pt: "Jogue Agora" },
  p_30: { tr: "%30", en: "30%", es: "30%", pt: "30%" },
  p_nakit_iade: { tr: "NAKİT İADE", en: "CASHBACK", es: "REEMBOLSO", pt: "CASHBACK" },
  p_ilk_hafta: { tr: "İlk Haftanızda. Her Gün.", en: "In your first week. Every day.", es: "En tu primera semana. Cada día.", pt: "Na sua primeira semana. Todos os dias." },
  p_yatirim_yap: { tr: "Yatırım yap", en: "Deposit", es: "Depositar", pt: "Depositar" },
  p_kazanma_sansi: { tr: "KAZANMA ŞANSI", en: "CHANCE TO WIN", es: "OPORTUNIDAD DE GANAR", pt: "CHANCE DE GANHAR" },
  p_10k_nakit: { tr: "$10.000 NAKİT", en: "$10,000 CASH", es: "$10,000 EFECTIVO", pt: "$10.000 DINHEIRO" },
  p_dk_sandiklari: { tr: "Dünya Kupası Sandıkları.\nBahis Yap. Kazan. Tekrarla.", en: "World Cup Chests.\nBet. Win. Repeat.", es: "Cofres del Mundial.\nApuesta. Gana. Repite.", pt: "Baús da Copa do Mundo.\nAposte. Ganhe. Repita." },
  p_buyuk_basla: { tr: "BÜYÜK BAŞLA", en: "START BIG", es: "COMIENZA EN GRANDE", pt: "COMECE GRANDE" },
  p_7k_kadar: { tr: "7,000$'a kadar", en: "Up to $7,000", es: "Hasta $7,000", pt: "Até $7.000" },
  p_130_fs: { tr: "+ 130 Free Spin\nİlk 4 yatırımınızda.", en: "+ 130 Free Spins\nOn your first 4 deposits.", es: "+ 130 Giros Gratis\nEn tus primeros 4 depósitos.", pt: "+ 130 Giros Grátis\nNos seus 4 primeiros depósitos." },
  p_100_basla: { tr: "%100'LE BAŞLA", en: "START WITH 100%", es: "COMIENZA CON 100%", pt: "COMECE COM 100%" },
  p_spor_bonusu: { tr: "SPOR BONUSU", en: "SPORTS BONUS", es: "BONO DEPORTIVO", pt: "BÔNUS DE ESPORTES" },
  p_500_kadar: { tr: "500$'a kadar", en: "Up to $500", es: "Hasta $500", pt: "Até $500" },
  p_dunya_kupasi: { tr: "DÜNYA KUPASI", en: "WORLD CUP", es: "MUNDIAL", pt: "COPA DO MUNDO" },
  p_mega_boost: { tr: "MEGA BOOST", en: "MEGA BOOST", es: "MEGA BOOST", pt: "MEGA BOOST" },
  p_daha_yuksek: { tr: "Daha yüksek oranlar.\nDaha büyük kazançlar.", en: "Higher odds.\nBigger wins.", es: "Mayores cuotas.\nMayores ganancias.", pt: "Maiores odds.\nMaiores ganhos." },
  p_bahis_yap: { tr: "Bahis Yap", en: "Bet Now", es: "Apostar", pt: "Apostar" },
  p_500_varan: { tr: "%500'E VARAN", en: "UP TO 500%", es: "HASTA 500%", pt: "ATÉ 500%" },
  p_kazanc_boostu: { tr: "KAZANÇ BOOSTU", en: "WIN BOOST", es: "BOOST DE GANANCIAS", pt: "BOOST DE GANHOS" },
  p_acca: { tr: "ACCA'nı oluştur.\nOranlara meydan oku.", en: "Build your ACCA.\nDefy the odds.", es: "Crea tu ACCA.\nDesafía las cuotas.", pt: "Construa sua ACCA.\nDesafie as odds." },
  p_20_ekstra: { tr: "%20 EKSTRA", en: "20% EXTRA", es: "20% EXTRA", pt: "20% EXTRA" },
  p_200_bonus: { tr: "200$'a Kadar Bonus!", en: "Up to $200 Bonus!", es: "¡Hasta $200 de Bono!", pt: "Até $200 de Bônus!" },
  p_app_indir: { tr: "APP'İ İNDİR", en: "DOWNLOAD APP", es: "DESCARGA LA APP", pt: "BAIXE O APP" },
  p_40_fs: { tr: "40 FREE SPIN AL", en: "GET 40 FREE SPINS", es: "CONSIGUE 40 GIROS GRATIS", pt: "GANHE 40 GIROS GRÁTIS" },
  p_21_yaninda: { tr: "21'i yanında taşı.", en: "Carry 21 with you.", es: "Lleva 21 contigo.", pt: "Leve o 21 com você." },
  p_simdi_indir: { tr: "Şimdi İndir", en: "Download Now", es: "Descargar Ahora", pt: "Baixar Agora" },
  p_cevir_kazan: { tr: "ÇEVİR KAZAN", en: "SPIN & WIN", es: "GIRA Y GANA", pt: "GIRE E GANHE" },
  p_5k_nakit: { tr: "5.000$ NAKİT", en: "$5,000 CASH", es: "$5,000 EFECTIVO", pt: "$5.000 DINHEIRO" },
  p_4_fs_hergun: { tr: "4 Free Spin. Her gün.", en: "4 Free Spins. Every day.", es: "4 Giros Gratis. Cada día.", pt: "4 Giros Grátis. Todos os dias." },
  p_simdi_cevir: { tr: "Şimdi Çevir", en: "Spin Now", es: "Girar Ahora", pt: "Girar Agora" },
  p_21_elite: { tr: "21 Elite CLUB'A", en: "TO 21 Elite CLUB", es: "AL 21 Elite CLUB", pt: "AO 21 Elite CLUB" },
  p_hos_geldiniz: { tr: "HOŞ GELDİNİZ", en: "WELCOME", es: "BIENVENIDOS", pt: "BEM-VINDOS" },
  p_yukseldikce: { tr: "Yükseldikçe kazan.", en: "Win as you rise.", es: "Gana mientras subes.", pt: "Ganhe enquanto sobe." },
  p_her_gun: { tr: "HER GÜN", en: "EVERY DAY", es: "CADA DÍA", pt: "TODOS OS DIAS" },
  p_10_bonus: { tr: "%10 Bonus", en: "10% Bonus", es: "10% de Bono", pt: "10% de Bônus" },
  p_yatir_oyna: { tr: "Yatır. Oyna. Kazan.", en: "Deposit. Play. Win.", es: "Deposita. Juega. Gana.", pt: "Deposite. Jogue. Ganhe." },
  p_davet_et: { tr: "DAVET ET & KAZAN", en: "INVITE & WIN", es: "INVITA Y GANA", pt: "CONVIDE E GANHE" },
  p_20_nakit: { tr: "%20 NAKİT", en: "20% CASH", es: "20% EFECTIVO", pt: "20% DINHEIRO" },
  p_kazancini_arttir: { tr: "Kazancını arttır.", en: "Increase your winnings.", es: "Aumenta tus ganancias.", pt: "Aumente seus ganhos." },
  p_hemen_basla: { tr: "Hemen Başla", en: "Start Now", es: "Comenzar Ahora", pt: "Comece Agora" },
  p_buyuk_oyna: { tr: "BÜYÜK OYNA", en: "PLAY BIG", es: "JUEGA GRANDE", pt: "JOGUE GRANDE" },
  p_bizle_kal: { tr: "BİZLE KAL", en: "STAY WITH US", es: "QUÉDATE CON NOSOTROS", pt: "FIQUE CONOSCO" },
  p_21_kanallari: { tr: "21 kanallarına katıl.", en: "Join 21 channels.", es: "Únete a los canales de 21.", pt: "Junte-se aos canais do 21." },
  p_hemen_katil: { tr: "Hemen katıl", en: "Join Now", es: "Únete Ahora", pt: "Participe Agora" }
};

let translationsStr = '';
for (const [k, v] of Object.entries(newTranslations)) {
  translationsStr += `  ${k}: {
    tr: \`${v.tr}\`,
    en: \`${v.en}\`,
    es: \`${v.es}\`,
    pt: \`${v.pt}\`
  },\n`;
}

content = content.replace('const translations: Translations = {', 'const translations: Translations = {\n' + translationsStr);
fs.writeFileSync(contextFile, content);

const promoFile = '/Users/alex/Desktop/7_24bets-landing-page/components/PromoSlider.tsx';
let promoContent = fs.readFileSync(promoFile, 'utf8');

if (!promoContent.includes('import { useLanguage }')) {
    promoContent = promoContent.replace("import { Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';", "import { Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';\nimport { useLanguage } from '../contexts/LanguageContext';");
}
promoContent = promoContent.replace('export const PromoSlider: React.FC = () => {', 'export const PromoSlider: React.FC = () => {\n  const { t } = useLanguage();\n\n  const PROMOS: Promo[] = [\n    { id: 1, title1: t("p_30kadar"), title2: t("p_freespin"), subtitle: t("p_haftanin"), buttonText: t("p_hemen_oyna"), icon: "🦊" },\n    { id: 2, title1: t("p_30"), title2: t("p_nakit_iade"), subtitle: t("p_ilk_hafta"), buttonText: t("p_yatirim_yap"), icon: "🤑" },\n    { id: 3, title1: t("p_kazanma_sansi"), title2: t("p_10k_nakit"), subtitle: t("p_dk_sandiklari"), buttonText: t("p_hemen_oyna"), icon: "🎁" },\n    { id: 4, title1: t("p_buyuk_basla"), title2: t("p_7k_kadar"), subtitle: t("p_130_fs"), buttonText: t("p_yatirim_yap"), icon: "💎" },\n    { id: 5, title1: t("p_100_basla"), title2: t("p_spor_bonusu"), subtitle: t("p_500_kadar"), buttonText: t("p_yatirim_yap"), icon: "⚽" },\n    { id: 6, title1: t("p_dunya_kupasi"), title2: t("p_mega_boost"), subtitle: t("p_daha_yuksek"), buttonText: t("p_bahis_yap"), icon: "🏆" },\n    { id: 7, title1: t("p_500_varan"), title2: t("p_kazanc_boostu"), subtitle: t("p_acca"), buttonText: t("p_bahis_yap"), icon: "🚀" },\n    { id: 8, title1: t("p_dunya_kupasi"), title2: t("p_20_ekstra"), subtitle: t("p_200_bonus"), buttonText: t("p_bahis_yap"), icon: "⚡" },\n    { id: 9, title1: t("p_app_indir"), title2: t("p_40_fs"), subtitle: t("p_21_yaninda"), buttonText: t("p_simdi_indir"), icon: "📱" },\n    { id: 10, title1: t("p_cevir_kazan"), title2: t("p_5k_nakit"), subtitle: t("p_4_fs_hergun"), buttonText: t("p_simdi_cevir"), icon: "🎡" },\n    { id: 11, title1: t("p_21_elite"), title2: t("p_hos_geldiniz"), subtitle: t("p_yukseldikce"), buttonText: t("p_hemen_oyna"), icon: "🛡️" },\n    { id: 12, title1: t("p_her_gun"), title2: t("p_10_bonus"), subtitle: t("p_yatir_oyna"), buttonText: t("p_yatirim_yap"), icon: "🎰" },\n    { id: 13, title1: t("p_davet_et"), title2: t("p_20_nakit"), subtitle: t("p_kazancini_arttir"), buttonText: t("p_hemen_basla"), icon: "🤝" },\n    { id: 14, title1: t("p_buyuk_oyna"), title2: t("p_bizle_kal"), subtitle: t("p_21_kanallari"), buttonText: t("p_hemen_katil"), icon: "💬" },\n  ];');

promoContent = promoContent.replace(/const PROMOS: Promo\[\] = \[\s+{(.|\n)+}\s+\];/m, ''); // Remove the outer PROMOS array

fs.writeFileSync(promoFile, promoContent);
