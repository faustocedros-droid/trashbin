import React, { useState, useEffect } from 'react';

/**
 * RunPlan Sheet Generator
 * Replicates the Excel RunPlan sheet with all formulas
 */

interface RunPlanData {
    // Event data (from DatiEvento sheet)
    O4: string;  // Event name (K1)
    D4: string;  // Track name (F3)
    O5: string;  // Session name (K3)

    // Input cells
    D5: number;  // Starting fuel
    I5: number;  // Fuel consumption per lap
    TRACK_LENGTH: number;  // Track length in km
    OUTLAP_TIME: string;  // Outlap time in mm:ss format
    INLAP_TIME: string;   // Inlap time in mm:ss format
    PACE: string;         // Pace time in mm:ss format
    START_TIME: string;   // Start time in hh:mm:ss format
    DURATION: string;     // Duration in h:mm:ss format
    D7: number;  // Initial value for N13
    E11: number;  // Value for G18
    E19: number;  // Value for G26
    E27: number;  // Value for G34
    E35: number;  // Value for G42
    E43: number;  // Value for G50

    // Stint 1 (rows 13-16)
    B13: number;  // OUTLAP
    B14: number;  // LAPS
    B15: number;  // INLAP
    B16: string;  // PIT TIME in mm:ss format
    D16: number;
    H11: string;  // Tire Set for stint 1 (now text input)
    REFUEL1: number;  // Refuel amount for stint 1
    NOTE1: string;  // Note for stint 1

    // Stint 2 (rows 21-24)
    B21: number;  // OUTLAP
    B22: number;  // LAPS
    B23: number;  // INLAP
    B24: string;  // PIT TIME in mm:ss format
    C24: number;
    H19: string;  // Tire Set for stint 2 (now text input)
    REFUEL2: number;  // Refuel amount for stint 2
    NOTE2: string;  // Note for stint 2

    // Stint 3 (rows 29-32)
    B29: number;  // OUTLAP
    B30: number;  // LAPS
    B31: number;  // INLAP
    B32: string;  // PIT TIME in mm:ss format
    C32: number;
    H27: string;  // Tire Set for stint 3 (now text input)
    REFUEL3: number;  // Refuel amount for stint 3
    NOTE3: string;  // Note for stint 3

    // Stint 4 (rows 37-41)
    B37: number;  // OUTLAP
    B38: number;  // LAPS
    B39: number;  // INLAP
    B40: string;  // PIT TIME in mm:ss format
    C40: number;
    H35: string;  // Tire Set for stint 4 (now text input)
    REFUEL4: number;  // Refuel amount for stint 4
    NOTE4: string;  // Note for stint 4

    // Stint 5 (rows 45-49)
    B45: number;  // OUTLAP
    B46: number;  // LAPS
    B47: number;  // INLAP
    B48: string;  // PIT TIME in mm:ss format
    C48: number;
    H43: string;  // Tire Set for stint 5 (now text input)
    REFUEL5: number;  // Refuel amount for stint 5
    NOTE5: string;  // Note for stint 5
}

interface CalculatedValues {
    K1: string;
    F3: string;
    K3: string;
    T5: number;
    T6: number;
    T7: number;
    T8: number;
    T9: number;
    T10: number;
    D9: number;
    J11: string;
    C13: number;
    N13: number;
    C14: number;
    N14: number;
    C15: number;
    N15: number;
    N16: number;
    Z15: number;
    AA15: number;
    AB15: number;
    AC15: number;
    AD15: number;
    AE15: number;
    Z16: number;
    AA16: number;
    AB16: number;
    AC16: number;
    AD16: number;
    AE16: number;
    B17: number;
    Z17: number;
    AA17: number;
    AB17: number;
    AC17: number;
    AD17: number;
    AE17: number;
    B18: number;
    G18: number;
    J18: number;
    M18: number;
    Z18: number;
    AA18: number;
    AB18: number;
    AC18: number;
    AD18: number;
    AE18: number;
    J19: string;
    Z19: number;
    AA19: number;
    AB19: number;
    AC19: number;
    AD19: number;
    AE19: number;
    Z20: number;
    AA20: number;
    AB20: number;
    AC20: number;
    AD20: number;
    AE20: number;
    C21: number;
    N21: number;
    Z21: number;
    AA21: number;
    AB21: number;
    AC21: number;
    AD21: number;
    AE21: number;
    C22: number;
    N22: number;
    Z22: number;
    AA22: number;
    AB22: number;
    AC22: number;
    AD22: number;
    AE22: number;
    C23: number;
    N23: number;
    Z23: number;
    AA23: number;
    AB23: number;
    AC23: number;
    AD23: number;
    AE23: number;
    N24: number;
    Z24: number;
    AA24: number;
    AB24: number;
    AC24: number;
    AD24: number;
    AE24: number;
    B25: number;
    Z25: number;
    AA25: number;
    AB25: number;
    AC25: number;
    AD25: number;
    AE25: number;
    B26: number;
    G26: number;
    J26: number;
    Z26: number;
    AA26: number;
    AB26: number;
    AC26: number;
    AD26: number;
    AE26: number;
    J27: string;
    C29: number;
    N29: number;
    C30: number;
    N30: number;
    C31: number;
    N31: number;
    N32: number;
    B33: number;
    B34: number;
    G34: number;
    J34: number;
    J35: string;
    C37: number;
    N37: number;
    C38: number;
    N38: number;
    C39: number;
    N39: number;
    N40: number;
    B41: number;
    B42: number;
    G42: number;
    J42: number;
    J43: string;
    C45: number;
    N45: number;
    C46: number;
    N46: number;
    C47: number;
    N47: number;
    N48: number;
    B49: number;
    B50: number;
    G50: number;
    J50: number;
    TIME_REMAINING: string;  // Calculated time remaining
    DAYTIME: string;         // Calculated daytime
}

