import re

def update_texts(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Altın Kupa / Gümüş Kupa / Standart Ödül styling
    content = content.replace('text-white font-black text-xl drop-shadow-md', 'text-amber-100/90 font-bold text-lg')
    content = content.replace('text-white font-bold text-base drop-shadow-md', 'text-slate-300 font-medium text-base')
    
    # "Senin Durumun" large texts
    content = content.replace('text-white font-black text-4xl leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]', 'text-slate-100 font-bold text-3xl leading-none')
    content = content.replace('text-white font-black text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]', 'text-slate-100 font-bold text-2xl')

    # Havuz Doluluk Oranı
    content = content.replace('text-xl font-black text-white drop-shadow-md', 'text-lg font-bold text-slate-200')
    
    with open(filepath, 'w') as f:
        f.write(content)

update_texts('/Users/alex/Desktop/7_24bets-landing-page/components/VIPRafflePromo.tsx')
print("Text styles updated successfully!")

