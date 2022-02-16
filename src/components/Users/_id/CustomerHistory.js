import { useState, useContext } from "react";
import UserContext from "UserContext";
import { getHistory } from "store/deliveries";
import { ReactComponent as UserBadge } from "svgs/users.svg";
import Paper from "@mui/material/Paper";
import MySnack from "components/common/MySnack";
import TextField from "@mui/material/TextField";
import HistoryTable from "components/common/HistoryTable";
import "../Users.scss";
import { useNavigate } from "react-router-dom";

export default function CustomerHistory(props) {
  const [fromSelectedDate, setFromDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  const [toSelectedDate, setToDate] = useState(new Date().toISOString());
  const [historyData, setHistoryData] = useState([]);
  const [spinner2, toggleSpinner2] = useState(true);
  const [alertmessage, setalertmessage] = useState(null);
  let userInfo = useContext(UserContext);
  let { access_token } = userInfo;
  let navigate = useNavigate();

  const getCustomerData = (e) => {
    setHistoryData([]);
    toggleSpinner2(true);
    e.preventDefault();
    let curr_id = window.location.pathname.split("/")[2];
    let data = {
      customer_user_id: [curr_id],
      from: fromSelectedDate,
      to: toSelectedDate,
    };
    if (curr_id) {
      getHistory(access_token, data)
        .then((res) => {
          // setHistoryData(res.data);
          modifyHistoryData(res.data.data);
          toggleSpinner2(false);
          setalertmessage("Data Fetched");
        })
        .catch((res) => {
          if (res && res.response && res.response.status === 401) {
            toggleSpinner2(true);
            setalertmessage("Refreshing");
            userInfo.refreshAccessToken();
          }
          toggleSpinner2(false);
          setalertmessage("No Data Available for Dates ");
        });
    }
  };

  const modifyHistoryData = (hist) => {
    // setHistoryData(hist);
    hist.forEach((item, index) => {
      let abc = {
        id: index + 1,
        user_name: item.UserDetail.name,
        // agent_name: item.UserDetail.name,
        delivery_type: item.DeliveryType.name,
        product: item.Product.name,
        quantity: item.quantity,
        price: item.price,
        delivered_at: new Date(item.delivered_at).toLocaleString("en-Gb"),
      };
      setHistoryData((prevData) => [...prevData, abc]);
    });
  };
  const captureFromDate = (e) => {
    e.preventDefault();
    let fromDate = new Date(e.target.value).toISOString();
    setFromDate(fromDate);
  };

  const gotouseredit = (e) => {
    navigate(-1);
  };

  const captureToDate = (e) => {
    e.preventDefault();
    // let a = e.target.setHours(23, 59, 00, 00);
    let toDate = new Date(e.target.value).toISOString();
    setToDate(toDate);
  };

  return (
    <div className="main-container">
      <div className="Orders__main-heading">
        <div className="General-main-heading">
          <UserBadge /> {"  "} Users
        </div>
        <div>
          <button className="Users__refresh-button" onClick={(e) => gotouseredit(e)}>
            Show User Details
          </button>
        </div>
      </div>
      <Paper className="Users__top">
        Customer History Data
        <div className="Users__fromdate">
          <TextField
            id="fromdate"
            label="From Date"
            type="date"
            onChange={(e) => captureFromDate(e)}
            defaultValue={new Date().toLocaleDateString("fr-CA")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="Users__fromdate">
          <TextField
            id="todate"
            label="To Date"
            type="date"
            onChange={(e) => captureToDate(e)}
            defaultValue={new Date().toLocaleDateString("fr-CA")}
            InputLabelProps={{
              shrink: true,
              max: new Date().toLocaleDateString("fr-CA"),
            }}
          />
        </div>
        <button className="Users__refresh-button" onClick={(e) => getCustomerData(e)}>
          Submit
        </button>{" "}
      </Paper>
      <Paper>
        <HistoryTable historyData={historyData} />
      </Paper>

      {alertmessage && <MySnack message={alertmessage} />}
    </div>
  );
}
