import { Navigate } from "react-router-dom";

import { useContext } from "react";
import UserContext from "UserContext";

const Landing = () => {
  const userInfo = useContext(UserContext);

  const isLoggedIn = () => {
    return userInfo.isLoggedIn;
  };

  return (
    <div>
      {isLoggedIn() === true ? (
        <Navigate to="/dashboard" />
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

export default Landing;
