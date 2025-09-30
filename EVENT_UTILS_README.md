# Event and Session Utilities

Utilità TypeScript per la gestione di Eventi e Sessioni nella web app Racing Car Manager.

## File

- **models.ts**: Definizioni TypeScript dei tipi di dati (Event, Session, TimingSheet, SessionType)
- **eventUtils.ts**: Funzioni di utilità per gestire eventi e sessioni

## Funzioni Disponibili

### `generateId(prefix?: string): string`
Genera un ID univoco per sessioni/eventi usando timestamp e suffisso random.

**Parametri:**
- `prefix` (opzionale): Prefisso per l'ID (es. 'session', 'event')

**Esempio:**
```typescript
const sessionId = generateId('session');  // "session_1759262784176_fkg7my4"
const eventId = generateId('event');      // "event_1759262784177_abc123x"
```

### `getNextSessionNumber(event: Event, sessionType: SessionType): number`
Calcola la numerazione progressiva per tipologia sessione.

**Parametri:**
- `event`: L'evento contenente le sessioni esistenti
- `sessionType`: Il tipo di sessione (Test, FP1, FP2, FP3, Q, R1, R2, Endurance)

**Ritorna:** Il prossimo numero di sessione per quel tipo

**Esempio:**
```typescript
const nextFP1Number = getNextSessionNumber(event, 'FP1');  // 1, 2, 3, etc.
```

### `addSession(event: Event, sessionData: Partial<Session>): Event`
Aggiunge una sessione all'evento, aggiorna la numerazione automaticamente.

**Parametri:**
- `event`: L'evento a cui aggiungere la sessione
- `sessionData`: Dati parziali della sessione (sessionType richiesto)

**Ritorna:** Evento aggiornato con la nuova sessione

**Esempio:**
```typescript
event = addSession(event, {
  sessionType: 'FP1',
  duration: 60,
  fuelStart: 50.0,
  tireSet: 'Set#1',
  notes: 'Free Practice 1'
});
```

### `createEmptyTimingSheet(sessionId: string): TimingSheet`
Crea un foglio tempi vuoto per una sessione.

**Parametri:**
- `sessionId`: ID della sessione

**Ritorna:** Foglio tempi vuoto

**Esempio:**
```typescript
const timingSheet = createEmptyTimingSheet('session_123');
```

### `updateSession(event: Event, sessionId: string, updates: Partial<Session>): Event`
Aggiorna una sessione tramite ID.

**Parametri:**
- `event`: L'evento contenente la sessione
- `sessionId`: ID della sessione da aggiornare
- `updates`: Dati parziali da aggiornare

**Ritorna:** Evento aggiornato con la sessione modificata

**Esempio:**
```typescript
event = updateSession(event, sessionId, {
  fuelStart: 55.0,
  bestLapTime: '1:45.123',
  notes: 'Updated notes'
});
```

### `deleteSession(event: Event, sessionId: string): Event`
Rimuove una sessione dall'evento.

**Parametri:**
- `event`: L'evento contenente la sessione
- `sessionId`: ID della sessione da rimuovere

**Ritorna:** Evento aggiornato senza la sessione

**Esempio:**
```typescript
event = deleteSession(event, sessionId);
```

## Tipi di Sessione Supportati

- `Test`: Sessioni di test
- `FP1`, `FP2`, `FP3`: Free Practice 1, 2, 3
- `Q`: Qualifiche
- `R1`, `R2`: Gare 1 e 2
- `Endurance`: Gare di durata

## Note di Implementazione

- Gli ID sono generati automaticamente usando timestamp + suffisso random
- La numerazione delle sessioni è progressiva per tipo (es. FP1 #1, FP1 #2, FP1 #3)
- Ogni sessione ha un foglio tempi associato creato automaticamente
- I timestamp createdAt e updatedAt sono gestiti automaticamente
- Le funzioni sono immutabili: restituiscono nuovi oggetti senza modificare gli originali
