import React, { useState } from 'react';
import { ProceduralLogo } from './ProceduralLogo';
import logoIndex from '../../src/assets/logo-index.json';

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
  'psg': 'paris-sg',
  'paris-saint-germain': 'paris-sg',
  'paris-sg': 'paris-sg',
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
  'atletico': 'atletico-madrid'
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

  // Akıllı eşleşme algoritması ile 3,100+ lokal takım logosundan takımı bul
  const bestMatch = name ? findBestLogoMatch(name) : null;
  const localImgUrl = bestMatch ? `/assets/logos/${bestMatch}.png` : null;

  const urls = [localImgUrl, fallbackLogo].filter(Boolean) as string[];
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
