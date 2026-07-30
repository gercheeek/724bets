import React, { useState } from 'react';
import { ProceduralLogo } from './ProceduralLogo';
import logoIndex from '../../public/assets/logo-index.json';

interface PlayerLogoProps {
  name: string;
  fallbackLogo: string;
  sport?: string;
}

const normalize = (str: string) => {
  if (!str) return '';
  const charMap: Record<string, string> = { 'ğ':'g', 'ü':'u', 'ş':'s', 'ı':'i', 'ö':'o', 'ç':'c' };
  let s = str.toLowerCase();
  s = s.replace(/[ğüşıöç]/g, m => charMap[m]);
  return s
    .replace(/\s+(fc|afc|sc|asd|cf|fk|nk|hnk|us|as|sk|ik)$/i, '')
    .replace(/^(fc|afc|sc|asd|cf|fk|nk|hnk|us|as|sk|ik|cd|sd)\s+/i, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const customAliases: Record<string, string> = {
  'marsilya': 'marseille',
  'kizilyildiz': 'crvena-zvezda',
  'bayern-munih': 'bayern-munich',
  'psg': 'paris-sg',
  'paris-saint-germain': 'paris-sg',
  'sporting-lizbon': 'sporting-cp',
  'roma': 'as-roma',
  'lazio': 'ss-lazio',
  'napoli': 'ssc-napoli',
  'bologna': 'bologna-fc',
  'fiorentina': 'acf-fiorentina',
  'dinamo-kiev': 'dynamo-kyiv',
  'dynamo-kiev': 'dynamo-kyiv',
  'kyiv': 'dynamo-kyiv'
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
  // 2. Prefix eşleşmesi
  else if (logoIndex.find((file: string) => file.startsWith(norm + '-'))) {
    match = logoIndex.find((file: string) => file.startsWith(norm + '-')) || null;
  }
  // 3. İçinde geçme eşleşmesi
  else if (logoIndex.find((file: string) => (norm.includes(file) || (file.includes(norm) && norm.length > 4)) && file.length > 3)) {
    match = logoIndex.find((file: string) => (norm.includes(file) || (file.includes(norm) && norm.length > 4)) && file.length > 3) || null;
  }
  
  logoCache.set(rawName, match);
  return match;
}

export const PlayerLogo: React.FC<PlayerLogoProps> = ({ name, fallbackLogo, sport }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isFootball = !sport || sport.toLowerCase().includes('futbol') || sport.toLowerCase().includes('soccer');

  // Akıllı eşleşme algoritması ile lokal dosyayı bul (Sadece Futbol)
  const bestMatch = isFootball ? findBestLogoMatch(name) : null;
  const localImgUrl = bestMatch ? `/assets/logos/${bestMatch}.png` : null;

  const urls = [localImgUrl, fallbackLogo].filter(Boolean) as string[];
  const [pipelineStep, setPipelineStep] = useState(0);
  const currentUrl = urls[pipelineStep];

  const handleError = () => {
    const nextStep = pipelineStep + 1;
    if (nextStep < urls.length) {
      setPipelineStep(nextStep);
    } else {
      setHasError(true);
    }
  };
  
  const handleLoad = () => {
    setIsLoaded(true);
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
        onLoad={handleLoad}
      />
    </div>
  );
};
