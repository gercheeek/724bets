import re

filename = 'App.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Determine the theme based on the view
theme_logic = """  const [view, setView] = useState<'home' | 'social' | 'sports' | 'sports2' | 'sports3' | 'sports4' | 'sports5' | 'admin' | 'login' | 'brands' | 'analysis' | 'blackjack' | 'blackjack-pro' | 'casino2' | 'loyalty' | 'raffle' | 'cekilis' | 'pool' | 'wheel' | 'luckywheel' | 'giveaway' | 'coupons' | '724tv' | 'trusted-sites' | 'trusted-detail' | 'demo' | 'kral' | 'promo' | 'referral' | 'profile' | 'slotra' | 'slotra2' | 'mobile-bulletin' | 'spor724' | 'tahminler' | 'tahmin-detay' | 'plinko' | 'limbo' | 'chicken-run' | 'dice' | 'mines' | 'keno' | 'war' | 'hilo' | 'roulette' | 'crash-turbo' | 'turbo-mines' | 'hacksaw' | 'redtiger' | 'upcomingMatches' | 'rewards' | 'xslot' | 'xlot' | 'bulten'>(initialView);

  const getThemeClass = (currentView: string) => {
    if (['spor724', 'sports', 'gercek', 'upcomingMatches', 'bulten'].includes(currentView)) return 'theme-sports';
    if (['tahminler', 'tahmin-detay'].includes(currentView)) return 'theme-predictions';
    return 'theme-casino';
  };
  const activeTheme = getThemeClass(view);
"""

content = content.replace("  const [view, setView] = useState", theme_logic.replace("  const [view, setView] = useState", "  const [view, setView] = useState", 1))

# Add the activeTheme class to the main wrapper
content = content.replace('className="app-container"', 'className={`app-container ${activeTheme}`}')
content = content.replace('className={`app-container ${appStage}`}', 'className={`app-container ${appStage} ${activeTheme}`}')

with open(filename, 'w') as f:
    f.write(content)
print("Updated App.tsx with theme classes")
