import { Suspense } from "react";

const Cards = (props) => {
  return (
    <div className="card">
      {props.header && (
        <div className="card__header-box">
          <h1 className="page-header">{props.header}</h1>
          {props.search && (
            <div className="card__search">
              <input type="text" placeholder="Search here..." />
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          )}
        </div>
      )}
      <Suspense fallback={<div>Loading...</div>}>{props.children}</Suspense>
    </div>
  );
};

export default Cards;
