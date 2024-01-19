import { lazy, Suspense } from "react";
const InputField = lazy(() => import("./InputField"));
// const Loader = lazy(() => import("../loader/Loader"));
import { Controller } from "react-hook-form";
const InputBox = (props) => {
  // console.log(props.rules)

  return (
    <div className="input-box">
      <label htmlFor={props.htmlFor}>{props.label}</label>
      <Controller
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue}
        render={({ field }) => (
          <Suspense fallback={<div>Loading.....</div>}>
            <InputField {...props} field={field} />
          </Suspense>
        )}
        rules={props.rules}
      />
  
    </div>
  );
};

export default InputBox;
