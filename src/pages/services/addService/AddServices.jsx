import React, { useState, useCallback, Suspense, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import JoditEditor from "jodit-react";
import Cards from "../../../components/card/Cards";
import FormInput from "../../../components/FormInput/FormInput";

// =========================================================================================================================================================================
// ===================================================================== Dynamic Points Input Component ====================================================================
// =========================================================================================================================================================================

const DynamicPointsInput = React.memo(() => {
  const [points, setPoints] = useState([""]);
  console.log("DynamicPointsInput Rendered", points);

  const handleAddPoint = useCallback(() => {
    setPoints([...points, ""]);
  }, [points]);

  const handleDeletePoint = useCallback((index) => {
    setPoints((prevPoints) => prevPoints.filter((_, i) => i !== index));
  }, []);

  const handleInputBlur = useCallback((index, value) => {
    setPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      newPoints[index] = value;
      return newPoints;
    });
  }, []);

  return (
    <>
      {points.map((point, index) => (
        <div key={`point-${index}`} className="input-row">
          <input
            type="text"
            placeholder={`Point ${index + 1}`}
            defaultValue={point}
            onBlur={(e) => handleInputBlur(index, e.target.value)}
            className="full-width-input"
            name={`fourPoints-${index}`}
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

// ===================================================================================================================================================================
// ===================================================================== Image Uploader Component ====================================================================
// ===================================================================================================================================================================

const ImageUploader = React.memo(({ onFileChange }) => {
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
    onFileChange(file); // Notify the parent component about the new file
  }, []);

  const handleUploadImage = useCallback(
    (e) => {
      e.preventDefault();
      // const uploadedFile = document.getElementById("upload-image-input").files[0];
      // if (uploadedFile) {
      if (file) {
        alert("Uploading Image " + file.name);
        // Handle image Upload
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

// =================================================================================================================================================================
// ===================================================================== Input Box Component =======================================================================
// =================================================================================================================================================================

const InputComponents = {
  forminput: (props) => (
    <>
      <FormInput
        {...props.field}
        type={props.type}
        placeholder={props.placeholder}
        id={props.id}
        className="full-width-input"
      />
      {props.errors[props.name] && (
        <p className="error-message">{props.errors[props.name]}</p>
      )}
    </>
  ),
  jodit: (props) => (
    <>
      <div className="full-width-input">
        <Suspense fallback={<div>Loading...</div>}>
          <JoditEditor
            value={props.field?.value}
            onBlur={(value) => props.setValue(props.name, value)}
            config={{
              readonly: false,
              height: 300,
            }}
            tabIndex={1}
          />
          {props.errors[props.name] && (
            <p className="error-message">{props.errors[props.name]}</p>
          )}
        </Suspense>
      </div>
    </>
  ),
  dynamicPointsInput: (props) => (
    <>
      <DynamicPointsInput setValue={props.setValue} />
      {props.errors[props.name] && (
        <p className="error-message">{props.errors[props.name]}</p>
      )}
    </>
  ),
  imageUploader: (props) => (
    <>
      <ImageUploader
        onFileChange={(file) => props.setValue(props.name, file)}
      />
      {props.errors[props.name] && (
        <p className="error-message">{props.errors[props.name]}</p>
      )}
    </>
  ),
};

const InputBox = React.memo((props) => {
  const InputComponent = InputComponents[props.inputComponent];

  return (
    <div className="input-box">
      <label htmlFor={props.htmlFor}>{props.label}</label>
      <Controller
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue}
        render={({ field }) => <InputComponent {...props} field={field} />}
      />
    </div>
  );
});

// =================================================================================================================================================================
// ===================================================================== Add Services Component ====================================================================
// =================================================================================================================================================================

const AddServices = () => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = useCallback(
    (data) => {
      console.log("Form Submitted", data);
      // Reset the form after submission
      reset();
    },
    [reset]
  );
  return (
    <div className="add__service">
      <Cards header="Add New Service">
        <div className="add__service-form">
          <form action="" onSubmit={handleSubmit(handleFormSubmit)}>
            <InputBox
              htmlFor="serviceTitle"
              label="Service Title"
              name="serviceTitle"
              control={control}
              placeholder="Service Title"
              type="text"
              setValue={setValue}
              inputComponent="forminput"
              id="service-title"
              errors={errors}
              defaultValue=""
            />

            <InputBox
              htmlFor="serviceDescription"
              label="Service Description"
              name="serviceDescription"
              control={control}
              placeholder="Service Description"
              setValue={setValue}
              inputComponent="jodit"
              id="service-description"
              errors={errors}
              defaultValue=""
            />

            <InputBox
              htmlFor="serviceImage"
              label="Service Image"
              name="serviceImage"
              control={control}
              placeholder="Service Image"
              setValue={setValue}
              inputComponent="imageUploader"
              id="service-image"
              errors={errors}
              defaultValue=""
            />

            <InputBox
              htmlFor="serviceDescriptionII"
              label="Service Description II"
              name="serviceDescriptionII"
              control={control}
              placeholder="Service Description II"
              setValue={setValue}
              inputComponent="jodit"
              id="service-description-ii"
              errors={errors}
              defaultValue=""
            />

            <InputBox
              htmlFor="serviceHeadingII"
              label="Service Heading II"
              name="serviceHeadingII"
              control={control}
              placeholder="Service Heading II"
              setValue={setValue}
              inputComponent="forminput"
              id="service-heading-ii"
              errors={errors}
              defaultValue=""
            />

            <InputBox
              htmlFor="serviceDescriptionIII"
              label="Service Description III"
              name="serviceDescriptionIII"
              control={control}
              placeholder="Service Description III"
              setValue={setValue}
              inputComponent="jodit"
              id="service-description-iii"
              errors={errors}
              defaultValue=""
            />
            {/* ======================================================================================================================================================================================= */}
            <InputBox
              htmlFor="fourPoints"
              label="Four Points"
              name="fourPoints"
              control={control}
              placeholder="Four Points"
              setValue={setValue}
              inputComponent="dynamicPointsInput"
              id="four-points"
              errors={errors}
              defaultValue={[]}
            />
            {/* ======================================================================================================================================================================================= */}

            <InputBox
              htmlFor="ourProcessSubHeading"
              label="Our Process Sub Heading"
              name="ourProcessSubHeading"
              control={control}
              placeholder="Our Process Sub Heading"
              setValue={setValue}
              inputComponent="forminput"
              id="our-process-sub-heading"
              errors={errors}
              defaultValue=""
            />

            <div className="two-columns">
              <InputBox
                htmlFor="ourProcessImageI"
                label="Our Process Image I"
                name="ourProcessImageI"
                control={control}
                placeholder="Our Process Image I"
                setValue={setValue}
                inputComponent="imageUploader"
                id="our-process-image-i"
                errors={errors}
                defaultValue=""
              />
              <InputBox
                htmlFor="ourProcessImageII"
                label="Our Process Image II"
                name="ourProcessImageII"
                control={control}
                placeholder="Our Process Image II"
                setValue={setValue}
                inputComponent="imageUploader"
                id="our-process-image-ii"
                errors={errors}
                defaultValue=""
              />
            </div>

            <div className="two-columns">
              <InputBox
                htmlFor="leftImage"
                label="Left Image"
                name="leftImage"
                control={control}
                placeholder="Left Image"
                setValue={setValue}
                inputComponent="imageUploader"
                id="left-image"
                errors={errors}
                defaultValue=""
              />

              <InputBox
                htmlFor="rightText"
                label="Right Text"
                name="rightText"
                control={control}
                placeholder="Right Text"
                setValue={setValue}
                inputComponent="jodit"
                id="right-text"
                errors={errors}
                defaultValue=""
              />
            </div>

            <div className="two-columns">
              <InputBox
                htmlFor="leftText"
                label="Left Text"
                name="leftText"
                control={control}
                placeholder="Left Text"
                setValue={setValue}
                inputComponent="jodit"
                id="left-text"
                errors={errors}
                defaultValue=""
              />
              <InputBox
                htmlFor="rightImage"
                label="Right Image"
                name="rightImage"
                control={control}
                placeholder="Right Image"
                setValue={setValue}
                inputComponent="imageUploader"
                id="right-image"
                errors={errors}
                defaultValue=""
              />
            </div>

            <InputBox
              htmlFor="serviceHeadingIII"
              label="Service Heading III"
              name="serviceHeadingIII"
              control={control}
              placeholder="Service Heading III"
              setValue={setValue}
              inputComponent="forminput"
              id="serviceHeadingIII"
              errors={errors}
              defaultValue=""
            />

            <InputBox
              htmlFor="serviceDescriptionIV"
              label="Service Description IV"
              name="serviceDescriptionIV"
              control={control}
              placeholder="Service Description IV"
              setValue={setValue}
              inputComponent="jodit"
              id="serviceDescriptionIV"
              errors={errors}
              defaultValue=""
            />
            <InputBox
              htmlFor="serviceNote"
              label="Service Note"
              name="serviceNote"
              control={control}
              placeholder="Service Note"
              setValue={setValue}
              inputComponent="forminput"
              id="serviceNote"
              errors={errors}
              defaultValue=""
            />

            <div className="two-columns">
              <InputBox
                htmlFor="LastSectionText"
                label="Last Section Text"
                name="LastSectionText"
                control={control}
                placeholder="Last Section Text"
                setValue={setValue}
                inputComponent="jodit"
                id="LastSectionText"
                errors={errors}
                defaultValue=""
              />
              <InputBox
                htmlFor="LastSectionImage"
                label="Last Section Image"
                name="LastSectionImage"
                control={control}
                placeholder="Last Section Image"
                setValue={setValue}
                inputComponent="imageUploader"
                id="LastSectionImage"
                errors={errors}
                defaultValue=""
              />
            </div>

            <div className="form-btn-box">
              <button className="btn ">Cancel</button>
              <button className="btn " type="submit">
                Add Service
              </button>
            </div>
          </form>
        </div>
      </Cards>
    </div>
  );
};

DynamicPointsInput.displayName = "DynamicPointsInput";
ImageUploader.displayName = "ImageUploader";
InputBox.displayName = "InputBox";
AddServices.displayName = "AddServices";

export default AddServices;
