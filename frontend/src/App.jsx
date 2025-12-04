import { useState } from 'react';
import axios from 'axios';
import { Container, Alert, Spinner, Button } from 'react-bootstrap';
import ServerForm from './components/ServerForm';
import MonitorDashboard from './components/MonitorDashboard';
import SavedServersList from './components/SavedServersList';
import { saveServer } from './utils/serverStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [monitorData, setMonitorData] = useState(null);
  const [serverName, setServerName] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMonitorServer = async (credentials) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setMonitorData(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/monitor`, credentials, {
        timeout: 60000, // 60 second timeout for initial connection
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setMonitorData(response.data.data);
        setServerName(response.data.server);
        setSuccess(`Successfully connected to ${response.data.server}`);
        
        // Save server credentials to localStorage
        try {
          saveServer(credentials);
          setRefreshKey(prev => prev + 1); // Trigger saved servers list refresh
        } catch (saveError) {
          console.error('Failed to save server:', saveError);
        }
        
        // Scroll to results
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      let errorMessage = 'Failed to connect to server';

      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. The server took too long to respond.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Make sure the backend server is running on http://localhost:8000';
      } else if (err.response) {
        // Server responded with error
        errorMessage = err.response.data.detail || err.response.data.message || errorMessage;
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'No response from server. Is the backend running?';
      }

      setError(errorMessage);
      console.error('Monitor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshMonitor = () => {
    if (serverName && monitorData) {
      // Re-fetch data for current server
      const lastCredentials = {
        server: serverName,
        username: '',
        password: '',
        port: 5985,
        transport: 'ntlm'
      };
      // Note: We don't have stored credentials for security, 
      // user needs to reconnect or we need to handle this differently
      setSuccess('Click "Monitor" on a saved server to refresh its data');
    }
  };

  return (
    <div className="app-wrapper">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">
            <i className="bi bi-display me-3"></i>
            Windows Server Monitor
          </h1>
          <p className="lead text-muted">
            Monitor disk space, CPU usage, and memory of remote Windows servers
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert 
            variant="danger" 
            dismissible 
            onClose={() => setError(null)}
            className="shadow-sm"
          >
            <Alert.Heading>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Connection Error
            </Alert.Heading>
            <p className="mb-0">{error}</p>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert 
            variant="success" 
            dismissible 
            onClose={() => setSuccess(null)}
            className="shadow-sm"
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
          </Alert>
        )}

        {/* Server Form */}
        <ServerForm onSubmit={handleMonitorServer} loading={loading} />

        {/* Saved Servers List */}
        <div className="my-4">
          <SavedServersList 
            onSelectServer={handleMonitorServer} 
            onRefresh={refreshKey}
          />
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 text-muted">Connecting to server and fetching metrics...</p>
          </div>
        )}

        {/* Monitor Dashboard */}
        {monitorData && !loading && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Server Metrics</h4>
              <Button 
                variant="primary" 
                onClick={handleRefreshMonitor}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Data
              </Button>
            </div>
            <MonitorDashboard data={monitorData} serverName={serverName} />
          </>
        )}
      </Container>

      {/* Footer */}
      <footer className="text-center text-muted py-4 mt-5">
        <Container>
          <small>
            Windows Server Monitor v1.0 | Built with React + FastAPI + pywinrm
          </small>
        </Container>
      </footer>
    </div>
  );
}

export default App;
