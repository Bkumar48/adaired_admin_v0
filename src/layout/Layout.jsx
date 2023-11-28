import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Higher-order component for lazy loading
const lazyComponent = (importStatement) => lazy(() => import(importStatement));

// Components
const NotLoggedIn = lazyComponent("../components/404_notLoggedin/NotLoggedIn");
const Sidebar = lazyComponent("../global/sidebar/Sidebar");
const TopNav = lazyComponent("../global/topnav/TopNav");
const Dashboard = lazyComponent("../pages/dashboard/Dashboard");
const AddUser = lazyComponent("../pages/users/AddUser");
const AllUsers = lazyComponent("../pages/users/AllUsers");
const AllProducts = lazyComponent("../pages/products/AllProducts");
const AllCoupons = lazyComponent("../pages/coupons/AllCoupons");
const AllRoles = lazyComponent("../pages/roles/AllRoles");
const AllProductCategories = lazyComponent(
  "../pages/products/AllProductCategories"
);
const AllOrders = lazyComponent("../pages/orders/AllOrders");
const AllBlogs = lazyComponent("../pages/blogs/AllBlogs");
const AllBlogsCategories = lazyComponent("../pages/blogs/AllBlogCategories");
const AllTickets = lazyComponent("../pages/tickets/AllTickets");
const AllPages = lazyComponent("../pages/pages/AllPages");
const AllTestimonials = lazyComponent("../pages/testimonials/AllTestimonials");
const AllFaqs = lazyComponent("../pages/faqs/AllFaqs");
const AllFaqCategories = lazyComponent("../pages/faqs/AllFaqCategories");
const LoginSignup = lazyComponent("../pages/login_signup/LoginSignup");
const AllMainServices = lazyComponent(
  "../pages/main_service_pages/allMainServices/AllMainServices"
);
const AddMainServices = lazyComponent(
  "../pages/main_service_pages/addMainService/AddMainServices"
);
const Loader = lazyComponent("../components/loader/Loader");

const Layout = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    try {
      // Check for token in session storage
      const token = sessionStorage.getItem("token");
      // Update login status based on the presence of the token
      setIsUserLoggedIn(Boolean(token));
    } catch (error) {
      setError(error);
    } finally {
      // Set loading to false after checking session storage
      setLoading(false);
    }
  }, []);

  // Wait until the session storage check is complete
  if (loading) {
    return <Loader />;
  }

  // Handle errors
  if (error) {
    return <div>Something went wrong: {error.message}</div>;
  }

  return (
    <div className="layout">
      {isUserLoggedIn ? (
        <>
          <Sidebar />
          <div className="layout__content">
            <TopNav setIsUserLoggedIn={setIsUserLoggedIn} />
            <div className="layout__content-main">
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route index element={<Dashboard />} />
                  {dashboardRoutes.map((route, index) => (
                    <Route key={index} {...route} />
                  ))}
                </Routes>
              </Suspense>
            </div>
          </div>
        </>
      ) : (
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                index
                element={<LoginSignup setIsUserLoggedIn={setIsUserLoggedIn} />}
              />
              {/* Redirect to login if user is not logged in */}
              <Route path="*" element={<NotLoggedIn />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default Layout;

// Separate route configuration
const dashboardRoutes = [
  { path: "all-users", element: <AllUsers /> },
  { path: "add-user", element: <AddUser /> },
  { path: "all-roles", element: <AllRoles /> },
  { path: "all-products", element: <AllProducts /> },
  { path: "all-product-categories", element: <AllProductCategories /> },
  { path: "all-coupons", element: <AllCoupons /> },
  { path: "all-orders", element: <AllOrders /> },
  { path: "all-blogs", element: <AllBlogs /> },
  { path: "all-blog-categories", element: <AllBlogsCategories /> },
  { path: "all-tickets", element: <AllTickets /> },
  { path: "all-pages", element: <AllPages /> },
  { path: "all-testimonials", element: <AllTestimonials /> },
  { path: "all-faqs", element: <AllFaqs /> },
  { path: "all-faq-categories", element: <AllFaqCategories /> },
  { path: "add-main-service", element: <AddMainServices /> },
  { path: "all-main-services", element: <AllMainServices /> },
];
