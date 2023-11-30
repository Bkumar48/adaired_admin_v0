import { lazy, Suspense } from "react";
const InputField = lazy(() => import("./InputField"));
const Loader = lazy(() => import("../loader/Loader"));
import { Controller } from "react-hook-form";
const InputBox = (props) => {
  return (
    <div className="input-box">
      <label htmlFor={props.htmlFor}>{props.label}</label>
      <Controller
        name={props.name}
        control={props.control}
        defaultValue={props.defaultValue}
        render={({ field }) => (
          <Suspense fallback={<Loader />}>
            <InputField {...props} field={field} />
          </Suspense>
        )}
      />
    </div>
  );
};

export default InputBox;
