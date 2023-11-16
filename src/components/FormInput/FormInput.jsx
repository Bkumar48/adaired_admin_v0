import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const FormInput = (props) => {
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
  }

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
    />
  );
};

export default FormInput;
