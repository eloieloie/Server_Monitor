from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os
from services.windows_monitor import WindowsMonitor

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Windows Server Monitor API",
    description="API for monitoring Windows servers via WinRM",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ServerCredentials(BaseModel):
    server: str = Field(..., description="Server IP address or hostname")
    username: str = Field(..., description="Windows username")
    password: str = Field(..., description="Windows password")
    port: int = Field(default=5985, description="WinRM port (5985 for HTTP, 5986 for HTTPS)")
    transport: str = Field(default="ntlm", description="Authentication transport (basic, ntlm, kerberos)")


@app.get("/")
async def root():
    return {
        "message": "Windows Server Monitor API",
        "version": "1.0.0",
        "endpoints": {
            "monitor": "/api/monitor (POST)"
        }
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/monitor")
async def monitor_server(credentials: ServerCredentials):
    """
    Monitor a Windows server and retrieve disk, CPU, and memory metrics.
    
    Args:
        credentials: Server connection details (server, username, password)
    
    Returns:
        Dictionary containing disk, CPU, and memory metrics
    """
    try:
        monitor = WindowsMonitor(
            server=credentials.server,
            username=credentials.username,
            password=credentials.password,
            port=credentials.port,
            transport=credentials.transport
        )
        
        # Get all metrics
        metrics = monitor.get_all_metrics()
        
        return {
            "success": True,
            "server": credentials.server,
            "data": metrics
        }
        
    except ConnectionError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Failed to connect to server: {str(e)}"
        )
    except PermissionError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error monitoring server: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    port = int(os.getenv("BACKEND_PORT", "8000"))
    
    print(f"🚀 Starting Windows Server Monitor API on {host}:{port}")
    print(f"📖 API Documentation: http://localhost:{port}/docs")
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=True
    )
