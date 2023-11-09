import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Sidebar from "../global/sidebar/Sidebar";
import TopNav from "../global/topnav/TopNav";
import FilterTableCard from "../components/filterTableCard/FilterTableCard";
// import AllProducts from "../pages/products/AllProducts";

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
                <Route path="all-users" element={<AllUsers />} />
                <Route path="all-products" element={<FilterTableCard />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
