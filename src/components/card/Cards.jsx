import { Suspense } from "react";
import { Link } from "react-router-dom";
const Cards = (props) => {
  return (
    <div className="card">
      {props.header && (
        <div className="card__header-box">
          <h1 className="page-header">{props.header}</h1>
          <div className="card__btn-box">
            {props.search && (
              <>
                <button
                  className="card__btn "
                  data-tooltip="Search"
                  onClick={props.toggleFilterPopup}
                >
                  <i className="fa-solid fa-search"></i>
                  Search
                </button>
              </>
            )}
            {props.addnew && (
              <>
                <Link to={props.addnew}>
                  <button
                    className="card__btn "
                    data-tooltip={props.addnewText}
                  >
                    <i className="fa-solid fa-plus"></i>
                    <p>{props.addnewText}</p>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      <Suspense fallback={<div>Loading...</div>}>{props.children}</Suspense>
    </div>
  );
};

export default Cards;
