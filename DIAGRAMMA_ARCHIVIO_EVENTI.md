# Diagramma Archivio Eventi - Flusso Dati

## Esportazione Evento (💾)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RACING CAR MANAGER APP                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   Database   │    │ localStorage │    │ localStorage │        │
│  │   Backend    │    │  (Sezione 1) │    │  (Sezione 2) │  ...   │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘        │
│         │                   │                    │                 │
│         │                   │                    │                 │
│         ▼                   ▼                    ▼                 │
│  ┌─────────────────────────────────────────────────────┐          │
│  │         handleExportEvent()                         │          │
│  │                                                     │          │
│  │  1. Fetch sessions + laps from DB                  │          │
│  │  2. Read 12 localStorage keys                      │          │
│  │  3. Combine into JSON structure                    │          │
│  │  4. Create .rcme file                              │          │
│  └─────────────────────┬───────────────────────────────┘          │
│                        │                                           │
└────────────────────────┼───────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  event_Nome_Date.rcme │ ◄──── SALVATAGGIO SU PC
              │                      │
              │ {                    │
              │   event: {...},      │
              │   sessions: [...],   │
              │   localStorage: {    │
              │     runPlans,        │
              │     tirePressure,    │
              │     setup,           │
              │     circuitImage,    │
              │     schedule,        │
              │     fuelConsumption, │
              │     ...              │
              │   }                  │
              │ }                    │
              └──────────────────────┘
```

## Importazione Evento (📂)

```
              ┌──────────────────────┐
              │  event_Nome_Date.rcme │ ◄──── CARICAMENTO DA PC
              │                      │
              │ Version: 3.0 o 2.0   │
              └──────────┬───────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        RACING CAR MANAGER APP                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────┐          │
│  │         handleImportEvent()                         │          │
│  │                                                     │          │
│  │  1. Parse JSON file                                │          │
│  │  2. Detect version (3.0 / 2.0)                     │          │
│  │  3. Show confirmation dialog                       │          │
│  │  4. Create event in DB                             │          │
│  │  5. Create sessions + laps in DB                   │          │
│  │  6. Restore ALL localStorage data                  │          │
│  └─────────────┬───────────────────┬───────────────────┘          │
│                │                   │                               │
│                ▼                   ▼                               │
│  ┌──────────────────┐    ┌──────────────────────┐                │
│  │   Database       │    │   localStorage       │                │
│  │   Backend        │    │   (12 chiavi)        │                │
│  │                  │    │                      │                │
│  │ • Event (new)    │    │ • runPlanHistory     │                │
│  │ • Sessions       │    │ • runPlanCurrent     │                │
│  │ • Laps           │    │ • tirePressureDB     │                │
│  │                  │    │ • tireSessionTable   │                │
│  │                  │    │ • tireSetsManagement │                │
│  │                  │    │ • tirePressureSetup  │                │
│  │                  │    │ • setup              │                │
│  │                  │    │ • circuitImage       │                │
│  │                  │    │ • schedule           │                │
│  │                  │    │ • fuelConsumption    │                │
│  │                  │    │ • eventFeatures      │                │
│  │                  │    │ • trackLength        │                │
│  └──────────────────┘    └──────────────────────┘                │
│                                                                     │
│  ✅ TUTTI I DATI RIPRISTINATI                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Copertura Dati Completa

```
┌─────────────────────────────────────────────────────────┐
│                    FILE .rcme                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📁 EVENT DATA (Database Backend)                      │
│     ├─ Event metadata                                  │
│     ├─ Sessions (Test, FP1, Q, R1, R2, Endurance)     │
│     └─ Laps (4 sectors, fuel, tires, status, notes)   │
│                                                         │
│  💾 LOCALSTORAGE DATA (12 Sezioni)                     │
│     │                                                   │
│     ├─ 🏁 RUN PLAN                                     │
│     │   ├─ History (tutti i piani salvati)            │
│     │   └─ Current (piano corrente)                   │
│     │                                                   │
│     ├─ 🛞 TIRE PRESSURE                                │
│     │   ├─ Database (tutte le entry)                  │
│     │   ├─ Session Table                              │
│     │   ├─ Sets Management                            │
│     │   └─ Setup                                       │
│     │                                                   │
│     ├─ 🔧 SETUP                                        │
│     │   └─ Complete vehicle setup data                │
│     │                                                   │
│     ├─ 🏎️ CIRCUIT INFO                                 │
│     │   ├─ Circuit image (Base64)                     │
│     │   └─ Weekly schedule                            │
│     │                                                   │
│     ├─ ⛽ FUEL CONSUMPTION                             │
│     │   └─ Calculation data                           │
│     │                                                   │
│     ├─ 📄 EVENT FEATURES                               │
│     │   └─ Document file paths                        │
│     │                                                   │
│     └─ ⚙️ CONFIG                                        │
│         └─ Track length                                │
│                                                         │
│  📅 METADATA                                            │
│     ├─ Export date                                     │
│     └─ Version (3.0)                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Workflow Tipico

```
┌────────────┐
│  FASE 1:   │  Lavoro evento (sessioni, setup, pressioni, ecc.)
│  LAVORO    │  ↓
└────────────┘  Tutti i dati nelle rispettive sezioni

