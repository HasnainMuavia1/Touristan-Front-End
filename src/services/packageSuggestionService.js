import api from "../utils/api";

const packageSuggestionService = {
  // Upload main image and get URL (separate step)
  uploadMainImageOnly: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await api.post("/posts/upload-main-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; // Should return {success: true, imageUrl: "url"}
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload main image" };
    }
  },

  // Upload additional images and get URLs (separate step)
  uploadAdditionalImagesOnly: async (formData) => {
    try {
      // If formData is not a FormData instance (backward compatibility)
      if (!(formData instanceof FormData)) {
        console.log('Converting array to FormData');
        const newFormData = new FormData();
        // Append each image file to the form data
        for (let i = 0; i < formData.length; i++) {
          newFormData.append("images", formData[i]);
        }
        formData = newFormData;
      }

      console.log('Sending request to upload additional images');
      const response = await api.post("/posts/upload-sub-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Response from server:', response.data);
      return response.data; // Should return {success: true, imageUrls: ["url1", "url2"]}
    } catch (error) {
      console.error('Error in uploadAdditionalImagesOnly:', error);
      throw (
        error.response?.data || { message: "Failed to upload additional images" }
      );
    }
  },

  // Create a new package suggestion
  createSuggestion: async (suggestionData) => {
    try {
      const response = await api.post("/package-suggestions", suggestionData);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to create package suggestion",
        }
      );
    }
  },

  // Get all package suggestions for the current user
  getMySuggestions: async () => {
    try {
      const response = await api.get("/package-suggestions/my-suggestions");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch your package suggestions",
        }
      );
    }
  },

  // Get a specific package suggestion
  getSuggestionById: async (id) => {
    try {
      const response = await api.get(`/package-suggestions/${id}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch package suggestion",
        }
      );
    }
  },

  // Update a package suggestion
  updateSuggestion: async (id, suggestionData) => {
    try {
      const response = await api.put(
        `/package-suggestions/${id}`,
        suggestionData
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to update package suggestion",
        }
      );
    }
  },

  // Delete a package suggestion
  deleteSuggestion: async (id) => {
    try {
      const response = await api.delete(`/package-suggestions/${id}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to delete package suggestion",
        }
      );
    }
  },

  // Upload main image for a package suggestion
  uploadMainImage: async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await api.put(
        `/package-suggestions/${id}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload main image" };
    }
  },

  // Upload multiple images for a package suggestion
  uploadImages: async (id, imageFiles) => {
    try {
      const formData = new FormData();

      // Append each image file to the form data
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
      }

      const response = await api.put(
        `/package-suggestions/${id}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to upload images" };
    }
  },

  // Admin: Get all package suggestions with optional filters
  getAllSuggestions: async (status = "pending", page = 1, limit = 10) => {
    try {
      const response = await api.get(`/package-suggestions/admin`, {
        params: { status, page, limit },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to fetch package suggestions",
        }
      );
    }
  },

  // Admin: Approve a package suggestion
  approveSuggestion: async (id, adminFeedback = "") => {
    try {
      const response = await api.put(`/package-suggestions/${id}/approve`, {
        adminFeedback,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to approve package suggestion",
        }
      );
    }
  },

  // Admin: Reject a package suggestion
  rejectSuggestion: async (id, adminFeedback) => {
    try {
      const response = await api.put(`/package-suggestions/${id}/reject`, {
        adminFeedback,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Failed to reject package suggestion",
        }
      );
    }
  },
};

export default packageSuggestionService;
