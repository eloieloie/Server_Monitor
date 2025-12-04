import { useState, useEffect } from 'react';
import { Card, Table, Button, Badge, Alert, ButtonGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { getAllServers, deleteServer, updateServerLastUsed } from '../utils/serverStorage';

function SavedServersList({ onSelectServer, onRefresh }) {
  const [servers, setServers] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadServers = () => {
    const savedServers = getAllServers();
    setServers(savedServers);
  };

  useEffect(() => {
    loadServers();
  }, []);

  // Refresh when parent triggers refresh
  useEffect(() => {
    loadServers();
  }, [onRefresh]);

  const handleSelect = (server) => {
    updateServerLastUsed(server.id);
    onSelectServer({
      server: server.server,
      username: server.username,
      password: server.password,
      port: server.port,
      transport: server.transport
    });
    loadServers(); // Refresh to update "Last Used" time
  };

  const handleDelete = (serverId) => {
    if (deleteConfirm === serverId) {
      deleteServer(serverId);
      loadServers();
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(serverId);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (servers.length === 0) {
    return (
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-info text-white">
          <h5 className="mb-0">
            <i className="bi bi-bookmark me-2"></i>
            Saved Servers
          </h5>
        </Card.Header>
        <Card.Body>
          <Alert variant="info" className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            No saved servers yet. Connect to a server using the form above, and it will be saved automatically.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header className="bg-info text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-bookmark me-2"></i>
          Saved Servers ({servers.length})
        </h5>
        <Button 
          variant="light" 
          size="sm"
          onClick={loadServers}
          title="Refresh list"
        >
          <i className="bi bi-arrow-clockwise"></i>
        </Button>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Server</th>
                <th>Username</th>
                <th>Port</th>
                <th>Auth Type</th>
                <th>Last Used</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <tr key={server.id}>
                  <td>
                    <strong className="text-primary">{server.server}</strong>
                  </td>
                  <td>
                    <code className="text-secondary">{server.username}</code>
                  </td>
                  <td>
                    <Badge bg="secondary">{server.port}</Badge>
                  </td>
                  <td>
                    <Badge bg={server.transport === 'ntlm' ? 'primary' : 'warning'}>
                      {server.transport.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="text-muted small">
                    <i className="bi bi-clock me-1"></i>
                    {formatDate(server.lastUsed)}
                  </td>
                  <td className="text-center">
                    <ButtonGroup size="sm">
                      <Button
                        variant="success"
                        onClick={() => handleSelect(server)}
                        title="Monitor this server"
                      >
                        <i className="bi bi-play-circle me-1"></i>
                        Monitor
                      </Button>
                      <Button
                        variant={deleteConfirm === server.id ? 'danger' : 'outline-danger'}
                        onClick={() => handleDelete(server.id)}
                        title={deleteConfirm === server.id ? 'Click again to confirm' : 'Delete'}
                      >
                        <i className={`bi ${deleteConfirm === server.id ? 'bi-exclamation-triangle' : 'bi-trash'} me-1`}></i>
                        {deleteConfirm === server.id ? 'Confirm?' : 'Delete'}
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}

SavedServersList.propTypes = {
  onSelectServer: PropTypes.func.isRequired,
  onRefresh: PropTypes.number
};

export default SavedServersList;
