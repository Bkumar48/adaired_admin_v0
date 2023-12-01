// import { useState, useEffect, lazy, Suspense } from "react";
// import axios from "axios";
// import { useQuery } from "react-query";
// import { queryClient } from "../../../utils/QueryClient/queryClient";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// const Table = lazy(() => import("../../../components/table/Table"));
// const Cards = lazy(() => import("../../../components/card/Cards"));
// const Loader = lazy(() => import("../../../components/loader/Loader"));
// const FilterTableCard = lazy(() =>
//   import("../../../components/filterTableCard/FilterTableCard")
// );

// const TableHead = ["No.", "Customer", "Phone", "Role", "Status", "Actions"];

// const token = sessionStorage.getItem("token");
// if (token) {
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

// const fetchData = async () =>
//   (await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/all-users`))
//     .data;
// import ActionButtons from "./../../../components/actionButtons/ActionButtons";

// const deleteUser = async (id) => {
//   try {
//     await axios.delete(
//       `${import.meta.env.VITE_API_URL}/api/v1/user/delUser/?userId=${id}`
//     );
//     queryClient.invalidateQueries("allUsers");
//   } catch (error) {
//     console.log(error);
//   }
// };

// const AllUsers = () => {
//   const [searchInputs, setSearchInputs] = useState([]);
//   const [filterCardVisible, setFilterCardVisible] = useState(false);

//   const {
//     data: users,
//     isLoading,
//     error,
//   } = useQuery("allUsers", fetchData, {
//     staleTime: 0,
//     cacheTime: 0,
//   });

//   useEffect(() => {
//     const inputs = users?.data?.[0] || {};
//     setSearchInputs(
//       Object.keys(inputs).filter(
//         (key) =>
//           ![
//             "updatedAt",
//             "createdAt",
//             "__v",
//             "_id",
//             "refreshToken",
//             "roleType",
//           ].includes(key)
//       )
//     );
//   }, [users]);

//   const handleSearchChange = (filterObject) => {
//     const filteredData = users.data.filter((item) =>
//       Object.keys(filterObject).every((key) =>
//         String(item[key])
//           .toLowerCase()
//           .includes(filterObject[key].toLowerCase())
//       )
//     );
//     queryClient.setQueryData("allUsers", { data: filteredData });
//     setFilterCardVisible(true);
//   };

//   const toggleFilterPopup = () => setFilterCardVisible(!filterCardVisible);

//   if (isLoading) return <Loader />;
//   if (error) return <div>{error.response.data.message}</div>;

//   return (
//     <div className="row">
//       <div className="col-12">
//         {filterCardVisible && (
//           <motion.div
//             initial={{ y: -100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -100, opacity: 0 }}
//           >
//             <FilterTableCard
//               TableHead={searchInputs}
//               onClose={toggleFilterPopup}
//               handleSearchChange={handleSearchChange}
//             />
//           </motion.div>
//         )}

//         <Cards
//           header="All Users"
//           addnew="/add-user"
//           addnewText="Add New User"
//           search={true}
//           toggleFilterPopup={toggleFilterPopup}
//         >
//           <Suspense fallback={<Loader />}>
//             <Table
//               limit="10"
//               headData={TableHead}
//               renderHead={(item, index) => <th key={index}>{item}</th>}
//               bodyData={users.data}
//               renderBody={(item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td className="customer_cell">
//                     <i className="fa-solid fa-user-tie"></i>
//                     <div>
//                       <p className="customer_name">{`${item.firstName} ${item.lastName}`}</p>
//                       <p className="customer_email">{item.email}</p>
//                     </div>
//                   </td>
//                   <td>{item.contact}</td>
//                   <td>{item.roleType}</td>
//                   <td>{item.status === 1 ? "Active" : "Inactive"}</td>
//                   <td>
//                     {" "}
//                     <ActionButtons
//                       edit_link={`/edit-user/${item._id}`}
//                       delete_function={() => deleteUser(item._id)}
//                     />
//                   </td>
//                 </tr>
//               )}
//             />
//           </Suspense>
//         </Cards>
//       </div>
//     </div>
//   );
// };

// export default AllUsers;

// import { useState, useEffect, lazy, Suspense } from "react";
// import axios from "axios";
// import { useQuery, useQueryClient } from "react-query";
// import { motion } from "framer-motion";
// import ActionButtons from "./../../../components/actionButtons/ActionButtons";
// import Cards from "./../../../components/card/Cards";
// import Loader from "./../../../components/loader/Loader";
// import FilterTableCard from "./../../../components/filterTableCard/FilterTableCard";
// import Table from "./../../../components/table/Table";

// const TableHead = ["No.", "Customer", "Phone", "Role", "Status", "Actions"];

// const token = sessionStorage.getItem("token");
// if (token) {
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// }

// const fetchData = async () =>
//   (await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/all-users`))
//     .data;

// const deleteUser = async (id, queryClient) => {
//   try {
//     const previousData = queryClient.getQueryData("allUsers");
//     if (previousData) {
//       queryClient.setQueryData(
//         "allUsers",
//         previousData.data.filter((user) => user._id !== id)
//       );
//     }

//     await axios.delete(
//       `${import.meta.env.VITE_API_URL}/api/v1/user/delUser/?userId=${id}`
//     );

//     queryClient.invalidateQueries("allUsers");
//   } catch (error) {
//     console.log(error);
//     queryClient.invalidateQueries("allUsers");
//   }
// };

