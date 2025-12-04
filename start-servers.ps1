# Server Monitor - Start Both Frontend and Backend Servers
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Starting Server Monitor Application" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Add Node.js to PATH if not already there
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Adding Node.js to PATH..." -ForegroundColor Yellow
    $env:Path += ";C:\Program Files\nodejs"
}

# Check if Python is available
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8 or higher" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $scriptDir "frontend"

# Navigate to frontend directory
Set-Location $frontendDir

Write-Host ""
Write-Host "Starting Frontend (React + Vite) and Backend (FastAPI + Uvicorn)..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Run both servers using npm script
& npm run dev
