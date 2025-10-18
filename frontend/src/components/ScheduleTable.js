import React, { useState, useEffect } from 'react';

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

  const [notifications, setNotifications] = useState([]);
  const [checkedTimes, setCheckedTimes] = useState(new Set());

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('eventSchedule', JSON.stringify(scheduleData));
  }, [scheduleData]);

  // Check for upcoming times and show notifications
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      scheduleData.times.forEach((time, index) => {
        if (!time) return;

        // Parse the time (format: HH:MM)
        const timeParts = time.split(':');
        if (timeParts.length !== 2) return;

        const scheduleHours = parseInt(timeParts[0], 10);
        const scheduleMinutes = parseInt(timeParts[1], 10);
        
        if (isNaN(scheduleHours) || isNaN(scheduleMinutes)) return;

        const scheduleTimeInMinutes = scheduleHours * 60 + scheduleMinutes;
        const diffMinutes = scheduleTimeInMinutes - currentMinutes;

        // Create unique keys for 10-minute and 5-minute warnings
        const key10 = `${time}-${index}-10`;
        const key5 = `${time}-${index}-5`;

        // Check for 10-minute warning
        if (diffMinutes <= 10 && diffMinutes > 9 && !checkedTimes.has(key10)) {
          setNotifications(prev => [...prev, {
            id: Date.now() + Math.random(),
            message: `⚠️ Attenzione: Mancano 10 minuti alla sessione "${scheduleData.sessions[index] || 'Senza nome'}" alle ore ${time}`,
            time: time,
            session: scheduleData.sessions[index]
          }]);
          setCheckedTimes(prev => new Set([...prev, key10]));
        }

        // Check for 5-minute warning
        if (diffMinutes <= 5 && diffMinutes > 4 && !checkedTimes.has(key5)) {
          setNotifications(prev => [...prev, {
            id: Date.now() + Math.random(),
            message: `⚠️ AVVISO URGENTE: Mancano 5 minuti alla sessione "${scheduleData.sessions[index] || 'Senza nome'}" alle ore ${time}`,
            time: time,
            session: scheduleData.sessions[index]
          }]);
          setCheckedTimes(prev => new Set([...prev, key5]));
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [scheduleData, checkedTimes]);

  const handleSessionChange = (index, value) => {
    setScheduleData(prev => ({
      ...prev,
      sessions: prev.sessions.map((s, i) => i === index ? value : s)
    }));
  };

  const handleTimeChange = (index, value) => {
    setScheduleData(prev => ({
      ...prev,
      times: prev.times.map((t, i) => i === index ? value : t)
    }));
    
    // Reset checked times for this specific time slot when it's modified
    setCheckedTimes(prev => {
      const newSet = new Set(prev);
      const oldTime = scheduleData.times[index];
      newSet.delete(`${oldTime}-${index}-10`);
      newSet.delete(`${oldTime}-${index}-5`);
      return newSet;
    });
  };

  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div>
      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          maxWidth: '400px'
        }}>
          {notifications.map(notification => (
            <div
              key={notification.id}
              style={{
                backgroundColor: '#ff9800',
                color: 'white',
                padding: '15px 20px',
                borderRadius: '8px',
                marginBottom: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                position: 'relative',
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <button
                onClick={() => closeNotification(notification.id)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '0 5px',
                  lineHeight: '1'
                }}
              >
                ×
              </button>
              <div style={{ marginRight: '25px', fontWeight: 'bold' }}>
                {notification.message}
              </div>
            </div>
          ))}
        </div>
      )}

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

      {/* Add CSS animation */}
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}

export default ScheduleTable;