// const AllUsers = () => {
//   const [searchInputs, setSearchInputs] = useState([]);
//   const [filterCardVisible, setFilterCardVisible] = useState(false);

//   const queryClient = useQueryClient();

//   const {
//     data: users,
//     isLoading,
//     error,
//   } = useQuery("allUsers", fetchData, {
//     staleTime: 0,
//     cacheTime: 0,
//   });

//   useEffect(() => {
//     const inputs = users?.data?.[0] || {};
//     setSearchInputs(
//       Object.keys(inputs).filter(
//         (key) =>
//           ![
//             "updatedAt",
//             "createdAt",
//             "__v",
//             "_id",
//             "refreshToken",
//             "roleType",
//           ].includes(key)
//       )
//     );
//   }, [users]);

//   const handleSearchChange = (filterObject) => {
//     const filteredData = users.data.filter((item) =>
//       Object.keys(filterObject).every((key) =>
//         String(item[key])
//           .toLowerCase()
//           .includes(filterObject[key].toLowerCase())
//       )
//     );
//     queryClient.setQueryData("allUsers", { data: filteredData });
//     setFilterCardVisible(true);
//   };

//   const toggleFilterPopup = () => setFilterCardVisible(!filterCardVisible);

//   const handleDeleteUser = (id) => {
//     deleteUser(id, queryClient);
//   };

//   if (isLoading) return <Loader />;
//   if (error) return <div>{error.response.data.message}</div>;

//   return (
//     <div className="row">
//       <div className="col-12">
//         {filterCardVisible && (
//           <motion.div
//             initial={{ y: -100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -100, opacity: 0 }}
//           >
//             <FilterTableCard
//               TableHead={searchInputs}
//               onClose={toggleFilterPopup}
//               handleSearchChange={handleSearchChange}
//             />
//           </motion.div>
//         )}

//         <Cards
//           header="All Users"
//           addnew="/add-user"
//           addnewText="Add New User"
//           search={true}
//           toggleFilterPopup={toggleFilterPopup}
//         >
//           <Suspense fallback={<Loader />}>
//             <Table
//               limit="10"
//               headData={TableHead}
//               renderHead={(item, index) => <th key={index}>{item}</th>}
//               bodyData={users.data}
//               renderBody={(item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td className="customer_cell">
//                     <i className="fa-solid fa-user-tie"></i>
//                     <div>
//                       <p className="customer_name">{`${item.firstName} ${item.lastName}`}</p>
//                       <p className="customer_email">{item.email}</p>
//                     </div>
//                   </td>
//                   <td>{item.contact}</td>
//                   <td>{item.roleType}</td>
//                   <td>{item.status === 1 ? "Active" : "Inactive"}</td>
//                   <td>
//                     <ActionButtons
//                       edit_link={`/edit-user/${item._id}`}
//                       delete_function={() => handleDeleteUser(item._id)}
//                     />
//                   </td>
//                 </tr>
//               )}
//             />
//           </Suspense>
//         </Cards>
//       </div>
//     </div>
//   );
// };

// export default AllUsers;


import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Import other components and styles as needed

const Table = lazy(() => import("../../../components/table/Table"));
const Cards = lazy(() => import("../../../components/card/Cards"));
const Loader = lazy(() => import("../../../components/loader/Loader"));
const FilterTableCard = lazy(() =>
  import("../../../components/filterTableCard/FilterTableCard")
);
import ActionButtons from "./../../../components/actionButtons/ActionButtons";

const TableHead = ["No.", "Customer", "Phone", "Role", "Status", "Actions"];

const token = sessionStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const fetchData = async () =>
  (await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/all-users`))
    .data;

const deleteUser = async (id, setUsers) => {
  try {
    // Optimistically update the local state
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));

    // Make the actual API request to delete the user
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/v1/user/delUser/?userId=${id}`
    );

    // Fetch the updated data in the background and update the local state
    const updatedData = await fetchData();
    setUsers(updatedData.data);
  } catch (error) {
    console.log(error);
  }
};

const AllUsers = () => {
  const [searchInputs, setSearchInputs] = useState([]);
  const [filterCardVisible, setFilterCardVisible] = useState(false);
  const [users, setUsers] = useState([]);

  const {
    data: initialUsers,
    isLoading,
    error,
  } = useQuery("allUsers", fetchData, {
    staleTime: 0,
    cacheTime: 0,
  });

  useEffect(() => {
    const inputs = initialUsers?.data?.[0] || {};
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

    // Set the initial data to the local state
    setUsers(initialUsers?.data || []);
  }, [initialUsers]);

  const handleSearchChange = (filterObject) => {
    const filteredData = initialUsers.data.filter((item) =>
      Object.keys(filterObject).every((key) =>
        String(item[key])
          .toLowerCase()
          .includes(filterObject[key].toLowerCase())
      )
    );
    setUsers(filteredData);
    setFilterCardVisible(true);
  };

  const toggleFilterPopup = () => setFilterCardVisible(!filterCardVisible);

  const handleDeleteUser = (id) => {
    deleteUser(id, setUsers);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>{error.response.data.message}</div>;

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
              bodyData={users}
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
                  <td>{item.status === 1 ? "Active" : "Inactive"}</td>
                  <td>
                    <ActionButtons
                      edit_link={`/edit-user/${item._id}`}
                      delete_function={() => handleDeleteUser(item._id)}
                    />
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
