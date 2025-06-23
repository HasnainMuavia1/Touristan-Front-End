import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PostList from '../components/posts/PostList';
import api from '../utils/api';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // Assuming there's an endpoint to get user details
        const response = await api.get(`/api/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} md={5} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Image 
                src={user?.avatar || 'https://via.placeholder.com/150'} 
                roundedCircle 
                width={150} 
                height={150} 
                className="mb-3"
              />
              <h3>{user?.name}</h3>
              <p className="text-muted">{user?.email}</p>
              
              {user?.bio && (
                <div className="mt-3">
                  <h6>Bio</h6>
                  <p>{user.bio}</p>
                </div>
              )}
              
              <div className="mt-3">
                <div className="d-flex justify-content-around">
                  <div>
                    <h5>{user?.postCount || 0}</h5>
                    <small className="text-muted">Posts</small>
                  </div>
                  <div>
                    <h5>{user?.followerCount || 0}</h5>
                    <small className="text-muted">Followers</small>
                  </div>
                  <div>
                    <h5>{user?.followingCount || 0}</h5>
                    <small className="text-muted">Following</small>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8} md={7}>
          <h4 className="mb-4">Posts by {user?.name}</h4>
          <PostList userId={userId} />
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
