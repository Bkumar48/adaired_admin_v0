import { useState, useEffect } from "react";

const Table = (props) => {
  const [dataShow, setDataShow] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (props.bodyData && props.limit) {
      const start = currentPage * Number(props.limit);
      const end = start + Number(props.limit);
      setDataShow(props.bodyData.slice(start, end));
    }
  }, [props.bodyData, props.limit, currentPage]);

  useEffect(() => {
    if (props.bodyData) {
      const pages = Math.ceil(props.bodyData.length / Number(props.limit));
      // Create an array of page numbers from 0 to (pages - 1)
      const pageRange = [...Array(pages).keys()];
      if (pageRange.indexOf(currentPage) === -1) {
        // If the current page is out of range, go to the first page
        setCurrentPage(0);
      }
    }
  }, [props.bodyData, props.limit, currentPage]);

  const selectPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="table-wrapper">
        <table>
          {props.headData && props.renderHead ? (
            <thead>
              <tr>
                {props.headData.map((item, index) =>
                  props.renderHead(item, index)
                )}
              </tr>
            </thead>
          ) : null}
          {props.bodyData && props.renderBody ? (
            <tbody>
              {Array.isArray(dataShow)
                ? dataShow.map((item, index) => props.renderBody(item, index))
                : null}
            </tbody>
          ) : null}
        </table>
      </div>
      {props.bodyData &&
      props.limit &&
      props.bodyData.length > Number(props.limit) ? (
        <div className="table__footer">
          <div className="table__pagination-info">
            <p>
              Showing {currentPage * Number(props.limit) + 1} to{" "}
              {Math.min(
                (currentPage + 1) * Number(props.limit),
                props.bodyData.length
              )}{" "}
              of {props.bodyData.length} entries
            </p>
          </div>

          <div className="table__pagination">
            {Array.from({
              length: Math.ceil(props.bodyData.length / Number(props.limit)),
            }).map((_, index) => (
              <div
                key={index}
                className={`table__pagination-item ${
                  currentPage === index ? "active" : ""
                }`}
                onClick={() => selectPage(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Table;
