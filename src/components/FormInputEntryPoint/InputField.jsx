import React, { lazy, useCallback, useState, useMemo } from "react";
import "react-phone-input-2/lib/style.css";
import "./InputField.scss";
import { Editor } from "@tinymce/tinymce-react";
const PhoneInput = lazy(() => import("react-phone-input-2"));
import Select from "react-select";
import makeAnimated from "react-select/animated";

const InputField = React.memo((props) => {
  const animatedComponents = makeAnimated();

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
            {...props.field}
          />
        </>
      );
    } else if (props.type === "select") {
      return (
        <>
          <Select
            closeMenuOnSelect={props.closeMenuOnSelect}
            components={animatedComponents}
            defaultValue={props.defaultValue}
            isMulti={props.multiple}
            options={props.options}
            onChange={props.onChange}
            className={`SelectInput ${props.className}`}
          />
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
            min={props.min}
            {...props.field}
          />
        </>
      );
    }
  } else if (props.inputComponent === "richtext") {
    return (
      <>
        <Editor
          apiKey="720nkcx75ws79fcln5kf33j5klsu2vkzoeqowjjuu3axulkt"
          init={{
            plugins:
              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
          }}
          onEditorChange={(content) => props.setValue(props.name, content)}
          value={props.field?.value}
          name={props.name}
        />
      </>
    );
  } else if (props.inputComponent === "imageUploader") {
    const [file, setFile] = useState(null);

    const handleInputChange = (e) => {
      const selectedFile = e.target.files[0];
      props.setValue(props.name, selectedFile);
      if (selectedFile) {
        readFileData(selectedFile).then((thumbnail) => {
          setFile({ file: selectedFile, thumbnail });
        });
      }
    };

    const readFileData = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject("Something went wrong when reading the file");
        };
        reader.readAsDataURL(file);
      });
    };

    return (
      <div className="image-uploader">
        <div className="image-uploader-container">
          {!file ? (
            <div className="image-upload-button-container image-upload-button-view-full">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/webp"
                onChange={handleInputChange}
                className="image-upload-button"
              />
              Click here or drag an image here to upload
            </div>
          ) : (
            <>
              <div
                className="image-upload-preview"
                style={{ backgroundImage: `url(${file.thumbnail})` }}
              />
              <div className="image-action-buttons">
                <button
                  className="image-action-button"
                  onClick={() => setFile(null)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
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
  } else if (props.inputComponent === "accordion") {
    const [accordians, setAccordians] = useState([{ title: "", content: "" }]);

    const handleAddAccordian = useCallback(() => {
      setAccordians((prevAccordians) => {
        const newAccordians = [...prevAccordians, { title: "", content: "" }];
        return newAccordians;
      });
    }, [props.name, props.setValue]);

    const handleDeleteAccordian = useCallback(
      (index) => {
        setAccordians((prevAccordians) => {
          const newAccordians = prevAccordians.filter((_, i) => i !== index);
          return newAccordians;
        });
      },
      [props.name, props.setValue]
    );

    const handleInputBlur = useCallback(
      (index, value, type) => {
        setAccordians((prevAccordians) => {
          const newAccordians = [...prevAccordians];
          newAccordians[index][type] = value;
          props.setValue(props.name, newAccordians);
          return newAccordians;
        });
      },
      [props.name, props.setValue]
    );

    const renderAccordians = useMemo(
      () =>
        accordians.map((accordian, index) => (
          <>
            <button
              type="button"
              onClick={() => handleDeleteAccordian(index)}
              className="dynamicPointsInput__btn dynamicPointsInput__delete"
              style={{ float: "right" }}
              key={`delete-${index}`}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <div key={`accordian-${index}`}>
              <div className={`input-row__title`}>
                <input
                  type="text"
                  placeholder={
                    `${props.placeholder} ${index + 1}` || `Title ${index + 1}`
                  }
                  defaultValue={accordian.title}
                  onBlur={(e) =>
                    handleInputBlur(index, e.target.value, "title")
                  }
                  className="full-width-input"
                  name={`fourPoints-${index}`}
                />
              </div>
              <div className="input-row__content">
                <Editor
                  apiKey="720nkcx75ws79fcln5kf33j5klsu2vkzoeqowjjuu3axulkt"
                  init={{
                    plugins:
                      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                  }}
                  onEditorChange={(content) =>
                    handleInputBlur(index, content, "content")
                  }
                  value={accordian.content}
                  name={props.name}
                />
              </div>
            </div>
          </>
        )),
      [accordians, handleAddAccordian, handleInputBlur, handleDeleteAccordian]
    );

    return (
      <>
        {renderAccordians}
        <div>
          <button
            type="button"
            className="dynamicPointsInput__btn dynamicPointsInput__add"
            onClick={handleAddAccordian}
            style={{ marginTop: "10px" }}
          >
            <i className="fa fa-plus" aria-hidden="true" />{" "}
            {props.addButtonText ? props.addButtonText : "Add Field"}
          </button>
        </div>
      </>
    );
  } else if (props.inputComponent === "combinedField") {
    const [combinedFields, setCombinedFields] = useState([
      {
        combinedSectionImage: "",
        accordion: [{ title: "", content: "" }],
      },
    ]);

    const handleAddAccordionField = useCallback(() => {
      setCombinedFields((prevFields) => {
        const newFields = [
          ...prevFields,
          {
            combinedSectionImage: "",
            accordion: [{ title: "", content: "" }],
          },
        ];
        return newFields;
      });
    }, []);

    const handleAddEditorField = useCallback(() => {
      setCombinedFields((prevFields) => {
        const newFields = [
          ...prevFields,
          { combinedSectionImage: "", editorValue: "" },
        ];
        return newFields;
      });
    }, []);

    const readFileData = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject("Something went wrong when reading the file");
        };
        reader.readAsDataURL(file);
      });
    };

    const handleImageChange = useCallback(
      (index, image) => {
        setCombinedFields((prevFields) => {
          const newFields = [...prevFields];
          newFields[index].combinedSectionImage = image;
          props.setValue(props.name, newFields);
          return newFields;
        });
        if (image) {
          readFileData(image).then((thumbnail) => {
            const imagePreviewElement = document.querySelector(
              `#image-upload-preview-${index}`
            );
            if (imagePreviewElement) {
              imagePreviewElement.style.backgroundImage = `url(${thumbnail})`;
            }
          });
        }
      },
      [props, readFileData]
    );

    const handleInputBlur = useCallback(
      (fieldIndex, accordianIndex, value, type) => {
        setCombinedFields((prevFields) => {
          const newFields = [...prevFields];
          newFields[fieldIndex].accordion[accordianIndex][type] = value;
          props.setValue(props.name, newFields);
          return newFields;
        });
      },
      [props]
    );

    const handleDeleteAccordian = useCallback(
      (fieldIndex, accordianIndex) => {
        setCombinedFields((prevFields) => {
          const newFields = [...prevFields];
          newFields[fieldIndex].accordion.splice(accordianIndex, 1);
          props.setValue(props.name, newFields);
          return newFields;
        });
      },
      [props]
    );

    const Accordian = ({
      title,
      content,
      fieldIndex,
      accordianIndex,
      onInputBlur,
      onDeleteAccordion,
    }) => {
      const handleInputBlur = useCallback(
        (value, type) => {
          onInputBlur(fieldIndex, accordianIndex, value, type);
        },
        [onInputBlur, fieldIndex, accordianIndex]
      );

      return (
        <>
          <div className={`input-row__accordian`}>
            <button
              type="button"
              onClick={() => onDeleteAccordion(fieldIndex, accordianIndex)}
              className="dynamicPointsInput__btn "
            >
              <i className="fa-solid fa-trash"></i> Delete Accordian
            </button>
            <div className={`input-row__title`}>
              <input
                type="text"
                placeholder={`Title ${accordianIndex + 1}`}
                defaultValue={title}
                onBlur={(e) => handleInputBlur(e.target.value, "title")}
                className="full-width-input"
                name={`fourPoints-${accordianIndex}`}
              />
            </div>
            <div className="input-row__content">
              <div id="richtext-toolbar"></div>
              <Editor
                apiKey="720nkcx75ws79fcln5kf33j5klsu2vkzoeqowjjuu3axulkt"
                init={{
                  plugins:
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                }}
                onEditorChange={(content) => {
                  handleInputBlur(content, "content");
                }}
                value={content}
                name={`editor-${fieldIndex}-${accordianIndex}`}
              />
            </div>
          </div>
        </>
      );
    };

    const renderCombinedFields = useMemo(
      () =>
        combinedFields.map((field, index) => (
          <>
            <div key={`field-${index}`}>
              <button
                type="button"
                onClick={() => {
                  const newFields = [...combinedFields];
                  newFields.splice(index, 1);
                  setCombinedFields(newFields);
                }}
                className="dynamicPointsInput__btn dynamicPointsInput__delete"
                style={{ float: "right" }}
                key={`delete-${index}`}
              >
                <i className="fa-solid fa-trash"></i> {""}
                Delete Row
              </button>
              <div
                key={`field-${index}`}
                className={`input-row input-row__combinedField ${
                  index % 2 === 0 ? "even" : "odd"
                }`}
              >
                <div className="image-uploader">
                  <input
                    type="text"
                    placeholder="Enter Heading"
                    defaultValue={field.heading}
                    onBlur={(e) => {
                      const newFields = [...combinedFields];
                      newFields[index].heading = e.target.value;
                      props.setValue(props.name, newFields);
                      setCombinedFields(newFields);
                    }}
                    className="full-width-input"
                    name={`heading-${index}`}
                    style={{ marginBottom: "10px" }}
                  />
                  <div className="image-uploader-container">
                    {!field.combinedSectionImage ? (
                      <div className="image-upload-button-container image-upload-button-view-full">
                        <input
                          type="file"
                          accept="image/png, image/jpg, image/jpeg, image/webp"
                          onChange={(e) => {
                            handleImageChange(index, e.target.files[0]);
                          }}
                          className="image-upload-button"
                        />
                        Click here or drag an image here to upload
                      </div>
                    ) : (
                      <>
                        <div
                          className={`image-upload-preview`}
                          id={`image-upload-preview-${index}`}
                          style={{
                            backgroundImage: `url(${URL.createObjectURL(
                              field.combinedSectionImage
                            )})`,
                          }}
                        />
                        <div className="image-action-buttons">
                          <button
                            className="image-action-button"
                            onClick={() => {
                              const newFields = [...combinedFields];
                              newFields[index].combinedSectionImage = null;
                              setCombinedFields(newFields);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {field.accordion &&
                  field.accordion.map((accordian, accordianIndex) => (
                    <>
                      <Accordian
                        key={`accordian-${index}-${accordianIndex}`}
                        title={accordian.title}
                        content={accordian.content}
                        fieldIndex={index}
                        accordianIndex={accordianIndex}
                        onInputBlur={handleInputBlur}
                        onDeleteAccordion={handleDeleteAccordian}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFields = [...combinedFields];
                          newFields[index].accordion.push({
                            title: "",
                            content: "",
                          });
                          setCombinedFields(newFields);
                        }}
                      >
                        Add Accordion
                      </button>
                    </>
                  ))}

                {field.hasOwnProperty("editorValue") && (
                  <div className="input-row__editor">
                    <Editor
                      apiKey="720nkcx75ws79fcln5kf33j5klsu2vkzoeqowjjuu3axulkt"
                      init={{
                        plugins:
                          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                      }}
                      onEditorChange={(content) => {
                        const newFields = [...combinedFields];
                        newFields[index].editorValue = content;
                        props.setValue(props.name, newFields);
                        setCombinedFields(newFields);
                      }}
                      value={field.editorValue}
                      name={props.name}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )),
      [combinedFields, handleImageChange, handleInputBlur, props]
    );
    return (
      <div>
        {renderCombinedFields}
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            type="button"
            className="dynamicPointsInput__btn dynamicPointsInput__add"
            onClick={handleAddEditorField}
          >
            <i className="fa fa-plus" aria-hidden="true" />{" "}
            {props.addButtonText
              ? props.addButtonText
              : "Add Field With Editor"}
          </button>
          <button
            type="button"
            className="dynamicPointsInput__btn dynamicPointsInput__add"
            onClick={handleAddAccordionField}
          >
            <i className="fa fa-plus" aria-hidden="true" />{" "}
            {props.addButtonText
              ? props.addButtonText
              : "Add Field With Accordion"}
          </button>
        </div>
      </div>
    );
  } else if (props.inputComponent === "pointersWithIcons") {
    const [pointers, setPointers] = useState([{ icon: null, title: "" }]);

    const handleAddPointer = useCallback(() => {
      setPointers((prevPointers) => {
        const newPointers = [...prevPointers, { icon: null, title: "" }];
        props.setValue(props.name, newPointers);
        return newPointers;
      });
    }, [props.name, props.setValue]);

    const handleDeletePointer = useCallback(
      (index) => {
        setPointers((prevPointers) => {
          const newPointers = prevPointers.filter((_, i) => i !== index);
          props.setValue(props.name, newPointers);
          return newPointers;
        });
      },
      [props.name, props.setValue]
    );

    const handleInputBlur = useCallback(
      (index, value, type) => {
        setPointers((prevPointers) => {
          const newPointers = [...prevPointers];
          newPointers[index][type] = value;
          // If the type is "icon" and there's an image_preview element, update it
          if (type === "icon") {
            const imagePreviewElement = document.querySelector(
              `#imagePreview-${index}`
            );
            if (imagePreviewElement && value) {
              imagePreviewElement.style.backgroundImage = `url(${URL.createObjectURL(
                value
              )})`;
            }
          }
          props.setValue(props.name, newPointers);
          return newPointers;
        });
      },
      [props.name, props.setValue]
    );

    const handleDropTargetClick = (index) => {
      const inputFile = document.getElementById(`inputFile-imageBox-${index}`);
      if (inputFile) {
        inputFile.click();
      }
    };

    const renderPoints = useMemo(
      () =>
        pointers.map((point, index) => (
          <>
            <div key={`point-${index}`} className="input-row__pointers">
              <div
                className="drop-target"
                onClick={() => handleDropTargetClick(index)}
              >
                <div
                  id={`imagePreview-${index}`}
                  className="image_preview"
                ></div>
                <input
                  id={`inputFile-imageBox-${index}`}
                  type="file"
                  onChange={(e) => {
                    handleInputBlur(index, e.target.files[0], "icon");
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  // placeholder={`Point ${index + 1}`}
                  placeholder={
                    props.placeholder ? props.placeholder : `Point ${index + 1}`
                  }
                  defaultValue={point.title}
                  style={{
                    width: "100%",
                  }}
                  onBlur={(e) =>
                    handleInputBlur(index, e.target.value, "title")
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  handleDeletePointer(index);
                }}
                style={{
                  border: "none",
                  background: "none",
                }}
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "red", fontSize: "20px" }}
                ></i>{" "}
              </button>
            </div>
          </>
        )),
      [pointers, handleAddPointer, handleInputBlur, handleDeletePointer]
    );

    return (
      <>
        {renderPoints}
        <button type="button" onClick={handleAddPointer}>
          <i className="fa fa-plus" aria-hidden="true" />{" "}
          {props.addButtonText ? props.addButtonText : "Add Point"}
        </button>
      </>
    );
  } else if (props.inputComponent === "growthBox") {
    const [growthBoxes, setGrowthBoxes] = useState([
      { image: null, title: "", percentage: "", description: "" },
    ]);

    const handleAddGrowthBox = useCallback(() => {
      setGrowthBoxes((prevGrowthBoxes) => {
        const newGrowthBoxes = [
          ...prevGrowthBoxes,
          { image: null, title: "", percentage: "", description: "" },
        ];
        props.setValue(props.name, newGrowthBoxes);
        return newGrowthBoxes;
      });
    }, [props.name, props.setValue]);

    const handleDeleteGrowthBox = useCallback(
      (index) => {
        setGrowthBoxes((prevGrowthBoxes) => {
          const newGrowthBoxes = prevGrowthBoxes.filter((_, i) => i !== index);
          props.setValue(props.name, newGrowthBoxes);
          return newGrowthBoxes;
        });
      },
      [props.name, props.setValue]
    );

    const handleInputBlur = useCallback(
      (index, value, type) => {
        setGrowthBoxes((prevGrowthBoxes) => {
          const newGrowthBoxes = [...prevGrowthBoxes];
          newGrowthBoxes[index][type] = value;
          // If the type is "icon" and there's an image_preview element, update it
          if (type === "image") {
            const imagePreviewElement = document.querySelector(
              `#imagePreview-${index}`
            );
            if (imagePreviewElement && value) {
              imagePreviewElement.style.backgroundImage = `url(${URL.createObjectURL(
                value
              )})`;
            }
          }
          props.setValue(props.name, newGrowthBoxes);
          return newGrowthBoxes;
        });
      },
      [props.name, props.setValue]
    );

    const handleDropTargetClick = (index) => {
      const inputFile = document.getElementById(`inputFile-${index}`);
      if (inputFile) {
        inputFile.click();
      }
    };

    const renderBox = useMemo(
      () =>
        growthBoxes.map((box, index) => (
          <div key={`box-${index}`}>
            <div className="input-row__growth-box">
              <div
                className="drop-target"
                onClick={() => handleDropTargetClick(index)}
              >
                <div
                  id={`imagePreview-${index}`}
                  className="image_preview"
                ></div>
                <input
                  id={`inputFile-${index}`}
                  type="file"
                  onChange={(e) => {
                    handleInputBlur(index, e.target.files[0], "image");
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  // placeholder={`Point ${index + 1}`}
                  placeholder={
                    props.placeholder ? props.placeholder : `Title ${index + 1}`
                  }
                  defaultValue={box.title}
                  style={{
                    width: "100%",
                  }}
                  onBlur={(e) =>
                    handleInputBlur(index, e.target.value, "title")
                  }
                />
                <input
                  type="text"
                  // placeholder={`Point ${index + 1}`}
                  placeholder={
                    props.placeholder
                      ? props.placeholder
                      : `Percentage ${index + 1}`
                  }
                  defaultValue={box.percentage}
                  style={{
                    width: "100%",
                  }}
                  onBlur={(e) =>
                    handleInputBlur(index, e.target.value, "percentage")
                  }
                />
                <input
                  type="text"
                  // placeholder={`Point ${index + 1}`}
                  placeholder={
                    props.placeholder
                      ? props.placeholder
                      : `Description ${index + 1}`
                  }
                  defaultValue={box.description}
                  style={{
                    width: "100%",
                  }}
                  onBlur={(e) =>
                    handleInputBlur(index, e.target.value, "description")
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  handleDeleteGrowthBox(index);
                }}
                style={{
                  border: "none",
                  background: "none",
                }}
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "red", fontSize: "20px" }}
                ></i>{" "}
              </button>
            </div>
          </div>
        )),
      [growthBoxes, handleAddGrowthBox, handleInputBlur, handleDeleteGrowthBox]
    );

    return (
      <>
        {renderBox}
        <button type="button" onClick={handleAddGrowthBox}>
          <i className="fa fa-plus" aria-hidden="true" />{" "}
          {props.addButtonText ? props.addButtonText : "Add Box"}
        </button>
      </>
    );
  } else if (props.inputComponent === "accordionWithoutRichtext") {
    const [accordians, setAccordians] = useState([{ title: "", content: "" }]);

    const handleAddAccordian = useCallback(() => {
      setAccordians((prevAccordians) => {
        const newAccordians = [...prevAccordians, { title: "", content: "" }];
        props.setValue(props.name, newAccordians);
        return newAccordians;
      });
    }, [props.name, props.setValue]);

    const handleDeleteAccordian = useCallback(
      (index) => {
        setAccordians((prevAccordians) => {
          const newAccordians = prevAccordians.filter((_, i) => i !== index);
          props.setValue(props.name, newAccordians);
          return newAccordians;
        });
      },
      [props.name, props.setValue]
    );

    const handleInputBlur = useCallback(
      (index, value, type) => {
        setAccordians((prevAccordians) => {
          const newAccordians = [...prevAccordians];
          newAccordians[index][type] = value;
          props.setValue(props.name, newAccordians);
          return newAccordians;
        });
      },
      [props.name, props.setValue]
    );

    return (
      <>
        <div
          className="accordion-without-richtext"
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          {accordians.map((accordian, index) => (
            <div
              key={`accordian-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "column",
                }}
              >
                <div className={`input-row__title`}>
                  <input
                    type="text"
                    placeholder={`Title ${index + 1}`}
                    defaultValue={accordian.title}
                    onBlur={(e) =>
                      handleInputBlur(index, e.target.value, "title")
                    }
                    className="full-width-input"
                    name={`fourPoints-${index}`}
                  />
                </div>
                <div className="input-row__content">
                  <textarea
                    placeholder={`Content ${index + 1}`}
                    defaultValue={accordian.content}
                    onBlur={(e) =>
                      handleInputBlur(index, e.target.value, "content")
                    }
                    className="full-width-input"
                    name={`fourPoints-${index}`}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteAccordian(index)}
                className="dynamicPointsInput__btn dynamicPointsInput__delete"
                key={`delete-${index}`}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddAccordian}>
          <i className="fa fa-plus" aria-hidden="true" />{" "}
          {props.addButtonText ? props.addButtonText : "Add Point"}
        </button>
      </>
    );
  } else if (props.inputComponent === "imageBox") {
    const [imageBoxes, setImageBoxes] = useState([
      { image: null, title: "", description: "" },
    ]);

    const handleAddImageBox = useCallback(() => {
      setImageBoxes((prevImageBoxes) => {
        const newImageBoxes = [
          ...prevImageBoxes,
          { image: null, title: "", description: "" },
        ];
        props.setValue(props.name, newImageBoxes);
        return newImageBoxes;
      });
    }, [props.name, props.setValue]);

    const handleDeleteImageBox = useCallback(
      (index) => {
        setImageBoxes((prevImageBoxes) => {
          const newImageBoxes = prevImageBoxes.filter((_, i) => i !== index);
          props.setValue(props.name, newImageBoxes);
          return newImageBoxes;
        });
      },
      [props.name, props.setValue]
    );

    const handleInputBlur = useCallback(
      (index, value, type) => {
        setImageBoxes((prevImageBoxes) => {
          const newImageBoxes = [...prevImageBoxes];
          newImageBoxes[index][type] = value;
          // If the type is "icon" and there's an image_preview element, update it
          if (type === "image") {
            const imagePreviewElement = document.querySelector(
              `#imagePreview-imageBox-${index}`
            );
            if (imagePreviewElement && value) {
              imagePreviewElement.style.backgroundImage = `url(${URL.createObjectURL(
                value
              )})`;
            }
          }
          props.setValue(props.name, newImageBoxes);
          return newImageBoxes;
        });
      },
      [props.name, props.setValue]
    );

    const handleDropTargetClick = (index) => {
      const inputFile = document.getElementById(`inputFile-${index}`);
      if (inputFile) {
        inputFile.click();
      }
    };

    const renderBox = useMemo(
      () =>
        imageBoxes.map((box, index) => (
          <div key={`box-${index}`}>
            <div className="input-row__growth-box">
              <div
                className="drop-target"
                onClick={() => handleDropTargetClick(index)}
              >
                <div
                  id={`imagePreview-imageBox-${index}`}
                  className="image_preview"
                ></div>
                <input
                  id={`inputFile-${index}`}
                  type="file"
                  onChange={(e) => {
                    handleInputBlur(index, e.target.files[0], "image");
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  // placeholder={`Point ${index + 1}`}
                  placeholder={
                    props.placeholder ? props.placeholder : `Title ${index + 1}`
                  }
                  defaultValue={box.title}
                  style={{
                    width: "100%",
                  }}
                  onBlur={(e) =>
                    handleInputBlur(index, e.target.value, "title")
                  }
                />
                <input
                  type="text"
                  // placeholder={`Point ${index + 1}`}
                  placeholder={
                    props.placeholder
                      ? props.placeholder
                      : `Description ${index + 1}`
                  }
                  defaultValue={box.description}
                  style={{
                    width: "100%",
                  }}
                  onBlur={(e) =>
                    handleInputBlur(index, e.target.value, "description")
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  handleDeleteImageBox(index);
                }}
                style={{
                  border: "none",
                  background: "none",
                }}
              >
                <i
                  className="fa-solid fa-xmark"
                  style={{ color: "red", fontSize: "20px" }}
                ></i>{" "}
              </button>
            </div>
          </div>
        )),
      [imageBoxes, handleAddImageBox, handleInputBlur, handleDeleteImageBox]
    );

    return (
      <>
        {renderBox}
        <button type="button" onClick={handleAddImageBox}>
          <i className="fa fa-plus" aria-hidden="true" />{" "}
          {props.addButtonText ? props.addButtonText : "Add Box"}
        </button>
      </>
    );
  }
});

InputField.displayName = "InputField";

export default InputField;
