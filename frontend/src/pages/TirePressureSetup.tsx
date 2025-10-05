import React, { useState } from 'react';

/**
 * Cold Tire Pressure Setup
 * New page with input variables displayed in 2x2 matrices
 * Input variables: (F7,G7,F8,G8), D10,E10,D11,E11, (F13,G13,F14,G14), H13,H16, (F16,G16,F17,G17), H22,K22,H23,K23, (F27,G27,F28,G28), H30,H31,K30,K31
 */

interface SetupInputData {
  // 2x2 Matrix 1: F7, G7, F8, G8 - Target Hot Pressure
  F7: number;
  G7: number;
  F8: number;
  G8: number;
  
  // 2x2 Matrix: D10, E10, D11, E11 - Initial scaling factors
  D10: number;
  E10: number;
  D11: number;
  E11: number;
  
  // 2x2 Matrix 2: F13, G13, F14, G14 - Initial cold settings
  F13: number;
  G13: number;
  F14: number;
  G14: number;
  
  // Individual inputs
  H13: number;  // Running Ambient Temp
  H16: number;  // Running Track Temp
  
  // 2x2 Matrix 3: F16, G16, F17, G17 - Test Run-Hot Results
  F16: number;
  G16: number;
  F17: number;
  G17: number;
  
  // Individual inputs
  H22: number;  // Expected air T
  K22: number;  // Air compensation
  H23: number;  // Expected track T
  K23: number;  // Track compensation
  
  // 2x2 Matrix 4: F27, G27, F28, G28 - New TGT Hot pressure
  F27: number;
  G27: number;
  F28: number;
  G28: number;
  
  // Individual inputs
  H30: number;  // Expected air T
  H31: number;  // Expected track T
  K30: number;  // Air compensation
  K31: number;  // Track compensation
}

interface CalculatedOutputs {
  // Calculated values
  D7: number; D8: number; E7: number; E8: number;
  D13: number; D14: number; E13: number; E14: number;
  D16: number; D17: number; E16: number; E17: number;
  D19: number; D20: number; E19: number; E20: number;
  D22: number; D23: number; E22: number; E23: number;
  F22: number; F23: number; G22: number; G23: number;
  D27: number; D28: number; E27: number; E28: number;
  D30: number; D31: number; E30: number; E31: number;
  F30: number; F31: number; G30: number; G31: number;
  N8: number; O8: number; N9: number; O9: number;
  N10: number; O10: number; N11: number; O11: number;
  N14: number; O14: number; N15: number; O15: number;
  N17: number; O17: number; N18: number; O18: number;
  L17: number; M17: number; L18: number; M18: number;
  L14: number; M14: number; L15: number; M15: number;
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

