# Build Configuration for Electron Desktop App

## Included in Desktop App Build

### Frontend
- React app (compiled in `build/` directory)
- Electron main process (`electron.js`)
- Preload script (`preload.js`)

### Backend
For a fully standalone desktop app, the backend should be included:

1. **Option 1: Include Python + Backend** (Recommended for distribution)
   - Package Python interpreter with the app
   - Include backend folder with all dependencies
   - Use PyInstaller to create executable

2. **Option 2: User Installs Python** (Simpler, current approach)
   - User must have Python installed
   - Backend runs from source
   - Lighter download size

## Current Build (Option 2)

The current build uses Option 2 - users need Python installed.

### Requirements
Users must install:
- Python 3.9+
- Node.js (only for development)

### What's Included in Build
- Electron executable
- React frontend (compiled)
- Backend source code (user's Python runs it)

## Future: Standalone Build (Option 1)

To create a fully standalone app with no Python installation required:

### 1. Create Backend Executable

```bash
cd backend
pip install pyinstaller
pyinstaller --onefile --name racing-backend app.py
```

### 2. Update electron.js

Replace Python spawning with:
```javascript
const backendExe = isDev
  ? path.join(__dirname, '../../backend/dist/racing-backend')
  : path.join(process.resourcesPath, 'backend/racing-backend');

backendProcess = spawn(backendExe);
```

### 3. Update electron-builder config

Add to package.json:
```json
"build": {
  "extraResources": [
    {
      "from": "../backend/dist/racing-backend",
      "to": "backend"
    }
  ]
}
```

## Build Sizes

### Current (Python Required)
- Windows: ~150 MB
- macOS: ~180 MB
- Linux: ~160 MB

### Future Standalone (Python Included)
- Windows: ~250-300 MB
- macOS: ~280-330 MB
- Linux: ~260-310 MB

## Platform-Specific Notes

### Windows
- Creates `.exe` installer with NSIS
- Portable `.exe` also available
- Auto-update supported via electron-updater

### macOS
- Creates `.dmg` disk image
- Code signing recommended for distribution
- Notarization required for macOS 10.15+

### Linux
- Creates `.AppImage` (universal)
- Creates `.deb` (Debian/Ubuntu)
- Optional: `.rpm` (Fedora/RHEL)

## Security

### Code Signing

**Windows:**
```bash
# Requires code signing certificate
npm run electron-build -- --win --publish never
```

**macOS:**
```bash
# Requires Apple Developer account
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run electron-build -- --mac --publish never
```

## Auto-Update (Future)

Using electron-updater for automatic updates:

1. Set up release server
2. Add to package.json:
```json
"build": {
  "publish": {
    "provider": "github",
    "repo": "trashbin",
    "owner": "faustocedros-droid"
  }
}
```

3. Enable auto-update in electron.js

## CI/CD Build (Future)

GitHub Actions workflow for automated builds:

```yaml
name: Build Desktop App

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm install
      - run: cd frontend && npm run electron-build
      - uses: actions/upload-artifact@v2
        with:
          name: ${{ matrix.os }}-build
          path: frontend/dist/*
```
