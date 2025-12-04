@echo off
REM Server Monitor - Start Both Frontend and Backend Servers
echo ============================================
echo Starting Server Monitor Application
echo ============================================
echo.

REM Check if Node.js is in PATH
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Adding Node.js to PATH...
    set "PATH=%PATH%;C:\Program Files\nodejs"
)

REM Check if Python is available
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)

REM Navigate to frontend directory
cd /d "%~dp0frontend"

echo.
echo Starting Frontend (React + Vite) and Backend (FastAPI + Uvicorn)...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Run both servers using npm script
npm run dev

pause
