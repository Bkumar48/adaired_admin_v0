// Package imports
import axios from "axios";
import { useEffect, useState, lazy, Suspense, startTransition } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// Components Imports
const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));
const FilterTableCard = lazy(() =>
  import("../../components/filterTableCard/FilterTableCard")
);

// Table Header Data
const TableHead = ["No.", "Name", "Status", "Actions"];

// renderHead function
const renderHead = (item, index) => <th key={index}>{item}</th>;

// renderBody function
const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={item._id}>
      <td>{calculateIndex}</td>
      <td className="customer_cell">
        <img src={`https://demo.adaired.com/demoadaired/upload/testimonial/${item.image}`} alt="img" />
        <div>
          <p className="customer_name">{item.title}</p>
        </div>
      </td>

      <td>{item.status === true ? "Active" : "Inactive"}</td>
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

const AllTestimonials = () => {
  // State management
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all testimonials
  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setTestimonials([]);
    });
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/vi/admin/testimonial/getAll?limit&skip&search=`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setLoading(false);
          setTestimonials(res.data.data);
          console.log(res.data.data);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <div className="row">
        <div className="col-12">
          <Cards
            header="All Testimonials"
            search={true}
            addnew="/add-testimonial"
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={testimonials}
                renderBody={(item, index) =>
                  renderBody(item, index, testimonials)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllTestimonials;
