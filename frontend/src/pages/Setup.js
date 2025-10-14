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
      'asse ant',
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
      'Generale',
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

  // Handle reset of setup data
  const handleResetSetup = () => {
    if (window.confirm('Sei sicuro di voler resettare tutti i dati della tabella Setup? Questa azione non può essere annullata.')) {
      localStorage.removeItem('generalInfo_setup');
      const initialData = initializeSetupData();
      setSetupData(initialData);
    }
  };

  // Export setup data to file
  const handleExportSetup = () => {
    const dataToExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      setupData: setupData
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const eventName = setupData.metadata.evento.replace(/[^a-zA-Z0-9]/g, '_') || 'setup';
    link.download = `setup_${eventName}_${new Date().toISOString().split('T')[0]}.setup`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import setup data from file
  const handleImportSetup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result);
        
        if (!importedData.setupData) {
          throw new Error('File non valido: struttura dati mancante');
        }

        if (window.confirm('Vuoi importare questi dati di setup? I dati attuali saranno sostituiti.')) {
          setSetupData(importedData.setupData);
          localStorage.setItem('generalInfo_setup', JSON.stringify(importedData.setupData));
          alert('Setup importato con successo!');
        }
      } catch (error) {
        console.error('Error importing setup:', error);
        alert('Errore nel caricamento del file! Assicurati che sia un file .setup valido.');
      }
    };
    reader.readAsText(file);
    
    // Reset input to allow importing the same file again
    e.target.value = '';
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>🏎️ Setup</h1>
      
      {/* SETUP Section */}
      <div className="card" style={{ marginTop: '30px' }} id="printable-setup">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>SETUP</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExportSetup}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title="Esporta dati Setup in file"
            >
              💾 Esporta
            </button>
            <label
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title="Importa dati Setup da file"
            >
              📂 Importa
              <input
                type="file"
                accept=".setup"
                onChange={handleImportSetup}
                style={{ display: 'none' }}
              />
            </label>
            <button
              onClick={handleResetSetup}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title="Resetta tutti i dati della tabella Setup"
            >
              🔄 Reset Dati
            </button>
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
                const isHeaderRow = row.parameter === 'asse ant' || row.parameter === 'asse post.' || row.parameter === 'Generale';
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
