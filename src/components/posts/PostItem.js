import React, { useState } from "react";
import { Card, Button, Image } from "react-bootstrap";
import { format } from "timeago.js";
import postService from "../../services/postService";
import authService from "../../services/authService";

const PostItem = ({ post, onPostUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);
  const currentUser = authService.getCurrentUser();

  // Check if the current user has liked this post
  const hasLiked =
    currentUser &&
    currentPost.likes &&
    currentPost.likes.some((like) => like.user._id === currentUser.id);

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please login to like posts");
      return;
    }
    
    setLoading(true);
    try {
      // Perform the like/unlike action
      if (hasLiked) {
        // User already liked the post, so unlike it
        await postService.unlikePost(currentPost._id);
        console.log("Post unliked successfully");
      } else {
        // User hasn't liked the post yet, so like it
        await postService.likePost(currentPost._id);
        console.log("Post liked successfully");
      }
      
      // Notify parent component to refresh ALL posts
      // Pass null with isRefreshAll=true to trigger a full refresh
      if (onPostUpdated) {
        onPostUpdated(null, false, true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = currentUser && currentUser?.id === currentPost?.user?._id;

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Image
            src={
              currentPost?.user?.profileImage ||
              "https://via.placeholder.com/40"
            }
            roundedCircle
            width={40}
            height={40}
            className="me-2"
          />
          <div>
            <h6 className="mb-0">{currentPost?.user?.name}</h6>
            <small className="text-muted">
              {format(currentPost.createdAt)}
            </small>
          </div>
        </div>

        <Card.Text>{currentPost?.content}</Card.Text>

        {currentPost?.image && (
          <div className="mb-3">
            <img
              src={currentPost?.image}
              alt="Post"
              className="img-fluid rounded"
              style={{ maxHeight: "400px" }}
            />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Button
              variant={hasLiked ? "primary" : "outline-primary"}
              size="sm"
              onClick={handleLike}
              disabled={loading}
            >
              <i className="bi bi-heart-fill me-1"></i>
              {currentPost?.likes ? currentPost?.likes?.length : 0}{" "}
              {hasLiked ? "Liked" : "Like"}
            </Button>
          </div>

          {isOwner && (
            <div>
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this post?")
                  ) {
                    postService
                      .deletePost(currentPost?._id)
                      .then(() => {
                        if (onPostUpdated) {
                          onPostUpdated(null, true);
                        }
                      })
                      .catch((error) =>
                        console.error("Error deleting post:", error)
                      );
                  }
                }}
              >
                <i className="bi bi-trash"></i> Delete
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default PostItem;
