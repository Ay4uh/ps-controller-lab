const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8099;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const logData = JSON.parse(body);
        console.log("\n--- BROWSER CONSOLE ERROR LOGGED ---");
        console.log("Message:", logData.message);
        console.log("Source:", logData.source);
        console.log("Line:", logData.lineno, "Col:", logData.colno);
        if (logData.error) {
          console.log("Stack Trace:\n", logData.error);
        }
        console.log("------------------------------------\n");
      } catch (e) {
        console.log("Failed to parse log body:", body);
      }
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('ok');
    });
  } else if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Diagnostics server running at http://localhost:${PORT}`);
});
