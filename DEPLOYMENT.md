# Deployment Guide - Racing Car Management Application

## Deployment Options

This application can be deployed in three ways:

1. **Desktop App** (Recommended for end users) - Standalone application with auto-starting backend
2. **Web App - Separate Deployment** - Backend and frontend deployed separately
3. **Web App - Single Server** - Backend serves static frontend files

## Desktop App Deployment

See [DESKTOP_APP_README.md](DESKTOP_APP_README.md) for detailed desktop app documentation.

### Quick Start

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

The backend API will be available at `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

## Production Deployment

### Backend (Flask API)

#### Option 1: Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create new Heroku app
heroku create your-app-name

# Add buildpack
heroku buildpacks:set heroku/python

# Deploy
git push heroku main

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
```

#### Option 2: Docker

Create a `Dockerfile` in the backend directory:

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

Build and run:
```bash
docker build -t racing-car-backend .
docker run -p 5000:5000 racing-car-backend
```

### Frontend (React App)

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

#### Option 2: Netlify

```bash
# Build the app
npm run build

# Deploy build folder to Netlify
# Or connect your GitHub repository in Netlify dashboard
```

#### Option 3: Build and serve static files

```bash
cd frontend
npm run build

# The build folder can be served by any static file server
# Example with serve:
npm install -g serve
serve -s build
```

## Environment Variables

### Backend (.env file in backend directory)

```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///racing.db
ONEDRIVE_CLIENT_ID=your-onedrive-client-id
ONEDRIVE_CLIENT_SECRET=your-onedrive-client-secret
```

### Frontend (.env file in frontend directory)

```
REACT_APP_API_URL=http://localhost:5000/api
# For production:
# REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Database Setup

The application uses SQLite by default, which creates a `racing.db` file automatically.

For production, consider using PostgreSQL:

```bash
# Install PostgreSQL adapter
pip install psycopg2-binary

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost/racing_db
```

## OneDrive Integration (Future Feature)

To enable OneDrive archiving:

1. Register an application in Azure AD
2. Get client ID and client secret
3. Add credentials to backend .env file
4. Implement OAuth2 flow in the backend

## Monitoring and Logs

### Backend Logs

```bash
# View logs on Heroku
heroku logs --tail

# Local development
python app.py  # Logs will appear in console
```

### Frontend Logs

Check browser console for frontend errors and warnings.

## Backup and Restore

### Database Backup

```bash
# SQLite
cp backend/racing.db backup/racing_backup_$(date +%Y%m%d).db

# PostgreSQL
pg_dump racing_db > backup/racing_backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
# SQLite
cp backup/racing_backup_20250930.db backend/racing.db

# PostgreSQL
psql racing_db < backup/racing_backup_20250930.sql
```

## Troubleshooting

### Backend Issues

**Issue:** `ImportError: No module named 'flask'`
**Solution:** Activate virtual environment and install dependencies

```bash
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**Issue:** Database errors
**Solution:** Delete the database file and restart the app to recreate tables

```bash
rm backend/racing.db
python backend/app.py
```

### Frontend Issues

**Issue:** `Cannot connect to backend`
**Solution:** Check that backend is running and REACT_APP_API_URL is correct

**Issue:** Build errors
**Solution:** Clear cache and reinstall dependencies

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Security Considerations

1. **Never commit secrets**: Use environment variables for sensitive data
2. **Use HTTPS**: Always use HTTPS in production
3. **Set strong SECRET_KEY**: Generate a random secure key for production
4. **Update dependencies**: Regularly update packages to patch vulnerabilities
5. **Input validation**: Backend validates all inputs, but always sanitize user data
6. **CORS**: Configure CORS properly for your production domain

## Performance Optimization

1. **Database indexing**: Add indexes for frequently queried fields
2. **Caching**: Implement Redis for session and data caching
3. **CDN**: Use CDN for frontend static assets
4. **Compression**: Enable gzip compression on the server
5. **Lazy loading**: Implement code splitting in React

## Support

For issues and questions:
- Check the README.md for basic usage
- Review the formule_estratte.txt for Excel formula reference
- Check application logs for error messages
