import re

filename = 'components/LiveWinsMarquee.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add framer-motion import
if "import { motion } from 'framer-motion';" not in content:
    content = content.replace("import React, { useMemo } from 'react';", "import React, { useMemo } from 'react';\nimport { motion } from 'framer-motion';")

# Replace the marquee track div with motion.div
old_div = '<div className="flex flex-row w-max hover:[animation-play-state:paused]" style={{ animation: \'marquee 250s linear infinite\' }}>'
new_div = """<motion.div 
                className="flex flex-row w-max"
                animate={{ x: [0, -22500] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 250 }}
                whileHover={{ animationPlayState: 'paused' }}
            >"""

# Wait, the width depends on the items. 250 items * 90px ~ 22500px. 
# A safer way is to animate to "-50%" x coordinate using framer-motion.
new_div = """<motion.div 
                className="flex flex-row w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 120 }}
                whileHover={{ animationPlayState: 'paused' }}
            >"""

content = content.replace(old_div, new_div)
content = content.replace('</div>\n        </div>', '</motion.div>\n        </div>')

with open(filename, 'w') as f:
    f.write(content)
print("Updated to framer-motion")
