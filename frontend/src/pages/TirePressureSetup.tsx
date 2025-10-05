import React, { useState } from 'react';

/**
 * Cold Tire Pressure Setup
 * New page with input variables displayed in 2x2 matrices
 * Input variables: (F7,G7,F8,G8), D10,E10,D11,E11, (F13,G13,F14,G14), H13,H16, (F16,G16,F17,G17), H22,K22,H23,K23, (F27,G27,F28,G28), H30,H31,K30,K31
 */

interface SetupInputData {
  // 2x2 Matrix 1: F7, G7, F8, G8
  F7: number;
  G7: number;
  F8: number;
  G8: number;
  
  // Individual inputs
  D10: number;
  E10: number;
  D11: number;
  E11: number;
  
  // 2x2 Matrix 2: F13, G13, F14, G14
  F13: number;
  G13: number;
  F14: number;
  G14: number;
  
  // Individual inputs
  H13: number;
  H16: number;
  
  // 2x2 Matrix 3: F16, G16, F17, G17
  F16: number;
  G16: number;
  F17: number;
  G17: number;
  
  // Individual inputs
  H22: number;
  K22: number;
  H23: number;
  K23: number;
  
  // 2x2 Matrix 4: F27, G27, F28, G28
  F27: number;
  G27: number;
  F28: number;
  G28: number;
  
  // Individual inputs
  H30: number;
  H31: number;
  K30: number;
  K31: number;
}

