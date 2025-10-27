# Quick Start - Timing Monitor

## Avvio Rapido (5 minuti)

Questa guida ti mostrerà come configurare e utilizzare il Timing Monitor in pochi minuti.

### Passo 1: Avviare l'Applicazione

**Desktop App (Raccomandato):**
```bash
# Linux/macOS
./start-desktop.sh

# Windows
start-desktop.bat
```

**Manuale:**
```bash
# Terminal 1 - Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

### Passo 2: Accedere al Timing Monitor

1. Apri il browser all'indirizzo: http://localhost:3000
2. Clicca su **"Timing Monitor"** nel menu principale

### Passo 3: Test con il Monitor di Esempio

1. Apri il file `sample_timing_monitor.html` in un browser
2. Copia l'URL dalla barra degli indirizzi (esempio: `file:///path/to/sample_timing_monitor.html`)
3. Nell'applicazione, clicca su **"Add Timing Monitor"**
4. Compila il form:
   - **Nome**: "Test Monitor"
   - **URL**: incolla l'URL copiato
   - **Intervallo**: 5 secondi
5. Clicca su **"Create"**

### Passo 4: Avviare il Monitoraggio

1. Seleziona "Test Monitor" dalla lista
2. Clicca sul pulsante **Play** (▶)
3. Dopo pochi secondi vedrai i dati apparire nella tabella

### Passo 5: Visualizzare i Dati

La tabella mostrerà:
- Posizione di ogni pilota
- Numero di gara
- Nome pilota
- Giri completati
- Tempo ultimo giro
- Miglior tempo sul giro
- Gap dal leader
- Stato

I dati si aggiorneranno automaticamente ogni 2 secondi!

## Utilizzo con un Timing Monitor Reale

### Monitor Compatibili

Il sistema funziona con la maggior parte dei timing monitor web-based che:
- Utilizzano tabelle HTML per visualizzare i dati
- Sono accessibili pubblicamente (o con credenziali configurate)
- Hanno una struttura dati consistente

### Configurazione

1. Trova l'URL del timing monitor della tua gara
2. Crea un nuovo monitor nell'applicazione
3. Imposta un intervallo di polling appropriato (5-10 secondi raccomandati)
4. Avvia il monitoraggio
5. I dati verranno automaticamente estratti e salvati

### Esempi di Timing Monitor Popolari

- Alfatiming
- RaceTiming
- LiveRC
- MyLaps
- ...altri sistemi che usano HTML standard

## Risoluzione Problemi Rapida

**Nessun dato viene visualizzato:**
- Verifica che l'URL sia corretto
- Controlla che il monitoraggio sia avviato (icona verde)
- Aspetta almeno un intervallo di polling

**Errore di connessione:**
- Verifica che il backend sia in esecuzione
- Controlla http://localhost:5000/api/health

**Dati incompleti:**
- Il parser automatico potrebbe non riconoscere la struttura del sito
- Contatta il supporto per assistenza nella personalizzazione

## Prossimi Passi

- Leggi la guida completa: [TIMING_MONITOR_GUIDE.md](TIMING_MONITOR_GUIDE.md)
- Esplora le altre funzionalità dell'applicazione
- Configura monitor per le tue gare reali
- Analizza i dati storici salvati nel database

## Supporto

Per domande o problemi, apri un issue su GitHub o contatta il team di sviluppo.

---

**Buone gare! 🏎️💨**
