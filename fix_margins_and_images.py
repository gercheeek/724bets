import re

# Fix GuestLanding.tsx Margins
filename1 = 'components/GuestLanding.tsx'
with open(filename1, 'r') as f:
    content1 = f.read()

old_margin = """            {/* Live Wins moved under Casino/Sports Banners */}
            <div className="mt-2 mb-2 rounded-2xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <LiveWinsMarquee />
            </div>
            
            <div className="w-full mt-2 mb-6 sm:mt-4 sm:mb-8 flex flex-col gap-10">"""

new_margin = """            {/* Live Wins moved under Casino/Sports Banners */}
            <div className="mt-8 mb-4 rounded-2xl overflow-hidden border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <LiveWinsMarquee />
            </div>
            
            <div className="w-full mt-4 mb-6 sm:mt-6 sm:mb-8 flex flex-col gap-10">"""

content1 = content1.replace(old_margin, new_margin)
with open(filename1, 'w') as f:
    f.write(content1)

# Fix liveWinsData.ts Broken Image
filename2 = 'utils/liveWinsData.ts'
with open(filename2, 'r') as f:
    content2 = f.read()

old_broken = "{ name: 'WANTED DEAD OR A WILD', provider: 'HACKSAW', image: 'https://cdn.softswiss.net/i/s3/hacksaw/wanted_dead_or_a_wild.png', isOriginal: false }"
new_fixed = "{ name: 'THE DOG HOUSE', provider: 'PRAGMATIC PLAY', image: 'https://cdn.softswiss.net/i/s3/pragmaticexternal/TheDogHouse.png', isOriginal: false }"
content2 = content2.replace(old_broken, new_fixed)

with open(filename2, 'w') as f:
    f.write(content2)

print("Fixed margins and broken image")
