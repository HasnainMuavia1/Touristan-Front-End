import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Breadcrumb, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import SuggestionForm from "../components/packageSuggestions/SuggestionForm";

const CreateSuggestion = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 className="m-0">Suggest a Package</h3>
                  <p className="text-muted mt-2 mb-0">
                    Suggest a new travel package for consideration by our team
                  </p>
                </div>
                <div>
                  <Button
                    as={Link}
                    to="/my-suggestions"
                    variant="outline-secondary"
                    className="me-2"
                  >
                    ← 
                    Back to My Suggestions
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleShowModal}
                    className="d-flex align-items-center"
                  >
                    + 
                    Create New Suggestion
                  </Button>
                </div>
              </div>

              <div className="bg-light p-4 rounded">
                <h4>How Package Suggestions Work</h4>
                <p>
                  Our community-driven approach allows travelers like you to suggest new package ideas.
                  Here's how it works:
                </p>
                <ol>
                  <li>
                    <strong>Create a Suggestion</strong> - Fill out the form with your package idea, including destinations, activities, and images.
                  </li>
                  <li>
                    <strong>Review Process</strong> - Our team will review your suggestion for feasibility and alignment with our offerings.
                  </li>
                  <li>
                    <strong>Approval & Implementation</strong> - If approved, your suggestion may be converted into an official package.
                  </li>
                  <li>
                    <strong>Recognition</strong> - Contributors whose suggestions become packages receive special benefits and recognition.
                  </li>
                </ol>
                <p className="mb-0">
                  Ready to share your travel expertise? Click the "Create New Suggestion" button to get started!
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Create Suggestion Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Create Package Suggestion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SuggestionForm onComplete={handleCloseModal} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CreateSuggestion;
