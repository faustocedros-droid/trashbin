import React, { useState, useEffect } from 'react';

/**
 * Cold Tire Pressure Sets Management
 * This is the original Tire Pressure Management content
 */

interface TireInputData {
  // Row 3 - Temperature inputs
  E3: number;  // Temperatura Ambiente (°C)
  F3: number;  // Temperatura Target (°C)
  G3: number;  // Pressione Hot FL (bar)
  H3: number;  // Pressione Hot FR (bar)
  
  // Row 4 - Cold pressure inputs
  E4: number;  // Not used in formulas but included for completeness
  F4: number;  // Pressione Fredda (bar)
  G4: number;  // Pressione Hot RL (bar)
  H4: number;  // Pressione Hot RR (bar)
}

interface CalculatedOutputs {
  I3: number;  // =(G3+F4*(F3+273.15)/(E3+273.15))-F4
  J3: number;  // =(H3+F4*(F3+273.15)/(E3+273.15))-F4
  I4: number;  // =(G4+F4*(F3+273.15)/(E3+273.15))-F4
  J4: number;  // =(H4+F4*(F3+273.15)/(E3+273.15))-F4
}

function TirePressureSetsManagement() {
  const [inputData, setInputData] = useState<TireInputData>({
    E3: 20,    // Temp Ambiente
    F3: 25,    // Temp Target
    G3: 2.3,   // Hot FL
    H3: 2.3,   // Hot FR
    E4: 0,     // Unused
    F4: 2.0,   // Cold pressure
    G4: 2.3,   // Hot RL
    H4: 2.3,   // Hot RR
  });

  const [outputs, setOutputs] = useState<CalculatedOutputs | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('tirePressureSetsManagement');
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        setInputData(savedData.inputData);
        setOutputs(savedData.outputs);
      } catch (error) {
        console.error('Error loading tire pressure sets management:', error);
      }
    }
  }, []);

  /**
   * Calculate outputs based on Excel formulas
   */
  const handleCalculate = () => {
    const { E3, F3, G3, H3, F4, G4, H4 } = inputData;
    
    // Formula: =(G3+F4*(F3+273.15)/(E3+273.15))-F4
    const I3 = (G3 + F4 * (F3 + 273.15) / (E3 + 273.15)) - F4;
    
    // Formula: =(H3+F4*(F3+273.15)/(E3+273.15))-F4
    const J3 = (H3 + F4 * (F3 + 273.15) / (E3 + 273.15)) - F4;
    
    // Formula: =(G4+F4*(F3+273.15)/(E3+273.15))-F4
    const I4 = (G4 + F4 * (F3 + 273.15) / (E3 + 273.15)) - F4;
    
    // Formula: =(H4+F4*(F3+273.15)/(E3+273.15))-F4
    const J4 = (H4 + F4 * (F3 + 273.15) / (E3 + 273.15)) - F4;

    const newOutputs = { I3, J3, I4, J4 };
    setOutputs(newOutputs);
    
    // Save to localStorage
    localStorage.setItem('tirePressureSetsManagement', JSON.stringify({
      inputData,
      outputs: newOutputs
    }));
  };

  const handleInputChange = (field: keyof TireInputData, value: number) => {
    setInputData({
      ...inputData,
      [field]: value,
    });
  };

  // Export data to file
  const handleExportData = () => {
    const dataToExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      inputData: inputData,
      outputs: outputs
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tire_pressure_sets_${new Date().toISOString().split('T')[0]}.tpsets`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import data from file
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        if (!importedData.inputData) {
          throw new Error('File non valido: struttura dati mancante');
        }

        if (window.confirm('Vuoi importare questi dati? I dati attuali saranno sostituiti.')) {
          setInputData(importedData.inputData);
          setOutputs(importedData.outputs || null);
          localStorage.setItem('tirePressureSetsManagement', JSON.stringify({
            inputData: importedData.inputData,
            outputs: importedData.outputs
          }));
          alert('Dati importati con successo!');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Errore nel caricamento del file! Assicurati che sia un file .tpsets valido.');
      }
    };
    reader.readAsText(file);
    
    // Reset input to allow importing the same file again
    if (e.target) e.target.value = '';
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: '8px' }}>🏎️ Cold Tire Pressure Sets Management</h1>
          <p style={{ color: '#666', margin: 0 }}>
            Gestione delle pressioni pneumatici - Replica del worksheet Excel "Pressioni"
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportData}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
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
          >
            📂 Importa
            <input
              type="file"
              accept=".tpsets"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>Dati di Input</h2>
        
        {/* Input Table matching Excel layout */}
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            border: '2px solid #333'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#4472C4', color: 'white' }}>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'center' }}>Parametro</th>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'center' }}>E</th>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'center' }}>F</th>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'center' }}>G</th>
                <th style={{ padding: '12px', border: '1px solid #333', textAlign: 'center' }}>H</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 3 */}
              <tr>
                <td style={{ 
                  padding: '12px', 
                  border: '1px solid #333', 
                  backgroundColor: '#D9E1F2',
                  fontWeight: 'bold'
                }}>
                  Riga 3
                </td>
                <td style={{ padding: '8px', border: '1px solid #333', backgroundColor: '#FFF2CC' }}>
                  <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    E3: Temp. Ambiente (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputData.E3}
                    onChange={(e) => handleInputChange('E3', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ccc' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #333', backgroundColor: '#FFF2CC' }}>
                  <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    F3: Temp. Target (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputData.F3}
                    onChange={(e) => handleInputChange('F3', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ccc' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #333', backgroundColor: '#E2EFDA' }}>
                  <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    G3: Press. Hot FL (bar)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputData.G3}
                    onChange={(e) => handleInputChange('G3', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ccc' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #333', backgroundColor: '#E2EFDA' }}>
                  <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    H3: Press. Hot FR (bar)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputData.H3}
                    onChange={(e) => handleInputChange('H3', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ccc' }}
                  />
                </td>
              </tr>
              
              {/* Row 4 */}
              <tr>
                <td style={{ 
                  padding: '12px', 
                  border: '1px solid #333', 
                  backgroundColor: '#D9E1F2',
                  fontWeight: 'bold'
                }}>
                  Riga 4
                </td>
                <td style={{ padding: '8px', border: '1px solid #333', backgroundColor: '#F4B084' }}>
                  <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    E4: (non usato)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputData.E4}
                    onChange={(e) => handleInputChange('E4', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ccc' }}
                    disabled
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #333', backgroundColor: '#F4B084' }}>
                  <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    F4: Press. Fredda (bar)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputData.F4}
                    onChange={(e) => handleInputChange('F4', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ccc' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #333', backgroundColor: '#C6E0B4' }}>
                  <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    G4: Press. Hot RL (bar)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputData.G4}
                    onChange={(e) => handleInputChange('G4', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ccc' }}
                  />
                </td>
                <td style={{ padding: '8px', border: '1px solid #333', backgroundColor: '#C6E0B4' }}>
                  <label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                    H4: Press. Hot RR (bar)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputData.H4}
                    onChange={(e) => handleInputChange('H4', parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '6px', fontSize: '14px', border: '1px solid #ccc' }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleCalculate} 
            style={{ fontSize: '18px', padding: '12px 40px' }}
          >
            🧮 Calcola Risultati
          </button>
        </div>
      </div>

      {/* Output Results */}
      {outputs && (
        <div className="card" style={{ marginBottom: '30px' }}>
          <h2>📊 Risultati - Output Calcolati</h2>
          
          <div style={{ 
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}>
            <table style={{ 
              borderCollapse: 'collapse',
              border: '3px solid #333',
              maxWidth: '600px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#4472C4', color: 'white' }}>
                  <th style={{ padding: '12px', border: '2px solid #333', textAlign: 'center' }}>Colonna</th>
                  <th style={{ padding: '12px', border: '2px solid #333', textAlign: 'center' }}>I</th>
                  <th style={{ padding: '12px', border: '2px solid #333', textAlign: 'center' }}>J</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 3 outputs */}
                <tr>
                  <td style={{ 
                    padding: '12px', 
                    border: '2px solid #333', 
                    backgroundColor: '#D9E1F2',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    Riga 3
                  </td>
                  <td style={{ 
                    padding: '15px', 
                    border: '2px solid #333', 
                    backgroundColor: '#FCE4D6',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#C65911'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 'normal', marginBottom: '5px', color: '#666' }}>
                      I3 (FL)
                    </div>
                    {outputs.I3.toFixed(3)}
                  </td>
                  <td style={{ 
                    padding: '15px', 
                    border: '2px solid #333', 
                    backgroundColor: '#FCE4D6',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#C65911'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 'normal', marginBottom: '5px', color: '#666' }}>
                      J3 (FR)
                    </div>
                    {outputs.J3.toFixed(3)}
                  </td>
                </tr>
                
                {/* Row 4 outputs */}
                <tr>
                  <td style={{ 
                    padding: '12px', 
                    border: '2px solid #333', 
                    backgroundColor: '#D9E1F2',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    Riga 4
                  </td>
                  <td style={{ 
                    padding: '15px', 
                    border: '2px solid #333', 
                    backgroundColor: '#FCE4D6',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#C65911'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 'normal', marginBottom: '5px', color: '#666' }}>
                      I4 (RL)
                    </div>
                    {outputs.I4.toFixed(3)}
                  </td>
                  <td style={{ 
                    padding: '15px', 
                    border: '2px solid #333', 
                    backgroundColor: '#FCE4D6',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#C65911'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 'normal', marginBottom: '5px', color: '#666' }}>
                      J4 (RR)
                    </div>
                    {outputs.J4.toFixed(3)}
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: '#e7f3ff', 
              borderRadius: '8px',
              maxWidth: '600px',
              width: '100%'
            }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>📐 Formule Utilizzate:</h3>
              <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8' }}>
                <div><strong>I3:</strong> =(G3+F4*(F3+273.15)/(E3+273.15))-F4</div>
                <div><strong>J3:</strong> =(H3+F4*(F3+273.15)/(E3+273.15))-F4</div>
                <div><strong>I4:</strong> =(G4+F4*(F3+273.15)/(E3+273.15))-F4</div>
                <div><strong>J4:</strong> =(H4+F4*(F3+273.15)/(E3+273.15))-F4</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '30px', backgroundColor: '#f0f8ff' }}>
        <h3>📋 Legenda</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>FL:</strong> Front Left (Anteriore Sinistro)</li>
          <li><strong>FR:</strong> Front Right (Anteriore Destro)</li>
          <li><strong>RL:</strong> Rear Left (Posteriore Sinistro)</li>
          <li><strong>RR:</strong> Rear Right (Posteriore Destro)</li>
        </ul>
        <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
          <strong>Note:</strong> Le formule implementate replicano esattamente il worksheet "Pressioni" 
          dall'Excel originale. I calcoli utilizzano la legge dei gas ideali con temperature assolute (Kelvin).
        </p>
      </div>
    </div>
  );
}

export default TirePressureSetsManagement;
