const logoIndex = require('./public/assets/logo-index.json');

const normalize = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ fc$/i, '')
    .replace(/ afc$/i, '')
    .replace(/^fc /i, '')
    .replace(/[^\w\sğüşıöç]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const findBestLogoMatch = (rawName) => {
  if (!rawName) return null;
  const norm = normalize(rawName);
  
  if (logoIndex.includes(norm)) return [norm, 'exact'];
  
  const prefixMatch = logoIndex.find((file) => file.startsWith(norm + '-'));
  if (prefixMatch) return [prefixMatch, 'prefix'];

  const containsMatch = logoIndex.find((file) => norm.includes(file));
  if (containsMatch) return [containsMatch, 'contains'];

  const words = norm.split('-');
  const longestWord = [...words].sort((a, b) => b.length - a.length)[0];
  
  if (longestWord && longestWord.length > 4) {
      const partialMatch = logoIndex.find((file) => file.includes(longestWord));
      if (partialMatch) return [partialMatch, 'longestWord'];
  }
  
  return [null, 'none'];
}

console.log("US Cremonese:", findBestLogoMatch("US Cremonese"));
console.log("AS Cittadella:", findBestLogoMatch("AS Cittadella"));
console.log("AS Gubbio:", findBestLogoMatch("AS Gubbio"));
console.log("SC Trestina ASD:", findBestLogoMatch("SC Trestina ASD"));
console.log("Real Valladolid:", findBestLogoMatch("Real Valladolid"));
console.log("Real Zaragoza:", findBestLogoMatch("Real Zaragoza"));
