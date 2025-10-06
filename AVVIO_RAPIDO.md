# 🚀 Avvio Rapido - Racing Car Manager Desktop

## La Desktop App Non Parte? 👇

### Causa Più Comune
**Le dipendenze Node.js (Electron) non sono installate!**

### Soluzione in 3 Passi

#### 1️⃣ Verifica che Node.js e Python siano installati
```bash
node --version    # Deve essere >= 16
python --version  # Deve essere >= 3.9
```

Se mancano → [Installa Node.js](https://nodejs.org/) e [Python](https://www.python.org/downloads/)

#### 2️⃣ Installa le dipendenze (IMPORTANTE!)
```bash
cd frontend
npm install
cd ..
```

Attendi il completamento (~400MB, 2-5 minuti)

#### 3️⃣ Avvia l'app
**Windows:** Doppio click su `start-desktop.bat`
**Linux/Mac:** `./start-desktop.sh`

---

## 🔍 Script Utili

### Verifica Installazione Dipendenze
```bash
./check-dependencies.sh    # Linux/Mac
check-dependencies.bat     # Windows
```

Verifica che:
- ✅ Node.js e Python siano installati
- ✅ Electron sia installato
- ✅ Tutte le dipendenze siano presenti

### Valida Setup Completo
```bash
./validate-desktop-setup.sh    # Linux/Mac
validate-desktop-setup.bat     # Windows
```

Verifica che:
- ✅ Tutti i file del progetto siano presenti
- ✅ La struttura sia corretta
- ✅ Gli script siano eseguibili

---

## 📚 Documentazione Completa

- **[INSTALLAZIONE.md](INSTALLAZIONE.md)** ⭐ - Guida installazione dettagliata
- **[QUICK_START.md](QUICK_START.md)** - Guida rapida completa
- **[DESKTOP_APP_GUIDE.md](DESKTOP_APP_GUIDE.md)** - Manuale app desktop
- **[README.md](README.md)** - Panoramica progetto

---

## ❓ FAQ Rapide

### Devo installare Electron separatamente?
**No!** È incluso in `package.json`. Basta fare `npm install`.

### Quanto spazio serve?
~450MB totale (400MB frontend + 50MB backend)

### Devo reinstallare ogni volta?
**No!** Solo la prima volta o dopo aggiornamenti.

### L'installazione è lenta/bloccata
Electron è grande (~200MB). Con connessione lenta può richiedere 5-10 minuti. Attendi pazientemente.

### Ho installato ma continua a non funzionare / si pianta
1. **PRIMA**: Verifica dipendenze backend Python!
   ```bash
   cd backend
   python -m venv venv                    # Windows
   # oppure: python3 -m venv venv        # Linux/Mac
   venv\Scripts\activate.bat              # Windows
   # oppure: source venv/bin/activate    # Linux/Mac
   pip install -r requirements.txt
   cd ..
   ```
2. Verifica setup: `./check-dependencies.sh` (o `.bat` su Windows)
3. Se ancora non funziona, prova: `cd frontend && rm -rf node_modules && npm install`
4. Consulta [INSTALLAZIONE.md](INSTALLAZIONE.md) per troubleshooting dettagliato

---

## 🐛 Errori Comuni

| Errore | Causa | Soluzione |
|--------|-------|-----------|
| **L'app si pianta/crasha all'avvio** | Dipendenze Python non nel venv | `cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt` |
| `electron: command not found` | Dipendenze non installate | `cd frontend && npm install` |
| `Cannot find module 'electron'` | node_modules corrotto | `cd frontend && rm -rf node_modules && npm install` |
| `Python not found` | Python non installato | Installa da python.org |
| `Port 5000 already in use` | Backend già in esecuzione | Chiudi processi Python o cambia porta |

---

## 💡 Suggerimento

**Dopo la prima installazione**, crea un alias o shortcut per avviare rapidamente:

**Linux/Mac (.bashrc o .zshrc):**
```bash
alias racing='cd /path/to/trashbin && ./start-desktop.sh'
```

**Windows (crea shortcut):**
- Click destro su `start-desktop.bat` → Invia a → Desktop

---

**Hai ancora problemi?** Consulta [INSTALLAZIONE.md](INSTALLAZIONE.md) per la guida completa!
