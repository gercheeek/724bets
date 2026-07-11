
import React from 'react';


export interface SiteUser {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  createdAt: number;
  status?: 'pending' | 'active' | 'suspended';
  notes?: string;
  role?: 'admin' | 'editor' | 'author' | 'member';
  balance?: number;
}

export interface UserMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  isRead: boolean;
  createdAt: number;
}

export interface BotScenario {
  id: string;
  text: string;
  intervalMinutes: number; // e.g. every 30 minutes
  isActive: boolean;
}

export interface ChatBotConfig {
  id: string;
  name: string;
  role: 'SYSTEM' | 'ADMIN' | 'VIP'; // label like SYSTEM, ADM
  color: string; // hex code like #F5A623
  isActive: boolean;
  scenarios: BotScenario[];
}

export interface PaymentRequest {
  id: string;
  userId: string;
  username: string;
  type: 'crypto' | 'bank';
  method: string;       // e.g. 'USDT TRC-20', 'Ziraat Bankası'
  amount: number;
  currency: string;     // 'TL', 'USDT', 'BTC'
  txHash?: string;      // for crypto
  senderName?: string;  // for bank
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: number;
  processedAt?: number;
  adminNote?: string;
}

export interface PaymentConfig {
  cryptoWallets: { network: string; symbol: string; address: string; isActive: boolean }[];
  bankAccounts: { bank: string; iban: string; holder: string; isActive: boolean }[];
  minDepositTL: number;
  isActive: boolean;
}

export interface EditorAccount {
  id: string;
  name: string;
  username: string;
  password: string;
  createdAt: number;
}

export interface GuestAccount {
  id: string;
  username: string;
  password: string;
  createdAt: number;
}


export interface Brand {
  id: string;
  name: string;
  subtitle: string;
  offerMain: string;
  offerSub: string;
  logo: string;
  link: string;
  bonusText?: string;
  isSponsor?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

// New Systems Types
export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: string;
  cooldownHours: number;
  isActive: boolean;
}

export interface TaskLog {
  taskId: string;
  completedAt: number;
}

export interface CaseReward {
  id: string;
  value: number;
  probability: number; // 0 to 1
  label: string;
}

export interface UserStats {
  balance: number;
  vipLevel: number;
  taskLogs: TaskLog[];
  caseHistory: { rewardLabel: string, timestamp: number }[];
  bonusHistory: { amount: number, reason: string, timestamp: number }[];
}

export interface AutoBonusConfig {
  amount: number;
  target: 'all' | 'vip_only';
  intervalHours: number;
  lastRun: number;
  isActive: boolean;
}

export interface BookieOdd {
  name: string;
  odd1: string;
  odd2: string;
  link: string;
  isHighest?: boolean;
}

export type SportCategory = 'Futbol' | 'Basketbol' | 'Formula 1' | 'MotoGP' | 'Superbike' | 'Tenis';

export interface MatchAnalysis {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  matchDate: string; // ISO format (YYYY-MM-DD)
  analysis: string; // legacy/fallback
  tacticalSummary: string;
  breakingPoint: string;
  bettingScenario: string;
  prediction: string;
  confidence: number; // 0 to 100
  modelScore: number;
  recentHistory: string;
  expectedGoals: string;
  bookieOdds: BookieOdd[];
  createdAt: number;
  sport?: SportCategory;
  editorId?: string;
  // Detailed Odds for Bulletin (Result, Total, Double Chance)
  odds1?: string;
  oddsX?: string;
  odds2?: string;
  oddsOver?: string;
  oddsUnder?: string;
  odds1X?: string;
  odds12?: string;
  oddsX2?: string;
  isActive?: boolean;
}

export interface CouponMatch {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odd: string;
  analysis?: string;
  confidence?: number;
}

