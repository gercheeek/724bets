import re

filename = 'components/ModernChat.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_tip = """  if (text.startsWith('[TIP]')) {
      return (
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-3 my-2 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-3">
              <div className="text-2xl animate-bounce">💸</div>
              <div className="text-[#10B981] font-bold text-sm leading-tight">
                  {text.replace('[TIP]', '').trim()}
              </div>
          </div>
      );
  }"""

new_tip = """  if (text.startsWith('[TIP]')) {
      const tipContent = text.replace('[TIP]', '').trim();
      const match = tipContent.match(/(.+) sent (.+)₺ to (.+)!/);
      
      if (match) {
          const sender = match[1];
          const amount = match[2];
          const recipient = match[3];

          return (
             <div className="relative bg-[#2D2A32] border border-[#d6a863]/60 rounded-[4px] p-3 my-4 shadow-md overflow-visible">
                {/* 3D Floating Coins Corner */}
                <div className="absolute -top-4 -right-3 text-3xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] z-10">
                   🪙
                   <span className="absolute top-1 right-3 text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] -z-10">🪙</span>
                   <span className="absolute -top-1 -left-2 text-yellow-300 text-[12px] animate-pulse">✨</span>
                   <span className="absolute bottom-2 -right-3 text-yellow-300 text-[10px] animate-pulse delay-150">✨</span>
                </div>
                
                {/* First Row: Sender and Amount */}
                <div className="flex items-center gap-2 text-[#E2E8F0] text-[15px] font-medium mb-1">
                   {/* Stake-style Diamond Icon */}
                   <div className="w-3.5 h-3.5 border-2 border-[#d6a863] rotate-45 flex items-center justify-center ml-1">
                       <div className="w-1 h-1 bg-[#d6a863] rounded-full"></div>
                   </div>
                   
                   <span className="ml-1 tracking-wide">{sender} gönderildi <span className="text-[#FBBF24] font-bold">₺{amount}</span> 'e</span>
                   
                   {/* Stake-style Diamond Icon */}
                   <div className="w-3.5 h-3.5 border-2 border-[#d6a863] rotate-45 flex items-center justify-center ml-1">
                       <div className="w-1 h-1 bg-[#d6a863] rounded-full"></div>
                   </div>
                </div>
                
                {/* Second Row: Recipient */}
                <div className="text-white text-[17px] font-semibold pl-[34px] tracking-wide mt-0.5">
                    {recipient}
                </div>
             </div>
          );
      }

      // Fallback
      return (
          <div className="bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg p-3 my-2 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center gap-3">
              <div className="text-2xl animate-bounce">💸</div>
              <div className="text-[#10B981] font-bold text-sm leading-tight">
                  {tipContent}
              </div>
          </div>
      );
  }"""

content = content.replace(old_tip, new_tip)

with open(filename, 'w') as f:
    f.write(content)
print("Updated [TIP] rendering to Premium VIP style")
