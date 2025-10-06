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
        echo "✗ Failed to create virtual environment"
        cd ..
        read -p "Press Enter to continue..."
        exit 1
    fi
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "✗ Failed to activate virtual environment"
    cd ..
    read -p "Press Enter to continue..."
    exit 1
fi

pip install -q -r requirements.txt
if [ $? -ne 0 ]; then
    echo "✗ Failed to install Python dependencies"
    cd ..
    read -p "Press Enter to continue..."
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
        echo "✗ Failed to install Node.js dependencies"
        cd ..
        read -p "Press Enter to continue..."
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
npm run electron-dev

# Check if electron-dev failed
if [ $? -ne 0 ]; then
    echo ""
    echo "✗ Desktop app failed to start"
    echo ""
    echo "Please check the error messages above."
    echo ""
    echo "Common issues:"
    echo "  - Check if all dependencies are installed correctly"
    echo "  - Run './check-dependencies.sh' to verify setup"
    echo "  - Check if port 3000 or 5000 is already in use"
    cd ..
    read -p "Press Enter to continue..."
    exit 1
fi

echo ""
echo "=========================================="
echo "Desktop App Closed"
echo "=========================================="
echo ""
echo "The desktop app has been closed."
echo "To restart, run: ./start-desktop.sh"
echo ""
read -p "Press Enter to continue..."

cd ..
