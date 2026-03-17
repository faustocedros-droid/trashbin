import React, { useState } from 'react';

/**
 * Timesheet
 * Reproduces the Excel Timesheet with all editable fields (highlighted in yellow).
 * Data is persisted to localStorage. The sheet is printable via the Print button.
 */

const NUM_LAPS = 33;

interface LapRow {
  laptime: string;
  s1: string;
  s2: string;
  s3: string;
  s4: string;
  tireSet: string;
  hotPress: string;
}

interface TimesheetState {
  date: string;
  weather: string;
  session: string;
  fuelIn: string;
  endurLaps: string;
  fuelOut: string;
  drivers: string;
  notes: string;
  tireSetN: string;
  kmStart: string;
  kmEnd: string;
  lapRows: LapRow[];
}

const defaultLapRow = (): LapRow => ({
  laptime: '',
  s1: '',
  s2: '',
  s3: '',
  s4: '',
  tireSet: '',
  hotPress: '',
});

const defaultState = (): TimesheetState => ({
  date: '',
  weather: '',
  session: '',
  fuelIn: '',
  endurLaps: '',
  fuelOut: '',
  drivers: '',
  notes: '',
  tireSetN: '',
  kmStart: '',
  kmEnd: '',
  lapRows: Array.from({ length: NUM_LAPS }, defaultLapRow),
});

