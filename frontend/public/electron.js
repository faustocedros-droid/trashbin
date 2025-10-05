const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

// Determine if running in development mode
const isDev = !app.isPackaged;

function createWindow() {
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
    icon: path.join(__dirname, 'favicon.ico'),
    title: 'Racing Car Manager'
  });

  // Load the app
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

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
  // Determine Python command (python or python3)
  const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
  
  // Backend path relative to the app
  const backendPath = isDev
    ? path.join(__dirname, '../../backend')
    : path.join(process.resourcesPath, 'backend');

  const backendScript = path.join(backendPath, 'app.py');

  console.log('Starting backend from:', backendPath);

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
