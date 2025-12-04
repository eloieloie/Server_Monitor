# Quick Start Guide

## Starting the Application

### 1. Start the Backend (Python FastAPI)

Open a terminal and run:

```bash
cd backend

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the backend server
python app.py
```

Backend will be available at: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

### 2. Start the Frontend (React + Vite)

Open a **new terminal** and run:

```bash
cd frontend

# Install dependencies (first time only - if not already done)
npm install

# Start the development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

### 3. Access the Application

Open your browser and go to: **http://localhost:5173**

## Using the Application

1. Enter your Windows server details:
   - **Server IP/Hostname**: e.g., `192.168.1.100` or `server.domain.com`
   - **Username**: e.g., `Administrator` or `DOMAIN\username` for domain accounts
   - **Password**: Your Windows password
   - **WinRM Port**: Default is `5985` (HTTP) or `5986` (HTTPS)
   - **Auth Type**: Choose `NTLM` (recommended), `Basic`, or `Kerberos`

2. Click **"Monitor Server"** button

3. View the real-time metrics:
   - CPU usage percentage
   - Memory usage with detailed breakdown
   - Disk space for all drives

## Prerequisites on Windows Servers

Before monitoring, ensure WinRM is enabled on your Windows servers. Run these commands as Administrator:

```powershell
# Enable PowerShell Remoting
Enable-PSRemoting -Force

# Configure WinRM
Set-Service WinRM -StartMode Automatic
Start-Service WinRM

# For testing - allow Basic auth (use NTLM in production)
Set-Item WSMan:\localhost\Service\Auth\Basic -Value $true

# Configure firewall
New-NetFirewallRule -Name "WinRM HTTP" -DisplayName "WinRM HTTP" -Enabled True -Direction Inbound -Protocol TCP -LocalPort 5985 -Action Allow

# Test WinRM
Test-WSMan
```

## Troubleshooting

### Backend Issues

**"Module not found" errors:**
```bash
cd backend
source venv/bin/activate  # Make sure virtual environment is activated
pip install -r requirements.txt
```

**Note for macOS users:** If you see `python: command not found`, use `python3` instead:
```bash
python3 -m venv venv
```

**"Port already in use":**
- Change the port in `backend/.env` file
- Or stop the process using port 8000

### Frontend Issues

**"Network error" or "No response from server":**
- Make sure backend is running on http://localhost:8000
- Check backend terminal for errors

**"Connection timeout":**
- Verify Windows server is reachable
- Check WinRM is enabled on target server
- Verify firewall allows port 5985/5986

**Authentication failed:**
- Verify username and password
- For domain accounts, use format: `DOMAIN\username`
- Check Windows user has administrative privileges

## Project Structure

```
Server_Monitor/
├── backend/                    # Python FastAPI backend
│   ├── app.py                 # Main FastAPI application
│   ├── services/
│   │   └── windows_monitor.py # WinRM monitoring service
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ServerForm.jsx        # Server connection form
│   │   │   └── MonitorDashboard.jsx  # Metrics display
│   │   ├── App.jsx            # Main application component
│   │   └── App.css            # Application styles
│   └── package.json           # Node.js dependencies
├── .gitignore
└── README.md
```

## Next Steps

- Configure HTTPS for production (port 5986)
- Use NTLM or Kerberos authentication instead of Basic auth
- Implement user authentication for the web application
- Add real-time monitoring with auto-refresh
- Set up monitoring for multiple servers simultaneously
- Add historical data and charts