function TirePressureSetup() {
  const [inputData, setInputData] = useState<SetupInputData>({
    // Matrix 1
    F7: 0,
    G7: 0,
    F8: 0,
    G8: 0,
    
    // Individual
    D10: 0,
    E10: 0,
    D11: 0,
    E11: 0,
    
    // Matrix 2
    F13: 0,
    G13: 0,
    F14: 0,
    G14: 0,
    
    // Individual
    H13: 0,
    H16: 0,
    
    // Matrix 3
    F16: 0,
    G16: 0,
    F17: 0,
    G17: 0,
    
    // Individual
    H22: 0,
    K22: 0.02,
    H23: 0,
    K23: 0.015,
    
    // Matrix 4
    F27: 0,
    G27: 0,
    F28: 0,
    G28: 0,
    
    // Individual
    H30: 0,
    H31: 0,
    K30: 0,
    K31: 0,
  });

  const handleInputChange = (field: keyof SetupInputData, value: number) => {
    setInputData({
      ...inputData,
      [field]: value,
    });
  };

  // Render a 2x2 matrix component
  const renderMatrix = (
    title: string,
    topLeft: keyof SetupInputData,
    topRight: keyof SetupInputData,
    bottomLeft: keyof SetupInputData,
    bottomRight: keyof SetupInputData,
    labels: [string, string, string, string],
    backgroundColor: string = '#E2EFDA'
  ) => {
    return (
      <div className="card" style={{ marginBottom: '20px', padding: '20px', backgroundColor }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>{title}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', maxWidth: '500px' }}>
          {/* Top Left */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            border: '2px solid #4472C4'
          }}>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '8px',
              color: '#4472C4'
            }}>
              {labels[0]}
            </label>
            <input
              type="number"
              step="0.01"
              value={inputData[topLeft]}
              onChange={(e) => handleInputChange(topLeft, parseFloat(e.target.value) || 0)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          
          {/* Top Right */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            border: '2px solid #4472C4'
          }}>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '8px',
              color: '#4472C4'
            }}>
              {labels[1]}
            </label>
            <input
              type="number"
              step="0.01"
              value={inputData[topRight]}
              onChange={(e) => handleInputChange(topRight, parseFloat(e.target.value) || 0)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          
          {/* Bottom Left */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            border: '2px solid #4472C4'
          }}>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '8px',
              color: '#4472C4'
            }}>
              {labels[2]}
            </label>
            <input
              type="number"
              step="0.01"
              value={inputData[bottomLeft]}
              onChange={(e) => handleInputChange(bottomLeft, parseFloat(e.target.value) || 0)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          
          {/* Bottom Right */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            border: '2px solid #4472C4'
          }}>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              display: 'block', 
              marginBottom: '8px',
              color: '#4472C4'
            }}>
              {labels[3]}
            </label>
            <input
              type="number"
              step="0.01"
              value={inputData[bottomRight]}
              onChange={(e) => handleInputChange(bottomRight, parseFloat(e.target.value) || 0)}
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '16px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render individual input fields in a row
  const renderInputRow = (
    fields: Array<{ key: keyof SetupInputData; label: string }>,
    backgroundColor: string = '#FFF2CC'
  ) => {
    return (
      <div className="card" style={{ marginBottom: '20px', padding: '20px', backgroundColor }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${fields.length}, 1fr)`, gap: '15px' }}>
          {fields.map(({ key, label }) => (
            <div key={key} style={{ 
              padding: '15px', 
              backgroundColor: 'white', 
              borderRadius: '8px',
              border: '2px solid #F4B084'
            }}>
              <label style={{ 
                fontSize: '12px', 
                fontWeight: 'bold', 
                display: 'block', 
                marginBottom: '8px',
                color: '#C65911'
              }}>
                {label}
              </label>
              <input
                type="number"
                step="0.01"
                value={inputData[key]}
                onChange={(e) => handleInputChange(key, parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  fontSize: '16px', 
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>🏎️ Cold Tire Pressure Setup</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Configurazione parametri per il setup delle pressioni a freddo
      </p>

      {/* Matrix 1: F7, G7, F8, G8 */}
      {renderMatrix(
        'Matrice 1 - Parametri F7-G8',
        'F7', 'G7', 'F8', 'G8',
        ['F7', 'G7', 'F8', 'G8'],
        '#E2EFDA'
      )}

      {/* Individual inputs: D10, E10, D11, E11 */}
      {renderInputRow([
        { key: 'D10', label: 'D10' },
        { key: 'E10', label: 'E10' },
        { key: 'D11', label: 'D11' },
        { key: 'E11', label: 'E11' },
      ], '#FFF2CC')}

      {/* Matrix 2: F13, G13, F14, G14 */}
      {renderMatrix(
        'Matrice 2 - Parametri F13-G14',
        'F13', 'G13', 'F14', 'G14',
        ['F13', 'G13', 'F14', 'G14'],
        '#E2EFDA'
      )}

      {/* Individual inputs: H13, H16 */}
      {renderInputRow([
        { key: 'H13', label: 'H13' },
        { key: 'H16', label: 'H16' },
      ], '#FFF2CC')}

      {/* Matrix 3: F16, G16, F17, G17 */}
      {renderMatrix(
        'Matrice 3 - Parametri F16-G17',
        'F16', 'G16', 'F17', 'G17',
        ['F16', 'G16', 'F17', 'G17'],
        '#E2EFDA'
      )}

      {/* Individual inputs: H22, K22, H23, K23 */}
      {renderInputRow([
        { key: 'H22', label: 'H22' },
        { key: 'K22', label: 'K22' },
        { key: 'H23', label: 'H23' },
        { key: 'K23', label: 'K23' },
      ], '#FFF2CC')}

      {/* Matrix 4: F27, G27, F28, G28 */}
      {renderMatrix(
        'Matrice 4 - Parametri F27-G28',
        'F27', 'G27', 'F28', 'G28',
        ['F27', 'G27', 'F28', 'G28'],
        '#E2EFDA'
      )}

      {/* Individual inputs: H30, H31, K30, K31 */}
      {renderInputRow([
        { key: 'H30', label: 'H30' },
        { key: 'H31', label: 'H31' },
        { key: 'K30', label: 'K30' },
        { key: 'K31', label: 'K31' },
      ], '#FFF2CC')}

      <div className="card" style={{ marginTop: '30px', backgroundColor: '#e7f3ff', padding: '20px' }}>
        <h3 style={{ marginTop: 0 }}>ℹ️ Informazioni</h3>
        <p style={{ lineHeight: '1.6', marginBottom: 0 }}>
          Questa pagina permette di configurare tutti i parametri necessari per il setup delle pressioni a freddo.
          I valori sono organizzati in matrici 2x2 per facilitare l'inserimento dei dati secondo lo schema Excel.
        </p>
      </div>
    </div>
  );
}

export default TirePressureSetup;
