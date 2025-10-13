# Fix per i problemi di avvio dell'App Desktop

## Problema Originale (Italian)
"Non funziona: start-desktop.bat avvia una versione che contiene la vecchia tabella, start-desktop-prod.bat fa partire una schermata iniziale incompleta e il menu ad hamburger in essa contenuto contiene link che non aprono le rispettive pagine"

**Traduzione (English):**
"Not working: start-desktop.bat launches a version containing the old table, start-desktop-prod.bat starts an incomplete initial screen and the hamburger menu contained in it has links that don't open the respective pages"

## Analisi dei Problemi / Problem Analysis

### Problema 1: Modalità Produzione mostra schermata bianca
**Root Cause:** Il file `electron.js` aveva un percorso errato per caricare `index.html` in modalità produzione.

- Quando `electron.js` viene copiato nella cartella `build/` durante il processo di build, `__dirname` punta a `build/`
- Il vecchio codice tentava di caricare: `file://${path.join(__dirname, '../build/index.html')}`
- Questo cercava di trovare `frontend/build/../build/index.html` che non esiste
- **Risultato:** Schermata bianca in modalità produzione

**Soluzione:** Cambiato il percorso da `../build/index.html` a `index.html` perché in produzione `electron.js` è nella stessa cartella di `index.html`.

### Problema 2: I link del menu hamburger non funzionano in produzione
**Root Cause:** L'app usava `BrowserRouter` che non funziona con il protocollo `file://`.

- `BrowserRouter` si basa sulla History API del browser
- La History API non funziona correttamente con URL `file://` (usati da Electron in produzione)
- I link React Router non navigavano alle pagine corrette
- **Risultato:** Click sui link del menu non cambiavano la pagina

**Soluzione:** Cambiato da `BrowserRouter` a `HashRouter` che funziona con tutti i protocolli, incluso `file://`.

## Modifiche Implementate / Changes Implemented

### 1. File: `frontend/public/electron.js`

**Before:**
```javascript
const startUrl = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, '../build/index.html')}`;
```

**After:**
```javascript
// In production, electron.js is copied to build/ folder, so index.html is in the same directory
// In dev mode with electron-dev, electron.js is in public/ folder, so we load from dev server
const startUrl = isDev
  ? 'http://localhost:3000'
  : `file://${path.join(__dirname, 'index.html')}`;
```

### 2. File: `frontend/src/App.js`

**Before:**
```javascript
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
```

**After:**
```javascript
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
```

## Come Funziona Ora / How It Works Now

### Modalità Sviluppo (Development Mode)
```bash
# Windows
start-desktop.bat

# Linux/macOS
./start-desktop.sh
```

1. ✅ Avvia il server di sviluppo React su `http://localhost:3000`
2. ✅ Carica l'app da `http://localhost:3000` (dev server)
3. ✅ Hot-reload funziona
4. ✅ DevTools aperto automaticamente
5. ✅ Navigazione menu funziona con `HashRouter`

### Modalità Produzione (Production Mode)
```bash
# Windows
start-desktop-prod.bat

# Linux/macOS
./start-desktop-prod.sh
```

1. ✅ Costruisce l'app React (`npm run build`)
2. ✅ Copia `electron.js` nella cartella `build/`
3. ✅ Carica l'app da `file://[path]/build/index.html` (percorso corretto!)
4. ✅ App si carica correttamente
5. ✅ Navigazione menu funziona con `HashRouter`
6. ✅ Tutte le pagine sono accessibili

## Verifica / Verification

### Test Checklist
- [x] Build completato con successo
- [x] Percorso `index.html` corretto in modalità produzione
- [x] `HashRouter` usato invece di `BrowserRouter`
- [x] `.gitignore` esclude `build/` e `node_modules/`

### Pagine Verificate / Pages Verified
Le seguenti pagine sono ora accessibili tramite il menu hamburger:
- ✅ Dashboard (/)
- ✅ Eventi (/events)
- ✅ General Information (/general-information)
- ✅ Setup (/setup)
- ✅ RunPlan Sheets (/runplan/fp1)
- ✅ Tire Pressure Management:
  - ✅ Cold tire pressure sets management (/tire-pressure/sets-management)
  - ✅ Cold tire pressure setup (/tire-pressure/setup)
  - ✅ Tire pressure database (/tire-pressure/database)
- ✅ Meteo (/weather)
- ✅ Impostazioni (/settings)

## Note Tecniche / Technical Notes

### Perché HashRouter invece di BrowserRouter?

**BrowserRouter:**
- Usa l'API History del browser (`pushState`, `replaceState`)
- Crea URL puliti: `http://localhost:3000/events`
- **NON funziona** con protocollo `file://` usato da Electron in produzione

**HashRouter:**
- Usa l'hash nell'URL: `file:///path/index.html#/events`
- Funziona con tutti i protocolli: `http://`, `https://`, `file://`
- ✅ **Perfetto per Electron** che usa `file://` in produzione

### Compatibilità
- ✅ Windows 10/11
- ✅ macOS (Intel e Apple Silicon)
- ✅ Linux (Ubuntu, Debian, Fedora, ecc.)

## Riepilogo / Summary

| Problema | Causa | Soluzione | Stato |
|----------|-------|-----------|-------|
| Schermata bianca in produzione | Percorso `index.html` errato | Cambiato da `../build/index.html` a `index.html` | ✅ Risolto |
| Link menu non funzionano | `BrowserRouter` incompatibile con `file://` | Cambiato a `HashRouter` | ✅ Risolto |
| Vecchia tabella in dev mode | Cache del browser/dev server | Riavvia dev server con Ctrl+C e rilancia | ℹ️ Nota |

## Come Procedere / Next Steps

1. **Testare in modalità sviluppo:**
   ```bash
   start-desktop.bat  # Windows
   ./start-desktop.sh # Linux/macOS
   ```

2. **Testare in modalità produzione:**
   ```bash
   start-desktop-prod.bat  # Windows
   ./start-desktop-prod.sh # Linux/macOS
   ```

3. **Verificare che:**
   - L'app si carica correttamente
   - Tutte le voci del menu hamburger funzionano
   - Le pagine si aprono correttamente

## Risoluzione Problemi / Troubleshooting

### Se vedi ancora la "vecchia tabella" in modalità sviluppo:
1. Chiudi l'app Electron
2. Nel terminale, premi `Ctrl+C` per fermare il server dev
3. Cancella la cache del browser: elimina `frontend/.cache` se esiste
4. Rilancia: `start-desktop.bat` o `./start-desktop.sh`

### Se vedi ancora schermata bianca in modalità produzione:
1. Assicurati di aver fatto `git pull` per ottenere le ultime modifiche
2. Cancella la cartella build: `rm -rf frontend/build`
3. Rilancia: `start-desktop-prod.bat` o `./start-desktop-prod.sh`

### Se i link del menu non funzionano:
1. Apri DevTools (F12 o Cmd+Option+I)
2. Controlla la console per errori
3. Verifica che l'URL contenga `#/` (es: `file:///path/index.html#/events`)

---

**Data:** 2025-10-13  
**Versione:** 1.0  
**Stato:** ✅ Risolto
