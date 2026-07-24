export type RankLevel = 'demir' | 'bronz' | 'gumus' | 'altin' | 'elmas';

export interface RankInfo {
  id: RankLevel;
  name: string;
  image: string;
  color: string;
}

export const VIP_RANKS: Record<RankLevel, RankInfo> = {
  demir: { id: 'demir', name: 'Demir', image: '/images/ranks/demir.jpeg', color: 'text-gray-400' },
  bronz: { id: 'bronz', name: 'Bronz', image: '/images/ranks/bronz.jpeg', color: 'text-orange-700' },
  gumus: { id: 'gumus', name: 'Gümüş', image: '/images/ranks/gumus.jpeg', color: 'text-gray-300' },
  altin: { id: 'altin', name: 'Altın', image: '/images/ranks/altin.jpeg', color: 'text-yellow-400' },
  elmas: { id: 'elmas', name: 'Elmas', image: '/images/ranks/elmas.jpeg', color: 'text-cyan-400' }
};

export const getUserRank = (vipLevel?: string | null): RankInfo => {
  if (!vipLevel) return VIP_RANKS.demir;
  const normalized = vipLevel.toLowerCase();
  if (normalized.includes('elmas') || normalized.includes('diamond')) return VIP_RANKS.elmas;
  if (normalized.includes('altın') || normalized.includes('altin') || normalized.includes('gold')) return VIP_RANKS.altin;
  if (normalized.includes('gümüş') || normalized.includes('gumus') || normalized.includes('silver')) return VIP_RANKS.gumus;
  if (normalized.includes('bronz') || normalized.includes('bronze')) return VIP_RANKS.bronz;
  return VIP_RANKS.demir;
};
