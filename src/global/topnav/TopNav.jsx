import React, { useMemo, useCallback } from "react";
import Dropdown from "./topnav_components/Dropdown";
import user_menu from "../../assets/jsonData/user_menu.json";
import notification from "../../assets/jsonData/notification.json";
import { Link, useNavigate } from "react-router-dom";

const TopNav = React.memo(({ setIsUserLoggedIn }) => {

  
  const curr_user = useMemo(
    () => ({
      display_name: "Bittu Kumar",
      image: "/assets/images/avatar-15.webp",
    }),
    []
  );

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("token");
    setIsUserLoggedIn(false);
    navigate("/");
  }, [setIsUserLoggedIn, navigate]);

  const renderNotificationItem = useCallback(
    (item, index) => (
      <div className="notification-item" key={index}>
        <i className={item.icon}></i>
        <span>{item.content}</span>
      </div>
    ),
    []
  );

  const renderUserToggle = useCallback(
    () => (
      <div className="topnav__right-user">
        <div className="topnav__right-user__image">
          <img src={curr_user.image} alt="" />
        </div>
        <div className="topnav__right-user__name">{curr_user.display_name}</div>
      </div>
    ),
    [curr_user]
  );

  const renderUserMenu = useCallback(
    (item, index) => (
      <>
        {item.content === "Logout" ? (
          <div className="notification-item" key={index} onClick={handleLogout}>
            <i className={item.icon}></i>
            <span>{item.content}</span>
          </div>
        ) : (
          <Link to={item.to} key={index}>
            <div className="notification-item">
              <i className={item.icon}></i>
              <span>{item.content}</span>
            </div>
          </Link>
        )}
      </>
    ),
    [handleLogout]
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

// Set displayName for the memoized component
TopNav.displayName = "TopNav";

export default TopNav;
