# Server Monitor - Development Configuration
# INSTRUCTIONS: Update the paths below to match your system

# Python executable path - Update this to your actual Python installation
# Common locations:
# - C:\Python312\python.exe
# - C:\Python311\python.exe  
# - C:\Program Files\Python312\python.exe
# - %LOCALAPPDATA%\Programs\Python\Python312\python.exe
$PYTHON_PATH = "python"  # Change this to full path if python is not in PATH

# Node.js is automatically detected in C:\Program Files\nodejs
# If installed elsewhere, update this:
$NODE_PATH = "C:\Program Files\nodejs"

# Export for scripts to use
$env:PYTHON_CMD = $PYTHON_PATH
$env:NODE_PATH = $NODE_PATH

Write-Host "Configuration loaded!" -ForegroundColor Green
Write-Host "Python: $PYTHON_PATH" -ForegroundColor Cyan
Write-Host "Node.js: $NODE_PATH" -ForegroundColor Cyan