export interface Coupon {
  id: string;
  title: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  matches: CouponMatch[];
  totalOdd: string;
  date: string; // YYYY-MM-DD
  editorId?: string;
  category?: SportCategory;
}
export interface WheelReward {
  id: string;
  label: string;
  type: 'nakit' | 'freespin' | 'freebet' | 'bonus' | 'pas' | 'iphone' | 'ps5';
  value: string;
  weight: number; // Probability weight
  color: string;
  icon?: string;
}

export interface WheelConfig {
  rewards: WheelReward[];
  lastSpinTime: number;
  spinCooldownHours: number;
}

// ─── Casino 724 Blackjack ───────────────────────────────────────────────────
export interface BlackjackReward {
  id: string;
  label: string;
  emoji: string;
  weight: number; // Probability weight (higher = more likely)
  color: string;  // Hex for UI
}

export interface BlackjackConfig {
  rewards: BlackjackReward[];
  cooldownHours: number;      // Hours between plays (default 4)
  dealerHitSoft17: boolean;   // Dealer hits soft-17 rule
  lastPlayTime: number;       // Unix ms of last play (per user)
}


// Popular Leagues Types
export interface LeagueTab {
  id: string;
  name: string;
  logo: string;
}

export interface LeagueMatch {
  id: string;
  date: string; // e.g., '28 Feb 2026'
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  status?: 'Yaklaşan' | 'Tamamlandı';
  homeScore?: number | null;
  awayScore?: number | null;
}

export interface LeagueStanding {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalDiff: string; // e.g., '+42', '-6'
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  zone?: 'champions-league' | 'europa-league' | 'conference-league' | 'relegation';
}

export interface LeaguePrediction {
  id: string;
  leagueSlug: string; // e.g., 'LALIGA'
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  dateStr: string; // e.g., '28.02 / 03:00'
  resultPrediction?: string; // e.g., '1', '2', 'x1'
  totalGoalsPrediction?: string; // e.g., '-2.5', '+2.5', '+1.5'
  bttsPrediction?: string; // e.g., 'Var', 'Yok'
  homePrediction?: string;
  awayPrediction?: string;
  scorePrediction: string; // e.g., '0-1 | 0-0 | 2-0 | 1-1'
}

export interface LeagueStats {
  topScorers: { name: string; goals: number }[];
  topAssists: { name: string; assists: number }[];
  seasonStats: {
    redCards: number;
    yellowCards: number;
    totalGoals: number;
  };
}

// ─── Loyalty / Gamification Module ───────────────────────────────────────────
export interface LoyaltyTriggerRule {
  id: string;
  name: string;           // e.g. "Yatırım Tetikleyicisi"
  description: string;
  triggerType: 'deposit' | 'volume' | 'manual';
  thresholdAmount: number; // e.g. 500 TL per deposit
  coinsAwarded: number;    // e.g. 250
  ticketsAwarded: number;  // e.g. 1
  isActive: boolean;
}

export interface MarketItem {
  id: string;
  name: string;          // e.g. "100 TL Nakit Bonus"
  description: string;
  type: 'cash_bonus' | 'freespin' | 'freebet' | 'custom';
  coinCost: number;       // Cost in coins
  emoji: string;
  color: string;
  isActive: boolean;
  stock: number;          // -1 = unlimited
}

export interface CoinTransaction {
  id: string;
  userId: string;
  type: 'earn' | 'spend';
  amount: number;
  tickets?: number;
  pendingTickets?: number;
  reason: string;
  timestamp: number;
}

export interface UserLoyalty {
  userId: string;
  coins: number;
  tickets: number; // total earned tickets
  pendingTickets: number; // tickets waiting to be assigned to a slot
  totalEarned: number;
  transactions: CoinTransaction[];
  lastVolumeResetDate: string; // ISO date
  dailyVolumeAccumulated: number;
}

export interface LoyaltyConfig {
  rules: LoyaltyTriggerRule[];
  marketItems: MarketItem[];
  programName: string;    // e.g. "724BAHİS.NET Sadakat Programı"
  coinName: string;       // e.g. "Coin" or "BP"
  isActive: boolean;
}

