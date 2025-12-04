import { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ServerForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    server: '',
    username: '',
    password: '',
    port: '5985',
    transport: 'ntlm'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.server.trim()) {
      newErrors.server = 'Server IP or hostname is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    const port = parseInt(formData.port);
    if (!formData.port || isNaN(port) || port < 1 || port > 65535) {
      newErrors.port = 'Valid port number (1-65535) is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        port: parseInt(formData.port)
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-server me-2"></i>
          Connect to Windows Server
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="server">
                <Form.Label>Server IP / Hostname *</Form.Label>
                <Form.Control
                  type="text"
                  name="server"
                  placeholder="e.g., 192.168.1.100 or server.domain.com"
                  value={formData.server}
                  onChange={handleChange}
                  isInvalid={!!errors.server}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.server}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username *</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="e.g., Administrator or DOMAIN\user"
                  value={formData.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  For domain accounts use: DOMAIN\username
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password *</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3" controlId="port">
                <Form.Label>WinRM Port *</Form.Label>
                <Form.Control
                  type="number"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  isInvalid={!!errors.port}
                  disabled={loading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.port}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  5985 (HTTP) or 5986 (HTTPS)
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3" controlId="transport">
                <Form.Label>Auth Type</Form.Label>
                <Form.Select
                  name="transport"
                  value={formData.transport}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="ntlm">NTLM</option>
                  <option value="basic">Basic</option>
                  <option value="kerberos">Kerberos</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Connecting...
                </>
              ) : (
                <>
                  <i className="bi bi-play-circle me-2"></i>
                  Monitor Server
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

ServerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ServerForm.defaultProps = {
  loading: false
};

export default ServerForm;
