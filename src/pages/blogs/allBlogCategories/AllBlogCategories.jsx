// Package imports
import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import axios from "axios";
// Components Imports
const Table = lazy(() => import("../../../components/table/Table"));
const Cards = lazy(() => import("../../../components/card/Cards"));
const token = sessionStorage.getItem("token");
if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Table Header Data
const TableHead = [
  "No.",
  "Category",
  "Parent Category",
  "Sub Categories",
  // "Slug",
  // "Status",
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
      <td>{item.categoryName}</td>
      <td>{item.parentId}</td>
      <td>
        {item.subCategories.map((subcategory, subIndex) => (
          <span key={subIndex}>
            {subcategory}
            {subIndex < item.subCategories.length - 1 && (
              <>
                ,<br />
              </>
            )}
          </span>
        ))}
      </td>
      {/* <td>{item.slug}</td>
      <td>{item.status}</td> */}
      <td>
        <div className="action__btn-cell">
          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Edit Category"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="View Category"
          >
            <i className="fa-solid fa-eye"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Delete Category"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

const AllBlogsCategories = () => {
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
          }/api/v1/admin/blogcategory/findCategory`
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
          <Cards
            header="All Blogs Catgories"
            addnew="/add-blog-category"
            addnewText="Add New Category"
          >
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

export default AllBlogsCategories;
