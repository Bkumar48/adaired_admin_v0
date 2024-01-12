import React, { lazy, useCallback, useState, useMemo, useRef } from "react";
import "react-phone-input-2/lib/style.css";
import "./InputField.scss";
import { Editor } from "@tinymce/tinymce-react";
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
        <Editor
          apiKey="720nkcx75ws79fcln5kf33j5klsu2vkzoeqowjjuu3axulkt"
          init={{
            plugins:
              "tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
            toolbar:
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            tinycomments_mode: "embedded",
            tinycomments_author: "Bittu Kumar",
            mergetags_list: [
              { value: "First.Name", title: "First Name" },
              { value: "Email", title: "Email" },
            ],
          }}
          onEditorChange={(content) => props.setValue(props.name, content)}
          value={props.field?.value}
          name={props.name}
        />

        {props.error && <p className="error">{props.error}</p>}
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
                accept="image/png, image/jpg, image/jpeg"
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
  }
  // else if (props.inputComponent === "combinedfield") {
  //   const [combinedFields, setCombinedFields] = useState([]);

  //   const handleAddField = useCallback(() => {
  //     setCombinedFields((prevFields) => {
  //       const newFields = [...prevFields, { image: null, editorValue: "" }];
  //       return newFields;
  //     });
  //   }, [props.name, props.setValue]);

  //   const handleDeleteField = useCallback(
  //     (index) => {
  //       setCombinedFields((prevFields) => {
  //         const newFields = prevFields.filter((_, i) => i !== index);

  //         props.setValue(props.name, newFields);
  //         return newFields;
  //       });
  //     },
  //     [props.name, props.setValue]
  //   );

  //   const handleInputBlur = useCallback(
  //     (index, value) => {
  //       setCombinedFields((prevFields) => {
  //         const newFields = [...prevFields];
  //         newFields[index].editorValue = value;
  //         props.setValue(props.name, newFields);
  //         return newFields;
  //       });
  //     },
  //     [props.name, props.setValue]
  //   );

  //   const handleImageChange = useCallback(
  //     (index, image) => {
  //       setCombinedFields((prevFields) => {
  //         const newFields = [...prevFields];
  //         newFields[index].image = image;
  //         props.setValue(props.name, newFields);
  //         return newFields;
  //       });
  //     },
  //     [props.name, props.setValue]
  //   );

  //   const renderCombinedFields = useMemo(
  //     () =>
  //       combinedFields.map((field, index) => (
  //         <>
  //           <button
  //             type="button"
  //             onClick={() => handleDeleteField(index)}
  //             className="dynamicPointsInput__btn dynamicPointsInput__delete"
  //             style={{ float: "right" }}
  //             key={`delete-${index}`}
  //           >
  //             <i className="fa-solid fa-trash"></i>
  //           </button>
  //           <div
  //             key={`field-${index}`}
  //             className={`input-row input-row__combinedField ${
  //               index % 2 === 0 ? "even" : "odd"
  //             }`}
  //           >
  //             <div className={`input-row__image display-box`}>
  //               <div className="icon-text-box">
  //                 <div className="upload-icon">
  //                   <i className="fa fa-upload" aria-hidden="true" />
  //                 </div>
  //                 <div className="upload-text">
  //                   {field.image ? (
  //                     <h4>{field.image.name}</h4>
  //                   ) : (
  //                     <h4>Choose Files to Upload</h4>
  //                   )}
  //                 </div>
  //               </div>
  //               <input
  //                 type="file"
  //                 accept="image/*"
  //                 onChange={(e) => handleImageChange(index, e.target.files[0])}
  //                 className="upload-image-input"
  //               />
  //             </div>
  //             <div className="input-row__editor">
  //               {/* <JoditEditor
  //                 value={field.editorValue}
  //                 onBlur={(value) => handleInputBlur(index, value)}
  //                 onChange={props.onChange}
  //                 config={props.config}
  //                 tabIndex={props.tabIndex}
  //                 name={props.name}
  //               /> */}
  //               <Editor
  //                 apiKey="720nkcx75ws79fcln5kf33j5klsu2vkzoeqowjjuu3axulkt"
  //                 init={{
  //                   plugins:
  //                     "tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
  //                   toolbar:
  //                     "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
  //                   tinycomments_mode: "embedded",
  //                   tinycomments_author: "Author name",
  //                   mergetags_list: [
  //                     { value: "First.Name", title: "First Name" },
  //                     { value: "Email", title: "Email" },
  //                   ],
  //                 }}
  //                 onEditorChange={(content) => handleInputBlur(index, content)}
  //               />
  //             </div>
  //           </div>
  //         </>
  //       )),
  //     [
  //       combinedFields,
  //       handleAddField,
  //       handleInputBlur,
  //       handleDeleteField,
  //       handleImageChange,
  //     ]
  //   );

  //   return (
  //     <div>
  //       {renderCombinedFields}
  //       <button
  //         type="button"
  //         className="dynamicPointsInput__btn dynamicPointsInput__add"
  //         onClick={handleAddField}
  //       >
  //         <i className="fa fa-plus" aria-hidden="true" />{" "}
  //         {props.addButtonText ? props.addButtonText : "Add Field"}
  //       </button>
  //     </div>
  //   );
  // }
  else if (props.inputComponent === "accordion") {
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
                <Editor
                  apiKey="720nkcx75ws79fcln5kf33j5klsu2vkzoeqowjjuu3axulkt"
                  init={{
                    plugins:
                      "tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    mergetags_list: [
                      { value: "First.Name", title: "First Name" },
                      { value: "Email", title: "Email" },
                    ],
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
    const [combinedFields, setCombinedFields] = useState([]);

    const handleAddAccordionField = useCallback(() => {
      setCombinedFields((prevFields) => {
        const newFields = [
          ...prevFields,
          {
            combinedSectionImage: "",
            accordion: [{ title: "", content: "", heading: "" }],
          },
        ];
        return newFields;
      });
    }, [props.name, props.setValue]);

    const handleAddEditorField = useCallback(() => {
      setCombinedFields((prevFields) => {
        const newFields = [
          ...prevFields,
          { combinedSectionImage: "", editorValue: "", heading: "" },
        ];
        return newFields;
      });
    }, [props.name, props.setValue]);

    const handleDeleteField = useCallback(
      (index) => {
        setCombinedFields((prevFields) => {
          const newFields = prevFields.filter((_, i) => i !== index);
          return newFields;
        });
      },
      [props.name, props.setValue]
    );

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
      [props.name, props.setValue]
    );

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

    const handleInputBlur = useCallback(
      (fieldIndex, accordianIndex, value, type) => {
        setCombinedFields((prevFields) => {
          const newFields = [...prevFields];
          newFields[fieldIndex].accordion[accordianIndex][type] = value;
          props.setValue(props.name, newFields);
          return newFields;
        });
      },
      [props.name, props.setValue]
    );

    const Accordian = ({
      title,
      content,
      fieldIndex,
      accordianIndex,
      onInputBlur,
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
              onClick={() => {
                const newFields = [...combinedFields];
                newFields[fieldIndex].accordion.splice(accordianIndex, 1);
                setCombinedFields(newFields);
              }}
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
              <Editor
                apiKey="720nkcx75ws79fcln5kf33j5klsu2vkzoeqowjjuu3axulkt"
                init={{
                  plugins:
                    "tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                  ],
                }}
                onEditorChange={(content) => {
                  const newFields = [...combinedFields];
                  newFields[fieldIndex].accordion[accordianIndex].content =
                    content;
                  setCombinedFields(newFields);
                }}
                value={content}
                name={props.name}
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
                {/* <div className={`input-row__image display-box`}>
                  
                  <div className="icon-text-box">
                    <div className="upload-icon">
                      <i className="fa fa-upload" aria-hidden="true" />
                    </div>
                    <div className="upload-text">
                      {field.combinedSectionImage ? (
                        <h4>{field.combinedSectionImage.name}</h4>
                      ) : (
                        <h4>Choose Files to Upload</h4>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(index, e.target.files[0]);
                    }}
                    className="upload-image-input"
                  />
                </div> */}

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
                          accept="image/png, image/jpg, image/jpeg"
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
                    <JoditEditor
                      value={field.editorValue}
                      onBlur={(value) => {
                        const newFields = [...combinedFields];
                        newFields[index].editorValue = value;
                        props.setValue(props.name, newFields);
                        setCombinedFields(newFields);
                      }}
                      onChange={props.onChange}
                      config={props.config}
                      tabIndex={props.tabIndex}
                      name={props.name}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )),
      [
        combinedFields,
        handleDeleteField,
        handleImageChange,

        handleInputBlur,
        props,
      ]
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
      const inputFile = document.getElementById(`inputFile-${index}`);
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
                  id={`inputFile-${index}`}
                  type="file"
                  onChange={(e) => {
                    handleInputBlur(index, e.target.files[0], "icon");
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder={`Point ${index + 1}`}
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
  }
});

InputField.displayName = "InputField";

export default InputField;
