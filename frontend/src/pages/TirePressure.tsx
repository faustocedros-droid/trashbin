import React, { useState } from 'react';

/**
 * Tire Pressure Management Page
 * Replica del worksheet Excel "Pressioni" con layout semplificato
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
  
  // Input values for conversions (bar)
  F7: number;  // Pressione in bar
  G7: number;  // Pressione in bar
  F8: number;  // Pressione in bar
  G8: number;  // Pressione in bar
  F13: number; // Pressione fredda FL (bar)
  G13: number; // Pressione fredda FR (bar)
  F14: number; // Pressione fredda RL (bar)
  G14: number; // Pressione fredda RR (bar)
  L14: number; // Pressione in bar
  M14: number; // Pressione in bar
  L15: number; // Pressione in bar
  M15: number; // Pressione in bar
  F16: number; // Pressione calda FL (bar)
  G16: number; // Pressione calda FR (bar)
  F17: number; // Pressione calda RL (bar)
  G17: number; // Pressione calda RR (bar)
  N17: number; // Pressione in psi
  O17: number; // Pressione in psi
  N18: number; // Pressione in psi
  O18: number; // Pressione in psi
  
  // Temperature values
  H13: number; // Temperatura base 1
  H16: number; // Temperatura base 2
  H22: number; // Incremento temperatura 1
  H23: number; // Incremento temperatura 2
  H30: number; // Incremento temperatura 3
  H31: number; // Incremento temperatura 4
  
  // Coefficients
  K22: number; // Coefficiente primario
  K23: number; // Coefficiente secondario
  
  // Additional inputs for formulas D27-D31
  F27: number; // Pressione in bar
  G27: number; // Pressione in bar
  F28: number; // Pressione in bar
}

interface CalculatedOutputs {
  // Original outputs
  I3: number;  // =(G3+F4*(F3+273.15)/(E3+273.15))-F4
  J3: number;  // =(H3+F4*(F3+273.15)/(E3+273.15))-F4
  I4: number;  // =(G4+F4*(F3+273.15)/(E3+273.15))-F4
  J4: number;  // =(H4+F4*(F3+273.15)/(E3+273.15))-F4
  
  // Bar to PSI conversions
  D7: number;  // =F7*14.504
  E7: number;  // =G7*14.504
  D8: number;  // =F8*14.504
  E8: number;  // =G8*14.504
  
  // Static ratios
  N8: number;  // =22/17
  O8: number;  // =29/22
  N9: number;  // =24/20
  O9: number;  // =32/26
  N10: number; // =28/23
  O10: number; // =40/27
  N11: number; // =37/27
  O11: number; // =40/35
  
  // More conversions
  D13: number; // =F13*14.504
  E13: number; // =G13*14.504
  D14: number; // =F14*14.504
  E14: number; // =G14*14.504
  N14: number; // =L14*14.504
  O14: number; // =M14*14.504
  N15: number; // =L15*14.504
  O15: number; // =M15*14.504
  D16: number; // =F16*14.504
  E16: number; // =G16*14.504
  D17: number; // =F17*14.504
  E17: number; // =G17*14.504
  
  // PSI to bar conversions
  L17: number; // =N17/14.504
  M17: number; // =O17/14.504
  L18: number; // =N18/14.504
  M18: number; // =O18/14.504
  
  // Ratios
  D19: number; // =D16/D13
  E19: number; // =E16/E13
  D20: number; // =D17/D14
  E20: number; // =E17/E14
  
  // Corrected pressures
  D22: number; // =(D7/D19)- $K$22*(H22-H13) - $K$23*(H23-H16)
  E22: number; // =(E7/E19)- $K$22*(H22-H13) - $K$23*(H23-H16)
  F22: number; // =D22/14.504
  G22: number; // =E22/14.504
  D23: number; // =(D8/D20)+ $K$22*(H22-H13) + $K$23
  E23: number; // =(E8/E20)- $K$22*(H22-H13) - $K$23*(H23-H16)
  F23: number; // =D23/14.504
  G23: number; // =E23/14.504
  
  // Formulas with 14.5038 conversion factor
  D27: number; // =F27*14.5038
  E27: number; // =G27*14.5038
  D28: number; // =F28*14.5038
  E28: number; // =F28*14.5038
  D30: number; // =(D27/D19)- $K$22*(H30-H13) - $K$23*(H31-H16)
  E30: number; // =(E27/E19)- $K$22*(H30-H13) - $K$23*(H31-H16)
  F30: number; // =D30/14.5038
  G30: number; // =E30/14.5038
  D31: number; // =(D28/D20)- $K$22*(H30-H13) - $K$23*(H31-H16)
  E31: number; // =(E28/E20)- $K$22*(H30-H13) - $K$23*(H31-H16)
  F31: number; // =D31/14.5038
  G31: number; // =E31/14.5038
}

function TirePressure() {
  const [inputData, setInputData] = useState<TireInputData>({
    E3: 20,    // Temp Ambiente
    F3: 25,    // Temp Target
    G3: 2.3,   // Hot FL
    H3: 2.3,   // Hot FR
    E4: 0,     // Unused
    F4: 2.0,   // Cold pressure
    G4: 2.3,   // Hot RL
    H4: 2.3,   // Hot RR
    // Bar pressures for conversions
    F7: 2.0,
    G7: 2.0,
    F8: 2.0,
    G8: 2.0,
    F13: 2.0,  // Cold FL
    G13: 2.0,  // Cold FR
    F14: 2.0,  // Cold RL
    G14: 2.0,  // Cold RR
    L14: 2.0,
    M14: 2.0,
    L15: 2.0,
    M15: 2.0,
    F16: 2.3,  // Hot FL
    G16: 2.3,  // Hot FR
    F17: 2.3,  // Hot RL
    G17: 2.3,  // Hot RR
    N17: 29.0, // PSI
    O17: 29.0, // PSI
    N18: 29.0, // PSI
    O18: 29.0, // PSI
    // Temperatures
    H13: 20,   // Temp base 1
    H16: 20,   // Temp base 2
    H22: 25,   // Temp increment 1
    H23: 25,   // Temp increment 2
    H30: 25,   // Temp increment 3
    H31: 25,   // Temp increment 4
    // Coefficients
    K22: 0.02,
    K23: 0.015,
    // Additional
    F27: 2.0,
    G27: 2.0,
    F28: 2.0,
  });

  const [outputs, setOutputs] = useState<CalculatedOutputs | null>(null);

  /**
   * Calculate outputs based on Excel formulas
   */
  const handleCalculate = () => {
    const { E3, F3, G3, H3, F4, G4, H4, F7, G7, F8, G8, F13, G13, F14, G14,
            L14, M14, L15, M15, F16, G16, F17, G17, N17, O17, N18, O18,
            H13, H16, H22, H23, H30, H31, K22, K23, F27, G27, F28 } = inputData;
    
    // Original formulas - Incremento di Pressione
    const I3 = (G3 + F4 * (F3 + 273.15) / (E3 + 273.15)) - F4;
    const J3 = (H3 + F4 * (F3 + 273.15) / (E3 + 273.15)) - F4;
    const I4 = (G4 + F4 * (F3 + 273.15) / (E3 + 273.15)) - F4;
    const J4 = (H4 + F4 * (F3 + 273.15) / (E3 + 273.15)) - F4;
    
    // Bar to PSI conversions (14.504 factor)
    const D7 = F7 * 14.504;
    const E7 = G7 * 14.504;
    const D8 = F8 * 14.504;
    const E8 = G8 * 14.504;
    
    // Static ratios
    const N8 = 22 / 17;
    const O8 = 29 / 22;
    const N9 = 24 / 20;
    const O9 = 32 / 26;
    const N10 = 28 / 23;
    const O10 = 40 / 27;
    const N11 = 37 / 27;
    const O11 = 40 / 35;
    
    // More bar to PSI conversions
    const D13 = F13 * 14.504;
    const E13 = G13 * 14.504;
    const D14 = F14 * 14.504;
    const E14 = G14 * 14.504;
    const N14 = L14 * 14.504;
    const O14 = M14 * 14.504;
    const N15 = L15 * 14.504;
    const O15 = M15 * 14.504;
    const D16 = F16 * 14.504;
    const E16 = G16 * 14.504;
    const D17 = F17 * 14.504;
    const E17 = G17 * 14.504;
    
    // PSI to bar conversions
    const L17 = N17 / 14.504;
    const M17 = O17 / 14.504;
    const L18 = N18 / 14.504;
    const M18 = O18 / 14.504;
    
    // Hot/Cold ratios
    const D19 = D16 / D13;
    const E19 = E16 / E13;
    const D20 = D17 / D14;
    const E20 = E17 / E14;
    
    // Corrected pressures with temperature adjustments
    const D22 = (D7 / D19) - K22 * (H22 - H13) - K23 * (H23 - H16);
    const E22 = (E7 / E19) - K22 * (H22 - H13) - K23 * (H23 - H16);
    const F22 = D22 / 14.504;
    const G22 = E22 / 14.504;
    const D23 = (D8 / D20) + K22 * (H22 - H13) + K23;
    const E23 = (E8 / E20) - K22 * (H22 - H13) - K23 * (H23 - H16);
    const F23 = D23 / 14.504;
    const G23 = E23 / 14.504;
    
    // Conversions with 14.5038 factor
    const D27 = F27 * 14.5038;
    const E27 = G27 * 14.5038;
    const D28 = F28 * 14.5038;
    const E28 = F28 * 14.5038; // Note: uses F28 for both (as per formula)
    const D30 = (D27 / D19) - K22 * (H30 - H13) - K23 * (H31 - H16);
    const E30 = (E27 / E19) - K22 * (H30 - H13) - K23 * (H31 - H16);
    const F30 = D30 / 14.5038;
    const G30 = E30 / 14.5038;
    const D31 = (D28 / D20) - K22 * (H30 - H13) - K23 * (H31 - H16);
    const E31 = (E28 / E20) - K22 * (H30 - H13) - K23 * (H31 - H16);
    const F31 = D31 / 14.5038;
    const G31 = E31 / 14.5038;

    setOutputs({
      I3, J3, I4, J4,
      D7, E7, D8, E8,
      N8, O8, N9, O9, N10, O10, N11, O11,
      D13, E13, D14, E14, N14, O14, N15, O15,
      D16, E16, D17, E17,
      L17, M17, L18, M18,
      D19, E19, D20, E20,
      D22, E22, F22, G22, D23, E23, F23, G23,
      D27, E27, D28, E28,
      D30, E30, F30, G30, D31, E31, F31, G31
    });
  };

  const handleInputChange = (field: keyof TireInputData, value: number) => {
    setInputData({
      ...inputData,
      [field]: value,
    });
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>🏎️ Tire Pressure Management</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Gestione completa delle pressioni pneumatici - Implementazione formule Excel "Pressioni"
      </p>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>Dati di Input</h2>
        
        {/* Section 1: Temperature and Basic Pressure */}
        <h3 style={{ marginTop: '20px', fontSize: '16px', color: '#4472C4' }}>Temperature e Pressioni Base</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>E3: Temp Ambiente (°C)</label>
            <input type="number" step="0.1" value={inputData.E3} onChange={(e) => handleInputChange('E3', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>F3: Temp Target (°C)</label>
            <input type="number" step="0.1" value={inputData.F3} onChange={(e) => handleInputChange('F3', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>G3: Hot FL (bar)</label>
            <input type="number" step="0.01" value={inputData.G3} onChange={(e) => handleInputChange('G3', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>H3: Hot FR (bar)</label>
            <input type="number" step="0.01" value={inputData.H3} onChange={(e) => handleInputChange('H3', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>F4: Pressione Fredda (bar)</label>
            <input type="number" step="0.01" value={inputData.F4} onChange={(e) => handleInputChange('F4', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>G4: Hot RL (bar)</label>
            <input type="number" step="0.01" value={inputData.G4} onChange={(e) => handleInputChange('G4', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>H4: Hot RR (bar)</label>
            <input type="number" step="0.01" value={inputData.H4} onChange={(e) => handleInputChange('H4', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Section 2: Pressure values for conversions */}
        <h3 style={{ marginTop: '25px', fontSize: '16px', color: '#4472C4' }}>Pressioni per Conversioni (Row 7-8, 13-17)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '15px' }}>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>F7 (bar)</label>
            <input type="number" step="0.01" value={inputData.F7} onChange={(e) => handleInputChange('F7', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>G7 (bar)</label>
            <input type="number" step="0.01" value={inputData.G7} onChange={(e) => handleInputChange('G7', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>F8 (bar)</label>
            <input type="number" step="0.01" value={inputData.F8} onChange={(e) => handleInputChange('F8', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>G8 (bar)</label>
            <input type="number" step="0.01" value={inputData.G8} onChange={(e) => handleInputChange('G8', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>F13: Cold FL (bar)</label>
            <input type="number" step="0.01" value={inputData.F13} onChange={(e) => handleInputChange('F13', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>G13: Cold FR (bar)</label>
            <input type="number" step="0.01" value={inputData.G13} onChange={(e) => handleInputChange('G13', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>F14: Cold RL (bar)</label>
            <input type="number" step="0.01" value={inputData.F14} onChange={(e) => handleInputChange('F14', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>G14: Cold RR (bar)</label>
            <input type="number" step="0.01" value={inputData.G14} onChange={(e) => handleInputChange('G14', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>F16: Hot FL (bar)</label>
            <input type="number" step="0.01" value={inputData.F16} onChange={(e) => handleInputChange('F16', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>G16: Hot FR (bar)</label>
            <input type="number" step="0.01" value={inputData.G16} onChange={(e) => handleInputChange('G16', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>F17: Hot RL (bar)</label>
            <input type="number" step="0.01" value={inputData.F17} onChange={(e) => handleInputChange('F17', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>G17: Hot RR (bar)</label>
            <input type="number" step="0.01" value={inputData.G17} onChange={(e) => handleInputChange('G17', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        </div>

        {/* Section 3: PSI values and additional inputs */}
        <h3 style={{ marginTop: '25px', fontSize: '16px', color: '#4472C4' }}>Valori PSI e Parametri Addizionali</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '15px' }}>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>N17 (psi)</label>
            <input type="number" step="0.1" value={inputData.N17} onChange={(e) => handleInputChange('N17', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>O17 (psi)</label>
            <input type="number" step="0.1" value={inputData.O17} onChange={(e) => handleInputChange('O17', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>N18 (psi)</label>
            <input type="number" step="0.1" value={inputData.N18} onChange={(e) => handleInputChange('N18', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>O18 (psi)</label>
            <input type="number" step="0.1" value={inputData.O18} onChange={(e) => handleInputChange('O18', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>L14 (bar)</label>
            <input type="number" step="0.01" value={inputData.L14} onChange={(e) => handleInputChange('L14', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>M14 (bar)</label>
            <input type="number" step="0.01" value={inputData.M14} onChange={(e) => handleInputChange('M14', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>L15 (bar)</label>
            <input type="number" step="0.01" value={inputData.L15} onChange={(e) => handleInputChange('L15', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>M15 (bar)</label>
            <input type="number" step="0.01" value={inputData.M15} onChange={(e) => handleInputChange('M15', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>F27 (bar)</label>
            <input type="number" step="0.01" value={inputData.F27} onChange={(e) => handleInputChange('F27', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>G27 (bar)</label>
            <input type="number" step="0.01" value={inputData.G27} onChange={(e) => handleInputChange('G27', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>F28 (bar)</label>
            <input type="number" step="0.01" value={inputData.F28} onChange={(e) => handleInputChange('F28', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        </div>

        {/* Section 4: Temperature parameters */}
        <h3 style={{ marginTop: '25px', fontSize: '16px', color: '#4472C4' }}>Parametri Temperature</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '15px' }}>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>H13: Temp Base 1 (°C)</label>
            <input type="number" step="0.1" value={inputData.H13} onChange={(e) => handleInputChange('H13', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>H16: Temp Base 2 (°C)</label>
            <input type="number" step="0.1" value={inputData.H16} onChange={(e) => handleInputChange('H16', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>H22: Temp Incr 1 (°C)</label>
            <input type="number" step="0.1" value={inputData.H22} onChange={(e) => handleInputChange('H22', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>H23: Temp Incr 2 (°C)</label>
            <input type="number" step="0.1" value={inputData.H23} onChange={(e) => handleInputChange('H23', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>H30: Temp Incr 3 (°C)</label>
            <input type="number" step="0.1" value={inputData.H30} onChange={(e) => handleInputChange('H30', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>H31: Temp Incr 4 (°C)</label>
            <input type="number" step="0.1" value={inputData.H31} onChange={(e) => handleInputChange('H31', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        </div>

        {/* Section 5: Coefficients */}
        <h3 style={{ marginTop: '25px', fontSize: '16px', color: '#4472C4' }}>Coefficienti di Calibrazione</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '15px' }}>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>K22: Coefficiente Primario</label>
            <input type="number" step="0.001" value={inputData.K22} onChange={(e) => handleInputChange('K22', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
          <div><label style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>K23: Coefficiente Secondario</label>
            <input type="number" step="0.001" value={inputData.K23} onChange={(e) => handleInputChange('K23', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ccc', borderRadius: '4px' }} /></div>
        </div>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleCalculate} 
            style={{ fontSize: '18px', padding: '12px 40px' }}
          >
            🧮 Calcola Tutte le Formule
          </button>
        </div>
      </div>

      {/* Output Results */}
      {outputs && (
        <>
          <div className="card" style={{ marginBottom: '30px' }}>
            <h2>📊 Risultati - Conversioni Bar ↔ PSI</h2>
            <div style={{ overflowX: 'auto', marginTop: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#4472C4', color: 'white' }}>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Formula</th>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Risultato</th>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Descrizione</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>D7 = F7*14.504</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.D7.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>Bar → PSI</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>E7 = G7*14.504</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.E7.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>Bar → PSI</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>D8 = F8*14.504</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.D8.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>Bar → PSI</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>E8 = G8*14.504</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.E8.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>Bar → PSI</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>L17 = N17/14.504</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.L17.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>PSI → Bar</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>M17 = O17/14.504</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.M17.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>PSI → Bar</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '30px' }}>
            <h2>📈 Rapporti Caldo/Freddo e Ratios Statici</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
                <strong>D19 (FL Ratio):</strong> {outputs.D19.toFixed(4)}<br/>
                <small>Formula: D16/D13</small>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
                <strong>E19 (FR Ratio):</strong> {outputs.E19.toFixed(4)}<br/>
                <small>Formula: E16/E13</small>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
                <strong>D20 (RL Ratio):</strong> {outputs.D20.toFixed(4)}<br/>
                <small>Formula: D17/D14</small>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
                <strong>E20 (RR Ratio):</strong> {outputs.E20.toFixed(4)}<br/>
                <small>Formula: E17/E14</small>
              </div>
            </div>
            <h3 style={{ marginTop: '20px', fontSize: '15px' }}>Ratios Statici</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginTop: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '13px' }}>
                <strong>N8:</strong> {outputs.N8.toFixed(4)} (22/17)</div>
              <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '13px' }}>
                <strong>O8:</strong> {outputs.O8.toFixed(4)} (29/22)</div>
              <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '13px' }}>
                <strong>N9:</strong> {outputs.N9.toFixed(4)} (24/20)</div>
              <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '13px' }}>
                <strong>O9:</strong> {outputs.O9.toFixed(4)} (32/26)</div>
              <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '13px' }}>
                <strong>N10:</strong> {outputs.N10.toFixed(4)} (28/23)</div>
              <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '13px' }}>
                <strong>O10:</strong> {outputs.O10.toFixed(4)} (40/27)</div>
              <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '13px' }}>
                <strong>N11:</strong> {outputs.N11.toFixed(4)} (37/27)</div>
              <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px', fontSize: '13px' }}>
                <strong>O11:</strong> {outputs.O11.toFixed(4)} (40/35)</div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '30px' }}>
            <h2>🎯 Pressioni Corrette con Correzione Temperatura</h2>
            <div style={{ overflowX: 'auto', marginTop: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#70AD47', color: 'white' }}>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Cella</th>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>PSI</th>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Bar</th>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: '#D6EAD6' }}>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>D22/F22</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>{outputs.D22.toFixed(3)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold', fontSize: '15px' }}>{outputs.F22.toFixed(3)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>(D7/D19)-K22*(H22-H13)-K23*(H23-H16)</td>
                  </tr>
                  <tr style={{ backgroundColor: '#D6EAD6' }}>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>E22/G22</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>{outputs.E22.toFixed(3)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold', fontSize: '15px' }}>{outputs.G22.toFixed(3)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>(E7/E19)-K22*(H22-H13)-K23*(H23-H16)</td>
                  </tr>
                  <tr style={{ backgroundColor: '#FCE4D6' }}>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>D23/F23</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>{outputs.D23.toFixed(3)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold', fontSize: '15px' }}>{outputs.F23.toFixed(3)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>(D8/D20)+K22*(H22-H13)+K23</td>
                  </tr>
                  <tr style={{ backgroundColor: '#FCE4D6' }}>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>E23/G23</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc' }}>{outputs.E23.toFixed(3)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold', fontSize: '15px' }}>{outputs.G23.toFixed(3)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>(E8/E20)-K22*(H22-H13)-K23*(H23-H16)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '30px' }}>
            <h2>🔧 Calcoli con Fattore 14.5038 (Rows 27-31)</h2>
            <div style={{ overflowX: 'auto', marginTop: '15px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#8E7CC3', color: 'white' }}>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Cella</th>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>PSI</th>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Bar</th>
                    <th style={{ padding: '10px', border: '1px solid #333' }}>Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>D27</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.D27.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>-</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>F27*14.5038</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>E27</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.E27.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>-</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>G27*14.5038</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>D30/F30</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>{outputs.D30.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.F30.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>(D27/D19)-K22*(H30-H13)-K23*(H31-H16)</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>E30/G30</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>{outputs.E30.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.G30.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>(E27/E19)-K22*(H30-H13)-K23*(H31-H16)</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>D31/F31</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>{outputs.D31.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.F31.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>(D28/D20)-K22*(H30-H13)-K23*(H31-H16)</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ccc' }}>E31/G31</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>{outputs.E31.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{outputs.G31.toFixed(3)}</td>
                      <td style={{ padding: '8px', border: '1px solid #ccc', fontSize: '11px' }}>(E28/E20)-K22*(H30-H13)-K23*(H31-H16)</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '30px' }}>
            <h2>📊 Incrementi di Pressione (Formule Originali)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '15px' }}>
              <div style={{ padding: '15px', backgroundColor: '#FCE4D6', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', marginBottom: '5px', color: '#666' }}>I3 (FL)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#C65911' }}>{outputs.I3.toFixed(3)} bar</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#FCE4D6', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', marginBottom: '5px', color: '#666' }}>J3 (FR)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#C65911' }}>{outputs.J3.toFixed(3)} bar</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#FCE4D6', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', marginBottom: '5px', color: '#666' }}>I4 (RL)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#C65911' }}>{outputs.I4.toFixed(3)} bar</div>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#FCE4D6', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', marginBottom: '5px', color: '#666' }}>J4 (RR)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#C65911' }}>{outputs.J4.toFixed(3)} bar</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: '30px', backgroundColor: '#f0f8ff' }}>
        <h3>📋 Legenda e Note</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>FL:</strong> Front Left (Anteriore Sinistro)</li>
          <li><strong>FR:</strong> Front Right (Anteriore Destro)</li>
          <li><strong>RL:</strong> Rear Left (Posteriore Sinistro)</li>
          <li><strong>RR:</strong> Rear Right (Posteriore Destro)</li>
        </ul>
        <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
          <strong>Note:</strong> Implementate tutte le 50+ formule dal worksheet Excel "Pressioni" (linee 1538-1594 di formule_estratte.txt).
          Include conversioni bar/psi, rapporti caldo/freddo, e pressioni corrette con correzioni di temperatura.
        </p>
      </div>
    </div>
  );
}

export default TirePressure;
