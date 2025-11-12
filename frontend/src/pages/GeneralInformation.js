import React, { useState, useEffect } from 'react';

function GeneralInformation() {
  const [imagePreview, setImagePreview] = useState('');
  const [scheduleData, setScheduleData] = useState([]);
  const [eventDetails, setEventDetails] = useState({
    date: '',
    championship: '',
    event: '',
    car: '',
    team: '',
    driver1: '',
    driver2: '',
    driver3: '',
    driver4: ''
  });

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

  // Load saved circuit image, schedule data, and event details from localStorage on component mount
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

    const savedEventDetails = localStorage.getItem('generalInfo_eventDetails');
    if (savedEventDetails) {
      try {
        setEventDetails(JSON.parse(savedEventDetails));
      } catch (error) {
        console.error('Error loading event details:', error);
      }
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

  // Clean schedule table
  const handleCleanSchedule = () => {
    if (window.confirm('Sei sicuro di voler pulire tutti i dati della tabella schedule?')) {
      const clearedSchedule = initializeScheduleData();
      setScheduleData(clearedSchedule);
      localStorage.setItem('generalInfo_schedule', JSON.stringify(clearedSchedule));
    }
  };

  // Handle schedule data change
  const handleScheduleChange = (rowIndex, dayKey, value) => {
    const updatedSchedule = [...scheduleData];
    updatedSchedule[rowIndex][dayKey] = value;
    setScheduleData(updatedSchedule);
    // Auto-save to localStorage
    localStorage.setItem('generalInfo_schedule', JSON.stringify(updatedSchedule));
  };

  // Handle event details change
  const handleEventDetailChange = (field, value) => {
    const updatedDetails = { ...eventDetails, [field]: value };
    setEventDetails(updatedDetails);
    // Auto-save to localStorage
    localStorage.setItem('generalInfo_eventDetails', JSON.stringify(updatedDetails));
  };

  // Export general information to file
  const handleExportData = () => {
    const dataToExport = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      eventDetails: eventDetails,
      circuitImage: imagePreview,
      schedule: scheduleData
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `general_info_${new Date().toISOString().split('T')[0]}.geninfo`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import general information from file
  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result);
        
        if (!importedData.schedule) {
          throw new Error('File non valido: struttura dati mancante');
        }

        if (window.confirm('Vuoi importare questi dati? I dati attuali saranno sostituiti.')) {
          if (importedData.eventDetails) {
            setEventDetails(importedData.eventDetails);
            localStorage.setItem('generalInfo_eventDetails', JSON.stringify(importedData.eventDetails));
          }
          if (importedData.circuitImage) {
            setImagePreview(importedData.circuitImage);
            localStorage.setItem('generalInfo_circuitImage', importedData.circuitImage);
          }
          setScheduleData(importedData.schedule);
          localStorage.setItem('generalInfo_schedule', JSON.stringify(importedData.schedule));
          alert('Dati importati con successo!');
        }
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Errore nel caricamento del file! Assicurati che sia un file .geninfo valido.');
      }
    };
    reader.readAsText(file);
    
    // Reset input to allow importing the same file again
    e.target.value = '';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>ℹ️ General Information</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExportData}
            className="btn btn-primary"
            style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
          >
            💾 Esporta Dati
          </button>
          <label
            className="btn btn-primary"
            style={{ margin: 0, cursor: 'pointer', backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
          >
            📂 Importa Dati
            <input
              type="file"
              accept=".geninfo"
              onChange={handleImportData}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
      
      {/* Event Details Section */}
      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Event Details</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginTop: '20px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Date
            </label>
            <input
              type="text"
              value={eventDetails.date}
              onChange={(e) => handleEventDetailChange('date', e.target.value)}
              placeholder="Enter date..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Championship
            </label>
            <input
              type="text"
              value={eventDetails.championship}
              onChange={(e) => handleEventDetailChange('championship', e.target.value)}
              placeholder="Enter championship..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Event
            </label>
            <input
              type="text"
              value={eventDetails.event}
              onChange={(e) => handleEventDetailChange('event', e.target.value)}
              placeholder="Enter event..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Car
            </label>
            <input
              type="text"
              value={eventDetails.car}
              onChange={(e) => handleEventDetailChange('car', e.target.value)}
              placeholder="Enter car..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Team
            </label>
            <input
              type="text"
              value={eventDetails.team}
              onChange={(e) => handleEventDetailChange('team', e.target.value)}
              placeholder="Enter team..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Driver1
            </label>
            <input
              type="text"
              value={eventDetails.driver1}
              onChange={(e) => handleEventDetailChange('driver1', e.target.value)}
              placeholder="Enter driver 1..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Driver2
            </label>
            <input
              type="text"
              value={eventDetails.driver2}
              onChange={(e) => handleEventDetailChange('driver2', e.target.value)}
              placeholder="Enter driver 2..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Driver3
            </label>
            <input
              type="text"
              value={eventDetails.driver3}
              onChange={(e) => handleEventDetailChange('driver3', e.target.value)}
              placeholder="Enter driver 3..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Driver4
            </label>
            <input
              type="text"
              value={eventDetails.driver4}
              onChange={(e) => handleEventDetailChange('driver4', e.target.value)}
              placeholder="Enter driver 4..."
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>
      
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0 }}>SCHEDULE</h2>
          <button
            onClick={handleCleanSchedule}
            className="btn btn-primary"
            style={{ 
              margin: 0, 
              padding: '8px 16px',
              backgroundColor: '#ff9800', 
              borderColor: '#ff9800' 
            }}
            title="Pulisci tutti i dati della tabella"
          >
            🧹 CLEAN
          </button>
        </div>
        
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