// ─── News Module ─────────────────────────────────────────────────────────────
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;        // HTML content
  category: string;       // e.g. 'Futbol', 'Basketbol'
  image: string;          // Cover image URL
  authorId: string;
  authorName: string;
  views: number;
  status: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  createdAt: number;
  updatedAt: number;
}

export interface NewsAuthor {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: 'author';
}

export const NEWS_CATEGORIES: { name: string; color: string }[] = [
  { name: 'Futbol', color: '#22c55e' },
  { name: 'Basketbol', color: '#f97316' },
  { name: 'Formula 1', color: '#ef4444' },
  { name: 'MotoGP', color: '#8b5cf6' },
  { name: 'Superbike', color: '#ec4899' },
  { name: 'Tenis', color: '#06b6d4' },
];

// ─── 724BAHİS.NET Çarkıfelek & Kasa Sistemi ──────────────────────────────────────
export interface WheelParticipant {
  id: string;
  name: string;
}

export interface WheelPrize {
  id: string;
  name: string;
  emoji: string;
  stock: number;
}

export interface WheelHistoryEntry {
  winner: string;
  prize: string;
  timestamp: number;
}

export interface PromoWheelConfig {
  participants: WheelParticipant[];
  prizes: WheelPrize[];
  history: WheelHistoryEntry[];
  riggedWinner: string | null;
  featuredTrigger: boolean;
  transparentBg: boolean;
}

// ─── Coin Request Sistemi ────────────────────────────────────────────────────
export interface CoinRequest {
  id: string;
  userId: string;
  username: string;
  siteName: string;
  amount: number;
  coinAmount: number;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  processedAt?: number;
  adminNote?: string;
}

// ─── Pool (724TOTO) Sistemi ──────────────────────────────────────────────────
export interface PoolMatchAnalysis {
  homeForm: ('W' | 'D' | 'L')[];  // Last 5 matches
  awayForm: ('W' | 'D' | 'L')[];
  homeWinPct: number;              // 0-100
  awayWinPct: number;              // 0-100
  missingPlayers: { home: string; away: string };
  editorComment: string;
}

export interface PoolMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  matchDate: string;
  result?: '1' | 'X' | '2';
  analysis?: PoolMatchAnalysis;
}

export interface PoolEntry {
  id: string;
  userId: string;
  username: string;
  predictions: ('1' | 'X' | '2')[];
  correctCount?: number;
  createdAt: number;
}

export interface PoolConfig {
  id: string;
  matches: PoolMatch[];
  entries: PoolEntry[];
  status: 'open' | 'live' | 'completed';
  prizePool: number;
  prize15: number;
  prize14: number;
  prize13: number;
  freeEntryUsed: Record<string, boolean>;
  createdAt: number;
  completedAt?: number;
}

// ─── Giveaway / Çekiliş Sistemi ─────────────────────────────────────────────
export interface Giveaway {
  id: string;
  title: string;
  description: string;
  instagramPostUrl: string;
  startDate: string; // ISO date
  drawDate: string;  // ISO date
  status: 'draft' | 'active' | 'completed';
}

export interface GiveawayPrize {
  id: string;
  giveawayId: string;
  prizeName: string;
  quantity: number;
  icon: string; // emoji
  winnerId?: string;
}

export interface GiveawayParticipant {
  id: string;
  giveawayId: string;
  name: string;
  instagram: string;
  referralCode: string;
  referralCount: number;
  entries: number;
  joinedAt: number;
}

export interface GiveawayWinner {
  id: string;
  giveawayId: string;
  participantId: string;
  participantName: string;
  prizeId: string;
  prizeName: string;
  timestamp: number;
}

export interface GiveawayRule {
  id: string;
  action: string;
  label: string;
  entryValue: number;
  icon: string;
}

export interface GiveawayActivity {
  id: string;
  message: string;
  timestamp: number;
}

