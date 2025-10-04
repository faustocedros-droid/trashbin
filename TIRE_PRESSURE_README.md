# Tire Pressure Management - Documentazione

## Panoramica

Il modulo **Tire Pressure Management** è una replica funzionale del worksheet Excel "Pressioni" (linee 1538-1594 di formule_estratte.txt). Implementa tutte le formule necessarie per calcolare le pressioni ottimali dei pneumatici basandosi su temperature e pressioni misurate.

## Formule Implementate

### 1. Incremento di Pressione
**Formula Excel:** `=(G3+F4*(F3+273.15)/(E3+273.15))-F4`

Calcola l'incremento di pressione necessario basandosi sulla temperatura ambiente e target, utilizzando la legge dei gas ideali con temperature in Kelvin.

**Parametri:**
- `G3` (pressureHot): Pressione calda misurata (bar)
- `F4` (pressureCold): Pressione fredda misurata (bar)
- `F3` (tempTarget): Temperatura target (°C)
- `E3` (tempAmbient): Temperatura ambiente (°C)

### 2. Conversione Bar → PSI
**Formula Excel:** `=F7*14.504`

Converte la pressione da bar a psi moltiplicando per il fattore di conversione 14.504.

### 3. Conversione PSI → Bar
**Formula Excel:** `=N17/14.504`

Converte la pressione da psi a bar dividendo per il fattore di conversione 14.504.

### 4. Rapporto Caldo/Freddo
**Formula Excel:** `=D16/D13`

Calcola il rapporto tra la pressione calda e fredda per determinare l'espansione termica del pneumatico.

**Parametri:**
- `D16` (psiHot): Pressione calda in psi
- `D13` (psiCold): Pressione fredda in psi

### 5. Pressione Corretta
**Formula Excel:** `=(D7/D19)- $K$22*(H22-H13) - $K$23*(H23-H16)`

Calcola la pressione corretta applicando le correzioni basate sugli incrementi di temperatura e i coefficienti di calibrazione.

**Parametri:**
- `D7` (psiCold): Pressione fredda in psi
- `D19` (ratio): Rapporto caldo/freddo
- `K22` (coeffK22): Coefficiente di correzione primario (default: 0.02)
- `H22` (tempIncrement1): Incremento temperatura 1
- `H13` (tempBase1): Temperatura base 1
- `K23` (coeffK23): Coefficiente di correzione secondario (default: 0.015)
- `H23` (tempIncrement2): Incremento temperatura 2
- `H16` (tempBase2): Temperatura base 2

## Utilizzo

### Input Richiesti

1. **Temperature**
   - Temperatura Ambiente (°C)
   - Temperatura Target (°C)

2. **Pressioni Front Left (FL)**
   - Pressione Fredda (bar)
   - Pressione Calda (bar)

3. **Pressioni Front Right (FR)**
   - Pressione Fredda (bar)
   - Pressione Calda (bar)

4. **Incrementi Temperatura**
   - Incremento Temp FL (°C)
   - Incremento Temp FR (°C)

5. **Coefficienti di Calibrazione**
   - Coefficiente K22 (default: 0.02)
   - Coefficiente K23 (default: 0.015)

### Output Forniti

1. **Conversioni e Incrementi**
   - Incremento Pressione (bar)
   - Pressione Fredda (psi)
   - Pressione Calda (psi)
   - Rapporto Caldo/Freddo

2. **Pressioni Corrette Raccomandate**
   - Pressione Corretta (psi)
   - **Pressione Corretta (bar)** ← VALORE PRINCIPALE DA UTILIZZARE

3. **Raccomandazioni**
   - Valori specifici per Front Left e Front Right
   - Note sulla correzione applicata

## Esempio di Calcolo

### Input
- Temperatura Ambiente: 20°C
- Temperatura Target: 25°C
- Pressione Fredda FL: 2.0 bar
- Pressione Calda FL: 2.3 bar
- Pressione Fredda FR: 2.0 bar
- Pressione Calda FR: 2.3 bar
- Incremento Temp FL: 5°C
- Incremento Temp FR: 5°C
- Coefficiente K22: 0.02
- Coefficiente K23: 0.015

### Output
- Incremento Pressione FL: 2.334 bar
- Pressione Fredda FL: 29.01 psi
- Pressione Calda FL: 33.36 psi
- Rapporto Caldo/Freddo FL: 1.1500
- **Pressione Corretta FL: 1.727 bar (25.05 psi)**
- **Pressione Corretta FR: 1.727 bar (25.05 psi)**

## Note Tecniche

- Le temperature vengono convertite in Kelvin aggiungendo 273.15
- Il fattore di conversione bar-psi è 14.504
- I coefficienti K22 e K23 possono essere calibrati in base al tipo di pneumatico
- Le formule tengono conto della legge dei gas ideali: PV = nRT

## Riferimenti

- File sorgente: `frontend/src/pages/TirePressure.tsx`
- Formule originali: `formule_estratte.txt` (linee 1538-1594)
- Worksheet Excel: "Pressioni" in `03_Race_Imola_25_29_Sett_2025.xlsb.xlsm`

## Possibili Estensioni Future

- Aggiungere calcoli per pneumatici posteriori (RL, RR)
- Salvataggio configurazioni predefinite per diversi tipi di pneumatico
- Storico delle misurazioni
- Export dei risultati in PDF o Excel
- Grafici di temperatura e pressione
- Integrazione con il backend per salvare i dati nel database
