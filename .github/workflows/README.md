# GitHub Actions Workflows

## CI Workflow

The CI workflow (`ci.yml`) runs automatically on:
- Pushes to `main` branch
- Pushes to `copilot/**` branches
- Pull requests to `main` branch

### What it does

1. **Install Dependencies**
   - Python 3.9 with backend dependencies
   - Node.js 18 with frontend dependencies

2. **Build Frontend**
   - Runs `npm run build` to create production build
   - Has a 10-minute timeout to prevent hanging

3. **Test Backend**
   - Runs the backend API test suite
   - Validates database initialization and API endpoints

### Timeout Configuration

The workflow has timeouts to prevent exit code 143 (SIGTERM):
- **Job timeout**: 15 minutes total
- **Build step timeout**: 10 minutes for frontend build

This prevents the workflow from hanging on commands that don't exit (like dev servers).

### Local Testing

To test the workflow steps locally:

```bash
# Backend tests
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
python test_api.py

# Frontend build
cd frontend
npm ci
npm run build
```

### Troubleshooting

If the workflow fails with exit code 143:
- Check for commands that don't exit (like `npm start`, `electron-dev`)
- Verify timeout values are appropriate
- Ensure all test scripts exit with proper status codes
