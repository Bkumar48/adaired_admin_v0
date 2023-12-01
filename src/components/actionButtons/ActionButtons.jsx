import { Link } from "react-router-dom";
const ActionButtons = (props) => {
  return (
    <div className="action__btn-cell">
      {props.edit_link && (
        <button
          className="action__btn-item"
          href="#"
          data-tooltip={props.tooltip || "Edit"}
        >
          <Link to={props.edit_link}>
            <i className="fa-solid fa-edit"></i>
          </Link>
        </button>
      )}
      {props.view && (
        <button className="action__btn-item" href="#" data-tooltip="View User">
          <i className="fa-solid fa-eye"></i>
        </button>
      )}
      {props.delete_function && (
        <button
          className="action__btn-item"
          href="#"
          data-tooltip="Delete User"
          onClick={props.delete_function}
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
