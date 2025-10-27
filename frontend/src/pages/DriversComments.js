import React, { useState, useRef } from 'react';

function DriversComments() {
  const [formData, setFormData] = useState({
    event: '',
    session: '',
    date: '',
    tAir: '',
    tTrack: '',
    wetDry: 'dry',
    radio: '',
    seat: '',
    belts: '',
    stWheel: '',
    pedals: '',
    dashboard: '',
    engine: '',
    gearbox: '',
    comments: '',
    trackImage: null,
    trackImageName: '',
    turns: Array(17).fill(null).map(() => ({
      braking: '',
      turnIn: '',
      midCorner: '',
      exit: '',
      traction: '',
      comments: ''
    })),
    toGoFaster: ''
  });

  const fileInputRef = useRef(null);
  const printRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTurnChange = (turnIndex, field, value) => {
    setFormData(prev => {
      const newTurns = [...prev.turns];
      newTurns[turnIndex] = {
        ...newTurns[turnIndex],
        [field]: value
      };
      return {
        ...prev,
        turns: newTurns
      };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          trackImage: reader.result,
          trackImageName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (window.electron && window.electron.saveDriverComment) {
        const result = await window.electron.saveDriverComment(formData);
        if (result.success) {
          alert('Driver Comment salvato con successo!');
        } else {
          alert('Salvataggio annullato o errore: ' + (result.error || ''));
        }
      } else {
        // Fallback for web mode - download as JSON
        const dataStr = JSON.stringify(formData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `driver-comment-${formData.event || 'untitled'}-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('Driver Comment scaricato come file JSON!');
      }
    } catch (error) {
      console.error('Error saving driver comment:', error);
      alert('Errore nel salvataggio del Driver Comment');
    }
  };

  const handleLoad = async () => {
    try {
      if (window.electron && window.electron.loadDriverComment) {
        const result = await window.electron.loadDriverComment();
        if (result.success && result.data) {
          setFormData(result.data);
          alert('Driver Comment caricato con successo!');
        } else if (result.error) {
          alert('Errore nel caricamento: ' + result.error);
        }
      } else {
        // Fallback for web mode - use file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              try {
                const data = JSON.parse(event.target.result);
                setFormData(data);
                alert('Driver Comment caricato con successo!');
              } catch (error) {
                alert('Errore nel caricamento del file JSON');
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
      }
    } catch (error) {
      console.error('Error loading driver comment:', error);
      alert('Errore nel caricamento del Driver Comment');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNew = () => {
    if (window.confirm('Creare un nuovo Driver Comment? I dati non salvati andranno persi.')) {
      setFormData({
        event: '',
        session: '',
        date: '',
        tAir: '',
        tTrack: '',
        wetDry: 'dry',
        radio: '',
        seat: '',
        belts: '',
        stWheel: '',
        pedals: '',
        dashboard: '',
        engine: '',
        gearbox: '',
        comments: '',
        trackImage: null,
        trackImageName: '',
        turns: Array(17).fill(null).map(() => ({
          braking: '',
          turnIn: '',
          midCorner: '',
          exit: '',
          traction: '',
          comments: ''
        })),
        toGoFaster: ''
      });
    }
  };

  // Clean header section
  const handleCleanHeader = () => {
    if (window.confirm('Sei sicuro di voler pulire i dati header (Event, Session, Date)?')) {
      setFormData(prev => ({
        ...prev,
        event: '',
        session: '',
        date: ''
      }));
    }
  };

  // Clean weather section
  const handleCleanWeather = () => {
    if (window.confirm('Sei sicuro di voler pulire i dati meteo?')) {
      setFormData(prev => ({
        ...prev,
        tAir: '',
        tTrack: '',
        wetDry: 'dry'
      }));
    }
  };

  // Clean equipment section
  const handleCleanEquipment = () => {
    if (window.confirm('Sei sicuro di voler pulire le valutazioni equipment?')) {
      setFormData(prev => ({
        ...prev,
        radio: '',
        seat: '',
        belts: '',
        stWheel: '',
        pedals: '',
        dashboard: '',
        engine: '',
        gearbox: '',
        comments: ''
      }));
    }
  };

  // Clean turns analysis
  const handleCleanTurns = () => {
    if (window.confirm('Sei sicuro di voler pulire tutti i dati delle curve?')) {
      setFormData(prev => ({
        ...prev,
        turns: Array(17).fill(null).map(() => ({
          braking: '',
          turnIn: '',
          midCorner: '',
          exit: '',
          traction: '',
          comments: ''
        }))
      }));
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div className="no-print" style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={handleNew} style={buttonStyle}>
          🆕 Nuovo
        </button>
        <button onClick={handleLoad} style={buttonStyle}>
          📂 Carica
        </button>
        <button onClick={handleSave} style={buttonStyle}>
          💾 Salva
        </button>
        <button onClick={handlePrint} style={buttonStyle}>
          🖨️ Stampa
        </button>
      </div>

      <div ref={printRef} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Drivers Comments</h1>

        {/* Header Section */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>Informazioni Generali</h3>
            <button onClick={handleCleanHeader} className="no-print" style={{ 
              ...buttonStyle, 
              backgroundColor: '#ff9800',
              padding: '6px 12px',
              fontSize: '12px'
            }}>
              🧹 CLEAN
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Event:</label>
              <input
                type="text"
                value={formData.event}
                onChange={(e) => handleInputChange('event', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Session:</label>
              <input
                type="text"
                value={formData.session}
                onChange={(e) => handleInputChange('session', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Date:</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Weather Section */}
        <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Weather:</h3>
            <button onClick={handleCleanWeather} className="no-print" style={{ 
              ...buttonStyle, 
              backgroundColor: '#ff9800',
              padding: '6px 12px',
              fontSize: '12px'
            }}>
              🧹 CLEAN
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>T Air (°C):</label>
              <input
                type="number"
                value={formData.tAir}
                onChange={(e) => handleInputChange('tAir', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>T Track (°C):</label>
              <input
                type="number"
                value={formData.tTrack}
                onChange={(e) => handleInputChange('tTrack', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Condizioni:</label>
              <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="wetDry"
                    value="wet"
                    checked={formData.wetDry === 'wet'}
                    onChange={(e) => handleInputChange('wetDry', e.target.value)}
                  />
                  Wet
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="radio"
                    name="wetDry"
                    value="dry"
                    checked={formData.wetDry === 'dry'}
                    onChange={(e) => handleInputChange('wetDry', e.target.value)}
                  />
                  Dry
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Rating Section */}
        <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Rate the equipment (1:bad...5:good)</h3>
            <button onClick={handleCleanEquipment} className="no-print" style={{ 
              ...buttonStyle, 
              backgroundColor: '#ff9800',
              padding: '6px 12px',
              fontSize: '12px'
            }}>
              🧹 CLEAN
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '10px', alignItems: 'center' }}>
            {[
              { label: 'Radio:', field: 'radio' },
              { label: 'Seat:', field: 'seat' },
              { label: 'Belts:', field: 'belts' },
              { label: 'St.Wheel:', field: 'stWheel' },
              { label: 'Pedals:', field: 'pedals' },
              { label: 'Dashboard:', field: 'dashboard' },
              { label: 'Engine:', field: 'engine' },
              { label: 'Gearbox:', field: 'gearbox' }
            ].map(({ label, field }) => (
              <React.Fragment key={field}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    style={{ ...inputStyle, width: '80px' }}
                    placeholder="1-5"
                  />
                  {field === 'radio' && (
                    <div style={{ flex: 1 }}>
                      <label style={{ ...labelStyle, marginBottom: 0, display: 'inline', marginRight: '10px' }}>Comments:</label>
                      <input
                        type="text"
                        value={formData.comments}
                        onChange={(e) => handleInputChange('comments', e.target.value)}
                        style={{ ...inputStyle, flex: 1, width: 'calc(100% - 100px)' }}
                      />
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Track Image Section */}
        <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Track Image</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: '10px' }}
            className="no-print"
          />
          {formData.trackImage && (
            <div style={{ marginTop: '10px' }}>
              <img
                src={formData.trackImage}
                alt="Track layout"
                style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          )}
        </div>

        {/* Turn by Turn Analysis */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#333', marginBottom: '5px' }}>Turn by turn analysis</h3>
            <button onClick={handleCleanTurns} className="no-print" style={{ 
              ...buttonStyle, 
              backgroundColor: '#ff9800',
              padding: '6px 12px',
              fontSize: '12px'
            }}>
              🧹 CLEAN
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px', marginTop: '5px' }}>
            Braking, Traction (1:bad...5:good); Turn-in, Mid Corner, Exit balance (-3:max understeer...0: neutral...+3: max oversteer)
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={tableHeaderStyle}>Turn</th>
                  <th style={tableHeaderStyle}>Braking</th>
                  <th style={tableHeaderStyle}>Turn in</th>
                  <th style={tableHeaderStyle}>Mid Corner</th>
                  <th style={tableHeaderStyle}>Exit</th>
                  <th style={tableHeaderStyle}>Traction</th>
                  <th style={tableHeaderStyle}>Comments</th>
                </tr>
              </thead>
              <tbody>
                {formData.turns.map((turn, index) => (
                  <tr key={index}>
                    <td style={tableCellStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={turn.braking}
                        onChange={(e) => handleTurnChange(index, 'braking', e.target.value)}
                        style={tableInputStyle}
                        placeholder="1-5"
                      />
                    </td>
                    <td style={tableCellStyle}>
                      <input
                        type="number"
                        min="-3"
                        max="3"
                        value={turn.turnIn}
                        onChange={(e) => handleTurnChange(index, 'turnIn', e.target.value)}
                        style={tableInputStyle}
                        placeholder="-3 to 3"
                      />
                    </td>
                    <td style={tableCellStyle}>
                      <input
                        type="number"
                        min="-3"
                        max="3"
                        value={turn.midCorner}
                        onChange={(e) => handleTurnChange(index, 'midCorner', e.target.value)}
                        style={tableInputStyle}
                        placeholder="-3 to 3"
                      />
                    </td>
                    <td style={tableCellStyle}>
                      <input
                        type="number"
                        min="-3"
                        max="3"
                        value={turn.exit}
                        onChange={(e) => handleTurnChange(index, 'exit', e.target.value)}
                        style={tableInputStyle}
                        placeholder="-3 to 3"
                      />
                    </td>
                    <td style={tableCellStyle}>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={turn.traction}
                        onChange={(e) => handleTurnChange(index, 'traction', e.target.value)}
                        style={tableInputStyle}
                        placeholder="1-5"
                      />
                    </td>
                    <td style={tableCellStyle}>
                      <input
                        type="text"
                        value={turn.comments}
                        onChange={(e) => handleTurnChange(index, 'comments', e.target.value)}
                        style={{ ...tableInputStyle, width: '200px' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* To Go Faster Section */}
        <div style={{ marginBottom: '30px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>To go faster</h3>
          <textarea
            value={formData.toGoFaster}
            onChange={(e) => handleInputChange('toGoFaster', e.target.value)}
            style={{
              ...inputStyle,
              width: '100%',
              minHeight: '100px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder="Enter recommendations for going faster..."
          />
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#1976d2',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background-color 0.3s'
};

const labelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: '500',
  color: '#333'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box'
};

const tableHeaderStyle = {
  padding: '10px',
  border: '1px solid #ddd',
  textAlign: 'left',
  fontWeight: 'bold',
  color: '#333'
};

const tableCellStyle = {
  padding: '5px',
  border: '1px solid #ddd'
};

const tableInputStyle = {
  width: '100%',
  padding: '5px',
  border: '1px solid #ccc',
  borderRadius: '2px',
  fontSize: '13px',
  boxSizing: 'border-box'
};

export default DriversComments;
