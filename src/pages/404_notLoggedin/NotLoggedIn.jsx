import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotLoggedIn = () => {
  const navigate = useNavigate();
  const [countDown, setCountDown] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return (
    <div className="layout">
      You're not logged in yet. Redirect to loginpage in {countDown} seconds.
    </div>
  );
};

export default NotLoggedIn;
