# Guida Risoluzione Problemi - Desktop App

## Problema: La finestra si apre e si chiude senza messaggi di errore

### Sintomi
- Tutti i test di `diagnose-desktop.bat` vengono passati
- Quando si lancia `start-desktop.bat`, la finestra si apre brevemente
- La finestra si chiude dopo l'installazione dell'ambiente Python
- Non appare alcun messaggio di errore visibile

### Causa
Questo problema si verifica quando l'applicazione Electron si avvia ma il backend Flask non riesce a partire correttamente. L'errore viene mostrato nella console ma potrebbe non essere visibile se la finestra si chiude troppo rapidamente.

### Soluzione

#### Passo 1: Esegui il diagnosi completo
```bash
diagnose-desktop.bat
```

Assicurati che tutti i test passino. Se ci sono errori, seguire le istruzioni mostrate.

#### Passo 2: Avvia in modalità debug
Invece di usare `start-desktop.bat`, esegui manualmente i seguenti comandi per vedere tutti i messaggi:

**Windows:**
```bash
# Apri il prompt dei comandi e naviga alla directory del progetto
cd path\to\trashbin

# Configura il backend
cd backend
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt

# Testa il backend manualmente
python app.py
```

Se il backend si avvia correttamente, dovresti vedere:
```
 * Running on http://0.0.0.0:5000
```

Se vedi un errore, questo è il problema da risolvere.

#### Passo 3: Problemi comuni del backend

**Errore: ModuleNotFoundError**
```
ModuleNotFoundError: No module named 'flask'
```
**Soluzione:**
```bash
cd backend
call venv\Scripts\activate.bat
pip install -r requirements.txt
```

**Errore: Porta già in uso**
```
OSError: [Errno 98] Address already in use
```
**Soluzione:** Un altro processo sta usando la porta 5000. Chiudilo o cambia porta:
```bash
# Windows - trova il processo sulla porta 5000
netstat -ano | findstr :5000
# Poi termina il processo (sostituisci PID con il numero trovato)
taskkill /PID <numero> /F
```

**Errore: Virtual environment non trovato**
Se l'ambiente virtuale non si crea:
```bash
# Assicurati che Python sia installato
python --version

# Reinstalla venv
cd backend
rmdir /s /q venv
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
```

#### Passo 4: Testa il frontend
In una **nuova** finestra del prompt dei comandi:

```bash
cd frontend
npm install
npm start
```

Il server di sviluppo React dovrebbe avviarsi su `http://localhost:3000`.

#### Passo 5: Avvia Electron manualmente
Con il backend ancora in esecuzione nel primo terminale, in un **terzo** terminale:

```bash
cd frontend
npm run electron
```

Questo avvierà Electron connesso al backend già in esecuzione.

### Verifica dei log

I messaggi di errore sono stampati nella console. Per vederli:

1. **Non chiudere** la finestra del prompt dei comandi dopo aver eseguito `start-desktop.bat`
2. Se la finestra si chiude automaticamente, esegui il comando tenendo premuto **Shift** e facendo clic destro sul file, poi seleziona "Esegui come amministratore"
3. Oppure, apri un prompt dei comandi manualmente e digita:
   ```bash
   start-desktop.bat
   ```

### Controllo approfondito

Se i passaggi precedenti non risolvono il problema, esegui questa diagnostica completa:

```bash
# Verifica Python
python --version
python -c "import sys; print(sys.executable)"

# Verifica Node.js
node --version
npm --version

# Verifica struttura del progetto
dir backend
dir frontend

# Verifica dipendenze backend
cd backend
call venv\Scripts\activate.bat
python -c "import flask; print('Flask:', flask.__version__)"
python -c "import flask_cors; print('Flask-CORS: OK')"
call deactivate
cd ..

# Verifica dipendenze frontend
cd frontend
npm list electron
npm list react-scripts
cd ..
```

### Richiesta di supporto

Se il problema persiste dopo aver seguito tutti i passaggi, raccogli le seguenti informazioni:

1. Output di `diagnose-desktop.bat`
2. Output quando esegui `python backend\app.py` manualmente
3. Versione di Python: `python --version`
4. Versione di Node.js: `node --version`
5. Sistema operativo e versione
6. Screenshot di eventuali messaggi di errore

Quindi apri un issue su GitHub con queste informazioni.

---

## Altri problemi comuni

### L'app si blocca durante l'avvio
- Attendere almeno 60 secondi per il primo avvio
- Il server React dev potrebbe impiegare tempo per compilare
- Controllare la CPU/RAM - potrebbe essere sovraccarico

### La finestra appare bianca
- Aprire DevTools (F12) per vedere errori JavaScript
- Verificare che il backend sia in esecuzione (http://localhost:5000/api/health)
- Controllare la console del browser per errori di rete

### Errore "Cannot find module"
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### L'app funziona ma non carica i dati
- Verificare che il database sia inizializzato
- Controllare i permessi dei file
- Vedere i log del backend nella console
