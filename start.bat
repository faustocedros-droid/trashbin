@echo off
REM Quick Start Script for Racing Car Management Web App (Windows)

REM Change to script directory
cd /d "%~dp0"

echo ==========================================
echo Racing Car Manager - Quick Start
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
)

REM Activate virtual environment and install dependencies
echo Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -q -r requirements.txt

REM Initialize database
echo Initializing database...
python test_api.py >nul 2>&1

echo ✓ Backend setup complete
echo.
echo Starting Backend Server...
echo Backend will run on http://localhost:5000
echo.

REM Start backend
start "Racing Car Backend" python app.py

REM Wait for backend to start
timeout /t 3 /nobreak >nul

cd ..

echo.
echo Setting up Frontend...
echo ----------------------------------------

cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing Node.js dependencies (this may take a few minutes)...
    call npm install
) else (
    echo Node modules already installed
)

echo ✓ Frontend setup complete
echo.
echo ==========================================
echo ✓ Setup Complete!
echo ==========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000 (will open after 'npm start')
echo.
echo To start the frontend, run:
echo   cd frontend
echo   npm start
echo.
echo Press any key to exit...
pause >nul
