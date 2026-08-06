import os
import glob

files = glob.glob('components/*.tsx') + ['App.tsx', 'index.css']

# We want to replace backgrounds:
# bg-[#050505] -> bg-[#0A0C10]
# bg-[#06080C] -> bg-[#0A0C10] 
# bg-[#0a0d14] -> bg-[#0A0C10]
# bg-[#0A0D14] -> bg-[#0A0C10]
# bg-[#1b2230] -> bg-[#0A0C10]
# bg-[#111111] -> bg-[#0A0C10]
# bg-[#1b2230] -> bg-[#0A0C10]
# bg-black -> bg-[#0A0C10] (but maybe keep bg-black/50, so use regex)

import re

for filepath in files:
    if not os.path.isfile(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Backgrounds
    content = re.sub(r'bg-\[#(050505|06080C|0a0d14|0A0D14|1b2230|111111)\]', 'bg-[#0A0C10]', content)
    # Be careful with bg-black, only replace if it's exactly bg-black (not bg-black/50)
    content = re.sub(r'\bbg-black\b(?!\/)', 'bg-[#0A0C10]', content)
    
    # Also we need to strip gold/green
    # text-emerald-500, text-emerald-400 -> text-[#00E5FF]
    # text-[#FFD700], text-yellow-400, text-amber-400 -> text-white
    # bg-emerald-500, bg-[#00E676] -> bg-[#00E5FF]
    
    content = re.sub(r'text-emerald-(400|500)', 'text-[#00E5FF]', content)
    content = re.sub(r'bg-emerald-(400|500)', 'bg-[#00E5FF]', content)
    content = re.sub(r'text-\[#00E676\]', 'text-[#00E5FF]', content)
    content = re.sub(r'bg-\[#00E676\]', 'bg-[#00E5FF]', content)
    
    content = re.sub(r'text-yellow-(400|500)', 'text-zinc-300', content)
    content = re.sub(r'text-amber-(400|500)', 'text-zinc-300', content)
    content = re.sub(r'text-\[#FFD700\]', 'text-white', content)
    
    with open(filepath, 'w') as f:
        f.write(content)
print("Updated colors.")
