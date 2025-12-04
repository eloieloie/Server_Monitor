import { Card, Row, Col, ProgressBar, Table, Badge } from 'react-bootstrap';
import PropTypes from 'prop-types';

function MonitorDashboard({ data, serverName }) {
  if (!data) {
    return null;
  }

  const { disk, cpu, memory } = data;

  const getProgressVariant = (percent) => {
    if (percent >= 90) return 'danger';
    if (percent >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="mt-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">
            <i className="bi bi-check-circle me-2"></i>
            Monitoring: {serverName}
          </h5>
        </Card.Header>
      </Card>

      {/* CPU Usage Card */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <i className="bi bi-cpu me-2 text-primary"></i>
                  CPU Usage
                </h5>
                <Badge bg={getProgressVariant(cpu.percent)} className="fs-6">
                  {cpu.percent.toFixed(2)}%
                </Badge>
              </div>
              <ProgressBar 
                now={cpu.percent} 
                variant={getProgressVariant(cpu.percent)}
                label={`${cpu.percent.toFixed(2)}%`}
                className="mb-2"
                style={{ height: '30px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Memory Usage Card */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <i className="bi bi-memory me-2 text-info"></i>
                  Memory Usage
                </h5>
                <Badge bg={getProgressVariant(memory.percent_used)} className="fs-6">
                  {memory.percent_used.toFixed(2)}%
                </Badge>
              </div>
              <ProgressBar 
                now={memory.percent_used} 
                variant={getProgressVariant(memory.percent_used)}
                label={`${memory.used_gb.toFixed(2)} GB / ${memory.total_gb.toFixed(2)} GB`}
                className="mb-3"
                style={{ height: '30px' }}
              />
              <Row className="text-center">
                <Col xs={4}>
                  <div className="border rounded p-2">
                    <div className="text-muted small">Total</div>
                    <div className="fw-bold">{memory.total_gb.toFixed(2)} GB</div>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="border rounded p-2">
                    <div className="text-muted small">Used</div>
                    <div className="fw-bold text-info">{memory.used_gb.toFixed(2)} GB</div>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="border rounded p-2">
                    <div className="text-muted small">Free</div>
                    <div className="fw-bold text-success">{memory.free_gb.toFixed(2)} GB</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Disk Space Card */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-hdd me-2 text-warning"></i>
                Disk Space
              </h5>
            </Card.Header>
            <Card.Body>
              {disk && disk.length > 0 ? (
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Drive</th>
                      <th>Total Size</th>
                      <th>Used</th>
                      <th>Free</th>
                      <th>Usage</th>
                      <th style={{ width: '300px' }}>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disk.map((drive, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{drive.name}</strong>
                        </td>
                        <td>{drive.total_gb.toFixed(2)} GB</td>
                        <td className="text-danger">{drive.used_gb.toFixed(2)} GB</td>
                        <td className="text-success">{drive.free_gb.toFixed(2)} GB</td>
                        <td>
                          <Badge bg={getProgressVariant(drive.percent_used)}>
                            {drive.percent_used.toFixed(2)}%
                          </Badge>
                        </td>
                        <td>
                          <ProgressBar 
                            now={drive.percent_used} 
                            variant={getProgressVariant(drive.percent_used)}
                            label={`${drive.percent_used.toFixed(1)}%`}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted mb-0">No disk information available</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

MonitorDashboard.propTypes = {
  data: PropTypes.shape({
    disk: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      total_gb: PropTypes.number.isRequired,
      used_gb: PropTypes.number.isRequired,
      free_gb: PropTypes.number.isRequired,
      percent_used: PropTypes.number.isRequired
    })),
    cpu: PropTypes.shape({
      percent: PropTypes.number.isRequired
    }),
    memory: PropTypes.shape({
      total_gb: PropTypes.number.isRequired,
      used_gb: PropTypes.number.isRequired,
      free_gb: PropTypes.number.isRequired,
      percent_used: PropTypes.number.isRequired
    })
  }),
  serverName: PropTypes.string
};

export default MonitorDashboard;
