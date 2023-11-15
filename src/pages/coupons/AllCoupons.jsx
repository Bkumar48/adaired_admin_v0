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
  "Code",
  "Discount",
  "Discount Type",
  "Discount On",
  "Created On",
  "Expiry status",
  "Status",
  "Actions",
];

// renderHead function
const renderHead = (item, index) => <th key={index}>{item}</th>;

// format date function
function formatDate(dateString) {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
}

// renderBody function
const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={item._id}>
      <td>{calculateIndex}</td>
      <td>{item.code}</td>
      <td>{item.discount}</td>
      <td>{item.discountType === 1 ? "Percentage" : "Flat"}</td>
      <td>{item.discount_on}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>
        {item.expireStatus ? `Expired On ${item.expire}` : `${item.expire}`}
      </td>

      <td className={`status-cell ${item.status ? "active" : "inactive"}`}>
        {item.status ? "Active" : "Inactive"}
      </td>

      <td>
        <div className="action__btn-cell">
          <button className="action__btn-item" href="#" data-tooltip="Edit">
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button className="action__btn-item" href="#" data-tooltip="View">
            <i className="fa-solid fa-eye"></i>
          </button>

          <button className="action__btn-item" href="#" data-tooltip="Delete">
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

const AllCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCoupon, setFilteredCoupon] = useState([]);
  const [searchInputs, setSearchInputs] = useState([]);
  const [filterCardVisible, setFilterCardVisible] = useState(false);

  const handleSearchChange = (filterObject) => {
    const filteredData = coupons.data.filter((item) => {
      return Object.keys(filterObject).every((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(filterObject[key].toLowerCase());
      });
    });
    setFilteredCoupon({ data: filteredData });
    setFilterCardVisible(true);
  };

  //   Fetch Coupons
  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setCoupons([]);
    });
    const fetchCoupons = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/admin/coupon/getall?limit&skip&expiryStatus=&coupon=&expiryStatus`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );

        startTransition(() => {
          setCoupons(res.data);
          setFilteredCoupon(res.data);
          setLoading(false);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchCoupons();
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
            header="All Coupons"
            search={true}
            toggleFilterPopup={toggleFilterPopup}
            addnew="/add-coupon"
          >
            <Suspense fallback={<div>Loading...</div>}>
              <AnimatePresence>
                <Table
                  limit="10"
                  headData={TableHead}
                  bodyData={filteredCoupon.data}
                  renderHead={(item, index) => renderHead(item, index)}
                  renderBody={(item, index) =>
                    renderBody(item, index, coupons.data)
                  }
                />
              </AnimatePresence>
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllCoupons;
