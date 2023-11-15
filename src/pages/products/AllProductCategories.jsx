// Package imports
import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Components Imports
const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));
const FilterTableCard = lazy(() =>
  import("../../components/filterTableCard/FilterTableCard")
);

// Table Header Data
const TableHead = [
  "No.",
  "Category",
  "Parent Category",
  "Slug",
  "Status",
  "Actions",
];

// renderHead function
const renderHead = (item, index) => <th key={index}>{item}</th>;

// renderBody function
const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={index}>
      <td>{calculateIndex}</td>
      <td>{item.name}</td>
      <td>{item.parent_id}</td>
      <td>{item.slug}</td>
      <td
        className={`status-cell ${
          item.category_status ? "active" : "inactive"
        }`}
      >
        {item.category_status ? "Active" : "Inactive"}
      </td>

      <td>
        <div className="action__btn-cell">
          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Edit Category"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          {/* <button
            className="action__btn-item"
            href="#"
            data-tooltip="View Category"
          >
            <i className="fa-solid fa-eye"></i>
          </button> */}

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Delete Category"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};
const AllProductCategories = () => {
  const [productCategories, setProductCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProductCategories, setFilteredProductCategories] = useState(
    []
  );
  const [error, setError] = useState(null);
  const [searchInputs, setSearchInputs] = useState([]);
  const [filterCardVisible, setFilterCardVisible] = useState(false);

  // Fetch All Product Categories
  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setProductCategories([]);
    });

    const fetchProductCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/product/productCateList`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setProductCategories(res.data);
          setFilteredProductCategories(res.data);
          setLoading(false);

          // Initialize the searchInputs state with the data from the API
          const inputs = res.data?.data[0] || {};
          const KeysToIgnore = [
            "_id",
            "created_at",
            "updated_at",
            "description",
            "image",
          ];
          const filteredKeys = Object.keys(inputs).filter(
            (key) => !KeysToIgnore.includes(key)
          );
          setSearchInputs(filteredKeys);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchProductCategories();
  }, []);

  const toggleFilterPopup = () => {
    setFilterCardVisible(!filterCardVisible);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="row">
        <div className="col-12">
          <Cards
            header="All Product Categories"
            search={false}
            toggleFilterPopup={toggleFilterPopup}
            addnew="/add-product-category"
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={filteredProductCategories.data}
                renderBody={(item, index) =>
                  renderBody(item, index, productCategories.data)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllProductCategories;
