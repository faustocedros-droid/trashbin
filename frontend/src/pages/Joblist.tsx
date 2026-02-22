import React, { useState } from 'react';

/**
 * Joblist Sheet
 * Reproduces the Excel Joblist sheet faithfully.
 * Header fields (Car N#, Track, Session, Date) and empty item rows are editable.
 * All "Done" checkboxes are editable.
 * The sheet is printable via the Print button.
 */

const PREFILLED_ITEMS: string[] = [
  'Controllo scorrevolezza e giochi ruote',
  'Controllo fondi/Danni carrozzeria/Specchietti/Livrea/Adesivi obbligatori',
  'Controllo e pulizia griglie anteriori/laterali/Freni post',
  'Controllo vano avantreno/livello liquidi: freno,idroguida...',
  'Controllo perdite zona anteriore/ispezione e pulizia radiatori',
  'Ispezione vano motore /controllo semiassi',
  'Controllo centraggio volante',
  'Ispezione dischi/pastiglie freno',
  'Check SD Card video/ Racelogic',
  'Controllo   bombole e fruste pit/pistole/fuel tower/lollipop',
  'Controllo gomme scaldone',
  'FUEL IN e fire up a 30min dall\u00b4inizio prossima sessione',
  'Fuel out',
];

const TOTAL_ITEMS = 20;

interface JoblistState {
  carNumber: string;
  track: string;
  session: string;
  date: string;
  itemDescriptions: string[];
  done: boolean[];
  notes: string;
}

