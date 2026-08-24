import re

with open('contexts/BettingContext.tsx', 'r') as f:
    content = f.read()

# Find the MOCK_MATCHES definition block.
# It starts with 'const MOCK_MATCHES = [' and ends at '];'
# Let's extract it.
pattern = r"const MOCK_MATCHES = \[.*?\];"
match = re.search(pattern, content, flags=re.DOTALL)

if match:
    mock_matches_code = match.group(0)
    # Remove it from its current position
    content = content.replace(mock_matches_code, "")
    
    # Insert it right before export const BettingProvider = ...
    # This guarantees it is defined before any hooks use it.
    provider_pattern = r"export const BettingProvider: React\.FC<\{ children: React\.ReactNode \}> = \(\{ children \}\) => \{"
    if provider_pattern in content:
        print("provider_pattern found!")
        # Fallback to simple replace
    else:
        print("provider_pattern not found via exact string, using regex.")
        
    content = re.sub(
        r"(export const BettingProvider: React\.FC<\{ children: React\.ReactNode \}> = \(\{ children \}\) => \{)",
        mock_matches_code + r"\n\n\1",
        content
    )
    
    with open('contexts/BettingContext.tsx', 'w') as f:
        f.write(content)
    print("Fixed MOCK_MATCHES Temporal Dead Zone issue!")
else:
    print("Could not find MOCK_MATCHES block.")

