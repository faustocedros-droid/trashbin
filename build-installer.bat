@echo off
REM Build script for Racing Car Manager (Windows)
REM This script builds the installation package for Windows

echo ===================================
echo Racing Car Manager - Build Script
echo ===================================
echo.

REM Check if we're in the right directory
if not exist "frontend" (
    echo Error: This script must be run from the project root directory
    exit /b 1
)
if not exist "backend" (
    echo Error: This script must be run from the project root directory
    exit /b 1
)

REM Navigate to frontend directory
cd frontend

echo Step 1/3: Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error installing dependencies
    exit /b 1
)

echo.
echo Step 2/3: Building React application...
call npm run build
if errorlevel 1 (
    echo Error building React application
    exit /b 1
)

echo.
echo Step 3/3: Creating Windows installer...
echo.
call npm run electron-build-win
if errorlevel 1 (
    echo Error creating installer
    exit /b 1
)

cd ..

echo.
echo ===================================
echo Build completed successfully!
echo ===================================
echo.
echo Installation package is located in: dist\
echo.
dir dist\ /B 2>nul
echo.

pause
