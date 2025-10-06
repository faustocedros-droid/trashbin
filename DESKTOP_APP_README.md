# Racing Car Manager - Desktop App

## Overview

This is the standalone desktop version of the Racing Car Manager web application. It uses Electron to provide a native desktop experience with all the features of the web app plus:

- **Native OS menus** (in Italian)
- **Global keyboard shortcuts**
- **Auto-start backend** - No need to manually start the Flask server
- **Window management** - Fullscreen mode, minimize, etc.
- **Standalone installer** - Distribute as .exe (Windows), .dmg (macOS), or .AppImage (Linux)
- **Offline capable** - Works without internet connection

## Architecture

The desktop app consists of three main components:

1. **Electron Main Process** (`frontend/public/electron.js`)
   - Manages the application window
   - Handles native menus and shortcuts
   - Auto-starts the Flask backend server
   - Manages application lifecycle

2. **Electron Renderer Process** (React App)
   - The same React frontend as the web version
   - Runs inside a Chromium browser window
   - Communicates with backend via REST API

3. **Flask Backend** (Python)
   - Automatically started by Electron
   - Runs on localhost:5000
   - Provides REST API for data management

## Prerequisites

- **Node.js** 16 or higher
- **Python** 3.9 or higher
- **npm** (comes with Node.js)

## Installation

### Linux/macOS

```bash
# Make the script executable
chmod +x start-desktop.sh

# Run the script
./start-desktop.sh
```

### Windows

```batch
# Double-click or run from command prompt
start-desktop.bat
```

The start script will:
1. Check for required dependencies
2. Install Python dependencies (if needed)
3. Install Node.js dependencies (if needed)
4. Initialize the database (if needed)
5. Launch the desktop app

## Development Mode

The start-desktop scripts run the app in development mode, which:
- Starts the Flask backend automatically
- Starts the React development server
- Opens the Electron window
- Enables hot-reloading for frontend changes
- Shows DevTools for debugging

## Building for Production

To create a standalone distributable app:

### Windows
```bash
cd frontend
npm run electron-build-win
```
Creates: `frontend/dist/Racing Car Manager Setup.exe`

### macOS
```bash
cd frontend
npm run electron-build-mac
```
Creates: `frontend/dist/Racing Car Manager.dmg`

### Linux
```bash
cd frontend
npm run electron-build-linux
```
Creates: 
- `frontend/dist/Racing Car Manager.AppImage`
- `frontend/dist/racing-car-manager_0.1.0_amd64.deb`

## Keyboard Shortcuts

- **Ctrl+N** (Cmd+N on Mac) - New Event
- **Ctrl+D** (Cmd+D on Mac) - Go to Dashboard
- **Ctrl+E** (Cmd+E on Mac) - Go to Events
- **Ctrl+T** (Cmd+T on Mac) - Go to Tires
- **F11** - Toggle Fullscreen
- **Ctrl+Q** (Cmd+Q on Mac) - Quit Application

## Menu Options

### File
- Nuovo Evento (New Event)
- Esci (Exit)

### Modifica (Edit)
- Standard edit operations (Cut, Copy, Paste, etc.)

### Visualizza (View)
- Dashboard
- Eventi (Events)
- Pneumatici (Tires)
- Reload/Developer tools
- Zoom controls
- Fullscreen toggle

### Finestra (Window)
- Minimize
- Close

### Aiuto (Help)
- Informazioni (About)

## Troubleshooting

### Backend doesn't start
- Make sure Python 3.9+ is installed
- Check that `backend/requirements.txt` dependencies are installed
- Look for error messages in the terminal

### Frontend doesn't load
- Make sure Node.js 16+ is installed
- Check that `frontend/node_modules` exists
- Try deleting `node_modules` and running `npm install` again

### Port 5000 already in use
- Close any other applications using port 5000
- The backend needs this port to run

### Black/blank window
- Wait a few seconds for the app to load
- Check the DevTools console (View → Toggle DevTools)
- Make sure the backend started successfully

## Comparison with Web App

| Feature | Web App | Desktop App |
|---------|---------|-------------|
| Installation | None required | One-time setup |
| Backend startup | Manual | Automatic |
| Native menus | No | Yes (Italian) |
| Keyboard shortcuts | Limited | Full support |
| Offline | No | Yes |
| Distribution | URL | Installer files |
| Updates | Instant | Manual/Auto-update |

## Features Preserved

All features from the web app are preserved:

✓ Dashboard con statistiche  
✓ Gestione completa eventi  
✓ Pianificazione sessioni (Test, FP, Q, Race)  
✓ Gestione pneumatici e pressioni  
✓ Analisi temperature gomme  
✓ Database pressioni pneumatici  
✓ Setup vettura  
✓ Impostazioni  
✓ Demo EventFullDemo  
✓ Tutte le API REST  
✓ Tutti i calcoli racing  
✓ Database SQLite  

## Technology Stack

- **Electron** 28.0.0
- **React** 18.2.0
- **Material-UI** 5.14.20
- **Flask** 3.0.0
- **SQLite** (database)

## License

Private project for racing team use.
