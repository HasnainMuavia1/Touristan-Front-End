import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
  Form,
  Nav,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import SuggestionCard from "../components/packageSuggestions/SuggestionCard";
import packageSuggestionService from "../services/packageSuggestionService";
import { useNavigate } from "react-router-dom";

const MySuggestions = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchMySuggestions();
  }, []);

  // Filter suggestions when suggestions array or active filter changes
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions(
        suggestions.filter((suggestion) => suggestion.status === activeFilter)
      );
    }
  }, [suggestions, activeFilter]);

  const fetchMySuggestions = async () => {
    try {
      setLoading(true);
      const data = await packageSuggestionService.getMySuggestions();
      setSuggestions(data?.data);
    } catch (err) {
      setError(
        "Failed to load your package suggestions. Please try again later."
      );
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this package suggestion?")
    ) {
      try {
        await packageSuggestionService.deleteSuggestion(id);
        setSuggestions(
          suggestions.filter((suggestion) => suggestion._id !== id)
        );
        setDeleteSuccess("Package suggestion deleted successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => {
          setDeleteSuccess("");
        }, 3000);
      } catch (err) {
        setError("Failed to delete package suggestion. Please try again.");
        console.error("Error deleting suggestion:", err);

        // Clear error message after 3 seconds
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-0">My Package Suggestions</h1>
          <p className="text-muted">Manage your package suggestions</p>
        </div>
        <Button
          as={Link}
          to="/create-suggestion"
          variant="primary"
          onClick={() => navigate("/create-suggestion")}
        >
          <i className="fas fa-plus-circle me-2"></i>
          Create New Suggestion
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {deleteSuccess && <Alert variant="success">{deleteSuccess}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading your suggestions...</p>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center my-5 py-5 bg-light rounded">
          <i className="fas fa-mountain fa-3x text-muted mb-3"></i>
          <h3>No Package Suggestions Yet</h3>
          <p className="text-muted mb-4">
            You haven't created any package suggestions yet. Share your travel
            ideas with us!
          </p>
          <Button as={Link} to="/create-suggestion" variant="primary">
            Create Your First Suggestion
          </Button>
        </div>
      ) : (
        <>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link
                    active={activeFilter === "all"}
                    onClick={() => setActiveFilter("all")}
                  >
                    <i className="fas fa-list me-2"></i>
                    All Suggestions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeFilter === "pending"}
                    onClick={() => setActiveFilter("pending")}
                  >
                    <i className="fas fa-clock me-2 text-warning"></i>
                    Pending Review
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeFilter === "approved"}
                    onClick={() => setActiveFilter("approved")}
                  >
                    <i className="fas fa-check-circle me-2 text-success"></i>
                    Approved
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={activeFilter === "rejected"}
                    onClick={() => setActiveFilter("rejected")}
                  >
                    <i className="fas fa-times-circle me-2 text-danger"></i>
                    Rejected
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Form>
                <Row>
                  <Col md={6} className="ms-auto">
                    <Form.Group className="mb-0">
                      <Form.Control
                        type="text"
                        placeholder="Search suggestions..."
                        className="float-end"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Row>
            {filteredSuggestions?.length === 0 ? (
              <Col xs={12}>
                <div className="text-center my-5 py-5 bg-light rounded">
                  <i className="fas fa-filter fa-3x text-muted mb-3"></i>
                  <h3>
                    No {activeFilter !== "all" ? activeFilter : ""} Suggestions
                    Found
                  </h3>
                  <p className="text-muted">
                    {activeFilter !== "all"
                      ? `You don't have any ${activeFilter} package suggestions.`
                      : "You don't have any package suggestions yet."}
                  </p>
                </div>
              </Col>
            ) : (
              filteredSuggestions?.map((suggestion) => (
                <Col key={suggestion._id} lg={4} md={6} className="mb-4">
                  <SuggestionCard
                    suggestion={suggestion}
                    onDelete={handleDelete}
                  />
                </Col>
              ))
            )}
          </Row>
        </>
      )}
    </Container>
  );
};

export default MySuggestions;
