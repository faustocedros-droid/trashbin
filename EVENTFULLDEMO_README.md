# EventFullDemo Component

## Descrizione

Il componente `EventFullDemo.tsx` è una dimostrazione completa delle funzionalità di gestione sessioni e giri per il Racing Car Manager. Implementa tre funzionalità principali:

1. **Gestione Giri (Laps)**: Aggiungi, modifica ed elimina giri per ogni sessione
2. **Modifica Sessioni**: Modifica i dati generali di ogni sessione tramite form
3. **Persistenza Locale**: Salvataggio automatico in localStorage con persistenza dopo refresh

## Struttura File

Il componente utilizza tre file principali:

### 1. `models.ts`
Definisce i tipi TypeScript per l'applicazione:
- `Lap`: Rappresenta un singolo giro con tempo, carburante, gomme e note
- `Session`: Rappresenta una sessione con tipo, durata, carburante e array di giri
- `RaceEvent`: Rappresenta un evento con nome, circuito, date e array di sessioni
- `SessionFormData` e `LapFormData`: Tipi per i form di modifica

### 2. `eventUtils.ts`
Contiene le utility per la gestione del localStorage:
- `loadEventsFromStorage()`: Carica tutti gli eventi dal localStorage
- `saveEventsToStorage()`: Salva tutti gli eventi nel localStorage
- `loadEventFromStorage()`: Carica un singolo evento
- `saveEventToStorage()`: Salva/aggiorna un evento
- `updateSessionInStorage()`: Aggiorna una sessione specifica
- `addLapToSession()`: Aggiunge un giro a una sessione
- `updateLapInSession()`: Modifica un giro esistente
- `deleteLapFromSession()`: Elimina un giro
- `generateId()`: Genera ID univoci
- `calculateBestLapTime()`: Calcola il miglior tempo sul giro
- `calculateTotalFuelConsumed()`: Calcola il carburante totale consumato

### 3. `EventFullDemo.tsx`
Il componente React principale che implementa l'interfaccia utente.

## Funzionalità

### Gestione Giri

- **Aggiungi Giro**: Click sul pulsante "+ Aggiungi Giro" per aprire il form
  - Numero giro (auto-incrementato)
  - Tempo giro (formato MM:SS.mmm)
  - Carburante consumato in litri
  - Set gomme utilizzato
  - Note opzionali

- **Modifica Giro**: Click sul pulsante ✏️ per modificare un giro esistente
  
- **Elimina Giro**: Click sul pulsante 🗑️ per eliminare un giro (con conferma)

### Gestione Sessione

- **Modifica Sessione**: Click sul pulsante "✏️ Modifica" nella sezione dettagli sessione
  - Tipo sessione (Test, FP1, FP2, FP3, Q, R1, R2, Endurance)
  - Numero sessione
  - Durata in minuti
  - Carburante iniziale in litri
  - Set gomme
  - Note

- **Aggiungi Sessione**: Click sul pulsante "+ Nuova Sessione"

### Calcoli Automatici

Il componente calcola automaticamente:
- **Miglior Giro**: Il tempo più veloce tra tutti i giri della sessione
- **Carburante Consumato**: Somma del carburante consumato in tutti i giri
- **Numero Giri**: Conteggio totale dei giri completati

### Persistenza Dati

Tutti i dati sono salvati automaticamente nel localStorage del browser:
- Chiave: `racingCarManager_events`
- I dati rimangono disponibili dopo il refresh della pagina
- Non richiede connessione al backend

## Utilizzo

### Accesso al Componente

Il componente è accessibile all'URL `/demo` dopo aver avviato l'applicazione.

### Navigazione

Una voce "Demo" è stata aggiunta al menu principale della navbar.

### Esempio di Utilizzo

1. Aprire l'applicazione e navigare su `/demo`
2. Viene creato automaticamente un evento demo con una sessione di test
3. Aggiungere giri utilizzando il form "+ Aggiungi Giro"
4. Modificare i dettagli della sessione con il pulsante "✏️ Modifica"
5. I dati vengono salvati automaticamente e persistono dopo il refresh

## Tecnologie Utilizzate

- **React 18** con Hooks (useState, useEffect)
- **TypeScript** per type safety
- **localStorage API** per persistenza dati
- **CSS in linea** per styling (utilizzando le classi esistenti dell'app)

## Integrazione nel Progetto

Il componente è completamente standalone e non interferisce con:
- Le funzionalità esistenti della web app
- Il backend API (non fa chiamate HTTP)
- Gli altri componenti (Dashboard, Events, EventDetail)

Può essere utilizzato come:
- Demo delle funzionalità
- Prototipo per nuove features
- Tool offline per testing
- Base per future integrazioni con il backend

## Possibili Estensioni Future

- Integrazione con il backend API per sincronizzazione dei dati
- Export/import dei dati in formato JSON o Excel
- Grafici e statistiche sui giri
- Confronto tra sessioni diverse
- Gestione multi-evento (non solo demo)
- Filtri e ordinamenti avanzati per la tabella giri
