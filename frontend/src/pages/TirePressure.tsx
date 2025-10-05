import React, { useState } from 'react';

/**
 * Tire Pressure Management Page
 * Completamente ricostruita seguendo il layout Excel
 */

interface InputData {
  E3: number;  // Temperatura Ambiente
  E4: number;  // Temperatura Ambiente
  F3: number;  // Pressione Fredda
  F4: number;  // Pressione Fredda
  G3: number;  // Pressione Calda FL
  G4: number;  // Pressione Calda FL
  H3: number;  // Pressione Calda FR
  H4: number;  // Pressione Calda FR
}

interface OutputData {
  I3: number;
  J3: number;
  I4: number;
  J4: number;
}

function TirePressure() {
  const [inputs, setInputs] = useState<InputData>({
    E3: 20,
    E4: 20,
    F3: 25,
    F4: 2.0,
    G3: 2.3,
    G4: 2.3,
    H3: 2.3,
    H4: 2.3,
  });

  const [outputs, setOutputs] = useState<OutputData | null>(null);

  // Formule Excel
  // I3: =(G3+F4*(F3+273.15)/(E3+273.15))-F4
  const calculateI3 = (data: InputData): number => {
    return (data.G3 + data.F4 * (data.F3 + 273.15) / (data.E3 + 273.15)) - data.F4;
  };

  // J3: =(H3+F4*(F3+273.15)/(E3+273.15))-F4
  const calculateJ3 = (data: InputData): number => {
    return (data.H3 + data.F4 * (data.F3 + 273.15) / (data.E3 + 273.15)) - data.F4;
  };

  // I4: =(G4+F4*(F3+273.15)/(E3+273.15))-F4
  const calculateI4 = (data: InputData): number => {
    return (data.G4 + data.F4 * (data.F3 + 273.15) / (data.E3 + 273.15)) - data.F4;
  };

  // J4: =(H4+F4*(F3+273.15)/(E3+273.15))-F4
  const calculateJ4 = (data: InputData): number => {
    return (data.H4 + data.F4 * (data.F3 + 273.15) / (data.E3 + 273.15)) - data.F4;
  };

  const handleCalculate = () => {
    setOutputs({
      I3: calculateI3(inputs),
      J3: calculateJ3(inputs),
      I4: calculateI4(inputs),
      J4: calculateJ4(inputs),
    });
  };

  const handleInputChange = (field: keyof InputData, value: number) => {
    setInputs({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="container" style={{ paddingTop: '40px', maxWidth: '1000px' }}>
      <h1>🏎️ Tire Pressure Management</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Gestione delle pressioni pneumatici - Layout Excel
      </p>

      {/* Dati di Input - Excel Style */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>📝 Dati di Input</h2>
        
        <div style={{ marginTop: '20px' }}>
          {/* Riga intestazioni */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '200px 120px 120px 120px 120px',
            gap: '10px',
            marginBottom: '10px',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#666'
          }}>
            <div></div>
            <div style={{ textAlign: 'center' }}>E</div>
            <div style={{ textAlign: 'center' }}>F</div>
            <div style={{ textAlign: 'center' }}>G</div>
            <div style={{ textAlign: 'center' }}>H</div>
          </div>

          {/* Riga 3 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '200px 120px 120px 120px 120px',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Riga 3
            </div>
            
            {/* E3 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                marginBottom: '4px',
                color: '#666'
              }}>
                Temp. Amb. (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.E3}
                onChange={(e) => handleInputChange('E3', parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '2px solid #4CAF50',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#E8F5E9'
                }}
              />
            </div>

            {/* F3 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                marginBottom: '4px',
                color: '#666'
              }}>
                Temp. Target (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.F3}
                onChange={(e) => handleInputChange('F3', parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '2px solid #2196F3',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#E3F2FD'
                }}
              />
            </div>

            {/* G3 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                marginBottom: '4px',
                color: '#666'
              }}>
                Press. Calda FL (bar)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.G3}
                onChange={(e) => handleInputChange('G3', parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '2px solid #FF9800',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#FFF3E0'
                }}
              />
            </div>

            {/* H3 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                marginBottom: '4px',
                color: '#666'
              }}>
                Press. Calda FR (bar)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.H3}
                onChange={(e) => handleInputChange('H3', parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '2px solid #FF9800',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#FFF3E0'
                }}
              />
            </div>
          </div>

          {/* Riga 4 */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '200px 120px 120px 120px 120px',
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              Riga 4
            </div>
            
            {/* E4 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                marginBottom: '4px',
                color: '#666'
              }}>
                Temp. Amb. (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.E4}
                onChange={(e) => handleInputChange('E4', parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '2px solid #4CAF50',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#E8F5E9'
                }}
              />
            </div>

            {/* F4 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                marginBottom: '4px',
                color: '#666'
              }}>
                Press. Fredda (bar)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.F4}
                onChange={(e) => handleInputChange('F4', parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '2px solid #2196F3',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#E3F2FD'
                }}
              />
            </div>

            {/* G4 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                marginBottom: '4px',
                color: '#666'
              }}>
                Press. Calda FL (bar)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.G4}
                onChange={(e) => handleInputChange('G4', parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '2px solid #FF9800',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#FFF3E0'
                }}
              />
            </div>

            {/* H4 */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '11px', 
                marginBottom: '4px',
                color: '#666'
              }}>
                Press. Calda FR (bar)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.H4}
                onChange={(e) => handleInputChange('H4', parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '2px solid #FF9800',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#FFF3E0'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '25px' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleCalculate}
            style={{ fontSize: '16px', padding: '12px 30px' }}
          >
            🧮 Calcola Incrementi Pressione
          </button>
        </div>
      </div>

      {/* Output - Blocco 2x2 */}
      {outputs && (
        <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
          <h2>📊 Risultati - Incrementi Pressione</h2>
          
          <div style={{ 
            marginTop: '30px',
            display: 'inline-block',
            border: '3px solid #1976d2',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Intestazioni colonne */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '140px 140px',
              backgroundColor: '#1976d2',
              color: 'white'
            }}>
              <div style={{ 
                padding: '12px',
                textAlign: 'center',
                fontWeight: 'bold',
                borderRight: '2px solid white',
                fontSize: '14px'
              }}>
                I (Front Left)
              </div>
              <div style={{ 
                padding: '12px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                J (Front Right)
              </div>
            </div>

            {/* Riga 3 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '140px 140px',
              backgroundColor: 'white',
              borderBottom: '2px solid #1976d2'
            }}>
              <div style={{ 
                padding: '20px',
                textAlign: 'center',
                borderRight: '2px solid #1976d2'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '6px',
                  fontWeight: '600'
                }}>
                  I3
                </div>
                <div style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}>
                  {outputs.I3.toFixed(3)}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#999',
                  marginTop: '4px'
                }}>
                  bar
                </div>
              </div>
              <div style={{ 
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '6px',
                  fontWeight: '600'
                }}>
                  J3
                </div>
                <div style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}>
                  {outputs.J3.toFixed(3)}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#999',
                  marginTop: '4px'
                }}>
                  bar
                </div>
              </div>
            </div>

            {/* Riga 4 */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '140px 140px',
              backgroundColor: 'white'
            }}>
              <div style={{ 
                padding: '20px',
                textAlign: 'center',
                borderRight: '2px solid #1976d2'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '6px',
                  fontWeight: '600'
                }}>
                  I4
                </div>
                <div style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}>
                  {outputs.I4.toFixed(3)}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#999',
                  marginTop: '4px'
                }}>
                  bar
                </div>
              </div>
              <div style={{ 
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#666',
                  marginBottom: '6px',
                  fontWeight: '600'
                }}>
                  J4
                </div>
                <div style={{ 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}>
                  {outputs.J4.toFixed(3)}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#999',
                  marginTop: '4px'
                }}>
                  bar
                </div>
              </div>
            </div>
          </div>

          {/* Formule di riferimento */}
          <div style={{ 
            marginTop: '30px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#666' }}>📐 Formule Excel</h3>
            <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.8' }}>
              <div><strong>I3:</strong> =(G3+F4*(F3+273.15)/(E3+273.15))-F4</div>
              <div><strong>J3:</strong> =(H3+F4*(F3+273.15)/(E3+273.15))-F4</div>
              <div><strong>I4:</strong> =(G4+F4*(F3+273.15)/(E3+273.15))-F4</div>
              <div><strong>J4:</strong> =(H4+F4*(F3+273.15)/(E3+273.15))-F4</div>
            </div>
          </div>
        </div>
      )}

      {/* Legenda colori */}
      <div className="card" style={{ marginTop: '20px', backgroundColor: '#f0f0f0' }}>
        <h3 style={{ marginTop: 0, fontSize: '16px' }}>🎨 Legenda Campi Input</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#E8F5E9',
              border: '2px solid #4CAF50',
              borderRadius: '3px'
            }}></div>
            <span style={{ fontSize: '14px' }}>E - Temperatura Ambiente</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#E3F2FD',
              border: '2px solid #2196F3',
              borderRadius: '3px'
            }}></div>
            <span style={{ fontSize: '14px' }}>F - Temperatura Target / Pressione Fredda</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              backgroundColor: '#FFF3E0',
              border: '2px solid #FF9800',
              borderRadius: '3px'
            }}></div>
            <span style={{ fontSize: '14px' }}>G, H - Pressioni Calde FL/FR</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TirePressure;
