import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Shrink Modal Width to prevent stretching (760px -> 560px)
# This instantly solves the "fat/stretched cards" issue.
content = content.replace('max-w-[760px]', 'max-w-[600px]')

# 2. Fix Left Panel h-full pushing the footer away
content = content.replace(
    'className="flex-1 h-full p-4 sm:p-5 flex flex-col relative z-10"',
    'className="flex-1 min-h-0 p-4 sm:p-5 flex flex-col relative z-10"'
)

# 3. Fix the Close (X) button overlap
# Find the absolute button and remove it
button_pattern = r'<button onClick=\{onClose\} className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors z-50 p-1\.5 rounded-md hover:bg-white/5">\s*<X className="w-5 h-5" strokeWidth=\{2\.5\} />\s*</button>'
content = re.sub(button_pattern, '', content)

# Inject the Close button safely into the header flexbox
header_pattern = r'(<div className="flex items-center gap-4">\s*<div className="text-right">.*?</div>\s*</div>)'
new_header = r'\1\n              <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10 shrink-0">\n                <X className="w-5 h-5" strokeWidth={2.5} />\n              </button>'
content = re.sub(header_pattern, new_header, content, flags=re.DOTALL)

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
