const fs = require('fs');

const contextFile = '/Users/alex/Desktop/7_24bets-landing-page/contexts/LanguageContext.tsx';
let content = fs.readFileSync(contextFile, 'utf8');

const newTranslations = {
  canli: { tr: 'CANLI', en: 'LIVE', es: 'EN VIVO', pt: 'AO VIVO' },
  taraf: { tr: 'TARAF', en: 'SIDES', es: 'LADOS', pt: 'LADOS' },
  senin_icin: { tr: 'SENİN İÇİN SEÇİLDİ', en: 'CHOSEN FOR YOU', es: 'ELEGIDO PARA TI', pt: 'ESCOLHIDO PARA VOCÊ' },
  uefa: { tr: 'UEFA Avrupa Ligi', en: 'UEFA Europa League', es: 'UEFA Europa League', pt: 'UEFA Europa League' },
  wimbledon_w: { tr: 'Wimbledon Kadınlar Tenisi', en: 'Wimbledon Women', es: 'Wimbledon Femenino', pt: 'Wimbledon Feminino' },
  wimbledon_m: { tr: 'Wimbledon Tek Erkekler', en: 'Wimbledon Men', es: 'Wimbledon Masculino', pt: 'Wimbledon Masculino' },
  conference: { tr: 'UEFA Conference League', en: 'UEFA Conference League', es: 'UEFA Conference League', pt: 'UEFA Conference League' },
  ana_sporlar: { tr: 'ANA SPORLAR', en: 'MAIN SPORTS', es: 'DEPORTES PRINCIPALES', pt: 'ESPORTES PRINCIPAIS' },
  futbol: { tr: 'Futbol', en: 'Football', es: 'Fútbol', pt: 'Futebol' },
  tenis: { tr: 'Tenis', en: 'Tennis', es: 'Tenis', pt: 'Tênis' },
  basketbol: { tr: 'Basketbol', en: 'Basketball', es: 'Baloncesto', pt: 'Basquete' },
  beyzbol: { tr: 'Beyzbol', en: 'Baseball', es: 'Béisbol', pt: 'Beisebol' },
  mma: { tr: 'MMA', en: 'MMA', es: 'MMA', pt: 'MMA' },
  tum_sporlar: { tr: 'TÜM SPORLAR', en: 'ALL SPORTS', es: 'TODOS LOS DEPORTES', pt: 'TODOS OS ESPORTES' },
  ragbi: { tr: 'Ragbi', en: 'Rugby', es: 'Rugby', pt: 'Rugby' },
  avustralya: { tr: 'Avustralya Futbolu', en: 'Aussie Rules', es: 'Reglas Australianas', pt: 'Regras Australianas' },
  hentbol: { tr: 'Hentbol', en: 'Handball', es: 'Balonmano', pt: 'Handebol' },
  kriket: { tr: 'Kriket', en: 'Cricket', es: 'Críquet', pt: 'Críquete' },
  voleybol: { tr: 'Voleybol', en: 'Volleyball', es: 'Voleibol', pt: 'Vôlei' },
  dart: { tr: 'Dart', en: 'Darts', es: 'Dardos', pt: 'Dardos' },
  boks: { tr: 'Boks', en: 'Boxing', es: 'Boxeo', pt: 'Boxe' },
  buz_hokeyi: { tr: 'Buz Hokeyi', en: 'Ice Hockey', es: 'Hockey sobre Hielo', pt: 'Hóquei no Gelo' },
  masa_tenisi: { tr: 'Masa Tenisi', en: 'Table Tennis', es: 'Tenis de Mesa', pt: 'Tênis de Mesa' },
  tum_esporlar: { tr: 'TÜM E-SPORLAR', en: 'ALL E-SPORTS', es: 'TODOS LOS E-SPORTS', pt: 'TODOS OS E-SPORTS' },
  efutbol: { tr: 'eFutbol', en: 'eFootball', es: 'eFútbol', pt: 'eFutebol' },
  nba2k: { tr: 'NBA2K', en: 'NBA2K', es: 'NBA2K', pt: 'NBA2K' },
  cs2: { tr: 'CS2', en: 'CS2', es: 'CS2', pt: 'CS2' },
  dota2: { tr: 'Dota 2', en: 'Dota 2', es: 'Dota 2', pt: 'Dota 2' },
  valorant: { tr: 'Valorant', en: 'Valorant', es: 'Valorant', pt: 'Valorant' },
  lol: { tr: 'League of Legends', en: 'League of Legends', es: 'League of Legends', pt: 'League of Legends' },
  analiz: { tr: '724BETS ANALİZ & CANLI BÜLTEN', en: '724BETS ANALYSIS & LIVE BULLETIN', es: '724BETS ANÁLISIS Y BOLETÍN', pt: '724BETS ANÁLISE E BOLETIM' },
  mobil_bulten: { tr: 'MOBİL BÜLTEN', en: 'MOBILE BULLETIN', es: 'BOLETÍN MÓVIL', pt: 'BOLETIM MÓVEL' },
  at_yarisi: { tr: 'AT YARIŞI', en: 'HORSE RACING', es: 'CARRERAS DE CABALLOS', pt: 'CORRIDA DE CAVALOS' },
  sss: { tr: 'SSS', en: 'FAQ', es: 'FAQ', pt: 'FAQ' },
  kurallar: { tr: 'BAHİS KURALLARI', en: 'BETTING RULES', es: 'REGLAS DE APUESTAS', pt: 'REGRAS DE APOSTAS' },
  oran: { tr: 'ORAN FORMATI', en: 'ODDS FORMAT', es: 'FORMATO DE CUOTAS', pt: 'FORMATO DE ODDS' },
  diger: { tr: 'DİĞER OYUNLAR', en: 'OTHER GAMES', es: 'OTROS JUEGOS', pt: 'OUTROS JOGOS' },
  casino724: { tr: '724Casino', en: '724Casino', es: '724Casino', pt: '724Casino' },
  toto: { tr: '724TOTO', en: '724TOTO', es: '724TOTO', pt: '724TOTO' },
  gorevler: { tr: 'Görevler', en: 'Quests', es: 'Misiones', pt: 'Missões' },
  guvenilir_siteler: { tr: 'Güvenilir Siteler', en: 'Trusted Sites', es: 'Sitios Confiables', pt: 'Sites Confiáveis' },
  cekilis_yonetimi: { tr: 'Çekiliş Yönetimi', en: 'Giveaway Mgmt', es: 'Gestión Sorteos', pt: 'Gestão Sorteios' },
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

const sidebarFile = '/Users/alex/Desktop/7_24bets-landing-page/components/Sidebar.tsx';
let sidebarContent = fs.readFileSync(sidebarFile, 'utf8');
if (!sidebarContent.includes('import { useLanguage }')) {
    sidebarContent = sidebarContent.replace("import { NavVisibility } from './Header';", "import { NavVisibility } from './Header';\nimport { useLanguage } from '../contexts/LanguageContext';");
}
sidebarContent = sidebarContent.replace('const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});', 'const { t } = useLanguage();\n  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});');

// Replace labels in Sidebar.tsx
sidebarContent = sidebarContent.replace(/{ id: 'canli', label: 'CANLI'/g, "{ id: 'canli', label: t('canli')");
sidebarContent = sidebarContent.replace(/{ id: 'taraf', label: 'TARAF'/g, "{ id: 'taraf', label: t('taraf')");
sidebarContent = sidebarContent.replace(/{ id: 'casino', label: 'CASINO'/g, "{ id: 'casino', label: t('casino').toUpperCase()");
sidebarContent = sidebarContent.replace(/label: 'SENİN İÇİN SEÇİLDİ'/g, "label: t('senin_icin')");
sidebarContent = sidebarContent.replace(/label: 'UEFA Avrupa Ligi'/g, "label: t('uefa')");
sidebarContent = sidebarContent.replace(/label: 'Wimbledon Kadınlar Tenisi'/g, "label: t('wimbledon_w')");
sidebarContent = sidebarContent.replace(/label: 'Wimbledon Tek Erkekler'/g, "label: t('wimbledon_m')");
sidebarContent = sidebarContent.replace(/label: 'UEFA Conference League'/g, "label: t('conference')");
sidebarContent = sidebarContent.replace(/label: 'ANA SPORLAR'/g, "label: t('ana_sporlar')");
sidebarContent = sidebarContent.replace(/label: 'Futbol'/g, "label: t('futbol')");
sidebarContent = sidebarContent.replace(/label: 'Tenis'/g, "label: t('tenis')");
sidebarContent = sidebarContent.replace(/label: 'Basketbol'/g, "label: t('basketbol')");
sidebarContent = sidebarContent.replace(/label: 'Beyzbol'/g, "label: t('beyzbol')");
sidebarContent = sidebarContent.replace(/label: 'MMA'/g, "label: t('mma')");
sidebarContent = sidebarContent.replace(/label: 'TÜM SPORLAR'/g, "label: t('tum_sporlar')");
sidebarContent = sidebarContent.replace(/label: 'Ragbi'/g, "label: t('ragbi')");
sidebarContent = sidebarContent.replace(/label: 'Avustralya Futbolu'/g, "label: t('avustralya')");
sidebarContent = sidebarContent.replace(/label: 'Hentbol'/g, "label: t('hentbol')");
sidebarContent = sidebarContent.replace(/label: 'Kriket'/g, "label: t('kriket')");
sidebarContent = sidebarContent.replace(/label: 'Voleybol'/g, "label: t('voleybol')");
sidebarContent = sidebarContent.replace(/label: 'Dart'/g, "label: t('dart')");
sidebarContent = sidebarContent.replace(/label: 'Boks'/g, "label: t('boks')");
sidebarContent = sidebarContent.replace(/label: 'Buz Hokeyi'/g, "label: t('buz_hokeyi')");
sidebarContent = sidebarContent.replace(/label: 'Masa Tenisi'/g, "label: t('masa_tenisi')");
sidebarContent = sidebarContent.replace(/label: 'TÜM E-SPORLAR'/g, "label: t('tum_esporlar')");
sidebarContent = sidebarContent.replace(/label: 'eFutbol'/g, "label: t('efutbol')");
sidebarContent = sidebarContent.replace(/label: 'NBA2K'/g, "label: t('nba2k')");
sidebarContent = sidebarContent.replace(/label: 'CS2'/g, "label: t('cs2')");
sidebarContent = sidebarContent.replace(/label: 'Dota 2'/g, "label: t('dota2')");
sidebarContent = sidebarContent.replace(/label: 'Valorant'/g, "label: t('valorant')");
sidebarContent = sidebarContent.replace(/label: 'League of Legends'/g, "label: t('lol')");
sidebarContent = sidebarContent.replace(/label: '724BETS ANALİZ & CANLI BÜLTEN'/g, "label: t('analiz')");
sidebarContent = sidebarContent.replace(/label: 'MOBİL BÜLTEN'/g, "label: t('mobil_bulten')");
sidebarContent = sidebarContent.replace(/label: 'AT YARIŞI'/g, "label: t('at_yarisi')");
sidebarContent = sidebarContent.replace(/label: 'SSS'/g, "label: t('sss')");
sidebarContent = sidebarContent.replace(/label: 'BAHİS KURALLARI'/g, "label: t('kurallar')");
sidebarContent = sidebarContent.replace(/label: 'ORAN FORMATI'/g, "label: t('oran')");
sidebarContent = sidebarContent.replace(/label: 'DİĞER OYUNLAR'/g, "label: t('diger')");
sidebarContent = sidebarContent.replace(/label: '724Casino'/g, "label: t('casino724')");
sidebarContent = sidebarContent.replace(/label: 'Canlı Casino'/g, "label: t('live_casino')");
sidebarContent = sidebarContent.replace(/label: '724TOTO'/g, "label: t('toto')");
sidebarContent = sidebarContent.replace(/label: 'Görevler'/g, "label: t('gorevler')");
sidebarContent = sidebarContent.replace(/label: 'Güvenilir Siteler'/g, "label: t('guvenilir_siteler')");
sidebarContent = sidebarContent.replace(/label: 'Çekiliş Yönetimi'/g, "label: t('cekilis_yonetimi')");

fs.writeFileSync(sidebarFile, sidebarContent);
