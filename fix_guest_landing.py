import re

filename = 'components/GuestLanding.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_code = """  const { t } = useLanguage();
  const { events } = useBetting();
  const matches = events || []; // Use real betting events for widgets
  const setSelectedMatch = (m: any) => {};"""

new_code = """  const { t } = useLanguage();
  const { events, global1xBetPreMatches, globalLiveMatches } = useBetting();
  
  // Widgetlara göndereceğimiz veriyi zenginleştirelim. Eğer "events" sadece canlı maçları içeriyorsa,
  // Yaklaşan maçlar widget'ları kaybolur. O yüzden pre-match verilerini ekliyoruz.
  const allMatches = [...(events || []), ...(global1xBetPreMatches || []), ...(globalLiveMatches || [])];
  // Tekrarlayanları (ID'ye göre) filtrele
  const matchesMap = new Map();
  allMatches.forEach(m => { if (m.id) matchesMap.set(m.id, m); });
  const matches = Array.from(matchesMap.values());
  
  const setSelectedMatch = (m: any) => {};"""

content = content.replace(old_code, new_code)
with open(filename, 'w') as f:
    f.write(content)
print("Updated GuestLanding.tsx to include pre matches")
