import api from "../utils/api";

const postService = {
  // Upload an image for a post (new separate step)
  uploadPostImage: async (imageFile) => {
    try {
      // Use FormData to handle file upload
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await api.post("/posts/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; // Returns { success: true, imageUrl: "url_to_image" }
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload image" };
    }
  },

  // Create a new post with optional image URL
  createPost: async (postData) => {
    try {
      // Send JSON data with content and optional image URL
      const response = await api.post("/posts", {
        content: postData.content,
        image: postData.image // This should now be the image URL from uploadPostImage
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create post" };
    }
  },

  // Get all posts with pagination
  getAllPosts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch posts" };
    }
  },

  // Get a single post by ID
  getPostById: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch post" };
    }
  },

  // Update a post with image URL
  updatePost: async (postId, postData) => {
    try {
      // Send JSON data with content and optional image URL
      const response = await api.put(`/posts/${postId}`, {
        content: postData.content,
        image: postData.image // This should now be the image URL from uploadPostImage
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update post" };
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete post" };
    }
  },

  // Like a post
  likePost: async (postId) => {
    try {
      const response = await api.put(`/posts/like/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to like post" };
    }
  },

  // Unlike a post
  unlikePost: async (postId) => {
    try {
      const response = await api.put(`/posts/unlike/${postId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to unlike post" };
    }
  },

  // Get posts by a specific user
  getPostsByUser: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(
        `/posts/user/${userId}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user posts" };
    }
  },
};

export default postService;
