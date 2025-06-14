import React, { useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import postService from "../../services/postService";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  // We keep the image file for UI purposes only, the actual API uses imageUrl
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate that the file is an image
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
    ];

    if (!validImageTypes.includes(file.type)) {
      setError("Only image files are allowed (JPEG, PNG, GIF, WEBP, SVG, BMP)");
      e.target.value = null; // Reset the file input
      return;
    }

    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload the image immediately
    try {
      setUploadingImage(true);
      setError("");

      // First step: Upload the image
      const uploadResult = await postService.uploadPostImage(file);
      console.log(uploadResult);
      if (uploadResult.success && uploadResult.imageUrl) {
        console.log("Image uploaded successfully");
        setImageUrl(uploadResult.imageUrl);
        setImage(file); // Keep the file reference for UI purposes
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      setError(err.message || "Failed to upload image. Please try again.");
      removeImage(); // Clear the image if upload fails
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Second step: Create post with content and image URL (if available)
      const newPost = await postService.createPost({
        content,
        image: imageUrl, // Now using the image URL from the upload step
      });

      // Reset form
      setContent("");
      setImage(null);
      setImageUrl("");
      setPreview("");
      setSuccess("Post created successfully!");

      // Notify parent component about the new post
      if (onPostCreated) {
        onPostCreated(newPost);
      }
    } catch (err) {
      setError(err.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl(""); // Clear the uploaded image URL
    setPreview("");
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h5 className="mb-3">Create a Post</h5>

        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess("")} dismissible>
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          {preview && (
            <div className="position-relative mb-3">
              <img
                src={preview}
                alt="Preview"
                className="img-fluid rounded"
                style={{ maxHeight: "200px" }}
              />
              {uploadingImage && (
                <div className="position-absolute top-50 start-50 translate-middle bg-dark bg-opacity-50 rounded p-3">
                  <Spinner
                    animation="border"
                    variant="light"
                    size="sm"
                    className="me-2"
                  />
                  <span className="text-white">Uploading...</span>
                </div>
              )}
              <Button
                variant="danger"
                size="sm"
                className="position-absolute top-0 end-0 m-2"
                onClick={removeImage}
                disabled={uploadingImage}
              >
                &times;
              </Button>
            </div>
          )}

          <div className="d-flex justify-content-between">
            <Form.Group>
              <Form.Label className="btn btn-outline-secondary mb-0">
                <i className="bi bi-image me-2"></i>Add Image
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </Form.Label>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || uploadingImage || !content.trim()}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Posting...
                </>
              ) : imageUrl ? (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Post with Image
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostForm;
