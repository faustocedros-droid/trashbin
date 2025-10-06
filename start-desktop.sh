#!/bin/bash
# Racing Car Manager - Desktop App Launcher (Clean Rebuild)
# Linux/macOS startup script

set -e  # Exit on error

echo "=========================================="
echo "Racing Car Manager - Desktop App"
echo "=========================================="
echo ""

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check for required tools
echo "Checking requirements..."
echo "----------------------------------------"

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed"
    echo "Please install Python 3.9 or higher from https://www.python.org/"
    exit 1
fi
print_success "Python found: $(python3 --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js 16 or higher from https://nodejs.org/"
    exit 1
fi
print_success "Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    echo "npm should come with Node.js. Please reinstall Node.js."
    exit 1
fi
print_success "npm found: $(npm --version)"

echo ""
echo "Setting up Backend..."
echo "----------------------------------------"

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "Installing Python dependencies..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

print_success "Backend setup complete"
cd ..

echo ""
echo "Setting up Frontend..."
echo "----------------------------------------"

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies (this may take a few minutes)..."
    npm install
else
    print_success "Node modules already installed"
fi

# Check if Electron is installed
if [ ! -d "node_modules/electron" ]; then
    print_warning "Electron not found, installing..."
    npm install
fi

print_success "Frontend setup complete"

echo ""
echo "=========================================="
echo "Starting Desktop App..."
echo "=========================================="
echo ""
echo "Backend will start automatically"
echo "Frontend window will open shortly"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the Electron app in development mode
npm run electron-dev

cd ..
