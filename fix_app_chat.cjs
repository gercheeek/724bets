const fs = require('fs');

let appContent = fs.readFileSync('App.tsx', 'utf8');

if (!appContent.includes("import { DualRightPanel }")) {
  appContent = appContent.replace(
    "import ModernChat from './components/ModernChat';",
    "import ModernChat from './components/ModernChat';\nimport { DualRightPanel } from './components/sports/DualRightPanel';"
  );
}

// Replace the <ModernChat ... /> block inside the <aside> with a conditional render
appContent = appContent.replace(
  /<ModernChat\s+open=\{isChatOpen\}\s+onOpen=\{\(\) => setIsChatOpen\(true\)\}\s+onClose=\{\(\) => setIsChatOpen\(false\)\}\s+siteUser=\{siteUser\}\s+userRole=\{userRole\}\s+isMobile=\{false\}\s+activeView=\{view\}\s+\/>/,
  `{view === 'sports' ? (
                    <DualRightPanel 
                      popularMatches={[]} 
                      language={language} 
                      isOpenMobile={false} 
                      onCloseMobile={() => setIsChatOpen(false)} 
                    />
                  ) : (
                    <ModernChat
                      open={isChatOpen}
                      onOpen={() => setIsChatOpen(true)}
                      onClose={() => setIsChatOpen(false)}
                      siteUser={siteUser}
                      userRole={userRole}
                      isMobile={false}
                      activeView={view}
                    />
                  )}`
);

fs.writeFileSync('App.tsx', appContent);

// Remove DualRightPanel from Spor724View.tsx because it's now handled globally in App.tsx!
let sporContent = fs.readFileSync('components/Spor724View.tsx', 'utf8');
sporContent = sporContent.replace(
  /<\/div>\s*<DualRightPanel popularMatches=\{filteredMatches\.slice\(0,5\)\} language=\{language\} isOpenMobile=\{isSidebarOpenMobile\} onCloseMobile=\{\(\) => setIsSidebarOpenMobile\(false\)\} \/>\s*<\/div>/,
  '</div>\n      </div>'
);
fs.writeFileSync('components/Spor724View.tsx', sporContent);

console.log("App.tsx global sidebar updated!");
