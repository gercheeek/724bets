import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
    content = f.read()

# The current header looks like this:
"""
            {/* Header */}
            <div className="bg-[#0a0e17] px-4 h-[64px] text-white flex items-center justify-between flex-shrink-0 border-b border-[#1b2335]">
                <div className="flex items-center gap-3 relative">
                    <div 
                        onClick={() => setShowLangMenu(!showLangMenu)}
...
                    {/* Language Dropdown */}
                    {showLangMenu && (
...
                    )}
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
"""

start_str = '<div className="flex items-center gap-3 relative">'
end_str = '</div>\n                <div className="flex items-center gap-4 text-zinc-500">'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    # Remove the entire left side (language selector)
    # Actually, we can just leave it empty or remove it.
    new_header = '<div></div>\n                <div className="flex items-center gap-4 text-zinc-500">'
    content = content[:start_idx] + new_header + content[end_idx + len(end_str) - len('<div className="flex items-center gap-4 text-zinc-500">'):]
    
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'w') as f:
        f.write(content)
    print("Successfully removed language selector.")
else:
    print("Could not find the target block.")
