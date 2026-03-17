import React, { useState, useEffect } from 'react';

/**
 * Italian GT End RacePlan Sheet
 * Replicates the Excel Italian GT End RacePlan sheet with all formulas
 */

const LOCAL_STORAGE_KEY = 'italianGTEndRacePlan';

interface ItalianGTEndData {
    A1: string;   // CAR#
    A4: string;   // Start Time hh:mm:ss
    O1: string;   // Race pace MM:SS.mmm
    O2: number;   // Fuel consumption per lap

    // Row 4: START stint data
    B4: string;   // Driver In
    E4: number;   // Laps
    F4: string;   // Notes
    G4: string;   // Tire Set
    H4: number;   // KM Start
    I4: number;   // KM End
    J4: number;   // Fuel In

    // Row 6: PIT1
    A6: string;
    B6: string;
    E6: number;
    F6: string;
    G6: string;
    H6: number;
    I6: number;
    J6: number;

    // Row 8: PIT2
    A8: string;
    B8: string;
    E8: number;
    F8: string;
    G8: string;
    H8: number;
    I8: number;
    J8: number;

    // Row 10: PIT3
    A10: string;
    B10: string;
    E10: number;
    F10: string;
    G10: string;
    H10: number;
    I10: number;
    J10: number;

    // Row 12: PIT4
    A12: string;
    B12: string;
    E12: number;
    F12: string;
    G12: string;
    H12: number;
    I12: number;
    J12: number;

    // Row 14: PIT5
    A14: string;
    B14: string;
    E14: number;
    F14: string;
    G14: string;
    H14: number;
    I14: number;
    J14: number;
}

/** Parse "hh:mm:ss" or "h:mm:ss" to total seconds */
function parseTimeToSeconds(timeStr: string): number {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        const h = parseInt(parts[0]) || 0;
        const m = parseInt(parts[1]) || 0;
        const s = parseFloat(parts[2] || '0') || 0;
        return h * 3600 + m * 60 + s;
    }
    return 0;
}

/** Parse "MM:SS.mmm" lap time format to total seconds */
function parseLapTimeToSeconds(lapStr: string): number {
    if (!lapStr) return 0;
    const parts = lapStr.split(':');
    if (parts.length === 2) {
        const m = parseInt(parts[0]) || 0;
        const s = parseFloat(parts[1]) || 0;
        return m * 60 + s;
    }
    return 0;
}

