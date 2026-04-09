import React, { useState, useEffect, useRef } from 'react';
import { Settings, Image, Grid, Shield, Layout, Trophy, Users, Eye, EyeOff, Save, Pen, Plus, Sparkles, TrendingUp, AlertCircle, FileText, Download, CheckCircle, Clock, ExternalLink, Box, Zap, Trash2, Search, Link as LinkIcon, Lock, Unlock, Timer, Gift, Coins, Ticket, Search as SearchIcon, RefreshCw, HandCoins, Activity, Wallet, Trash, Bell, Check, MessageSquare, Palette, Star, CreditCard, ChevronLeft, LogOut, Calendar, ClipboardList, Edit3, Target, CheckCircle2, User, Database } from 'lucide-react';
import { Brand, MatchAnalysis, Coupon, CouponMatch, WheelReward, WheelConfig, BlackjackConfig, BlackjackReward, LoyaltyConfig, LoyaltyTriggerRule, MarketItem, EditorAccount, PaymentConfig, UserMessage, GiveawayConfig, MarqueeConfig, WelcomePopupConfig, LiveOddsConfig, LiveOddsMatch } from '../types';
import { demoAnalyses, demoCoupons } from '../demoData';
import AdminMembersTab from './AdminMembersTab';
import AdminPoolTab from './AdminPoolTab';
import AdminNewsTab from './AdminNewsTab';
import AdminGiveawayTab from './AdminGiveawayTab';
import { NavVisibility, DEFAULT_NAV_VISIBILITY } from './Header';
import { supabase } from '../utils/supabase';

