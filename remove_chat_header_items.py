import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
    content = f.read()

# Pattern to remove the language selector div
lang_pattern = re.compile(r'<div className="flex items-center gap-3">\s*<div\s*onClick=\{\(\) => setShowLangMenu\(!showLangMenu\)\}.*?</div>\s*</div>', re.DOTALL)
content = lang_pattern.sub('', content)

# Pattern to remove the green user counter
counter_pattern = re.compile(r'<div className="flex items-center gap-1\.5 bg-\[#00E701\]/10 text-\[#00E701\] px-2\.5 py-1 rounded-full text-xs font-bold border border-\[#00E701\]/20">\s*<div className="w-1\.5 h-1\.5 rounded-full bg-\[#00E701\] animate-pulse"></div>\s*<span>\{Math\.floor\(Math\.random\(\) \* 500\) \+ 1500\}</span>\s*</div>', re.DOTALL)
content = counter_pattern.sub('', content)

# Check if changes were made
if 'setShowLangMenu' not in content and 'Math.random() * 500' not in content:
    print("Successfully removed header items.")
else:
    print("Failed to remove some items, applying manual replace.")
    # Fallback manual slice if regex fails
    start_str = '<div className="flex items-center gap-3">'
    end_str = '</div>\n                <div className="flex items-center gap-4 text-gray-400">'
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str)
    
    if start_idx != -1 and end_idx != -1:
        content = content[:start_idx] + content[end_idx + len('</div>\n                '):]
        
    # Also remove counter manually
    counter_start = '<div className="flex items-center gap-1.5 bg-[#00E701]/10 text-[#00E701] px-2.5 py-1 rounded-full text-xs font-bold border border-[#00E701]/20">'
    counter_end = '</div>\n                    <button onClick={onClose}'
    cs_idx = content.find(counter_start)
    ce_idx = content.find(counter_end)
    if cs_idx != -1 and ce_idx != -1:
        content = content[:cs_idx] + content[ce_idx + len('</div>\n                    '):]

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'w') as f:
    f.write(content)
