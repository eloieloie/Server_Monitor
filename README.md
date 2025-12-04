# Windows Server Monitor

A web application to remotely monitor Windows servers' disk space, CPU usage, and memory usage using WinRM (Windows Remote Management).

## Features

- Monitor multiple Windows servers remotely
- Real-time metrics for:
  - Disk space usage
  - CPU utilization
  - Memory usage
- Simple web interface with server credential input
- Secure WinRM protocol communication

## Tech Stack

**Frontend:**
- React (with Vite)
- Bootstrap 5
- Axios

**Backend:**
- Python 3.8+
- FastAPI
- pywinrm

## Prerequisites

### On Your Development Machine:
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### On Target Windows Servers:
WinRM must be enabled and configured. Run these PowerShell commands as Administrator on each Windows server:

```powershell
# Enable PowerShell Remoting
Enable-PSRemoting -Force

# Set WinRM service to start automatically
Set-Service WinRM -StartMode Automatic

# Start WinRM service
Start-Service WinRM

# Configure WinRM to allow Basic authentication (for testing only)
Set-Item WSMan:\localhost\Service\Auth\Basic -Value $true

# Allow unencrypted traffic (for testing only - use HTTPS in production)
Set-Item WSMan:\localhost\Service\AllowUnencrypted -Value $true

# Configure firewall rule
New-NetFirewallRule -Name "WinRM HTTP" -DisplayName "WinRM HTTP" -Enabled True -Direction Inbound -Protocol TCP -LocalPort 5985 -Action Allow

# Test WinRM
Test-WSMan
```

**For Production:** Use HTTPS (port 5986) and NTLM/Kerberos authentication instead of Basic auth.

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python3 -m venv venv
```

3. Activate the virtual environment:
```bash
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Copy `.env.example` to `.env` and configure if needed:
```bash
cp ../.env.example .env
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Option 1: Start Both Servers Automatically (Recommended)

**Using Batch Script (Windows):**
```bash
# From the project root directory
start-servers.bat
```

**Using PowerShell Script (Windows):**
```powershell
# From the project root directory
.\start-servers.ps1
```

**Using npm (from frontend directory):**
```bash
cd frontend
npm run dev
```

This will automatically start:
- Frontend at `http://localhost:5173`
- Backend at `http://localhost:8000`

Both servers will run concurrently and you can stop them both with `Ctrl+C`.

### Option 2: Start Servers Manually

#### Start Backend Server

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend will run on `http://localhost:8000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev:frontend-only
```

Frontend will run on `http://localhost:5173`

## Usage

1. Open your browser to `http://localhost:5173`
2. Enter the Windows server details:
   - **Server IP/Hostname:** The IP address or hostname of the Windows server
   - **Username:** Windows username (use `DOMAIN\username` for domain accounts)
   - **Password:** Windows password
3. Click **"Monitor Server"** button
4. View the server metrics displayed in cards

## API Endpoints

### POST /api/monitor

Monitor a Windows server and retrieve metrics.

**Request Body:**
```json
{
  "server": "192.168.1.100",
  "username": "Administrator",
  "password": "YourPassword"
}
```

**Response:**
```json
{
  "server": "192.168.1.100",
  "disk": [
    {
      "name": "C:",
      "used_gb": 45.2,
      "free_gb": 54.8,
      "total_gb": 100.0,
      "percent_used": 45.2
    }
  ],
  "cpu": {
    "percent": 35.5
  },
  "memory": {
    "total_gb": 16.0,
    "used_gb": 8.5,
    "free_gb": 7.5,
    "percent_used": 53.1
  }
}
```

## Security Considerations

⚠️ **Important Security Notes:**

1. **Never commit credentials** to version control
2. **Use HTTPS** in production (port 5986 instead of 5985)
3. **Use NTLM or Kerberos** authentication instead of Basic auth
4. **Implement authentication** on the web application
5. **Use environment variables** for sensitive configuration
6. **Enable SSL certificate validation** in production

## Troubleshooting

### Connection Refused / Timeout
- Verify WinRM is running: `Test-WSMan -ComputerName <server>`
- Check firewall allows port 5985 (HTTP) or 5986 (HTTPS)
- Ensure network connectivity to target server

### Authentication Failed
- Verify username and password are correct
- For domain accounts, use format: `DOMAIN\username`
- Check WinRM authentication settings on target server

### "Access Denied" Errors
- Ensure user has administrative privileges on target server
- Check UAC settings if using local administrator account

## License

MIT License
