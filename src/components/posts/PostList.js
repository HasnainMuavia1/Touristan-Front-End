import React, { useState, useEffect, useCallback } from "react";
import { Spinner, Alert, Button } from "react-bootstrap";
import PostItem from "./PostItem";
import postService from "../../services/postService";

const PostList = ({ userId = null }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      setError("");
      const limit = 10;

      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Fetch posts based on whether we want all posts or posts from a specific user
      const response = userId
        ? await postService.getPostsByUser(userId, pageNum, limit)
        : await postService.getAllPosts(pageNum, limit);

      const newPosts = response.data || [];

      if (append) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } else {
        setPosts(newPosts);
      }

      // Check if there are more posts to load
      setHasMore(newPosts.length === limit);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchPostsCallback = useCallback(fetchPosts, [userId]);

  useEffect(() => {
    fetchPostsCallback();
  }, [fetchPostsCallback]);

  const handlePostUpdated = (updatedPost, isDeleted = false, isRefreshAll = false) => {
    if (isRefreshAll) {
      // Refresh all posts by fetching from the server again
      console.log("Refreshing all posts after like/unlike action");
      fetchPosts(1, false);
      return;
    }
    
    if (isDeleted && updatedPost) {
      // Remove the deleted post from the list
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== updatedPost._id)
      );
    } else if (updatedPost) {
      // Update the modified post in the list
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    }
  };

  const handleLoadMore = () => {
    fetchPosts(page + 1, true);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (posts.length === 0) {
    return <Alert variant="info">No posts found.</Alert>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostItem
          key={post._id}
          post={post}
          onPostUpdated={handlePostUpdated}
        />
      ))}

      {hasMore && (
        <div className="text-center mb-4">
          <Button
            variant="outline-primary"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostList;
