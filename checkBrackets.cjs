const fs = require('fs');

const code = fs.readFileSync('/Users/alex/Desktop/7_24bets-landing-page/App.tsx', 'utf8');

let stack = [];
for (let i = 0; i < code.length; i++) {
  const c = code[i];
  if (c === '(' || c === '{' || c === '[') {
    stack.push({ char: c, pos: i });
  } else if (c === ')' || c === '}' || c === ']') {
    if (stack.length === 0) {
      console.log('Unmatched closing', c, 'at', i);
      process.exit(1);
    }
    const last = stack.pop();
    const expected = last.char === '(' ? ')' : last.char === '{' ? '}' : ']';
    if (c !== expected) {
      console.log('Mismatched brackets: expected', expected, 'but found', c, 'at', i);
      const lines = code.substring(0, i).split('\n');
      console.log('Line number:', lines.length);
      process.exit(1);
    }
  }
}

if (stack.length > 0) {
  console.log('Unmatched opening brackets remaining:');
  for (const item of stack) {
    const lines = code.substring(0, item.pos).split('\n');
    console.log(`Bracket ${item.char} at line ${lines.length}`);
  }
  process.exit(1);
}

console.log('All brackets balanced!');
