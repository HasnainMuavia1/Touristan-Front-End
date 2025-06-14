import React, { useState, useEffect, useCallback } from 'react';
import { Container, Badge, Button, Row, Col, Card, Pagination, Spinner, Alert, Form } from 'react-bootstrap';
import packageSuggestionService from '../../services/packageSuggestionService';
import SuggestionCard from '../../components/packageSuggestions/SuggestionCard';
import './AdminSuggestions.css';

const ApprovedSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch approved suggestions
  const fetchApprovedSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await packageSuggestionService.getAllSuggestions('approved', page, limit);
      setSuggestions(response.data || []);
      setTotalPages(response.totalPages || 1);
      setError('');
    } catch (err) {
      console.error('Error fetching approved suggestions:', err);
      setError('Failed to load approved suggestions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchApprovedSuggestions();
  }, [fetchApprovedSuggestions]);

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // Reset to first page when changing limit
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Container fluid className="py-4">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white py-3 d-flex flex-row align-items-center justify-content-between">
          <h1 className="h3 mb-0 text-gray-800">Approved Package Suggestions</h1>
          <Button variant="outline-primary" onClick={() => fetchApprovedSuggestions()}>
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Items per page:</Form.Label>
                <Form.Select 
                  value={limit} 
                  onChange={handleLimitChange}
                  style={{ width: "100px" }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search approved suggestions..."
                  className="float-end"
                />
              </Form.Group>
            </Col>
          </Row>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading approved suggestions...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : suggestions.length === 0 ? (
            <Alert variant="info" className="text-center py-5">
              <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
              <h3>No approved suggestions yet</h3>
              <p className="text-muted mb-0">When you approve package suggestions, they will appear here.</p>
            </Alert>
          ) : (
            <>
              <Row className="suggestion-card-grid">
                {suggestions.map((suggestion) => (
                  <Col key={suggestion._id} lg={4} md={6} className="mb-4">
                    <SuggestionCard 
                      suggestion={suggestion} 
                      isAdmin={true}
                      viewLink={`/admin/edit-suggestion/${suggestion._id}`}
                    />
                  </Col>
                ))}
              </Row>
              
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div>
                  Showing {suggestions.length} of {totalPages * limit} entries
                </div>
                <Pagination>
                  <Pagination.Prev
                    onClick={() => page > 1 && handlePageChange(page - 1)}
                    disabled={page === 1}
                  />

                  {[...Array(totalPages).keys()].map((number) => (
                    <Pagination.Item
                      key={number + 1}
                      active={number + 1 === page}
                      onClick={() => handlePageChange(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  ))}

                  <Pagination.Next
                    onClick={() =>
                      page < totalPages && handlePageChange(page + 1)
                    }
                    disabled={page === totalPages}
                  />
                </Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ApprovedSuggestions;
