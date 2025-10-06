@echo off
REM Build Desktop App for Windows

REM Change to script directory
cd /d "%~dp0"

echo ==========================================
echo Racing Car Manager - Build Desktop App
echo ==========================================
echo.

cd frontend

echo Installing dependencies...
call npm install

echo.
echo Building React app...
call npm run build

echo.
echo Building Electron app for Windows...
call npm run electron-build

echo.
echo ==========================================
echo Build Complete!
echo ==========================================
echo.
echo Installer location: frontend\dist\
echo.

dir dist\*.exe /b

echo.
pause
