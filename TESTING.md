# Testing Guide

## Prerequisites for Testing

This application connects to **Windows servers** via **WinRM (Windows Remote Management)**. Since you're running on macOS, you need an actual Windows server to test against.

## Option 1: Test with a Real Windows Server

### On Your Windows Server:

1. **Enable WinRM** (run PowerShell as Administrator):
```powershell
Enable-PSRemoting -Force
Set-Service WinRM -StartMode Automatic
Start-Service WinRM
Set-Item WSMan:\localhost\Service\Auth\Basic -Value $true
Set-Item WSMan:\localhost\Service\AllowUnencrypted -Value $true
New-NetFirewallRule -Name "WinRM HTTP" -DisplayName "WinRM HTTP" -Enabled True -Direction Inbound -Protocol TCP -LocalPort 5985 -Action Allow
Test-WSMan
```

2. **Get your Windows server's IP address**:
```powershell
ipconfig
```

### Test from the Application:

- **Server IP**: Your Windows server IP (e.g., `192.168.1.100`)
- **Username**: `Administrator` or `DOMAIN\username`
- **Password**: Your Windows password
- **Port**: `5985`
- **Auth Type**: Try `basic` first, then `ntlm`

## Option 2: Test with a Windows VM

### Using VirtualBox or VMware:

1. Install Windows Server or Windows 10/11 in a VM
2. Configure network adapter as "Bridged" or "NAT" with port forwarding
3. Enable WinRM in the VM (see commands above)
4. Use the VM's IP address in the application

## Option 3: Test Backend API Directly

Test if the backend is working by checking the API docs:

1. Open: **http://localhost:8000/docs**
2. Click on `POST /api/monitor`
3. Click "Try it out"
4. Enter test credentials
5. See the detailed error response

## Common Testing Issues

### ❌ "Cannot reach server" or "Timeout"
- **Cause**: Server is not reachable or WinRM is not running
- **Solution**: 
  - Ping the server: `ping <server-ip>`
  - Check WinRM is running on Windows: `Test-WSMan`
  - Verify firewall allows port 5985

### ❌ "Authentication failed"
- **Cause**: Wrong username or password
- **Solution**:
  - Verify credentials work: Try logging into Windows with them
  - For domain accounts use: `DOMAIN\username`
  - Try local admin account first

### ❌ "Connection refused"
- **Cause**: WinRM is not enabled or port is blocked
- **Solution**: Run the WinRM setup commands on Windows server

### ❌ "503 Service Unavailable"
- **Cause**: Backend can't connect to the Windows server
- **Solution**: Check backend logs for specific error message

## Viewing Backend Logs

Check the terminal where the backend is running for detailed error messages. You'll see specific errors like:

```
INFO: 127.0.0.1:63430 - "POST /api/monitor HTTP/1.1" 503 Service Unavailable
```

Look at the error details in the response for more information.

## Quick Test Command

From your Mac terminal, test if the Windows server is reachable:

```bash
# Test if server is reachable
ping <windows-server-ip>

# Test if WinRM port is open
nc -zv <windows-server-ip> 5985
```

## Alternative: Mock Server for UI Testing

If you just want to test the UI without a Windows server, I can create a mock backend that returns fake data. Let me know if you'd like this option!
