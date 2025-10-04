/**
 * EventFullDemo.tsx
 * 
 * Componente React dimostrativo che implementa:
 * 1. Gestione completa dei giri (laps) per ogni sessione
 * 2. Modifica dei dati generali della sessione
 * 3. Persistenza locale tramite localStorage
 * 
 * Questo componente è completamente standalone e utilizza localStorage
 * per salvare i dati in modo persistente anche dopo il refresh della pagina.
 */

import React, { useState, useEffect } from 'react';
import { RaceEvent, Session, Lap, SessionFormData, LapFormData } from '../models';
import {
  loadEventFromStorage,
  saveEventToStorage,
  updateSessionInStorage,
  addLapToSession,
  updateLapInSession,
  deleteLapFromSession,
  generateId,
  calculateBestLapTime,
  calculateTotalFuelConsumed,
  calculateLapTimeFromSectors,
  calculateRemainingFuel,
  calculateTheoreticalBestLap,
} from '../eventUtils';

const EventFullDemo: React.FC = () => {
  // State principale: evento corrente con sessioni e giri
  const [event, setEvent] = useState<RaceEvent | null>(null);
  
  // State per la sessione selezionata
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
  // State per il form di modifica sessione
  const [editingSession, setEditingSession] = useState(false);
  const [sessionFormData, setSessionFormData] = useState<SessionFormData>({
    session_type: 'Test',
    session_number: 1,
    duration: 60,
    fuel_start: 0,
    fuel_per_lap: 0,
    tire_set: '',
    session_status: null,
    notes: '',
  });
  
  // State per il form di gestione giri
  const [editingLap, setEditingLap] = useState<Lap | null>(null);
  const [showLapForm, setShowLapForm] = useState(false);
  const [lapFormData, setLapFormData] = useState<LapFormData>({
    lapNumber: 1,
    lapTime: '',
    sector1: '',
    sector2: '',
    sector3: '',
    sector4: '',
    fuelConsumed: 0,
    tireSet: '',
    lapStatus: null,
    notes: '',
  });

  // State per mostrare il dialog del carburante residuo dopo ogni giro
  const [showFuelDialog, setShowFuelDialog] = useState(false);
  const [fuelDialogMessage, setFuelDialogMessage] = useState('');

  /**
   * Effetto iniziale: carica o crea un evento demo dal localStorage
   */
  useEffect(() => {
    initializeDemoEvent();
  }, []);

  /**
   * Inizializza l'evento demo, caricandolo dal localStorage o creandone uno nuovo
   */
  const initializeDemoEvent = () => {
    const demoEventId = 'demo-event-1';
    let demoEvent = loadEventFromStorage(demoEventId);
    
    if (!demoEvent) {
      // Crea un evento demo se non esiste
      demoEvent = {
        id: demoEventId,
        name: 'Demo Event - Test Circuito',
        track: 'Circuito Demo',
        date_start: new Date().toISOString(),
        date_end: new Date().toISOString(),
        weather: 'Soleggiato',
        notes: 'Evento dimostrativo per testare le funzionalità',
        sessions: [
          {
            id: generateId(),
            session_type: 'Test',
            session_number: 1,
            duration: 60,
            fuel_start: 50,
            tire_set: 'Set#1',
            notes: 'Prima sessione di test',
            laps: [],
          },
        ],
      };
      saveEventToStorage(demoEvent);
    }
    
    setEvent(demoEvent);
    if (demoEvent.sessions.length > 0) {
      setSelectedSession(demoEvent.sessions[0]);
    }
  };

  /**
   * Ricarica l'evento dal localStorage per sincronizzare lo state
   */
  const reloadEvent = () => {
    if (event) {
      const updatedEvent = loadEventFromStorage(event.id);
      if (updatedEvent) {
        setEvent(updatedEvent);
        // Aggiorna la sessione selezionata se esiste ancora
        if (selectedSession) {
          const updatedSession = updatedEvent.sessions.find(s => s.id === selectedSession.id);
          setSelectedSession(updatedSession || null);
        }
      }
    }
  };

  /**
   * Handler per la selezione di una sessione
   */
  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setEditingSession(false);
    setShowLapForm(false);
  };

  /**
   * Handler per l'apertura del form di modifica sessione
   */
  const handleEditSession = () => {
    if (!selectedSession) return;
    
    setSessionFormData({
      session_type: selectedSession.session_type,
      session_number: selectedSession.session_number,
      duration: selectedSession.duration || 60,
      fuel_start: selectedSession.fuel_start || 0,
      fuel_per_lap: selectedSession.fuel_per_lap || 0,
      tire_set: selectedSession.tire_set || '',
      session_status: selectedSession.session_status || null,
      notes: selectedSession.notes || '',
    });
    setEditingSession(true);
  };

  /**
   * Handler per il salvataggio delle modifiche alla sessione
   */
  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !selectedSession) return;

    const updatedSession: Session = {
      ...selectedSession,
      ...sessionFormData,
    };

    updateSessionInStorage(event.id, updatedSession);
    reloadEvent();
    setEditingSession(false);
  };

  /**
   * Handler per l'apertura del form di aggiunta giro
   */
  const handleAddLap = () => {
    if (!selectedSession) return;
    
    setLapFormData({
      lapNumber: selectedSession.laps.length + 1,
      lapTime: '',
      sector1: '',
      sector2: '',
      sector3: '',
      sector4: '',
      fuelConsumed: 0,
      tireSet: selectedSession.tire_set || '',
      lapStatus: null,
      notes: '',
    });
    setEditingLap(null);
    setShowLapForm(true);
  };

  /**
   * Handler per l'apertura del form di modifica giro
   */
  const handleEditLap = (lap: Lap) => {
    setLapFormData({
      lapNumber: lap.lapNumber,
      lapTime: lap.lapTime,
      sector1: lap.sector1 || '',
      sector2: lap.sector2 || '',
      sector3: lap.sector3 || '',
      sector4: lap.sector4 || '',
      fuelConsumed: lap.fuelConsumed || 0,
      tireSet: lap.tireSet || '',
      lapStatus: lap.lapStatus || null,
      notes: lap.notes || '',
    });
    setEditingLap(lap);
    setShowLapForm(true);
  };

  /**
   * Handler per il salvataggio di un giro (nuovo o modificato)
   */
  const handleSaveLap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !selectedSession) return;

    // Calcola il tempo totale dalla somma dei settori
    const totalTime = calculateLapTimeFromSectors(
      lapFormData.sector1,
      lapFormData.sector2,
      lapFormData.sector3,
      lapFormData.sector4
    );

    const lapData: Lap = {
      id: editingLap?.id || generateId(),
      lapNumber: lapFormData.lapNumber,
      lapTime: totalTime,
      sector1: lapFormData.sector1,
      sector2: lapFormData.sector2,
      sector3: lapFormData.sector3,
      sector4: lapFormData.sector4,
      fuelConsumed: lapFormData.fuelConsumed,
      tireSet: lapFormData.tireSet,
      lapStatus: lapFormData.lapStatus,
      notes: lapFormData.notes,
    };

    if (editingLap) {
      // Modifica giro esistente
      updateLapInSession(event.id, selectedSession.id, lapData);
    } else {
      // Aggiungi nuovo giro
      addLapToSession(event.id, selectedSession.id, lapData);
      
      // Mostra il dialog del carburante residuo solo per nuovi giri
      if (selectedSession.fuel_start && selectedSession.fuel_per_lap) {
        const remainingFuel = calculateRemainingFuel(
          selectedSession.fuel_start,
          selectedSession.fuel_per_lap,
          selectedSession.laps.length + 1
        );
        setFuelDialogMessage(`Carburante residuo dopo il giro ${lapFormData.lapNumber}: ${remainingFuel.toFixed(2)} L`);
        setShowFuelDialog(true);
      }
    }

    reloadEvent();
    setShowLapForm(false);
    setEditingLap(null);
  };

  /**
   * Handler per l'eliminazione di un giro
   */
  const handleDeleteLap = (lap: Lap) => {
    if (!event || !selectedSession) return;
    if (!window.confirm(`Sei sicuro di voler eliminare il giro ${lap.lapNumber}?`)) return;

    deleteLapFromSession(event.id, selectedSession.id, lap.id);
    reloadEvent();
  };

  /**
   * Handler per l'aggiunta di una nuova sessione
   */
  const handleAddSession = () => {
    if (!event) return;

    const newSession: Session = {
      id: generateId(),
      session_type: 'Test',
      session_number: event.sessions.length + 1,
      duration: 60,
      fuel_start: 0,
      tire_set: '',
      notes: '',
      laps: [],
    };

    const updatedEvent = {
      ...event,
      sessions: [...event.sessions, newSession],
    };

    saveEventToStorage(updatedEvent);
    reloadEvent();
    setSelectedSession(newSession);
  };

  if (!event) {
    return <div className="container"><div className="loading">Caricamento...</div></div>;
  }

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header dell'evento */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h1>{event.name}</h1>
        <p><strong>Circuito:</strong> {event.track}</p>
        <p><strong>Meteo:</strong> {event.weather}</p>
      </div>

      {/* Lista sessioni */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>Sessioni</h2>
          <button className="btn btn-primary" onClick={handleAddSession}>
            + Nuova Sessione
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {event.sessions.map(session => (
            <button
              key={session.id}
              className={`btn ${selectedSession?.id === session.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleSelectSession(session)}
              style={{ minWidth: '120px' }}
            >
              {session.session_type} #{session.session_number}
            </button>
          ))}
        </div>
      </div>

      {/* Dettagli sessione selezionata */}
      {selectedSession && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Dettagli Sessione: {selectedSession.session_type} #{selectedSession.session_number}</h2>
            <button className="btn btn-secondary" onClick={handleEditSession}>
              ✏️ Modifica
            </button>
          </div>

          {editingSession ? (
            /* Form di modifica sessione */
            <form onSubmit={handleSaveSession} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group">
                  <label>Tipo Sessione</label>
                  <select
                    value={sessionFormData.session_type}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, session_type: e.target.value as any })}
                  >
                    <option value="Test">Test</option>
                    <option value="FP1">Free Practice 1</option>
                    <option value="FP2">Free Practice 2</option>
                    <option value="FP3">Free Practice 3</option>
                    <option value="Q">Qualifying</option>
                    <option value="R1">Race 1</option>
                    <option value="R2">Race 2</option>
                    <option value="Endurance">Endurance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Numero Sessione</label>
                  <input
                    type="number"
                    value={sessionFormData.session_number}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, session_number: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Durata (minuti)</label>
                  <input
                    type="number"
                    value={sessionFormData.duration}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, duration: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Carburante Iniziale (litri)</label>
                  <input
                    type="number"
                    value={sessionFormData.fuel_start}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, fuel_start: parseFloat(e.target.value) })}
                    step="0.1"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Consumo Carburante per Giro (litri)</label>
                  <input
                    type="number"
                    value={sessionFormData.fuel_per_lap}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, fuel_per_lap: parseFloat(e.target.value) })}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Set Gomme</label>
                  <input
                    type="text"
                    value={sessionFormData.tire_set}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, tire_set: e.target.value })}
                    placeholder="es. Set#1"
                  />
                </div>

                <div className="form-group">
                  <label>Stato Sessione</label>
                  <select
                    value={sessionFormData.session_status || ''}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, session_status: (e.target.value || null) as any })}
                  >
                    <option value="">Nessuno</option>
                    <option value="RF">RF (Red Flag)</option>
                    <option value="FCY">FCY (Full Course Yellow)</option>
                    <option value="SC">SC (Safety Car)</option>
                    <option value="TFC">TFC (Track Conditions)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Note</label>
                <textarea
                  value={sessionFormData.notes}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, notes: e.target.value })}
                  placeholder="Note sulla sessione..."
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">Salva Modifiche</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingSession(false)}>
                  Annulla
                </button>
              </div>
            </form>
          ) : (
            /* Visualizzazione dati sessione */
            <div>
              {/* Stato Sessione - Widget colorato */}
              {selectedSession.session_status && (
                <div style={{ 
                  marginBottom: '15px',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: 'black',
                  background: 
                    selectedSession.session_status === 'RF' ? 'red' :
                    selectedSession.session_status === 'FCY' ? 'yellow' :
                    selectedSession.session_status === 'SC' ? 'yellow' :
                    selectedSession.session_status === 'TFC' ? 'orange' : 'transparent'
                }}>
                  {selectedSession.session_status}
                  {selectedSession.session_status === 'RF' && ' - Red Flag'}
                  {selectedSession.session_status === 'FCY' && ' - Full Course Yellow'}
                  {selectedSession.session_status === 'SC' && ' - Safety Car'}
                  {selectedSession.session_status === 'TFC' && ' - Track Conditions'}
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <p><strong>Durata:</strong> {selectedSession.duration || '-'} min</p>
                <p><strong>Carburante iniziale:</strong> {selectedSession.fuel_start || '-'} L</p>
                <p><strong>Consumo per giro:</strong> {selectedSession.fuel_per_lap || '-'} L</p>
                <p><strong>Set gomme:</strong> {selectedSession.tire_set || '-'}</p>
                <p><strong>Miglior giro:</strong> {calculateBestLapTime(selectedSession.laps) || '-'}</p>
                <p><strong>Carburante consumato:</strong> {calculateTotalFuelConsumed(selectedSession.laps).toFixed(2)} L</p>
                <p><strong>Numero giri:</strong> {selectedSession.laps.length}</p>
                {selectedSession.notes && (
                  <p style={{ gridColumn: '1 / -1' }}><strong>Note:</strong> {selectedSession.notes}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabella giri */}
      {selectedSession && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Giri (Laps)</h2>
            <button className="btn btn-primary" onClick={handleAddLap}>
              + Aggiungi Giro
            </button>
          </div>

          {/* Informazioni sopra la lista giri */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            {/* Carburante Residuo */}
            {selectedSession.fuel_start !== undefined && selectedSession.fuel_per_lap !== undefined && selectedSession.fuel_per_lap > 0 && (
              <div style={{ 
                padding: '15px',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                background: (() => {
                  const remaining = calculateRemainingFuel(
                    selectedSession.fuel_start,
                    selectedSession.fuel_per_lap,
                    selectedSession.laps.length
                  );
                  return remaining < 15 ? 'orange' : '#e3f2fd';
                })(),
                color: (() => {
                  const remaining = calculateRemainingFuel(
                    selectedSession.fuel_start,
                    selectedSession.fuel_per_lap,
                    selectedSession.laps.length
                  );
                  return remaining < 15 ? 'white' : '#333';
                })()
              }}>
                <div style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>
                  Carburante Residuo
                </div>
                <div>
                  {calculateRemainingFuel(
                    selectedSession.fuel_start,
                    selectedSession.fuel_per_lap,
                    selectedSession.laps.length
                  ).toFixed(2)} L
                </div>
              </div>
            )}

            {/* Miglior Tempo Teorico */}
            {selectedSession.laps.length > 0 && calculateTheoreticalBestLap(selectedSession.laps) && (
              <div style={{ 
                padding: '15px',
                borderRadius: '6px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
                background: '#e8f5e9',
                color: '#333'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '5px' }}>
                  Miglior Tempo Teorico
                </div>
                <div style={{ color: '#2e7d32' }}>
                  {calculateTheoreticalBestLap(selectedSession.laps)}
                </div>
              </div>
            )}
          </div>

          {/* Form aggiunta/modifica giro */}
          {showLapForm && (
            <form onSubmit={handleSaveLap} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>{editingLap ? 'Modifica Giro' : 'Nuovo Giro'}</h3>
              
              {/* Riga 1: Numero giro */}
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label>Numero Giro</label>
                <input
                  type="number"
                  value={lapFormData.lapNumber}
                  onChange={(e) => setLapFormData({ ...lapFormData, lapNumber: parseInt(e.target.value) })}
                  min="1"
                  required
                  style={{ maxWidth: '150px' }}
                />
              </div>

              {/* Riga 2: Intertempi (Settori) disposti orizzontalmente */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#333' }}>
                  Intertempi Settori (secondi.millisecondi)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr) auto', gap: '10px', alignItems: 'end' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Settore 1</label>
                    <input
                      type="text"
                      value={lapFormData.sector1}
                      onChange={(e) => setLapFormData({ ...lapFormData, sector1: e.target.value })}
                      placeholder="25.123"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Settore 2</label>
                    <input
                      type="text"
                      value={lapFormData.sector2}
                      onChange={(e) => setLapFormData({ ...lapFormData, sector2: e.target.value })}
                      placeholder="28.456"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Settore 3</label>
                    <input
                      type="text"
                      value={lapFormData.sector3}
                      onChange={(e) => setLapFormData({ ...lapFormData, sector3: e.target.value })}
                      placeholder="30.789"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '13px', color: '#666' }}>Settore 4</label>
                    <input
                      type="text"
                      value={lapFormData.sector4}
                      onChange={(e) => setLapFormData({ ...lapFormData, sector4: e.target.value })}
                      placeholder="22.012"
                      required
                    />
                  </div>

                  {/* Tempo Totale calcolato */}
                  <div style={{ 
                    padding: '8px 15px', 
                    background: '#1976d2', 
                    color: 'white', 
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    minWidth: '120px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 'normal', marginBottom: '2px' }}>Tempo Totale</div>
                    <div>{calculateLapTimeFromSectors(
                      lapFormData.sector1,
                      lapFormData.sector2,
                      lapFormData.sector3,
                      lapFormData.sector4
                    ) || '--:--.---'}</div>
                  </div>
                </div>
              </div>

              {/* Riga 3: Altri campi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="form-group">
                  <label>Carburante Consumato (L)</label>
                  <input
                    type="number"
                    value={lapFormData.fuelConsumed}
                    onChange={(e) => setLapFormData({ ...lapFormData, fuelConsumed: parseFloat(e.target.value) })}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Set Gomme</label>
                  <input
                    type="text"
                    value={lapFormData.tireSet}
                    onChange={(e) => setLapFormData({ ...lapFormData, tireSet: e.target.value })}
                    placeholder="Set#1"
                  />
                </div>

                <div className="form-group">
                  <label>Stato Giro</label>
                  <select
                    value={lapFormData.lapStatus || ''}
                    onChange={(e) => setLapFormData({ ...lapFormData, lapStatus: (e.target.value || null) as any })}
                  >
                    <option value="">Normale</option>
                    <option value="RF">RF (Red Flag)</option>
                    <option value="FCY">FCY (Full Course Yellow)</option>
                    <option value="SC">SC (Safety Car)</option>
                    <option value="TFC">TFC (Track Conditions)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Note</label>
                <textarea
                  value={lapFormData.notes}
                  onChange={(e) => setLapFormData({ ...lapFormData, notes: e.target.value })}
                  placeholder="Note sul giro..."
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  {editingLap ? 'Salva Modifiche' : 'Aggiungi Giro'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowLapForm(false)}>
                  Annulla
                </button>
              </div>
            </form>
          )}

          {/* Tabella dei giri */}
          {selectedSession.laps.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
              Nessun giro registrato. Aggiungi il tuo primo giro!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Giro</th>
                    <th>Stato</th>
                    <th>Tempo Totale</th>
                    <th>Settore 1</th>
                    <th>Settore 2</th>
                    <th>Settore 3</th>
                    <th>Settore 4</th>
                    <th>Carburante (L)</th>
                    <th>Set Gomme</th>
                    <th>Note</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSession.laps
                    .sort((a, b) => a.lapNumber - b.lapNumber)
                    .map(lap => (
                      <tr key={lap.id}>
                        <td>{lap.lapNumber}</td>
                        <td>
                          {lap.lapStatus ? (
                            <div style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              color: 'black',
                              background: 
                                lap.lapStatus === 'RF' ? 'red' :
                                lap.lapStatus === 'FCY' ? 'yellow' :
                                lap.lapStatus === 'SC' ? 'yellow' :
                                lap.lapStatus === 'TFC' ? 'orange' : 'transparent'
                            }}>
                              {lap.lapStatus}
                            </div>
                          ) : '-'}
                        </td>
                        <td><strong style={{ color: '#1976d2' }}>{lap.lapTime}</strong></td>
                        <td>{lap.sector1 || '-'}</td>
                        <td>{lap.sector2 || '-'}</td>
                        <td>{lap.sector3 || '-'}</td>
                        <td>{lap.sector4 || '-'}</td>
                        <td>{lap.fuelConsumed?.toFixed(2) || '-'}</td>
                        <td>{lap.tireSet || '-'}</td>
                        <td>{lap.notes || '-'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              className="btn btn-secondary"
                              onClick={() => handleEditLap(lap)}
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteLap(lap)}
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Info localStorage */}
      <div style={{ marginTop: '30px', padding: '15px', background: '#e3f2fd', borderRadius: '8px', fontSize: '14px' }}>
        <p><strong>ℹ️ Persistenza Dati:</strong> Tutti i dati sono salvati automaticamente nel localStorage del browser. 
        I dati rimangono disponibili anche dopo il refresh della pagina.</p>
      </div>

      {/* Dialog Carburante Residuo */}
      {showFuelDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#1976d2' }}>✓ Giro Completato</h3>
            <p style={{ fontSize: '16px', marginBottom: '25px' }}>{fuelDialogMessage}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowFuelDialog(false)}
              style={{ minWidth: '120px' }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFullDemo;
