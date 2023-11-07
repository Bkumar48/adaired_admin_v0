import { Routes, Route } from "react-router-dom";
import Sidebar from "../global/sidebar/Sidebar";
import AllUsers from "../pages/AllUsers";
import TopNav from "../global/topnav/TopNav";
import Dashboard from "../pages/Dashboard";

const Layout = () => {
  return (
    <>
      <div className="layout">
        <Sidebar />
        <div className="layout__content">
          <TopNav />
          <div className="layout__content-main">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="all-users" element={<AllUsers />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
