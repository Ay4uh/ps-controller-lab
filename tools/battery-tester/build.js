const fs = require('fs');

const mainHtml = fs.readFileSync('../../index.html', 'utf8');
const batteryHtml = fs.readFileSync('index.html', 'utf8');

// Extract everything from <head> to <main class="main-content">
const mainMatch = mainHtml.match(/([\s\S]*?)<main class="main-content">/);
let shellPrefix = mainMatch[1] + '<main class="main-content">\n';

// In shellPrefix, replace the "Battery Tester" link to make it active, and make Overview an actual link to '/'
shellPrefix = shellPrefix.replace(
  /<button class="tab-btn active" data-tab="tab-overview">([\s\S]*?)<\/button>/,
  '<a href="/" class="tab-btn" style="text-decoration:none;">$1</a>'
);
shellPrefix = shellPrefix.replace(
  /<a href="\/tools\/battery-tester\/" class="tab-btn text-decoration-none"/,
  '<a href="/tools/battery-tester/" class="tab-btn text-decoration-none active"'
);
// Make all other tab-btns into links to /#tabName so they work from this page
shellPrefix = shellPrefix.replace(/<button class="tab-btn" data-tab="([^"]+)">([\s\S]*?)<\/button>/g, '<a href="/#$1" class="tab-btn" style="text-decoration:none;">$2</a>');

// Extract the core battery UI from the container
const batteryMatch = batteryHtml.match(/<div class="container py-5">([\s\S]*?)<\/div>\n  <\/div>\n  <\/div>/);
const batteryContent = batteryMatch[0];

// Extract battery CSS
const cssMatch = batteryHtml.match(/<style>([\s\S]*?)<\/style>/);
// The CSS has some body and var definitions that might clash, we just need the repair-card and health-meter ones
const batteryCss = `
  <style>
    .repair-card { background: #1a1a1a; border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; margin-top: 1rem; transition: transform 0.2s, box-shadow 0.2s; position: relative; }
    .repair-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .repair-cost { color: var(--accent); font-size: 1.5rem; font-weight: 800; margin-bottom: 0; }
    .repair-recommended { position: absolute; top: -10px; right: 15px; background: var(--accent); color: #000; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    .health-meter { width: 150px; height: 150px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column; margin: 0 auto 1.5rem; border: 8px solid var(--border); }
    .health-good { border-color: #22c55e; color: #22c55e; }
    .health-fair { border-color: #eab308; color: #eab308; }
    .health-poor { border-color: #ef4444; color: #ef4444; }
  </style>
`;

// Extract battery pricing data JSON
const jsonMatch = batteryHtml.match(/<script id="batteryPrices" type="application\/json">([\s\S]*?)<\/script>/);
const jsonString = jsonMatch[0];

// Extract scripts
const scriptMatch = batteryHtml.match(/<script>\s*\/\/ --- Analytics Tracking ---([\s\S]*?)<\/script>/);
const jsString = '<script>\n// --- Analytics Tracking ---' + scriptMatch[1] + '</script>';

// Assemble new HTML
const newHtml = shellPrefix.replace('</head>', batteryCss + '\n' + jsonString + '\n</head>') + batteryContent + '\n' + jsString + '\n</main>\n</div>\n</body>\n</html>';

fs.writeFileSync('index.html', newHtml);
console.log('Rebuilt index.html with main shell');
