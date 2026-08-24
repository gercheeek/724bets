import re

filename = 'components/sports/TopMatchesWidget.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Replace the useMemo block for topMatches
old_filter = """  // Filter and pick Top 15
  const topMatches = React.useMemo(() => {
    return matches
      .filter(m => {
        if (!m.homeOdd || m.homeOdd === '-') return false;
        
        const isTennisOrBasketball = m.sport?.toLowerCase().includes('tenis') || m.sport?.toLowerCase().includes('tennis') || m.sport?.toLowerCase().includes('basket');
        
        // --- STRICT FILTERING FOR TOP MATCHES ---
        const l = (m.league || '').toUpperCase();
        // Explicitly exclude amateur/lower leagues, qualifiers, and SECOND DIVISIONS
        if (l.includes('QUEENSLAND') || l.includes('VICTORIA') || l.includes('NPL') || l.includes('RESERVE') || l.includes('YOUTH') || l.includes('U19') || l.includes('U21') || l.includes('WOMEN') || l.includes('KADIN') || l.includes('ELEMELER') || l.includes('QUALIFIERS') || l.includes('2.') || l.includes('SERIE B') || l.includes('SERIE C') || l.includes('PORTUGAL 2') || l.includes('CHAMPIONSHIP') || l.includes('LIGA 2') || l.includes('LIG 2')) {
            return false;
        }

        // Must have logos
        if (findBestLogoMatch(m.home) === null || findBestLogoMatch(m.away) === null) {
            return false;
        }
        
        // En fazla 24 saat uzağındaki maçlar
        if (m.timestamp && !m.isLive) {
           const diff = m.timestamp - Date.now();
           if (diff > 86400000) return false;
        }
        
        return true; 
      })
      .sort((a, b) => {
        const getPriorityScore = (match: MatchInfo) => {
          let score = 0;
          const t = match.home.toLowerCase() + ' ' + match.away.toLowerCase();
          const l = match.league.toLowerCase();
          
          // 1. Türk takımlarına ve Türkiye liglerine devasa öncelik
          const turkishTeams = ['galatasaray', 'fenerbahçe', 'fenerbahce', 'beşiktaş', 'besiktas', 'trabzonspor', 'başakşehir', 'basaksehir', 'konyaspor', 'adana demirspor', 'sivasspor', 'göztepe'];
          if (turkishTeams.some(tt => t.includes(tt))) score += 15000;
          if (l.includes('süper lig') || l.includes('super lig') || l.includes('türkiye kupası') || l.includes('1. lig')) score += 12000;
          
          // 2. Avrupa 5 Büyük Lig
          const top5Leagues = ['premier', 'la liga', 'serie a', 'bundesliga', 'ligue 1'];
          if (top5Leagues.some(el => l.includes(el))) score += 8000;
          
          // 3. Avrupa Kupaları
          if (l.includes('şampiyonlar ligi') || l.includes('champions league') || l.includes('avrupa ligi') || l.includes('europa league')) score += 5000;
          
          // VIP takımlar (Real Madrid, City vs. + Diğer elite)
          const eliteScore = getMatchPriorityScore(match.home, match.away);
          if (eliteScore > 0) score += (eliteScore * 2000);
          
          if (ELITE_LEAGUES.some(el => l.includes(el))) score += 500;
          
          if (match.isLive) score += 200; // Live maçlar öne
          
          return score;
        };

        if (sortByTime) {
          return (a.timestamp || 0) - (b.timestamp || 0);
        }

        const scoreA = getPriorityScore(a);
        const scoreB = getPriorityScore(b);
        
        if (scoreA !== scoreB) {
           return scoreB - scoreA; // Highest score first
        }
        
        // Zaman olarak en yakın olan öne (Canlılar ve yakın saattekiler)
        return (a.timestamp || 0) - (b.timestamp || 0);
      })
      .slice(0, 10);
  }, [matches, sortByTime]);"""

