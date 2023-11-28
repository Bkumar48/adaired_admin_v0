import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  lazy,
  Suspense,
} from "react";

const ImageUploaderField = (props) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorNotification, setErrorNotification] = useState(null);

  const handleDrag = useCallback((e, isOver) => {
    e.preventDefault();
    setDragOver(isOver);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      handleDrag(e, false);
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    },
    [handleDrag]
  );

  const handleAddImage = useCallback((e) => {
    e.preventDefault();
    const addedFile = e.target.files[0];
    handleFile(addedFile);
  }, []);

  const handleFile = useCallback((file) => {
    const fileType = file?.type?.split("/")[0];
    if (!file || !fileType.includes("image")) {
      setFile(null);
      setErrorNotification("Not an image File");
      setTimeout(() => setErrorNotification(null), 3000);
      return;
    }

    setFile(file);
    props.onFileChange(file); // Notify the parent component about the new file
  }, []);

  const handleUploadImage = useCallback(
    (e) => {
      e.preventDefault();
      if (file) {
        alert("Uploading Image " + file.name);
      }
    },
    [file]
  );

  const handleCancelUpload = useCallback(() => {
    setFile(null);
  }, []);

  const dragOverClass = dragOver ? "display-box drag-over" : "display-box";

  const uploadText = useMemo(
    () =>
      file ? (
        <div>
          <h4>{file.name}</h4>
          <button
            className="cancel-upload-button btn btn-warning"
            onClick={handleCancelUpload}
          >
            Cancel
          </button>
          <button
            className="upload-button btn btn-primary"
            onClick={handleUploadImage}
          >
            Upload
          </button>
        </div>
      ) : (
        <div>
          <h4>Choose Files to Upload</h4>
        </div>
      ),
    [file, handleCancelUpload, handleUploadImage]
  );

  const errorNotificationElement = useMemo(
    () =>
      errorNotification ? (
        <div className="error-notification">
          <p>{errorNotification}</p>
        </div>
      ) : null,
    [errorNotification]
  );

  return (
    <div>
      <div
        className={dragOverClass}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
      >
        <div className="icon-text-box">
          <div className="upload-icon">
            <i className="fa fa-upload" aria-hidden="true" />
          </div>
          <div className="upload-text">{uploadText}</div>
          {errorNotificationElement}
        </div>
        <div>
          <input
            type="file"
            id="upload-image-input"
            className="upload-image-input"
            accept="image/*"
            onDrop={handleDrop}
            onChange={handleAddImage}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploaderField;
