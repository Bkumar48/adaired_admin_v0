import { Link } from "react-router-dom";

const SideBarFooter = () => {
  return (
    <div className="sidebar__footer-wrapper">
      <div className="sidebar__footer">
        <li>
          <Link to="/dashboard/aboutus">About us</Link>
        </li>
        <i className="fa-solid fa-circle"></i>
        <li>
          <Link to="/dashboard/contactus">Contact Us</Link>
        </li>
        <i className="fa-solid fa-circle"></i>
        <li>
          <Link to="/dashboard/lega;">Legal</Link>
        </li>
      </div>
    </div>
  );
};

export default SideBarFooter;
