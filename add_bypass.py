import re

file_path = '/Users/alex/Desktop/7_24bets-landing-page/components/MaintenanceScreen.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Import useState
content = content.replace("import React from 'react';", "import React, { useState } from 'react';")

# 2. Add onBypass to Props
content = content.replace(
    "onAdminLogin?: () => void;",
    "onAdminLogin?: () => void;\n  onBypass?: () => void;"
)

# 3. Add onBypass to Component arguments
content = content.replace(
    "({ message, onAdminLogin }) => {",
    "({ message, onAdminLogin, onBypass }) => {\n  const [secretClicks, setSecretClicks] = useState(0);\n\n  const handleSecretClick = () => {\n    const newCount = secretClicks + 1;\n    if (newCount >= 3) {\n      const pwd = window.prompt('Giriş Şifresi:');\n      if (pwd === '373566' && onBypass) {\n        onBypass();\n      }\n      setSecretClicks(0);\n    } else {\n      setSecretClicks(newCount);\n    }\n  };"
)

# 4. Add onClick to the footer text
content = content.replace(
    '<p className="mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">',
    '<p onClick={handleSecretClick} className="mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest cursor-pointer select-none">'
)

with open(file_path, 'w') as f:
    f.write(content)
