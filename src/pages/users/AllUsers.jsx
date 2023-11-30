import { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { queryClient } from "../../utils/QueryClient/queryClient";
import { motion } from "framer-motion";

const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));
const Loader = lazy(() => import("../../components/loader/Loader"));
const FilterTableCard = lazy(() =>
  import("../../components/filterTableCard/FilterTableCard")
);

const TableHead = ["No.", "Customer", "Phone", "Role", "Actions"];

const token = sessionStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const fetchData = async () =>
  (await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/all-users`))
    .data;

const AllUsers = () => {
  const [searchInputs, setSearchInputs] = useState([]);
  const [filterCardVisible, setFilterCardVisible] = useState(false);

  const { data: users, isLoading, error } = useQuery("allUsers", fetchData);

  useEffect(() => {
    const inputs = users?.data?.[0] || {};
    setSearchInputs(
      Object.keys(inputs).filter(
        (key) =>
          ![
            "updatedAt",
            "createdAt",
            "__v",
            "_id",
            "refreshToken",
            "roleType",
          ].includes(key)
      )
    );
  }, [users]);

  const handleSearchChange = (filterObject) => {
    const filteredData = users.data.filter((item) =>
      Object.keys(filterObject).every((key) =>
        String(item[key])
          .toLowerCase()
          .includes(filterObject[key].toLowerCase())
      )
    );
    queryClient.setQueryData("allUsers", { data: filteredData });
    setFilterCardVisible(true);
  };

  const toggleFilterPopup = () => setFilterCardVisible(!filterCardVisible);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading data</div>;

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
          header="All Users"
          addnew="/add-user"
          addnewText="Add New User"
          search={true}
          toggleFilterPopup={toggleFilterPopup}
        >
          <Suspense fallback={<Loader />}>
            <Table
              limit="10"
              headData={TableHead}
              renderHead={(item, index) => <th key={index}>{item}</th>}
              bodyData={users.data}
              renderBody={(item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="customer_cell">
                    <i className="fa-solid fa-user-tie"></i>
                    <div>
                      <p className="customer_name">{`${item.firstName} ${item.lastName}`}</p>
                      <p className="customer_email">{item.email}</p>
                    </div>
                  </td>
                  <td>{item.contact}</td>
                  <td>{item.roleType}</td>
                  <td>
                    {" "}
                    <div className="action__btn-cell">
                      <button
                        className="action__btn-item"
                        href="#"
                        data-tooltip="Edit User"
                      >
                        <i className="fa-solid fa-edit"></i>
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
              )}
            />
          </Suspense>
        </Cards>
      </div>
    </div>
  );
};

export default AllUsers;
