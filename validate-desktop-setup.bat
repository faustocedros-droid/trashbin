@echo off
REM Validation Script for Desktop App Setup (Windows)

REM Change to script directory
cd /d "%~dp0"

echo ==========================================
echo Desktop App Setup Validation
echo ==========================================
echo.

set ERRORS=0
set WARNINGS=0

echo 1. Checking Core Files...
echo ----------------------------------------
call :check_file "frontend\package.json"
call :check_file "frontend\public\electron.js"
call :check_file "frontend\public\preload.js"
call :check_file "frontend\public\index.html"
call :check_dir "frontend\src"
call :check_file "backend\app.py"
call :check_file "backend\models.py"
call :check_file "backend\requirements.txt"
echo.

echo 2. Checking Startup Scripts...
echo ----------------------------------------
call :check_file "start-desktop.sh"
call :check_file "start-desktop.bat"
echo.

echo 3. Checking Build Scripts...
echo ----------------------------------------
call :check_file "build-desktop.sh"
call :check_file "build-desktop-windows.bat"
echo.

echo 4. Checking Documentation...
echo ----------------------------------------
call :check_file "README.md"
call :check_file "DESKTOP_APP_GUIDE.md"
call :check_file "QUICK_START.md"
call :check_file "BUILD_CONFIG.md"
call :check_file "ICONS_README.md"
call :check_file "CONVERSIONE_DESKTOP_RIEPILOGO.md"
echo.

echo 5. Validating JSON Syntax...
echo ----------------------------------------
python -m json.tool frontend\package.json >nul 2>&1
if %errorlevel% equ 0 (
    echo V frontend\package.json is valid JSON
) else (
    echo X frontend\package.json has JSON syntax errors
    set /a ERRORS+=1
)
echo.

echo 6. Validating JavaScript Syntax...
echo ----------------------------------------
node -c frontend\public\electron.js >nul 2>&1
if %errorlevel% equ 0 (
    echo V electron.js syntax is valid
) else (
    echo X electron.js has syntax errors
    set /a ERRORS+=1
)

node -c frontend\public\preload.js >nul 2>&1
if %errorlevel% equ 0 (
    echo V preload.js syntax is valid
) else (
    echo X preload.js has syntax errors
    set /a ERRORS+=1
)
echo.

echo 7. Checking Package.json Configuration...
echo ----------------------------------------
cd frontend
node -e "console.log(require('./package.json').main)" > ..\temp_main.txt 2>nul
set /p MAIN=<..\temp_main.txt
del ..\temp_main.txt
if "%MAIN%"=="public/electron.js" (
    echo V Main entry point: %MAIN%
) else (
    echo X Main entry point incorrect: %MAIN% ^(expected: public/electron.js^)
    set /a ERRORS+=1
)

node -e "console.log(require('./package.json').scripts.electron ? 'yes' : 'no')" > ..\temp_script.txt 2>nul
set /p ELECTRON_SCRIPT=<..\temp_script.txt
del ..\temp_script.txt
if "%ELECTRON_SCRIPT%"=="yes" (
    echo V Electron script defined
) else (
    echo X Electron script missing
    set /a ERRORS+=1
)

node -e "console.log(require('./package.json').build ? 'yes' : 'no')" > ..\temp_build.txt 2>nul
set /p BUILD_CONFIG=<..\temp_build.txt
del ..\temp_build.txt
if "%BUILD_CONFIG%"=="yes" (
    echo V Build configuration defined
) else (
    echo X Build configuration missing
    set /a ERRORS+=1
)
cd ..
echo.

echo 8. Checking Required Tools...
echo ----------------------------------------
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version') do echo V Python found: %%i
) else (
    echo X Python not found ^(required for backend^)
    set /a ERRORS+=1
)

node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do echo V Node.js found: %%i
) else (
    echo X Node.js not found ^(required for frontend^)
    set /a ERRORS+=1
)

npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do echo V npm found: %%i
) else (
    echo X npm not found ^(required for dependencies^)
    set /a ERRORS+=1
)
echo.

echo ==========================================
echo Validation Summary
echo ==========================================
echo Errors:   %ERRORS%
echo Warnings: %WARNINGS%
echo.

if %ERRORS% equ 0 (
    if %WARNINGS% equ 0 (
        echo [32mAll checks passed! Desktop app setup is complete.[0m
        echo.
        echo To start the desktop app, run:
        echo   start-desktop.bat
        exit /b 0
    ) else (
        echo [33mSetup complete with warnings.[0m
        echo.
        echo The desktop app should work, but you may want to address the warnings.
        echo.
        echo To start the desktop app, run:
        echo   start-desktop.bat
        exit /b 0
    )
) else (
    echo [31mSetup validation failed with %ERRORS% error^(s^).[0m
    echo.
    echo Please fix the errors before running the desktop app.
    pause
    exit /b 1
)

REM Function to check if file exists
:check_file
if exist %1 (
    echo V %~1 exists
) else (
    echo X %~1 missing
    set /a ERRORS+=1
)
exit /b

REM Function to check if directory exists
:check_dir
if exist %1\ (
    echo V %~1 exists
) else (
    echo X %~1 missing
    set /a ERRORS+=1
)
exit /b
