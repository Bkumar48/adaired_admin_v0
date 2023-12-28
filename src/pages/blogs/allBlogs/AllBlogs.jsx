// Package imports
import { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../../utils/QueryClient/queryClient";
import { useNavigate } from "react-router-dom";

// Components Imports
import formatDate from "../../../utils/DateFormatting/FormatDate";
const Table = lazy(() => import("../../../components/table/Table"));
const Cards = lazy(() => import("../../../components/card/Cards"));

const token = sessionStorage.getItem("token");
if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Table Header Data
const TableHead = [
  "No.",
  "Blog",
  "Category",
  "Slug",
  "Created At",
  "Updated By",
  "Status",
  "Actions",
];

// renderHead function
const renderHead = (item, index) => <th key={index}>{item}</th>;

// renderBody function
const renderBody = (item, index, items, navigate, onDeleteClick) => {
  const calculateIndex = items.indexOf(item) + 1;

  return (
    <tr key={index}>
      <td>{calculateIndex}</td>
      <td>{item.title}</td>
      <td>{item.category}</td>
      <td>{item.slug}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{item.author}</td>
      <td>{item.status}</td>
      <td>
        <div className="action__btn-cell">
          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Edit Blog"
            onClick={() => {
              navigate(`/edit-blog`);
            }}
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="View Blog"
          >
            <i className="fa-solid fa-eye"></i>
          </button>

          <button
            className="action__btn-item"
            href="#"
            data-tooltip="Delete Blog"
            onClick={() => {
              onDeleteClick(item._id);
            }}
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

  // Use the useNavigate hook
  const navigate = useNavigate();

  // Fetching all blogs
  const { data: blogsData } = useQuery("blogs", async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/user/blog/findBlog`
    );
    return res.data.result;
  });

  // Set the blogs state when data is available
  useEffect(() => {
    if (blogsData) {
      setBlogs(blogsData);
      setLoading(false);
    }
  }, [blogsData]);

  const onDeleteBlog = useMutation(
    (blogId) => {
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/user/blog/deleteBlog/${blogId}`
      );
    },
    {
      onSuccess: (blogId) => {
        setBlogs((prevBlogs) =>
          prevBlogs.filter((blog) => blog._id !== blogId)
        );
        queryClient.invalidateQueries("blogs");
      },
      onError: (err) => {
        console.log(err);
      },
      onSettled: () => {
        queryClient.invalidateQueries("blogs");
      },
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="row">
        <div className="col-12">
          <Cards
            header="All Blogs"
            addnew="/add-blog"
            addnewText="Add New Blog"
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={blogs}
                renderBody={(item, index) =>
                  renderBody(item, index, blogs, navigate, onDeleteBlog.mutate)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllBlogs;
