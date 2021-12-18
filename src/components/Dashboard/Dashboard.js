import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import "./Dashboard.scss";
import Navbar from "components/common/Navbar";
import MobileNav from "components/common/MobileNav";
import Orders from "components/Orders/Orders";
import Users from "components/Users/Users.js";
import Products from "components/Products/Products";
import Agents from "components/Agents/Agents";
import Settings from "components/UserAccount/Settings";
// import ExportData from "components/Dashboard/ExportData";
import Statistics from "components/Dashboard/Statistics";
import UserContext from "UserContext";
import Deliveries from "components/Deliveries/Deliveries";
import DeliveryTypes from "components/Deliveries/DeliveryTypes";
import AssignUsers from "components/AssigningUsersToAgent/AssignUsers";

export default function Dashboard() {
  const userInfo = useContext(UserContext);
  const isAdmin = () => {
    return userInfo.isAdmin;
  };

  const isLoggedIn = () => {
    return userInfo.isLoggedIn;
  };
  const [currentComponent, setCurrentComponent] = useState("Welcome");

  const currentSelection = (sal) => {
    setCurrentComponent(sal);
  };

  const adminComponents = () => {
    switch (currentComponent) {
      case "orders_list":
        return <Orders />;
      case "agents_list":
        return <Agents />;
      case "users_list":
        return <Users />;
      case "products_list":
        return <Products />;
      case "assign_users":
        return <AssignUsers />;
      case "deliveries":
        return <Deliveries />;
      // case "export_data":
      //   return <ExportData />;
      // case "qrscanner":
      //   return <QRCodeMain />;
      case "delivery_type":
        return <DeliveryTypes />;
      case "settings":
        return <Settings />;
      case "1":
        return <Orders />;
      case "2":
        return <Orders />;
      case "3":
        return <Settings />;
      // case "4":
      //   return <Settings />;
      default:
        return <Statistics />;
    }
  };

  const agentComponents = () => {
    switch (currentComponent) {
      case "settings":
        return <Settings />;
      case "deliveries":
        return <Deliveries />;
      case "1":
        return <Deliveries />;
      case "2":
        return <Deliveries />;
      case "3":
        return <Settings />;
      default:
        return <Deliveries />;
    }
  };

  return (
    <div>
      {!isLoggedIn() ? (
        <Navigate to="/login" />
      ) : (
        <div>
          <Navbar currentMenuSelection={currentSelection}></Navbar>
          <div className="AgentDashboard__main-container">
            {isAdmin() ? adminComponents() : agentComponents()}
          </div>
          <MobileNav currentMenuSelection={currentSelection}></MobileNav>
        </div>
      )}
    </div>
  );
}
