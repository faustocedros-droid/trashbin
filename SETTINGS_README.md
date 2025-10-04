# Settings - Documentazione

## Panoramica

La pagina **Impostazioni** (Settings) fornisce un'interfaccia dedicata per configurare le preferenze dell'applicazione, in particolare il percorso di archiviazione dei dati delle sessioni.

## Funzionalità

### 1. Configurazione Percorso di Archiviazione

Permette di specificare dove salvare i dati delle sessioni di gara:

- **localStorage del browser (default)**: I dati vengono salvati nel browser localmente
- **Percorso personalizzato**: Specifica un percorso del file system (es. `C:\RacingData` o `/Users/nome/RacingData`)

### 2. Informazioni di Sistema

Mostra in tempo reale:
- **Percorso Corrente**: Il percorso attualmente configurato
- **Modalità**: Browser Storage o File System
- **Backup**: Tipo di backup (automatico nel browser o manuale sul percorso specificato)

### 3. Gestione Impostazioni

- **Salva Percorso**: Salva il percorso specificato in localStorage
- **Ripristina Default**: Ripristina il percorso al default (localStorage)
- **Feedback visivo**: Messaggio di conferma dopo il salvataggio

## Utilizzo

### Configurare un Percorso Personalizzato

1. Navigare alla pagina Impostazioni dal menu principale
2. Inserire il percorso desiderato nel campo "Percorso di Archiviazione"
   - Windows: `C:\RacingData` o `D:\Racing\SessionData`
   - macOS/Linux: `/Users/nome/RacingData` o `/home/utente/racing`
3. Cliccare su "💾 Salva Percorso"
4. Verificare il messaggio di conferma
5. Le informazioni nella sezione "ℹ️ Informazioni" si aggiorneranno automaticamente

### Ripristinare le Impostazioni Default

1. Cliccare su "🔄 Ripristina Default"
2. Il percorso verrà rimosso e tornerà a utilizzare il localStorage del browser
3. Le informazioni si aggiorneranno mostrando "localStorage (default)"

## Archiviazione Dati

### localStorage (Default)

**Vantaggi:**
- Nessuna configurazione richiesta
- Backup automatico nel browser
- Accesso immediato ai dati

**Limitazioni:**
- I dati sono specifici del browser
- Rischio di perdita dati se si cancella la cache del browser
- Limite di archiviazione (tipicamente 5-10 MB)

### Percorso Personalizzato

**Vantaggi:**
- Controllo completo sul percorso di archiviazione
- Backup manuale più semplice
- Nessun limite di dimensione (dipende dal disco)
- I dati possono essere sincronizzati su OneDrive, Dropbox, etc.

**Limitazioni:**
- Richiede configurazione manuale
- Backup deve essere gestito dall'utente
- Il percorso deve essere accessibile dall'applicazione

## Chiave di Archiviazione

I dati vengono salvati in localStorage con la chiave:
```javascript
'racingCarManager_storagePath'
```

## Struttura del Codice

```javascript
// Caricamento del percorso salvato
const savedPath = localStorage.getItem(STORAGE_PATH_KEY);

// Salvataggio del percorso
localStorage.setItem(STORAGE_PATH_KEY, storagePath);

// Rimozione del percorso (reset)
localStorage.removeItem(STORAGE_PATH_KEY);
```

## Riferimenti

- File sorgente: `frontend/src/pages/Settings.js`
- Costante chiave: `STORAGE_PATH_KEY = 'racingCarManager_storagePath'`

## Possibili Estensioni Future

- Validazione del percorso inserito
- Test di accessibilità del percorso
- Integrazione con servizi cloud (OneDrive, Google Drive)
- Impostazioni tema (chiaro/scuro)
- Impostazioni unità di misura (bar/psi, °C/°F, km/h/mph)
- Impostazioni lingua (IT/EN)
- Export/import configurazioni
- Gestione backup automatici
- Sincronizzazione multi-dispositivo
