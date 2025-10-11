import React, { useState, useEffect } from 'react';

function GeneralInformation() {
  const [imagePreview, setImagePreview] = useState('');
  const [scheduleData, setScheduleData] = useState([]);

  // Initialize schedule data with 15 rows and 7 columns
  const initializeScheduleData = () => {
    const rows = [];
    for (let i = 0; i < 15; i++) {
      rows.push({
        rowId: i,
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
      });
    }
    return rows;
  };

  // Load saved circuit image and schedule data from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem('generalInfo_circuitImage');
    if (savedImage) {
      setImagePreview(savedImage);
    }

    const savedSchedule = localStorage.getItem('generalInfo_schedule');
    if (savedSchedule) {
      try {
        setScheduleData(JSON.parse(savedSchedule));
      } catch (error) {
        console.error('Error loading schedule data:', error);
        setScheduleData(initializeScheduleData());
      }
    } else {
      setScheduleData(initializeScheduleData());
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

  // Handle schedule data change
  const handleScheduleChange = (rowIndex, dayKey, value) => {
    const updatedSchedule = [...scheduleData];
    updatedSchedule[rowIndex][dayKey] = value;
    setScheduleData(updatedSchedule);
    // Auto-save to localStorage
    localStorage.setItem('generalInfo_schedule', JSON.stringify(updatedSchedule));
  };

  const daysOfWeek = [
    { label: 'Lunedì', key: 'monday' },
    { label: 'Martedì', key: 'tuesday' },
    { label: 'Mercoledì', key: 'wednesday' },
    { label: 'Giovedì', key: 'thursday' },
    { label: 'Venerdì', key: 'friday' },
    { label: 'Sabato', key: 'saturday' },
    { label: 'Domenica', key: 'sunday' }
  ];

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
          <table className="table" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {daysOfWeek.map((day, index) => (
                  <th key={index} style={{ 
                    textAlign: 'center', 
                    minWidth: '140px',
                    backgroundColor: '#f5f5f5',
                    fontWeight: '600',
                    padding: '12px'
                  }}>
                    {day.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {daysOfWeek.map((day, colIndex) => (
                    <td key={colIndex} style={{ 
                      padding: '8px',
                      verticalAlign: 'top'
                    }}>
                      <input
                        type="text"
                        value={row[day.key]}
                        onChange={(e) => handleScheduleChange(rowIndex, day.key, e.target.value)}
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
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GeneralInformation;
