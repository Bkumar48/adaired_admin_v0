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
const AddUser = lazyComponent("../pages/users/addUser/AddUser");
const EditUser = lazyComponent("../pages/users/editUser/EditUser");
const AllUsers = lazyComponent("../pages/users/allUsers/AllUsers");
const AllProducts = lazyComponent("../pages/products/AllProducts");
const AllCoupons = lazyComponent("../pages/coupons/AllCoupons");
const AllRoles = lazyComponent("../pages/roles/AllRoles");
const AllProductCategories = lazyComponent(
  "../pages/products/AllProductCategories"
);
const AllOrders = lazyComponent("../pages/orders/AllOrders");
const AllTickets = lazyComponent("../pages/tickets/AllTickets");
const AllPages = lazyComponent("../pages/pages/AllPages");
const AllTestimonials = lazyComponent("../pages/testimonials/AllTestimonials");
const AllFaqs = lazyComponent("../pages/faqs/AllFaqs");
const AllFaqCategories = lazyComponent("../pages/faqs/AllFaqCategories");
const LoginSignup = lazyComponent("../pages/login_signup/LoginSignup");
const AllServices = lazyComponent(
  "../pages/servicePages/allServices/AllServices"
);
const AddServices = lazyComponent(
  "../pages/servicePages/addService/AddServices"
);
const Loader = lazyComponent("../components/loader/Loader");

// Blogs and Blogs Categories
const AddBlog = lazyComponent("../pages/blogs/addBlog/AddBlog.jsx");
const EditBlog = lazyComponent("../pages/blogs/editBlog/EditBlog.jsx");
const AllBlogs = lazyComponent("../pages/blogs/allBlogs/AllBlogs");
const AllBlogsCategories = lazyComponent(
  "../pages/blogs/allBlogCategories/AllBlogCategories"
);

// Case Studies
const AddCaseStudyCategory = lazyComponent(
  "../pages/caseStudies/category/AddCategory.jsx"
);
const AllCaseStudyCategories = lazyComponent(
  "../pages/caseStudies/category/AllCategories.jsx"
);

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
  { path: "edit-user", element: <EditUser /> },
  { path: "all-roles", element: <AllRoles /> },
  { path: "all-products", element: <AllProducts /> },
  { path: "all-product-categories", element: <AllProductCategories /> },
  { path: "all-coupons", element: <AllCoupons /> },
  { path: "all-orders", element: <AllOrders /> },
  { path: "all-tickets", element: <AllTickets /> },
  { path: "all-pages", element: <AllPages /> },
  { path: "all-testimonials", element: <AllTestimonials /> },
  { path: "all-faqs", element: <AllFaqs /> },
  { path: "all-faq-categories", element: <AllFaqCategories /> },
  { path: "add-service", element: <AddServices /> },
  { path: "all-services", element: <AllServices /> },
  // Blogs and categories
  { path: "add-blog", element: <AddBlog /> },
  { path: "edit-blog", element: <EditBlog /> },
  { path: "all-blogs", element: <AllBlogs /> },
  { path: "all-blog-categories", element: <AllBlogsCategories /> },
  // Case Studies paths
  { path: "add-case-study-category", element: <AddCaseStudyCategory /> },
  { path: "all-case-study-categories", element: <AllCaseStudyCategories /> },
];
