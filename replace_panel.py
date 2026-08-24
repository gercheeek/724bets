import re

with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Make modal flex-col only
content = content.replace('flex flex-col md:flex-row rounded-2xl', 'flex flex-col rounded-2xl')

# Let's find the Right Panel section and replace it.
# It starts with {/* ═══ RIGHT PANEL
start_idx = content.find('{/* ═══ RIGHT PANEL')
if start_idx != -1:
    # Find the end of the modal div (the second to last </div> in the component)
    # The structure is:
    # </div> (end of left panel)
    # </div> (end of left panel wrapper? Wait, let's look at the structure)
    pass

