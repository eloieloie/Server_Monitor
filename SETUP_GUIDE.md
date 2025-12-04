# Setup Guide - Auto-Start Frontend and Backend

## Overview
The Server Monitor application can now automatically start both the frontend (React) and backend (FastAPI) servers with a single command!

## Quick Start

### Method 1: Using npm (Recommended)
```bash
cd frontend
npm run dev
```

This starts BOTH servers:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Method 2: Using PowerShell Script
```powershell
.\start-servers.ps1
```

### Method 3: Using Batch File (Windows)
```cmd
start-servers.bat
```

## Troubleshooting

### Issue: Python not found

**Solution 1: Add Python to PATH**
1. Find your Python installation (e.g., `C:\Python312`)
2. Add it to system PATH:
   - Windows: System Properties → Environment Variables → Path → Add Python directory

**Solution 2: Create Python alias**
```powershell
# In PowerShell (as Administrator)
Set-Alias python "C:\Path\To\Your\Python\python.exe"
```

**Solution 3: Update package.json directly**
Edit `frontend/package.json`, find the `dev:backend` script and replace `python` with your full Python path:
```json
"dev:backend": "cd ../backend && C:\\Python312\\python.exe -m uvicorn app:app --reload --host 127.0.0.1 --port 8000"
```

### Issue: Node/npm not found

**Solution: Add Node.js to PATH**
1. Find your Node.js installation (usually `C:\Program Files\nodejs`)
2. Add it to system PATH
3. Restart your terminal

### Issue: Port already in use

**Frontend (Port 5173):**
- Vite will automatically try the next available port (5174, 5175, etc.)
- Or kill the process using port 5173:
```powershell
# Find process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess
# Kill it
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -Force
```

**Backend (Port 8000):**
```powershell
# Find and kill process on port 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
```

### Issue: Backend dependencies not installed

```bash
cd backend
pip install -r requirements.txt
```

### Issue: Frontend dependencies not installed

```bash
cd frontend
npm install
```

## Manual Startup (Alternative)

If auto-start doesn't work, you can start servers manually in separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev:frontend-only
```

## npm Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend AND backend |
| `npm run dev:frontend-only` | Start only frontend |
| `npm run dev:frontend` | Start frontend (used internally) |
| `npm run dev:backend` | Start backend (used internally) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

## How It Works

The setup uses the `concurrently` npm package to run multiple commands simultaneously:

1. **Frontend**: Vite development server on port 5173
2. **Backend**: Uvicorn/FastAPI server on port 8000

Both servers run in watch mode and will automatically reload when you make changes to the code.

## Stopping the Servers

Press `Ctrl+C` in the terminal where the servers are running. This will stop both servers automatically.

## Production Deployment

For production, you'll want to:

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Serve the backend with a production server:**
```bash
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

3. **Serve the frontend build:**
   - Use Nginx, Apache, or any static file server
   - Point it to `frontend/dist` directory

## Need Help?

- Check that Python 3.8+ is installed: `python --version`
- Check that Node.js 16+ is installed: `node --version`
- Check that npm is installed: `npm --version`
- Verify backend dependencies: `pip list`
- Verify frontend dependencies: `npm list --depth=0`
