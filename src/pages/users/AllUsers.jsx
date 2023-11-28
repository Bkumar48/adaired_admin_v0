import React, {
  useState,
  useEffect,
  lazy,
  Suspense,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));
const Loader = lazy(() => import("../../components/loader/Loader"));
const { default: FilterTableCard } = await import(
  "../../components/filterTableCard/FilterTableCard"
);

const TableHead = ["No.", "Customer", "Phone", "Role", "Actions"];

// Set default headers for axios
axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${sessionStorage.getItem("token")}`;

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={index}>
      <td>{calculateIndex}</td>
      <td className="customer_cell">
        <i className="fa-solid fa-user-tie"></i>
        <div>
          <p className="customer_name">{`${item.firstName} ${item.lastName}`}</p>
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

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchInputs, setSearchInputs] = useState([]);
  const [filterCardVisible, setFilterCardVisible] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/all-users`
      );

      setUsers(res.data);
      setFilteredUsers(res.data);

      // Initialize searchInputs when users.data is available
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
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (filterObject) => {
    const filteredData = users.data.filter((item) =>
      Object.keys(filterObject).every((key) =>
        String(item[key])
          .toLowerCase()
          .includes(filterObject[key].toLowerCase())
      )
    );

    setFilteredUsers({ data: filteredData });
    setFilterCardVisible(true);
  };

  const toggleFilterPopup = () => {
    setFilterCardVisible(!filterCardVisible);
  };

  if (loading) {
    return <Loader />;
  }

  return (
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
          header={"All Users"}
          addnew={"/add-user"}
          addnewText={"Add New User"}
          search={true}
          toggleFilterPopup={toggleFilterPopup}
        >
          <Suspense fallback={<Loader />}>
            <Table
              limit="10"
              headData={TableHead}
              renderHead={(item, index) => renderHead(item, index)}
              bodyData={filteredUsers.data}
              renderBody={(item, index) => renderBody(item, index, users.data)}
            />
          </Suspense>
        </Cards>
      </div>
    </div>
  );
};

export default AllUsers;
