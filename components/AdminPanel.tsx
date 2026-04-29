import React, { useState, useEffect, useRef } from 'react';
import { Settings, Image, Layout, Trophy, Users, Eye, EyeOff, Save, Plus, Sparkles, TrendingUp, AlertCircle, Clock, Box, Zap, Trash2, Search, Lock, Unlock, Timer, Gift, Ticket, RefreshCw, Activity, Check, MessageSquare, Palette, Star, CreditCard, ChevronLeft, LogOut, Calendar, ClipboardList, Edit3, Target, CheckCircle2, User, ChevronUp, ChevronDown, Layers } from 'lucide-react';
import { Brand, MatchAnalysis, Coupon, CouponMatch, WheelReward, WheelConfig, BlackjackConfig, LoyaltyConfig, EditorAccount, UserMessage, GiveawayConfig, MarqueeConfig, WelcomePopupConfig, LiveOddsConfig, LiveOddsMatch, SiteStatusConfig, HeroSliderConfig, HeroSlide, DailyKuponConfig, DailyKuponMatch, RaffleConfig, PopularBetsConfig, NewsSliderConfig, TVConfig, SportCategory } from '../types';
import AdminMembersTab from './AdminMembersTab';
import AdminPoolTab from './AdminPoolTab';
import AdminNewsTab from './AdminNewsTab';
import AdminGiveawayTab from './AdminGiveawayTab';
import AdminRaffleTab from './AdminRaffleTab';
import AdminPopularBetsTab from './AdminPopularBetsTab';
import AdminNewsSliderTab from './AdminNewsSliderTab';
import Admin724TVTab from './Admin724TVTab';
import { NavVisibility } from './Header';
import { supabase } from '../utils/supabase';
import { uploadImageToSupabase, resizeImage } from '../utils/imageUploader';

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
  siteStatusConfig?: SiteStatusConfig;
  onSaveSiteStatusConfig?: (config: SiteStatusConfig) => void;
  heroSliderConfig?: HeroSliderConfig;
  onSaveHeroSliderConfig?: (config: HeroSliderConfig) => void;
  dailyKuponConfig?: DailyKuponConfig;
  onSaveDailyKuponConfig?: (config: DailyKuponConfig) => void;
  raffleConfig?: RaffleConfig;
  onSaveRaffleConfig?: (config: RaffleConfig) => void;
  popularBetsConfig?: PopularBetsConfig;
  onSavePopularBetsConfig?: (config: PopularBetsConfig) => void;
  newsSliderConfig?: NewsSliderConfig;
  onSaveNewsSliderConfig?: (config: NewsSliderConfig) => void;
  tvConfig?: TVConfig;
  onSaveTvConfig?: (config: TVConfig) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  brands, hero, themeColor, hashtags, role, wheelConfig, bjConfig, loyaltyConfig,
  onSaveBrands, onSaveHero, onThemeChange, onHashtagsChange, onSaveWheelConfig, onSaveBjConfig, onSaveLoyaltyConfig, onLogout, onNavigateHome,
  giveawayConfig, onSaveGiveawayConfig,
  navVisibility, onSaveNavVisibility, marqueeConfig, onSaveMarqueeConfig,
  welcomePopupConfig, onSaveWelcomePopupConfig,
  liveOddsConfig, onSaveLiveOddsConfig,
  analyses, coupons, onSaveAnalyses, onSaveCoupons,
  siteStatusConfig, onSaveSiteStatusConfig,
  heroSliderConfig, onSaveHeroSliderConfig,
  dailyKuponConfig, onSaveDailyKuponConfig,
  raffleConfig, onSaveRaffleConfig,
  popularBetsConfig, onSavePopularBetsConfig,
  newsSliderConfig, onSaveNewsSliderConfig,
  tvConfig, onSaveTvConfig
}) => {
  const isAuthor = role.startsWith('author_');
  const isEditor = role.startsWith('editor');
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'seo' | 'analysis' | 'coupons' | 'wheel' | 'editors' | 'blackjack' | 'loyalty' | 'members' | 'messages' | 'pool' | 'news' | 'giveaway' | 'raffle' | 'visibility' | 'liveodds' | 'system' | 'popularbets' | 'newsslider' | '724tv'>(isAuthor || isEditor ? 'news' : 'content');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    site: false,
    betting: false,
    reward: false,
    content: false,
    admin: false
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };
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
  const [localLoyaltyConfig, setLocalLoyaltyConfig] = useState<LoyaltyConfig>(loyaltyConfig || { programName: '724BAHİS.NET Sadakat Programı', coinName: 'Coin', isActive: true, rules: [], marketItems: [] });
  const [localWelcomePopup, setLocalWelcomePopup] = useState<WelcomePopupConfig>(welcomePopupConfig || { isActive: true, title: '724BAHİS.NET', subtitle: '', offerMain: '', offerSub: '', buttonText: '', buttonLink: '' });

  const [localSiteStatus, setLocalSiteStatus] = useState<SiteStatusConfig>(siteStatusConfig || { isMaintenanceMode: false, maintenanceMessage: 'Sistemlerimizde bakım çalışması var.' });
  const [localMarquee, setLocalMarquee] = useState<MarqueeConfig>(marqueeConfig || { isActive: true, text: '', speed: 30, color: '#f0b90b', isBold: true });

  // Live Odds state
  const [localLiveOdds, setLocalLiveOdds] = useState<LiveOddsConfig>(() => {
    if (liveOddsConfig) {
      return { ...liveOddsConfig, matches: liveOddsConfig.matches || [] };
    }
    return { isActive: true, matches: [] };
  });

  // Hero Slider Local State
  const [localHeroSlider, setLocalHeroSlider] = useState<HeroSliderConfig>(
    heroSliderConfig || { isActive: true, autoPlayInterval: 5000, slides: [] }
  );

  // Daily Kupon Local State
  const [localDailyKupon, setLocalDailyKupon] = useState<DailyKuponConfig>(
    dailyKuponConfig || { isActive: true, title: 'GÜNÜN BANKO KUPONU', matches: [] }
  );

  const [localRaffleConfig, setLocalRaffleConfig] = useState<RaffleConfig>(
    raffleConfig || { drawDate: '2024-04-20T21:00:00', isActive: true, prizes: [], rules: [], faqs: [] }
  );

  const [localPopularBetsConfig, setLocalPopularBetsConfig] = useState<PopularBetsConfig>(
    popularBetsConfig || { isActive: true, bets: [] }
  );

  const [localNewsSliderConfig, setLocalNewsSliderConfig] = useState<NewsSliderConfig>(
    newsSliderConfig || { isActive: true, autoPlayInterval: 5000, slides: [] }
  );

  const [localTvConfig, setLocalTvConfig] = useState<TVConfig>(
    tvConfig || { isActive: true, channels: [], chatEnabled: true, tickerText: '' }
  );

  // New Management Local State
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);
  const [localAnalyses, setLocalAnalyses] = useState<MatchAnalysis[]>(analyses);
  const [editingAnalysisId, setEditingAnalysisId] = useState<string | null>(null);
  const [editAnalysisTab, setEditAnalysisTab] = useState<'basic' | 'details' | 'stats'>('basic');

  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(coupons);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  const [adminSport, setAdminSport] = useState<SportCategory>('Futbol');
  const [adminAnalysisDateFilter, setAdminAnalysisDateFilter] = useState<string>('');
  const [adminAnalysisLeagueFilter, setAdminAnalysisLeagueFilter] = useState<string>('');
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({});
  
  // AI Marquee Parser State
  const [showAiMarqueeParser, setShowAiMarqueeParser] = useState(false);
  const [aiMarqueeRawText, setAiMarqueeRawText] = useState('');

  // AI News Parsing Logic
  const handleAiMarqueeParse = () => {
    if (!aiMarqueeRawText.trim()) return;

    // Phrases commonly used by AI in introductions/summaries to be filtered out
    const filterPhrases = ['işte', 'haberler', 'listedim', 'özetledim', 'derledim', 'olarak', 'odaklı', 'şöyledir'];

    const lines = aiMarqueeRawText.split('\n')
      .map(l => l.trim())
      .filter(l => {
        if (l.length < 2) return false;
        const lower = l.toLowerCase();
        // If line is very long and contains "AI speak", filter it out
        if (lower.split(' ').length > 12 && filterPhrases.some(p => lower.includes(p))) return false;
        return true;
      });

    const processedItems: string[] = [];
    let currentCategory = '';

    lines.forEach(line => {
      if (line.match(/^(?:🦁|🟡🔵|⚪⚫|🇹🇷|🏆|⚽)/)) {
        currentCategory = line.toUpperCase();
      } else {
        const cleanLine = line.replace(/^\s*[-•*]\s*/, '');
        if (currentCategory) {
          processedItems.push(`${currentCategory}: ${cleanLine}`);
        } else {
          processedItems.push(cleanLine);
        }
      }
    });

    // Join with the user's suggested manual keyword separator for the premium logo
    const result = processedItems.join('. 724BAHİS.NET. ');
    
    setLocalMarquee({ ...localMarquee, text: result + '. 724BAHİS.NET' });
    
    setShowAiMarqueeParser(false);
    setAiMarqueeRawText('');
  };
  const [aiInput, setAiInput] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // Coupon AI States
  const [couponAiInput, setCouponAiInput] = useState('');
  const [showCouponAiModal, setShowCouponAiModal] = useState(false);
  const [couponRiskLevel, setCouponRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [couponAiDate, setCouponAiDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [couponAiCategory, setCouponAiCategory] = useState<SportCategory | 'Tümü'>('Tümü');

  // Live Odds Bulk States
  const [showLiveOddsBulkModal, setShowLiveOddsBulkModal] = useState(false);
  const [liveOddsBulkInput, setLiveOddsBulkInput] = useState('');

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
        { key: 'site_status', value: localSiteStatus },
        { key: 'site_hero_slider', value: heroSliderConfig },
        { key: 'site_daily_kupon', value: dailyKuponConfig },
        { key: 'site_raffle_config', value: raffleConfig },
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

  const handleLiveOddsBulkParse = () => {
    if (!liveOddsBulkInput.trim()) return;

    const lines = liveOddsBulkInput.split('\n');
    const newMatches: LiveOddsMatch[] = [];
    
    let currentLeague = 'Lig';
    let currentTime = '20:00';

    lines.forEach((line, index) => {
      const cleanLine = line.trim();
      if (!cleanLine) return;

      // Header control: "2. Bundesliga (Almanya) - 19:30"
      const headerMatch = cleanLine.match(/^(.+?)\s*-\s*(\d{1,2}:\d{2})$/);
      if (headerMatch) {
         currentLeague = headerMatch[1].trim();
         currentTime = headerMatch[2].trim();
         return; // Move to next line
      }

      // Match control: "Holstein Kiel - Kaiserslautern | MS1: 2.12 | MSX: 3.60 | MS2: 3.16"
      if (cleanLine.includes('|')) {
        const parts = cleanLine.split('|').map(p => p.trim());
        const teamPart = parts[0].split('-').map(t => t.trim());
        
        const homeTeam = teamPart[0] || 'Ev Sahibi';
        const awayTeam = teamPart[1] || 'Deplasman';
        
        // Helper to clean "MS1: 2.12" -> "2.12"
        const cleanVal = (val: string) => {
          if (!val) return '1.00';
          if (val.includes(':')) return val.split(':')[1].trim();
          return val;
        };

        // If explicitly formatted as Home - Away | League | Time | ... (Old format)
        // We detect it if parts[2] looks like a time
        const isOldFormat = parts.length >= 6 && parts[2].match(/\d{2}:\d{2}/);

        const league = isOldFormat ? parts[1] : currentLeague;
        const matchTime = isOldFormat ? parts[2] : currentTime;
        const odd1 = isOldFormat ? cleanVal(parts[3]) : cleanVal(parts[1]);
        const oddX = isOldFormat ? cleanVal(parts[4]) : cleanVal(parts[2]);
        const odd2 = isOldFormat ? cleanVal(parts[5]) : cleanVal(parts[3]);
        const link = (isOldFormat ? parts[6] : parts[4]) || 'https://t.ly/GercekLivo';

        newMatches.push({
          id: `${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          homeTeam,
          awayTeam,
          league,
          matchTime,
          odd1,
          oddX,
          odd2,
          isLive: false,
          link
        });
      }
    });

    if (newMatches.length > 0) {
      const updated = { ...localLiveOdds, matches: [...(localLiveOdds.matches || []), ...newMatches] };
      setLocalLiveOdds(updated);
      onSaveLiveOddsConfig?.(updated);
      setLiveOddsBulkInput('');
      setShowLiveOddsBulkModal(false);
      alert(`${newMatches.length} maç başarıyla eklendi!`);
    } else {
      alert('Geçerli formatta maç bulunamadı. Lütfen kontrol edin.\nFormat: Lig - Saat (Başlık) ve ardından Takım - Takım | MS1 | MSX | MS2');
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

  useEffect(() => {
    if (siteStatusConfig) setLocalSiteStatus(siteStatusConfig);
  }, [siteStatusConfig]);

  useEffect(() => {
    if (heroSliderConfig) setLocalHeroSlider(heroSliderConfig);
  }, [heroSliderConfig]);

  useEffect(() => {
    if (dailyKuponConfig) setLocalDailyKupon(dailyKuponConfig);
  }, [dailyKuponConfig]);

  useEffect(() => {
    if (raffleConfig) setLocalRaffleConfig(raffleConfig);
  }, [raffleConfig]);

  useEffect(() => {
    if (popularBetsConfig) setLocalPopularBetsConfig(popularBetsConfig);
  }, [popularBetsConfig]);

  useEffect(() => {
    if (marqueeConfig) setLocalMarquee(marqueeConfig);
  }, [marqueeConfig]);

  useEffect(() => {
    if (newsSliderConfig) setLocalNewsSliderConfig(newsSliderConfig);
  }, [newsSliderConfig]);

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

    if (onSaveBjConfig) onSaveBjConfig(localBjConfig);
    if (onSaveLoyaltyConfig) onSaveLoyaltyConfig(localLoyaltyConfig);
    if (onSaveWelcomePopupConfig) onSaveWelcomePopupConfig(localWelcomePopup);
    if (onSaveSiteStatusConfig) onSaveSiteStatusConfig(localSiteStatus);
    if (onSaveRaffleConfig) onSaveRaffleConfig(localRaffleConfig);
    if (onSaveMarqueeConfig) onSaveMarqueeConfig(localMarquee);
    if (onSaveLiveOddsConfig) onSaveLiveOddsConfig(localLiveOdds);
    if (onSaveHeroSliderConfig) onSaveHeroSliderConfig(localHeroSlider);
    if (onSaveDailyKuponConfig) onSaveDailyKuponConfig(localDailyKupon);
    if (onSavePopularBetsConfig) onSavePopularBetsConfig(localPopularBetsConfig);
    if (onSaveNewsSliderConfig) onSaveNewsSliderConfig(localNewsSliderConfig);
    if (onSaveTvConfig) onSaveTvConfig(localTvConfig);

    alert('Tüm sistem değişiklikleri kaydedildi!');
  };

  const handleAiParse = () => {
    if (!aiInput.trim()) return;

    try {
      let jsonStr = aiInput.trim();
      
      // Clean up markdown code blocks if the AI returned them
      if (jsonStr.startsWith('```json')) jsonStr = jsonStr.substring(7);
      else if (jsonStr.startsWith('```')) jsonStr = jsonStr.substring(3);
      if (jsonStr.endsWith('```')) jsonStr = jsonStr.substring(0, jsonStr.length - 3);
      jsonStr = jsonStr.trim();

      const parsedData = JSON.parse(jsonStr);
      
      const newAnalyses = (Array.isArray(parsedData) ? parsedData : [parsedData]).map((item: any) => ({
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        league: item.league || 'Genel Maçlar',
        homeTeam: item.homeTeam || 'Ev Sahibi',
        awayTeam: item.awayTeam || 'Deplasman',
        matchTime: item.matchTime || '20:00',
        matchDate: item.matchDate || new Date().toISOString().split('T')[0],
        analysis: item.analysis || '',
        tacticalSummary: item.tacticalSummary || '',
        breakingPoint: item.breakingPoint || '',
        bettingScenario: item.bettingScenario || '',
        prediction: item.prediction || '',
        confidence: Number(item.confidence) || 85,
        modelScore: Number(item.modelScore) || 90,
        recentHistory: item.recentHistory || '8 Kazanç',
        expectedGoals: item.expectedGoals || '3.1',
        bookieOdds: item.bookieOdds || [
          { name: '724BAHİS.NET', odd1: '1.70', odd2: '1.80', link: 'https://', isHighest: true },
          { name: 'BETKOM', odd1: '1.65', odd2: '1.75', link: 'https://' }
        ],
        createdAt: Date.now()
      }));

      const updated = [...newAnalyses, ...localAnalyses];
      setLocalAnalyses(updated);
      onSaveAnalyses(updated);
      setAiInput('');
      setShowAiModal(false);
      alert(`${newAnalyses.length} adet analiz başarıyla sisteme eklendi!`);
    } catch (err) {
      alert("HATA: Girdiğiniz metin geçerli bir JSON formatında değil. Lütfen AI'den gelen JSON verisini eksiksiz kopyaladığınızdan emin olun.");
    }
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
        editorId: role,
        category: couponAiCategory === 'Tümü' ? undefined : couponAiCategory
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

        <nav className="flex flex-col gap-3">
          {role === 'admin' && (
            <div className="bg-black/20 p-2 rounded-2xl border border-white/5 space-y-1 transition-all duration-300">
              <button 
                onClick={() => toggleGroup('site')}
                className="w-full flex items-center justify-between px-2 mt-1 mb-2 group"
              >
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest group-hover:text-zinc-300 transition-colors">SİTE & TASARIM</p>
                {expandedGroups.site ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.site && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button onClick={() => setActiveTab('content')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'content' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Layout className="w-3.5 h-3.5" /> İÇERİK YÖNETİMİ
                  </button>
                  <button onClick={() => setActiveTab('style')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'style' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Palette className="w-3.5 h-3.5" /> SİTE TASARIMI
                  </button>
                  <button onClick={() => setActiveTab('seo')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'seo' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Search className="w-3.5 h-3.5" /> SEO & HASHTAG
                  </button>
                  <button onClick={() => setActiveTab('visibility')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'visibility' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Eye className="w-3.5 h-3.5" /> SAYFA GÖRÜNÜRLÜĞÜ
                  </button>
                  <button onClick={() => setActiveTab('system')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'system' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Settings className="w-3.5 h-3.5" /> SİSTEM AYARLARI
                  </button>
                </div>
              )}
            </div>
          )}

          {!isAuthor && (
            <div className="bg-black/20 p-2 rounded-2xl border border-white/5 space-y-1 transition-all duration-300">
              <button 
                onClick={() => toggleGroup('betting')}
                className="w-full flex items-center justify-between px-2 mt-1 mb-2 group"
              >
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest group-hover:text-zinc-300 transition-colors">SPOR & BAHİS</p>
                {expandedGroups.betting ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.betting && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button onClick={() => setActiveTab('analysis')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'analysis' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <TrendingUp className="w-3.5 h-3.5" /> MAÇ ANALİZLERİ
                  </button>
                  <button onClick={() => setActiveTab('coupons')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'coupons' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Ticket className="w-3.5 h-3.5" /> GÜNÜN KUPONLARI
                  </button>
                  {role === 'admin' && (
                    <>
                      <button onClick={() => setActiveTab('liveodds')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'liveodds' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                        <Activity className="w-3.5 h-3.5" /> CANLI ORANLAR
                      </button>
                      <button onClick={() => setActiveTab('popularbets')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'popularbets' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                        <TrendingUp className="w-3.5 h-3.5" /> POPÜLER BAHİSLER
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {role === 'admin' && (
            <div className="bg-black/20 p-2 rounded-2xl border border-white/5 space-y-1 transition-all duration-300">
              <button 
                onClick={() => toggleGroup('reward')}
                className="w-full flex items-center justify-between px-2 mt-1 mb-2 group"
              >
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest group-hover:text-zinc-300 transition-colors">EĞLENCE & ÖDÜL</p>
                {expandedGroups.reward ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.reward && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button onClick={() => setActiveTab('blackjack')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'blackjack' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Zap className="w-3.5 h-3.5" /> CASINO 724
                  </button>
                  <button onClick={() => setActiveTab('pool')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'pool' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Trophy className="w-3.5 h-3.5" /> 724TOTO YÖNETİMİ
                  </button>
                  <button onClick={() => setActiveTab('giveaway')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'giveaway' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Gift className="w-3.5 h-3.5" /> ÇEKİLİŞ YÖNETİMİ
                  </button>
                  <button onClick={() => setActiveTab('raffle')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'raffle' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Ticket className="w-3.5 h-3.5" /> BİLET HAVUZU
                  </button>
                  <button onClick={() => setActiveTab('loyalty')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'loyalty' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Star className="w-3.5 h-3.5" /> SADAKAT / BİLET
                  </button>
                </div>
              )}
            </div>
          )}

          {(role === 'admin' || isAuthor || isEditor) && (
            <div className="bg-black/20 p-2 rounded-2xl border border-white/5 space-y-1 transition-all duration-300">
              <button 
                onClick={() => toggleGroup('content')}
                className="w-full flex items-center justify-between px-2 mt-1 mb-2 group"
              >
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest group-hover:text-zinc-300 transition-colors">İÇERİK BÖLÜMÜ</p>
                {expandedGroups.content ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.content && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button onClick={() => setActiveTab('news')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'news' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    📰 HABER YÖNETİMİ
                  </button>
                  {role === 'admin' && (
                    <>
                      <button onClick={() => setActiveTab('newsslider')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'newsslider' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                        <Layout className="w-3.5 h-3.5" /> GÜNDEM SLIDER
                      </button>
                      <button onClick={() => setActiveTab('724tv')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === '724tv' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                        <Layers className="w-3.5 h-3.5" /> 724TV
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {role === 'admin' && (
            <div className="bg-black/20 p-2 rounded-2xl border border-white/5 space-y-1 transition-all duration-300">
              <button 
                onClick={() => toggleGroup('admin')}
                className="w-full flex items-center justify-between px-2 mt-1 mb-2 group"
              >
                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest group-hover:text-zinc-300 transition-colors">YÖNETİM & DESTEK</p>
                {expandedGroups.admin ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.admin && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  <button onClick={() => setActiveTab('members')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'members' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <Users className="w-3.5 h-3.5" /> ÜYELER
                  </button>
                  <button onClick={() => setActiveTab('payment')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'payment' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <CreditCard className="w-3.5 h-3.5" /> ÖDEMELER
                  </button>
                  <button onClick={() => setActiveTab('editors')} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors font-bold text-[11px] w-full ${activeTab === 'editors' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}>
                    <User className="w-3.5 h-3.5" /> EDİTÖRLER
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex justify-between items-center p-2.5 rounded-xl text-[11px] font-bold transition-all w-full
                    ${activeTab === 'messages' ? 'bg-[#f0b90b] text-black shadow-lg shadow-[#f0b90b]/20' : 'text-zinc-400 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-3.5 h-3.5" /> MESAJLAR
                    </div>
                    {unreadCount > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                  </button>
                </div>
              )}
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

      <main ref={mainRef} className="flex-1 p-4 md:p-6 overflow-y-auto max-h-screen">
        {activeTab === 'content' && (
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-black mb-6 flex items-center gap-3">HERO (ANA SPONSOR)</h2>
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <input value={localHero.name} onChange={(e) => setLocalHero({ ...localHero, name: e.target.value })} className="bg-black border border-zinc-800 rounded-xl p-3" placeholder="Marka Adı" />
                <input value={localHero.logo} onChange={(e) => setLocalHero({ ...localHero, logo: e.target.value })} className="bg-black border border-zinc-800 rounded-xl p-3" placeholder="Logo URL" />
                <input value={localHero.offerMain} onChange={(e) => setLocalHero({ ...localHero, offerMain: e.target.value })} className="bg-black border border-zinc-800 rounded-xl p-3 text-primary font-black" placeholder="Teklif" />
                <input value={localHero.offerSub} onChange={(e) => setLocalHero({ ...localHero, offerSub: e.target.value })} className="bg-black border border-zinc-800 rounded-xl p-3" placeholder="Alt Metin" />
              </div>
            </section>
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black">MARKALAR (GRID)</h2>
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

            <section className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f0b90b]/5 blur-3xl rounded-full" />
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f0b90b]/10 rounded-2xl flex items-center justify-center border border-[#f0b90b]/20">
                    <Zap className="w-6 h-6 text-[#f0b90b]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic uppercase tracking-tighter">Açılış Pop-up Yönetimi</h2>
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
                    placeholder="Örn: 724BAHİS.NET"
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

            {/* ═══ HERO SLIDER MANAGEMENT ═══ */}
            <section className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full" />
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                    <Layers className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic uppercase tracking-tighter">Hero Slider Yönetimi</h2>
                    <p className="text-zinc-500 text-xs font-bold mt-1">Ana sayfadaki banner slider görsellerini ve yönlendirme linklerini yönetin.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
                    <button
                      onClick={() => {
                        const u = { ...localHeroSlider, isActive: true };
                        setLocalHeroSlider(u);
                        onSaveHeroSliderConfig?.(u);
                      }}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${localHeroSlider.isActive ? 'bg-green-500 text-black' : 'text-zinc-500'}`}
                    >AKTİF</button>
                    <button
                      onClick={() => {
                        const u = { ...localHeroSlider, isActive: false };
                        setLocalHeroSlider(u);
                        onSaveHeroSliderConfig?.(u);
                      }}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!localHeroSlider.isActive ? 'bg-red-500 text-white' : 'text-zinc-500'}`}
                    >PASİF</button>
                  </div>
                </div>
              </div>

              {/* Auto-play interval */}
              <div className="mb-6 flex items-center gap-4">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest shrink-0">Otomatik Geçiş (ms)</label>
                <input
                  type="number"
                  value={localHeroSlider.autoPlayInterval}
                  onChange={(e) => setLocalHeroSlider({ ...localHeroSlider, autoPlayInterval: parseInt(e.target.value) || 5000 })}
                  className="bg-black border border-zinc-800 rounded-xl p-3 w-32 text-sm font-bold"
                  min={1000}
                  step={500}
                />
              </div>

              {/* Add Slide Button */}
              <button
                onClick={() => {
                  const newSlide: HeroSlide = {
                    id: Date.now().toString(),
                    imageUrl: '',
                    link: '',
                    title: 'Yeni Slide',
                    isActive: true,
                    order: localHeroSlider.slides.length
                  };
                  setLocalHeroSlider({ ...localHeroSlider, slides: [...localHeroSlider.slides, newSlide] });
                }}
                className="mb-6 flex items-center gap-2 px-5 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" /> YENİ SLİDE EKLE
              </button>

              {/* Slides List */}
              <div className="space-y-4">
                {localHeroSlider.slides
                  .sort((a, b) => a.order - b.order)
                  .map((slide, idx) => (
                  <div key={slide.id} className={`bg-black/40 border rounded-2xl p-5 space-y-4 transition-all ${slide.isActive ? 'border-purple-500/20' : 'border-zinc-800 opacity-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 font-black text-sm">{idx + 1}</span>
                        <span className="text-sm font-black text-white">{slide.title || 'İsimsiz Slide'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Move Up */}
                        <button
                          onClick={() => {
                            if (idx === 0) return;
                            const slides = [...localHeroSlider.slides].sort((a, b) => a.order - b.order);
                            const temp = slides[idx].order;
                            slides[idx].order = slides[idx - 1].order;
                            slides[idx - 1].order = temp;
                            setLocalHeroSlider({ ...localHeroSlider, slides });
                          }}
                          className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
                          title="Yukarı Taşı"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        {/* Move Down */}
                        <button
                          onClick={() => {
                            const sorted = [...localHeroSlider.slides].sort((a, b) => a.order - b.order);
                            if (idx >= sorted.length - 1) return;
                            const temp = sorted[idx].order;
                            sorted[idx].order = sorted[idx + 1].order;
                            sorted[idx + 1].order = temp;
                            setLocalHeroSlider({ ...localHeroSlider, slides: sorted });
                          }}
                          className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all"
                          title="Aşağı Taşı"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        {/* Toggle Active */}
                        <button
                          onClick={() => {
                            const slides = localHeroSlider.slides.map(s =>
                              s.id === slide.id ? { ...s, isActive: !s.isActive } : s
                            );
                            setLocalHeroSlider({ ...localHeroSlider, slides });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${slide.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
                        >
                          {slide.isActive ? 'AKTİF' : 'PASİF'}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => {
                            setLocalHeroSlider({
                              ...localHeroSlider,
                              slides: localHeroSlider.slides.filter(s => s.id !== slide.id)
                            });
                          }}
                          className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Başlık</label>
                        <input
                          value={slide.title}
                          onChange={(e) => {
                            const slides = localHeroSlider.slides.map(s =>
                              s.id === slide.id ? { ...s, title: e.target.value } : s
                            );
                            setLocalHeroSlider({ ...localHeroSlider, slides });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold focus:border-purple-500/50 transition-all"
                          placeholder="Slide Başlığı"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Yönlendirme Linki (href)</label>
                        <input
                          value={slide.link}
                          onChange={(e) => {
                            const slides = localHeroSlider.slides.map(s =>
                              s.id === slide.id ? { ...s, link: e.target.value } : s
                            );
                            setLocalHeroSlider({ ...localHeroSlider, slides });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold focus:border-purple-500/50 transition-all"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Görsel Yükle (veya URL)</label>
                      <div className="flex gap-2 items-center">
                        <label className={`flex-shrink-0 cursor-pointer w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:border-purple-500/50 transition-all ${uploadingSlideId === slide.id ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingSlideId === slide.id ? (
                            <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                          ) : (
                            <Image className="w-5 h-5 text-purple-400" />
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingSlideId(slide.id);
                              try {
                                const resizedBlob = await resizeImage(file, 1600, 800);
                                const fileName = `slider_${Date.now()}.jpg`;
                                const { url, error } = await uploadImageToSupabase(resizedBlob, 'slider-images', fileName);
                                if (url) {
                                  const slides = localHeroSlider.slides.map(s =>
                                    s.id === slide.id ? { ...s, imageUrl: url } : s
                                  );
                                  setLocalHeroSlider({ ...localHeroSlider, slides });
                                } else {
                                  console.error('Supabase Upload Error:', error);
                                  alert(`Görsel yüklenemedi: ${error?.message || 'Bilinmeyen hata'} (Kod: ${error?.code || 'N/A'}). Lütfen Supabase Storage bucket ayarlarını ve RLS politikalarını kontrol edin.`);
                                }
                              } catch (err) {
                                console.error('Upload Error:', err);
                                alert('Görsel hazırlanırken hata oluştu (Boyutlandırma veya Canvas hatası).');
                              } finally {
                                setUploadingSlideId(null);
                              }
                            }}
                          />
                        </label>
                        <input
                          value={slide.imageUrl}
                          onChange={(e) => {
                            const slides = localHeroSlider.slides.map(s =>
                              s.id === slide.id ? { ...s, imageUrl: e.target.value } : s
                            );
                            setLocalHeroSlider({ ...localHeroSlider, slides });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold focus:border-purple-500/50 transition-all"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      {slide.imageUrl && (
                        <div className="mt-2 rounded-xl overflow-hidden border border-zinc-800 max-h-32 relative group">
                          {uploadingSlideId === slide.id && (
                             <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-10 rounded-xl">
                               <RefreshCw className="w-6 h-6 text-purple-500 animate-spin" />
                             </div>
                          )}
                          <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save Slider */}
              <button
                onClick={() => {
                  onSaveHeroSliderConfig?.(localHeroSlider);
                  alert('Slider ayarları kaydedildi!');
                }}
                className="mt-6 w-full py-4 bg-purple-500 hover:bg-purple-400 text-white font-black text-sm rounded-2xl uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> SLIDER KAYDET
              </button>
            </section>

            {/* ═══ BANKO KUPON MANAGEMENT ═══ */}
            <section className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                    <Trophy className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic uppercase tracking-tighter">Banko Kupon Yönetimi</h2>
                    <p className="text-zinc-500 text-xs font-bold mt-1">Hero Section'daki "Günün Banko Kuponu" kartındaki maçları yönetin.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-black/40 p-1 rounded-xl border border-zinc-800">
                    <button
                      onClick={() => {
                        const u = { ...localDailyKupon, isActive: true };
                        setLocalDailyKupon(u);
                        onSaveDailyKuponConfig?.(u);
                      }}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${localDailyKupon.isActive ? 'bg-green-500 text-black' : 'text-zinc-500'}`}
                    >AKTİF</button>
                    <button
                      onClick={() => {
                        const u = { ...localDailyKupon, isActive: false };
                        setLocalDailyKupon(u);
                        onSaveDailyKuponConfig?.(u);
                      }}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!localDailyKupon.isActive ? 'bg-red-500 text-white' : 'text-zinc-500'}`}
                    >PASİF</button>
                  </div>
                </div>
              </div>

              {/* Kupon Title and Play Link */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Kupon Başlığı</label>
                  <input
                    value={localDailyKupon.title}
                    onChange={(e) => setLocalDailyKupon({ ...localDailyKupon, title: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm font-bold text-[#f5c518] focus:border-emerald-500/50 transition-all"
                    placeholder="GÜNÜN BANKO KUPONU"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Hemen Oyna Botunu Linki</label>
                  <input
                    value={localDailyKupon.playLink || ''}
                    onChange={(e) => setLocalDailyKupon({ ...localDailyKupon, playLink: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm font-bold text-emerald-400 focus:border-emerald-500/50 transition-all"
                    placeholder="https://tracker.canlibahis365.net/..."
                  />
                </div>
              </div>

              {/* Add Match Button */}
              <button
                onClick={() => {
                  const newMatch: DailyKuponMatch = {
                    id: Date.now().toString(),
                    homeTeam: '',
                    awayTeam: '',
                    prediction: '',
                    odd: '1.50',
                    league: ''
                  };
                  setLocalDailyKupon({ ...localDailyKupon, matches: [...localDailyKupon.matches, newMatch] });
                }}
                className="mb-6 flex items-center gap-2 px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" /> YENİ MAÇ EKLE
              </button>

              {/* Matches List */}
                <div className="space-y-1">
                {localDailyKupon.matches.map((match, idx) => (
                  <div key={match.id} className="bg-black/20 border border-zinc-800/50 rounded-lg p-2 space-y-2 transition-all hover:bg-black/40">
                    <div className="flex items-center justify-between border-b border-zinc-800/50 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-emerald-500/10 rounded-md flex items-center justify-center text-emerald-400 font-black text-[9px]">{idx + 1}</span>
                        <span className="text-sm font-black text-white">
                          {match.homeTeam && match.awayTeam ? `${match.homeTeam} vs ${match.awayTeam}` : 'Yeni Maç'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setLocalDailyKupon({
                            ...localDailyKupon,
                            matches: localDailyKupon.matches.filter(m => m.id !== match.id)
                          });
                        }}
                        className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Ev Sahibi</label>
                        <input
                          value={match.homeTeam}
                          onChange={(e) => {
                            const matches = localDailyKupon.matches.map(m =>
                              m.id === match.id ? { ...m, homeTeam: e.target.value } : m
                            );
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold focus:border-emerald-500/50 transition-all"
                          placeholder="Galatasaray"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Deplasman</label>
                        <input
                          value={match.awayTeam}
                          onChange={(e) => {
                            const matches = localDailyKupon.matches.map(m =>
                              m.id === match.id ? { ...m, awayTeam: e.target.value } : m
                            );
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold focus:border-emerald-500/50 transition-all"
                          placeholder="Fenerbahçe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Lig</label>
                        <input
                          value={match.league || ''}
                          onChange={(e) => {
                            const matches = localDailyKupon.matches.map(m =>
                              m.id === match.id ? { ...m, league: e.target.value } : m
                            );
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold focus:border-emerald-500/50 transition-all"
                          placeholder="Süper Lig"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tahmin</label>
                        <input
                          value={match.prediction}
                          onChange={(e) => {
                            const matches = localDailyKupon.matches.map(m =>
                              m.id === match.id ? { ...m, prediction: e.target.value } : m
                            );
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold focus:border-emerald-500/50 transition-all"
                          placeholder="M.S 1"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Oran</label>
                        <input
                          value={match.odd}
                          onChange={(e) => {
                            const matches = localDailyKupon.matches.map(m =>
                              m.id === match.id ? { ...m, odd: e.target.value } : m
                            );
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-[#00ff88] focus:border-emerald-500/50 transition-all"
                          placeholder="1.85"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {localDailyKupon.matches.length === 0 && (
                  <div className="text-center py-12 rounded-2xl bg-black/20 border border-dashed border-zinc-800">
                    <Trophy className="w-10 h-10 mx-auto mb-3 text-zinc-700" />
                    <p className="text-zinc-600 text-sm font-bold">Henüz maç eklenmedi.</p>
                    <p className="text-zinc-700 text-xs mt-1">Yukarıdaki butona tıklayarak maç ekleyin.</p>
                  </div>
                )}
              </div>

              {/* Total Odd Preview */}
              {localDailyKupon.matches.length > 0 && (
                <div className="mt-6 p-4 bg-black/40 border border-emerald-500/10 rounded-2xl flex items-center justify-between">
                  <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">TOPLAM ORAN ÖNİZLEME</span>
                  <span className="text-xl font-black text-[#00ff88] italic" style={{ textShadow: '0 0 15px rgba(0,255,136,0.3)' }}>
                    {localDailyKupon.matches.reduce((acc, m) => acc * parseFloat(m.odd || '1'), 1).toFixed(2)}
                    <span className="text-sm text-[#f5c518] ml-1 not-italic">x</span>
                  </span>
                </div>
              )}

              {/* Save Kupon */}
              <button
                onClick={() => {
                  onSaveDailyKuponConfig?.(localDailyKupon);
                  alert('Banko Kupon ayarları kaydedildi!');
                }}
                className="mt-6 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-2xl uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> BANKO KUPON KAYDET
              </button>
            </section>

          </div>
        )}

        {/* ═══ LIVE ODDS MANAGEMENT ═══ */}
        {activeTab === 'liveodds' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">Canlı Oran Yönetimi</h2>
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
                <button
                  onClick={() => setShowLiveOddsBulkModal(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all text-xs mr-4"
                >
                  <Layers className="w-4 h-4" /> TOPLU MAÇ EKLE
                </button>

                <div className="flex flex-col gap-1.5 min-w-[140px] px-4 py-2 bg-black/40 rounded-2xl border border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Kayan Hız</span>
                    <span className="text-[10px] font-black text-green-400">{localLiveOdds.speed || 6}s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="0.5"
                    value={localLiveOdds.speed || 6}
                    onChange={(e) => {
                      const speed = parseFloat(e.target.value);
                      const u = { ...localLiveOdds, speed };
                      setLocalLiveOdds(u);
                      onSaveLiveOddsConfig?.(u);
                    }}
                    className="w-full accent-green-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-zinc-600 font-bold uppercase">
                    <span>Hızlı</span>
                    <span>Yavaş</span>
                  </div>
                </div>
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

        {/* Live Odds Bulk Modal */}
        {showLiveOddsBulkModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-blue-500/20 p-5 rounded-3xl max-w-2xl w-full shadow-[0_0_50px_rgba(59,130,246,0.1)] relative">
              <button
                onClick={() => setShowLiveOddsBulkModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase">Toplu Maç Ekleme</h3>
                  <p className="text-zinc-400 text-sm mt-1">Maçları alt alta yapıştırarak hızlıca ekleyin.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest">Beklenen Format:</h4>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Ev Sahibi - Deplasman | Lig | Saat | 1 | X | 2 | Link
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-2 italic">
                    Örnek: Galatasaray - Fenerbahçe | Süper Lig | 21:00 | 2.10 | 3.40 | 3.25 | https://724bahis.net
                  </p>
                </div>

                <textarea
                  value={liveOddsBulkInput}
                  onChange={(e) => setLiveOddsBulkInput(e.target.value)}
                  placeholder="Maçları buraya yapıştırın..."
                  className="w-full h-48 bg-black border border-zinc-800 rounded-3xl p-6 text-white text-sm focus:border-blue-500/50 transition-all outline-none resize-none"
                />

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLiveOddsBulkModal(false)}
                    className="flex-1 py-4 rounded-2xl border border-zinc-800 text-zinc-400 font-black text-xs uppercase tracking-widest hover:bg-zinc-900 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleLiveOddsBulkParse}
                    className="flex-[2] py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
                  >
                    Maçları Sisteme Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Coupon Modal */}
        {showCouponAiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-[#f0b90b]/20 p-5 rounded-3xl max-w-2xl w-full shadow-[0_0_50px_rgba(240,185,11,0.1)] relative">
              <button
                onClick={() => setShowCouponAiModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f0b90b] to-yellow-600 flex items-center justify-center shadow-[0_0_30px_rgba(240,185,11,0.3)]">
                  <Zap className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase">AI KUPON ÜRETİCİ</h3>
                  <p className="text-zinc-400 text-sm mt-1">Metni yapıştırın ve risk seviyesini seçerek anında özel kupon üretin.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-zinc-500 uppercase flex items-center gap-2">
                      <Ticket className="w-4 h-4" /> KUPON RİSK SEVİYESİ
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setCouponRiskLevel('LOW')}
                        className={`py-3 rounded-xl border font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 ${couponRiskLevel === 'LOW' ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                      >
                        <span className="text-xs">DÜŞÜK</span><span className="text-[8px] opacity-70">(KASA)</span>
                      </button>
                      <button
                        onClick={() => setCouponRiskLevel('MEDIUM')}
                        className={`py-3 rounded-xl border font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 ${couponRiskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                      >
                        <span className="text-xs">ORTA</span><span className="text-[8px] opacity-70">(İDEAL)</span>
                      </button>
                      <button
                        onClick={() => setCouponRiskLevel('HIGH')}
                        className={`py-3 rounded-xl border font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 ${couponRiskLevel === 'HIGH' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                      >
                        <span className="text-xs">YÜKSEK</span><span className="text-[8px] opacity-70">(SÜRPRİZ)</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black text-zinc-500 uppercase flex items-center gap-2">
                      KATEGORİ (OPSİYONEL)
                    </label>
                    <select
                      value={couponAiCategory}
                      onChange={(e) => setCouponAiCategory(e.target.value as any)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-[14px] text-sm focus:border-[#f0b90b] transition-all outline-none"
                    >
                      <option value="Tümü">Karışık (Belirtilmemiş)</option>
                      <option value="Futbol">Futbol</option>
                      <option value="Basketbol">Basketbol</option>
                      <option value="Formula 1">Formula 1</option>
                      <option value="MotoGP">MotoGP</option>
                      <option value="Superbike">Superbike</option>
                      <option value="Tenis">Tenis</option>
                    </select>
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
          <div className="space-y-4 animate-fade-in">
            {!editingCouponId ? (
              // --- MASTER VIEW (LIST) ---
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
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
                              const sorted = [...localCoupons].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                              setLocalCoupons(sorted);
                              onSaveCoupons(sorted);
                              localStorage.setItem('site_coupons', JSON.stringify(sorted));
                              alert('Kupon başarıyla güncellendi ve tarihe göre sıralandı!');
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

                      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase">KATEGORİ</label>
                            <select
                              value={coupon.category || 'Tümü'}
                              onChange={(e) => {
                                const updated = [...localCoupons];
                                updated[idx].category = e.target.value === 'Tümü' ? undefined : (e.target.value as SportCategory);
                                setLocalCoupons(updated);
                              }}
                              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm focus:border-[#f0b90b] transition-all outline-none"
                            >
                              <option value="Tümü">Karışık / Belirtilmemiş</option>
                              <option value="Futbol">Futbol</option>
                              <option value="Basketbol">Basketbol</option>
                              <option value="Formula 1">Formula 1</option>
                              <option value="MotoGP">MotoGP</option>
                              <option value="Superbike">Superbike</option>
                              <option value="Tenis">Tenis</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 text-[#f0b90b]" /> KUPON TARİHİ
                            </label>
                            <input 
                              type="date"
                              value={coupon.date} 
                              onChange={(e) => {
                                const updated = [...localCoupons]; updated[idx].date = e.target.value; setLocalCoupons(updated);
                              }} 
                              className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-sm focus:border-[#f0b90b] transition-all outline-none text-white [color-scheme:dark]" 
                            />
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
          <div className="space-y-4 animate-fade-in">
            {!editingAnalysisId ? (
              // --- MASTER VIEW (LIST) ---
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-white flex items-center gap-3">
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
                        const dates = ['2026-04-28', '2026-04-29', '2026-04-30'];
                        const updatedAnalyses = localAnalyses.map((analysis, index) => ({
                          ...analysis,
                          matchDate: dates[index % dates.length]
                        }));
                        setLocalAnalyses(updatedAnalyses);
                        onSaveAnalyses(updatedAnalyses);
                        alert('Analiz tarihleri 28, 29 ve 30 Nisan olarak eşit şekilde dağıtıldı!');
                      }}
                      className="bg-zinc-800 text-zinc-400 font-black px-4 py-3 rounded-2xl flex items-center gap-2 hover:bg-zinc-700 transition-all active:scale-95 text-xs uppercase border border-zinc-700/50"
                    >
                      <Calendar className="w-4 h-4" /> TARİHLERİ DAĞIT
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
                            { name: '724BAHİS.NET', odd1: '1.72', odd2: '1.85', link: 'https://' },
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
                <div className="space-y-4 relative pb-20">
                  {/* Sport-Themed Ambient Glow */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none transition-all duration-700 z-0 rounded-3xl"
                    style={{
                      background: adminSport === 'Futbol'
                        ? 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)'
                        : 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(228,81,11,0.08) 0%, transparent 70%)'
                    }}
                  />

                  {/* Sport Toggle & Filters */}
                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => { setAdminSport('Futbol'); setAdminAnalysisLeagueFilter(''); setAdminAnalysisDateFilter(''); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black uppercase transition-all duration-300 ${adminSport === 'Futbol'
                          ? 'bg-[#f0b90b] text-black shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                          }`}
                      >
                        <span className="text-xs">⚽</span> <span className="text-[9px]">Futbol</span>
                      </button>
                      <button
                        onClick={() => { setAdminSport('Basketbol'); setAdminAnalysisLeagueFilter(''); setAdminAnalysisDateFilter(''); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black uppercase transition-all duration-300 ${adminSport === 'Basketbol'
                          ? 'bg-[#E4510B] text-white shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                          }`}
                      >
                        <span className="text-xs">🏀</span> <span className="text-[9px]">Basketbol</span>
                      </button>
                      <button
                        onClick={() => { setAdminSport('Formula 1'); setAdminAnalysisLeagueFilter(''); setAdminAnalysisDateFilter(''); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black uppercase transition-all duration-300 ${adminSport === 'Formula 1'
                          ? 'bg-[#f0b90b] text-black shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                          }`}
                      >
                        <span className="text-xs">🏎️</span> <span className="text-[9px]">F1</span>
                      </button>
                      <button
                        onClick={() => { setAdminSport('MotoGP'); setAdminAnalysisLeagueFilter(''); setAdminAnalysisDateFilter(''); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black uppercase transition-all duration-300 ${adminSport === 'MotoGP'
                          ? 'bg-[#f0b90b] text-black shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                          }`}
                      >
                        <span className="text-xs">🏍️</span> <span className="text-[9px]">MotoGP</span>
                      </button>
                      <button
                        onClick={() => { setAdminSport('Superbike'); setAdminAnalysisLeagueFilter(''); setAdminAnalysisDateFilter(''); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black uppercase transition-all duration-300 ${adminSport === 'Superbike'
                          ? 'bg-[#f0b90b] text-black shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                          }`}
                      >
                        <span className="text-xs">🏍️</span> <span className="text-[9px]">SBK</span>
                      </button>
                      <button
                        onClick={() => { setAdminSport('Tenis'); setAdminAnalysisLeagueFilter(''); setAdminAnalysisDateFilter(''); }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black uppercase transition-all duration-300 ${adminSport === 'Tenis'
                          ? 'bg-[#f0b90b] text-black shadow-md'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800'
                          }`}
                      >
                        <span className="text-xs">🎾</span> <span className="text-[9px]">Tenis</span>
                      </button>
                    </div>

                    {/* League & Date Filters */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative group">
                        <select 
                          value={adminAnalysisLeagueFilter}
                          onChange={(e) => setAdminAnalysisLeagueFilter(e.target.value)}
                          className="bg-black/40 border border-zinc-800 text-zinc-300 text-[10px] font-black uppercase px-4 py-2 rounded-xl outline-none focus:border-[#f0b90b]/50 transition-all cursor-pointer appearance-none pr-8 min-w-[140px]"
                        >
                          <option value="">TÜM LİGLER</option>
                          {Array.from(new Set(localAnalyses.filter(a => {
                            if (adminSport === 'Basketbol') return a.sport === 'Basketbol' || a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague');
                            if (adminSport === 'Futbol') return (!a.sport || a.sport === 'Futbol') && !(a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague'));
                            return a.sport === adminSport;
                          }).map(a => a.league))).sort().map(league => (
                            <option key={league} value={league}>{league}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                      </div>

                      <div className="relative group">
                        <select 
                          value={adminAnalysisDateFilter}
                          onChange={(e) => setAdminAnalysisDateFilter(e.target.value)}
                          className="bg-black/40 border border-zinc-800 text-zinc-300 text-[10px] font-black uppercase px-4 py-2 rounded-xl outline-none focus:border-[#f0b90b]/50 transition-all cursor-pointer appearance-none pr-8 min-w-[140px]"
                        >
                          <option value="">TÜM TARİHLER</option>
                          {Array.from(new Set(localAnalyses.filter(a => {
                            if (adminSport === 'Basketbol') return a.sport === 'Basketbol' || a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague');
                            if (adminSport === 'Futbol') return (!a.sport || a.sport === 'Futbol') && !(a.league.toLowerCase().includes('nba') || a.league.toLowerCase().includes('basket') || a.league.toLowerCase().includes('euroleague'));
                            return a.sport === adminSport;
                          }).map(a => a.matchDate))).sort().map((date: any) => (
                            <option key={date} value={date}>{(date as string).split('-').reverse().join('.')}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                      </div>

                      {(adminAnalysisLeagueFilter || adminAnalysisDateFilter) && (
                        <button 
                          onClick={() => { setAdminAnalysisLeagueFilter(''); setAdminAnalysisDateFilter(''); }}
                          className="text-[9px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors flex items-center gap-1 px-2 py-2"
                        >
                          <RefreshCw className="w-3 h-3" /> TEMİZLE
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 space-y-6">
                    {(() => {
                      const sportConfig = {
                        'Futbol': { icon: '⚽', colorClassName: 'text-[#f0b90b]', bgClassName: 'bg-emerald-500/10 border-emerald-500/20', lineBg: 'bg-[#f0b90b]' },
                        'Basketbol': { icon: '🏀', colorClassName: 'text-orange-500', bgClassName: 'bg-orange-500/10 border-orange-500/20', lineBg: 'bg-orange-500' },
                        'Formula 1': { icon: '🏎️', colorClassName: 'text-[#f0b90b]', bgClassName: 'bg-red-500/10 border-red-500/20', lineBg: 'bg-[#f0b90b]' },
                        'MotoGP': { icon: '🏍️', colorClassName: 'text-[#f0b90b]', bgClassName: 'bg-blue-500/10 border-blue-500/20', lineBg: 'bg-[#f0b90b]' },
                        'Superbike': { icon: '🏍️', colorClassName: 'text-[#f0b90b]', bgClassName: 'bg-teal-500/10 border-teal-500/20', lineBg: 'bg-[#f0b90b]' },
                        'Tenis': { icon: '🎾', colorClassName: 'text-[#f0b90b]', bgClassName: 'bg-green-500/10 border-green-500/20', lineBg: 'bg-[#f0b90b]' },
                      };
                      
                      const currentConfig = sportConfig[adminSport as keyof typeof sportConfig] || sportConfig['Futbol'];

                      const groups = localAnalyses
                        .filter(a => 
                          a.homeTeam && a.awayTeam && a.homeTeam !== 'A' && a.awayTeam !== 'A' &&
                          a.league && a.league.length < 80 && 
                          a.matchDate >= '2026-04-09' && // START FRESH
                          !a.league.includes('Boluspor orta sıralarda') &&
                          !a.league.includes('Porto Dragao')
                        )
                        .sort((a, b) => {
                          if (a.matchDate !== b.matchDate) return a.matchDate.localeCompare(b.matchDate);
                          return a.matchTime.localeCompare(b.matchTime);
                        })
                        .reduce((acc, analysis) => {
                          if (!acc[analysis.league]) acc[analysis.league] = [];
                          acc[analysis.league].push(analysis);
                          return acc;
                        }, {} as Record<string, MatchAnalysis[]>);

                      const filteredGroups: Record<string, MatchAnalysis[]> = {};

                        Object.keys(groups).forEach(league => {
                          const sampleAnalysis = groups[league][0];
                          let matchesSport = false;
                          if (adminSport === 'Basketbol') {
                             matchesSport = sampleAnalysis.sport === 'Basketbol' || sampleAnalysis.league.toLowerCase().includes('nba') || sampleAnalysis.league.toLowerCase().includes('basket') || sampleAnalysis.league.toLowerCase().includes('euroleague');
                          } else if (adminSport === 'Futbol') {
                             matchesSport = (!sampleAnalysis.sport || sampleAnalysis.sport === 'Futbol') && !(sampleAnalysis.league.toLowerCase().includes('nba') || sampleAnalysis.league.toLowerCase().includes('basket') || sampleAnalysis.league.toLowerCase().includes('euroleague'));
                          } else {
                             matchesSport = sampleAnalysis.sport === adminSport;
                          }
                          
                          if (matchesSport) {
                             // Apply Date and League filters
                             if (adminAnalysisLeagueFilter && league !== adminAnalysisLeagueFilter) return;
                             
                             const filteredItems = groups[league].filter(a => {
                               if (adminAnalysisDateFilter && a.matchDate !== adminAnalysisDateFilter) return false;
                               return true;
                             });
                             
                             if (filteredItems.length > 0) {
                               filteredGroups[league] = filteredItems;
                             }
                          }
                        });

                      const renderMatchRow = (analysis: MatchAnalysis) => (
                        <div key={analysis.id} className="group odd:bg-black/10 even:bg-white/[0.02] border-b border-white/[0.03] last:border-0">
                          <div className="p-1.5 md:p-2 flex items-center justify-between gap-2 transition-all duration-200 hover:bg-white/[0.05]">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {/* Time & Date */}
                                  <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-white/5 pr-2 leading-tight">
                                    <span className="text-[10px] font-black text-[#f0b90b] tracking-wider">{analysis.matchTime}</span>
                                    <span className="text-[7px] font-medium text-[#94A3B8] uppercase tracking-tighter">
                                      {(() => {
                                        const d = new Date(analysis.matchDate);
                                        const dayName = d.toLocaleDateString('tr-TR', { weekday: 'short' });
                                        const day = d.getDate().toString().padStart(2, '0');
                                        const month = (d.getMonth() + 1).toString().padStart(2, '0');
                                        return `${day}.${month} ${dayName}`;
                                      })()}
                                    </span>
                                  </div>
                                  
                                  {/* Team Name */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-semibold text-[#F8FAFC] group-hover:text-white transition-colors truncate uppercase tracking-wider">
                                      {analysis.homeTeam} - {analysis.awayTeam}
                                    </h4>
                                  </div>

                              {/* Status badge inline */}
                              <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/5 rounded border border-emerald-500/10">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                <span className="text-[7px] font-black text-emerald-500 uppercase">LIVE</span>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button 
                                onClick={() => { setEditingAnalysisId(analysis.id); window.scrollTo({ top: 300, behavior: 'smooth' }); }} 
                                className="p-1.5 rounded-md bg-zinc-800 text-zinc-500 hover:bg-[#f0b90b] hover:text-black transition-all"
                                title="Düzenle"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => {
                                  if (window.confirm('Bu analizi silmek istediğinize emin misiniz?')) {
                                    const updated = localAnalyses.filter(a => a.id !== analysis.id);
                                    setLocalAnalyses(updated);
                                    onSaveAnalyses(updated);
                                  }
                                }} 
                                className="p-1.5 rounded-md bg-red-500/5 text-red-500/60 hover:bg-red-500 hover:text-white transition-all"
                                title="Sil"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );

                      return (
                        <>
                          {Object.keys(filteredGroups).length > 0 && (
                            <div className="space-y-6 animate-fade-in">
                              <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-3">
                                <div className={`w-8 h-8 ${currentConfig.bgClassName} border rounded-xl flex items-center justify-center`}>
                                  <span className="text-xl">{currentConfig.icon}</span>
                                </div>
                                <div>
                                  <h2 className="text-lg font-black text-white uppercase tracking-wider">{adminSport} Analizleri</h2>
                                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Toplam {Object.values(filteredGroups).flat().length} Aktif Yayın</p>
                                </div>
                              </div>

                              {Object.entries(filteredGroups).map(([league, items]) => {
                                  const isExpanded = expandedLeagues[league] === true; // Default to false
                                  return (
                                    <div key={league} className="mb-6 last:mb-0">
                                      <div 
                                        onClick={() => setExpandedLeagues(prev => ({ ...prev, [league]: !isExpanded }))}
                                        className="flex items-center justify-between mb-3 border-l-2 border-[#f0b90b] pl-3 cursor-pointer group/header hover:bg-white/[0.02] py-1 transition-colors"
                                      >
                                        <div className="flex items-center gap-3">
                                          <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                            {league}
                                          </h3>
                                          <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest shrink-0 mt-0.5 px-1.5 py-0.5 bg-zinc-900/50 rounded">{items.length} YAYIN</span>
                                        </div>
                                        <div className="pr-2">
                                          {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-zinc-600 group-hover/header:text-[#f0b90b] transition-colors" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-zinc-600 group-hover/header:text-[#f0b90b] transition-colors" />
                                          )}
                                        </div>
                                      </div>
                                      
                                      {isExpanded && (
                                        <div className="bg-zinc-900/40 border border-white/5 rounded-xl overflow-hidden shadow-2xl animate-fade-in">
                                          {items.map(renderMatchRow)}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                          {Object.keys(filteredGroups).length === 0 && (
                            <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
                              <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                              <p className="text-zinc-400 font-bold">Bu kategori için henüz analiz yok.</p>
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

                      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
                        {/* Compact Tab Header */}
                        <div className="flex items-center bg-zinc-800/30 border-b border-zinc-800 p-2 gap-2 overflow-x-auto hide-scrollbar">
                          <button onClick={() => setEditAnalysisTab('basic')} className={`flex-1 min-w-[120px] py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all flex justify-center ${editAnalysisTab === 'basic' ? 'bg-[#f0b90b] text-black shadow-lg shadow-black/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'}`}>1. Temel Bilgiler</button>
                          <button onClick={() => setEditAnalysisTab('details')} className={`flex-1 min-w-[120px] py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all flex justify-center ${editAnalysisTab === 'details' ? 'bg-[#f0b90b] text-black shadow-lg shadow-black/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'}`}>2. Detaylı Analiz</button>
                          <button onClick={() => setEditAnalysisTab('stats')} className={`flex-1 min-w-[120px] py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-xl transition-all flex justify-center ${editAnalysisTab === 'stats' ? 'bg-[#f0b90b] text-black shadow-lg shadow-black/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'}`}>3. Oranlar & İstatistik</button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 md:p-5 space-y-4">
                          {editAnalysisTab === 'basic' && (
                            <div className="space-y-4 animate-fade-in-up">
                              {/* Grid 1: Basic Math Info */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Layout className="w-3 h-3" /> LİG / TURNUVA</label>
                                  <input value={analysis.league} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].league = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none" placeholder="Örn: La Liga" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> MAÇ TARİHİ</label>
                                  <input type="date" value={analysis.matchDate} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].matchDate = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" /> MAÇ SAATİ</label>
                                  <input value={analysis.matchTime} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].matchTime = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none text-white font-bold" placeholder="22:00" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-3 h-3" /> GÜVEN ORANI (%)</label>
                                  <input type="number" value={analysis.confidence} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].confidence = parseInt(e.target.value); setLocalAnalyses(updated);
                                  }} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-[#f0b90b] font-black focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none" />
                                </div>
                              </div>
                              
                              {/* Grid 2: Teams VS Layout */}
                              <div className="bg-black/40 border border-zinc-800/80 rounded-2xl p-5 md:p-6 shadow-inner">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                  <div className="flex-1 w-full space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic md:pl-2">EV SAHİBİ</label>
                                    <input value={analysis.homeTeam} onChange={(e) => {
                                      const updated = [...localAnalyses]; updated[idx].homeTeam = e.target.value; setLocalAnalyses(updated);
                                    }} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 text-white font-black uppercase italic text-base text-center md:text-left focus:bg-black focus:border-[#f0b90b] transition-all outline-none" placeholder="EV SAHİBİ" />
                                  </div>
                                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-black text-[12px] text-zinc-400 shrink-0 shadow-inner z-10 border-4 border-zinc-900">VS</div>
                                  <div className="flex-1 w-full space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic text-right block md:pr-2">DEPLASMAN</label>
                                    <input value={analysis.awayTeam} onChange={(e) => {
                                      const updated = [...localAnalyses]; updated[idx].awayTeam = e.target.value; setLocalAnalyses(updated);
                                    }} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-5 py-4 text-white font-black uppercase italic text-base text-center md:text-right focus:bg-black focus:border-[#f0b90b] transition-all outline-none" placeholder="DEPLASMAN" />
                                  </div>
                                </div>
                              </div>

                              {/* Prediction */}
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-[#f0b90b] uppercase tracking-widest italic">NET TAHMİN MOTTOSU</label>
                                <input value={analysis.prediction} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].prediction = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full bg-[#f0b90b]/5 border border-[#f0b90b]/30 rounded-xl px-5 py-4 text-[#f0b90b] font-black uppercase italic text-lg focus:bg-[#f0b90b]/10 focus:border-[#f0b90b] transition-all outline-none shadow-[0_0_15px_rgba(240,185,11,0.05)]" placeholder="Örn: KG VAR / 2.5 ÜST" />
                              </div>
                            </div>
                          )}

                          {editAnalysisTab === 'details' && (
                            <div className="space-y-6 animate-fade-in-up">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><ClipboardList className="w-4 h-4 text-[#f0b90b]" /> GENEL ANALİZ METNİ</label>
                                <textarea value={analysis.analysis} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].analysis = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full h-32 bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-[14px] text-zinc-300 resize-y focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none leading-relaxed italic" placeholder="Bu maça ait genel düşüncelerinizi, takım durumlarını buraya yazın..." />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Search className="w-4 h-4 text-blue-400" /> TAKTİK ÖZET</label>
                                <textarea value={analysis.tacticalSummary} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].tacticalSummary = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full h-24 bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-[14px] text-zinc-300 resize-y focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none leading-relaxed" placeholder="Takımların taktiksel dizilişleri, eksikleri veya oyun tarzları..." />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Zap className="w-4 h-4 text-orange-400" /> KIRILMA ANI</label>
                                  <textarea value={analysis.breakingPoint} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].breakingPoint = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full h-24 bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-[14px] text-zinc-300 resize-y focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none leading-relaxed" placeholder="Maçta işlerin değişebileceği an (örneğin ilk golü kim atar)..." />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4 text-emerald-400" /> BAHİS SENARYOSU</label>
                                  <textarea value={analysis.bettingScenario} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].bettingScenario = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full h-24 bg-black border border-zinc-800 rounded-2xl px-5 py-4 text-[14px] text-zinc-300 resize-y focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none leading-relaxed" placeholder="İdeal bahis akışı (örneğin: İlk yarı 0.5 üst mantıklı)..." />
                                </div>
                              </div>
                            </div>
                          )}

                          {editAnalysisTab === 'stats' && (
                            <div className="space-y-4 animate-fade-in-up">
                              {/* İstatistik Satırı */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/30 p-6 rounded-2xl border border-zinc-800/80">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#f0b90b]" /> MODEL SKORU</label>
                                  <div className="flex items-center gap-4 bg-black border border-zinc-800 p-2 rounded-xl">
                                    <input type="number" value={analysis.modelScore} onChange={(e) => {
                                      const updated = [...localAnalyses]; updated[idx].modelScore = parseInt(e.target.value); setLocalAnalyses(updated);
                                    }} className="w-16 bg-transparent px-2 py-1 text-[#f0b90b] font-black text-lg text-center outline-none" />
                                    <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden mr-2">
                                      <div className="h-full bg-[#f0b90b] shadow-[0_0_8px_#f0b90b]" style={{ width: `${analysis.modelScore}%` }} />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-[#f0b90b]" /> SON 10 TAHMİN</label>
                                  <input value={analysis.recentHistory} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].recentHistory = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-black text-sm outline-none focus:border-[#f0b90b]" placeholder="Örn: 8 Kazanç, 2 Kayıp" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-[#f0b90b]" /> LİG xG BEKLENTİSİ</label>
                                  <input value={analysis.expectedGoals} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].expectedGoals = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-black text-sm outline-none focus:border-[#f0b90b]" placeholder="Örn: 3.1" />
                                </div>
                              </div>
                              
                              {/* Yeni Liste Tasarımlı Oranlar */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/50">
                                  <label className="text-[11px] font-black text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                                    <Star className="w-4 h-4 text-[#f0b90b]" /> DESTEKLENEN ORANLAR (SPONSORLAR)
                                  </label>
                                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Toplam {analysis.bookieOdds.length} Site</span>
                                </div>
                                
                                <div className="space-y-3">
                                  {analysis.bookieOdds.map((bookie, bidx) => (
                                    <div key={bidx} className={`flex flex-col lg:flex-row items-center gap-4 bg-black border ${bookie.isHighest ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-zinc-800'} rounded-2xl p-4 relative overflow-hidden transition-all duration-300`}>
                                      
                                      {/* Left Indicator for Highest Odd */}
                                      {bookie.isHighest && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500 shadow-[0_0_10px_#22c55e]"></div>}
                                      
                                      <div className="w-full lg:w-48 xl:w-56 pl-2 lg:pl-4 flex-shrink-0">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase mb-1.5 block">SPONSOR ADI</label>
                                        <input value={bookie.name} onChange={(e) => {
                                          const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].name = e.target.value; setLocalAnalyses(updated);
                                        }} className="w-full bg-transparent border-b-2 border-zinc-800 text-[15px] font-black text-white hover:border-zinc-600 focus:border-[#f0b90b] transition-all outline-none uppercase pb-1" placeholder="Site Adı" />
                                      </div>

                                      <div className="flex gap-4 w-full lg:w-auto flex-shrink-0">
                                        <div className="w-full lg:w-24">
                                          <label className="text-[9px] font-black text-zinc-500 uppercase mb-1.5 block text-center">KG VAR</label>
                                          <input value={bookie.odd1} onChange={(e) => {
                                            const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].odd1 = e.target.value; setLocalAnalyses(updated);
                                          }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-2 text-[15px] text-[#f0b90b] font-black text-center outline-none focus:bg-black focus:border-[#f0b90b] transition-all" />
                                        </div>

                                        <div className="w-full lg:w-24">
                                          <label className="text-[9px] font-black text-zinc-500 uppercase mb-1.5 block text-center">2.5 ÜST</label>
                                          <input value={bookie.odd2} onChange={(e) => {
                                            const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].odd2 = e.target.value; setLocalAnalyses(updated);
                                          }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-2 text-[15px] text-[#f0b90b] font-black text-center outline-none focus:bg-black focus:border-[#f0b90b] transition-all" />
                                        </div>
                                      </div>

                                      <div className="w-full flex-grow">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase mb-1.5 block">AFFILIATE YÖNLENDİRME LİNKİ</label>
                                        <input value={bookie.link} onChange={(e) => {
                                          const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].link = e.target.value; setLocalAnalyses(updated);
                                        }} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-[11px] text-zinc-400 font-mono outline-none focus:bg-black focus:border-blue-500 transition-all" placeholder="https://..." />
                                      </div>

                                      <label className="w-full lg:w-[160px] flex-shrink-0 flex items-center justify-between lg:justify-end gap-3 cursor-pointer select-none bg-zinc-900/50 hover:bg-zinc-800/80 px-4 py-2.5 rounded-xl border border-zinc-800/50 transition-colors">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${bookie.isHighest ? 'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.4)]' : 'text-zinc-500'}`}>ZİRVE ORAN</span>
                                        <div className="relative">
                                          <input type="checkbox" checked={bookie.isHighest} onChange={(e) => {
                                            const updated = [...localAnalyses];
                                            updated[idx].bookieOdds.forEach((b, i) => b.isHighest = (i === bidx ? e.target.checked : false));
                                            setLocalAnalyses(updated);
                                          }} className="hidden" />
                                          <div className={`w-10 h-5 rounded-full transition-all ${bookie.isHighest ? 'bg-green-500' : 'bg-zinc-800 shadow-inner'}`}>
                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${bookie.isHighest ? 'left-6' : 'left-1'}`} />
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Sticky Bottom Bar for Save */}
                        <div className="sticky bottom-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-5 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
                          <div className="flex items-center gap-3">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-white uppercase tracking-widest">TASLAK AKTİF</span>
                              <span className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">Sistem verileri geçici olarak tutuyor</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                              onClick={() => setEditingAnalysisId(null)}
                              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-[11px] uppercase tracking-widest transition-all active:scale-95"
                            >
                              İPTAL
                            </button>
                            <button
                              onClick={(e) => {
                                handleSave();
                                setEditingAnalysisId(null); // Return to list view directly
                              }}
                              className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-[#f0b90b] text-black font-black text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                              <Save className="w-4 h-4" /> KAYDET VE DÖN
                            </button>
                          </div>
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
          <div className="max-w-xl space-y-4">
            <h2 className="text-xl font-black">SİTE GÖRÜNÜMÜ</h2>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div><h3 className="font-bold">Ana Renk</h3></div>
                <input type="color" value={themeColor} onChange={(e) => onThemeChange(e.target.value)} className="w-16 h-16 bg-transparent cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-xl font-black">CEO / SEO HASHTAG</h2>
            <textarea value={localHashtags} onChange={(e) => setLocalHashtags(e.target.value)} className="w-full h-48 bg-black border border-zinc-800 rounded-2xl p-6 outline-none focus:border-primary text-zinc-300 font-mono text-sm resize-none" />
          </div>
        )}

        {activeTab === 'leagues' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-3">
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
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-3">
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
                <h2 className="text-xl font-black text-white flex items-center gap-3">
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

      {/* --- AI SMART PASTE MODAL --- */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowAiModal(false)} />
          <div className="relative bg-zinc-900 w-full max-w-5xl p-5 rounded-3xl border border-[#f0b90b]/30 shadow-[0_0_50px_rgba(240,185,11,0.15)] animate-scale-in flex flex-col md:flex-row gap-8">
            
            {/* Prompt Generator Side */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#f0b90b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#f0b90b]/20">
                  <Sparkles className="text-black w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">AI PROMPT YARDIMCISI</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">BU METNİ KOPYALAYIP CHATGPT'YE YAPIŞTIRIN</p>
                </div>
              </div>
              
              <div className="bg-black border border-zinc-800 rounded-2xl p-5 relative group">
                <button 
                  onClick={() => {
                    const prompt = `Aşağıdaki maçlar için analiz yaz ve SADECE aşağıdaki JSON dizisi formatında çıktı ver. Başka hiçbir açıklama yazma:
[
  {
    "league": "Lig Adı",
    "homeTeam": "Ev Sahibi",
    "awayTeam": "Deplasman",
    "matchDate": "YYYY-MM-DD",
    "matchTime": "HH:MM",
    "confidence": 85,
    "modelScore": 92,
    "prediction": "KG VAR / 2.5 ÜST",
    "analysis": "Genel analiz metni...",
    "tacticalSummary": "Taktik maç özeti...",
    "breakingPoint": "Maçın kırılma anı...",
    "bettingScenario": "İdeal bahis senaryosu...",
    "recentHistory": "Son form durumu",
    "expectedGoals": "3.1"
  }
]
Maçlar:\n(Buraya liste yazın)`;
                    navigator.clipboard.writeText(prompt);
                    alert('Prompt kopyalandı! Şimdi ChatGPT\'ye yapıştırıp altına maç listesini girebilirsiniz.');
                  }}
                  className="absolute top-3 right-3 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-bold text-[10px]"
                >
                  KOPYALA
                </button>
                <pre className="text-[10px] text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed h-[280px] overflow-y-auto custom-scrollbar">
{`Aşağıdaki maçlar için analiz yaz ve SADECE aşağıdaki JSON formatında bir dizi ([]) döndür. Başka hiçbir açıklama yapma:

[
  {
    "league": "Süper Lig",
    "homeTeam": "Ev Sahibi",
    "awayTeam": "Deplasman",
    "matchDate": "2026-05-15",
    "matchTime": "20:00",
    "confidence": 85,
    "modelScore": 92,
    "prediction": "KG VAR / 2.5 ÜST",
    "analysis": "1-2 cümlelik genel...",
    "tacticalSummary": "Taktik savaş...",
    "breakingPoint": "Kırılma anı...",
    "bettingScenario": "Bahis önerisi...",
    "recentHistory": "8 Kazanç, 2 Kayıp",
    "expectedGoals": "2.8"
  }
]

Maç Listesi: `}
                </pre>
              </div>
            </div>

            {/* Paste Side */}
            <div className="flex-1 flex flex-col mt-8 md:mt-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <Zap className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">JSON İÇE AKTARICI</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">CHATGPT'DEN GELEN JSON KODUNU BURAYA YAPIŞTIRIN</p>
                </div>
              </div>

              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder={'[\\n  {\\n    "league": "...", \\n    ...\\n  }\\n]'}
                className="w-full h-full min-h-[150px] md:min-h-[250px] flex-1 bg-black border border-indigo-500/30 rounded-3xl p-6 text-emerald-400 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none font-mono mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] custom-scrollbar"
              />

              <div className="flex items-center gap-4 mt-auto">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-zinc-800 text-white font-black text-xs uppercase hover:bg-zinc-750 transition-all"
                >
                  İPTAL
                </button>
                <button
                  onClick={handleAiParse}
                  className="flex-[2] py-4 rounded-2xl bg-[#f0b90b] text-black font-black text-xs uppercase shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> VERİLERİ SİSTEME EKLE
                </button>
              </div>
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
              <p className="text-zinc-500 text-xs font-bold">724bahis.net.net × 724BAHİS.NET Loyalty/Gamification</p>
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

      {activeTab === 'raffle' && (
        <AdminRaffleTab 
          config={localRaffleConfig} 
          onSave={(cfg) => {
            setLocalRaffleConfig(cfg);
            if (onSaveRaffleConfig) onSaveRaffleConfig(cfg);
          }} 
        />
      )}

      {activeTab === 'popularbets' && (
        <AdminPopularBetsTab 
          config={localPopularBetsConfig} 
          onSave={(cfg) => {
            setLocalPopularBetsConfig(cfg);
            if (onSavePopularBetsConfig) onSavePopularBetsConfig(cfg);
          }} 
        />
      )}

      {activeTab === 'newsslider' && (
        <AdminNewsSliderTab 
          config={localNewsSliderConfig} 
          onSave={(cfg) => {
            setLocalNewsSliderConfig(cfg);
            if (onSaveNewsSliderConfig) onSaveNewsSliderConfig(cfg);
          }} 
        />
      )}

      {activeTab === '724tv' && (
        <Admin724TVTab 
          config={localTvConfig} 
          onSave={(cfg) => {
            setLocalTvConfig(cfg);
            if (onSaveTvConfig) onSaveTvConfig(cfg);
          }} 
        />
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
        <div className="space-y-4 animate-fade-in-up p-6 overflow-y-auto w-full max-w-4xl mx-auto">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-3">
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                ✨ Üst Menü Kayan Yazı (Marquee)
              </h3>
              <button
                onClick={() => setShowAiMarqueeParser(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all shadow-lg shadow-primary/5"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI HABER SİHİRBAZI
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-4">
               <span className="text-zinc-400 font-bold">Kayan Yazı Aktifliği</span>
               <button
                  onClick={() => setLocalMarquee({ ...localMarquee, isActive: !localMarquee.isActive })}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${localMarquee.isActive ? 'bg-green-500' : 'bg-zinc-700'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-all ${localMarquee.isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-1 block">Yazı İçeriği</label>
                <input 
                  type="text" 
                  value={localMarquee.text} 
                  onChange={(e) => setLocalMarquee({ ...localMarquee, text: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="Kayan yazı metni..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-1 block">Geçiş Hızı ({localMarquee.speed}s)</label>
                  <input 
                    type="range" 
                    min="5"
                    max="500"
                    step="5"
                    value={localMarquee.speed} 
                    onChange={(e) => {
                      const speed = Number(e.target.value);
                      const u = { ...localMarquee, speed };
                      setLocalMarquee(u);
                      onSaveMarqueeConfig?.(u);
                    }}
                    className="w-full accent-primary h-1.5 bg-black border border-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-zinc-600 font-bold uppercase mt-1 px-1">
                    <span>Hızlı (5s)</span>
                    <span>Yavaş (500s)</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-1 block">Yazı Rengi</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={localMarquee.color} 
                      onChange={(e) => setLocalMarquee({ ...localMarquee, color: e.target.value })}
                      className="w-12 h-12 bg-black border border-zinc-800 rounded-xl p-1 shrink-0 cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={localMarquee.color} 
                      onChange={(e) => setLocalMarquee({ ...localMarquee, color: e.target.value })}
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-2 mb-1 block">Kalın Yazı (Bold)</label>
                  <button
                    onClick={() => setLocalMarquee({ ...localMarquee, isBold: !localMarquee.isBold })}
                    className={`w-full h-12 rounded-xl transition-all font-bold flex items-center justify-center ${localMarquee.isBold ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                  >
                    {localMarquee.isBold ? 'KALIN KONTÜR' : 'NORMAL (Pasif)'}
                  </button>
                </div>
              </div>

              {/* Individual Save for Marquee (Optional but good) */}
              <button
                onClick={() => {
                  onSaveMarqueeConfig?.(localMarquee);
                  alert('Kayan yazı ayarları kaydedildi!');
                }}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-[10px] rounded-xl uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> BU BÖLÜMÜ KAYDET
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Marquee Parser Modal */}
      {showAiMarqueeParser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
              <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg uppercase tracking-tight">AI HABER SİHİRBAZI</h3>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Ham haber metnini kışkırtıcı bir akışa çevirir</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAiMarqueeParser(false)} className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Haber Metnini Buraya Yapıştırın</label>
                    <textarea
                      value={aiMarqueeRawText}
                      onChange={(e) => setAiMarqueeRawText(e.target.value)}
                      className="w-full h-80 bg-black border border-zinc-800 rounded-2xl p-5 text-sm font-medium text-zinc-300 focus:border-primary/50 transition-all resize-none leading-relaxed"
                      placeholder="🦁 Galatasaray Gündemi...&#10;Hakan Çalhanoğlu Bombası: ..."
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => setShowAiMarqueeParser(false)}
                      className="flex-1 px-6 py-4 bg-zinc-800 text-zinc-400 font-black text-xs rounded-2xl uppercase tracking-widest hover:bg-zinc-700 transition-all"
                    >
                      VAZGEÇ
                    </button>
                    <button
                      onClick={handleAiMarqueeParse}
                      className="flex-[2] px-6 py-4 bg-primary text-black font-black text-xs rounded-2xl uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" /> HABERLERİ DÜZENLE VE UYGULA
                    </button>
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
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <MessageSquare className="text-blue-400" /> KULLANICI MESAJLARI
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase mt-1">724BAHİS.NET yatırımları ve üye bildirimleri</p>
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

      {/* ─── SYSTEM STATUS (MAINTENANCE) TAB ─── */}
      {activeTab === 'system' && (
        <div className="space-y-10 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <Settings className="text-amber-500" /> SİSTEM VE BAKIM
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase mt-1">Site erişim durumunu ve bakım modunu yönetin</p>
            </div>
            <button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-black px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(240,185,11,0.3)] hover:scale-105"
            >
              <Save className="w-5 h-5" /> KAYDET
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-[30px] shadow-2xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            
            <div className="flex items-start justify-between mb-5">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[12px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                       {localSiteStatus.isMaintenanceMode ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-green-500" />}
                       BAKIM MODU (MAINTENANCE MODE)
                    </label>
                    <p className="text-xs text-zinc-500 mt-1">
                      Aktif edildiğinde, yöneticiler ve editörler haricindeki tüm kullanıcılara "Bakım Modu" ekranı gösterilir.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSiteStatus.isMaintenanceMode}
                      onChange={(e) => setLocalSiteStatus({...localSiteStatus, isMaintenanceMode: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
                  </label>
                </div>

                <div className="w-full h-px bg-zinc-800/50 my-6" />

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Bakım Modu Açıklaması</label>
                  <textarea
                    value={localSiteStatus.maintenanceMessage}
                    onChange={(e) => setLocalSiteStatus({...localSiteStatus, maintenanceMessage: e.target.value})}
                    rows={3}
                    placeholder="Değerli üyelerimiz, sistemlerimizde planlı bir bakım çalışması..."
                    className="w-full bg-black/50 border border-zinc-800 p-4 rounded-xl text-white font-medium focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all resize-none text-sm placeholder:text-zinc-700"
                  />
                  <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">Bu mesaj ziyaretçilere Bakım Ekranında gösterilecektir.</p>
                </div>
              </div>
            </div>
            
            {/* Warning visual depending on mode */}
            {localSiteStatus.isMaintenanceMode && (
              <div className="absolute top-0 right-0 p-5 w-64 h-64 bg-red-500/10 blur-[80px] pointer-events-none rounded-full" />
            )}
            
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default AdminPanel;
