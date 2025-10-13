const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// Use environment variable to determine mode, fallback to checking if running from dev server
const isDev = process.env.ELECTRON_MODE === 'dev';

let mainWindow;
let backendProcess;

// Auto-start backend server
function startBackend() {
  const backendPath = path.join(__dirname, '..', '..', 'backend');
  const venvPath = path.join(backendPath, 'venv');
  const fs = require('fs');
  
  console.log('Starting Flask backend from:', backendPath);
  
  // Check if venv exists
  if (!fs.existsSync(venvPath)) {
    console.error('❌ Virtual environment not found!');
    console.error('Please run the appropriate start script first:');
    console.error('  Windows: start-desktop.bat or start-desktop-prod.bat');
    console.error('  Linux/macOS: ./start-desktop.sh or ./start-desktop-prod.sh');
    return;
  }
  
  // Determine the command to activate venv and run the backend
  let command;
  if (process.platform === 'win32') {
    // Windows: activate venv and run app.py
    command = 'venv\\Scripts\\activate.bat && python app.py';
  } else {
    // Linux/macOS: activate venv and run app.py
    command = 'source venv/bin/activate && python3 app.py';
  }
  
  backendProcess = spawn(command, [], {
    cwd: backendPath,
    stdio: 'inherit',
    shell: true
  });

  backendProcess.on('error', (error) => {
    console.error('Failed to start backend:', error);
  });

  backendProcess.on('exit', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

// Create main window
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
    }
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  console.log(`Loading app in ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} mode from: ${startUrl}`);
  mainWindow.loadURL(startUrl);

  // Open DevTools in development
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

  // Create menu
  createMenu();
}

// Create application menu (Italian)
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Nuovo Evento',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-event');
          }
        },
        { type: 'separator' },
        {
          label: 'Esci',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
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
        { role: 'delete', label: 'Elimina' },
        { type: 'separator' },
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
            mainWindow.webContents.send('menu-action', 'dashboard');
          }
        },
        {
          label: 'Eventi',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-action', 'events');
          }
        },
        {
          label: 'Pneumatici',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            mainWindow.webContents.send('menu-action', 'tires');
          }
        },
        {
          label: 'Meteo',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            mainWindow.webContents.send('menu-action', 'weather');
          }
        },
        { type: 'separator' },
        { role: 'reload', label: 'Ricarica' },
        { role: 'forceReload', label: 'Ricarica Forzata' },
        { role: 'toggleDevTools', label: 'Strumenti Sviluppatore' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normale' },
        { role: 'zoomIn', label: 'Ingrandisci' },
        { role: 'zoomOut', label: 'Rimpicciolisci' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Schermo Intero' }
      ]
    },
    {
      label: 'Finestra',
      submenu: [
        { role: 'minimize', label: 'Riduci a Icona' },
        { role: 'close', label: 'Chiudi' }
      ]
    },
    {
      label: 'Aiuto',
      submenu: [
        {
          label: 'Informazioni',
          click: () => {
            shell.openExternal('https://github.com/faustocedros-droid/trashbin');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App lifecycle
app.whenReady().then(() => {
  // Start backend server
  startBackend();

  // Wait for backend to start, then create window
  // Increased timeout to ensure backend is fully ready
  setTimeout(() => {
    createWindow();
  }, 5000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Kill backend process
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Kill backend process
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Handle crashes gracefully
app.on('render-process-gone', (event, webContents, details) => {
  console.error('Render process gone:', details);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
