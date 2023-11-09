import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const FilterTableCard = lazy(() =>
  import("../../components/filterTableCard/FilterTableCard")
);

const customerTableHead = ["No.", "Customer", "Phone", "Role", "Actions"];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={index}>
      <td>{calculateIndex}</td>
      <td className="customer_cell">
        <i className="fa-solid fa-user-tie"></i>
        <div>
          <p className="customer_name">
            {item.firstName + " " + item.lastName}
          </p>
          <p className="customer_email">{item.email}</p>
        </div>
      </td>
      <td>{item.mobile}</td>
      <td>{item.roleType}</td>
      <td>
        <div className="action__btn-cell">
          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Edit User"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="View User"
          >
            <i className="fa-solid fa-eye"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Delete User"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchInputs, setSearchInputs] = useState([]);

  const [filterValues, setFilterValues] = useState({});
  const [filterCardVisible, setFilterCardVisible] = useState(false);

  const handleSearchChange = (filterObject) => {
    // Update the searchInputs object with the new key-value pairs

    // Filter the users.data array based on the searchInputs object
    const filteredData = users.data.filter((item) => {
      return Object.keys(filterObject).every((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(filterObject[key].toLowerCase());
      });
    });

    // Update the filteredUsers state with the filteredData
    setFilteredUsers({ data: filteredData });

    setFilterValues(filterObject);
    setFilterCardVisible(true);
  };

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setUsers([]);
    });

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/all-users`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );

        startTransition(() => {
          setUsers(res.data);
          setFilteredUsers(res.data);
          setLoading(false);

          // Initialize searchInputs here when users.data is available
          const inputs = res.data?.data[0] || {};
          const KeysToIgnore = [
            "updatedAt",
            "createdAt",
            "__v",
            "_id",
            "refreshToken",
            "roleType",
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

    fetchData();
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
                customerTableHead={searchInputs}
                onClose={toggleFilterPopup}
                handleSearchChange={handleSearchChange}
              />
            </motion.div>
          )}

          <Cards
            header={"All Users"}
            addnew={"/"}
            search={true}
            toggleFilterPopup={toggleFilterPopup}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={filteredUsers.data}
                renderBody={(item, index) =>
                  renderBody(item, index, users.data)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
