# Building Installation Packages

This guide explains how to build installation packages for the Racing Car Manager application.

## Prerequisites

### Required Software
- **Node.js 16+** and **npm** - for building the frontend and Electron app
- **Python 3.9+** - must be installed and available in PATH
- **Git** - for version control

### Platform-Specific Requirements

**Windows:**
- No additional requirements for building Windows installers on Windows

**macOS:**
- Xcode Command Line Tools
- For signing: Apple Developer certificate (optional)

**Linux:**
- For DEB packages: `dpkg`, `fakeroot`
- For AppImage: Standard build tools

## Quick Build

### Using Build Scripts (Recommended)

**Windows:**
```batch
build-installer.bat
```

**Linux/macOS:**
```bash
chmod +x build-installer.sh
./build-installer.sh
```

The script will:
1. Install npm dependencies
2. Build the React application
3. Create the installer for your current platform
4. Output the installer to the `dist/` directory

## Manual Build Process

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Build React Application

```bash
npm run build
```

This creates an optimized production build in `frontend/build/`.

### Step 3: Build Installer

Choose the appropriate command for your target platform:

**Windows Installer (NSIS):**
```bash
npm run electron-build-win
```
Output: `dist/Racing Car Manager Setup x.x.x.exe`

**macOS DMG:**
```bash
npm run electron-build-mac
```
Output: `dist/Racing Car Manager-x.x.x.dmg`

**Linux Packages:**
```bash
npm run electron-build-linux
```
Output: 
- `dist/Racing Car Manager-x.x.x.AppImage`
- `dist/racing-car-manager_x.x.x_amd64.deb`

## Build Configuration

The build configuration is defined in `frontend/package.json` under the `build` key.

### Key Configuration Options

- **appId**: `com.racingcar.manager` - Unique application identifier
- **productName**: `Racing Car Manager` - Display name
- **files**: Includes frontend build, electron files, and backend Python code
- **extraResources**: Bundles the backend directory (excluding venv and cache)
- **directories.output**: `../dist` - Where installers are created

### Backend Bundling

The backend Python application is bundled with the installer:
- All Python source files from `backend/`
- Excludes: `venv/`, `__pycache__/`, `*.db`, `.env`
- On first run, the app creates a virtual environment and installs dependencies

### Installer Types

**Windows (NSIS):**
- Multi-page installer wizard
- User can choose installation directory
- Creates Desktop and Start Menu shortcuts
- Uninstaller included

**macOS (DMG):**
- Drag-and-drop installation
- Universal binary (x64 and ARM64)
- Signed and notarized (if certificates provided)

**Linux (AppImage + DEB):**
- AppImage: Portable, no installation required
- DEB: Standard Debian package for apt-based distros

## Cross-Platform Building

You can build for different platforms from a single machine:

```bash
cd frontend

# Build for all platforms
npm run electron-build

# Build specific platforms
npm run electron-build -- --win --mac --linux
```

**Note:** Building for macOS typically requires a Mac. Building for Windows from Linux/Mac may have limitations.

## Customizing the Build

### Changing Version Number

Edit `frontend/package.json`:
```json
{
  "version": "1.0.0"
}
```

### Adding an Icon

1. Create a 512x512 PNG icon
2. Save as `frontend/public/images/icon.png`
3. Rebuild the installation package

The electron-builder will automatically use the icon if present. If no icon is provided, electron-builder will use the default Electron icon.

### Signing (Optional)

**Windows:**
- Set up code signing certificate
- Configure in `package.json` under `build.win.certificateFile`

**macOS:**
- Requires Apple Developer certificate
- Configure signing in Xcode or via command line
- Configure in `package.json` under `build.mac.identity`

## Troubleshooting

### Build Fails with "Cannot find module"
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### "Python not found" during build
- Ensure Python 3.9+ is installed and in PATH
- Verify: `python --version` or `python3 --version`

### Large installer size
- This is expected - the installer includes:
  - Electron runtime (~100MB)
  - Node modules for frontend
  - Python backend code
  - On first run, Python dependencies are installed

### Permission denied on Linux
- Make build script executable: `chmod +x build-installer.sh`
- Some build tools may require sudo

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build Installers

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        working-directory: frontend
        run: npm install
      
      - name: Build
        working-directory: frontend
        run: npm run build
      
      - name: Package
        working-directory: frontend
        run: npm run electron-build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: installers-${{ matrix.os }}
          path: dist/*
```

## Output Files

After successful build, find installers in `dist/`:

| Platform | File Pattern | Size (approx) |
|----------|-------------|---------------|
| Windows  | `Racing Car Manager Setup x.x.x.exe` | 150-200 MB |
| macOS    | `Racing Car Manager-x.x.x.dmg` | 150-200 MB |
| Linux    | `Racing Car Manager-x.x.x.AppImage` | 150-200 MB |
| Linux    | `racing-car-manager_x.x.x_amd64.deb` | 150-200 MB |

## Distribution

### Testing Before Distribution
1. Install the package on a clean system
2. Verify the application starts correctly
3. Test backend auto-start functionality
4. Check that Python dependencies install correctly

### Publishing
- Upload to GitHub Releases
- Include INSTALL.md with the release
- Provide checksums for verification

## Support

For build issues, check:
- [Electron Builder Documentation](https://www.electron.build/)
- [GitHub Issues](https://github.com/faustocedros-droid/trashbin/issues)
