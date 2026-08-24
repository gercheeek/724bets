import React, { useState } from 'react';
import { ProceduralLogo } from './ProceduralLogo';
import logoIndex from '../../src/assets/logo-index.json';
import teamLogosData from '../../utils/team_logos.json';

const teamLogos: Record<string, string> = teamLogosData;

interface PlayerLogoProps {
  name: string;
  fallbackLogo: string;
  sport?: string;
}

const prefixes = 'fc|afc|sc|asd|cf|fk|nk|hnk|us|as|sk|ik|cd|sd|ac|ss|ssc|rsc|sl|pfk|gnk|tc|jk|kf|sv|fsv|vfb|tsg|rc|rcd|ud|bsc|osc|yfc|wfc|lfc|bfc|rfc|mfc|ufc|sfc|dfc|if|mtk|ak|bk|ff|gf|gfco|a|s'.split('|');

const normalize = (str: string) => {
  if (!str) return '';
  // Normalize accents (e.g. ê -> e, á -> a)
  let s = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
  const charMap: Record<string, string> = { 'ğ':'g', 'ü':'u', 'ş':'s', 'ı':'i', 'ö':'o', 'ç':'c' };
  s = s.replace(/[ğüşıöç]/g, m => charMap[m]);
  
  s = s.replace(/[^a-z0-9\s]/g, ' ');
  
  let words = s.split(/\s+/).filter(Boolean);
  
  if (words.length > 1 && prefixes.includes(words[0])) {
    words.shift();
  }
  if (words.length > 1 && prefixes.includes(words[words.length - 1])) {
    words.pop();
  }
  if (words.length > 1 && prefixes.includes(words[words.length - 1])) {
    words.pop();
  }
  
  return words.join('-');
};

const customAliases: Record<string, string> = {
  'marsilya': 'marseille',
  'kizilyildiz': 'crvena-zvezda',
  'bayern-munih': 'bayern-munich',
  'bayern-munchen': 'bayern-munich',
  'bayern': 'bayern-munich',
  'psg': 'paris-saintgermain',
  'paris-saint-germain': 'paris-saintgermain',
  'paris-sg': 'paris-saintgermain',
  'sporting-lizbon': 'sporting-cp',
  'roma': 'as-roma',
  'lazio': 'ss-lazio',
  'napoli': 'ssc-napoli',
  'bologna': 'bologna-fc',
  'fiorentina': 'acf-fiorentina',
  'dinamo-kiev': 'dynamo-kyiv',
  'dynamo-kiev': 'dynamo-kyiv',
  'kyiv': 'dynamo-kyiv',
  'manchester-united': 'manchester-united',
  'manchester-utd': 'manchester-united',
  'man-utd': 'manchester-united',
  'manchester-city': 'manchester-city',
  'man-city': 'manchester-city',
  'dortmund': 'borussia-dortmund',
  'brentford': 'brentford',
  'tottenham': 'tottenham-hotspur',
  'tottenham-hotspur': 'tottenham-hotspur',
  'inter': 'inter-milan',
  'milan': 'ac-milan',
  'atletico-madrid': 'atletico-madrid',
  'atletico': 'atletico-madrid',
  'athletic-bilbao': 'athletic-bilbao',
  'athletic-club': 'athletic-bilbao',
  'sevilla': 'sevilla',
  'sevilla-fc': 'sevilla'
};

const logoCache = new Map<string, string | null>();

export const findBestLogoMatch = (rawName: string): string | null => {
  if (!rawName) return null;
  
  if (logoCache.has(rawName)) {
    return logoCache.get(rawName) || null;
  }

  const norm = normalize(rawName);
  let match: string | null = null;
  
  // 0. Manual Alias
  if (customAliases[norm] && logoIndex.includes(customAliases[norm])) {
    match = customAliases[norm];
  }
  // 1. Birebir tam eşleşme (örn: "fenerbahçe" -> "fenerbahçe.png")
  else if (logoIndex.includes(norm)) {
    match = norm;
  }
  // 2. Exact word match in logoIndex (e.g. "tottenham" -> "tottenham-hotspur")
  else {
    const words = norm.split('-');
    for (const w of words) {
      if (w.length >= 4) {
        const found = logoIndex.find((f: string) => f === w || f.startsWith(w + '-') || f.endsWith('-' + w));
        if (found) {
          match = found;
          break;
        }
      }
    }

    // 3. Prefix eşleşmesi
    if (!match) {
      match = logoIndex.find((file: string) => file.startsWith(norm + '-')) || null;
    }

    // 4. İçinde geçme eşleşmesi
    if (!match) {
      match = logoIndex.find((file: string) => {
        if (norm.includes('gremio') && file.includes('porto')) return false;
        return (norm.includes(file) || (file.includes(norm) && norm.length > 4)) && file.length > 3;
      }) || null;
    }
  }
  
  logoCache.set(rawName, match);
  return match;
}

export const PlayerLogo: React.FC<PlayerLogoProps> = ({ name, fallbackLogo, sport }) => {
  const [pipelineStep, setPipelineStep] = useState(0);
  const [hasError, setHasError] = useState(false);

  // 1. Check dictionary in team_logos.json
  const normClean = name ? name.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '') : '';
  const hasJsonMapping = !!(teamLogos[normClean] || teamLogos[name?.toLowerCase()?.trim() ?? '']);
  
  // Use our backend proxy to avoid Cloudflare 403 errors and trigger background scraping!
  const proxyUrl = hasJsonMapping ? `http://localhost:3001/api/logo/${normClean}?name=${encodeURIComponent(name)}` : null;

  // 2. Check 3,100+ local team logos library
  const n = (name || '').toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
  const exactTeamLogo = teamLogosData[n] || teamLogosData[(name || '').toLowerCase()] ? n : null;
  const bestMatch = exactTeamLogo || (name ? findBestLogoMatch(name) : null);
  const localImgUrl = bestMatch ? `/logos/${bestMatch}.png` : null;
  const localImgAssetUrl = bestMatch ? `/assets/logos/${bestMatch}.png` : null;

  // Pipeline order: Local PNG logo -> Local Asset PNG logo -> Backend Proxy -> Fallback URL
  const urls = [localImgUrl, localImgAssetUrl, proxyUrl, fallbackLogo].filter(Boolean) as string[];
  const currentUrl = urls[pipelineStep];

  const handleError = () => {
    const nextStep = pipelineStep + 1;
    if (nextStep < urls.length) {
      setPipelineStep(nextStep);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentUrl) {
    return <ProceduralLogo name={name} sport={sport} />;
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img 
        src={currentUrl} 
        alt={name} 
        className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] hover:scale-110 transition-transform duration-300"
        onError={handleError}
      />
    </div>
  );
};
