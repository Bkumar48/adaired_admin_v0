// Package imports
import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Components Imports
import formatDate from "../../utils/DateFormatting/FormatDate";
const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));
const FilterTableCard = lazy(() =>
  import("../../components/filterTableCard/FilterTableCard")
);

// Table Header Data
const TableHead = [
  "No.",
  "Blog",
  "Category",
  "Updated By",
  "Created At",
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
      <td>{item.title}</td>
      <td>{item.category}</td>
      <td>{item.author}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{item.status}</td>
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

const AllBlogs = () => {
  // State management hooks
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching all blogs
  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setBlogs([]);
    });
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/user/blog/all-blogs?limit=&skip=`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setBlogs(res.data.data);
          setLoading(false);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="row">
        <div className="col-12">
          <Cards header="All Blogs" addnew="/add-blog">
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={blogs}
                renderBody={(item, index) => renderBody(item, index, blogs)}
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllBlogs;
