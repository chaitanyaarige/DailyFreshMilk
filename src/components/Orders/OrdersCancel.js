import { useState } from "react";
import TextField from "@mui/material/TextField";
import "./OrdersCancel.scss";
import { cancelDelivery } from "store/deliveries";

export default function OrdersCancel(props) {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const cancelOrder = (e) => {
    e.preventDefault();
    let data = {
      delivery_id: props.currentUser,
      from: fromDate, // "1632009660000",
      to: toDate, // "1632009590000",
    };
    cancelDelivery(props.access_token, data);
  };

  return (
    <>
      <div className="OrdersCancel__main-container">
        <div className="OrdersCancel__row-class">Cancel order Delivery id: {props.order}</div>
        <div className="OrdersCancel__row-class">
          <TextField
            id="frdate"
            onChange={(e) => setFromDate(e.target.value)}
            className="OrdersCancel__dateside"
            label="From Date"
            type="date"
            defaultValue={new Date().toLocaleDateString("fr-CA")}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="todate"
            label="From Date"
            type="date"
            defaultValue={new Date().toLocaleDateString("fr-CA")}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div onClick={(e) => cancelOrder(e)} className="OrdersCancel__edit">
          Cancel
        </div>
      </div>
    </>
  );
}
