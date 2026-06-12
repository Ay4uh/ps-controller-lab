const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'tools');
const tools = fs.readdirSync(toolsDir);

const toolMeta = {
  'battery-tester': { title: 'Battery Health', desc: 'Check capacity and cycles' },
  'thermal-test': { title: 'Thermal Profiler', desc: 'Detect throttle and heat' },
  'ssd-test': { title: 'SSD Health', desc: 'Analyze SMART and speed' },
  'ram-test': { title: 'RAM Test', desc: 'Measure speed and usage' },
  'benchmark': { title: 'Benchmark', desc: 'Full system performance' },
  'keyboard-test': { title: 'Keyboard Test', desc: 'Find stuck or dead keys' },
  'mouse-test': { title: 'Mouse Test', desc: 'Check buttons and scroll' },
  'mic-test': { title: 'Mic Test', desc: 'Audio input visualizer' },
  'speaker-test': { title: 'Speaker Test', desc: 'L/R channel frequencies' },
  'display-test': { title: 'Display Test', desc: 'Monitor Hz and tearing' },
  'dead-pixel-test': { title: 'Dead Pixel Test', desc: 'Find and fix stuck pixels' },
  'webcam-test': { title: 'Webcam Test', desc: 'Test camera feed and res' },
  'laptop-diagnostics': null // skip this one if it exists
};

tools.forEach(tool => {
  if (tool === 'controller-lab') return; // CRITICAL: Skip controller-lab
  if (!toolMeta[tool]) return;
  
  const indexPath = path.join(toolsDir, tool, 'index.html');
  if (!fs.existsSync(indexPath)) return;

  let content = fs.readFileSync(indexPath, 'utf8');

  // Step 1: Extract tool specific logic
  // For battery-tester and keyboard-test, we need to carefully extract the inner content
  // Most tools have their content inside <div class="container-fluid"> or <div class="main-content">
  
  let toolInnerHtml = '';
  
  if (tool === 'keyboard-test') {
    // Extract everything between <div class="container-fluid"> and </main>
    const match = content.match(/<div class="container-fluid">([\s\S]*?)<\/main>/);
    if (match) toolInnerHtml = match[1];
  } else if (tool === 'battery-tester') {
    // Battery tester has <div class="main-content"> and inside it <div class="container-fluid">
    const match = content.match(/<div class="container-fluid px-4 py-4">([\s\S]*?)<\/main>/);
    if (match) toolInnerHtml = match[1];
  } else {
    // Placeholders usually have <div class="container-fluid px-4 py-4">
    const match = content.match(/<div class="container-fluid px-4 py-4">([\s\S]*?)<\/main>/);
    if (match) toolInnerHtml = match[1];
  }

  // Fallback if extraction failed
  if (!toolInnerHtml) {
    console.log(`Extraction failed for ${tool}, attempting fallback...`);
    // Try to just grab anything between </aside> and <script
    const match = content.match(/<\/aside>[\s\S]*?<main[^>]*>([\s\S]*?)<\/main>/);
    if (match) toolInnerHtml = match[1];
  }

  // If still failed, log and skip
  if (!toolInnerHtml) {
    console.error(`Failed to extract content for ${tool}`);
    return;
  }

  // Extract custom <style> if any
  let customStyle = '';
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  if (styleMatch) {
    // Only keep it if it has tool-specific logic. We filter out the old :root vars.
    let styles = styleMatch[1];
    if (styles.includes('--bg:') || styles.includes(':root {')) {
       // Remove :root block
       styles = styles.replace(/:root\s*{[\s\S]*?}/, '');
       styles = styles.replace(/body\s*{[\s\S]*?}/, '');
       styles = styles.replace(/::-webkit-scrollbar[\s\S]*?}/g, '');
       styles = styles.replace(/\.app-container\s*{[\s\S]*?}/, '');
       styles = styles.replace(/\.sidebar\s*{[\s\S]*?}/, '');
       styles = styles.replace(/\.brand-container\s*{[\s\S]*?}/, '');
       styles = styles.replace(/\.nav-category\s*{[\s\S]*?}/, '');
       styles = styles.replace(/\.nav-tabs-custom[\s\S]*?}/g, '');
       styles = styles.replace(/\.main-content\s*{[\s\S]*?}/, '');
       // Remove any global overrides
    }
    customStyle = styles.trim() ? `<style>\n${styles}\n</style>` : '';
  }

  // Extract custom <script> if any (not the sidebar ones)
  let customScripts = '';
  const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
  let matchScript;
  while ((matchScript = scriptRegex.exec(content)) !== null) {
    const s = matchScript[1];
    if (!s.includes('dataLayer.push') && !s.includes('injectSidebar') && !s.includes('adsbygoogle')) {
      customScripts += `\n<script>${s}</script>\n`;
    }
  }

  const { title, desc } = toolMeta[tool];

  const newHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ay5uh</title>
  <meta name="description" content="Free online ${title.toLowerCase()}. ${desc}">
  <link rel="icon" type="image/png" sizes="512x512" href="/logo.png">
  
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-31VR9YJW06"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-31VR9YJW06');
  </script>

  <!-- Global CSS & Icons -->
  <link rel="stylesheet" href="/shared/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  ${customStyle}
</head>
<body>

  <div class="app-layout">
    <main class="main-content">
      <div class="container">
        
        <a href="/" class="tool-back-link">&larr; Back to all tools</a>
        
        <div class="tool-header-inner">
          <h1>${title}</h1>
          <p>${desc}</p>
        </div>

        <!-- Tool Content -->
        ${toolInnerHtml.trim()}
        <!-- End Tool Content -->

        <div class="about-tool-section">
          <h3>About this tool</h3>
          <p>This is a free browser-based diagnostic tool provided by ay5uh.com to help you test and troubleshoot your hardware. It runs entirely on your device with no installation required.</p>
        </div>

      </div>
    </main>
  </div>

  <script src="/shared/sidebar.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      injectSidebar('${tool}');
    });
  </script>
  ${customScripts}
</body>
</html>`;

  fs.writeFileSync(indexPath, newHtml);
  console.log(`Successfully migrated ${tool}`);
});
