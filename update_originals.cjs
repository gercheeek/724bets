const fs = require('fs');

const contextFile = '/Users/alex/Desktop/7_24bets-landing-page/contexts/LanguageContext.tsx';
let content = fs.readFileSync(contextFile, 'utf8');

const newTranslations = {
  original_games: { tr: 'Orijinal Oyunlar', en: 'Original Games', es: 'Juegos Originales', pt: 'Jogos Originais' },
  desc_plinko: { tr: 'Fizik tabanlı çarpan eğlencesi.', en: 'Physics-based multiplier fun.', es: 'Diversión con multiplicadores físicos.', pt: 'Diversão com multiplicadores físicos.' },
  desc_keno: { tr: 'Şansını sayılarla dene.', en: 'Try your luck with numbers.', es: 'Prueba tu suerte con los números.', pt: 'Tente a sorte com números.' },
  desc_dice: { tr: 'Hızlı, adil ve kazançlı zar oyunu.', en: 'Fast, fair, and rewarding dice game.', es: 'Juego de dados rápido, justo y gratificante.', pt: 'Jogo de dados rápido, justo e recompensador.' },
  desc_mines: { tr: 'Mayınlara basmadan elmasları topla.', en: 'Collect diamonds without stepping on mines.', es: 'Recoge diamantes sin pisar minas.', pt: 'Colete diamantes sem pisar em minas.' },
  desc_war: { tr: 'Savaş! Kimin kartı daha yüksek?', en: 'War! Whose card is higher?', es: '¡Guerra! ¿De quién es la carta más alta?', pt: 'Guerra! De quem é a carta mais alta?' },
  desc_hilo: { tr: 'Bir sonraki kart yüksek mi düşük mü?', en: 'Is the next card high or low?', es: '¿La siguiente carta es alta o baja?', pt: 'A próxima carta é alta ou baixa?' },
  desc_blackjack: { tr: 'Klasik casino deneyimi, premium kalite.', en: 'Classic casino experience, premium quality.', es: 'Experiencia de casino clásica, calidad premium.', pt: 'Experiência clássica de cassino, qualidade premium.' },
  desc_roulette: { tr: 'Orijinal 724Bets Rulet heyecanı.', en: 'Original 724Bets Roulette excitement.', es: 'Emoción de Ruleta Original 724Bets.', pt: 'Emoção da Roleta Original 724Bets.' },
  desc_chickencross: { tr: 'Tavuk karşıya geçebilecek mi?', en: 'Can the chicken cross?', es: '¿Podrá la gallina cruzar?', pt: 'A galinha conseguirá atravessar?' },
  desc_limbo: { tr: 'Sınırları zorla, devasa çarpanları yakala.', en: 'Push the limits, catch massive multipliers.', es: 'Supera los límites, atrapa multiplicadores masivos.', pt: 'Supere os limites, pegue multiplicadores massivos.' }
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

const originalsFile = '/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsSlider.tsx';
let originalsContent = fs.readFileSync(originalsFile, 'utf8');

// Replace static texts in OriginalsSlider
originalsContent = originalsContent.replace('export const ORIGINALS_DATA: GameData[] = [', 'export const getOriginalsData = (t: (key: string) => string): GameData[] => [\n');

originalsContent = originalsContent.replace("'Fizik tabanlı çarpan eğlencesi.'", 't("desc_plinko")');
originalsContent = originalsContent.replace("'Şansını sayılarla dene.'", 't("desc_keno")');
originalsContent = originalsContent.replace("'Hızlı, adil ve kazançlı zar oyunu.'", 't("desc_dice")');
originalsContent = originalsContent.replace("'Mayınlara basmadan elmasları topla.'", 't("desc_mines")');
originalsContent = originalsContent.replace("'Savaş! Kimin kartı daha yüksek?'", 't("desc_war")');
originalsContent = originalsContent.replace("'Bir sonraki kart yüksek mi düşük mü?'", 't("desc_hilo")');
originalsContent = originalsContent.replace("'Klasik casino deneyimi, premium kalite.'", 't("desc_blackjack")');
originalsContent = originalsContent.replace("'Orijinal 724Bets Rulet heyecanı.'", 't("desc_roulette")');
originalsContent = originalsContent.replace("'Tavuk karşıya geçebilecek mi?'", 't("desc_chickencross")');
originalsContent = originalsContent.replace("'Sınırları zorla, devasa çarpanları yakala.'", 't("desc_limbo")');

originalsContent = originalsContent.replace('export default function OriginalsSlider({ onNavigate }: { onNavigate: (v: string) => void }) {', 'export default function OriginalsSlider({ onNavigate }: { onNavigate: (v: string) => void }) {\n  const { t } = useLanguage();\n  const originalsData = getOriginalsData(t);');

originalsContent = originalsContent.replace('Orijinal Oyunlar', '{t("original_games")}');
originalsContent = originalsContent.replace('{ORIGINALS_DATA.map((game) => (', '{originalsData.map((game) => (');
originalsContent = originalsContent.replace('Oyuncular', '{t("players")}');

fs.writeFileSync(originalsFile, originalsContent);
