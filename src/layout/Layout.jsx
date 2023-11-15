import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";

// Pages Imports
const Sidebar = lazy(() => import("../global/sidebar/Sidebar"));
const TopNav = lazy(() => import("../global/topnav/TopNav"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const AddUser = lazy(() => import("../pages/users/AddUser"));
const AllUsers = lazy(() => import("../pages/users/AllUsers"));
const AllProducts = lazy(() => import("../pages/products/AllProducts"));
const AllCoupons = lazy(() => import("../pages/coupons/AllCoupons"));
const AllRoles = lazy(() => import("../pages/roles/AllRoles"));
const AllProductCategories = lazy(() =>
  import("../pages/products/AllProductCategories")
);
const AllOrders = lazy(() => import("../pages/orders/AllOrders"));
const AllBlogs = lazy(() => import("../pages/blogs/AllBlogs"));
const AllBlogsCategories = lazy(() =>
  import("../pages/blogs/AllBlogCategories")
);
const AllTickets = lazy(() => import("../pages/tickets/AllTickets"));
const AllPages = lazy(() => import("../pages/pages/AllPages"));
const AllTestimonials = lazy(() =>
  import("../pages/testimonials/AllTestimonials")
);
const AllFaqs = lazy(() => import("../pages/faqs/AllFaqs"));
const AllFaqCategories = lazy(() => import("../pages/faqs/AllFaqCategories"));
const LoginSignup = lazy(() => import("../pages/login_signup/LoginSignup"));

const Layout = () => {
  const location = useLocation();
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    setIsLoginPage(location.pathname === "/");
  }, [location.pathname]);

  return (
    <>
      {location.pathname === "/" ? (
        <div className="layout">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route index element={<LoginSignup />} />
            </Routes>
          </Suspense>
        </div>
      ) : (
        <div className="layout">
          <Sidebar />
          <div className="layout__content">
            <TopNav />
            <div className="layout__content-main">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route index element={<LoginSignup />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Users Routes */}
                  <Route path="all-users" element={<AllUsers />} />
                  <Route path="add-user" element={<AddUser />} />

                  {/* Roles Routes */}
                  <Route path="all-roles" element={<AllRoles />} />

                  {/* Products Routes */}
                  <Route path="all-products" element={<AllProducts />} />
                  <Route
                    path="all-product-categories"
                    element={<AllProductCategories />}
                  />

                  {/* Coupons Routes */}
                  <Route path="all-coupons" element={<AllCoupons />} />

                  {/* Orders Routes */}
                  <Route path="all-orders" element={<AllOrders />} />

                  {/* Blogs Routes */}
                  <Route path="all-blogs" element={<AllBlogs />} />
                  <Route
                    path="all-blog-categories"
                    element={<AllBlogsCategories />}
                  />

                  {/* Tickets Routs */}
                  <Route path="all-tickets" element={<AllTickets />} />

                  {/* Pages Routes */}
                  <Route path="/all-pages" element={<AllPages />} />

                  {/* Testimonials Routes */}
                  <Route
                    path="all-testimonials"
                    element={<AllTestimonials />}
                  />

                  {/* FAQs Routes */}
                  <Route path="all-faqs" element={<AllFaqs />} />
                  <Route
                    path="all-faq-categories"
                    element={<AllFaqCategories />}
                  />
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
