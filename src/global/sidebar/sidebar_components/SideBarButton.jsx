import { NavLink } from "react-router-dom";

const SideBarButton = (props) => {

  return (
    <li>
      {props.subMenu === undefined ? (
        <NavLink
          strict="true"
          to={{
            pathname: props.to,
            state: { flag: props.title },
          }}
          className="sidebar__list-item"
          onClick={() => {}}
        >
          <div className="sidebar__list-icon">
            <i className={props.icon}></i>
          </div>
          {props.title}
          {props.span !== undefined && (
            <div className="sidebar__list-dot">{props.span}</div>
          )}
        </NavLink>
      ) : (
        <div
          className="sidebar__list-item-navbtn"
          onClick={props.onClick}
        >
          <div className="sidebar__list-icon">
            <i className={props.icon}></i>
          </div>
          {props.title}
          {props.span !== undefined && (
            <div className="sidebar__list-dot">{props.span}</div>
          )}
          {props.subMenu !== undefined && (
            <div className="sidebar__list-arrow" open={props.open && "open"}>
              <span
                style={{
                  transform: props.open && "rotate(90deg)",
                  transition: "all 0.3s ease-in-out",
                }}
              ></span>
            </div>
          )}
        </div>
      )}

      <div
        className="sidebar__list-submenu"
        style={{
          height: props.open ? `auto` : "0",
          transition: "all 0.3s ease-in-out",
          padding: props.open && "10px 0",
        }}
      >
        {props.subMenu !== undefined &&
          props.subMenu.map((item, index) => (
            <NavLink
              key={index}
              strict="true"
              to={{
                pathname: item.to,
                state: { flag: item.title },
              }}
              className="sidebar__list-item"
            >
              <div className="sidebar__list-icon">
                <i className={item.icon}></i>
              </div>
              {item.title}
              {item.span !== undefined && (
                <div className="sidebar__list-dot">{item.span}</div>
              )}
            </NavLink>
          ))}
      </div>
    </li>
  );
};

export default SideBarButton;
