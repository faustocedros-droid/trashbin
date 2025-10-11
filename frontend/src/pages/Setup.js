import React, { useState, useEffect } from 'react';

function Setup() {
  const [setupData, setSetupData] = useState({
    metadata: {
      vettura: '',
      circuito: '',
      evento: '',
      data: ''
    },
    rows: []
  });

  // Initialize setup data matching SetupSheet.xlsx structure
  const initializeSetupData = () => {
    const setupParameters = [
      'altezza punti FIA (mm)',
      'altezza fondo (mm)',
      'rigid. molla / precarico / HPush (mm)',
      'luce tampone [mm]',
      'packers [mm]',
      'camber.[° dec]',
      'convergenza [mm]',
      'set ammortizzatore B / R - Low Sp.',
      'set ammortizzatore B / R - Hi Sp.',
      'D. barra a/r (mm)',
      'Pos. coltelli barra',
      'asse post.',
      'altezza punti FIA (mm)',
      'altezza fondo (mm)',
      'rigid. molla / Precarico ghiera. (mm)',
      'luce tampone',
      'packers [mm]',
      'camber.[° dec]',
      'convergenza [mm]',
      'set ammortizzatore B / R - Low Sp.',
      'set ammortizzatore B / R - Hi Sp.',
      'D. e Sp. barra a/r (mm)',
      'Pos. coltelli barra',
      'ammortizzatori',
      'valvolaggio ammortizzatore',
      'tamponi',
      'aero',
      'regolazione ala posiz. / gradi',
      'freni',
      'pastiglie ant / post',
      'ripartizione (bar) / D. pompe (mm)',
      'Blanking %',
      'pesi',
      'peso tot',
      'prevalenza. Diag AD-PS (%)',
      'pesi AS / AD',
      'pesi PS / PD',
      'differenziale',
      'precarico [Nm] / Facce a contatto [nr.]',
      'controlli',
      'TC: posiz - sw ver. ID',
      'TC: posiz - sw ver. ID',
      'ABS: posiz - sw ver. ID',
      'ENG BR: posiz - sw ver. ID',
      'BoP CIGT Endurance',
      'd. restrittore aspirazione (mm)',
      'peso minimo (Kg) vettura – ballast'
    ];

    const rows = setupParameters.map((param, index) => ({
      rowId: index,
      parameter: param,
      workshop: '',
      col_c: '',
      bop: '',
      t1: '',
      t2: '',
      t3: '',
      t4: '',
      fp1: '',
      fp2: '',
      q: '',
      r1: '',
      r2: '',
      note: ''
    }));

    return {
      metadata: {
        vettura: '',
        circuito: '',
        evento: '',
        data: ''
      },
      rows: rows
    };
  };

  // Load saved setup data from localStorage on component mount
  useEffect(() => {
    const savedSetup = localStorage.getItem('generalInfo_setup');
    if (savedSetup) {
      try {
        setSetupData(JSON.parse(savedSetup));
      } catch (error) {
        console.error('Error loading setup data:', error);
        setSetupData(initializeSetupData());
      }
    } else {
      setSetupData(initializeSetupData());
    }
  }, []);

  // Handle setup metadata change
  const handleSetupMetadataChange = (field, value) => {
    const updatedSetup = {
      ...setupData,
      metadata: {
        ...setupData.metadata,
        [field]: value
      }
    };
    setSetupData(updatedSetup);
    // Auto-save to localStorage
    localStorage.setItem('generalInfo_setup', JSON.stringify(updatedSetup));
  };

  // Handle setup row data change
  const handleSetupRowChange = (rowIndex, columnKey, value) => {
    const updatedSetup = {
      ...setupData,
      rows: setupData.rows.map((row, index) => 
        index === rowIndex 
          ? { ...row, [columnKey]: value }
          : row
      )
    };
    setSetupData(updatedSetup);
    // Auto-save to localStorage
    localStorage.setItem('generalInfo_setup', JSON.stringify(updatedSetup));
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>🏎️ Setup</h1>
      
      {/* SETUP Section */}
      <div className="card" style={{ marginTop: '30px' }} id="printable-setup">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>SETUP</h2>
          <button
            onClick={() => window.print()}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#2c5282',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            🖨️ Stampa Setup
          </button>
        </div>
        
        {/* Metadata Fields */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px',
          marginTop: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Vettura
            </label>
            <input
              type="text"
              value={setupData.metadata.vettura}
              onChange={(e) => handleSetupMetadataChange('vettura', e.target.value)}
              placeholder="..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Circuito
            </label>
            <input
              type="text"
              value={setupData.metadata.circuito}
              onChange={(e) => handleSetupMetadataChange('circuito', e.target.value)}
              placeholder="..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Evento
            </label>
            <input
              type="text"
              value={setupData.metadata.evento}
              onChange={(e) => handleSetupMetadataChange('evento', e.target.value)}
              placeholder="..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Data
            </label>
            <input
              type="text"
              value={setupData.metadata.data}
              onChange={(e) => handleSetupMetadataChange('data', e.target.value)}
              placeholder="..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Setup Table */}
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ 
            width: '100%',
            borderCollapse: 'collapse',
            border: '2px solid #333',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#4472C4', color: 'white' }}>
                <th style={{ 
                  padding: '10px', 
                  border: '1px solid #333', 
                  textAlign: 'left',
                  minWidth: '280px',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#4472C4',
                  zIndex: 10
                }}>
                  Parametro
                </th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '100px' }}>Workshop</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>C</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>BoP</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>T1</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>T2</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>T3</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>T4</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>Fp1</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>Fp2</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>Q</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>R1</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>R2</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '120px' }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {setupData.rows.map((row, rowIndex) => {
                const isHeaderRow = row.parameter === 'asse post.';
                return (
                  <tr key={rowIndex} style={{ 
                    backgroundColor: isHeaderRow ? '#E7E6E6' : (rowIndex % 2 === 0 ? '#ffffff' : '#f9f9f9')
                  }}>
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #ddd',
                      fontWeight: isHeaderRow ? 'bold' : 'normal',
                      backgroundColor: isHeaderRow ? '#E7E6E6' : '#f5f5f5',
                      position: 'sticky',
                      left: 0,
                      zIndex: 5
                    }}>
                      {row.parameter}
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.workshop}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'workshop', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.col_c}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'col_c', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.bop}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'bop', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.t1}
                        onChange={(e) => handleSetupRowChange(rowIndex, 't1', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.t2}
                        onChange={(e) => handleSetupRowChange(rowIndex, 't2', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.t3}
                        onChange={(e) => handleSetupRowChange(rowIndex, 't3', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.t4}
                        onChange={(e) => handleSetupRowChange(rowIndex, 't4', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.fp1}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'fp1', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.fp2}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'fp2', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.q}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'q', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.r1}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'r1', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.r2}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'r2', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        value={row.note}
                        onChange={(e) => handleSetupRowChange(rowIndex, 'note', e.target.value)}
                        placeholder="..."
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: '1px solid #ddd',
                          borderRadius: '3px',
                          fontSize: '13px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-setup, #printable-setup * {
              visibility: visible;
            }
            #printable-setup {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            #printable-setup button {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Setup;
