import { useState } from "react";
import sidebar_routes from "../../assets/jsonData/sidebar_routes.json";
import SideBarButton from "./sidebar_components/SideBarButton";
import SideBarFooter from "./sidebar_components/SideBarFooter";
import SideBarLogo from "./sidebar_components/SideBarLogo";
const Sidebar = () => {
  const [opensubmenuIndex, setOpensubmenuIndex] = useState(null);

  const toggleSubmenu = (index) => {
    if (opensubmenuIndex === index) {
      setOpensubmenuIndex(null);
    } else {
      setOpensubmenuIndex(index);
    }
  };

  return (
    <>
      <div className="sidebar__wrapper">
        <div className="sidebar__body">
          <SideBarLogo />
          <div className="sidebar__list-items">
            {sidebar_routes.map((item, index) => (
              <div key={index} className="sidebar__list">
                {item.type === "heading" && (
                  <h2 className="sidebar_items_heading">{item.title}</h2>
                )}
                {item.type !== "heading" && (
                  <SideBarButton
                    key={index}
                    title={item.title}
                    to={item.to}
                    icon={item.icon}
                    span={item.span}
                    subMenu={item.sub}
                    onClick={() => {
                      toggleSubmenu(index);
                    }}
                    open={opensubmenuIndex === index}
                  />
                )}
              </div>
            ))}
          </div>
          <SideBarFooter />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
