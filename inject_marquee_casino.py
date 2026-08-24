import re

filename = 'components/CasinoLobby.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add import
import_stmt = "import LiveWinsMarquee from './LiveWinsMarquee';\n"
if "import LiveWinsMarquee" not in content:
    content = content.replace("import { GamePlayView } from './GamePlayView';", f"import {{ GamePlayView }} from './GamePlayView';\n{import_stmt}")

# Inject into CasinoLobby
target = "          <div className=\"flex flex-col md:flex-row gap-4 mb-4 md:mb-8 mt-2 md:mt-6\">"
replacement = "          <div className=\"w-full mb-6 mt-2 md:mt-4 rounded-xl md:rounded-2xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]\">\n            <LiveWinsMarquee />\n          </div>\n" + target
if "<LiveWinsMarquee />" not in content:
    content = content.replace(target, replacement)

with open(filename, 'w') as f:
    f.write(content)
print("Injected into CasinoLobby")
