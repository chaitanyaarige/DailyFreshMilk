import { getHistory } from "store/deliveries";
import { useContext, useState } from "react";
import UserContext from "UserContext";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import HistoryTable from "components/common/HistoryTable";
import "components/Users/Users.scss";
import MySnack from "components/common/MySnack";
import Skeleton from "@mui/material/Skeleton";
import Spinner from "components/common/Spinner";

export default function UsersHistory() {
  let userInfo = useContext(UserContext);
  const [spinner, toggleSpinner] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  let { access_token } = userInfo;
  const [fromSelectedDate, setFromDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  const [alertmessage, setalertmessage] = useState(null);
  const [toSelectedDate, setToDate] = useState(new Date().toISOString());

  const getCustomerData = (e) => {
    setHistoryData([]);
    toggleSpinner(true);
    e.preventDefault();
    let curr_id = window.location.pathname.split("/")[2];
    let data = {
      agent_id: [curr_id],
      from: fromSelectedDate,
      to: toSelectedDate,
    };
    if (curr_id) {
      getHistory(access_token, data)
        .then((res) => {
          modifyHistoryData(res.data.data);
          toggleSpinner(false);
          setalertmessage("Data Fetched");
        })
        .catch((res) => {
          if (res && res.response && res.response.status === 401) {
            toggleSpinner(true);
            setalertmessage("Refreshing");
            userInfo.refreshAccessToken();
          }
          toggleSpinner(false);
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

  const captureToDate = (e) => {
    e.preventDefault();
    // let a = e.target.setHours(23, 59, 00, 00);
    let toDate = new Date(e.target.value).toISOString();
    setToDate(toDate);
  };

  return (
    <div className="main-container">
      {!spinner ? (
        <>
          <Paper className="Users__top">
            Agent History Data
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
        </>
      ) : (
        <div className="Agents__spinners">
          <Spinner />
          <Skeleton animation="wave" height={100} width="80%" />
          <Skeleton variant="rectangular" animation="wave" width={210} height={118} />
        </div>
      )}
      {alertmessage && <MySnack message={alertmessage} />}
    </div>
  );
}
