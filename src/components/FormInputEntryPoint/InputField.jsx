import React, { lazy, useCallback, useState, useMemo } from "react";
import "react-phone-input-2/lib/style.css";
import "./InputField.scss";

const JoditEditor = lazy(() => import("jodit-react"));
const PhoneInput = lazy(() => import("react-phone-input-2"));

const InputField = React.memo((props) => {
  if (props.inputComponent === "forminput") {
    if (props.type === "tel") {
      return (
        <PhoneInput
          country={"in"}
          value={props.value}
          onBlur={props.onBlur}
          inputProps={{
            id: props.id,
            required: props.required,
            autoComplete: "off",
            className: props.className,
            placeholder: props.placeholder,
            onFocus: props.onFocus,
            // onBlur: props.onBlur,
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
    } else if (props.type === "select") {
      return (
        <select
          className={props.className}
          onChange={(e) => props.setValue(props.name, e.target.value)}
        >
          <option value="">Select {props.label}</option>
          {props.options
            ? props.options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))
            : null}
        </select>
      );
    } else if (props.type === "checkbox") {
      return (
        <div className="button r" id="button-3">
          <input type="checkbox" className="checkbox" />
          <div className="knobs"></div>
          <div className="layer"></div>
        </div>
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
        onBlur={(value) => props.setValue(props.name, value)}
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
    const [imageSrc, setImageSrc] = useState(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const handleFile = useCallback((file) => {
      const isImage = /^image\//.test(file?.type);
      if (!file || !isImage) {
        setFile(null);
        setImageSrc(null);
        setErrorNotification("Not an image file");
        setTimeout(() => setErrorNotification(null), 3000);
        return;
      }

      setFile(file);
      props.setValue(props.name, file);

      // Read the image file and set it as the source of the img element
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }, []);

    const handleFileDrop = useCallback(
      (e) => {
        e.preventDefault();
        const isOver = e.type === "dragenter";
        setDragOver(isOver);

        if (isOver || e.type === "drop") {
          const droppedFile =
            e.type === "drop" ? e.dataTransfer.files[0] : null;
          handleFile(droppedFile);
        }
      },
      [handleFile]
    );

    const handleCancelUpload = useCallback(() => {
      setFile(null);
      setImageSrc(null);
      setIsConfirmed(false);
    }, []);

    const handleConfirmUpload = useCallback(
      (e) => {
        e.preventDefault();
        setIsConfirmed(true);
      },
      [file]
    );

    const uploadText =
      file && !isConfirmed ? (
        [
          <h4 key="fileName">{file.name}</h4>,
          <button
            key="cancel"
            className="cancel-upload-button btn btn-warning"
            onClick={handleCancelUpload}
          >
            Cancel
          </button>,
          <button
            key="upload"
            className="upload-button btn btn-primary"
            onClick={handleConfirmUpload}
          >
            Confirm
          </button>,
        ]
      ) : file ? (
        <div>
          <h4>{file.name}</h4>
          <button
            className="cancel-upload-button btn btn-warning"
            onClick={handleCancelUpload}
          >
            Remove File
          </button>
        </div>
      ) : (
        <h4>Choose Files to Upload</h4>
      );

    const errorNotificationElement = errorNotification ? (
      <div className="error-notification">
        <p>{errorNotification}</p>
      </div>
    ) : null;

    const dragOverClass = dragOver ? "display-box drag-over" : "display-box";

    return (
      <div>
        <div
          className={dragOverClass}
          onDragOver={handleFileDrop}
          onDragEnter={handleFileDrop}
          onDragLeave={handleFileDrop}
          onDrop={handleFileDrop}
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
              onDrop={handleFileDrop}
              onChange={(e) => handleFile(e.target.files[0])}
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
        props.setValue(props.name, newPoints);
        return newPoints;
      });
    }, [props.name, props.setValue]);

    const handleDeletePoint = useCallback(
      (index) => {
        setPoints((prevPoints) => {
          const newPoints = prevPoints.filter((_, i) => i !== index);

          props.setValue(props.name, newPoints);
          return newPoints;
        });
      },
      [props.name, props.setValue]
    );

    const handleInputBlur = useCallback(
      (index, value) => {
        setPoints((prevPoints) => {
          const newPoints = [...prevPoints];
          newPoints[index] = value;
          props.setValue(props.name, newPoints);
          return newPoints;
        });
      },
      [props.name, props.setValue]
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
          <i className="fa fa-plus" aria-hidden="true" />{" "}
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
