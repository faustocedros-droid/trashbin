# Desktop App Testing Guide

## Testing the Clean Rebuild

This document describes how to test the completely rebuilt desktop app to verify it works correctly.

## Prerequisites

Before testing, ensure you have:
- ✅ Python 3.9 or higher installed
- ✅ Node.js 16 or higher installed
- ✅ npm (comes with Node.js)

## Quick Test Steps

### 1. Test Backend Independently

First, verify the backend works correctly:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate.bat
pip install -r requirements.txt
python3 app.py
```

Expected output:
```
* Serving Flask app 'app'
* Debug mode: on
* Running on http://127.0.0.1:5000
```

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T07:10:14.665090"
}
```

Stop the backend with Ctrl+C.

### 2. Test Frontend Build

Verify the frontend can build:

```bash
cd frontend
npm install
npm run build
```

Expected: Build completes successfully, creates `build/` directory.

### 3. Test Desktop App (Development Mode)

This is the main test - running the complete desktop app:

**Linux/Mac:**
```bash
./start-desktop.sh
```

**Windows:**
```cmd
start-desktop.bat
```

Expected behavior:
1. Script checks for Python and Node.js ✓
2. Creates/activates virtual environment ✓
3. Installs dependencies ✓
4. Console shows "Starting Desktop App..." ✓
5. Backend starts (you see Flask logs) ✓
6. After ~2 seconds, desktop window opens ✓
7. Window shows Racing Car Manager with dashboard ✓

### 4. Test Navigation

Once the app is open, test all navigation:

**Using Menu:**
- File > Nuovo Evento → Should navigate to Events page
- File > Impostazioni → Should navigate to Settings page
- Visualizza > Dashboard → Should navigate to Dashboard
- Visualizza > Eventi → Should navigate to Events page
- Visualizza > Gestione Pressioni Gomme → Should navigate to Tire Pressure

**Using Keyboard Shortcuts:**
- `Ctrl+N` (Cmd+N on Mac) → Events page
- `Ctrl+D` (Cmd+D on Mac) → Dashboard
- `Ctrl+E` (Cmd+E on Mac) → Events page
- `Ctrl+T` (Cmd+T on Mac) → Tire Pressure page
- `F11` → Toggle fullscreen
- `F12` → Toggle Developer Tools

**Using In-App Navigation:**
- Click on menu items in the sidebar
- Click on cards and links
- Use browser back/forward (should work)

### 5. Test CRUD Operations

Test that all features work:

**Events:**
1. Create a new event → Should save successfully
2. View event details → Should load correctly
3. Edit event → Should update
4. Delete event → Should remove

**Sessions:**
1. Add session to event → Should create
2. View session → Should display data
3. Edit session → Should update
4. Delete session → Should remove

**Tire Pressure:**
1. Add tire data → Should save
2. View tire data → Should display
3. Edit tire data → Should update
4. Delete tire data → Should remove

**EventFullDemo:**
1. Navigate to EventFullDemo
2. Add laps → Should calculate fuel
3. View lap times → Should display correctly
4. All calculations should work

### 6. Test Error Handling

**Backend Not Available:**
1. Stop the backend (kill the Flask process)
2. Try to perform an operation that requires backend
3. Expected: Error message in console, operation fails gracefully

**Invalid Data:**
1. Try to create event with missing required fields
2. Expected: Validation error, clear message

**Network Issues:**
1. Disconnect network (if testing network features)
2. Expected: Appropriate error handling

### 7. Test Window Operations

**Resize:**
- Drag window edges → Should resize smoothly
- Minimum size is 1024x768
- Content should reflow correctly

**Minimize/Maximize:**
- Click minimize → Window minimizes to taskbar
- Click maximize → Window fills screen
- Restore → Returns to previous size

**Close:**
- Click X to close → App exits cleanly
- Backend process should stop
- No zombie processes left

### 8. Test Developer Tools

**Console:**
- Open DevTools (F12)
- Check console for errors
- Should see logs from app initialization
- Backend health check logs should be visible

**Network:**
- Open Network tab in DevTools
- Perform operations
- API calls to localhost:5000 should succeed
- Response codes should be 200/201/204

**Application Storage:**
- Check localStorage for saved data
- Should see event data persisted
- Settings should be stored

## Expected Test Results

### ✅ Pass Criteria

