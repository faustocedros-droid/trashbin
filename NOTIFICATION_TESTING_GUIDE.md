# Guida al Test delle Notifiche Push per Sessioni

## Panoramica

Questa guida spiega come testare il nuovo sistema di notifiche push che avvisa l'utente 10 e 5 minuti prima dell'inizio delle sessioni programmate.

## Funzionalità Implementate

✅ **Notifiche Push Native**: Utilizza le notifiche native di Electron per mostrare avvisi di sistema
✅ **Notifiche In-App**: Mostra anche notifiche visibili nell'applicazione stessa
✅ **Funzionamento Globale**: Le notifiche funzionano su qualsiasi pagina dell'applicazione
✅ **Funzionamento in Background**: Le notifiche appaiono anche quando l'app è ridotta a icona
✅ **Avvisi Temporizzati**: Notifiche a 10 e 5 minuti prima di ogni sessione programmata

## Come Testare

### Preparazione

1. **Avvia l'applicazione Desktop**
   ```bash
   # Da Windows
   start-desktop.bat
   
   # Da Linux/macOS
   ./start-desktop.sh
   ```

2. **Accedi alla pagina Eventi**
   - Clicca su "Eventi" nella barra di navigazione
   - Dovresti vedere l'orologio e la tabella delle sessioni sotto di esso

### Test 1: Configurazione delle Sessioni

1. **Inserisci i dati delle sessioni nella tabella**:
   - Nella prima colonna "Sessione", inserisci nomi significativi (es. "Free Practice 1", "Qualifiche", "Gara")
   - Nella seconda colonna "Orario", inserisci orari di test

2. **Esempio di configurazione**:
   - Sessione 1: "Test Notifica 10 min" - Orario: [ora corrente + 11 minuti]
   - Sessione 2: "Test Notifica 5 min" - Orario: [ora corrente + 6 minuti]

### Test 2: Verifica Notifiche su Pagina Eventi

1. **Rimani sulla pagina Eventi**
2. **Aspetta l'orario previsto**:
   - A 10 minuti prima: Dovresti vedere una notifica arancione
   - A 5 minuti prima: Dovresti vedere una notifica rossa
3. **Verifica le notifiche**:
   - ✅ Notifica push di sistema (fuori dall'app)
   - ✅ Notifica in-app (in alto a destra)

### Test 3: Verifica Notifiche su Altre Pagine

1. **Configura le sessioni come nel Test 2**
2. **Naviga a una pagina diversa** (es. Dashboard, Setup, Meteo)
3. **Aspetta l'orario previsto**
4. **Verifica che le notifiche appaiono**:
   - ✅ Le notifiche in-app appaiono in alto a destra su qualsiasi pagina
   - ✅ Le notifiche push di sistema appaiono ugualmente

### Test 4: Verifica Notifiche con App Ridotta a Icona

1. **Configura le sessioni come nel Test 2**
2. **Riduci l'applicazione a icona** (minimizza la finestra)
3. **Aspetta l'orario previsto**
4. **Verifica le notifiche di sistema**:
   - ✅ Le notifiche push di sistema appaiono anche quando l'app è minimizzata
   - ✅ Cliccando sulla notifica, l'app torna in primo piano

### Test 5: Test Rapido (Per Developer)

Per testare rapidamente senza aspettare minuti:

1. **Modifica temporaneamente il codice** in `frontend/src/services/notificationService.js`:
   ```javascript
   // Cambia da:
   if (diffMinutes <= 10 && diffMinutes >= 9 && !this.checkedTimes.has(key10)) {
   
   // A (per test immediato):
   if (diffMinutes <= 10 && diffMinutes >= 0 && !this.checkedTimes.has(key10)) {
   ```

2. **Configura una sessione con orario tra 1-10 minuti**
3. **Le notifiche appariranno immediatamente**

**NOTA**: Ricordati di ripristinare il codice originale dopo il test!

## Comportamento Atteso

### Notifica a 10 minuti
- **Titolo**: "Avviso Sessione - 10 minuti"
- **Testo**: "⚠️ Attenzione: Mancano 10 minuti alla sessione '[Nome Sessione]' alle ore [Orario]"
- **Colore In-App**: Arancione (#ff9800)
- **Urgenza**: Normale

### Notifica a 5 minuti
- **Titolo**: "AVVISO URGENTE - 5 minuti"
- **Testo**: "⚠️ AVVISO URGENTE: Mancano 5 minuti alla sessione '[Nome Sessione]' alle ore [Orario]"
- **Colore In-App**: Rosso (#d32f2f)
- **Urgenza**: Critica

## Caratteristiche Tecniche

### Persistenza
- Le sessioni sono salvate in `localStorage`
- Le notifiche continuano a funzionare anche dopo il riavvio dell'app
- Ogni notifica viene mostrata una sola volta

### Tempistiche
- Il sistema controlla ogni 60 secondi
- Le notifiche a 10 minuti appaiono tra 9 e 10 minuti prima
- Le notifiche a 5 minuti appaiono tra 4 e 5 minuti prima

### Auto-dismissal
- Le notifiche in-app si chiudono automaticamente dopo 30 secondi
- Possono anche essere chiuse manualmente cliccando sulla "X"

## Risoluzione Problemi

### Le notifiche non appaiono?

1. **Verifica le autorizzazioni del sistema**:
   - Su Windows: Controlla le impostazioni delle notifiche
   - Su macOS: Preferenze di Sistema > Notifiche > Racing Car Manager
   - Su Linux: Controlla il notification daemon (notifyd)

2. **Verifica la console del browser**:
   - Apri DevTools (F12)
   - Cerca errori nella console
   - Verifica che `window.electron.showNotification` sia definito

3. **Verifica i dati delle sessioni**:
   - Gli orari devono essere nel formato HH:MM
   - Le sessioni devono avere un nome (opzionale ma consigliato)

4. **Verifica che l'app sia in esecuzione in modalità Desktop**:
   - Le notifiche push funzionano solo in Electron, non nel browser web

## Note per lo Sviluppo

### File Modificati
- `frontend/src/services/notificationService.js` - Servizio di notifiche globale
- `frontend/src/App.js` - Gestione notifiche a livello app
- `frontend/src/components/ScheduleTable.js` - Rimossa logica notifiche locale
- `frontend/public/electron.js` - Aggiunto handler IPC per notifiche
- `frontend/public/preload.js` - Esposta API notifiche in modo sicuro

### Architettura
```
ScheduleTable (salva in localStorage)
    ↓
App.js (monitora localStorage)
    ↓
NotificationService (controlla orari)
    ↓
Electron IPC → Notification API di sistema
    ↓
Notifica Push mostrata all'utente
```

## Conclusione

Il sistema di notifiche è ora completamente operativo e funziona:
- ✅ Su tutte le pagine dell'applicazione
- ✅ Anche quando l'app è ridotta a icona
- ✅ Con notifiche native del sistema operativo
- ✅ Con notifiche in-app visibili e dismissibili

Buon test! 🏎️
