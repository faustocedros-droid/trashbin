# Tire Pressure Management - Documentazione

## Panoramica

Il modulo **Tire Pressure Management** è una replica funzionale completa del worksheet Excel "Pressioni" (linee 1538-1594 di formule_estratte.txt). Implementa **tutte le 50+ formule** necessarie per calcolare le pressioni ottimali dei pneumatici basandosi su temperature e pressioni misurate.

**Formule implementate:** 56 celle calcolate totali
- Incrementi di pressione: 4 formule (I3, J3, I4, J4)
- Conversioni Bar → PSI: 16 formule (fattore 14.504 e 14.5038)
- Conversioni PSI → Bar: 4 formule
- Rapporti statici: 8 formule (N8-O11)
- Rapporti caldo/freddo: 4 formule (D19, E19, D20, E20)
- Pressioni corrette: 12 formule (D22-G23, D30-G31)
- Conversioni associali: 8 formule

## Formule Implementate

### 1. Incremento di Pressione (I3, J3, I4, J4)
**Formula Excel:** `=(G3+F4*(F3+273.15)/(E3+273.15))-F4`

Calcola l'incremento di pressione necessario basandosi sulla temperatura ambiente e target, utilizzando la legge dei gas ideali con temperature in Kelvin.

**Parametri:**
- `G3` (pressureHot): Pressione calda misurata (bar)
- `F4` (pressureCold): Pressione fredda misurata (bar)
- `F3` (tempTarget): Temperatura target (°C)
- `E3` (tempAmbient): Temperatura ambiente (°C)

### 2. Conversione Bar → PSI
**Formule Excel:** `=F7*14.504`, `=G7*14.504`, `=F8*14.504`, `=G8*14.504`, ecc.

Converte la pressione da bar a psi moltiplicando per il fattore di conversione 14.504.

**Celle implementate:**
- D7, E7, D8, E8 (conversioni base)
- D13, E13, D14, E14 (pressioni fredde)
- D16, E16, D17, E17 (pressioni calde)
- N14, O14, N15, O15 (conversioni aggiuntive)

### 3. Conversione PSI → Bar
**Formule Excel:** `=N17/14.504`, `=O17/14.504`, `=N18/14.504`, `=O18/14.504`

Converte la pressione da psi a bar dividendo per il fattore di conversione 14.504.

**Celle implementate:**
- L17, M17, L18, M18

### 4. Rapporti Statici (N8-O11)
**Formule Excel:** 
- `N8 = 22/17 = 1.2941`
- `O8 = 29/22 = 1.3182`
- `N9 = 24/20 = 1.2000`
- `O9 = 32/26 = 1.2308`
- `N10 = 28/23 = 1.2174`
- `O10 = 40/27 = 1.4815`
- `N11 = 37/27 = 1.3704`
- `O11 = 40/35 = 1.1429`

Rapporti fissi utilizzati per calcoli specifici dei pneumatici.

### 5. Rapporto Caldo/Freddo (D19, E19, D20, E20)
**Formula Excel:** `=D16/D13`

Calcola il rapporto tra la pressione calda e fredda per determinare l'espansione termica del pneumatico.

**Parametri:**
- `D16` (psiHot): Pressione calda in psi
- `D13` (psiCold): Pressione fredda in psi

**Celle implementate:**
- D19 = D16/D13 (Front Left)
- E19 = E16/E13 (Front Right)
- D20 = D17/D14 (Rear Left)
- E20 = E17/E14 (Rear Right)

### 6. Pressione Corretta (D22, E22, D23, E23)
**Formule Excel:** 
- `=(D7/D19)- $K$22*(H22-H13) - $K$23*(H23-H16)`
- `=(D8/D20)+ $K$22*(H22-H13) + $K$23`

Calcola la pressione corretta applicando le correzioni basate sugli incrementi di temperatura e i coefficienti di calibrazione.

**Parametri:**
- `D7/D8` (psiCold): Pressione fredda in psi
- `D19/D20` (ratio): Rapporto caldo/freddo
- `K22` (coeffK22): Coefficiente di correzione primario (default: 0.02)
- `H22` (tempIncrement1): Incremento temperatura 1
- `H13` (tempBase1): Temperatura base 1
- `K23` (coeffK23): Coefficiente di correzione secondario (default: 0.015)
- `H23` (tempIncrement2): Incremento temperatura 2
- `H16` (tempBase2): Temperatura base 2

