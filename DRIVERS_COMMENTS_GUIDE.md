# Drivers Comments - Guida Utente

## Panoramica

La funzionalità **Drivers Comments** permette di creare, gestire e stampare commenti dettagliati del pilota dopo ogni sessione di guida. Questa funzione replica la struttura del foglio Excel "driverscomments.xlsx" in un'interfaccia web interattiva.

## Accesso alla Funzionalità

1. Clicca sul menu hamburger (☰) nell'angolo in alto a sinistra
2. Seleziona "Drivers Comments" dal menu

## Struttura del Modulo

### 1. Informazioni Generali
- **Event**: Nome dell'evento (es. "Imola GP 2025")
- **Session**: Sessione (es. "FP1", "FP2", "Q", "R1", "R2")
- **Date**: Data della sessione

### 2. Sezione Meteo
- **T Air (°C)**: Temperatura dell'aria
- **T Track (°C)**: Temperatura della pista
- **Condizioni**: Radio button per selezionare Wet o Dry

### 3. Valutazione Equipaggiamento (1:bad...5:good)
Valuta ciascun componente con un punteggio da 1 (scadente) a 5 (eccellente):
- Radio
- Seat (Sedile)
- Belts (Cinture)
- St.Wheel (Volante)
- Pedals (Pedali)
- Dashboard
- Engine (Motore)
- Gearbox (Cambio)

Include anche un campo **Comments** per commenti generali.

### 4. Track Image (Immagine del Tracciato)
- Clicca su "Choose File" per caricare un'immagine del tracciato
- Formati supportati: JPG, PNG, GIF, SVG
- L'immagine viene salvata insieme ai dati e sarà inclusa nella stampa

### 5. Analisi Turn-by-Turn (Curva per Curva)

Tabella con 17 righe (una per ogni curva) e le seguenti colonne:
- **Turn**: Numero della curva (1-17)
- **Braking**: Valutazione della frenata (1:bad...5:good)
- **Turn in**: Bilanciamento in ingresso curva (-3:max understeer...0:neutral...+3:max oversteer)
- **Mid Corner**: Bilanciamento a centro curva (-3:max understeer...0:neutral...+3:max oversteer)
- **Exit**: Bilanciamento in uscita di curva (-3:max understeer...0:neutral...+3:max oversteer)
- **Traction**: Valutazione della trazione (1:bad...5:good)
- **Comments**: Commenti liberi per la curva

### 6. To Go Faster
Campo di testo libero per annotare raccomandazioni e suggerimenti per migliorare i tempi sul giro.

## Funzioni dei Pulsanti

### 🆕 Nuovo
Crea un nuovo Driver Comment vuoto. I dati non salvati andranno persi (viene chiesta conferma).

### 📂 Carica
Carica un Driver Comment precedentemente salvato:
- In modalità desktop: Si apre una finestra di dialogo per selezionare il file JSON
- In modalità web: Viene richiesto di selezionare un file dal computer

### 💾 Salva
Salva il Driver Comment corrente:
- In modalità desktop: Si apre una finestra di dialogo per selezionare la posizione e il nome del file
- Il file viene salvato in formato JSON con nome predefinito: `driver-comment-[evento]-[timestamp].json`
- In modalità web: Il file viene scaricato nella cartella download predefinita

### 🖨️ Stampa
Apre la finestra di dialogo di stampa del browser:
- I pulsanti di controllo vengono nascosti automaticamente
- Il contenuto viene formattato per la stampa su carta
- È possibile salvare come PDF selezionando "Salva come PDF" nella finestra di stampa

## Formato File

I Driver Comments vengono salvati in formato JSON contenente tutti i dati del form, inclusa l'immagine del tracciato codificata in Base64.

Esempio di struttura:
```json
{
  "event": "Imola GP 2025",
  "session": "FP1",
  "date": "2025-10-20",
  "tAir": "25",
  "tTrack": "35",
  "wetDry": "dry",
  "radio": "5",
  "seat": "4",
  "comments": "Radio working perfectly",
  "trackImage": "data:image/png;base64,...",
  "trackImageName": "imola-circuit.png",
  "turns": [
    {
      "braking": "4",
      "turnIn": "-1",
      "midCorner": "0",
      "exit": "1",
      "traction": "5",
      "comments": "Good grip"
    },
    // ... altre 16 curve
  ],
  "toGoFaster": "Improve braking point at turn 1"
}
```

## Workflow Tipico

1. **Dopo la Sessione**: Apri la pagina Drivers Comments
2. **Compila i Dati**: Inserisci tutte le informazioni della sessione
3. **Carica Immagine**: Carica l'immagine del tracciato (opzionale)
4. **Salva**: Salva il documento in una posizione sul PC (es. cartella dell'evento)
5. **Stampa** (opzionale): Stampa o salva come PDF per la documentazione fisica
6. **Ricarica**: In futuro, puoi ricaricare il file per revisione o confronto

## Note Importanti

- Tutti i campi sono editabili
- I dati vengono salvati localmente sul tuo computer, non su server remoti
- Il formato JSON permette facile backup e trasferimento tra computer
- L'immagine del tracciato viene incorporata nel file JSON (nessun file esterno necessario)
- I file possono essere organizzati per evento/sessione nella struttura di cartelle che preferisci

## Suggerimenti

1. **Nomenclatura File**: Usa nomi descrittivi per i file salvati (es. "Imola-2025-FP1.json")
2. **Backup**: Mantieni copie di backup dei tuoi Driver Comments in cloud storage
3. **Confronti**: Carica commenti di sessioni precedenti per confrontare progressi e setup
4. **Stampa PDF**: Salva sempre una copia PDF per documentazione permanente