  // Calculate all outputs based on formulas
  const calculateOutputs = (): CalculatedOutputs => {
    const i = inputData;
    
    // Placeholder values for L14, M14, L15, M15 (not specified in requirements)
    const L14 = 0, M14 = 0, L15 = 0, M15 = 0;
    
    // Convert bar to PSI (F7-G8 to D7-E8)
    const D7 = i.F7 * 14.504;
    const E7 = i.G7 * 14.504;
    const D8 = i.F8 * 14.504;
    const E8 = i.G8 * 14.504;
    
    // Ratio calculations
    const N8 = 22/17;
    const O8 = 29/22;
    const N9 = 24/20;
    const O9 = 32/26;
    const N10 = 28/23;
    const O10 = 40/27;
    const N11 = 37/27;
    const O11 = 40/35;
    
    // Convert bar to PSI (F13-G14 to D13-E14)
    const D13 = i.F13 * 14.504;
    const E13 = i.G13 * 14.504;
    const D14 = i.F14 * 14.504;
    const E14 = i.G14 * 14.504;
    
    const N14 = L14 * 14.504;
    const O14 = M14 * 14.504;
    const N15 = L15 * 14.504;
    const O15 = M15 * 14.504;
    
    // Convert bar to PSI (F16-G17 to D16-E17)
    const D16 = i.F16 * 14.504;
    const E16 = i.G16 * 14.504;
    const D17 = i.F17 * 14.504;
    const E17 = i.G17 * 14.504;
    
    // N17, O17, N18, O18 (placeholders - not specified)
    const N17 = 0, O17 = 0, N18 = 0, O18 = 0;
    
    const L17 = N17 / 14.504;
    const M17 = O17 / 14.504;
    const L18 = N18 / 14.504;
    const M18 = O18 / 14.504;
    
    // Auto adjusted scaling factors (D19-E20)
    const D19 = D13 !== 0 ? D16 / D13 : 0;
    const E19 = E13 !== 0 ? E16 / E13 : 0;
    const D20 = D14 !== 0 ? D17 / D14 : 0;
    const E20 = E14 !== 0 ? E17 / E14 : 0;
    
    // Adjusted cold settings PSI (D22-E23)
    const D22 = D19 !== 0 ? (D7 / D19) - i.K22 * (i.H22 - i.H13) - i.K23 * (i.H23 - i.H16) : 0;
    const E22 = E19 !== 0 ? (E7 / E19) - i.K22 * (i.H22 - i.H13) - i.K23 * (i.H23 - i.H16) : 0;
    const D23 = D20 !== 0 ? (D8 / D20) + i.K22 * (i.H22 - i.H13) + i.K23 : 0;
    const E23 = E20 !== 0 ? (E8 / E20) - i.K22 * (i.H22 - i.H13) - i.K23 * (i.H23 - i.H16) : 0;
    
    // Convert PSI to bar (D22-E23 to F22-G23)
    const F22 = D22 / 14.504;
    const G22 = E22 / 14.504;
    const F23 = D23 / 14.504;
    const G23 = E23 / 14.504;
    
    // Convert bar to PSI (F27-G28 to D27-E28)
    const D27 = i.F27 * 14.5038;
    const E27 = i.G27 * 14.5038;
    const D28 = i.F28 * 14.5038;
    const E28 = i.F28 * 14.5038;  // Note: uses F28 twice as per formula
    
    // New adjusted cold settings PSI (D30-E31)
    const D30 = D19 !== 0 ? (D27 / D19) - i.K22 * (i.H30 - i.H13) - i.K23 * (i.H31 - i.H16) : 0;
    const E30 = E19 !== 0 ? (E27 / E19) - i.K22 * (i.H30 - i.H13) - i.K23 * (i.H31 - i.H16) : 0;
    const D31 = D20 !== 0 ? (D28 / D20) - i.K22 * (i.H30 - i.H13) - i.K23 * (i.H31 - i.H16) : 0;
    const E31 = E20 !== 0 ? (E28 / E20) - i.K22 * (i.H30 - i.H13) - i.K23 * (i.H31 - i.H16) : 0;
    
    // Convert PSI to bar (D30-E31 to F30-G31)
    const F30 = D30 / 14.5038;
    const G30 = E30 / 14.5038;
    const F31 = D31 / 14.5038;
    const G31 = E31 / 14.5038;
    
    return {
      D7, D8, E7, E8,
      D13, D14, E13, E14,
      D16, D17, E16, E17,
      D19, D20, E19, E20,
      D22, D23, E22, E23,
      F22, F23, G22, G23,
      D27, D28, E27, E28,
      D30, D31, E30, E31,
      F30, F31, G30, G31,
      N8, O8, N9, O9,
      N10, O10, N11, O11,
      N14, O14, N15, O15,
      N17, O17, N18, O18,
      L17, M17, L18, M18,
      L14, M14, L15, M15
    };
  };

  const outputs = calculateOutputs();

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

