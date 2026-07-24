import re

with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'r') as f:
    content = f.read()

old_orig = "<OriginalsHub onNavigate={handleViewChange} isLoggedIn={!!(siteUser || userRole)} />"
new_orig = "<OriginalsHub onNavigate={handleViewChange} isLoggedIn={!!(siteUser || userRole)} siteUser={siteUser} setSiteUser={setSiteUser} onAuthRequired={() => setAuthModalMode('member')} />"
content = content.replace(old_orig, new_orig)

with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'w') as f:
    f.write(content)
