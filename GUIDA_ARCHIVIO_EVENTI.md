# Guida all'Archivio Completo degli Eventi

## Panoramica

L'applicazione Racing Car Manager ora permette di **salvare ed archiviare completamente tutti i contenuti di un evento** in un singolo file, inclusi tutti i dati di tutte le sezioni e sottosezioni dell'applicazione.

Questo consente di:
- 📦 Creare un archivio completo di ogni evento
- 💾 Effettuare backup completi di tutti i dati
- 🔄 Trasferire eventi completi tra diversi computer/installazioni
- 👥 Condividere setup completi con il team
- 📊 Mantenere uno storico dettagliato di tutti gli eventi

## Come Funziona

### 1. Esportazione Evento Completo

**Dove:** Pagina dettaglio evento (`/events/:id`)

**Pulsante:** `💾 Esporta Evento`

**Cosa viene esportato:**
- ✓ **Dati evento**: Nome, circuito, date, meteo, note, lunghezza percorso
- ✓ **Sessioni**: Tutte le sessioni con le loro configurazioni
- ✓ **Giri**: Tutti i giri di ogni sessione con tempi completi (settori, carburante, gomme)
- ✓ **Run Plans**: Tutti i piani di gara salvati (storico + piano corrente)
- ✓ **Pressioni pneumatici**: Database completo, tabella sessioni, gestione set, configurazione setup
- ✓ **Setup vettura**: Tutti i dati di setup completi
- ✓ **Informazioni circuito**: Immagine del circuito e schedule settimanale
- ✓ **Consumo carburante**: Tutti i dati di calcolo del carburante
- ✓ **Event Features**: Percorsi dei file di documentazione
- ✓ **Configurazioni**: Lunghezza percorso e altre impostazioni

**File generato:** `.rcme` (Racing Car Manager Event) in formato JSON

**Nome file:** `event_NomeEvento_AAAA-MM-GG.rcme`

### 2. Importazione Evento Completo

**Dove:** 
- Pagina dettaglio evento (`/events/:id`)
- Pagina lista eventi (`/events`)

**Pulsante:** `📂 Importa Evento`

**Cosa viene importato:**
- ✓ Crea un nuovo evento con "(Importato)" nel nome
- ✓ Ricrea tutte le sessioni con le loro configurazioni
- ✓ Ricrea tutti i giri con i dati completi
- ✓ **Ripristina TUTTI i dati di localStorage** di tutte le sezioni
- ✓ Mostra un dialogo di conferma dettagliato con l'elenco di tutti i dati

**Compatibilità:** Supporta sia il formato v3.0 (completo) che v2.0 (legacy)

## Procedura Passo-Passo

### Esportare un Evento

