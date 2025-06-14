import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  Spinner,
  Breadcrumb,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import packageSuggestionService from "../services/packageSuggestionService";

const SuggestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        setLoading(true);
        const data = await packageSuggestionService.getSuggestionById(id);
        setSuggestion(data?.data);
      } catch (err) {
        setError(
          "Failed to load package suggestion. It may have been deleted or you may not have permission to view it."
        );
        console.error("Error fetching suggestion:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this package suggestion?")
    ) {
      try {
        await packageSuggestionService.deleteSuggestion(id);
        navigate("/my-suggestions", {
          state: { message: "Package suggestion deleted successfully!" },
        });
      } catch (err) {
        setError("Failed to delete package suggestion. Please try again.");
        console.error("Error deleting suggestion:", err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Pending Review
          </Badge>
        );
      case "approved":
        return <Badge bg="success">Approved</Badge>;
      case "rejected":
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading suggestion details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <Link to="/my-suggestions" className="btn btn-outline-danger">
              Back to My Suggestions
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!suggestion) {
    return null;
  }

  return (
    <Container className="py-5">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/my-suggestions" }}>
          My Suggestions
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Suggestion Details</Breadcrumb.Item>
      </Breadcrumb>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{suggestion.title}</h1>
        <div>{getStatusBadge(suggestion.status)}</div>
      </div>

      <Row className="mb-5">
        <Col md={8}>
          {suggestion.img && (
            <img
              src={suggestion.img}
              alt={suggestion.title}
              className="img-fluid rounded shadow-sm mb-4"
              style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
            />
          )}

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h3 className="mb-3">Description</h3>
              <p>{suggestion.desc}</p>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h3 className="mb-3">Itinerary</h3>
              {suggestion.itinerary && suggestion.itinerary.length > 0 ? (
                suggestion.itinerary.map((day, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="d-flex align-items-center">
                      <span className="badge bg-primary me-2">
                        Day {day.day}
                      </span>
                      {day.title}
                    </h4>
                    <p className="ms-4">{day.description}</p>
                    {index < suggestion.itinerary.length - 1 && <hr />}
                  </div>
                ))
              ) : (
                <p className="text-muted">No itinerary details available</p>
              )}
            </Card.Body>
          </Card>

          {suggestion.images && suggestion.images.length > 0 && (
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <h3 className="mb-3">Gallery</h3>
                <Row>
                  {suggestion.images.map((image, index) => (
                    <Col key={index} md={4} className="mb-3">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="img-fluid rounded"
                        style={{
                          height: "150px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}

          {suggestion.adminFeedback && (
            <Card
              className={`mb-4 shadow-sm border-${
                suggestion.status === "approved" ? "success" : "danger"
              }`}
            >
              <Card.Body>
                <h3 className="mb-3">Admin Feedback</h3>
                <p>{suggestion.adminFeedback}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={4}>
          <Card className="shadow-sm sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <h3 className="mb-3">Package Details</h3>

              <div className="mb-3">
                <small className="text-muted d-block">Starting Point</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-map-marker-alt text-danger me-2"></i>
                  <span>{suggestion.startPoint}</span>
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Destinations</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-map-signs text-primary me-2"></i>
                  <span>{suggestion.destinations?.join(", ")}</span>
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Duration</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-clock text-info me-2"></i>
                  <span>{suggestion.duration}</span>
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Price per Person</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-tag text-success me-2"></i>
                  <span className="h5 mb-0">
                    PKR {suggestion.price?.toLocaleString()}
                  </span>
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <small className="text-muted d-block">Accommodation</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-hotel text-secondary me-2"></i>
                  <span>{suggestion.hostelType}</span>
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Transport</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-bus text-secondary me-2"></i>
                  <span>{suggestion.transportType}</span>
                </div>
              </div>

              <div className="mb-3">
                <small className="text-muted d-block">Meal Plan</small>
                <div className="d-flex align-items-center">
                  <i className="fas fa-utensils text-secondary me-2"></i>
                  <span>{suggestion.mealPlan}</span>
                </div>
              </div>

              <hr />

              <div className="mb-3">
                <small className="text-muted d-block">Activities</small>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {suggestion.activities?.map((activity, index) => (
                    <Badge
                      key={index}
                      bg="light"
                      text="dark"
                      className="py-2 px-3"
                    >
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>

              <hr />

              <div className="d-grid gap-2">
                <Button
                  as={Link}
                  to={`/my-suggestions/edit/${suggestion._id}`}
                  variant="outline-primary"
                >
                  <i className="fas fa-edit me-2"></i>
                  Edit Suggestion
                </Button>

                <Button variant="outline-danger" onClick={handleDelete}>
                  <i className="fas fa-trash-alt me-2"></i>
                  Delete Suggestion
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SuggestionDetail;
