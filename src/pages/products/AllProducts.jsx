// Package imports
import axios from "axios";
import { useEffect, useState, lazy, Suspense, startTransition } from "react";
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
  "Name",
  "Price",
  "Category",
  "Stock",
  "Status",
  "Actions",
];

// renderHead function
const renderHead = (item, index) => <th key={index}>{item}</th>;

// renderBody function
const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={item._id}>
      <td>{calculateIndex}</td>
      <td className="product_cell customer_cell">
        <img
          src={`https://demo.adaired.com/demoadaired/upload/product/${item.image}`}
          alt={"img"}
          loading="lazy"
        />
        <div>
          <p className="customer_name">{item.title}</p>
        </div>
      </td>
      <td>{item.price}$/Unit</td>
      <td>{item.parent_cate_id}</td>
      <td>{item.stock}</td>
      <td
        className={`status-cell ${item.product_status ? "active" : "inactive"}`}
      >
        {item.product_status ? "Active" : "Inactive"}
      </td>

      <td>
        <div className="action__btn-cell">
          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Edit Product"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="View Product"
          >
            <i className="fa-solid fa-eye"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Delete Product"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Save Product"
          >
            <i className="fa-solid fa-floppy-disk"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

const AllProducts = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [productCategoryId, setProductCategoryId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchInputs, setSearchInputs] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [filterCardVisible, setFilterCardVisible] = useState(false);

  const handleSearchChange = (filterObject) => {
    // if (products?.data && Array.isArray(products.data)) {
    const filteredData = products.proData.filter((item) => {
      return Object.keys(filterObject).every((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(filterObject[key].toLowerCase());
      });
    });
    // Update the filteredUsers state with the filteredData
    setFilteredProducts({ proData: filteredData });

    setFilterValues(filterObject);
    setFilterCardVisible(true);
    console.log(filteredData);
    // }
  };

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setProducts([]);
    });
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/product/allProduct`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setProducts(res.data);
          setFilteredProducts(res.data);
          setLoading(false);

          // Initialize searchInputs here when users.data is available
          const inputs = res.data?.proData[0] || {};
          const KeysToIgnore = ["updatedAt", "createdAt", "__v", "_id"];
          const filteredKeys = Object.keys(inputs).filter(
            (key) => !KeysToIgnore.includes(key)
          );
          setSearchInputs(filteredKeys);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    
    fetchProducts();
  }, []);

  const toggleFilterPopup = () => {
    setFilterCardVisible(!filterCardVisible);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          {filterCardVisible && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
            >
              <FilterTableCard
                TableHead={searchInputs}
                onClose={toggleFilterPopup}
                handleSearchChange={handleSearchChange}
              />
            </motion.div>
          )}
          <Cards
            header="All Products"
            search={true}
            toggleFilterPopup={toggleFilterPopup}
            addnew="/products/add-product"
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={filteredProducts.proData} // Use the correct property
                renderBody={(item, index) =>
                  renderBody(item, index, products.proData)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
