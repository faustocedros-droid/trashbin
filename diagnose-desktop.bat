@echo off
REM Comprehensive Desktop App Diagnostic Script for Windows
REM This script tests all components step by step

REM Change to script directory
cd /d "%~dp0"

echo ==========================================
echo Racing Car Manager - Desktop App Diagnostic
echo ==========================================
echo.

set ERRORS=0

REM Test 1: Check Python
echo Test 1: Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python not found
    set /a ERRORS+=1
) else (
    python --version
    echo ✓ Python found
)
echo.

REM Test 2: Check Node.js
echo Test 2: Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js not found
    set /a ERRORS+=1
) else (
    node --version
    echo ✓ Node.js found
)
echo.

REM Test 3: Check backend structure
echo Test 3: Checking backend structure...
if exist "backend" (
    echo ✓ backend directory exists
    if exist "backend\app.py" (
        echo ✓ backend\app.py exists
    ) else (
        echo X backend\app.py not found
        set /a ERRORS+=1
    )
    if exist "backend\requirements.txt" (
        echo ✓ backend\requirements.txt exists
    ) else (
        echo X backend\requirements.txt not found
        set /a ERRORS+=1
    )
) else (
    echo X backend directory not found
    set /a ERRORS+=1
)
echo.

REM Test 4: Check backend virtual environment
echo Test 4: Checking Python virtual environment...
if exist "backend\venv\Scripts\python.exe" (
    echo ✓ Virtual environment exists
    backend\venv\Scripts\python.exe --version
) else (
    echo ⚠ Virtual environment not found
    echo    Creating virtual environment...
    cd backend
    python -m venv venv
    cd ..
    if exist "backend\venv\Scripts\python.exe" (
        echo ✓ Virtual environment created
    ) else (
        echo X Failed to create virtual environment
        set /a ERRORS+=1
    )
)
echo.

REM Test 5: Check Python dependencies
echo Test 5: Checking Python dependencies...
if exist "backend\venv\Scripts\python.exe" (
    cd backend
    call venv\Scripts\activate.bat
    
    REM Check if Flask is installed
    python -c "import flask" >nul 2>&1
    if errorlevel 1 (
        echo ⚠ Flask not installed, installing dependencies...
        pip install -q -r requirements.txt
        python -c "import flask" >nul 2>&1
        if errorlevel 1 (
            echo X Failed to install Flask
            set /a ERRORS+=1
        ) else (
            echo ✓ Flask installed successfully
        )
    ) else (
        python -c "import flask; print('✓ Flask installed:', flask.__version__)"
    )
    
    call deactivate
    cd ..
) else (
    echo X Cannot check dependencies without venv
    set /a ERRORS+=1
)
echo.

REM Test 6: Check frontend structure
echo Test 6: Checking frontend structure...
if exist "frontend" (
    echo ✓ frontend directory exists
    if exist "frontend\package.json" (
        echo ✓ frontend\package.json exists
    ) else (
        echo X frontend\package.json not found
        set /a ERRORS+=1
    )
    if exist "frontend\public\electron.js" (
        echo ✓ frontend\public\electron.js exists
    ) else (
        echo X frontend\public\electron.js not found
        set /a ERRORS+=1
    )
) else (
    echo X frontend directory not found
    set /a ERRORS+=1
)
echo.

REM Test 7: Check Node.js dependencies
echo Test 7: Checking Node.js dependencies...
if exist "frontend\node_modules" (
    echo ✓ node_modules exists
    
    cd frontend
    if exist "node_modules\.bin\electron.cmd" (
        call node_modules\.bin\electron.cmd --version
        echo ✓ Electron installed
    ) else (
        echo ⚠ Electron not found, installing dependencies...
        call npm install
        if exist "node_modules\.bin\electron.cmd" (
            echo ✓ Electron installed successfully
        ) else (
            echo X Failed to install Electron
            set /a ERRORS+=1
        )
    )
    cd ..
) else (
    echo ⚠ node_modules not found, installing...
    cd frontend
    call npm install
    if exist "node_modules" (
        echo ✓ Dependencies installed successfully
    ) else (
        echo X Failed to install dependencies
        set /a ERRORS+=1
    )
    cd ..
)
echo.

REM Test 8: Validate electron.js syntax
echo Test 8: Validating electron.js syntax...
cd frontend
node -c public\electron.js >nul 2>&1
if errorlevel 1 (
    echo X electron.js has syntax errors
    node -c public\electron.js
    set /a ERRORS+=1
) else (
    echo ✓ electron.js syntax is valid
)
cd ..
echo.

REM Summary
echo ==========================================
echo Diagnostic Summary
echo ==========================================
if %ERRORS%==0 (
    echo ✓ All tests passed!
    echo.
    echo Your desktop app is ready to run.
    echo Start it with: start-desktop.bat
) else (
    echo X Found %ERRORS% error(s)
    echo.
    echo Please fix the errors above before running the desktop app.
)
echo.

pause
