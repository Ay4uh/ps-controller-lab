const fs = require('fs');
const html = fs.readFileSync('/Users/user/.gemini/antigravity/scratch/ps-controller-lab/index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const jsCode = scriptMatch[1];
const lines = jsCode.split('\n');

let stack = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') {
      stack.push({ line: i + 1642, text: line.trim() });
    } else if (line[j] === '}') {
      if (stack.length === 0) {
        console.log(`Unmatched closing brace at HTML line ${i + 1642}: "${line.trim()}"`);
      } else {
        const opened = stack.pop();
        // Print matching if we want to trace
        if (opened.text.startsWith('function updateInputDisplay')) {
          console.log(`updateInputDisplay (HTML ${opened.line}) matched with closing brace at HTML line ${i + 1642}: "${line.trim()}"`);
        }
      }
    }
  }
}
console.log('Remaining open braces on stack:', stack.length);
if (stack.length > 0) {
  console.log('Unclosed braces opened at:');
  stack.forEach(b => console.log(`  HTML line ${b.line}: "${b.text}"`));
}
