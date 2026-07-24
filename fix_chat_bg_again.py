import re

def fix_chat_bg_again():
    # Fix ModernChat.tsx
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'r') as f:
        content = f.read()

    # Change the main background
    content = content.replace("bg-[#0f121a]", "bg-[#14171d]")
    
    # Also change the header bg which is bg-transparent
    # <div className={`${isRetroVIP ? ... : 'bg-transparent'} px-4 h-[65px] flex items-center justify-between flex-shrink-0 relative z-30 shadow-md`}>
    content = content.replace("'bg-transparent'} px-4 h-[65px]", "'bg-[#14171d]'} px-4 h-[65px]")

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/ModernChat.tsx', 'w') as f:
        f.write(content)

    # Fix App.tsx aside background
    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'r') as f:
        app_content = f.read()
    
    app_content = app_content.replace('bg-[#0b0e14] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] h-full flex-shrink-0 relative z-20',
                                      'bg-[#14171d] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] h-full flex-shrink-0 relative z-20')

    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'w') as f:
        f.write(app_content)

fix_chat_bg_again()
print("Chat wrapper bg fixed")
