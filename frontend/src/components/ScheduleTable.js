import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';

function ScheduleTable() {
  const [scheduleData, setScheduleData] = useState(() => {
    // Load from localStorage or initialize with empty data
    const saved = localStorage.getItem('eventSchedule');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      sessions: Array(10).fill(''),
      times: Array(10).fill('')
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('eventSchedule', JSON.stringify(scheduleData));
    
    // Trigger storage event manually for same-window updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'eventSchedule',
      newValue: JSON.stringify(scheduleData)
    }));
  }, [scheduleData]);

  const handleSessionChange = (index, value) => {
    setScheduleData(prev => ({
      ...prev,
      sessions: prev.sessions.map((s, i) => i === index ? value : s)
    }));
  };

  const handleTimeChange = (index, value) => {
    const oldTime = scheduleData.times[index];
    
    setScheduleData(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? value : t)
    }));
    
    // Reset checked times for this specific time slot when it's modified
    if (oldTime !== value) {
      notificationService.resetTimeSlot(oldTime, index);
    }
  };

  return (
    <div>
      {/* Schedule Table */}
      <div style={{
        overflowX: 'auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1976d2' }}>
          Programma Sessioni
        </h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '800px'
        }}>
          <tbody>
            <tr>
              <td style={{
                fontWeight: 'bold',
                padding: '10px',
                backgroundColor: '#e3f2fd',
                border: '1px solid #ddd',
                width: '120px'
              }}>
                Sessione
              </td>
              {scheduleData.sessions.map((session, index) => (
                <td key={`session-${index}`} style={{
                  padding: '5px',
                  border: '1px solid #ddd'
                }}>
                  <input
                    type="text"
                    value={session}
                    onChange={(e) => handleSessionChange(index, e.target.value)}
                    placeholder={`Sessione ${index + 1}`}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td style={{
                fontWeight: 'bold',
                padding: '10px',
                backgroundColor: '#e3f2fd',
                border: '1px solid #ddd',
                width: '120px'
              }}>
                Orario
              </td>
              {scheduleData.times.map((time, index) => (
                <td key={`time-${index}`} style={{
                  padding: '5px',
                  border: '1px solid #ddd'
                }}>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div style={{
          marginTop: '15px',
          fontSize: '12px',
          color: '#666',
          fontStyle: 'italic'
        }}>
          💡 Suggerimento: Inserisci gli orari delle sessioni. Riceverai notifiche a 10 e 5 minuti prima di ogni orario programmato.
        </div>
      </div>
    </div>
  );
}

export default ScheduleTable;
