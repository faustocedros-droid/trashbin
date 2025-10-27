# Timing Monitor - Guida Utente

## Introduzione

Il modulo Timing Monitor permette di leggere e memorizzare in tempo reale i dati di cronometraggio da monitor di gara basati sul web. Questo strumento è ideale per seguire le gare in diretta e analizzare le prestazioni dei piloti durante le sessioni.

## Caratteristiche Principali

- **Acquisizione Dati in Tempo Reale**: Legge automaticamente i dati dai monitor di cronometraggio online
- **Configurazione Flessibile**: Supporta qualsiasi sito web di timing mediante URL configurabile
- **Database Storico**: Memorizza tutti i dati per analisi successive
- **Aggiornamento Automatico**: Polling configurable per aggiornamenti continui durante la gara
- **Interfaccia Intuitiva**: Visualizzazione chiara e ordinata dei dati di timing

## Come Funziona

### 1. Aggiungere un Timing Monitor

1. Accedi alla pagina **Timing Monitor** dal menu principale
2. Clicca sul pulsante **"Add Timing Monitor"**
3. Compila il modulo:
   - **Nome**: Un nome descrittivo per il monitor (es. "GP Monaco 2025")
   - **URL**: L'indirizzo del sito web del timing monitor
   - **Intervallo di Polling**: Ogni quanti secondi aggiornare i dati (default: 5 secondi)
4. Clicca su **"Create"**

### 2. Avviare il Monitoraggio

1. Seleziona il monitor dalla lista sulla sinistra
2. Clicca sul pulsante **Play** (▶) per avviare il monitoraggio
3. Il sistema inizierà automaticamente a raccogliere i dati

### 3. Visualizzare i Dati

Una volta avviato il monitoraggio:
- I dati vengono visualizzati nella tabella centrale
- La tabella si aggiorna automaticamente ogni 2 secondi
- Vengono mostrati: posizione, numero pilota, nome, giri, tempi sul giro, tempi settore, gap

### 4. Fermare il Monitoraggio

- Clicca sul pulsante **Stop** (■) per fermare la raccolta dati
- I dati già acquisiti rimangono nel database

### 5. Eliminare un Monitor

- Clicca sull'icona del cestino (🗑️) per eliminare un monitor
- Attenzione: questa operazione elimina anche tutti i dati storici associati

## Dati Acquisiti

Per ogni pilota, il sistema memorizza:

- **Posizione in Classifica**: Posizione corrente nella sessione
- **Numero Pilota**: Numero di gara del pilota
- **Nome Pilota**: Nome completo del pilota
- **Giri Completati**: Numero di giri effettuati
- **Ultimo Tempo sul Giro**: Tempo dell'ultimo giro completato
- **Miglior Tempo sul Giro**: Tempo più veloce registrato nella sessione
- **Tempi Settore**: Tempi parziali per ogni settore (S1, S2, S3, S4)
- **Gap dal Leader**: Distacco dal primo in classifica
- **Gap dal Precedente**: Distacco dal pilota immediatamente davanti
- **Numero di Pit Stop**: Conteggio delle soste ai box
- **Stato**: Stato corrente (Running, Out, DNF, ecc.)

## Informazioni Tecniche

### Sistema di Scraping

Il sistema utilizza tecniche di web scraping per estrarre i dati dalle pagine HTML:

1. **BeautifulSoup4**: Parsing del contenuto HTML
2. **Pattern Matching**: Ricerca automatica di tabelle e elementi di timing
3. **Gestione Errori**: Gestione robusta degli errori di connessione

### Compatibilità

Il sistema è progettato per funzionare con la maggior parte dei timing monitor basati su web che utilizzano:
- Tabelle HTML standard
- Formato dati tabulare
- Struttura coerente dei dati

### Requisiti del Timing Monitor

