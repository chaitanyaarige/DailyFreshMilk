import { useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "PrivateRoute";
import UserContext from "UserContext";
import Login from "components/login/Login";
import Orders from "components/Orders/Orders";
import Users from "components/Users/Users";
import UsersHistory from "components/Users/_id/User";
// import OrdersCancel from "components/Orders/OrdersCancel";
import Products from "components/Products/Products";
import EditProducts from "components/Products/EditProduct";
import Agents from "components/Agents/Agents";
import AgentsHistory from "components/Agents/AgentsHistory";
import Settings from "components/UserAccount/Settings";
// import ExportData from "components/Dashboard/ExportData";
import Statistics from "components/Dashboard/Statistics";
import Deliveries from "components/Deliveries/Deliveries";
import DeliveryTypes from "components/Deliveries/DeliveryTypes";
import AssignUsers from "components/AssigningUsersToAgent/AssignUsers";
import Navbar from "components/common/Navbar";
import MobileNav from "components/common/MobileNav";
import Dashboard from "components/Dashboard/Dashboard";
import { refreshToken } from "store/auth";
import Fournotfour from "components/common/Fournotfour";
import { ReactQueryDevtools } from "react-query/devtools";

export default function App() {
  const pastLogin = JSON.parse(localStorage.getItem("loggedIn"));
  const pastIsAdmin = JSON.parse(localStorage.getItem("isAdmin"));
  const pastAccessToken = sessionStorage.getItem("access_token");
  const pastRefreshToken = localStorage.getItem("refresh_token");
  const pastUserdetails = JSON.parse(localStorage.getItem("userDetails"));

  const [userDetails, setUserDetails] = useState(pastUserdetails || {});
  const [isLoggedIn, setIsLoggedIn] = useState(pastLogin || false);
  const [isAdmin, setIsAdmin] = useState(pastIsAdmin || false);
  const [access_token, setAccessToken] = useState(pastAccessToken || null);
  const [refresh_token, setRefreshToken] = useState(pastRefreshToken || null);

  useEffect(() => {
    if (!access_token) return localStorage.setItem("loggedIn", Boolean(false));
    localStorage.setItem("loggedIn", Boolean(isLoggedIn));
  }, [isLoggedIn, access_token]);

  useEffect(() => {
    if (!access_token) return localStorage.setItem("loggedIn", Boolean(false));
    localStorage.setItem("isAdmin", Boolean(isAdmin));
  }, [isAdmin, access_token]);

  useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }, [userDetails]);

  useEffect(() => {
    sessionStorage.setItem("access_token", access_token);
  }, [access_token]);

  useEffect(() => {
    localStorage.setItem("refresh_token", refresh_token);
  }, [refresh_token]);

  const saveuserDetails = (data) => {
    setUserDetails(data);
  };

  const refreshAccessToken = () => {
    refreshToken(refresh_token).then((res) => {
      setAccessToken(res.data.access_token);
    });
  };

  const userSettings = {
    isLoggedIn: isLoggedIn,
    access_token: access_token,
    refresh_token: refresh_token,
    isAdmin: isAdmin,
    userDetails: userDetails,
    refreshAccessToken,
    setIsLoggedIn,
    setAccessToken,
    setIsAdmin,
    setRefreshToken,
    saveuserDetails,
  };

  return (
    <Router>
      <UserContext.Provider value={userSettings}>
        {isLoggedIn ? <Navbar></Navbar> : <> </>}
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/users/:id" element={<UsersHistory />} />
            <Route exact path="/orders" element={<Orders />} />
            {/* <Route exact path="/orders/:id" element={<OrdersCancel />} /> */}
            <Route exact path="/agents" element={<Agents />} />
            <Route exact path="/agents/:id" element={<AgentsHistory />} />
            <Route exact path="/products" element={<Products />} />
            <Route exact path="/products/:id" element={<EditProducts />} />
            <Route exact path="/assign_users" element={<AssignUsers />} />
            <Route exact path="/delivery_type" element={<DeliveryTypes />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/deliveries" element={<Deliveries />} />
            <Route exact path="/statistics" element={<Statistics />} />
            {/* <Route path="*" element={<Fournotfour />} /> */}
          </Route>
          <Route exact path="/login" element={<Login />} />
          <Route path="*" element={<Fournotfour />} />
        </Routes>
        {isLoggedIn ? <MobileNav></MobileNav> : <> </>}
      </UserContext.Provider>
      <ReactQueryDevtools />
    </Router>
  );
}
