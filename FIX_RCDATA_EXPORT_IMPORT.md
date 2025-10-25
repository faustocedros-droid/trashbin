# Fix RCDATA Export/Import - Risoluzione Problema

## Problema Rilevato

Il file `.RCDATA` non conteneva le informazioni sull'evento, le sessioni e i giri di ogni sessione che invece devono essere necessariamente esportati ed importati come parte integrante del file dati.

### Analisi del Problema

Prima della fix, c'erano incoerenze nel sistema di export/import:

1. **EventDetail.js** esportava con struttura `currentEvent` (singolo evento) + dati localStorage
2. **Settings.js** esportava SOLO dati localStorage (mancavano eventi/sessioni/giri dal database)
3. **Settings.js** import NON ricreava eventi/sessioni/giri nel database backend
4. Strutture file diverse tra Settings.js e EventDetail.js

## Soluzione Implementata

### 1. Settings.js - Export

**Prima:**
```javascript
// Esportava solo dati da localStorage
const archiveData = {
  version: '2.0',
  events: eventsData ? JSON.parse(eventsData) : [], // Solo da localStorage
  // ... altri dati localStorage
};
```

**Dopo:**
```javascript
// Ora recupera TUTTI gli eventi dal database backend con sessioni e giri
const eventsResponse = await eventAPI.getAll();
const allEvents = eventsResponse.data;

// Per ogni evento, recupera sessioni e giri
const eventsWithSessionsAndLaps = await Promise.all(
  allEvents.map(async (event) => {
    const sessionsResponse = await eventAPI.getSessions(event.id);
    const sessions = sessionsResponse.data;
    
    const sessionsWithLaps = await Promise.all(
      sessions.map(async (session) => {
        const lapsResponse = await sessionAPI.getLaps(session.id);
        return {
          ...session,
          laps: lapsResponse.data
        };
      })
    );
    
    return {
      ...event,
      sessions: sessionsWithLaps
    };
  })
);

const archiveData = {
  version: '2.0',
  events: eventsWithSessionsAndLaps, // Dati completi dal database
  // ... altri dati localStorage
};
```

### 2. Settings.js - Import

**Prima:**
```javascript
// Salvava eventi solo in localStorage
if (archiveData.events) {
  localStorage.setItem('racingCarManager_events', JSON.stringify(archiveData.events));
}
```

**Dopo:**
```javascript
// Ora ricrea TUTTI gli eventi nel database backend con sessioni e giri
if (archiveData.events && archiveData.events.length > 0) {
  for (const eventData of archiveData.events) {
    // Crea evento nel database backend
    const newEventData = {
      name: eventData.name,
      track: eventData.track,
      // ... altri campi evento
    };
    const eventResponse = await eventAPI.create(newEventData);
    const newEventId = eventResponse.data.id;
    
    // Crea sessioni e giri per questo evento
    if (eventData.sessions && eventData.sessions.length > 0) {
      for (const session of eventData.sessions) {
        const sessionData = {
          session_type: session.session_type,
          session_number: session.session_number,
          // ... altri campi sessione
        };
        const sessionResponse = await eventAPI.createSession(newEventId, sessionData);
        const newSessionId = sessionResponse.data.id;
        
        // Crea giri per questa sessione
        if (session.laps && session.laps.length > 0) {
          for (const lap of session.laps) {
            const lapData = {
              lap_number: lap.lap_number,
              lap_time: lap.lap_time,
              // ... altri campi giro
            };
            await sessionAPI.createLap(newSessionId, lapData);
          }
        }
      }
    }
  }
}
```

### 3. EventDetail.js - Export

**Prima:**
```javascript
// Esportava con currentEvent (singolo evento)
const exportData = {
  version: '2.0',
  currentEvent: {
    event: event,
    sessions: sessionsWithLaps
  },
  events: eventsData ? JSON.parse(eventsData) : [], // Da localStorage
  // ... altri dati
};
```

