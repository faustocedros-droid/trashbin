import React, { useState } from 'react';

/**
 * RunPlan Sheet - FP1 (Free Practice 1)
 * Replicates the Excel RunPlanFP1 sheet with all formulas
 */

interface RunPlanData {
    // Event data (from DatiEvento sheet)
    O4: string;  // Event name (K1)
    D4: string;  // Track name (F3)
    O5: string;  // Session name (K3)

    // Input cells
    D5: number;  // Starting fuel
    I5: number;  // Fuel consumption rate 1
    I7: number;  // Fuel consumption rate 2
    I9: number;  // Fuel consumption rate 3
    N5: number;  // Time per lap factor
    N7: number;  // Laps multiplier
    D7: number;  // Initial value for N13
    E11: number;  // Value for G18
    E19: number;  // Value for G26
    E27: number;  // Value for G34
    E35: number;  // Value for G42
    E43: number;  // Value for G50

    // Stint 1 (rows 13-16)
    B13: number;
    B14: number;
    B15: number;
    B16: number;
    D16: number;
    H11: string;  // Set name for stint 1

    // Stint 2 (rows 21-24)
    B21: number;
    B22: number;
    B23: number;
    B24: number;
    C24: number;
    H19: string;  // Set name for stint 2

    // Stint 3 (rows 29-32)
    B29: number;
    B30: number;
    B31: number;
    B32: number;
    C32: number;
    H27: string;  // Set name for stint 3

    // Stint 4 (rows 37-41)
    B37: number;
    B38: number;
    B39: number;
    B40: number;
    C40: number;
    H35: string;  // Set name for stint 4

    // Stint 5 (rows 45-49)
    B45: number;
    B46: number;
    B47: number;
    B48: number;
    C48: number;
    H43: string;  // Set name for stint 5
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
}

