# Desktop App - Development vs Production Mode

## The Problem

After merging code changes, if you run the desktop app and don't see the latest updates, this is usually because:

1. **You're running a previously built production version** - The production build uses a static `build/` folder that doesn't automatically update when code changes
2. **Browser cache in dev mode** - Sometimes the React dev server caches old content

## The Solution

### For Development (Recommended for testing changes)

Use the development mode scripts which auto-reload on code changes:

**Linux/macOS:**
```bash
./start-desktop.sh
```

**Windows:**
```cmd
start-desktop.bat
```

Development mode:
- ✅ Auto-reloads on code changes
- ✅ Shows DevTools for debugging
- ✅ Hot module replacement
- ❌ Slightly slower startup

### For Production (Testing final build)

Use the new production mode scripts which build the app first:

**Linux/macOS:**
```bash
./start-desktop-prod.sh
```

**Windows:**
```cmd
start-desktop-prod.bat
```

Production mode:
- ✅ Faster runtime performance
- ✅ Tests the actual production build
- ❌ Requires rebuild after code changes
- ❌ No auto-reload

### For Packaged Distribution

To create a standalone installer/executable:

**Windows:**
```bash
cd frontend
npm run electron-build-win
```

**macOS:**
```bash
cd frontend
npm run electron-build-mac
```

**Linux:**
```bash
cd frontend
npm run electron-build-linux
```

**Important:** After merging code changes, you MUST rebuild using these commands to see the updates in the packaged app.

## Quick Reference

| Scenario | Command | Sees Latest Changes? | Auto-reload? |
|----------|---------|---------------------|--------------|
| Development | `./start-desktop.sh` | ✅ Yes | ✅ Yes |
| Testing build | `./start-desktop-prod.sh` | ✅ Yes (after build) | ❌ No |
| Packaged app (old) | Run installer | ❌ No | ❌ No |
| Packaged app (rebuilt) | Rebuild + Run installer | ✅ Yes | ❌ No |

## Troubleshooting

### "I merged changes but don't see them in the app"

**If using development mode (`start-desktop.sh`):**
1. Stop the app (Ctrl+C or close window)
2. Clear npm cache: `cd frontend && rm -rf node_modules/.cache`
3. Restart: `./start-desktop.sh`

**If using production mode (`start-desktop-prod.sh`):**
1. The script automatically rebuilds, so just run it again
2. Or manually: `cd frontend && npm run build && npm run electron`

**If using a packaged app:**
1. You MUST rebuild: `cd frontend && npm run electron-build-[win|mac|linux]`
2. Install the new package
3. Run it

### "The app shows old data/screens"

This is usually a **database** or **localStorage** issue, not a code issue:
- The app code is updated
- But the data in the database or browser storage is from before
- This is expected behavior - data persists across updates

To verify it's a data issue:
1. Check if the UI/menus look updated
2. Try creating new data to see if it uses the new features
3. To reset: Delete `backend/racing.db` and browser localStorage

## When to Use Each Mode

- **Daily development:** Use `start-desktop.sh` (dev mode)
- **Testing before release:** Use `start-desktop-prod.sh` (production build test)
- **Distribution to users:** Use `electron-build-*` commands (packaged installer)
