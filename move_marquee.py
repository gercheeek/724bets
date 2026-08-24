import re

filename = 'components/GuestLanding.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_block = """        <div className="w-full max-w-[1400px] mx-auto px-2 md:px-4 xl:px-4 pt-5 pb-6 flex flex-col gap-2">
            <HeroWelcomeBanner onRegisterClick={onMemberRegisterClick} />
            <div className="mt-1 mb-1 rounded-2xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <LiveWinsMarquee />
            </div>
            {/* Quick Access Banners for Guest View */}"""

new_block = """        <div className="w-full max-w-[1400px] mx-auto px-2 md:px-4 xl:px-4 pt-5 pb-6 flex flex-col gap-2">
            <HeroWelcomeBanner onRegisterClick={onMemberRegisterClick} />
            
            {/* Quick Access Banners for Guest View */}"""

# And insert it at line 477
old_bottom = """                  </div>
              </div>
            </div><div className="w-full mt-2 mb-6 sm:mt-4 sm:mb-8 flex flex-col gap-10">"""

new_bottom = """                  </div>
              </div>
            </div>
            
            {/* Live Wins moved under Casino/Sports Banners */}
            <div className="mt-2 mb-2 rounded-2xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <LiveWinsMarquee />
            </div>
            
            <div className="w-full mt-2 mb-6 sm:mt-4 sm:mb-8 flex flex-col gap-10">"""

content = content.replace(old_block, new_block)
content = content.replace(old_bottom, new_bottom)

with open(filename, 'w') as f:
    f.write(content)
print("Moved LiveWinsMarquee under banners")
