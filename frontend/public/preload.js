const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Add any electron-specific APIs you need here
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});

// Listen for navigation events from main process
ipcRenderer.on('navigate', (event, path) => {
  // Dispatch a custom event that React can listen to
  window.dispatchEvent(new CustomEvent('electron-navigate', { detail: path }));
});
