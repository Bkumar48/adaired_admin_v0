import Dropdown from "./topnav_components/Dropdown";
import user_menu from "../../assets/jsonData/user_menu.json";
import notification from "../../assets/jsonData/notification.json";
import { Link } from "react-router-dom";
const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img src={user.image} alt="" />
    </div>
    <div className="topnav__right-user__name">{user.display_name}</div>
  </div>
);

const renderUserMenu = (item, index) => (
  <Link to="/" key={index}>
    <div className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

const TopNav = () => {
  const curr_user = {
    display_name: "Bittu Kumar",
    image: "https://i.pravatar.cc/150?img=5",
  };
  return (
    <div className="topnav">
      <div className="topnav__search"></div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* {dropdown here} */}
          <Dropdown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>
        <div className="topnav__right-item">
          {/* {dropdown here} */}
          <Dropdown
            icon="fa-solid fa-bell"
            badge="12"
            contentData={notification}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
