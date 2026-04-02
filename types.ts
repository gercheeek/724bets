
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
}

export interface UserMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  isRead: boolean;
  createdAt: number;
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
  sport?: 'Futbol' | 'Basketbol';
  editorId?: string;
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
  programName: string;    // e.g. "Betlivo Sadakat Programı"
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

// ─── BetLivo Çarkıfelek & Kasa Sistemi ──────────────────────────────────────
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

export interface BetLivoWheelConfig {
  participants: WheelParticipant[];
  prizes: WheelPrize[];
  history: WheelHistoryEntry[];
  riggedWinner: string | null;
  betlivoTrigger: boolean;
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
