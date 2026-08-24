import re

filename = 'socket_server.cjs'
with open(filename, 'r') as f:
    content = f.read()

# Filter out matches where O1 (Home) or O2 (Away) are missing
old_filter = """  if (!data || !data.Value) return [];
  return data.Value.filter(match => {
    const ln = (match.L || match.LE || '').toLowerCase();"""

new_filter = """  if (!data || !data.Value) return [];
  return data.Value.filter(match => {
    // Takım ismi boş olan veya 'Ev Sahibi' gibi bozuk gelenleri direkt reddet
    if (!match.O1 && !match.O1E) return false;
    if (!match.O2 && !match.O2E) return false;
    
    const ln = (match.L || match.LE || '').toLowerCase();"""
content = content.replace(old_filter, new_filter)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
