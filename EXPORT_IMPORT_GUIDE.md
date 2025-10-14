# Guida Export/Import dei Dati

## Panoramica

Tutte le sezioni dell'applicazione Racing Car Manager ora supportano l'esportazione e l'importazione dei dati tramite file JSON. Questo permette di:

- **Backup dei dati**: Salvare tutti i dati locali su file
- **Trasferimento dati**: Spostare dati tra diversi dispositivi/browser
- **Condivisione**: Condividere setup e configurazioni con altri utenti
- **Ripristino**: Ripristinare dati precedenti in caso di perdita

## Sezioni con Export/Import

### 1. Setup (`/setup`)

**File**: `.setup`

**Contenuto**:
- Metadati (vettura, circuito, evento, data)
- Parametri di setup completi (asse anteriore/posteriore, ammortizzatori, aero, freni, ecc.)

**Come usare**:
1. Inserisci i dati di setup nella tabella
2. Clicca su **💾 Esporta** per salvare su file
3. Usa **📂 Importa** per caricare un file `.setup` salvato in precedenza

**Persistenza**: I dati vengono salvati automaticamente nel localStorage del browser

---

### 2. General Information (`/general-information`)

**File**: `.geninfo`

**Contenuto**:
- Immagine del circuito (in formato Base64)
- Tabella schedule settimanale (7 giorni x 15 righe)

**Come usare**:
1. Carica un'immagine del circuito
2. Compila la tabella schedule
3. Clicca su **💾 Esporta Dati** per salvare su file
4. Usa **📂 Importa Dati** per caricare un file `.geninfo` salvato

**Persistenza**: Sia l'immagine che lo schedule vengono salvati automaticamente nel localStorage

---

### 3. Tire Pressure Database (`/tire-pressure/database`)

**File**: `.tpdb`

**Contenuto**:
- Tutte le entry di pressioni (pressioni a freddo/caldo, temperature, giri, set gomme)
- Tabella sessioni
- Lunghezza percorso

**Come usare**:
1. Aggiungi entry con i dati delle pressioni
2. Configura la lunghezza del percorso
3. Clicca su **💾 Esporta** per salvare su file
4. Usa **📂 Importa** per caricare un file `.tpdb` salvato

**Persistenza**: Le entry e la tabella sessioni vengono salvate automaticamente nel localStorage

---

### 4. Tire Pressure Setup (`/tire-pressure/setup`)

**File**: `.tpsetup`

**Contenuto**:
- Tutti i parametri di input organizzati in matrici 2x2
- Target Hot Pressure
- Parametri di scaling
- Temperature ambiente e pista
- Compensazioni

**Come usare**:
1. Inserisci tutti i valori nelle matrici 2x2
2. Clicca su **💾 Esporta** per salvare su file
3. Usa **📂 Importa** per caricare un file `.tpsetup` salvato

**Persistenza**: I dati vengono salvati automaticamente nel localStorage ad ogni modifica

---

### 5. Tire Pressure Sets Management (`/tire-pressure/sets-management`)

**File**: `.tpsets`

**Contenuto**:
- Dati di input (temperature, pressioni hot/cold)
- Risultati dei calcoli (se già calcolati)

**Come usare**:
1. Inserisci i valori di temperatura e pressione
2. Clicca su **Calcola** per ottenere i risultati
3. Clicca su **💾 Esporta** per salvare su file
4. Usa **📂 Importa** per caricare un file `.tpsets` salvato

**Persistenza**: I dati e i risultati vengono salvati automaticamente nel localStorage dopo ogni calcolo

---

## Formato dei File

Tutti i file sono in formato JSON e contengono:

```json
{
  "version": "1.0",
  "exportDate": "2025-10-14T07:46:13.683Z",
  "...": "dati specifici della sezione"
}
```

### Vantaggi del formato JSON:
- ✅ Leggibile da umani
- ✅ Facilmente editabile con editor di testo
- ✅ Compatibile con strumenti di versioning (Git)
- ✅ Supporta strutture dati complesse

---

## Estensioni File

Ogni sezione usa un'estensione file specifica per facilitare l'identificazione:

