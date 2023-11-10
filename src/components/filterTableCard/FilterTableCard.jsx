import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const FilterTableCard = (props) => {
  const { TableHead, onClose, handleSearchChange } = props;
  const [filterValues, setFilterValues] = useState({});
  const modalRef = useRef();
  const formRef = useRef(); // Add a reference to the form

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterValues({ ...filterValues, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearchChange(filterValues);
  };

  return (
    <div className="filter__card">
      <motion.div
        ref={modalRef}
        className="card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" filter__card-header-box">
          <h1>Filter Table</h1>
          <i className="fa-solid fa-times" onClick={onClose}></i>
        </div>
        <div className="filter__table-card-body">
          <form ref={formRef} onSubmit={handleFormSubmit}>
            {TableHead && TableHead.map((item, index) => (
              <div className="form-group" key={index}>
                <label htmlFor={item}>{item.toUpperCase()}:</label>
                <input
                  type={item === "email" ? "email" : "text"}
                  id={item}
                  name={item}
                  value={filterValues[item] || ""}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </form>
          <div className="form-btn">
            <button
              className="filter__table-card-btn"
              type="submit"
              onClick={() => {
                formRef.current.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }}
            >
              Filter
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterTableCard;