Per funzionare correttamente, il sito web del timing monitor dovrebbe:
- Essere accessibile pubblicamente (o con credenziali configurate)
- Utilizzare una struttura HTML con tabelle
- Aggiornare i dati periodicamente
- Non richiedere JavaScript complesso per il rendering

## Utilizzo del Database

Tutti i dati acquisiti vengono salvati nel database SQLite locale:

- **Configurazioni**: Memorizzate in `timing_monitor_configs`
- **Snapshot**: Memorizzati in `timing_snapshots` (uno per ogni aggiornamento)
- **Dati Timing**: Memorizzati in `timing_data` (collegati agli snapshot)
- **Piloti**: Memorizzati in `drivers` (gestione automatica)

## API REST

Per integrazioni avanzate, sono disponibili le seguenti API:

### Configurazioni Monitor
- `GET /api/timing/configs` - Lista tutte le configurazioni
- `POST /api/timing/configs` - Crea nuova configurazione
- `GET /api/timing/configs/{id}` - Dettagli configurazione
- `PUT /api/timing/configs/{id}` - Aggiorna configurazione
- `DELETE /api/timing/configs/{id}` - Elimina configurazione

### Controllo Monitoraggio
- `POST /api/timing/configs/{id}/start` - Avvia monitoraggio
- `POST /api/timing/configs/{id}/stop` - Ferma monitoraggio
- `GET /api/timing/configs/{id}/status` - Stato del monitoraggio
- `GET /api/timing/configs/{id}/latest` - Ultimi dati acquisiti

### Dati Storici
- `GET /api/timing/snapshots` - Lista snapshot (con filtri)
- `GET /api/timing/snapshots/{id}` - Dettagli snapshot specifico

### Piloti
- `GET /api/drivers` - Lista tutti i piloti
- `POST /api/drivers` - Crea nuovo pilota
- `GET /api/drivers/{id}` - Dettagli pilota
- `PUT /api/drivers/{id}` - Aggiorna pilota
- `DELETE /api/drivers/{id}` - Elimina pilota

## Test con Monitor di Esempio

È incluso un file HTML di esempio (`sample_timing_monitor.html`) per testare il sistema:

1. Apri il file `sample_timing_monitor.html` in un browser
2. Copia l'URL dalla barra degli indirizzi
3. Crea un nuovo Timing Monitor nell'applicazione usando questo URL
4. Avvia il monitoraggio per vedere i dati simulati

## Risoluzione Problemi

### Il monitor non si avvia
- Verifica che l'URL sia corretto e accessibile
- Controlla la console del browser per errori
- Verifica che il backend sia in esecuzione

### Dati non vengono aggiornati
- Verifica che il monitoraggio sia attivo (icona verde)
- Controlla l'intervallo di polling (potrebbe essere troppo lungo)
- Verifica la connessione internet
- Controlla che il sito web del timing non abbia cambiato struttura

### Dati incompleti o errati
- Il sistema fa del suo meglio per interpretare la struttura della pagina
- Potrebbe essere necessario personalizzare il parser per timing monitor specifici
- Contatta il supporto per assistenza nella configurazione

## Note Importanti

- **Prestazioni**: Polling frequente può aumentare il carico sul server
- **Legalità**: Assicurati di avere il permesso di accedere ai dati del timing monitor
- **Privacy**: I dati memorizzati sono locali e non vengono condivisi
- **Backup**: Esegui backup regolari del database per preservare i dati storici

## Sviluppi Futuri

Funzionalità pianificate per versioni future:
- WebSocket per aggiornamenti in tempo reale senza polling
- Supporto per autenticazione su timing monitor protetti
- Parser personalizzabili per diversi formati di timing
- Esportazione dati in formato CSV/Excel
- Grafici e analisi avanzate delle prestazioni
- Notifiche per eventi significativi (nuovi record, incidenti, ecc.)
- Integrazione con telemetria auto

## Supporto

Per problemi, domande o suggerimenti, contatta il team di sviluppo.

---

**Versione**: 1.0  
**Data**: 2025-01-27
