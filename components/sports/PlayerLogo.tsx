import React, { useState, useEffect } from 'react';

interface PlayerLogoProps {
  name: string;
  fallbackLogo: string;
}

// Global cache to prevent re-fetching the same broken or valid URLs
const logoCache: Record<string, string> = {};

export const domainMap: Record<string, string> = {
      // Türkiye - Süper Lig & 1. Lig
      'galatasaray': 'galatasaray.org',
      'fenerbahçe': 'fenerbahce.org',
      'beşiktaş': 'bjk.com.tr',
      'trabzonspor': 'trabzonspor.org.tr',
      'başakşehir': 'ibfk.com.tr',
      'adana demirspor': 'adanademirspor.org.tr',
      'kasımpaşa': 'kasimpasa.com.tr',
      'konyaspor': 'konyaspor.org.tr',
      'sivasspor': 'sivasspor.org.tr',
      'antalyaspor': 'antalyaspor.com.tr',
      'gaziantep fk': 'gaziantepfk.org',
      'gaziantep': 'gaziantepfk.org',
      'kayserispor': 'kayserispor.org.tr',
      'alanyaspor': 'alanyaspor.org.tr',
      'hatayspor': 'hatayspor.org.tr',
      'rizespor': 'caykurrizespor.org.tr',
      'samsunspor': 'samsunspor.org.tr',
      'pendikspor': 'pendikspor.org.tr',
      'göztepe': 'goztepe.org.tr',
      'eyüpspor': 'eyupspor.org.tr',
      'bodrum fk': 'bodrumfk.org',
      'sakaryaspor': 'sakaryaspor.org.tr',
      'kocaelispor': 'kocaelispor.com.tr',
      'bursaspor': 'bursaspor.org.tr',
      'eskişehirspor': 'eskisehirspor.org.tr',
      'gençlerbirliği': 'genclerbirligi.org.tr',
      'ankaragücü': 'ankaragucu.org.tr',

      // England
      'arsenal': 'arsenal.com',
      'manchester united': 'manutd.com',
      'man united': 'manutd.com',
      'manchester city': 'mancity.com',
      'man city': 'mancity.com',
      'liverpool': 'liverpoolfc.com',
      'chelsea': 'chelseafc.com',
      'tottenham': 'tottenhamhotspur.com',
      'newcastle': 'nufc.co.uk',
      'aston villa': 'avfc.co.uk',
      'everton': 'evertonfc.com',
      'brighton': 'brightonandhovealbion.com',
      'west ham': 'whufc.com',
      'leeds': 'leedsunited.com',
      'nottingham forest': 'nottinghamforest.co.uk',
      'bournemouth': 'afcb.co.uk',
      'brentford': 'brentfordfc.com',
      'fulham': 'fulhamfc.com',
      'wolverhampton': 'wolves.co.uk',
      'wolves': 'wolves.co.uk',
      'crystal palace': 'cpfc.co.uk',
      'ipswich': 'itfc.co.uk',
      'sunderland': 'safc.com',
      'hull city': 'wearehullcity.co.uk',
      'coventry city': 'ccfc.co.uk',
      'celtic': 'celticfc.com',
      'rangers': 'rangers.co.uk',

      // Spain
      'real madrid': 'realmadrid.com',
      'barcelona': 'fcbarcelona.com',
      'atletico madrid': 'atleticodemadrid.com',
      'sevilla': 'sevillafc.es',
      'valencia': 'valenciacf.com',
      'villarreal': 'villarrealcf.es',
      'real sociedad': 'realsociedad.eus',
      'athletic bilbao': 'athletic-club.eus',
      'real betis': 'realbetisbalompie.es',
      'girona': 'gironafc.cat',
      'celta vigo': 'rccelta.es',
      'osasuna': 'osasuna.es',
      'rayo vallecano': 'rayovallecano.es',
      'getafe': 'getafecf.com',
      'espanyol': 'rcdespanyol.com',
      'mallorca': 'rcdmallorca.es',

      // Germany
      'bayern munich': 'fcbayern.com',
      'dortmund': 'bvb.de',
      'bayer leverkusen': 'bayer04.de',
      'rb leipzig': 'rbleipzig.com',
      'stuttgart': 'vfb.de',
      'eintracht frankfurt': 'eintracht.de',
      'wolfsburg': 'vfl-wolfsburg.de',
      'werder bremen': 'werder.de',
      'freiburg': 'scfreiburg.com',
      'borussia m\'gladbach': 'borussia.de',
      'hertha berlin': 'herthabsc.com',
      'union berlin': 'fc-union-berlin.de',
      'schalke': 'schalke04.de',
      'hamburg': 'hsv.de',
      'koln': 'fc.de',
      'sv elversberg': 'sv07elversberg.de',
      'elversberg': 'sv07elversberg.de',
      'hamburg sv': 'hsv.de',
      'hamburger sv': 'hsv.de',
      '1. fc köln': 'fc.de',
      'fc köln': 'fc.de',

      // Italy
      'inter': 'inter.it',
      'ac milan': 'acmilan.com',
      'juventus': 'juventus.com',
      'as roma': 'asroma.com',
      'napoli': 'sscnapoli.it',
      'lazio': 'sslazio.it',
      'atalanta': 'atalanta.it',
      'fiorentina': 'acffiorentina.com',
      'torino': 'torinofc.it',
      'bologna': 'bolognafc.it',
      'parma': 'parmacalcio1913.com',
      'sampdoria': 'sampdoria.it',

      // France
      'psg': 'psg.fr',
      'marseille': 'om.fr',
      'monaco': 'asmonaco.com',
      'lyon': 'ol.fr',
      'lille': 'losc.fr',
      'lens': 'rclens.fr',
      'rennes': 'staderennais.com',
      'nice': 'ogcnice.com',
      'strasbourg': 'rcstrasbourgalsace.fr',

      // Other Europe & World
      'ajax': 'ajax.nl',
      'psv': 'psv.nl',
      'feyenoord': 'feyenoord.nl',
      'benfica': 'slbenfica.pt',
      'sporting': 'sporting.pt',
      'porto': 'fcporto.pt',
      'shakhtar donetsk': 'shakhtar.com',
      'dynamo kyiv': 'fcdynamo.com',
      'nordsjaelland': 'fcn.dk',
      'brabrand': 'brabrand-if.dk',
      'vsk aarhus': 'vskaarhus.dk',
      'ishoj': 'ishojif.dk',
      'bk frem': 'bkfrem.dk',
      'istra 1961': 'nkistra.com',
      'slaven belupo': 'nk-slaven-belupo.hr',
      'mamelodi sundowns': 'sundownsfc.co.za',
      'al ahly': 'alahlyegypt.com',
      'sabah baku': 'sabahfc.az',
      'sabah': 'sabahfc.az',
      'kups': 'kups.fi',
      'iberia 1999': 'fciberia1999.ge',
      'slovan bratislava': 'skslovan.com',
      'ararat-armenia': 'fcararatarmenia.am',
      'ararat armenia': 'fcararatarmenia.am',
      'shamrock rovers': 'shamrockrovers.ie',
      'dukla prague ii': 'fkdukla.cz',
      'dukla prague': 'fkdukla.cz',
      'banik most sous': 'fkbanikmostsus.cz',
      'horsholm usserod ik': 'huik.dk',
      'fagiano okayama': 'fagiano-okayama.com',
      'bochum': 'vfl-bochum.de',
      'vfl bochum': 'vfl-bochum.de',
      'flamengo': 'flamengo.com.br',
      'palmeiras': 'palmeiras.com.br',
      'sao paulo': 'saopaulofc.net',
      'boca juniors': 'bocajuniors.com.ar',
      'river plate': 'cariverplate.com.ar',
      'inter miami': 'intermiamicf.com',
      'sc austria lustenau': 'austria-lustenau.at',
      'austria lustenau': 'austria-lustenau.at',
      'sv ried': 'svried.at',
      'wolfsberger ac': 'rzpelletswac.at',
      'wolfsberger': 'rzpelletswac.at',
      'fk austria wien': 'fk-austria.at',
      'austria wien': 'fk-austria.at',
      'rapid wien': 'skrapid.at',
      'sk rapid wien': 'skrapid.at',
      'rheindorf altach': 'scra.at',
      'scr altach': 'scra.at',
      'altach': 'scra.at',
      'red bull salzburg': 'redbullsalzburg.at',
      'rb salzburg': 'redbullsalzburg.at',
      'tsv hartberg': 'tsv-hartberg.at',
      'hartberg': 'tsv-hartberg.at',
      'wsg tirol': 'wsg-tirol.at',
      'sk sturm graz': 'sksturm.at',
      'sturm graz': 'sksturm.at',

      // NBA
      'lakers': 'lakers.com',
      'warriors': 'warriors.com',
      'celtics': 'celtics.com',
      'heat': 'heat.com',
      'nuggets': 'nuggets.com',
      'suns': 'suns.com',
      'bucks': 'bucks.com',
      '76ers': 'sixers.com',
      'mavericks': 'mavs.com',
      'clippers': 'clippers.com',
};

