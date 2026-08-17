const fs = require('fs');
const logoIndex = JSON.parse(fs.readFileSync('src/assets/logo-index.json', 'utf8'));

const prefixes = 'fc|afc|sc|asd|cf|fk|nk|hnk|us|as|sk|ik|cd|sd|ac|ss|ssc|rsc|sl|pfk|gnk|tc|jk|kf|sv|fsv|vfb|tsg|rc|rcd|ud|bsc|osc|yfc|wfc|lfc|bfc|rfc|mfc|ufc|sfc|dfc|if|mtk|ak|bk|ff|gf|gfco|a|s'.split('|');
const customAliases = {
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
  'kyiv': 'dynamo-kyiv',
};

const normalize = (str) => {
  if (!str) return '';
  let s = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const charMap = { 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c' };
  s = s.replace(/[ğüşıöç]/g, m => charMap[m]);
  s = s.replace(/[^a-z0-9\s]/g, ' ');
  let words = s.split(/\s+/).filter(Boolean);
  if (words.length > 1 && prefixes.includes(words[0])) words.shift();
  if (words.length > 1 && prefixes.includes(words[words.length - 1])) words.pop();
  if (words.length > 1 && prefixes.includes(words[words.length - 1])) words.pop();
  return words.join('-');
};

const findBestLogoMatch = (rawName) => {
  if (!rawName) return null;
  const norm = normalize(rawName);
  let match = null;

  if (customAliases[norm] && logoIndex.includes(customAliases[norm])) {
    match = customAliases[norm];
  } else if (logoIndex.includes(norm)) {
    match = norm;
  } else if (logoIndex.find(file => file.startsWith(norm + '-'))) {
    match = logoIndex.find(file => file.startsWith(norm + '-')) || null;
  } else if (logoIndex.find(file => {
    if (norm.includes('gremio') && file.includes('porto')) return false;
    return (norm.includes(file) || (file.includes(norm) && norm.length > 4)) && file.length > 3;
  })) {
    match = logoIndex.find(file => {
      if (norm.includes('gremio') && file.includes('porto')) return false;
      return (norm.includes(file) || (file.includes(norm) && norm.length > 4)) && file.length > 3;
    }) || null;
  }
  return match;
};

console.log("BOTAFOGO ->", findBestLogoMatch("BOTAFOGO"));
console.log("EC VITÓRIA BA ->", findBestLogoMatch("EC VITÓRIA BA"));
