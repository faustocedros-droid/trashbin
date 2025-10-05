# Guida Installazione - Racing Car Manager Desktop App

## ⚠️ Problema Comune: "La desktop app non parte"

La causa più comune è che le dipendenze Node.js (incluso Electron) **non sono state installate**.

## ✅ Soluzione Rapida

### Passo 1: Verifica Prerequisiti

Assicurati di avere installato:

**Python 3.9+**
```bash
python --version
# oppure
python3 --version
```

**Node.js 16+**
```bash
node --version
npm --version
```

Se mancano, scaricali da:
- Python: https://www.python.org/downloads/
- Node.js: https://nodejs.org/

### Passo 2: Installa le Dipendenze

**IMPORTANTE**: Devi installare le dipendenze prima di avviare l'app!

```bash
# Vai nella cartella frontend
cd frontend

# Installa tutte le dipendenze (incluso Electron)
npm install
```

Questo comando installerà:
- ✅ Electron (il framework per app desktop)
- ✅ electron-builder (per creare installatori)
- ✅ concurrently (per gestire processi multipli)
- ✅ cross-env (per variabili d'ambiente cross-platform)
- ✅ wait-on (per attendere che il server sia pronto)
- ✅ React e tutte le altre dipendenze frontend

L'installazione può richiedere alcuni minuti (specialmente Electron che è grande ~200MB).

### Passo 3: Avvia l'App Desktop

Dopo aver installato le dipendenze, usa uno degli script di avvio:

**Windows:**
```bash
start-desktop.bat
```

**macOS/Linux:**
```bash
./start-desktop.sh
```

Lo script automaticamente:
1. ✓ Verifica Python e Node.js
2. ✓ Crea ambiente virtuale Python (se necessario)
3. ✓ Installa dipendenze backend (se necessario)
4. ✓ Installa dipendenze frontend (se necessario)
5. ✓ Avvia backend Flask
6. ✓ Avvia app Electron

## 🔍 Verifica Installazione

Puoi verificare che Electron sia installato correttamente:

```bash
cd frontend
npx electron --version
```

Dovrebbe mostrare la versione di Electron (es. `v28.0.0`).

Se vedi un errore, ripeti il Passo 2.

## 📝 Prima Installazione - Checklist Completa

- [ ] Installa Python 3.9+
- [ ] Installa Node.js 16+
- [ ] Clona o scarica il repository
- [ ] Apri terminale nella cartella del progetto
- [ ] Esegui `cd frontend`
- [ ] Esegui `npm install` (attendi il completamento)
- [ ] Torna alla cartella principale: `cd ..`
- [ ] Esegui lo script di avvio appropriato

## 🐛 Troubleshooting

### Errore: "electron: comando non trovato"

**Causa**: Le dipendenze non sono installate.

**Soluzione**:
```bash
cd frontend
npm install
```

### Errore: "Cannot find module 'electron'"

**Causa**: Le dipendenze non sono installate o sono corrotte.

**Soluzione**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Errore: "Python not found"

**Causa**: Python non è installato o non è nel PATH.

**Soluzione**:
1. Scarica Python da https://www.python.org/downloads/
2. Durante l'installazione, seleziona "Add Python to PATH"
3. Riavvia il terminale

### Errore: "Node.js not found"

**Causa**: Node.js non è installato o non è nel PATH.

**Soluzione**:
1. Scarica Node.js da https://nodejs.org/
2. Installa la versione LTS
3. Riavvia il terminale

### L'installazione si blocca o è molto lenta

**Causa**: Electron è un download grande (~200MB).

**Soluzione**:
- Attendi pazientemente (può richiedere 5-10 minuti con connessione lenta)
- Se si blocca, premi Ctrl+C e riprova
- Verifica la connessione internet

## 📚 Documentazione Aggiuntiva

- **[QUICK_START.md](QUICK_START.md)** - Guida rapida all'avvio
- **[DESKTOP_APP_GUIDE.md](DESKTOP_APP_GUIDE.md)** - Guida completa app desktop
- **[README.md](README.md)** - Panoramica del progetto

## ❓ FAQ

### Devo installare Electron separatamente?

**No!** Electron è incluso nelle dipendenze di `package.json`. Basta eseguire `npm install` nella cartella `frontend`.

### Devo installare le dipendenze ogni volta?

**No!** Le dipendenze vanno installate solo:
- La prima volta
- Dopo aver aggiornato il repository (se `package.json` è cambiato)
- Se cancelli la cartella `node_modules`

### Quanto spazio occupa?

- Dipendenze Node.js (frontend): ~400MB
- Dipendenze Python (backend): ~50MB
- Totale: ~450MB

### Posso usare yarn invece di npm?

Sì, puoi usare yarn:
```bash
cd frontend
yarn install
```

### Come disinstallo tutto?

```bash
# Rimuovi dipendenze frontend
cd frontend
rm -rf node_modules

# Rimuovi dipendenze backend
cd ../backend
rm -rf venv

# Rimuovi database (opzionale)
rm racing.db
```