All of these should work:
- [x] Backend starts successfully
- [x] Backend health check responds
- [x] Frontend builds without errors
- [x] Desktop app window opens
- [x] Dashboard loads and displays
- [x] All menu navigation works
- [x] Keyboard shortcuts work
- [x] Can create/read/update/delete events
- [x] Can create/read/update/delete sessions
- [x] Tire pressure management works
- [x] EventFullDemo calculations work
- [x] Window can resize/minimize/maximize
- [x] App closes cleanly
- [x] No errors in console (except expected ones)
- [x] Backend process terminates on exit

### ❌ Fail Criteria

Any of these indicates a problem:
- [ ] Backend fails to start
- [ ] Health check returns error or timeout
- [ ] Desktop window doesn't open
- [ ] Navigation doesn't work
- [ ] Keyboard shortcuts don't work
- [ ] CRUD operations fail
- [ ] Errors in console related to core functionality
- [ ] App hangs or freezes
- [ ] Backend process doesn't terminate
- [ ] Memory leaks or performance issues

## Troubleshooting Test Failures

### Backend doesn't start

**Check Python:**
```bash
python3 --version
# Should be 3.9 or higher
```

**Check dependencies:**
```bash
cd backend
source venv/bin/activate
pip list
# Should see Flask, Flask-CORS, Flask-SQLAlchemy, etc.
```

**Check port:**
```bash
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows
# Should be empty or only show our backend
```

### Window doesn't open

**Check frontend build:**
```bash
cd frontend
ls build/
# Should see index.html, static/, etc.
```

**Check Electron:**
```bash
cd frontend
npm list electron
# Should show electron@^28.0.0
```

**Check console:**
- Look for errors in the terminal
- Common issues: port conflicts, missing files

### Navigation doesn't work

**Check React Router:**
- Open DevTools (F12)
- Check console for routing errors
- Verify hash in URL changes when navigating

**Check menu handlers:**
- Console should log when menu items are clicked
- No errors about executeJavaScript

### API calls fail

**Check backend logs:**
- Look at Flask output in terminal
- Should see GET/POST requests

**Check CORS:**
- DevTools Network tab
- Look for CORS errors
- Flask-CORS should be configured

## Performance Testing

### Startup Time

Measure how long it takes from running script to window appearing:
- Expected: 3-5 seconds
- Acceptable: Up to 10 seconds
- Problem: More than 15 seconds

### Memory Usage

Check memory consumption:
```bash
# While app is running
ps aux | grep -E "(python|electron)" | grep -v grep
```

Expected:
- Backend: ~50-100 MB
- Electron: ~200-400 MB
- Total: Under 500 MB for idle app

### CPU Usage

Should be minimal when idle:
- Backend: 0-1% when idle
- Electron: 0-2% when idle
- Spike to 10-30% during operations is normal

## Regression Testing

After any code changes, re-run these critical tests:

1. **Startup test** - Ensure app still starts
2. **Navigation test** - All routes still work
3. **CRUD test** - Can still create and manage data
4. **Close test** - App still closes cleanly

## Automated Testing

While manual testing is important, consider adding:

### Backend Tests
```bash
cd backend
pytest  # If tests exist
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
Consider adding Playwright or Selenium tests for:
- Complete user workflows
- Navigation flows
- Data persistence
- Error scenarios

## Test Report Template

After testing, document results:

```
## Desktop App Test Report

**Date:** [Date]
**Tester:** [Name]
**Platform:** [Windows/Mac/Linux]
**Python Version:** [Version]
**Node Version:** [Version]

### Test Results

- [ ] Backend startup: PASS/FAIL
- [ ] Frontend build: PASS/FAIL
- [ ] Desktop app launch: PASS/FAIL
- [ ] Navigation: PASS/FAIL
- [ ] CRUD operations: PASS/FAIL
- [ ] Window operations: PASS/FAIL
- [ ] Clean exit: PASS/FAIL

### Issues Found

1. [Issue description]
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Notes

[Any additional observations]

### Conclusion

Overall: PASS/FAIL
Recommend: Release/Fix issues first
```

## Continuous Testing

For ongoing development:

1. Test after every major change
2. Test on all target platforms regularly
3. Keep a test log to track trends
4. Automate where possible
5. Get user feedback on real usage

## Success Criteria

The desktop app rebuild is successful if:
- ✅ All manual tests pass
- ✅ No critical errors in console
- ✅ Performance is acceptable
- ✅ User experience is smooth
- ✅ All features work as expected
- ✅ App is stable (no crashes)

This validates the rebuild addresses the original problems and provides a solid foundation for the desktop application.
