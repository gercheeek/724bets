import re

def move_login_buttons():
    with open('/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx', 'r') as f:
        content = f.read()

    # The block is: <div className="flex items-center gap-2 mr-2 md:mr-10 lg:mr-20">
    # Let's replace it to add more margin on the right.
    target = '<div className="flex items-center gap-2 mr-2 md:mr-10 lg:mr-20">'
    replacement = '<div className="flex items-center gap-2 mr-4 md:mr-12 lg:mr-24 xl:mr-40 2xl:mr-52">'
    
    content = content.replace(target, replacement)

    with open('/Users/alex/Desktop/7_24bets-landing-page/components/Header.tsx', 'w') as f:
        f.write(content)

move_login_buttons()
print("Login buttons moved left")
