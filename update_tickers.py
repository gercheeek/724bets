import re

with open('/Users/alex/Desktop/7_24bets-landing-page/components/LiveWinsTicker.tsx', 'r') as f:
    content = f.read()

# Add guestTheme prop to LiveWinsTicker
content = content.replace('export default function LiveWinsTicker() {', 'export default function LiveWinsTicker({ guestTheme = "retro" }: { guestTheme?: "retro" | "luxury" }) {')

# Apply grayscale to image container if luxury
old_img_container = 'className="w-full aspect-[3/4] rounded-lg md:rounded-[10px] overflow-hidden relative shadow-[0_4px_10px_rgba(0,0,0,0.4)] mb-1.5 bg-[#111111] border border-white/10 group-hover:border-[#00E676]/50 group-hover:shadow-[0_0_15px_rgba(0,230,118,0.2)] transition-all"'
new_img_container = 'className={`w-full aspect-[3/4] rounded-lg md:rounded-[10px] overflow-hidden relative shadow-[0_4px_10px_rgba(0,0,0,0.4)] mb-1.5 bg-[#111111] border border-white/10 group-hover:border-[#00E676]/50 group-hover:shadow-[0_0_15px_rgba(0,230,118,0.2)] transition-all ${guestTheme === "luxury" ? "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100" : ""}`}'
content = content.replace(old_img_container, new_img_container)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/LiveWinsTicker.tsx', 'w') as f:
    f.write(content)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsSlider.tsx', 'r') as f:
    content = f.read()

# Add guestTheme prop to OriginalsSlider
content = content.replace('export default function OriginalsSlider({ onNavigate }: { onNavigate: (v: string) => void }) {', 'export default function OriginalsSlider({ onNavigate, guestTheme = "retro" }: { onNavigate: (v: string) => void, guestTheme?: "retro" | "luxury" }) {')

# Apply grayscale to OriginalsSlider image if luxury
old_img_slider = '<img src={game.image} alt={game.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out z-0" />'
new_img_slider = '<img src={game.image} alt={game.name} className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out z-0 ${guestTheme === "luxury" ? "grayscale opacity-50 mix-blend-luminosity group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal" : ""}`} />'
content = content.replace(old_img_slider, new_img_slider)

with open('/Users/alex/Desktop/7_24bets-landing-page/components/OriginalsSlider.tsx', 'w') as f:
    f.write(content)
