@echo off
REM Desktop App Launcher for Racing Car Manager (Windows)

echo ==========================================
echo Racing Car Manager - Desktop App
echo ==========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.9 or higher.
    pause
    exit /b 1
)
echo ✓ Python found

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo Setting up Backend...
echo ----------------------------------------

cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo X Failed to create virtual environment
        cd ..
        pause
        exit /b 1
    )
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo X Failed to activate virtual environment
    cd ..
    pause
    exit /b 1
)

pip install -q -r requirements.txt
if errorlevel 1 (
    echo X Failed to install Python dependencies
    cd ..
    pause
    exit /b 1
)

echo ✓ Backend setup complete
cd ..

echo.
echo Setting up Frontend...
echo ----------------------------------------

cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing Node.js dependencies (this may take a few minutes)...
    call npm install
    if errorlevel 1 (
        echo X Failed to install Node.js dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo Node modules already installed
)

echo ✓ Frontend setup complete

echo.
echo ==========================================
echo Starting Desktop App...
echo ==========================================
echo.

REM Start the Electron app in development mode
call npm run electron-dev

REM Check if electron-dev failed
if errorlevel 1 (
    echo.
    echo X Desktop app failed to start
    echo.
    echo Please check the error messages above.
    echo.
    echo Common issues:
    echo   - Check if all dependencies are installed correctly
    echo   - Run 'check-dependencies.bat' to verify setup
    echo   - Check if port 3000 or 5000 is already in use
    cd ..
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Desktop App Closed
echo ==========================================
echo.
echo The desktop app has been closed.
echo To restart, run: start-desktop.bat
echo.
pause

cd ..
