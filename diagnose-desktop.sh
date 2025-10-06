#!/bin/bash
# Comprehensive Desktop App Diagnostic Script
# This script tests all components step by step

# Change to script directory
cd "$(dirname "$0")"

echo "=========================================="
echo "Racing Car Manager - Desktop App Diagnostic"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Test 1: Check Python
echo "Test 1: Checking Python installation..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Python found: $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python 3 not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 2: Check Node.js
echo "Test 2: Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 3: Check backend structure
echo "Test 3: Checking backend structure..."
if [ -d "backend" ]; then
    echo -e "${GREEN}✓${NC} backend directory exists"
    if [ -f "backend/app.py" ]; then
        echo -e "${GREEN}✓${NC} backend/app.py exists"
    else
        echo -e "${RED}✗${NC} backend/app.py not found"
        ERRORS=$((ERRORS + 1))
    fi
    if [ -f "backend/requirements.txt" ]; then
        echo -e "${GREEN}✓${NC} backend/requirements.txt exists"
    else
        echo -e "${RED}✗${NC} backend/requirements.txt not found"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} backend directory not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 4: Check backend virtual environment
echo "Test 4: Checking Python virtual environment..."
if [ -f "backend/venv/bin/python" ]; then
    echo -e "${GREEN}✓${NC} Virtual environment exists"
    VENV_PYTHON="backend/venv/bin/python"
    echo "   Python: $($VENV_PYTHON --version)"
else
    echo -e "${YELLOW}⚠${NC} Virtual environment not found"
    echo "   Creating virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
    if [ -f "backend/venv/bin/python" ]; then
        echo -e "${GREEN}✓${NC} Virtual environment created"
        VENV_PYTHON="backend/venv/bin/python"
    else
        echo -e "${RED}✗${NC} Failed to create virtual environment"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

# Test 5: Check Python dependencies
echo "Test 5: Checking Python dependencies..."
if [ -f "backend/venv/bin/python" ]; then
    cd backend
    source venv/bin/activate
    
    # Check if Flask is installed
    if python -c "import flask" 2>/dev/null; then
        FLASK_VERSION=$(python -c "import flask; print(flask.__version__)")
        echo -e "${GREEN}✓${NC} Flask installed: $FLASK_VERSION"
    else
        echo -e "${YELLOW}⚠${NC} Flask not installed, installing dependencies..."
        pip install -q -r requirements.txt
        if python -c "import flask" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} Flask installed successfully"
        else
            echo -e "${RED}✗${NC} Failed to install Flask"
            ERRORS=$((ERRORS + 1))
        fi
    fi
    
    deactivate
    cd ..
else
    echo -e "${RED}✗${NC} Cannot check dependencies without venv"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 6: Test backend can start
echo "Test 6: Testing backend startup..."
cd backend
source venv/bin/activate
timeout 10 python app.py > /tmp/backend_test.log 2>&1 &
BACKEND_PID=$!
sleep 5

if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Backend process started (PID: $BACKEND_PID)"
    
    # Check if it's responding
    sleep 2
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Backend responding on port 5000"
    else
        echo -e "${YELLOW}⚠${NC} Backend started but not responding on port 5000"
        echo "   Check /tmp/backend_test.log for details"
    fi
    
    kill $BACKEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
else
    echo -e "${RED}✗${NC} Backend failed to start"
    echo "   Error log:"
    cat /tmp/backend_test.log
    ERRORS=$((ERRORS + 1))
fi

deactivate
cd ..
echo ""

# Test 7: Check frontend structure
echo "Test 7: Checking frontend structure..."
if [ -d "frontend" ]; then
    echo -e "${GREEN}✓${NC} frontend directory exists"
    if [ -f "frontend/package.json" ]; then
        echo -e "${GREEN}✓${NC} frontend/package.json exists"
    else
        echo -e "${RED}✗${NC} frontend/package.json not found"
        ERRORS=$((ERRORS + 1))
    fi
    if [ -f "frontend/public/electron.js" ]; then
        echo -e "${GREEN}✓${NC} frontend/public/electron.js exists"
    else
        echo -e "${RED}✗${NC} frontend/public/electron.js not found"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} frontend directory not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 8: Check Node.js dependencies
echo "Test 8: Checking Node.js dependencies..."
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
    
    cd frontend
    if [ -f "node_modules/.bin/electron" ]; then
        ELECTRON_VERSION=$(./node_modules/.bin/electron --version)
        echo -e "${GREEN}✓${NC} Electron installed: $ELECTRON_VERSION"
    else
        echo -e "${YELLOW}⚠${NC} Electron not found, installing dependencies..."
        npm install
        if [ -f "node_modules/.bin/electron" ]; then
            echo -e "${GREEN}✓${NC} Electron installed successfully"
        else
            echo -e "${RED}✗${NC} Failed to install Electron"
            ERRORS=$((ERRORS + 1))
        fi
    fi
    cd ..
else
    echo -e "${YELLOW}⚠${NC} node_modules not found, installing..."
    cd frontend
    npm install
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} Dependencies installed successfully"
    else
        echo -e "${RED}✗${NC} Failed to install dependencies"
        ERRORS=$((ERRORS + 1))
    fi
    cd ..
fi
echo ""

# Test 9: Validate electron.js syntax
echo "Test 9: Validating electron.js syntax..."
cd frontend
if node -c public/electron.js 2>/dev/null; then
    echo -e "${GREEN}✓${NC} electron.js syntax is valid"
else
    echo -e "${RED}✗${NC} electron.js has syntax errors"
    node -c public/electron.js
    ERRORS=$((ERRORS + 1))
fi
cd ..
echo ""

# Summary
echo "=========================================="
echo "Diagnostic Summary"
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Your desktop app is ready to run."
    echo "Start it with: ./start-desktop.sh"
else
    echo -e "${RED}✗ Found $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors above before running the desktop app."
fi
echo ""
