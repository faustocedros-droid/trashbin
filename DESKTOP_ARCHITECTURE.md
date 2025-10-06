# Desktop App Architecture - Rebuilt

## Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Desktop Application                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────┐
        │   Startup Script (start-desktop.*)   │
        │                                      │
        │  • Check Python & Node.js            │
        │  • Create virtual environment        │
        │  • Install dependencies              │
        │  • Launch Electron                   │
        └──────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────┐
        │   Electron Main Process              │
        │   (frontend/public/electron.js)      │
        │                                      │
        │  1. Start Backend                    │
        │  2. Health Check Loop (15s timeout)  │
        │  3. Create Window                    │
        │  4. Setup Menu & Shortcuts           │
        └──────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌──────────────────────┐
    │  Flask Backend    │       │  Electron Renderer   │
    │  (Python/Flask)   │◄──────┤  (React Frontend)    │
    │                   │       │                      │
    │  • API Server     │       │  • UI Components     │
    │  • Database       │       │  • State Management  │
    │  • Port 5000      │       │  • Navigation        │
    └───────────────────┘       └──────────────────────┘
            │                               │
            │                               │
            ▼                               ▼
    ┌───────────────────┐       ┌──────────────────────┐
    │   racing.db       │       │   localStorage       │
    │   (SQLite)        │       │   (Browser Storage)  │
    └───────────────────┘       └──────────────────────┘
```

## Startup Flow

```
START
  │
  ├─→ 1. Check Python installed
  │    └─→ If not: Show error with download link
  │
  ├─→ 2. Check Node.js installed
  │    └─→ If not: Show error with download link
  │
  ├─→ 3. Create/activate Python venv
  │    └─→ Install backend dependencies (Flask, etc.)
  │
  ├─→ 4. Check/install Node modules
  │    └─→ Install frontend dependencies (React, Electron)
  │
  ├─→ 5. Launch Electron
  │    │
  │    ├─→ 5a. Spawn Flask backend process
  │    │    └─→ Set environment: FLASK_ENV=production
  │    │
  │    ├─→ 5b. Health check loop (every 500ms)
  │    │    ├─→ Try: GET http://localhost:5000/api/health
  │    │    ├─→ Success: Continue
  │    │    └─→ Timeout (15s): Show error dialog
  │    │
  │    ├─→ 5c. Create browser window
  │    │    ├─→ Load React app
  │    │    ├─→ Setup preload script
  │    │    └─→ Create menu & shortcuts
  │    │
  │    └─→ 5d. Show window when ready
  │
  └─→ RUNNING
       │
       └─→ On EXIT
            ├─→ Close window
            ├─→ Send SIGTERM to backend
            ├─→ Wait 2 seconds
            └─→ Send SIGKILL if still running
```

## Health Check System

```
┌───────────────────────────────────────────────────┐
│  waitForBackend()                                 │
│                                                   │
│  const startTime = Date.now()                    │
│                                                   │
│  while (elapsed < 15000ms):                      │
│    │                                             │
│    ├─→ checkBackendReady()                      │
│    │    │                                        │
│    │    ├─→ HTTP GET /api/health                │
│    │    ├─→ Timeout: 1000ms                     │
│    │    └─→ Return: true/false                  │
│    │                                             │
│    ├─→ If ready: ✓ Continue                     │
│    │                                             │
│    └─→ If not: Wait 500ms, try again            │
│                                                   │
│  If timeout: Show error dialog                   │
└───────────────────────────────────────────────────┘
```

## Navigation System

```
Old (IPC-based):
┌────────────┐          ┌────────────┐          ┌──────────┐
│   Menu     │─ send ──→│    IPC     │─ listen ─→│ Preload  │
│   Click    │          │  Channel   │          │  Script  │
└────────────┘          └────────────┘          └──────────┘
                                                      │
                                                      ↓
                                                ┌──────────┐
                                                │  Dispatch│
                                                │  Event   │
                                                └──────────┘
                                                      │
                                                      ↓
                                                ┌──────────┐
                                                │  Router  │
                                                └──────────┘

New (Hash-based):
┌────────────┐
│   Menu     │
│   Click    │
└────────────┘
      │
      ├─→ executeJavaScript()
      │    └─→ window.location.hash = '/events'
      │
      └─→ React Router detects hash change
           └─→ Navigate to route
