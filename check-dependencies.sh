#!/bin/bash
# Script di verifica installazione dipendenze

# Change to script directory
cd "$(dirname "$0")"

echo "=========================================="
echo "Verifica Installazione Dipendenze"
echo "Racing Car Manager Desktop App"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Verifica Node.js
echo "1. Verifica Node.js..."
echo "----------------------------------------"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js installato: $NODE_VERSION"
    
    # Verifica versione
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -ge 16 ]; then
        echo "✓ Versione Node.js adeguata (>= 16)"
    else
        echo "⚠ Versione Node.js bassa (richiesta >= 16, trovata $NODE_VERSION)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "✗ Node.js NON installato"
    echo "  Scarica da: https://nodejs.org/"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Verifica npm
echo "2. Verifica npm..."
echo "----------------------------------------"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm installato: v$NPM_VERSION"
else
    echo "✗ npm NON installato (dovrebbe essere incluso con Node.js)"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Verifica Python
echo "3. Verifica Python..."
echo "----------------------------------------"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✓ Python installato: $PYTHON_VERSION"
    
    # Verifica versione
    PYTHON_MAJOR=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1)
    PYTHON_MINOR=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f2)
    if [ "$PYTHON_MAJOR" -ge 3 ] && [ "$PYTHON_MINOR" -ge 9 ]; then
        echo "✓ Versione Python adeguata (>= 3.9)"
    else
        echo "⚠ Versione Python bassa (richiesta >= 3.9, trovata $PYTHON_VERSION)"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "✗ Python 3 NON installato"
    echo "  Scarica da: https://www.python.org/downloads/"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Verifica dipendenze frontend
echo "4. Verifica dipendenze frontend..."
echo "----------------------------------------"
if [ -d "frontend/node_modules" ]; then
    echo "✓ Cartella node_modules esiste"
    
    # Verifica Electron
    if [ -d "frontend/node_modules/electron" ]; then
        echo "✓ Electron installato"
        
        # Prova a ottenere la versione
        if [ -f "frontend/node_modules/electron/package.json" ]; then
            ELECTRON_VERSION=$(grep '"version"' frontend/node_modules/electron/package.json | head -1 | cut -d'"' -f4)
            echo "  Versione: v$ELECTRON_VERSION"
        fi
    else
        echo "✗ Electron NON installato"
        echo "  Esegui: cd frontend && npm install"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Verifica altre dipendenze chiave
    for dep in "concurrently" "cross-env" "wait-on" "electron-builder"; do
        if [ -d "frontend/node_modules/$dep" ]; then
            echo "✓ $dep installato"
        else
            echo "✗ $dep NON installato"
            ERRORS=$((ERRORS + 1))
        fi
    done
else
    echo "✗ Cartella node_modules NON esiste"
    echo ""
    echo "  ⚠️  DEVI INSTALLARE LE DIPENDENZE!"
    echo ""
    echo "  Esegui questi comandi:"
    echo "    cd frontend"
    echo "    npm install"
    echo "    cd .."
    echo ""
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Verifica file essenziali
echo "5. Verifica file essenziali..."
echo "----------------------------------------"
if [ -f "frontend/package.json" ]; then
    echo "✓ package.json esiste"
else
    echo "✗ package.json mancante"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "frontend/public/electron.js" ]; then
    echo "✓ electron.js esiste"
else
    echo "✗ electron.js mancante"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "frontend/public/preload.js" ]; then
    echo "✓ preload.js esiste"
else
    echo "✗ preload.js mancante"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Riepilogo
echo "=========================================="
echo "RIEPILOGO"
echo "=========================================="
echo "Errori:   $ERRORS"
echo "Warning:  $WARNINGS"
echo ""

if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo "✅ Tutti i controlli superati!"
        echo ""
        echo "L'app desktop è pronta per l'avvio."
        echo ""
        echo "Per avviare l'app, esegui:"
        echo "  ./start-desktop.sh"
        exit 0
    else
        echo "⚠️  Installazione completa con avvisi."
        echo ""
        echo "L'app dovrebbe funzionare, ma potresti voler risolvere gli avvisi."
        echo ""
        echo "Per avviare l'app, esegui:"
        echo "  ./start-desktop.sh"
        exit 0
    fi
else
    echo "❌ Installazione incompleta!"
    echo ""
    if [ ! -d "frontend/node_modules" ]; then
        echo "AZIONE RICHIESTA:"
        echo "  1. cd frontend"
        echo "  2. npm install"
        echo "  3. cd .."
        echo "  4. ./check-dependencies.sh"
        echo ""
    fi
    echo "Risolvi gli errori prima di avviare l'app."
    echo ""
    echo "Vedi INSTALLAZIONE.md per istruzioni dettagliate."
    exit 1
fi
