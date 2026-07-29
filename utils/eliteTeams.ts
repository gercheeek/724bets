import { ODDS_ENGINE_CONFIG } from './oddsEngineConfig';

export const ELITE_TEAMS = ODDS_ENGINE_CONFIG.vipTeams;

/**
 * Checks if a given team name belongs to the elite list.
 */
export const isEliteTeam = (teamName: string): boolean => {
  if (!teamName) return false;
  const name = teamName.toLowerCase().trim();
  
  // Exact match
  if (ELITE_TEAMS.includes(name)) return true;

  // Substring match for robust detection (e.g., "Galatasaray SK", "Fenerbahçe A.Ş.")
  return ELITE_TEAMS.some(elite => name.includes(elite) || elite.includes(name));
};

/**
 * Calculates a priority score for a match (0, 1, or 2)
 * 2 = Both teams are elite
 * 1 = One team is elite
 * 0 = Neither is elite
 */
export const getMatchPriorityScore = (home: string, away: string): number => {
  let score = 0;
  if (isEliteTeam(home)) score += 1;
  if (isEliteTeam(away)) score += 1;
  return score;
};
