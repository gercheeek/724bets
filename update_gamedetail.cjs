const fs = require('fs');

const contextFile = '/Users/alex/Desktop/7_24bets-landing-page/contexts/LanguageContext.tsx';
let content = fs.readFileSync(contextFile, 'utf8');

const newTranslations = {
  about_game: { tr: 'Oyun Hakkında', en: 'About Game', es: 'Acerca del Juego', pt: 'Sobre o Jogo' },
  default_game_desc: { 
    tr: 'oyunu tamamen şeffaf ve %100 kanıtlanabilir adil (Provably Fair) altyapısıyla çalışmaktadır. Sonuçlar önceden belirlenir ve dışarıdan asla müdahale edilemez. Hemen oynamaya başla ve devasa çarpanları yakala.',
    en: 'game operates with a completely transparent and 100% Provably Fair infrastructure. Results are predetermined and can never be manipulated from the outside. Start playing now and catch massive multipliers.',
    es: 'juego funciona con una infraestructura completamente transparente y 100% Provably Fair. Los resultados están predeterminados y nunca pueden ser manipulados desde el exterior. Empieza a jugar ahora y atrapa multiplicadores masivos.',
    pt: 'jogo opera com uma infraestrutura completamente transparente e 100% Provably Fair. Os resultados são predeterminados e nunca podem ser manipulados de fora. Comece a jogar agora e pegue multiplicadores enormes.'
  },
  play_now_caps: { tr: 'HEMEN OYNA', en: 'PLAY NOW', es: 'JUGAR AHORA', pt: 'JOGAR AGORA' },
  right_now: { tr: 'ŞU AN', en: 'CURRENTLY', es: 'ACTUALMENTE', pt: 'ATUALMENTE' },
  active_players_caps: { tr: 'OYUNCU AKTİF', en: 'PLAYERS ACTIVE', es: 'JUGADORES ACTIVOS', pt: 'JOGADORES ATIVOS' }
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

const modalFile = '/Users/alex/Desktop/7_24bets-landing-page/components/GameDetailModal.tsx';
let modalContent = fs.readFileSync(modalFile, 'utf8');

if (!modalContent.includes('import { useLanguage }')) {
    modalContent = modalContent.replace("import { X, Play, ShieldCheck } from 'lucide-react';", "import { X, Play, ShieldCheck } from 'lucide-react';\nimport { useLanguage } from '../contexts/LanguageContext';");
}
modalContent = modalContent.replace('export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, isOpen, onClose, onPlay }) => {', 'export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, isOpen, onClose, onPlay }) => {\n    const { t } = useLanguage();');

modalContent = modalContent.replace('Oyun Hakkında', '{t("about_game")}');
modalContent = modalContent.replace('oyunu tamamen şeffaf ve %100 kanıtlanabilir adil (Provably Fair) altyapısıyla çalışmaktadır. Sonuçlar önceden belirlenir ve dışarıdan asla müdahale edilemez. Hemen oynamaya başla ve devasa çarpanları yakala.', '{t("default_game_desc")}');
modalContent = modalContent.replace('HEMEN OYNA', '{t("play_now_caps")}');
modalContent = modalContent.replace('ŞU AN <span className="text-[#10B981]">{game.players.toLocaleString(\'tr-TR\')} OYUNCU</span> AKTİF', '{t("right_now")} <span className="text-[#10B981]">{game.players.toLocaleString()} {t("active_players_caps")}</span>');

fs.writeFileSync(modalFile, modalContent);
