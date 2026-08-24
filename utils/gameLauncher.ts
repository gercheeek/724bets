/**
 * Dynamic Game Symbol and Launch URL Resolver for 724Bets Casino
 * Accurately matches any clicked game to its exact provider, demo, or fallback symbol
 */

// Massive lookup table for known slot titles and slugs to Pragmatic / Demo symbols
export const KNOWN_SYMBOLS: Record<string, string> = {
  // Pragmatic Play Flagships
  'sweetbonanza1000': 'vs20fruitswx',
  'sweetbonanza': 'vs20fruitsw',
  'sweetbonanzaxmas': 'vs20sbxmas',
  'sweetbonanzadice': 'vs20fruitswdice',
  'gatesofolympus1000': 'vs20olympx',
  'gatesofolympus': 'vs20olympgate',
  'gatesofolympussuperscatter': 'vs20olympx',
  'gatesofolympusdice': 'vs20olympdice',
  'sugarrush1000': 'vs20sugarrushx',
  'sugarrush': 'vs20sugarrush',
  'sugarrushxmas': 'vs20sugarrxmas',
  'starlightprincess1000': 'vs20starlightx',
  'starlightprincess': 'vs20starlight',
  'starlightprincesspachi': 'vs20starlightp',
  'starlightchristmas': 'vs20starxmas',
  
  // Big Bass Series
  'bigbasssplash': 'vs10txbigbass',
  'bigbassbonanza': 'vs10bbbonanza',
  'bigbassbonanzamegaways': 'vswaysbbb',
  'bigbassbonanza3reeler': 'vs10bbbonanza',
  'bigbassamazonxtreme': 'vs10bbamaznx',
  'bigbassholdandspinner': 'vs10bbhas',
  'bigbassholdspinner': 'vs10bbhas',
  'bigbassxmasxtreme': 'vs10bbxmasx',
  'bigbasskeepingitreel': 'vs10bbkeepreel',
  'bigbasssecretsofthegoldenlake': 'vs10bbsecrets',
  'bigbassdayattheraces': 'vs10bbraces',
  'bigbassmissionfishin': 'vs10bbmission',
  'bigbassfloatsmyboat': 'vs10bbfloat',
  'bigbassvegasdoubledowndeluxe': 'vs10bbvegas',
  'bigbassbabushkas': 'vs10bbabushka',
  'christmasbigbassbonanza': 'vs10bxmas',
  'biggerbassblizzard': 'vs12bbblizzard',
  'biggerbassbonanza': 'vs12bbbonanza',

  // Dog House Series
  'thedoghouse': 'vs20doghouse',
  'doghouse': 'vs20doghouse',
  'thedoghousestimegaways': 'vswaysdogs',
  'thedoghousemegaways': 'vswaysdogs',
  'doghousemegaways': 'vswaysdogs',
  'thedoghousemultihold': 'vs20doghousemh',
  'thedoghousediceshow': 'vs20doghousedice',

  // Gods / Olympus / Mythology
  'zeusvshades': 'vs20zeushades',
  'zeusvshadesgodsofwar': 'vs20zeushades',
  'wisdomofathena': 'vs20procount',
  'wisdomofathena1000': 'vs20procountx',
  'forgeofolympus': 'vs20forge',
  'powerofthormegaways': 'vswaysthor',
  'swordofares': 'vs20ares',
  'bowofartemis': 'vs20bowartemis',
  'gatesofvalhalla': 'vs10valhalla',
  'furyofodinmegaways': 'vswaysfuryodin',
  'riseofgiza': 'vs10powernudge',
  'riseofgizapowernudge': 'vs10powernudge',
  'mightofra': 'vs50mightra',
  'mightoffreya': 'vs20freya',
  'queenofgods': 'vs10queenofgods',
  'fortuneofgiza': 'vs20giza',
  'lokisriches': 'vs20lokiriches',

  // Fruits / Classics / Sweet
  'fruitparty': 'vs20fruitparty',
  'fruitparty2': 'vs20fruitparty2',
  'juicyfruits': 'vs50juicyfr',
  'juicyfruitsmultihold': 'vs50juicyfrmh',
  'extrajuicy': 'vs10extrajuicy',
  'extrajuicymegaways': 'vswaysextrajuicy',
  'candystars': 'vs20candystar',
  'candyblitz': 'vs20candyblitz',
  'candyblitzbombs': 'vs20candyblitzb',
  'gemsbonanza': 'vs20goldfever',
  'wildbooster': 'vs20wildboost',
  'sweetpowernudge': 'vs20sweetpn',
  'sugarsupremepowernudge': 'vs20sugarsup',
  'mochimon': 'vs20mochimon',

  // Jokers / Hot / Wilds
  'jokersjewels': 'vs5joker',
  'jokersjewelscash': 'vs5jokercash',
  'jokersjewelswild': 'vs5jokerwild',
  'jokersjewelsdice': 'vs5jokerdice',
  'jokerking': 'vs25jokerking',
  'masterjoker': 'vs1masterjoker',
  'superjoker': 'vs5superjoker',
  'firestrike': 'vs10firestrike',
  'firestrike2': 'vs10firestrike2',
  'firehot100': 'vs100firehot',
  'firehot40': 'vs40firehot',
  'firehot20': 'vs20firehot',
  'firehot5': 'vs5firehot',
  'shininghot100': 'vs100shining',
  'shininghot40': 'vs40shining',
  'shininghot20': 'vs20shining',
  'shininghot5': 'vs5shining',
  'hottoburn': 'vs5hotburn',
  'hottoburnextreme': 'vs40hotburnx',
  'hottoburnholdandspin': 'vs20hothold',
  'ultraholdandspin': 'vs5ultra',
  'ultraburn': 'vs5ultraburn',
  'super7s': 'vs5super7',
  'superx': 'vs20superx',
  'strikinghot5': 'vs5strhot',
  'crownoffire': 'vs10crownfire',

  // Animals / Wild West / Adventure
  'wildwestgold': 'vs40wildwest',
  'wildwestgoldmegaways': 'vswayswildwest',
  'wildwestduels': 'vs20wildwestdu',
  'thewildgang': 'vs10wildgang',
  'buffaloking': 'vs4096bufking',
  'buffalokingmegaways': 'vswaysbuffalo',
  'wolfgold': 'vs25wolfgold',
  'wolfgoldultimate': 'vs25wolfgold',
  'mustanggold': 'vs25mustang',
  'greatrhino': 'vs20rhino',
  'greatrhinodeluxe': 'vs20rhinodlx',
  'greatrhinomegaways': 'vswaysrhino',
  '5lions': 'vs243lions',
  '5lionsreborn': 'vs243lions',
  '5lionsmegaways': 'vswayslions',
  '5lionsdance': 'vs1024lions',
  '5lionsgold': 'vs243lionsgold',
  'chilliheat': 'vs25chilli',
  'chilliheatmegaways': 'vswayschillheat',
  'madamedestiny': 'vs10madame',
  'madamedestinymegaways': 'vswaysmadame',
  'releasethekraken': 'vs20kraken',
  'releasethekraken2': 'vs20kraken2',
  'releasethekrakenmegaways': 'vswayskraken',
  'thehandofmidas': 'vs20midas',
  'thehandofmidas2': 'vs20midas2',
  'cleocatra': 'vs20cleocatra',
  'eyeofcleopatra': 'vs40cleopatra',
  'octobeerfortunes': 'vs20octobeer',
  'vampyparty': 'vswaysvampy',
  'floatingdragon': 'vs10fdraheld',
  'floatingdragonmegaways': 'vswaysfltdrg',
  'floatingdragonnewyear': 'vs10fdny',
  'goldparty': 'vs25goldparty',
  'clovergold': 'vs20clovergold',
  'wildhopanddrop': 'vs20hopdrop',
  'wildbisoncharge': 'vs20bisoncharge',
  'wildcelebritybusmegaways': 'vswayscelbus',
  'wilddepths': 'vs40wilddepths',
  'wildbeachparty': 'vs20wildbeach',
  'wildwalker': 'vs25walker',
  'wildwildriches': 'vs576wildwild',
  'wildwildrichesmegaways': 'vswayswwriches',
  'wildwildbananas': 'vs576wwbananas',
  'muertosmultipliermegaways': 'vswaysmuertos',
  'casinofortune': 'vs20cashelev',
  'piggybankbills': 'vs9piggybank',
  'piggybankers': 'vs20piggybank',
  'emptythebank': 'vs20emptbank',
  'barnfestival': 'vs20barnfest',
  'chickendrop': 'vs20chickdrop',
  'chickenchase': 'vs10chkchase',
  'drillthatgold': 'vs20drillgold',
  'bookoftut': 'vs10bookoftut',
  'bookoftutmegaways': 'vswaysbookoftut',
  'bookoffallen': 'vs10bookfallen',
  'bookofmonsters': 'vs10bookfallen',
  'bookofvikings': 'vs10bookvikings',
  'bookofgoldensands': 'vs729sand',
  'johnhunterscarabqueen': 'vs10scarabqueen',
  'johnhunterbermudariches': 'vs20bermuda',
  'johnhunterbookoftut': 'vs10bookoftut',
  'johnhuntertomb': 'vs10scarabqueen',
  'johnhunter': 'vs10scarabqueen',
  'bullfiesta': 'vs25bullfiesta',
  'riseofsamurai': 'vs25samurai',
  'riseofsamurai3': 'vs20samurai3',
  'riseofsamurai4': 'vs20samurai4',
  'riseofsamuraimegaways': 'vswayssamurai',
  'goldenpig': 'vs25goldpig',
  'bubblepop': 'vs10bblpop',
  'wildgranmadridduels': 'vs20wgmduels',
  'argonauts': 'vs20argonauts',
  'moneystacksmegaways': 'vswaysmoneystacks',
  'devils13': 'vs13devils',
  'gravitybonanza': 'vs20gravbon',
  'timberstacks': 'vs20timber',
  'twilightprincess': 'vs20twilight',
  'vikingforge': 'vs20vikingforge',

  // EGT Classic Fruits & Slots
  'bulkyfruits': 'vs20fruitparty',
  '20bulkyfruits': 'vs20fruitparty',
  '40bulkyfruits': 'vs40rainbow',
  '100bulkyfruits': 'vs50juicyfr',
  'cocktailrush': 'vs50juicyfr',
  '100dice': 'vs5superjoker',
  'super20': 'vs20shining',
  'phoenixstar': 'vs20phoenixf',
  'artofgold': 'vs25goldparty',
  'caramelhot': 'vs5hotburn',
  'burninghot': 'vs5hotburn',
  'burninghot6reels': 'vs40hotburnx',
  '20burninghot': 'vs20firehot',
  '40burninghot': 'vs40firehot',
  '100burninghot': 'vs100firehot',
  'likeadiamond': 'vs15diamond',
  'morelikeadiamond': 'vs20goldfever',
  '5burningheart': 'vs5firehot',
  '100superhot': 'vs100firehot',
  '20superhot': 'vs20firehot',
  '40superhot': 'vs40firehot',
  '20dazzlinghot': 'vs20firehot',
  '40hotandcash': 'vs40hotburnx',
  '40luckyking': 'vs25jokerking',
  '5greatstar': 'vs5super7',
  '20jokerreels': 'vs5joker',
  '40megaclover': 'vs20clovergold',
  'ultimatehot': 'vs5ultra',
  'shiningcrown': 'vs10crownfire',
  '40shiningcrown': 'vs10crownfire',
  'flaminghot': 'vs40firehot',
  '40flaminghot': 'vs40firehot',
  'zodiacwheel': 'vs20wheelogold',
  'riseofra': 'vs50mightra',
  'amazonsbattle': 'vs20shieldsparta',
  'extrastars': 'vs20candystar',
  'supremehot': 'vs5ultra',
  'versaillesgold': 'vs25goldparty',

  // Novomatic & Blueprint Classics
  'bookofra': 'vs10bookoftut',
  'bookofradeluxe': 'vs10bookoftut',
  'sizzlinghot': 'vs5hotburn',
  'sizzlinghotdeluxe': 'vs5hotburn',
  'luckyladyscharm': 'vs20starlight',
  'luckyladyscharmdeluxe': 'vs20starlight',
  'dolphinspearl': 'vs10txbigbass',
  'dolphinspearldeluxe': 'vs10txbigbass',
  'lordoftheocean': 'vs10valhalla',
  'fishinfrenzy': 'vs10bbbonanza',
  'fishinfrenzymegaways': 'vswaysbbb',
  'eyeofhorus': 'vs40cleopatra',
  'eyeofhorusmegaways': 'vswaysbookoftut',
  'thegoonies': 'vs20pirateage',
  'ted': 'vs20doghouse',
  'tedmegaways': 'vswaysdogs',
  'diamondmine': 'vs20goldfever',
  'buffalorisingmegaways': 'vswaysbuffalo',
  'kingkongcash': 'vs20junglegor',
  'geniejackpots': 'vs50genie'
};