export interface GiveawayConfig {
  giveaways: Giveaway[];
  prizes: GiveawayPrize[];
  participants: GiveawayParticipant[];
  winners: GiveawayWinner[];
  rules: GiveawayRule[];
  activities: GiveawayActivity[];
}

// ─── Header Marquee (Kayan Yazı) Sistemi ─────────────────────────────────────
export interface MarqueeConfig {
  isActive: boolean;
  text: string;
  speed: number;       // e.g. 50 (seconds to complete a loop)
  color: string;       // e.g. '#f0b90b'
  isBold: boolean;
}


// ─── Welcome Popup (Açılış Pop-up) Sistemi ──────────────────────────────────
export interface WelcomePopupConfig {
  isActive: boolean;
  title: string;
  subtitle: string;
  offerMain: string;
  offerSub: string;
  buttonText: string;
  buttonLink: string;
}

// ─── Ticket (Bilet) Sistemi Tipleri ──────────────────────────────────────────
export interface TicketSiteRequirement {
    siteName: string;
    minVolume: number;
}
export interface TicketRequest {
    id: string;
    userId: string;
    username: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: number;
    processedAt?: number;
    adminNote?: string;
}
export interface TicketEventConfig {
    id: string;
    periodDays: number;
    entryCost: number;
    siteRequirements: TicketSiteRequirement[];
    currentPeriodStart: number;
    status: 'active' | 'drawing' | 'completed';
    requests: TicketRequest[];
    winners?: { userId: string; username: string; prize: string }[];
    createdAt: number;
}

// ─── Live Odds Ticker (Popüler Maç Oranları) ────────────────────────────────
export interface LiveOddsMatch {
    id: string;
    homeTeam: string;
    awayTeam: string;
    league: string;
    matchTime: string;       // e.g. "21:00"
    odd1: string;            // Home win
    oddX: string;            // Draw
    odd2: string;            // Away win
    isLive: boolean;         // Show LIVE badge
    link: string;            // Redirect URL
}

export interface LiveOddsConfig {
    isActive: boolean;
    speed?: number;          // seconds per match
    matches: LiveOddsMatch[];
}

// ─── Site Status (Maintenance Mode) ──────────────────────────────────────────
export interface SiteStatusConfig {
    isMaintenanceMode: boolean;
    maintenanceMessage: string;
}

export interface LoaderConfig {
    isActive: boolean;
    text?: string;
}

// ─── Hero Slider ─────────────────────────────────────────────────────────────
export interface HeroSlide {
    id: string;
    imageUrl: string;
    link: string;
    title: string;
    isActive: boolean;
    order: number;
}

export interface HeroSliderConfig {
  isActive: boolean;
  autoPlayInterval?: number;
  slides: HeroSlide[];
}

export interface Slider2Config {
  isActive: boolean;
  autoPlayInterval?: number;
  slides: HeroSlide[]; // We can reuse HeroSlide for the individual slide type
}

// ─── Daily Banko Kupon (Hero Section) ────────────────────────────────────────
export interface DailyKuponMatch {
    id: string;
    homeTeam: string;
    awayTeam: string;
    prediction: string;
    odd: string;
    league?: string;
    time?: string;
}

export interface DailyKuponConfig {
    isActive: boolean;
    title: string;
    playLink?: string;
    matches: DailyKuponMatch[];
    totalOdd?: string;
}

// ─── Raffle (Bilet Havuzu) Config ───────────────────────────────────────────
export interface RafflePrize {
    id: string;
    rank: string;
    prize: string;
    emoji: string;
    color: string;
}

export interface RaffleRule {
    icon: string; // lucide icon name or emoji
    text: string;
}

export interface RaffleFaq {
    q: string;
    a: string;
}

export interface RaffleConfig {
    drawDate: string; // ISO date string or specific format
    isActive: boolean;
    prizes: RafflePrize[];
    rules: RaffleRule[];
    faqs: RaffleFaq[];
}

