import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# 1. Main Container: Remove md:flex-row to make it flex-col (top main, bottom footer)
content = content.replace(
    'className="relative w-full max-w-[760px] h-[90vh] sm:h-[650px] flex flex-col md:flex-row rounded-2xl overflow-hidden z-10 bg-[#0F1423] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5"',
    'className="relative w-full max-w-[760px] h-[90vh] sm:h-[650px] flex flex-col rounded-2xl overflow-hidden z-10 bg-[#0F1423] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5"'
)

# 2. Replace the Right Panel with the Bottom Footer
old_panel_pattern = re.compile(r'\{\/\*\s*═══ RIGHT PANEL.*?\/\*\s*═══ RIGHT PANEL \(Clean Info\) ═══ \*\/\s*<div className="hidden lg:flex flex-col h-full w-\[230px\].*?</div>\s*</div>\s*</div>', re.DOTALL)

# Let's use a simpler replacement strategy since regex across many lines can be brittle.
# I will find the exact start of the right panel and replace everything until the end of the file (before the last closing tags).

# The right panel starts at: {/* ═══ RIGHT PANEL (Clean Info) ═══ */}
# Let's just find that string and replace from there to the end.
