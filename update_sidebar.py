import re

filename = 'components/Sidebar.tsx'
with open(filename, 'r') as f:
    content = f.read()

# Separate predictions
content = content.replace(
    "const isSportsView = ['sports', 'spor724', 'gercek', 'upcomingMatches', 'bulten', 'tahminler'].includes(activeView);",
    "const isSportsView = ['sports', 'spor724', 'gercek', 'upcomingMatches', 'bulten'].includes(activeView);\n  const isPredictionsView = ['tahminler', 'social-betting'].includes(activeView);"
)

# Replace the toggle bar buttons
old_buttons = """          <button 
            onClick={() => { onViewChange('casino'); if (window.innerWidth < 1024) onToggle?.(); }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[14px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer pointer-events-auto z-[99999] ${isCasinoView ? 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 border-none text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'text-[#8b92a5] hover:text-white border-none'}`}
          >
            Casino
          </button>
          <button 
            onClick={() => { 
                window.dispatchEvent(new CustomEvent('reset-sports-view'));
                onViewChange('spor724'); 
                if (window.innerWidth < 1024) onToggle?.(); 
            }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[14px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer pointer-events-auto z-[99999] ${isSportsView ? 'bg-gradient-to-r from-[color:var(--theme-accent)]/15 to-[color:var(--theme-accent)]/5 border-none text-[color:var(--theme-accent)] shadow-[0_0_15px_rgba(0,229,255,0.15)]' : 'text-[#8b92a5] hover:text-white border-none'}`}
          >
            Spor
          </button>"""

new_buttons = """          <button 
            onClick={() => { onViewChange('casino'); if (window.innerWidth < 1024) onToggle?.(); }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[12px] md:text-[14px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer pointer-events-auto z-[99999] ${isCasinoView ? 'bg-gradient-to-r from-purple-500/15 to-pink-500/15 border-none text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'text-[#8b92a5] hover:text-white border-none'}`}
          >
            Casino
          </button>
          <button 
            onClick={() => { 
                window.dispatchEvent(new CustomEvent('reset-sports-view'));
                onViewChange('spor724'); 
                if (window.innerWidth < 1024) onToggle?.(); 
            }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[12px] md:text-[14px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer pointer-events-auto z-[99999] ${isSportsView ? 'bg-gradient-to-r from-[#10B981]/15 to-[#10B981]/5 border-none text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'text-[#8b92a5] hover:text-white border-none'}`}
          >
            Spor
          </button>
          <button 
            onClick={() => { 
                onViewChange('social-betting'); 
                if (window.innerWidth < 1024) onToggle?.(); 
            }}
            className={`flex-1 flex items-center justify-center h-full rounded-lg font-bold text-[12px] md:text-[14px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer pointer-events-auto z-[99999] ${isPredictionsView ? 'bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border-none text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)]' : 'text-[#8b92a5] hover:text-white border-none'}`}
          >
            Tahmin
          </button>"""

content = content.replace(old_buttons, new_buttons)

# Also conditionally render the content based on the new views
# Replace:
# {isSportsView ? (
#   <SportsSidebarContent isOpen={isOpen} onViewChange={onViewChange} onToggle={onToggle} />
# ) : (
old_content_render = """        {isSportsView ? (
          <SportsSidebarContent isOpen={isOpen} onViewChange={onViewChange} onToggle={onToggle} />
        ) : (
          <nav className="flex flex-col w-full relative z-[99999] pointer-events-auto">
            {menuItems.map(item => renderLink(item))}
          </nav>
        )}"""

new_content_render = """        {isSportsView ? (
          <SportsSidebarContent isOpen={isOpen} onViewChange={onViewChange} onToggle={onToggle} />
        ) : isPredictionsView ? (
          <nav className="flex flex-col w-full relative z-[99999] pointer-events-auto">
            {[{ id: 'social-betting', label: 'Liderlik Tablosu', icon: Target, route: 'social-betting' }, { id: 'vip-tips', label: 'VIP Tahminler', icon: Diamond, route: 'vip-tips' }].map(item => renderLink(item))}
          </nav>
        ) : (
          <nav className="flex flex-col w-full relative z-[99999] pointer-events-auto">
            {menuItems.map(item => renderLink(item))}
          </nav>
        )}"""

content = content.replace(old_content_render, new_content_render)

with open(filename, 'w') as f:
    f.write(content)
print(f"Updated {filename}")