function Joblist() {
  const [data, setData] = useState<JoblistState>(() => {
    const saved = localStorage.getItem('joblistData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fall through to default
      }
    }
    return {
      carNumber: '',
      track: '',
      session: '',
      date: '',
      itemDescriptions: Array(TOTAL_ITEMS).fill(''),
      done: Array(TOTAL_ITEMS).fill(false),
      notes: '',
    };
  });

  const save = (next: JoblistState) => {
    setData(next);
    localStorage.setItem('joblistData', JSON.stringify(next));
  };

  const setHeader = (field: keyof Pick<JoblistState, 'carNumber' | 'track' | 'session' | 'date'>, value: string) => {
    save({ ...data, [field]: value });
  };

  const setItemDesc = (index: number, value: string) => {
    const next = [...data.itemDescriptions];
    next[index] = value;
    save({ ...data, itemDescriptions: next });
  };

  const toggleDone = (index: number) => {
    const next = [...data.done];
    next[index] = !next[index];
    save({ ...data, done: next });
  };

  const setNotes = (value: string) => {
    save({ ...data, notes: value });
  };

  const cellStyle: React.CSSProperties = {
    border: '1px solid #000',
    padding: '4px 6px',
    textAlign: 'center',
    fontSize: '12px',
    verticalAlign: 'middle',
    boxSizing: 'border-box',
  };

  const headerLabelStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: '#d9d9d9',
    fontWeight: 'bold',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    fontSize: '12px',
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    padding: 0,
  };

  const tableStyle: React.CSSProperties = {
    borderCollapse: 'collapse',
    width: '100%',
    tableLayout: 'fixed',
  };

  // Column widths (approximate, based on Excel structure)
  // A: number (~4%), B-H: description (~10.5% each = 73.5%), I: done (~8%)
  const colWidths = ['5%', '10.5%', '10.5%', '10.5%', '10.5%', '10.5%', '10.5%', '10.5%', '7%'];

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Action buttons — hidden when printing */}
      <div className="no-print" style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
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
          🖨️ Stampa Joblist
        </button>
        <button
          onClick={() => {
            const fresh: JoblistState = {
              carNumber: '',
              track: '',
              session: '',
              date: '',
              itemDescriptions: Array(TOTAL_ITEMS).fill(''),
              done: Array(TOTAL_ITEMS).fill(false),
              notes: '',
            };
            save(fresh);
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

      {/* Printable sheet */}
      <div id="joblist-printable" style={{ backgroundColor: 'white', padding: '10px' }}>
        <table style={tableStyle}>
          <colgroup>
            {colWidths.map((w, i) => (
              <col key={i} style={{ width: w }} />
            ))}
          </colgroup>
          <tbody>
            {/* Row 1-3: Title */}
            <tr style={{ height: '50px' }}>
              <td
                colSpan={9}
                style={{
                  ...cellStyle,
                  fontSize: '22px',
                  fontWeight: 'bold',
                  backgroundColor: '#1e3a5f',
                  color: 'white',
                  letterSpacing: '2px',
                }}
              >
                JOBLIST
              </td>
            </tr>

            {/* Row 4: Header labels */}
            <tr style={{ height: '28px' }}>
              <td style={headerLabelStyle}>Car N#</td>
              <td style={headerLabelStyle} colSpan={2}>Track</td>
              <td colSpan={2} style={headerLabelStyle}>Session</td>
              <td colSpan={2} style={headerLabelStyle}>Date</td>
              <td style={{ ...cellStyle, backgroundColor: '#d9d9d9' }} />
              <td style={headerLabelStyle}>Done</td>
            </tr>

            {/* Row 5: Header inputs */}
            <tr style={{ height: '28px' }}>
              <td style={cellStyle}>
                <input
                  style={inputStyle}
                  value={data.carNumber}
                  onChange={e => setHeader('carNumber', e.target.value)}
                  placeholder=""
                />
              </td>
              <td colSpan={2} style={cellStyle}>
                <input
                  style={inputStyle}
                  value={data.track}
                  onChange={e => setHeader('track', e.target.value)}
                  placeholder=""
                />
              </td>
              <td colSpan={2} style={cellStyle}>
                <input
                  style={inputStyle}
                  value={data.session}
                  onChange={e => setHeader('session', e.target.value)}
                  placeholder=""
                />
              </td>
              <td colSpan={2} style={cellStyle}>
                <input
                  style={inputStyle}
                  value={data.date}
                  onChange={e => setHeader('date', e.target.value)}
                  placeholder=""
                />
              </td>
              <td style={cellStyle} />
              <td style={cellStyle} />
            </tr>

            {/* Items rows */}
            {Array.from({ length: TOTAL_ITEMS }, (_, i) => {
              const num = i + 1;
              const prefilledDesc = i < PREFILLED_ITEMS.length ? PREFILLED_ITEMS[i] : '';
              const isEditable = i >= PREFILLED_ITEMS.length;
              const isDone = data.done[i];

              return (
                <tr key={i} style={{ height: '36px' }}>
                  {/* Number */}
                  <td
                    style={{
                      ...cellStyle,
                      backgroundColor: '#f2f2f2',
                      fontWeight: 'bold',
                    }}
                  >
                    {num}
                  </td>

                  {/* Description (B–H = 7 columns) */}
                  <td
                    colSpan={7}
                    style={{
                      ...cellStyle,
                      textAlign: 'left',
                      backgroundColor: isEditable ? '#fffbe6' : (isDone ? '#e8f5e9' : 'white'),
                    }}
                  >
                    {isEditable ? (
                      <input
                        style={{ ...inputStyle, textAlign: 'left' }}
                        value={data.itemDescriptions[i]}
                        onChange={e => setItemDesc(i, e.target.value)}
                        placeholder="(vuoto)"
                      />
                    ) : (
                      prefilledDesc
                    )}
                  </td>

                  {/* Done checkbox */}
                  <td
                    style={{
                      ...cellStyle,
                      cursor: 'pointer',
                      backgroundColor: isDone ? '#c8e6c9' : 'white',
                      fontSize: '18px',
                    }}
                    onClick={() => toggleDone(i)}
                    title="Click per segnare come fatto"
                  >
                    {isDone ? '✅' : ''}
                  </td>
                </tr>
              );
            })}

            {/* Notes row */}
            <tr style={{ height: '50px' }}>
              <td
                style={{
                  ...cellStyle,
                  backgroundColor: '#f2f2f2',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  writingMode: 'vertical-lr',
                  textOrientation: 'mixed',
                }}
              >
                Note
              </td>
              <td colSpan={8} style={{ ...cellStyle, textAlign: 'left', verticalAlign: 'top', padding: '6px' }}>
                <textarea
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    resize: 'none',
                    backgroundColor: 'transparent',
                    minHeight: '40px',
                  }}
                  value={data.notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder=""
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #joblist-printable,
          #joblist-printable * {
            visibility: visible;
          }
          #joblist-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 10mm;
          }
          .no-print {
            display: none !important;
          }
          input, textarea {
            border: none !important;
            outline: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Joblist;
