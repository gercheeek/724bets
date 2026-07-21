/**
 * Calculates a dynamic, realistic market count for sports matches.
 * Pulls from real API data if available, or generates realistic live-updating market counts.
 */
export const calculateMarketCount = (item: any): number => {
  if (!item) return 48;

  // 1. Check if total_markets_count or markets_count is explicitly provided
  if (typeof item.total_markets_count === 'number' && item.total_markets_count > 1) {
    return item.total_markets_count;
  }
  if (typeof item.markets_count === 'number' && item.markets_count > 1) {
    return item.markets_count;
  }

  // 2. Check group_markets in rawEvent or data
  const groupMarkets = item.group_markets || item.rawEvent?.group_markets || item.data?.group_markets;
  if (groupMarkets && typeof groupMarkets === 'object') {
    let totalOptions = 0;
    const keys = Object.keys(groupMarkets);
    for (const k of keys) {
      if (Array.isArray(groupMarkets[k])) {
        totalOptions += groupMarkets[k].length;
      }
    }
    if (totalOptions > 1) {
      return totalOptions;
    }
    if (keys.length > 1) {
      return keys.length * 14;
    }
  }

  // 3. Fallback: Generate realistic, dynamic, deterministic market count based on ID & sport
  const idStr = String(item.id || item.event_id || item.data?.id || '12345');
  let seed = 0;
  for (let i = 0; i < idStr.length; i++) {
    seed += idStr.charCodeAt(i);
  }
  
  const sportName = String(item.sport || item.data?.sport?.name || item.sport_name || '').toLowerCase();
  let baseCount = 68;
  if (sportName.includes('futbol') || sportName.includes('soccer') || sportName.includes('football')) {
    baseCount = 85 + (seed % 65); // 85 to 150 markets
  } else if (sportName.includes('basket')) {
    baseCount = 45 + (seed % 40); // 45 to 85 markets
  } else if (sportName.includes('tenis') || sportName.includes('tennis')) {
    baseCount = 22 + (seed % 28); // 22 to 50 markets
  } else if (sportName.includes('voley')) {
    baseCount = 18 + (seed % 24); // 18 to 42 markets
  } else {
    baseCount = 35 + (seed % 45); // 35 to 80 markets
  }

  // If match is live, add subtle dynamic variation over time
  const isLive = item.isLive || item.data?.status === 'in_progress' || item.data?.is_live_betting;
  if (isLive) {
    const minute = parseInt(String(item.minute || item.data?.minute || item.data?.info?.current_game_time || '30').replace(/\D/g, '')) || 30;
    const liveVariation = (minute % 5) - 2;
    baseCount = Math.max(12, baseCount + liveVariation);
  }

  return baseCount;
};
