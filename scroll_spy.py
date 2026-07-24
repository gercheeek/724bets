import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
    content = f.read()

# 1. Add import for motion if it doesn't exist
if 'import { motion }' not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { motion } from 'framer-motion';")

# 2. We need to wrap each of the 4 cards with motion.div.
# A card starts with: <div onClick={() => onViewChange(...)
# And ends before the next {/* ... */} or </div>

# The 4 cards have distinct IDs or comments:
# {/* Casino - Minimal Premium (#06b6d4) */}
# {/* Slot Oyunları - Minimal Premium (#d946ef) */}
# {/* Spor - Minimal Premium (#10b981) */}
# {/* 724Orijinal - Minimal Premium (#eab308) */}

# We can replace the start of each card
motion_wrapper_start = """
                <motion.div
                    initial={{ scale: 0.95, opacity: 0.3, filter: 'grayscale(50%) brightness(0.5)' }}
                    whileInView={{ scale: 1.05, opacity: 1, filter: 'grayscale(0%) brightness(1)' }}
                    viewport={{ amount: "some", margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full flex"
                >
"""

# Actually, it's safer to just replace the whole CATEGORY CARDS section, since I have the exact code in perfect_undo.py.
# But perfect_undo.py doesn't have the scaled down text! Let's fetch the current cards section.

# Let's extract the cards section using string manipulation to be safe
cards_start = content.find('{/* CATEGORY CARDS */}')
cards_end = content.find('{/* VIP SYSTEM BANNER */}', cards_start)

if cards_start != -1 and cards_end != -1:
    cards_section = content[cards_start:cards_end]
    
    # We will replace `<div onClick={() => onViewChange` with the motion wrapper + the div.
    # And we need to add `</motion.div>` at the end of each card.
    
    # Find all card starts
    parts = cards_section.split('<div onClick={() => onViewChange')
    
    new_cards_section = parts[0]
    for i in range(1, len(parts)):
        part = parts[i]
        # part is `('blackjack')} ... </div>\n                \n                {/* Slot Oyunları`
        # or it's the last one: `('originals')} ... </div>\n            </div>\n\n            `
        
        # We need to find the matching closing </div> of the card.
        # Since these are simple divs with no internal `<div onClick={() => onViewChange`, we just need to append </motion.div> right after the card's outermost closing div.
        # The card ends where the next `\n                {/*` begins, or `\n            </div>` for the last one.
        
        if '\n                {/* ' in part:
            end_of_card_idx = part.rfind('\n                {/* ')
        else:
            end_of_card_idx = part.rfind('\n            </div>')
            
        if end_of_card_idx != -1:
            modified_part = motion_wrapper_start + '                <div onClick={() => onViewChange' + part[:end_of_card_idx] + '\n                </motion.div>' + part[end_of_card_idx:]
            new_cards_section += modified_part
        else:
            # fallback
            new_cards_section += '<div onClick={() => onViewChange' + part
            
    content = content[:cards_start] + new_cards_section + content[cards_end:]

with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
    f.write(content)
