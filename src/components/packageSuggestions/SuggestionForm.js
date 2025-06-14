import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import packageSuggestionService from "../../services/packageSuggestionService";
import "./SuggestionToast.css";

const SuggestionForm = ({
  initialData,
  isEditing = false,
  isAdmin = false,
  onComplete = null,
}) => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    startPoint: "",
    destinations: "",
    duration: "",
    price: "",
    hostelType: "",
    transportType: "",
    mealPlan: "",
    activities: "",
    coordinates: [{ place: "", lat: "", lng: "" }],
    itinerary: [{ day: 1, title: "", description: "" }],
  });

  // Image state
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  // Image upload state
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [additionalImageUrls, setAdditionalImageUrls] = useState([]);
  const [mainImageUploaded, setMainImageUploaded] = useState(false);
  const [additionalImagesUploaded, setAdditionalImagesUploaded] =
    useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [toastIcon, setToastIcon] = useState("check-circle");

  useEffect(() => {
    // If editing, populate form with initial data
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || "",
        desc: initialData.desc || "",
        startPoint: initialData.startPoint || "",
        destinations: initialData.destinations
          ? initialData.destinations.join(", ")
          : "",
        duration: initialData.duration || "",
        price: initialData.price || "",
        hostelType: initialData.hostelType || "",
        transportType: initialData.transportType || "",
        mealPlan: initialData.mealPlan || "",
        activities: initialData.activities
          ? initialData.activities.join(", ")
          : "",
        coordinates: initialData.coordinates || [
          { place: "", lat: "", lng: "" },
        ],
        itinerary: initialData.itinerary || [
          { day: 1, title: "", description: "" },
        ],
      });

      // Set image previews if available
      if (initialData.img) {
        setMainImagePreview(initialData.img);
      }

      if (initialData.images && initialData.images.length > 0) {
        setAdditionalImagePreviews(initialData.images);
      }
    }
  }, [isEditing, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
      setMainImageUploaded(false); // Reset upload status when new image is selected
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setAdditionalImages((prevImages) => [...prevImages, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setAdditionalImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newPreviews,
      ]);
      setAdditionalImagesUploaded(false); // Reset upload status when new images are selected
    }
  };

  // Upload main image separately
  const handleUploadMainImage = async () => {
    if (!mainImage) {
      setToastMessage("Please select a main image first");
      setToastVariant("danger");
      setToastIcon("exclamation-circle");
      setShowToast(true);
      return;
    }

    setUploadLoading(true);
    try {
      const result = await packageSuggestionService.uploadMainImageOnly(
        mainImage
      );
      if (result && result.imageUrl) {
        setMainImageUrl(result.imageUrl);
        setMainImageUploaded(true);
        setToastMessage("Main image uploaded successfully");
        setToastVariant("success");
        setShowToast(true);
        console.log("Main image URL:", result.imageUrl); // Debug log
      } else {
        throw new Error("Failed to upload main image");
      }
    } catch (err) {
      console.error("Main image upload error:", err); // Debug log
      setToastMessage(
        "Failed to upload main image: " + (err.message || "Unknown error")
      );
      setToastVariant("danger");
      setToastIcon("exclamation-triangle");
      setShowToast(true);
    } finally {
      setUploadLoading(false);
    }
  };

  // Upload additional images separately
  const handleUploadAdditionalImages = async () => {
    if (additionalImages.length === 0) {
      setToastMessage("Please select additional images first");
      setToastVariant("danger");
      setToastIcon("exclamation-circle");
      setShowToast(true);
      return;
    }

    setUploadLoading(true);
    try {
      console.log(
        "Uploading additional images, count:",
        additionalImages.length
      ); // Debug log

      // Create a new FormData instance
      const formData = new FormData();

      // Append each image file to the form data with the correct field name
      for (let i = 0; i < additionalImages.length; i++) {
        formData.append("image", additionalImages[i]);
        console.log("Appended image:", additionalImages[i].name); // Debug log
      }

      // Call the service with the FormData object
      const result = await packageSuggestionService.uploadAdditionalImagesOnly(
        formData
      );
      console.log("Additional images upload result:", result); // Debug log

      if (result && result.imageUrl) {
        setAdditionalImageUrls(result.imageUrl);
        setAdditionalImagesUploaded(true);
        setToastMessage("Additional images uploaded successfully");
        setToastVariant("success");
        setToastIcon("check-circle");
        setShowToast(true);
        console.log("Additional image URLs:", result.imageUrls); // Debug log
      } else {
        throw new Error("Failed to upload additional images");
      }
    } catch (err) {
      console.error("Additional images upload error:", err); // Debug log
      setToastMessage(
        "Failed to upload additional images: " +
          (err.message || "Unknown error")
      );
      setToastVariant("danger");
      setToastIcon("exclamation-triangle");
      setShowToast(true);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCoordinateChange = (index, field, value) => {
    const updatedCoordinates = [...formData.coordinates];
    updatedCoordinates[index] = {
      ...updatedCoordinates[index],
      [field]: value,
    };
    setFormData({ ...formData, coordinates: updatedCoordinates });
  };

  const addCoordinate = () => {
    setFormData({
      ...formData,
      coordinates: [...formData.coordinates, { place: "", lat: "", lng: "" }],
    });
  };

  const removeCoordinate = (index) => {
    const updatedCoordinates = [...formData.coordinates];
    updatedCoordinates.splice(index, 1);
    setFormData({ ...formData, coordinates: updatedCoordinates });
  };

  const handleItineraryChange = (index, field, value) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary[index] = {
      ...updatedItinerary[index],
      [field]: value,
    };
    setFormData({ ...formData, itinerary: updatedItinerary });
  };

  const addItineraryDay = () => {
    const newDay = formData.itinerary.length + 1;
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: newDay, title: "", description: "" },
      ],
    });
  };

  const removeItineraryDay = (index) => {
    const updatedItinerary = [...formData.itinerary];
    updatedItinerary.splice(index, 1);

    // Renumber days
    const renumberedItinerary = updatedItinerary.map((item, idx) => ({
      ...item,
      day: idx + 1,
    }));

    setFormData({ ...formData, itinerary: renumberedItinerary });
  };

  // Create suggestion with already uploaded image URLs
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check if images have been uploaded
    if (!isEditing) {
      if (!mainImageUploaded) {
        setToastMessage("Please upload the main image first");
        setToastVariant("danger");
        setToastIcon("exclamation-circle");
        setShowToast(true);
        return;
      }

      if (!additionalImagesUploaded) {
        setToastMessage("Please upload additional images first");
        setToastVariant("danger");
        setToastIcon("exclamation-circle");
        setShowToast(true);
        return;
      }
    }

    setLoading(true);

    try {
      // Format data for API
      const formattedData = {
        ...formData,
        destinations: formData.destinations
          .split(",")
          .map((dest) => dest.trim()),
        activities: formData.activities
          .split(",")
          .map((activity) => activity.trim()),
        price: parseFloat(formData.price),
      };

      if (isEditing) {
        // For editing, use the existing image URLs or the newly uploaded ones
        const updatedData = {
          ...formattedData,
          img: mainImageUploaded ? mainImageUrl : initialData.img,
          images: additionalImagesUploaded
            ? [additionalImageUrls]
            : initialData.images || [],
        };

        // Update the suggestion with the new data
        await packageSuggestionService.updateSuggestion(
          initialData._id,
          updatedData
        );

        setSuccess("Package suggestion updated successfully!");
        setToastMessage("Package suggestion updated successfully!");
        setToastVariant("success");
        setToastIcon("check-circle");
      } else {
        // For new suggestions, use the uploaded image URLs
        const suggestionWithImages = {
          ...formattedData,
          img: mainImageUrl,
          images: [additionalImageUrls],
        };

        // Create the suggestion with the image URLs included
        console.log("Creating new suggestion with data:", suggestionWithImages);
        const result = await packageSuggestionService.createSuggestion(
          suggestionWithImages
        );
        console.log("Create suggestion result:", result);

        setSuccess("Package suggestion created successfully!");
        setToastMessage("Package suggestion created successfully!");
        setToastVariant("success");
        setToastIcon("check-circle");

        // Reset form after successful creation
        setFormData({
          title: "",
          desc: "",
          startPoint: "",
          destinations: "",
          duration: "",
          price: "",
          hostelType: "",
          transportType: "",
          mealPlan: "",
          activities: "",
          coordinates: [{ place: "", lat: "", lng: "" }],
          itinerary: [{ day: 1, title: "", description: "" }],
        });
        setMainImage(null);
        setMainImagePreview("");
        setAdditionalImages([]);
        setAdditionalImagePreviews([]);
        setMainImageUrl("");
        setAdditionalImageUrls([]);
        setMainImageUploaded(false);
        setAdditionalImagesUploaded(false);
      }

      setShowToast(true);

      // Call onComplete callback if provided, otherwise redirect
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        // Redirect to appropriate page after a delay
        setTimeout(() => {
          if (isAdmin) {
            navigate("/admin/package-suggestions");
          } else {
            navigate("/my-suggestions");
          }
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to submit package suggestion";
      setError(errorMessage);
      setToastMessage(errorMessage);
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-end"
        className="p-3 custom-toast-container"
        style={{ zIndex: 1060 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
          bg={toastVariant}
          className={`custom-toast toast-${toastVariant} ${showToast ? 'toast-show' : ''}`}
        >
          <Toast.Header closeButton className={`toast-header-${toastVariant}`}>
            <i className={`fas fa-${toastIcon} me-2`}></i>
            <strong className="me-auto">
              {toastVariant === "danger" ? "Error" : toastVariant === "warning" ? "Warning" : "Success"}
            </strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === "danger" || toastVariant === "success" ? "text-white" : ""}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="mb-4">
            {isEditing
              ? "Edit Package Suggestion"
              : "Create Package Suggestion"}
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a catchy title"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Starting Point</Form.Label>
                  <Form.Control
                    type="text"
                    name="startPoint"
                    value={formData.startPoint}
                    onChange={handleChange}
                    placeholder="Where does the trip start?"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                placeholder="Describe the package in detail"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Destinations</Form.Label>
                  <Form.Control
                    type="text"
                    name="destinations"
                    value={formData.destinations}
                    onChange={handleChange}
                    placeholder="Comma-separated list of destinations"
                    required
                  />
                  <Form.Text className="text-muted">
                    Separate multiple destinations with commas (e.g., Murree,
                    Nathiagali)
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 3 days, 2 nights"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (PKR)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price per person"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Accommodation Type</Form.Label>
                  <Form.Select
                    name="hostelType"
                    value={formData.hostelType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select accommodation type</option>
                    <option value="Budget">Budget</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Luxury">Luxury</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Transport Type</Form.Label>
                  <Form.Select
                    name="transportType"
                    value={formData.transportType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select transport type</option>
                    <option value="Economy Bus">Economy Bus</option>
                    <option value="Luxury Bus">Luxury Bus</option>
                    <option value="Hiace">Hiace</option>
                    <option value="Car">Car</option>
                    <option value="Jeep">Jeep</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Meal Plan</Form.Label>
                  <Form.Select
                    name="mealPlan"
                    value={formData.mealPlan}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select meal plan</option>
                    <option value="No Meals">No Meals</option>
                    <option value="Breakfast Only">Breakfast Only</option>
                    <option value="Breakfast and Dinner">
                      Breakfast and Dinner
                    </option>
                    <option value="All Meals">All Meals</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Activities</Form.Label>
                  <Form.Control
                    type="text"
                    name="activities"
                    value={formData.activities}
                    onChange={handleChange}
                    placeholder="Comma-separated list of activities"
                    required
                  />
                  <Form.Text className="text-muted">
                    Separate multiple activities with commas (e.g., Hiking,
                    Photography)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mt-4 mb-3">Location Coordinates</h4>
            {formData.coordinates.map((coord, index) => (
              <div key={`coord-${index}`} className="border rounded p-3 mb-3">
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Place Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={coord.place}
                        onChange={(e) =>
                          handleCoordinateChange(index, "place", e.target.value)
                        }
                        placeholder="e.g., Murree"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control
                        type="text"
                        value={coord.lat}
                        onChange={(e) =>
                          handleCoordinateChange(index, "lat", e.target.value)
                        }
                        placeholder="e.g., 33.9078"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        type="text"
                        value={coord.lng}
                        onChange={(e) =>
                          handleCoordinateChange(index, "lng", e.target.value)
                        }
                        placeholder="e.g., 73.3943"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2} className="d-flex align-items-end mb-3">
                    {formData.coordinates.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeCoordinate(index)}
                        className="w-100"
                      >
                        <i className="fas fa-trash-alt"></i> Remove
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            ))}

            <Button
              variant="outline-primary"
              onClick={addCoordinate}
              className="mb-4"
            >
              <i className="fas fa-plus-circle"></i> Add Another Location
            </Button>

            <h4 className="mt-4 mb-3">Itinerary</h4>
            {formData.itinerary.map((day, index) => (
              <div key={`day-${index}`} className="border rounded p-3 mb-3">
                <h5>Day {day.day}</h5>
                <Row>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={day.title}
                        onChange={(e) =>
                          handleItineraryChange(index, "title", e.target.value)
                        }
                        placeholder="e.g., Arrival in Murree"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={day.description}
                        onChange={(e) =>
                          handleItineraryChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Describe the day's activities"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={2} className="d-flex align-items-end mb-3">
                    {formData.itinerary.length > 1 && (
                      <Button
                        variant="outline-danger"
                        onClick={() => removeItineraryDay(index)}
                        className="w-100"
                      >
                        <i className="fas fa-trash-alt"></i> Remove
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            ))}

            <Button
              variant="outline-primary"
              onClick={addItineraryDay}
              className="mb-4"
            >
              <i className="fas fa-plus-circle"></i> Add Another Day
            </Button>

            <h4 className="mt-4 mb-3">Images</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    Main Image{" "}
                    {!isEditing && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    required={!isEditing}
                  />
                  {mainImagePreview && (
                    <div className="mt-2">
                      <img
                        src={mainImagePreview}
                        alt="Main preview"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                  <Button
                    variant="outline-primary"
                    className="mt-2"
                    onClick={handleUploadMainImage}
                    disabled={!mainImage || uploadLoading || mainImageUploaded}
                  >
                    {uploadLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Uploading...</span>
                      </>
                    ) : mainImageUploaded ? (
                      <>
                        <i className="bi bi-check-circle"></i>
                        <span className="ms-2">Uploaded</span>
                      </>
                    ) : (
                      "Upload Main Image"
                    )}
                  </Button>
                  {mainImageUploaded && (
                    <div className="text-success mt-1">
                      <small>Main image uploaded successfully!</small>
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Additional Images{" "}
                    {!isEditing && <span className="text-danger">*</span>}
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                  />
                  {additionalImagePreviews.length > 0 && (
                    <div className="mt-2 d-flex flex-wrap">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="me-2 mb-2">
                          <img
                            src={preview}
                            alt={`Additional ${index + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline-primary"
                    className="mt-2"
                    onClick={handleUploadAdditionalImages}
                    disabled={
                      additionalImages.length === 0 ||
                      uploadLoading ||
                      additionalImagesUploaded
                    }
                  >
                    {uploadLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Uploading...</span>
                      </>
                    ) : additionalImagesUploaded ? (
                      <>
                        <i className="bi bi-check-circle"></i>
                        <span className="ms-2">Uploaded</span>
                      </>
                    ) : (
                      "Upload Additional Images"
                    )}
                  </Button>
                  {additionalImagesUploaded && (
                    <div className="text-success mt-1">
                      <small>Additional images uploaded successfully!</small>
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate("/my-suggestions")}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={
                  loading ||
                  (!isEditing &&
                    (!mainImageUploaded || !additionalImagesUploaded))
                }
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    <span className="ms-2">Submitting...</span>
                  </>
                ) : !isEditing &&
                  (!mainImageUploaded || !additionalImagesUploaded) ? (
                  "Upload Images Before Creating Suggestion"
                ) : isEditing ? (
                  "Update Package Suggestion"
                ) : (
                  "Create Package Suggestion"
                )}
              </Button>
              {!isEditing && (
                <div className="text-center mt-2">
                  <small className="text-muted">
                    Step 1: Upload main and additional images
                    <br />
                    Step 2: Create package suggestion
                  </small>
                </div>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default SuggestionForm;