  // Render output matrix (read-only display)
  const renderOutputMatrix = (
    title: string,
    topLeft: number,
    topRight: number,
    bottomLeft: number,
    bottomRight: number,
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
            backgroundColor: '#f0f0f0', 
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
            <div style={{ 
              padding: '10px', 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              {topLeft.toFixed(4)}
            </div>
          </div>
          
          {/* Top Right */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f0f0f0', 
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
            <div style={{ 
              padding: '10px', 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              {topRight.toFixed(4)}
            </div>
          </div>
          
          {/* Bottom Left */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f0f0f0', 
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
            <div style={{ 
              padding: '10px', 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              {bottomLeft.toFixed(4)}
            </div>
          </div>
          
          {/* Bottom Right */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f0f0f0', 
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
            <div style={{ 
              padding: '10px', 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              {bottomRight.toFixed(4)}
            </div>
          </div>
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

      <h2 style={{ color: '#2c5282', marginTop: '30px', marginBottom: '20px' }}>
        📥 Tire cold pressure setup
      </h2>

      {/* Matrix 1: F7, G7, F8, G8 - Target Hot Pressure (bar) - ORANGE background */}
      {renderMatrix(
        'Target Hot Pressure (bar)',
        'F7', 'G7', 'F8', 'G8',
        ['F7', 'G7', 'F8', 'G8'],
        '#FFA500'  // Orange
      )}

      {/* Matrix: D10, E10, D11, E11 - initial scaling factors - GREEN background */}
      {renderMatrix(
        'initial scaling factors',
        'D10', 'E10', 'D11', 'E11',
        ['D10', 'E10', 'D11', 'E11'],
        '#90EE90'  // Green
      )}

      {/* Matrix 2: F13, G13, F14, G14 - initial cold settings - TURQUOISE background */}
      {renderMatrix(
        'initial cold settings',
        'F13', 'G13', 'F14', 'G14',
        ['F13', 'G13', 'F14', 'G14'],
        '#40E0D0'  // Turquoise
      )}

      {/* Individual inputs: H13, H16 */}
      {renderInputRow([
        { key: 'H13', label: 'Running Ambient Temp (deg C)' },
        { key: 'H16', label: 'Running Track Temp (deg C)' },
      ], '#FFF2CC')}

      {/* Matrix 3: F16, G16, F17, G17 - Test Run-Hot Results */}
      {renderMatrix(
        'Test Run-Hot Results',
        'F16', 'G16', 'F17', 'G17',
        ['F16', 'G16', 'F17', 'G17'],
        '#E2EFDA'
      )}

      {/* OUTPUT: Auto adjusted scaling factors - GREEN background */}
      {renderOutputMatrix(
        'Auto adjusted scaling factors',
        outputs.D19, outputs.E19, outputs.D20, outputs.E20,
        ['D19', 'E19', 'D20', 'E20'],
        '#90EE90'  // Green
      )}

      {/* Individual inputs: H22, K22, H23, K23 */}
      {renderInputRow([
        { key: 'H22', label: 'Expected air T (deg C)' },
        { key: 'K22', label: 'Air compensation (PSI)' },
        { key: 'H23', label: 'Expected track T (deg C)' },
        { key: 'K23', label: 'Track compensation (PSI)' },
      ], '#FFF2CC')}

      {/* OUTPUT: Adjusted cold settings (bar) - TURQUOISE background */}
      {renderOutputMatrix(
        'Adjusted cold settings (bar)',
        outputs.F22, outputs.G22, outputs.F23, outputs.G23,
        ['F22', 'G22', 'F23', 'G23'],
        '#40E0D0'  // Turquoise
      )}

      {/* Matrix 4: F27, G27, F28, G28 - New TGT Hot pressure */}
      {renderMatrix(
        'New TGT Hot pressure',
        'F27', 'G27', 'F28', 'G28',
        ['F27', 'G27', 'F28', 'G28'],
        '#E2EFDA'
      )}

      {/* Individual inputs: H30, H31, K30, K31 */}
      {renderInputRow([
        { key: 'H30', label: 'Expected air T (deg C)' },
        { key: 'H31', label: 'Expected track T (deg C)' },
        { key: 'K30', label: 'Air compensation (PSI)' },
        { key: 'K31', label: 'Track compensation (PSI)' },
      ], '#FFF2CC')}

      {/* OUTPUT: New adj. cold settings (bar) - TURQUOISE background */}
      {renderOutputMatrix(
        'New adj. cold settings (bar)',
        outputs.F30, outputs.G30, outputs.F31, outputs.G31,
        ['F30', 'G30', 'F31', 'G31'],
        '#40E0D0'  // Turquoise
      )}

      <div className="card" style={{ marginTop: '30px', backgroundColor: '#e7f3ff', padding: '20px' }}>
        <h3 style={{ marginTop: 0 }}>ℹ️ Informazioni</h3>
        <p style={{ lineHeight: '1.6', marginBottom: 0 }}>
          Questa pagina permette di configurare tutti i parametri necessari per il setup delle pressioni a freddo.
          I valori sono organizzati in matrici 2x2 per facilitare l'inserimento dei dati secondo lo schema Excel.
          Le matrici di output mostrano i risultati calcolati automaticamente in base alle formule implementate.
        </p>
      </div>
    </div>
  );
}

export default TirePressureSetup;
