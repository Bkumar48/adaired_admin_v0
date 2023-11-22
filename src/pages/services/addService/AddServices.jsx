import React, { useState, useCallback, Suspense, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import JoditEditor from "jodit-react";
import Cards from "../../../components/card/Cards";
import FormInput from "../../../components/FormInput/FormInput";

const DynamicPointsInput = React.memo(() => {
  const [points, setPoints] = useState([""]);

  const handleAddPoint = useCallback(() => {
    setPoints((prevPoints) => [...prevPoints, ""]);
  }, []);

  const handleDeletePoint = useCallback((index) => {
    setPoints((prevPoints) => prevPoints.filter((_, i) => i !== index));
  }, []);

  const handleInputChange = useCallback((index, value) => {
    setPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      newPoints[index] = value;
      return newPoints;
    });
  }, []);

  return (
    <>
      {points.map((point, index) => (
        <div key={index} className="input-row">
          <input
            type="text"
            placeholder={`Point ${index + 1}`}
            value={point}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="full-width-input"
          />
          <button
            type="button"
            onClick={() => handleDeletePoint(index)}
            className="dynamicPointsInput__btn dynamicPointsInput__delete"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddPoint}
        className="dynamicPointsInput__btn dynamicPointsInput__add"
      >
        Add Point
      </button>
    </>
  );
});

const ImageUploader = React.memo(() => {
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
    const fileType = file?.type.split("/")[0];
    if (!file || fileType !== "image") {
      setFile(null);
      setErrorNotification("Not an image File");
      setTimeout(() => setErrorNotification(null), 3000);
      return;
    }

    setFile(file);
  }, []);

  const handleUploadImage = useCallback((e) => {
    e.preventDefault();
    const uploadedFile = document.getElementById("upload-image-input").files[0];
    if (uploadedFile) {
      alert("Uploading Image " + uploadedFile.name);
      // Handle image Upload
    }
  }, []);

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
  );
});

const AddServices = () => {
  const handleFormSubmit = useCallback((data) => {
    console.log(data);
  }, []);

  return (
    <div className="add__service">
      <Cards header="Add New Service">
        <div className="add__service-form">
          <form action="" onSubmit={handleFormSubmit}>
            <div className="input-box">
              <label htmlFor="service-heading">Service Heading</label>
              <FormInput
                type="text"
                placeholder="Service Heading"
                id="service-heading"
                className="full-width-input"
              />
            </div>

            <div className="input-box">
              <label htmlFor="service-description">Service Description</label>
              <JoditEditor
                config={{
                  readonly: false, // all options from https://xdsoft.net/jodit/doc/
                  height: 300,
                }}
                tabIndex={1} // tabIndex of textarea
              />
            </div>

            <div className="input-box">
              <label htmlFor="service-image">Service Image</label>
              <FormInput
                type="file"
                placeholder="Service Image"
                id="service-image"
                className="full-width-input"
              />
            </div>

            <div className="input-box">
              <label htmlFor="service-description-ii">
                Service Description II
              </label>
              <JoditEditor
                config={{
                  readonly: false, // all options from https://xdsoft.net/jodit/doc/
                  height: 300,
                }}
                tabIndex={1} // tabIndex of textarea
              />
            </div>

            <div className="input-box">
              <label htmlFor="service-heading-ii">Service Heading II</label>
              <FormInput
                type="number"
                placeholder="Service Heading II"
                id="service-heading-ii"
                className="full-width-input"
              />
            </div>

            <div className="input-box">
              <label htmlFor="service-description-iii">
                Service Description III
              </label>
              <JoditEditor
                config={{
                  readonly: false, // all options from https://xdsoft.net/jodit/doc/
                  height: 300,
                }}
                tabIndex={1} // tabIndex of textarea
              />
            </div>

            <div className="input-box">
              <label htmlFor="four-points">Four Points</label>
              <DynamicPointsInput />
            </div>

            <div className="input-box">
              <label htmlFor="our-process">Our Process Sub Heading</label>
              <FormInput
                type="text"
                placeholder="Our Process Sub Heading"
                id="our-process-sub-heading"
                className="full-width-input"
              />
            </div>

            <div className="input-box ">
              <label htmlFor="our-process">Our Process Images</label>
              <div className="two-columns">
                <Suspense fallback={<div>Loading...</div>}>
                  <ImageUploader />
                  <ImageUploader />
                </Suspense>
              </div>
            </div>

            <div className="input-box">
              <label htmlFor="our-process">Our Process Heading</label>

              <div className="two-columns">
                <ImageUploader />
                <div className="full-width-input">
                  {" "}
                  <JoditEditor
                    config={{
                      readonly: false, // all options from https://xdsoft.net/jodit/doc/
                      height: 300,
                    }}
                    tabIndex={1} // tabIndex of textarea
                  />
                </div>
              </div>
            </div>
            <div className="input-box">
              <label htmlFor="our-process">Our Process Heading</label>
              <div className="two-columns">
                <div className="full-width-input">
                  {" "}
                  {/* Apply your class to this container */}
                  <JoditEditor
                    config={{
                      readonly: false, // all options from https://xdsoft.net/jodit/doc/
                      height: 300,
                    }}
                    tabIndex={1} // tabIndex of textarea
                  />
                </div>
                <ImageUploader />
              </div>
            </div>

            <div className="input-box">
              <label htmlFor="heading-iii">Heading III</label>
              <FormInput
                type="text"
                placeholder="Heading III"
                id="heading-iii"
                className="full-width-input"
              />
            </div>

            <div className="input-box">
              <label htmlFor="description-iv">Description IV</label>
              <JoditEditor
                config={{
                  readonly: false,
                  height: 300,
                }}
                tabIndex={1} // tabIndex of textarea
              />
            </div>

            <div className="input-box">
              <label htmlFor="note">Note</label>
              <FormInput
                type="text"
                placeholder="Note"
                id="note"
                className="full-width-input"
              />
            </div>

            <div className="input-box">
              <label htmlFor="our-process">Our Process Heading</label>
              <div className="two-columns">
                <div className="full-width-input">
                  {" "}
                  <JoditEditor
                    config={{
                      readonly: false,
                      height: 300,
                    }}
                    tabIndex={1} // tabIndex of textarea
                  />
                </div>
                <ImageUploader />
              </div>
            </div>

            <div className="form-btn-box">
              <button className="btn ">Cancel</button>
              <button className="btn ">Add Service</button>
            </div>
          </form>
        </div>
      </Cards>
    </div>
  );
};

DynamicPointsInput.displayName = "DynamicPointsInput";
ImageUploader.displayName = "ImageUploader";
AddServices.displayName = "AddServices";

export default AddServices;
