# Implementazione Notifiche Push per Sessioni

## Descrizione della Modifica

Questo PR implementa un sistema di notifiche push native per avvisare l'utente 10 e 5 minuti prima dell'inizio delle sessioni programmate nella tabella sotto l'orologio.

## Modifiche Principali

### 1. Nuovo Servizio di Notifiche Globale
**File**: `frontend/src/services/notificationService.js`

- Servizio singleton che monitora gli orari delle sessioni
- Controlla ogni 60 secondi se ci sono sessioni in arrivo
- Gestisce la logica temporale per le notifiche a 10 e 5 minuti
- Previene notifiche duplicate tramite tracking degli avvisi già inviati
- Permette il reset dei timer quando gli orari vengono modificati

### 2. Integrazione a Livello Applicazione
**File**: `frontend/src/App.js`

- Notifiche gestite globalmente a livello App invece che localmente in ScheduleTable
- Ascolto dei cambiamenti ai dati delle sessioni tramite eventi personalizzati
- Visualizzazione delle notifiche in-app su tutte le pagine
- Integrazione con le API di Electron per notifiche native

### 3. Supporto Electron per Notifiche Native
**File**: `frontend/public/electron.js`

- Handler IPC per ricevere richieste di notifiche dal processo renderer
- Utilizzo dell'API Notification di Electron per mostrare notifiche di sistema
- Configurazione urgenza critica per notifiche a 5 minuti
- Gestione del click sulle notifiche per portare l'app in primo piano

**File**: `frontend/public/preload.js`

- Esposizione sicura dell'API di notifiche al renderer tramite contextBridge
- Metodo `window.electron.showNotification(title, body)` disponibile globalmente

### 4. Refactoring Componente ScheduleTable
**File**: `frontend/src/components/ScheduleTable.js`

- Rimossa la logica di notifiche locale (ora gestita globalmente)
- Mantenuta la gestione della tabella e il salvataggio in localStorage
- Dispatch di eventi personalizzati quando i dati cambiano
- Reset dei timer di notifica quando un orario viene modificato

## Funzionalità Implementate

✅ **Notifiche Push Native di Sistema**
- Utilizzano l'API Notification di Electron
- Appaiono anche quando l'app è ridotta a icona
- Click sulla notifica porta l'app in primo piano

✅ **Notifiche In-App**
- Visibili in alto a destra su qualsiasi pagina
- Colore differenziato (arancione per 10 min, rosso per 5 min)
- Auto-dismissal dopo 30 secondi
- Possibilità di chiusura manuale

✅ **Funzionamento Globale**
- Le notifiche funzionano su qualsiasi pagina dell'applicazione
- Non è necessario rimanere sulla pagina Eventi

✅ **Persistenza**
- I dati delle sessioni sono salvati in localStorage
- Le notifiche continuano a funzionare dopo il riavvio dell'app

✅ **Tempistiche Precise**
- Notifica a 10 minuti: appare tra 9 e 10 minuti prima
- Notifica a 5 minuti: appare tra 4 e 5 minuti prima
- Ogni notifica viene mostrata una sola volta

## Architettura

```text
┌─────────────────────┐
│  ScheduleTable.js   │
│  (User Input)       │
└──────────┬──────────┘
           │ Salva in localStorage
           │ Dispatch evento 'scheduleDataChanged'
           ↓
┌─────────────────────┐
│      App.js         │
│  (Global Monitor)   │
└──────────┬──────────┘
           │ Carica dati, avvia monitoring
           ↓
┌─────────────────────────┐
│ notificationService.js  │
│ (Timer & Logic)         │
└──────────┬──────────────┘
           │ Controlla ogni 60s
           │ Trigger notifiche quando appropriato
           ↓
┌──────────────────────────┐
│  Dual Notification       │
├──────────────────────────┤
│ 1. In-App (React State) │
│ 2. Native (Electron IPC)│
└──────────────────────────┘
           │
           ↓
┌──────────────────────────┐
│ electron.js (Main)       │
│ Notification API         │
└──────────────────────────┘
           │
           ↓
     Sistema Operativo
   (Notifica Push Nativa)
```

## Testing

Consultare `NOTIFICATION_TESTING_GUIDE.md` per istruzioni dettagliate su come testare le notifiche.

### Test Rapido

1. Avvia l'app desktop: `./start-desktop.sh` o `start-desktop.bat`
2. Vai alla pagina "Eventi"
3. Inserisci una sessione con orario tra 6-11 minuti da ora
4. Aspetta e verifica le notifiche a 10 e 5 minuti
5. Prova a navigare su altre pagine e ridurre a icona l'app

## Compatibilità

- ✅ Windows
- ✅ macOS
- ✅ Linux
- ℹ️ Browser Web: Le notifiche in-app funzionano completamente. Le notifiche push native non sono disponibili nel browser per restrizioni di sicurezza del browser stesso - questo è un comportamento atteso.

**Nota**: Per la migliore esperienza con notifiche push native di sistema, utilizzare l'applicazione Desktop Electron.

## Sicurezza

- Utilizzo di `contextBridge` per esporre in modo sicuro le API di Electron
- Whitelist esplicita dei canali IPC consentiti
- Nessun `nodeIntegration` abilitato nel renderer
- `contextIsolation` attivo

## Performance

- Controllo ogni 60 secondi (basso impatto CPU)
- Notifiche duplicate prevenute tramite Set in memoria
- Auto-cleanup delle notifiche in-app dopo 30s
- Nessun polling continuo o listener pesanti

## Possibili Miglioramenti Futuri

- [ ] Suoni personalizzati per le notifiche
- [ ] Possibilità di snooze delle notifiche
- [ ] Configurazione intervalli di notifica personalizzabili
- [ ] Storico delle notifiche ricevute
- [ ] Notifiche per altri eventi (giri, pit stop, ecc.)
- [ ] Sincronizzazione notifiche multi-device

## Breaking Changes

Nessuno. La modifica è completamente retrocompatibile.

## Migration Guide

Non necessario. Le sessioni esistenti in localStorage continueranno a funzionare automaticamente.