| Sezione | Estensione | Descrizione |
|---------|-----------|-------------|
| Setup | `.setup` | Configurazione setup vettura |
| General Info | `.geninfo` | Immagine circuito + schedule |
| Tire Pressure DB | `.tpdb` | Database pressioni complete |
| Tire Pressure Setup | `.tpsetup` | Setup pressioni (parametri) |
| Tire Pressure Sets | `.tpsets` | Gestione set pressioni |
| RunPlan | `.rpln` | Piano di gara (già esistente) |
| Event | `.rcme` | Export eventi completi (già esistente) |

---

## Workflow Consigliato

### Backup Periodico
1. Alla fine di ogni sessione di lavoro, esporta i dati di tutte le sezioni
2. Salva i file in una cartella dedicata (es. `Backup_YYYY-MM-DD/`)
3. Opzionalmente, carica su cloud storage (OneDrive, Google Drive, ecc.)

### Condivisione Setup
1. Esporta il file `.setup` con la configurazione
2. Invia il file al collega/team
3. Il destinatario usa **📂 Importa** per caricare i dati

### Cambio Dispositivo
1. Esporta tutti i dati dal vecchio dispositivo
2. Sul nuovo dispositivo, importa tutti i file uno per uno
3. I dati saranno ripristinati come prima

---

## Note Tecniche

### localStorage vs File
- **localStorage**: Dati salvati automaticamente nel browser (limitato a ~5-10MB)
- **File Export**: Backup permanente senza limiti di dimensione
- I due sistemi lavorano insieme: localStorage per il lavoro quotidiano, file per backup/condivisione

### Sicurezza dei Dati
- I file esportati contengono tutti i dati in chiaro
- Non condividere file con dati sensibili
- I file salvati localmente sono sicuri quanto il tuo filesystem

### Compatibilità
- I file sono compatibili tra diversi browser
- I file sono compatibili tra Windows, Mac e Linux
- La versione è inclusa per futura compatibilità con aggiornamenti

---

## Risoluzione Problemi

### Importazione fallita
- **Messaggio**: "File non valido: struttura dati mancante"
- **Causa**: File corrotto o formato errato
- **Soluzione**: Verifica che il file sia un file JSON valido e contenga i dati corretti

### Dati non salvati
- **Causa**: localStorage disabilitato o pieno
- **Soluzione**: 
  1. Abilita i cookie/localStorage nel browser
  2. Pulisci dati vecchi se lo storage è pieno
  3. Usa export manuale per backup

### File troppo grande
- **Causa**: L'immagine del circuito è troppo grande
- **Soluzione**: Riduci la dimensione dell'immagine prima di caricarla (consigliato max 1-2MB)

---

## Esempi Pratici

### Esempio 1: Backup Completo Weekend di Gara

```bash
# Crea cartella per il backup
mkdir Backup_Monza_2025-10-15

# Esporta da ogni sezione:
# - Setup → setup_Monza_2025-10-15.setup
# - General Info → general_info_2025-10-15.geninfo
# - Tire Pressure DB → tire_pressure_db_2025-10-15.tpdb
# - Tire Pressure Setup → tire_pressure_setup_2025-10-15.tpsetup
# - Tire Pressure Sets → tire_pressure_sets_2025-10-15.tpsets
# - RunPlan → runplan_Monza_Race1.rpln
# - Event → event_Monza_2025.rcme

# Tutti i file vanno nella cartella Backup_Monza_2025-10-15/
```

### Esempio 2: Condivisione Setup con Team

1. **Membro A** configura setup ottimale
2. **Membro A** esporta file `.setup`
3. **Membro A** invia file via email/WhatsApp
4. **Membro B** importa file nella sua app
5. **Membro B** ha lo stesso setup di **Membro A**

---

## Aggiornamenti Futuri

Possibili estensioni:
- 📤 Export/Import multiplo (batch)
- ☁️ Sincronizzazione cloud automatica
- 📊 Comparazione tra diversi setup
- 🔄 Merge intelligente di dati da più file
- 📝 Note e annotazioni nei file export

---

## Supporto

Per problemi o domande:
1. Verifica questa guida
2. Controlla i log della console (F12 → Console)
3. Apri una issue su GitHub con:
   - Descrizione del problema
   - Browser e versione
   - File che causa l'errore (se possibile)