/** Convert total seconds to "HH:MM:SS" string */
function secondsToHHMMSS(totalSeconds: number): string {
    if (isNaN(totalSeconds) || !isFinite(totalSeconds) || totalSeconds < 0) return '--:--:--';
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/** Add minutes to a time string and return "HH:MM:SS" */
function addMinutesToTimeStr(timeStr: string, minutes: number): string {
    const baseSec = parseTimeToSeconds(timeStr);
    if (baseSec === 0 && !timeStr) return '--:--:--';
    return secondsToHHMMSS(baseSec + minutes * 60);
}

const defaultData: ItalianGTEndData = {
    A1: '',
    A4: '14:35:00',
    O1: '01:48.000',
    O2: 3,
    B4: '', E4: 0, F4: '', G4: '', H4: 0, I4: 0, J4: 0,
    A6: 'PIT1', B6: '', E6: 0, F6: '', G6: '', H6: 0, I6: 0, J6: 0,
    A8: 'PIT2', B8: '', E8: 0, F8: '', G8: '', H8: 0, I8: 0, J8: 0,
    A10: 'PIT3', B10: '', E10: 0, F10: '', G10: '', H10: 0, I10: 0, J10: 0,
    A12: 'PIT4', B12: '', E12: 0, F12: '', G12: '', H12: 0, I12: 0, J12: 0,
    A14: 'PIT5', B14: '', E14: 0, F14: '', G14: '', H14: 0, I14: 0, J14: 0,
};

function ItalianGTEndRacePlan() {
    const [data, setData] = useState<ItalianGTEndData>(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                return { ...defaultData, ...JSON.parse(saved) };
            } catch {
                return defaultData;
            }
        }
        return defaultData;
    });

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const handleChange = (field: keyof ItalianGTEndData, value: string | number) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    // ---- Pit window offsets (minutes from race start) ----
    const PIT_WINDOWS = [
        { open: 25,  close: 35  },  // PIT1
        { open: 55,  close: 65  },  // PIT2
        { open: 85,  close: 95  },  // PIT3
        { open: 115, close: 125 },  // PIT4
        { open: 145, close: 155 },  // PIT5
    ] as const;

    // ---- Calculated values ----
    const lapTimeSec = parseLapTimeToSeconds(data.O1);

    // N5 = 5 + O2 * (TIME(0,20,0) / O1)
    // In Excel fractions: TIME(0,20,0)=20/1440 day, O1 = laptime/86400 day
    // So ratio = (20*60) / lapTimeSec
    const N5 = lapTimeSec > 0 ? 5 + data.O2 * (1200 / lapTimeSec) : 0;
    const O5 = lapTimeSec > 0 ? 5 + data.O2 * (2400 / lapTimeSec) : 0;

    const L6  = addMinutesToTimeStr(data.A4, PIT_WINDOWS[0].open);
    const M6  = addMinutesToTimeStr(data.A4, PIT_WINDOWS[0].close);
    const L8  = addMinutesToTimeStr(data.A4, PIT_WINDOWS[1].open);
    const M8  = addMinutesToTimeStr(data.A4, PIT_WINDOWS[1].close);
    const L10 = addMinutesToTimeStr(data.A4, PIT_WINDOWS[2].open);
    const M10 = addMinutesToTimeStr(data.A4, PIT_WINDOWS[2].close);
    const L12 = addMinutesToTimeStr(data.A4, PIT_WINDOWS[3].open);
    const M12 = addMinutesToTimeStr(data.A4, PIT_WINDOWS[3].close);
    const L14 = addMinutesToTimeStr(data.A4, PIT_WINDOWS[4].open);
    const M14 = addMinutesToTimeStr(data.A4, PIT_WINDOWS[4].close);

    // E18 = Total Laps; J18 = Total Fuel
    const E18 = data.E4 + data.E6 + data.E8 + data.E10 + data.E12 + data.E14;
    const J18 = data.J4 + data.J6 + data.J8 + data.J10 + data.J12 + data.J14;

    // ---- Styles ----
    const border = '1px solid #333';
    const base: React.CSSProperties = {
        border,
        padding: '4px 6px',
        textAlign: 'center',
        fontSize: '12px',
        whiteSpace: 'nowrap',
    };
    const inputSt: React.CSSProperties = {
        width: '100%',
        border: 'none',
        background: 'transparent',
        textAlign: 'center',
        fontSize: '12px',
        padding: '2px',
        outline: 'none',
        fontFamily: 'inherit',
    };
    const cyan: React.CSSProperties       = { ...base, backgroundColor: '#87CEEB' };
    const yellow: React.CSSProperties     = { ...base, backgroundColor: '#FFD700', fontWeight: 'bold' };
    const calcGreen: React.CSSProperties  = { ...base, backgroundColor: '#92D050', fontWeight: 'bold' };
    const calcOrange: React.CSSProperties = { ...base, backgroundColor: '#FFA500', fontWeight: 'bold' };
    const timeGreen: React.CSSProperties  = { ...base, backgroundColor: '#92D050' };
    const timeOrange: React.CSSProperties = { ...base, backgroundColor: '#FFA500' };
    const bold: React.CSSProperties       = { ...base, fontWeight: 'bold' };
    const label: React.CSSProperties      = { ...base, fontWeight: 'bold', backgroundColor: '#f0f0f0' };
    const calcTotal: React.CSSProperties  = { ...bold, backgroundColor: '#FFF9C4' };

    const pitRow = (
        rowLabel: string,
        labelField: keyof ItalianGTEndData,
        driverField: keyof ItalianGTEndData,
        lapsField: keyof ItalianGTEndData,
        notesField: keyof ItalianGTEndData,
        tireField: keyof ItalianGTEndData,
        kmStartField: keyof ItalianGTEndData,
        kmEndField: keyof ItalianGTEndData,
        fuelField: keyof ItalianGTEndData,
        windowOpen: string,
        windowClose: string,
    ) => (
        <tr key={rowLabel}>
            <td style={label}>
                <input
                    type="text"
                    value={data[labelField] as string}
                    onChange={e => handleChange(labelField, e.target.value)}
                    style={{ ...inputSt, fontWeight: 'bold', textAlign: 'left' }}
                />
            </td>
            <td colSpan={3} style={base}>
                <input type="text" value={data[driverField] as string}
                    onChange={e => handleChange(driverField, e.target.value)} style={inputSt} />
            </td>
            <td style={base}>
                <input type="number" value={data[lapsField] as number || ''}
                    onChange={e => handleChange(lapsField, parseInt(e.target.value) || 0)} style={inputSt} />
            </td>
            <td style={base}>
                <input type="text" value={data[notesField] as string}
                    onChange={e => handleChange(notesField, e.target.value)} style={inputSt} />
            </td>
            <td style={base}>
                <input type="text" value={data[tireField] as string}
                    onChange={e => handleChange(tireField, e.target.value)} style={inputSt} />
            </td>
            <td style={base}>
                <input type="number" value={data[kmStartField] as number || ''}
                    onChange={e => handleChange(kmStartField, parseFloat(e.target.value) || 0)} style={inputSt} />
            </td>
            <td style={base}>
                <input type="number" value={data[kmEndField] as number || ''}
                    onChange={e => handleChange(kmEndField, parseFloat(e.target.value) || 0)} style={inputSt} />
            </td>
            <td style={base}>
                <input type="number" value={data[fuelField] as number || ''}
                    onChange={e => handleChange(fuelField, parseFloat(e.target.value) || 0)} style={inputSt} />
            </td>
            <td style={base}></td>
            <td style={timeGreen}>{windowOpen}</td>
            <td style={timeOrange}>{windowClose}</td>
            <td style={base}></td>
            <td style={base}></td>
        </tr>
    );

    const blankSepRow = (key: string) => (
        <tr key={key} style={{ height: '8px' }}>
            <td colSpan={15} style={{ border, padding: 0 }}></td>
        </tr>
    );

    return (
        <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
                <h1 style={{ margin: 0, color: '#2c5282' }}>🏁 Italian GT End RacePlan</h1>
            </div>

            {/* Action buttons */}
            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => window.print()}
                    style={{ padding: '8px 16px', backgroundColor: '#2c5282', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    🖨️ Print
                </button>
                <button
                    onClick={() => { localStorage.removeItem(LOCAL_STORAGE_KEY); setData(defaultData); }}
                    style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    🔄 Reset
                </button>
            </div>

            {/* Spreadsheet table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', tableLayout: 'fixed', minWidth: '1100px', width: '100%' }}>
                    <colgroup>
                        <col style={{ width: '9%' }} />   {/* A */}
                        <col style={{ width: '5%' }} />   {/* B */}
                        <col style={{ width: '5%' }} />   {/* C */}
                        <col style={{ width: '5%' }} />   {/* D */}
                        <col style={{ width: '5%' }} />   {/* E */}
                        <col style={{ width: '7%' }} />   {/* F */}
                        <col style={{ width: '7%' }} />   {/* G */}
                        <col style={{ width: '5%' }} />   {/* H */}
                        <col style={{ width: '5%' }} />   {/* I */}
                        <col style={{ width: '5%' }} />   {/* J */}
                        <col style={{ width: '2%' }} />   {/* K */}
                        <col style={{ width: '7%' }} />   {/* L */}
                        <col style={{ width: '7%' }} />   {/* M */}
                        <col style={{ width: '11%' }} />  {/* N */}
                        <col style={{ width: '11%' }} />  {/* O */}
                    </colgroup>
                    <tbody>
                        {/* ── Row 1 ── CAR# + Expected Pace */}
                        <tr>
                            <td colSpan={11} style={{ ...cyan, textAlign: 'left', padding: '8px', height: '40px' }}>
                                <strong>CAR#:&nbsp;</strong>
                                <input
                                    type="text"
                                    value={data.A1}
                                    onChange={e => handleChange('A1', e.target.value)}
                                    placeholder="Enter CAR#"
                                    style={{ ...inputSt, textAlign: 'left', fontWeight: 'bold', fontSize: '14px', display: 'inline', width: 'auto', minWidth: '120px' }}
                                />
                            </td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={{ ...bold, textAlign: 'left', fontSize: '11px' }}>EXPECTED PACE (HH:MM:SS)</td>
                            <td style={base}>
                                <input
                                    type="text"
                                    value={data.O1}
                                    onChange={e => handleChange('O1', e.target.value)}
                                    placeholder="01:48.000"
                                    style={inputSt}
                                />
                            </td>
                        </tr>

                        {/* ── Row 2 ── (cyan) + Consumption */}
                        <tr>
                            <td colSpan={11} style={{ ...cyan, height: '40px' }}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={{ ...bold, textAlign: 'left' }}>CONSUMPTION</td>
                            <td style={base}>
                                <input
                                    type="number"
                                    value={data.O2}
                                    onChange={e => handleChange('O2', parseFloat(e.target.value) || 0)}
                                    step="0.1"
                                    style={inputSt}
                                />
                            </td>
                        </tr>

                        {/* ── Row 3 ── Column headers */}
                        <tr>
                            <td style={yellow}>START</td>
                            <td colSpan={3} style={yellow}>DRIVER IN</td>
                            <td style={yellow}>LAPS</td>
                            <td style={yellow}>NOTES</td>
                            <td style={yellow}>TIRE SET</td>
                            <td style={yellow}>KM START</td>
                            <td style={yellow}>KM END</td>
                            <td style={yellow}>FUEL IN</td>
                            <td style={base}></td>
                            <td colSpan={2} style={yellow}>WINDOW</td>
                            <td colSpan={2} style={{ ...yellow, fontSize: '11px' }}>FUEL NEEDED PER STINT (5 KG MARGIN)</td>
                        </tr>

                        {/* ── Row 4 ── START data + sub-headers for window/fuel columns */}
                        <tr>
                            <td style={base}>
                                <input
                                    type="text"
                                    value={data.A4}
                                    onChange={e => handleChange('A4', e.target.value)}
                                    placeholder="hh:mm:ss"
                                    title="Start Time"
                                    style={inputSt}
                                />
                            </td>
                            <td colSpan={3} style={base}>
                                <input type="text" value={data.B4}
                                    onChange={e => handleChange('B4', e.target.value)} style={inputSt} />
                            </td>
                            <td style={base}>
                                <input type="number" value={data.E4 || ''}
                                    onChange={e => handleChange('E4', parseInt(e.target.value) || 0)} style={inputSt} />
                            </td>
                            <td style={base}>
                                <input type="text" value={data.F4}
                                    onChange={e => handleChange('F4', e.target.value)} style={inputSt} />
                            </td>
                            <td style={base}>
                                <input type="text" value={data.G4}
                                    onChange={e => handleChange('G4', e.target.value)} style={inputSt} />
                            </td>
                            <td style={base}>
                                <input type="number" value={data.H4 || ''}
                                    onChange={e => handleChange('H4', parseFloat(e.target.value) || 0)} style={inputSt} />
                            </td>
                            <td style={base}>
                                <input type="number" value={data.I4 || ''}
                                    onChange={e => handleChange('I4', parseFloat(e.target.value) || 0)} style={inputSt} />
                            </td>
                            <td style={base}>
                                <input type="number" value={data.J4 || ''}
                                    onChange={e => handleChange('J4', parseFloat(e.target.value) || 0)} style={inputSt} />
                            </td>
                            <td style={base}></td>
                            <td style={bold}>OPEN</td>
                            <td style={bold}>CLOSE</td>
                            <td style={{ ...bold, fontSize: '11px' }}>EARLY STOP(20 MIN)</td>
                            <td style={{ ...bold, fontSize: '11px' }}>LATE STOP(40 MIN)</td>
                        </tr>

                        {/* ── Row 5 ── Fuel needed calculations (N5, O5) */}
                        <tr>
                            <td style={base}></td>
                            <td colSpan={3} style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={calcGreen}>{N5.toFixed(8)}</td>
                            <td style={calcOrange}>{O5.toFixed(8)}</td>
                        </tr>

                        {/* ── Row 6 ── PIT1 */}
                        {pitRow('r6', 'A6', 'B6', 'E6', 'F6', 'G6', 'H6', 'I6', 'J6', L6, M6)}

                        {blankSepRow('sep7')}

                        {/* ── Row 8 ── PIT2 */}
                        {pitRow('r8', 'A8', 'B8', 'E8', 'F8', 'G8', 'H8', 'I8', 'J8', L8, M8)}

                        {blankSepRow('sep9')}

                        {/* ── Row 10 ── PIT3 */}
                        {pitRow('r10', 'A10', 'B10', 'E10', 'F10', 'G10', 'H10', 'I10', 'J10', L10, M10)}

                        {blankSepRow('sep11')}

                        {/* ── Row 12 ── PIT4 */}
                        {pitRow('r12', 'A12', 'B12', 'E12', 'F12', 'G12', 'H12', 'I12', 'J12', L12, M12)}

                        {blankSepRow('sep13')}

                        {/* ── Row 14 ── PIT5 */}
                        {pitRow('r14', 'A14', 'B14', 'E14', 'F14', 'G14', 'H14', 'I14', 'J14', L14, M14)}

                        {/* ── Rows 15-16 ── blank */}
                        <tr style={{ height: '8px' }}>
                            <td colSpan={15} style={{ border, padding: 0 }}></td>
                        </tr>
                        <tr style={{ height: '8px' }}>
                            <td colSpan={15} style={{ border, padding: 0 }}></td>
                        </tr>

                        {/* ── Row 17 ── TOTAL labels */}
                        <tr>
                            <td style={base}></td>
                            <td colSpan={3} style={base}></td>
                            <td style={{ ...bold, textAlign: 'center' }}>TOTAL</td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={{ ...bold, textAlign: 'center' }}>TOTAL</td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                        </tr>

                        {/* ── Row 18 ── E18 = Total Laps, J18 = Total Fuel */}
                        <tr>
                            <td style={base}></td>
                            <td colSpan={3} style={base}></td>
                            <td style={calcTotal} title="Total Laps">{E18}</td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={calcTotal} title="Total Fuel">{J18}</td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={base}></td>
                            <td style={calcOrange}></td>
                            <td style={base}></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Notes section — pit window descriptions derived from PIT_WINDOWS constants */}
            <div style={{ marginTop: '20px', padding: '10px 20px', fontSize: '13px', lineHeight: '1.8' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {PIT_WINDOWS.map((w, i) => (
                        <li key={i}>
                            ○ &nbsp;{i + 1}° cambio: tra il {w.open}&#39;00 ed il {w.close}&#39;00 minuto di gara
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ItalianGTEndRacePlan;
