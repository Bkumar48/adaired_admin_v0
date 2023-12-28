import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { jwtDecode } from "jwt-decode";
import Loader from "../../components/loader/Loader";
import Dropdown from "./topnav_components/Dropdown";
import user_menu from "../../assets/jsonData/user_menu.json";
import notification from "../../assets/jsonData/notification.json";

const TopNav = React.memo(({ setIsUserLoggedIn }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const userId = jwtDecode(token)?.user_id;

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery(
    "userData",
    () =>
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/v1/user/getUser/?userId=${userId}`
        )
        .then(({ data }) => data),
    { enabled: !!userId }
  );

  useEffect(() => {
    if (userData) {
      setUser({
        display_name: `${userData.data?.firstName} ${userData.data?.lastName}`,
        image: "/assets/images/avatar-15.webp",
      });
    }
  }, [userData]);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("token");
    setIsUserLoggedIn(false);
    navigate("/");
  }, [setIsUserLoggedIn, navigate]);

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading user data</div>;
  if (!user) return null;

  const renderNotificationItem = (item, index) => (
    <div className="notification-item" key={index}>
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  );

  const renderUserToggle = () => (
    <div className="topnav__right-user">
      <div className="topnav__right-user__image">
        <img src={user?.image} alt="" />
      </div>
      <div className="topnav__right-user__name">{user?.display_name}</div>
    </div>
  );

  const renderUserMenu = (item, index) => (
    <div
      className="notification-item"
      key={index}
      onClick={() => item.content === "Logout" && handleLogout()}
    >
      {item.content === "Logout" ? (
        <>
          <i className={item.icon} onClick={handleLogout}></i>
          <span>{item.content}</span>
        </>
      ) : (
        <Link to={item.to}>
          <i className={item.icon}></i>
          <span>{item.content}</span>
        </Link>
      )}
    </div>
  );

  return (
    <div className="topnav">
      <div className="topnav__search"></div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          <Dropdown
            icon="fa-solid fa-bell"
            badge="12"
            contentData={notification}
            renderItems={renderNotificationItem}
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            customToggle={renderUserToggle}
            contentData={user_menu}
            renderItems={renderUserMenu}
          />
        </div>
      </div>
    </div>
  );
});

TopNav.displayName = "TopNav";

export default TopNav;
