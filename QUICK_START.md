# Racing Car Manager - Quick Start Guide

## Scegli il Tuo Metodo di Utilizzo

Racing Car Manager può essere utilizzato in due modi:

### 1. 🖥️ App Desktop (Consigliato)
**Più semplice, tutto incluso, esperienza nativa**

### 2. 🌐 Web App (Tradizionale)
**Richiede due terminali, esecuzione in browser**

---

## 🖥️ Metodo 1: App Desktop (Consigliato)

### Requisiti
- ✅ Python 3.9+
- ✅ Node.js 16+

### Avvio Rapido

**Windows:**
```bash
# Doppio click su:
start-desktop.bat
```

**macOS/Linux:**
```bash
./start-desktop.sh
```

### Cosa Fa lo Script
1. ✅ Verifica Python e Node.js
2. ✅ Installa dipendenze backend (automatico)
3. ✅ Installa dipendenze frontend (automatico)
4. ✅ Avvia backend Flask (automatico)
5. ✅ Apre l'app desktop

### Vantaggi
- ✅ Un solo comando per avviare tutto
- ✅ Interfaccia desktop nativa
- ✅ Menu dell'applicazione integrati
- ✅ Scorciatoie da tastiera
- ✅ Nessun browser richiesto

📖 **Guida Completa**: [DESKTOP_APP_GUIDE.md](DESKTOP_APP_GUIDE.md)

---

## 🌐 Metodo 2: Web App (Tradizionale)

### Requisiti
- ✅ Python 3.9+
- ✅ Node.js 16+

### Passo 1: Avvia Backend

**Terminale 1:**
```bash
cd backend

# Crea ambiente virtuale (solo la prima volta)
python -m venv venv

# Attiva ambiente virtuale
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Installa dipendenze (solo la prima volta)
pip install -r requirements.txt

# Avvia server Flask
python app.py
```

Il backend sarà disponibile su `http://localhost:5000`

### Passo 2: Avvia Frontend

**Terminale 2:**
```bash
cd frontend

# Installa dipendenze (solo la prima volta)
npm install

# Avvia server React
npm start
```

Il frontend si aprirà automaticamente su `http://localhost:3000`

### Script Rapidi Esistenti

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
./start.sh
```

Questi script avviano il backend, ma **dovrai comunque** eseguire `cd frontend && npm start` in un altro terminale.

📖 **Guida Completa**: [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Confronto Metodi

| Caratteristica | Desktop App | Web App |
|----------------|-------------|---------|
| Comandi necessari | 1 | 2 |
| Terminali necessari | 0* | 2 |
| Browser richiesto | No | Sì |
| Menu nativi | Sì | No |
| Scorciatoie | Globali | Limited |
| Icona desktop | Sì | No |
| Avvio backend | Automatico | Manuale |

*L'app desktop si avvia con doppio click, senza terminale visibile

---

## Prima Installazione

### 1. Clona Repository
```bash
git clone https://github.com/faustocedros-droid/trashbin.git
cd trashbin
```

### 2. Verifica Requisiti

**Python:**
```bash
python --version
# o
python3 --version
```
Deve essere 3.9 o superiore

**Node.js:**
```bash
node --version
```
Deve essere 16 o superiore

### 3. Scegli il Metodo
- **Desktop App**: Esegui `start-desktop.bat` o `./start-desktop.sh`
- **Web App**: Segui i passi in "Metodo 2" sopra

---

## Funzionalità Principali

### Dashboard
- Panoramica eventi
- Statistiche rapide
- Attività recenti

### Gestione Eventi
- Crea/modifica/elimina eventi
- Informazioni circuito
- Dati meteo

### Gestione Sessioni
- Pianifica sessioni (Test, FP, Q, Race)
- Calcoli carburante
- Gestione set gomme
- Tempi sul giro

### Analisi Pneumatici
- Monitoraggio temperature
- Ottimizzazione pressioni
- Tracking usura
- Database pressioni

### Setup Vettura
- Parametri assetto
- Sospensioni
- Aerodinamica
- Confronto setup

---

## Problemi Comuni

### Python non trovato
```bash
# Installa Python 3.9+ da python.org
# Verifica installazione:
python --version
```

### Node.js non trovato
```bash
# Installa Node.js 16+ da nodejs.org
# Verifica installazione:
node --version
```

### Porta 5000 già in uso

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

**macOS/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Dipendenze non installate

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## Prossimi Passi

### Dopo l'Installazione

1. **Crea il Primo Evento**
   - Dashboard → Nuovo Evento
   - Inserisci dati circuito

2. **Pianifica Sessioni**
   - Evento → Aggiungi Sessione
   - Configura carburante e gomme

3. **Registra Dati**
   - Durante le sessioni registra:
     - Tempi sul giro
     - Pressioni gomme
     - Temperature
     - Note

4. **Analizza Risultati**
   - Visualizza grafici
   - Confronta sessioni
   - Ottimizza setup

### Esplora Funzionalità

- **Demo**: Vedi `http://localhost:3000/demo` (o Menu → Demo)
- **Impostazioni**: Configura percorsi archivio
- **Documentazione**: Leggi i file `.md` nella repository

---

## Build App per Distribuzione

### Desktop App Standalone

**Windows:**
```bash
build-desktop-windows.bat
```

**macOS/Linux:**
```bash
./build-desktop.sh
```

L'installer sarà in `frontend/dist/`

📖 **Dettagli**: [BUILD_CONFIG.md](BUILD_CONFIG.md)

---

## Documentazione Completa

- **[README.md](README.md)** - Panoramica progetto
- **[DESKTOP_APP_GUIDE.md](DESKTOP_APP_GUIDE.md)** - Guida completa app desktop
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment web app
- **[BUILD_CONFIG.md](BUILD_CONFIG.md)** - Configurazione build
- **[CONVERSION_GUIDE.md](CONVERSION_GUIDE.md)** - Conversione da Excel
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Struttura progetto

---

## Supporto

Per problemi o domande:
1. Consulta questa guida
2. Leggi la documentazione specifica
3. Controlla i log dell'applicazione
4. Apri un issue su GitHub

---

**Racing Car Manager v0.1.0**  
© 2025 - Sistema di Gestione Vettura da Gara