export const hasKnownLogo = (teamName: string): boolean => {
    if (!teamName) return false;
    const teamKey = teamName.toLowerCase().trim();
    if (domainMap[teamKey]) return true;
    const foundKey = Object.keys(domainMap).find(k => teamKey.includes(k) || k.includes(teamKey));
    return !!foundKey;
};

export const PlayerLogo: React.FC<PlayerLogoProps> = ({ name, fallbackLogo }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);

  // Generate pipeline URLs for the team
  const getPipelineUrls = (teamName: string, fbLogo: string) => {
    const urls: string[] = [];
    const teamKey = (teamName || '').toLowerCase().trim();ppers.com',
    };
    
    // Step 1: Known domain mapping (Highest Priority - guarantees 100% correct HD logo)
    let matchedDomain = domainMap[teamKey];
    if (!matchedDomain) {
      // Try partial/fuzzy match (e.g. "Hamburg SV" matching "hamburg" or "hsv")
      const foundKey = Object.keys(domainMap).find(k => teamKey.includes(k) || k.includes(teamKey));
      if (foundKey) {
        matchedDomain = domainMap[foundKey];
      }
    }

    if (matchedDomain) {
      urls.push(`https://www.google.com/s2/favicons?domain=${matchedDomain}&sz=128`);
      urls.push(`https://icon.horse/icon/${matchedDomain}`);
      urls.push(`https://logo.clearbit.com/${matchedDomain}`);
    } else {
      // Step 2: Heuristic fallback for unknown teams (Google Favicons first)
      const domainName = teamKey.replace(/[^a-z0-9]/g, '');
      if (domainName.length > 3) {
        urls.push(`https://www.google.com/s2/favicons?domain=${domainName}.com&sz=128`);
        urls.push(`https://icon.horse/icon/${domainName}.com`);
        urls.push(`https://logo.clearbit.com/${domainName}.com`);
      }
    }
    
    // Step 3: Local CDN Path
    const cleanName = (teamName || '').replace(/ /g, '_').replace(/\./g, '').replace(/\//g, '');
    urls.push(`/takimlogo/${cleanName}.png`);
    
    // Step 4: Tarafbet Scraping (using BetConstruct ID if available)
    if (fbLogo && fbLogo.includes('team-logo')) {
      const matchId = fbLogo.match(/team-logo\/(\d+)\.png/);
      if (matchId && matchId[1]) {
        urls.push(`https://tarafbet981.com/images/team-logo/${matchId[1]}.png`);
        urls.push(`https://srv.tarafbet981.com/sport/images/team-logo/${matchId[1]}.png`);
        urls.push(`https://norabahis779.com/images/team-logo/${matchId[1]}.png`);
      }
    }
    
    // Step 5: BetConstruct or provided fallback (Lowest Priority - mostly generic globes)
    if (fbLogo && fbLogo.startsWith('http') && !fbLogo.includes('dicebear.com')) {
      urls.push(fbLogo);
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
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1e2638] via-[#141824] to-[#0b0e17] border border-emerald-500/30 rounded-full select-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
        <span className="text-[10px] md:text-[11px] font-black text-emerald-400 tracking-wider drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
          {getInitials(name)}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={imgUrl} 
      alt={name} 
      className="w-full h-full object-contain p-0.5 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.7)] hover:scale-110 transition-transform duration-300"
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
    />
  );
};
