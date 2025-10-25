import React, { useState } from 'react';

function Settings() {
  const [message, setMessage] = useState('');
  const [filename, setFilename] = useState('');

  const handleSaveAllData = () => {
    // Get ALL data from localStorage - all sections and subsections
    const eventsData = localStorage.getItem('racingCarManager_events');
    const tirePressureData = localStorage.getItem('tirePressureDatabase');
    const tirePressureSetup = localStorage.getItem('tirePressureSetup');
    const tirePressureSetsManagement = localStorage.getItem('tirePressureSetsManagement');
    const tirePressureSessionTable = localStorage.getItem('tirePressureSessionTable');
    const runPlanData = localStorage.getItem('runPlanSheet_data');
    const runPlanHistory = localStorage.getItem('runPlanSheet_history');
    const trackLength = localStorage.getItem('currentTrackLength');
    const eventSchedule = localStorage.getItem('eventSchedule');
    const circuitImage = localStorage.getItem('generalInfo_circuitImage');
    const generalSchedule = localStorage.getItem('generalInfo_schedule');
    const setupData = localStorage.getItem('generalInfo_setup');
    const fuelConsumption = localStorage.getItem('fuelConsumption_data');
    const eventFeaturesPaths = localStorage.getItem('eventFeatures_filePaths');
    const storagePath = localStorage.getItem('racingCarManager_storagePath');
    const archivePath = localStorage.getItem('racingCarManager_archivePath');
    
    // Create a comprehensive archive object with ALL application data
    const archiveData = {
      version: '2.0', // Updated version for complete data export
      exportDate: new Date().toISOString(),
      
      // Events section
      events: eventsData ? JSON.parse(eventsData) : [],
      
      // Event Features section
      eventFeatures: eventFeaturesPaths ? JSON.parse(eventFeaturesPaths) : null,
      
      // General Information section
      generalInformation: {
        circuitImage: circuitImage || null,
        schedule: generalSchedule ? JSON.parse(generalSchedule) : null
      },
      
      // Setup section
      setup: setupData ? JSON.parse(setupData) : null,
      
      // RunPlan Sheets section and subsections
      runPlan: {
        currentSheet: runPlanData ? JSON.parse(runPlanData) : null,
        history: runPlanHistory ? JSON.parse(runPlanHistory) : []
      },
      
      // Tire Pressure Management section and all subsections
      tirePressure: {
        database: tirePressureData ? JSON.parse(tirePressureData) : null,
        setup: tirePressureSetup ? JSON.parse(tirePressureSetup) : null,
        setsManagement: tirePressureSetsManagement ? JSON.parse(tirePressureSetsManagement) : null,
        sessionTable: tirePressureSessionTable ? JSON.parse(tirePressureSessionTable) : null
      },
      
      // Fuel Consumption section
      fuelConsumption: fuelConsumption ? JSON.parse(fuelConsumption) : null,
      
      // Schedule/Event schedule
      eventSchedule: eventSchedule ? JSON.parse(eventSchedule) : null,
      
      // Track configuration
      trackConfiguration: {
        currentTrackLength: trackLength ? parseFloat(trackLength) : null
      },
      
      // Settings
      settings: {
        storagePath: storagePath || null,
        archivePath: archivePath || null
      }
    };
    
    // Check if there's any data to save
    const hasData = eventsData || tirePressureData || tirePressureSetup || tirePressureSetsManagement || 
                     tirePressureSessionTable || runPlanData || runPlanHistory || 
                     eventSchedule || circuitImage || generalSchedule || setupData || 
                     fuelConsumption || eventFeaturesPaths;
    
    if (!hasData) {
      setMessage('⚠️ Nessun dato da salvare! Aggiungi contenuti nelle diverse sezioni prima di salvare.');
      setTimeout(() => setMessage(''), 4000);
      return;
    }

    // Create a blob with the comprehensive data
    const blob = new Blob([JSON.stringify(archiveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    
    // Use custom filename or default
    const defaultFilename = `racing_data_complete_${new Date().toISOString().split('T')[0]}.rcmd`;
    link.download = filename ? (filename.endsWith('.rcmd') ? filename : filename + '.rcmd') : defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage('✅ Tutti i dati sono stati salvati con successo! Il file è stato scaricato.');
    setTimeout(() => setMessage(''), 4000);
  };

  const handleLoadAllData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const archiveData = JSON.parse(data);
        
        // Check version and restore all data
        if (archiveData.version === '2.0') {
          // New complete format - restore ALL application data
          
          // Events section
          if (archiveData.events) {
            localStorage.setItem('racingCarManager_events', JSON.stringify(archiveData.events));
          }
          
          // Event Features section
          if (archiveData.eventFeatures) {
            localStorage.setItem('eventFeatures_filePaths', JSON.stringify(archiveData.eventFeatures));
          }
          
          // General Information section
          if (archiveData.generalInformation) {
            if (archiveData.generalInformation.circuitImage) {
              localStorage.setItem('generalInfo_circuitImage', archiveData.generalInformation.circuitImage);
            }
            if (archiveData.generalInformation.schedule) {
              localStorage.setItem('generalInfo_schedule', JSON.stringify(archiveData.generalInformation.schedule));
            }
          }
          
          // Setup section
          if (archiveData.setup) {
            localStorage.setItem('generalInfo_setup', JSON.stringify(archiveData.setup));
          }
          
          // RunPlan section
          if (archiveData.runPlan) {
            if (archiveData.runPlan.currentSheet) {
              localStorage.setItem('runPlanSheet_data', JSON.stringify(archiveData.runPlan.currentSheet));
            }
            if (archiveData.runPlan.history) {
              localStorage.setItem('runPlanSheet_history', JSON.stringify(archiveData.runPlan.history));
            }
          }
          
          // Tire Pressure section
          if (archiveData.tirePressure) {
            if (archiveData.tirePressure.database) {
              localStorage.setItem('tirePressureDatabase', JSON.stringify(archiveData.tirePressure.database));
            }
            if (archiveData.tirePressure.setup) {
              localStorage.setItem('tirePressureSetup', JSON.stringify(archiveData.tirePressure.setup));
            }
            if (archiveData.tirePressure.setsManagement) {
              localStorage.setItem('tirePressureSetsManagement', JSON.stringify(archiveData.tirePressure.setsManagement));
            }
            if (archiveData.tirePressure.sessionTable) {
              localStorage.setItem('tirePressureSessionTable', JSON.stringify(archiveData.tirePressure.sessionTable));
            }
          }
          
          // Fuel Consumption section
          if (archiveData.fuelConsumption) {
            localStorage.setItem('fuelConsumption_data', JSON.stringify(archiveData.fuelConsumption));
          }
          
          // Event Schedule
          if (archiveData.eventSchedule) {
            localStorage.setItem('eventSchedule', JSON.stringify(archiveData.eventSchedule));
          }
          
          // Track Configuration
          if (archiveData.trackConfiguration && archiveData.trackConfiguration.currentTrackLength !== null) {
            localStorage.setItem('currentTrackLength', archiveData.trackConfiguration.currentTrackLength.toString());
          }
          
          // Settings
          if (archiveData.settings) {
            if (archiveData.settings.storagePath) {
              localStorage.setItem('racingCarManager_storagePath', archiveData.settings.storagePath);
            }
            if (archiveData.settings.archivePath) {
              localStorage.setItem('racingCarManager_archivePath', archiveData.settings.archivePath);
            }
          }
          
          // Count restored items
          let itemsRestored = 0;
          if (archiveData.events && archiveData.events.length > 0) itemsRestored++;
          if (archiveData.eventFeatures) itemsRestored++;
          if (archiveData.generalInformation) itemsRestored++;
          if (archiveData.setup) itemsRestored++;
          if (archiveData.runPlan) itemsRestored++;
          if (archiveData.tirePressure) itemsRestored++;
          if (archiveData.fuelConsumption) itemsRestored++;
          if (archiveData.eventSchedule) itemsRestored++;
          
          setMessage(`✅ Tutti i dati sono stati caricati con successo! ${itemsRestored} sezioni ripristinate. La pagina verrà ricaricata.`);
        } else if (archiveData.version === '1.1' || archiveData.version === '1.0') {
          // Old format - restore partial data
          if (archiveData.events) {
            localStorage.setItem('racingCarManager_events', JSON.stringify(archiveData.events));
          }
          if (archiveData.tirePressureDatabase) {
            localStorage.setItem('tirePressureDatabase', JSON.stringify(archiveData.tirePressureDatabase));
          }
          if (archiveData.runPlanSheet) {
            localStorage.setItem('runPlanSheet_data', JSON.stringify(archiveData.runPlanSheet));
          }
          if (archiveData.runPlanHistory) {
            localStorage.setItem('runPlanSheet_history', JSON.stringify(archiveData.runPlanHistory));
          }
          if (archiveData.currentTrackLength !== null && archiveData.currentTrackLength !== undefined) {
            localStorage.setItem('currentTrackLength', archiveData.currentTrackLength.toString());
          }
          
          setMessage('✅ Dati caricati (formato precedente - dati parziali). La pagina verrà ricaricata.');
        } else {
          // Unknown or very old format
          setMessage('⚠️ Formato file non riconosciuto. Assicurati di utilizzare un file .rcmd valido.');
          setTimeout(() => setMessage(''), 4000);
          return;
        }
        
        setTimeout(() => setMessage(''), 5000);
        
        // Reload the page to reflect the restored data
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        console.error('Error loading archive:', error);
        setMessage('❌ Errore nel caricamento del file! Assicurati che sia un file valido.');
        setTimeout(() => setMessage(''), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>⚙️ Impostazioni</h1>
      
      <div className="card" style={{ marginTop: '30px', maxWidth: '900px' }}>
        <h2>💾 Salva Tutti i Contenuti dell'Applicazione</h2>
        
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
            Salva <strong>TUTTI</strong> i contenuti di <strong>TUTTE</strong> le sezioni e sottosezioni del menu hamburger in un unico file:
          </p>
          
          <ul style={{ color: '#666', lineHeight: '1.8', marginBottom: '25px' }}>
            <li><strong>📅 Eventi:</strong> Tutti gli eventi e le sessioni</li>
            <li><strong>🎯 Event Features:</strong> Percorsi dei file caricati</li>
            <li><strong>ℹ️ General Information:</strong> Immagine del circuito e programma</li>
            <li><strong>🔧 Setup:</strong> Dati di setup della vettura</li>
            <li><strong>📋 RunPlan Sheets:</strong> Piano di lavoro corrente e storico</li>
            <li><strong>🏁 Tire Pressure Management:</strong> Database completo pressioni gomme (tutte le sottosezioni)</li>
            <li><strong>⛽ Fuel Consumption:</strong> Dati di consumo carburante</li>
            <li><strong>📊 Event Schedule:</strong> Programma delle sessioni</li>
            <li><strong>🛣️ Track Configuration:</strong> Lunghezza del tracciato</li>
          </ul>
          
          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label htmlFor="filename" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Nome File (opzionale)
            </label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="es. mio_evento.rcmd (estensione .rcmd verrà aggiunta automaticamente)"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
              Se non specificato, verrà generato automaticamente: <code>racing_data_complete_YYYY-MM-DD.rcmd</code>
            </small>
          </div>

          {message && (
            <div style={{
              padding: '15px',
              marginBottom: '25px',
              backgroundColor: message.includes('❌') || message.includes('⚠️') ? '#f8d7da' : '#d4edda',
              color: message.includes('❌') || message.includes('⚠️') ? '#721c24' : '#155724',
              border: `1px solid ${message.includes('❌') || message.includes('⚠️') ? '#f5c6cb' : '#c3e6cb'}`,
              borderRadius: '4px',
              fontSize: '15px'
            }}>
              {message}
            </div>
          )}

          <button 
            onClick={handleSaveAllData}
            className="btn btn-primary"
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            💾 Salva Tutti i Dati
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px', maxWidth: '900px' }}>
        <h2>📂 Carica Tutti i Contenuti dell'Applicazione</h2>
        
        <div style={{ marginTop: '20px' }}>
          <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6' }}>
            Carica un file precedentemente salvato per ripristinare <strong>TUTTI</strong> i contenuti di <strong>TUTTE</strong> le sezioni e sottosezioni.
          </p>
          
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, color: '#856404' }}>
              <strong>⚠️ Attenzione:</strong> Il caricamento di un file sostituirà tutti i dati attualmente presenti nell'applicazione. 
              Assicurati di aver salvato i dati correnti prima di procedere.
            </p>
          </div>
          
          <input
            type="file"
            accept=".rcmd,.tpdb"
            onChange={handleLoadAllData}
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
          
          <small style={{ display: 'block', marginTop: '12px', color: '#666' }}>
            Formati supportati: <code>.rcmd</code> (completo v2.0), <code>.tpdb</code> (parziale v1.x)
          </small>
        </div>
      </div>

      <div className="card" style={{ marginTop: '30px', maxWidth: '900px', backgroundColor: '#f8f9fa' }}>
        <h2>ℹ️ Informazioni sul Salvataggio</h2>
        
        <div style={{ lineHeight: '1.8' }}>
          <p><strong>Formato File:</strong> I dati vengono salvati in formato JSON con estensione <code>.rcmd</code> (Racing Car Manager Data)</p>
          
          <p><strong>Posizione:</strong> Il file viene scaricato nella cartella Download del browser</p>
          
          <p><strong>Backup Consigliati:</strong></p>
          <ul>
            <li>Salva i dati regolarmente durante le sessioni di lavoro</li>
            <li>Crea backup prima di eventi importanti</li>
            <li>Mantieni copie di sicurezza in più posizioni</li>
            <li>Utilizza nomi file descrittivi (es. <code>imola_2025_setup.rcmd</code>)</li>
          </ul>
          
          <p><strong>Compatibilità:</strong></p>
          <ul>
            <li><code>.rcmd v2.0</code> - Formato completo con tutti i dati (versione corrente)</li>
            <li><code>.tpdb v1.x</code> - Formato parziale legacy (compatibile in lettura)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Settings;
