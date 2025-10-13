#!/bin/bash
# Verification script for white screen fix

echo "=================================="
echo "Verifica Fix Schermata Bianca"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to check and report
check() {
    local description="$1"
    local command="$2"
    
    echo -n "Checking: $description... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
    fi
}

# Navigate to repository root
cd "$(dirname "$0")"

echo "1. Checking package.json configuration..."
echo ""

# Check electron script points to build/electron.js
check "Production script uses ./build/electron.js" \
    "grep -q '\"electron\":.*electron ./build/electron.js' frontend/package.json"

# Check electron-dev script sets ELECTRON_MODE=dev
check "Dev script sets ELECTRON_MODE=dev" \
    "grep -q 'ELECTRON_MODE=dev electron' frontend/package.json"

# Check main field exists (for dev mode)
check "Main field points to public/electron.js" \
    "grep -q '\"main\": \"public/electron.js\"' frontend/package.json"

echo ""
echo "2. Checking build folder..."
echo ""

# Check if build folder exists
check "Build folder exists" \
    "[ -d frontend/build ]"

# Check if electron.js exists in build
check "electron.js exists in build/" \
    "[ -f frontend/build/electron.js ]"

# Check if index.html exists in build
check "index.html exists in build/" \
    "[ -f frontend/build/index.html ]"

# Check if preload.js exists in build
check "preload.js exists in build/" \
    "[ -f frontend/build/preload.js ]"

echo ""
echo "3. Checking electron.js configuration..."
echo ""

# Check electron.js uses ELECTRON_MODE
check "electron.js uses ELECTRON_MODE environment variable" \
    "grep -q 'process.env.ELECTRON_MODE' frontend/public/electron.js"

# Check electron.js doesn't use electron-is-dev
check "electron.js doesn't use electron-is-dev package" \
    "! grep -q \"require('electron-is-dev')\" frontend/public/electron.js"

# Check electron.js has console logging
check "electron.js has mode logging" \
    "grep -q 'Loading app in.*mode from' frontend/public/electron.js"

echo ""
echo "4. Checking start scripts..."
echo ""

# Check start-desktop-prod.bat exists
check "start-desktop-prod.bat exists" \
    "[ -f start-desktop-prod.bat ]"

# Check start-desktop.bat exists
check "start-desktop.bat exists" \
    "[ -f start-desktop.bat ]"

# Check start scripts call npm run build/electron
check "start-desktop-prod.bat builds the app" \
    "grep -q 'npm run build' start-desktop-prod.bat"

check "start-desktop-prod.bat runs electron" \
    "grep -q 'npm run electron' start-desktop-prod.bat"

echo ""
echo "=================================="
echo "Risultati Verifica"
echo "=================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ Tutti i controlli sono passati!${NC}"
    echo ""
    echo "La configurazione è corretta."
    echo "Per testare in produzione, esegui: ./start-desktop-prod.bat (Windows) o ./start-desktop-prod.sh (Linux/macOS)"
    exit 0
else
    echo -e "${RED}✗ Alcuni controlli sono falliti.${NC}"
    echo ""
    echo "Rivedi la configurazione prima di procedere."
    exit 1
fi
