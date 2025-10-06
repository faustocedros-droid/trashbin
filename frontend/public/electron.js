/**
 * Racing Car Manager - Electron Main Process
 * Clean rebuild from scratch - simplified and robust
 */

const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

let mainWindow = null;
let backendProcess = null;
const isDev = !app.isPackaged;

// Configuration
const BACKEND_PORT = 5000;
const FRONTEND_PORT = 3000;
const BACKEND_STARTUP_TIMEOUT = 15000; // 15 seconds
const BACKEND_CHECK_INTERVAL = 500; // Check every 500ms

/**
 * Check if backend is ready by attempting to connect
 */
function checkBackendReady() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${BACKEND_PORT}/api/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Wait for backend to be ready
 */
async function waitForBackend() {
  const startTime = Date.now();
  
  while (Date.now() - startTime < BACKEND_STARTUP_TIMEOUT) {
    const isReady = await checkBackendReady();
    if (isReady) {
      console.log('✓ Backend is ready');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, BACKEND_CHECK_INTERVAL));
  }
  
  console.error('✗ Backend failed to start within timeout');
  return false;
}

/**
 * Start the Flask backend server
 */
function startBackend() {
  return new Promise((resolve, reject) => {
    // Determine Python command
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    
    // Determine backend path
    const backendPath = isDev
      ? path.join(__dirname, '../../backend')
      : path.join(process.resourcesPath, 'backend');

    const backendScript = path.join(backendPath, 'app.py');

    // Verify backend script exists
    if (!fs.existsSync(backendScript)) {
      reject(new Error(`Backend script not found at: ${backendScript}`));
      return;
    }

    console.log('Starting Flask backend...');
    console.log('Backend path:', backendPath);
    console.log('Python command:', pythonCmd);

    // Start the Flask backend
    backendProcess = spawn(pythonCmd, [backendScript], {
      cwd: backendPath,
      env: { 
        ...process.env, 
        FLASK_ENV: 'production',
        PYTHONUNBUFFERED: '1'
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      console.log(`[Backend] ${output}`);
    });

    backendProcess.stderr.on('data', (data) => {
      const output = data.toString().trim();
      // Flask logs to stderr by default, so don't treat as error unless it contains error keywords
      if (output.toLowerCase().includes('error') || output.toLowerCase().includes('exception')) {
        console.error(`[Backend Error] ${output}`);
      } else {
        console.log(`[Backend] ${output}`);
      }
    });

    backendProcess.on('error', (error) => {
      console.error('Failed to start backend:', error);
      reject(error);
    });

    backendProcess.on('exit', (code, signal) => {
      console.log(`Backend process exited with code ${code}, signal ${signal}`);
      backendProcess = null;
    });

    // Give process a moment to start, then resolve
    setTimeout(() => resolve(), 1000);
  });
}

/**
 * Create the main application window
 */
function createWindow() {
  // Set icon based on platform
  let iconPath;
  if (process.platform === 'win32') {
    iconPath = path.join(__dirname, 'icon.ico');
  } else if (process.platform === 'darwin') {
    iconPath = path.join(__dirname, 'icon.icns');
  } else {
    iconPath = path.join(__dirname, 'icon.png');
  }

  // Use icon only if it exists
  if (!fs.existsSync(iconPath)) {
    iconPath = undefined;
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    show: false, // Don't show until ready
    backgroundColor: '#f5f5f5',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    ...(iconPath && { icon: iconPath }),
    title: 'Racing Car Manager'
  });

  // Determine which URL to load
  const startURL = isDev
    ? `http://localhost:${FRONTEND_PORT}`
    : `file://${path.join(__dirname, '../build/index.html')}`;

  console.log('Loading URL:', startURL);

  // Load the application
  mainWindow.loadURL(startURL);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle failed loads
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Handle external links - open in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Cleanup on close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

/**
 * Create application menu
 */
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Nuovo Evento',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                window.location.hash = '/events';
              `);
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Impostazioni',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                window.location.hash = '/settings';
              `);
            }
          }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Esci' }
      ]
    },
    {
      label: 'Modifica',
      submenu: [
        { role: 'undo', label: 'Annulla' },
        { role: 'redo', label: 'Ripeti' },
        { type: 'separator' },
        { role: 'cut', label: 'Taglia' },
        { role: 'copy', label: 'Copia' },
        { role: 'paste', label: 'Incolla' },
        { role: 'selectAll', label: 'Seleziona Tutto' }
      ]
    },
    {
      label: 'Visualizza',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                window.location.hash = '/';
              `);
            }
          }
        },
        {
          label: 'Eventi',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                window.location.hash = '/events';
              `);
            }
          }
        },
        {
          label: 'Gestione Pressioni Gomme',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.executeJavaScript(`
                window.location.hash = '/tire-pressure';
              `);
            }
          }
        },
        { type: 'separator' },
        { role: 'reload', label: 'Ricarica' },
        { role: 'forceReload', label: 'Ricarica Forzata' },
        { role: 'toggleDevTools', label: 'Strumenti Sviluppatore' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normale' },
        { role: 'zoomIn', label: 'Zoom Avanti' },
        { role: 'zoomOut', label: 'Zoom Indietro' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Schermo Intero' }
      ]
    },
    {
      label: 'Finestra',
      submenu: [
        { role: 'minimize', label: 'Minimizza' },
        { role: 'close', label: 'Chiudi' }
      ]
    },
    {
      label: 'Aiuto',
      submenu: [
        {
          label: 'Informazioni',
          click: () => {
            if (mainWindow) {
              dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Informazioni',
                message: 'Racing Car Manager',
                detail: 'Versione 0.1.0\n\nSistema di gestione vettura da gara\n© 2025',
                buttons: ['OK']
              });
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Cleanup function to kill backend process
 */
function cleanupBackend() {
  if (backendProcess) {
    console.log('Stopping backend process...');
    backendProcess.kill('SIGTERM');
    
    // Force kill after 2 seconds if still running
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        console.log('Force killing backend process...');
        backendProcess.kill('SIGKILL');
      }
    }, 2000);
    
    backendProcess = null;
  }
}

/**
 * Main application initialization
 */
async function initializeApp() {
  try {
    // Start backend
    await startBackend();
    
    // Wait for backend to be ready
    const backendReady = await waitForBackend();
    
    if (!backendReady) {
      const choice = await dialog.showMessageBox({
        type: 'error',
        title: 'Backend Error',
        message: 'Il backend Flask non si è avviato correttamente.',
        detail: 'Verifica che Python sia installato e che le dipendenze siano state installate.',
        buttons: ['Esci', 'Continua Comunque'],
        defaultId: 0
      });
      
      if (choice.response === 0) {
        app.quit();
        return;
      }
    }
    
    // Create window
    createWindow();
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    await dialog.showMessageBox({
      type: 'error',
      title: 'Errore di Avvio',
      message: 'Impossibile avviare l\'applicazione',
      detail: error.message,
      buttons: ['OK']
    });
    
    app.quit();
  }
}

// App lifecycle events
app.whenReady().then(() => {
  initializeApp();
  
  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  cleanupBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', (event) => {
  cleanupBackend();
});

app.on('quit', () => {
  cleanupBackend();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  dialog.showErrorBox('Errore Critico', `Si è verificato un errore imprevisto:\n\n${error.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
