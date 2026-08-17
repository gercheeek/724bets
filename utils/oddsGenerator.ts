import { getOddsEngineConfig } from './oddsEngineConfig';

export const generateDetailedMarkets = (homeOdd: number, drawOdd: number, awayOdd: number, homeName: string, awayName: string, currentTotalGoals: number = 0, currentMinute: number = 0, currentTotalCorners: number = 0): string[] => {
  // Check if odds are valid
  if (!homeOdd || !drawOdd || !awayOdd || homeOdd <= 1 || drawOdd <= 1 || awayOdd <= 1) {
    return [];
  }

  // 1. Calculate implied probabilities
  const ph = 1 / homeOdd;
  const pd = 1 / drawOdd;
  const pa = 1 / awayOdd;
  
  // 2. Normalize probabilities so they sum to 1
  const total = ph + pd + pa;
  const p1 = ph / total;
  const px = pd / total;
  const p2 = pa / total;
  
  // 3. Margin logic (~6% sportsbook margin for realism)
  const config = getOddsEngineConfig();
  const margin = 1 + (config.rules.houseEdgePercentage || 0.06);
  
  const formatOdd = (prob: number) => {
    // Avoid infinite or absurd odds
    if (prob < 0.01) prob = 0.01;
    if (prob > 0.99) prob = 0.99;
    const raw = margin / prob;
    return (Math.round(raw * 100) / 100).toFixed(2);
  };
  
  const markets: string[] = [];
  let mId = 9000;
  let sId = 90000;
  const nextMid = () => (mId++).toString();
  const nextSid = () => (sId++).toString();
  
  // --- 1X2 ---
  markets.push(`${nextMid()}|1x2|${nextSid()}~1~${formatOdd(p1)}!${nextSid()}~X~${formatOdd(px)}!${nextSid()}~2~${formatOdd(p2)}`);
  
  // --- Çifte Şans ---
  markets.push(`${nextMid()}|Double_Chance|${nextSid()}~1X~${formatOdd(p1 + px)}!${nextSid()}~12~${formatOdd(p1 + p2)}!${nextSid()}~X2~${formatOdd(px + p2)}`);
  
  // --- Beraberlikte iade (Draw No Bet) ---
  markets.push(`${nextMid()}|Draw_No_Bet|${nextSid()}~1~${formatOdd(p1 / (p1 + p2))}!${nextSid()}~2~${formatOdd(p2 / (p1 + p2))}`);
  
  // --- Toplam Gol (Over/Under) ---
  const { goalBaseMargin, goalProb1More, goalProb2MoreMultiplier, goalProb3MoreMultiplier, goalProb4MoreMultiplier, maxMinuteThreshold, timeDecayStartMinute, timeDecayEnabled, cornerBaseMargin, cornerTimeFractionMax } = config.rules;
  
  // Time decay for goals: less time remaining = lower chance of scoring MORE goals
  let timeMultiplier = 1;
  if (timeDecayEnabled && currentMinute > timeDecayStartMinute && currentMinute <= maxMinuteThreshold) {
      timeMultiplier = Math.sqrt((maxMinuteThreshold - currentMinute) / maxMinuteThreshold);
  } else if (timeDecayEnabled && currentMinute > maxMinuteThreshold) {
      timeMultiplier = 0.05; // almost zero chance
  }
  
  // Probability of scoring AT LEAST N more goals in the remaining time
  let prob1More = (goalProb1More - (Math.abs(p1 - p2) * 0.1)) * timeMultiplier;
  prob1More = Math.min(0.95, Math.max(0.01, prob1More));

  let prob2More = prob1More * goalProb2MoreMultiplier;
  let prob3More = prob2More * goalProb3MoreMultiplier;
  let prob4More = prob3More * goalProb4MoreMultiplier;

  const baseLine = currentTotalGoals + goalBaseMargin; // usually X.5
  
  markets.push(`${nextMid()}|ou|${baseLine}|~üstü~${formatOdd(prob1More)}!~altı~${formatOdd(1 - prob1More)}`);
  markets.push(`${nextMid()}|ou|${baseLine + 1}|~üstü~${formatOdd(prob2More)}!~altı~${formatOdd(1 - prob2More)}`);
  markets.push(`${nextMid()}|ou|${baseLine + 2}|~üstü~${formatOdd(prob3More)}!~altı~${formatOdd(1 - prob3More)}`);
  markets.push(`${nextMid()}|ou|${baseLine + 3}|~üstü~${formatOdd(prob4More)}!~altı~${formatOdd(1 - prob4More)}`);
  
  // --- Karşılıklı Gol (BTTS) ---
  let bttsProb = (0.55 - (Math.abs(p1 - p2) * 0.25)) * timeMultiplier;
  bttsProb = Math.min(0.7, Math.max(0.05, bttsProb));
  markets.push(`${nextMid()}|gg||~var~${formatOdd(bttsProb)}!~yok~${formatOdd(1 - bttsProb)}`);
  
  // --- Handikap ---
  if (p1 > p2) {
    let homeHcapProb = p1 * 0.55;
    markets.push(`${nextMid()}|Handicap|${nextSid()}~(-1) 1~${formatOdd(homeHcapProb)}!${nextSid()}~(+1) 2~${formatOdd(1 - homeHcapProb)}`);
  } else {
    let awayHcapProb = p2 * 0.55;
    markets.push(`${nextMid()}|Handicap|${nextSid()}~(+1) 1~${formatOdd(1 - awayHcapProb)}!${nextSid()}~(-1) 2~${formatOdd(awayHcapProb)}`);
  }
  
  // --- İlk Yarı Sonucu ---
  let htPx = px * 1.5;
  let htP1 = p1 * 0.75;
  let htP2 = p2 * 0.75;
  const htTotal = htPx + htP1 + htP2;
  markets.push(`${nextMid()}|Half_Time_Result|${nextSid()}~1~${formatOdd(htP1/htTotal)}!${nextSid()}~X~${formatOdd(htPx/htTotal)}!${nextSid()}~2~${formatOdd(htP2/htTotal)}`);
  
  // --- Kornerler ---
  // Expected corners is current corners + expected remaining based on time
  const remainingTimeFraction = currentMinute > 0 ? Math.max(0, cornerTimeFractionMax - currentMinute) / cornerTimeFractionMax : 1;
  const expectedTotalCorners = currentTotalCorners + (cornerBaseMargin * remainingTimeFraction);
  const cornerBaseLine = Math.max(0.5, Math.floor(expectedTotalCorners) + 0.5);
  
  let cornerProb = 0.5 + (Math.abs(p1 - p2) * 0.15); // usually around 0.5
  markets.push(`${nextMid()}|Corners|${cornerBaseLine}|~üstü~${formatOdd(cornerProb)}!~altı~${formatOdd(1 - cornerProb)}`);
  
  let cornerPlus1Prob = Math.min(0.85, cornerProb * 0.6);
  markets.push(`${nextMid()}|Corners|${cornerBaseLine + 1}|~üstü~${formatOdd(cornerPlus1Prob)}!~altı~${formatOdd(1 - cornerPlus1Prob)}`);
  
  let cornerMinus1Prob = Math.max(0.15, cornerProb + (1 - cornerProb) * 0.4);
  if (cornerBaseLine > 1) {
     markets.push(`${nextMid()}|Corners|${cornerBaseLine - 1}|~üstü~${formatOdd(cornerMinus1Prob)}!~altı~${formatOdd(1 - cornerMinus1Prob)}`);
  }

  return markets;
};
