@echo off
REM Script di verifica installazione dipendenze

echo ==========================================
echo Verifica Installazione Dipendenze
echo Racing Car Manager Desktop App
echo ==========================================
echo.

set ERRORS=0
set WARNINGS=0

REM Verifica Node.js
echo 1. Verifica Node.js...
echo ----------------------------------------
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js NON installato
    echo   Scarica da: https://nodejs.org/
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js installato: !NODE_VERSION!
)
echo.

REM Verifica npm
echo 2. Verifica npm...
echo ----------------------------------------
npm --version >nul 2>&1
if errorlevel 1 (
    echo X npm NON installato (dovrebbe essere incluso con Node.js)
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✓ npm installato: v!NPM_VERSION!
)
echo.

REM Verifica Python
echo 3. Verifica Python...
echo ----------------------------------------
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python NON installato
    echo   Scarica da: https://www.python.org/downloads/
    set /a ERRORS+=1
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo ✓ Python installato: !PYTHON_VERSION!
)
echo.

REM Verifica dipendenze frontend
echo 4. Verifica dipendenze frontend...
echo ----------------------------------------
if exist "frontend\node_modules" (
    echo ✓ Cartella node_modules esiste
    
    if exist "frontend\node_modules\electron" (
        echo ✓ Electron installato
    ) else (
        echo X Electron NON installato
        echo   Esegui: cd frontend ^&^& npm install
        set /a ERRORS+=1
    )
    
    if exist "frontend\node_modules\concurrently" (
        echo ✓ concurrently installato
    ) else (
        echo X concurrently NON installato
        set /a ERRORS+=1
    )
    
    if exist "frontend\node_modules\cross-env" (
        echo ✓ cross-env installato
    ) else (
        echo X cross-env NON installato
        set /a ERRORS+=1
    )
    
    if exist "frontend\node_modules\wait-on" (
        echo ✓ wait-on installato
    ) else (
        echo X wait-on NON installato
        set /a ERRORS+=1
    )
    
    if exist "frontend\node_modules\electron-builder" (
        echo ✓ electron-builder installato
    ) else (
        echo X electron-builder NON installato
        set /a ERRORS+=1
    )
) else (
    echo X Cartella node_modules NON esiste
    echo.
    echo   ⚠️  DEVI INSTALLARE LE DIPENDENZE!
    echo.
    echo   Esegui questi comandi:
    echo     cd frontend
    echo     npm install
    echo     cd ..
    echo.
    set /a ERRORS+=1
)
echo.

REM Verifica file essenziali
echo 5. Verifica file essenziali...
echo ----------------------------------------
if exist "frontend\package.json" (
    echo ✓ package.json esiste
) else (
    echo X package.json mancante
    set /a ERRORS+=1
)

if exist "frontend\public\electron.js" (
    echo ✓ electron.js esiste
) else (
    echo X electron.js mancante
    set /a ERRORS+=1
)

if exist "frontend\public\preload.js" (
    echo ✓ preload.js esiste
) else (
    echo X preload.js mancante
    set /a ERRORS+=1
)
echo.

REM Riepilogo
echo ==========================================
echo RIEPILOGO
echo ==========================================
echo Errori:   %ERRORS%
echo Warning:  %WARNINGS%
echo.

if %ERRORS% equ 0 (
    if %WARNINGS% equ 0 (
        echo ✅ Tutti i controlli superati!
        echo.
        echo L'app desktop è pronta per l'avvio.
        echo.
        echo Per avviare l'app, esegui:
        echo   start-desktop.bat
        exit /b 0
    ) else (
        echo ⚠️  Installazione completa con avvisi.
        echo.
        echo L'app dovrebbe funzionare, ma potresti voler risolvere gli avvisi.
        echo.
        echo Per avviare l'app, esegui:
        echo   start-desktop.bat
        exit /b 0
    )
) else (
    echo ❌ Installazione incompleta!
    echo.
    if not exist "frontend\node_modules" (
        echo AZIONE RICHIESTA:
        echo   1. cd frontend
        echo   2. npm install
        echo   3. cd ..
        echo   4. check-dependencies.bat
        echo.
    )
    echo Risolvi gli errori prima di avviare l'app.
    echo.
    echo Vedi INSTALLAZIONE.md per istruzioni dettagliate.
    pause
    exit /b 1
)
