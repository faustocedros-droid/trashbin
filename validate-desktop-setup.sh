#!/bin/bash
# Validation Script for Desktop App Setup

echo "=========================================="
echo "Desktop App Setup Validation"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo "✓ $1 exists"
        return 0
    else
        echo "✗ $1 missing"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo "✓ $1 exists"
        return 0
    else
        echo "✗ $1 missing"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

echo "1. Checking Core Files..."
echo "----------------------------------------"
check_file "frontend/package.json"
check_file "frontend/public/electron.js"
check_file "frontend/public/preload.js"
check_file "frontend/public/index.html"
check_dir "frontend/src"
check_file "backend/app.py"
check_file "backend/models.py"
check_file "backend/requirements.txt"
echo ""

echo "2. Checking Startup Scripts..."
echo "----------------------------------------"
check_file "start-desktop.sh"
check_file "start-desktop.bat"
if [ -f "start-desktop.sh" ]; then
    if [ -x "start-desktop.sh" ]; then
        echo "  ✓ start-desktop.sh is executable"
    else
        echo "  ⚠ start-desktop.sh is not executable (run: chmod +x start-desktop.sh)"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

echo "3. Checking Build Scripts..."
echo "----------------------------------------"
check_file "build-desktop.sh"
check_file "build-desktop-windows.bat"
if [ -f "build-desktop.sh" ]; then
    if [ -x "build-desktop.sh" ]; then
        echo "  ✓ build-desktop.sh is executable"
    else
        echo "  ⚠ build-desktop.sh is not executable (run: chmod +x build-desktop.sh)"
        WARNINGS=$((WARNINGS + 1))
    fi
fi
echo ""

echo "4. Checking Documentation..."
echo "----------------------------------------"
check_file "README.md"
check_file "DESKTOP_APP_GUIDE.md"
check_file "QUICK_START.md"
check_file "BUILD_CONFIG.md"
check_file "ICONS_README.md"
check_file "CONVERSIONE_DESKTOP_RIEPILOGO.md"
echo ""

echo "5. Validating JSON Syntax..."
echo "----------------------------------------"
if command -v python3 &> /dev/null; then
    if python3 -m json.tool frontend/package.json > /dev/null 2>&1; then
        echo "✓ frontend/package.json is valid JSON"
    else
        echo "✗ frontend/package.json has JSON syntax errors"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "⚠ Python3 not found, skipping JSON validation"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "6. Validating JavaScript Syntax..."
echo "----------------------------------------"
if command -v node &> /dev/null; then
    if node -c frontend/public/electron.js 2>/dev/null; then
        echo "✓ electron.js syntax is valid"
    else
        echo "✗ electron.js has syntax errors"
        ERRORS=$((ERRORS + 1))
    fi
    
    if node -c frontend/public/preload.js 2>/dev/null; then
        echo "✓ preload.js syntax is valid"
    else
        echo "✗ preload.js has syntax errors"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "⚠ Node.js not found, skipping JS validation"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo "7. Checking Package.json Configuration..."
echo "----------------------------------------"
if command -v node &> /dev/null; then
    cd frontend
    
    # Check main entry point
    MAIN=$(node -e "console.log(require('./package.json').main)")
    if [ "$MAIN" = "public/electron.js" ]; then
        echo "✓ Main entry point: $MAIN"
    else
        echo "✗ Main entry point incorrect: $MAIN (expected: public/electron.js)"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check homepage
    HOMEPAGE=$(node -e "console.log(require('./package.json').homepage)")
    if [ "$HOMEPAGE" = "./" ]; then
        echo "✓ Homepage: $HOMEPAGE"
    else
        echo "⚠ Homepage: $HOMEPAGE (expected: ./)"
        WARNINGS=$((WARNINGS + 1))
    fi
    
    # Check Electron scripts exist
    ELECTRON_SCRIPT=$(node -e "console.log(require('./package.json').scripts.electron ? 'yes' : 'no')")
    if [ "$ELECTRON_SCRIPT" = "yes" ]; then
        echo "✓ Electron script defined"
    else
        echo "✗ Electron script missing"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check build config exists
    BUILD_CONFIG=$(node -e "console.log(require('./package.json').build ? 'yes' : 'no')")
    if [ "$BUILD_CONFIG" = "yes" ]; then
        echo "✓ Build configuration defined"
    else
        echo "✗ Build configuration missing"
        ERRORS=$((ERRORS + 1))
    fi
    
    cd ..
fi
echo ""

echo "8. Checking Required Tools..."
echo "----------------------------------------"
if command -v python3 &> /dev/null; then
    echo "✓ Python3 found: $(python3 --version)"
else
    echo "✗ Python3 not found (required for backend)"
    ERRORS=$((ERRORS + 1))
fi

if command -v node &> /dev/null; then
    echo "✓ Node.js found: $(node --version)"
else
    echo "✗ Node.js not found (required for frontend)"
    ERRORS=$((ERRORS + 1))
fi

if command -v npm &> /dev/null; then
    echo "✓ npm found: $(npm --version)"
else
    echo "✗ npm not found (required for dependencies)"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "=========================================="
echo "Validation Summary"
echo "=========================================="
echo "Errors:   $ERRORS"
echo "Warnings: $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo "✅ All checks passed! Desktop app setup is complete."
        echo ""
        echo "To start the desktop app, run:"
        echo "  ./start-desktop.sh"
        exit 0
    else
        echo "⚠️  Setup complete with warnings."
        echo ""
        echo "The desktop app should work, but you may want to address the warnings."
        echo ""
        echo "To start the desktop app, run:"
        echo "  ./start-desktop.sh"
        exit 0
    fi
else
    echo "❌ Setup validation failed with $ERRORS error(s)."
    echo ""
    echo "Please fix the errors before running the desktop app."
    exit 1
fi
