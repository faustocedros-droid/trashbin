import React, { useState, useEffect } from 'react';

/**
 * Tire Sets Mileage - PROSPETTO UTILIZZO SET DI GOMME
 * Spreadsheet-like interface to track tyre set usage per event.
 *
 * Structure:
 *  Row 1 : Title + editable "VETTURA" field
 *  Row 2 : (spacer)
 *  Row 3 : Column headers – DENOMINAZIONE SET | EVENTO/DATA (B-S) | TOTALI | NOTE
 *  Row 4 : Editable event-date headers (A-S, U)
 *  Rows 5-42 : Data rows – A-S and U editable; T = auto-sum(B..S)
 */

const LOCAL_STORAGE_KEY = 'tireSetsMileage';
const NUM_EVENT_COLS = 18;   // columns B through S
const NUM_DATA_ROWS  = 38;   // rows 5 through 42

interface RowData {
  A: string;
  events: string[];  // 18 values – columns B-S
  U: string;
}

interface TireSetsMileageData {
  vettura:    string;
  row4A:      string;
  row4Events: string[];   // 18 event-header strings – row 4, B-S
  row4U:      string;
  rows:       RowData[];
}

function createDefaultRow(): RowData {
  return { A: '', events: Array(NUM_EVENT_COLS).fill(''), U: '' };
}

function createDefaultData(): TireSetsMileageData {
  return {
    vettura:    '',
    row4A:      '',
    row4Events: Array(NUM_EVENT_COLS).fill(''),
    row4U:      '',
    rows:       Array.from({ length: NUM_DATA_ROWS }, createDefaultRow),
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  fontSize: '11px',
  width: '100%',
};

const cellBase: React.CSSProperties = {
  border: '1px solid #aaa',
  padding: '1px',
  textAlign: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
};

const headerCell: React.CSSProperties = {
  ...cellBase,
  backgroundColor: '#BDD7EE',
  fontWeight: 'bold',
  fontSize: '12px',
  whiteSpace: 'nowrap',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: 'none',
  outline: 'none',
  background: 'transparent',
  textAlign: 'center',
  fontSize: '11px',
  boxSizing: 'border-box',
};

const multilineInputStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'none',
  overflow: 'hidden',
  lineHeight: '1.3',
};

const totalCellStyle: React.CSSProperties = {
  ...cellBase,
  color: '#C00000',
  fontWeight: 'bold',
};

// Column widths
const colWidths = {
  A: '130px',
  event: '70px',
  T: '60px',
  U: '160px',
};

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────

