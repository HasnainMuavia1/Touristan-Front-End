import React, { useState, useEffect } from 'react';
import { Container, Breadcrumb, Alert, Spinner } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SuggestionForm from '../components/packageSuggestions/SuggestionForm';
import packageSuggestionService from '../services/packageSuggestionService';

const EditSuggestion = ({ isAdmin = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        setLoading(true);
        const data = await packageSuggestionService.getSuggestionById(id);
        setSuggestion(data);
      } catch (err) {
        setError('Failed to load package suggestion. It may have been deleted or you may not have permission to view it.');
        console.error('Error fetching suggestion:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [id]);

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
            <Link 
              to={isAdmin ? "/admin/package-suggestions" : "/my-suggestions"} 
              className="btn btn-outline-danger"
              onClick={() => navigate(isAdmin ? "/admin/package-suggestions" : "/my-suggestions")}
            >
              Back to {isAdmin ? "Package Suggestions" : "My Suggestions"}
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        {isAdmin ? (
          <>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/admin/dashboard" }}>Admin</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/admin/package-suggestions" }}>Package Suggestions</Breadcrumb.Item>
          </>
        ) : (
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/my-suggestions" }}>My Suggestions</Breadcrumb.Item>
        )}
        <Breadcrumb.Item active>Edit Suggestion</Breadcrumb.Item>
      </Breadcrumb>
      
      {suggestion && <SuggestionForm initialData={suggestion} isEditing={true} isAdmin={isAdmin} />}
    </Container>
  );
};

export default EditSuggestion;