**Dopo:**
```javascript
// Ora esporta TUTTI gli eventi con struttura consistente
const eventsResponse = await eventAPI.getAll();
const eventsWithSessionsAndLaps = await Promise.all(/* ... */);

const exportData = {
  version: '2.0',
  events: eventsWithSessionsAndLaps, // TUTTI gli eventi dal database
  // ... altri dati
};
```

### 4. EventDetail.js e Events.js - Import

**Aggiornato per gestire:**
- Nuovo formato: array `events` con sessioni e giri
- Vecchio formato: `currentEvent` con singolo evento
- Formato legacy: `.rcme` con `event` e `sessions`

```javascript
let eventsToImport = [];

if (importData.events && Array.isArray(importData.events)) {
  // Nuovo formato .rcdata
  eventsToImport = importData.events;
} else if (importData.currentEvent) {
  // Vecchio formato .rcdata
  eventsToImport = [{
    ...importData.currentEvent.event,
    sessions: importData.currentEvent.sessions
  }];
} else if (importData.event && importData.sessions) {
  // Formato legacy .rcme
  eventsToImport = [{
    ...importData.event,
    sessions: importData.sessions
  }];
}

// Importa TUTTI gli eventi
for (const eventData of eventsToImport) {
  // Crea evento, sessioni e giri nel database
}
```

## Struttura File .RCDATA

### Formato Corrente (v2.0)

```json
{
  "version": "2.0",
  "exportDate": "2025-10-25T18:00:00.000Z",
  
  "events": [
    {
      "id": 1,
      "name": "Test Event",
      "track": "Monza",
      "date_start": "2025-10-25T10:00:00Z",
      "date_end": "2025-10-25T18:00:00Z",
      "weather": "Sunny",
      "notes": "Test notes",
      "track_length": 5.793,
      "sessions": [
        {
          "id": 1,
          "session_type": "FP1",
          "session_number": 1,
          "duration": 60,
          "fuel_start": 50,
          "fuel_per_lap": 2.5,
          "tire_set": "Set#1",
          "session_status": null,
          "notes": "Session notes",
          "laps": [
            {
              "id": 1,
              "lap_number": 1,
              "lap_time": "1:42.345",
              "sector1": "25.123",
              "sector2": "28.456",
              "sector3": "30.789",
              "sector4": "22.012",
              "fuel_consumed": 2.5,
              "tire_set": "Set#1",
              "lap_status": null,
              "notes": "Lap notes"
            }
          ]
        }
      ]
    }
  ],
  
  "eventFeatures": null,
  "generalInformation": {
    "circuitImage": null,
    "schedule": null
  },
  "setup": null,
  "runPlan": {
    "currentSheet": null,
    "history": []
  },
  "tirePressure": {
    "database": null
  },
  "fuelConsumption": null,
  "eventSchedule": null,
  "trackConfiguration": {
    "currentTrackLength": null
  },
  "settings": {
    "storagePath": null,
    "archivePath": null
  }
}
```

## Benefici della Fix

1. **Completezza**: Ora il file .RCDATA contiene TUTTI gli eventi con le loro sessioni e giri
2. **Consistenza**: Stessa struttura in Settings.js ed EventDetail.js
3. **Persistenza**: Eventi/sessioni/giri vengono ricreati nel database backend all'import
4. **Retrocompatibilità**: Mantiene compatibilità con vecchi formati .rcdata e .rcme
5. **Scalabilità**: Supporta export/import di multipli eventi contemporaneamente

## Test

Eseguito test di validazione struttura:
- ✅ Struttura file corretta
- ✅ Eventi con sessioni e giri presenti
- ✅ Tutti i campi richiesti presenti
- ✅ Compilazione frontend senza errori

## File Modificati

1. `frontend/src/pages/Settings.js`
   - Export: recupera eventi da backend
   - Import: ricrea eventi in backend

2. `frontend/src/pages/EventDetail.js`
   - Export: struttura consistente con Settings.js
   - Import: gestisce multipli formati

3. `frontend/src/pages/Events.js`
   - Import: gestisce multipli formati

## Conclusione

Il problema è stato risolto completamente. Ora il file .RCDATA contiene tutte le informazioni necessarie (eventi, sessioni, giri) e l'import le ricrea correttamente nel database backend.