function TireSetsMileage() {
  const [data, setData] = useState<TireSetsMileageData>(createDefaultData);

  // ── persistence ────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<TireSetsMileageData>;
        setData(prev => ({
          ...prev,
          ...parsed,
          rows: Array.from({ length: NUM_DATA_ROWS }, (_, i) =>
            parsed.rows?.[i] ?? createDefaultRow()
          ),
          row4Events: parsed.row4Events ?? Array(NUM_EVENT_COLS).fill(''),
        }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const save = (next: TireSetsMileageData) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
  };

  // ── helpers ─────────────────────────────────────────────────────────────────
  const setVettura = (v: string) => {
    const next = { ...data, vettura: v };
    setData(next);
    save(next);
  };

  const setRow4A = (v: string) => {
    const next = { ...data, row4A: v };
    setData(next);
    save(next);
  };

  const setRow4Event = (colIdx: number, v: string) => {
    const row4Events = [...data.row4Events];
    row4Events[colIdx] = v;
    const next = { ...data, row4Events };
    setData(next);
    save(next);
  };

  const setRow4U = (v: string) => {
    const next = { ...data, row4U: v };
    setData(next);
    save(next);
  };

  const setRowA = (rowIdx: number, v: string) => {
    const rows = data.rows.map((r, i) => i === rowIdx ? { ...r, A: v } : r);
    const next = { ...data, rows };
    setData(next);
    save(next);
  };

  const setRowEvent = (rowIdx: number, colIdx: number, v: string) => {
    const rows = data.rows.map((r, i) => {
      if (i !== rowIdx) return r;
      const events = [...r.events];
      events[colIdx] = v;
      return { ...r, events };
    });
    const next = { ...data, rows };
    setData(next);
    save(next);
  };

  const setRowU = (rowIdx: number, v: string) => {
    const rows = data.rows.map((r, i) => i === rowIdx ? { ...r, U: v } : r);
    const next = { ...data, rows };
    setData(next);
    save(next);
  };

  /** Sum of numeric values in B-S for a given data row */
  const rowTotal = (row: RowData): number =>
    row.events.reduce((acc, v) => {
      const n = parseFloat(v);
      return acc + (isNaN(n) ? 0 : n);
    }, 0);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px', overflowX: 'auto' }}>
      <h2 style={{ marginBottom: '16px' }}>🏎️ Tire Sets Mileage</h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <colgroup>
            {/* A */}
            <col style={{ width: colWidths.A }} />
            {/* B-S : 18 event columns */}
            {Array.from({ length: NUM_EVENT_COLS }).map((_, i) => (
              <col key={i} style={{ width: colWidths.event }} />
            ))}
            {/* T */}
            <col style={{ width: colWidths.T }} />
            {/* U */}
            <col style={{ width: colWidths.U }} />
          </colgroup>

          <tbody>
            {/* ── Row 1 : Title + VETTURA ─────────────────────────────────── */}
            <tr>
              <td
                colSpan={13}
                style={{
                  ...cellBase,
                  backgroundColor: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  border: '1px solid #aaa',
                }}
              >
                PROSPETTO UTILIZZO SET DI GOMME
              </td>
              {/* VETTURA label */}
              <td
                colSpan={3}
                style={{
                  ...cellBase,
                  backgroundColor: '#BDD7EE',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textAlign: 'center',
                }}
              >
                VETTURA
              </td>
              {/* Editable VETTURA field – spans remaining columns to U */}
              <td
                colSpan={5}
                style={{ ...cellBase, backgroundColor: '#FFFFFF' }}
              >
                <input
                  type="text"
                  value={data.vettura}
                  onChange={e => setVettura(e.target.value)}
                  style={{ ...inputStyle, fontWeight: 'bold' }}
                  placeholder="vettura..."
                />
              </td>
            </tr>

            {/* ── Row 2 : spacer ──────────────────────────────────────────── */}
            <tr>
              <td colSpan={NUM_EVENT_COLS + 3} style={{ ...cellBase, height: '8px' }} />
            </tr>

            {/* ── Row 3 : Column headers ───────────────────────────────────── */}
            <tr>
              <td style={{ ...headerCell, textAlign: 'left', paddingLeft: '4px' }}>
                DENOMINAZIONE SET
              </td>
              <td colSpan={NUM_EVENT_COLS} style={{ ...headerCell, textAlign: 'center' }}>
                EVENTO/DATA
              </td>
              <td style={{ ...headerCell, color: '#C00000' }}>TOTALI</td>
              <td style={{ ...headerCell }}>NOTE</td>
            </tr>

            {/* ── Row 4 : Editable event-date headers ──────────────────────── */}
            <tr>
              {/* A4 */}
              <td style={{ ...cellBase, backgroundColor: '#EBF3FB' }}>
                <input
                  type="text"
                  value={data.row4A}
                  onChange={e => setRow4A(e.target.value)}
                  style={inputStyle}
                />
              </td>
              {/* B4-S4 – 18 event headers */}
              {data.row4Events.map((v, ci) => (
                <td key={ci} style={{ ...cellBase, backgroundColor: '#EBF3FB' }}>
                  <textarea
                    value={v}
                    onChange={e => setRow4Event(ci, e.target.value)}
                    rows={3}
                    style={{ ...multilineInputStyle, height: '52px' }}
                  />
                </td>
              ))}
              {/* T4 – not editable (header row, no sum needed) */}
              <td style={{ ...cellBase, backgroundColor: '#EBF3FB' }} />
              {/* U4 */}
              <td style={{ ...cellBase, backgroundColor: '#EBF3FB' }}>
                <input
                  type="text"
                  value={data.row4U}
                  onChange={e => setRow4U(e.target.value)}
                  style={inputStyle}
                />
              </td>
            </tr>

            {/* ── Rows 5-42 : Data rows ────────────────────────────────────── */}
            {data.rows.map((row, ri) => {
              const total = rowTotal(row);
              return (
                <tr key={ri}>
                  {/* A – tire-set name */}
                  <td style={{ ...cellBase, textAlign: 'left' }}>
                    <input
                      type="text"
                      value={row.A}
                      onChange={e => setRowA(ri, e.target.value)}
                      style={{ ...inputStyle, textAlign: 'left' }}
                    />
                  </td>
                  {/* B-S – km per event */}
                  {row.events.map((v, ci) => (
                    <td key={ci} style={cellBase}>
                      <input
                        type="text"
                        value={v}
                        onChange={e => setRowEvent(ri, ci, e.target.value)}
                        style={inputStyle}
                      />
                    </td>
                  ))}
                  {/* T – auto-calculated sum */}
                  <td style={totalCellStyle}>
                    {total}
                  </td>
                  {/* U – notes */}
                  <td style={{ ...cellBase, textAlign: 'left' }}>
                    <input
                      type="text"
                      value={row.U}
                      onChange={e => setRowU(ri, e.target.value)}
                      style={{ ...inputStyle, textAlign: 'left' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TireSetsMileage;
