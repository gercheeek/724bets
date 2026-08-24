with open('components/WalletModal.tsx', 'r') as f:
    content = f.read()

# Replace the three divs with two divs
content = content.replace('</div>\n              </div>\n              </div>\n            )}', '</div>\n              </div>\n            )}')

with open('components/WalletModal.tsx', 'w') as f:
    f.write(content)
