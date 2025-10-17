import React, { useState, useEffect } from 'react';

function FuelConsumption() {
  const [fuelData, setFuelData] = useState({
    metadata: {
      championship: '',
      car: '',
      track: '',
      trackLength: ''
    },
    rows: []
  });

  // Initialize fuel consumption data
  const initializeFuelData = () => {
    const sessions = ['T1', 'T2', 'T3', 'T4', 'FP1', 'FP2', 'Q', 'R1', 'R2'];

    const rows = sessions.map((session, index) => ({
      rowId: index,
      session: session,
      fuelIn: '',
      fuelOut: '',
      laps: ''
    }));

    return {
      metadata: {
        championship: '',
        car: '',
        track: '',
        trackLength: ''
      },
      rows: rows
    };
  };

  // Load saved fuel data from localStorage on component mount
  useEffect(() => {
    const savedFuelData = localStorage.getItem('fuelConsumption_data');
    if (savedFuelData) {
      try {
        setFuelData(JSON.parse(savedFuelData));
      } catch (error) {
        console.error('Error loading fuel consumption data:', error);
        setFuelData(initializeFuelData());
      }
    } else {
      setFuelData(initializeFuelData());
    }
  }, []);

  // Handle metadata change
  const handleMetadataChange = (field, value) => {
    const updatedData = {
      ...fuelData,
      metadata: {
        ...fuelData.metadata,
        [field]: value
      }
    };
    setFuelData(updatedData);
    // Auto-save to localStorage
    localStorage.setItem('fuelConsumption_data', JSON.stringify(updatedData));
  };

  // Handle row data change
  const handleRowChange = (rowIndex, columnKey, value) => {
    const updatedData = {
      ...fuelData,
      rows: fuelData.rows.map((row, index) => 
        index === rowIndex 
          ? { ...row, [columnKey]: value }
          : row
      )
    };
    setFuelData(updatedData);
    // Auto-save to localStorage
    localStorage.setItem('fuelConsumption_data', JSON.stringify(updatedData));
  };

  // Calculate Total KM for a row
  const calculateTotalKM = (row) => {
    const trackLength = parseFloat(fuelData.metadata.trackLength) || 0;
    const laps = parseFloat(row.laps) || 0;
    return trackLength * laps;
  };

  // Calculate Consumption per Lap
  const calculateConsoLap = (row) => {
    const fuelIn = parseFloat(row.fuelIn) || 0;
    const fuelOut = parseFloat(row.fuelOut) || 0;
    const laps = parseFloat(row.laps) || 0;
    if (laps === 0) return 0;
    return (fuelIn - fuelOut) / laps;
  };

  // Calculate Consumption per KM
  const calculateConsoKM = (row) => {
    const fuelIn = parseFloat(row.fuelIn) || 0;
    const fuelOut = parseFloat(row.fuelOut) || 0;
    const totalKM = calculateTotalKM(row);
    if (totalKM === 0) return 0;
    return (fuelIn - fuelOut) / totalKM;
  };

  // Handle reset of fuel data
  const handleReset = () => {
    if (window.confirm('Sei sicuro di voler resettare tutti i dati? Questa azione non può essere annullata.')) {
      localStorage.removeItem('fuelConsumption_data');
      const initialData = initializeFuelData();
      setFuelData(initialData);
    }
  };

  // Export fuel data to file
  const handleExport = () => {
    const dataToExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      fuelData: fuelData
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const trackName = fuelData.metadata.track.replace(/[^a-zA-Z0-9]/g, '_') || 'fuel_consumption';
    link.download = `fuel_consumption_${trackName}_${new Date().toISOString().split('T')[0]}.fuel`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import fuel data from file
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result);
        
        if (!importedData.fuelData) {
          throw new Error('File non valido: struttura dati mancante');
        }

        if (window.confirm('Vuoi importare questi dati? I dati attuali saranno sostituiti.')) {
          setFuelData(importedData.fuelData);
          localStorage.setItem('fuelConsumption_data', JSON.stringify(importedData.fuelData));
          alert('Dati importati con successo!');
        }
      } catch (error) {
        console.error('Error importing fuel data:', error);
        alert('Errore nel caricamento del file! Assicurati che sia un file .fuel valido.');
      }
    };
    reader.readAsText(file);
    
    // Reset input to allow importing the same file again
    e.target.value = '';
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>⛽ Fuel Consumption</h1>
      
      {/* Fuel Consumption Section */}
      <div className="card" style={{ marginTop: '30px' }} id="printable-fuel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>FUEL CONSUMPTION</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExport}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title="Esporta dati Fuel Consumption in file"
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
              title="Importa dati Fuel Consumption da file"
            >
              📂 Importa
              <input
                type="file"
                accept=".fuel"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title="Resetta tutti i dati della tabella"
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
              🖨️ Stampa
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
              Championship
            </label>
            <input
              type="text"
              value={fuelData.metadata.championship}
              onChange={(e) => handleMetadataChange('championship', e.target.value)}
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
              Car
            </label>
            <input
              type="text"
              value={fuelData.metadata.car}
              onChange={(e) => handleMetadataChange('car', e.target.value)}
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
              Track
            </label>
            <input
              type="text"
              value={fuelData.metadata.track}
              onChange={(e) => handleMetadataChange('track', e.target.value)}
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
              Track Length (km)
            </label>
            <input
              type="number"
              step="0.001"
              value={fuelData.metadata.trackLength}
              onChange={(e) => handleMetadataChange('trackLength', e.target.value)}
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

        {/* Fuel Consumption Table */}
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
                  textAlign: 'center',
                  minWidth: '80px'
                }}>
                  Session
                </th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '100px' }}>Fuel IN</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '100px' }}>Fuel OUT</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '80px' }}>Laps</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '100px' }}>Total KM</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '120px' }}>Conso/Lap</th>
                <th style={{ padding: '10px', border: '1px solid #333', textAlign: 'center', minWidth: '120px' }}>Conso/KM</th>
              </tr>
            </thead>
            <tbody>
              {fuelData.rows.map((row, rowIndex) => {
                const totalKM = calculateTotalKM(row);
                const consoLap = calculateConsoLap(row);
                const consoKM = calculateConsoKM(row);

                return (
                  <tr key={rowIndex} style={{ 
                    backgroundColor: rowIndex % 2 === 0 ? '#ffffff' : '#f9f9f9'
                  }}>
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #ddd',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      backgroundColor: '#E7E6E6'
                    }}>
                      {row.session}
                    </td>
                    <td style={{ padding: '4px', border: '1px solid #ddd' }}>
                      <input
                        type="number"
                        step="0.1"
                        value={row.fuelIn}
                        onChange={(e) => handleRowChange(rowIndex, 'fuelIn', e.target.value)}
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
                        type="number"
                        step="0.1"
                        value={row.fuelOut}
                        onChange={(e) => handleRowChange(rowIndex, 'fuelOut', e.target.value)}
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
                        type="number"
                        step="1"
                        value={row.laps}
                        onChange={(e) => handleRowChange(rowIndex, 'laps', e.target.value)}
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
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #ddd',
                      textAlign: 'center',
                      backgroundColor: '#f0f0f0',
                      fontWeight: '500'
                    }}>
                      {totalKM.toFixed(2)}
                    </td>
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #ddd',
                      textAlign: 'center',
                      backgroundColor: '#f0f0f0',
                      fontWeight: '500'
                    }}>
                      {consoLap.toFixed(3)}
                    </td>
                    <td style={{ 
                      padding: '8px', 
                      border: '1px solid #ddd',
                      textAlign: 'center',
                      backgroundColor: '#f0f0f0',
                      fontWeight: '500'
                    }}>
                      {consoKM.toFixed(4)}
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
            #printable-fuel, #printable-fuel * {
              visibility: visible;
            }
            #printable-fuel {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            #printable-fuel button {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
}

export default FuelConsumption;
