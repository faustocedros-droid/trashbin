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
        echo.
        echo X Failed to create virtual environment
        echo.
        pause
        cd ..
        exit /b 1
    )
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo.
    echo X Failed to activate virtual environment
    echo.
    pause
    cd ..
    exit /b 1
)

pip install -q -r requirements.txt
if errorlevel 1 (
    echo.
    echo X Failed to install Python dependencies
    echo.
    echo Try running manually:
    echo   cd backend
    echo   venv\Scripts\activate.bat
    echo   pip install -r requirements.txt
    echo.
    pause
    cd ..
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
        echo.
        echo X Failed to install Node.js dependencies
        echo.
        echo Try running manually:
        echo   cd frontend
        echo   npm install
        echo.
        pause
        cd ..
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
echo Running: npm run electron-dev
echo.
echo NOTE: This will start both React dev server and Electron.
echo The window will open when both are ready.
echo Press Ctrl+C to stop the application.
echo.

call npm run electron-dev
if errorlevel 1 (
    echo.
    echo ==========================================
    echo ERROR: Failed to start desktop app
    echo ==========================================
    echo.
    echo The application failed to start. Common issues:
    echo - React dev server failed to start (check port 3000)
    echo - Backend failed to start (check port 5000)
    echo - Missing dependencies
    echo.
    echo Check the error messages above for details.
    echo.
    echo For detailed troubleshooting steps, see: TROUBLESHOOTING.md
    echo.
    pause
    cd ..
    exit /b 1
)

echo.
echo ==========================================
echo Desktop App Closed
echo ==========================================
echo.
echo The application has been closed.
echo Run start-desktop.bat again to restart.
echo.

cd ..
