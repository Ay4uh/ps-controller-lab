#!/usr/bin/env bash
set -euo pipefail

echo "=== 1. Validating JavaScript Syntax ==="
node -c shared/sidebar.js
for f in shared/modules/*.js functions/api/cert/*.js; do
  node --check "$f"
done

echo "=== 2. Verifying Critical Assets & Zero Dead Anchors ==="
test -f og-image.png
test -f _headers
test -f manifest.json
test -f sw.js
test -f verify/index.html

if grep -rn 'href="#"' index.html about/ contact/ policies/ services/ fix-ps5-controller-drift/ shared/sidebar.js; then
  echo "ERROR: Found dead href=# anchors!"
  exit 1
fi

echo "=== 3. Running TechTest Diagnostic & Crypto Suite ==="
npm test