1. Vai alla pagina di un evento (clicca sul nome dell'evento dalla lista)
2. Clicca il pulsante **💾 Esporta Evento** in alto a destra
3. Il browser scaricherà automaticamente il file `.rcme`
4. Salva il file in una posizione a tua scelta sul PC
5. Vedrai un messaggio di conferma con l'elenco dei dati esportati

**Esempio di messaggio:**
```
Evento esportato con successo!

Dati esportati:
- 3 sessioni con giri
- 5 RunPlans
- 12 entry pressioni
- Setup vettura
- Immagine circuito
- Schedule
- Consumo carburante
```

### Importare un Evento

1. Vai alla pagina eventi o a qualsiasi pagina dettaglio evento
2. Clicca il pulsante **📂 Importa Evento**
3. Seleziona il file `.rcme` dal tuo PC
4. Leggi il dialogo di conferma che mostra:
   - Nome evento
   - Numero di sessioni
   - Lista completa dei dati che verranno importati
5. Clicca **OK** per confermare
6. Attendi il completamento dell'importazione
7. Verrai reindirizzato alla lista eventi con il nuovo evento importato

**Esempio di dialogo di conferma:**
```
Vuoi importare l'evento "Race Imola 2025"?

Questo creerà un nuovo evento con 3 sessioni e tutti i loro giri.

Dati aggiuntivi da importare:
- 5 RunPlans
- Run Plan corrente
- 12 entry database pressioni
- Tabella sessioni pressioni
- Gestione set pressioni
- Setup pressioni
- Dati setup
- Immagine circuito
- Schedule settimanale
- Dati consumo carburante
- File paths documenti
- Lunghezza percorso
```

## Costruire un Archivio Eventi

### Struttura Consigliata

```
Archivio_Eventi/
├── 2025/
│   ├── 01_Gennaio/
│   │   ├── event_Test_Imola_2025-01-15.rcme
│   │   └── event_Test_Monza_2025-01-20.rcme
│   ├── 02_Febbraio/
│   │   └── event_Race_Mugello_2025-02-05.rcme
│   └── ...
├── 2024/
│   └── ...
└── README.txt  (note sugli eventi)
```

### Best Practices

1. **Nomenclatura file**: I file vengono automaticamente nominati con data e nome evento
2. **Backup regolari**: Esporta gli eventi dopo ogni sessione importante
3. **Organizzazione**: Crea cartelle per anno/mese o per circuito
4. **Note**: Mantieni un file di testo con note aggiuntive per ogni evento
5. **Cloud backup**: Sincronizza la cartella archivio con OneDrive/Google Drive/Dropbox
6. **Versioning**: I file includono la data di esportazione, utile per tracciare le modifiche

## Casi d'Uso

### 1. Backup Completo Weekend di Gara

**Scenario:** Fine weekend di gara, vuoi salvare tutti i dati

**Procedura:**
1. Esporta l'evento dalla pagina dettaglio
2. Salva il file in `Archivio_Eventi/2025/03_Marzo/`
3. Il file contiene TUTTO: sessioni, giri, setup, pressioni, immagini, ecc.

### 2. Condivisione Setup con il Team

**Scenario:** Hai trovato un setup ottimale e vuoi condividerlo

**Procedura:**
1. Esporta l'evento con tutti i dati
2. Invia il file `.rcme` ai membri del team via email/WhatsApp/Teams
3. I membri importano il file nella loro app
4. Tutti i dati (setup, pressioni, run plans) vengono ripristinati

### 3. Preparazione Nuovo Evento su Stesso Circuito

**Scenario:** Torni su un circuito già testato, vuoi ripartire dai dati precedenti

**Procedura:**
1. Cerca nell'archivio l'evento precedente sullo stesso circuito
2. Importa il file `.rcme`
3. Rinomina l'evento importato con la nuova data
4. Hai tutti i setup, pressioni e configurazioni come punto di partenza

### 4. Migrazione tra Computer

**Scenario:** Cambi computer o reinstalli il sistema

**Procedura:**
1. Sul vecchio computer: esporta tutti gli eventi
2. Copia i file `.rcme` su chiavetta USB o cloud
3. Sul nuovo computer: importa tutti i file
4. Tutti i dati sono ripristinati completamente

### 5. Analisi Storica

**Scenario:** Vuoi analizzare la progressione su un circuito nel tempo

**Procedura:**
1. Raccogli tutti i file `.rcme` dello stesso circuito
2. Importa uno alla volta
3. Confronta tempi, setup, consumo carburante
4. Identifica tendenze e miglioramenti

## Formato File

Il file `.rcme` è un file JSON leggibile. Puoi aprirlo con un editor di testo per vedere i dati.

**Struttura v3.0:**
```json
{
  "event": { ... },           // Metadati evento
  "sessions": [ ... ],        // Sessioni e giri
  "localStorage": {           // TUTTI i dati delle sezioni
    "runPlanHistory": [ ... ],
    "runPlanCurrent": { ... },
    "tirePressureDatabase": [ ... ],
    "setup": { ... },
    "circuitImage": "...",
    "schedule": [ ... ],
    "fuelConsumption": { ... },
    ...
  },
  "exportDate": "...",        // Data esportazione
  "version": "3.0"            // Versione formato
}
```

## Dimensione File

- **Eventi piccoli** (1-2 sessioni, pochi giri): ~50-100 KB
- **Eventi medi** (3-5 sessioni, molti giri): ~200-500 KB
- **Eventi grandi** (con immagine circuito): ~1-5 MB

Le immagini del circuito sono salvate in Base64, quindi occupano più spazio. Se non usi immagini, i file sono molto compatti.

## Domande Frequenti

**Q: Posso importare lo stesso evento più volte?**
A: Sì, ogni importazione crea un nuovo evento con "(Importato)" nel nome.

**Q: I dati importati sostituiscono quelli esistenti?**
A: No, i dati vengono **aggiunti** a quelli esistenti. Ad esempio, i RunPlans importati si aggiungono allo storico.

**Q: Posso modificare manualmente il file .rcme?**
A: Sì, è un file JSON testuale. Fai attenzione a mantenere la struttura corretta.

**Q: Cosa succede se importo un file v2.0 (vecchio formato)?**
A: L'app lo rileva automaticamente e importa i dati disponibili (runPlans e tirePressureDatabase).

**Q: Posso condividere file tra Windows, Mac e Linux?**
A: Sì, il formato JSON è compatibile su tutte le piattaforme.

**Q: I file sono compressi?**
A: No, sono JSON in chiaro per massima compatibilità. Puoi comprimerli in ZIP per risparmiare spazio.

## Risoluzione Problemi

### "File non valido: struttura dati mancante"
**Causa:** Il file è corrotto o non è un file .rcme valido
**Soluzione:** Verifica che il file sia un JSON valido e contenga almeno `event` e `sessions`

### "Errore durante l'esportazione"
**Causa:** Problema di connessione al database o localStorage pieno
**Soluzione:** Riprova o libera spazio nel localStorage del browser

### Importazione lenta
**Causa:** Evento con molte sessioni e giri
**Soluzione:** Attendi il completamento, l'importazione è sequenziale

### File molto grande
**Causa:** Immagine circuito ad alta risoluzione
**Soluzione:** Riduci la risoluzione dell'immagine prima di caricarla nel circuito

## Supporto

Per problemi o domande:
1. Consulta questa guida
2. Controlla la console del browser (F12 → Console) per errori dettagliati
3. Verifica che il file .rcme sia un JSON valido
4. Apri una issue su GitHub con:
   - Descrizione del problema
   - Browser e versione
   - File .rcme di esempio (se possibile)

---

**Versione documento:** 1.0
**Data:** 2025-10-20
**Versione formato file:** 3.0
