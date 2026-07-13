import React, { useState, useEffect, useRef } from 'react';
import { Settings, Image, Layout, Trophy, Users, Eye, EyeOff, Save, Plus, Sparkles, TrendingUp, AlertCircle, Clock, Box, Zap, Trash2, Search, Lock, Unlock, Timer, Gift, Ticket, RefreshCw, Activity, Check, MessageSquare, Palette, Star, CreditCard, ChevronLeft, LogOut, Calendar, ClipboardList, Edit3, Target, CheckCircle2, User, ChevronUp, ChevronDown, Layers, Camera, ShieldCheck, ShoppingCart, Shield, Bell } from 'lucide-react';
import { Brand, MatchAnalysis, Coupon, CouponMatch, WheelReward, WheelConfig, BlackjackConfig, LoyaltyConfig, EditorAccount, UserMessage, GiveawayConfig, MarqueeConfig, WelcomePopupConfig, LiveOddsConfig, LiveOddsMatch, SiteStatusConfig, HeroSliderConfig, Slider2Config, HeroSlide, DailyKuponConfig, DailyKuponMatch, RaffleConfig, PopularBetsConfig, TVConfig, SportCategory, LoaderConfig, CasinoLobbyGame, SiteUser, ChatBotConfig } from '../types';


import AdminMembersTab from './AdminMembersTab';
import AdminPoolTab from './AdminPoolTab';
import AdminGiveawayTab from './AdminGiveawayTab';
import AdminRaffleTab from './AdminRaffleTab';
import AdminPopularBetsTab from './AdminPopularBetsTab';
import Admin724TVTab from './Admin724TVTab';
import AdminPremiumTab from './AdminPremiumTab';
import AdminCasinoLobbyTab from './AdminCasinoLobbyTab';
import AdminTrustedTab from './AdminTrustedTab';
import AdminChatTab from './AdminChatTab';
import AdminNotificationTab from './AdminNotificationTab';
import AdminPromoTab from './AdminPromoTab';
import AdminReferralTab from './AdminReferralTab';
import AdminSportsTab from './AdminSportsTab';
import { AdminBackupTab } from './AdminBackupTab';
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
  slider2Config?: Slider2Config;
  onSaveSlider2Config?: (config: Slider2Config) => void;
  dailyKuponConfig?: DailyKuponConfig;
  onSaveDailyKuponConfig?: (config: DailyKuponConfig) => void;
  raffleConfig?: RaffleConfig;
  onSaveRaffleConfig?: (config: RaffleConfig) => void;
  popularBetsConfig?: PopularBetsConfig;
  onSavePopularBetsConfig?: (config: PopularBetsConfig) => void;
  tvConfig?: TVConfig;
  onSaveTvConfig?: (config: TVConfig) => void;
  loaderConfig?: LoaderConfig;
  onSaveLoaderConfig?: (config: LoaderConfig) => void;
  casinoLobbyGames?: CasinoLobbyGame[];
  onSaveCasinoLobbyGames?: (games: CasinoLobbyGame[]) => void;
  siteUser?: SiteUser | null;
  onUpdateUser?: (user: SiteUser) => void;
  discordConfig?: any;
  onSaveDiscordConfig?: (config: any) => void;
  botsConfig?: ChatBotConfig[];
  onSaveBotsConfig?: (config: ChatBotConfig[]) => void;
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
  slider2Config, onSaveSlider2Config,
  dailyKuponConfig, onSaveDailyKuponConfig,
  raffleConfig, onSaveRaffleConfig,
  popularBetsConfig, onSavePopularBetsConfig,
  tvConfig, onSaveTvConfig,
  loaderConfig, onSaveLoaderConfig,
  casinoLobbyGames, onSaveCasinoLobbyGames,
  siteUser, onUpdateUser,
  discordConfig, onSaveDiscordConfig,
  botsConfig, onSaveBotsConfig,
}) => {
  const isAuthor = role.startsWith('author_');
  const isEditor = role.startsWith('editor');
  const [activeTab, setActiveTab] = useState<'profile' | 'content' | 'style' | 'seo' | 'analysis' | 'coupons' | 'wheel' | 'editors' | 'guests' | 'blackjack' | 'loyalty' | 'members' | 'messages' | 'pool' | 'giveaway' | 'raffle' | 'visibility' | 'liveodds' | 'system' | 'popularbets' | '724tv' | 'casinolobby' | 'trusted' | 'chatmanage' | 'notifications' | 'premium' | 'payment' | 'leagues' | 'wallet' | 'promocodes' | 'referrals' | 'sports'>('content');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    profile: true,
    site: false,
    betting: false,
    reward: false,
    content: false,
    admin: false
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const isOpening = !prev[group];
      
      // Grup açılıyorsa o grubun ilk sekmesini otomatik olarak sağ tarafta göster
      if (isOpening) {
        if (group === 'site') setActiveTab('content');
        else if (group === 'betting') setActiveTab('analysis');
        else if (group === 'reward') setActiveTab('blackjack');

        else if (group === 'admin') setActiveTab('members');
      }

      return { ...prev, [group]: isOpening };
    });
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
  const [localBrands, setLocalBrands] = useState([...(brands || [])]);
  const [localHero, setLocalHero] = useState({ ...(hero || {}) } as Brand);
  const [localHashtags, setLocalHashtags] = useState(hashtags || '');
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

  const [localSlider2, setLocalSlider2] = useState<Slider2Config>(
    slider2Config || { isActive: true, autoPlayInterval: 5000, slides: [] }
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

  const [localTvConfig, setLocalTvConfig] = useState<TVConfig>(
    tvConfig || { isActive: true, channels: [], chatEnabled: true, tickerText: '' }
  );

  const [localLoaderConfig, setLocalLoaderConfig] = useState<LoaderConfig>(
    loaderConfig || { isActive: true }
  );

  const [localDiscordConfig, setLocalDiscordConfig] = useState<any>(
    discordConfig || { enabled: false, webhookUrl: '' }
  );

  // New Management Local State
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);

  const handleSlideImageUpload = async (slideId: string, idx: number, e: React.ChangeEvent<HTMLInputElement>, sliderType: 'hero' | 'slider2' = 'hero') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlideId(slideId);
    try {
      let finalUrl = '';
      if (sliderType === 'hero') {
        const croppedBlob = await resizeImage(file, 1024, 576);
        const { url, error } = await uploadImageToSupabase(
          croppedBlob,
          'slider-images',
          `hero-slides/${slideId}-${Date.now()}.jpg`
        );
        if (error) { alert("Görsel yüklenemedi: " + error.message); return; }
        finalUrl = url;
      } else {
        const { url, error } = await uploadImageToSupabase(
          file,
          'slider-images',
          `slider2/${slideId}-${Date.now()}.jpg`
        );
        if (error) { alert("Görsel yüklenemedi: " + error.message); return; }
        finalUrl = url;
      }

      if (finalUrl) {
        if (sliderType === 'hero') {
          const slides = [...(localHeroSlider.slides || [])];
          if (slides[idx]) {
            slides[idx].imageUrl = finalUrl;
            setLocalHeroSlider({ ...localHeroSlider, slides });
            onSaveHeroSliderConfig?.({ ...localHeroSlider, slides });
          }
        } else if (sliderType === 'slider2') {
          const slides = [...(localSlider2.slides || [])];
          if (slides[idx]) {
            slides[idx].imageUrl = finalUrl;
            setLocalSlider2({ ...localSlider2, slides });
            onSaveSlider2Config?.({ ...localSlider2, slides });
          }
        }
      }
    } catch (err) {
      console.error('Slider image crop/upload failed:', err);
      alert("Görsel işlenirken bir hata oluştu.");
    } finally {
      setUploadingSlideId(null);
    }
  };
  const [localAnalyses, setLocalAnalyses] = useState<MatchAnalysis[]>(analyses || []);
  const [editingAnalysisId, setEditingAnalysisId] = useState<string | null>(null);
  const [editAnalysisTab, setEditAnalysisTab] = useState<'basic' | 'details' | 'stats'>('basic');

  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(coupons || []);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);

  const [adminSport, setAdminSport] = useState<SportCategory>('Futbol');
  const [adminAnalysisDateFilter, setAdminAnalysisDateFilter] = useState<string>('');
  const [adminAnalysisLeagueFilter, setAdminAnalysisLeagueFilter] = useState<string>('');
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({});
  
  // Admin Profile Local State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [adminProfile, setAdminProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('admin_profile') || '{"name": "Bana 15", "logoUrl": ""}');
    } catch {
      return { name: "Bana 15", logoUrl: "" };
    }
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Content Sections Visibility - Default all closed
  const [contentExpanded, setContentExpanded] = useState<Record<string, boolean>>({
    hero: false,
    slider2: false,
    brands: false,
    welcome: false,
    slider: false,
    daily: false,
    style_main: false,
    seo_main: false,
    visibility_pages: false,
    visibility_marquee: false,
    system_maintenance: false,
    system_loader: false,
    system_discord: false,
    casino_general: false,
    casino_rewards: false,
    loyalty_general: false,
    loyalty_rules: false,
    loyalty_market: false,
    liveodds_main: false,
    analysis_add: false,
    analysis_list: false,
    coupons_wizard: false,
    coupons_list: false
  });

  const toggleContentSection = (section: string) => {
    setContentExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };
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

  const [guestAccounts, setGuestAccounts] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('site_guests') || '[]'); } catch { return []; }
  });
  const [newGuestUsername, setNewGuestUsername] = useState('');
  const [newGuestPassword, setNewGuestPassword] = useState('');
  const [guestSaveMsg, setGuestSaveMsg] = useState('');
  const [guestErrorMsg, setGuestErrorMsg] = useState('');
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
    if (slider2Config) setLocalSlider2(slider2Config);
  }, [slider2Config]);

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
    if (loaderConfig) setLocalLoaderConfig(loaderConfig);
  }, [loaderConfig]);

  useEffect(() => {
    if (discordConfig) setLocalDiscordConfig(discordConfig);
  }, [discordConfig]);

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
    if (onSaveSlider2Config) onSaveSlider2Config(localSlider2);
    if (onSaveDailyKuponConfig) onSaveDailyKuponConfig(localDailyKupon);
    if (onSavePopularBetsConfig) onSavePopularBetsConfig(localPopularBetsConfig);
    if (onSaveTvConfig) onSaveTvConfig(localTvConfig);
    if (onSaveLoaderConfig) onSaveLoaderConfig(localLoaderConfig);

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
    <div className="min-h-screen admin-shell flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800 p-4 flex flex-col gap-4 overflow-y-auto">
        {/* GAMDOM STYLE PROFILE CARD - COMPACT */}
        <div 
          className="adm-profile-card cursor-pointer hover:bg-zinc-900 transition-colors"
          onClick={() => setShowProfileModal(true)}
          title="Profil Ayarlarını Düzenle"
        >
          <div className="adm-profile-avatar overflow-hidden">
            {adminProfile.logoUrl ? (
              <img src={adminProfile.logoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-black text-white">{adminProfile.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="adm-profile-info w-full">
            <h3 className="adm-profile-name">{adminProfile.name}</h3>
            <p className="adm-profile-id">KİMLİK: {Math.floor(Math.random() * 10000000)}</p>
            
            <div className="adm-progress-container">
              <div className="adm-progress-bar" style={{ width: '99.35%' }}></div>
            </div>
            <div className="flex justify-between w-full mt-1">
              <span className="text-[7px] font-black text-zinc-500 uppercase">99.35%</span>
              <span className="text-[7px] font-black text-white uppercase">SEVİYE 50</span>
            </div>
          </div>
        </div>

        {/* Cloud Sync Status Card - COMPACT */}
        <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">BULUT DURUMU</span>
            <div className={`w-2 h-2 rounded-full ${
              syncStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
              syncStatus === 'no_table' ? 'bg-orange-500' : 'bg-rose-500'
            }`} />
          </div>
          
          <button 
            onClick={handleCloudSync}
            disabled={isSyncing || syncStatus === 'no_table'}
            className={`w-full py-2 rounded-lg text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
              isSyncing ? 'bg-zinc-800 text-zinc-500' : 
              'bg-[#00FFC2]/10 text-[#00FFC2] border border-[#00FFC2]/20 hover:bg-[#00FFC2] hover:text-black'
            }`}
          >
            {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {isSyncing ? 'İŞLENİYOR...' : 'BULUTA PUSHLA'}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {role === 'admin' && (
            <>
              <div className="mb-4">
                <button 
                  onClick={() => toggleGroup('profile')}
                  className="w-full flex items-center justify-between px-2 mb-2 group"
                >
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">KULLANICI PROFİLİ</p>
                  {expandedGroups.profile ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
                </button>
                {expandedGroups.profile && (
                  <div className="space-y-1">
                    <button onClick={() => setActiveTab('profile')} className={`adm-nav-item ${activeTab === 'profile' ? 'active' : ''}`}>
                      <User className="w-4 h-4" /> PROFİL AYARLARIM
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <button 
                  onClick={() => toggleGroup('site')}
                  className="w-full flex items-center justify-between px-2 mb-2 group"
                >
                  <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">SİTE & TASARIM</p>
                  {expandedGroups.site ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
                </button>
                {expandedGroups.site && (
                  <div className="space-y-1">
                    <button onClick={() => setActiveTab('content')} className={`adm-nav-item ${activeTab === 'content' ? 'active' : ''}`}>
                      <Layout className="w-4 h-4" /> İÇERİK YÖNETİMİ
                    </button>
                    <button onClick={() => setActiveTab('style')} className={`adm-nav-item ${activeTab === 'style' ? 'active' : ''}`}>
                      <Palette className="w-4 h-4" /> SİTE TASARIMI
                    </button>
                    <button onClick={() => setActiveTab('seo')} className={`adm-nav-item ${activeTab === 'seo' ? 'active' : ''}`}>
                      <Search className="w-4 h-4" /> SEO & HASHTAG
                    </button>
                    <button onClick={() => setActiveTab('visibility')} className={`adm-nav-item ${activeTab === 'visibility' ? 'active' : ''}`}>
                      <Eye className="w-4 h-4" /> SAYFA GÖRÜNÜRLÜĞÜ
                    </button>
                    <button onClick={() => setActiveTab('system')} className={`adm-nav-item ${activeTab === 'system' ? 'active' : ''}`}>
                      <Settings className="w-4 h-4" /> SİSTEM AYARLARI
                    </button>
                    <button onClick={() => setActiveTab('backup')} className={`adm-nav-item ${activeTab === 'backup' ? 'active' : ''}`}>
                      <Save className="w-4 h-4" /> YEDEKLE & YÜKLE
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {!isAuthor && (
            <div className="mb-4">
              <button 
                onClick={() => toggleGroup('betting')}
                className="w-full flex items-center justify-between px-2 mb-2 group"
              >
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">SPOR & BAHİS</p>
                {expandedGroups.betting ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.betting && (
                <div className="space-y-1">
                  <button onClick={() => setActiveTab('analysis')} className={`adm-nav-item ${activeTab === 'analysis' ? 'active' : ''}`}>
                    <TrendingUp className="w-4 h-4" /> MAÇ ANALİZLERİ
                  </button>
                  <button onClick={() => setActiveTab('coupons')} className={`adm-nav-item ${activeTab === 'coupons' ? 'active' : ''}`}>
                    <Ticket className="w-4 h-4" /> GÜNÜN KUPONLARI
                  </button>
                  {role === 'admin' && (
                    <>
                      <button onClick={() => setActiveTab('liveodds')} className={`adm-nav-item ${activeTab === 'liveodds' ? 'active' : ''}`}>
                        <Activity className="w-4 h-4" /> CANLI ORANLAR
                      </button>
                      <button onClick={() => setActiveTab('popularbets')} className={`adm-nav-item ${activeTab === 'popularbets' ? 'active' : ''}`}>
                        <TrendingUp className="w-4 h-4" /> POPÜLER BAHİSLER
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {role === 'admin' && (
            <div className="mb-4">
              <button 
                onClick={() => toggleGroup('reward')}
                className="w-full flex items-center justify-between px-2 mb-2 group"
              >
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">EĞLENCE & ÖDÜL</p>
                {expandedGroups.reward ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.reward && (
                <div className="space-y-1">
                  <button onClick={() => setActiveTab('blackjack')} className={`adm-nav-item ${activeTab === 'blackjack' ? 'active' : ''}`}>
                    <Zap className="w-4 h-4" /> CASINO 724
                  </button>
                  <button onClick={() => setActiveTab('pool')} className={`adm-nav-item ${activeTab === 'pool' ? 'active' : ''}`}>
                    <Trophy className="w-4 h-4" /> 724TOTO
                  </button>
                  <button onClick={() => setActiveTab('giveaway')} className={`adm-nav-item ${activeTab === 'giveaway' ? 'active' : ''}`}>
                    <Gift className="w-4 h-4" /> ÇEKİLİŞ YÖNETİMİ
                  </button>
                  <button onClick={() => setActiveTab('raffle')} className={`adm-nav-item ${activeTab === 'raffle' ? 'active' : ''}`}>
                    <Ticket className="w-4 h-4" /> BİLET HAVUZU
                  </button>
                  <button onClick={() => setActiveTab('loyalty')} className={`adm-nav-item ${activeTab === 'loyalty' ? 'active' : ''}`}>
                    <Star className="w-4 h-4" /> SADAKAT / BİLET
                  </button>
                  <button onClick={() => setActiveTab('premium')} className={`adm-nav-item ${activeTab === 'premium' ? 'active' : ''}`}>
                    <Zap className="w-4 h-4" /> 💎 PREMİUM YÖNETİMİ
                  </button>
                </div>
              )}
            </div>
          )}

          {(role === 'admin' || isAuthor || isEditor) && (
            <div className="mb-4">
              <button 
                onClick={() => toggleGroup('content')}
                className="w-full flex items-center justify-between px-2 mb-2 group"
              >
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">İÇERİK BÖLÜMÜ</p>
                {expandedGroups.content ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.content && (
                <div className="space-y-1">
                  {role === 'admin' && (
                    <>
                      <button onClick={() => setActiveTab('casinolobby')} className={`adm-nav-item ${activeTab === 'casinolobby' ? 'active' : ''}`}>
                        <Sparkles className="w-4 h-4 text-amber-400" /> CASINO LOBİSİ
                      </button>
                      <button onClick={() => setActiveTab('trusted')} className={`adm-nav-item ${activeTab === 'trusted' ? 'active' : ''}`}>
                        <ShieldCheck className="w-4 h-4 text-cyan-400" /> GÜVENİLİR SİTELER
                      </button>
                      <button onClick={() => setActiveTab('724tv')} className={`adm-nav-item ${activeTab === '724tv' ? 'active' : ''}`}>
                        <Layers className="w-4 h-4" /> 724TV
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {role === 'admin' && (
            <div className="mb-4">
              <button 
                onClick={() => toggleGroup('admin')}
                className="w-full flex items-center justify-between px-2 mb-2 group"
              >
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">YÖNETİM & DESTEK</p>
                {expandedGroups.admin ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
              </button>
              {expandedGroups.admin && (
                <div className="space-y-1">
                  <button onClick={() => setActiveTab('members')} className={`adm-nav-item ${activeTab === 'members' ? 'active' : ''}`}>
                    <Users className="w-4 h-4" /> ÜYELER
                  </button>
                  <button onClick={() => setActiveTab('promocodes')} className={`adm-nav-item ${activeTab === 'promocodes' ? 'active' : ''}`}>
                    <Ticket className="w-4 h-4" /> PROMOSYON KODLARI
                  </button>
                  <button onClick={() => setActiveTab('referrals')} className={`adm-nav-item ${activeTab === 'referrals' ? 'active' : ''}`}>
                    <Users className="w-4 h-4" /> DAVET GEÇMİŞİ
                  </button>
                  <button onClick={() => setActiveTab('payment')} className={`adm-nav-item ${activeTab === 'payment' ? 'active' : ''}`}>
                    <CreditCard className="w-4 h-4" /> ÖDEMELER
                  </button>
                  <button onClick={() => setActiveTab('wallet')} className={`adm-nav-item ${activeTab === 'wallet' ? 'active' : ''}`}>
                    <CreditCard className="w-4 h-4" /> CÜZDAN AYARLARI
                  </button>
                  <button onClick={() => setActiveTab('editors')} className={`adm-nav-item ${activeTab === 'editors' ? 'active' : ''}`}>
                    <User className="w-4 h-4" /> EDİTÖRLER
                  </button>
                  <button onClick={() => setActiveTab('guests')} className={`adm-nav-item ${activeTab === 'guests' ? 'active' : ''}`}>
                    <Lock className="w-4 h-4" /> MİSAFİR HESAPLARI
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`adm-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-4 h-4" /> MESAJLAR
                    </div>
                    {unreadCount > 0 && <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">{unreadCount}</span>}
                  </button>
                  <button
                    onClick={() => setActiveTab('chatmanage')}
                    className={`adm-nav-item ${activeTab === 'chatmanage' ? 'active' : ''}`}
                  >
                    <Shield className="w-4 h-4" /> SOHBET YÖNETİMİ
                  </button>
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className={`adm-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  >
                    <Bell className="w-4 h-4" /> BİLDİRİM MERKEZİ
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>


        <div className="mt-auto space-y-2">
          {onNavigateHome && (
            <button onClick={onNavigateHome} className="adm-btn-outline w-full flex items-center justify-center gap-2">
              <ChevronLeft className="w-4 h-4" /> ANA SAYFAYA DÖN
            </button>
          )}
          <button onClick={handleSave} className="adm-btn-primary w-full flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> KAYDET
          </button>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white font-black py-3.5 rounded-lg transition-all">
            <LogOut className="w-4 h-4" /> ÇIKIŞ YAP
          </button>
        </div>
      </aside>

      <main ref={mainRef} className="flex-1 p-4 md:p-6 overflow-y-auto max-h-screen">
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            {/* PROFILE HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-3">
                  <User className="text-[#f0b90b]" /> PROFİL AYARLARIM
                </h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-widest">Kişisel bilgilerinizi ve güvenliğinizi yönetin</p>
              </div>
              <button 
                onClick={() => {
                  if (confirm('Oturumu kapatmak istediğinize emin misiniz?')) {
                    window.location.reload();
                  }
                }}
                className="px-6 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> OTURUMU KAPAT
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT: AVATAR & BASIC INFO */}
              <div className="lg:col-span-1 space-y-6">
                <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#f0b90b]/10 to-transparent" />
                  
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-zinc-800 overflow-hidden bg-black flex items-center justify-center relative z-10">
                      {adminProfile.logoUrl ? (
                        <img src={adminProfile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-zinc-700" />
                      )}
                    </div>
                    <button className="absolute bottom-1 right-1 w-10 h-10 bg-[#f0b90b] text-black rounded-full flex items-center justify-center shadow-xl z-20 hover:scale-110 transition-all border-4 border-zinc-900">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="z-10">
                    <h3 className="text-white font-black text-xl italic">{adminProfile.name}</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">SÜPER ADMİN</p>
                  </div>

                  <div className="w-full pt-4 border-t border-zinc-800/50 space-y-3 z-10">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-zinc-600">SON GİRİŞ</span>
                      <span className="text-zinc-400">BUGÜN, 14:20</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-zinc-600">YETKİ SEVİYESİ</span>
                      <span className="text-[#f0b90b]">FULL ACCESS</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* RIGHT: FORMS */}
              <div className="lg:col-span-2 space-y-6">
                {/* GENERAL SETTINGS */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
                  <h4 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <Layout className="w-4 h-4 text-zinc-500" /> GENEL BİLGİLER
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">PROFİL ADI</label>
                      <input 
                        type="text" 
                        value={adminProfile.name}
                        onChange={e => setAdminProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white font-bold focus:border-[#f0b90b] outline-none transition-all"
                        placeholder="Adınız"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">LOGO URL (AVATAR)</label>
                      <input 
                        type="text" 
                        value={adminProfile.logoUrl}
                        onChange={e => setAdminProfile(prev => ({ ...prev, logoUrl: e.target.value }))}
                        className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white font-bold focus:border-[#f0b90b] outline-none transition-all"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => {
                        localStorage.setItem('admin_profile', JSON.stringify(adminProfile));
                        alert('Profil bilgileriniz güncellendi!');
                      }}
                      className="px-10 py-3 bg-[#f0b90b] text-black font-black text-xs uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)]"
                    >
                      BİLGİLERİ KAYDET
                    </button>
                  </div>
                </section>

                {/* YÖNETİCİ BAKİYE YÜKLEME */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
                  <h4 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-zinc-500" /> YÖNETİCİ BAKİYE YÜKLEME
                  </h4>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 p-5 rounded-lg border border-zinc-800/40">
                    <div>
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Mevcut Bakiye</span>
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        {siteUser?.balance?.toFixed(2) || '0.00'} ₺
                      </span>
                    </div>
                    
                    <div className="flex items-end gap-3 flex-1 max-w-md">
                      <div className="space-y-2 flex-1">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Yatırmak İstediğiniz Tutar (₺)</label>
                        <input 
                          type="number" 
                          placeholder="Örn: 1000"
                          id="admin-balance-input"
                          className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white font-bold focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const input = document.getElementById('admin-balance-input') as HTMLInputElement;
                          const amount = parseFloat(input?.value);
                          if (isNaN(amount) || amount <= 0) {
                            alert('Lütfen geçerli bir tutar girin.');
                            return;
                          }
                          if (siteUser && onUpdateUser) {
                            const newBalance = (siteUser.balance || 0) + amount;
                            onUpdateUser({ ...siteUser, balance: newBalance });
                            alert(`${amount.toFixed(2)} ₺ başarıyla hesabınıza yüklendi.`);
                            if (input) input.value = '';
                          }
                        }}
                        className="px-6 py-3 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      >
                        Bakiye Yükle
                      </button>
                    </div>
                  </div>
                </section>

                {/* SECURITY SETTINGS */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
                  <h4 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-zinc-500" /> GÜVENLİK VE ŞİFRE
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">YENİ ŞİFRE</label>
                      <input 
                        type="password" 
                        value={passwordForm.new}
                        onChange={e => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                        className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white font-bold focus:border-[#f0b90b] outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">YENİ ŞİFRE (TEKRAR)</label>
                      <input 
                        type="password" 
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                        className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white font-bold focus:border-[#f0b90b] outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button 
                      onClick={() => {
                        alert('Şifre sıfırlama linki kayıtlı e-posta adresinize (admin@724bets.com) gönderildi.');
                      }}
                      className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-all underline underline-offset-4"
                    >
                      Şifremi Unuttum / Kurtar
                    </button>
                    <button 
                      onClick={() => {
                        if (!passwordForm.new || !passwordForm.confirm) {
                          alert('Lütfen şifre alanlarını doldurun.');
                          return;
                        }
                        if (passwordForm.new !== passwordForm.confirm) {
                          alert('Şifreler uyuşmuyor!');
                          return;
                        }
                        alert('Şifreniz başarıyla güncellendi!');
                        setPasswordForm({ current: '', new: '', confirm: '' });
                      }}
                      className="px-10 py-3 bg-zinc-800 text-white font-black text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-700 transition-all border border-zinc-700"
                    >
                      ŞİFREYİ GÜNCELLE
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleContentSection('hero')}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#00FFC2] rounded-full shadow-[0_0_10px_rgba(0,255,194,0.4)]" />
                  <h2 className="text-xs font-black uppercase tracking-tighter text-zinc-300 group-hover:text-white transition-colors">HERO (ANA SPONSOR)</h2>
                </div>
                {contentExpanded.hero ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
              </button>

              {contentExpanded.hero && (
                <div className="p-5 pt-0 border-t border-zinc-800/40 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Marka Adı</label>
                      <input value={localHero.name} onChange={(e) => setLocalHero({ ...localHero, name: e.target.value })} className="adm-input !py-2.5 !text-xs" placeholder="Marka Adı" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Logo URL</label>
                      <input value={localHero.logo} onChange={(e) => setLocalHero({ ...localHero, logo: e.target.value })} className="adm-input !py-2.5 !text-xs" placeholder="Logo URL" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Teklif</label>
                      <input value={localHero.offerMain} onChange={(e) => setLocalHero({ ...localHero, offerMain: e.target.value })} className="adm-input !py-2.5 !text-xs text-[#00FFC2]" placeholder="Teklif" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-600 uppercase ml-1">Alt Metin</label>
                      <input value={localHero.offerSub} onChange={(e) => setLocalHero({ ...localHero, offerSub: e.target.value })} className="adm-input !py-2.5 !text-xs" placeholder="Alt Metin" />
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between p-4">
                <button 
                  onClick={() => toggleContentSection('brands')}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-1 h-5 bg-[#00FFC2] rounded-full shadow-[0_0_10px_rgba(0,255,194,0.4)]" />
                  <h2 className="text-xs font-black uppercase tracking-tighter text-zinc-300 group-hover:text-white transition-colors">MARKALAR (GRID)</h2>
                  {contentExpanded.brands ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                </button>
                <button onClick={addBrand} className="bg-[#00FFC2]/10 text-[#00FFC2] hover:bg-[#00FFC2] hover:text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border border-[#00FFC2]/20 flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" /> YENİ EKLE
                </button>
              </div>

              {contentExpanded.brands && (
                <div className="p-5 pt-0 border-t border-zinc-800/40 animate-fade-in">
                  <div className="grid grid-cols-1 gap-2.5 mt-4">
                    {localBrands.map((brand, idx) => (
                      <div key={brand.id} className="bg-black/40 border border-zinc-800/40 p-2.5 rounded-lg flex items-center gap-3 hover:border-[#00FFC2]/30 transition-all group">
                        <div className="w-10 h-10 bg-black rounded-lg overflow-hidden border border-zinc-800 shrink-0">
                          <img src={brand.logo} className="w-full h-full object-cover" />
                        </div>
                        <input value={brand.name} onChange={(e) => handleBrandChange(idx, 'name', e.target.value)} className="adm-input !py-2 !text-[11px] flex-1" placeholder="Ad" />
                        <input value={brand.offerMain} onChange={(e) => handleBrandChange(idx, 'offerMain', e.target.value)} className="adm-input !py-2 !text-[11px] w-24 text-[#00FFC2]" placeholder="Teklif" />
                        <button onClick={() => setLocalBrands(localBrands.filter((_, i) => i !== idx))} className="text-rose-500/50 hover:text-rose-500 p-2 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>



            <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between p-4">
                <button 
                  onClick={() => toggleContentSection('slider')}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-1 h-5 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                  <div className="text-left">
                    <h2 className="text-xs font-black uppercase tracking-tighter text-zinc-300 group-hover:text-white transition-colors">Hero Slider Yönetimi</h2>
                    <p className="text-zinc-600 text-[9px] font-bold">Banner slider ayarları</p>
                  </div>
                  {contentExpanded.slider ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                </button>
                <div className="flex bg-black/40 p-1 rounded-lg border border-zinc-800/60">
                  <button
                    onClick={() => {
                      const u = { ...localHeroSlider, isActive: true };
                      setLocalHeroSlider(u);
                      onSaveHeroSliderConfig?.(u);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${localHeroSlider.isActive ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'text-zinc-500'}`}
                  >AKTİF</button>
                  <button
                    onClick={() => {
                      const u = { ...localHeroSlider, isActive: false };
                      setLocalHeroSlider(u);
                      onSaveHeroSliderConfig?.(u);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${!localHeroSlider.isActive ? 'bg-red-500 text-white' : 'text-zinc-500'}`}
                  >PASİF</button>
                </div>
              </div>

              {contentExpanded.slider && (
                <div className="p-5 pt-0 border-t border-zinc-800/40 animate-fade-in">
                  <div className="mt-4 flex items-center justify-between bg-black/20 p-3 rounded-lg border border-zinc-800/30">
                    <div className="flex items-center gap-4">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest shrink-0">Otomatik Geçiş (ms)</label>
                      <input
                        type="number"
                        value={localHeroSlider.autoPlayInterval}
                        onChange={(e) => setLocalHeroSlider({ ...localHeroSlider, autoPlayInterval: parseInt(e.target.value) || 5000 })}
                        className="bg-black border border-zinc-800/60 rounded-lg px-3 py-1.5 w-24 text-xs font-bold focus:border-purple-500 outline-none transition-all"
                        min={1000}
                        step={500}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newSlide: HeroSlide = {
                          id: Date.now().toString(),
                          imageUrl: '',
                          link: '',
                          title: 'Yeni Slide',
                          isActive: true,
                          order: (localHeroSlider.slides || []).length
                        };
                        setLocalHeroSlider({ ...localHeroSlider, slides: [...(localHeroSlider.slides || []), newSlide] });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> YENİ SLİDE EKLE
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(localHeroSlider.slides || [])
                      .sort((a, b) => a.order - b.order)
                      .map((slide, idx) => (
                      <div key={slide.id} className={`bg-black/30 border rounded-lg p-3 space-y-3 transition-all ${slide.isActive ? 'border-purple-500/20' : 'border-zinc-800 opacity-50'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 font-black text-[10px]">{idx + 1}</span>
                            <input 
                              value={slide.title} 
                              onChange={(e) => {
                                const slides = [...localHeroSlider.slides];
                                slides[idx].title = e.target.value;
                                setLocalHeroSlider({ ...localHeroSlider, slides });
                              }}
                              className="bg-transparent border-none text-xs font-black text-white focus:outline-none w-48"
                              placeholder="Slide Başlığı"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const slides = [...localHeroSlider.slides];
                                slides[idx].isActive = !slides[idx].isActive;
                                setLocalHeroSlider({ ...localHeroSlider, slides });
                              }}
                              className={`p-1.5 rounded-lg transition-all ${slide.isActive ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-800'}`}
                            >
                              {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => {
                                if (idx === 0) return;
                                const slides = [...localHeroSlider.slides].sort((a, b) => a.order - b.order);
                                const temp = slides[idx].order;
                                slides[idx].order = slides[idx - 1].order;
                                slides[idx - 1].order = temp;
                                setLocalHeroSlider({ ...localHeroSlider, slides });
                              }}
                              className="p-1.5 text-zinc-500 hover:text-white"
                            ><ChevronUp className="w-3.5 h-3.5" /></button>
                            <button
                              onClick={() => setLocalHeroSlider({ ...localHeroSlider, slides: localHeroSlider.slides.filter(s => s.id !== slide.id) })}
                              className="p-1.5 text-rose-500/50 hover:text-rose-500"
                            ><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <div className="flex gap-2 items-center">
                              <input 
                                value={slide.imageUrl} 
                                onChange={(e) => {
                                  const slides = [...localHeroSlider.slides];
                                  slides[idx].imageUrl = e.target.value;
                                  setLocalHeroSlider({ ...localHeroSlider, slides });
                                }}
                                className="adm-input !py-2 !text-[10px] flex-1" 
                                placeholder="Görsel URL" 
                              />
                              <label className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer whitespace-nowrap">
                                {uploadingSlideId === slide.id ? '...' : 'GÖRSEL SEÇ'}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleSlideImageUpload(slide.id, idx, e)} 
                                  className="hidden" 
                                />
                              </label>
                           </div>
                            <input 
                              value={slide.link} 
                              onChange={(e) => {
                                const slides = [...localHeroSlider.slides];
                                slides[idx].link = e.target.value;
                                setLocalHeroSlider({ ...localHeroSlider, slides });
                              }}
                              className="adm-input !py-2 !text-[10px]" 
                              placeholder="Yönlendirme Linki" 
                            />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between p-4">
                <button 
                  onClick={() => toggleContentSection('slider2')}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-1 h-5 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
                  <div className="text-left">
                    <h2 className="text-xs font-black uppercase tracking-tighter text-zinc-300 group-hover:text-white transition-colors">Slider 2 Yönetimi</h2>
                    <p className="text-zinc-600 text-[9px] font-bold">İnce banner slider ayarları</p>
                  </div>
                  {contentExpanded.slider2 ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                </button>
                <div className="flex bg-black/40 p-1 rounded-lg border border-zinc-800/60">
                  <button
                    onClick={() => {
                      const u = { ...localSlider2, isActive: true };
                      setLocalSlider2(u);
                      onSaveSlider2Config?.(u);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${localSlider2.isActive ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'text-zinc-500'}`}
                  >AKTİF</button>
                  <button
                    onClick={() => {
                      const u = { ...localSlider2, isActive: false };
                      setLocalSlider2(u);
                      onSaveSlider2Config?.(u);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${!localSlider2.isActive ? 'bg-red-500 text-white' : 'text-zinc-500'}`}
                  >PASİF</button>
                </div>
              </div>

              {contentExpanded.slider2 && (
                <div className="p-5 pt-0 border-t border-zinc-800/40 animate-fade-in">
                  <div className="mt-4 flex items-center justify-between bg-black/20 p-3 rounded-lg border border-zinc-800/30">
                    <div className="flex items-center gap-4">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest shrink-0">Otomatik Geçiş (ms)</label>
                      <input
                        type="number"
                        value={localSlider2.autoPlayInterval}
                        onChange={(e) => setLocalSlider2({ ...localSlider2, autoPlayInterval: parseInt(e.target.value) || 5000 })}
                        className="bg-black border border-zinc-800/60 rounded-lg px-3 py-1.5 w-24 text-xs font-bold focus:border-purple-500 outline-none transition-all"
                        min={1000}
                        step={500}
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newSlide: HeroSlide = {
                          id: Date.now().toString(),
                          imageUrl: '',
                          link: '',
                          title: 'Yeni Slide',
                          isActive: true,
                          order: (localSlider2.slides || []).length
                        };
                        setLocalSlider2({ ...localSlider2, slides: [...(localSlider2.slides || []), newSlide] });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> YENİ SLİDE EKLE
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(localSlider2.slides || [])
                      .sort((a, b) => a.order - b.order)
                      .map((slide, idx) => (
                      <div key={slide.id} className={`bg-black/30 border rounded-lg p-3 space-y-3 transition-all ${slide.isActive ? 'border-purple-500/20' : 'border-zinc-800 opacity-50'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 font-black text-[10px]">{idx + 1}</span>
                            <input 
                              value={slide.title} 
                              onChange={(e) => {
                                const slides = [...localSlider2.slides];
                                slides[idx].title = e.target.value;
                                setLocalSlider2({ ...localSlider2, slides });
                              }}
                              className="bg-transparent border-none text-xs font-black text-white focus:outline-none w-48"
                              placeholder="Slide Başlığı"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const slides = [...localSlider2.slides];
                                slides[idx].isActive = !slides[idx].isActive;
                                setLocalSlider2({ ...localSlider2, slides });
                              }}
                              className={`p-1.5 rounded-lg transition-all ${slide.isActive ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 bg-zinc-800'}`}
                            >
                              {slide.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => {
                                if (idx === 0) return;
                                const slides = [...localSlider2.slides].sort((a, b) => a.order - b.order);
                                const temp = slides[idx].order;
                                slides[idx].order = slides[idx - 1].order;
                                slides[idx - 1].order = temp;
                                setLocalSlider2({ ...localSlider2, slides });
                              }}
                              className="p-1.5 text-zinc-500 hover:text-white"
                            ><ChevronUp className="w-3.5 h-3.5" /></button>
                            <button
                              onClick={() => setLocalSlider2({ ...localSlider2, slides: localSlider2.slides.filter(s => s.id !== slide.id) })}
                              className="p-1.5 text-rose-500/50 hover:text-rose-500"
                            ><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <div className="flex gap-2 items-center">
                              <input 
                                value={slide.imageUrl} 
                                onChange={(e) => {
                                  const slides = [...localSlider2.slides];
                                  slides[idx].imageUrl = e.target.value;
                                  setLocalSlider2({ ...localSlider2, slides });
                                }}
                                className="adm-input !py-2 !text-[10px] flex-1" 
                                placeholder="Görsel URL" 
                              />
                              <label className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer whitespace-nowrap">
                                {uploadingSlideId === slide.id ? '...' : 'GÖRSEL SEÇ'}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleSlideImageUpload(slide.id, idx, e, 'slider2')} 
                                  className="hidden" 
                                />
                              </label>
                           </div>
                            <input 
                              value={slide.link} 
                              onChange={(e) => {
                                const slides = [...localSlider2.slides];
                                slides[idx].link = e.target.value;
                                setLocalSlider2({ ...localSlider2, slides });
                              }}
                              className="adm-input !py-2 !text-[10px]" 
                              placeholder="Yönlendirme Linki" 
                            />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
              <div className="flex items-center justify-between p-4">
                <button 
                  onClick={() => toggleContentSection('daily')}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-1 h-5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                  <div className="text-left">
                    <h2 className="text-xs font-black uppercase tracking-tighter text-zinc-300 group-hover:text-white transition-colors">Banko Kupon Yönetimi</h2>
                    <p className="text-zinc-600 text-[9px] font-bold">Günün banko kuponu maçları</p>
                  </div>
                  {contentExpanded.daily ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                </button>
                <div className="flex bg-black/40 p-1 rounded-lg border border-zinc-800/60">
                  <button
                    onClick={() => {
                      const u = { ...localDailyKupon, isActive: true };
                      setLocalDailyKupon(u);
                      onSaveDailyKuponConfig?.(u);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${localDailyKupon.isActive ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'text-zinc-500'}`}
                  >AKTİF</button>
                  <button
                    onClick={() => {
                      const u = { ...localDailyKupon, isActive: false };
                      setLocalDailyKupon(u);
                      onSaveDailyKuponConfig?.(u);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${!localDailyKupon.isActive ? 'bg-red-500 text-white' : 'text-zinc-500'}`}
                  >PASİF</button>
                </div>
              </div>

              {contentExpanded.daily && (
                <div className="p-5 pt-0 border-t border-zinc-800/40 animate-fade-in">
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-3 rounded-lg border border-zinc-800/30">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Kupon Başlığı</label>
                      <input value={localDailyKupon.title} onChange={(e) => setLocalDailyKupon({ ...localDailyKupon, title: e.target.value })} className="adm-input !py-2 !text-xs" placeholder="Günün Banko Kuponu" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Toplam Oran</label>
                      <input value={localDailyKupon.totalOdd} onChange={(e) => setLocalDailyKupon({ ...localDailyKupon, totalOdd: e.target.value })} className="adm-input !py-2 !text-xs text-emerald-400" placeholder="Örn: 2.45" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {localDailyKupon.matches.map((match, idx) => (
                      <div key={match.id} className="bg-black/40 border border-zinc-800/40 p-2.5 rounded-lg flex items-center gap-3 group">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                          <input value={match.time} onChange={(e) => {
                            const matches = [...localDailyKupon.matches];
                            matches[idx].time = e.target.value;
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }} className="adm-input !py-1.5 !text-[10px]" placeholder="Saat" />
                          <input value={match.homeTeam} onChange={(e) => {
                            const matches = [...localDailyKupon.matches];
                            matches[idx].homeTeam = e.target.value;
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }} className="adm-input !py-1.5 !text-[10px]" placeholder="Ev Sahibi" />
                          <input value={match.awayTeam} onChange={(e) => {
                            const matches = [...localDailyKupon.matches];
                            matches[idx].awayTeam = e.target.value;
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }} className="adm-input !py-1.5 !text-[10px]" placeholder="Deplasman" />
                          <input value={match.prediction} onChange={(e) => {
                            const matches = [...localDailyKupon.matches];
                            matches[idx].prediction = e.target.value;
                            setLocalDailyKupon({ ...localDailyKupon, matches });
                          }} className="adm-input !py-1.5 !text-[10px] text-emerald-400" placeholder="Tahmin" />
                        </div>
                        <button onClick={() => {
                          const matches = localDailyKupon.matches.filter((_, i) => i !== idx);
                          setLocalDailyKupon({ ...localDailyKupon, matches });
                        }} className="text-rose-500/50 hover:text-rose-500 p-2"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <button onClick={() => {
                      const newMatch = { id: Date.now().toString(), time: '20:00', homeTeam: '', awayTeam: '', prediction: '', odd: '1.50', league: '' };
                      setLocalDailyKupon({ ...localDailyKupon, matches: [...localDailyKupon.matches, newMatch] });
                    }} className="w-full py-2 border border-dashed border-zinc-800 rounded-lg text-zinc-500 hover:text-white hover:border-zinc-600 transition-all text-[10px] font-black uppercase">
                      + YENİ MAÇ EKLE
                    </button>
                  </div>
                </div>
              )}
              
              <div className="p-4 pt-0">
                <button
                  onClick={() => {
                    onSaveDailyKuponConfig?.(localDailyKupon);
                    alert('Banko Kupon ayarları kaydedildi!');
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] rounded-lg uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" /> BANKO KUPON KAYDET
                </button>
              </div>
            </section>

          </div>
        )}

        {/* ═══ LIVE ODDS MANAGEMENT ═══ */}
        {activeTab === 'liveodds' && (
          <div className="space-y-4 animate-fade-in">
            <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setContentExpanded(prev => ({ ...prev, liveodds_main: !prev.liveodds_main }))}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                    <Activity className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-black text-sm uppercase tracking-tight italic">CANLI ORAN YÖNETİMİ</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Header kayan bant maçlarını yönetin</p>
                  </div>
                </div>
                {contentExpanded.liveodds_main ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
              </button>

              {contentExpanded.liveodds_main && (
                <div className="p-6 pt-0 animate-fade-in space-y-6">
                  <div className="flex items-center justify-between bg-black/40 border border-zinc-800/50 p-5 rounded-lg">
                    <div className="flex items-center gap-4">
                       <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                         <button onClick={() => { const u = { ...localLiveOdds, isActive: true }; setLocalLiveOdds(u); onSaveLiveOddsConfig?.(u); }}
                           className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${localLiveOdds.isActive ? 'bg-emerald-500 text-black' : 'text-zinc-500'}`}>AKTİF</button>
                         <button onClick={() => { const u = { ...localLiveOdds, isActive: false }; setLocalLiveOdds(u); onSaveLiveOddsConfig?.(u); }}
                           className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${!localLiveOdds.isActive ? 'bg-rose-500 text-white' : 'text-zinc-500'}`}>PASİF</button>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setShowLiveOddsBulkModal(true)} className="adm-btn-primary bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 text-[10px]">TOPLU EKLE</button>
                       <button onClick={() => {
                         const newMatch: LiveOddsMatch = { id: Date.now().toString(), homeTeam: '', awayTeam: '', league: '', matchTime: '20:00', odd1: '1.90', oddX: '3.50', odd2: '3.80', isLive: false, link: 'https://' };
                         const u = { ...localLiveOdds, matches: [...(localLiveOdds.matches || []), newMatch] }; setLocalLiveOdds(u); onSaveLiveOddsConfig?.(u);
                       }} className="adm-btn-primary px-6 py-2 text-[10px]">+ YENİ MAÇ</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {localLiveOdds.matches.map((match, idx) => (
                      <div key={match.id} className="p-4 bg-black/40 border border-zinc-800/50 rounded-lg flex items-center gap-4 group">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                          <input value={match.homeTeam} onChange={e => {
                            const u = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, homeTeam: e.target.value } : m) }; setLocalLiveOdds(u);
                          }} onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white" placeholder="Ev Sahibi" />
                          <input value={match.awayTeam} onChange={e => {
                            const u = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, awayTeam: e.target.value } : m) }; setLocalLiveOdds(u);
                          }} onBlur={() => onSaveLiveOddsConfig?.(localLiveOdds)} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white" placeholder="Deplasman" />
                          <div className="flex gap-2">
                             <input value={match.odd1} className="w-full bg-black border border-amber-500/20 text-amber-500 text-center rounded-lg p-2 text-xs font-black" placeholder="1" />
                             <input value={match.oddX} className="w-full bg-black border border-zinc-800 text-zinc-400 text-center rounded-lg p-2 text-xs font-black" placeholder="X" />
                             <input value={match.odd2} className="w-full bg-black border border-blue-500/20 text-blue-400 text-center rounded-lg p-2 text-xs font-black" placeholder="2" />
                          </div>
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => {
                               const u = { ...localLiveOdds, matches: localLiveOdds.matches.map(m => m.id === match.id ? { ...m, isLive: !m.isLive } : m) }; setLocalLiveOdds(u); onSaveLiveOddsConfig?.(u);
                             }} className={`p-2 rounded-lg text-[10px] font-black ${match.isLive ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>LIVE</button>
                             <button onClick={() => {
                               const u = { ...localLiveOdds, matches: localLiveOdds.matches.filter(m => m.id !== match.id) }; setLocalLiveOdds(u); onSaveLiveOddsConfig?.(u);
                             }} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Live Odds Bulk Modal */}
        {showLiveOddsBulkModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 border border-blue-500/20 p-5 rounded-lg max-w-2xl w-full shadow-[0_0_50px_rgba(59,130,246,0.1)] relative">
              <button
                onClick={() => setShowLiveOddsBulkModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <Layers className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase">Toplu Maç Ekleme</h3>
                  <p className="text-zinc-400 text-sm mt-1">Maçları alt alta yapıştırarak hızlıca ekleyin.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-lg">
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
                  className="w-full h-48 bg-black border border-zinc-800 rounded-lg p-6 text-white text-sm focus:border-blue-500/50 transition-all outline-none resize-none"
                />

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowLiveOddsBulkModal(false)}
                    className="flex-1 py-4 rounded-lg border border-zinc-800 text-zinc-400 font-black text-xs uppercase tracking-widest hover:bg-zinc-900 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleLiveOddsBulkParse}
                    className="flex-[2] py-4 rounded-lg bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
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
            <div className="bg-zinc-950 border border-[#f0b90b]/20 p-5 rounded-lg max-w-2xl w-full shadow-[0_0_50px_rgba(240,185,11,0.1)] relative">
              <button
                onClick={() => setShowCouponAiModal(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#f0b90b] to-yellow-600 flex items-center justify-center shadow-[0_0_30px_rgba(240,185,11,0.3)]">
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
                        className={`py-3 rounded-lg border font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 ${couponRiskLevel === 'LOW' ? 'bg-green-500/20 text-green-500 border-green-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                      >
                        <span className="text-xs">DÜŞÜK</span><span className="text-[8px] opacity-70">(KASA)</span>
                      </button>
                      <button
                        onClick={() => setCouponRiskLevel('MEDIUM')}
                        className={`py-3 rounded-lg border font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 ${couponRiskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
                      >
                        <span className="text-xs">ORTA</span><span className="text-[8px] opacity-70">(İDEAL)</span>
                      </button>
                      <button
                        onClick={() => setCouponRiskLevel('HIGH')}
                        className={`py-3 rounded-lg border font-black text-[10px] transition-all flex flex-col items-center justify-center gap-1 ${couponRiskLevel === 'HIGH' ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}
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
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-[14px] text-sm focus:border-[#f0b90b] transition-all outline-none"
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
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white font-bold tracking-widest focus:outline-none focus:border-[#f0b90b]/50 transition-colors"
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
                    className="w-full h-48 bg-zinc-900/50 border border-zinc-800 rounded-lg p-5 text-zinc-300 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:border-[#f0b90b]/50 placeholder:text-zinc-700 transition-colors"
                  />
                </div>

                <button
                  onClick={handleCouponAiParse}
                  className="w-full bg-gradient-to-r from-[#f0b90b] to-yellow-500 text-black font-black py-4 rounded-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(240,185,11,0.2)]"
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
              <>
                {/* AI COUPON WIZARD SECTION */}
                <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setContentExpanded(prev => ({ ...prev, coupons_wizard: !prev.coupons_wizard }))}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-black text-sm uppercase tracking-tight italic">AI KUPON SİHİRBAZI</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Metinden otomatik kupon üretin</p>
                      </div>
                    </div>
                    {contentExpanded.coupons_wizard ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
                  </button>

                  {contentExpanded.coupons_wizard && (
                    <div className="p-6 pt-0 animate-fade-in">
                      <div className="bg-black/40 border border-zinc-800/50 p-6 rounded-lg flex items-center justify-between">
                         <button onClick={() => setShowCouponAiModal(true)} className="adm-btn-primary bg-amber-500 hover:bg-amber-400 text-black px-8 py-3">SİHİRBAZI BAŞLAT</button>
                         <p className="text-zinc-500 text-[10px] font-bold uppercase max-w-xs text-right italic">YÜZLERCE MAÇI SANİYELER İÇERİSİNDE ANALİZ EDİP KUPONA DÖNÜŞTÜRÜN.</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* COUPON LIST SECTION */}
                <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
                  <button 
                    onClick={() => setContentExpanded(prev => ({ ...prev, coupons_list: !prev.coupons_list }))}
                    className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                        <Ticket className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-white font-black text-sm uppercase tracking-tight italic">YAYINDAKİ KUPONLAR ({localCoupons.length})</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Sitede aktif olan tüm kuponları yönetin</p>
                      </div>
                    </div>
                    {contentExpanded.coupons_list ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
                  </button>

                  {contentExpanded.coupons_list && (
                    <div className="p-6 pt-0 animate-fade-in space-y-4">
                      <div className="flex justify-end mb-2">
                        <button onClick={() => {
                          const newId = Date.now().toString();
                          const newCoupon: Coupon = { id: newId, title: 'Günün Banko Kuponu', riskLevel: 'LOW', matches: [{ matchId: '1', homeTeam: '', awayTeam: '', prediction: '', odd: '1.50' }], totalOdd: '1.50', date: new Date().toISOString().split('T')[0] };
                          const updated = [newCoupon, ...localCoupons]; setLocalCoupons(updated); onSaveCoupons(updated); setEditingCouponId(newId);
                        }} className="adm-btn-primary px-6 py-2 text-[10px] uppercase tracking-widest">+ MANUEL EKLE</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {localCoupons.map(coupon => (
                          <div key={coupon.id} className="p-4 bg-black/40 border border-zinc-800/50 rounded-lg flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${coupon.riskLevel === 'LOW' ? 'bg-green-500/20 text-green-500' : 'bg-rose-500/20 text-rose-500'}`}>{coupon.riskLevel}</span>
                                 <span className="text-zinc-600 text-[9px] font-bold">{coupon.date}</span>
                               </div>
                               <h4 className="text-white font-black text-xs uppercase italic">{coupon.title}</h4>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => setEditingCouponId(coupon.id)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                               <button onClick={() => { if(confirm('Silmek istediğine emin misin?')) { const u = localCoupons.filter(c => c.id !== coupon.id); setLocalCoupons(u); onSaveCoupons(u); } }} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </>
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
                            className="flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xs transition-colors bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-700/50"
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
                            className="flex items-center gap-2 bg-[#f0b90b] text-black font-black px-5 py-2 rounded-lg text-xs uppercase shadow-[0_0_15px_rgba(240,185,11,0.2)] hover:shadow-[0_0_20px_#f0b90b] transition-all active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5" /> DEĞİŞİKLİKLERİ UYGULA
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">DÜZENLENİYOR: {coupon.id}</span>
                        </div>
                      </div>

                      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase">KUPON BAŞLIĞI</label>
                            <input value={coupon.title} onChange={(e) => {
                              const updated = [...localCoupons]; updated[idx].title = e.target.value; setLocalCoupons(updated);
                            }} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[#f0b90b] transition-all outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-zinc-500 uppercase">RİSK SEVİYESİ</label>
                            <select
                              value={coupon.riskLevel}
                              onChange={(e) => {
                                const updated = [...localCoupons]; updated[idx].riskLevel = e.target.value as any; setLocalCoupons(updated);
                              }}
                              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[#f0b90b] transition-all outline-none"
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
                            }} className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm text-[#f0b90b] font-black focus:border-[#f0b90b] transition-all outline-none" placeholder="1.50" />
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
                              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[#f0b90b] transition-all outline-none"
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
                              className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[#f0b90b] transition-all outline-none text-white [color-scheme:dark]" 
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
                              className="text-[10px] bg-zinc-800 hover:bg-zinc-750 text-white px-3 py-1.5 rounded-lg border border-zinc-700 transition-all font-bold"
                            >
                              + MAÇ EKLE
                            </button>
                          </div>
                          <div className="space-y-3">
                            {coupon.matches.map((match, midx) => (
                              <div key={midx} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-black/50 p-4 rounded-lg border border-zinc-800/50 relative group">
                                <input value={match.homeTeam} onChange={(e) => {
                                  const updated = [...localCoupons]; updated[idx].matches[midx].homeTeam = e.target.value; setLocalCoupons(updated);
                                }} className="bg-black border border-zinc-800 rounded-lg p-2 text-xs" placeholder="Ev Sahibi" />
                                <input value={match.awayTeam} onChange={(e) => {
                                  const updated = [...localCoupons]; updated[idx].matches[midx].awayTeam = e.target.value; setLocalCoupons(updated);
                                }} className="bg-black border border-zinc-800 rounded-lg p-2 text-xs" placeholder="Deplasman" />
                                <input value={match.prediction} onChange={(e) => {
                                  const updated = [...localCoupons]; updated[idx].matches[midx].prediction = e.target.value; setLocalCoupons(updated);
                                }} className="bg-black border border-zinc-800 rounded-lg p-2 text-xs font-bold text-[#f0b90b]" placeholder="Tahmin" />
                                <input value={match.odd} onChange={(e) => {
                                  const updated = [...localCoupons]; updated[idx].matches[midx].odd = e.target.value; setLocalCoupons(updated);
                                }} className="bg-black border border-zinc-800 rounded-lg p-2 text-xs text-center" placeholder="Oran" />
                                <button
                                  onClick={() => {
                                    const updated = [...localCoupons];
                                    updated[idx].matches = updated[idx].matches.filter((_, i) => i !== midx);
                                    setLocalCoupons(updated);
                                  }}
                                  className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-lg transition-all flex items-center justify-center"
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
                            className="px-8 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-white font-black text-xs uppercase"
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
            <>
              {/* AI ANALYSIS GENERATOR SECTION */}
              <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setContentExpanded(prev => ({ ...prev, analysis_add: !prev.analysis_add }))}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-black text-sm uppercase tracking-tight italic">AI ANALİZ SİHİRBAZI</h3>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">ChatGPT verilerini anlık işleyin</p>
                    </div>
                  </div>
                  {contentExpanded.analysis_add ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
                </button>

                {contentExpanded.analysis_add && (
                  <div className="p-6 pt-0 animate-fade-in">
                    <div className="bg-black/40 border border-zinc-800/50 p-6 rounded-lg flex items-center justify-between">
                       <div className="flex gap-3">
                         <button onClick={() => setShowAiModal(true)} className="adm-btn-primary bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3">AI SMART PASTE</button>
                         <button onClick={() => {
                           const newId = Date.now().toString();
                           const newA: MatchAnalysis = { id: newId, league: 'Süper Lig', homeTeam: '', awayTeam: '', matchTime: '20:00', matchDate: new Date().toISOString().split('T')[0], analysis: '', tacticalSummary: '', breakingPoint: '', bettingScenario: '', prediction: '', confidence: 85, modelScore: 92, recentHistory: '', expectedGoals: '', bookieOdds: [], createdAt: Date.now() };
                           const u = [newA, ...localAnalyses]; setLocalAnalyses(u); onSaveAnalyses(u); setEditingAnalysisId(newId);
                         }} className="adm-btn-primary px-8 py-3">+ MANUEL EKLE</button>
                       </div>
                       <p className="text-zinc-500 text-[10px] font-bold uppercase max-w-xs text-right italic">SPOR VERİLERİNİ VE TAKTİKSEL ANALİZLERİ TEK TIKLA SİTEYE YÜKLEYİN.</p>
                    </div>
                  </div>
                )}
              </section>

              {/* ANALYSIS LIST SECTION */}
              <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setContentExpanded(prev => ({ ...prev, analysis_list: !prev.analysis_list }))}
                  className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-white font-black text-sm uppercase tracking-tight italic">YAYINDAKİ ANALİZLER ({localAnalyses.length})</h3>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Tahminleri ve maç detaylarını düzenleyin</p>
                    </div>
                  </div>
                  {contentExpanded.analysis_list ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
                </button>

                {contentExpanded.analysis_list && (
                  <div className="p-6 pt-0 animate-fade-in space-y-3">
                    {localAnalyses.map(analysis => (
                      <div key={analysis.id} className="p-4 bg-black/40 border border-zinc-800/50 rounded-lg flex items-center justify-between group hover:border-blue-500/30 transition-all">
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded uppercase bg-zinc-800 text-zinc-400">{analysis.league}</span>
                              <span className="text-zinc-600 text-[9px] font-bold">{analysis.matchDate}</span>
                            </div>
                            <h4 className="text-white font-black text-xs uppercase italic">{analysis.homeTeam} - {analysis.awayTeam}</h4>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditingAnalysisId(analysis.id)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => { if(confirm('Sileyim mi?')) { const u = localAnalyses.filter(a => a.id !== analysis.id); setLocalAnalyses(u); onSaveAnalyses(u); } }} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
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
                          className="flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xs transition-colors bg-zinc-800/50 px-4 py-2 rounded-lg border border-zinc-700/50"
                        >
                          <ChevronLeft className="w-4 h-4" /> GERİ DÖN
                        </button>
                        <button
                          onClick={() => {
                            onSaveAnalyses(localAnalyses);
                            handleSave();
                            alert('Analiz başarıyla güncellendi!');
                          }}
                          className="flex items-center gap-2 bg-[#f0b90b] text-black font-black px-5 py-2 rounded-lg text-xs uppercase shadow-[0_0_15px_rgba(240,185,11,0.2)] hover:shadow-[0_0_20px_#f0b90b] transition-all active:scale-95"
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

                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl relative flex flex-col">
                      {/* Compact Tab Header */}
                      <div className="flex items-center bg-zinc-800/30 border-b border-zinc-800 p-2 gap-2 overflow-x-auto hide-scrollbar">
                        <button onClick={() => setEditAnalysisTab('basic')} className={`flex-1 min-w-[120px] py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg transition-all flex justify-center ${editAnalysisTab === 'basic' ? 'bg-[#f0b90b] text-black shadow-lg shadow-black/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'}`}>1. Temel Bilgiler</button>
                        <button onClick={() => setEditAnalysisTab('details')} className={`flex-1 min-w-[120px] py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg transition-all flex justify-center ${editAnalysisTab === 'details' ? 'bg-[#f0b90b] text-black shadow-lg shadow-black/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'}`}>2. Detaylı Analiz</button>
                        <button onClick={() => setEditAnalysisTab('stats')} className={`flex-1 min-w-[120px] py-3 px-4 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg transition-all flex justify-center ${editAnalysisTab === 'stats' ? 'bg-[#f0b90b] text-black shadow-lg shadow-black/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-700/50'}`}>3. Oranlar & İstatistik</button>
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
                                }} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none" placeholder="Örn: La Liga" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3 h-3" /> MAÇ TARİHİ</label>
                                <input type="date" value={analysis.matchDate} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].matchDate = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" /> MAÇ SAATİ</label>
                                <input value={analysis.matchTime} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].matchTime = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none text-white font-bold" placeholder="22:00" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-3 h-3" /> GÜVEN ORANI (%)</label>
                                <input type="number" value={analysis.confidence} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].confidence = parseInt(e.target.value); setLocalAnalyses(updated);
                                }} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-[#f0b90b] font-black focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none" />
                              </div>
                            </div>
                            
                            {/* Grid 2: Teams VS Layout */}
                            <div className="bg-black/40 border border-zinc-800/80 rounded-lg p-5 md:p-6 shadow-inner">
                              <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1 w-full space-y-2">
                                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic md:pl-2">EV SAHİBİ</label>
                                  <input value={analysis.homeTeam} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].homeTeam = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-5 py-4 text-white font-black uppercase italic text-base text-center md:text-left focus:bg-black focus:border-[#f0b90b] transition-all outline-none" placeholder="EV SAHİBİ" />
                                </div>
                                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-black text-[12px] text-zinc-400 shrink-0 shadow-inner z-10 border-4 border-zinc-900">VS</div>
                                <div className="flex-1 w-full space-y-2">
                                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic text-right block md:pr-2">DEPLASMAN</label>
                                  <input value={analysis.awayTeam} onChange={(e) => {
                                    const updated = [...localAnalyses]; updated[idx].awayTeam = e.target.value; setLocalAnalyses(updated);
                                  }} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-5 py-4 text-white font-black uppercase italic text-base text-center md:text-right focus:bg-black focus:border-[#f0b90b] transition-all outline-none" placeholder="DEPLASMAN" />
                                </div>
                              </div>
                            </div>

                            {/* Prediction */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-[#f0b90b] uppercase tracking-widest italic">NET TAHMİN MOTTOSU</label>
                              <input value={analysis.prediction} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].prediction = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full bg-[#f0b90b]/5 border border-[#f0b90b]/30 rounded-lg px-5 py-4 text-[#f0b90b] font-black uppercase italic text-lg focus:bg-[#f0b90b]/10 focus:border-[#f0b90b] transition-all outline-none shadow-[0_0_15px_rgba(240,185,11,0.05)]" placeholder="Örn: KG VAR / 2.5 ÜST" />
                            </div>
                          </div>
                        )}

                        {editAnalysisTab === 'details' && (
                          <div className="space-y-6 animate-fade-in-up">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><ClipboardList className="w-4 h-4 text-[#f0b90b]" /> GENEL ANALİZ METNİ</label>
                              <textarea value={analysis.analysis} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].analysis = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full h-32 bg-black border border-zinc-800 rounded-lg px-5 py-4 text-[14px] text-zinc-300 resize-y focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none leading-relaxed italic" placeholder="Bu maça ait genel düşüncelerinizi, takım durumlarını buraya yazın..." />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Search className="w-4 h-4 text-blue-400" /> TAKTİK ÖZET</label>
                              <textarea value={analysis.tacticalSummary} onChange={(e) => {
                                const updated = [...localAnalyses]; updated[idx].tacticalSummary = e.target.value; setLocalAnalyses(updated);
                              }} className="w-full h-24 bg-black border border-zinc-800 rounded-lg px-5 py-4 text-[14px] text-zinc-300 resize-y focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none leading-relaxed" placeholder="Takımların taktiksel dizilişleri, eksikleri veya oyun tarzları..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Zap className="w-4 h-4 text-orange-400" /> KIRILMA ANI</label>
                                <textarea value={analysis.breakingPoint} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].breakingPoint = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full h-24 bg-black border border-zinc-800 rounded-lg px-5 py-4 text-[14px] text-zinc-300 resize-y focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none leading-relaxed" placeholder="Maçta işlerin değişebileceği an (örneğin ilk golü kim atar)..." />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4 text-emerald-400" /> BAHİS SENARYOSU</label>
                                <textarea value={analysis.bettingScenario} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].bettingScenario = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full h-24 bg-black border border-zinc-800 rounded-lg px-5 py-4 text-[14px] text-zinc-300 resize-y focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b]/50 transition-all outline-none leading-relaxed" placeholder="İdeal bahis akışı (örneğin: İlk yarı 0.5 üst mantıklı)..." />
                              </div>
                            </div>
                          </div>
                        )}

                        {editAnalysisTab === 'stats' && (
                          <div className="space-y-4 animate-fade-in-up">
                            {/* İstatistik Satırı */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/30 p-6 rounded-lg border border-zinc-800/80">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#f0b90b]" /> MODEL SKORU</label>
                                <div className="flex items-center gap-4 bg-black border border-zinc-800 p-2 rounded-lg">
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
                                }} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3.5 text-white font-black text-sm outline-none focus:border-[#f0b90b]" placeholder="Örn: 8 Kazanç, 2 Kayıp" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-[#f0b90b]" /> LİG xG BEKLENTİSİ</label>
                                <input value={analysis.expectedGoals} onChange={(e) => {
                                  const updated = [...localAnalyses]; updated[idx].expectedGoals = e.target.value; setLocalAnalyses(updated);
                                }} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3.5 text-white font-black text-sm outline-none focus:border-[#f0b90b]" placeholder="Örn: 3.1" />
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
                                  <div key={bidx} className={`flex flex-col lg:flex-row items-center gap-4 bg-black border ${bookie.isHighest ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-zinc-800'} rounded-lg p-4 relative overflow-hidden transition-all duration-300`}>
                                    
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
                                        }} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-2 text-[15px] text-[#f0b90b] font-black text-center outline-none focus:bg-black focus:border-[#f0b90b] transition-all" />
                                      </div>

                                      <div className="w-full lg:w-24">
                                        <label className="text-[9px] font-black text-zinc-500 uppercase mb-1.5 block text-center">2.5 ÜST</label>
                                        <input value={bookie.odd2} onChange={(e) => {
                                          const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].odd2 = e.target.value; setLocalAnalyses(updated);
                                        }} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-2 text-[15px] text-[#f0b90b] font-black text-center outline-none focus:bg-black focus:border-[#f0b90b] transition-all" />
                                      </div>
                                    </div>

                                    <div className="w-full flex-grow">
                                      <label className="text-[9px] font-black text-zinc-500 uppercase mb-1.5 block">AFFILIATE YÖNLENDİRME LİNKİ</label>
                                      <input value={bookie.link} onChange={(e) => {
                                        const updated = [...localAnalyses]; updated[idx].bookieOdds[bidx].link = e.target.value; setLocalAnalyses(updated);
                                      }} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-[11px] text-zinc-400 font-mono outline-none focus:bg-black focus:border-blue-500 transition-all" placeholder="https://..." />
                                    </div>

                                    <label className="w-full lg:w-[160px] flex-shrink-0 flex items-center justify-between lg:justify-end gap-3 cursor-pointer select-none bg-zinc-900/50 hover:bg-zinc-800/80 px-4 py-2.5 rounded-lg border border-zinc-800/50 transition-colors">
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
                            className="flex-1 sm:flex-none px-6 py-3.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-black text-[11px] uppercase tracking-widest transition-all active:scale-95"
                          >
                            İPTAL
                          </button>
                          <button
                            onClick={(e) => {
                              handleSave();
                              setEditingAnalysisId(null); // Return to list view directly
                            }}
                            className="flex-1 sm:flex-none px-8 py-3.5 rounded-lg bg-[#f0b90b] text-black font-black text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
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
          <div className="space-y-4 animate-fade-in">
            <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setContentExpanded(prev => ({ ...prev, style_main: !prev.style_main }))}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                    <Palette className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-black text-sm uppercase tracking-tight italic">ANA RENK VE TEMA</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Sitenin ana vurgu rengini buradan değiştirin</p>
                  </div>
                </div>
                {contentExpanded.style_main ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
              </button>

              {contentExpanded.style_main && (
                <div className="p-6 pt-0 animate-fade-in">
                  <div className="bg-black/40 border border-zinc-800/50 rounded-lg p-6 flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Marka Vurgu Rengi</h4>
                      <p className="text-zinc-500 text-[10px]">Butonlar, ikonlar ve önemli vurgular için kullanılır.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-zinc-400 bg-black px-3 py-2 rounded-lg border border-zinc-800 uppercase">{themeColor}</span>
                      <input 
                        type="color" 
                        value={themeColor} 
                        onChange={(e) => onThemeChange(e.target.value)} 
                        className="w-14 h-14 bg-transparent cursor-pointer rounded-lg overflow-hidden border-2 border-zinc-800" 
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={handleSave} className="adm-btn-primary px-8">KAYDET</button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4 animate-fade-in">
            <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setContentExpanded(prev => ({ ...prev, seo_main: !prev.seo_main }))}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                    <Search className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-black text-sm uppercase tracking-tight italic">SEO HASHTAG YÖNETİMİ</h3>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Google ve sosyal medya arama sonuçlarını optimize edin</p>
                  </div>
                </div>
                {contentExpanded.seo_main ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
              </button>

              {contentExpanded.seo_main && (
                <div className="p-6 pt-0 animate-fade-in">
                  <div className="bg-black/40 border border-zinc-800/50 rounded-lg p-6 space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block pl-1">Hashtagler (Virgülle ayırın)</label>
                    <textarea 
                      value={localHashtags} 
                      onChange={(e) => setLocalHashtags(e.target.value)} 
                      placeholder="#bahis #canlıbahis #724bets..."
                      className="w-full h-48 bg-black border border-zinc-800 rounded-lg p-5 outline-none focus:border-blue-500/50 text-zinc-300 font-mono text-sm resize-none leading-relaxed" 
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={handleSave} className="adm-btn-primary px-8">KAYDET</button>
                  </div>
                </div>
              )}
            </section>
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
                  className="bg-indigo-600 text-white font-black px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 text-xs uppercase"
                >
                  <Box className="w-4 h-4" /> FORMATLA
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#f0b90b] text-black font-black px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(240,185,11,0.3)] transition-all active:scale-95 text-xs uppercase"
                >
                  <Save className="w-4 h-4" /> JSON'U KAYDET
                </button>
              </div>
            </div>

            {jsonError && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-500 font-bold text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{jsonError}</p>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 h-[70vh] flex flex-col">
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
                className="flex-1 w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-6 text-emerald-400 font-mono text-[13px] resize-none focus:border-[#f0b90b] focus:ring-1 focus:ring-[#f0b90b] transition-all outline-none leading-relaxed"
                placeholder="{ ... }"
              />
            </div>
          </div>
        )}

        {/* ===== GUEST MANAGEMENT TAB ===== */}
        {activeTab === 'guests' && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <Lock className="text-[#f0b90b]" /> MİSAFİR HESAPLARI
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase mt-1">Sadece ziyaretçi yetkisi olan misafir hesapları oluşturun</p>
            </div>

            {/* Create New Guest */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-5">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#f0b90b]" /> YENİ MİSAFİR OLUŞTUR
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={newGuestUsername}
                    onChange={(e) => setNewGuestUsername(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm focus:border-[#f0b90b] transition-all outline-none"
                    placeholder="misafir123"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Şifre</label>
                  <input
                    type="text"
                    value={newGuestPassword}
                    onChange={(e) => setNewGuestPassword(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg px-4 py-3 text-white text-sm focus:border-[#f0b90b] transition-all outline-none"
                    placeholder="123456"
                  />
                </div>
              </div>

              {guestErrorMsg && <p className="text-red-500 text-xs font-bold">{guestErrorMsg}</p>}
              {guestSaveMsg && <p className="text-emerald-500 text-xs font-bold">{guestSaveMsg}</p>}

              <button
                onClick={() => {
                  setGuestErrorMsg(''); setGuestSaveMsg('');
                  if (!newGuestUsername.trim() || !newGuestPassword.trim()) {
                    setGuestErrorMsg('Lütfen kullanıcı adı ve şifre girin.');
                    return;
                  }
                  if (newGuestUsername.toLowerCase() === 'mersobahis' || newGuestUsername.toLowerCase() === 'admin') {
                    setGuestErrorMsg('Bu kullanıcı adı sistem tarafından rezerve edilmiştir.');
                    return;
                  }
                  const existing = guestAccounts.find(g => g.username.toLowerCase() === newGuestUsername.toLowerCase());
                  if (existing) {
                    setGuestErrorMsg('Bu kullanıcı adıyla zaten bir misafir var.');
                    return;
                  }
                  
                  const newGuest = {
                    id: Date.now().toString(),
                    username: newGuestUsername.trim(),
                    password: newGuestPassword.trim(),
                    createdAt: Date.now()
                  };
                  
                  const updated = [...guestAccounts, newGuest];
                  setGuestAccounts(updated);
                  localStorage.setItem('site_guests', JSON.stringify(updated));
                  setGuestSaveMsg(`"${newGuest.username}" misafiri başarıyla oluşturuldu!`);
                  setNewGuestUsername(''); setNewGuestPassword('');
                  setTimeout(() => setGuestSaveMsg(''), 3000);
                }}
                className="w-full bg-[#f0b90b] hover:bg-[#f0b90b]/90 text-black font-black py-3.5 rounded-lg transition-all text-sm tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> OLUŞTUR
              </button>
            </div>

            {/* List Existing Guests */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#f0b90b]" /> MEVCUT MİSAFİRLER
                </h3>
              </div>
              
              <div className="divide-y divide-zinc-800">
                <div className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        mersobahis <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-black">SİSTEM</span>
                      </h4>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Şifre: 123456</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-zinc-800 rounded text-xs text-zinc-500">Silinemez</div>
                </div>

                {guestAccounts.map(g => (
                  <div key={g.id} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {g.username} <span className="bg-zinc-700 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded font-black">MİSAFİR</span>
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">Şifre: {g.password}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`'${g.username}' misafirini silmek istediğinize emin misiniz?`)) {
                          const updated = guestAccounts.filter(x => x.id !== g.id);
                          setGuestAccounts(updated);
                          localStorage.setItem('site_guests', JSON.stringify(updated));
                        }
                      }}
                      className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Misafiri Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {guestAccounts.length === 0 && (
                  <div className="p-8 text-center text-zinc-500 text-xs">
                    Henüz özel oluşturulmuş bir misafir hesabı bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== EDITOR MANAGEMENT TAB ===== */}
        {activeTab === 'backup' && (
          <div>Backup Tab Placeholder</div>
        )}

        {activeTab === 'editors' && (
          <div className="space-y-4 animate-fade-in-up">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <Users className="text-[#f0b90b]" /> EDİTÖR YÖNETİMİ
              </h2>
              <p className="text-zinc-500 text-xs font-bold uppercase mt-1">Kayıtlı editörleri yönet, yeni editör oluştur</p>
            </div>

            {/* Create New Editor */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-5">
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
                    className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white text-sm focus:border-[#f0b90b] outline-none"
                    placeholder="Ahmet Editör"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={newEditorUsername}
                    onChange={e => setNewEditorUsername(e.target.value)}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-3 px-4 text-white text-sm focus:border-[#f0b90b] outline-none"
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
                      className="w-full bg-black border border-zinc-800 rounded-lg py-3 pl-4 pr-10 text-white text-sm focus:border-[#f0b90b] outline-none"
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
                className="px-6 py-3 bg-[#f0b90b] text-black font-black text-xs rounded-lg uppercase tracking-widest hover:bg-[#f0b90b]/90 transition-all"
              >
                EDİTÖR OLUŞTUR
              </button>
            </div>

            {/* Existing Editors */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
              <h3 className="text-white font-black text-sm mb-5 flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-400" /> MEVCUT EDİTÖRLER
                <span className="ml-auto text-xs text-zinc-500 font-bold">({editorAccounts.length} editör)</span>
              </h3>
              {editorAccounts.length === 0 ? (
                <p className="text-zinc-600 text-xs font-bold text-center py-6">Henüz editör oluşturulmadı.</p>
              ) : (
                <div className="space-y-3">
                  {editorAccounts.map(editor => (
                    <div key={editor.id} className="flex items-center justify-between bg-black border border-zinc-800 rounded-lg px-4 py-3">
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
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-lg p-4">
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
              <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
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
                <div key={reward.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg space-y-4 hover:border-amber-400/50 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black border border-zinc-800 group-hover:border-amber-400/30">
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
                        className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs font-black uppercase italic"
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
                          className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-amber-400 font-black"
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
                          className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-[10px] font-bold"
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
                className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all py-12"
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
          <div className="relative bg-zinc-900 w-full max-w-5xl p-5 rounded-lg border border-[#f0b90b]/30 shadow-[0_0_50px_rgba(240,185,11,0.15)] animate-scale-in flex flex-col md:flex-row gap-8">
            
            {/* Prompt Generator Side */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#f0b90b] rounded-lg flex items-center justify-center shadow-lg shadow-[#f0b90b]/20">
                  <Sparkles className="text-black w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tight">AI PROMPT YARDIMCISI</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">BU METNİ KOPYALAYIP CHATGPT'YE YAPIŞTIRIN</p>
                </div>
              </div>
              
              <div className="bg-black border border-zinc-800 rounded-lg p-5 relative group">
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
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
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
                className="w-full h-full min-h-[150px] md:min-h-[250px] flex-1 bg-black border border-indigo-500/30 rounded-lg p-6 text-emerald-400 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none font-mono mb-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] custom-scrollbar"
              />

              <div className="flex items-center gap-4 mt-auto">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="flex-1 py-4 rounded-lg bg-zinc-800 text-white font-black text-xs uppercase hover:bg-zinc-750 transition-all"
                >
                  İPTAL
                </button>
                <button
                  onClick={handleAiParse}
                  className="flex-[2] py-4 rounded-lg bg-[#f0b90b] text-black font-black text-xs uppercase shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] transition-all active:scale-95 flex justify-center items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> VERİLERİ SİSTEME EKLE
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'blackjack' && (
        <div className="space-y-4 animate-fade-in">
          {/* CASINO GENERAL SETTINGS */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, casino_general: !prev.casino_general }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">CASINO GENEL AYARLAR</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Blackjack bekleme süreleri ve krupiye kuralları</p>
                </div>
              </div>
              {contentExpanded.casino_general ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.casino_general && (
              <div className="p-6 pt-0 animate-fade-in space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-zinc-800/50 p-5 rounded-lg space-y-2">
                    <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest ml-1">EL ARASI BEKLEME (SAAT)</label>
                    <input
                      type="number" min={1} max={24}
                      value={localBjConfig.cooldownHours}
                      onChange={e => setLocalBjConfig(c => ({ ...c, cooldownHours: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-lg text-white bg-black border border-zinc-800 font-black text-lg outline-none focus:border-amber-500/40"
                    />
                    <p className="text-zinc-600 text-[9px] font-bold uppercase mt-1">Oyuncular kaç saatte bir el oynayabilir?</p>
                  </div>
                  <div className="bg-black/40 border border-zinc-800/50 p-5 rounded-lg flex flex-col justify-center">
                    <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest ml-1 mb-3">KRUPİYE SOFT-17 KURALI</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setLocalBjConfig(c => ({ ...c, dealerHitSoft17: !c.dealerHitSoft17 }))}
                        className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 flex items-center p-1 ${localBjConfig.dealerHitSoft17 ? 'bg-amber-500' : 'bg-zinc-800'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-all ${localBjConfig.dealerHitSoft17 ? 'translate-x-7' : 'translate-x-0'}`} />
                      </button>
                      <span className="text-white text-[11px] font-black uppercase tracking-widest">
                        {localBjConfig.dealerHitSoft17 ? 'KRUPİYE ÇEKER' : 'KRUPİYE DURUR'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => onSaveBjConfig?.(localBjConfig)} className="adm-btn-primary bg-amber-500 hover:bg-amber-400 text-black px-10">KAYDET</button>
                </div>
              </div>
            )}
          </section>

          {/* CASINO REWARDS */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, casino_rewards: !prev.casino_rewards }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                  <Gift className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">CASINO ÖDÜL HAVUZU</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Kazanma ödülleri ve olasılık ağırlıkları</p>
                </div>
              </div>
              {contentExpanded.casino_rewards ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.casino_rewards && (
              <div className="p-6 pt-0 animate-fade-in space-y-4">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setLocalBjConfig(c => ({
                      ...c,
                      rewards: [...c.rewards, { id: String(Date.now()), label: 'Yeni Ödül', emoji: '🎁', weight: 10, color: '#f0b90b' }]
                    }))}
                    className="adm-btn-primary py-2 text-[10px] bg-emerald-500 hover:bg-emerald-400 text-black px-6"
                  >
                    + YENİ ÖDÜL EKLE
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(localBjConfig.rewards.length === 0 ? [] : localBjConfig.rewards).map((reward, idx) => (
                    <div key={reward.id} className="flex items-center gap-4 p-4 bg-black/40 border border-zinc-800/50 rounded-lg group transition-all hover:border-emerald-500/30">
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="text" maxLength={2}
                          value={reward.emoji}
                          onChange={e => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.map((r, i) => i === idx ? { ...r, emoji: e.target.value } : r) }))}
                          className="w-12 h-12 text-center bg-black rounded-lg border border-zinc-800 text-xl outline-none"
                        />
                        <div className="flex-1">
                          <label className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1 block ml-1">ÖDÜL ADI</label>
                          <input
                            type="text"
                            value={reward.label}
                            onChange={e => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.map((r, i) => i === idx ? { ...r, label: e.target.value } : r) }))}
                            className="w-full bg-transparent border-b border-zinc-800 text-white font-black text-xs outline-none focus:border-emerald-500/50 pb-1"
                            placeholder="Örn: 100 TL Bonus"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="w-24">
                          <label className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1 block text-center">AĞIRLIK</label>
                          <input
                            type="number" min={1} max={100}
                            value={reward.weight}
                            onChange={e => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.map((r, i) => i === idx ? { ...r, weight: Number(e.target.value) } : r) }))}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1 text-center text-white font-black text-xs outline-none"
                          />
                        </div>
                        <input
                          type="color"
                          value={reward.color}
                          onChange={e => setLocalBjConfig(c => ({ ...c, rewards: c.rewards.map((r, i) => i === idx ? { ...r, color: e.target.value } : r) }))}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-zinc-800"
                        />
                        <button
                          onClick={() => {
                            const updated = localBjConfig.rewards.filter((_, i) => i !== idx);
                            setLocalBjConfig({ ...localBjConfig, rewards: updated });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={() => onSaveBjConfig?.(localBjConfig)} className="adm-btn-primary bg-amber-500 hover:bg-amber-400 text-black px-10">ÖDÜLLERİ KAYDET</button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'loyalty' && (
        <div className="space-y-4 animate-fade-in">
          {/* LOYALTY GENERAL */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, loyalty_general: !prev.loyalty_general }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                  <Star className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">SADAKAT PROGRAMI GENEL AYARLAR</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Sistem adı ve coin birimi yapılandırması</p>
                </div>
              </div>
              {contentExpanded.loyalty_general ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.loyalty_general && (
              <div className="p-6 pt-0 animate-fade-in space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/40 border border-zinc-800/50 p-4 rounded-lg space-y-2">
                    <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest ml-1">PROGRAM ADI</label>
                    <input type="text" value={localLoyaltyConfig.programName}
                      onChange={e => setLocalLoyaltyConfig(c => ({ ...c, programName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-800 text-white font-black text-sm outline-none focus:border-emerald-500/40" />
                  </div>
                  <div className="bg-black/40 border border-zinc-800/50 p-4 rounded-lg space-y-2">
                    <label className="text-zinc-500 text-[9px] font-black uppercase tracking-widest ml-1">COIN BİRİM ADI</label>
                    <input type="text" value={localLoyaltyConfig.coinName}
                      onChange={e => setLocalLoyaltyConfig(c => ({ ...c, coinName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-zinc-800 text-white font-black text-sm outline-none focus:border-emerald-500/40" />
                  </div>
                </div>
                <div className="bg-black/40 border border-zinc-800/50 p-5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, isActive: !c.isActive }))}
                      className={`relative w-14 h-7 rounded-full transition-all flex items-center p-1 ${localLoyaltyConfig.isActive ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-800'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white transition-all ${localLoyaltyConfig.isActive ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-widest ${localLoyaltyConfig.isActive ? 'text-emerald-500' : 'text-white'}`}>PROGRAM DURUMU: {localLoyaltyConfig.isActive ? 'AKTİF' : 'KAPALI'}</h4>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => onSaveLoyaltyConfig?.(localLoyaltyConfig)} className="adm-btn-primary bg-emerald-500 hover:bg-emerald-400 text-black px-10">KAYDET</button>
                </div>
              </div>
            )}
          </section>

          {/* LOYALTY RULES */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, loyalty_rules: !prev.loyalty_rules }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                  <Zap className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">🎯 TETİKLEME KURALLARI</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Yatırım ve hacim bazlı otomatik coin dağıtımı</p>
                </div>
              </div>
              {contentExpanded.loyalty_rules ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.loyalty_rules && (
              <div className="p-6 pt-0 animate-fade-in space-y-4">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setLocalLoyaltyConfig(c => ({
                      ...c,
                      rules: [...c.rules, { id: String(Date.now()), name: 'Yeni Kural', description: '', triggerType: 'deposit', thresholdAmount: 500, coinsAwarded: 100, ticketsAwarded: 0, isActive: true }]
                    }))}
                    className="adm-btn-primary bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 text-[10px]"
                  >
                    + YENİ KURAL EKLE
                  </button>
                </div>

                {localLoyaltyConfig.rules.map((rule, idx) => (
                  <div key={rule.id} className="p-4 bg-black/40 border border-zinc-800/50 rounded-lg space-y-4 group transition-all hover:border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1 block ml-1">KURAL ADI</label>
                        <input type="text" value={rule.name}
                          onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, name: e.target.value } : r) }))}
                          className="w-full bg-transparent border-b border-zinc-800 text-white font-black text-xs outline-none focus:border-blue-500/50 pb-1" placeholder="Kural Adı" />
                      </div>
                      <select value={rule.triggerType}
                        onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, triggerType: e.target.value as any } : r) }))}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-black text-[10px] outline-none">
                        <option value="deposit">YATIRIM</option>
                        <option value="volume">HACİM</option>
                        <option value="manual">MANUEL</option>
                      </select>
                      <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, isActive: !r.isActive } : r) }))}
                        className={`px-3 py-2 rounded-lg font-black text-[9px] uppercase tracking-wider ${rule.isActive ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                        {rule.isActive ? 'AKTİF' : 'KAPALI'}
                      </button>
                      <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.filter((_, i) => i !== idx) }))} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                        <label className="text-zinc-600 text-[8px] font-black uppercase block text-center mb-1">EŞİK (TL)</label>
                        <input type="number" value={rule.thresholdAmount}
                          onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, thresholdAmount: Number(e.target.value) } : r) }))}
                          className="w-full bg-transparent text-white font-black text-xs outline-none text-center" />
                      </div>
                      <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                        <label className="text-zinc-600 text-[8px] font-black uppercase block text-center mb-1">COIN ÖDÜL</label>
                        <input type="number" value={rule.coinsAwarded}
                          onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, coinsAwarded: Number(e.target.value) } : r) }))}
                          className="w-full bg-transparent text-white font-black text-xs outline-none text-center" />
                      </div>
                      <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                        <label className="text-zinc-600 text-[8px] font-black uppercase block text-center mb-1">BİLET ÖDÜL</label>
                        <input type="number" value={rule.ticketsAwarded}
                          onChange={e => setLocalLoyaltyConfig(c => ({ ...c, rules: c.rules.map((r, i) => i === idx ? { ...r, ticketsAwarded: Number(e.target.value) } : r) }))}
                          className="w-full bg-transparent text-white font-black text-xs outline-none text-center" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <button onClick={() => onSaveLoyaltyConfig?.(localLoyaltyConfig)} className="adm-btn-primary px-10">KURALLARI KAYDET</button>
                </div>
              </div>
            )}
          </section>

          {/* LOYALTY MARKET */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, loyalty_market: !prev.loyalty_market }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                  <ShoppingCart className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">🛒 BONUS MARKET ÜRÜNLERİ</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Coin ile satın alınabilen ödüller</p>
                </div>
              </div>
              {contentExpanded.loyalty_market ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.loyalty_market && (
              <div className="p-6 pt-0 animate-fade-in space-y-4">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setLocalLoyaltyConfig(c => ({
                      ...c,
                      marketItems: [...c.marketItems, { id: String(Date.now()), name: 'Yeni Ürün', description: '', type: 'cash_bonus', coinCost: 500, emoji: '🎁', color: '#f0b90b', isActive: true, stock: -1 }]
                    }))}
                    className="adm-btn-primary bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 text-[10px]"
                  >
                    + YENİ ÜRÜN EKLE
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {localLoyaltyConfig.marketItems.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-black/40 border border-zinc-800/50 rounded-lg group transition-all hover:border-amber-500/30">
                      <input type="text" maxLength={2} value={item.emoji}
                        onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, emoji: e.target.value } : m) }))}
                        className="w-12 h-12 text-center bg-black rounded-lg border border-zinc-800 text-xl outline-none" />
                      
                      <div className="flex-1">
                        <label className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1 block ml-1">ÜRÜN ADI</label>
                        <input type="text" value={item.name}
                          onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, name: e.target.value } : m) }))}
                          className="w-full bg-transparent border-b border-zinc-800 text-white font-black text-xs outline-none focus:border-amber-500/50 pb-1" placeholder="Ürün Adı" />
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="w-20">
                          <label className="text-zinc-600 text-[8px] font-black uppercase block text-center mb-1">COIN</label>
                          <input type="number" value={item.coinCost}
                            onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, coinCost: Number(e.target.value) } : m) }))}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1 text-center text-white font-black text-xs outline-none" />
                        </div>
                        <div className="w-20">
                          <label className="text-zinc-600 text-[8px] font-black uppercase block text-center mb-1">STOK</label>
                          <input type="number" value={item.stock}
                            onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, stock: Number(e.target.value) } : m) }))}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1 text-center text-white font-black text-xs outline-none" title="-1 = Sınırsız" />
                        </div>
                        <input type="color" value={item.color}
                          onChange={e => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, color: e.target.value } : m) }))}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-zinc-800" />
                        <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.map((m, i) => i === idx ? { ...m, isActive: !m.isActive } : m) }))}
                          className={`px-3 py-2 rounded-lg font-black text-[9px] uppercase tracking-wider ${item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-500'}`}>
                          {item.isActive ? 'AKTİF' : 'OFF'}
                        </button>
                        <button onClick={() => setLocalLoyaltyConfig(c => ({ ...c, marketItems: c.marketItems.filter((_, i) => i !== idx) }))} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <button onClick={() => onSaveLoyaltyConfig?.(localLoyaltyConfig)} className="adm-btn-primary px-10">MARKETİ KAYDET</button>
                </div>
              </div>
            )}
          </section>
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

      {activeTab === 'casinolobby' && (
        <AdminCasinoLobbyTab
          games={casinoLobbyGames || []}
          onSave={(updatedGames) => {
            if (onSaveCasinoLobbyGames) onSaveCasinoLobbyGames(updatedGames);
          }}
        />
      )}

      {activeTab === 'promocodes' && (
        <AdminPromoTab />
      )}

      {activeTab === 'referrals' && (
        <AdminReferralTab />
      )}

      {activeTab === 'trusted' && (
        <AdminTrustedTab
          companies={(() => {
            try { return JSON.parse(localStorage.getItem('site_trusted_companies') || '[]'); } catch { return []; }
          })()}
          onSave={(companies) => {
            localStorage.setItem('site_trusted_companies', JSON.stringify(companies));
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

      {activeTab === 'giveaway' && giveawayConfig && onSaveGiveawayConfig && (
        <AdminGiveawayTab
          config={giveawayConfig}
          onConfigChange={onSaveGiveawayConfig}
        />
      )}

      {/* ─── VISIBILITY TAB ─── */}
      {activeTab === 'visibility' && (
        <div className="space-y-4 animate-fade-in">
          {/* PAGE VISIBILITY SECTION */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, visibility_pages: !prev.visibility_pages }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">SAYFA ERİŞİM YÖNETİMİ</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Sitedeki aktif sayfaları açıp kapatın</p>
                </div>
              </div>
              {contentExpanded.visibility_pages ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.visibility_pages && (
              <div className="p-6 pt-0 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {([
                    { key: 'coupons', label: 'Günün Kuponları' },
                    { key: 'analysis', label: 'Analizler' },
                    { key: 'brands', label: 'Güvenilir Siteler' },
                    { key: 'pool', label: '724TOTO' },
                    { key: 'blackjack', label: 'Casino' },
                    { key: 'loyalty', label: 'Görevler' },
                    { key: 'raffle', label: 'Bilet' },
                    { key: 'giveaway', label: 'Çekiliş Yönetim' },
                    { key: 'cekilis', label: 'Çekiliş Sayfası' },
                  ] as const).map(item => {
                    const isActive = navVisibility?.[item.key] !== false;
                    return (
                      <div key={item.key} className="bg-black/40 border border-zinc-800/50 rounded-lg p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
                        <span className={`text-[11px] font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-zinc-500'}`}>{item.label}</span>
                        <button
                          onClick={() => {
                            if (navVisibility && onSaveNavVisibility) {
                              onSaveNavVisibility({ ...navVisibility, [item.key]: !isActive });
                            }
                          }}
                          className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${isActive ? 'bg-green-500' : 'bg-zinc-800'}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-all ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* MARQUEE SECTION */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, visibility_marquee: !prev.visibility_marquee }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                  <RefreshCw className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">ÜST MENÜ KAYAN YAZI (MARQUEE)</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Duyuru bandı ve AI haber sihirbazı</p>
                </div>
              </div>
              {contentExpanded.visibility_marquee ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.visibility_marquee && (
              <div className="p-6 pt-0 animate-fade-in space-y-6">
                <div className="flex items-center justify-between bg-black/40 border border-zinc-800/50 p-5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setLocalMarquee({ ...localMarquee, isActive: !localMarquee.isActive })}
                      className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 flex items-center p-1 ${localMarquee.isActive ? 'bg-indigo-500' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-all ${localMarquee.isActive ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                    <div>
                      <h4 className="text-white font-black text-xs uppercase tracking-widest">KAYAN YAZI AKTİF</h4>
                      <p className="text-zinc-500 text-[10px]">Duyuru bandını sitede göster/gizle</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAiMarqueeParser(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-black rounded-lg font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                  >
                    <Sparkles className="w-4 h-4" /> AI HABER SİHİRBAZI
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">DUYURU METNİ</label>
                    <input 
                      type="text" 
                      value={localMarquee.text} 
                      onChange={(e) => setLocalMarquee({ ...localMarquee, text: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg px-5 py-4 text-sm font-black text-white focus:outline-none focus:border-indigo-500/50"
                      placeholder="🦁 Şampiyon Galatasaray... 💰 Yatırımlara %50 Bonus..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/40 border border-zinc-800/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase">AKIF HIZI</label>
                        <span className="text-[10px] font-black text-indigo-400">{localMarquee.speed}s</span>
                      </div>
                      <input 
                        type="range" min="5" max="500" step="5"
                        value={localMarquee.speed} 
                        onChange={(e) => setLocalMarquee({ ...localMarquee, speed: Number(e.target.value) })}
                        className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="bg-black/40 border border-zinc-800/50 p-4 rounded-lg space-y-2">
                      <label className="text-[9px] font-black text-zinc-500 uppercase block">YAZI RENGİ</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={localMarquee.color} 
                          onChange={(e) => setLocalMarquee({ ...localMarquee, color: e.target.value })}
                          className="w-10 h-10 bg-transparent cursor-pointer rounded-lg overflow-hidden border-2 border-zinc-800"
                        />
                        <input 
                          type="text" 
                          value={localMarquee.color} 
                          onChange={(e) => setLocalMarquee({ ...localMarquee, color: e.target.value })}
                          className="flex-1 bg-transparent border-b border-zinc-800 text-[11px] font-mono text-white outline-none focus:border-indigo-500/50"
                        />
                      </div>
                    </div>
                    <div className="bg-black/40 border border-zinc-800/50 p-4 rounded-lg flex flex-col justify-center gap-2">
                       <label className="text-[9px] font-black text-zinc-500 uppercase block">YAZI STİLİ</label>
                       <button
                        onClick={() => setLocalMarquee({ ...localMarquee, isBold: !localMarquee.isBold })}
                        className={`w-full py-2 rounded-lg font-black text-[10px] uppercase transition-all ${localMarquee.isBold ? 'bg-indigo-500 text-black' : 'bg-zinc-800 text-zinc-500 hover:text-white'}`}
                      >
                        {localMarquee.isBold ? 'BOLD (KALIN)' : 'NORMAL'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => { onSaveMarqueeConfig?.(localMarquee); alert('Duyuru bandı güncellendi!'); }}
                    className="adm-btn-primary px-10 bg-indigo-500 hover:bg-indigo-400 text-black"
                  >
                    KAYAN YAZIYI KAYDET
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* AI Marquee Parser Modal */}
      {showAiMarqueeParser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
              <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-lg uppercase tracking-tight">AI HABER SİHİRBAZI</h3>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Ham haber metnini kışkırtıcı bir akışa çevirir</p>
                    </div>
                  </div>
                  <button onClick={() => setShowAiMarqueeParser(false)} className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Haber Metnini Buraya Yapıştırın</label>
                    <textarea
                      value={aiMarqueeRawText}
                      onChange={(e) => setAiMarqueeRawText(e.target.value)}
                      className="w-full h-80 bg-black border border-zinc-800 rounded-lg p-5 text-sm font-medium text-zinc-300 focus:border-primary/50 transition-all resize-none leading-relaxed"
                      placeholder="🦁 Galatasaray Gündemi...&#10;Hakan Çalhanoğlu Bombası: ..."
                    />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => setShowAiMarqueeParser(false)}
                      className="flex-1 px-6 py-4 bg-zinc-800 text-zinc-400 font-black text-xs rounded-lg uppercase tracking-widest hover:bg-zinc-700 transition-all"
                    >
                      VAZGEÇ
                    </button>
                    <button
                      onClick={handleAiMarqueeParse}
                      className="flex-[2] px-6 py-4 bg-primary text-black font-black text-xs rounded-lg uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" /> HABERLERİ DÜZENLE VE UYGULA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

      {activeTab === 'premium' && (
        <div className="space-y-4 animate-fade-in">
          <AdminPremiumTab />
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="space-y-4 animate-fade-in">
          <AdminPremiumTab initialTab="payments" />
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="space-y-4 animate-fade-in">
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <div className="p-5 flex items-center justify-between border-b border-zinc-800/50 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                  <CreditCard className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">CÜZDAN YÖNETİMİ</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Yatırım ve Çekim Seçeneklerini Yönetin</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Bitcoin', 'Ethereum', 'USDT', 'Binance', 'Banka Havalesi', 'Papara'].map((method) => (
                  <div key={method} className="bg-[#151A23] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{method}</div>
                      <div className="text-xs text-zinc-500 mt-1">Komisyon: %0</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                 <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg transition-colors">
                   Ayarları Kaydet
                 </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4 animate-fade-in">
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <div className="p-5 flex items-center justify-between border-b border-zinc-800/50 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">ÜYE VE KULLANICI YÖNETİMİ</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Tüm kayıtlı üyeleri ve bakiyelerini yönetin</p>
                </div>
              </div>
            </div>
            <div className="p-0">
               <AdminMembersTab coinName={localLoyaltyConfig.coinName || 'Coin'} />
            </div>
          </section>
        </div>
      )}

      {activeTab === 'chatmanage' && (
        <div className="space-y-4 animate-fade-in">
          <AdminChatTab />
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-4 animate-fade-in">
          <AdminNotificationTab 
            botsConfig={botsConfig || []}
            onSaveBotsConfig={onSaveBotsConfig}
          />
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-4 animate-fade-in">
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, messages_main: !prev.messages_main }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                  <MessageSquare className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">KULLANICI MESAJLARI ({messages.filter(m=>!m.isRead).length} YENİ)</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Destek talepleri ve yatırım bildirimleri</p>
                </div>
              </div>
              {contentExpanded.messages_main ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.messages_main && (
              <div className="p-6 pt-0 animate-fade-in space-y-4">
                {messages.length === 0 ? (
                   <div className="py-10 text-center opacity-30 italic text-xs uppercase font-black">Henüz mesaj yok</div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {messages.sort((a,b)=>b.createdAt - a.createdAt).map(msg => (
                      <div key={msg.id} className={`p-4 rounded-lg border ${msg.isRead ? 'bg-black/20 border-zinc-800' : 'bg-indigo-500/5 border-indigo-500/20'} transition-all`}>
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center"><User className="w-4 h-4 text-zinc-500" /></div>
                              <div>
                                 <p className="text-xs font-black text-white uppercase">{msg.username}</p>
                                 <p className="text-[9px] font-bold text-zinc-600">{new Date(msg.createdAt).toLocaleString('tr-TR')}</p>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              {!msg.isRead && (
                                <button onClick={()=>{
                                  const u = messages.map(m=>m.id===msg.id?{...m,isRead:true}:m); setMessages(u); localStorage.setItem('site_messages',JSON.stringify(u));
                                }} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg"><Check className="w-3.5 h-3.5" /></button>
                              )}
                              <button onClick={()=>{
                                if(confirm('Sileyim mi?')) { const u = messages.filter(m=>m.id!==msg.id); setMessages(u); localStorage.setItem('site_messages',JSON.stringify(u)); }
                              }} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                           </div>
                        </div>
                        <div className="p-3 bg-black/40 rounded-lg text-xs text-zinc-400 italic border border-zinc-800/50">{msg.content}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ─── SYSTEM STATUS (MAINTENANCE) TAB ─── */}
      {activeTab === 'system' && (
        <div className="space-y-4 animate-fade-in">
          {/* MAINTENANCE MODE SECTION */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, system_maintenance: !prev.system_maintenance }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-500/10 rounded-lg flex items-center justify-center border border-rose-500/20">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">BAKIM MODU VE ERİŞİM</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Siteyi tamamen bakıma alın veya mesaj yayınlayın</p>
                </div>
              </div>
              {contentExpanded.system_maintenance ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.system_maintenance && (
              <div className="p-6 pt-0 animate-fade-in space-y-6">
                <div className="flex items-center justify-between bg-black/40 border border-zinc-800/50 p-5 rounded-lg">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setLocalSiteStatus({...localSiteStatus, isMaintenanceMode: !localSiteStatus.isMaintenanceMode})}
                      className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 flex items-center p-1 ${localSiteStatus.isMaintenanceMode ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-all ${localSiteStatus.isMaintenanceMode ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-widest ${localSiteStatus.isMaintenanceMode ? 'text-rose-500' : 'text-white'}`}>BAKIM MODU: {localSiteStatus.isMaintenanceMode ? 'AKTİF' : 'KAPALI'}</h4>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Aktifken sadece adminler siteyi görebilir</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">BAKIM MESAJI</label>
                  <textarea
                    value={localSiteStatus.maintenanceMessage}
                    onChange={(e) => setLocalSiteStatus({...localSiteStatus, maintenanceMessage: e.target.value})}
                    className="w-full h-24 bg-black border border-zinc-800 rounded-lg px-5 py-4 text-sm font-medium text-zinc-300 focus:border-rose-500/50 transition-all outline-none resize-none"
                    placeholder="Şu an bakımdayız, kısa süre sonra döneceğiz..."
                  />
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSave} className="adm-btn-primary px-10 bg-rose-500 hover:bg-rose-400 text-white">SİSTEMİ GÜNCELLE</button>
                </div>
              </div>
            )}
          </section>

          {/* LOADER SETTINGS SECTION */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, system_loader: !prev.system_loader }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                  <RefreshCw className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">SPLASH SCREEN (AÇILIŞ LOADER)</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Site açılışındaki 3-5 saniyelik yükleme ekranı ayarları</p>
                </div>
              </div>
              {contentExpanded.system_loader ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.system_loader && (
              <div className="p-6 pt-0 animate-fade-in space-y-6">
                <div className="bg-black/40 border border-zinc-800/50 p-5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setLocalLoaderConfig({ ...localLoaderConfig, isActive: !localLoaderConfig.isActive })}
                      className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 flex items-center p-1 ${localLoaderConfig.isActive ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-all ${localLoaderConfig.isActive ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-widest ${localLoaderConfig.isActive ? 'text-amber-500' : 'text-white'}`}>LOADER: {localLoaderConfig.isActive ? 'AKTİF' : 'PASİF'}</h4>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Kapatırsanız site direkt açılır (Hızlı Geçiş)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">YÜKLEME METNİ</label>
                  <input
                    type="text"
                    value={localLoaderConfig.text}
                    onChange={(e) => setLocalLoaderConfig({ ...localLoaderConfig, text: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-5 py-4 text-sm font-black text-white focus:outline-none focus:border-amber-500/50"
                    placeholder="Sistem Yükleniyor..."
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => { onSaveLoaderConfig?.(localLoaderConfig); alert('Loader ayarları güncellendi!'); }} 
                    className="adm-btn-primary px-10 bg-amber-500 hover:bg-amber-400 text-black"
                  >
                    LOADER KAYDET
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* DISCORD SETTINGS SECTION */}
          <section className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg overflow-hidden transition-all duration-300">
            <button 
              onClick={() => setContentExpanded(prev => ({ ...prev, system_discord: !prev.system_discord }))}
              className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-black text-sm uppercase tracking-tight italic">DISCORD KUPON BİLDİRİMLERİ</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Kuponlar yatırıldığında Discord kanalına Webhook ile bildirim gönderin</p>
                </div>
              </div>
              {contentExpanded.system_discord ? <ChevronUp className="w-5 h-5 text-zinc-600" /> : <ChevronDown className="w-5 h-5 text-zinc-600" />}
            </button>

            {contentExpanded.system_discord && (
              <div className="p-6 pt-0 animate-fade-in space-y-6">
                <div className="bg-black/40 border border-zinc-800/50 p-5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setLocalDiscordConfig({ ...localDiscordConfig, enabled: !localDiscordConfig.enabled })}
                      className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 flex items-center p-1 ${localDiscordConfig.enabled ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-all ${localDiscordConfig.enabled ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-widest ${localDiscordConfig.enabled ? 'text-indigo-400' : 'text-white'}`}>DISCORD BİLDİRİMLERİ: {localDiscordConfig.enabled ? 'AKTİF' : 'PASİF'}</h4>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">Aktif edildiğinde yeni kuponlar Discord'a anlık iletilir</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">DISCORD WEBHOOK URL</label>
                  <input
                    type="password"
                    value={localDiscordConfig.webhookUrl || ''}
                    onChange={(e) => setLocalDiscordConfig({ ...localDiscordConfig, webhookUrl: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg px-5 py-4 text-sm font-black text-white focus:outline-none focus:border-indigo-500/50"
                    placeholder="Örn: https://discord.com/api/webhooks/..."
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={() => { onSaveDiscordConfig?.(localDiscordConfig); alert('Discord ayarları güncellendi!'); }} 
                    className="adm-btn-primary px-10 bg-indigo-500 hover:bg-indigo-400 text-white font-black uppercase"
                  >
                    DISCORD AYARLARINI KAYDET
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
      </main>
      {/* PROFILE SETTINGS MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00FFC2] to-emerald-500" />
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">Profil Ayarları</h2>
                  <p className="text-zinc-500 text-xs font-bold mt-1">Kimlik bilgilerinizi ve güvenliğinizi yönetin.</p>
                </div>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="w-8 h-8 bg-zinc-900 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 rounded-lg flex items-center justify-center transition-all"
                >
                  <Trash2 className="w-4 h-4 rotate-45" /> {/* Close Icon Simulation */}
                </button>
              </div>

              <div className="space-y-6">
                {/* Genel Bilgiler */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-[#00FFC2] uppercase tracking-widest border-b border-zinc-800 pb-2">GENEL BİLGİLER</h3>
                  
                  <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                        {adminProfile.logoUrl ? (
                          <img src={adminProfile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-zinc-500" />
                        )}
                     </div>
                     <div className="space-y-2 flex-1">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Profil Resmi URL</label>
                        <input 
                          value={adminProfile.logoUrl}
                          onChange={(e) => setAdminProfile({ ...adminProfile, logoUrl: e.target.value })}
                          className="w-full bg-black border border-zinc-800 rounded-lg p-2.5 text-xs font-bold focus:border-[#00FFC2]/50 transition-all text-white"
                          placeholder="https://.../logo.png"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Görüntülenen İsim</label>
                    <input 
                      value={adminProfile.name}
                      onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm font-black focus:border-[#00FFC2]/50 transition-all text-white"
                      placeholder="Profil Adınız"
                    />
                  </div>
                </div>

                {/* Şifre Güvenliği */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-zinc-800 pb-2 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> ŞİFRE GÜVENLİĞİ
                  </h3>
                  
                  <div className="space-y-3">
                    <input 
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm font-bold focus:border-rose-500/50 transition-all text-white placeholder-zinc-700"
                      placeholder="Mevcut Şifre"
                    />
                    <input 
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm font-bold focus:border-rose-500/50 transition-all text-white placeholder-zinc-700"
                      placeholder="Yeni Şifre Oluştur"
                    />
                    <input 
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm font-bold focus:border-rose-500/50 transition-all text-white placeholder-zinc-700"
                      placeholder="Yeni Şifreyi Doğrula"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-[10px] rounded-lg uppercase tracking-widest transition-all"
                >
                  İPTAL
                </button>
                <button 
                  onClick={() => {
                    localStorage.setItem('admin_profile', JSON.stringify(adminProfile));
                    if (passwordForm.new || passwordForm.confirm) {
                      if (passwordForm.new !== passwordForm.confirm) {
                        alert('Yeni şifreler eşleşmiyor!');
                        return;
                      }
                      if (!passwordForm.current) {
                        alert('Şifre değiştirmek için mevcut şifrenizi girmelisiniz!');
                        return;
                      }
                      alert('Profil bilgileriniz ve yeni şifreniz başarıyla kaydedildi!');
                    } else {
                      alert('Profil bilgileriniz başarıyla güncellendi!');
                    }
                    setPasswordForm({ current: '', new: '', confirm: '' });
                    setShowProfileModal(false);
                  }}
                  className="flex-1 py-3 bg-[#00FFC2] hover:bg-emerald-400 text-black font-black text-[10px] rounded-lg uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,255,194,0.3)]"
                >
                  KAYDET
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
