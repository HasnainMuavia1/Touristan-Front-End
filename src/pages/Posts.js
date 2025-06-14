import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import PostForm from '../components/posts/PostForm';
import PostList from '../components/posts/PostList';
import authService from '../services/authService';

const Posts = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshPosts, setRefreshPosts] = useState(false);
  
  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);
  
  const handlePostCreated = (newPost) => {
    // Trigger a refresh of the post list
    setRefreshPosts(prev => !prev);
  };
  
  return (
    <Container className="py-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <h2 className="mb-4">Community Posts</h2>
          
          {!isAuthenticated && (
            <Alert variant="info" className="mb-4">
              Please <Alert.Link href="/login">login</Alert.Link> to create posts and like content.
            </Alert>
          )}
          
          {isAuthenticated && (
            <PostForm onPostCreated={handlePostCreated} />
          )}
          
          <PostList key={refreshPosts} />
        </Col>
      </Row>
    </Container>
  );
};

export default Posts;