```

## Process Cleanup

```
┌───────────────────────────────────────────────────┐
│  cleanupBackend()                                 │
│                                                   │
│  if (backendProcess):                            │
│    │                                             │
│    ├─→ 1. Send SIGTERM (graceful shutdown)      │
│    │                                             │
│    ├─→ 2. Set timeout (2000ms)                  │
│    │    └─→ If still running:                   │
│    │         └─→ Send SIGKILL (force kill)      │
│    │                                             │
│    └─→ 3. Set backendProcess = null             │
│                                                   │
│  Called on:                                       │
│    • window-all-closed                           │
│    • will-quit                                   │
│    • quit                                        │
└───────────────────────────────────────────────────┘
```

## Error Handling

```
┌──────────────────────────────────────────────┐
│  Uncaught Exception                          │
│    └─→ Log to console                        │
│    └─→ Show error dialog                     │
│    └─→ Don't crash                           │
│                                              │
│  Unhandled Promise Rejection                 │
│    └─→ Log to console                        │
│    └─→ Continue execution                    │
│                                              │
│  Backend Startup Failure                     │
│    └─→ Show error dialog                     │
│    └─→ Option to exit or continue            │
│                                              │
│  Failed Page Load                            │
│    └─→ Log error                             │
│    └─→ Keep window open for debugging       │
│                                              │
│  Backend Not Ready                           │
│    └─→ Show error dialog                     │
│    └─→ Explain what to check                │
│    └─→ Option to exit or continue            │
└──────────────────────────────────────────────┘
```

## Configuration

```javascript
// Centralized configuration at top of electron.js

const BACKEND_PORT = 5000;
const FRONTEND_PORT = 3000;
const BACKEND_STARTUP_TIMEOUT = 15000;  // 15 seconds
const BACKEND_CHECK_INTERVAL = 500;     // 500 milliseconds

// Easy to adjust for different environments
```

## Key Improvements Over Previous Version

### 1. Startup Verification
```
Before: ❌ Blind wait
  setTimeout(() => createWindow(), 2000)

After: ✅ Health check
  await waitForBackend()
  if (backendReady) createWindow()
```

### 2. Error Handling
```
Before: ❌ Silent failures
  process.on('uncaughtException', console.error)

After: ✅ User dialogs
  dialog.showErrorBox('Error', message)
```

### 3. Navigation
```
Before: ❌ IPC messages
  mainWindow.webContents.send('navigate', path)
  ipcRenderer.on('navigate', ...)

After: ✅ Direct routing
  mainWindow.webContents.executeJavaScript(`
    window.location.hash = path
  `)
```

### 4. Cleanup
```
Before: ❌ Simple kill
  backendProcess.kill()

After: ✅ Graceful shutdown
  backendProcess.kill('SIGTERM')
  setTimeout(() => kill('SIGKILL'), 2000)
```

## File Structure

```
trashbin/
├── backend/                    # Flask backend (unchanged)
│   ├── app.py
│   ├── models.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   ├── electron.js        # ⭐ Rebuilt (424 lines)
│   │   └── preload.js         # ⭐ Simplified (22 lines)
│   │
│   ├── src/                   # React app (unchanged)
│   │   ├── App.js
│   │   └── pages/
│   │
│   └── package.json           # Electron config
│
├── start-desktop.sh           # ⭐ Enhanced launcher
├── start-desktop.bat          # ⭐ Enhanced launcher
│
└── Documentation/
    ├── QUICK_START_DESKTOP.md
    ├── DESKTOP_REBUILD_README.md
    ├── DESKTOP_REBUILD_SUMMARY.md
    └── DESKTOP_TESTING_GUIDE.md
```

## Technology Stack

```
┌─────────────────────────────────────┐
│         Desktop Layer               │
│  • Electron 28                      │
│  • Node.js 16+                      │
│  • electron-builder (for packaging) │
└─────────────────────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌─────────────┐         ┌──────────────┐
│  Backend    │         │  Frontend    │
│             │         │              │
│ • Python 3.9│         │ • React 18   │
│ • Flask 3.0 │         │ • Material-UI│
│ • SQLAlchemy│         │ • Chart.js   │
│ • SQLite    │         │ • Axios      │
└─────────────┘         └──────────────┘
```

## Summary

The rebuilt architecture provides:
- ✅ **Reliability** through health checks
- ✅ **Maintainability** through clean code
- ✅ **Debuggability** through detailed logging
- ✅ **User Experience** through clear error messages
- ✅ **Performance** through optimized startup
- ✅ **Robustness** through comprehensive error handling

All while maintaining **100% compatibility** with the existing web app!
