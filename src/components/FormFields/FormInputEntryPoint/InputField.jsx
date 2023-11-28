import React, { lazy, useCallback, useState, useMemo } from "react";
import "react-phone-input-2/lib/style.css";

const JoditEditor = lazy(() => import("jodit-react"));
const PhoneInput = lazy(() => import("react-phone-input-2"));
import { useForm, Controller } from "react-hook-form";

const InputField = React.memo((props) => {
  if (props.inputComponent === "forminput") {
    if (props.type === "tel") {
      return (
        <PhoneInput
          country={"in"}
          value={props.value}
          onChange={props.onChange}
          inputProps={{
            id: props.id,
            required: props.required,
            autoComplete: "off",
            className: props.className,
            placeholder: props.placeholder,
            onFocus: props.onFocus,
            onBlur: props.onBlur,
            name: props.name,
          }}
        />
      );
    } else if (props.type === "textarea") {
      return (
        <textarea
          id={props.id}
          required={props.required}
          autoComplete="off"
          className={props.className}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          name={props.name}
          rows={props.rows ? props.rows : 5}
          style={{
            resize: "vertical",
          }}
        />
      );
    } else {
      return (
        <input
          type={props.type}
          id={props.id}
          required={props.required}
          autoComplete="off"
          className={props.className}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          name={props.name}
          {...props.field}
        />
      );
    }
  } else if (props.inputComponent === "joditeditor") {
    return (
      <JoditEditor
        value={props.field?.value}
        onBlur={props.onBlur}
        onChange={props.onChange}
        config={props.config}
        tabIndex={props.tabIndex}
        name={props.name}
      />
    );
  } else if (props.inputComponent === "imageuploadfield") {
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
  } else if (props.inputComponent === "dynamininput") {
    const [points, setPoints] = useState([""]);

    const handleAddPoint = useCallback(() => {
      setPoints((prevPoints) => {
        const newPoints = [...prevPoints, ""];
        props.onChange(newPoints);
        return newPoints;
      });
    }, [props.onChange]);

    const handleDeletePoint = useCallback(
      (index) => {
        setPoints((prevPoints) => {
          const newPoints = prevPoints.filter((_, i) => i !== index);
          props.onChange(newPoints);
          return newPoints;
        });
      },
      [props.onChange]
    );

    const handleInputBlur = useCallback(
      (e, index) => {
        const newPoints = [...points];
        newPoints[index] = e.target.value;
        setPoints(newPoints);
        props.onChange(newPoints);
      },
      [points, props.onChange]
    );

    const renderPoints = useMemo(
      () =>
        points.map((point, index) => (
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
        )),
      [points, handleInputBlur, handleDeletePoint]
    );

    return (
      <div>
        {renderPoints}
        <button
          type="button"
          className="dynamicPointsInput__btn dynamicPointsInput__add"
          onClick={handleAddPoint}
        >
          <i className="fa fa-plus" aria-hidden="true" />
          {" "}
          {props.addButtonText ? props.addButtonText : "Add Point"}
        </button>
      </div>
    );
  } else {
    return null;
  }
});

InputField.displayName = "InputField";

export default InputField;
