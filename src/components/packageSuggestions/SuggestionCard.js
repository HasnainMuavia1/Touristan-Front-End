import React, { useState } from 'react';
import { Card, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SuggestionCard.css';

const SuggestionCard = ({ suggestion, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning" text="dark" className="status-badge pending"><i className="fas fa-clock me-1"></i> Pending Review</Badge>;
      case 'approved':
        return <Badge bg="success" className="status-badge approved"><i className="fas fa-check-circle me-1"></i> Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger" className="status-badge rejected"><i className="fas fa-times-circle me-1"></i> Rejected</Badge>;
      default:
        return <Badge bg="secondary" className="status-badge">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card 
      className={`suggestion-card mb-4 ${isHovered ? 'card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="suggestion-img-container">
        {suggestion.img ? (
          <Card.Img 
            variant="top" 
            src={suggestion.img} 
            alt={suggestion.title} 
            className="suggestion-img"
          />
        ) : (
          <div className="suggestion-img-placeholder">
            <i className="fas fa-mountain fa-3x text-muted"></i>
          </div>
        )}
        {suggestion.status && (
          <div className="suggestion-status">
            {getStatusBadge(suggestion.status)}
          </div>
        )}
        <div className="suggestion-overlay">
          <Link to={`/my-suggestions/${suggestion._id}`} className="overlay-btn">
            <i className="fas fa-eye"></i>
          </Link>
        </div>
      </div>
      
      <Card.Body>
        <div className="created-date mb-2">
          <i className="far fa-calendar-alt me-1"></i> {formatDate(suggestion.createdAt)}
        </div>
        
        <Card.Title className="suggestion-title">{suggestion.title}</Card.Title>
        
        <div className="suggestion-details mb-3">
          <div className="detail-item">
            <i className="fas fa-map-marker-alt text-danger"></i>
            <span>{suggestion.startPoint}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-clock text-primary"></i>
            <span>{suggestion.duration}</span>
          </div>
          <div className="detail-item">
            <i className="fas fa-tag text-success"></i>
            <span>PKR {suggestion.price?.toLocaleString()}</span>
          </div>
        </div>
        
        <Card.Text className="suggestion-desc">
          {suggestion.desc?.length > 100 
            ? `${suggestion.desc.substring(0, 100)}...` 
            : suggestion.desc}
        </Card.Text>
        
        {suggestion.adminFeedback && (
          <div className="admin-feedback mt-2">
            <div className="feedback-header">
              <i className="fas fa-comment-dots me-1"></i>
              <span>Admin Feedback</span>
            </div>
            <p className="mb-0">{suggestion.adminFeedback}</p>
          </div>
        )}
      </Card.Body>
      
      <Card.Footer className="bg-white border-0 action-footer">
        <div className="d-flex justify-content-between align-items-center">
          <Link 
            to={`/my-suggestions/${suggestion._id}`} 
            className="btn-action view-btn"
          >
            <i className="fas fa-eye"></i>
            <span>View</span>
          </Link>
          
          <div className="action-group">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Edit Suggestion</Tooltip>}
            >
              <Link 
                to={`/my-suggestions/edit/${suggestion._id}`} 
                className="btn-action edit-btn"
              >
                <i className="fas fa-edit"></i>
              </Link>
            </OverlayTrigger>
            
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Delete Suggestion</Tooltip>}
            >
              <Button 
                className="btn-action delete-btn"
                onClick={() => onDelete(suggestion._id)}
              >
                <i className="fas fa-trash-alt"></i>
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default SuggestionCard;