**Conversioni associate (F22, G22, F23, G23):**
- Dividono i valori PSI per 14.504 per ottenere bar

### 7. Calcoli con Fattore 14.5038 (D27-G31)
**Formule Excel:** 
- `=F27*14.5038` (conversione bar → psi)
- `=(D27/D19)- $K$22*(H30-H13) - $K$23*(H31-H16)` (pressione corretta)

Simile alle formule precedenti ma utilizza il fattore di conversione 14.5038 invece di 14.504.

**Celle implementate:**
- D27, E27, D28, E28 (conversioni)
- D30, E30, D31, E31 (pressioni corrette in psi)
- F30, G30, F31, G31 (pressioni corrette in bar)

## Utilizzo

### Input Richiesti

1. **Temperature**
   - Temperatura Ambiente (E3, °C)
   - Temperatura Target (F3, °C)

2. **Pressioni di Base (Row 3-4)**
   - Pressioni Hot: G3 (FL), H3 (FR), G4 (RL), H4 (RR) in bar
   - Pressione Fredda: F4 in bar

3. **Pressioni per Conversioni (Row 7-8, 13-17)**
   - F7, G7, F8, G8: Pressioni in bar
   - F13, G13, F14, G14: Pressioni fredde FL, FR, RL, RR in bar
   - F16, G16, F17, G17: Pressioni calde FL, FR, RL, RR in bar
   - N17, O17, N18, O18: Pressioni in psi
   - L14, M14, L15, M15: Pressioni aggiuntive in bar

4. **Parametri Temperature**
   - H13, H16: Temperature base 1 e 2 (°C)
   - H22, H23: Incrementi temperatura 1 e 2 (°C)
   - H30, H31: Incrementi temperatura 3 e 4 (°C)

5. **Coefficienti di Calibrazione**
   - K22: Coefficiente primario (default: 0.02)
   - K23: Coefficiente secondario (default: 0.015)

6. **Pressioni Addizionali (Row 27-28)**
   - F27, G27, F28: Pressioni in bar per calcoli con fattore 14.5038

### Output Forniti

1. **Incrementi di Pressione (I3, J3, I4, J4)**
   - Incremento pressione per FL, FR, RL, RR in bar
   - Basato sulla legge dei gas ideali

2. **Conversioni Bar → PSI**
   - Tutte le pressioni convertite da bar a psi
   - Celle: D7, E7, D8, E8, D13-E17, N14-O15, D27-E28

3. **Conversioni PSI → Bar**
   - Conversioni inverse da psi a bar
   - Celle: L17, M17, L18, M18

4. **Rapporti Statici (N8-O11)**
   - 8 rapporti fissi pre-calcolati
   - Utilizzati per analisi specifiche dei pneumatici

5. **Rapporti Caldo/Freddo (D19-E20)**
   - Rapporti di espansione termica per tutti e 4 i pneumatici
   - FL, FR, RL, RR

6. **Pressioni Corrette con Correzioni Temperatura**
   - **D22, E22** (PSI) e **F22, G22** (Bar): Front pressures con correzioni
   - **D23, E23** (PSI) e **F23, G23** (Bar): Rear pressures con correzioni
   - **D30-G31**: Pressioni corrette calcolate con fattore 14.5038

7. **Visualizzazione Organizzata**
   - Tabella conversioni Bar ↔ PSI
   - Sezione rapporti e ratios statici
   - Tabella pressioni corrette evidenziata
   - Valori in bar evidenziati come risultati principali

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
- Incremento Pressione FR: 2.334 bar
- Pressione Fredda FL: 29.008 psi (D13)
- Pressione Calda FL: 33.359 psi (D16)
- Rapporto Caldo/Freddo FL: 1.1500 (D19)
- **Pressione Corretta FL: 25.049 psi (D22) / 1.727 bar (F22)**
- **Pressione Corretta FR: 25.049 psi (E22) / 1.727 bar (G22)**
- Rapporti Statici: N8=1.2941, O8=1.3182, N9=1.2000, ecc.

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
