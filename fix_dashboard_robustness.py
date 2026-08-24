import re

filename = 'components/sports/SportsDashboardWidget.tsx'
with open(filename, 'r') as f:
    content = f.read()

# 1. Fix topEventMatch to fallback to live matches and any matches
old_topEvent = """    const topEventMatch = React.useMemo(() => {
        let pool = allMatches.length > 0 ? allMatches : [...global1xBetMatches, ...global1xBetPreMatches];
        // CANLI maçları ve 3.lig/amatör maçları kesinlikle filtrele
        pool = pool.filter(m => !m.isLive && !isYouthOrReserve(m.home || '', m.away || '', m.league || '') && !isBannedLeague(m.league || ''));
        
        let valid = pool.filter(m => m.homeOdd && m.homeOdd !== '-' && m.drawOdd && m.drawOdd !== '-' && m.awayOdd && m.awayOdd !== '-');
        if (!valid.length) return null;
        
        const n = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
        const hasL = (s: string) => !!(teamLogos[n(s)] || teamLogos[(s || '').toLowerCase()]);
        const wL = valid.filter(m => (m.homeLogo && m.awayLogo) || (hasL(m.home) && hasL(m.away)));
        const isTR = (m: any) => {
            const c = (m.country || '').toLowerCase(), l = (m.league || '').toLowerCase();
            return ['turkey', 'türkiye', 'süper lig', 'trendyol süper lig', 'super lig', 'tff 1. lig', '1. lig'].some(x => c === x || l === x);
        };

        // Öncelik: Sadece Maç Önü (TR ligleri -> Logolu Majör Maçlar -> Genel Logolu Maçlar)
        return wL.find(m => !m.isLive && isTR(m)) || 
               wL.find(m => !m.isLive) || 
               valid.find(m => !m.isLive && isTR(m)) || 
               valid.find(m => !m.isLive) || null;
    }, [allMatches, global1xBetMatches, global1xBetPreMatches]);"""

new_topEvent = """    const topEventMatch = React.useMemo(() => {
        let pool = allMatches.length > 0 ? allMatches : [...global1xBetMatches, ...global1xBetPreMatches];
        
        // Asla boş kalmaması için filtreleri yumuşattık. Sadece çok amatör olanları çıkar.
        pool = pool.filter(m => !isYouthOrReserve(m.home || '', m.away || '', m.league || '') && !isBannedLeague(m.league || ''));
        
        let valid = pool.filter(m => m.homeOdd && m.homeOdd !== '-' && m.drawOdd && m.drawOdd !== '-' && m.awayOdd && m.awayOdd !== '-');
        if (!valid.length) valid = pool; // Eğer oran yoksa bari maçı göster.
        if (!valid.length) return null;
        
        const n = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
        const hasL = (s: string) => !!(teamLogos[n(s)] || teamLogos[(s || '').toLowerCase()]);
        const wL = valid.filter(m => (m.homeLogo && m.awayLogo) || (hasL(m.home) && hasL(m.away)));
        const isTR = (m: any) => {
            const c = (m.country || '').toLowerCase(), l = (m.league || '').toLowerCase();
            return ['turkey', 'türkiye', 'süper lig', 'trendyol süper lig', 'super lig', 'tff 1. lig', '1. lig'].some(x => c === x || l === x);
        };

        // Yeni Hiyerarşi: Maç Önü TR -> Maç Önü Logolu -> Canlı Logolu -> Maç Önü Herhangi -> Canlı Herhangi
        return wL.find(m => !m.isLive && isTR(m)) || 
               wL.find(m => !m.isLive) || 
               wL.find(m => m.isLive && isTR(m)) ||
               wL.find(m => m.isLive) ||
               valid.find(m => !m.isLive && isTR(m)) || 
               valid.find(m => !m.isLive) || 
               valid.find(m => m.isLive) || 
               valid[0] || null;
    }, [allMatches, global1xBetMatches, global1xBetPreMatches]);"""
content = content.replace(old_topEvent, new_topEvent)

# 2. Fix tripleComboMatches to fallback gracefully
old_tripleCombo = """    /* ── Triple Combo ── */
    const tripleComboMatches = React.useMemo(() => {
        let pool = allMatches.length > 0 ? allMatches : [...global1xBetMatches, ...global1xBetPreMatches];
        pool = pool.filter(m => !isYouthOrReserve(m.home || '', m.away || '', m.league || '') && !isBannedLeague(m.league || ''));
        
        let list = pool.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-' && parseFloat(m.homeOdd) > 1.1 && parseFloat(m.homeOdd) <= 1.6);
        return [...list].sort((a, b) => parseFloat(a.homeOdd) - parseFloat(b.homeOdd)).slice(0, 3);
    }, [allMatches, global1xBetMatches, global1xBetPreMatches]);"""

new_tripleCombo = """    /* ── Triple Combo ── */
    const tripleComboMatches = React.useMemo(() => {
        let pool = allMatches.length > 0 ? allMatches : [...global1xBetMatches, ...global1xBetPreMatches];
        pool = pool.filter(m => !isYouthOrReserve(m.home || '', m.away || '', m.league || '') && !isBannedLeague(m.league || ''));
        
        // Önce favori maç önü maçları (1.10 - 1.70 arası)
        let list = pool.filter(m => !m.isLive && m.homeOdd && m.homeOdd !== '-' && parseFloat(m.homeOdd) >= 1.1 && parseFloat(m.homeOdd) <= 1.7);
        if (list.length < 3) {
            // Yetmezse, canlıdaki favorileri de ekle
            const liveFavs = pool.filter(m => m.isLive && m.homeOdd && m.homeOdd !== '-' && parseFloat(m.homeOdd) >= 1.1 && parseFloat(m.homeOdd) <= 1.8);
            list = [...list, ...liveFavs];
        }
        if (list.length < 3) {
            // Hala yetmezse, oran sınırı olmadan geçerli herhangi maçları al
            const valid = pool.filter(m => m.homeOdd && m.homeOdd !== '-');
            list = [...list, ...valid];
        }
        
        // Eşsiz olanları (unique) ID'ye göre filtrele ve 3 tane al
        const uniqueList = Array.from(new Map(list.map(m => [m.id, m])).values());
        return uniqueList.slice(0, 3);
    }, [allMatches, global1xBetMatches, global1xBetPreMatches]);"""
content = content.replace(old_tripleCombo, new_tripleCombo)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
