import re

def remove_chat_header():
    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'r') as f:
        content = f.read()

    # The header starts with <div className="flex items-center justify-between p-4 border-b... and ends with </div> before <div className="flex-1 overflow-hidden relative">
    
    # Let's search for this exact block. Earlier I added dynamic styling to it:
    # <div className={`flex items-center justify-between p-4 border-b ${view === 'originals' ? ...
    # But wait, in the previous Gamdom/Retro change I updated this header!
    # The header code was:
    # <div className={`flex items-center justify-between p-4 border-b ${view === 'originals' ? 'border-[#880088] bg-[#0a0a1a]' : 'border-white/5 bg-black'} h-[70px] whitespace-nowrap`}>
    # ...
    # </div>
    
    target_pattern = r'<div className=\{`flex items-center justify-between p-4 border-b \$\{view === \'originals\' \?.*?</div>\s*<div className="flex-1 overflow-hidden relative">'
    
    # We will replace it with just: <div className="flex-1 overflow-hidden relative">
    content = re.sub(target_pattern, '<div className="flex-1 overflow-hidden relative">', content, flags=re.DOTALL)
    
    # Just in case the previous retro update didn't apply or something else changed, let's also try a generic one:
    generic_pattern = r'<div className="flex items-center justify-between p-4 border-b border-white/5 bg-black h-\[70px\] whitespace-nowrap">.*?</div>\s*<div className="flex-1 overflow-hidden relative">'
    content = re.sub(generic_pattern, '<div className="flex-1 overflow-hidden relative">', content, flags=re.DOTALL)

    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'w') as f:
        f.write(content)

remove_chat_header()
print("Chat header removed")
