const fs = require('fs');

let content = fs.readFileSync('components/ModernChat.tsx', 'utf8');

// 1. Update overall background color
content = content.replace(/bg-\[\#0b0e14\]/g, 'bg-[#141722]');

// 2. Update Header of Chat
const headerRegex = /\{\/\* Header \*\/\}\s*<div className="bg-\[\#141722\] px-4 h-\[64px\] text-white flex items-center justify-between flex-shrink-0 relative z-30">[\s\S]*?<\/div>\s*<\/div>/;

const newHeader = `{/* Header */}
            <div className="bg-[#141722] px-4 h-[60px] text-white flex items-center justify-between flex-shrink-0 relative z-30 border-b border-white/5">
                <div className="flex items-center gap-3 relative">
                    <div 
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="flex items-center gap-2 bg-[#1f2330] px-3 py-1.5 rounded-md text-[13px] font-semibold hover:bg-[#2a2f40] cursor-pointer transition-all relative z-20 text-gray-300"
                    >
                        <img src={\`https://flagcdn.com/w20/\${activeLang.flag}.png\`} alt={activeLang.code} className="w-4 h-3 rounded-sm object-cover" />
                        <span>{activeLang.name}</span>
                        <ChevronDown className="w-3 h-3 text-gray-500 ml-1" />
                    </div>

                    {/* Language Dropdown */}
                    {showLangMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                            <div className="absolute top-full mt-2 left-0 w-40 bg-[#1f2330] rounded-lg shadow-xl z-20 py-1 overflow-hidden border border-white/5">
                                {LANGUAGES.map(lang => (
                                    <div 
                                        key={lang.id}
                                        onClick={() => { setActiveLang(lang); setShowLangMenu(false); }}
                                        className={\`flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors \${activeLang.id === lang.id ? 'bg-[#2a2f40] text-white' : 'text-gray-400 hover:bg-[#2a2f40] hover:text-white'}\`}
                                    >
                                        <img src={\`https://flagcdn.com/w20/\${lang.flag}.png\`} alt={lang.code} className="w-5 h-3.5 rounded-sm object-cover" />
                                        <span>{lang.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                    <div className="flex items-center gap-1.5 text-[13px] font-medium">
                       <Users className="w-4 h-4" />
                       <span>2,463</span>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="w-7 h-7 flex items-center justify-center bg-[#1f2330] hover:bg-[#2a2f40] transition-all rounded-full text-gray-400 hover:text-white ml-2"
                        title="Kapat"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>`;

if(content.match(headerRegex)) {
   content = content.replace(headerRegex, newHeader);
} else {
   // Fallback regex if it didn't match perfectly
   const fallbackRegex = /\{\/\* Header \*\/\}.*?(?=\{\/\* Messages Area \*\*\/|\{\/\* Messages Area \*\/)/s;
   content = content.replace(fallbackRegex, newHeader + '\n\n            ');
}

// 3. Update Message style
// We'll replace the normal user message rendering block.
const userMsgRegex = /return \(\s*<div key=\{msg\.id \|\| i\} className="mb-2 mx-2 p-3 rounded-xl bg-\[\#111111\] hover:bg-\[\#161616\].*?<\/div>\s*\);\s*\}/s;

const newUserMsg = `return (
                                <div key={msg.id || i} className="mb-2 mx-3 p-3 rounded-lg bg-[#1f2330] hover:bg-[#262b3a] transition-colors flex items-start gap-3 relative shadow-sm group">
                                     {msg.avatar ? (
                                        <img src={msg.avatar} alt="avatar" className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                                     ) : (
                                        <div className="w-8 h-8 rounded-md bg-[#2a2f40] flex items-center justify-center flex-shrink-0 text-gray-400">
                                           <User className="w-4 h-4" />
                                        </div>
                                     )}
                                     
                                     <div className="flex-1 min-w-0">
                                         <div className="flex items-center gap-2 mb-1 flex-wrap">
                                             <div className="flex items-center gap-1.5">
                                                 {msg.role === 'admin' ? (
                                                    <Crown className="w-3.5 h-3.5 text-yellow-500" />
                                                 ) : msg.role === 'moderator' ? (
                                                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                                                 ) : msg.role === 'vip' ? (
                                                    <Star className="w-3.5 h-3.5 text-purple-400" />
                                                 ) : (
                                                    <div className="w-3.5 h-3.5 flex items-center justify-center bg-gray-600 rounded-[3px] text-[8px] font-bold text-white">1</div>
                                                 )}
                                                 <span className={\`font-bold text-[13px] \${msg.role === 'admin' ? 'text-yellow-500' : msg.role === 'moderator' ? 'text-blue-400' : 'text-gray-300'}\`}>
                                                     {maskUsername(msg.username)}
                                                 </span>
                                             </div>
                                             <span className="text-[10px] text-gray-500 font-medium">
                                                 {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                             </span>
                                         </div>
                                         <p className="text-[#cbd5e1] text-[13px] leading-snug break-words">
                                             {msg.message}
                                         </p>
                                     </div>
                                </div>
                            );
                        }`;

content = content.replace(/return \(\s*<div key=\{msg\.id \|\| i\} className="mb-2 mx-2 p-3 rounded-xl bg-\[\#111111\].*?<\/div>\s*\);\s*\}/s, newUserMsg);

// 4. Update Input Area
const inputRegex = /\{\/\* Input Area \*\/\}.*?(?=<\/div>\s*<\/div>\s*\)\s*;\s*\})/s;

const newInput = `{/* Input Area */}
            <div className="p-3 bg-[#141722] border-t border-white/5 relative z-20">
                <div className="flex items-center bg-[#1f2330] rounded-md p-1 pl-3 shadow-inner border border-white/5">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={siteUser || userRole ? "Sohbete yaz..." : "Login to chat..."}
                        disabled={!siteUser && !userRole}
                        className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500 py-2 h-10"
                    />
                    <div className="flex items-center gap-1 pr-1">
                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || (!siteUser && !userRole)}
                            className="w-10 h-8 flex items-center justify-center bg-[#00E701] hover:bg-[#00c701] text-black rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>`;

content = content.replace(inputRegex, newInput + '\n        ');

fs.writeFileSync('components/ModernChat.tsx', content);

// 5. Update App.tsx to ensure chat doesn't overlap header
let appContent = fs.readFileSync('App.tsx', 'utf8');
appContent = appContent.replace(
  /<aside className=\{\`hidden xl:flex flex-col border-l border-white\/\[0\.02\] bg-\[\#000000\] h-full flex-shrink-0 relative z-20/g,
  '<aside className={`hidden xl:flex flex-col border-l border-white/[0.05] bg-[#141722] h-full flex-shrink-0 relative z-20 pt-[72px]'
);
fs.writeFileSync('App.tsx', appContent);

console.log('Chat styling applied.');
