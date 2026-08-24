import re

filename = 'components/LiveWinsMarquee.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add imports
if "import LiveWinModal" not in content:
    content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport LiveWinModal from './LiveWinModal';\nimport { LiveWin } from '../utils/liveWinsData';")

# Add state
if "const [selectedWin, setSelectedWin]" not in content:
    content = content.replace("const wins = useMemo(() => generateLiveWins(250), []);", "const wins = useMemo(() => generateLiveWins(250), []);\n    const [selectedWin, setSelectedWin] = React.useState<LiveWin | null>(null);")

# Add onClick to card
content = content.replace(
    'className="flex-shrink-0 flex flex-col gap-2 w-[85px] mx-1 transition-transform hover:scale-105 cursor-pointer"',
    'className="flex-shrink-0 flex flex-col gap-2 w-[85px] mx-1 transition-transform hover:scale-105 cursor-pointer"\n                        onClick={() => setSelectedWin(win)}'
)

# Render modal
if "<LiveWinModal" not in content:
    content = content.replace(
        "        </div>\n    );",
        "        </div>\n            {selectedWin && <LiveWinModal win={selectedWin} onClose={() => setSelectedWin(null)} />}\n        </div>\n    );"
    )
    # The replacement above is slightly tricky, let's fix it by regex
    content = re.sub(r'(</motion\.div>\s*</div>\s*)\);', r'\1{selectedWin && <LiveWinModal win={selectedWin} onClose={() => setSelectedWin(null)} />}\n    );', content)

with open(filename, 'w') as f:
    f.write(content)
print("Connected modal")
