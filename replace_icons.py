import re

with open('components/Sidebar.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
content = content.replace("from 'lucide-react';", ", Flame, LayoutDashboard, Gamepad2, Zap, Diamond } from 'lucide-react';")

# 2. Anasayfa (Active state handling)
content = re.sub(
    r'<Crown className={`w-5 h-5 mr-3 \${activeView === \'home\' \? \'text-emerald-400\' : \'\'}`} />',
    r'<div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner transition-colors ${activeView === \'home\' ? \'bg-emerald-500/20 border border-emerald-500/30\' : \'bg-[#131313] border border-white/5 group-hover:bg-[#1a1a1a]\'}`}><LayoutDashboard className={`w-4 h-4 ${activeView === \'home\' ? \'text-emerald-400\' : \'text-zinc-400\'}`} /></div>',
    content
)

# 3. Sık Kullanılanlar
content = re.sub(
    r'<Star className="w-5 h-5 text-amber-400 mr-3" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-[#1a1a1a] transition-colors"><Star className="w-4 h-4 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" /></div>',
    content
)

# 4. Bahislerim
content = re.sub(
    r'<Copy className="w-5 h-5 text-\[\#818cf8\] mr-3" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-[#1a1a1a] transition-colors"><Ticket className="w-4 h-4 text-[#818cf8] drop-shadow-[0_0_5px_rgba(129,140,248,0.5)]" /></div>',
    content
)

# 5. Casino Header
content = re.sub(
    r'<Cherry className="w-5 h-5 text-zinc-400" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner bg-[#131313] border border-white/5 group-hover:bg-rose-500/10 group-hover:border-rose-500/30 transition-colors"><Cherry className="w-4 h-4 text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]" /></div>',
    content
)

# 6. Originals Header
content = re.sub(
    r'<Target className="w-5 h-5 text-zinc-400" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner bg-[#131313] border border-white/5 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors"><Zap className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" /></div>',
    content
)

# 7. Ödüller
content = re.sub(
    r'<Gift className="w-5 h-5 text-\[\#0ea5e9\] mr-3" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-[#1a1a1a] transition-colors"><Gift className="w-4 h-4 text-[#0ea5e9] drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]" /></div>',
    content
)

# 8. VIP Kulübü
content = re.sub(
    r'<Crown className="w-5 h-5 text-amber-500 mr-3" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-colors"><Diamond className="w-4 h-4 text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" /></div>',
    content
)

# 9. Canlı Destek
content = re.sub(
    r'<Headphones className="w-5 h-5 text-emerald-400 mr-3" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors"><Headphones className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" /></div>',
    content
)

# 10. Kurallar
content = re.sub(
    r'<FileText className="w-5 h-5 text-zinc-400 mr-3" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-[#1a1a1a] transition-colors"><FileText className="w-4 h-4 text-zinc-400" /></div>',
    content
)

# 11. Dil
content = re.sub(
    r'<Globe className="w-5 h-5 text-zinc-400 mr-3" />',
    r'<div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shadow-inner bg-[#131313] border border-white/5 group-hover:bg-[#1a1a1a] transition-colors"><Globe className="w-4 h-4 text-zinc-400" /></div>',
    content
)

# Now for the collapsed state icons!
content = content.replace(
    '''<button onClick={() => onViewChange('home')} className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeView === 'home' ? 'bg-[#181c2b] text-[#10b981]' : 'text-[#94a3b8] hover:text-[#10b981] hover:bg-white/5'}`}>
                <Crown className="w-5 h-5" />''',
    '''<button onClick={() => onViewChange('home')} className={`group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all ${activeView === 'home' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-[#131313] border border-white/5 text-zinc-400 hover:bg-[#1a1a1a] hover:text-white shadow-inner'}`}>
                <LayoutDashboard className="w-5 h-5" />'''
)

content = content.replace(
    '''<button onClick={() => {onToggle(); setIsCasinoOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#10b981] hover:bg-white/5 transition-colors">
                <Cherry className="w-5 h-5" />''',
    '''<button onClick={() => {onToggle(); setIsCasinoOpen(true);}} className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-[#94a3b8] hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 border border-white/5 bg-[#131313] shadow-inner transition-all">
                <Cherry className="w-5 h-5 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]" />'''
)

content = content.replace(
    '''<button onClick={() => {onToggle(); setIsOriginalsOpen(true);}} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#10b981] hover:bg-white/5 transition-colors">
                <Target className="w-5 h-5" />''',
    '''<button onClick={() => {onToggle(); setIsOriginalsOpen(true);}} className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-[#94a3b8] hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-white/5 bg-[#131313] shadow-inner transition-all">
                <Zap className="w-5 h-5 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />'''
)

content = content.replace(
    '''<button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-10 h-10 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#10b981] hover:bg-white/5 transition-colors">
                <Headphones className="w-5 h-5 text-emerald-400" />''',
    '''<button onClick={() => window.dispatchEvent(new Event('openSupportChat'))} className="group relative w-11 h-11 rounded-xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/5 bg-[#131313] shadow-inner transition-all">
                <Headphones className="w-5 h-5 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />'''
)


with open('components/Sidebar.tsx', 'w') as f:
    f.write(content)

print("Done")
