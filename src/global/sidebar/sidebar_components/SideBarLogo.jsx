import { Link } from "react-router-dom"

const SideBarLogo = () => {
  return (
    <div className="sidebar__logo-wrapper">
        <Link to = "/dashboard/home">
            <div>
                <img src="/assets/images/logo.svg"  alt="logo" className="sidebar__logo" />
            </div>
        </Link>
    </div>
  )
}

export default SideBarLogo
