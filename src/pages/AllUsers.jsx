import { useState, useEffect } from "react";
import Table from "../components/table/Table";
import axios from "axios";

const customerTableHead = ["Id", "Name", "Email", "Phone", "Role", "Actions"];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const renderBody = (item, index) => {
  // console.log(item);
  return (
    <tr key={index}>
      <td>{item._id}</td>
      {/* <td>{item.firstName + " " + item.lastName}</td> */}
      <td>{item.userName}</td>
      <td>{item.email}</td>
      <td>{item.mobile}</td>
      <td>{item.role}</td>
      <td>
        <button className="btn btn-success me-2">View</button>
        <button className="btn btn-primary me-2">Edit</button>
        <button className="btn btn-danger">Delete</button>
      </td>
    </tr>
  );
};
const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
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
        setUsers(res.data);
      } catch (error) {
        throw new Error(error);
      }
    };
    getUsers();
  }, []);
  return (
    <div>
      <h1>All Users</h1>
      <div className="row">
        <div className="col-12">
          <Table
            limit="10"
            headData={customerTableHead}
            renderHead={(item, index) => renderHead(item, index)}
            bodyData={users.data}
            renderBody={(item, index) => renderBody(item, index)}
          />
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