function RunPlanSheet() {
    const [data, setData] = useState<RunPlanData>({
        O4: 'Imola 25-29 Sept 2025',
        D4: 'Autodromo Enzo e Dino Ferrari',
        O5: 'FP1',
        D5: 50,
        I5: 1.8,
        I7: 1.5,
        I9: 2.0,
        N5: 0.035,
        N7: 4953,
        D7: 0,
        E11: 10,
        E19: 10,
        E27: 10,
        E35: 10,
        E43: 10,
        B13: 2,
        B14: 3,
        B15: 2,
        B16: 0,
        D16: 0,
        H11: 'Set#1',
        B21: 2,
        B22: 3,
        B23: 2,
        B24: 0,
        C24: 0,
        H19: 'Set#2',
        B29: 2,
        B30: 3,
        B31: 2,
        B32: 0,
        C32: 0,
        H27: 'Set#3',
        B37: 2,
        B38: 3,
        B39: 2,
        B40: 0,
        C40: 0,
        H35: 'Set#4',
        B45: 2,
        B46: 3,
        B47: 2,
        B48: 0,
        C48: 0,
        H43: 'Set#5',
    });

    const handleInputChange = (field: keyof RunPlanData, value: string | number) => {
        setData({
            ...data,
            [field]: value,
        });
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

        // Stint calculations
        const C13 = d.B13 * d.I9;
        const C14 = d.B14 * d.I5;
        const C15 = d.I7 * d.B15;
        const C16 = d.B16;

        const N13 = d.D7 + C13;
        const N14 = N13 + C14;
        const N15 = N14 + C15;
        const N16 = N15 + C16;

        const B17 = d.B13 + d.B14 + d.B15;
        const B18 = d.B13 + d.B14 + d.B15;

        const C21 = d.B21 * d.I9;
        const C22 = d.B22 * d.I5;
        const C23 = d.I7 * d.B23;
        const C24 = d.B24;

        const N21 = N16 + C21;
        const N22 = N21 + C22;
        const N23 = N22 + C23;
        const N24 = N23 + C24;

        const B25 = d.B21 + d.B22 + d.B23;
        const B26 = B18 + d.B21 + d.B22 + d.B23;

        const C29 = d.I9 * d.B29;
        const C30 = d.I5 * d.B30;
        const C31 = d.B31 * d.I7;
        const C32 = d.B32;

        const N29 = N24 + C29;
        const N30 = N29 + C30;
        const N31 = N30 + C31;
        const N32 = C32 + N31;

        const B33 = d.B29 + d.B30 + d.B31;
        const B34 = B26 + B33;

        const C37 = d.I9 * d.B37;
        const C38 = d.I5 * d.B38;
        const C39 = d.B39 * d.I7;
        const C40 = d.B40;

        const N37 = N32 + C37;
        const N38 = N37 + C38;
        const N39 = C39 + N38;
        const N40 = N39 + C40;

        const B41 = d.B37 + d.B38 + d.B39 + d.B40;
        const B42 = B34 + B41;

        const C45 = d.I9 * d.B45;
        const C46 = d.I5 * d.B46;
        const C47 = d.B47 * d.I7;
        const C48 = d.B48;

        const N45 = N40 + C45;
        const N46 = N45 + C46;
        const N47 = N46 + C47;
        const N48 = N47 + C48;

        const B49 = d.B45 + d.B46 + d.B47;
        const B50 = B42 + B49;

        // T column calculations (sums)
        const T5 = C13 + d.B13 + C14 + d.B14 + C15 + d.B15 + C16 + d.B16;
        const T6 = C21 + d.B21 + C22 + d.B22 + C23 + d.B23 + C24 + d.B24;
        const T7 = C29 + d.B29 + C30 + d.B30 + C31 + d.B31 + C32 + d.B32;
        const T8 = C37 + d.B37 + C38 + d.B38 + C39 + d.B39 + C40 + d.B40;
        const T9 = C45 + d.B45 + C46 + d.B46 + C47 + d.B47 + C48 + d.B48;
        const T10 = T5 + T6 + T7 + T8 + T9;

        const D9 = d.D5 - (T5 + T6 + T7 + T8 + T9);

        // G column calculations
        const G18 = d.E11 - B18 * d.N5;
        const G26 = G18 + d.E19 - (d.B21 + d.B22 + d.B23) * d.N5;
        const G34 = G26 + d.E27 - B33 * d.N5;
        const G42 = G34 + d.E35 - d.N5 * B41;
        const G50 = G42 + d.E43 - B49 * d.N5;

        // J column calculations
        const J11 = vlookup(d.H11);
        const J18 = B18 * d.N7;
        const M18 = J18;
        const J19 = vlookup(d.H19);
        const J26 = B26 * d.N7;
        const J27 = vlookup(d.H27);
        const J34 = B34 * d.N7;
        const J35 = vlookup(d.H35);
        const J42 = B42 * d.N7;
        const J43 = vlookup(d.H43);
        const J50 = B50 * d.N7;

        // Z-AE columns (Set-based calculations)
        const Z15 = d.H11 === 'Set#1' ? d.B13 + d.B14 + d.B15 * d.N7 : 0;
        const AA15 = d.H19 === 'Set#1' ? B25 * d.N7 : 0;
        const AB15 = d.H27 === 'Set#1' ? B33 * d.N7 : 0;
        const AC15 = d.H35 === 'Set#1' ? B41 * d.N7 : 0;
        const AD15 = d.H43 === 'Set#1' ? B49 * d.N7 : 0;
        const AE15 = Z15 + AA15 + AB15 + AC15 + AD15;

        const Z16 = d.H11 === 'Set#2' ? B17 * d.N7 : 0;
        const AA16 = d.H19 === 'Set#2' ? B25 * d.N7 : 0;
        const AB16 = d.H27 === 'Set#2' ? B33 * d.N7 : 0;
        const AC16 = d.H35 === 'Set#2' ? B41 * d.N7 : 0;
        const AD16 = d.H43 === 'Set#2' ? B49 * d.N7 : 0;
        const AE16 = Z16 + AA16 + AB16 + AC16 + AD16;

        const Z17 = d.H11 === 'Set#3' ? B17 * d.N7 : 0;
        const AA17 = d.H19 === 'Set#3' ? B25 * d.N7 : 0;
        const AB17 = d.H27 === 'Set#3' ? B33 * d.N7 : 0;
        const AC17 = d.H35 === 'Set#3' ? B41 * d.N7 : 0;
        const AD17 = d.H43 === 'Set#3' ? B49 * d.N7 : 0;
        const AE17 = Z17 + AA17 + AB17 + AC17 + AD17;

        const Z18 = d.H11 === 'Set#4' ? B17 * d.N7 : 0;
        const AA18 = d.H19 === 'Set#4' ? B25 * d.N7 : 0;
        const AB18 = d.H27 === 'Set#4' ? B33 * d.N7 : 0;
        const AC18 = d.H35 === 'Set#4' ? B41 * d.N7 : 0;
        const AD18 = d.H43 === 'Set#4' ? B49 * d.N7 : 0;
        const AE18 = Z18 + AA18 + AB18 + AC18 + AD18;

        const Z19 = d.H11 === 'Set#5' ? B17 * d.N7 : 0;
        const AA19 = d.H19 === 'Set#5' ? B25 * d.N7 : 0;
        const AB19 = d.H27 === 'Set#5' ? B33 * d.N7 : 0;
        const AC19 = d.H35 === 'Set#5' ? B41 * d.N7 : 0;
        const AD19 = d.H43 === 'Set#5' ? B49 * d.N7 : 0;
        const AE19 = Z19 + AA19 + AB19 + AC19 + AD19;

        const Z20 = d.H11 === 'Set#6' ? B17 * d.N7 : 0;
        const AA20 = d.H19 === 'Set#6' ? B25 * d.N7 : 0;
        const AB20 = d.H27 === 'Set#6' ? B33 * d.N7 : 0;
        const AC20 = d.H35 === 'Set#6' ? B41 * d.N7 : 0;
        const AD20 = d.H43 === 'Set#6' ? B49 * d.N7 : 0;
        const AE20 = Z20 + AA20 + AB20 + AC20 + AD20;

        const Z21 = d.H11 === 'Set#7' ? B17 * d.N7 : 0;
        const AA21 = d.H19 === 'Set#7' ? B25 * d.N7 : 0;
        const AB21 = d.H27 === 'Set#7' ? B33 * d.N7 : 0;
        const AC21 = d.H35 === 'Set#7' ? B41 * d.N7 : 0;
        const AD21 = d.H43 === 'Set#7' ? B49 * d.N7 : 0;
        const AE21 = Z21 + AA21 + AB21 + AC21 + AD21;

        const Z22 = d.H11 === 'Set#8' ? B17 * d.N7 : 0;
        const AA22 = d.H19 === 'Set#8' ? B25 * d.N7 : 0;
        const AB22 = d.H27 === 'Set#8' ? B33 * d.N7 : 0;
        const AC22 = d.H35 === 'Set#8' ? B41 * d.N7 : 0;
        const AD22 = d.H43 === 'Set#8' ? B49 * d.N7 : 0;
        const AE22 = Z22 + AA22 + AB22 + AC22 + AD22;

        const Z23 = d.H11 === 'Set#9' ? B17 * d.N7 : 0;
        const AA23 = d.H19 === 'Set#9' ? B25 * d.N7 : 0;
        const AB23 = d.H27 === 'Set#9' ? B33 * d.N7 : 0;
        const AC23 = d.H35 === 'Set#9' ? B41 * d.N7 : 0;
        const AD23 = d.H43 === 'Set#9' ? B49 * d.N7 : 0;
        const AE23 = Z23 + AA23 + AB23 + AC23 + AD23;

        const Z24 = d.H11 === 'Set#10' ? B17 * d.N7 : 0;
        const AA24 = d.H19 === 'Set#10' ? B25 * d.N7 : 0;
        const AB24 = d.H27 === 'Set#10' ? B33 * d.N7 : 0;
        const AC24 = d.H35 === 'Set#10' ? B41 * d.N7 : 0;
        const AD24 = d.H43 === 'Set#10' ? B49 * d.N7 : 0;
        const AE24 = Z24 + AA24 + AB24 + AC24 + AD24;

        const Z25 = d.H11 === 'Set#11' ? B17 * d.N7 : 0;
        const AA25 = d.H19 === 'Set#11' ? B25 * d.N7 : 0;
        const AB25 = d.H27 === 'Set#11' ? B33 * d.N7 : 0;
        const AC25 = d.H35 === 'Set#11' ? B41 * d.N7 : 0;
        const AD25 = d.H43 === 'Set#11' ? B49 * d.N7 : 0;
        const AE25 = Z25 + AA25 + AB25 + AC25 + AD25;

        const Z26 = d.H11 === 'Set#12' ? B17 * d.N7 : 0;
        const AA26 = d.H19 === 'Set#12' ? B25 * d.N7 : 0;
        const AB26 = d.H27 === 'Set#12' ? B33 * d.N7 : 0;
        const AC26 = d.H35 === 'Set#12' ? B41 * d.N7 : 0;
        const AD26 = d.H43 === 'Set#12' ? B49 * d.N7 : 0;
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
        };
    };

    const calc = calculateValues();

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
                <h1 style={{ margin: 0, color: '#2c5282' }}>🏁 RunPlan Sheet Generator</h1>
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
                    {[
                        { key: 'D5', label: 'Starting Fuel (L)' },
                        { key: 'I5', label: 'Fuel Rate 1 (L/lap)' },
                        { key: 'I7', label: 'Fuel Rate 2 (L/lap)' },
                        { key: 'I9', label: 'Fuel Rate 3 (L/lap)' },
                        { key: 'N5', label: 'Time/Lap Factor' },
                        { key: 'N7', label: 'Laps Multiplier' },
                    ].map(({ key, label }) => (
                        <div key={key}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>{label}:</label>
                            <input
                                type="number"
                                step="0.1"
                                value={data[key as keyof RunPlanData]}
                                onChange={(e) => handleInputChange(key as keyof RunPlanData, parseFloat(e.target.value) || 0)}
                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        </div>
                    ))}
                </div>

                <h3 style={{ color: '#2c5282', marginTop: '30px', marginBottom: '15px' }}>🏎️ Stint Data</h3>
                {[
                    { title: 'Stint 1', setKey: 'H11', rows: ['B13', 'B14', 'B15', 'B16'] },
                    { title: 'Stint 2', setKey: 'H19', rows: ['B21', 'B22', 'B23', 'B24'] },
                    { title: 'Stint 3', setKey: 'H27', rows: ['B29', 'B30', 'B31', 'B32'] },
                    { title: 'Stint 4', setKey: 'H35', rows: ['B37', 'B38', 'B39', 'B40'] },
                    { title: 'Stint 5', setKey: 'H43', rows: ['B45', 'B46', 'B47', 'B48'] },
                ].map(({ title, setKey, rows }) => (
                    <div key={setKey} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#2c5282' }}>{title}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Tire Set:</label>
                                <select
                                    value={data[setKey as keyof RunPlanData] as string}
                                    onChange={(e) => handleInputChange(setKey as keyof RunPlanData, e.target.value)}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                >
                                    {['Set#1', 'Set#2', 'Set#3', 'Set#4', 'Set#5', 'Set#6', 'Set#7', 'Set#8', 'Set#9', 'Set#10', 'Set#11', 'Set#12'].map(set => (
                                        <option key={set} value={set}>{set}</option>
                                    ))}
                                </select>
                            </div>
                            {rows.map((row) => (
                                <div key={row}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>{row}:</label>
                                    <input
                                        type="number"
                                        step="1"
                                        value={data[row as keyof RunPlanData] as number}
                                        onChange={(e) => handleInputChange(row as keyof RunPlanData, parseFloat(e.target.value) || 0)}
                                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                    />
                                </div>
                            ))}
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
                    </tbody>
                </table>

                {/* Stint Details */}
                <h3 style={{ color: '#2c5282', marginBottom: '15px' }}>Stint Breakdown</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c5282', color: 'white' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stint</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tire Set</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Compound</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Laps</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fuel Used</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Time Factor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>1</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H11}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.J11}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B18.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.T5.toFixed(2)} L</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G18.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>2</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H19}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.J19}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B26.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.T6.toFixed(2)} L</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G26.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>3</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H27}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.J27}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B34.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.T7.toFixed(2)} L</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G34.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>4</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H35}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.J35}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B42.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.T8.toFixed(2)} L</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G42.toFixed(3)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>5</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{data.H43}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.J43}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.B50.toFixed(0)}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.T9.toFixed(2)} L</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{calc.G50.toFixed(3)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Tire Set Usage Summary */}
                <h3 style={{ color: '#2c5282', marginBottom: '15px' }}>Tire Set Usage (Calculated)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c5282', color: 'white' }}>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Set</th>
                            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Usage Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { set: 'Set#1', value: calc.AE15 },
                            { set: 'Set#2', value: calc.AE16 },
                            { set: 'Set#3', value: calc.AE17 },
                            { set: 'Set#4', value: calc.AE18 },
                            { set: 'Set#5', value: calc.AE19 },
                            { set: 'Set#6', value: calc.AE20 },
                            { set: 'Set#7', value: calc.AE21 },
                            { set: 'Set#8', value: calc.AE22 },
                            { set: 'Set#9', value: calc.AE23 },
                            { set: 'Set#10', value: calc.AE24 },
                            { set: 'Set#11', value: calc.AE25 },
                            { set: 'Set#12', value: calc.AE26 },
                        ].map(({ set, value }) => (
                            <tr key={set} style={{ backgroundColor: value > 0 ? '#e8f5e9' : 'transparent' }}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{set}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{value.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ marginTop: '30px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
                    <p>Generated on {new Date().toLocaleString()}</p>
                </div>
            </div>

            {/* Print Button */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
            </div>

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