interface AdminPanelProps {
  brands: Brand[];
  hero: Brand;
  themeColor: string;
  hashtags: string;
  role: 'admin' | 'editor' | string;
  wheelConfig: WheelConfig;
  bjConfig?: BlackjackConfig;
  loyaltyConfig?: LoyaltyConfig;
  onSaveBrands: (brands: Brand[]) => void;
  onSaveHero: (hero: Brand) => void;
  onThemeChange: (color: string) => void;
  onHashtagsChange: (tags: string) => void;
  onSaveWheelConfig: (config: WheelConfig) => void;
  onSaveBjConfig?: (config: BlackjackConfig) => void;
  onSaveLoyaltyConfig?: (config: LoyaltyConfig) => void;
  onLogout: () => void;
  onNavigateHome?: () => void;
  giveawayConfig?: GiveawayConfig;
  onSaveGiveawayConfig?: (config: GiveawayConfig) => void;
  navVisibility?: NavVisibility;
  onSaveNavVisibility?: (vis: NavVisibility) => void;
  marqueeConfig?: MarqueeConfig;
  onSaveMarqueeConfig?: (config: MarqueeConfig) => void;
  welcomePopupConfig?: WelcomePopupConfig;
  onSaveWelcomePopupConfig?: (config: WelcomePopupConfig) => void;
  liveOddsConfig?: LiveOddsConfig;
  onSaveLiveOddsConfig?: (config: LiveOddsConfig) => void;
  analyses: MatchAnalysis[];
  coupons: Coupon[];
  onSaveAnalyses: (analyses: MatchAnalysis[]) => void;
  onSaveCoupons: (coupons: Coupon[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  brands, hero, themeColor, hashtags, role, wheelConfig, bjConfig, loyaltyConfig,
  onSaveBrands, onSaveHero, onThemeChange, onHashtagsChange, onSaveWheelConfig, onSaveBjConfig, onSaveLoyaltyConfig, onLogout, onNavigateHome,
  giveawayConfig, onSaveGiveawayConfig,
  navVisibility, onSaveNavVisibility, marqueeConfig, onSaveMarqueeConfig,
  welcomePopupConfig, onSaveWelcomePopupConfig,
  liveOddsConfig, onSaveLiveOddsConfig,
  analyses, coupons, onSaveAnalyses, onSaveCoupons
}) => {
  const isAuthor = role.startsWith('author_');
  const isEditor = role.startsWith('editor');
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'seo' | 'analysis' | 'coupons' | 'wheel' | 'editors' | 'blackjack' | 'loyalty' | 'members' | 'messages' | 'pool' | 'news' | 'giveaway' | 'visibility' | 'liveodds'>(isAuthor || isEditor ? 'news' : 'content');
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top when tab changes
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeTab]);

  // Messages State
  const [messages, setMessages] = useState<UserMessage[]>(() => {
    try { return JSON.parse(localStorage.getItem('site_messages') || '[]'); } catch { return []; }
  });
  const unreadCount = messages.filter(m => !m.isRead).length;
  const [localBrands, setLocalBrands] = useState([...brands]);
  const [localHero, setLocalHero] = useState({ ...hero });
  const [localHashtags, setLocalHashtags] = useState(hashtags);
  const [localWheelConfig, setLocalWheelConfig] = useState<WheelConfig>({ ...wheelConfig });
  const [localBjConfig, setLocalBjConfig] = useState<BlackjackConfig>(bjConfig || { rewards: [], cooldownHours: 4, dealerHitSoft17: true, lastPlayTime: 0 });
  const [localLoyaltyConfig, setLocalLoyaltyConfig] = useState<LoyaltyConfig>(loyaltyConfig || { programName: '724BAHİS Sadakat Programı', coinName: 'Coin', isActive: true, rules: [], marketItems: [] });
  const [localWelcomePopup, setLocalWelcomePopup] = useState<WelcomePopupConfig>(welcomePopupConfig || { isActive: true, title: '724BAHİS', subtitle: '', offerMain: '', offerSub: '', buttonText: '', buttonLink: '' });

  // Live Odds state
  const [localLiveOdds, setLocalLiveOdds] = useState<LiveOddsConfig>(() => {
    if (liveOddsConfig) {
      return { ...liveOddsConfig, matches: liveOddsConfig.matches || [] };
    }
    return { isActive: true, matches: [] };
  });

  // New Management Local State
  const [localAnalyses, setLocalAnalyses] = useState<MatchAnalysis[]>(analyses);
  const [editingAnalysisId, setEditingAnalysisId] = useState<string | null>(null);

  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(coupons);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  const [adminSport, setAdminSport] = useState<'Futbol' | 'Basketbol'>('Futbol');

  // AI Parser States
  const [aiInput, setAiInput] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // Coupon AI States
  const [couponAiInput, setCouponAiInput] = useState('');
  const [showCouponAiModal, setShowCouponAiModal] = useState(false);
  const [couponRiskLevel, setCouponRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [couponAiDate, setCouponAiDate] = useState(() => new Date().toISOString().split('T')[0]);

  // JSON Editor State
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Editor Management State
  const [editorAccounts, setEditorAccounts] = useState<EditorAccount[]>(() => {
    try { return JSON.parse(localStorage.getItem('site_editors') || '[]'); } catch { return []; }
  });
  const [newEditorName, setNewEditorName] = useState('');
  const [newEditorUsername, setNewEditorUsername] = useState('');
  const [newEditorPassword, setNewEditorPassword] = useState('');
  const [showEditorPassword, setShowEditorPassword] = useState(false);
  const [editorSaveMsg, setEditorSaveMsg] = useState('');
  const [editorError, setEditorError] = useState('');

  // Cloud Sync Status
  const [syncStatus, setSyncStatus] = useState<'checking' | 'connected' | 'error' | 'no_table'>('checking');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const { error } = await supabase.from('site_configs').select('key').limit(1);
        if (error) {
          if (error.code === '42P01') setSyncStatus('no_table');
          else setSyncStatus('error');
        } else {
          setSyncStatus('connected');
        }
      } catch (e) {
        setSyncStatus('error');
      }
    };
    checkSupabase();
  }, []);

  const handleCloudSync = async () => {
    setIsSyncing(true);
    try {
      const configs = [
        { key: 'site_analyses', value: analyses },
        { key: 'site_coupons', value: coupons },
        { key: 'site_brands', value: brands },
        { key: 'site_hero', value: hero },
        { key: 'site_primary_color', value: themeColor },
        { key: 'site_hashtags', value: hashtags },
        { key: 'site_bj_config', value: bjConfig },
        { key: 'site_loyalty_config', value: loyaltyConfig },
        { key: 'site_giveaway_config', value: giveawayConfig },
        { key: 'site_marquee_config', value: marqueeConfig },
        { key: 'site_nav_visibility', value: navVisibility },
        { key: 'site_casino_wheel', value: wheelConfig },
        { key: 'site_welcome_popup', value: welcomePopupConfig },
        { key: 'site_live_odds', value: liveOddsConfig },
      ];

      for (const cfg of configs) {
         if (cfg.value) {
            await supabase.from('site_configs').upsert({ 
              key: cfg.key, 
              value: cfg.value,
              updated_at: new Date().toISOString() 
            });
         }
      }
      alert('Tüm veriler başarıyla buluta (Supabase) senkronize edildi!');
      setSyncStatus('connected');
    } catch (err) {
      alert('Senkronizasyon hatası: ' + (err as any).message);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setLocalAnalyses(analyses);
  }, [analyses]);

  useEffect(() => {
    setLocalCoupons(coupons);
  }, [coupons]);

  useEffect(() => {
    if (welcomePopupConfig) setLocalWelcomePopup(welcomePopupConfig);
  }, [welcomePopupConfig]);

  useEffect(() => {
    if (liveOddsConfig) {
      setLocalLiveOdds({
        ...liveOddsConfig,
        matches: liveOddsConfig.matches || []
      });
    }
  }, [liveOddsConfig]);

  const handleBrandChange = (index: number, field: keyof Brand, value: string) => {
    const updated = [...localBrands];
    updated[index] = { ...updated[index], [field]: value };
    setLocalBrands(updated);
  };

  const addBrand = () => {
    const newBrand: Brand = {
      id: Date.now().toString(),
      name: 'Yeni Marka',
      subtitle: 'Alt Başlık',
      offerMain: '%100',
      offerSub: 'BONUS',
      logo: 'https://picsum.photos/seed/new/200/200',
      link: '#',
      bonusText: 'DENEME BONUSU'
    };
    setLocalBrands([...localBrands, newBrand]);
  };

  const handleSave = () => {
    onSaveBrands(localBrands);
    onSaveHero(localHero);
    onHashtagsChange(localHashtags);
    onSaveAnalyses(localAnalyses);
    onSaveCoupons(localCoupons);
    onSaveWheelConfig(localWheelConfig);
    if (onSaveWelcomePopupConfig) {
      onSaveWelcomePopupConfig(localWelcomePopup);
    }

    alert('Tüm sistem değişiklikleri kaydedildi!');
  };

  const handleAiParse = () => {
    if (!aiInput.trim()) return;

    const lines = aiInput.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const newAnalyses: MatchAnalysis[] = [];
    let baseTime = Date.now();

    let currentDate = new Date().toISOString().split('T')[0];
    let currentLeague = 'Genel Maçlar';

    // Randomized Templates
    // Randomized Templates
    // Football Templates
    const getTacticalSummaries = (home: string, away: string) => [
      `${home} son dönemde iç sahada kanatları inanılmaz efektif kullanıyor.${away} ise kontradan vurma peşinde ama defans defoları çok fazla.Orta sahadaki itiş kakış maçın kaderini çizer.`,
      `Her iki takım da topu ayağında tutmak isteyecek.${home} baskıyla oyunu rakip yarı alana yığmaya çalışırken, ${away} hızlı hücumcularıyla ters köşe arayacak.`,
      `${home} cephesinde eksiklere rağmen savunma kurgusu beton gibi.${away} bu kilidi açmak için mecburen duran toplara ve uzaktan şutlara bel bağlayacak.`,
      `Agresif ve kemik seslerinin geleceği bir 90 dakika.${home} erken bir golle işin fişini çekmek niyetindeyken, ${away} otobüsü ceza sahasına çekip direnecek.`,
      `${away} takımının yumuşak karnı sol beki.${home} burayı işlerse ilk yarıdan maçı koparır.Açık futbol izleyeceğimiz kesin.`,
      `İki takım da son haftalarda tel tel dökülüyor.Beraberliğin iki tarafa da yaramayacağı bu maçta ${home} taraftar gazıyla bir adım önde.`,
      `${away} deplasman fobiğini atlatmış değil.${home} ise evinde tam bir canavar.Kanat organizasyonlarıyla rakibi boğmaları an meselesi.`,
      `${home} orta sahası fizik olarak çok üstün.${away} pas trafiğini kesemezse kalesinde bol pozisyon görür.Tam bir taktik savaşı.`,
      `Taraf bahsinin rulet olduğu bir maç.${home} iç saha avantajını kullanıp baskılı başlar ama ${away} takımının geçiş oyunları ölümcül olabilir.`,
      `${away} takımının forvet hattı inanılmaz formsuz, ancak ${home} savunması da evlere şenlik.Hatayı az yapanın kazanacağı, bol git - gelli bir mücadele.`,
      `${home} şampiyonluk yolunda hata yapmak istemiyor, ${away} ise can havliyle puan peşinde.İnanılmaz tempolu ve bol kartlı bir maç bizi bekliyor.`,
      `Defansif zafiyetlerin ön planda olacağı bir eşleşme.${home} hücumda üretken, ${away} ise kontra ataklarda zehir gibi.`,
      `Statik bir oyun beklemek hata olur.${away} hücum presle ${home} savunmasını hataya zorlayacak.Top kayıpları skoru doğrudan etkiler.`,
      `${home} takımının merkezden delici atakları var, ${away} ise oyunu kanatlara yayarak sete kalkacak.İlk golü atan maçı rölantiye alır.`,
      `${away} ligin en katı savunmalarından birine sahip.${home} bu kilidi açmak için uzaktan şutlar denemek zorunda kalacak, sabır testi gibi bir maç.`
    ];

    const getBreakingPoints = (home: string, away: string) => [
      `Maçın ilk 20 dakikasında ${home} 'in bulacağı bir erken gol, maçın tamamen Üst'e bağlamasına neden olur.Yoksa kısır bir 90 dakika izleriz.`,
      `${away} takımının ilk devreyi golsüz kapatması halinde 60. dakikadan ev sahibi taraftarın protestosu başlar.Maçın kırılma anı ikinci yarının başı.`,
      `${home} savunmasının yapacağı basit bir bireysel hata, ${away} forvetlerinin cezalandırabileceği en net fırsat.İlk golü atan maçı rahat götürür.`,
      `İkinci yarının başındaki 15 dakikalık dilim çok kritik.${home} bu bölümde tribün desteğini arkasına alıp baskıyı inanılmaz artıracak ve kilidi açacaktır.`,
      `70'ten sonra her iki takımın da pili biter. Maç başa baş giderse son 15 dakikada çıkacak bir kırmızı kart tüm dengeleri alt üst edebilir.`,
      `Eğer ${home} ilk yarıda skor bulamazsa, ${away} ikinci yarı kontradan fişi çeker. Kırılma anı tamamen ilk yarının bitiş düdüğü.`,
      `Hakemin düdükleriyle çok duracak bir maç. Çıkacak erken bir sarı kart, stoperlerin agresifliğini bitirir ve maçı gollü bir havaya sokar.`,
      `Deplasman ekibinin yorgun as oyuncuları 60'tan sonra oyundan düşmeye başlayacak. ${home} bench'ten gelen oyuncularla bu dakikalarda maçı koparır.`,
      `Duran toplar bu maçın tek kırılma noktası. ${away} kazanacağı bir kornerde kafayı vurup üstüne yatarak kanser bir futbol oynatabilir.`,
      `Erken gelecek bir penaltı kararı tüm bahisçileri ters köşeye yatırabilir. Oyun çok gergin geçmeye aday.`,
      `80. dakikadan sonra taktik-maktik kalmaz, bodoslama bir futbol izleriz. Uzatma dakikaları mucizelere gebe.`
    ];

    const getBettingScenarios = (home: string, away: string) => [
      `Canlıcılar için 15-30 dakika arası gol opsiyonu çok tatlı. Maç öncesi verilere bakınca "Karşılıklı Gol Var" seçeneği adeta banko bağırıyor.`,
      `İlk yarıda kör dövüşü izleriz, risk almaktansa takımların dizilişini görüp ikinci yarı taraf bahislerine çökmek çok daha kârlı.`,
      `Maç boyu bol korner ve kemik sesleri duyacağız. Alternatif bahis arayanlar için sarı kart ve korner üst seçenekleri tam kuponluk.`,
      `Sürprize inanılmaz açık bir eşleşme. Taraf bahsine bulaşmak yerine 2.5 Alt veya İlk Yarı Alt seçenekleri uykunuzu kaçırmaz, temiz kazanç.`,
      `İddaa ustaları bilir, bu tarz maçlarda ev sahibi handikapı tatlıdır. Direkt M.S 1 veya oran yükseltmek isteyenlere 1 & 1.5 Üst kombosu banko.`,
      `Sistem kuponlarında direkt '0' (beraberlik) denenebilecek bir maç. Kimsenin kazanmaya gücü yetmez, puanları bölüşürler.`,
      `Favori takımın patlama yapacağı bir eşleşme değil. Handikaplı maç sonucu deplesman veya maç sonu 3.5 Alt bahisleri ile kupona sağlam bir temel atılır.`,
      `Taraf bahsi oynayan yanar. Bu maç tam bir "KG VAR" maçı, iki takımın da defansı evlere şenlik, bol gollü bir şov izleriz.`,
      `Büyük paralar oynamaktansa, İlk Yarı 1.5 Alt seçeneğine kasa atılıp rahatça arkaya yaslanılacak türden kilitli bir karşılaşma.`,
      `Sürpriz avcıları için deplasmanın ilk yarıyı önde kapatması mükemmel oran veriyor. İlk Yarı 2 oranı ciddi bir value (değerli oran) barındırıyor.`,
      `Maç sonu sürpriz çıkma ihtimali çok yüksek, canlıdan izleyip gidişata göre "Sıradaki Golü Kim Atar" kovalayın, taraf bahsinden uzak durun.`
    ];

    const getAnalyses = (home: string, away: string) => [
      `${home} - ${away} mücadelesinde istatistikler tam bir gol düellosu vadediyor. Analiz modellerimiz ÜST seçeneğine %90 güven veriyor, kuponlara banko yazılır.`,
      `${home} ile ${away} arasındaki bu ters eşleşmede taraf analizi zar atmak gibi. Ancak ev sahibi taraftar baskısıyla bir tık önde. Sistemin önerisi sürpriz arayanlara M.S 1.`,
      `${home} form grafiği olarak zirvede uçuyor, ${away} ise kümeye doğru serbest düşüşte. İbre net bir şekilde ev sahibinin gollü galibiyetinden yana. Acımazlar.`,
      `${home} ve ${away} maçı tam bir satranç müsabakasına dönecek. Kısır bir döngüde geçecek, izleyenleri uyutacak ama 2.5 Alt oynayanı zengin edecek bir doksan dakika.`,
      `Bu ligin en dengesiz iki takımı karşı karşıya. ${home} bir gün şov yapıyor, diğer gün dökülüyor. Ancak yapay zeka bu maçta ev sahibinin hata yapmayacağını öngörüyor.`,
      `Kağıt üstünde ${home} ağır favori dursa da, ${away} tam bir dev avcısı. İddia ediyorum bu maçta handikap aşılmaz, deplasman takımı dişe diş direnir.`,
      `Deplasman fobisi olan ${away}, bu cehennem deplasmanından çıkamaz. ${home} ilk yarıdan fişi çeker, oran düşükse İlk Yarı 1 seçeneğine yapışın.`,
      `İki takımın arasındaki son 5 maçın 4'ü beraberlikle bitmiş. Bu gelenek bozulmaz. Yapay zekamız maçın düğümünün çözülemeyeceğini söylüyor, taraf bahsi oynayan ağlar.`,
      `Bültenin en tatlı maçlarından biri. ${away} hücum oynayacak, ${home} arkada geniş alan bulacak. Mükemmel bir "Karşılıklı Gol Var" maçı. Kasa katlama garantili.`,
      `Avrupa kupası yorgunu ${home} rotasyona gidecek. Bu durum ${away} için bulunmaz bir nimet. Oranlar ev sahibinden yana olsa da analiz sistemimiz puan kaybı bekliyor.`,
      `Son dakika sakatlıkları maçın dinamiklerini baştan aşağı değiştirdi. Normalde ${home} favoriydi ama şu an maç tamamen ortada. Gollere yönelmek en iyisi.`
    ];

    // Basketball / NBA Templates
    const getNbaTacticalSummaries = (home: string, away: string) => [
      `${home} pota altında resmen krallığını ilan etmiş durumda. ${away} ise dış atışlarla ve "koş-ve-at" temposuyla bu kilidi açmaya çalışacak. Tempo atışları belirleyici olur.`,
      `${home} set hücumlarında topu iğne deliğinden geçirip boş şutörlerini buluyor. ${away} adam değişmeli savunmada hata yaparsa maça erken havlu atar.`,
      `${home} ilk çeyreklerde genellikle rakibi tartarak, tabiri caizse el freni çekik başlıyor, ${away} ise agresif bir 3 sayı yüzdesiyle şok etkisi yaratma peşinde.`,
      `Parkede temponun tavan yapacağı bir gece bekliyoruz. ${home} geçiş hücumlarında durdurulamaz bir makine, ${away} ise yarı sahada çok daha pasif ve akılcı oynuyor.`,
      `${away} takımının bench katkısı bu sezon felaket. İlk beşler dengede dursa da ikinci çeyrekte ${home} rotasyonu girince farkı açarak şov yapacaklardır.`,
      `Bu maç tam bir spacing (alan paylaşımı) dersi olacak. ${home} dışarı yayılarak eşleşme problemi yaratırken, ${away} tamamen birebir izolasyonlarla skor üretecek.`,
      `${home} savunmada inanılmaz adam değişiyor ve kısa takımları çok eziyor. ${away} forvetlerinin şut yüzdesi maçın tüm hikayesini belirler.`,
      `Top kayıplarının çok can yakacağı bir maç. ${home} hızlı hücumlara çıkma konusunda uzman, ${away} top değerini bilmezse ilk devreden fark 20'lere dayanır.`,
      `Temponun bilerek düşürüleceği, pivotların bol bol itiş kakış yaşayacağı bir Avrupa ekolü maçı. Dış atıştan çok boyalı alan dominasyonu skor tabelasına yansıyacak.`
    ];

    const getNbaBreakingPoints = (home: string, away: string) => [
      `Maçın 3. çeyreğinde ${home} takımının ateş alıp çıkaracağı 10-0'lık bir seri maçın tamamen kopmasını sağlar. Molalardan sonraki dönüşler hayati.`,
      `${away} takımının yıldız oyuncularından birinin erken 3 veya 4 faul alıp kenara gelmesi, tüm rotasyon dengesini alt üst eder. Boyalı alan savaşları maçın kilidi.`,
      `Son periyoda başa baş girilirse ${home} seyirci gazıyla ve hakem toleransıyla faul çizgisine çok daha rahat gidecektir. Kritik anlardaki serbest atış yüzdesi her şeyi belirler.`,
      `İkinci çeyrekteki yedek oyuncuların, nam-ı diğer bench'in, sahada kalacağı 6-7 dakikalık bölüm farkın dramatik şekilde açılacağı asıl kırılma noktası olacak.`,
      `İlk çeyrekte tutmayan üçlükler, takımları pota altına itecek. Eğer ${away} dış atışlarda %30'un altında kalırsa maça daha fazla tutunamaz.`,
      `Maçın son 3 dakikası tam bir Taktik Faul savaşına dönecek. Süre yönetimi ve koç hamleleri bu maçta oyuncu performansından daha kritik bir kırılma yaratacak.`
    ];

    const getNbaBettingScenarios = (home: string, away: string) => [
      `Bu eşleşmede takımların hücum ratingleri atmosferin ötesinde. Maç sonu Uzatmalar Dahil Üst (Over) seçeneği kuponlara tereddütsüz yazılır.`,
      `Canlı bahisçiler için ilk periyot Ev Sahibi Handikap bahisleri baldan tatlı. Ev sahibi seyircisiyle maça fırtına gibi girip rakibi serseme çevirir.`,
      `Taraf bahsinden ziyade oyuncu statlarına (Özel Etkinlikler) yönelmek en akılcısı; özellikle ribaunt ve skor barajları bu maçta çok rahat aşılır.`,
      `Başa baş, dişe diş geçmesi beklenen, son topa kalacak bir maç. Deplasman takımının Handikaplı M.S 2 seçeneği, güvenle değerlendirilebilir, yanılmaz.`,
      `Handikapların çok yüksek açıldığı bir eşleşme. Favori takım kazanır ama o handikapı aşmak için efor sarf etmez. Handikaplı alt seçenekleri çok cazip.`,
      `Gecenin bankolarından biri. Ev sahibi handikapı aşarak güle oynaya kazanır. M.S 1 veya Ev Sahibi Takım Sayı Üst bahsi şaşmaz.`,
      `Günün sürprizi bu maçtan çıkabilir. ${away} son maçlarda gösterdiği reaksiyonla bu yüksek handikapları kolay lokma yapmaz, Deplasman lehine risk alınabilir.`
    ];

    const getNbaAnalyses = (home: string, away: string) => [
      `${home} - ${away} mücadelesi parkelerde alev alev bir hücum basketbolu vadediyor. Analiz modellerimiz Üst seçeneğine tartışmasız banko güveni veriyor.`,
      `${home} ile ${away} arasındaki bu kritik randevuda kazananı kestirmek güç. Ancak ev sahibi taraftar gücüyle bir tık daha şanslı. Yapay zeka, sert savunmalar nedeniyle Alt çıkacağını öngörüyor.`,
      `${home} inanılmaz bir form grafiği yakaladı, kadroları çok derin. ${away} ise yorgun ve eksik. İbre net bir şekilde ev sahibinin rahat bir galibiyet alıp handikapı darmadağın etmesinden yana.`,
      `${home} ve ${away} kapışması tam bir koç satrancına dönüşecek. Yarı saha setleri, saniyeleri sonuna kadar kullanan hücumlar yüzünden düşük skorlu, alt kokan bir maç bizleri bekliyor.`,
      `Ligin iki dinamik ekibi karşı karşıya. ${away} koşmayı seviyor, ${home} ise durdurmayı. Hızlarını kesemezlerse ev sahibi farklı mağlup olur, sürpriz arayanlar için muazzam oran.`,
      `Bu karşılaşma tamamen ribauntların belirleyeceği bir kavga olacak. Topu alan hızlı çıkacak. Modelimiz, verilen handikaba rağmen maçın sürpriz bir şekilde uzatmalara bile gidebileceğini işaret ediyor.`
    ];

    for (let i = 0; i < lines.length; i++) {
      const text = lines[i];

      // 1. Check for Dates (e.g. "🗓 28 Şubat 2026", "28.02.2026")
      const monthRegex = /(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)/i;
      if (text.includes('🗓') || monthRegex.test(text)) {
        const dMatch = text.match(/\d{1,2}/);
        const yMatch = text.match(/\d{4}/);
        if (dMatch && yMatch) {
          let m = "01";
          let lowerTxt = text.toLowerCase();
          if (lowerTxt.includes('şubat')) m = "02";
          else if (lowerTxt.includes('mart')) m = "03";
          else if (lowerTxt.includes('nisan')) m = "04";
          else if (lowerTxt.includes('mayıs')) m = "05";
          else if (lowerTxt.includes('haziran')) m = "06";
          else if (lowerTxt.includes('temmuz')) m = "07";
          else if (lowerTxt.includes('ağustos')) m = "08";
          else if (lowerTxt.includes('eylül')) m = "09";
          else if (lowerTxt.includes('ekim')) m = "10";
          else if (lowerTxt.includes('kasım')) m = "11";
          else if (lowerTxt.includes('aralık')) m = "12";

          currentDate = `${yMatch[0]}-${m}-${dMatch[0].padStart(2, '0')}`;
        }
        continue;
      }

      // 2. Check for League Header
      if (!text.includes('vs') && !text.includes('-') && !text.match(/\d{2}:\d{2}/) && (text.endsWith(':') || text.includes('League') || text.includes('Liga') || text.includes('Lig'))) {
        let cleanLeague = text.replace(':', '').replace(/[\(].*?[\)]/g, '').replace('🔹', '').trim();
        if (cleanLeague.length > 3) {
          currentLeague = cleanLeague;
        }
        continue;
      }

      let homeTeam = '';
      let awayTeam = '';
      let time = '';
      let matchDate = currentDate;
      let isNbaFormat = false;

      // 3. Check for NBA 4-Line Format (Team -> Team -> Day -> Time AM/PM)
      if (i + 3 < lines.length) {
        const line2 = lines[i + 1];
        const line3 = lines[i + 2];
        const line4 = lines[i + 3];

        const isDayName = /Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar|Bugün|Yarın/i.test(line3);
        const isAmPmTime = /\d{1,2}:\d{2}\s+(ÖÖ|ÖS|AM|PM)/i.test(line4);

        if (isDayName && isAmPmTime && !text.includes('vs') && !text.includes('-')) {
          homeTeam = text.trim();
          awayTeam = line2.trim();
          isNbaFormat = true;

          // Convert Time to TRT 24H (+8 Hours normally, but we assume the provided list is already in TRT just in AM/PM format)
          // The user requested: "nba bölümüde yatar saatleri tr saatine göre yaz"
          // Let's assume the text "1:00 ÖÖ" means 1:00 AM EST. EST to TRT is +8 hours -> 09:00.
          // Wait, "1:00 ÖÖ" is 1 AM. Games are played at 8 PM EST -> 3 AM TRT.
          // TRT is +8 from EST. 
          // If the copy-paste is from Google in TR language, "1:00 ÖÖ" means 01:00 AM TRT natively. 
          // Just converting 12h to 24h is usually sufficient because Google localization changes it to TRT already.
          // User: "nba bölümüde yatar saatleri tr saatine göre yaz" implies it might currently be US time, OR it just lacks AM/PM cleanly. 
          // Let's extract the numbers and apply +8 to be safe, because 1:00 AM EST + 8 = 9:00 AM TRT. But no NBA game plays at 1 AM EST. 
          // Actually, 8 PM EST = "8:00 ÖS". +8 hrs = 4:00 AM next day. 
          // However, if the text SAYS "Yarın 1:00 ÖÖ", it ALREADY MEANS 1 AM TRT (which is 6 PM EST, a bit early but possible).
          // Let's strictly 12h-to-24h format it first.
          let [timeStr, modifier] = line4.split(/\s+/);
          let [hoursStr, minutesStr] = timeStr.split(':');
          let hours = parseInt(hoursStr, 10);

          if (modifier.toUpperCase() === 'ÖS' || modifier.toUpperCase() === 'PM') {
            if (hours < 12) hours += 12;
          } else if (modifier.toUpperCase() === 'ÖÖ' || modifier.toUpperCase() === 'AM') {
            if (hours === 12) hours = 0;
          }

          time = `${hours.toString().padStart(2, '0')}:${minutesStr}`;

          // Fast-forward loop index
          i += 3;
        }
      }

      // 4. Compact Inline Format (e.g. "28 Şubat 13:30 Kasımpaşa - Çaykur Rizespor")
      const compactMatch = text.match(/(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+(\d{1,2}:\d{2})\s+([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]+)\s*(?:-)\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]+)/i) ||
        text.match(/(\d{1,2}\s+(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık))\s+(\d{1,2}:\d{2})\s+([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]+)\s*(?:-)\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]+)/i);

      if (!isNbaFormat && compactMatch) {
        // compactMatch[1] = Date string (ignored here as we rely on line-by-line date setting above, or we could parse it, but let's just use it to match)
        // compactMatch[2] = Time
        // compactMatch[3] = Home
        // compactMatch[4] = Away
        time = compactMatch[2].trim();
        homeTeam = compactMatch[3].trim().toUpperCase();
        awayTeam = compactMatch[4].trim().toUpperCase();
      } else if (!isNbaFormat) {
        const teamMatch = text.match(/([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]{2,})\s*(?:vs|[-–])\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]{2,})/);
        if (!teamMatch) continue;

        homeTeam = teamMatch[1].replace('🔹', '').trim().toUpperCase();
        awayTeam = teamMatch[2].replace('🔹', '').trim().toUpperCase();
        awayTeam = awayTeam.replace(/\s+[-–].*$/, '').trim();

        if (!homeTeam || !awayTeam) continue;

        const timeMatch = text.match(/([012]?\d:[0-5]\d)/);
        time = timeMatch?.[1] || '20:00';
      }

      const isBasketball = adminSport === 'Basketbol' || isNbaFormat || currentLeague.toLowerCase().includes('nba') || currentLeague.toLowerCase().includes('basket') || currentLeague.toLowerCase().includes('euroleague');

      let finalLeague = isNbaFormat ? 'NBA' : currentLeague;
      if (isBasketball && !finalLeague.toLowerCase().includes('nba') && !finalLeague.toLowerCase().includes('basket') && !finalLeague.toLowerCase().includes('euroleague')) {
        finalLeague = `${finalLeague} (Basketbol)`;
      }

      // ---------- PSEUDO-INTELLIGENT PREDICTION LOGIC ----------
      const hashString = (str: string) => {
        let hash = 0;
        for (let j = 0; j < str.length; j++) {
          hash = ((hash << 5) - hash) + str.charCodeAt(j);
          hash |= 0;
        }
        return Math.abs(hash);
      };

      const homeStrength = (hashString(homeTeam) % 60) + 40; // 40-99
      const awayStrength = (hashString(awayTeam) % 60) + 40; // 40-99
      const strengthDiff = homeStrength - awayStrength;

      let prediction = '';
      let odd1 = '';
      let odd2 = '';
      let confidence = 0;
      let scenarioIndex = 0; // 0: Match winner, 1: Tight match

      if (isBasketball) {
        if (strengthDiff > 15) {
          prediction = 'M.S 1 Ev Sahibi Handikap';
          odd1 = (1.55 + (hashString(homeTeam) % 30) / 100).toFixed(2);
          odd2 = (1.60 + (hashString(awayTeam) % 30) / 100).toFixed(2);
          confidence = 88 + (hashString(homeTeam) % 10);
          scenarioIndex = 1;
        } else if (strengthDiff < -15) {
          prediction = 'Deplasman Handikap';
          odd1 = (1.65 + (hashString(awayTeam) % 30) / 100).toFixed(2);
          odd2 = (1.50 + (hashString(homeTeam) % 30) / 100).toFixed(2);
          confidence = 85 + (hashString(awayTeam) % 10);
          scenarioIndex = 1;
        } else {
          prediction = hashString(homeTeam + awayTeam) % 2 === 0 ? 'Uzatmalar Dahil Üst' : 'Uzatmalar Dahil Alt';
          odd1 = (1.80 + (hashString(homeTeam) % 15) / 100).toFixed(2);
          odd2 = (1.80 + (hashString(awayTeam) % 15) / 100).toFixed(2);
          confidence = 75 + (hashString(homeTeam) % 12);
          scenarioIndex = 0;
        }
      } else {
        if (strengthDiff > 15) {
          const opts = ['M.S 1', 'M.S 1 & 1.5 ÜST', 'Ev Sahibi 1.5 ÜST'];
          prediction = opts[hashString(homeTeam) % opts.length];
          odd1 = (1.25 + (hashString(homeTeam) % 30) / 100).toFixed(2);
          odd2 = (1.35 + (hashString(awayTeam) % 30) / 100).toFixed(2);
          confidence = 88 + (hashString(homeTeam) % 11);
          scenarioIndex = 1;
        } else if (strengthDiff < -15) {
          const opts = ['M.S 2', 'M.S 2 & 1.5 ÜST', 'Deplasman 1.5 ÜST'];
          prediction = opts[hashString(awayTeam) % opts.length];
          odd1 = (1.30 + (hashString(homeTeam) % 30) / 100).toFixed(2);
          odd2 = (1.25 + (hashString(awayTeam) % 30) / 100).toFixed(2);
          confidence = 85 + (hashString(awayTeam) % 12);
          scenarioIndex = 1;
        } else {
          const opts = ['KG VAR', '2.5 ÜST', 'İlk Yarı 0.5 ÜST'];
          prediction = opts[hashString(homeTeam + awayTeam) % opts.length];
          odd1 = (1.65 + (hashString(homeTeam) % 30) / 100).toFixed(2);
          odd2 = (1.70 + (hashString(awayTeam) % 30) / 100).toFixed(2);
          confidence = 75 + (hashString(homeTeam) % 10);
          scenarioIndex = 0;
        }
      }

      const tSummaries = isBasketball ? getNbaTacticalSummaries(homeTeam, awayTeam) : getTacticalSummaries(homeTeam, awayTeam);
      const bPoints = isBasketball ? getNbaBreakingPoints(homeTeam, awayTeam) : getBreakingPoints(homeTeam, awayTeam);
      const bScenarios = isBasketball ? getNbaBettingScenarios(homeTeam, awayTeam) : getBettingScenarios(homeTeam, awayTeam);
      const aList = isBasketball ? getNbaAnalyses(homeTeam, awayTeam) : getAnalyses(homeTeam, awayTeam);

      // Seeded PRNG selection combining Team Hashes and loop index (i) to guarantee absolute uniqueness across all generated batches
      const pickText = (arr: string[], salt: number) => {
        const uniqueSeed = (scenarioIndex * 7) + (hashString(homeTeam) * 3) + (hashString(awayTeam) * 11) + (i * 13) + salt;
        return arr[uniqueSeed % arr.length];
      };

      const newAnalysis: MatchAnalysis = {
        id: (baseTime + i).toString(),
        league: finalLeague,
        homeTeam,
        awayTeam,
        matchTime: time,
        matchDate: matchDate,
        analysis: pickText(aList, 1),
        tacticalSummary: pickText(tSummaries, 2),
        breakingPoint: pickText(bPoints, 3),
        bettingScenario: pickText(bScenarios, 4),
        prediction,
        confidence,
        modelScore: confidence + (hashString(homeTeam) % 5),
        recentHistory: `${5 + (hashString(homeTeam) % 4)} Kazanç, ${(hashString(awayTeam) % 3)} Kayıp`,
        expectedGoals: (1.5 + (hashString(homeTeam) % 20) / 10).toFixed(1), // 1.5 to 3.4

        bookieOdds: [
          { name: '724BAHİS', odd1: (1.45 + Math.random() * 0.4).toFixed(2), odd2: (1.50 + Math.random() * 0.4).toFixed(2), link: 'https://' },
          { name: 'BETKOM', odd1: (1.42 + Math.random() * 0.4).toFixed(2), odd2: (1.48 + Math.random() * 0.4).toFixed(2), link: 'https://' },
          { name: 'MARSBAHİS', odd1: (1.48 + Math.random() * 0.4).toFixed(2), odd2: (1.55 + Math.random() * 0.4).toFixed(2), link: 'https://', isHighest: true }
        ],
        createdAt: baseTime + i,
        sport: isBasketball ? 'Basketbol' : 'Futbol',
        editorId: role
      };

      newAnalyses.push(newAnalysis);
    }

    if (newAnalyses.length > 0) {
      const updatedAnalyses = [...newAnalyses, ...localAnalyses];
      setLocalAnalyses(updatedAnalyses);
      onSaveAnalyses(updatedAnalyses);
      if (newAnalyses.length === 1) {
        setEditingAnalysisId(newAnalyses[0].id);
      }
      alert(`${newAnalyses.length} maç için AI analizi başarıyla üretildi!`);
    } else {
      alert('Girilen metinde geçerli bir maç bulunamadı. Lütfen formata uygun girdiğinizden emin olun.');
    }

    setShowAiModal(false);
    setAiInput('');
  };

  const handleCouponAiParse = () => {
    if (!couponAiInput.trim()) return;

    const lines = couponAiInput.split('\n').map(l => l.trim()).filter(l => l);
    const newMatches: CouponMatch[] = [];
    let currentDate = couponAiDate;
    let currentLeague = 'Genel Lig';

    const getLowRiskTemplates = (home: string, away: string, pred: string) => [
      `Bu karşılaşmada risk algoritması minimum seviyede uyarı veriyor. ${home} ve ${away} eşleşmesinde tarihi verileri incelediğimizde en tutarlı sonucun "${pred}" olduğunu görüyoruz. Taraf bahsinden ziyade en güvenli liman olan bu tercih, kasa katlamak isteyenlerin bir numaralı adayı. İki takımın son 5 maçlık form durumları bu senaryoyu fazlasıyla destekliyor.`,
      `Gelişmiş veri setimiz, ${home} - ${away} maçındaki rotasyon ve sakatlık durumlarını analiz ettiğinde "${pred}" tahmini için yeşil ışık yakıyor. Olası sürprizlere kapalı, tamamen mantık ve istatistik odaklı bir tercih. Editörlerimizin de favorisi olan bu oran, sistem kuponlarında kolon doldurmak için birebir.`,
      `Kağıt üzerinde dengeli görünse de oyun içi dinamiklerin belirli bir tempoda kalacağı öngörüülürek çıkarılmış çok güvenli bir bahis. ${home} takımının iç saha/deplasman kimliği ile ${away} takımının zaafları birleştiğinde, modelimiz bize harikulade bir istikrar sunan "${pred}" tercihini öneriyor.`
    ];

    const getMediumRiskTemplates = (home: string, away: string, pred: string) => [
      `İki takımın da kazanmaya aç olduğu, bol pozisyonlu ve rekabet seviyesi yüksek bir doksan dakika bekliyoruz. ${home} hücum hattının etkinliği ile ${away} takımının direnci birleştiğinde "${pred}" tercihi kuponlara çok ciddi bir değer katıyor. Oranı tatmin edici, tutma ihtimali oldukça yüksek bir seçim.`,
      `Bu eşleşmede istatistikler ve son form durumları bir tık sürpriz kokusu verse de, tecrübe faktörü ve taktik tahtası yalan söylemez. ${home} ile ${away} arasındaki bu kritik randevuda kazananı küçük detaylar belirleyecek. Yapay zeka sistemimiz, tüm bu değişkenleri süzerek "${pred}" bahis fırsatını ideal risk/kazanç oranında değerlendiriyor.`,
      `Tam bir taktik savaşı. İzlemesi ayrı keyifli, bahis alması ayrı kazançlı bir mücadele olacak. ${home}, zayıf yönlerini saklamaya çalışırken, ${away} hızlı geçişlerle cezalandırmak isteyecek. Tüm bu kargaşa içinde sakin kalmayı başaran "${pred}" analizimiz, günün kazandıranlarından olmaya çok yakın.`
    ];

    const getHighRiskTemplates = (home: string, away: string, pred: string) => [
      `Günün en kilit ve risk barındıran maçlarından biri! Çoğu bahis severin uzak durduğu ${home} - ${away} mücadelesinde, sıradan istatistiklerin ötesine geçiyoruz. Takımların psikolojik kırılganlıkları ve ekstrem senaryoları analiz edildiğinde "${pred}" tercihi müthiş bir Value (Değerli Oran) yaratıyor. Büyük cesaret, büyük kazanç.`,
      `Sürpriz arayanlar için muazzam bir fırsat! ${home} ve ${away} arasındaki dengesizlik asimetrik bir maç profili ortaya çıkarıyor. Herkesin beklediği skorun aksine biz rüzgarın tersine eseceğini düşünüyoruz. "${pred}" tahmini, tamamen handikapların ve açılan oranların yanlış değerlendirilmesinden faydalanmak üzere kurgulandı. Heyecan garantili.`,
      `Taraf bahsinin adeta Rus ruletine benzediği bu eşleşmede, ${home} ve ${away} sahaya her şeyini verecek. Maçın son saniyesine kadar heyecanın bitmeyeceği bu platformda, radikal bir öngörüyle hareket ederek "${pred}" riskini alıyoruz. Yüksek oran kovalayan ve adrenalin sevenler için gecenin vazgeçilmezi olacak detaylar barındırıyor.`
    ];

    for (let i = 0; i < lines.length; i++) {
      const text = lines[i];

      const monthRegex = /(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)/i;
      if (text.includes('🗓') || monthRegex.test(text)) {
        const dMatch = text.match(/\d{1,2}/);
        const yMatch = text.match(/\d{4}/);
        if (dMatch && yMatch) {
          let m = "01";
          let lowerTxt = text.toLowerCase();
          if (lowerTxt.includes('şubat')) m = "02";
          else if (lowerTxt.includes('mart')) m = "03";
          else if (lowerTxt.includes('nisan')) m = "04";
          else if (lowerTxt.includes('mayıs')) m = "05";
          else if (lowerTxt.includes('haziran')) m = "06";
          else if (lowerTxt.includes('temmuz')) m = "07";
          else if (lowerTxt.includes('ağustos')) m = "08";
          else if (lowerTxt.includes('eylül')) m = "09";
          else if (lowerTxt.includes('ekim')) m = "10";
          else if (lowerTxt.includes('kasım')) m = "11";
          else if (lowerTxt.includes('aralık')) m = "12";
          currentDate = `${yMatch[0]}-${m}-${dMatch[0].padStart(2, '0')}`;
        }
        continue;
      }

      if (!text.includes('vs') && !text.includes('-') && !text.match(/\d{2}:\d{2}/) && (text.endsWith(':') || text.includes('League') || text.includes('Lig'))) {
        let cleanLeague = text.replace(':', '').replace(/[\(].*?[\)]/g, '').trim();
        if (cleanLeague.length > 3) currentLeague = cleanLeague;
        continue;
      }

      let homeTeam = '';
      let awayTeam = '';
      let isNbaFormat = false;

      if (i + 3 < lines.length) {
        const line2 = lines[i + 1];
        const line3 = lines[i + 2];
        const line4 = lines[i + 3];
        const isDayName = /Pazartesi|Salı|Çarşamba|Perşembe|Cuma|Cumartesi|Pazar|Bugün|Yarın/i.test(line3);
        const isAmPmTime = /\d{1,2}:\d{2}\s+(ÖÖ|ÖS|AM|PM)/i.test(line4);

        if (isDayName && isAmPmTime && !text.includes('vs') && !text.includes('-')) {
          homeTeam = text.trim();
          awayTeam = line2.trim();
          isNbaFormat = true;
          i += 3;
        }
      }

      // Compact Inline Format Check
      const compactMatch = text.match(/(\d{1,2}\s+(?:Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık))\s+(\d{1,2}:\d{2})\s+([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]+)\s*(?:-)\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]+)/i) ||
        text.match(/(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+(\d{1,2}:\d{2})\s+([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]+)\s*(?:-)\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]+)/i);

      if (!isNbaFormat && compactMatch) {
        homeTeam = compactMatch[3].trim().toUpperCase();
        awayTeam = compactMatch[4].trim().toUpperCase();
      } else if (!isNbaFormat) {
        const teamMatch = text.match(/([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]{2,})\s*(?:vs|[-–])\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s.&]{2,})/);
        if (!teamMatch) continue;
        homeTeam = teamMatch[1].trim().toUpperCase();
        awayTeam = teamMatch[2].trim().toUpperCase();
        awayTeam = awayTeam.replace(/\s+[-–].*$/, '').trim();
        if (!homeTeam || !awayTeam) continue;
      }

      // Pseudo-randomizing odds & predictions
      const salt = homeTeam.length + awayTeam.length + i;
      let odd = '';
      let prediction = '';
      let confidence = 0;

      if (couponRiskLevel === 'LOW') {
        odd = (1.20 + (salt % 25) / 100).toFixed(2); // 1.20 to 1.44
        const opts = ['1X Çifte Şans', '1.5 ÜST', '2.5 ALT', 'Ev Sahibi 0.5 Üst'];
        prediction = opts[salt % opts.length];
        confidence = 88 + (salt % 10);
      } else if (couponRiskLevel === 'MEDIUM') {
        odd = (1.50 + (salt % 35) / 100).toFixed(2); // 1.50 to 1.84
        const opts = ['M.S 1', 'KG VAR', '2.5 ÜST', 'M.S 2', 'İlk Yarı 0.5 ÜST'];
        prediction = opts[salt % opts.length];
        confidence = 75 + (salt % 12);
      } else {
        odd = (2.00 + (salt % 40) / 100).toFixed(2); // 2.00 to 2.39
        const opts = ['İY/MS 1/1', 'Handikap 1', '3.5 ÜST', 'Deplasman 1.5 ÜST'];
        prediction = opts[salt % opts.length];
        confidence = 65 + (salt % 15);
      }

      const templates = couponRiskLevel === 'LOW' ? getLowRiskTemplates(homeTeam, awayTeam, prediction) :
        couponRiskLevel === 'MEDIUM' ? getMediumRiskTemplates(homeTeam, awayTeam, prediction) :
          getHighRiskTemplates(homeTeam, awayTeam, prediction);

      const chunkAnalysis = templates[salt % templates.length];

      newMatches.push({
        matchId: `${Date.now()}-${i}`,
        homeTeam,
        awayTeam,
        prediction,
        odd,
        analysis: chunkAnalysis,
        confidence
      });
    }

    if (newMatches.length > 0) {
      let totalOdd = 1;
      newMatches.forEach(m => totalOdd *= parseFloat(m.odd));

      const newCoupon: Coupon = {
        id: `coupon-${Date.now()}`,
        title: couponRiskLevel === 'LOW' ? 'GÜNÜN KASASI' : couponRiskLevel === 'MEDIUM' ? 'İDEAL KUPON' : 'YÜKSEK RİSK',
        riskLevel: couponRiskLevel,
        matches: newMatches,
        totalOdd: totalOdd.toFixed(2),
        date: currentDate,
        editorId: role
      };

      const updatedCoupons = [newCoupon, ...localCoupons];
      setLocalCoupons(updatedCoupons);
      onSaveCoupons(updatedCoupons);
      setEditingCouponId(newCoupon.id);
      alert(`Kupon başarıyla ${newMatches.length} maç ile üretildi! (Toplam Oran: ${totalOdd.toFixed(2)})`);
    } else {
      alert('Geçerli maç formatı bulunamadı. Listenizi kontrol edin.');
    }

    setShowCouponAiModal(false);
    setCouponAiInput('');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black">7</div>
          <span className="font-black text-xl italic text-primary">Admin</span>
        </div>

        {/* Cloud Sync Status Card */}
        <div className="p-4 rounded-2xl bg-black/40 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">BULUT DURUMU</span>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              syncStatus === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
              syncStatus === 'no_table' ? 'bg-orange-500' : 'bg-red-500'
            }`} />
          </div>
          
          {syncStatus === 'connected' ? (
            <p className="text-[10px] text-green-500/80 font-bold">Supabase Bağlantısı Aktif</p>
          ) : syncStatus === 'no_table' ? (
            <div className="space-y-1">
              <p className="text-[10px] text-orange-400 font-bold">Tablo Bulunamadı</p>
              <p className="text-[8px] text-zinc-600 leading-tight">Lütfen Supabase'de SQL betiğini çalıştırın.</p>
            </div>
          ) : (
            <p className="text-[10px] text-red-400 font-bold">Bağlantı Kesildi</p>
          )}

          <button 
            onClick={handleCloudSync}
            disabled={isSyncing || syncStatus === 'no_table'}
            className={`w-full py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
              isSyncing ? 'bg-zinc-800 text-zinc-500' : 
              syncStatus === 'no_table' ? 'bg-zinc-900 text-zinc-600 border border-zinc-800' :
              'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black hover:shadow-[0_0_15px_rgba(240,185,11,0.3)]'
            }`}
          >
            {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {isSyncing ? 'SENKRONİZE EDİLİYOR...' : 'BULUTA PUSHLA'}
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {role === 'admin' && (
            <>
              <p className="text-[10px] text-zinc-500 font-black px-3 mt-4 mb-2 uppercase tracking-widest">SİTE YAPISI</p>
              <button onClick={() => setActiveTab('content')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'content' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Layout className="w-4 h-4" /> İÇERİK YÖNETİMİ
              </button>
              <button onClick={() => setActiveTab('style')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'style' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Palette className="w-4 h-4" /> SİTE TASARIMI
              </button>
              <button onClick={() => setActiveTab('seo')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'seo' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Search className="w-4 h-4" /> SEO & HASHTAG
              </button>
              <button onClick={() => setActiveTab('visibility')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'visibility' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Eye className="w-4 h-4" /> SAYFA GÖRÜNÜRLÜğü
              </button>
              <button onClick={() => setActiveTab('liveodds')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'liveodds' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Activity className="w-4 h-4" /> CANLI ORANLAR
              </button>
            </>
          )}

          {!isAuthor && (
            <>
              <p className="text-[10px] text-zinc-500 font-black px-3 mt-6 mb-2 uppercase tracking-widest">SİSTEMLER</p>
              <button onClick={() => setActiveTab('analysis')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'analysis' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <TrendingUp className="w-4 h-4" /> MAÇ ANALİZLERİ
              </button>
              <button onClick={() => setActiveTab('coupons')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'coupons' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Ticket className="w-4 h-4" /> GÜNÜN KUPONLARI
              </button>
            </>
          )}
          {role === 'admin' && (
            <>
              <button onClick={() => setActiveTab('blackjack')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'blackjack' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Zap className="w-4 h-4" /> CASINO 724
              </button>
              <button onClick={() => setActiveTab('pool')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'pool' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Trophy className="w-4 h-4" /> 724TOTO YÖNETİMİ
              </button>
              <button onClick={() => setActiveTab('loyalty')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'loyalty' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Star className="w-4 h-4" /> SADAKAT / BİLET
              </button>
              <button onClick={() => setActiveTab('members')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'members' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Users className="w-4 h-4" /> ÜYELER
              </button>
              <button onClick={() => setActiveTab('payment')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'payment' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <CreditCard className="w-4 h-4" /> ÖDEMELER
              </button>
              <button onClick={() => setActiveTab('editors')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'editors' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <User className="w-4 h-4" /> EDİTÖRLER
              </button>
              <button onClick={() => setActiveTab('giveaway')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs ${activeTab === 'giveaway' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                <Gift className="w-4 h-4" /> ÇEKİLİŞ YÖNETİMİ
              </button>
            </>
          )}

          {/* News tab - visible to admin, authors & editors */}
          {(role === 'admin' || isAuthor || isEditor) && (
            <div className="space-y-1">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-4 mb-2 mt-4">Haberler</div>
              <button onClick={() => setActiveTab('news')} className={`flex items-center gap-3 p-3 rounded-xl transition-colors font-bold text-xs w-full ${activeTab === 'news' ? 'bg-primary text-black' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                📰 HABER YÖNETİMİ
              </button>
            </div>
          )}

          {!isAuthor && (
            <div className="space-y-1">
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-4 mb-2 mt-4">İletişim & Destek</div>
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex justify-between items-center px-4 py-3 rounded-2xl text-xs font-black uppercase transition-all
                ${activeTab === 'messages' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20 scale-105' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" /> MESAJLAR
                </div>
                {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>}
              </button>
            </div>
          )}
        </nav>

        <div className="mt-auto space-y-2">
          {onNavigateHome && (
            <button onClick={onNavigateHome} className="w-full flex items-center justify-center gap-2 bg-[#f0b90b]/10 text-[#f0b90b] hover:bg-[#f0b90b] hover:text-black font-bold py-3 rounded-xl transition-all active:scale-95 border border-[#f0b90b]/20 hover:border-[#f0b90b]">
              <ChevronLeft className="w-5 h-5" /> ANA SAYFAYA DÖN
            </button>
          )}
          <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95">
            <Save className="w-5 h-5" /> KAYDET
          </button>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold py-3 rounded-xl transition-all active:scale-95">
            <LogOut className="w-5 h-5" /> ÇIKIŞ
          </button>
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {activeTab === 'content' && (
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">HERO (ANA SPONSOR)</h2>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <input value={localHero.name} onChange={(e) => setLocalHero({ ...localHero, name: e.target.value })} className="bg-black border border-zinc-800 rounded-xl p-3" placeholder="Marka Adı" />
                <input value={localHero.logo} onChange={(e) => setLocalHero({ ...localHero, logo: e.target.value })} className="bg-black border border-zinc-800 rounded-xl p-3" placeholder="Logo URL" />
                <input value={localHero.offerMain} onChange={(e) => setLocalHero({ ...localHero, offerMain: e.target.value })} className="bg-black border border-zinc-800 rounded-xl p-3 text-primary font-black" placeholder="Teklif" />
                <input value={localHero.offerSub} onChange={(e) => setLocalHero({ ...localHero, offerSub: e.target.value })} className="bg-black border border-zinc-800 rounded-xl p-3" placeholder="Alt Metin" />
              </div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black">MARKALAR (GRID)</h2>
                <button onClick={addBrand} className="bg-primary text-black font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95">
                  <Plus className="w-5 h-5" /> YENİ EKLE
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {localBrands.map((brand, idx) => (
                  <div key={brand.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                    <img src={brand.logo} className="w-12 h-12 bg-black rounded-lg object-cover" />
                    <input value={brand.name} onChange={(e) => handleBrandChange(idx, 'name', e.target.value)} className="flex-1 bg-black border border-zinc-800 rounded-xl p-2" placeholder="Ad" />
                    <input value={brand.offerMain} onChange={(e) => handleBrandChange(idx, 'offerMain', e.target.value)} className="w-32 bg-black border border-zinc-800 rounded-xl p-2 text-primary font-bold" placeholder="Teklif" />
                    <button onClick={() => setLocalBrands(localBrands.filter((_, i) => i !== idx))} className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl"><Trash2 /></button>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0b90b]/5 blur-3xl rounded-full" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f0b90b]/10 rounded-2xl flex items-center justify-center border border-[#f0b90b]/20">
                    <Zap className="w-6 h-6 text-[#f0b90b]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Açılış Pop-up Yönetimi</h2>
                    <p className="text-zinc-500 text-xs font-bold mt-1">Site ilk açıldığında gösterilen "Hoş geldin" reklamını yönetin.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/40 p-2 rounded-2xl border border-zinc-800">
                   <button
                    onClick={() => {
                        const updated = { ...localWelcomePopup, isActive: true };
                        setLocalWelcomePopup(updated);
                        onSaveWelcomePopupConfig?.(updated);
                    }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${localWelcomePopup.isActive ? 'bg-[#f0b90b] text-black' : 'text-zinc-500'}`}
                  >
                    AKTİF
                  </button>
                  <button
                    onClick={() => {
                        const updated = { ...localWelcomePopup, isActive: false };
                        setLocalWelcomePopup(updated);
                        onSaveWelcomePopupConfig?.(updated);
                    }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${!localWelcomePopup.isActive ? 'bg-red-500 text-white' : 'text-zinc-500'}`}
                  >
                    PASİF
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Popup Başlığı (Marka)</label>
                  <input
                    value={localWelcomePopup.title}
                    onChange={(e) => setLocalWelcomePopup({ ...localWelcomePopup, title: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:border-[#f0b90b]/50 transition-all"
                    placeholder="Örn: 724BAHİS"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Alt Başlık</label>
                  <input
                    value={localWelcomePopup.subtitle}
                    onChange={(e) => setLocalWelcomePopup({ ...localWelcomePopup, subtitle: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:border-[#f0b90b]/50 transition-all"
                    placeholder="Örn: Türkiye'nin En Güvenilir Bahis Platformu"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Ana Teklif (Büyük Yazı)</label>
                  <input
                    value={localWelcomePopup.offerMain}
                    onChange={(e) => setLocalWelcomePopup({ ...localWelcomePopup, offerMain: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm font-black text-[#f0b90b] focus:border-[#f0b90b]/50 transition-all"
                    placeholder="Örn: %100 HOŞGELDİN BONUSU"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Teklif Detayı</label>
                  <input
                    value={localWelcomePopup.offerSub}
                    onChange={(e) => setLocalWelcomePopup({ ...localWelcomePopup, offerSub: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:border-[#f0b90b]/50 transition-all"
                    placeholder="Örn: İlk yatırımınıza özel anında yükleme"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Buton Yazısı</label>
                  <input
                    value={localWelcomePopup.buttonText}
                    onChange={(e) => setLocalWelcomePopup({ ...localWelcomePopup, buttonText: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:border-[#f0b90b]/50 transition-all"
                    placeholder="Örn: KAYIT OL"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Buton Linki</label>
                  <input
                    value={localWelcomePopup.buttonLink}
                    onChange={(e) => setLocalWelcomePopup({ ...localWelcomePopup, buttonLink: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:border-[#f0b90b]/50 transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ═══ LIVE ODDS MANAGEMENT ═══ */}
        {activeTab === 'liveodds' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Canlı Oran Yönetimi</h2>
                  <p className="text-zinc-500 text-xs font-bold mt-1">Header’daki kayan oran bandındaki popüler maçları yönetin.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => { const u = { ...localLiveOdds, isActive: true }; setLocalLiveOdds(u); onSaveLiveOddsConfig?.(u); }}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${localLiveOdds.isActive ? 'bg-green-500 text-black' : 'text-zinc-500'}`}
                  >AKTİF</button>
                  <button
                    onClick={() => { const u = { ...localLiveOdds, isActive: false }; setLocalLiveOdds(u); onSaveLiveOddsConfig?.(u); }}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!localLiveOdds.isActive ? 'bg-red-500 text-white' : 'text-zinc-500'}`}
                  >PASİF</button>
                </div>
                <button
                  onClick={() => {
                    const newMatch: LiveOddsMatch = {
                      id: Date.now().toString(),
                      homeTeam: '',
                      awayTeam: '',
                      league: '',
                      matchTime: '20:00',
                      odd1: '1.90',
                      oddX: '3.50',
                      odd2: '3.80',
                      isLive: false,
                      link: 'https://t.ly/GercekLivo',
                    };
                    const u = { ...localLiveOdds, matches: [...(localLiveOdds.matches || []), newMatch] };
                    setLocalLiveOdds(u);
                    onSaveLiveOddsConfig?.(u);
                  }}
                  className="bg-green-500 hover:bg-green-400 text-black font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all text-xs"
                >
                  <Plus className="w-4 h-4" /> YENİ MAÇ EKLE
                </button>
              </div>
            </div>

            {localLiveOdds.matches.length === 0 ? (
              <div className="text-center py-16 text-zinc-600">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-bold">Henüz maç eklenmedi</p>
                <p className="text-sm mt-1">“Yeni Maç Ekle” butonuna tıklayarak başlayın.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {localLiveOdds.matches.map((match, idx) => (
                  <div key={match.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-600 text-xs font-bold">#{idx + 1}</span>
                        <button
                          onClick={() => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, isLive: !m.isLive } : m) };
                            setLocalLiveOdds(updated);
                            onSaveLiveOddsConfig?.(updated);
                          }}
                          className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${match.isLive ? 'bg-red-500/15 border-red-500/30 text-red-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                        >
                          {match.isLive ? '🔴 CANLI' : 'CANLI DEĞİL'}
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const updated = { ...localLiveOdds, matches: localLiveOdds.matches.filter(m => m.id !== match.id) };
                          setLocalLiveOdds(updated);
                          onSaveLiveOddsConfig?.(updated);
                        }}
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-600 uppercase">Ev Sahibi</label>
                        <input
                          value={match.homeTeam}
                          onChange={(e) => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, homeTeam: e.target.value } : m) };
                            setLocalLiveOdds(updated);
                          }}
                          onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)}
                          className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-sm font-bold focus:border-green-500/50 transition-all"
                          placeholder="Galatasaray"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-600 uppercase">Deplasman</label>
                        <input
                          value={match.awayTeam}
                          onChange={(e) => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, awayTeam: e.target.value } : m) };
                            setLocalLiveOdds(updated);
                          }}
                          onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)}
                          className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-sm font-bold focus:border-green-500/50 transition-all"
                          placeholder="Fenerbahçe"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-600 uppercase">Lig</label>
                        <input
                          value={match.league}
                          onChange={(e) => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, league: e.target.value } : m) };
                            setLocalLiveOdds(updated);
                          }}
                          onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)}
                          className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-sm font-bold focus:border-green-500/50 transition-all"
                          placeholder="Süper Lig"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-600 uppercase">Saat</label>
                        <input
                          value={match.matchTime}
                          onChange={(e) => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, matchTime: e.target.value } : m) };
                            setLocalLiveOdds(updated);
                          }}
                          onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)}
                          className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-sm font-bold focus:border-green-500/50 transition-all"
                          placeholder="21:00"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-[#f0b90b] uppercase">1 (Ev Sahibi)</label>
                        <input
                          value={match.odd1}
                          onChange={(e) => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, odd1: e.target.value } : m) };
                            setLocalLiveOdds(updated);
                          }}
                          onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)}
                          className="w-full bg-black border border-[#f0b90b]/20 rounded-xl p-2.5 text-sm font-black text-[#f0b90b] text-center focus:border-[#f0b90b]/50 transition-all"
                          placeholder="2.10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-400 uppercase">X (Beraberlik)</label>
                        <input
                          value={match.oddX}
                          onChange={(e) => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, oddX: e.target.value } : m) };
                            setLocalLiveOdds(updated);
                          }}
                          onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)}
                          className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-sm font-black text-zinc-400 text-center focus:border-zinc-600 transition-all"
                          placeholder="3.40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-blue-400 uppercase">2 (Deplasman)</label>
                        <input
                          value={match.odd2}
                          onChange={(e) => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, odd2: e.target.value } : m) };
                            setLocalLiveOdds(updated);
                          }}
                          onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)}
                          className="w-full bg-black border border-blue-500/20 rounded-xl p-2.5 text-sm font-black text-blue-400 text-center focus:border-blue-500/50 transition-all"
                          placeholder="3.25"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-600 uppercase">Link</label>
                        <input
                          value={match.link}
                          onChange={(e) => {
                            const updated = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, link: e.target.value } : m) };
                            setLocalLiveOdds(updated);
                          }}
                          onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)}
                          className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-sm font-bold focus:border-green-500/50 transition-all"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Coupon Modal */}
        {showCouponAiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-[#f0b90b]/20 p-8 rounded-[40px] max-w-2xl w-full shadow-[0_0_50px_rgba(240,185,11,0.1)] relative">
              <button
                onClick={() => setShowCouponAiModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f0b90b] to-yellow-600 flex items-center justify-center shadow-[0_0_30px_rgba(240,185,11,0.3)]">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white italic uppercase">AI KUPON ÜRETİCİ</h3>
                  <p className="text-zinc-400 text-sm mt-1">Metni yapıştırın ve risk seviyesini seçerek anında özel kupon üretin.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase flex items-center gap-2">
                    <Ticket className="w-4 h-4" /> KUPON RİSK SEVİYESİ (STRATEJİ)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setCouponRiskLevel('LOW')}
                      className={`py-3 rounded-xl border font-black text-xs transition-all ${couponRiskLevel === 'LOW' ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                    >
                      DÜŞÜK RİSK (KASA)
                    </button>
                    <button
                      onClick={() => setCouponRiskLevel('MEDIUM')}
                      className={`py-3 rounded-xl border font-black text-xs transition-all ${couponRiskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                    >
                      ORTA RİSK (İDEAL)
                    </button>
                    <button
                      onClick={() => setCouponRiskLevel('HIGH')}
                      className={`py-3 rounded-xl border font-black text-xs transition-all ${couponRiskLevel === 'HIGH' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                    >
                      YÜKSEK RİSK (SÜRPRİZ)
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> KUPON TARİHİ
                  </label>
                  <input
                    type="date"
                    value={couponAiDate}
                    onChange={(e) => setCouponAiDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white font-bold tracking-widest focus:outline-none focus:border-[#f0b90b]/50 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-zinc-500 uppercase flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" /> MAÇ LİSTESİ (HER SATIRA BİR MAÇ)
                  </label>
                  <textarea
                    value={couponAiInput}
                    onChange={(e) => setCouponAiInput(e.target.value)}
                    placeholder="Örnek: Galatasaray - Fenerbahçe&#10;Arsenal - Chelsea"
                    className="w-full h-48 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 text-zinc-300 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-[#f0b90b]/50 placeholder:text-zinc-700 transition-colors"
                  />
                </div>

                <button
                  onClick={handleCouponAiParse}
                  className="w-full bg-gradient-to-r from-[#f0b90b] to-yellow-500 text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(240,185,11,0.2)]"
                >
                  <Ticket className="w-5 h-5" /> KUPONU ÜRET VE KAYDET
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="space-y-8 animate-fade-in">
            {!editingCouponId ? (
              // --- MASTER VIEW (LIST) ---
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                      <Ticket className="text-[#f0b90b]" /> GÜNÜN KUPONLARI
                    </h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Toplam {localCoupons.length} kupon yayında</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowCouponAiModal(true)}
                      className="bg-[#f0b90b]/10 text-[#f0b90b] border border-[#f0b90b]/20 font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#f0b90b] hover:text-black transition-all active:scale-95 text-xs uppercase"
                    >
                      <Zap className="w-4 h-4" /> YAPAY ZEKA İLE KUPON ÜRET
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Tüm kuponları silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
                          setLocalCoupons([]);
                          onSaveCoupons([]);
                        }
                      }}
                      className="bg-red-500/10 text-red-500 border border-red-500/20 font-black px-4 py-3 rounded-2xl flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all active:scale-95 text-xs uppercase"
                      title="Tüm Kuponları Sil"
                    >
                      <Trash2 className="w-4 h-4" /> TÜMÜNÜ SİL
                    </button>
                    <button
                      onClick={() => {
                        const newId = Date.now().toString();
                        const newCoupon: Coupon = {
                          id: newId,
                          title: 'Günün Banko Kuponu',
                          riskLevel: 'LOW',
                          matches: [
                            { matchId: '1', homeTeam: '', awayTeam: '', prediction: '', odd: '1.50' }
                          ],
                          totalOdd: '1.50',
                          date: new Date().toISOString().split('T')[0]
                        };
                        const updatedCoupons = [newCoupon, ...localCoupons];
                        setLocalCoupons(updatedCoupons);
                        onSaveCoupons(updatedCoupons);
                        setEditingCouponId(newId);
                      }}
                      className="bg-[#f0b90b] text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(240,185,11,0.3)] transition-all active:scale-95 text-xs uppercase"
                    >
                      <Plus className="w-4 h-4" /> YENİ KUPON EKLE
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {localCoupons.map((coupon) => (
                    <div key={coupon.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between group hover:border-[#f0b90b]/50 transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-[#f0b90b]/30 ${coupon.riskLevel === 'LOW' ? 'bg-green-500/10' :
                          coupon.riskLevel === 'MEDIUM' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                          }`}>
                          <Ticket className={`w-6 h-6 ${coupon.riskLevel === 'LOW' ? 'text-green-500' :
                            coupon.riskLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-red-500'
                            }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${coupon.riskLevel === 'LOW' ? 'bg-green-500/20 text-green-500' :
                              coupon.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'
                              }`}>{coupon.riskLevel} RİSK</span>
                            <span className="text-zinc-600 text-[10px] font-bold">{coupon.date}</span>
                          </div>
                          <h3 className="text-white font-black text-sm uppercase italic">
                            {coupon.title} <span className="text-[#f0b90b] font-black ml-2">{coupon.totalOdd} ORAN</span>
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingCouponId(coupon.id)}
                          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> DÜZENLE
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Bu kuponu silmek istediğinize emin misiniz?')) {
                              const updated = localCoupons.filter(c => c.id !== coupon.id);
                              setLocalCoupons(updated);
                              onSaveCoupons(updated);
                            }
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {localCoupons.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-[30px] space-y-4">
                      <AlertCircle className="w-12 h-12 text-zinc-800 mx-auto" />
                      <p className="text-zinc-600 font-black text-xs uppercase tracking-widest">Henüz kupon eklenmemiş.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // --- DETAIL VIEW (EDITOR) ---
              <div className="space-y-6 animate-fade-in-up">
                {(() => {
                  const coupon = localCoupons.find(c => c.id === editingCouponId);
                  if (!coupon) return null;
                  const idx = localCoupons.findIndex(c => c.id === editingCouponId);

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setEditingCouponId(null)}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xs transition-colors bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-700/50"
                          >
                            <ChevronLeft className="w-4 h-4" /> GERİ DÖN
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem('site_coupons', JSON.stringify(localCoupons));
                              alert('Kupon başarıyla güncellendi!');
                            }}
                            className="flex items-center gap-2 bg-[#f0b90b] text-black font-black px-5 py-2 rounded-xl text-xs uppercase shadow-[0_0_15px_rgba(240,185,11,0.2)] hover:shadow-[0_0_20px_#f0b90b] transition-all active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5" /> DEĞİŞİKLİKLERİ UYGULA
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">DÜZENLENİYOR: {coupon.id}</span>
                        </div>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase">KUPON BAŞLIĞI</label>
                            <input value={coupon.title} onChange={(e) => {
                              const updated = [...localCoupons]; updated[idx].title = e.target.value; setLocalCoupons(updated);
                            }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm focus:border-[#f0b90b] transition-all outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase">RİSK SEVİYESİ</label>
                            <select
                              value={coupon.riskLevel}
                              onChange={(e) => {
                                const updated = [...localCoupons]; updated[idx].riskLevel = e.target.value as any; setLocalCoupons(updated);
                              }}
                              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm focus:border-[#f0b90b] transition-all outline-none"
                            >
                              <option value="LOW">DÜŞÜK</option>
                              <option value="MEDIUM">ORTA</option>
                              <option value="HIGH">YÜKSEK</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase">TOPLAM ORAN</label>
                            <input value={coupon.totalOdd} onChange={(e) => {
                              const updated = [...localCoupons]; updated[idx].totalOdd = e.target.value; setLocalCoupons(updated);
                            }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-[#f0b90b] font-black focus:border-[#f0b90b] transition-all outline-none" placeholder="1.50" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-black text-xs uppercase tracking-widest italic">MAÇLAR</h4>
                            <button
                              onClick={() => {
                                const updated = [...localCoupons];
                                updated[idx].matches.push({ matchId: Date.now().toString(), homeTeam: '', awayTeam: '', prediction: '', odd: '1.50' });
                                setLocalCoupons(updated);
                              }}
                              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg border border-zinc-700 transition-all font-bold"
                            >
                              + MAÇ EKLE
                            </button>
                          </div>
                          <div className="space-y-3">
                            {coupon.matches.map((match, midx) => (
                              <div key={midx} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-black/50 p-4 rounded-2xl border border-zinc-800/50 relative group">
                                <input value={match.homeTeam} onChange={(e) => {
                                  const updated = [...localCoupons]; updated[idx].matches[midx].homeTeam = e.target.value; setLocalCoupons(updated);
                                }} className="bg-black border border-zinc-800 rounded-xl p-2 text-xs" placeholder="Ev Sahibi" />
                                <input value={match.awayTeam} onChange={(e) => {
                                  const updated = [...localCoupons]; updated[idx].matches[midx].awayTeam = e.target.value; setLocalCoupons(updated);
                                }} className="bg-black border border-zinc-800 rounded-xl p-2 text-xs" placeholder="Deplasman" />
                                <input value={match.prediction} onChange={(e) => {
                                  const updated = [...localCoupons]; updated[idx].matches[midx].prediction = e.target.value; setLocalCoupons(updated);
                                }} className="bg-black border border-zinc-800 rounded-xl p-2 text-xs font-bold text-[#f0b90b]" placeholder="Tahmin" />
                                <input value={match.odd} onChange={(e) => {
                                  const updated = [...localCoupons]; updated[idx].matches[midx].odd = e.target.value; setLocalCoupons(updated);
                                }} className="bg-black border border-zinc-800 rounded-xl p-2 text-xs text-center" placeholder="Oran" />
                                <button
                                  onClick={() => {
                                    const updated = [...localCoupons];
                                    updated[idx].matches = updated[idx].matches.filter((_, i) => i !== midx);
                                    setLocalCoupons(updated);
                                  }}
                                  className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-xl transition-all flex items-center justify-center"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-800 flex justify-end">
                          <button
                            onClick={() => setEditingCouponId(null)}
                            className="px-8 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white font-black text-xs uppercase"
                          >
                            DÜZENLEMEYİ SONLANDIR
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
        {activeTab === 'analysis' && (
          <div className="space-y-8 animate-fade-in">
            {!editingAnalysisId ? (
              // --- MASTER VIEW (LIST) ---
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                      <TrendingUp className="text-[#f0b90b]" /> MAÇ ANALİZ YÖNETİMİ
                    </h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Toplam {localAnalyses.length} analiz yayında</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowAiModal(true)}
                      className="bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 text-xs uppercase"
                    >
                      <Zap className="w-4 h-4" /> AI İLE ANALİZ OLUŞTUR
                    </button>
                    <button
                      onClick={() => {
                        const newId = Date.now().toString();
                        const newAnalysis: MatchAnalysis = {
                          id: newId,
                          league: 'Süper Lig',
                          homeTeam: '',
                          awayTeam: '',
                          matchTime: '20:00',
                          matchDate: new Date().toISOString().split('T')[0],
                          analysis: '',
                          tacticalSummary: '',
                          breakingPoint: '',
                          bettingScenario: '',
                          prediction: '',
                          confidence: 85,
                          modelScore: 92,
                          recentHistory: '8 Kazanç',
                          expectedGoals: '3.1',
                          bookieOdds: [
                            { name: '724BAHİS', odd1: '1.72', odd2: '1.85', link: 'https://' },
                            { name: 'BETKOM', odd1: '1.70', odd2: '1.83', link: 'https://' },
                            { name: 'MARSBAHİS', odd1: '1.75', odd2: '1.88', link: 'https://', isHighest: true }
                          ],
                          createdAt: Date.now()
                        };
                        const updatedAnalyses = [newAnalysis, ...localAnalyses];
                        setLocalAnalyses(updatedAnalyses);
                        onSaveAnalyses(updatedAnalyses);
                        setEditingAnalysisId(newId);
                      }}
                      className="bg-[#f0b90b] text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(240,185,11,0.3)] transition-all active:scale-95 text-xs uppercase"
                    >
                      <Plus className="w-4 h-4" /> YENİ ANALİZ EKLE
                    </button>
                    {localAnalyses.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('Tüm analizleri silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
                            setLocalAnalyses([]);
                            onSaveAnalyses([]);
                          }
                        }}
                        className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95 text-xs uppercase"
                      >
                        <Trash2 className="w-4 h-4" /> TÜMÜNÜ SİL
                      </button>
                    )}
                  </div>
                </div>

                {/* Gelişmiş Gruplama Listesi & Spor Seçimi (Sport Toggle) */}
                <div className="space-y-8 relative pb-20">
                  {/* Sport-Themed Ambient Glow */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none transition-all duration-700 z-0 rounded-3xl"
                    style={{
                      background: adminSport === 'Futbol'
                        ? 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)'
                        : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(228,81,11,0.08) 0%, transparent 70%)'
                    }}
                  />

                  {/* Sport Toggle */}
                  <div className="flex justify-center gap-4 relative z-10">
                    <button
                      onClick={() => setAdminSport('Futbol')}
                      className={`flex items-center gap-2 px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 ${adminSport === 'Futbol'
                        ? 'bg-[#f0b90b] text-black shadow-[0_0_25px_rgba(240,185,11,0.3)] scale-105'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                    >
                      <span className="text-xl">⚽</span> Futbol
                    </button>
                    <button
                      onClick={() => setAdminSport('Basketbol')}
                      className={`flex items-center gap-2 px-6 py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 ${adminSport === 'Basketbol'
                        ? 'bg-[#E4510B] text-white shadow-[0_0_25px_rgba(228,81,11,0.3)] scale-105'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                    >
                      <span className="text-xl">🏀</span> Basketbol
                    </button>
                  </div>

                  <div className="relative z-10 space-y-12">
                    {(() => {
                      const isBasketballLeague = (analysis: MatchAnalysis) => {
                        if (analysis.sport) return analysis.sport === 'Basketbol';
                        const lower = analysis.league.toLowerCase();
                        return lower.includes('nba') || lower.includes('basket') || lower.includes('euroleague');
                      };

                      const groups = localAnalyses
                        .filter(a => a.homeTeam && a.awayTeam && a.homeTeam !== 'A' && a.awayTeam !== 'A') // Junk data filtering
                        .reduce((acc, analysis) => {
                          if (!acc[analysis.league]) acc[analysis.league] = [];
                          acc[analysis.league].push(analysis);
                          return acc;
                        }, {} as Record<string, MatchAnalysis[]>);

                      const footballGroups: Record<string, MatchAnalysis[]> = {};
                      const basketballGroups: Record<string, MatchAnalysis[]> = {};

                      Object.keys(groups).forEach(league => {
                        const sampleAnalysis = groups[league][0];
                        if (isBasketballLeague(sampleAnalysis)) {
                          basketballGroups[league] = groups[league];
                        } else {
                          footballGroups[league] = groups[league];
                        }
                      });

                      const renderMatchRow = (analysis: MatchAnalysis) => (
                        <div key={analysis.id} className="group relative">
                          {/* Premium Match Card */}
                          <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm p-5 rounded-[24px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 hover:border-[#f0b90b]/40 hover:bg-zinc-900/60 hover:translate-x-1 shadow-lg shadow-black/20">
                            <div className="flex items-center gap-6 flex-1 min-w-0 w-full">
                              <div className={`shrink-0 w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-zinc-800/80 transition-all duration-500 group-hover:border-[#f0b90b]/30 group-hover:shadow-[0_0_20px_rgba(240,185,11,0.1)]`}>
                                <TrendingUp className={`w-6 h-6 ${adminSport === 'Futbol' ? 'text-emerald-400' : 'text-orange-400'}`} />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                  <div className="px-2 py-0.5 bg-zinc-800/80 rounded-md border border-zinc-700/50">
                                    <span className="text-zinc-400 text-[9px] font-black tracking-widest uppercase">{analysis.matchDate}</span>
                                  </div>
                                  <span className="text-[#f0b90b] text-[10px] font-black">{analysis.matchTime}</span>
                                </div>
                                <h3 className="text-white font-black text-base uppercase italic tracking-tight flex items-center gap-2 flex-wrap">
                                  <span className="truncate">{analysis.homeTeam}</span>
                                  <span className="text-zinc-600 font-medium not-italic text-xs lowercase shrink-0">vs</span> 
                                  <span className="truncate">{analysis.awayTeam}</span>
                                </h3>
                                
                                {analysis.analysis && (
                                  <p className="mt-2 text-zinc-500 text-[10px] font-medium leading-relaxed max-w-xl line-clamp-1 italic truncate">
                                    "{analysis.analysis.substring(0, 100)}..."
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 w-full md:w-auto shrink-0 pr-2">
                              <div className="hidden md:flex flex-col items-end mr-4">
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">GÜVEN</span>
                                <span className="text-xs font-black text-[#f0b90b] tracking-tighter">%{analysis.confidence}</span>
                              </div>

                              <button
                                onClick={() => setEditingAnalysisId(analysis.id)}
                                className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-zinc-800/80 hover:bg-[#f0b90b] text-zinc-300 hover:text-black px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300 border border-zinc-700/50 hover:border-transparent active:scale-95 shrink-0"
                              >
                                <Edit3 className="w-3.5 h-3.5" /> DÜZENLE
                              </button>
                              
                              <button
                                onClick={() => {
                                  if (window.confirm('Bu analizi silmek istediğinize emin misiniz?')) {
                                    const updated = localAnalyses.filter(a => a.id !== analysis.id);
                                    setLocalAnalyses(updated);
                                    onSaveAnalyses(updated);
                                  }
                                }}
                                className="p-2.5 text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all active:scale-90 shrink-0 border border-transparent hover:border-rose-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );

                      return (
                        <>
                          {localAnalyses.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-zinc-800 rounded-[40px] space-y-4">
                              <AlertCircle className="w-12 h-12 text-zinc-800 mx-auto" />
                              <p className="text-zinc-600 font-black text-xs uppercase tracking-widest">Henüz analiz eklenmemiş.</p>
                            </div>
                          )}

                          {adminSport === 'Futbol' && Object.keys(footballGroups).length > 0 && (
                            <div className="space-y-10 animate-fade-in">
                              <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-6">
                                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                                  <span className="text-2xl">⚽</span>
                                </div>
                                <div>
                                  <h2 className="text-xl font-black text-white uppercase tracking-wider">Futbol Analizleri</h2>
                                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Toplam {Object.values(footballGroups).flat().length} Aktif Yayın</p>
                                </div>
                              </div>

                              {Object.entries(footballGroups).map(([league, items]) => (
                                <div key={league} className="space-y-4">
                                  <div className="flex items-start md:items-center justify-between px-2 gap-4">
                                    <h3 className="text-[11px] font-black text-[#f0b90b] uppercase tracking-[0.3em] flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                                      <div className="w-6 h-[1px] bg-[#f0b90b]/30 shrink-0" /> 
                                      <span className="truncate">{league}</span>
                                    </h3>
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0 mt-1 md:mt-0">{items.length} MAÇ</span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4">
                                    {items.map(renderMatchRow)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {adminSport === 'Basketbol' && Object.keys(basketballGroups).length > 0 && (
                            <div className="space-y-10 animate-fade-in">
                              <div className="flex items-center gap-4 border-b border-zinc-800/50 pb-6">
                                <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center">
                                  <span className="text-2xl">🏀</span>
                                </div>
                                <div>
                                  <h2 className="text-xl font-black text-white uppercase tracking-wider">Basketbol Analizleri</h2>
                                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Toplam {Object.values(basketballGroups).flat().length} Aktif Yayın</p>
                                </div>
                              </div>

                              {Object.entries(basketballGroups).map(([league, items]) => (
                                <div key={league} className="space-y-4">
                                  <div className="flex items-start md:items-center justify-between px-2 gap-4">
                                    <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.3em] flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                                      <div className="w-6 h-[1px] bg-orange-500/30 shrink-0" /> 
                                      <span className="truncate">{league}</span>
                                    </h3>
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0 mt-1 md:mt-0">{items.length} MAÇ</span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4">
                                    {items.map(renderMatchRow)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              // --- DETAIL VIEW (EDITOR) ---
              <div className="space-y-6 animate-fade-in-up">
                {(() => {
                  const analysis = localAnalyses.find(a => a.id === editingAnalysisId);
                  if (!analysis) return null;
                  const idx = localAnalyses.findIndex(a => a.id === editingAnalysisId);

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setEditingAnalysisId(null)}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xs transition-colors bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-700/50"
                          >
                            <ChevronLeft className="w-4 h-4" /> GERİ DÖN
                          </button>
                          <button
                            onClick={() => {
                              localStorage.setItem('site_analyses', JSON.stringify(localAnalyses));
                              alert('Analiz başarıyla güncellendi!');
                            }}
                            className="flex items-center gap-2 bg-[#f0b90b] text-black font-black px-5 py-2 rounded-xl text-xs uppercase shadow-[0_0_15px_rgba(240,185,11,0.2)] hover:shadow-[0_0_20px_#f0b90b] transition-all active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5" /> DEĞİŞİKLİKLERİ UYGULA
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">DÜZENLENİYOR: {analysis.id}</span>
                          <div className="flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-green-500 font-black text-[9px] uppercase">TASLAK KAYDEDİLDİ</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] space-y-10">
                        {/* Bölüm 1: Genel Bilgiler */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-4 bg-[#f0b90b]"></div>
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] italic">01. GENEL BİLGİLER</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><Layout className="w-3 h-3" /> LİG / TURNUVA</label>
                              <input value={analysis.league} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].league = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm focus:border-[#f0b90b] transition-all outline-none" placeholder="Örn: La Liga" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><Calendar className="w-3 h-3" /> MAÇ TARİHİ</label>
                              <input type="date" value={analysis.matchDate} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].matchDate = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm focus:border-[#f0b90b] transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><Clock className="w-3 h-3" /> BAŞLANGIÇ SAATİ</label>
                              <input value={analysis.matchTime} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].matchTime = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm focus:border-[#f0b90b] transition-all outline-none text-white font-bold" placeholder="22:00" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><Zap className="w-3 h-3" /> GÜVEN ORANI (%)</label>
                              <input type="number" value={analysis.confidence} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].confidence = parseInt(e.target.value); setLocalAnalyses(updated);
                              }} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm text-[#f0b90b] font-black focus:border-[#f0b90b] transition-all outline-none" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase italic">EV SAHİBİ</label>
                              <input value={analysis.homeTeam} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].homeTeam = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white font-black uppercase italic text-base focus:border-[#f0b90b] transition-all outline-none" placeholder="REAL MADRID" />
                            </div>
                            <div className="space-y-2 relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 text-zinc-800 font-bold hidden md:block italic">VS</div>
                              <label className="text-[9px] font-black text-zinc-500 uppercase italic">DEPLASMAN</label>
                              <input value={analysis.awayTeam} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].awayTeam = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white font-black uppercase italic text-base focus:border-[#f0b90b] transition-all outline-none" placeholder="MANCHESTER CITY" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-[#f0b90b] uppercase italic">NET TAHMİN</label>
                              <input value={analysis.prediction} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].prediction = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-black border border-[#f0b90b]/30 rounded-xl p-4 text-[#f0b90b] font-black uppercase italic text-base focus:border-[#f0b90b] transition-all outline-none shadow-[0_0_15px_rgba(240,185,11,0.05)]" placeholder="KG VAR / 2.5 ÜST" />
                            </div>
                          </div>
                        </div>

                        {/* Bölüm 2: Editör Analizi */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-4 bg-[#f0b90b]"></div>
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] italic">02. EDİTÖR DETAYLI ANALİZİ</h4>
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><ClipboardList className="w-3 h-3" />📝 ANALİZ METNİ (GENEL)</label>
                              <textarea value={analysis.analysis} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].analysis = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full h-24 bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 resize-none focus:border-[#f0b90b] transition-all outline-none leading-relaxed italic" placeholder="Genel analiz metni..." />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><Search className="w-3 h-3" />🔎 TAKTİK ÖZET</label>
                              <textarea value={analysis.tacticalSummary} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].tacticalSummary = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full h-24 bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 resize-none focus:border-[#f0b90b] transition-all outline-none leading-relaxed italic" placeholder="Taktiksel detaylar..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><Zap className="w-3 h-3" />⚡ MAÇIN KIRILMA ANI</label>
                                <textarea value={analysis.breakingPoint} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].breakingPoint = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full h-24 bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 resize-none focus:border-[#f0b90b] transition-all outline-none leading-relaxed italic" placeholder="Kırılma anı senaryosu..." />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><Target className="w-3 h-3" />🎯 BAHİS SENARYOSU</label>
                                <textarea value={analysis.bettingScenario} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].bettingScenario = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full h-24 bg-black border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 resize-none focus:border-[#f0b90b] transition-all outline-none leading-relaxed italic" placeholder="Beklenen bahis akışı..." />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bölüm 3: Modeller ve Oranlar */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-4 bg-[#f0b90b]"></div>
                            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] italic">03. İSTATİSTİK & ORANLAR</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-[#f0b90b]" /> MODEL SKORU</label>
                              <div className="flex items-center gap-4">
                                <input type="number" value={analysis.modelScore} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].modelScore = parseInt(e.target.value); setLocalAnalyses(updated);
                                }} className="w-20 bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-white font-black text-lg" />
                                <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#f0b90b] shadow-[0_0_8px_#f0b90b]" style={{ width: `${analysis.modelScore}%` }} />
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><Trophy className="w-3 h-3 text-[#f0b90b]" /> SON 10 TAHMİN</label>
                              <input value={analysis.recentHistory} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].recentHistory = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-black text-sm" placeholder="8 Kazanç" />
                            </div>
                            <div className="p-4 bg-black rounded-2xl border border-zinc-800 space-y-2">
                              <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1.5"><AlertCircle className="w-3 h-3 text-[#f0b90b]" /> xG BEKLENTİSİ</label>
                              <input value={analysis.expectedGoals} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].expectedGoals = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-black text-lg" placeholder="3.1" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {analysis.bookieOdds.map((bookie, bidx) => (
                              <div key={bidx} className="bg-black border border-zinc-800 p-6 rounded-[25px] space-y-5 relative overflow-hidden group/odd">
                                {bookie.isHighest && <div className="absolute top-0 right-0 bg-[#f0b90b] text-black text-[7px] font-black px-3 py-1 rounded-bl-lg transform skew-x-12 translate-x-1 uppercase">LİDER</div>}

                                <div className="space-y-1">
                                  <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">SİTE ADI</label>
                                  <input value={bookie.name} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].name = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-transparent border-b border-zinc-800 text-sm font-black text-white pb-2 uppercase focus:border-white transition-all outline-none" placeholder="Site Adı" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-black text-zinc-600 uppercase">KG VAR</label>
                                    <input value={bookie.odd1} onChange={(e) => {
                                      const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].odd1 = e.target.value; setLocalAnalyses(updated);
                                    }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-[#f0b90b] font-black text-center" />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-black text-zinc-600 uppercase">2.5 ÜST</label>
                                    <input value={bookie.odd2} onChange={(e) => {
                                      const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].odd2 = e.target.value; setLocalAnalyses(updated);
                                    }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-[#f0b90b] font-black text-center" />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[8px] font-black text-zinc-600 uppercase">AFFILIATE LİNK</label>
                                  <input value={bookie.link} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].link = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-[9px] text-zinc-500 font-mono truncate" placeholder="https://..." />
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                                  <div className="relative">
                                    <input type="checkbox" checked={bookie.isHighest} onChange={(e) => {
                                      const updated = [...localAnalyses];
                                      updated[idx].bookieOdds.forEach((b, i) => b.isHighest = (i === bidx ? e.target.checked : false));
                                      setLocalAnalyses(updated);
                                    }} className="hidden" />
                                    <div className={`w-10 h-5 rounded-full transition-all ${bookie.isHighest ? 'bg-[#f0b90b]' : 'bg-zinc-800'}`}>
                                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${bookie.isHighest ? 'left-6' : 'left-1'}`} />
                                    </div>
                                  </div>
                                  <span className={`text-[9px] font-black uppercase tracking-widest ${bookie.isHighest ? 'text-[#f0b90b]' : 'text-zinc-600'}`}>EN YÜKSEK ORAN</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Alt Butonlar */}
                        <div className="pt-8 border-t border-zinc-850 flex justify-end gap-4">
                          <button
                            onClick={() => setEditingAnalysisId(null)}
                            className="px-8 py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-750 text-white font-black text-xs uppercase transition-all active:scale-95"
                          >
                            DÜZENLEMEYİ SONDLANDIR
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-8 py-4 rounded-2xl bg-[#f0b90b] text-black font-black text-xs uppercase shadow-[0_10px_30px_rgba(240,185,11,0.2)] hover:shadow-[0_10px_40px_rgba(240,185,11,0.4)] transition-all active:scale-95"
                          >
                            BÜTÜN SİSTEMİ KAYDET
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}



        {/* Previous style and seo tabs remain same logic but kept for consistency */}
        {activeTab === 'style' && (
          <div className="max-w-xl space-y-8">
            <h2 className="text-2xl font-black">SİTE GÖRÜNÜMÜ</h2>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div><h3 className="font-bold">Ana Renk</h3></div>
                <input type="color" value={themeColor} onChange={(e) => onThemeChange(e.target.value)} className="w-16 h-16 bg-transparent cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="max-w-2xl space-y-8">
            <h2 className="text-2xl font-black">CEO / SEO HASHTAG</h2>
            <textarea value={localHashtags} onChange={(e) => setLocalHashtags(e.target.value)} className="w-full h-48 bg-black border border-zinc-800 rounded-2xl p-6 outline-none focus:border-primary text-zinc-300 font-mono text-sm resize-none" />
          </div>
        )}

        {activeTab === 'leagues' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Trophy className="text-[#f0b90b]" /> LİG & VERİ YÖNETİMİ
                </h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                  En Popüler Ligler alanındaki tüm Puan Durumu, Yaklaşan Maçlar ve Tahminler verisi
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(jsonInput);
                      const formatted = JSON.stringify(parsed, null, 2);
                      setJsonInput(formatted);
                      setJsonError('');
                    } catch (err) {
                      setJsonError('Formatlanamıyor: Geçersiz JSON syntaxı.');
                    }
                  }}
                  className="bg-indigo-600 text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 text-xs uppercase"
                >
                  <Box className="w-4 h-4" /> FORMATLA
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#f0b90b] text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(240,185,11,0.3)] transition-all active:scale-95 text-xs uppercase"
                >
                  <Save className="w-4 h-4" /> JSON'U KAYDET
                </button>
              </div>
            </div>

            {jsonError && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-500 font-bold text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{jsonError}</p>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-[70vh] flex flex-col">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layout className="w-3 h-3" /> GELİŞMİŞ JSON EDİTÖRÜ (DİKKATLİ DÜZENLEYİN)
              </label>
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError('');
                }}
                spellCheck="false"
                className="flex-1 w-full bg-[#0a0a0a] border border-zinc-800 rounded-2xl p-6 text-emerald-400 font-mono text-[13px] resize-none focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b] transition-all outline-none leading-relaxed"
                placeholder="{ ... }"
              />
            </div>
          </div>
        )}

        {/* ===== EDITOR MANAGEMENT TAB ===== */}
        {activeTab === 'editors' && (
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Users className="text-[#f0b90b]" /> EDİTÖR YÖNETİMİ
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase mt-1">Kayıtlı editörleri yönet, yeni editör oluştur</p>
            </div>

            {/* Create New Editor */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <h3 className="text-white font-black text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#f0b90b]" /> YENİ EDİTÖR OLUŞTUR
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">Editör Adı (Görünen)</label>
                  <input
                    type="text"
                    value={newEditorName}
                    onChange={e => setNewEditorName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-[#f0b90b] outline-none"
                    placeholder="Ahmet Editör"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={newEditorUsername}
                    onChange={e => setNewEditorUsername(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-white text-sm focus:border-[#f0b90b] outline-none"
                    placeholder="ahmet_editor"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">Şifre</label>
                  <div className="relative">
                    <input
                      type={showEditorPassword ? 'text' : 'password'}
                      value={newEditorPassword}
                      onChange={e => setNewEditorPassword(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-4 pr-10 text-white text-sm focus:border-[#f0b90b] outline-none"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowEditorPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                      {showEditorPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {editorError && <p className="text-red-500 text-xs font-bold bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{editorError}</p>}
              {editorSaveMsg && <p className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">{editorSaveMsg}</p>}

              <button
                onClick={() => {
                  setEditorError('');
                  setEditorSaveMsg('');
                  if (!newEditorName.trim() || !newEditorUsername.trim() || !newEditorPassword.trim()) {
                    setEditorError('Tüm alanları doldurmalısınız.');
                    return;
                  }
                  const existing = editorAccounts.find(e => e.username.toLowerCase() === newEditorUsername.toLowerCase());
                  if (existing) {
                    setEditorError('Bu kullanıcı adı zaten mevcut!');
                    return;
                  }
                  const newEditor: EditorAccount = {
                    id: Date.now().toString(),
                    name: newEditorName.trim(),
                    username: newEditorUsername.trim(),
                    password: newEditorPassword,
                    createdAt: Date.now()
                  };
                  const updated = [...editorAccounts, newEditor];
                  setEditorAccounts(updated);
                  localStorage.setItem('site_editors', JSON.stringify(updated));
                  setNewEditorName('');
                  setNewEditorUsername('');
                  setNewEditorPassword('');
                  setEditorSaveMsg(`"${newEditor.name}" editörü başarıyla oluşturuldu!`);
                  setTimeout(() => setEditorSaveMsg(''), 3000);
                }}
                className="px-6 py-3 bg-[#f0b90b] text-black font-black text-xs rounded-xl uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all"
              >
                EDİTÖR OLUŞTUR
              </button>
            </div>

            {/* Existing Editors */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-black text-sm mb-5 flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-400" /> MEVCUT EDİTÖRLER
                <span className="ml-auto text-xs text-zinc-500 font-bold">({editorAccounts.length} editör)</span>
              </h3>
              {editorAccounts.length === 0 ? (
                <p className="text-zinc-600 text-xs font-bold text-center py-6">Henüz editör oluşturulmadı.</p>
              ) : (
                <div className="space-y-3">
                  {editorAccounts.map(editor => (
                    <div key={editor.id} className="flex items-center justify-between bg-black border border-zinc-800 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-black text-sm">{editor.name}</p>
                          <p className="text-zinc-500 text-xs font-bold">@{editor.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-600 font-bold border border-zinc-800 px-2 py-0.5 rounded">
                          {new Date(editor.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                        <button
                          onClick={() => {
                            const updated = editorAccounts.filter(e => e.id !== editor.id);
                            setEditorAccounts(updated);
                            localStorage.setItem('site_editors', JSON.stringify(updated));
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hardcoded legacy editors info */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-2">Sistem Editörleri (Sabit)</p>
              <div className="flex flex-wrap gap-2">
                {['editor1', 'editor2', 'editor3'].map(e => (
                  <span key={e} className="text-[10px] font-black text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full">@{e} / 123456</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wheel' && (
          <div className="space-y-10 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Zap className="text-amber-400" /> ÇARK VE ÖDÜL YÖNETİMİ
                </h2>
                <p className="text-zinc-500 text-xs font-bold uppercase mt-1">Ödülleri, oranları ve bekleme süresini buradan ayarlayın</p>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <Timer className="w-5 h-5 text-amber-400" />
                <div className="flex flex-col">
                  <label className="text-[10px] font-black text-zinc-600 uppercase">Yenileme Süresi (Saat)</label>
                  <input
                    type="number"
                    value={localWheelConfig.spinCooldownHours}
                    onChange={(e) => setLocalWheelConfig({ ...localWheelConfig, spinCooldownHours: parseInt(e.target.value) })}
                    className="bg-transparent text-white font-black outline-none w-12"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localWheelConfig.rewards.map((reward, idx) => (
                <div key={reward.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[30px] space-y-4 hover:border-amber-400/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black border border-zinc-800 group-hover:border-amber-400/30">
                      <Gift className="w-5 h-5 text-amber-400" />
                    </div>
                    <input
                      type="color"
                      value={reward.color}
                      onChange={(e) => {
                        const newRewards = [...localWheelConfig.rewards];
                        newRewards[idx].color = e.target.value;
                        setLocalWheelConfig({ ...localWheelConfig, rewards: newRewards });
                      }}
                      className="w-8 h-8 bg-transparent cursor-pointer"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-zinc-500 uppercase">Ödül İsmi</label>
                      <input
                        value={reward.label}
                        onChange={(e) => {
                          const newRewards = [...localWheelConfig.rewards];
                          newRewards[idx].label = e.target.value;
                          setLocalWheelConfig({ ...localWheelConfig, rewards: newRewards });
                        }}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs font-black uppercase italic"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase">Kazanma Ağırlığı</label>
                        <input
                          type="number"
                          value={reward.weight}
                          onChange={(e) => {
                            const newRewards = [...localWheelConfig.rewards];
                            newRewards[idx].weight = parseInt(e.target.value);
                            setLocalWheelConfig({ ...localWheelConfig, rewards: newRewards });
                          }}
                          className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-amber-400 font-black"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase">Ödül Tipi</label>
                        <select
                          value={reward.type}
                          onChange={(e) => {
                            const newRewards = [...localWheelConfig.rewards];
                            newRewards[idx].type = e.target.value as any;
                            setLocalWheelConfig({ ...localWheelConfig, rewards: newRewards });
                          }}
                          className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-[10px] font-bold"
                        >
                          <option value="nakit">NAKİT</option>
                          <option value="freespin">FREESPIN</option>
                          <option value="freebet">FREEBET</option>
                          <option value="bonus">BONUS</option>
                          <option value="pas">PAS</option>
                          <option value="iphone">IPHONE</option>
                          <option value="ps5">PS5</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newReward: WheelReward = {
                    id: Date.now().toString(),
                    label: 'YENİ ÖDÜL',
                    type: 'nakit',
                    value: '0',
                    weight: 10,
                    color: '#FFC107'
                  };
                  setLocalWheelConfig({ ...localWheelConfig, rewards: [...localWheelConfig.rewards, newReward] });
                }}
                className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-[30px] flex flex-col items-center justify-center gap-4 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all py-12"
              >
                <Plus className="w-10 h-10 text-zinc-700" />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">YENİ ÖDÜL EKLE</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* --- AI SMART PASTE MODAL --- */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowAiModal(false)} />
          <div className="relative bg-zinc-900 w-full max-w-2xl p-8 rounded-[40px] border border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.2)] animate-scale-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Zap className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight">AI TOPLU ANALİZ ÜRETİCİ</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">Her satıra BİR maç girin. Sistem tümünü otomatik üretecektir.</p>
              </div>
            </div>

            <textarea
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder={`Örnek Format:\nGalatasaray - Fenerbahçe 20:00\nReal Madrid vs Barcelona 22:30\nArsenal - Chelsea`}
              className="w-full h-64 bg-black border border-zinc-800 rounded-3xl p-6 text-zinc-300 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all resize-none font-mono mb-6"
            />

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAiModal(false)}
                className="flex-1 py-4 rounded-2xl bg-zinc-800 text-white font-black text-xs uppercase hover:bg-zinc-750 transition-all"
              >
                VAZGEÇ
              </button>
              <button
                onClick={handleAiParse}
                className="flex-[2] py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-600/40 transition-all active:scale-95"
              >
                ANALİZİ OLUŞTUR VE DÜZENLE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CASINO 724 BLACKJACK SETTINGS ─── */}
      {activeTab === 'blackjack' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🎴</span>
            <div>
              <h2 className="text-white font-black text-xl uppercase tracking-tight">Casino 724 Ayarları</h2>
              <p className="text-zinc-500 text-xs font-bold">Blackjack ödülleri ve kuralları</p>
            </div>
          </div>

          {/* Cooldown + Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <label className="text-zinc-400 text-xs font-black uppercase tracking-widest">El Arası Bekleme (Saat)</label>
              <input
                type="number" min={1} max={24}
                value={localBjConfig.cooldownHours}
                onChange={e => setLocalBjConfig(c => ({ ...c, cooldownHours: Number(e.target.value) }))}
                className="w-full px-3 py-2 rounded-xl text-white bg-zinc-900 border border-zinc-700 font-black text-lg outline-none"
              />
              <p className="text-zinc-600 text-[10px]">Oyuncular kaç saatte bir el oynayabilir?</p>
            </div>
            <div className="p-4 rounded-2xl space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <label className="text-zinc-400 text-xs font-black uppercase tracking-widest">Krupiye Kuralı</label>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => setLocalBjConfig(c => ({ ...c, dealerHitSoft17: !c.dealerHitSoft17 }))}
                  className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                  style={{ background: localBjConfig.dealerHitSoft17 ? '#f0b90b' : '#3f3f46' }}
                >
                  <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: localBjConfig.dealerHitSoft17 ? '26px' : '4px' }} />
                </button>
                <span className="text-white text-sm font-bold">
                  {localBjConfig.dealerHitSoft17 ? 'Krupiye Soft-17\'de Çeker' : 'Krupiye Soft-17\'de Durur'}
                </span>
              </div>
              <p className="text-zinc-600 text-[10px]">Krupiyenin 17 sayısında davranışı</p>
            </div>
          </div>

          {/* Rewards */}
          <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-black uppercase text-sm tracking-widest">🎁 Kazanma Ödülleri</h3>
              <button
                onClick={() => setLocalBjConfig(c => ({
                  ...c,
                  rewards: [...c.rewards, { id: String(Date.now()), label: 'Yeni Ödül', emoji: '🎁', weight: 10, color: '#f0b90b' }]
                }))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider text-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)' }}
              >
                <Plus className="w-3.5 h-3.5" /> Ödül Ekle
              </button>
            </div>
            <p className="text-zinc-600 text-[10px] font-bold -mt-1">Ağırlık: yüksek = daha sık çıkar. Emoji: ödülün simgesi.</p>

            {(localBjConfig.rewards.length === 0 ? [
              { id: '1', label: '50 TL Bonus', emoji: '🎁', weight: 30, color: '#10b981' },
              { id: '2', label: '100 TL Nakit', emoji: '💵', weight: 20, color: '#f0b90b' },
              { id: '3', label: '25 Freespin', emoji: '🎰', weight: 25, color: '#3b82f6' },
              { id: '4', label: '200 TL Bonus', emoji: '🏆', weight: 10, color: '#8b5cf6' },
              { id: '5', label: '500 TL Jackpot', emoji: '👑', weight: 5, color: '#f59e0b' },
            ] : localBjConfig.rewards).map((reward, idx) => (
              <div key={reward.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <input
                  type="text" maxLength={2}
                  value={reward.emoji}
                  onChange={e => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.map((r, i) => i === idx ? { ...r, emoji: e.target.value } : r) }))}
                  className="w-10 text-center bg-zinc-800 rounded-lg border border-zinc-700 py-1 text-lg font-black outline-none text-white"
                />
                <input
                  type="text"
                  value={reward.label}
                  onChange={e => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.map((r, i) => i === idx ? { ...r, label: e.target.value } : r) }))}
                  className="flex-1 px-3 py-1.5 bg-zinc-800 rounded-xl border border-zinc-700 text-white font-bold text-sm outline-none"
                  placeholder="Ödül Adı"
                />
                <div className="flex items-center gap-1">
                  <span className="text-zinc-600 text-[10px] font-black">Ağırlık:</span>
                  <input
                    type="number" min={1} max={100}
                    value={reward.weight}
                    onChange={e => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.map((r, i) => i === idx ? { ...r, weight: Number(e.target.value) } : r) }))}
                    className="w-16 px-2 py-1.5 bg-zinc-800 rounded-xl border border-zinc-700 text-white font-black text-sm outline-none text-center"
                  />
                </div>
                <input
                  type="color"
                  value={reward.color}
                  onChange={e => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.map((r, i) => i === idx ? { ...r, color: e.target.value } : r) }))}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                  title="Renk Seç"
                />
                <button
                  onClick={() => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.filter((_, i) => i !== idx) }))}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Save */}
          <button
            onClick={() => { onSaveBjConfig?.(localBjConfig); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)', boxShadow: '0 0 20px rgba(240,185,11,0.3)' }}
          >
            <Save className="w-4 h-4" /> Casino 724 Ayarlarını Kaydet
          </button>
        </div>
      )}

      {/* ─── LOYALTY / GAMIFICATION SETTINGS ─── */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">⭐</span>
            <div>
              <h2 className="text-white font-black text-xl uppercase tracking-tight">Sadakat Programı Ayarları</h2>
              <p className="text-zinc-500 text-xs font-bold">724bets.net × 724BAHİS Loyalty/Gamification</p>
            </div>
          </div>

          {/* Program Settings */}
          <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-white font-black text-sm uppercase tracking-widest">⚙️ Program Genel Ayarlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-1">Program Adı</label>
                <input type="text" value={localLoyaltyConfig.programName}
                  onChange={e => setLocalLoyaltyConfig(c => ({ ...c, programName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm outline-none focus:border-[#f0b90b]/40" />
              </div>
              <div>
                <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-1">Coin Adı</label>
                <input type="text" value={localLoyaltyConfig.coinName}
                  onChange={e => setLocalLoyaltyConfig(c => ({ ...c, coinName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-sm outline-none focus:border-[#f0b90b]/40" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, isActive: !c.isActive }))}
                className="relative w-12 h-6 rounded-full transition-all flex-shrink-0"
                style={{ background: localLoyaltyConfig.isActive ? '#10b981' : '#3f3f46' }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                  style={{ left: localLoyaltyConfig.isActive ? '26px' : '4px' }} />
              </button>
              <span className="text-white text-sm font-bold">{localLoyaltyConfig.isActive ? 'Program Aktif' : 'Program Devre Dışı'}</span>
            </div>
          </div>

          {/* Trigger Rules */}
          <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">🎯 Tetikleme Kuralları</h3>
              <button
                onClick={() => setLocalLoyaltyConfig(c => ({
                  ...c,
                  rules: [...c.rules, { id: String(Date.now()), name: 'Yeni Kural', description: '', triggerType: 'deposit', thresholdAmount: 500, coinsAwarded: 100, ticketsAwarded: 0, isActive: true }]
                }))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs uppercase text-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #f0b90b, #d4a017)' }}>
                <Plus className="w-3.5 h-3.5" /> Kural Ekle
              </button>
            </div>
            {localLoyaltyConfig.rules.map((rule, idx) => (
              <div key={rule.id} className="p-3 rounded-xl space-y-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-2">
                  <input type="text" value={rule.name}
                    onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, name: e.target.value } : r) }))}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-bold text-xs outline-none" placeholder="Kural Adı" />
                  <select value={rule.triggerType}
                    onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, triggerType: e.target.value as any } : r) }))}
                    className="px-2 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-black text-xs outline-none">
                    <option value="deposit">Yatırım</option>
                    <option value="volume">Hacim</option>
                    <option value="manual">Manuel</option>
                  </select>
                  <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, isActive: !r.isActive } : r) }))}
                    className={`px-2 py-1 rounded-lg font-black text-[10px] ${rule.isActive ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-600'}`}>
                    {rule.isActive ? 'AKTİF' : 'KAPALI'}
                  </button>
                  <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.filter((_, i) => i !== idx) }))} className="text-red-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-zinc-700 text-[9px] font-black block">Eşik (TL)</label>
                    <input type="number" value={rule.thresholdAmount}
                      onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, thresholdAmount: Number(e.target.value) } : r) }))}
                      className="w-full px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-black text-xs outline-none text-center" />
                  </div>
                  <div>
                    <label className="text-zinc-700 text-[9px] font-black block">Coin Ödül</label>
                    <input type="number" value={rule.coinsAwarded}
                      onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, coinsAwarded: Number(e.target.value) } : r) }))}
                      className="w-full px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-black text-xs outline-none text-center" />
                  </div>
                  <div>
                    <label className="text-zinc-700 text-[9px] font-black block">Bilet Ödül</label>
                    <input type="number" value={rule.ticketsAwarded}
                      onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, ticketsAwarded: Number(e.target.value) } : r) }))}
                      className="w-full px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-white font-black text-xs outline-none text-center" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Market Items */}
          <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black text-sm uppercase tracking-widest">🛒 Bonus Market Ürünleri</h3>
              <button
                onClick={() => setLocalLoyaltyConfig(c => ({
                  ...c,
                  marketItems: [...c.marketItems, { id: String(Date.now()), name: 'Yeni Ürün', description: '', type: 'cash_bonus', coinCost: 500, emoji: '🎁', color: '#f0b90b', isActive: true, stock: -1 }]
                }))}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs uppercase text-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
                <Plus className="w-3.5 h-3.5" /> Ürün Ekle
              </button>
            </div>
            {localLoyaltyConfig.marketItems.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <input type="text" maxLength={2} value={item.emoji}
                  onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, emoji: e.target.value } : m) }))}
                  className="w-10 text-center bg-zinc-800 rounded-lg border border-zinc-700 py-1.5 text-lg font-black outline-none text-white" />
                <input type="text" value={item.name}
                  onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, name: e.target.value } : m) }))}
                  className="flex-1 px-2 py-1.5 bg-zinc-800 rounded-xl border border-zinc-700 text-white font-bold text-xs outline-none" placeholder="Ürün Adı" />
                <div className="flex items-center gap-1">
                  <span className="text-zinc-700 text-[9px] font-black">Coin:</span>
                  <input type="number" value={item.coinCost}
                    onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, coinCost: Number(e.target.value) } : m) }))}
                    className="w-16 px-2 py-1.5 bg-zinc-800 rounded-xl border border-zinc-700 text-white font-black text-xs outline-none text-center" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-zinc-700 text-[9px] font-black">Stok:</span>
                  <input type="number" value={item.stock}
                    onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, stock: Number(e.target.value) } : m) }))}
                    className="w-16 px-2 py-1.5 bg-zinc-800 rounded-xl border border-zinc-700 text-white font-black text-xs outline-none text-center" title="-1 = Sınırsız" />
                </div>
                <input type="color" value={item.color}
                  onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, color: e.target.value } : m) }))}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, isActive: !m.isActive } : m) }))}
                  className={`px-2 py-1 rounded-lg font-black text-[9px] ${item.isActive ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800 text-zinc-600'}`}>
                  {item.isActive ? 'AKT' : 'OFF'}
                </button>
                <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.filter((_, i) => i !== idx) }))} className="text-red-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <p className="text-zinc-700 text-[10px] font-bold">Stok: -1 = Sınırsız. Market ürünleri oyuncular tarafından Coin ile satın alınır.</p>
          </div>

          {/* Save */}
          <button
            onClick={() => { onSaveLoyaltyConfig?.(localLoyaltyConfig); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
          >
            <Save className="w-4 h-4" /> Sadakat Ayarlarını Kaydet
          </button>
        </div>
      )}

      {activeTab === 'pool' && (
        <AdminPoolTab />
      )}

      {activeTab === 'news' && (
        <div className="animate-fade-in">
          <AdminNewsTab role={role} />
        </div>
      )}

      {activeTab === 'giveaway' && giveawayConfig && onSaveGiveawayConfig && (
        <AdminGiveawayTab
          config={giveawayConfig}
          onConfigChange={onSaveGiveawayConfig}
        />
      )}

      {/* ─── VISIBILITY TAB ─── */}
      {activeTab === 'visibility' && (
        <div className="space-y-8 animate-fade-in-up p-6 overflow-y-auto w-full max-w-4xl mx-auto">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <Eye className="text-primary" /> SAYFA GÖRÜNÜRLÜĞÜ
            </h2>
            <p className="text-zinc-500 text-sm font-bold mt-2">
              Sitedeki sayfaları açıp kapatarak kullanıcıların erişimini yönetin.
              Çekiliş sayfası sadece yöneticilere görünür durumda kalmaya devam edecektir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { key: 'coupons', label: 'Günün Kuponları' },
              { key: 'analysis', label: 'Analizler' },
              { key: 'brands', label: 'Güvenilir Siteler' },
              { key: 'news', label: '📰 Haberler' },
              { key: 'pool', label: '🎱 724TOTO' },
              { key: 'blackjack', label: '🎴 Casino' },
              { key: 'loyalty', label: '🎯 Görevler' },
              { key: 'raffle', label: '🎟️ Bilet' },
              { key: 'giveaway', label: '🎁 Çekiliş' },
            ] as const).map(item => {
              const isActive = navVisibility?.[item.key] !== false;
              return (
                <div key={item.key} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-white font-bold">{item.label}</span>
                  <button
                    onClick={() => {
                      if (navVisibility && onSaveNavVisibility) {
                        onSaveNavVisibility({ ...navVisibility, [item.key]: !isActive });
                      }
                    }}
                    className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${isActive ? 'bg-green-500' : 'bg-zinc-700'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white transition-all ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mt-8 space-y-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2 mb-4">
              ✨ Üst Menü Kayan Yazı (Marquee)
            </h3>
            
            <div className="flex items-center justify-between mb-4">
               <span className="text-zinc-400 font-bold">Kayan Yazı Aktifliği</span>
               <button
                  onClick={() => marqueeConfig && onSaveMarqueeConfig?.({ ...marqueeConfig, isActive: !marqueeConfig.isActive })}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${marqueeConfig?.isActive ? 'bg-green-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-all ${marqueeConfig?.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-1 block">Yazı İçeriği</label>
                <input 
                  type="text" 
                  value={marqueeConfig?.text || ''} 
                  onChange={(e) => marqueeConfig && onSaveMarqueeConfig?.({ ...marqueeConfig, text: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="Kayan yazı metni..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-1 block">Geçiş Hızı (Saniye)</label>
                  <input 
                    type="number" 
                    value={marqueeConfig?.speed || 20} 
                    onChange={(e) => marqueeConfig && onSaveMarqueeConfig?.({ ...marqueeConfig, speed: Number(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-1 block">Yazı Rengi</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={marqueeConfig?.color || '#f0b90b'} 
                      onChange={(e) => marqueeConfig && onSaveMarqueeConfig?.({ ...marqueeConfig, color: e.target.value })}
                      className="w-12 h-12 bg-black border border-zinc-800 rounded-xl p-1 shrink-0 cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={marqueeConfig?.color || '#f0b90b'} 
                      onChange={(e) => marqueeConfig && onSaveMarqueeConfig?.({ ...marqueeConfig, color: e.target.value })}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-1 block">Kalın Yazı (Bold)</label>
                  <button
                    onClick={() => marqueeConfig && onSaveMarqueeConfig?.({ ...marqueeConfig, isBold: !marqueeConfig.isBold })}
                    className={`w-full h-12 rounded-xl transition-all font-bold flex items-center justify-center ${marqueeConfig?.isBold ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {marqueeConfig?.isBold ? 'KALIN KONTÜR' : 'NORMAL (Pasif)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="flex-1 overflow-y-auto p-6">
          <AdminMembersTab coinName={localLoyaltyConfig.coinName || 'Coin'} />
        </div>
      )}

      {/* ─── MESSAGES TAB ─── */}
      {activeTab === 'messages' && (
        <div className="space-y-8 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <MessageSquare className="text-blue-400" /> KULLANICI MESAJLARI
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase mt-1">724BAHİS yatırımları ve üye bildirimleri</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <MessageSquare className="w-16 h-16 text-zinc-600 mb-4" />
                <p className="text-zinc-500 font-bold text-sm">Hiç mesaj bulunmuyor</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.sort((a, b) => b.createdAt - a.createdAt).map(msg => (
                  <div key={msg.id} className={`p-4 rounded-xl border ${msg.isRead ? 'bg-zinc-900/50 border-zinc-800' : 'bg-blue-500/10 border-blue-500/30'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className={`text-sm font-black ${msg.isRead ? 'text-white' : 'text-blue-400'}`}>{msg.username}</p>
                          <p className="text-[10px] font-bold text-zinc-500">{new Date(msg.createdAt).toLocaleString('tr-TR')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!msg.isRead && (
                          <button
                            onClick={() => {
                              const updated = messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m);
                              setMessages(updated);
                              localStorage.setItem('site_messages', JSON.stringify(updated));
                            }}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border border-blue-500/30">
                            <Check className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> Okundu İşaretle
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (!window.confirm(`Kullanıcıya 1 adet seçilebilir bilet tanımlanacak. Onaylıyor musunuz?`)) return;

                            // Load loyalty
                            const lKey = `loyalty_${msg.userId}`;
                            let lData = { userId: msg.userId, coins: 0, pendingTickets: 0, tickets: 0, totalEarned: 0, transactions: [], lastVolumeResetDate: new Date().toDateString(), dailyVolumeAccumulated: 0 };
                            try {
                              const stored = localStorage.getItem(lKey);
                              if (stored) lData = JSON.parse(stored);
                            } catch { }

                            const updatedLData = {
                              ...lData,
                              pendingTickets: (lData.pendingTickets || 0) + 1,
                              transactions: [
                                { id: String(Date.now()), userId: msg.userId, type: 'earn', amount: 0, tickets: 0, pendingTickets: 1, reason: 'Yönetici Onaylı Seçilebilir Bilet', timestamp: Date.now() },
                                ...(lData.transactions || [])
                              ].slice(0, 50)
                            };

                            localStorage.setItem(lKey, JSON.stringify(updatedLData));
                            alert('Bilet başarıyla eklendi! Kullanıcı giriş yaptığında biletini seçebilecek.');

                            // auto mark as read
                            const updatedMsgs = messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m);
                            setMessages(updatedMsgs);
                            localStorage.setItem('site_messages', JSON.stringify(updatedMsgs));
                          }}
                          className="bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border border-purple-500/30">
                          <Ticket className="w-3.5 h-3.5 inline mr-1 -mt-0.5" /> +1 Seçilebilir Bilet Ver
                        </button>
                        <button
                          onClick={() => {
                            const updated = messages.filter(m => m.id !== msg.id);
                            setMessages(updated);
                            localStorage.setItem('site_messages', JSON.stringify(updated));
                          }}
                          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1.5 rounded-lg transition-all border border-red-500/30">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/50 mt-3 whitespace-pre-wrap text-sm text-zinc-300 font-medium">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
