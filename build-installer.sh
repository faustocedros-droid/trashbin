#!/bin/bash
# Build script for Racing Car Manager
# This script builds the installation packages for all platforms

set -e  # Exit on error

echo "==================================="
echo "Racing Car Manager - Build Script"
echo "==================================="
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "Error: This script must be run from the project root directory"
    exit 1
fi

# Navigate to frontend directory
cd frontend

echo "Step 1/3: Installing dependencies..."
npm install

echo ""
echo "Step 2/3: Building React application..."
npm run build

echo ""
echo "Step 3/3: Creating installation packages..."
echo ""

# Check what platform we're on and build accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Detected macOS - Building DMG installer..."
    npm run electron-build-mac
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "Detected Windows - Building NSIS installer..."
    npm run electron-build-win
else
    echo "Detected Linux - Building AppImage and DEB packages..."
    npm run electron-build-linux
fi

echo ""
echo "==================================="
echo "Build completed successfully!"
echo "==================================="
echo ""
echo "Installation packages are located in: dist/"
echo ""
ls -lh ../dist/ 2>/dev/null || echo "No dist directory found yet"
echo ""
echo "To build for specific platforms:"
echo "  Windows: npm run electron-build-win"
echo "  macOS:   npm run electron-build-mac"
echo "  Linux:   npm run electron-build-linux"
echo ""
