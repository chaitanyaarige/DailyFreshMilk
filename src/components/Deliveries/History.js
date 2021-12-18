import { useState, useEffect, useContext } from "react";
import UserContext from "UserContext";
import { ReactComponent as CartIcon } from "svgs/cartIcon.svg";
import SelectUser from "components/AssigningUsersToAgent/SelectUser";
import SelectAgent from "components/AssigningUsersToAgent/SelectAgent";
import Paper from "@mui/material/Paper";
import { listAgentUsers } from "store/assignUsers";
import { listUsers } from "store/user";
import { listProducts } from "store/products";

import "./Deliveries.scss";

export default function Deliveries() {
  const userInfo = useContext(UserContext);
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    listAgentUsers(userInfo.access_token).then((res) => {
      setDeliveries(res.data.data);
    });
    listUsers(null, userInfo.access_token).then((res) => {
      setUsers(res.data.data);
    });
    listProducts(null, userInfo.access_token).then((res) => {
      setProducts(res.data.data);
    });
  }, [userInfo.access_token]);

  const SubmitData = (e, g, n) => {
    e.preventDefault();
    let submit = "";
    setDeliveries([]);

    if (n === "agent") submit = { agent_id: g };
    if (n === "user") submit = { user_id: g };
    listAgentUsers(userInfo.access_token, submit).then((res) => {
      setDeliveries(res.data.data);
    });
  };

  const agentName = (id) => {
    let n = users.find((item) => id === item.user_id);
    return n ? n.name : "NA";
  };

  const productName = (id) => {
    let n = products.find((item) => id === item.product_type);
    return n ? n.name : "NA";
  };

  return (
    <div className="Deliveries__main-container">
      <div className="Orders__main-heading">
        <div className="General-main-heading">
          <CartIcon /> {"  "} Orders
        </div>
      </div>

      <div> Select Any One </div>
      <SelectUser
        handleData={SubmitData}
        refreshAccessToken={userInfo.refreshAccessToken}
        access_token={userInfo.access_token}
      />

      <SelectAgent
        handleData={SubmitData}
        refreshAccessToken={userInfo.refreshAccessToken}
        access_token={userInfo.access_token}
      />

      <div>
        {deliveries.map((item, index) => {
          return (
            <Paper key={index} className="Agents__order" elevation={2}>
              <div> delivery_id : {item.delivery_id}</div>
              <div> user_id: {agentName(item.user_id)} </div>
              <div> agent_id: {agentName(item.agent_id)}</div>
              <div> product_type: {productName(item.product_type)}</div>
              <div> quantity: {item.quantity}</div>
              <div> price: {item.price}</div>
              <div> total price : {item.price * item.quantity}</div>
              <div> delivery_status: {item.delivery_status}</div>
              <div> delivery_type: {item.delivery_type}</div>
              <div>modified_at : {item.modified_at}</div>
            </Paper>
          );
        })}
      </div>
    </div>
  );
}
