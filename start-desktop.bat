@echo off
REM Racing Car Manager - Desktop App Launcher (Clean Rebuild)
REM Windows startup script

setlocal enabledelayedexpansion

echo ==========================================
echo Racing Car Manager - Desktop App
echo ==========================================
echo.

REM Check for Python
echo Checking requirements...
echo ------------------------------------------

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.9 or higher from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo [OK] Python found: %PYTHON_VERSION%

REM Check for Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check for npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    echo npm should come with Node.js. Please reinstall Node.js.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm found: v%NPM_VERSION%

echo.
echo Setting up Backend...
echo ------------------------------------------

cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo Installing Python dependencies...
python -m pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

echo [OK] Backend setup complete
cd ..

echo.
echo Setting up Frontend...
echo ------------------------------------------

cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing Node.js dependencies (this may take a few minutes^)...
    call npm install
) else (
    echo [OK] Node modules already installed
)

REM Check if Electron is installed
if not exist "node_modules\electron" (
    echo [WARNING] Electron not found, installing...
    call npm install
)

echo [OK] Frontend setup complete

echo.
echo ==========================================
echo Starting Desktop App...
echo ==========================================
echo.
echo Backend will start automatically
echo Frontend window will open shortly
echo.
echo Press Ctrl+C to stop the application
echo.

REM Start the Electron app in development mode
call npm run electron-dev

cd ..
