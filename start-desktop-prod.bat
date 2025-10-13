@echo off
REM Start Script for Racing Car Manager Desktop App - Production Mode (Windows)

REM Change to script directory
cd /d "%~dp0"

echo ==========================================
echo Racing Car Manager - Desktop App
echo Production Mode
echo ==========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js found: %NODE_VERSION%

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.9 or higher.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✓ Python found: %PYTHON_VERSION%

echo.
echo Setting up Backend...
echo ----------------------------------------

cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -q -r requirements.txt

REM Initialize database if needed
if not exist "racing.db" (
    echo Initializing database...
    python test_api.py >nul 2>&1
)

echo ✓ Backend setup complete
cd ..

echo.
echo Setting up Frontend...
echo ----------------------------------------

cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing Node.js dependencies ^(this may take a few minutes^)...
    call npm install
) else (
    echo ✓ Node modules already installed
)

echo.
echo Building React application...
echo ----------------------------------------
echo This may take a few minutes...

REM Build the React app for production
call npm run build

if errorlevel 1 (
    echo X Build failed
    pause
    exit /b 1
)

echo ✓ Build complete

echo.
echo ==========================================
echo Starting Desktop App ^(Production Mode^)...
echo ==========================================
echo.
echo Note: In production mode, you need to rebuild
echo the app after code changes to see updates.
echo.

REM Start Electron in production mode (uses build/ folder)
call npm run electron

echo.
echo Desktop app closed.
pause
