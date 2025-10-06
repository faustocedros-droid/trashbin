#!/bin/bash
# Start Script for Racing Car Manager Desktop App (Linux/macOS)

# Change to script directory
cd "$(dirname "$0")"

echo "=========================================="
echo "Racing Car Manager - Desktop App"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi
echo "✓ Node.js found: $(node --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi
echo "✓ Python 3 found: $(python3 --version)"

echo ""
echo "Setting up Backend..."
echo "----------------------------------------"

# Backend setup
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -q -r requirements.txt

# Initialize database if needed
if [ ! -f "racing.db" ]; then
    echo "Initializing database..."
    python test_api.py > /dev/null 2>&1 || true
fi

echo "✓ Backend setup complete"
cd ..

echo ""
echo "Setting up Frontend..."
echo "----------------------------------------"

cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies (this may take a few minutes)..."
    npm install
else
    echo "✓ Node modules already installed"
fi

echo "✓ Frontend setup complete"
echo ""
echo "=========================================="
echo "Starting Desktop App..."
echo "=========================================="
echo ""

# Start Electron app (which will auto-start the backend)
npm run electron-dev

echo ""
echo "Desktop app closed."
