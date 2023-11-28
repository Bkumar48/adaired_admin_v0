import { lazy } from "react";
const JoditEditor = lazy(() => import("jodit-react"));
const JoditRichTextField = (props) => {
  return (
    <>
      <JoditEditor
        value={props.value}
        onBlur={props.onBlur}
        onChange={props.onChange}
        config={props.config}
        tabIndex={props.tabIndex}
        name={props.name}
      />
    </>
  );
};

export default JoditRichTextField;
