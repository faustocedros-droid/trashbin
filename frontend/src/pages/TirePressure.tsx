import React, { useState } from 'react';

/**
 * Tire Pressure Management Page
 * Replica del worksheet Excel "Pressioni" con le formule estratte
 */

interface TireData {
  // Temperatura ambiente e target
  tempAmbient: number;  // E3/F3
  tempTarget: number;   // F3
  
  // Pressioni fredde e calde (bar)
  pressureColdFL: number;  // F7 Front Left
  pressureColdFR: number;  // G7 Front Right
  pressureHotFL: number;   // F8 Front Left
  pressureHotFR: number;   // G8 Front Right
  
  // Pressioni in psi (calcolate)
  // Le formule usano conversione: bar * 14.504 = psi
  
  // Incrementi temperatura
  tempIncrementFL: number;  // H22
  tempIncrementFR: number;  // H23
  
  // Coefficienti di correzione
  coeffK22: number;  // K22
  coeffK23: number;  // K23
}

interface CalculatedResults {
  // Incrementi di pressione (I3, J3, I4, J4)
  pressureIncFL_I3: number;
  pressureIncFR_J3: number;
  pressureIncFL_I4: number;
  pressureIncFR_J4: number;
  
  // Conversioni bar -> psi
  psiColdFL_D7: number;
  psiColdFR_E7: number;
  psiHotFL_D8: number;
  psiHotFR_E8: number;
  
  // Rapporti pressione
  ratioFL_D19: number;
  ratioFR_E19: number;
  
  // Pressioni corrette
  correctedPsiFL_D22: number;
  correctedPsiFR_E22: number;
  correctedBarFL_F22: number;
  correctedBarFR_G22: number;
}

