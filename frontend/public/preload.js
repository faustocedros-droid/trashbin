/**
 * Racing Car Manager - Electron Preload Script
 * Clean rebuild - simplified security context
 */

const { contextBridge } = require('electron');

// Expose minimal, safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform information
  platform: process.platform,
  
  // Version information
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  
  // Flag to indicate we're running in Electron
  isElectron: true
});
