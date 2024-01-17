// import {
//   useState,
//   useEffect,
//   lazy,
//   useCallback,
//   useMemo,
// } from "react";
// import axios from "axios";
// import Table from "../../../components/table/Table";
// import Cards from "../../../components/card/Cards";
// import Loader from "../../../components/loader/Loader";

// // Set default headers for axios
// axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem("token")}`;

// const TableHead = ["No.", "Service Title", "Slug", "Childrens", "Actions"];

// const renderHead = (item, index) => <th key={index}>{item}</th>;

// const renderBody = (item, index, handleDeleteMainService) => (
//   <tr key={index}>
//     <td>{index + 1}</td>
//     <td>{item.serviceTitle}</td>
//     <td>{item.slug}</td>
//     <td>{item.childrens}</td>
//     <td>
//       <div className="action__btn-cell">
//         <button className="action__btn-item" href="#" data-tooltip="View Page">
//           <i className="fa-solid fa-eye"></i>
//         </button>
//         <button className="action__btn-item" href="#" data-tooltip="Edit Page">
//           <i className="fa-solid fa-edit"></i>
//         </button>
//         <button
//           className="action__btn-item"
//           href="#"
//           data-tooltip="Delete Page"
//           onClick={() => handleDeleteMainService(item._id)}
//         >
//           <i className="fa-solid fa-trash"></i>
//         </button>
//       </div>
//     </td>
//   </tr>
// );

// const AllMainServices = () => {
//   const [mainServices, setMainServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchAllMainServices = useCallback(async () => {
//     try {
//       const { data } = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/v1/admin/main-services/`
//       );
//       setMainServices(data);
//     } catch (error) {
//       console.error("Error fetching main services:", error);
//       setError(error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAllMainServices();
//   }, [fetchAllMainServices]);

//   const handleDeleteMainService = useCallback(
//     async (id) => {
//       try {
//         await axios.delete(
//           `${import.meta.env.VITE_API_URL}/api/v1/admin/main-services/${id}`
//         );
//         fetchAllMainServices();
//       } catch (error) {
//         console.error("Error deleting main service:", error);
//         setError("Failed to delete the main service. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     [fetchAllMainServices]
//   );

//   const renderTable = useMemo(() => {
//     if (error) {
//       return <div>Something went wrong: {error.message}</div>;
//     }

//     return (
//       <Table
//         limit="10"
//         headData={TableHead}
//         renderHead={renderHead}
//         bodyData={mainServices.data || []}
//         renderBody={(item, index) => renderBody(item, index, handleDeleteMainService)}
//       />
//     );
//   }, [error, mainServices.data, handleDeleteMainService]);

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div>
//       <div className="row">
//         <div className="col-12">
//           <Cards
//             header="All Main Services"
//             addnew={`/add-main-service`}
//             addnewText="Add New Main Service"
//           >
//             {mainServices.data && mainServices.data.length > 0 ? (
//               renderTable
//             ) : (
//               <div>No main services available.</div>
//             )}
//           </Cards>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AllMainServices;

import { useState, useEffect, lazy, useCallback, useMemo } from "react";
import axios from "axios";
import Table from "../../../components/table/Table";
import Cards from "../../../components/card/Cards";
import Loader from "../../../components/loader/Loader";

// Set default headers for axios
axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${sessionStorage.getItem("token")}`;

const TableHead = ["No.", "Service Title", "Slug", "Childrens", "Actions"];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, handleDeleteMainService) => (
  <tr key={index}>
    <td>{index + 1}</td>
    <td>{item.serviceTitle}</td>
    <td>{item.slug}</td>
    <td>{item.childrens}</td>
    <td>
      <div className="action__btn-cell">
        <button className="action__btn-item" href="#" data-tooltip="View Page">
          <i className="fa-solid fa-eye"></i>
        </button>
        <button className="action__btn-item" href="#" data-tooltip="Edit Page">
          <i className="fa-solid fa-edit"></i>
        </button>
        <button
          className="action__btn-item"
          href="#"
          data-tooltip="Delete Page"
          onClick={() => handleDeleteMainService(item._id)}
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </td>
  </tr>
);

const AllMainServices = () => {
  const [mainServices, setMainServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllMainServices = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/services/`
      );
      setMainServices(data);
    } catch (error) {
      console.error("Error fetching main services:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllMainServices();
  }, [fetchAllMainServices]);

  const handleDeleteMainService = useCallback(
    async (id) => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/v1/admin/main-services/${id}`
        );
        fetchAllMainServices();
      } catch (error) {
        console.error("Error deleting main service:", error);
        setError("Failed to delete the main service. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [fetchAllMainServices]
  );

  const renderTable = useMemo(() => {
    return (
      <Table
        limit="10"
        headData={TableHead}
        renderHead={renderHead}
        bodyData={mainServices.data || []}
        renderBody={(item, index) =>
          renderBody(item, index, handleDeleteMainService)
        }
      />
    );
  }, [mainServices.data, handleDeleteMainService]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Cards
            header="All Main Services"
            addnew={`/add-main-service`}
            addnewText="Add New Main Service"
          >
            {mainServices.data && mainServices.data.length > 0 ? (
              renderTable
            ) : (
              <>
                {renderTable}
                <div>No main services available.</div>
              </>
            )}
          </Cards>
        </div>
      </div>
    </div>
  );
};

export default AllMainServices;