new_filter = """  // Filter and pick Top 10 upcoming matches
  const topMatches = React.useMemo(() => {
    return matches
      .filter(m => {
        if (!m.homeOdd || m.homeOdd === '-') return false;
        
        // YAKLAŞAN MAÇLAR OLMALI - Canlı olanları ELEDİK.
        if (m.isLive) return false;

        const isTennisOrBasketball = m.sport?.toLowerCase().includes('tenis') || m.sport?.toLowerCase().includes('tennis') || m.sport?.toLowerCase().includes('basket');
        
        // --- STRICT FILTERING FOR TOP MATCHES ---
        const l = (m.league || '').toUpperCase();
        // Explicitly exclude amateur/lower leagues, qualifiers, and SECOND DIVISIONS
        if (l.includes('QUEENSLAND') || l.includes('VICTORIA') || l.includes('NPL') || l.includes('RESERVE') || l.includes('YOUTH') || l.includes('U19') || l.includes('U21') || l.includes('WOMEN') || l.includes('KADIN') || l.includes('ELEMELER') || l.includes('QUALIFIERS') || l.includes('2.') || l.includes('SERIE B') || l.includes('SERIE C') || l.includes('PORTUGAL 2') || l.includes('CHAMPIONSHIP') || l.includes('LIGA 2') || l.includes('LIG 2')) {
            return false;
        }

        // Must have logos
        if (findBestLogoMatch(m.home) === null || findBestLogoMatch(m.away) === null) {
            return false;
        }
        
        // En fazla 48 saat uzağındaki maçlar
        if (m.timestamp) {
           const diff = m.timestamp - Date.now();
           if (diff > 172800000 || diff < 0) return false; // Max 48 hours or passed
        }
        
        return true; 
      })
      .sort((a, b) => {
        const getPriorityScore = (match: MatchInfo) => {
          let score = 0;
          const t = match.home.toLowerCase() + ' ' + match.away.toLowerCase();
          const l = match.league.toLowerCase();
          
          // 1. Türk takımlarına ve Türkiye liglerine devasa öncelik (Kullanıcı genelde Türk takımları olsun dedi)
          const turkishTeams = ['galatasaray', 'fenerbahçe', 'fenerbahce', 'beşiktaş', 'besiktas', 'trabzonspor', 'başakşehir', 'basaksehir', 'konyaspor', 'adana demirspor', 'sivasspor', 'göztepe'];
          if (turkishTeams.some(tt => t.includes(tt))) score += 50000;
          if (l.includes('süper lig') || l.includes('super lig') || l.includes('türkiye kupası') || l.includes('1. lig')) score += 40000;
          
          // 2. VIP / Elite 100 Takımlar
          const eliteScore = getMatchPriorityScore(match.home, match.away);
          if (eliteScore > 0) score += (eliteScore * 3000);
          
          // 3. Avrupa 5 Büyük Lig
          const top5Leagues = ['premier', 'la liga', 'serie a', 'bundesliga', 'ligue 1'];
          if (top5Leagues.some(el => l.includes(el))) score += 8000;
          
          // 4. Avrupa Kupaları
          if (l.includes('şampiyonlar ligi') || l.includes('champions league') || l.includes('avrupa ligi') || l.includes('europa league')) score += 5000;
          
          if (ELITE_LEAGUES.some(el => l.includes(el))) score += 500;
          
          // Yakın zamanda başlayacak maçlara hafif avantaj
          if (match.timestamp) {
            const diff = match.timestamp - Date.now();
            if (diff < 10800000) score += 1000; // Son 3 saat
          }

          return score;
        };

        if (sortByTime) {
          return (a.timestamp || 0) - (b.timestamp || 0);
        }

        const scoreA = getPriorityScore(a);
        const scoreB = getPriorityScore(b);
        
        if (scoreA !== scoreB) {
           return scoreB - scoreA; // Highest score first
        }
        
        // Zaman olarak en yakın olan öne
        return (a.timestamp || 0) - (b.timestamp || 0);
      })
      .slice(0, 10);
  }, [matches, sortByTime]);"""

content = content.replace(old_filter, new_filter)

# I should also fix the GuestLanding rendering
import os
guest_filename = 'components/GuestLanding.tsx'
with open(guest_filename, 'r') as gf:
    guest_content = gf.read()

guest_old = """              <div className="w-full">
                <TopMatchesWidget 
                  matches={matches}
                  onSelectMatch={(m) => {"""
guest_new = """              <div className="w-full">
                <TopMatchesWidget 
                  title="Yaklaşan En İyi Maçlar"
                  matches={matches}
                  onSelectMatch={(m) => {"""
guest_content = guest_content.replace(guest_old, guest_new)
with open(guest_filename, 'w') as gf:
    gf.write(guest_content)

with open(filename, 'w') as f:
    f.write(content)
print("Updated TopMatchesWidget filtering for upcoming matches")
