const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;

// Determine if running in development mode
const isDev = !app.isPackaged;

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

  // Check if icon exists, otherwise use default
  if (!fs.existsSync(iconPath)) {
    iconPath = undefined; // Let Electron use default icon
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    ...(iconPath && { icon: iconPath }),
    title: 'Racing Car Manager'
  });

  // Load the app
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL).catch((err) => {
    console.error('Failed to load URL:', err);
  });

  // Handle load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription} (${errorCode})`);
  });

  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

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
              mainWindow.webContents.send('navigate', '/events');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Impostazioni',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('navigate', '/settings');
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
              mainWindow.webContents.send('navigate', '/');
            }
          }
        },
        {
          label: 'Eventi',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('navigate', '/events');
            }
          }
        },
        {
          label: 'Gestione Pressioni Gomme',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('navigate', '/tire-pressure');
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
              mainWindow.webContents.executeJavaScript(`
                alert('Racing Car Manager v0.1.0\\n\\nSistema di gestione vettura da gara\\n© 2025');
              `);
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startBackend() {
  // Backend path relative to the app
  const backendPath = isDev
    ? path.join(__dirname, '../../backend')
    : path.join(process.resourcesPath, 'backend');

  const backendScript = path.join(backendPath, 'app.py');
  
  // Determine Python command from virtual environment
  let pythonCmd;
  const venvPath = path.join(backendPath, 'venv');
  
  if (process.platform === 'win32') {
    pythonCmd = path.join(venvPath, 'Scripts', 'python.exe');
    // Fallback to system python if venv doesn't exist
    if (!fs.existsSync(pythonCmd)) {
      console.warn('Virtual environment not found, using system python');
      pythonCmd = 'python';
    }
  } else {
    pythonCmd = path.join(venvPath, 'bin', 'python');
    // Fallback to system python3 if venv doesn't exist
    if (!fs.existsSync(pythonCmd)) {
      console.warn('Virtual environment not found, using system python3');
      pythonCmd = 'python3';
    }
  }

  console.log('Starting backend from:', backendPath);
  console.log('Using Python:', pythonCmd);

  // Start the Flask backend
  backendProcess = spawn(pythonCmd, [backendScript], {
    cwd: backendPath,
    env: { ...process.env, FLASK_ENV: 'production' }
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
  
  backendProcess.on('error', (error) => {
    console.error(`Failed to start backend: ${error.message}`);
  });
}

// App lifecycle
app.whenReady().then(() => {
  // Start backend server
  startBackend();

  // Wait a bit for backend to start, then create window
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
