import React, { useState, useEffect } from 'react';

function EventFeatures() {
  const STORAGE_KEY = 'eventFeatures_filePaths';
  
  // Define the document types as per requirements
  const documentTypes = [
    'Drivers Manual',
    'Engineers Handbook',
    'Car Manual',
    'BoP',
    'Entry List',
    'Sporting Regulation',
    'Technical Regulations',
    'Tire Management Prescriptions'
  ];

  // State to store file paths for each document type
  const [filePaths, setFilePaths] = useState({});
  const [message, setMessage] = useState('');

  // Load saved file paths from localStorage on component mount
  useEffect(() => {
    const savedPaths = localStorage.getItem(STORAGE_KEY);
    if (savedPaths) {
      try {
        setFilePaths(JSON.parse(savedPaths));
      } catch (error) {
        console.error('Error loading saved file paths:', error);
      }
    }
  }, []);

  // Save file paths to localStorage whenever they change
  const saveFilePaths = (newFilePaths) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilePaths));
    setFilePaths(newFilePaths);
  };

  // Handle file selection
  const handleSelectFile = async (documentType) => {
    // Check if running in Electron environment
    if (window.electron && window.electron.selectFile) {
      try {
        const filePath = await window.electron.selectFile();
        if (filePath) {
          const newFilePaths = { ...filePaths, [documentType]: filePath };
          saveFilePaths(newFilePaths);
          setMessage(`File path saved for ${documentType}`);
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error) {
        console.error('Error selecting file:', error);
        setMessage('Error selecting file. Please try again.');
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      // Fallback for browser mode - show input dialog
      const filePath = prompt(`Enter the file path for ${documentType}:`);
      if (filePath && filePath.trim()) {
        const newFilePaths = { ...filePaths, [documentType]: filePath.trim() };
        saveFilePaths(newFilePaths);
        setMessage(`File path saved for ${documentType}`);
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  // Handle opening file
  const handleOpenFile = async (documentType) => {
    const filePath = filePaths[documentType];
    
    if (!filePath) {
      setMessage(`No file path specified for ${documentType}`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Check if running in Electron environment
    if (window.electron && window.electron.openFile) {
      try {
        const result = await window.electron.openFile(filePath);
        if (result.success) {
          setMessage(`Opening ${documentType}...`);
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(`Error: ${result.error || 'Could not open file'}`);
          setTimeout(() => setMessage(''), 3000);
        }
      } catch (error) {
        console.error('Error opening file:', error);
        setMessage('Error opening file. Please try again.');
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      // Browser mode - just show the path
      setMessage(`File path: ${filePath}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <h1>📁 Event Features</h1>
      
      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Document Management</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Manage event documents and regulations. For each document type, you can specify the file path 
          and open the file with the default application.
        </p>

        {message && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') ? '#721c24' : '#155724',
            border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
            borderRadius: '4px'
          }}>
            {message}
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold'
                }}>
                  Document Type
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold'
                }}>
                  File Path
                </th>
                <th style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderBottom: '2px solid #dee2e6',
                  fontWeight: 'bold'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documentTypes.map((docType, index) => (
                <tr key={docType} style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                }}>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {docType}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    color: filePaths[docType] ? '#333' : '#999',
                    fontSize: '14px',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {filePaths[docType] || 'No file specified'}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid #dee2e6',
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleSelectFile(docType)}
                        className="btn btn-secondary"
                        style={{
                          padding: '8px 16px',
                          fontSize: '14px',
                          minWidth: '120px'
                        }}
                      >
                        📂 Select File
                      </button>
                      <button
                        onClick={() => handleOpenFile(docType)}
                        className="btn btn-primary"
                        disabled={!filePaths[docType]}
                        style={{
                          padding: '8px 16px',
                          fontSize: '14px',
                          minWidth: '120px',
                          opacity: filePaths[docType] ? 1 : 0.5,
                          cursor: filePaths[docType] ? 'pointer' : 'not-allowed'
                        }}
                      >
                        🚀 Open File
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3 style={{ marginTop: 0 }}>ℹ️ Information</h3>
          <ul style={{ lineHeight: '1.8', marginBottom: 0 }}>
            <li><strong>Desktop Mode:</strong> Use the file browser to select files from your system</li>
            <li><strong>Browser Mode:</strong> Manually enter file paths (opening files is only available in desktop mode)</li>
            <li><strong>File Paths:</strong> All paths are stored locally and persist between sessions</li>
            <li><strong>Supported Formats:</strong> Any file format can be specified and opened with its default application</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EventFeatures;
