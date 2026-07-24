const fs = require('fs');

function implementDualPanel() {
  const sporViewFile = 'components/Spor724View.tsx';
  let sporContent = fs.readFileSync(sporViewFile, 'utf8');

  // 1. Wrap the main content area in a flex row and inject DualRightPanel
  // Replace: <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-[#101114]">
  // With: <div className="flex-1 flex flex-row overflow-hidden relative z-10 bg-[#101114]"><div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-[#101114]">
  
  sporContent = sporContent.replace(
    /<div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-\[#101114\]">/,
    '<div className="flex-1 flex flex-row overflow-hidden relative z-10 bg-[#101114]">\n      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-[#101114]">'
  );

  // Close the new wrapper before the fixed bottom button.
  // Replace:
  //       </div>
  // 
  //       {/* ═══════════ SMART FLOATING ACTION BUTTON ═══════════ */}
  //       <div className="fixed bottom-4 right-4 z-50">
  //           <SporxBetSlip />
  //       </div>
  // With:
  //       </div>
  //       <DualRightPanel popularMatches={filteredMatches.slice(0,5)} language={language} isOpenMobile={isSidebarOpenMobile} onCloseMobile={() => setIsSidebarOpenMobile(false)} />
  //       </div>
  
  sporContent = sporContent.replace(
    /<\/div>\n\n\s*\{\/\* ═══════════ SMART FLOATING ACTION BUTTON ═══════════ \*\/\}\n\s*<div className="fixed bottom-4 right-4 z-50">\n\s*<SporxBetSlip \/>\n\s*<\/div>/,
    '</div>\n      <DualRightPanel popularMatches={filteredMatches.slice(0,5)} language={language} isOpenMobile={isSidebarOpenMobile} onCloseMobile={() => setIsSidebarOpenMobile(false)} />\n      </div>'
  );

  fs.writeFileSync(sporViewFile, sporContent);
  
  
  // 2. Upgrade DualRightPanel.tsx styling
  const dualPanelFile = 'components/sports/DualRightPanel.tsx';
  let dualContent = fs.readFileSync(dualPanelFile, 'utf8');
  
  // Change background colors to match the glassmorphism premium theme
  // bg-[#000000] -> bg-black/40 backdrop-blur-3xl
  dualContent = dualContent.replace(/bg-\[#000000\]/g, 'bg-black/60 backdrop-blur-3xl');
  dualContent = dualContent.replace(/bg-\[#050505\]/g, 'bg-[#151619]');
  
  // Upgrade the sticky bottom toggle bar to be extremely glossy
  dualContent = dualContent.replace(
    /<div className="shrink-0 bg-black\/60 backdrop-blur-3xl border-t border-white\/\[0\.02\] text-white flex items-center justify-between px-4 h-\[56px\] relative z-50 cursor-pointer shadow-lg">/g,
    '<div className="shrink-0 bg-gradient-to-r from-[#10b981]/10 to-transparent backdrop-blur-3xl border-t border-t-white/10 text-white flex items-center justify-between px-4 h-[64px] relative z-50 cursor-pointer shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">'
  );

  // Enhance the Bet Button
  dualContent = dualContent.replace(
    /className="w-full bg-emerald-500\/10 hover:bg-emerald-500\/20 text-emerald-400 hover:text-emerald-300 font-black py-4 rounded-xl transition-all duration-300 active:scale-\[0\.98\] text-\[13px\] uppercase tracking-\[0\.2em\] border border-emerald-500\/40"/g,
    'className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-black font-black py-4 rounded-xl transition-all duration-300 active:scale-[0.98] text-[13px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.3)]"'
  );

  fs.writeFileSync(dualPanelFile, dualContent);
}

implementDualPanel();
console.log("Dual Right Panel injected and styled");
