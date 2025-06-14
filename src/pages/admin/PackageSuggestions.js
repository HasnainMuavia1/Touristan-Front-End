import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Badge,
  Button,
  Form,
  Row,
  Col,
  Card,
  Pagination,
  Modal,
  Spinner,
  Nav,
  Alert,
} from "react-bootstrap";
import packageSuggestionService from "../../services/packageSuggestionService";
import SuggestionCard from "../../components/packageSuggestions/SuggestionCard";
import "./AdminSuggestions.css";

const AdminPackageSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Used for displaying error messages to the user
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [action, setAction] = useState("");
  const [feedback, setFeedback] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await packageSuggestionService.getAllSuggestions(
        status,
        page,
        limit
      );
      setSuggestions(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError("Failed to load package suggestions");
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoading(false);
    }
  }, [status, page, limit]);

  // Add useEffect to call fetchSuggestions when dependencies change
  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Status is now handled by the Nav tabs

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // Reset to first page when changing limit
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const openModal = (suggestion, actionType) => {
    setSelectedSuggestion(suggestion);
    setAction(actionType);
    setFeedback("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSuggestion(null);
    setAction("");
    setFeedback("");
  };

  const handleSubmit = async () => {
    if (!selectedSuggestion) return;

    try {
      setProcessing(true);

      if (action === "approve") {
        await packageSuggestionService.approveSuggestion(
          selectedSuggestion._id,
          feedback
        );
      } else if (action === "reject") {
        if (!feedback.trim()) {
          alert("Feedback is required when rejecting a suggestion");
          return;
        }
        await packageSuggestionService.rejectSuggestion(
          selectedSuggestion._id,
          feedback
        );
      }

      // Refresh the suggestions list
      await fetchSuggestions();
      closeModal();
    } catch (err) {
      setError(`Failed to ${action} suggestion`);
      console.error(`Error ${action}ing suggestion:`, err);
    } finally {
      setProcessing(false);
    }
  };

  // Status badges are now handled directly in the SuggestionCard component

  return (
    <Container fluid className="py-4">
      {/* Display error message if there is one */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white py-3 d-flex flex-row align-items-center justify-content-between">
          <h1 className="h3 mb-0 text-gray-800">Package Suggestions</h1>
        </Card.Header>
        <Card.Body>
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link
                active={status === "pending"}
                onClick={() => {
                  setStatus("pending");
                  setPage(1);
                }}
              >
                <i className="fas fa-clock me-1 text-warning"></i> Pending
                Review
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={status === "approved"}
                onClick={() => {
                  setStatus("approved");
                  setPage(1);
                }}
              >
                <i className="fas fa-check-circle me-1 text-success"></i>{" "}
                Approved
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={status === "rejected"}
                onClick={() => {
                  setStatus("rejected");
                  setPage(1);
                }}
              >
                <i className="fas fa-times-circle me-1 text-danger"></i> Rejected
              </Nav.Link>
            </Nav.Item>
          </Nav>

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
                  placeholder="Search suggestions..."
                  className="float-end"
                />
              </Form.Group>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading suggestions...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : suggestions.length === 0 ? (
            <Alert variant="info" className="text-center py-4">
              <i className="fas fa-info-circle fa-2x mb-3"></i>
              <h5>No {status} package suggestions found</h5>
              <p className="mb-0">When users submit new suggestions, they will appear here.</p>
            </Alert>
          ) : (
            <>
              <Row className="suggestion-card-grid">
                {suggestions.map((suggestion) => (
                  <Col key={suggestion._id} lg={4} md={6} className="mb-4">
                    <SuggestionCard 
                      suggestion={suggestion} 
                      isAdmin={true}
                      onApprove={() => openModal(suggestion, "approve")}
                      onReject={() => openModal(suggestion, "reject")}
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

      {/* Approval/Rejection Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {action === "approve" ? "Approve" : "Reject"} Package Suggestion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSuggestion && (
            <>
              <p>
                <strong>Title:</strong> {selectedSuggestion.title}
              </p>
              <p>
                <strong>User:</strong>{" "}
                {selectedSuggestion.user?.name || "Unknown User"}
              </p>

              <Form.Group className="mb-3">
                <Form.Label>
                  {action === "approve"
                    ? "Feedback (Optional)"
                    : "Feedback (Required)"}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={
                    action === "approve"
                      ? "Add any comments or feedback (optional)"
                      : "Please provide a reason for rejection"
                  }
                  required={action === "reject"}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeModal}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            variant={action === "approve" ? "success" : "danger"}
            onClick={handleSubmit}
            disabled={processing || (action === "reject" && !feedback.trim())}
          >
            {processing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : action === "approve" ? (
              "Approve"
            ) : (
              "Reject"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPackageSuggestions;
