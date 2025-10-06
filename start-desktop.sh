#!/bin/bash
# Desktop App Launcher for Racing Car Manager (Linux/Mac)

# Exit on error
set -e

echo "=========================================="
echo "Racing Car Manager - Desktop App"
echo "=========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "✗ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi
echo "✓ Python found: $(python3 --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "✗ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi
echo "✓ Node.js found: $(node --version)"

echo ""
echo "Setting up Backend..."
echo "----------------------------------------"

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv || {
        echo ""
        echo "✗ Failed to create Python virtual environment"
        echo "  Make sure Python 3 is properly installed."
        cd ..
        exit 1
    }
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate || {
    echo ""
    echo "✗ Failed to activate Python virtual environment"
    cd ..
    exit 1
}

pip install -q -r requirements.txt || {
    echo ""
    echo "✗ Failed to install Python dependencies"
    echo "  Please check requirements.txt and try again."
    cd ..
    exit 1
}

echo "✓ Backend setup complete"
cd ..

echo ""
echo "Setting up Frontend..."
echo "----------------------------------------"

cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies (this may take a few minutes)..."
    npm install || {
        echo ""
        echo "✗ Failed to install Node.js dependencies"
        echo "  Please check your internet connection and try again."
        cd ..
        exit 1
    }
else
    echo "Node modules already installed"
fi

echo "✓ Frontend setup complete"

echo ""
echo "=========================================="
echo "Starting Desktop App..."
echo "=========================================="
echo ""

# Start the Electron app in development mode
npm run electron-dev || {
    echo ""
    echo "✗ Failed to start Electron app"
    echo "  Check the error messages above for details."
    cd ..
    exit 1
}

cd ..
