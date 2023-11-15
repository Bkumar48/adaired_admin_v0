// Package imports
import axios from "axios";
import { useEffect, useState, lazy, Suspense, startTransition } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// Components Imports
import formatDate from "../../utils/DateFormatting/FormatDate";
const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));
const FilterTableCard = lazy(() =>
  import("../../components/filterTableCard/FilterTableCard")
);

// Table Header Data
const TableHead = ["No.", "Title", "Keywords", "Slug", "Status", "Actions"];

// renderHead function
const renderHead = (item, index) => <th key={index}>{item}</th>;

// renderBody function
const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={item._id}>
      <td>{calculateIndex}</td>
      <td>{item.title}</td>
      <td>{item.keyword}</td>
      <td>{item.slug}</td>
      <td>{item.product_status === true ? "Active" : "Inactive"}</td>
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

const AllPages = () => {
  // State management
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all pages
  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setPages([]);
    });
    const fetchPages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/pages/pageList`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setPages(res.data.data);
          setLoading(false);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchPages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Cards header="All Pages" addnew="/add-page">
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={pages}
                renderBody={(item, index) => renderBody(item, index, pages)}
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllPages;
