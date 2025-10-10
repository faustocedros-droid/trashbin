import React, { useState, useEffect } from 'react';

function GeneralInformation() {
  const [imagePreview, setImagePreview] = useState('');

  // Load saved circuit image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem('generalInfo_circuitImage');
    if (savedImage) {
      setImagePreview(savedImage);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Per favore, carica un file immagine valido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      setImagePreview(imageData);
      localStorage.setItem('generalInfo_circuitImage', imageData);
    };
    reader.readAsDataURL(file);
  };

  // Remove circuit image
  const handleRemoveImage = () => {
    setImagePreview('');
    localStorage.removeItem('generalInfo_circuitImage');
  };

  const daysOfWeek = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>ℹ️ General Information</h1>
      
      {/* Circuit Image Upload Section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Immagine Circuito</h2>
        
        <div style={{ marginTop: '20px' }}>
          {imagePreview ? (
            <div>
              <img 
                src={imagePreview} 
                alt="Circuit" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  marginBottom: '15px'
                }} 
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleRemoveImage}
                  className="btn btn-secondary"
                  style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
                >
                  🗑️ Rimuovi Immagine
                </button>
                <label className="btn btn-primary" style={{ margin: 0 }}>
                  🔄 Cambia Immagine
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              border: '2px dashed #ddd', 
              borderRadius: '8px',
              backgroundColor: '#f8f9fa'
            }}>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Nessuna immagine caricata. Carica un'immagine del circuito.
              </p>
              <label className="btn btn-primary" style={{ margin: 0 }}>
                📤 Carica Immagine
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Table Section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h2>SCHEDULE</h2>
        
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table className="table">
            <thead>
              <tr>
                {daysOfWeek.map((day, index) => (
                  <th key={index} style={{ textAlign: 'center', minWidth: '120px' }}>
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {daysOfWeek.map((day, index) => (
                  <td key={index} style={{ 
                    textAlign: 'center', 
                    verticalAlign: 'top',
                    padding: '20px 10px',
                    minHeight: '150px'
                  }}>
                    <div style={{ color: '#999' }}>-</div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e7f3ff', 
          borderRadius: '4px',
          border: '1px solid #b3d9ff'
        }}>
          <p style={{ margin: 0, color: '#004085' }}>
            <strong>Nota:</strong> La tabella SCHEDULE mostra i giorni della settimana. 
            In futuro sarà possibile aggiungere eventi e informazioni per ogni giorno.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GeneralInformation;
