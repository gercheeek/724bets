const fs = require('fs');

// 1. Sidebar.tsx Update
let sidebar = fs.readFileSync('components/Sidebar.tsx', 'utf8');

// Replace live-sports with spor724
sidebar = sidebar.replace(/onViewChange\('live-sports'\)/g, "onViewChange('spor724')");

// Replace sports-bulletin with upcomingMatches
sidebar = sidebar.replace(/onViewChange\('sports-bulletin'\)/g, "onViewChange('upcomingMatches')");

// Replace tv724 with 724tv
sidebar = sidebar.replace(/onViewChange\('tv724'\)/g, "onViewChange('724tv')");

// Replace my-bets with event dispatch
sidebar = sidebar.replace(/onViewChange\('my-bets'\)/g, "(() => { if (userRole || window.localStorage.getItem('site_user')) window.dispatchEvent(new Event('openMyBetsModal')); else window.dispatchEvent(new Event('openAuthModal', { detail: 'login' })); })()");

fs.writeFileSync('components/Sidebar.tsx', sidebar);


// 2. CasinoLobby.tsx Update
let casino = fs.readFileSync('components/CasinoLobby.tsx', 'utf8');

if (!casino.includes('initialTab?: string;')) {
    casino = casino.replace(/interface CasinoLobbyProps \{/, "interface CasinoLobbyProps {\n  initialTab?: string;");
    casino = casino.replace(/const CasinoLobby: React\.FC<CasinoLobbyProps> = \(\{ customGames, isLoggedIn, onNavigate \} \)=> \{/, "const CasinoLobby: React.FC<CasinoLobbyProps> = ({ customGames, isLoggedIn, onNavigate, initialTab }) => {");
    casino = casino.replace(/const \[activeTab, setActiveTab\] = useState\('all'\);/, "const [activeTab, setActiveTab] = useState(initialTab || 'all');\n\n  useEffect(() => {\n    if (initialTab) {\n      setActiveTab(initialTab);\n    }\n  }, [initialTab]);");
    fs.writeFileSync('components/CasinoLobby.tsx', casino);
}

// 3. App.tsx Update
let app = fs.readFileSync('App.tsx', 'utf8');

if (!app.includes("window.addEventListener('openMyBetsModal'")) {
    app = app.replace(
        /const \[showMyBetsModal, setShowMyBetsModal\] = useState\(false\);/,
        "const [showMyBetsModal, setShowMyBetsModal] = useState(false);\n\n  useEffect(() => {\n    const handleOpenMyBets = () => setShowMyBetsModal(true);\n    window.addEventListener('openMyBetsModal', handleOpenMyBets);\n    return () => window.removeEventListener('openMyBetsModal', handleOpenMyBets);\n  }, []);"
    );
}

// Add views to the main-content class wrapper
app = app.replace(
    /view === 'blackjack' \|\| view === 'luckywheel'/g,
    "view === 'blackjack' || view === 'slots' || view === 'live-casino' || view === 'favorites' || view === '724tv' || view === 'luckywheel'"
);

// Map the views to CasinoLobby rendering
app = app.replace(
    /\{view === 'blackjack' && \(/,
    "{(view === 'blackjack' || view === 'slots' || view === 'live-casino' || view === 'favorites') && ("
);

app = app.replace(
    /<CasinoLobby \n              customGames=\{casinoLobbyGames\} \n              isLoggedIn=\{!!\(siteUser \|\| userRole\)\} \n              onNavigate=\{handleViewChange\} \n            \/>/g,
    `<CasinoLobby 
              customGames={casinoLobbyGames} 
              isLoggedIn={!!(siteUser || userRole)}
              onNavigate={handleViewChange}
              initialTab={view === 'slots' ? 'slots' : view === 'live-casino' ? 'live' : view === 'favorites' ? 'popular' : 'all'}
            />`
);


fs.writeFileSync('App.tsx', app);
console.log("Updated navigation logic.");
