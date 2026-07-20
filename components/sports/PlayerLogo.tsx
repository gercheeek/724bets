import React, { useState, useEffect } from 'react';

interface PlayerLogoProps {
  name: string;
  fallbackLogo: string;
}

// Global cache to prevent re-fetching the same broken or valid URLs
const logoCache: Record<string, string> = {};

export const PlayerLogo: React.FC<PlayerLogoProps> = ({ name, fallbackLogo }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  // Generate pipeline URLs for the team
  const getPipelineUrls = (teamName: string, fbLogo: string) => {
    const urls: string[] = [];
    
    // Step 1: BetConstruct or provided fallback
    if (fbLogo && fbLogo.startsWith('http') && !fbLogo.includes('dicebear.com')) {
      urls.push(fbLogo);
    }
    
    // Step 2: Clean name for local or specific CDNs
    const cleanName = (teamName || '').replace(/ /g, '_').replace(/\./g, '').replace(/\//g, '');
    const domainName = (teamName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    urls.push(`/takimlogo/${cleanName}.png`);
    
    // Step 3: API-Sports / fotmob / clearbit heuristic fallback
    // Clearbit tries to fetch logos based on common sports domains
    if (domainName.length > 3) {
      urls.push(`https://logo.clearbit.com/${domainName}.com`);
      urls.push(`https://logo.clearbit.com/${domainName}fc.com`);
    }

    return urls;
  };

  const urls = getPipelineUrls(name, fallbackLogo);

  useEffect(() => {
    // Check cache first
    const cached = logoCache[name];
    if (cached === 'ERROR') {
      setHasError(true);
      setImgUrl(null);
      return;
    }
    
    if (cached) {
      setHasError(false);
      setImgUrl(cached);
      return;
    }

    // Not in cache, start pipeline
    setHasError(false);
    setPipelineStep(0);
    
    if (urls.length > 0) {
      setImgUrl(urls[0]);
    } else {
      setHasError(true);
      logoCache[name] = 'ERROR';
    }
  }, [name, fallbackLogo]);

  const handleError = () => {
    const nextStep = pipelineStep + 1;
    if (nextStep < urls.length) {
      // Try next URL in pipeline
      setPipelineStep(nextStep);
      setImgUrl(urls[nextStep]);
    } else {
      // Pipeline exhausted, fallback to initials
      setHasError(true);
      logoCache[name] = 'ERROR';
    }
  };

  const handleLoad = () => {
    // Successfully loaded, save to cache
    if (imgUrl) {
      logoCache[name] = imgUrl;
    }
  };

  const getInitials = (teamName: string) => {
    if (!teamName) return 'T';
    const words = teamName.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return teamName.substring(0, 2).toUpperCase();
  };

  if (hasError || !imgUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-full select-none shadow-sm">
        <span className="text-[10px] font-black text-emerald-400 tracking-wider">
          {getInitials(name)}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={imgUrl} 
      alt={name} 
      className="w-full h-full object-contain p-0.5"
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};
