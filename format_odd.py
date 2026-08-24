import re

filename = 'components/AnimatedOdd.tsx'
with open(filename, 'r') as f:
    content = f.read()

old_render = """    return (
        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-[4px] font-black transform ${flashClass || 'text-white'}`}>
            {value}
        </span>
    );"""

new_render = """    const displayValue = !isNaN(parseFloat(value)) ? parseFloat(value).toFixed(2) : value;
    
    return (
        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-[4px] font-black transform ${flashClass || 'text-white'}`}>
            {displayValue}
        </span>
    );"""

content = content.replace(old_render, new_render)
with open(filename, 'w') as f:
    f.write(content)
print("Updated AnimatedOdd to format with 2 decimal places")
