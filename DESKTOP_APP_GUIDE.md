# Racing Car Manager - Desktop App Guide

## Overview

Racing Car Manager è ora disponibile come **applicazione desktop** oltre alla versione web. L'app desktop offre tutti i vantaggi di un'applicazione nativa mantenendo integralmente l'aspetto e le funzionalità della web app.

## Vantaggi dell'App Desktop

### Rispetto alla Web App
- **✅ Nessun browser necessario**: App standalone che si avvia direttamente
- **✅ Icona nel desktop**: Facile accesso dall'icona del desktop o dal menu Start
- **✅ Menu nativo**: Menu dell'applicazione integrato nel sistema operativo
- **✅ Scorciatoie da tastiera**: Shortcut globali per funzioni comuni
- **✅ Offline ready**: Funziona senza connessione internet (backend locale)
- **✅ Prestazioni migliori**: Ottimizzazione per ambiente desktop
- **✅ Gestione finestre**: Ridimensionamento, minimizzazione, fullscreen nativo
- **✅ Integrazione OS**: Notifiche native, menu contestuali, drag & drop

### Aspetto e Funzionalità Preservate
- ✅ Interfaccia utente identica al 100%
- ✅ Tutti i componenti React funzionano esattamente come nella web app
- ✅ Stesso backend Flask con API RESTful
- ✅ Stesso database SQLite
- ✅ Tutte le funzionalità di gestione eventi, sessioni, pneumatici
- ✅ Grafici e visualizzazioni identiche
- ✅ Stessi calcoli e formule

## Requisiti di Sistema

### Windows
- Windows 10 o superiore (64-bit)
- Python 3.9 o superiore
- Node.js 16 o superiore
- 4 GB RAM minimo
- 500 MB spazio su disco

### macOS
- macOS 10.13 (High Sierra) o superiore
- Python 3.9 o superiore
- Node.js 16 o superiore
- 4 GB RAM minimo
- 500 MB spazio su disco

### Linux
- Ubuntu 18.04 o superiore (o equivalente)
- Python 3.9 o superiore
- Node.js 16 o superiore
- 4 GB RAM minimo
- 500 MB spazio su disco

## Installazione e Avvio

### Modalità Sviluppo (per testare)

#### Windows
```bash
# Doppio click su:
start-desktop.bat

# Oppure da terminale:
start-desktop.bat
```

#### macOS/Linux
```bash
# Da terminale:
./start-desktop.sh

# Oppure:
bash start-desktop.sh
```

Lo script automaticamente:
1. Verifica Python e Node.js
2. Crea l'ambiente virtuale Python
3. Installa le dipendenze backend
4. Installa le dipendenze frontend
5. Avvia il backend Flask
6. Avvia l'app Electron

### Build App per Distribuzione

#### Windows (crea installer .exe)
```bash
cd frontend
npm install
npm run electron-build
```

Troverai l'installer in: `frontend/dist/Racing Car Manager Setup.exe`

#### macOS (crea .dmg)
```bash
cd frontend
npm install
npm run electron-build
```

Troverai il .dmg in: `frontend/dist/Racing Car Manager.dmg`

#### Linux (crea .AppImage e .deb)
```bash
cd frontend
npm install
npm run electron-build
```

Troverai i pacchetti in: `frontend/dist/`

#### Build per Tutte le Piattaforme
```bash
cd frontend
npm install
npm run electron-build-all
```

**Nota**: Il build cross-platform potrebbe richiedere configurazioni aggiuntive.

## Struttura Tecnica

### Architettura Desktop App

```
┌─────────────────────────────────────────┐
│     Electron Main Process               │
│  (Gestione finestra, menu, backend)     │
└────────────┬────────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
┌────▼─────┐    ┌────▼─────────────────┐
│  Flask   │    │   Electron Renderer  │
│  Backend │◄───┤   (React Frontend)   │
│  (Python)│    │   (Chromium)         │
└──────────┘    └──────────────────────┘
```

### File Principali

```
trashbin/
├── start-desktop.bat          # Launcher Windows
├── start-desktop.sh           # Launcher macOS/Linux
│
├── backend/                   # Backend invariato
│   ├── app.py                # Flask API
│   ├── models.py             # Database models
│   └── ...
│
└── frontend/
    ├── package.json          # Aggiunte dipendenze Electron
    │
    ├── public/
    │   ├── electron.js       # Electron main process
    │   └── preload.js        # Preload script (security)
    │
    └── src/                  # React app (invariata)
        ├── App.js
        ├── pages/
        └── ...
```

## Menu dell'Applicazione

### File
- **Nuovo Evento** (Ctrl+N / Cmd+N): Crea un nuovo evento
- **Impostazioni** (Ctrl+, / Cmd+,): Apri impostazioni
- **Esci** (Ctrl+Q / Cmd+Q): Chiudi applicazione

### Modifica
- Standard: Annulla, Ripeti, Taglia, Copia, Incolla, Seleziona Tutto