// ─── Popular Bets (Popüler Bahisler) ────────────────────────────────────────
export interface PopularBet {
    id: string;
    homeTeam: string;
    awayTeam: string;
    matchTime: string; // e.g. 'Bugün 20:00' or 'Yarın 21:45'
    prediction: string; // e.g. 'İlk Yarı/Maç Sonucu: 2/1'
    predictionShort: string; // e.g. '2/1'
    odds: number;
    playCount: number;
    isHot: boolean;
    affiliateUrl: string;
    league?: string;
}

export interface PopularBetsConfig {
    isActive: boolean;
    bets: PopularBet[];
}

// ─── News Slider (Gündem Slider) ─────────────────────────────────────────────
export interface NewsSlide {
    id: string;
    imageUrl: string;
    link: string;
    title: string;
    category: string;
    isActive: boolean;
    order: number;
}

export interface NewsSliderConfig {
    isActive: boolean;
    autoPlayInterval: number; // ms
    slides: NewsSlide[];
}

// ─── 724TV (Live Streaming) ──────────────────────────────────────────────────
export interface TVChannel {
    id: string;
    name: string;
    slug: string; // Kick username or custom identifier
    platform: 'kick' | 'custom'; // legacy field (kept for safety)
    streamUrl: string; // legacy field (kept for safety)
    thumbnailUrl: string;
    category: string; // e.g. 'CANLI MAÇ', 'CANLI YAYIN', 'SPOR'
    isLive: boolean;
    isActive: boolean;
    order: number;
    viewerCount?: number;
    tags?: string[];
    isVip?: boolean;

    // New Dynamic Fields
    sourceType?: 'platform' | 'video' | 'iframe';
    platformType?: 'kick' | 'twitch';
    platformUsername?: string;
    videoUrl?: string;
    iframeUrl?: string;

    // Fallback Settings
    fallbackType?: 'video' | 'iframe' | 'none';
    fallbackVideoUrl?: string;
    fallbackIframeUrl?: string;
}

export interface TVConfig {
    isActive: boolean;
    channels: TVChannel[];
    chatEnabled: boolean;
    tickerText: string; // live score ticker
}

export interface TVChatMessage {
    id: string;
    userId: string;
    username: string;
    message: string;
    role: 'admin' | 'vip' | 'user';
    timestamp: number;
    channelId: string;
}

// ─── Premium Analysis & Payment System ───────────────────────────────────────
export interface PremiumAnalysis {
  id: string;
  matchName: string;
  league: string;
  matchDate: string;
  prediction: string;
  odd: number;
  confidence: number;
  analysisText: string;
  isGuaranteed: boolean;
  price: number;
  status: 'pending' | 'won' | 'lost' | 'void';
  createdAt: string;
  updatedAt?: string;
}

