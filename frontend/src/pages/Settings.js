import React, { useState, useEffect } from 'react';

function Settings() {
  const STORAGE_PATH_KEY = 'racingCarManager_storagePath';
  const ARCHIVE_PATH_KEY = 'racingCarManager_archivePath';
  const [storagePath, setStoragePath] = useState('');
  const [archivePath, setArchivePath] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Carica il percorso salvato
    const savedPath = localStorage.getItem(STORAGE_PATH_KEY);
    if (savedPath) {
      setStoragePath(savedPath);
    }
    const savedArchivePath = localStorage.getItem(ARCHIVE_PATH_KEY);
    if (savedArchivePath) {
      setArchivePath(savedArchivePath);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem(STORAGE_PATH_KEY, storagePath);
    setMessage('Percorso salvato con successo!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_PATH_KEY);
    setStoragePath('');
    setMessage('Percorso ripristinato al default!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveArchive = () => {
    // Get all data from localStorage
    const eventsData = localStorage.getItem('racingCarManager_events');
    const tirePressureData = localStorage.getItem('tirePressureDatabase');
    
    // Create a comprehensive archive object
    const archiveData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      events: eventsData ? JSON.parse(eventsData) : [],
      tirePressureDatabase: tirePressureData ? JSON.parse(tirePressureData) : null
    };
    
    // Check if there's any data to save
    if (!eventsData && !tirePressureData) {
      setMessage('Nessun dato da salvare!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Create a blob with the comprehensive data
    const blob = new Blob([JSON.stringify(archiveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    
    // Use archivePath as the filename for download
    // Note: Browser security prevents direct filesystem access, 
    // so this will trigger a download dialog with the specified filename
    const filename = archivePath || 'racing_data_archive.tpdb';
    link.download = filename.endsWith('.tpdb') ? filename : filename + '.tpdb';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage('Archivio salvato con successo! Il file verrà scaricato nella cartella Download del browser.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLoadArchive = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const archiveData = JSON.parse(data);
        
        // Check if this is the new format (with version) or old format
        if (archiveData.version) {
          // New format - restore both events and tire pressure data
          if (archiveData.events) {
            localStorage.setItem('racingCarManager_events', JSON.stringify(archiveData.events));
          }
          if (archiveData.tirePressureDatabase) {
            localStorage.setItem('tirePressureDatabase', JSON.stringify(archiveData.tirePressureDatabase));
          }
          setMessage('Archivio caricato con successo! Tutti i dati sono stati ripristinati.');
        } else {
          // Old format - assume it's just tire pressure data
          localStorage.setItem('tirePressureDatabase', data);
          setMessage('Archivio caricato con successo! (formato vecchio - solo dati pressioni)');
        }
        setTimeout(() => setMessage(''), 5000);
        
        // Reload the page to reflect the restored data
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error('Error loading archive:', error);
        setMessage('Errore nel caricamento del file! Assicurati che sia un file .tpdb valido.');
        setTimeout(() => setMessage(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveArchivePath = () => {
    localStorage.setItem(ARCHIVE_PATH_KEY, archivePath);
    setMessage('Percorso archivio salvato!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>⚙️ Impostazioni</h1>
      
      <div className="card" style={{ marginTop: '30px', maxWidth: '800px' }}>
        <h2>Percorso di Archiviazione Dati Sessione</h2>
        
        <form onSubmit={handleSave} style={{ marginTop: '20px' }}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="storagePath" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Percorso di Archiviazione
            </label>
            <input
              type="text"
              id="storagePath"
              value={storagePath}
              onChange={(e) => setStoragePath(e.target.value)}
              placeholder="es. C:\RacingData o /Users/nome/RacingData"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
              Specifica il percorso dove salvare i dati delle sessioni. 
              Se vuoto, verrà utilizzato il localStorage del browser.
            </small>
          </div>

          {message && (
            <div style={{
              padding: '12px',
              marginBottom: '20px',
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
              borderRadius: '4px'
            }}>
              {message}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary">
              💾 Salva Percorso
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              🔄 Ripristina Default
            </button>
          </div>
        </form>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0 }}>ℹ️ Informazioni</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li><strong>Percorso Corrente:</strong> {storagePath || 'localStorage (default)'}</li>
            <li><strong>Modalità:</strong> {storagePath ? 'File System' : 'Browser Storage'}</li>
            <li><strong>Backup:</strong> {storagePath ? 'Manuale sul percorso specificato' : 'Automatico nel browser'}</li>
          </ul>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px', maxWidth: '800px' }}>
        <h2>Altre Impostazioni</h2>
        <p style={{ color: '#666' }}>
          Ulteriori impostazioni saranno disponibili nelle prossime versioni.
        </p>
      </div>

      {/* Archive Management Section */}
      <div className="card" style={{ marginTop: '30px', maxWidth: '800px' }}>
        <h2>📁 Gestione Archivio Dati</h2>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Salva Archivio</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Salva tutti i dati dell'applicazione (eventi, sessioni, giri e database pressioni pneumatici) in un file .tpdb
          </p>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="archivePath" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Percorso/Nome File Archivio (opzionale)
            </label>
            <input
              type="text"
              id="archivePath"
              value={archivePath}
              onChange={(e) => setArchivePath(e.target.value)}
              placeholder="es. C:\RacingData\my_archive.tpdb o my_archive.tpdb"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
              Specifica il percorso completo o solo il nome file. Se non specificato, verrà utilizzato "racing_data_archive.tpdb".<br />
              <strong>Nota:</strong> Per limitazioni del browser, il file verrà scaricato nella cartella Download. 
              Per salvare in percorsi personalizzati, utilizzare una desktop app o backend.
            </small>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              onClick={handleSaveArchivePath}
              className="btn btn-secondary"
            >
              💾 Salva Percorso
            </button>
            <button 
              onClick={handleSaveArchive}
              className="btn btn-primary"
            >
              📥 Scarica Archivio
            </button>
          </div>

          <hr style={{ margin: '30px 0' }} />

          <h3>Carica Archivio</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Carica un file .tpdb precedentemente salvato
          </p>
          
          <div style={{ marginBottom: '20px' }}>
            <input
              type="file"
              accept=".tpdb"
              onChange={handleLoadArchive}
              style={{
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
