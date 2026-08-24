import re

filename = 'App.tsx'
with open(filename, 'r') as f:
    content = f.read()

# 1. Import
content = content.replace(
    "import PredictionsDashboard from './components/sports/PredictionsDashboard';",
    "import PredictionsDashboard from './components/sports/PredictionsDashboard';\nimport LeaderboardView from './components/LeaderboardView';"
)

# 2. View state
old_view = "const [view, setView] = useState<'home' | 'social' | 'sports' | 'sports2' | 'sports3' | 'sports4' | 'sports5' | 'admin' | 'login' | 'brands' | 'analysis' | 'blackjack' | 'blackjack-pro' | 'casino2' | 'loyalty' | 'raffle' | 'cekilis' | 'pool' | 'wheel' | 'luckywheel' | 'giveaway' | 'coupons' | '724tv' | 'trusted-sites' | 'trusted-detail' | 'demo' | 'kral' | 'promo' | 'referral' | 'profile' | 'slotra' | 'slotra2' | 'mobile-bulletin' | 'spor724' | 'tahminler' | 'tahmin-detay' | 'plinko' | 'limbo' | 'chicken-run' | 'dice' | 'mines' | 'keno' | 'war' | 'hilo' | 'roulette' | 'crash-turbo' | 'turbo-mines' | 'hacksaw' | 'redtiger' | 'upcomingMatches' | 'rewards' | 'xslot' | 'xlot' | 'bulten'>(initialView);"
new_view = "const [view, setView] = useState<'home' | 'social' | 'sports' | 'sports2' | 'sports3' | 'sports4' | 'sports5' | 'admin' | 'login' | 'brands' | 'analysis' | 'blackjack' | 'blackjack-pro' | 'casino2' | 'loyalty' | 'raffle' | 'cekilis' | 'pool' | 'wheel' | 'luckywheel' | 'giveaway' | 'coupons' | '724tv' | 'trusted-sites' | 'trusted-detail' | 'demo' | 'kral' | 'promo' | 'referral' | 'profile' | 'slotra' | 'slotra2' | 'mobile-bulletin' | 'spor724' | 'tahminler' | 'tahmin-detay' | 'plinko' | 'limbo' | 'chicken-run' | 'dice' | 'mines' | 'keno' | 'war' | 'hilo' | 'roulette' | 'crash-turbo' | 'turbo-mines' | 'hacksaw' | 'redtiger' | 'upcomingMatches' | 'rewards' | 'xslot' | 'xlot' | 'bulten' | 'liderlik'>(initialView);"
content = content.replace(old_view, new_view)

# 3. Add to sportsViews
content = content.replace(
    "const sportsViews = ['gercek', 'sports', 'spor724', 'slotra', 'spor', 'tahminler'];",
    "const sportsViews = ['gercek', 'sports', 'spor724', 'slotra', 'spor', 'tahminler', 'liderlik'];"
)

# 4. Add to arrays
content = content.replace(
    "['gercek', 'sports', 'spor724', 'slotra', 'spor', 'tahminler']",
    "['gercek', 'sports', 'spor724', 'slotra', 'spor', 'tahminler', 'liderlik']"
)

# 5. Add to orchestrator-content array
content = content.replace(
    "['bulten', 'spor724', 'tahminler', '724tv', 'slotra', 'slots', 'live-casino'].includes(view)",
    "['bulten', 'spor724', 'tahminler', 'liderlik', '724tv', 'slotra', 'slots', 'live-casino'].includes(view)"
)

# 6. Add render block
render_block = """        {view === 'tahminler' && (
          <div className="w-full h-full animate-fade-in">
            <PredictionsDashboard />
          </div>
        )}

        {view === 'liderlik' && (
          <div className="w-full h-full animate-fade-in">
            <LeaderboardView />
          </div>
        )}"""
content = content.replace(
    """        {view === 'tahminler' && (
          <div className="w-full h-full animate-fade-in">
            <PredictionsDashboard />
          </div>
        )}""",
    render_block
)

with open(filename, 'w') as f:
    f.write(content)

print("App.tsx fixed successfully")
