import React, { lazy, useCallback, useState, useMemo } from "react";
import "react-phone-input-2/lib/style.css";
import "./InputField.scss";

const JoditEditor = lazy(() => import("jodit-react"));
const PhoneInput = lazy(() => import("react-phone-input-2"));

const InputField = React.memo((props) => {
  if (props.inputComponent === "forminput") {
    if (props.type === "tel") {
      return (
        <>
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
          {props.error && <p className="error">{props.error}</p>}
        </>
      );
    } else if (props.type === "textarea") {
      return (
        <>
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
          {props.error && <p className="error">{props.error}</p>}
        </>
      );
    } else if (props.type === "select") {
      return (
        <>
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
          
          {props.error && <p className="error">{props.error}</p>}
        </>
      );
    } else if (props.type === "checkbox") {
      return (
        <>
          <div className="button r" id="button-3">
            <input
              type="checkbox"
              className="checkbox"
              name={props.name}
              id={props.id}
              onChange={(e) => {
                props.setValue(props.name, e.target.checked);
                props.onChange(e);
              }}
            />
            <div className="knobs"></div>
            <div className="layer"></div>
          </div>
          {props.error && <p className="error">{props.error}</p>}
        </>
      );
    } else {
      return (
        <>
          <input
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
            type={props.type}
            {...props.field}
          />
          {props.error && <p className="error">{props.error}</p>}
        </>
      );
    }
  } else if (props.inputComponent === "richtext") {
    return (
      <>
        <JoditEditor
          value={props.field?.value}
          onBlur={(value) => props.setValue(props.name, value)}
          onChange={props.onChange}
          config={props.config}
          tabIndex={props.tabIndex}
          name={props.name}
        />
        {props.error && <p className="error">{props.error}</p>}
      </>
    );
  } else if (props.inputComponent === "imageUploader") {
    const [file, setFile] = useState(null);
    const [errorNotification, setErrorNotification] = useState(null);

    const handleFile = useCallback((file) => {
      const isImage = /^image\//.test(file?.type);
      if (!file || !isImage) {
        setFile(null);
        setErrorNotification("Not an image file");
        setTimeout(() => setErrorNotification(null), 3000);
        return;
      }
      setFile(file);
      props.setValue(props.name, file);
    }, []);

    const uploadText = file ? (
      <h4>{file.name}</h4>
    ) : (
      <h4>Choose Files to Upload</h4>
    );

    const errorNotificationElement = errorNotification ? (
      <div className="error-notification">
        <p>{errorNotification}</p>
      </div>
    ) : null;

    return (
      <>
        <div className={"display-box"}>
          <div className="icon-text-box ">
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
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        </div>

        {/* {imageSrc && (
          <div className="image-preview">
            <img src={imageSrc} alt="Preview" />
          </div>
        )} */}

        {props.error && <p className="error">{props.error}</p>}
      </>
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
  } else if (props.inputComponent === "combinedfield") {
    const [combinedFields, setCombinedFields] = useState([
      { image: null, editorValue: "" },
    ]);

    const handleAddField = useCallback(() => {
      setCombinedFields((prevFields) => {
        const newFields = [...prevFields, { image: null, editorValue: "" }];
        props.setValue(props.name, newFields);
        return newFields;
      });
    }, [props.name, props.setValue]);

    const handleDeleteField = useCallback(
      (index) => {
        setCombinedFields((prevFields) => {
          const newFields = prevFields.filter((_, i) => i !== index);

          props.setValue(props.name, newFields);
          return newFields;
        });
      },
      [props.name, props.setValue]
    );

    const handleInputBlur = useCallback(
      (index, value) => {
        setCombinedFields((prevFields) => {
          const newFields = [...prevFields];
          newFields[index].editorValue = value;
          props.setValue(props.name, newFields);
          return newFields;
        });
      },
      [props.name, props.setValue]
    );

    const [files, setFiles] = useState([null]);
    const [errorNotification, setErrorNotification] = useState(null);

    const handleImageChange = useCallback(
      (index, image) => {
        const isImage = /^image\//.test(image?.type);
        if (!image || !isImage) {
          setFiles((prevFiles) => {
            const newFiles = [...prevFiles];
            newFiles[index] = null; // Set null for invalid images
            return newFiles;
          });
          return;
        }

        setCombinedFields((prevFields) => {
          const newFields = [...prevFields];
          newFields[index].image = image;
          props.setValue(props.name, newFields);
          return newFields;
        });

        setFiles((prevFiles) => {
          const newFiles = [...prevFiles];
          newFiles[index] = image;
          return newFiles;
        });
      },
      [props.name, props.setValue]
    );

    const errorNotificationElement = errorNotification ? (
      <div className="error-notification">
        <p>{errorNotification}</p>
      </div>
    ) : null;

    const renderCombinedFields = useMemo(
      () =>
        combinedFields.map((field, index) => (
          <>
            <button
              type="button"
              onClick={() => handleDeleteField(index)}
              className="dynamicPointsInput__btn dynamicPointsInput__delete"
              style={{ float: "right" }}
              key={`delete-${index}`}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <div
              key={`field-${index}`}
              className={`input-row input-row__combinedField ${
                index % 2 === 0 ? "even" : "odd"
              }`}
            >
              <div className={`input-row__image display-box`}>
                <div className="icon-text-box">
                  <div className="upload-icon">
                    <i className="fa fa-upload" aria-hidden="true" />
                  </div>
                  <div className="upload-text">
                    {field.image ? (
                      <h4>{field.image.name}</h4>
                    ) : (
                      <h4>Choose Files to Upload</h4>
                    )}
                  </div>
                  {errorNotificationElement}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                  className="upload-image-input"
                />
              </div>
              <div className="input-row__editor">
                <JoditEditor
                  value={field.editorValue}
                  onBlur={(value) => handleInputBlur(index, value)}
                  onChange={props.onChange}
                  config={props.config}
                  tabIndex={props.tabIndex}
                  name={props.name}
                />
              </div>
            </div>
          </>
        )),
      [
        combinedFields,
        handleAddField,
        handleInputBlur,
        handleDeleteField,
        handleImageChange,
      ]
    );

    return (
      <div>
        {renderCombinedFields}
        <button
          type="button"
          className="dynamicPointsInput__btn dynamicPointsInput__add"
          onClick={handleAddField}
        >
          <i className="fa fa-plus" aria-hidden="true" />{" "}
          {props.addButtonText ? props.addButtonText : "Add Field"}
        </button>
      </div>
    );
  }
});

InputField.displayName = "InputField";

export default InputField;
