import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LanguageCode = 'tr' | 'en' | 'es' | 'pt';

interface Translations {
  [key: string]: {
    [key in LanguageCode]: string;
  };
}

const translations: Translations = {
  original_games: {
    tr: 'Orijinal Oyunlar',
    en: 'Original Games',
    es: 'Juegos Originales',
    pt: 'Jogos Originais'
  },
  desc_plinko: {
    tr: 'Fizik tabanlı çarpan eğlencesi.',
    en: 'Physics-based multiplier fun.',
    es: 'Diversión con multiplicadores físicos.',
    pt: 'Diversão com multiplicadores físicos.'
  },
  desc_keno: {
    tr: 'Şansını sayılarla dene.',
    en: 'Try your luck with numbers.',
    es: 'Prueba tu suerte con los números.',
    pt: 'Tente a sorte com números.'
  },
  desc_dice: {
    tr: 'Hızlı, adil ve kazançlı zar oyunu.',
    en: 'Fast, fair, and rewarding dice game.',
    es: 'Juego de dados rápido, justo y gratificante.',
    pt: 'Jogo de dados rápido, justo e recompensador.'
  },
  desc_mines: {
    tr: 'Mayınlara basmadan elmasları topla.',
    en: 'Collect diamonds without stepping on mines.',
    es: 'Recoge diamantes sin pisar minas.',
    pt: 'Colete diamantes sem pisar em minas.'
  },
  desc_war: {
    tr: 'Savaş! Kimin kartı daha yüksek?',
    en: 'War! Whose card is higher?',
    es: '¡Guerra! ¿De quién es la carta más alta?',
    pt: 'Guerra! De quem é a carta mais alta?'
  },
  desc_hilo: {
    tr: 'Bir sonraki kart yüksek mi düşük mü?',
    en: 'Is the next card high or low?',
    es: '¿La siguiente carta es alta o baja?',
    pt: 'A próxima carta é alta ou baixa?'
  },
  desc_blackjack: {
    tr: 'Klasik casino deneyimi, premium kalite.',
    en: 'Classic casino experience, premium quality.',
    es: 'Experiencia de casino clásica, calidad premium.',
    pt: 'Experiência clássica de cassino, qualidade premium.'
  },
  desc_roulette: {
    tr: 'Orijinal 724Bets Rulet heyecanı.',
    en: 'Original 724Bets Roulette excitement.',
    es: 'Emoción de Ruleta Original 724Bets.',
    pt: 'Emoção da Roleta Original 724Bets.'
  },
  desc_chickencross: {
    tr: 'Tavuk karşıya geçebilecek mi?',
    en: 'Can the chicken cross?',
    es: '¿Podrá la gallina cruzar?',
    pt: 'A galinha conseguirá atravessar?'
  },
  desc_limbo: {
    tr: 'Sınırları zorla, devasa çarpanları yakala.',
    en: 'Push the limits, catch massive multipliers.',
    es: 'Supera los límites, atrapa multiplicadores masivos.',
    pt: 'Supere os limites, pegue multiplicadores massivos.'
  },

  about_game: {
    tr: 'Oyun Hakkında',
    en: 'About Game',
    es: 'Acerca del Juego',
    pt: 'Sobre o Jogo'
  },
  default_game_desc: {
    tr: 'oyunu tamamen şeffaf ve %100 kanıtlanabilir adil (Provably Fair) altyapısıyla çalışmaktadır. Sonuçlar önceden belirlenir ve dışarıdan asla müdahale edilemez. Hemen oynamaya başla ve devasa çarpanları yakala.',
    en: 'game operates with a completely transparent and 100% Provably Fair infrastructure. Results are predetermined and can never be manipulated from the outside. Start playing now and catch massive multipliers.',
    es: 'juego funciona con una infraestructura completamente transparente y 100% Provably Fair. Los resultados están predeterminados y nunca pueden ser manipulados desde el exterior. Empieza a jugar ahora y atrapa multiplicadores masivos.',
    pt: 'jogo opera com uma infraestrutura completamente transparente e 100% Provably Fair. Os resultados são predeterminados e nunca podem ser manipulados de fora. Comece a jogar agora e pegue multiplicadores enormes.'
  },
  play_now_caps: {
    tr: 'HEMEN OYNA',
    en: 'PLAY NOW',
    es: 'JUGAR AHORA',
    pt: 'JOGAR AGORA'
  },
  right_now: {
    tr: 'ŞU AN',
    en: 'CURRENTLY',
    es: 'ACTUALMENTE',
    pt: 'ATUALMENTE'
  },
  active_players_caps: {
    tr: 'OYUNCU AKTİF',
    en: 'PLAYERS ACTIVE',
    es: 'JUGADORES ACTIVOS',
    pt: 'JOGADORES ATIVOS'
  },

  p_30kadar: {
    tr: `30
  header_spor724: {
    tr: 'SPOR724',
    en: 'SPORTS724',
    es: 'DEPORTES724',
    pt: 'ESPORTES724'
  },
  header_gercek: {
    tr: 'Gerçek',
    en: 'Real',
    es: 'Real',
    pt: 'Real'
  },
  header_mbulten: {
    tr: 'M.Bülten',
    en: 'M.Bulletin',
    es: 'Boletín M.',
    pt: 'Boletim M.'
  },
  header_kuponlar: {
    tr: 'Kuponlar',
    en: 'Coupons',
    es: 'Cupones',
    pt: 'Cupons'
  },
  header_siteler: {
    tr: 'Siteler',
    en: 'Sites',
    es: 'Sitios',
    pt: 'Sites'
  },
  header_guvenilir: {
    tr: 'Güvenilir',
    en: 'Trusted',
    es: 'Confiable',
    pt: 'Confiável'
  },
  header_toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  header_casino: {
    tr: 'Casino',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino'
  },
  header_gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  wallet_cuzdan: {
    tr: 'Cüzdan',
    en: 'Wallet',
    es: 'Billetera',
    pt: 'Carteira'
  },
  wallet_ara: {
    tr: 'Para Birimi Ara',
    en: 'Search Currency',
    es: 'Buscar Moneda',
    pt: 'Buscar Moeda'
  },
  wallet_ayarlar: {
    tr: 'Cüzdan Ayarları',
    en: 'Wallet Settings',
    es: 'Ajustes de Billetera',
    pt: 'Configurações da Carteira'
  },
  profile_profil: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil'
  },
  profile_gelenkutusu: {
    tr: 'Gelen Kutusu',
    en: 'Inbox',
    es: 'Bandeja de entrada',
    pt: 'Caixa de entrada'
  },
  profile_istirakler: {
    tr: 'İştirakler',
    en: 'Affiliates',
    es: 'Afiliados',
    pt: 'Afiliados'
  },
  profile_dogrulamalar: {
    tr: 'Doğrulamalar',
    en: 'Verifications',
    es: 'Verificaciones',
    pt: 'Verificações'
  },
  profile_ayarlar: {
    tr: 'Ayarlar',
    en: 'Settings',
    es: 'Ajustes',
    pt: 'Configurações'
  },
  profile_gizlilik: {
    tr: 'Gizlilik',
    en: 'Privacy',
    es: 'Privacidad',
    pt: 'Privacidade'
  },
  profile_baglantilar: {
    tr: 'Bağlantılar',
    en: 'Links',
    es: 'Enlaces',
    pt: 'Links'
  },
  profile_islemler: {
    tr: 'İşlemler',
    en: 'Transactions',
    es: 'Transacciones',
    pt: 'Transações'
  },
  profile_cikis: {
    tr: 'Çıkış yap',
    en: 'Log out',
    es: 'Cerrar sesión',
    pt: 'Sair'
  },

  footer_desc: {
    tr: 'Premium kripto ve havale odaklı casino deneyimi. Güvenli, hızlı ve adil oyun anlayışıyla sektörün en yenilikçi platformu.',
    en: 'Premium crypto and fiat focused casino experience. The most innovative platform in the industry with a secure, fast, and fair gaming approach.',
    es: 'Experiencia de casino premium enfocada en cripto y fiat. La plataforma más innovadora de la industria con un enfoque de juego seguro, rápido y justo.',
    pt: 'Experiência de cassino premium com foco em criptomoedas e fiduciárias. A plataforma mais inovadora do setor com uma abordagem de jogo segura, rápida e justa.'
  },
  footer_license: {
    tr: 'Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş bir Curacao eGaming (Lisans No: 1668/JAZ) lisansı altında faaliyet göstermektedir.',
    en: 'This website operates under a Curacao eGaming license (License No: 1668/JAZ) authorized and regulated by the Government of Curacao.',
    es: 'Este sitio web opera bajo una licencia de eGaming de Curazao (Licencia No: 1668/JAZ) autorizada y regulada por el Gobierno de Curazao.',
    pt: 'Este site opera sob uma licença Curacao eGaming (Licença nº: 1668/JAZ) autorizada e regulamentada pelo Governo de Curaçao.'
  },
  payment_methods: {
    tr: 'Ödeme Yöntemleri',
    en: 'Payment Methods',
    es: 'Métodos de Pago',
    pt: 'Métodos de Pagamento'
  },
  bank_transfer: {
    tr: 'HAVALE / EFT',
    en: 'BANK TRANSFER',
    es: 'TRANSFERENCIA',
    pt: 'TRANSFERÊNCIA'
  },
  trusted_providers: {
    tr: 'Güvenilir Sağlayıcılar',
    en: 'Trusted Providers',
    es: 'Proveedores Confiables',
    pt: 'Provedores Confiáveis'
  },
  responsible_gaming: {
    tr: 'Sorumlu Oyun',
    en: 'Responsible Gaming',
    es: 'Juego Responsable',
    pt: 'Jogo Responsável'
  },
  gambling_addictive: {
    tr: 'Kumar bağımlılık yapabilir.',
    en: 'Gambling can be addictive.',
    es: 'El juego puede ser adictivo.',
    pt: 'O jogo pode ser viciante.'
  },
  gambling_limits: {
    tr: 'Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın.',
    en: 'Please know your limits and play responsibly.',
    es: 'Conozca sus límites y juegue responsablemente.',
    pt: 'Conheça seus limites e jogue com responsabilidade.'
  },
  gambling_help_1: {
    tr: 'Yardım için',
    en: 'You can contact',
    es: 'Puede contactar a las',
    pt: 'Você pode entrar em contato com'
  },
  gambling_help_link: {
    tr: 'destek kurumlarına',
    en: 'support agencies',
    es: 'agencias de apoyo',
    pt: 'agências de suporte'
  },
  gambling_help_2: {
    tr: 'başvurabilirsiniz.',
    en: 'for help.',
    es: 'para obtener ayuda.',
    pt: 'para obter ajuda.'
  },
  terms_conditions: {
    tr: 'Kullanım Şartları',
    en: 'Terms of Use',
    es: 'Términos de Uso',
    pt: 'Termos de Uso'
  },
  privacy_policy: {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy',
    es: 'Política de Privacidad',
    pt: 'Política de Privacidade'
  },
  kyc_policy: {
    tr: 'KYC Politikası',
    en: 'KYC Policy',
    es: 'Política KYC',
    pt: 'Política KYC'
  },
  all_rights_reserved: {
    tr: '© 2026 724BETS. Tüm Hakları Saklıdır.',
    en: '© 2026 724BETS. All Rights Reserved.',
    es: '© 2026 724BETS. Todos los derechos reservados.',
    pt: '© 2026 724BETS. Todos os direitos reservados.'
  },

  canli: {
    tr: 'CANLI',
    en: 'LIVE',
    es: 'EN VIVO',
    pt: 'AO VIVO'
  },
  taraf: {
    tr: 'TARAF',
    en: 'SIDES',
    es: 'LADOS',
    pt: 'LADOS'
  },
  senin_icin: {
    tr: 'SENİN İÇİN SEÇİLDİ',
    en: 'CHOSEN FOR YOU',
    es: 'ELEGIDO PARA TI',
    pt: 'ESCOLHIDO PARA VOCÊ'
  },
  uefa: {
    tr: 'UEFA Avrupa Ligi',
    en: 'UEFA Europa League',
    es: 'UEFA Europa League',
    pt: 'UEFA Europa League'
  },
  wimbledon_w: {
    tr: 'Wimbledon Kadınlar Tenisi',
    en: 'Wimbledon Women',
    es: 'Wimbledon Femenino',
    pt: 'Wimbledon Feminino'
  },
  wimbledon_m: {
    tr: 'Wimbledon Tek Erkekler',
    en: 'Wimbledon Men',
    es: 'Wimbledon Masculino',
    pt: 'Wimbledon Masculino'
  },
  conference: {
    tr: 'UEFA Conference League',
    en: 'UEFA Conference League',
    es: 'UEFA Conference League',
    pt: 'UEFA Conference League'
  },
  ana_sporlar: {
    tr: 'ANA SPORLAR',
    en: 'MAIN SPORTS',
    es: 'DEPORTES PRINCIPALES',
    pt: 'ESPORTES PRINCIPAIS'
  },
  futbol: {
    tr: 'Futbol',
    en: 'Football',
    es: 'Fútbol',
    pt: 'Futebol'
  },
  tenis: {
    tr: 'Tenis',
    en: 'Tennis',
    es: 'Tenis',
    pt: 'Tênis'
  },
  basketbol: {
    tr: 'Basketbol',
    en: 'Basketball',
    es: 'Baloncesto',
    pt: 'Basquete'
  },
  beyzbol: {
    tr: 'Beyzbol',
    en: 'Baseball',
    es: 'Béisbol',
    pt: 'Beisebol'
  },
  mma: {
    tr: 'MMA',
    en: 'MMA',
    es: 'MMA',
    pt: 'MMA'
  },
  tum_sporlar: {
    tr: 'TÜM SPORLAR',
    en: 'ALL SPORTS',
    es: 'TODOS LOS DEPORTES',
    pt: 'TODOS OS ESPORTES'
  },
  ragbi: {
    tr: 'Ragbi',
    en: 'Rugby',
    es: 'Rugby',
    pt: 'Rugby'
  },
  avustralya: {
    tr: 'Avustralya Futbolu',
    en: 'Aussie Rules',
    es: 'Reglas Australianas',
    pt: 'Regras Australianas'
  },
  hentbol: {
    tr: 'Hentbol',
    en: 'Handball',
    es: 'Balonmano',
    pt: 'Handebol'
  },
  kriket: {
    tr: 'Kriket',
    en: 'Cricket',
    es: 'Críquet',
    pt: 'Críquete'
  },
  voleybol: {
    tr: 'Voleybol',
    en: 'Volleyball',
    es: 'Voleibol',
    pt: 'Vôlei'
  },
  dart: {
    tr: 'Dart',
    en: 'Darts',
    es: 'Dardos',
    pt: 'Dardos'
  },
  boks: {
    tr: 'Boks',
    en: 'Boxing',
    es: 'Boxeo',
    pt: 'Boxe'
  },
  buz_hokeyi: {
    tr: 'Buz Hokeyi',
    en: 'Ice Hockey',
    es: 'Hockey sobre Hielo',
    pt: 'Hóquei no Gelo'
  },
  masa_tenisi: {
    tr: 'Masa Tenisi',
    en: 'Table Tennis',
    es: 'Tenis de Mesa',
    pt: 'Tênis de Mesa'
  },
  tum_esporlar: {
    tr: 'TÜM E-SPORLAR',
    en: 'ALL E-SPORTS',
    es: 'TODOS LOS E-SPORTS',
    pt: 'TODOS OS E-SPORTS'
  },
  efutbol: {
    tr: 'eFutbol',
    en: 'eFootball',
    es: 'eFútbol',
    pt: 'eFutebol'
  },
  nba2k: {
    tr: 'NBA2K',
    en: 'NBA2K',
    es: 'NBA2K',
    pt: 'NBA2K'
  },
  cs2: {
    tr: 'CS2',
    en: 'CS2',
    es: 'CS2',
    pt: 'CS2'
  },
  dota2: {
    tr: 'Dota 2',
    en: 'Dota 2',
    es: 'Dota 2',
    pt: 'Dota 2'
  },
  valorant: {
    tr: 'Valorant',
    en: 'Valorant',
    es: 'Valorant',
    pt: 'Valorant'
  },
  lol: {
    tr: 'League of Legends',
    en: 'League of Legends',
    es: 'League of Legends',
    pt: 'League of Legends'
  },
  analiz: {
    tr: '724BETS ANALİZ & CANLI BÜLTEN',
    en: '724BETS ANALYSIS & LIVE BULLETIN',
    es: '724BETS ANÁLISIS Y BOLETÍN',
    pt: '724BETS ANÁLISE E BOLETIM'
  },
  mobil_bulten: {
    tr: 'MOBİL BÜLTEN',
    en: 'MOBILE BULLETIN',
    es: 'BOLETÍN MÓVIL',
    pt: 'BOLETIM MÓVEL'
  },
  at_yarisi: {
    tr: 'AT YARIŞI',
    en: 'HORSE RACING',
    es: 'CARRERAS DE CABALLOS',
    pt: 'CORRIDA DE CAVALOS'
  },
  sss: {
    tr: 'SSS',
    en: 'FAQ',
    es: 'FAQ',
    pt: 'FAQ'
  },
  kurallar: {
    tr: 'BAHİS KURALLARI',
    en: 'BETTING RULES',
    es: 'REGLAS DE APUESTAS',
    pt: 'REGRAS DE APOSTAS'
  },
  oran: {
    tr: 'ORAN FORMATI',
    en: 'ODDS FORMAT',
    es: 'FORMATO DE CUOTAS',
    pt: 'FORMATO DE ODDS'
  },
  diger: {
    tr: 'DİĞER OYUNLAR',
    en: 'OTHER GAMES',
    es: 'OTROS JUEGOS',
    pt: 'OUTROS JOGOS'
  },
  casino724: {
    tr: '724Casino',
    en: '724Casino',
    es: '724Casino',
    pt: '724Casino'
  },
  toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  guvenilir_siteler: {
    tr: 'Güvenilir Siteler',
    en: 'Trusted Sites',
    es: 'Sitios Confiables',
    pt: 'Sites Confiáveis'
  },
  cekilis_yonetimi: {
    tr: 'Çekiliş Yönetimi',
    en: 'Giveaway Mgmt',
    es: 'Gestión Sorteos',
    pt: 'Gestão Sorteios'
  },

  login: {
    tr: 'Giriş Yap',
    en: 'Login',
    es: 'Acceso',
    pt: 'Entrar',
  },
  register: {
    tr: 'Kayıt Ol',
    en: 'Register',
    es: 'Registro',
    pt: 'Registrar',
  },
  search: {
    tr: 'Oyunları ara...',
    en: 'Search games...',
    es: 'Buscar juegos...',
    pt: 'Pesquisar jogos...',
  },
  casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  sports: {
    tr: 'Spor Bahisleri',
    en: 'Sports Betting',
    es: 'Apuestas Deportivas',
    pt: 'Apostas Esportivas',
  },
  visit_casino: {
    tr: 'Ziyaret et Casino',
    en: 'Visit Casino',
    es: 'Visitar Casino',
    pt: 'Visitar Cassino',
  },
  visit_sports: {
    tr: 'Ziyaret et Sports',
    en: 'Visit Sports',
    es: 'Visitar Deportes',
    pt: 'Visitar Esportes',
  },
  live_games: {
    tr: 'Canlı Oyunlar',
    en: 'Live Games',
    es: 'Juegos en Vivo',
    pt: 'Jogos ao Vivo',
  },
  popular_games: {
    tr: 'Popüler Oyunlar',
    en: 'Popular Games',
    es: 'Juegos Populares',
    pt: 'Jogos Populares',
  },
  popular_sports: {
    tr: 'Popüler Sporlar',
    en: 'Popular Sports',
    es: 'Deportes Populares',
    pt: 'Esportes Populares',
  },
  view_all: {
    tr: 'Hepsi',
    en: 'All',
    es: 'Todo',
    pt: 'Tudo',
  },
  players: {
    tr: 'Oyuncular',
    en: 'Players',
    es: 'Jugadores',
    pt: 'Jogadores',
  },
  menu_home: {
    tr: 'Ana Sayfa',
    en: 'Home',
    es: 'Inicio',
    pt: 'Início',
  },
  menu_casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  menu_sports: {
    tr: 'Sporlar',
    en: 'Sports',
    es: 'Deportes',
    pt: 'Esportes',
  },
  menu_betslip: {
    tr: 'Kuponum',
    en: 'Betslip',
    es: 'Boleto',
    pt: 'Boletim',
  },
  menu_profile: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil',
  },
  play_real_money: {
    tr: 'Gerçek Parayla Oyna',
    en: 'Play with Real Money',
    es: 'Jugar con Dinero Real',
    pt: 'Jogar com Dinheiro Real',
  },
  play_demo: {
    tr: 'Eğlencesine Oyna (Demo)',
    en: 'Play for Fun (Demo)',
    es: 'Jugar por Diversión (Demo)',
    pt: 'Jogar por Diversão (Demo)',
  },
  live_casino: {
    tr: 'Canlı Casino',
    en: 'Live Casino',
    es: 'Casino en Vivo',
    pt: 'Cassino ao Vivo',
  },
  promo_1_title: {
    tr: 'Büyük Ödüller',
    en: 'Big Rewards',
    es: 'Grandes Recompensas',
    pt: 'Grandes Recompensas'
  },
  promo_1_sub: {
    tr: 'Hoşgeldin Bonusu Seni Bekliyor',
    en: 'Welcome Bonus is Waiting',
    es: 'El Bono de Bienvenida te Espera',
    pt: 'O Bônus de Boas-Vindas te Espera'
  },
  hero_title_1: {
    tr: 'Saniyeler İçinde Yatır,',
    en: 'Deposit in Seconds,',
    es: 'Deposita en Segundos,',
    pt: 'Deposite em Segundos,'
  },
  hero_title_2: {
    tr: 'Dakikalar İçinde Çek.',
    en: 'Withdraw in Minutes.',
    es: 'Retira en Minutos.',
    pt: 'Retire em Minutos.'
  },
  hero_subtitle: {
    tr: 'Kesintisiz eğlence başladı.',
    en: 'Uninterrupted entertainment has begun.',
    es: 'El entretenimiento ininterrumpido ha comenzado.',
    pt: 'O entretenimento ininterrupto começou.'
  },
  register_alt: {
    tr: 'Veya diğer seçeneklerle kaydolun',
    en: 'Or sign up with other options',
    es: 'O regístrate con otras opciones',
    pt: 'Ou inscreva-se com outras opções'
  },
  newly_added: {
    tr: 'Yeni Eklenenler',
    en: 'Newly Added',
    es: 'Recién Agregados',
    pt: 'Adicionados Recentemente'
  },
  newly_added_2: {
    tr: 'Yeni Eklenenler 2',
    en: 'Newly Added 2',
    es: 'Recién Agregados 2',
    pt: 'Adicionados Recentemente 2'
  },
  winners_title: {
    tr: '7/24 Kazananlar',
    en: '24/7 Winners',
    es: 'Ganadores 24/7',
    pt: 'Vencedores 24/7'
  },
  promo_2_title: {
    tr: 'Güvenilir Sistem',
    en: 'Trusted System',
    es: 'Sistema Confiable',
    pt: 'Sistema Confiável'
  },
  promo_2_sub: {
    tr: 'Lisanslı Altyapı ile Güvendesiniz',
    en: 'Safe with Licensed Infrastructure',
    es: 'Seguro con Infraestructura Licenciada',
    pt: 'Seguro com Infraestrutura Licenciada'
  },
  promo_3_title: {
    tr: 'Canlı Destek',
    en: 'Live Support',
    es: 'Soporte en Vivo',
    pt: 'Suporte ao Vivo'
  },
  promo_3_sub: {
    tr: '7/24 Kesintisiz Hizmet',
    en: '24/7 Uninterrupted Service',
    es: 'Servicio 24/7 Ininterrumpido',
    pt: 'Serviço 24/7 Ininterrupto'
  }
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isAnimating: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('tr');
  const [isAnimating, setIsAnimating] = useState(false);

  const setLanguage = (lang: LanguageCode) => {
    if (lang === language) return;
    setIsAnimating(true);
    
    // Hold screen, change language, then release screen
    setTimeout(() => {
      setLanguageState(lang);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800); // Wait for translation to apply
    }, 600); // Wait for transition fade-in
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAnimating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
A KADAR`,
    en: `UP TO $30`,
    es: `HASTA $30`,
    pt: `ATÉ $30`
  },
  p_freespin: {
    tr: `FREE SPIN`,
    en: `FREE SPIN`,
    es: `GIROS GRATIS`,
    pt: `GIROS GRÁTIS`
  },
  p_haftanin: {
    tr: `Haftanın Oyunu`,
    en: `Game of the Week`,
    es: `Juego de la Semana`,
    pt: `Jogo da Semana`
  },
  p_hemen_oyna: {
    tr: `Hemen Oyna`,
    en: `Play Now`,
    es: `Jugar Ahora`,
    pt: `Jogue Agora`
  },
  p_30: {
    tr: `%30`,
    en: `30%`,
    es: `30%`,
    pt: `30%`
  },
  p_nakit_iade: {
    tr: `NAKİT İADE`,
    en: `CASHBACK`,
    es: `REEMBOLSO`,
    pt: `CASHBACK`
  },
  p_ilk_hafta: {
    tr: `İlk Haftanızda. Her Gün.`,
    en: `In your first week. Every day.`,
    es: `En tu primera semana. Cada día.`,
    pt: `Na sua primeira semana. Todos os dias.`
  },
  p_yatirim_yap: {
    tr: `Yatırım yap`,
    en: `Deposit`,
    es: `Depositar`,
    pt: `Depositar`
  },
  p_kazanma_sansi: {
    tr: `KAZANMA ŞANSI`,
    en: `CHANCE TO WIN`,
    es: `OPORTUNIDAD DE GANAR`,
    pt: `CHANCE DE GANHAR`
  },
  p_10k_nakit: {
    tr: `$10.000 NAKİT`,
    en: `$10,000 CASH`,
    es: `$10,000 EFECTIVO`,
    pt: `$10.000 DINHEIRO`
  },
  p_dk_sandiklari: {
    tr: `Dünya Kupası Sandıkları.
Bahis Yap. Kazan. Tekrarla.`,
    en: `World Cup Chests.
Bet. Win. Repeat.`,
    es: `Cofres del Mundial.
Apuesta. Gana. Repite.`,
    pt: `Baús da Copa do Mundo.
Aposte. Ganhe. Repita.`
  },
  p_buyuk_basla: {
    tr: `BÜYÜK BAŞLA`,
    en: `START BIG`,
    es: `COMIENZA EN GRANDE`,
    pt: `COMECE GRANDE`
  },
  p_7k_kadar: {
    tr: `7,000
  header_spor724: {
    tr: 'SPOR724',
    en: 'SPORTS724',
    es: 'DEPORTES724',
    pt: 'ESPORTES724'
  },
  header_gercek: {
    tr: 'Gerçek',
    en: 'Real',
    es: 'Real',
    pt: 'Real'
  },
  header_mbulten: {
    tr: 'M.Bülten',
    en: 'M.Bulletin',
    es: 'Boletín M.',
    pt: 'Boletim M.'
  },
  header_kuponlar: {
    tr: 'Kuponlar',
    en: 'Coupons',
    es: 'Cupones',
    pt: 'Cupons'
  },
  header_siteler: {
    tr: 'Siteler',
    en: 'Sites',
    es: 'Sitios',
    pt: 'Sites'
  },
  header_guvenilir: {
    tr: 'Güvenilir',
    en: 'Trusted',
    es: 'Confiable',
    pt: 'Confiável'
  },
  header_toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  header_casino: {
    tr: 'Casino',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino'
  },
  header_gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  wallet_cuzdan: {
    tr: 'Cüzdan',
    en: 'Wallet',
    es: 'Billetera',
    pt: 'Carteira'
  },
  wallet_ara: {
    tr: 'Para Birimi Ara',
    en: 'Search Currency',
    es: 'Buscar Moneda',
    pt: 'Buscar Moeda'
  },
  wallet_ayarlar: {
    tr: 'Cüzdan Ayarları',
    en: 'Wallet Settings',
    es: 'Ajustes de Billetera',
    pt: 'Configurações da Carteira'
  },
  profile_profil: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil'
  },
  profile_gelenkutusu: {
    tr: 'Gelen Kutusu',
    en: 'Inbox',
    es: 'Bandeja de entrada',
    pt: 'Caixa de entrada'
  },
  profile_istirakler: {
    tr: 'İştirakler',
    en: 'Affiliates',
    es: 'Afiliados',
    pt: 'Afiliados'
  },
  profile_dogrulamalar: {
    tr: 'Doğrulamalar',
    en: 'Verifications',
    es: 'Verificaciones',
    pt: 'Verificações'
  },
  profile_ayarlar: {
    tr: 'Ayarlar',
    en: 'Settings',
    es: 'Ajustes',
    pt: 'Configurações'
  },
  profile_gizlilik: {
    tr: 'Gizlilik',
    en: 'Privacy',
    es: 'Privacidad',
    pt: 'Privacidade'
  },
  profile_baglantilar: {
    tr: 'Bağlantılar',
    en: 'Links',
    es: 'Enlaces',
    pt: 'Links'
  },
  profile_islemler: {
    tr: 'İşlemler',
    en: 'Transactions',
    es: 'Transacciones',
    pt: 'Transações'
  },
  profile_cikis: {
    tr: 'Çıkış yap',
    en: 'Log out',
    es: 'Cerrar sesión',
    pt: 'Sair'
  },

  footer_desc: {
    tr: 'Premium kripto ve havale odaklı casino deneyimi. Güvenli, hızlı ve adil oyun anlayışıyla sektörün en yenilikçi platformu.',
    en: 'Premium crypto and fiat focused casino experience. The most innovative platform in the industry with a secure, fast, and fair gaming approach.',
    es: 'Experiencia de casino premium enfocada en cripto y fiat. La plataforma más innovadora de la industria con un enfoque de juego seguro, rápido y justo.',
    pt: 'Experiência de cassino premium com foco em criptomoedas e fiduciárias. A plataforma mais inovadora do setor com uma abordagem de jogo segura, rápida e justa.'
  },
  footer_license: {
    tr: 'Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş bir Curacao eGaming (Lisans No: 1668/JAZ) lisansı altında faaliyet göstermektedir.',
    en: 'This website operates under a Curacao eGaming license (License No: 1668/JAZ) authorized and regulated by the Government of Curacao.',
    es: 'Este sitio web opera bajo una licencia de eGaming de Curazao (Licencia No: 1668/JAZ) autorizada y regulada por el Gobierno de Curazao.',
    pt: 'Este site opera sob uma licença Curacao eGaming (Licença nº: 1668/JAZ) autorizada e regulamentada pelo Governo de Curaçao.'
  },
  payment_methods: {
    tr: 'Ödeme Yöntemleri',
    en: 'Payment Methods',
    es: 'Métodos de Pago',
    pt: 'Métodos de Pagamento'
  },
  bank_transfer: {
    tr: 'HAVALE / EFT',
    en: 'BANK TRANSFER',
    es: 'TRANSFERENCIA',
    pt: 'TRANSFERÊNCIA'
  },
  trusted_providers: {
    tr: 'Güvenilir Sağlayıcılar',
    en: 'Trusted Providers',
    es: 'Proveedores Confiables',
    pt: 'Provedores Confiáveis'
  },
  responsible_gaming: {
    tr: 'Sorumlu Oyun',
    en: 'Responsible Gaming',
    es: 'Juego Responsable',
    pt: 'Jogo Responsável'
  },
  gambling_addictive: {
    tr: 'Kumar bağımlılık yapabilir.',
    en: 'Gambling can be addictive.',
    es: 'El juego puede ser adictivo.',
    pt: 'O jogo pode ser viciante.'
  },
  gambling_limits: {
    tr: 'Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın.',
    en: 'Please know your limits and play responsibly.',
    es: 'Conozca sus límites y juegue responsablemente.',
    pt: 'Conheça seus limites e jogue com responsabilidade.'
  },
  gambling_help_1: {
    tr: 'Yardım için',
    en: 'You can contact',
    es: 'Puede contactar a las',
    pt: 'Você pode entrar em contato com'
  },
  gambling_help_link: {
    tr: 'destek kurumlarına',
    en: 'support agencies',
    es: 'agencias de apoyo',
    pt: 'agências de suporte'
  },
  gambling_help_2: {
    tr: 'başvurabilirsiniz.',
    en: 'for help.',
    es: 'para obtener ayuda.',
    pt: 'para obter ajuda.'
  },
  terms_conditions: {
    tr: 'Kullanım Şartları',
    en: 'Terms of Use',
    es: 'Términos de Uso',
    pt: 'Termos de Uso'
  },
  privacy_policy: {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy',
    es: 'Política de Privacidad',
    pt: 'Política de Privacidade'
  },
  kyc_policy: {
    tr: 'KYC Politikası',
    en: 'KYC Policy',
    es: 'Política KYC',
    pt: 'Política KYC'
  },
  all_rights_reserved: {
    tr: '© 2026 724BETS. Tüm Hakları Saklıdır.',
    en: '© 2026 724BETS. All Rights Reserved.',
    es: '© 2026 724BETS. Todos los derechos reservados.',
    pt: '© 2026 724BETS. Todos os direitos reservados.'
  },

  canli: {
    tr: 'CANLI',
    en: 'LIVE',
    es: 'EN VIVO',
    pt: 'AO VIVO'
  },
  taraf: {
    tr: 'TARAF',
    en: 'SIDES',
    es: 'LADOS',
    pt: 'LADOS'
  },
  senin_icin: {
    tr: 'SENİN İÇİN SEÇİLDİ',
    en: 'CHOSEN FOR YOU',
    es: 'ELEGIDO PARA TI',
    pt: 'ESCOLHIDO PARA VOCÊ'
  },
  uefa: {
    tr: 'UEFA Avrupa Ligi',
    en: 'UEFA Europa League',
    es: 'UEFA Europa League',
    pt: 'UEFA Europa League'
  },
  wimbledon_w: {
    tr: 'Wimbledon Kadınlar Tenisi',
    en: 'Wimbledon Women',
    es: 'Wimbledon Femenino',
    pt: 'Wimbledon Feminino'
  },
  wimbledon_m: {
    tr: 'Wimbledon Tek Erkekler',
    en: 'Wimbledon Men',
    es: 'Wimbledon Masculino',
    pt: 'Wimbledon Masculino'
  },
  conference: {
    tr: 'UEFA Conference League',
    en: 'UEFA Conference League',
    es: 'UEFA Conference League',
    pt: 'UEFA Conference League'
  },
  ana_sporlar: {
    tr: 'ANA SPORLAR',
    en: 'MAIN SPORTS',
    es: 'DEPORTES PRINCIPALES',
    pt: 'ESPORTES PRINCIPAIS'
  },
  futbol: {
    tr: 'Futbol',
    en: 'Football',
    es: 'Fútbol',
    pt: 'Futebol'
  },
  tenis: {
    tr: 'Tenis',
    en: 'Tennis',
    es: 'Tenis',
    pt: 'Tênis'
  },
  basketbol: {
    tr: 'Basketbol',
    en: 'Basketball',
    es: 'Baloncesto',
    pt: 'Basquete'
  },
  beyzbol: {
    tr: 'Beyzbol',
    en: 'Baseball',
    es: 'Béisbol',
    pt: 'Beisebol'
  },
  mma: {
    tr: 'MMA',
    en: 'MMA',
    es: 'MMA',
    pt: 'MMA'
  },
  tum_sporlar: {
    tr: 'TÜM SPORLAR',
    en: 'ALL SPORTS',
    es: 'TODOS LOS DEPORTES',
    pt: 'TODOS OS ESPORTES'
  },
  ragbi: {
    tr: 'Ragbi',
    en: 'Rugby',
    es: 'Rugby',
    pt: 'Rugby'
  },
  avustralya: {
    tr: 'Avustralya Futbolu',
    en: 'Aussie Rules',
    es: 'Reglas Australianas',
    pt: 'Regras Australianas'
  },
  hentbol: {
    tr: 'Hentbol',
    en: 'Handball',
    es: 'Balonmano',
    pt: 'Handebol'
  },
  kriket: {
    tr: 'Kriket',
    en: 'Cricket',
    es: 'Críquet',
    pt: 'Críquete'
  },
  voleybol: {
    tr: 'Voleybol',
    en: 'Volleyball',
    es: 'Voleibol',
    pt: 'Vôlei'
  },
  dart: {
    tr: 'Dart',
    en: 'Darts',
    es: 'Dardos',
    pt: 'Dardos'
  },
  boks: {
    tr: 'Boks',
    en: 'Boxing',
    es: 'Boxeo',
    pt: 'Boxe'
  },
  buz_hokeyi: {
    tr: 'Buz Hokeyi',
    en: 'Ice Hockey',
    es: 'Hockey sobre Hielo',
    pt: 'Hóquei no Gelo'
  },
  masa_tenisi: {
    tr: 'Masa Tenisi',
    en: 'Table Tennis',
    es: 'Tenis de Mesa',
    pt: 'Tênis de Mesa'
  },
  tum_esporlar: {
    tr: 'TÜM E-SPORLAR',
    en: 'ALL E-SPORTS',
    es: 'TODOS LOS E-SPORTS',
    pt: 'TODOS OS E-SPORTS'
  },
  efutbol: {
    tr: 'eFutbol',
    en: 'eFootball',
    es: 'eFútbol',
    pt: 'eFutebol'
  },
  nba2k: {
    tr: 'NBA2K',
    en: 'NBA2K',
    es: 'NBA2K',
    pt: 'NBA2K'
  },
  cs2: {
    tr: 'CS2',
    en: 'CS2',
    es: 'CS2',
    pt: 'CS2'
  },
  dota2: {
    tr: 'Dota 2',
    en: 'Dota 2',
    es: 'Dota 2',
    pt: 'Dota 2'
  },
  valorant: {
    tr: 'Valorant',
    en: 'Valorant',
    es: 'Valorant',
    pt: 'Valorant'
  },
  lol: {
    tr: 'League of Legends',
    en: 'League of Legends',
    es: 'League of Legends',
    pt: 'League of Legends'
  },
  analiz: {
    tr: '724BETS ANALİZ & CANLI BÜLTEN',
    en: '724BETS ANALYSIS & LIVE BULLETIN',
    es: '724BETS ANÁLISIS Y BOLETÍN',
    pt: '724BETS ANÁLISE E BOLETIM'
  },
  mobil_bulten: {
    tr: 'MOBİL BÜLTEN',
    en: 'MOBILE BULLETIN',
    es: 'BOLETÍN MÓVIL',
    pt: 'BOLETIM MÓVEL'
  },
  at_yarisi: {
    tr: 'AT YARIŞI',
    en: 'HORSE RACING',
    es: 'CARRERAS DE CABALLOS',
    pt: 'CORRIDA DE CAVALOS'
  },
  sss: {
    tr: 'SSS',
    en: 'FAQ',
    es: 'FAQ',
    pt: 'FAQ'
  },
  kurallar: {
    tr: 'BAHİS KURALLARI',
    en: 'BETTING RULES',
    es: 'REGLAS DE APUESTAS',
    pt: 'REGRAS DE APOSTAS'
  },
  oran: {
    tr: 'ORAN FORMATI',
    en: 'ODDS FORMAT',
    es: 'FORMATO DE CUOTAS',
    pt: 'FORMATO DE ODDS'
  },
  diger: {
    tr: 'DİĞER OYUNLAR',
    en: 'OTHER GAMES',
    es: 'OTROS JUEGOS',
    pt: 'OUTROS JOGOS'
  },
  casino724: {
    tr: '724Casino',
    en: '724Casino',
    es: '724Casino',
    pt: '724Casino'
  },
  toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  guvenilir_siteler: {
    tr: 'Güvenilir Siteler',
    en: 'Trusted Sites',
    es: 'Sitios Confiables',
    pt: 'Sites Confiáveis'
  },
  cekilis_yonetimi: {
    tr: 'Çekiliş Yönetimi',
    en: 'Giveaway Mgmt',
    es: 'Gestión Sorteos',
    pt: 'Gestão Sorteios'
  },

  login: {
    tr: 'Giriş Yap',
    en: 'Login',
    es: 'Acceso',
    pt: 'Entrar',
  },
  register: {
    tr: 'Kayıt Ol',
    en: 'Register',
    es: 'Registro',
    pt: 'Registrar',
  },
  search: {
    tr: 'Oyunları ara...',
    en: 'Search games...',
    es: 'Buscar juegos...',
    pt: 'Pesquisar jogos...',
  },
  casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  sports: {
    tr: 'Spor Bahisleri',
    en: 'Sports Betting',
    es: 'Apuestas Deportivas',
    pt: 'Apostas Esportivas',
  },
  visit_casino: {
    tr: 'Ziyaret et Casino',
    en: 'Visit Casino',
    es: 'Visitar Casino',
    pt: 'Visitar Cassino',
  },
  visit_sports: {
    tr: 'Ziyaret et Sports',
    en: 'Visit Sports',
    es: 'Visitar Deportes',
    pt: 'Visitar Esportes',
  },
  live_games: {
    tr: 'Canlı Oyunlar',
    en: 'Live Games',
    es: 'Juegos en Vivo',
    pt: 'Jogos ao Vivo',
  },
  popular_games: {
    tr: 'Popüler Oyunlar',
    en: 'Popular Games',
    es: 'Juegos Populares',
    pt: 'Jogos Populares',
  },
  popular_sports: {
    tr: 'Popüler Sporlar',
    en: 'Popular Sports',
    es: 'Deportes Populares',
    pt: 'Esportes Populares',
  },
  view_all: {
    tr: 'Hepsi',
    en: 'All',
    es: 'Todo',
    pt: 'Tudo',
  },
  players: {
    tr: 'Oyuncular',
    en: 'Players',
    es: 'Jugadores',
    pt: 'Jogadores',
  },
  menu_home: {
    tr: 'Ana Sayfa',
    en: 'Home',
    es: 'Inicio',
    pt: 'Início',
  },
  menu_casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  menu_sports: {
    tr: 'Sporlar',
    en: 'Sports',
    es: 'Deportes',
    pt: 'Esportes',
  },
  menu_betslip: {
    tr: 'Kuponum',
    en: 'Betslip',
    es: 'Boleto',
    pt: 'Boletim',
  },
  menu_profile: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil',
  },
  play_real_money: {
    tr: 'Gerçek Parayla Oyna',
    en: 'Play with Real Money',
    es: 'Jugar con Dinero Real',
    pt: 'Jogar com Dinheiro Real',
  },
  play_demo: {
    tr: 'Eğlencesine Oyna (Demo)',
    en: 'Play for Fun (Demo)',
    es: 'Jugar por Diversión (Demo)',
    pt: 'Jogar por Diversão (Demo)',
  },
  live_casino: {
    tr: 'Canlı Casino',
    en: 'Live Casino',
    es: 'Casino en Vivo',
    pt: 'Cassino ao Vivo',
  },
  promo_1_title: {
    tr: 'Büyük Ödüller',
    en: 'Big Rewards',
    es: 'Grandes Recompensas',
    pt: 'Grandes Recompensas'
  },
  promo_1_sub: {
    tr: 'Hoşgeldin Bonusu Seni Bekliyor',
    en: 'Welcome Bonus is Waiting',
    es: 'El Bono de Bienvenida te Espera',
    pt: 'O Bônus de Boas-Vindas te Espera'
  },
  hero_title_1: {
    tr: 'Saniyeler İçinde Yatır,',
    en: 'Deposit in Seconds,',
    es: 'Deposita en Segundos,',
    pt: 'Deposite em Segundos,'
  },
  hero_title_2: {
    tr: 'Dakikalar İçinde Çek.',
    en: 'Withdraw in Minutes.',
    es: 'Retira en Minutos.',
    pt: 'Retire em Minutos.'
  },
  hero_subtitle: {
    tr: 'Kesintisiz eğlence başladı.',
    en: 'Uninterrupted entertainment has begun.',
    es: 'El entretenimiento ininterrumpido ha comenzado.',
    pt: 'O entretenimento ininterrupto começou.'
  },
  register_alt: {
    tr: 'Veya diğer seçeneklerle kaydolun',
    en: 'Or sign up with other options',
    es: 'O regístrate con otras opciones',
    pt: 'Ou inscreva-se com outras opções'
  },
  newly_added: {
    tr: 'Yeni Eklenenler',
    en: 'Newly Added',
    es: 'Recién Agregados',
    pt: 'Adicionados Recentemente'
  },
  newly_added_2: {
    tr: 'Yeni Eklenenler 2',
    en: 'Newly Added 2',
    es: 'Recién Agregados 2',
    pt: 'Adicionados Recentemente 2'
  },
  winners_title: {
    tr: '7/24 Kazananlar',
    en: '24/7 Winners',
    es: 'Ganadores 24/7',
    pt: 'Vencedores 24/7'
  },
  promo_2_title: {
    tr: 'Güvenilir Sistem',
    en: 'Trusted System',
    es: 'Sistema Confiable',
    pt: 'Sistema Confiável'
  },
  promo_2_sub: {
    tr: 'Lisanslı Altyapı ile Güvendesiniz',
    en: 'Safe with Licensed Infrastructure',
    es: 'Seguro con Infraestructura Licenciada',
    pt: 'Seguro com Infraestrutura Licenciada'
  },
  promo_3_title: {
    tr: 'Canlı Destek',
    en: 'Live Support',
    es: 'Soporte en Vivo',
    pt: 'Suporte ao Vivo'
  },
  promo_3_sub: {
    tr: '7/24 Kesintisiz Hizmet',
    en: '24/7 Uninterrupted Service',
    es: 'Servicio 24/7 Ininterrumpido',
    pt: 'Serviço 24/7 Ininterrupto'
  }
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isAnimating: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('tr');
  const [isAnimating, setIsAnimating] = useState(false);

  const setLanguage = (lang: LanguageCode) => {
    if (lang === language) return;
    setIsAnimating(true);
    
    // Hold screen, change language, then release screen
    setTimeout(() => {
      setLanguageState(lang);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800); // Wait for translation to apply
    }, 600); // Wait for transition fade-in
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAnimating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
a kadar`,
    en: `Up to $7,000`,
    es: `Hasta $7,000`,
    pt: `Até $7.000`
  },
  p_130_fs: {
    tr: `+ 130 Free Spin
İlk 4 yatırımınızda.`,
    en: `+ 130 Free Spins
On your first 4 deposits.`,
    es: `+ 130 Giros Gratis
En tus primeros 4 depósitos.`,
    pt: `+ 130 Giros Grátis
Nos seus 4 primeiros depósitos.`
  },
  p_100_basla: {
    tr: `%100'LE BAŞLA`,
    en: `START WITH 100%`,
    es: `COMIENZA CON 100%`,
    pt: `COMECE COM 100%`
  },
  p_spor_bonusu: {
    tr: `SPOR BONUSU`,
    en: `SPORTS BONUS`,
    es: `BONO DEPORTIVO`,
    pt: `BÔNUS DE ESPORTES`
  },
  p_500_kadar: {
    tr: `500
  header_spor724: {
    tr: 'SPOR724',
    en: 'SPORTS724',
    es: 'DEPORTES724',
    pt: 'ESPORTES724'
  },
  header_gercek: {
    tr: 'Gerçek',
    en: 'Real',
    es: 'Real',
    pt: 'Real'
  },
  header_mbulten: {
    tr: 'M.Bülten',
    en: 'M.Bulletin',
    es: 'Boletín M.',
    pt: 'Boletim M.'
  },
  header_kuponlar: {
    tr: 'Kuponlar',
    en: 'Coupons',
    es: 'Cupones',
    pt: 'Cupons'
  },
  header_siteler: {
    tr: 'Siteler',
    en: 'Sites',
    es: 'Sitios',
    pt: 'Sites'
  },
  header_guvenilir: {
    tr: 'Güvenilir',
    en: 'Trusted',
    es: 'Confiable',
    pt: 'Confiável'
  },
  header_toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  header_casino: {
    tr: 'Casino',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino'
  },
  header_gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  wallet_cuzdan: {
    tr: 'Cüzdan',
    en: 'Wallet',
    es: 'Billetera',
    pt: 'Carteira'
  },
  wallet_ara: {
    tr: 'Para Birimi Ara',
    en: 'Search Currency',
    es: 'Buscar Moneda',
    pt: 'Buscar Moeda'
  },
  wallet_ayarlar: {
    tr: 'Cüzdan Ayarları',
    en: 'Wallet Settings',
    es: 'Ajustes de Billetera',
    pt: 'Configurações da Carteira'
  },
  profile_profil: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil'
  },
  profile_gelenkutusu: {
    tr: 'Gelen Kutusu',
    en: 'Inbox',
    es: 'Bandeja de entrada',
    pt: 'Caixa de entrada'
  },
  profile_istirakler: {
    tr: 'İştirakler',
    en: 'Affiliates',
    es: 'Afiliados',
    pt: 'Afiliados'
  },
  profile_dogrulamalar: {
    tr: 'Doğrulamalar',
    en: 'Verifications',
    es: 'Verificaciones',
    pt: 'Verificações'
  },
  profile_ayarlar: {
    tr: 'Ayarlar',
    en: 'Settings',
    es: 'Ajustes',
    pt: 'Configurações'
  },
  profile_gizlilik: {
    tr: 'Gizlilik',
    en: 'Privacy',
    es: 'Privacidad',
    pt: 'Privacidade'
  },
  profile_baglantilar: {
    tr: 'Bağlantılar',
    en: 'Links',
    es: 'Enlaces',
    pt: 'Links'
  },
  profile_islemler: {
    tr: 'İşlemler',
    en: 'Transactions',
    es: 'Transacciones',
    pt: 'Transações'
  },
  profile_cikis: {
    tr: 'Çıkış yap',
    en: 'Log out',
    es: 'Cerrar sesión',
    pt: 'Sair'
  },

  footer_desc: {
    tr: 'Premium kripto ve havale odaklı casino deneyimi. Güvenli, hızlı ve adil oyun anlayışıyla sektörün en yenilikçi platformu.',
    en: 'Premium crypto and fiat focused casino experience. The most innovative platform in the industry with a secure, fast, and fair gaming approach.',
    es: 'Experiencia de casino premium enfocada en cripto y fiat. La plataforma más innovadora de la industria con un enfoque de juego seguro, rápido y justo.',
    pt: 'Experiência de cassino premium com foco em criptomoedas e fiduciárias. A plataforma mais inovadora do setor com uma abordagem de jogo segura, rápida e justa.'
  },
  footer_license: {
    tr: 'Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş bir Curacao eGaming (Lisans No: 1668/JAZ) lisansı altında faaliyet göstermektedir.',
    en: 'This website operates under a Curacao eGaming license (License No: 1668/JAZ) authorized and regulated by the Government of Curacao.',
    es: 'Este sitio web opera bajo una licencia de eGaming de Curazao (Licencia No: 1668/JAZ) autorizada y regulada por el Gobierno de Curazao.',
    pt: 'Este site opera sob uma licença Curacao eGaming (Licença nº: 1668/JAZ) autorizada e regulamentada pelo Governo de Curaçao.'
  },
  payment_methods: {
    tr: 'Ödeme Yöntemleri',
    en: 'Payment Methods',
    es: 'Métodos de Pago',
    pt: 'Métodos de Pagamento'
  },
  bank_transfer: {
    tr: 'HAVALE / EFT',
    en: 'BANK TRANSFER',
    es: 'TRANSFERENCIA',
    pt: 'TRANSFERÊNCIA'
  },
  trusted_providers: {
    tr: 'Güvenilir Sağlayıcılar',
    en: 'Trusted Providers',
    es: 'Proveedores Confiables',
    pt: 'Provedores Confiáveis'
  },
  responsible_gaming: {
    tr: 'Sorumlu Oyun',
    en: 'Responsible Gaming',
    es: 'Juego Responsable',
    pt: 'Jogo Responsável'
  },
  gambling_addictive: {
    tr: 'Kumar bağımlılık yapabilir.',
    en: 'Gambling can be addictive.',
    es: 'El juego puede ser adictivo.',
    pt: 'O jogo pode ser viciante.'
  },
  gambling_limits: {
    tr: 'Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın.',
    en: 'Please know your limits and play responsibly.',
    es: 'Conozca sus límites y juegue responsablemente.',
    pt: 'Conheça seus limites e jogue com responsabilidade.'
  },
  gambling_help_1: {
    tr: 'Yardım için',
    en: 'You can contact',
    es: 'Puede contactar a las',
    pt: 'Você pode entrar em contato com'
  },
  gambling_help_link: {
    tr: 'destek kurumlarına',
    en: 'support agencies',
    es: 'agencias de apoyo',
    pt: 'agências de suporte'
  },
  gambling_help_2: {
    tr: 'başvurabilirsiniz.',
    en: 'for help.',
    es: 'para obtener ayuda.',
    pt: 'para obter ajuda.'
  },
  terms_conditions: {
    tr: 'Kullanım Şartları',
    en: 'Terms of Use',
    es: 'Términos de Uso',
    pt: 'Termos de Uso'
  },
  privacy_policy: {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy',
    es: 'Política de Privacidad',
    pt: 'Política de Privacidade'
  },
  kyc_policy: {
    tr: 'KYC Politikası',
    en: 'KYC Policy',
    es: 'Política KYC',
    pt: 'Política KYC'
  },
  all_rights_reserved: {
    tr: '© 2026 724BETS. Tüm Hakları Saklıdır.',
    en: '© 2026 724BETS. All Rights Reserved.',
    es: '© 2026 724BETS. Todos los derechos reservados.',
    pt: '© 2026 724BETS. Todos os direitos reservados.'
  },

  canli: {
    tr: 'CANLI',
    en: 'LIVE',
    es: 'EN VIVO',
    pt: 'AO VIVO'
  },
  taraf: {
    tr: 'TARAF',
    en: 'SIDES',
    es: 'LADOS',
    pt: 'LADOS'
  },
  senin_icin: {
    tr: 'SENİN İÇİN SEÇİLDİ',
    en: 'CHOSEN FOR YOU',
    es: 'ELEGIDO PARA TI',
    pt: 'ESCOLHIDO PARA VOCÊ'
  },
  uefa: {
    tr: 'UEFA Avrupa Ligi',
    en: 'UEFA Europa League',
    es: 'UEFA Europa League',
    pt: 'UEFA Europa League'
  },
  wimbledon_w: {
    tr: 'Wimbledon Kadınlar Tenisi',
    en: 'Wimbledon Women',
    es: 'Wimbledon Femenino',
    pt: 'Wimbledon Feminino'
  },
  wimbledon_m: {
    tr: 'Wimbledon Tek Erkekler',
    en: 'Wimbledon Men',
    es: 'Wimbledon Masculino',
    pt: 'Wimbledon Masculino'
  },
  conference: {
    tr: 'UEFA Conference League',
    en: 'UEFA Conference League',
    es: 'UEFA Conference League',
    pt: 'UEFA Conference League'
  },
  ana_sporlar: {
    tr: 'ANA SPORLAR',
    en: 'MAIN SPORTS',
    es: 'DEPORTES PRINCIPALES',
    pt: 'ESPORTES PRINCIPAIS'
  },
  futbol: {
    tr: 'Futbol',
    en: 'Football',
    es: 'Fútbol',
    pt: 'Futebol'
  },
  tenis: {
    tr: 'Tenis',
    en: 'Tennis',
    es: 'Tenis',
    pt: 'Tênis'
  },
  basketbol: {
    tr: 'Basketbol',
    en: 'Basketball',
    es: 'Baloncesto',
    pt: 'Basquete'
  },
  beyzbol: {
    tr: 'Beyzbol',
    en: 'Baseball',
    es: 'Béisbol',
    pt: 'Beisebol'
  },
  mma: {
    tr: 'MMA',
    en: 'MMA',
    es: 'MMA',
    pt: 'MMA'
  },
  tum_sporlar: {
    tr: 'TÜM SPORLAR',
    en: 'ALL SPORTS',
    es: 'TODOS LOS DEPORTES',
    pt: 'TODOS OS ESPORTES'
  },
  ragbi: {
    tr: 'Ragbi',
    en: 'Rugby',
    es: 'Rugby',
    pt: 'Rugby'
  },
  avustralya: {
    tr: 'Avustralya Futbolu',
    en: 'Aussie Rules',
    es: 'Reglas Australianas',
    pt: 'Regras Australianas'
  },
  hentbol: {
    tr: 'Hentbol',
    en: 'Handball',
    es: 'Balonmano',
    pt: 'Handebol'
  },
  kriket: {
    tr: 'Kriket',
    en: 'Cricket',
    es: 'Críquet',
    pt: 'Críquete'
  },
  voleybol: {
    tr: 'Voleybol',
    en: 'Volleyball',
    es: 'Voleibol',
    pt: 'Vôlei'
  },
  dart: {
    tr: 'Dart',
    en: 'Darts',
    es: 'Dardos',
    pt: 'Dardos'
  },
  boks: {
    tr: 'Boks',
    en: 'Boxing',
    es: 'Boxeo',
    pt: 'Boxe'
  },
  buz_hokeyi: {
    tr: 'Buz Hokeyi',
    en: 'Ice Hockey',
    es: 'Hockey sobre Hielo',
    pt: 'Hóquei no Gelo'
  },
  masa_tenisi: {
    tr: 'Masa Tenisi',
    en: 'Table Tennis',
    es: 'Tenis de Mesa',
    pt: 'Tênis de Mesa'
  },
  tum_esporlar: {
    tr: 'TÜM E-SPORLAR',
    en: 'ALL E-SPORTS',
    es: 'TODOS LOS E-SPORTS',
    pt: 'TODOS OS E-SPORTS'
  },
  efutbol: {
    tr: 'eFutbol',
    en: 'eFootball',
    es: 'eFútbol',
    pt: 'eFutebol'
  },
  nba2k: {
    tr: 'NBA2K',
    en: 'NBA2K',
    es: 'NBA2K',
    pt: 'NBA2K'
  },
  cs2: {
    tr: 'CS2',
    en: 'CS2',
    es: 'CS2',
    pt: 'CS2'
  },
  dota2: {
    tr: 'Dota 2',
    en: 'Dota 2',
    es: 'Dota 2',
    pt: 'Dota 2'
  },
  valorant: {
    tr: 'Valorant',
    en: 'Valorant',
    es: 'Valorant',
    pt: 'Valorant'
  },
  lol: {
    tr: 'League of Legends',
    en: 'League of Legends',
    es: 'League of Legends',
    pt: 'League of Legends'
  },
  analiz: {
    tr: '724BETS ANALİZ & CANLI BÜLTEN',
    en: '724BETS ANALYSIS & LIVE BULLETIN',
    es: '724BETS ANÁLISIS Y BOLETÍN',
    pt: '724BETS ANÁLISE E BOLETIM'
  },
  mobil_bulten: {
    tr: 'MOBİL BÜLTEN',
    en: 'MOBILE BULLETIN',
    es: 'BOLETÍN MÓVIL',
    pt: 'BOLETIM MÓVEL'
  },
  at_yarisi: {
    tr: 'AT YARIŞI',
    en: 'HORSE RACING',
    es: 'CARRERAS DE CABALLOS',
    pt: 'CORRIDA DE CAVALOS'
  },
  sss: {
    tr: 'SSS',
    en: 'FAQ',
    es: 'FAQ',
    pt: 'FAQ'
  },
  kurallar: {
    tr: 'BAHİS KURALLARI',
    en: 'BETTING RULES',
    es: 'REGLAS DE APUESTAS',
    pt: 'REGRAS DE APOSTAS'
  },
  oran: {
    tr: 'ORAN FORMATI',
    en: 'ODDS FORMAT',
    es: 'FORMATO DE CUOTAS',
    pt: 'FORMATO DE ODDS'
  },
  diger: {
    tr: 'DİĞER OYUNLAR',
    en: 'OTHER GAMES',
    es: 'OTROS JUEGOS',
    pt: 'OUTROS JOGOS'
  },
  casino724: {
    tr: '724Casino',
    en: '724Casino',
    es: '724Casino',
    pt: '724Casino'
  },
  toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  guvenilir_siteler: {
    tr: 'Güvenilir Siteler',
    en: 'Trusted Sites',
    es: 'Sitios Confiables',
    pt: 'Sites Confiáveis'
  },
  cekilis_yonetimi: {
    tr: 'Çekiliş Yönetimi',
    en: 'Giveaway Mgmt',
    es: 'Gestión Sorteos',
    pt: 'Gestão Sorteios'
  },

  login: {
    tr: 'Giriş Yap',
    en: 'Login',
    es: 'Acceso',
    pt: 'Entrar',
  },
  register: {
    tr: 'Kayıt Ol',
    en: 'Register',
    es: 'Registro',
    pt: 'Registrar',
  },
  search: {
    tr: 'Oyunları ara...',
    en: 'Search games...',
    es: 'Buscar juegos...',
    pt: 'Pesquisar jogos...',
  },
  casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  sports: {
    tr: 'Spor Bahisleri',
    en: 'Sports Betting',
    es: 'Apuestas Deportivas',
    pt: 'Apostas Esportivas',
  },
  visit_casino: {
    tr: 'Ziyaret et Casino',
    en: 'Visit Casino',
    es: 'Visitar Casino',
    pt: 'Visitar Cassino',
  },
  visit_sports: {
    tr: 'Ziyaret et Sports',
    en: 'Visit Sports',
    es: 'Visitar Deportes',
    pt: 'Visitar Esportes',
  },
  live_games: {
    tr: 'Canlı Oyunlar',
    en: 'Live Games',
    es: 'Juegos en Vivo',
    pt: 'Jogos ao Vivo',
  },
  popular_games: {
    tr: 'Popüler Oyunlar',
    en: 'Popular Games',
    es: 'Juegos Populares',
    pt: 'Jogos Populares',
  },
  popular_sports: {
    tr: 'Popüler Sporlar',
    en: 'Popular Sports',
    es: 'Deportes Populares',
    pt: 'Esportes Populares',
  },
  view_all: {
    tr: 'Hepsi',
    en: 'All',
    es: 'Todo',
    pt: 'Tudo',
  },
  players: {
    tr: 'Oyuncular',
    en: 'Players',
    es: 'Jugadores',
    pt: 'Jogadores',
  },
  menu_home: {
    tr: 'Ana Sayfa',
    en: 'Home',
    es: 'Inicio',
    pt: 'Início',
  },
  menu_casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  menu_sports: {
    tr: 'Sporlar',
    en: 'Sports',
    es: 'Deportes',
    pt: 'Esportes',
  },
  menu_betslip: {
    tr: 'Kuponum',
    en: 'Betslip',
    es: 'Boleto',
    pt: 'Boletim',
  },
  menu_profile: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil',
  },
  play_real_money: {
    tr: 'Gerçek Parayla Oyna',
    en: 'Play with Real Money',
    es: 'Jugar con Dinero Real',
    pt: 'Jogar com Dinheiro Real',
  },
  play_demo: {
    tr: 'Eğlencesine Oyna (Demo)',
    en: 'Play for Fun (Demo)',
    es: 'Jugar por Diversión (Demo)',
    pt: 'Jogar por Diversão (Demo)',
  },
  live_casino: {
    tr: 'Canlı Casino',
    en: 'Live Casino',
    es: 'Casino en Vivo',
    pt: 'Cassino ao Vivo',
  },
  promo_1_title: {
    tr: 'Büyük Ödüller',
    en: 'Big Rewards',
    es: 'Grandes Recompensas',
    pt: 'Grandes Recompensas'
  },
  promo_1_sub: {
    tr: 'Hoşgeldin Bonusu Seni Bekliyor',
    en: 'Welcome Bonus is Waiting',
    es: 'El Bono de Bienvenida te Espera',
    pt: 'O Bônus de Boas-Vindas te Espera'
  },
  hero_title_1: {
    tr: 'Saniyeler İçinde Yatır,',
    en: 'Deposit in Seconds,',
    es: 'Deposita en Segundos,',
    pt: 'Deposite em Segundos,'
  },
  hero_title_2: {
    tr: 'Dakikalar İçinde Çek.',
    en: 'Withdraw in Minutes.',
    es: 'Retira en Minutos.',
    pt: 'Retire em Minutos.'
  },
  hero_subtitle: {
    tr: 'Kesintisiz eğlence başladı.',
    en: 'Uninterrupted entertainment has begun.',
    es: 'El entretenimiento ininterrumpido ha comenzado.',
    pt: 'O entretenimento ininterrupto começou.'
  },
  register_alt: {
    tr: 'Veya diğer seçeneklerle kaydolun',
    en: 'Or sign up with other options',
    es: 'O regístrate con otras opciones',
    pt: 'Ou inscreva-se com outras opções'
  },
  newly_added: {
    tr: 'Yeni Eklenenler',
    en: 'Newly Added',
    es: 'Recién Agregados',
    pt: 'Adicionados Recentemente'
  },
  newly_added_2: {
    tr: 'Yeni Eklenenler 2',
    en: 'Newly Added 2',
    es: 'Recién Agregados 2',
    pt: 'Adicionados Recentemente 2'
  },
  winners_title: {
    tr: '7/24 Kazananlar',
    en: '24/7 Winners',
    es: 'Ganadores 24/7',
    pt: 'Vencedores 24/7'
  },
  promo_2_title: {
    tr: 'Güvenilir Sistem',
    en: 'Trusted System',
    es: 'Sistema Confiable',
    pt: 'Sistema Confiável'
  },
  promo_2_sub: {
    tr: 'Lisanslı Altyapı ile Güvendesiniz',
    en: 'Safe with Licensed Infrastructure',
    es: 'Seguro con Infraestructura Licenciada',
    pt: 'Seguro com Infraestrutura Licenciada'
  },
  promo_3_title: {
    tr: 'Canlı Destek',
    en: 'Live Support',
    es: 'Soporte en Vivo',
    pt: 'Suporte ao Vivo'
  },
  promo_3_sub: {
    tr: '7/24 Kesintisiz Hizmet',
    en: '24/7 Uninterrupted Service',
    es: 'Servicio 24/7 Ininterrumpido',
    pt: 'Serviço 24/7 Ininterrupto'
  }
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isAnimating: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('tr');
  const [isAnimating, setIsAnimating] = useState(false);

  const setLanguage = (lang: LanguageCode) => {
    if (lang === language) return;
    setIsAnimating(true);
    
    // Hold screen, change language, then release screen
    setTimeout(() => {
      setLanguageState(lang);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800); // Wait for translation to apply
    }, 600); // Wait for transition fade-in
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAnimating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
a kadar`,
    en: `Up to $500`,
    es: `Hasta $500`,
    pt: `Até $500`
  },
  p_dunya_kupasi: {
    tr: `DÜNYA KUPASI`,
    en: `WORLD CUP`,
    es: `MUNDIAL`,
    pt: `COPA DO MUNDO`
  },
  p_mega_boost: {
    tr: `MEGA BOOST`,
    en: `MEGA BOOST`,
    es: `MEGA BOOST`,
    pt: `MEGA BOOST`
  },
  p_daha_yuksek: {
    tr: `Daha yüksek oranlar.
Daha büyük kazançlar.`,
    en: `Higher odds.
Bigger wins.`,
    es: `Mayores cuotas.
Mayores ganancias.`,
    pt: `Maiores odds.
Maiores ganhos.`
  },
  p_bahis_yap: {
    tr: `Bahis Yap`,
    en: `Bet Now`,
    es: `Apostar`,
    pt: `Apostar`
  },
  p_500_varan: {
    tr: `%500'E VARAN`,
    en: `UP TO 500%`,
    es: `HASTA 500%`,
    pt: `ATÉ 500%`
  },
  p_kazanc_boostu: {
    tr: `KAZANÇ BOOSTU`,
    en: `WIN BOOST`,
    es: `BOOST DE GANANCIAS`,
    pt: `BOOST DE GANHOS`
  },
  p_acca: {
    tr: `ACCA'nı oluştur.
Oranlara meydan oku.`,
    en: `Build your ACCA.
Defy the odds.`,
    es: `Crea tu ACCA.
Desafía las cuotas.`,
    pt: `Construa sua ACCA.
Desafie as odds.`
  },
  p_20_ekstra: {
    tr: `%20 EKSTRA`,
    en: `20% EXTRA`,
    es: `20% EXTRA`,
    pt: `20% EXTRA`
  },
  p_200_bonus: {
    tr: `200
  header_spor724: {
    tr: 'SPOR724',
    en: 'SPORTS724',
    es: 'DEPORTES724',
    pt: 'ESPORTES724'
  },
  header_gercek: {
    tr: 'Gerçek',
    en: 'Real',
    es: 'Real',
    pt: 'Real'
  },
  header_mbulten: {
    tr: 'M.Bülten',
    en: 'M.Bulletin',
    es: 'Boletín M.',
    pt: 'Boletim M.'
  },
  header_kuponlar: {
    tr: 'Kuponlar',
    en: 'Coupons',
    es: 'Cupones',
    pt: 'Cupons'
  },
  header_siteler: {
    tr: 'Siteler',
    en: 'Sites',
    es: 'Sitios',
    pt: 'Sites'
  },
  header_guvenilir: {
    tr: 'Güvenilir',
    en: 'Trusted',
    es: 'Confiable',
    pt: 'Confiável'
  },
  header_toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  header_casino: {
    tr: 'Casino',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino'
  },
  header_gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  wallet_cuzdan: {
    tr: 'Cüzdan',
    en: 'Wallet',
    es: 'Billetera',
    pt: 'Carteira'
  },
  wallet_ara: {
    tr: 'Para Birimi Ara',
    en: 'Search Currency',
    es: 'Buscar Moneda',
    pt: 'Buscar Moeda'
  },
  wallet_ayarlar: {
    tr: 'Cüzdan Ayarları',
    en: 'Wallet Settings',
    es: 'Ajustes de Billetera',
    pt: 'Configurações da Carteira'
  },
  profile_profil: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil'
  },
  profile_gelenkutusu: {
    tr: 'Gelen Kutusu',
    en: 'Inbox',
    es: 'Bandeja de entrada',
    pt: 'Caixa de entrada'
  },
  profile_istirakler: {
    tr: 'İştirakler',
    en: 'Affiliates',
    es: 'Afiliados',
    pt: 'Afiliados'
  },
  profile_dogrulamalar: {
    tr: 'Doğrulamalar',
    en: 'Verifications',
    es: 'Verificaciones',
    pt: 'Verificações'
  },
  profile_ayarlar: {
    tr: 'Ayarlar',
    en: 'Settings',
    es: 'Ajustes',
    pt: 'Configurações'
  },
  profile_gizlilik: {
    tr: 'Gizlilik',
    en: 'Privacy',
    es: 'Privacidad',
    pt: 'Privacidade'
  },
  profile_baglantilar: {
    tr: 'Bağlantılar',
    en: 'Links',
    es: 'Enlaces',
    pt: 'Links'
  },
  profile_islemler: {
    tr: 'İşlemler',
    en: 'Transactions',
    es: 'Transacciones',
    pt: 'Transações'
  },
  profile_cikis: {
    tr: 'Çıkış yap',
    en: 'Log out',
    es: 'Cerrar sesión',
    pt: 'Sair'
  },

  footer_desc: {
    tr: 'Premium kripto ve havale odaklı casino deneyimi. Güvenli, hızlı ve adil oyun anlayışıyla sektörün en yenilikçi platformu.',
    en: 'Premium crypto and fiat focused casino experience. The most innovative platform in the industry with a secure, fast, and fair gaming approach.',
    es: 'Experiencia de casino premium enfocada en cripto y fiat. La plataforma más innovadora de la industria con un enfoque de juego seguro, rápido y justo.',
    pt: 'Experiência de cassino premium com foco em criptomoedas e fiduciárias. A plataforma mais inovadora do setor com uma abordagem de jogo segura, rápida e justa.'
  },
  footer_license: {
    tr: 'Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş bir Curacao eGaming (Lisans No: 1668/JAZ) lisansı altında faaliyet göstermektedir.',
    en: 'This website operates under a Curacao eGaming license (License No: 1668/JAZ) authorized and regulated by the Government of Curacao.',
    es: 'Este sitio web opera bajo una licencia de eGaming de Curazao (Licencia No: 1668/JAZ) autorizada y regulada por el Gobierno de Curazao.',
    pt: 'Este site opera sob uma licença Curacao eGaming (Licença nº: 1668/JAZ) autorizada e regulamentada pelo Governo de Curaçao.'
  },
  payment_methods: {
    tr: 'Ödeme Yöntemleri',
    en: 'Payment Methods',
    es: 'Métodos de Pago',
    pt: 'Métodos de Pagamento'
  },
  bank_transfer: {
    tr: 'HAVALE / EFT',
    en: 'BANK TRANSFER',
    es: 'TRANSFERENCIA',
    pt: 'TRANSFERÊNCIA'
  },
  trusted_providers: {
    tr: 'Güvenilir Sağlayıcılar',
    en: 'Trusted Providers',
    es: 'Proveedores Confiables',
    pt: 'Provedores Confiáveis'
  },
  responsible_gaming: {
    tr: 'Sorumlu Oyun',
    en: 'Responsible Gaming',
    es: 'Juego Responsable',
    pt: 'Jogo Responsável'
  },
  gambling_addictive: {
    tr: 'Kumar bağımlılık yapabilir.',
    en: 'Gambling can be addictive.',
    es: 'El juego puede ser adictivo.',
    pt: 'O jogo pode ser viciante.'
  },
  gambling_limits: {
    tr: 'Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın.',
    en: 'Please know your limits and play responsibly.',
    es: 'Conozca sus límites y juegue responsablemente.',
    pt: 'Conheça seus limites e jogue com responsabilidade.'
  },
  gambling_help_1: {
    tr: 'Yardım için',
    en: 'You can contact',
    es: 'Puede contactar a las',
    pt: 'Você pode entrar em contato com'
  },
  gambling_help_link: {
    tr: 'destek kurumlarına',
    en: 'support agencies',
    es: 'agencias de apoyo',
    pt: 'agências de suporte'
  },
  gambling_help_2: {
    tr: 'başvurabilirsiniz.',
    en: 'for help.',
    es: 'para obtener ayuda.',
    pt: 'para obter ajuda.'
  },
  terms_conditions: {
    tr: 'Kullanım Şartları',
    en: 'Terms of Use',
    es: 'Términos de Uso',
    pt: 'Termos de Uso'
  },
  privacy_policy: {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy',
    es: 'Política de Privacidad',
    pt: 'Política de Privacidade'
  },
  kyc_policy: {
    tr: 'KYC Politikası',
    en: 'KYC Policy',
    es: 'Política KYC',
    pt: 'Política KYC'
  },
  all_rights_reserved: {
    tr: '© 2026 724BETS. Tüm Hakları Saklıdır.',
    en: '© 2026 724BETS. All Rights Reserved.',
    es: '© 2026 724BETS. Todos los derechos reservados.',
    pt: '© 2026 724BETS. Todos os direitos reservados.'
  },

  canli: {
    tr: 'CANLI',
    en: 'LIVE',
    es: 'EN VIVO',
    pt: 'AO VIVO'
  },
  taraf: {
    tr: 'TARAF',
    en: 'SIDES',
    es: 'LADOS',
    pt: 'LADOS'
  },
  senin_icin: {
    tr: 'SENİN İÇİN SEÇİLDİ',
    en: 'CHOSEN FOR YOU',
    es: 'ELEGIDO PARA TI',
    pt: 'ESCOLHIDO PARA VOCÊ'
  },
  uefa: {
    tr: 'UEFA Avrupa Ligi',
    en: 'UEFA Europa League',
    es: 'UEFA Europa League',
    pt: 'UEFA Europa League'
  },
  wimbledon_w: {
    tr: 'Wimbledon Kadınlar Tenisi',
    en: 'Wimbledon Women',
    es: 'Wimbledon Femenino',
    pt: 'Wimbledon Feminino'
  },
  wimbledon_m: {
    tr: 'Wimbledon Tek Erkekler',
    en: 'Wimbledon Men',
    es: 'Wimbledon Masculino',
    pt: 'Wimbledon Masculino'
  },
  conference: {
    tr: 'UEFA Conference League',
    en: 'UEFA Conference League',
    es: 'UEFA Conference League',
    pt: 'UEFA Conference League'
  },
  ana_sporlar: {
    tr: 'ANA SPORLAR',
    en: 'MAIN SPORTS',
    es: 'DEPORTES PRINCIPALES',
    pt: 'ESPORTES PRINCIPAIS'
  },
  futbol: {
    tr: 'Futbol',
    en: 'Football',
    es: 'Fútbol',
    pt: 'Futebol'
  },
  tenis: {
    tr: 'Tenis',
    en: 'Tennis',
    es: 'Tenis',
    pt: 'Tênis'
  },
  basketbol: {
    tr: 'Basketbol',
    en: 'Basketball',
    es: 'Baloncesto',
    pt: 'Basquete'
  },
  beyzbol: {
    tr: 'Beyzbol',
    en: 'Baseball',
    es: 'Béisbol',
    pt: 'Beisebol'
  },
  mma: {
    tr: 'MMA',
    en: 'MMA',
    es: 'MMA',
    pt: 'MMA'
  },
  tum_sporlar: {
    tr: 'TÜM SPORLAR',
    en: 'ALL SPORTS',
    es: 'TODOS LOS DEPORTES',
    pt: 'TODOS OS ESPORTES'
  },
  ragbi: {
    tr: 'Ragbi',
    en: 'Rugby',
    es: 'Rugby',
    pt: 'Rugby'
  },
  avustralya: {
    tr: 'Avustralya Futbolu',
    en: 'Aussie Rules',
    es: 'Reglas Australianas',
    pt: 'Regras Australianas'
  },
  hentbol: {
    tr: 'Hentbol',
    en: 'Handball',
    es: 'Balonmano',
    pt: 'Handebol'
  },
  kriket: {
    tr: 'Kriket',
    en: 'Cricket',
    es: 'Críquet',
    pt: 'Críquete'
  },
  voleybol: {
    tr: 'Voleybol',
    en: 'Volleyball',
    es: 'Voleibol',
    pt: 'Vôlei'
  },
  dart: {
    tr: 'Dart',
    en: 'Darts',
    es: 'Dardos',
    pt: 'Dardos'
  },
  boks: {
    tr: 'Boks',
    en: 'Boxing',
    es: 'Boxeo',
    pt: 'Boxe'
  },
  buz_hokeyi: {
    tr: 'Buz Hokeyi',
    en: 'Ice Hockey',
    es: 'Hockey sobre Hielo',
    pt: 'Hóquei no Gelo'
  },
  masa_tenisi: {
    tr: 'Masa Tenisi',
    en: 'Table Tennis',
    es: 'Tenis de Mesa',
    pt: 'Tênis de Mesa'
  },
  tum_esporlar: {
    tr: 'TÜM E-SPORLAR',
    en: 'ALL E-SPORTS',
    es: 'TODOS LOS E-SPORTS',
    pt: 'TODOS OS E-SPORTS'
  },
  efutbol: {
    tr: 'eFutbol',
    en: 'eFootball',
    es: 'eFútbol',
    pt: 'eFutebol'
  },
  nba2k: {
    tr: 'NBA2K',
    en: 'NBA2K',
    es: 'NBA2K',
    pt: 'NBA2K'
  },
  cs2: {
    tr: 'CS2',
    en: 'CS2',
    es: 'CS2',
    pt: 'CS2'
  },
  dota2: {
    tr: 'Dota 2',
    en: 'Dota 2',
    es: 'Dota 2',
    pt: 'Dota 2'
  },
  valorant: {
    tr: 'Valorant',
    en: 'Valorant',
    es: 'Valorant',
    pt: 'Valorant'
  },
  lol: {
    tr: 'League of Legends',
    en: 'League of Legends',
    es: 'League of Legends',
    pt: 'League of Legends'
  },
  analiz: {
    tr: '724BETS ANALİZ & CANLI BÜLTEN',
    en: '724BETS ANALYSIS & LIVE BULLETIN',
    es: '724BETS ANÁLISIS Y BOLETÍN',
    pt: '724BETS ANÁLISE E BOLETIM'
  },
  mobil_bulten: {
    tr: 'MOBİL BÜLTEN',
    en: 'MOBILE BULLETIN',
    es: 'BOLETÍN MÓVIL',
    pt: 'BOLETIM MÓVEL'
  },
  at_yarisi: {
    tr: 'AT YARIŞI',
    en: 'HORSE RACING',
    es: 'CARRERAS DE CABALLOS',
    pt: 'CORRIDA DE CAVALOS'
  },
  sss: {
    tr: 'SSS',
    en: 'FAQ',
    es: 'FAQ',
    pt: 'FAQ'
  },
  kurallar: {
    tr: 'BAHİS KURALLARI',
    en: 'BETTING RULES',
    es: 'REGLAS DE APUESTAS',
    pt: 'REGRAS DE APOSTAS'
  },
  oran: {
    tr: 'ORAN FORMATI',
    en: 'ODDS FORMAT',
    es: 'FORMATO DE CUOTAS',
    pt: 'FORMATO DE ODDS'
  },
  diger: {
    tr: 'DİĞER OYUNLAR',
    en: 'OTHER GAMES',
    es: 'OTROS JUEGOS',
    pt: 'OUTROS JOGOS'
  },
  casino724: {
    tr: '724Casino',
    en: '724Casino',
    es: '724Casino',
    pt: '724Casino'
  },
  toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  guvenilir_siteler: {
    tr: 'Güvenilir Siteler',
    en: 'Trusted Sites',
    es: 'Sitios Confiables',
    pt: 'Sites Confiáveis'
  },
  cekilis_yonetimi: {
    tr: 'Çekiliş Yönetimi',
    en: 'Giveaway Mgmt',
    es: 'Gestión Sorteos',
    pt: 'Gestão Sorteios'
  },

  login: {
    tr: 'Giriş Yap',
    en: 'Login',
    es: 'Acceso',
    pt: 'Entrar',
  },
  register: {
    tr: 'Kayıt Ol',
    en: 'Register',
    es: 'Registro',
    pt: 'Registrar',
  },
  search: {
    tr: 'Oyunları ara...',
    en: 'Search games...',
    es: 'Buscar juegos...',
    pt: 'Pesquisar jogos...',
  },
  casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  sports: {
    tr: 'Spor Bahisleri',
    en: 'Sports Betting',
    es: 'Apuestas Deportivas',
    pt: 'Apostas Esportivas',
  },
  visit_casino: {
    tr: 'Ziyaret et Casino',
    en: 'Visit Casino',
    es: 'Visitar Casino',
    pt: 'Visitar Cassino',
  },
  visit_sports: {
    tr: 'Ziyaret et Sports',
    en: 'Visit Sports',
    es: 'Visitar Deportes',
    pt: 'Visitar Esportes',
  },
  live_games: {
    tr: 'Canlı Oyunlar',
    en: 'Live Games',
    es: 'Juegos en Vivo',
    pt: 'Jogos ao Vivo',
  },
  popular_games: {
    tr: 'Popüler Oyunlar',
    en: 'Popular Games',
    es: 'Juegos Populares',
    pt: 'Jogos Populares',
  },
  popular_sports: {
    tr: 'Popüler Sporlar',
    en: 'Popular Sports',
    es: 'Deportes Populares',
    pt: 'Esportes Populares',
  },
  view_all: {
    tr: 'Hepsi',
    en: 'All',
    es: 'Todo',
    pt: 'Tudo',
  },
  players: {
    tr: 'Oyuncular',
    en: 'Players',
    es: 'Jugadores',
    pt: 'Jogadores',
  },
  menu_home: {
    tr: 'Ana Sayfa',
    en: 'Home',
    es: 'Inicio',
    pt: 'Início',
  },
  menu_casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  menu_sports: {
    tr: 'Sporlar',
    en: 'Sports',
    es: 'Deportes',
    pt: 'Esportes',
  },
  menu_betslip: {
    tr: 'Kuponum',
    en: 'Betslip',
    es: 'Boleto',
    pt: 'Boletim',
  },
  menu_profile: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil',
  },
  play_real_money: {
    tr: 'Gerçek Parayla Oyna',
    en: 'Play with Real Money',
    es: 'Jugar con Dinero Real',
    pt: 'Jogar com Dinheiro Real',
  },
  play_demo: {
    tr: 'Eğlencesine Oyna (Demo)',
    en: 'Play for Fun (Demo)',
    es: 'Jugar por Diversión (Demo)',
    pt: 'Jogar por Diversão (Demo)',
  },
  live_casino: {
    tr: 'Canlı Casino',
    en: 'Live Casino',
    es: 'Casino en Vivo',
    pt: 'Cassino ao Vivo',
  },
  promo_1_title: {
    tr: 'Büyük Ödüller',
    en: 'Big Rewards',
    es: 'Grandes Recompensas',
    pt: 'Grandes Recompensas'
  },
  promo_1_sub: {
    tr: 'Hoşgeldin Bonusu Seni Bekliyor',
    en: 'Welcome Bonus is Waiting',
    es: 'El Bono de Bienvenida te Espera',
    pt: 'O Bônus de Boas-Vindas te Espera'
  },
  hero_title_1: {
    tr: 'Saniyeler İçinde Yatır,',
    en: 'Deposit in Seconds,',
    es: 'Deposita en Segundos,',
    pt: 'Deposite em Segundos,'
  },
  hero_title_2: {
    tr: 'Dakikalar İçinde Çek.',
    en: 'Withdraw in Minutes.',
    es: 'Retira en Minutos.',
    pt: 'Retire em Minutos.'
  },
  hero_subtitle: {
    tr: 'Kesintisiz eğlence başladı.',
    en: 'Uninterrupted entertainment has begun.',
    es: 'El entretenimiento ininterrumpido ha comenzado.',
    pt: 'O entretenimento ininterrupto começou.'
  },
  register_alt: {
    tr: 'Veya diğer seçeneklerle kaydolun',
    en: 'Or sign up with other options',
    es: 'O regístrate con otras opciones',
    pt: 'Ou inscreva-se com outras opções'
  },
  newly_added: {
    tr: 'Yeni Eklenenler',
    en: 'Newly Added',
    es: 'Recién Agregados',
    pt: 'Adicionados Recentemente'
  },
  newly_added_2: {
    tr: 'Yeni Eklenenler 2',
    en: 'Newly Added 2',
    es: 'Recién Agregados 2',
    pt: 'Adicionados Recentemente 2'
  },
  winners_title: {
    tr: '7/24 Kazananlar',
    en: '24/7 Winners',
    es: 'Ganadores 24/7',
    pt: 'Vencedores 24/7'
  },
  promo_2_title: {
    tr: 'Güvenilir Sistem',
    en: 'Trusted System',
    es: 'Sistema Confiable',
    pt: 'Sistema Confiável'
  },
  promo_2_sub: {
    tr: 'Lisanslı Altyapı ile Güvendesiniz',
    en: 'Safe with Licensed Infrastructure',
    es: 'Seguro con Infraestructura Licenciada',
    pt: 'Seguro com Infraestrutura Licenciada'
  },
  promo_3_title: {
    tr: 'Canlı Destek',
    en: 'Live Support',
    es: 'Soporte en Vivo',
    pt: 'Suporte ao Vivo'
  },
  promo_3_sub: {
    tr: '7/24 Kesintisiz Hizmet',
    en: '24/7 Uninterrupted Service',
    es: 'Servicio 24/7 Ininterrumpido',
    pt: 'Serviço 24/7 Ininterrupto'
  }
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isAnimating: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('tr');
  const [isAnimating, setIsAnimating] = useState(false);

  const setLanguage = (lang: LanguageCode) => {
    if (lang === language) return;
    setIsAnimating(true);
    
    // Hold screen, change language, then release screen
    setTimeout(() => {
      setLanguageState(lang);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800); // Wait for translation to apply
    }, 600); // Wait for transition fade-in
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAnimating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
a Kadar Bonus!`,
    en: `Up to $200 Bonus!`,
    es: `¡Hasta $200 de Bono!`,
    pt: `Até $200 de Bônus!`
  },
  p_app_indir: {
    tr: `APP'İ İNDİR`,
    en: `DOWNLOAD APP`,
    es: `DESCARGA LA APP`,
    pt: `BAIXE O APP`
  },
  p_40_fs: {
    tr: `40 FREE SPIN AL`,
    en: `GET 40 FREE SPINS`,
    es: `CONSIGUE 40 GIROS GRATIS`,
    pt: `GANHE 40 GIROS GRÁTIS`
  },
  p_21_yaninda: {
    tr: `21'i yanında taşı.`,
    en: `Carry 21 with you.`,
    es: `Lleva 21 contigo.`,
    pt: `Leve o 21 com você.`
  },
  p_simdi_indir: {
    tr: `Şimdi İndir`,
    en: `Download Now`,
    es: `Descargar Ahora`,
    pt: `Baixar Agora`
  },
  p_cevir_kazan: {
    tr: `ÇEVİR KAZAN`,
    en: `SPIN & WIN`,
    es: `GIRA Y GANA`,
    pt: `GIRE E GANHE`
  },
  p_5k_nakit: {
    tr: `5.000$ NAKİT`,
    en: `$5,000 CASH`,
    es: `$5,000 EFECTIVO`,
    pt: `$5.000 DINHEIRO`
  },
  p_4_fs_hergun: {
    tr: `4 Free Spin. Her gün.`,
    en: `4 Free Spins. Every day.`,
    es: `4 Giros Gratis. Cada día.`,
    pt: `4 Giros Grátis. Todos os dias.`
  },
  p_simdi_cevir: {
    tr: `Şimdi Çevir`,
    en: `Spin Now`,
    es: `Girar Ahora`,
    pt: `Girar Agora`
  },
  p_21_elite: {
    tr: `21 Elite CLUB'A`,
    en: `TO 21 Elite CLUB`,
    es: `AL 21 Elite CLUB`,
    pt: `AO 21 Elite CLUB`
  },
  p_hos_geldiniz: {
    tr: `HOŞ GELDİNİZ`,
    en: `WELCOME`,
    es: `BIENVENIDOS`,
    pt: `BEM-VINDOS`
  },
  p_yukseldikce: {
    tr: `Yükseldikçe kazan.`,
    en: `Win as you rise.`,
    es: `Gana mientras subes.`,
    pt: `Ganhe enquanto sobe.`
  },
  p_her_gun: {
    tr: `HER GÜN`,
    en: `EVERY DAY`,
    es: `CADA DÍA`,
    pt: `TODOS OS DIAS`
  },
  p_10_bonus: {
    tr: `%10 Bonus`,
    en: `10% Bonus`,
    es: `10% de Bono`,
    pt: `10% de Bônus`
  },
  p_yatir_oyna: {
    tr: `Yatır. Oyna. Kazan.`,
    en: `Deposit. Play. Win.`,
    es: `Deposita. Juega. Gana.`,
    pt: `Deposite. Jogue. Ganhe.`
  },
  p_davet_et: {
    tr: `DAVET ET & KAZAN`,
    en: `INVITE & WIN`,
    es: `INVITA Y GANA`,
    pt: `CONVIDE E GANHE`
  },
  p_20_nakit: {
    tr: `%20 NAKİT`,
    en: `20% CASH`,
    es: `20% EFECTIVO`,
    pt: `20% DINHEIRO`
  },
  p_kazancini_arttir: {
    tr: `Kazancını arttır.`,
    en: `Increase your winnings.`,
    es: `Aumenta tus ganancias.`,
    pt: `Aumente seus ganhos.`
  },
  p_hemen_basla: {
    tr: `Hemen Başla`,
    en: `Start Now`,
    es: `Comenzar Ahora`,
    pt: `Comece Agora`
  },
  p_buyuk_oyna: {
    tr: `BÜYÜK OYNA`,
    en: `PLAY BIG`,
    es: `JUEGA GRANDE`,
    pt: `JOGUE GRANDE`
  },
  p_bizle_kal: {
    tr: `BİZLE KAL`,
    en: `STAY WITH US`,
    es: `QUÉDATE CON NOSOTROS`,
    pt: `FIQUE CONOSCO`
  },
  p_21_kanallari: {
    tr: `21 kanallarına katıl.`,
    en: `Join 21 channels.`,
    es: `Únete a los canales de 21.`,
    pt: `Junte-se aos canais do 21.`
  },
  p_hemen_katil: {
    tr: `Hemen katıl`,
    en: `Join Now`,
    es: `Únete Ahora`,
    pt: `Participe Agora`
  },

  header_spor724: {
    tr: 'SPOR724',
    en: 'SPORTS724',
    es: 'DEPORTES724',
    pt: 'ESPORTES724'
  },
  header_gercek: {
    tr: 'Gerçek',
    en: 'Real',
    es: 'Real',
    pt: 'Real'
  },
  header_mbulten: {
    tr: 'M.Bülten',
    en: 'M.Bulletin',
    es: 'Boletín M.',
    pt: 'Boletim M.'
  },
  header_kuponlar: {
    tr: 'Kuponlar',
    en: 'Coupons',
    es: 'Cupones',
    pt: 'Cupons'
  },
  header_siteler: {
    tr: 'Siteler',
    en: 'Sites',
    es: 'Sitios',
    pt: 'Sites'
  },
  header_guvenilir: {
    tr: 'Güvenilir',
    en: 'Trusted',
    es: 'Confiable',
    pt: 'Confiável'
  },
  header_toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  header_casino: {
    tr: 'Casino',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino'
  },
  header_gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  wallet_cuzdan: {
    tr: 'Cüzdan',
    en: 'Wallet',
    es: 'Billetera',
    pt: 'Carteira'
  },
  wallet_ara: {
    tr: 'Para Birimi Ara',
    en: 'Search Currency',
    es: 'Buscar Moneda',
    pt: 'Buscar Moeda'
  },
  wallet_ayarlar: {
    tr: 'Cüzdan Ayarları',
    en: 'Wallet Settings',
    es: 'Ajustes de Billetera',
    pt: 'Configurações da Carteira'
  },
  profile_profil: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil'
  },
  profile_gelenkutusu: {
    tr: 'Gelen Kutusu',
    en: 'Inbox',
    es: 'Bandeja de entrada',
    pt: 'Caixa de entrada'
  },
  profile_istirakler: {
    tr: 'İştirakler',
    en: 'Affiliates',
    es: 'Afiliados',
    pt: 'Afiliados'
  },
  profile_dogrulamalar: {
    tr: 'Doğrulamalar',
    en: 'Verifications',
    es: 'Verificaciones',
    pt: 'Verificações'
  },
  profile_ayarlar: {
    tr: 'Ayarlar',
    en: 'Settings',
    es: 'Ajustes',
    pt: 'Configurações'
  },
  profile_gizlilik: {
    tr: 'Gizlilik',
    en: 'Privacy',
    es: 'Privacidad',
    pt: 'Privacidade'
  },
  profile_baglantilar: {
    tr: 'Bağlantılar',
    en: 'Links',
    es: 'Enlaces',
    pt: 'Links'
  },
  profile_islemler: {
    tr: 'İşlemler',
    en: 'Transactions',
    es: 'Transacciones',
    pt: 'Transações'
  },
  profile_cikis: {
    tr: 'Çıkış yap',
    en: 'Log out',
    es: 'Cerrar sesión',
    pt: 'Sair'
  },

  footer_desc: {
    tr: 'Premium kripto ve havale odaklı casino deneyimi. Güvenli, hızlı ve adil oyun anlayışıyla sektörün en yenilikçi platformu.',
    en: 'Premium crypto and fiat focused casino experience. The most innovative platform in the industry with a secure, fast, and fair gaming approach.',
    es: 'Experiencia de casino premium enfocada en cripto y fiat. La plataforma más innovadora de la industria con un enfoque de juego seguro, rápido y justo.',
    pt: 'Experiência de cassino premium com foco em criptomoedas e fiduciárias. A plataforma mais inovadora do setor com uma abordagem de jogo segura, rápida e justa.'
  },
  footer_license: {
    tr: 'Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş bir Curacao eGaming (Lisans No: 1668/JAZ) lisansı altında faaliyet göstermektedir.',
    en: 'This website operates under a Curacao eGaming license (License No: 1668/JAZ) authorized and regulated by the Government of Curacao.',
    es: 'Este sitio web opera bajo una licencia de eGaming de Curazao (Licencia No: 1668/JAZ) autorizada y regulada por el Gobierno de Curazao.',
    pt: 'Este site opera sob uma licença Curacao eGaming (Licença nº: 1668/JAZ) autorizada e regulamentada pelo Governo de Curaçao.'
  },
  payment_methods: {
    tr: 'Ödeme Yöntemleri',
    en: 'Payment Methods',
    es: 'Métodos de Pago',
    pt: 'Métodos de Pagamento'
  },
  bank_transfer: {
    tr: 'HAVALE / EFT',
    en: 'BANK TRANSFER',
    es: 'TRANSFERENCIA',
    pt: 'TRANSFERÊNCIA'
  },
  trusted_providers: {
    tr: 'Güvenilir Sağlayıcılar',
    en: 'Trusted Providers',
    es: 'Proveedores Confiables',
    pt: 'Provedores Confiáveis'
  },
  responsible_gaming: {
    tr: 'Sorumlu Oyun',
    en: 'Responsible Gaming',
    es: 'Juego Responsable',
    pt: 'Jogo Responsável'
  },
  gambling_addictive: {
    tr: 'Kumar bağımlılık yapabilir.',
    en: 'Gambling can be addictive.',
    es: 'El juego puede ser adictivo.',
    pt: 'O jogo pode ser viciante.'
  },
  gambling_limits: {
    tr: 'Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın.',
    en: 'Please know your limits and play responsibly.',
    es: 'Conozca sus límites y juegue responsablemente.',
    pt: 'Conheça seus limites e jogue com responsabilidade.'
  },
  gambling_help_1: {
    tr: 'Yardım için',
    en: 'You can contact',
    es: 'Puede contactar a las',
    pt: 'Você pode entrar em contato com'
  },
  gambling_help_link: {
    tr: 'destek kurumlarına',
    en: 'support agencies',
    es: 'agencias de apoyo',
    pt: 'agências de suporte'
  },
  gambling_help_2: {
    tr: 'başvurabilirsiniz.',
    en: 'for help.',
    es: 'para obtener ayuda.',
    pt: 'para obter ajuda.'
  },
  terms_conditions: {
    tr: 'Kullanım Şartları',
    en: 'Terms of Use',
    es: 'Términos de Uso',
    pt: 'Termos de Uso'
  },
  privacy_policy: {
    tr: 'Gizlilik Politikası',
    en: 'Privacy Policy',
    es: 'Política de Privacidad',
    pt: 'Política de Privacidade'
  },
  kyc_policy: {
    tr: 'KYC Politikası',
    en: 'KYC Policy',
    es: 'Política KYC',
    pt: 'Política KYC'
  },
  all_rights_reserved: {
    tr: '© 2026 724BETS. Tüm Hakları Saklıdır.',
    en: '© 2026 724BETS. All Rights Reserved.',
    es: '© 2026 724BETS. Todos los derechos reservados.',
    pt: '© 2026 724BETS. Todos os direitos reservados.'
  },

  canli: {
    tr: 'CANLI',
    en: 'LIVE',
    es: 'EN VIVO',
    pt: 'AO VIVO'
  },
  taraf: {
    tr: 'TARAF',
    en: 'SIDES',
    es: 'LADOS',
    pt: 'LADOS'
  },
  senin_icin: {
    tr: 'SENİN İÇİN SEÇİLDİ',
    en: 'CHOSEN FOR YOU',
    es: 'ELEGIDO PARA TI',
    pt: 'ESCOLHIDO PARA VOCÊ'
  },
  uefa: {
    tr: 'UEFA Avrupa Ligi',
    en: 'UEFA Europa League',
    es: 'UEFA Europa League',
    pt: 'UEFA Europa League'
  },
  wimbledon_w: {
    tr: 'Wimbledon Kadınlar Tenisi',
    en: 'Wimbledon Women',
    es: 'Wimbledon Femenino',
    pt: 'Wimbledon Feminino'
  },
  wimbledon_m: {
    tr: 'Wimbledon Tek Erkekler',
    en: 'Wimbledon Men',
    es: 'Wimbledon Masculino',
    pt: 'Wimbledon Masculino'
  },
  conference: {
    tr: 'UEFA Conference League',
    en: 'UEFA Conference League',
    es: 'UEFA Conference League',
    pt: 'UEFA Conference League'
  },
  ana_sporlar: {
    tr: 'ANA SPORLAR',
    en: 'MAIN SPORTS',
    es: 'DEPORTES PRINCIPALES',
    pt: 'ESPORTES PRINCIPAIS'
  },
  futbol: {
    tr: 'Futbol',
    en: 'Football',
    es: 'Fútbol',
    pt: 'Futebol'
  },
  tenis: {
    tr: 'Tenis',
    en: 'Tennis',
    es: 'Tenis',
    pt: 'Tênis'
  },
  basketbol: {
    tr: 'Basketbol',
    en: 'Basketball',
    es: 'Baloncesto',
    pt: 'Basquete'
  },
  beyzbol: {
    tr: 'Beyzbol',
    en: 'Baseball',
    es: 'Béisbol',
    pt: 'Beisebol'
  },
  mma: {
    tr: 'MMA',
    en: 'MMA',
    es: 'MMA',
    pt: 'MMA'
  },
  tum_sporlar: {
    tr: 'TÜM SPORLAR',
    en: 'ALL SPORTS',
    es: 'TODOS LOS DEPORTES',
    pt: 'TODOS OS ESPORTES'
  },
  ragbi: {
    tr: 'Ragbi',
    en: 'Rugby',
    es: 'Rugby',
    pt: 'Rugby'
  },
  avustralya: {
    tr: 'Avustralya Futbolu',
    en: 'Aussie Rules',
    es: 'Reglas Australianas',
    pt: 'Regras Australianas'
  },
  hentbol: {
    tr: 'Hentbol',
    en: 'Handball',
    es: 'Balonmano',
    pt: 'Handebol'
  },
  kriket: {
    tr: 'Kriket',
    en: 'Cricket',
    es: 'Críquet',
    pt: 'Críquete'
  },
  voleybol: {
    tr: 'Voleybol',
    en: 'Volleyball',
    es: 'Voleibol',
    pt: 'Vôlei'
  },
  dart: {
    tr: 'Dart',
    en: 'Darts',
    es: 'Dardos',
    pt: 'Dardos'
  },
  boks: {
    tr: 'Boks',
    en: 'Boxing',
    es: 'Boxeo',
    pt: 'Boxe'
  },
  buz_hokeyi: {
    tr: 'Buz Hokeyi',
    en: 'Ice Hockey',
    es: 'Hockey sobre Hielo',
    pt: 'Hóquei no Gelo'
  },
  masa_tenisi: {
    tr: 'Masa Tenisi',
    en: 'Table Tennis',
    es: 'Tenis de Mesa',
    pt: 'Tênis de Mesa'
  },
  tum_esporlar: {
    tr: 'TÜM E-SPORLAR',
    en: 'ALL E-SPORTS',
    es: 'TODOS LOS E-SPORTS',
    pt: 'TODOS OS E-SPORTS'
  },
  efutbol: {
    tr: 'eFutbol',
    en: 'eFootball',
    es: 'eFútbol',
    pt: 'eFutebol'
  },
  nba2k: {
    tr: 'NBA2K',
    en: 'NBA2K',
    es: 'NBA2K',
    pt: 'NBA2K'
  },
  cs2: {
    tr: 'CS2',
    en: 'CS2',
    es: 'CS2',
    pt: 'CS2'
  },
  dota2: {
    tr: 'Dota 2',
    en: 'Dota 2',
    es: 'Dota 2',
    pt: 'Dota 2'
  },
  valorant: {
    tr: 'Valorant',
    en: 'Valorant',
    es: 'Valorant',
    pt: 'Valorant'
  },
  lol: {
    tr: 'League of Legends',
    en: 'League of Legends',
    es: 'League of Legends',
    pt: 'League of Legends'
  },
  analiz: {
    tr: '724BETS ANALİZ & CANLI BÜLTEN',
    en: '724BETS ANALYSIS & LIVE BULLETIN',
    es: '724BETS ANÁLISIS Y BOLETÍN',
    pt: '724BETS ANÁLISE E BOLETIM'
  },
  mobil_bulten: {
    tr: 'MOBİL BÜLTEN',
    en: 'MOBILE BULLETIN',
    es: 'BOLETÍN MÓVIL',
    pt: 'BOLETIM MÓVEL'
  },
  at_yarisi: {
    tr: 'AT YARIŞI',
    en: 'HORSE RACING',
    es: 'CARRERAS DE CABALLOS',
    pt: 'CORRIDA DE CAVALOS'
  },
  sss: {
    tr: 'SSS',
    en: 'FAQ',
    es: 'FAQ',
    pt: 'FAQ'
  },
  kurallar: {
    tr: 'BAHİS KURALLARI',
    en: 'BETTING RULES',
    es: 'REGLAS DE APUESTAS',
    pt: 'REGRAS DE APOSTAS'
  },
  oran: {
    tr: 'ORAN FORMATI',
    en: 'ODDS FORMAT',
    es: 'FORMATO DE CUOTAS',
    pt: 'FORMATO DE ODDS'
  },
  diger: {
    tr: 'DİĞER OYUNLAR',
    en: 'OTHER GAMES',
    es: 'OTROS JUEGOS',
    pt: 'OUTROS JOGOS'
  },
  casino724: {
    tr: '724Casino',
    en: '724Casino',
    es: '724Casino',
    pt: '724Casino'
  },
  toto: {
    tr: '724TOTO',
    en: '724TOTO',
    es: '724TOTO',
    pt: '724TOTO'
  },
  gorevler: {
    tr: 'Görevler',
    en: 'Quests',
    es: 'Misiones',
    pt: 'Missões'
  },
  guvenilir_siteler: {
    tr: 'Güvenilir Siteler',
    en: 'Trusted Sites',
    es: 'Sitios Confiables',
    pt: 'Sites Confiáveis'
  },
  cekilis_yonetimi: {
    tr: 'Çekiliş Yönetimi',
    en: 'Giveaway Mgmt',
    es: 'Gestión Sorteos',
    pt: 'Gestão Sorteios'
  },

  login: {
    tr: 'Giriş Yap',
    en: 'Login',
    es: 'Acceso',
    pt: 'Entrar',
  },
  register: {
    tr: 'Kayıt Ol',
    en: 'Register',
    es: 'Registro',
    pt: 'Registrar',
  },
  search: {
    tr: 'Oyunları ara...',
    en: 'Search games...',
    es: 'Buscar juegos...',
    pt: 'Pesquisar jogos...',
  },
  casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  sports: {
    tr: 'Spor Bahisleri',
    en: 'Sports Betting',
    es: 'Apuestas Deportivas',
    pt: 'Apostas Esportivas',
  },
  visit_casino: {
    tr: 'Ziyaret et Casino',
    en: 'Visit Casino',
    es: 'Visitar Casino',
    pt: 'Visitar Cassino',
  },
  visit_sports: {
    tr: 'Ziyaret et Sports',
    en: 'Visit Sports',
    es: 'Visitar Deportes',
    pt: 'Visitar Esportes',
  },
  live_games: {
    tr: 'Canlı Oyunlar',
    en: 'Live Games',
    es: 'Juegos en Vivo',
    pt: 'Jogos ao Vivo',
  },
  popular_games: {
    tr: 'Popüler Oyunlar',
    en: 'Popular Games',
    es: 'Juegos Populares',
    pt: 'Jogos Populares',
  },
  popular_sports: {
    tr: 'Popüler Sporlar',
    en: 'Popular Sports',
    es: 'Deportes Populares',
    pt: 'Esportes Populares',
  },
  view_all: {
    tr: 'Hepsi',
    en: 'All',
    es: 'Todo',
    pt: 'Tudo',
  },
  players: {
    tr: 'Oyuncular',
    en: 'Players',
    es: 'Jugadores',
    pt: 'Jogadores',
  },
  menu_home: {
    tr: 'Ana Sayfa',
    en: 'Home',
    es: 'Inicio',
    pt: 'Início',
  },
  menu_casino: {
    tr: 'Kumarhane',
    en: 'Casino',
    es: 'Casino',
    pt: 'Cassino',
  },
  menu_sports: {
    tr: 'Sporlar',
    en: 'Sports',
    es: 'Deportes',
    pt: 'Esportes',
  },
  menu_betslip: {
    tr: 'Kuponum',
    en: 'Betslip',
    es: 'Boleto',
    pt: 'Boletim',
  },
  menu_profile: {
    tr: 'Profil',
    en: 'Profile',
    es: 'Perfil',
    pt: 'Perfil',
  },
  play_real_money: {
    tr: 'Gerçek Parayla Oyna',
    en: 'Play with Real Money',
    es: 'Jugar con Dinero Real',
    pt: 'Jogar com Dinheiro Real',
  },
  play_demo: {
    tr: 'Eğlencesine Oyna (Demo)',
    en: 'Play for Fun (Demo)',
    es: 'Jugar por Diversión (Demo)',
    pt: 'Jogar por Diversão (Demo)',
  },
  live_casino: {
    tr: 'Canlı Casino',
    en: 'Live Casino',
    es: 'Casino en Vivo',
    pt: 'Cassino ao Vivo',
  },
  promo_1_title: {
    tr: 'Büyük Ödüller',
    en: 'Big Rewards',
    es: 'Grandes Recompensas',
    pt: 'Grandes Recompensas'
  },
  promo_1_sub: {
    tr: 'Hoşgeldin Bonusu Seni Bekliyor',
    en: 'Welcome Bonus is Waiting',
    es: 'El Bono de Bienvenida te Espera',
    pt: 'O Bônus de Boas-Vindas te Espera'
  },
  hero_title_1: {
    tr: 'Saniyeler İçinde Yatır,',
    en: 'Deposit in Seconds,',
    es: 'Deposita en Segundos,',
    pt: 'Deposite em Segundos,'
  },
  hero_title_2: {
    tr: 'Dakikalar İçinde Çek.',
    en: 'Withdraw in Minutes.',
    es: 'Retira en Minutos.',
    pt: 'Retire em Minutos.'
  },
  hero_subtitle: {
    tr: 'Kesintisiz eğlence başladı.',
    en: 'Uninterrupted entertainment has begun.',
    es: 'El entretenimiento ininterrumpido ha comenzado.',
    pt: 'O entretenimento ininterrupto começou.'
  },
  register_alt: {
    tr: 'Veya diğer seçeneklerle kaydolun',
    en: 'Or sign up with other options',
    es: 'O regístrate con otras opciones',
    pt: 'Ou inscreva-se com outras opções'
  },
  newly_added: {
    tr: 'Yeni Eklenenler',
    en: 'Newly Added',
    es: 'Recién Agregados',
    pt: 'Adicionados Recentemente'
  },
  newly_added_2: {
    tr: 'Yeni Eklenenler 2',
    en: 'Newly Added 2',
    es: 'Recién Agregados 2',
    pt: 'Adicionados Recentemente 2'
  },
  winners_title: {
    tr: '7/24 Kazananlar',
    en: '24/7 Winners',
    es: 'Ganadores 24/7',
    pt: 'Vencedores 24/7'
  },
  promo_2_title: {
    tr: 'Güvenilir Sistem',
    en: 'Trusted System',
    es: 'Sistema Confiable',
    pt: 'Sistema Confiável'
  },
  promo_2_sub: {
    tr: 'Lisanslı Altyapı ile Güvendesiniz',
    en: 'Safe with Licensed Infrastructure',
    es: 'Seguro con Infraestructura Licenciada',
    pt: 'Seguro com Infraestrutura Licenciada'
  },
  promo_3_title: {
    tr: 'Canlı Destek',
    en: 'Live Support',
    es: 'Soporte en Vivo',
    pt: 'Suporte ao Vivo'
  },
  promo_3_sub: {
    tr: '7/24 Kesintisiz Hizmet',
    en: '24/7 Uninterrupted Service',
    es: 'Servicio 24/7 Ininterrumpido',
    pt: 'Serviço 24/7 Ininterrupto'
  }
};

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  isAnimating: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('tr');
  const [isAnimating, setIsAnimating] = useState(false);

  const setLanguage = (lang: LanguageCode) => {
    if (lang === language) return;
    setIsAnimating(true);
    
    // Hold screen, change language, then release screen
    setTimeout(() => {
      setLanguageState(lang);
      setTimeout(() => {
        setIsAnimating(false);
      }, 800); // Wait for translation to apply
    }, 600); // Wait for transition fade-in
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback to key if not found
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isAnimating }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
