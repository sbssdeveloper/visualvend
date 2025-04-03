import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import noImage from "../../assets/images/no-image-icon.png"; // Import the no-image icon

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

const ImageUploadComponent = ({ index, onRemove }) => {
  const [image, setImage] = useState(null); // Captured or uploaded image
  const [isCameraOpen, setIsCameraOpen] = useState(false); // Camera open state
  const webcamRef = useRef(null); // Ref to Webcam component
  const [url, setUrl] = useState(null); // To store captured image

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      closeCamera(); // Close the camera after capturing
    }
  }, [webcamRef]);

  // Handle file upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setUrl(null);
  };

  return (
    <div className="img-upload-container py-1">
      <div className="img-upload-preview">
        {image || url ? (
          <div className="img-upload-preview-container">
            <img
              src={url || image}
              alt="Captured or Uploaded"
              className="img-upload-display"
            />
            <i
              onClick={handleRemoveImage}
              className="bi bi-trash img-upload-remove-icon"
            ></i>
          </div>
        ) : (
          <img
            src={noImage} // Use the no-image icon here
            alt="No Image"
            className="img-upload-default-icon"
          />
        )}
      </div>

      {/* Options */}
      <div className="img-upload-options-container">
        {!isCameraOpen && (
          <>
            {/* File upload button */}
            <label
              htmlFor={`file-upload-${index}`}
              className="img-upload-upload-button"
            >
              <i className="bi bi-images"></i>
            </label>
            <input
              id={`file-upload-${index}`}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="img-upload-file-input"
            />

            {/* Camera button */}
            <div onClick={openCamera} className="img-upload-camera-button">
              <i className="bi bi-camera"></i>
            </div>
          </>
        )}

        {/* Modal for Camera */}
        {isCameraOpen && (
          <div className="img-upload-camera-modal">
            <div className="img-upload-camera-modal-content">
              <Webcam
                audio={false}
                width="100%"
                height="auto"
                ref={webcamRef}
                screenshotFormat="image/png"
                videoConstraints={videoConstraints}
              />
              <div className="img-upload-camera-actions">
                <button onClick={capture} className="img-upload-capture-button">
                  Capture
                </button>
                <button
                  onClick={closeCamera}
                  className="img-upload-close-button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ImageUploadContainer = () => {
  const [images, setImages] = useState([0]); // Store an array of image indices

  const handleAddImage = () => {
    setImages([...images, images.length]); // Add a new image component by appending a new index
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((imageIndex) => imageIndex !== index)); // Remove the image component by index
  };

  return (
    <div>
      <div className="img-upload-container">
        {images.map((imageIndex) => (
          <ImageUploadComponent
            key={imageIndex}
            index={imageIndex}
            onRemove={handleRemoveImage}
          />
        ))}
      </div>

      <button
        onClick={handleAddImage}
        className="img-upload-add-button py-1 px-1"
      >
        <i className="bi bi-plus-circle"></i> Add Image
      </button>
    </div>
  );
};

export default ImageUploadContainer;