function TirePressure() {
  const [tireData, setTireData] = useState<TireData>({
    tempAmbient: 20,
    tempTarget: 25,
    pressureColdFL: 2.0,
    pressureColdFR: 2.0,
    pressureHotFL: 2.3,
    pressureHotFR: 2.3,
    tempIncrementFL: 5,
    tempIncrementFR: 5,
    coeffK22: 0.02,
    coeffK23: 0.015,
  });

  const [results, setResults] = useState<CalculatedResults | null>(null);

  // Funzioni di calcolo basate sulle formule Excel estratte

  /**
   * Formula: =(G3+F4*(F3+273.15)/(E3+273.15))-F4
   * Calcola l'incremento di pressione in base alla temperatura
   */
  const calculatePressureIncrement = (
    pressureHot: number,
    pressureCold: number,
    tempTarget: number,
    tempAmbient: number
  ): number => {
    return (pressureHot + pressureCold * (tempTarget + 273.15) / (tempAmbient + 273.15)) - pressureCold;
  };

  /**
   * Formula: =F7*14.504
   * Conversione da bar a psi
   */
  const barToPsi = (bar: number): number => {
    return bar * 14.504;
  };

  /**
   * Formula: =N17/14.504
   * Conversione da psi a bar
   */
  const psiToBar = (psi: number): number => {
    return psi / 14.504;
  };

  /**
   * Formula: =D16/D13
   * Calcola il rapporto tra pressione calda e fredda
   */
  const calculatePressureRatio = (psiHot: number, psiCold: number): number => {
    if (psiCold === 0) return 1;
    return psiHot / psiCold;
  };

  /**
   * Formula: =(D7/D19)- $K$22*(H22-H13) - $K$23*(H23-H16)
   * Calcola la pressione corretta in base agli incrementi di temperatura
   */
  const calculateCorrectedPressure = (
    psiCold: number,
    ratio: number,
    coeffK22: number,
    tempIncrement1: number,
    tempBase1: number,
    coeffK23: number,
    tempIncrement2: number,
    tempBase2: number
  ): number => {
    if (ratio === 0) return psiCold;
    return (psiCold / ratio) - coeffK22 * (tempIncrement1 - tempBase1) - coeffK23 * (tempIncrement2 - tempBase2);
  };

  const handleCalculate = () => {
    // Calcola incrementi di pressione (formule I3, J3, I4, J4)
    const pressureIncFL_I3 = calculatePressureIncrement(
      tireData.pressureHotFL,
      tireData.pressureColdFL,
      tireData.tempTarget,
      tireData.tempAmbient
    );
    
    const pressureIncFR_J3 = calculatePressureIncrement(
      tireData.pressureHotFR,
      tireData.pressureColdFR,
      tireData.tempTarget,
      tireData.tempAmbient
    );

    // Conversioni bar -> psi (formule D7, E7, D8, E8)
    const psiColdFL_D7 = barToPsi(tireData.pressureColdFL);
    const psiColdFR_E7 = barToPsi(tireData.pressureColdFR);
    const psiHotFL_D8 = barToPsi(tireData.pressureHotFL);
    const psiHotFR_E8 = barToPsi(tireData.pressureHotFR);

    // Calcola rapporti (formule D19, E19)
    const ratioFL_D19 = calculatePressureRatio(psiHotFL_D8, psiColdFL_D7);
    const ratioFR_E19 = calculatePressureRatio(psiHotFR_E8, psiColdFR_E7);

    // Calcola pressioni corrette (formule D22, E22)
    const correctedPsiFL_D22 = calculateCorrectedPressure(
      psiColdFL_D7,
      ratioFL_D19,
      tireData.coeffK22,
      tireData.tempIncrementFL,
      0, // H13 base
      tireData.coeffK23,
      tireData.tempIncrementFR,
      0  // H16 base
    );

    const correctedPsiFR_E22 = calculateCorrectedPressure(
      psiColdFR_E7,
      ratioFR_E19,
      tireData.coeffK22,
      tireData.tempIncrementFL,
      0,
      tireData.coeffK23,
      tireData.tempIncrementFR,
      0
    );

    // Conversioni psi -> bar (formule F22, G22)
    const correctedBarFL_F22 = psiToBar(correctedPsiFL_D22);
    const correctedBarFR_G22 = psiToBar(correctedPsiFR_E22);

    setResults({
      pressureIncFL_I3,
      pressureIncFR_J3,
      pressureIncFL_I4: pressureIncFL_I3, // Replica formula I4
      pressureIncFR_J4: pressureIncFR_J3, // Replica formula J4
      psiColdFL_D7,
      psiColdFR_E7,
      psiHotFL_D8,
      psiHotFR_E8,
      ratioFL_D19,
      ratioFR_E19,
      correctedPsiFL_D22,
      correctedPsiFR_E22,
      correctedBarFL_F22,
      correctedBarFR_G22,
    });
  };

  const handleInputChange = (field: keyof TireData, value: number) => {
    setTireData({
      ...tireData,
      [field]: value,
    });
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>🏎️ Tire Pressure Management</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Gestione delle pressioni pneumatici - Replica del worksheet Excel "Pressioni"
      </p>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h2>Dati di Input</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {/* Temperature */}
          <div className="form-group">
            <label>Temperatura Ambiente (°C)</label>
            <input
              type="number"
              step="0.1"
              value={tireData.tempAmbient}
              onChange={(e) => handleInputChange('tempAmbient', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          <div className="form-group">
            <label>Temperatura Target (°C)</label>
            <input
              type="number"
              step="0.1"
              value={tireData.tempTarget}
              onChange={(e) => handleInputChange('tempTarget', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          {/* Pressioni Anteriore Sinistro */}
          <div className="form-group">
            <label>Pressione Fredda FL (bar)</label>
            <input
              type="number"
              step="0.1"
              value={tireData.pressureColdFL}
              onChange={(e) => handleInputChange('pressureColdFL', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          <div className="form-group">
            <label>Pressione Calda FL (bar)</label>
            <input
              type="number"
              step="0.1"
              value={tireData.pressureHotFL}
              onChange={(e) => handleInputChange('pressureHotFL', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          {/* Pressioni Anteriore Destro */}
          <div className="form-group">
            <label>Pressione Fredda FR (bar)</label>
            <input
              type="number"
              step="0.1"
              value={tireData.pressureColdFR}
              onChange={(e) => handleInputChange('pressureColdFR', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          <div className="form-group">
            <label>Pressione Calda FR (bar)</label>
            <input
              type="number"
              step="0.1"
              value={tireData.pressureHotFR}
              onChange={(e) => handleInputChange('pressureHotFR', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          {/* Incrementi Temperatura */}
          <div className="form-group">
            <label>Incremento Temp FL (°C)</label>
            <input
              type="number"
              step="0.1"
              value={tireData.tempIncrementFL}
              onChange={(e) => handleInputChange('tempIncrementFL', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          <div className="form-group">
            <label>Incremento Temp FR (°C)</label>
            <input
              type="number"
              step="0.1"
              value={tireData.tempIncrementFR}
              onChange={(e) => handleInputChange('tempIncrementFR', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          {/* Coefficienti */}
          <div className="form-group">
            <label>Coefficiente K22</label>
            <input
              type="number"
              step="0.001"
              value={tireData.coeffK22}
              onChange={(e) => handleInputChange('coeffK22', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>

          <div className="form-group">
            <label>Coefficiente K23</label>
            <input
              type="number"
              step="0.001"
              value={tireData.coeffK23}
              onChange={(e) => handleInputChange('coeffK23', parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <button className="btn btn-primary" onClick={handleCalculate} style={{ fontSize: '18px', padding: '12px 30px' }}>
            🧮 Calcola Pressioni
          </button>
        </div>
      </div>

      {results && (
        <>
          <div className="card" style={{ marginBottom: '30px' }}>
            <h2>📊 Risultati - Conversioni e Incrementi</h2>
            
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Parametro</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>Front Left</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>Front Right</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Formula Excel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>Incremento Pressione (bar)</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>
                      {results.pressureIncFL_I3.toFixed(3)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold' }}>
                      {results.pressureIncFR_J3.toFixed(3)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '14px', fontFamily: 'monospace' }}>
                      =(G3+F4*(F3+273.15)/(E3+273.15))-F4
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>Pressione Fredda (psi)</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      {results.psiColdFL_D7.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      {results.psiColdFR_E7.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '14px', fontFamily: 'monospace' }}>
                      =F7*14.504
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>Pressione Calda (psi)</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      {results.psiHotFL_D8.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      {results.psiHotFR_E8.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '14px', fontFamily: 'monospace' }}>
                      =F8*14.504
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>Rapporto Caldo/Freddo</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      {results.ratioFL_D19.toFixed(4)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>
                      {results.ratioFR_E19.toFixed(4)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '14px', fontFamily: 'monospace' }}>
                      =D16/D13
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2>✅ Pressioni Corrette Raccomandate</h2>
            
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#d4edda' }}>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Parametro</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>Front Left</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center' }}>Front Right</th>
                    <th style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'left' }}>Formula Excel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>Pressione Corretta (psi)</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                      {results.correctedPsiFL_D22.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                      {results.correctedPsiFR_E22.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '14px', fontFamily: 'monospace' }}>
                      =(D7/D19)-K22*(H22-H13)-K23*(H23-H16)
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#fff3cd' }}>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                      <strong>Pressione Corretta (bar)</strong>
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#0066cc' }}>
                      {results.correctedBarFL_F22.toFixed(3)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#0066cc' }}>
                      {results.correctedBarFR_G22.toFixed(3)}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6', fontSize: '14px', fontFamily: 'monospace' }}>
                      =D22/14.504
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h3 style={{ marginTop: 0 }}>💡 Raccomandazioni</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>
                  <strong>Front Left:</strong> Impostare a {results.correctedBarFL_F22.toFixed(3)} bar 
                  ({results.correctedPsiFL_D22.toFixed(2)} psi)
                </li>
                <li>
                  <strong>Front Right:</strong> Impostare a {results.correctedBarFR_G22.toFixed(3)} bar 
                  ({results.correctedPsiFR_E22.toFixed(2)} psi)
                </li>
                <li>Le pressioni sono state corrette considerando gli incrementi di temperatura e i coefficienti di calibrazione</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <div className="card" style={{ marginTop: '30px', backgroundColor: '#e7f3ff' }}>
        <h3>📋 Note sulle Formule</h3>
        <p style={{ lineHeight: '1.8' }}>
          Le formule implementate replicano il worksheet "Pressioni" dall'Excel originale (linee 1538-1594 del file formule_estratte.txt):
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Conversione bar ↔ psi:</strong> 1 bar = 14.504 psi</li>
          <li><strong>Incremento pressione:</strong> Calcolato usando la legge dei gas ideali con temperature assolute (Kelvin)</li>
          <li><strong>Rapporto caldo/freddo:</strong> Indica l'espansione termica della pressione</li>
          <li><strong>Correzioni:</strong> Applicate in base agli incrementi di temperatura e ai coefficienti K22 e K23</li>
        </ul>
      </div>
    </div>
  );
}

export default TirePressure;
