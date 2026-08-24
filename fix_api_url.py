import re

def update_file(filename):
    with open(filename, 'r') as f:
        content = f.read()

    # Replace /api/sports/matches with http://localhost:3001/api/sports/matches
    content = content.replace("fetch('/api/sports/matches')", "fetch('http://localhost:3001/api/sports/matches')")

    with open(filename, 'w') as f:
        f.write(content)
    print(f"Updated {filename}")

update_file('contexts/BettingContext.tsx')
update_file('components/AdminSportsTab.tsx')

