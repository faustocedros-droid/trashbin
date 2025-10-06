#!/bin/bash
# Desktop App Launcher for Racing Car Manager (Linux/Mac)

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
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo ""
        echo "✗ Failed to create virtual environment"
        echo ""
        read -p "Press Enter to continue..."
        cd ..
        exit 1
    fi
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo ""
    echo "✗ Failed to activate virtual environment"
    echo ""
    read -p "Press Enter to continue..."
    cd ..
    exit 1
fi

pip install -q -r requirements.txt
if [ $? -ne 0 ]; then
    echo ""
    echo "✗ Failed to install Python dependencies"
    echo ""
    echo "Try running manually:"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    echo ""
    read -p "Press Enter to continue..."
    cd ..
    exit 1
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
    if [ $? -ne 0 ]; then
        echo ""
        echo "✗ Failed to install Node.js dependencies"
        echo ""
        echo "Try running manually:"
        echo "  cd frontend"
        echo "  npm install"
        echo ""
        read -p "Press Enter to continue..."
        cd ..
        exit 1
    fi
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
echo "Running: npm run electron-dev"
echo ""
echo "NOTE: This will start both React dev server and Electron."
echo "The window will open when both are ready."
echo "Press Ctrl+C to stop the application."
echo ""

npm run electron-dev
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "=========================================="
    echo "ERROR: Failed to start desktop app"
    echo "=========================================="
    echo ""
    echo "The application failed to start. Common issues:"
    echo "- React dev server failed to start (check port 3000)"
    echo "- Backend failed to start (check port 5000)"
    echo "- Missing dependencies"
    echo ""
    echo "Check the error messages above for details."
    echo ""
    echo "For detailed troubleshooting steps, see: TROUBLESHOOTING.md"
    echo ""
    read -p "Press Enter to continue..."
    cd ..
    exit 1
fi

echo ""
echo "=========================================="
echo "Desktop App Closed"
echo "=========================================="
echo ""
echo "The application has been closed."
echo "Run ./start-desktop.sh again to restart."
echo ""

cd ..
