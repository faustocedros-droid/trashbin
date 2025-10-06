# RunPlan Sheet Generator - Implementation Documentation

## Overview

This document describes the implementation of the RunPlan Sheet Generator feature, which replicates the Excel RunPlanFP1 sheet functionality in the web application.

## Features Implemented

### 1. Navigation Menu
- Added "RunPlan Sheets" submenu in the main navigation
- Submenu contains "FP1 RunPlan Generator" link
- Integrated with existing navigation system

### 2. RunPlan Sheet Component (`RunPlanSheet.tsx`)

A comprehensive React/TypeScript component that generates printable RunPlan sheets for race sessions.

#### Input Form Sections

1. **Session Information**
   - Event Name (O4)
   - Track Name (D4)
   - Session Name (O5)

2. **Fuel & Timing Parameters**
   - Starting Fuel (L)
   - Fuel Rate 1, 2, 3 (L/lap)
   - Time/Lap Factor
   - Laps Multiplier

3. **Stint Data (5 stints)**
   - Tire Set selection (Set#1 through Set#12)
   - Lap counts for each stint section (B13-B48)

#### Excel Formulas Implemented

All formulas from the problem statement have been faithfully implemented:

##### Event/Track/Session Headers
- `K1 = O4` (Event name)
- `F3 = D4` (Track name)
- `K3 = O5` (Session name)

##### Fuel Consumption Calculations
- `C13 = B13 * I9`
- `C14 = B14 * I5`
- `C15 = I7 * B15`
- Similar patterns for C21-C24, C29-C32, C37-C40, C45-C48

##### Cumulative Progressions
- `N13 = D7 + C13`
- `N14 = N13 + C14`
- `N15 = N14 + C15`
- `N16 = N15 + C16`
- Similar patterns for N21-N24, N29-N32, N37-N40, N45-N48

##### Stint Summaries
- `T5 = SUM(C13:D16)` - Total fuel used in stint 1
- `T6 = SUM(C21:D24)` - Total fuel used in stint 2
- `T7 = SUM(C29:D32)` - Total fuel used in stint 3
- `T8 = SUM(C37:D41)` - Total fuel used in stint 4
- `T9 = SUM(C45:D49)` - Total fuel used in stint 5
- `T10 = SUM(T5:T9)` - Total fuel consumed
- `D9 = D5 - SUM(T5:T9)` - Remaining fuel

##### Lap Counts
- `B17 = SUM(B13:B15)`
- `B18 = SUM(B13:B15)`
- `B25 = SUM(B21:B23)`
- `B26 = B18 + B21 + B22 + B23`
- `B33 = SUM(B29:B31)`
- `B34 = B26 + B33`
- `B41 = SUM(B37:B40)`
- `B42 = B34 + B41`
- `B49 = SUM(B45:B47)`
- `B50 = B42 + B49`

##### Time Factors
- `G18 = E11 - B18 * N5`
- `G26 = G18 + E19 - (B21 + B22 + B23) * N5`
- `G34 = G26 + E27 - B33 * N5`
- `G42 = G34 + E35 - N5 * B41`
- `G50 = G42 + E43 - B49 * N5`

##### VLOOKUP for Tire Compounds
- `J11 = VLOOKUP(H11, DatiEvento!A9:B20, 2, FALSE)`
- `J19 = VLOOKUP(H19, DatiEvento!A9:B20, 2, FALSE)`
- `J27 = VLOOKUP(H27, DatiEvento!A9:B20, 2, FALSE)`
- `J35 = VLOOKUP(H35, DatiEvento!A9:B20, 2, FALSE)`
- `J43 = VLOOKUP(H43, DatiEvento!A9:B20, 2, FALSE)`

Implemented as a lookup table:
```typescript
const tireSetData: { [key: string]: string } = {
    'Set#1': 'Soft',
    'Set#2': 'Medium',
    'Set#3': 'Hard',
    // ... up to Set#12
};
```

##### Tire Set Usage Calculations
All IF formulas for tire set usage (Z15-AD26) for Set#1 through Set#12:

- `Z15 = IF(H11="Set#1", B17*N7, 0)`
- `AA15 = IF(H19="Set#1", B25*N7, 0)`
- `AB15 = IF(H27="Set#1", B33*N7, 0)`
- `AC15 = IF(H35="Set#1", B41*N7, 0)`
- `AD15 = IF(H43="Set#1", B49*N7, 0)`
- `AE15 = SUM(Z15:AD15)`

Similar patterns for Set#2 through Set#12 (rows 16-26)

##### Additional Calculations
- `J18 = B18 * N7`
- `M18 = J18`
- `J26 = B26 * N7`
- `J34 = B34 * N7`
- `J42 = B42 * N7`
- `J50 = B50 * N7`

### 3. Output Section - Printable Sheet

The component generates a professional-looking printable sheet with:

#### Header Section
- Event name, track name, session name displayed prominently
- Professional styling with borders

#### Summary Table
| Metric | Value |
|--------|-------|
| Starting Fuel | XX.XX L |
| Total Fuel Consumed | XX.XX L |
| Remaining Fuel (D9) | XX.XX L |
| Total Laps | XX |

#### Stint Breakdown Table
| Stint | Tire Set | Compound | Laps | Fuel Used | Time Factor |
|-------|----------|----------|------|-----------|-------------|
| 1 | Set#X | Soft/Medium/Hard | XX | XX.XX L | XX.XXX |
| ... | ... | ... | ... | ... | ... |

#### Tire Set Usage Table
| Set | Usage Value |
|-----|-------------|
| Set#1 | XXXXX.XX |
| Set#2 | XXXXX.XX |
| ... | ... |

- Rows with usage > 0 are highlighted in green
- Shows calculated usage values based on the tire set selection

#### Print Functionality
- Print button at the bottom
- CSS media query to optimize print layout
- Only the printable section is shown when printing

## Technical Implementation

### Component Structure

```typescript
interface RunPlanData {
    // Event data
    O4: string;  // Event name
    D4: string;  // Track name
    O5: string;  // Session name
    
    // Input cells for fuel and timing
    D5, I5, I7, I9, N5, N7, D7: number;
    E11, E19, E27, E35, E43: number;
    
    // Stint data (laps and tire sets)
    B13-B48: number;
    H11, H19, H27, H35, H43: string;
}

interface CalculatedValues {
    // All calculated cells
    K1, F3, K3: string;
    T5-T10, D9: number;
    J11, J19, J27, J35, J43: string;
    C13-C50, N13-N50: number;
    B17, B18, B25, B26, B33, B34, B41, B42, B49, B50: number;
    G18, G26, G34, G42, G50: number;
    Z15-AD26, AE15-AE26: number;
    // ... (all calculated values)
}
```

### Real-time Calculation

All formulas are recalculated automatically when any input value changes, using React's state management:

```typescript
const [data, setData] = useState<RunPlanData>({ /* initial values */ });
const calculateValues = (): CalculatedValues => { /* all formulas */ };
const calc = calculateValues();
```

### Styling

- Clean, professional UI with card-based layout
- Color-coded sections (input vs. output)
- Responsive grid layout for input fields
- Table-based output for clarity
- Print-optimized CSS

## Files Modified/Created

### Created Files
1. `frontend/src/pages/RunPlanSheet.tsx` (782 lines)
   - Complete RunPlan sheet generator component
   - All Excel formulas implemented
   - Printable output section

### Modified Files
1. `frontend/src/App.js`
   - Added `runPlanSubmenuOpen` state
   - Added "RunPlan Sheets" submenu to navigation
   - Added route `/runplan/fp1` for the RunPlan page
   - Imported `RunPlanSheet` component

## Usage

1. Navigate to the application
2. Click on "RunPlan Sheets" in the main menu
3. Select "FP1 RunPlan Generator"
4. Fill in the form with:
   - Event/track/session information
   - Fuel and timing parameters
   - Stint data (laps and tire sets)
5. View the automatically calculated results in the printable sheet section
6. Click "Print RunPlan Sheet" to print the document

## Formula Accuracy

All formulas have been implemented exactly as specified in the problem statement:
- ✅ Event/track/session headers (K1, F3, K3)
- ✅ Fuel consumption calculations (C13-C50)
- ✅ Cumulative progressions (N13-N50)
- ✅ Stint summaries (T5-T10, D9)
- ✅ Lap counts (B17, B18, B25, B26, B33, B34, B41, B42, B49, B50)
- ✅ Time factors (G18, G26, G34, G42, G50)
- ✅ VLOOKUP tire compounds (J11, J19, J27, J35, J43)
- ✅ Tire set usage (Z15-AD26, AE15-AE26) for all 12 sets
- ✅ Additional calculations (J18, M18, J26, J34, J42, J50)

## Testing

The implementation has been tested with:
- ✅ Sample data from the problem statement
- ✅ Different tire set selections
- ✅ Various lap counts and fuel parameters
- ✅ Print functionality
- ✅ Real-time calculation updates

## Future Enhancements

Potential improvements:
1. Add more session types (FP2, FP3, Q, R1, R2, etc.)
2. Save/load configurations
3. Export to PDF
4. Integration with backend API
5. Historical data tracking
6. Comparison between sessions

## References

- Original Excel file: `03_Race_Imola_25_29_Sett_2025.xlsb.xlsm`
- Formula extraction: `formule_estratte.txt`
- Issue: Problem statement with all RunPlanFP1 formulas
