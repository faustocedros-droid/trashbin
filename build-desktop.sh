#!/bin/bash
# Build Desktop App for macOS/Linux

# Change to script directory
cd "$(dirname "$0")"

echo "=========================================="
echo "Racing Car Manager - Build Desktop App"
echo "=========================================="
echo ""

cd frontend

echo "Installing dependencies..."
npm install

echo ""
echo "Building React app..."
npm run build

echo ""
echo "Building Electron app..."
npm run electron-build

echo ""
echo "=========================================="
echo "Build Complete!"
echo "=========================================="
echo ""
echo "Installer location: frontend/dist/"
echo ""

ls -lh dist/

echo ""
