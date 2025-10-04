import React, { useState, useEffect } from 'react';

function Settings() {
  const STORAGE_PATH_KEY = 'racingCarManager_storagePath';
  const [storagePath, setStoragePath] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Carica il percorso salvato
    const savedPath = localStorage.getItem(STORAGE_PATH_KEY);
    if (savedPath) {
      setStoragePath(savedPath);
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
    </div>
  );
}

export default Settings;
