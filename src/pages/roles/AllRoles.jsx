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
const TableHead = ["No.", "Name", "Status", "Actions"];

// renderHead function
const renderHead = (item, index) => <th key={index}>{item}</th>;

// renderBody function
const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={item._id}>
      <td>{calculateIndex}</td>
      <td>{item.name}</td>
      <td className={`status-cell ${item.roleStatus ? "active" : "inactive"}`}>
        {item.status && item.status === 1 ? "Active" : "Inactive"}
      </td>

      <td>
        <div className="action__btn-cell">
          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Edit Role"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="View Role"
          >
            <i className="fa-solid fa-eye"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Delete Role"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

const AllRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchInputs, setSearchInputs] = useState({});
  const [filterCardVisible, setFilterCardVisible] = useState(false);

  //   Handle Search
  const handleSearchChange = (filterObject) => {
    const filterData = roles.data.filter((item) => {
      return Object.keys(filterObject).every((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(filterObject[key].toLowerCase());
      });
    });
    setFilteredRoles({ data: filterData });

    setFilterCardVisible(true);
  };

  //   Fetch all roles
  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setRoles([]);
    });
    const fetchRoles = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/users/roles/all`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setRoles(res.data);
          setFilteredRoles(res.data);
          setLoading(false);

          // Initialize the searchInputs  when the data is fetched
          const inputs = res.data?.data[0] || {};
          const KeysToIgnore = [
            "_id",
            "__v",
            "updated_at",
            "created_at",
            "description",
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
    fetchRoles();
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
            header="All Roles"
            search={true}
            toggleFilterPopup={toggleFilterPopup}
            addnew="/roles/add-role"
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={filteredRoles.data}
                renderBody={(item, index) =>
                  renderBody(item, index, roles.data)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllRoles;
