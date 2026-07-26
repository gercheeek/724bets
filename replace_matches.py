import sys

def replace_lines(file_path, start_marker, end_marker, replacement_file):
    with open(file_path, 'r') as f:
        lines = f.readlines()
        
    start_idx = -1
    end_idx = -1
    
    for i, line in enumerate(lines):
        if start_marker in line and start_idx == -1:
            start_idx = i
        if end_marker in line and start_idx != -1 and end_idx == -1:
            end_idx = i
            
    if start_idx == -1 or end_idx == -1:
        print("Markers not found!")
        sys.exit(1)
        
    with open(replacement_file, 'r') as f:
        replacement = f.readlines()
        
    new_lines = lines[:start_idx] + replacement + lines[end_idx+1:]
    
    with open(file_path, 'w') as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    replace_lines("components/sports/GercekView.tsx", "{/* Match Card 1 */}", "        {/* Match Card 3 */}", "replacement.tsx")
    # Need to manually delete the lines of Match Card 3 up to its closing div.
    # The script above stops right BEFORE Match Card 3 if we use it as end_marker, 
    # but we want to delete all 3 cards. Let's adjust it by using line numbers instead.