### Visualizza
- **Dashboard** (Ctrl+D / Cmd+D): Vai alla dashboard
- **Eventi** (Ctrl+E / Cmd+E): Vai agli eventi
- **Gestione Pressioni Gomme** (Ctrl+T / Cmd+T): Vai alle pressioni
- **Ricarica** (Ctrl+R / Cmd+R): Ricarica la pagina
- **Strumenti Sviluppatore** (F12): DevTools per debugging
- **Zoom**: Controlli zoom
- **Schermo Intero** (F11): Toggle fullscreen

### Finestra
- **Minimizza**: Minimizza finestra
- **Chiudi**: Chiudi finestra

### Aiuto
- **Informazioni**: Info sull'app

## Funzionalità Desktop

### 1. Avvio Automatico Backend
Il backend Flask viene avviato automaticamente quando apri l'app desktop. Non è necessario avviarlo manualmente.

### 2. Gestione Database Locale
Il database SQLite è salvato localmente:
- **Sviluppo**: `backend/racing.db`
- **Produzione**: Nella cartella dati dell'utente

### 3. Persistenza Dati
Tutti i dati sono salvati localmente sul tuo computer:
- Eventi
- Sessioni
- Dati pneumatici
- Setup
- Impostazioni

### 4. Modalità Offline
L'app funziona completamente offline poiché backend e frontend sono in esecuzione localmente.

## Migrazione da Web App

Se hai già utilizzato la web app e vuoi migrare i dati all'app desktop:

1. **Copia il database**:
   ```bash
   # Il database è lo stesso file
   cp backend/racing.db [percorso-nuovo]
   ```

2. **Esporta/Importa dati** (se necessario):
   - Usa le funzionalità di archivio per esportare
   - Importa nell'app desktop

3. **Impostazioni**:
   - Le impostazioni localStorage del browser non sono automaticamente migrate
   - Riconfigura le impostazioni nell'app desktop

## Troubleshooting

### L'app non si avvia

**Windows**:
```bash
# Verifica installazione Python
python --version

# Verifica installazione Node.js
node --version

# Reinstalla dipendenze
cd frontend
rmdir /s /q node_modules
npm install
```

**macOS/Linux**:
```bash
# Verifica installazione Python
python3 --version

# Verifica installazione Node.js
node --version

# Reinstalla dipendenze
cd frontend
rm -rf node_modules
npm install
```

### Backend non risponde

1. Chiudi completamente l'app
2. Verifica che nessun processo Python sia in esecuzione:
   - Windows: Task Manager → Termina processo python.exe
   - Mac/Linux: `killall python3`
3. Riavvia l'app

### Errori di build

```bash
# Pulisci e reinstalla
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run electron-build
```

### Porta 5000 già in uso

Se vedi errore "Port 5000 is already in use":

**Windows**:
```bash
# Trova processo sulla porta 5000
netstat -ano | findstr :5000
# Termina il processo (usa PID dall'output)
taskkill /PID [PID] /F
```

**macOS/Linux**:
```bash
# Trova e termina processo sulla porta 5000
lsof -ti:5000 | xargs kill -9
```

### DevTools non si aprono

Premi `F12` o vai su Menu → Visualizza → Strumenti Sviluppatore

## Aggiornamenti

### Aggiornare l'App Desktop

Per aggiornare a una nuova versione:

1. **Scarica nuova versione** dal repository
2. **Backup database**:
   ```bash
   cp backend/racing.db backup_racing.db
   ```
3. **Aggiorna codice**:
   ```bash
   git pull origin main
   ```
4. **Reinstalla dipendenze**:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ../frontend
   npm install
   ```
5. **Riavvia app**

## Differenze con Web App

| Caratteristica | Web App | Desktop App |
|----------------|---------|-------------|
| Avvio | Browser + 2 terminali | Doppio click |
| Backend | Manuale | Automatico |
| Menu | In-app | Nativo OS |
| Icona | Bookmark | Desktop/Start |
| Offline | No | Sì |
| Shortcut | Limited | Globali |
| Notifiche | Browser | Sistema |
| Installazione | Nessuna | Una volta |

## Prestazioni

### Requisiti Risorse

**Sviluppo**:
- RAM: ~300-400 MB
- CPU: Basso utilizzo
- Disco: ~500 MB

**Produzione** (app compilata):
- RAM: ~200-300 MB
- CPU: Basso utilizzo
- Disco: ~150-200 MB (app installata)

### Ottimizzazioni

L'app desktop include:
- ✅ Code splitting automatico
- ✅ Asset caching
- ✅ Lazy loading componenti
- ✅ Database locale veloce (SQLite)
- ✅ Nessuna latenza di rete (localhost)

## Supporto

Per problemi o domande:
1. Consulta questo documento
2. Verifica i log dell'applicazione
3. Apri un issue su GitHub

## Roadmap Future

Funzionalità in sviluppo per l'app desktop:

- [ ] Auto-update integrato
- [ ] Notifiche desktop per eventi importanti
- [ ] Sistema tray con quick actions
- [ ] Export report in PDF nativo
- [ ] Backup automatico schedulato
- [ ] Import dati da Excel (drag & drop)
- [ ] Sincronizzazione OneDrive integrata
- [ ] Dark mode
- [ ] Temi personalizzabili

## Licenza

Private project for racing team use.

---

**Racing Car Manager Desktop App v0.1.0**  
© 2025 - Sistema di Gestione Vettura da Gara