function Timesheet() {
  const [data, setData] = useState<TimesheetState>(() => {
    const saved = localStorage.getItem('timesheetData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TimesheetState;
        // Ensure lapRows has the correct length, preserving existing data
        if (!parsed.lapRows || parsed.lapRows.length !== NUM_LAPS) {
          const existing: LapRow[] = Array.isArray(parsed.lapRows) ? parsed.lapRows : [];
          parsed.lapRows = Array.from({ length: NUM_LAPS }, (_, i) =>
            existing[i] ?? defaultLapRow()
          );
        }
        return parsed;
      } catch {
        // fall through to default
      }
    }
    return defaultState();
  });

  const save = (next: TimesheetState) => {
    setData(next);
    localStorage.setItem('timesheetData', JSON.stringify(next));
  };

  const setField = (field: keyof Omit<TimesheetState, 'lapRows'>, value: string) => {
    save({ ...data, [field]: value });
  };

  const setLapField = (lapIndex: number, field: keyof LapRow, value: string) => {
    const next = data.lapRows.map((row, i) =>
      i === lapIndex ? { ...row, [field]: value } : row
    );
    save({ ...data, lapRows: next });
  };

  /* ── Styles ─────────────────────────────────────────────── */

  const cell: React.CSSProperties = {
    border: '1px solid #000',
    padding: '3px 5px',
    textAlign: 'center',
    fontSize: '11px',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
  };

  const grayCell: React.CSSProperties = {
    ...cell,
    backgroundColor: '#d9d9d9',
    fontWeight: 'bold',
  };

  const yellowCell: React.CSSProperties = {
    ...cell,
    backgroundColor: '#ffff00',
  };

  const lapCell: React.CSSProperties = {
    ...cell,
    backgroundColor: '#fff',
  };

  const inp: React.CSSProperties = {
    width: '100%',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    fontSize: '11px',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    padding: 0,
    boxSizing: 'border-box',
  };

  const inpLeft: React.CSSProperties = { ...inp, textAlign: 'left' };

  const tableStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    width: '100%',
    tableLayout: 'fixed',
  };

  /* ── Column widths (8 columns) ────────────────────────────
     Lap | Laptime | S1 | S2 | S3 | S4 | Tire Set | Hot Press
  ─────────────────────────────────────────────────────────── */
  const colWidths = ['5%', '15%', '10%', '10%', '10%', '10%', '20%', '20%'];

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* ── Action buttons (hidden when printing) ── */}
      <div
        className="no-print"
        style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}
      >
        <button
          onClick={() => window.print()}
          style={{
            padding: '10px 24px',
            fontSize: '15px',
            backgroundColor: '#2c5282',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          🖨️ Stampa Timesheet
        </button>
        <button
          onClick={() => {
            if (window.confirm('Sei sicuro di voler resettare tutti i dati del Timesheet?')) {
              save(defaultState());
            }
          }}
          style={{
            padding: '10px 24px',
            fontSize: '15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          🔄 Reset
        </button>
      </div>

      {/* ── Printable sheet ── */}
      <div id="timesheet-printable" style={{ backgroundColor: 'white', padding: '10px' }}>
        <table style={tableStyle}>
          <colgroup>
            {colWidths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <tbody>
            {/* ── Row 1: Timesheet title + Date ── */}
            <tr style={{ height: '32px' }}>
              <td
                colSpan={4}
                rowSpan={2}
                style={{
                  ...cell,
                  fontSize: '18px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                }}
              >
                Timesheet
              </td>
              {/* gap column */}
              <td style={cell} />
              <td style={grayCell}>Date</td>
              <td colSpan={2} style={yellowCell}>
                <input
                  style={inp}
                  value={data.date}
                  onChange={e => setField('date', e.target.value)}
                />
              </td>
            </tr>

            {/* ── Row 2: Weather ── */}
            <tr style={{ height: '28px' }}>
              {/* cols 1-4 spanned by Timesheet title rowspan above */}
              <td style={cell} />
              <td style={grayCell}>Weather</td>
              <td colSpan={2} style={yellowCell}>
                <input
                  style={inp}
                  value={data.weather}
                  onChange={e => setField('weather', e.target.value)}
                />
              </td>
            </tr>

            {/* ── Row 3: Session info labels ── */}
            <tr style={{ height: '24px' }}>
              <td style={grayCell}>Session</td>
              <td style={grayCell}>Fuel In</td>
              <td style={grayCell}>Endur.(Laps)</td>
              <td style={grayCell}>Fuel Out</td>
              <td style={cell} />
              <td colSpan={3} style={grayCell}>
                Drivers
              </td>
            </tr>

            {/* ── Row 4: Session info inputs (yellow) ── */}
            <tr style={{ height: '28px' }}>
              <td style={yellowCell}>
                <input
                  style={inp}
                  value={data.session}
                  onChange={e => setField('session', e.target.value)}
                />
              </td>
              <td style={yellowCell}>
                <input
                  style={inp}
                  value={data.fuelIn}
                  onChange={e => setField('fuelIn', e.target.value)}
                />
              </td>
              <td style={yellowCell}>
                <input
                  style={inp}
                  value={data.endurLaps}
                  onChange={e => setField('endurLaps', e.target.value)}
                />
              </td>
              <td style={yellowCell}>
                <input
                  style={inp}
                  value={data.fuelOut}
                  onChange={e => setField('fuelOut', e.target.value)}
                />
              </td>
              <td style={cell} />
              <td colSpan={3} style={yellowCell}>
                <input
                  style={inp}
                  value={data.drivers}
                  onChange={e => setField('drivers', e.target.value)}
                />
              </td>
            </tr>

            {/* ── Row 5: Notes label + Tire Set header ── */}
            <tr style={{ height: '24px' }}>
              <td
                colSpan={5}
                rowSpan={2}
                style={{
                  ...yellowCell,
                  verticalAlign: 'top',
                  padding: '4px 6px',
                }}
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '11px',
                    marginBottom: '4px',
                    color: '#333',
                  }}
                >
                  Notes:
                </div>
                <textarea
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontSize: '11px',
                    backgroundColor: 'transparent',
                    fontFamily: 'inherit',
                    padding: 0,
                    height: '48px',
                    boxSizing: 'border-box',
                  }}
                  value={data.notes}
                  onChange={e => setField('notes', e.target.value)}
                />
              </td>
              <td colSpan={3} style={grayCell}>
                Tire Set
              </td>
            </tr>

            {/* ── Row 6: Tire Set inputs ── */}
            <tr style={{ height: '28px' }}>
              {/* cols 1-5 spanned by Notes above */}
              <td style={yellowCell}>
                <div style={{ fontSize: '9px', color: '#555' }}>Set N.</div>
                <input
                  style={inp}
                  value={data.tireSetN}
                  onChange={e => setField('tireSetN', e.target.value)}
                />
              </td>
              <td style={yellowCell}>
                <div style={{ fontSize: '9px', color: '#555' }}>Km Start</div>
                <input
                  style={inp}
                  value={data.kmStart}
                  onChange={e => setField('kmStart', e.target.value)}
                />
              </td>
              <td style={yellowCell}>
                <div style={{ fontSize: '9px', color: '#555' }}>Km End</div>
                <input
                  style={inp}
                  value={data.kmEnd}
                  onChange={e => setField('kmEnd', e.target.value)}
                />
              </td>
            </tr>

            {/* ── Row 7: Lap table header ── */}
            <tr style={{ height: '24px' }}>
              <td style={grayCell}>Lap</td>
              <td style={grayCell}>Laptime</td>
              <td style={grayCell}>S1</td>
              <td style={grayCell}>S2</td>
              <td style={grayCell}>S3</td>
              <td style={grayCell}>S4</td>
              <td style={grayCell}>Tire Set</td>
              <td style={grayCell}>Hot Press</td>
            </tr>

            {/* ── Rows 8–40: 33 lap rows ── */}
            {data.lapRows.map((row, i) => (
              <tr key={i} style={{ height: '22px' }}>
                {/* Lap number — read-only */}
                <td
                  style={{
                    ...cell,
                    backgroundColor: '#f2f2f2',
                    fontWeight: 'bold',
                    fontSize: '11px',
                  }}
                >
                  {i + 1}
                </td>

                {/* Laptime */}
                <td style={lapCell}>
                  <input
                    style={inp}
                    value={row.laptime}
                    onChange={e => setLapField(i, 'laptime', e.target.value)}
                  />
                </td>

                {/* S1 */}
                <td style={lapCell}>
                  <input
                    style={inp}
                    value={row.s1}
                    onChange={e => setLapField(i, 's1', e.target.value)}
                  />
                </td>

                {/* S2 */}
                <td style={lapCell}>
                  <input
                    style={inp}
                    value={row.s2}
                    onChange={e => setLapField(i, 's2', e.target.value)}
                  />
                </td>

                {/* S3 */}
                <td style={lapCell}>
                  <input
                    style={inp}
                    value={row.s3}
                    onChange={e => setLapField(i, 's3', e.target.value)}
                  />
                </td>

                {/* S4 */}
                <td style={lapCell}>
                  <input
                    style={inp}
                    value={row.s4}
                    onChange={e => setLapField(i, 's4', e.target.value)}
                  />
                </td>

                {/* Tire Set */}
                <td style={lapCell}>
                  <input
                    style={inp}
                    value={row.tireSet}
                    onChange={e => setLapField(i, 'tireSet', e.target.value)}
                  />
                </td>

                {/* Hot Press */}
                <td style={lapCell}>
                  <input
                    style={inpLeft}
                    value={row.hotPress}
                    onChange={e => setLapField(i, 'hotPress', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Print CSS ── */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #timesheet-printable,
          #timesheet-printable * {
            visibility: visible;
          }
          #timesheet-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          input, textarea {
            border: none !important;
            background: transparent !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Timesheet;