export interface PremiumPayment {
  id: string;
  userId: string;
  username: string;
  analysisId: string;
  amount: number;
  method: 'usdt' | 'bank_transfer';
  txReference: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'refunded';
  refundReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface UserBalance {
  userId: string;
  username: string;
  siteBalance: number;
  updatedAt: string;
}

// ─── Casino Lobby Games (Promotional Banner Feed) ───────────────────────────
export interface CasinoLobbyGame {
  id: string;
  name: string;
  provider: string;
  type: 'slot' | 'live' | 'sport';
  lobbyCategory?: 'popular' | 'pragmatic' | 'jackpots' | 'amusnet' | 'egtBannerGames' | 'amusnetBannerGames' | 'yeni' | 'hizli' | 'galaxsys';
  badgeText?: string;
  badgeColor?: string;
  themeColor: string;
  image: string; // Base64 or Image URL
  link: string;  // Redirect Affiliate link
  isActive: boolean;
  order: number;
}


// ─── Güvenilir Siteler Module ─────────────────────────────────────────────────

export type CompanyTier = 'featured' | 'gold' | 'silver' | 'bronze';

export interface CompanyReply {
  content: string;
  replyAt: number;       // unix ms — timestamp when reply becomes visible
  isVisible: boolean;
  authorTitle: string;   // "Firma Yetkilisi" or custom
}

export interface CompanyComment {
  id: string;
  companyId: string;
  authorName: string;
  authorAvatar: string;  // emoji character or initials string
  content: string;
  sentiment: 'positive' | 'neutral' | 'critical';
  rating: number;        // 1–5
  isSimulated: boolean;
  isVisible: boolean;
  createdAt: number;     // unix ms
  reply?: CompanyReply;
}

export interface TrustedCompany {
  id: string;
  name: string;
  logo: string;
  affiliateLink: string;
  tier: CompanyTier;
  overallScore: number;       // 0–10
  safetyScore: number;        // 0–10
  bonusScore: number;         // 0–10
  supportScore: number;       // 0–10
  paymentScore: number;       // 0–10
  welcomeBonus: string;       // e.g. "%200 Çevrimsiz + 1000 FS"
  bonusDetail: string;        // secondary offer
  promotionText?: string;     // e.g. "%300 HOŞGELDİN BONUSU + 1500 FS"
  promotionColor?: string;    // hex code
  features: string[];         // badge chips
  pros: string[];
  cons: string[];
  description: string;
  licenseInfo: string;
  foundedYear: number;
  minDeposit: string;
  withdrawalSpeed: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: number;
  lastUpdated: number;
  nextCommentAt: number;
  commentDripEnabled: boolean;
}

// ─── 724TV Types ─────────────────────────────────────────────────────────────
export interface Streamer {
  id: string;
  name: string;
  kick_username?: string;
  avatar_url?: string;
  tags?: string[];
  is_live: boolean;
  is_vip: boolean;
  source_type: 'platform' | 'video' | 'iframe';
  platform_type: 'kick' | 'twitch' | 'youtube';
  video_url?: string;
  iframe_url?: string;
  fallback_type?: 'none' | 'video' | 'iframe';
  fallback_video_url?: string;
  fallback_iframe_url?: string;
  viewer_count: number;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface VOD {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  streamer_id?: string;
  views: number;
  created_at?: string;
}

export interface Gift {
  id: string;
  name: string;
  emoji: string;
  price: number;
  order_index: number;
  created_at?: string;
}

// ─── Legacy/Missing Types restored from deleted types/index.ts ────────────────
export type RaffleStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface User {
  id: string;
  username: string;
  coin_balance: number;
  created_at: string;
}

export interface LiveCode {
  id: string;
  code: string;
  reward_coin: number;
  max_winners: number;
  is_active: boolean;
  created_at: string;
}

export interface CodeClaim {
  id: string;
  user_id: string;
  code_id: string;
  claimed_at: string;
}

export interface Raffle {
  id: string;
  title: string;
  description: string | null;
  ticket_price: number;
  status: RaffleStatus;
  created_at: string;
  // Virtual fields populated by queries
  total_tickets?: number;
  max_tickets?: number;
  image_url?: string;
  end_date?: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  raffle_id: string;
  win_chance_multiplier: number;
  created_at: string;
  // Joined fields
  user?: Pick<User, 'id' | 'username'>;
}

export interface RaffleParticipant {
  user_id: string;
  username: string;
  ticket_count: number;
  total_weight: number; // sum of win_chance_multiplier
}

export interface UpdateMultiplierBody {
  action: 'update_multiplier';
  raffle_id: string;
  user_id: string;
  multiplier: number;
}

export interface PickWinnerBody {
  action: 'pick_winner';
  raffle_id: string;
  forced_user_id?: string;
}

export type AdminRafflePostBody = UpdateMultiplierBody | PickWinnerBody;

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export interface ClaimCodeResult {
  success: boolean;
  reward_coin?: number;
  new_balance?: number;
  message: string;
  error_code?: 'CODE_NOT_FOUND' | 'ALREADY_CLAIMED' | 'LIMIT_REACHED';
}

export interface BettingMatch {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  odds: {
    home: string;
    draw: string;
    away: string;
  };
  isActive: boolean;
}