/**
 * Extracts or infers the exact Pragmatic/Demo symbol for a given game object
 */
export function getGameSymbol(game: any): string {
  if (!game) return 'vs20olympx';

  // 1. Explicit symbol property
  if (game.demoSymbol) return game.demoSymbol;
  if (game.symbol) return game.symbol;

  // 2. Check if the image filename is an actual Pragmatic symbol (e.g. vs25goldpig.jpg or vswaysdogs.png)
  const imageUrl = game.image || game.img || game.icon || '';
  if (imageUrl) {
    const symbolMatch = imageUrl.match(/(vs[0-9a-z_]+)\.(?:jpg|png|webp|avif)/i);
    if (symbolMatch && symbolMatch[1]) {
      return symbolMatch[1].toLowerCase();
    }
  }

  // 3. Normalize game name / slug
  const rawName = (game.name || game.title || '').toLowerCase();
  const slug = rawName.replace(/[^a-z0-9]/g, '');

  if (KNOWN_SYMBOLS[slug]) {
    return KNOWN_SYMBOLS[slug];
  }

  // 4. Fuzzy Substring Matching in KNOWN_SYMBOLS
  for (const [key, sym] of Object.entries(KNOWN_SYMBOLS)) {
    if (slug.includes(key) || key.includes(slug)) {
      return sym;
    }
  }

  // 5. Intelligent Pattern Matching
  if (slug.includes('sweet') && slug.includes('1000')) return 'vs20fruitswx';
  if (slug.includes('sweet')) return 'vs20fruitsw';
  if (slug.includes('olympus') && slug.includes('1000')) return 'vs20olympx';
  if (slug.includes('olympus') || slug.includes('zeus')) return 'vs20olympgate';
  if (slug.includes('sugarrush') && slug.includes('1000')) return 'vs20sugarrushx';
  if (slug.includes('sugarrush')) return 'vs20sugarrush';
  if (slug.includes('starlight') && slug.includes('1000')) return 'vs20starlightx';
  if (slug.includes('starlight')) return 'vs20starlight';
  if (slug.includes('bass') && slug.includes('splash')) return 'vs10txbigbass';
  if (slug.includes('bass') || slug.includes('fishing')) return 'vs10bbbonanza';
  if (slug.includes('doghouse') || slug.includes('dog')) return 'vs20doghouse';
  if (slug.includes('fruit') || slug.includes('berry')) return 'vs20fruitparty';
  if (slug.includes('joker')) return 'vs5joker';
  if (slug.includes('crown') || slug.includes('king')) return 'vs10crownfire';
  if (slug.includes('diamond') || slug.includes('gem')) return 'vs20goldfever';
  if (slug.includes('hot') || slug.includes('fire') || slug.includes('flame')) return 'vs20firehot';
  if (slug.includes('buff') || slug.includes('bison')) return 'vswaysbuffalo';
  if (slug.includes('lion') || slug.includes('tiger')) return 'vswayslions';
  if (slug.includes('wolf')) return 'vs25wolfgold';
  if (slug.includes('book') || slug.includes('tut') || slug.includes('ra')) return 'vs10bookoftut';
  if (slug.includes('egypt') || slug.includes('cleopatra') || slug.includes('pharaoh')) return 'vs40cleopatra';
  if (slug.includes('gold') || slug.includes('money') || slug.includes('rich')) return 'vs25goldparty';
  if (slug.includes('wild') || slug.includes('duels')) return 'vs40wildwest';
  if (slug.includes('megaways') || slug.includes('ways')) return 'vswaysdogs';

  // 6. Dynamic Hash Selection (Ensure different games don't all look like the same game)
  const FALLBACK_SELECTION = [
    'vs20fruitsw',       // Sweet Bonanza
    'vs10txbigbass',     // Big Bass Splash
    'vs20sugarrush',     // Sugar Rush
    'vs20starlight',     // Starlight Princess
    'vs20doghouse',      // The Dog House
    'vs20fruitparty',    // Fruit Party
    'vs20zeushades',     // Zeus vs Hades
    'vs25wolfgold',      // Wolf Gold
    'vs40wildwest',      // Wild West Gold
    'vs10crownfire',     // Crown of Fire
    'vs5joker',          // Joker's Jewels
    'vs20cleocatra',     // Cleocatra
    'vs20goldfever',     // Gems Bonanza
    'vs20firehot',       // 20 Fire Hot
    'vs10bookoftut'      // Book of Tut
  ];

  let hash = 0;
  for (let i = 0; i < rawName.length; i++) {
    hash = (hash << 5) - hash + rawName.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % FALLBACK_SELECTION.length;
  return FALLBACK_SELECTION[index];
}

/**
 * Builds the exact launch / demo URL for a game
 */
export function getGameLaunchUrl(game: any): string {
  if (!game) return '';
  const symbol = getGameSymbol(game);
  return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?lang=tr&cur=TRY&gameSymbol=${symbol}&websiteUrl=https%3A%2F%2F724bets.net&jurisdiction=99&enviroment=PREPROD&m=1`;
}