// Helper functions for time conversions
const parseTimeMMSS = (time: string): number => {
    // Parse mm:ss format to seconds
    if (!time || time.trim() === '') return 0;
    const parts = time.split(':');
    if (parts.length !== 2) return 0;
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes * 60 + seconds;
};

const parseTimeHHMMSS = (time: string): number => {
    // Parse hh:mm:ss or h:mm:ss format to seconds
    if (!time || time.trim() === '') return 0;
    const parts = time.split(':');
    if (parts.length !== 3) return 0;
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
};

const formatTimeHHMMSS = (seconds: number): string => {
    // Format seconds to hh:mm:ss
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

function RunPlanSheet() {
    const [data, setData] = useState<RunPlanData>({
        O4: 'Imola 25-29 Sept 2025',
        D4: 'Autodromo Enzo e Dino Ferrari',
        O5: 'FP1',
        D5: 50,
        I5: 1.8,
        TRACK_LENGTH: 4.909,  // Imola track length in km
        OUTLAP_TIME: '01:45',
        INLAP_TIME: '01:50',
        PACE: '01:42',
        START_TIME: '10:00:00',
        DURATION: '1:30:00',
        D7: 0,
        E11: 10,
        E19: 10,
        E27: 10,
        E35: 10,
        E43: 10,
        B13: 2,
        B14: 3,
        B15: 2,
        B16: '00:30',
        D16: 0,
        H11: 'Set#1',
        REFUEL1: 0,
        NOTE1: '',
        B21: 2,
        B22: 3,
        B23: 2,
        B24: '00:30',
        C24: 0,
        H19: 'Set#2',
        REFUEL2: 0,
        NOTE2: '',
        B29: 2,
        B30: 3,
        B31: 2,
        B32: '00:30',
        C32: 0,
        H27: 'Set#3',
        REFUEL3: 0,
        NOTE3: '',
        B37: 2,
        B38: 3,
        B39: 2,
        B40: '00:30',
        C40: 0,
        H35: 'Set#4',
        REFUEL4: 0,
        NOTE4: '',
        B45: 2,
        B46: 3,
        B47: 2,
        B48: '00:30',
        C48: 0,
        H43: 'Set#5',
        REFUEL5: 0,
        NOTE5: '',
    });

    const [showHistory, setShowHistory] = useState(false);
    const [runplanHistory, setRunplanHistory] = useState<any[]>([]);

    const handleInputChange = (field: keyof RunPlanData, value: string | number) => {
        const newData = {
            ...data,
            [field]: value,
        };
        setData(newData);
        // Auto-save to localStorage (current working copy)
        localStorage.setItem('runPlanSheet_data', JSON.stringify(newData));
    };

    // Save current runplan to history
    const saveToHistory = () => {
        const historyKey = 'runPlanSheet_history';
        const existingHistory = localStorage.getItem(historyKey);
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        
        // Create a unique identifier for this runplan
        const timestamp = new Date().toISOString();
        const runplanEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp,
            eventName: data.O4,
            trackName: data.D4,
            sessionName: data.O5,
            data: data
        };
        
        // Add to history
        history.push(runplanEntry);
        localStorage.setItem(historyKey, JSON.stringify(history));
        
        return runplanEntry.id;
    };

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('runPlanSheet_data');
        if (savedData) {
            try {
                setData(JSON.parse(savedData));
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
        
        // Load history
        loadHistory();
    }, []);

    // Load runplan history
    const loadHistory = () => {
        const historyKey = 'runPlanSheet_history';
        const existingHistory = localStorage.getItem(historyKey);
        if (existingHistory) {
            try {
                const history = JSON.parse(existingHistory);
                setRunplanHistory(history);
            } catch (error) {
                console.error('Error loading history:', error);
            }
        }
    };

    // Load a specific runplan from history
    const loadFromHistory = (historyItem: any) => {
        setData(historyItem.data);
        localStorage.setItem('runPlanSheet_data', JSON.stringify(historyItem.data));
        setShowHistory(false);
        alert(`RunPlan caricato: ${historyItem.eventName} - ${historyItem.sessionName}`);
    };

    // Delete a runplan from history
    const deleteFromHistory = (id: string) => {
        const historyKey = 'runPlanSheet_history';
        const updatedHistory = runplanHistory.filter(item => item.id !== id);
        setRunplanHistory(updatedHistory);
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
        alert('RunPlan eliminato dallo storico');
    };

    // Save data to file
    const handleSaveToFile = () => {
        // First, save to history
        const runplanId = saveToHistory();
        
        // Refresh history display
        loadHistory();
        
        // Then save to file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const eventName = data.O4.replace(/[^a-zA-Z0-9]/g, '_');
        const sessionName = data.O5.replace(/[^a-zA-Z0-9]/g, '_');
        link.download = `runplan_${eventName}_${sessionName}.rpln`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`RunPlan salvato con successo! ID: ${runplanId.substring(0, 8)}...`);
    };

    // Load data from file
    const handleLoadFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const loadedData = JSON.parse(event.target?.result as string);
                setData(loadedData);
                localStorage.setItem('runPlanSheet_data', JSON.stringify(loadedData));
            } catch (error) {
                console.error('Error loading file:', error);
                alert('Errore nel caricamento del file! Assicurati che sia un file .rpln valido.');
            }
        };
        reader.readAsText(file);
    };

    // VLOOKUP simulation - returns tire compound based on set name
    const vlookup = (setName: string): string => {
        const tireSetData: { [key: string]: string } = {
            'Set#1': 'Soft',
            'Set#2': 'Medium',
            'Set#3': 'Hard',
            'Set#4': 'Soft',
            'Set#5': 'Medium',
            'Set#6': 'Hard',
            'Set#7': 'Soft',
            'Set#8': 'Medium',
            'Set#9': 'Hard',
            'Set#10': 'Soft',
            'Set#11': 'Medium',
            'Set#12': 'Hard',
        };
        return tireSetData[setName] || 'Unknown';
    };

    const calculateValues = (): CalculatedValues => {
        const d = data;

        // Basic assignments
        const K1 = d.O4;
        const F3 = d.D4;
        const K3 = d.O5;

        // Parse time values to seconds
        const outlapTimeSeconds = parseTimeMMSS(d.OUTLAP_TIME);
        const inlapTimeSeconds = parseTimeMMSS(d.INLAP_TIME);
        const paceSeconds = parseTimeMMSS(d.PACE);
        const startTimeSeconds = parseTimeHHMMSS(d.START_TIME);
        const durationSeconds = parseTimeHHMMSS(d.DURATION);

        // Parse pit times
        const pitTime16 = parseTimeMMSS(d.B16);
        const pitTime24 = parseTimeMMSS(d.B24);
        const pitTime32 = parseTimeMMSS(d.B32);
        const pitTime40 = parseTimeMMSS(d.B40);
        const pitTime48 = parseTimeMMSS(d.B48);

        // Stint calculations - using I5 (fuel consumption per lap) for all laps
        const C13 = d.B13 * d.I5;  // OUTLAP fuel
        const C14 = d.B14 * d.I5;  // LAPS fuel
        const C15 = d.B15 * d.I5;  // INLAP fuel
        const C16 = 0;  // PIT TIME doesn't consume fuel

        const N13 = d.D7 + C13;
        const N14 = N13 + C14;
        const N15 = N14 + C15;
        const N16 = N15 + C16;

        const B17 = d.B13 + d.B14 + d.B15;
        const B18 = d.B13 + d.B14 + d.B15;

        const C21 = d.B21 * d.I5;
        const C22 = d.B22 * d.I5;
        const C23 = d.B23 * d.I5;
        const C24 = 0;

        const N21 = N16 + C21;
        const N22 = N21 + C22;
        const N23 = N22 + C23;
        const N24 = N23 + C24;

        const B25 = d.B21 + d.B22 + d.B23;
        const B26 = B18 + d.B21 + d.B22 + d.B23;

        const C29 = d.I5 * d.B29;
        const C30 = d.I5 * d.B30;
        const C31 = d.B31 * d.I5;
        const C32 = 0;

        const N29 = N24 + C29;
        const N30 = N29 + C30;
        const N31 = N30 + C31;
        const N32 = C32 + N31;

        const B33 = d.B29 + d.B30 + d.B31;
        const B34 = B26 + B33;

        const C37 = d.I5 * d.B37;
        const C38 = d.I5 * d.B38;
        const C39 = d.B39 * d.I5;
        const C40 = 0;

        const N37 = N32 + C37;
        const N38 = N37 + C38;
        const N39 = C39 + N38;
        const N40 = N39 + C40;

        const B41 = d.B37 + d.B38 + d.B39;
        const B42 = B34 + B41;

        const C45 = d.I5 * d.B45;
        const C46 = d.I5 * d.B46;
        const C47 = d.B47 * d.I5;
        const C48 = 0;

        const N45 = N40 + C45;
        const N46 = N45 + C46;
        const N47 = N46 + C47;
        const N48 = N47 + C48;

        const B49 = d.B45 + d.B46 + d.B47;
        const B50 = B42 + B49;

        // T column calculations (sums)
        const T5 = C13 + C14 + C15 + C16;
        const T6 = C21 + C22 + C23 + C24;
        const T7 = C29 + C30 + C31 + C32;
        const T8 = C37 + C38 + C39 + C40;
        const T9 = C45 + C46 + C47 + C48;
        const T10 = T5 + T6 + T7 + T8 + T9;

        // Calculate total refuel
        const totalRefuel = d.REFUEL1 + d.REFUEL2 + d.REFUEL3 + d.REFUEL4 + d.REFUEL5;

        // Calculate remaining fuel (starting fuel - consumed + refuels)
        const D9 = d.D5 - (T5 + T6 + T7 + T8 + T9) + totalRefuel;

        // Calculate total elapsed time in seconds
        const totalElapsedSeconds = 
            (d.B13 + d.B21 + d.B29 + d.B37 + d.B45) * outlapTimeSeconds +  // OUTLAP times
            (d.B14 + d.B22 + d.B30 + d.B38 + d.B46) * paceSeconds +        // LAPS times
            (d.B15 + d.B23 + d.B31 + d.B39 + d.B47) * inlapTimeSeconds +   // INLAP times
            pitTime16 + pitTime24 + pitTime32 + pitTime40 + pitTime48;     // PIT times

        // Calculate TIME REMAINING
        const timeRemainingSeconds = durationSeconds - totalElapsedSeconds;
        const TIME_REMAINING = formatTimeHHMMSS(Math.max(0, timeRemainingSeconds));

        // Calculate DAYTIME
        const daytimeSeconds = startTimeSeconds + totalElapsedSeconds;
        const DAYTIME = formatTimeHHMMSS(daytimeSeconds);

        // G column calculations - Stint KM (Track Length × total laps per stint)
        const G18 = d.TRACK_LENGTH * B17;  // Stint 1 KM
        const G26 = d.TRACK_LENGTH * B25;  // Stint 2 KM
        const G34 = d.TRACK_LENGTH * B33;  // Stint 3 KM
        const G42 = d.TRACK_LENGTH * B41;  // Stint 4 KM
        const G50 = d.TRACK_LENGTH * B49;  // Stint 5 KM

        // J column calculations - using placeholder values
        const J11 = vlookup(d.H11);
        const J18 = B18;
        const M18 = J18;
        const J19 = vlookup(d.H19);
        const J26 = B26;
        const J27 = vlookup(d.H27);
        const J34 = B34;
        const J35 = vlookup(d.H35);
        const J42 = B42;
        const J43 = vlookup(d.H43);
        const J50 = B50;

        // Z-AE columns (Set-based calculations) - using placeholder values
        const Z15 = d.H11 === 'Set#1' ? (d.B13 + d.B14 + d.B15) : 0;
        const AA15 = d.H19 === 'Set#1' ? B25 : 0;
        const AB15 = d.H27 === 'Set#1' ? B33 : 0;
        const AC15 = d.H35 === 'Set#1' ? B41 : 0;
        const AD15 = d.H43 === 'Set#1' ? B49 : 0;
        const AE15 = Z15 + AA15 + AB15 + AC15 + AD15;

        const Z16 = d.H11 === 'Set#2' ? B17 : 0;
        const AA16 = d.H19 === 'Set#2' ? B25 : 0;
        const AB16 = d.H27 === 'Set#2' ? B33 : 0;
        const AC16 = d.H35 === 'Set#2' ? B41 : 0;
        const AD16 = d.H43 === 'Set#2' ? B49 : 0;
        const AE16 = Z16 + AA16 + AB16 + AC16 + AD16;

        const Z17 = d.H11 === 'Set#3' ? B17 : 0;
        const AA17 = d.H19 === 'Set#3' ? B25 : 0;
        const AB17 = d.H27 === 'Set#3' ? B33 : 0;
        const AC17 = d.H35 === 'Set#3' ? B41 : 0;
        const AD17 = d.H43 === 'Set#3' ? B49 : 0;
        const AE17 = Z17 + AA17 + AB17 + AC17 + AD17;

        const Z18 = d.H11 === 'Set#4' ? B17 : 0;
        const AA18 = d.H19 === 'Set#4' ? B25 : 0;
        const AB18 = d.H27 === 'Set#4' ? B33 : 0;
        const AC18 = d.H35 === 'Set#4' ? B41 : 0;
        const AD18 = d.H43 === 'Set#4' ? B49 : 0;
        const AE18 = Z18 + AA18 + AB18 + AC18 + AD18;

        const Z19 = d.H11 === 'Set#5' ? B17 : 0;
        const AA19 = d.H19 === 'Set#5' ? B25 : 0;
        const AB19 = d.H27 === 'Set#5' ? B33 : 0;
        const AC19 = d.H35 === 'Set#5' ? B41 : 0;
        const AD19 = d.H43 === 'Set#5' ? B49 : 0;
        const AE19 = Z19 + AA19 + AB19 + AC19 + AD19;

        const Z20 = d.H11 === 'Set#6' ? B17 : 0;
        const AA20 = d.H19 === 'Set#6' ? B25 : 0;
        const AB20 = d.H27 === 'Set#6' ? B33 : 0;
        const AC20 = d.H35 === 'Set#6' ? B41 : 0;
        const AD20 = d.H43 === 'Set#6' ? B49 : 0;
        const AE20 = Z20 + AA20 + AB20 + AC20 + AD20;

        const Z21 = d.H11 === 'Set#7' ? B17 : 0;
        const AA21 = d.H19 === 'Set#7' ? B25 : 0;
        const AB21 = d.H27 === 'Set#7' ? B33 : 0;
        const AC21 = d.H35 === 'Set#7' ? B41 : 0;
        const AD21 = d.H43 === 'Set#7' ? B49 : 0;
        const AE21 = Z21 + AA21 + AB21 + AC21 + AD21;

        const Z22 = d.H11 === 'Set#8' ? B17 : 0;
        const AA22 = d.H19 === 'Set#8' ? B25 : 0;
        const AB22 = d.H27 === 'Set#8' ? B33 : 0;
        const AC22 = d.H35 === 'Set#8' ? B41 : 0;
        const AD22 = d.H43 === 'Set#8' ? B49 : 0;
        const AE22 = Z22 + AA22 + AB22 + AC22 + AD22;

        const Z23 = d.H11 === 'Set#9' ? B17 : 0;
        const AA23 = d.H19 === 'Set#9' ? B25 : 0;
        const AB23 = d.H27 === 'Set#9' ? B33 : 0;
        const AC23 = d.H35 === 'Set#9' ? B41 : 0;
        const AD23 = d.H43 === 'Set#9' ? B49 : 0;
        const AE23 = Z23 + AA23 + AB23 + AC23 + AD23;

        const Z24 = d.H11 === 'Set#10' ? B17 : 0;
        const AA24 = d.H19 === 'Set#10' ? B25 : 0;
        const AB24 = d.H27 === 'Set#10' ? B33 : 0;
        const AC24 = d.H35 === 'Set#10' ? B41 : 0;
        const AD24 = d.H43 === 'Set#10' ? B49 : 0;
        const AE24 = Z24 + AA24 + AB24 + AC24 + AD24;

        const Z25 = d.H11 === 'Set#11' ? B17 : 0;
        const AA25 = d.H19 === 'Set#11' ? B25 : 0;
        const AB25 = d.H27 === 'Set#11' ? B33 : 0;
        const AC25 = d.H35 === 'Set#11' ? B41 : 0;
        const AD25 = d.H43 === 'Set#11' ? B49 : 0;
        const AE25 = Z25 + AA25 + AB25 + AC25 + AD25;

        const Z26 = d.H11 === 'Set#12' ? B17 : 0;
        const AA26 = d.H19 === 'Set#12' ? B25 : 0;
        const AB26 = d.H27 === 'Set#12' ? B33 : 0;
        const AC26 = d.H35 === 'Set#12' ? B41 : 0;
        const AD26 = d.H43 === 'Set#12' ? B49 : 0;
        const AE26 = Z26 + AA26 + AB26 + AC26 + AD26;

        return {
            K1, F3, K3,
            T5, T6, T7, T8, T9, T10, D9,
            J11, C13, N13, C14, N14, C15, N15, N16,
            Z15, AA15, AB15, AC15, AD15, AE15,
            Z16, AA16, AB16, AC16, AD16, AE16,
            B17, Z17, AA17, AB17, AC17, AD17, AE17,
            B18, G18, J18, M18, Z18, AA18, AB18, AC18, AD18, AE18,
            J19, Z19, AA19, AB19, AC19, AD19, AE19,
            Z20, AA20, AB20, AC20, AD20, AE20,
            C21, N21, Z21, AA21, AB21, AC21, AD21, AE21,
            C22, N22, Z22, AA22, AB22, AC22, AD22, AE22,
            C23, N23, Z23, AA23, AB23, AC23, AD23, AE23,
            N24, Z24, AA24, AB24, AC24, AD24, AE24,
            B25, Z25, AA25, AB25, AC25, AD25, AE25,
            B26, G26, J26, Z26, AA26, AB26, AC26, AD26, AE26,
            J27, C29, N29, C30, N30, C31, N31, N32,
            B33, B34, G34, J34, J35,
            C37, N37, C38, N38, C39, N39, N40,
            B41, B42, G42, J42, J43,
            C45, N45, C46, N46, C47, N47, N48,
            B49, B50, G50, J50,
            TIME_REMAINING,
            DAYTIME,
        };
    };

    const calc = calculateValues();

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
                <h1 style={{ margin: 0, color: '#2c5282' }}>🏁 Run Plan Generator</h1>
                <p style={{ margin: '10px 0 0 0', color: '#666' }}>
                    Generate printable RunPlan sheets for race sessions
                </p>
            </div>

            {/* Input Section */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h2 style={{ color: '#2c5282', marginBottom: '20px' }}>📝 Session Information</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Event Name (O4):</label>
                        <input
                            type="text"
                            value={data.O4}
                            onChange={(e) => handleInputChange('O4', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Track Name (D4):</label>
                        <input
                            type="text"
                            value={data.D4}
                            onChange={(e) => handleInputChange('D4', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Session (O5):</label>
                        <input
                            type="text"
                            value={data.O5}
                            onChange={(e) => handleInputChange('O5', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <h3 style={{ color: '#2c5282', marginTop: '30px', marginBottom: '15px' }}>⛽ Fuel & Timing Parameters</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Starting Fuel (L):</label>
                        <input
                            type="number"
                            step="0.1"
                            value={data.D5}
                            onChange={(e) => handleInputChange('D5', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Fuel Consumption Per Lap (L/lap):</label>
                        <input
                            type="number"
                            step="0.1"
                            value={data.I5}
                            onChange={(e) => handleInputChange('I5', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Track Length (km):</label>
                        <input
                            type="number"
                            step="0.001"
                            value={data.TRACK_LENGTH}
                            onChange={(e) => handleInputChange('TRACK_LENGTH', parseFloat(e.target.value) || 0)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Outlap Time (mm:ss):</label>
                        <input
                            type="text"
                            placeholder="01:45"
                            value={data.OUTLAP_TIME}
                            onChange={(e) => handleInputChange('OUTLAP_TIME', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Inlap Time (mm:ss):</label>
                        <input
                            type="text"
                            placeholder="01:50"
                            value={data.INLAP_TIME}
                            onChange={(e) => handleInputChange('INLAP_TIME', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Pace (mm:ss):</label>
                        <input
                            type="text"
                            placeholder="01:42"
                            value={data.PACE}
                            onChange={(e) => handleInputChange('PACE', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Start Time (hh:mm:ss):</label>
                        <input
                            type="text"
                            placeholder="10:00:00"
                            value={data.START_TIME}
                            onChange={(e) => handleInputChange('START_TIME', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duration (h:mm:ss):</label>
                        <input
                            type="text"
                            placeholder="1:30:00"
                            value={data.DURATION}
                            onChange={(e) => handleInputChange('DURATION', e.target.value)}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                <h3 style={{ color: '#2c5282', marginTop: '30px', marginBottom: '15px' }}>🏎️ Run Sheet</h3>
                {[
                    { title: 'Stint 1', setKey: 'H11', refuelKey: 'REFUEL1', noteKey: 'NOTE1', rows: [
                        { key: 'B13', label: 'OUTLAP' },
                        { key: 'B14', label: 'LAPS' },
                        { key: 'B15', label: 'INLAP' },
                        { key: 'B16', label: 'PIT TIME (mm:ss)', isTime: true }
                    ]},
                    { title: 'Stint 2', setKey: 'H19', refuelKey: 'REFUEL2', noteKey: 'NOTE2', rows: [
                        { key: 'B21', label: 'OUTLAP' },
                        { key: 'B22', label: 'LAPS' },
                        { key: 'B23', label: 'INLAP' },
                        { key: 'B24', label: 'PIT TIME (mm:ss)', isTime: true }
                    ]},
                    { title: 'Stint 3', setKey: 'H27', refuelKey: 'REFUEL3', noteKey: 'NOTE3', rows: [
                        { key: 'B29', label: 'OUTLAP' },
                        { key: 'B30', label: 'LAPS' },
                        { key: 'B31', label: 'INLAP' },
                        { key: 'B32', label: 'PIT TIME (mm:ss)', isTime: true }
                    ]},
                    { title: 'Stint 4', setKey: 'H35', refuelKey: 'REFUEL4', noteKey: 'NOTE4', rows: [
                        { key: 'B37', label: 'OUTLAP' },
                        { key: 'B38', label: 'LAPS' },
                        { key: 'B39', label: 'INLAP' },
                        { key: 'B40', label: 'PIT TIME (mm:ss)', isTime: true }
                    ]},
                    { title: 'Stint 5', setKey: 'H43', refuelKey: 'REFUEL5', noteKey: 'NOTE5', rows: [
                        { key: 'B45', label: 'OUTLAP' },
                        { key: 'B46', label: 'LAPS' },
                        { key: 'B47', label: 'INLAP' },
                        { key: 'B48', label: 'PIT TIME (mm:ss)', isTime: true }
                    ]},
                ].map(({ title, setKey, refuelKey, noteKey, rows }) => (
                    <div key={setKey} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2c5282' }}>{title}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Tire Set:</label>
                                <input
                                    type="text"
                                    value={data[setKey as keyof RunPlanData] as string}
                                    onChange={(e) => handleInputChange(setKey as keyof RunPlanData, e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            {rows.map(({ key, label, isTime }) => (
                                <div key={key}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>{label}:</label>
                                    <input
                                        type={isTime ? "text" : "number"}
                                        step={isTime ? undefined : "1"}
                                        placeholder={isTime ? "00:30" : undefined}
                                        value={data[key as keyof RunPlanData] as number | string}
                                        onChange={(e) => handleInputChange(key as keyof RunPlanData, isTime ? e.target.value : (parseFloat(e.target.value) || 0))}
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Refuel (L):</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data[refuelKey as keyof RunPlanData] as number}
                                    onChange={(e) => handleInputChange(refuelKey as keyof RunPlanData, parseFloat(e.target.value) || 0)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Note:</label>
                                <input
                                    type="text"
                                    value={data[noteKey as keyof RunPlanData] as string}
                                    onChange={(e) => handleInputChange(noteKey as keyof RunPlanData, e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Output Section - Printable Sheet */}
            <div className="card" style={{ backgroundColor: 'white', padding: '40px' }} id="printable-sheet">
                <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #2c5282', paddingBottom: '20px' }}>
                    <h1 style={{ margin: 0, fontSize: '32px', color: '#2c5282' }}>{calc.K1}</h1>
                    <h2 style={{ margin: '10px 0', fontSize: '24px', color: '#666' }}>{calc.F3}</h2>
                    <h3 style={{ margin: '10px 0', fontSize: '20px', color: '#2c5282' }}>Session: {calc.K3}</h3>
                </div>

                {/* Summary Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c5282', color: 'white' }}>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Metric</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Starting Fuel</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.D5.toFixed(2)} L</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Total Fuel Consumed</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{calc.T10.toFixed(2)} L</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Remaining Fuel (D9)</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{calc.D9.toFixed(2)} L</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Total Laps</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{calc.B50.toFixed(0)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Start Time</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.START_TIME}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Duration</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{data.DURATION}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Daytime</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{calc.DAYTIME}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Time Remaining</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{calc.TIME_REMAINING}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Stint Details */}
                <h3 style={{ color: '#2c5282', marginBottom: '15px' }}>Stint Breakdown</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c5282', color: 'white' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stint</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tire Set</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Laps</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Refuel</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stint KM</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H11}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B17.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.REFUEL1}
                                    onChange={(e) => handleInputChange('REFUEL1', parseFloat(e.target.value) || 0)}
                                    style={{ width: '80px', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                /> L
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G18.toFixed(3)} km</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>2</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H19}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B25.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.REFUEL2}
                                    onChange={(e) => handleInputChange('REFUEL2', parseFloat(e.target.value) || 0)}
                                    style={{ width: '80px', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                /> L
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G26.toFixed(3)} km</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>3</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H27}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B33.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.REFUEL3}
                                    onChange={(e) => handleInputChange('REFUEL3', parseFloat(e.target.value) || 0)}
                                    style={{ width: '80px', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                /> L
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G34.toFixed(3)} km</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>4</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H35}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B41.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.REFUEL4}
                                    onChange={(e) => handleInputChange('REFUEL4', parseFloat(e.target.value) || 0)}
                                    style={{ width: '80px', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                /> L
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G42.toFixed(3)} km</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>5</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H43}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B49.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={data.REFUEL5}
                                    onChange={(e) => handleInputChange('REFUEL5', parseFloat(e.target.value) || 0)}
                                    style={{ width: '80px', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                /> L
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G50.toFixed(3)} km</td>
                        </tr>
                    </tbody>
                </table>

                {/* Notes Section */}
                <h3 style={{ color: '#2c5282', marginBottom: '15px' }}>Notes</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c5282', color: 'white' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stint</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="text"
                                    value={data.NOTE1}
                                    onChange={(e) => handleInputChange('NOTE1', e.target.value)}
                                    placeholder="Enter note..."
                                    style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>2</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="text"
                                    value={data.NOTE2}
                                    onChange={(e) => handleInputChange('NOTE2', e.target.value)}
                                    placeholder="Enter note..."
                                    style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>3</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="text"
                                    value={data.NOTE3}
                                    onChange={(e) => handleInputChange('NOTE3', e.target.value)}
                                    placeholder="Enter note..."
                                    style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>4</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="text"
                                    value={data.NOTE4}
                                    onChange={(e) => handleInputChange('NOTE4', e.target.value)}
                                    placeholder="Enter note..."
                                    style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>5</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <input
                                    type="text"
                                    value={data.NOTE5}
                                    onChange={(e) => handleInputChange('NOTE5', e.target.value)}
                                    placeholder="Enter note..."
                                    style={{ width: '100%', padding: '4px', border: '1px solid #ccc', borderRadius: '3px' }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ marginTop: '30px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                    <p>Generated on {new Date().toLocaleString()}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                    onClick={handleSaveToFile}
                    style={{
                        padding: '15px 30px',
                        fontSize: '16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    💾 Salva evento
                </button>
                <label style={{
                    padding: '15px 30px',
                    fontSize: '16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'inline-block',
                }}>
                    📂 Carica evento
                    <input
                        type="file"
                        accept=".rpln"
                        onChange={handleLoadFromFile}
                        style={{ display: 'none' }}
                    />
                </label>
                <button
                    onClick={() => window.print()}
                    style={{
                        padding: '15px 30px',
                        fontSize: '16px',
                        backgroundColor: '#2c5282',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    🖨️ Print RunPlan Sheet
                </button>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    style={{
                        padding: '15px 30px',
                        fontSize: '16px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                >
                    📚 {showHistory ? 'Nascondi' : 'Mostra'} Storico RunPlan ({runplanHistory.length})
                </button>
            </div>

            {/* RunPlan History Section */}
            {showHistory && (
                <div style={{ 
                    marginTop: '30px', 
                    padding: '20px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '2px solid #dee2e6'
                }}>
                    <h2 style={{ marginTop: 0 }}>📚 Storico RunPlan Salvati</h2>
                    {runplanHistory.length === 0 ? (
                        <p style={{ color: '#666' }}>Nessun RunPlan salvato nello storico.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                backgroundColor: 'white'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#2c5282', color: 'white' }}>
                                        <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Data/Ora</th>
                                        <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Evento</th>
                                        <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Pista</th>
                                        <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Sessione</th>
                                        <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {runplanHistory.slice().reverse().map((item, index) => (
                                        <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {new Date(item.timestamp).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {item.eventName}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {item.trackName}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                                {item.sessionName}
                                            </td>
                                            <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => loadFromHistory(item)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        marginRight: '8px',
                                                        fontSize: '14px',
                                                        backgroundColor: '#007bff',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    📂 Carica
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Sei sicuro di voler eliminare questo RunPlan dallo storico?')) {
                                                            deleteFromHistory(item.id);
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '8px 16px',
                                                        fontSize: '14px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    🗑️ Elimina
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #printable-sheet, #printable-sheet * {
                            visibility: visible;
                        }
                        #printable-sheet {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default RunPlanSheet;
