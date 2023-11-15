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
const TableHead = [
  "No.",
  "Order ID",
  "Customer",
  "Payment Id",
  "Amount",
  "BTC Recieved",
  "Order Date",
  "Payment Method",
  "Orer Status",
  "Payment Status",
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
      <td>{item.orderId}</td>
      <td>{item.userId.firstName + " " + item.userId.lastName}</td>
      <td>{item.txid}</td>
      <td>{item.amount}</td>
      <td>{item.bitcoinAmountReceive}</td>
      <td>{formatDate(item.createdAt)}</td>
      <td>{item.payment_method}</td>
      <td>{item.orderstatus}</td>
      <td>{item.payment_status}</td>
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

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchInputs, setSearchInputs] = useState([]);
  const [filterCardVisible, setFilterCardVisible] = useState(false);

  // Fetch all orders
  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setOrders([]);
    });
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/admin/order/getAllOrders?startDate=&endtDate=&limit&skip&orderno=&userMail=&order_status=&payment_status&payment_method=`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setLoading(false);
          setOrders(res.data);
          setFilteredOrders(res.data);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="row">
        <div className="col-12">
          <Cards header="All Orders" search={false}>
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={TableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={filteredOrders.data}
                renderBody={(item, index) =>
                  renderBody(item, index, orders.data)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </>
  );
};

export default AllOrders;
