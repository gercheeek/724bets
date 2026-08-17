import React, { useState } from 'react';

const RetroChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="w-full h-full pixel-border flex flex-col bg-[#050505]">
      {/* Header */}
      <div className="border-b-[4px] border-[color:var(--theme-accent)] pb-2 mb-2 flex items-center justify-between">
         <span className="retro-font-primary text-[color:var(--theme-accent)] text-[10px] retro-text-glow">TERMINAL_CHAT</span>
         <span className="retro-font-secondary text-[color:var(--theme-accent)] text-lg retro-text-glow">ONLINE</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto retro-scrollbar flex flex-col gap-1 pr-2 mb-2">
        {/* Normal Messages */}
        <div className="flex items-start">
            <span className="retro-font-secondary text-lg text-gray-500 mr-2 shrink-0">[10:45]</span>
            <span className="retro-font-secondary text-lg text-[#ff00ff] mr-2 shrink-0">[VIP] Player1:</span>
            <span className="retro-font-secondary text-xl text-[color:var(--theme-accent)] break-all">GL HF! Let's win this.</span>
        </div>
        
        <div className="flex items-start">
            <span className="retro-font-secondary text-lg text-gray-500 mr-2 shrink-0">[10:46]</span>
            <span className="retro-font-secondary text-lg text-[#ff8c00] mr-2 shrink-0">[ADMIN] System:</span>
            <span className="retro-font-secondary text-xl text-yellow-300 break-all">Welcome to the Arcade Zone.</span>
        </div>

        <div className="flex items-start">
            <span className="retro-font-secondary text-lg text-gray-500 mr-2 shrink-0">[10:47]</span>
            <span className="retro-font-secondary text-lg text-cyan-400 mr-2 shrink-0">[MEMBER] Player2:</span>
            <span className="retro-font-secondary text-xl text-[color:var(--theme-accent)] break-all">Spinning the wheel now!</span>
        </div>

        {/* Surprise Reward Drop */}
        <div className="my-4 border-[4px] border-[#ff00ff] bg-[#050505] p-4 relative text-center">
            <div className="retro-font-primary text-[#ff00ff] text-[10px] md:text-[11px] retro-text-glow-purple mb-3">
              &gt;&gt;&gt; SYSTEM ALERT &lt;&lt;&lt;
            </div>
            <div className="retro-font-secondary text-xl text-white mb-4">
              A MYSTERY REWARD HAS DROPPED!
            </div>
            <button className="pixel-border border-[#ff00ff] bg-transparent text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black retro-font-primary text-[10px] p-2 cursor-pointer transition-none animate-flash-bg">
              [ CLAIM REWARD ]
            </button>
        </div>
        
        <div className="flex items-start">
            <span className="retro-font-secondary text-lg text-gray-500 mr-2 shrink-0">[10:49]</span>
            <span className="retro-font-secondary text-lg text-[#ff00ff] mr-2 shrink-0">[VIP] Player1:</span>
            <span className="retro-font-secondary text-xl text-[color:var(--theme-accent)] break-all">Wow, I missed it.</span>
        </div>
      </div>

      {/* DOS Style Input */}
      <div className="border-t-[4px] border-[color:var(--theme-accent)] pt-2">
        <div className="flex items-center">
           <span className="retro-font-secondary text-[color:var(--theme-accent)] text-2xl mr-2 font-bold">C:\&gt;</span>
           <div className="relative flex-1 flex items-center overflow-hidden">
             <input 
               type="text" 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               className="w-full bg-transparent border-none outline-none retro-font-secondary text-2xl text-[color:var(--theme-accent)] caret-transparent z-10 font-bold"
               autoComplete="off"
               spellCheck="false"
             />
             {/* Blinking block cursor logic */}
             <div 
                className="absolute text-[color:var(--theme-accent)] text-2xl font-bold pointer-events-none retro-font-secondary flex items-center"
                aria-hidden="true"
             >
               <span className="invisible whitespace-pre">{inputValue || ''}</span>
               <span className="animate-blink bg-[color:var(--theme-accent)] inline-block w-3 h-[18px] ml-0.5"></span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RetroChat;
