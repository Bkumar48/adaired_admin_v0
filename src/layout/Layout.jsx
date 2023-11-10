import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Sidebar from "../global/sidebar/Sidebar";
import TopNav from "../global/topnav/TopNav";
import AddUser from "../pages/users/AddUser";

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const AllUsers = lazy(() => import("../pages/users/AllUsers"));
const AllProducts = lazy(() => import("../pages/products/AllProducts"));

const Layout = () => {
  return (
    <>
      <div className="layout">
        <Sidebar />
        <div className="layout__content">
          <TopNav />
          <div className="layout__content-main">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route index element={<Dashboard />} />

                {/* Users Routes */}
                <Route path="all-users" element={<AllUsers />} />
                <Route path="add-user" element={<AddUser />} />

                <Route path="all-products" element={<AllProducts />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
