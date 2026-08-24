import re

filename = 'components/GuestLanding.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Add import
import_stmt = "import LiveWinsMarquee from './LiveWinsMarquee';\n"
if "import LiveWinsMarquee" not in content:
    content = content.replace("import HeroWelcomeBanner from './HeroWelcomeBanner';", f"import HeroWelcomeBanner from './HeroWelcomeBanner';\n{import_stmt}")

# Inject below HeroWelcomeBanner
target = "<HeroWelcomeBanner onRegisterClick={onMemberRegisterClick} />"
replacement = "<HeroWelcomeBanner onRegisterClick={onMemberRegisterClick} />\n            <div className=\"mt-1 mb-1 rounded-2xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]\">\n                <LiveWinsMarquee />\n            </div>"
if "<LiveWinsMarquee />" not in content:
    content = content.replace(target, replacement)

with open(filename, 'w') as f:
    f.write(content)
print("Injected into GuestLanding")
