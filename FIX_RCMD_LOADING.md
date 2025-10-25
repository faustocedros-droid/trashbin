# Fix: .rcmd File Loading Issue in Desktop App

## Problem
L'applicazione elaborata a seguito dell'ultima pull non era capace di caricare il file .rcmd e tutti i dati in esso contenuti.

The application was unable to load .rcmd files and all the data contained within them after the last pull request.

## Root Cause
The desktop Electron application was using HTML file input (`<input type="file">`) for loading .rcmd files, which can have limitations and permission issues in Electron's sandboxed environment. The app needed proper IPC (Inter-Process Communication) handlers to use native file dialogs.

## Solution Implemented

### 1. Added Electron IPC Handlers (`frontend/public/electron.js`)
- **`save-rcmd-file`**: Opens a native save dialog and saves the .rcmd file with proper filters
- **`load-rcmd-file`**: Opens a native open dialog and loads .rcmd or .tpdb files

Both handlers:
- Use native file system access via Node.js `fs` module
- Provide proper error handling
- Support file type filtering (.rcmd, .tpdb)
- Return standardized response objects with `{ success, data, error }`

### 2. Exposed Handlers in Preload Script (`frontend/public/preload.js`)
- Added `saveRcmdFile` and `loadRcmdFile` methods to the electron context
- Maintains security through contextBridge isolation
- Follows the same pattern as existing driver comment handlers

### 3. Updated Settings Page (`frontend/src/pages/Settings.js`)
- Added Electron environment detection: `const isElectron = typeof window !== 'undefined' && window.electron;`
- Updated `handleSaveAllData()` to use Electron IPC when available, fallback to browser download
- Updated `handleLoadAllData()` to use Electron IPC when available, fallback to FileReader
- Changed UI to show button instead of file input in Electron mode for better UX

## Key Features

### Electron Mode (Desktop App)
- Native file dialogs with proper file type filters
- Direct file system access
- Better error handling
- Improved user experience

### Browser Mode (Web App)
- Traditional file input
- FileReader API for loading
- Blob download for saving
- Full backward compatibility

## File Format Support
- `.rcmd` - Racing Car Manager Data (version 2.0 - complete format)
- `.tpdb` - Tire Pressure Database (version 1.x - legacy format)

## Testing
All tests passed successfully:
- ✅ JSON serialization/deserialization
- ✅ File save simulation
- ✅ File load simulation
- ✅ Data integrity verification
- ✅ Electron mode detection
- ✅ Browser mode detection
- ✅ Complete workflow (save → load → restore)

## Benefits
1. **Fixed the reported issue**: Desktop app can now load .rcmd files properly
2. **Better user experience**: Native file dialogs in desktop mode
3. **Backward compatible**: Web version still works with file input
4. **Secure**: Uses contextBridge for IPC isolation
5. **Reliable**: Proper error handling and validation

## Usage

### Saving Data
1. Go to Settings page (⚙️ Impostazioni)
2. Fill in optional filename
3. Click "💾 Salva Tutti i Dati"
4. In desktop mode: Native save dialog appears
5. In browser mode: File downloads automatically

### Loading Data
1. Go to Settings page (⚙️ Impostazioni)
2. In desktop mode: Click "📂 Carica File RCMD"
3. In browser mode: Use file input to select file
4. Data is loaded and page reloads

## Technical Implementation Details

### Electron IPC Flow
```
Renderer Process (Settings.js)
  ↓ (call window.electron.saveRcmdFile)
Preload Script (preload.js)
  ↓ (invoke 'save-rcmd-file')
Main Process (electron.js)
  ↓ (show native dialog)
File System
```

### Error Handling
- File not found: Returns `{ success: false, error: 'message' }`
- Invalid JSON: Caught and displays error message
- User cancellation: Returns `{ success: false }` without error
- Permission issues: Caught and logged with error details

## Files Modified
1. `frontend/public/electron.js` - Added IPC handlers
2. `frontend/public/preload.js` - Exposed handlers
3. `frontend/src/pages/Settings.js` - Updated save/load logic and UI

## No Breaking Changes
- Web version continues to work exactly as before
- Desktop version now has improved functionality
- Existing .rcmd files remain compatible
- Legacy .tpdb files still supported
