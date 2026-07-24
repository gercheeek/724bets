import re

def update_guest_landing():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'r') as f:
        content = f.read()

    # Find and remove Seka Çark button blocks
    content = re.sub(r'\{/\* Seka Çark Button.*?</button>', '', content, flags=re.DOTALL)
    content = re.sub(r'\{/\* Seka Çark Button.*?</div>\s*</a>', '', content, flags=re.DOTALL) # In case it's an a tag

    # Let's use a simpler approach. We know the exact text.
    # The button starts with `{/* Seka Çark Button` and ends with `</button>` or `</a>`. Let's just find `Seka Çark` and remove the parent button.
    # Actually, I'll just remove the whole block from `{/* Seka Çark Button` to `</span>\n                          </div>\n                        </button>`
    content = re.sub(r'\{/\*\s*Seka Çark Button.*?</button>', '', content, flags=re.DOTALL)
    
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/GuestLanding.tsx', 'w') as f:
        f.write(content)

def update_app():
    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'r') as f:
        content = f.read()

    content = content.replace("import Footer from './components/Footer';", "import Footer from './components/Footer';\nimport RetroFooter from './components/RetroFooter';")
    content = content.replace("{view !== 'admin' && view !== 'sports' && <Footer />}", "{view !== 'admin' && view !== 'sports' && (view === 'originals' ? <RetroFooter /> : <Footer />)}")

    with open('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'w') as f:
        f.write(content)

update_guest_landing()
update_app()
print("Updated successfully")

