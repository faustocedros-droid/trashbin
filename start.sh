#!/bin/bash
# Quick Start Script for Racing Car Management Web App

echo "=========================================="
echo "Racing Car Manager - Quick Start"
echo "=========================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi
echo "✓ Python 3 found: $(python3 --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi
echo "✓ Node.js found: $(node --version)"

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

# Initialize database
echo "Initializing database..."
python test_api.py > /dev/null 2>&1

echo "✓ Backend setup complete"
echo ""
echo "Starting Backend Server..."
echo "Backend will run on http://localhost:5000"
echo ""

# Start backend in background
python app.py &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
sleep 3

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
    echo "Node modules already installed"
fi

echo "✓ Frontend setup complete"
echo ""
echo "=========================================="
echo "✓ Setup Complete!"
echo "=========================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000 (will open after 'npm start')"
echo ""
echo "To start the frontend, run:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "To stop the backend server:"
echo "  kill $BACKEND_PID"
echo ""
