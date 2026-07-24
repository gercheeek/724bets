import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/VIPRafflePromo.tsx', 'r') as f:
    content = f.read()

# Replace the wrapper div class
content = content.replace(
    '{/* 3-COLUMN CONTENT SECTION */}\n        <div className="w-full max-w-[1400px] mx-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 py-12 px-6 md:px-12">',
    '{/* VERTICAL CONTENT SECTION */}\n        <div className="w-full max-w-[1200px] mx-auto flex-1 flex flex-col gap-16 py-16 px-6 md:px-8">'
)

# Extract blocks
def extract_block(start_marker, next_marker):
    start_idx = content.find(start_marker)
    end_idx = content.find(next_marker)
    if start_idx == -1 or end_idx == -1:
        print(f"Error finding blocks: {start_marker[:20]}")
        return ""
    return content[start_idx:end_idx]

left_col = extract_block('{/* LEFT COLUMN: Your Status', '{/* MIDDLE COLUMN: Prizes')
middle_col = extract_block('{/* MIDDLE COLUMN: Prizes', '{/* RIGHT COLUMN: Live Leaderboard')
right_col = extract_block('{/* RIGHT COLUMN: Live Leaderboard', '        </div>\n\n        {/* BOTTOM ACTION BAR')

if left_col and middle_col and right_col:
    # Remove old blocks
    content = content.replace(left_col, '')
    content = content.replace(middle_col, '')
    content = content.replace(right_col, '')
    
    # Insert new blocks in order: Middle, Left, Right
    insert_marker = '{/* VERTICAL CONTENT SECTION */}\n        <div className="w-full max-w-[1200px] mx-auto flex-1 flex flex-col gap-16 py-16 px-6 md:px-8">\n          \n'
    insert_idx = content.find(insert_marker) + len(insert_marker)
    
    new_content = content[:insert_idx] + middle_col + left_col + right_col + content[insert_idx:]
    
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/VIPRafflePromo.tsx', 'w') as f:
        f.write(new_content)
    print("Successfully reordered columns!")
else:
    print("Failed to extract all columns.")

