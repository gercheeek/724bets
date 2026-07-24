import re

def fix_header_logo():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx', 'r') as f:
        content = f.read()

    # The current logo in Header.tsx:
    target = r'<span className="text-white">724</span>\s*<span className="text-\[#10b981\]">bets</span>'
    
    # Change to all Gamdom Green
    replacement = '<span className="text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]">724bets</span>'
    content = re.sub(target, replacement, content)

    # Let's also ensure the clover SVG is #00ff88
    content = content.replace('text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]', 'text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.6)]')

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx', 'w') as f:
        f.write(content)

fix_header_logo()
print("Header logo updated")
