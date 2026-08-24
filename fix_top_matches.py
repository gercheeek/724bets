import re

filename = 'components/sports/TopMatchesWidget.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Make filtering much less strict so it actually shows matches
old_filter = """        // Must have logos
        if (findBestLogoMatch(m.home) === null || findBestLogoMatch(m.away) === null) {
            return false;
        }
        
        // En fazla 48 saat uzağındaki maçlar
        if (m.timestamp) {
           const diff = m.timestamp - Date.now();
           if (diff > 172800000 || diff < 0) return false; // Max 48 hours or passed
        }
        
        return true; """

new_filter = """        // We removed the logo requirement so the component doesn't disappear if no logos match
        
        // Zaman filtresi: Eğer geçmişteyse (diff < 0) filterla.
        if (m.timestamp) {
           const diff = m.timestamp - Date.now();
           if (diff < -3600000) return false; // 1 saatten eski bitmiş olabilecek maçları gizle
        }
        
        return true; """

content = content.replace(old_filter, new_filter)

with open(filename, 'w') as f:
    f.write(content)
print("Relaxed filtering for TopMatchesWidget")
