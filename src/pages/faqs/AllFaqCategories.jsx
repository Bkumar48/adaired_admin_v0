// Package imports
import axios from "axios";
import { useEffect, useState, lazy, Suspense, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components Imports
const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));

// Table Header Data
const TableHead = [
  "No.",
  "Category",
  "Parent Category",
  "Slug",
  "Status",
  "Actions",
];

// renderHead function
const renderHead = (item, index) => <th key={index}>{item}</th>;

// renderBody function
const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={item._id}>
      <td>{calculateIndex}</td>
      <td>{item.name}</td>
      <td>{item.parent_id}</td>
      <td>{item.slug}</td>
      <td>{item.status}</td>
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

const AllFaqCategories = () => {
  // State management hooks
  const [faqCategories, setFaqCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching all faqs
  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setFaqCategories([]);
    });

    const fetchFaqCategories = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/faq/faqCateList`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setFaqCategories(res.data);
          setLoading(false);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchFaqCategories();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="row">
        <div className="col-12">
          <Cards header="All FAQ Categories" addnew="/add-faq-category">
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={faqCategories.data}
                renderBody={(item, index) =>
                  renderBody(item, index, faqCategories.data)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllFaqCategories;
