import { useState, useEffect, lazy, Suspense, startTransition } from "react";
import axios from "axios";

const customerTableHead = ["No.", "Name", "Email", "Phone", "Role", "Actions"];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index, items) => {
  const calculateIndex = items.indexOf(item) + 1;
  return (
    <tr key={index}>
      <td>{calculateIndex}</td>
      <td>{item.firstName + " " + item.lastName}</td>
      <td>{item.email}</td>
      <td>{item.mobile}</td>
      <td>{item.roleType}</td>
      <td>
        <button className="btn btn-success me-2">View</button>
        <button className="btn btn-primary me-2">Edit</button>
        <button className="btn btn-danger">Delete</button>
      </td>
    </tr>
  );
};

const Table = lazy(() => import("../../components/table/Table"));
const Cards = lazy(() => import("../../components/card/Cards"));

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      setUsers([]);
    });
    const getUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/user/all-users`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
          }
        );
        startTransition(() => {
          setUsers(res.data);
          setLoading(false);
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    getUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <Cards header={"All Users"} search={true}>
            <Suspense fallback={<div>Loading...</div>}>
              <Table
                limit="10"
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={users.data}
                renderBody={(item, index) =>
                  renderBody(item, index, users.data)
                }
              />
            </Suspense>
          </Cards>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
