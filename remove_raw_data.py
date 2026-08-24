import re

files_to_check = ['components/CasinoLobby.tsx', 'components/CasinoSidebarContent.tsx']

for filename in files_to_check:
    with open(filename, 'r') as f:
        content = f.read()

    # Remove import
    content = content.replace("import rawCasinoData from '../data/slotra_casino.json';\n", "")

    # Remove LIVE_CASINO_GAMES block in CasinoLobby
    if 'CasinoLobby.tsx' in filename:
        block_pattern = r'const LIVE_CASINO_GAMES = rawCasinoData\.map\(\(game: any, index: number\) => \(\{\n\s+id: `live-slotra-\$\{index\}`,\n\s+name: game\.name\.replace\(\'Game thumb - \', \'\'\),\n\s+img: game\.image,\n\s+category: \'live\',\n\s+provider: \'Live Casino\'\n\}\)\);\n'
        content = re.sub(block_pattern, '', content)

    with open(filename, 'w') as f:
        f.write(content)

print("Removed rawCasinoData imports and unused blocks")