┌────────────┐
│  FASE 2:   │  Click "💾 Esporta Evento"
│  ESPORTA   │  ↓
└────────────┘  File .rcme creato con TUTTI i dati

┌────────────┐
│  FASE 3:   │  Salvataggio file in:
│  SALVA     │  • Computer locale
└────────────┘  • Cloud (OneDrive/Google Drive)
                • USB per condivisione team

┌────────────┐
│  FASE 4:   │  Su altro computer/browser:
│  IMPORTA   │  Click "📂 Importa Evento"
└────────────┘  Selezione file .rcme

┌────────────┐
│  FASE 5:   │  Conferma importazione
│  CONFERMA  │  (vedi lista completa dati)
└────────────┘  ↓

┌────────────┐
│  FASE 6:   │  TUTTI i dati ripristinati!
│  COMPLETO  │  • Evento con sessioni e giri
└────────────┘  • Setup, pressioni, run plans
                • Immagini, schedule, documenti
                • Pronto per continuare il lavoro
```

## Scenari d'Uso

### 🏁 Scenario 1: Weekend di Gara
```
Venerdì    │ Test + Setup    │ → Lavoro normale
Sabato     │ Qualifiche      │ → Lavoro normale  
Domenica   │ Gare            │ → Lavoro normale
────────────────────────────────────────────────
Domenica   │ FINE EVENTO     │ → 💾 ESPORTA
Sera       │                 │   ✅ Archivio completo salvato!
```

### 👥 Scenario 2: Condivisione Team
```
Ingegnere A  │ Trova setup    │ → Lavoro setup ottimale
             │ perfetto       │ → 💾 Esporta evento
             │                │ → 📧 Invia file .rcme al team
──────────────────────────────────────────────────────────
Ingegnere B  │ Riceve file    │ → 📂 Importa evento
             │                │ → ✅ Stesso setup disponibile!
Ingegnere C  │ Riceve file    │ → 📂 Importa evento
             │                │ → ✅ Stesso setup disponibile!
```

### 💻 Scenario 3: Cambio Computer
```
PC Vecchio   │ Tutti gli      │ → 💾 Esporta tutti eventi
             │ eventi         │ → 💾 Salva su USB/Cloud
──────────────────────────────────────────────────────────
PC Nuovo     │ App installata │ → 📂 Importa tutti .rcme
             │                │ → ✅ Tutti i dati ripristinati!
```

### 📊 Scenario 4: Analisi Storica
```
Anno 2024    │ 10 eventi su   │ → 💾 Tutti esportati
             │ Monza          │ → 💾 Archivio organizzato
──────────────────────────────────────────────────────────
Anno 2025    │ Nuovo evento   │ → 📂 Importa 2024 eventi
             │ Monza          │ → 📊 Confronta tempi
             │                │ → 📈 Analizza progressione
```

## Vantaggi Chiave

```
┌──────────────────────────────────────────────┐
│  ✅ UN FILE = TUTTO                          │
│     Non serve esportare sezione per sezione │
│                                              │
│  ✅ PORTABILITÀ TOTALE                       │
│     Sposta dati ovunque senza perdite       │
│                                              │
│  ✅ CONDIVISIONE FACILE                      │
│     Un file da inviare via email/chat       │
│                                              │
│  ✅ BACKUP COMPLETO                          │
│     Sicurezza dati al 100%                  │
│                                              │
│  ✅ ARCHIVIO STORICO                         │
│     Conserva cronologia completa eventi     │
│                                              │
│  ✅ RIPRISTINO RAPIDO                        │
│     Import = tutto torna come prima         │
│                                              │
│  ✅ RETROCOMPATIBILE                         │
│     Funziona con vecchi file v2.0           │
└──────────────────────────────────────────────┘
```

---
**Versione:** 1.0
**Data:** 2025-10-20
**Formato File:** v3.0
