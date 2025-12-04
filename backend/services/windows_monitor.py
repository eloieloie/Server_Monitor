import winrm
from typing import Dict, List, Any
import re


class WindowsMonitor:
    """
    Windows Server monitoring service using WinRM (Windows Remote Management).
    Connects to remote Windows servers and executes PowerShell commands to gather metrics.
    """
    
    def __init__(self, server: str, username: str, password: str, port: int = 5985, transport: str = "ntlm"):
        """
        Initialize Windows monitoring service.
        
        Args:
            server: Server IP address or hostname
            username: Windows username (use DOMAIN\\username for domain accounts)
            password: Windows password
            port: WinRM port (5985 for HTTP, 5986 for HTTPS)
            transport: Authentication transport (basic, ntlm, kerberos, credssp)
        """
        self.server = server
        self.username = username
        self.password = password
        self.port = port
        self.transport = transport
        self.session = None
        
    def _get_session(self):
        """Create and return a WinRM session."""
        if self.session is None:
            try:
                endpoint = f"http://{self.server}:{self.port}/wsman"
                self.session = winrm.Session(
                    endpoint,
                    auth=(self.username, self.password),
                    transport=self.transport,
                    server_cert_validation='ignore',
                    operation_timeout_sec=10,
                    read_timeout_sec=15
                )
            except Exception as e:
                raise ConnectionError(f"Failed to establish WinRM connection: {str(e)}")
        return self.session
    
    def execute_powershell(self, script: str) -> str:
        """
        Execute a PowerShell script on the remote server.
        
        Args:
            script: PowerShell script to execute
            
        Returns:
            Command output as string
            
        Raises:
            ConnectionError: If connection fails
            PermissionError: If authentication fails
        """
        try:
            session = self._get_session()
            result = session.run_ps(script)
            
            if result.status_code != 0:
                error_msg = result.std_err.decode('utf-8') if result.std_err else "Unknown error"
                if "Access is denied" in error_msg or "authentication" in error_msg.lower():
                    raise PermissionError(f"Authentication failed: {error_msg}")
                raise Exception(f"PowerShell script failed: {error_msg}")
            
            return result.std_out.decode('utf-8')
            
        except winrm.exceptions.InvalidCredentialsError:
            raise PermissionError("Invalid username or password")
        except Exception as e:
            error_str = str(e).lower()
            if "connection refused" in error_str or "timed out" in error_str or "unreachable" in error_str:
                raise ConnectionError(f"Cannot reach server {self.server}:{self.port}. Ensure WinRM is enabled and firewall allows connections.")
            if "nodename nor servname provided" in error_str or "name or service not known" in error_str:
                raise ConnectionError(f"Cannot resolve hostname '{self.server}'. Please check the server address.")
            if "401" in error_str or "unauthorized" in error_str:
                raise PermissionError("Authentication failed. Check username and password.")
            raise ConnectionError(f"WinRM connection error: {str(e)}")
    
    def get_disk_info(self) -> List[Dict[str, Any]]:
        """
        Get disk space information for all drives.
        
        Returns:
            List of dictionaries containing disk information
        """
        script = """
        Get-PSDrive -PSProvider FileSystem | Where-Object {$_.Used -ne $null} | ForEach-Object {
            $totalGB = [math]::Round($_.Used / 1GB + $_.Free / 1GB, 2)
            $usedGB = [math]::Round($_.Used / 1GB, 2)
            $freeGB = [math]::Round($_.Free / 1GB, 2)
            $percentUsed = if ($totalGB -gt 0) { [math]::Round(($usedGB / $totalGB) * 100, 2) } else { 0 }
            
            Write-Output "$($_.Name)|$usedGB|$freeGB|$totalGB|$percentUsed"
        }
        """
        
        output = self.execute_powershell(script)
        disks = []
        
        for line in output.strip().split('\n'):
            if line.strip() and '|' in line:
                parts = line.strip().split('|')
                if len(parts) == 5:
                    disks.append({
                        "name": parts[0],
                        "used_gb": float(parts[1]),
                        "free_gb": float(parts[2]),
                        "total_gb": float(parts[3]),
                        "percent_used": float(parts[4])
                    })
        
        return disks
    
    def get_cpu_info(self) -> Dict[str, float]:
        """
        Get CPU usage percentage.
        
        Returns:
            Dictionary containing CPU metrics
        """
        script = """
        $cpu = Get-Counter '\\Processor(_Total)\\% Processor Time' -SampleInterval 1 -MaxSamples 1
        $cpuPercent = [math]::Round($cpu.CounterSamples[0].CookedValue, 2)
        Write-Output $cpuPercent
        """
        
        output = self.execute_powershell(script)
        cpu_percent = float(output.strip())
        
        return {
            "percent": cpu_percent
        }
    
    def get_memory_info(self) -> Dict[str, float]:
        """
        Get memory usage information.
        
        Returns:
            Dictionary containing memory metrics
        """
        script = """
        $os = Get-WmiObject Win32_OperatingSystem
        $totalGB = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)
        $freeGB = [math]::Round($os.FreePhysicalMemory / 1MB, 2)
        $usedGB = [math]::Round($totalGB - $freeGB, 2)
        $percentUsed = [math]::Round(($usedGB / $totalGB) * 100, 2)
        
        Write-Output "$totalGB|$usedGB|$freeGB|$percentUsed"
        """
        
        output = self.execute_powershell(script)
        parts = output.strip().split('|')
        
        if len(parts) == 4:
            return {
                "total_gb": float(parts[0]),
                "used_gb": float(parts[1]),
                "free_gb": float(parts[2]),
                "percent_used": float(parts[3])
            }
        
        raise Exception("Failed to parse memory information")
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """
        Get all monitoring metrics (disk, CPU, memory).
        
        Returns:
            Dictionary containing all metrics
        """
        return {
            "disk": self.get_disk_info(),
            "cpu": self.get_cpu_info(),
            "memory": self.get_memory_info()
        }
