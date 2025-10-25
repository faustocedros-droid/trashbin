# Guida di Installazione / Installation Guide

## Italiano

### Requisiti di Sistema
- Windows 10/11, macOS 10.14+, o Linux (Ubuntu 20.04+)
- 500 MB di spazio libero su disco
- Python 3.9 o superiore (verrà installato automaticamente se necessario)

### Installazione da Pacchetto Precompilato

#### Windows
1. Scarica il file `Racing-Car-Manager-Setup-x.x.x.exe`
2. Esegui il file di installazione
3. Segui le istruzioni dell'installer
4. L'applicazione verrà installata in `C:\Program Files\Racing Car Manager`
5. Un collegamento verrà creato sul Desktop e nel Menu Start

#### macOS
1. Scarica il file `Racing-Car-Manager-x.x.x.dmg`
2. Apri il file DMG
3. Trascina l'icona "Racing Car Manager" nella cartella Applicazioni
4. Avvia l'applicazione dalla cartella Applicazioni

#### Linux (Ubuntu/Debian)
1. Scarica il file `.deb` o `.AppImage`
2. Per .deb:
   ```bash
   sudo dpkg -i Racing-Car-Manager-x.x.x.deb
   sudo apt-get install -f  # Installa eventuali dipendenze mancanti
   ```
3. Per AppImage:
   ```bash
   chmod +x Racing-Car-Manager-x.x.x.AppImage
   ./Racing-Car-Manager-x.x.x.AppImage
   ```

### Primo Avvio

Al primo avvio, l'applicazione:
1. Verificherà la presenza di Python
2. Creerà automaticamente l'ambiente virtuale per il backend
3. Installerà le dipendenze necessarie
4. Avvierà il server backend e l'interfaccia web

**Nota**: Il primo avvio potrebbe richiedere alcuni minuti per l'installazione delle dipendenze.

### Configurazione Python (se necessario)

Se Python non è installato:

**Windows:**
- Scarica Python da [python.org](https://www.python.org/downloads/)
- Durante l'installazione, seleziona "Add Python to PATH"

**macOS:**
```bash
brew install python3
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install python3 python3-venv python3-pip
```

### Avvio Manuale del Backend

Se il backend non si avvia automaticamente:

**Windows:**
```batch
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Linux/macOS:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

---

## English

### System Requirements
- Windows 10/11, macOS 10.14+, or Linux (Ubuntu 20.04+)
- 500 MB free disk space
- Python 3.9 or higher (will be installed automatically if needed)

### Installation from Prebuilt Package

#### Windows
1. Download the `Racing-Car-Manager-Setup-x.x.x.exe` file
2. Run the installer
3. Follow the installation wizard
4. The application will be installed to `C:\Program Files\Racing Car Manager`
5. A shortcut will be created on Desktop and Start Menu

#### macOS
1. Download the `Racing-Car-Manager-x.x.x.dmg` file
2. Open the DMG file
3. Drag the "Racing Car Manager" icon to the Applications folder
4. Launch the application from Applications

#### Linux (Ubuntu/Debian)
1. Download the `.deb` or `.AppImage` file
2. For .deb:
   ```bash
   sudo dpkg -i Racing-Car-Manager-x.x.x.deb
   sudo apt-get install -f  # Install any missing dependencies
   ```
3. For AppImage:
   ```bash
   chmod +x Racing-Car-Manager-x.x.x.AppImage
   ./Racing-Car-Manager-x.x.x.AppImage
   ```

### First Launch

On first launch, the application will:
1. Check for Python installation
2. Automatically create a virtual environment for the backend
3. Install required dependencies
4. Start the backend server and web interface

**Note**: First launch may take a few minutes for dependency installation.

### Python Configuration (if needed)

If Python is not installed:

**Windows:**
- Download Python from [python.org](https://www.python.org/downloads/)
- During installation, select "Add Python to PATH"

**macOS:**
```bash
brew install python3
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install python3 python3-venv python3-pip
```

### Manual Backend Startup

If the backend doesn't start automatically:

**Windows:**
```batch
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Linux/macOS:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

## Troubleshooting / Risoluzione Problemi

### L'applicazione non si avvia / Application won't start
- Verifica che Python 3.9+ sia installato: `python --version` o `python3 --version`
- Controlla i log nella console dell'applicazione
- Prova a riavviare il computer

### Il backend non risponde / Backend not responding
- Assicurati che la porta 5000 non sia occupata da altri programmi
- Verifica che l'ambiente virtuale sia stato creato correttamente in `backend/venv`

### Errori di connessione / Connection errors
- Controlla il firewall e assicurati che permetta l'accesso a localhost:5000
- Prova a disabilitare temporaneamente l'antivirus

## Supporto / Support

Per problemi o domande, apri una issue su GitHub:
https://github.com/faustocedros-droid/trashbin/issues
