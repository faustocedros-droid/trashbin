const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

let mainWindow;
let backendProcess;
let backendReady = false;
let startupErrors = [];

// Determine if running in development mode
const isDev = !app.isPackaged;

// Function to check if a port is available
function checkPort(port, timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const req = http.get(`http://localhost:${port}/api/health`, (res) => {
        clearInterval(checkInterval);
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          resolve(false);
        }
      });
      req.end();
    }, 500);
  });
}

// Function to show error dialog
function showErrorDialog(title, message, detail = '') {
  const options = {
    type: 'error',
    title: title,
    message: message,
    detail: detail,
    buttons: ['OK', 'View Logs']
  };
  
  const response = dialog.showMessageBoxSync(options);
  if (response === 1) {
    // View Logs button clicked
    console.log('=== STARTUP ERRORS ===');
    startupErrors.forEach(err => console.log(err));
    console.log('=== END ERRORS ===');
  }
}

async function createWindow() {
  console.log('=== Creating Electron Window ===');
  console.log('Development mode:', isDev);
  console.log('Backend ready:', backendReady);
  
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
    console.log('Icon not found, using default');
    iconPath = undefined; // Let Electron use default icon
  } else {
    console.log('Using icon:', iconPath);
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
    title: 'Racing Car Manager',
    show: false  // Don't show until ready to load
  });

  // Wait for backend to be ready
  if (!backendReady) {
    console.log('Waiting for backend to be ready...');
    const backendIsReady = await checkPort(5000, 30000);
    if (!backendIsReady) {
      const errorMsg = 'Backend server failed to start within 30 seconds';
      console.error(errorMsg);
      startupErrors.push(errorMsg);
      showErrorDialog(
        'Backend Error',
        'The backend server could not start.',
        'Please check:\n1. Python virtual environment is set up\n2. Dependencies are installed\n3. Port 5000 is not in use\n\nSee console for details.'
      );
      app.quit();
      return;
    }
    backendReady = true;
    console.log('✓ Backend is ready');
  }

  // Load the app
  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  console.log('Loading URL:', startURL);

  // In dev mode, wait for React dev server
  if (isDev) {
    console.log('Waiting for React dev server...');
    const reactReady = await checkPort(3000, 60000);
    if (!reactReady) {
      const errorMsg = 'React dev server failed to start within 60 seconds';
      console.error(errorMsg);
      startupErrors.push(errorMsg);
      showErrorDialog(
        'React Dev Server Error',
        'The React development server could not start.',
        'Please run "npm start" in the frontend directory manually to see error details.'
      );
      app.quit();
      return;
    }
    console.log('✓ React dev server is ready');
  }

  try {
    await mainWindow.loadURL(startURL);
    console.log('✓ Application loaded successfully');
    mainWindow.show();
  } catch (err) {
    console.error('Failed to load URL:', err);
    startupErrors.push(`Failed to load URL: ${err.message}`);
    showErrorDialog(
      'Application Load Error',
      'Failed to load the application.',
      `Error: ${err.message}\n\nCheck console for details.`
    );
  }

  // Handle load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    const errorMsg = `Failed to load: ${errorDescription} (${errorCode})`;
    console.error(errorMsg);
    startupErrors.push(errorMsg);
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
  
  console.log('=== Window creation complete ===');
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
  console.log('=== Starting Backend ===');
  
  // Backend path relative to the app
  const backendPath = isDev
    ? path.join(__dirname, '../../backend')
    : path.join(process.resourcesPath, 'backend');

  console.log('Backend path:', backendPath);

  // Check if backend directory exists
  if (!fs.existsSync(backendPath)) {
    const errorMsg = `Backend directory not found: ${backendPath}`;
    console.error('=========================================');
    console.error('FATAL ERROR: Backend directory not found');
    console.error('=========================================');
    console.error(errorMsg);
    console.error('');
    console.error('Expected location:', backendPath);
    console.error('Please ensure the backend folder exists.');
    console.error('=========================================');
    
    startupErrors.push(errorMsg);
    showErrorDialog(
      'Backend Not Found',
      'Backend directory is missing.',
      `Expected location: ${backendPath}\n\nPlease ensure the backend folder exists.`
    );
    app.quit();
    return;
  }

  const backendScript = path.join(backendPath, 'app.py');
  
  // Check if app.py exists
  if (!fs.existsSync(backendScript)) {
    const errorMsg = `Backend script not found: ${backendScript}`;
    console.error('=========================================');
    console.error('FATAL ERROR: Backend script not found');
    console.error('=========================================');
    console.error(errorMsg);
    console.error('');
    console.error('Expected location:', backendScript);
    console.error('Please ensure app.py exists in the backend folder.');
    console.error('=========================================');
    
    startupErrors.push(errorMsg);
    showErrorDialog(
      'Backend Script Not Found',
      'app.py is missing from backend directory.',
      `Expected location: ${backendScript}`
    );
    app.quit();
    return;
  }
  
  // Determine Python command from virtual environment
  let pythonCmd;
  const venvPath = path.join(backendPath, 'venv');
  
  console.log('Checking for virtual environment:', venvPath);
  
  if (process.platform === 'win32') {
    pythonCmd = path.join(venvPath, 'Scripts', 'python.exe');
    // Fallback to system python if venv doesn't exist
    if (!fs.existsSync(pythonCmd)) {
      console.warn('⚠ Virtual environment not found, using system python');
      console.warn('This may cause issues if Flask dependencies are not installed globally');
      startupErrors.push('Warning: Virtual environment not found, using system python');
      pythonCmd = 'python';
    } else {
      console.log('✓ Using virtual environment Python');
    }
  } else {
    pythonCmd = path.join(venvPath, 'bin', 'python');
    // Fallback to system python3 if venv doesn't exist
    if (!fs.existsSync(pythonCmd)) {
      console.warn('⚠ Virtual environment not found, using system python3');
      console.warn('This may cause issues if Flask dependencies are not installed globally');
      startupErrors.push('Warning: Virtual environment not found, using system python3');
      pythonCmd = 'python3';
    } else {
      console.log('✓ Using virtual environment Python');
    }
  }

  console.log('Python command:', pythonCmd);
  console.log('Starting Flask backend...');

  // Start the Flask backend
  try {
    backendProcess = spawn(pythonCmd, [backendScript], {
      cwd: backendPath,
      env: { ...process.env, FLASK_ENV: 'production' }
    });

    backendProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Backend] ${output}`);
      // Check if backend is ready
      if (output.includes('Running on')) {
        backendReady = true;
      }
    });

    backendProcess.stderr.on('data', (data) => {
      const output = data.toString();
      
      // Flask outputs normal startup messages to stderr, not stdout
      // Check if backend is ready by looking for the "Running on" message
      if (output.includes('Running on')) {
        backendReady = true;
        console.log(`[Backend] ${output}`);
      } else {
        // Only log as error and add to startupErrors if it's not a normal Flask message
        const isNormalFlaskMessage = 
          output.includes('WARNING: This is a development server') ||
          output.includes('Restarting with') ||
          output.includes('Debugger is active') ||
          output.includes('Debugger PIN:') ||
          output.includes('DeprecationWarning:') ||
          /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3} - -/.test(output); // Access log pattern
        
        if (isNormalFlaskMessage) {
          console.log(`[Backend] ${output}`);
        } else {
          console.error(`[Backend Error] ${output}`);
          startupErrors.push(`Backend error: ${output}`);
        }
      }
      
      // Check for common errors
      if (output.includes('ModuleNotFoundError') || output.includes('No module named')) {
        showErrorDialog(
          'Python Dependencies Missing',
          'Backend failed to start due to missing Python dependencies.',
          'Please run:\n\ncd backend\npython -m venv venv\nsource venv/bin/activate  # or venv\\Scripts\\activate on Windows\npip install -r requirements.txt'
        );
        app.quit();
      }
    });

    backendProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
      if (code !== 0 && code !== null) {
        startupErrors.push(`Backend exited with code ${code}`);
      }
    });
    
    backendProcess.on('error', (error) => {
      const errorMsg = `Failed to start backend: ${error.message}`;
      console.error('=========================================');
      console.error('FATAL ERROR: Backend process failed to start');
      console.error('=========================================');
      console.error(errorMsg);
      console.error('');
      console.error('Please check:');
      console.error('1. Python is installed and accessible');
      console.error('2. Virtual environment exists in backend/venv');
      console.error('3. Dependencies are installed in the venv');
      console.error('');
      console.error('To fix, run:');
      console.error('  cd backend');
      console.error('  python -m venv venv');
      console.error('  venv\\Scripts\\activate.bat  (on Windows)');
      console.error('  pip install -r requirements.txt');
      console.error('=========================================');
      
      startupErrors.push(errorMsg);
      showErrorDialog(
        'Backend Start Error',
        'Failed to start the backend process.',
        `Error: ${error.message}\n\nPlease check:\n1. Python is installed\n2. Virtual environment is set up\n3. Dependencies are installed`
      );
      app.quit();
    });
    
    console.log('Backend process started, PID:', backendProcess.pid);
  } catch (error) {
    const errorMsg = `Exception starting backend: ${error.message}`;
    console.error(errorMsg);
    startupErrors.push(errorMsg);
    showErrorDialog(
      'Backend Start Exception',
      'An exception occurred while starting the backend.',
      error.message
    );
  }
  
  console.log('=== Backend startup initiated ===');
}

// App lifecycle
app.whenReady().then(async () => {
  console.log('=== Electron App Starting ===');
  console.log('Node version:', process.versions.node);
  console.log('Electron version:', process.versions.electron);
  console.log('Platform:', process.platform);
  console.log('Development mode:', isDev);
  
  // Start backend server
  startBackend();

  // Wait for backend, then create window
  console.log('Waiting for backend to be ready...');
  const backendIsReady = await checkPort(5000, 30000);
  
  if (!backendIsReady) {
    console.error('=========================================');
    console.error('FATAL ERROR: Backend did not become ready in time');
    console.error('=========================================');
    console.error('');
    console.error('The backend server failed to start within 30 seconds.');
    console.error('');
    console.error('Common causes:');
    console.error('- Virtual environment not set up correctly');
    console.error('- Python dependencies not installed');
    console.error('- Port 5000 already in use');
    console.error('- Backend script errors');
    console.error('');
    console.error('Startup errors collected:');
    startupErrors.forEach(err => console.error(`  - ${err}`));
    console.error('');
    console.error('To diagnose the issue, run: diagnose-desktop.bat');
    console.error('=========================================');
    
    const options = {
      type: 'error',
      title: 'Backend Timeout',
      message: 'Backend server did not start within 30 seconds',
      detail: 'Please check the console for error messages.\n\nCommon causes:\n- Virtual environment not set up\n- Python dependencies not installed\n- Port 5000 already in use',
      buttons: ['Quit', 'Try Again']
    };
    
    const response = dialog.showMessageBoxSync(options);
    if (response === 1) {
      // Try again
      app.relaunch();
    }
    app.quit();
    return;
  }
  
  backendReady = true;
  console.log('✓ Backend is ready, creating window...');
  
  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
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
