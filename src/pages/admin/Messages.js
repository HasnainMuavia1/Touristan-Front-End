import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Badge, Button, Spinner, Form, Row, Col, Pagination, Modal } from 'react-bootstrap';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, [page, limit]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // This would be replaced with an actual API call
      // const response = await api.get(`/admin/messages?page=${page}&limit=${limit}`);
      
      // Mock data for now
      setTimeout(() => {
        const mockMessages = Array(5).fill().map((_, i) => ({
          _id: `msg-${i + 1}`,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          subject: `Message Subject ${i + 1}`,
          message: `This is a sample message content ${i + 1}. It would contain the user's inquiry or feedback.`,
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          read: i % 2 === 0
        }));
        
        setMessages(mockMessages);
        setTotalPages(3); // Mock total pages
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const viewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Mark as read logic would go here
    // if (!message.read) {
    //   markAsRead(message._id);
    // }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">User Messages</h1>
      
      {/* Display error message if there is one */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Items Per Page</Form.Label>
                <Form.Select value={limit} onChange={handleLimitChange}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={9} className="d-flex align-items-end justify-content-end mb-3">
              <Button variant="primary" onClick={fetchMessages}>
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <Card className="text-center p-5 shadow-sm">
          <Card.Body>
            <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
            <h3>No messages found</h3>
            <p className="text-muted">
              There are currently no user messages in the system.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm">
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th style={{ width: '20%' }}>Name</th>
                  <th style={{ width: '20%' }}>Email</th>
                  <th style={{ width: '30%' }}>Subject</th>
                  <th style={{ width: '15%' }}>Date</th>
                  <th style={{ width: '5%' }}>Status</th>
                  <th style={{ width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message._id} className={!message.read ? 'table-light fw-bold' : ''}>
                    <td>{message.name}</td>
                    <td>{message.email}</td>
                    <td>{message.subject}</td>
                    <td>{formatDate(message.createdAt)}</td>
                    <td>
                      {message.read ? (
                        <Badge bg="secondary">Read</Badge>
                      ) : (
                        <Badge bg="primary">New</Badge>
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        onClick={() => viewMessage(message)}
                      >
                        <i className="fas fa-eye me-1"></i> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          
          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First 
                onClick={() => handlePageChange(1)} 
                disabled={page === 1}
              />
              <Pagination.Prev 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
              />
              
              {[...Array(totalPages).keys()].map((num) => (
                <Pagination.Item
                  key={num + 1}
                  active={num + 1 === page}
                  onClick={() => handlePageChange(num + 1)}
                >
                  {num + 1}
                </Pagination.Item>
              ))}
              
              <Pagination.Next 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
              />
              <Pagination.Last 
                onClick={() => handlePageChange(totalPages)} 
                disabled={page === totalPages}
              />
            </Pagination>
          </div>
        </>
      )}
      
      {/* Message Detail Modal */}
      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Message Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <>
              <div className="mb-3 p-3 border-bottom">
                <div className="d-flex justify-content-between">
                  <h5 className="mb-1">{selectedMessage.subject}</h5>
                  <small>{formatDate(selectedMessage.createdAt)}</small>
                </div>
                <div className="mb-2">
                  <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                </div>
              </div>
              
              <div className="p-3">
                <p style={{ whiteSpace: 'pre-line' }}>{selectedMessage.message}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={closeModal}>
            Mark as Read
          </Button>
          <Button variant="danger">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminMessages;
