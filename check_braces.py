import sys

def check(file):
    with open(file, 'r') as f:
        content = f.read()
    stack = []
    for i, c in enumerate(content):
        if c == '{': stack.append((c, i))
        elif c == '}': 
            if stack and stack[-1][0] == '{': stack.pop()
            else: print(f"Unmatched }} at {i} context: {content[max(0, i-20):i+20]}"); return
        elif c == '(': stack.append((c, i))
        elif c == ')': 
            if stack and stack[-1][0] == '(': stack.pop()
            else: print(f"Unmatched ) at {i} context: {content[max(0, i-20):i+20]}"); return
        elif c == '[': stack.append((c, i))
        elif c == ']': 
            if stack and stack[-1][0] == '[': stack.pop()
            else: print(f"Unmatched ] at {i} context: {content[max(0, i-20):i+20]}"); return
    
    if stack:
        for c, i in stack:
            print(f"Unclosed {c} at index {i} context: {content[max(0, i-40):min(len(content), i+40)]}")
            
check('socket_server.cjs')
