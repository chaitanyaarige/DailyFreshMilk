import { getHistory } from "store/deliveries";
import { useEffect, useContext, useState } from "react";
import UserContext from "UserContext";
import QRCode from "qrcode";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import HistoryTable from "components/common/HistoryTable";
import "../Users.scss";
import MySnack from "components/common/MySnack";
import Skeleton from "@mui/material/Skeleton";
import Spinner from "components/common/Spinner";
import { toPng } from "html-to-image";
import { useQuery } from "react-query";
import { listUsers } from "store/user";
import { saveAs } from "file-saver";
import AssignSingleUser from "components/Users/_id/AssignSingleUser";
import { listAgentUsers } from "store/assignUsers";
import DailyMilkFreshLogo from "logo.png";
import { listProducts } from "store/products";
import { listDeliveryTypes } from "store/deliveries";
import CustomerHistory from "components/Users/_id/CustomerHistory";

export default function UsersHistory() {
  let userInfo = useContext(UserContext);
  const [spinner, toggleSpinner] = useState(true);
  const [curr_id, setCurrid] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  // const [modifiedHistory, setConvertedHistory] = useState(null);
  let { access_token, refreshAccessToken } = userInfo;
  const [fromSelectedDate, setFromDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  const [alertmessage, setalertmessage] = useState(null);
  const [toSelectedDate, setToDate] = useState(new Date().toISOString());
  const [imageUrl, setImageUrl] = useState("");
  const [currUser, setCurrUser] = useState();
  const [currentOrder, setCurrentOrder] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [products, setProducts] = useState([]);

  useQuery([3, userInfo.access_token], listUsers, {
    retry: 1,
    onSuccess: (data) => {
      data?.data && setCurrUser(data.data.data.find((i) => i.user_id === curr_id));
      toggleSpinner(false);
    },
    onError: (error) => {
      if (error && error.response && error.response.status === 401) {
        toggleSpinner(true);
        refreshAccessToken();
      }
    },
  });

  useQuery([access_token, null], listAgentUsers, {
    retry: 1,
    onSuccess: (data) => {
      data?.data && setCurrentOrder(data.data.data.filter((item) => item.user_id === curr_id));
    },
  });

  useQuery([0, access_token], listProducts, {
    retry: 1,
    onSuccess: (data) => {
      data?.data && setProducts(data.data.data);
    },
    onError: (error) => {
      if (error?.response?.status === 401) {
        refreshAccessToken();
      }
    },
  });

  useEffect(() => {
    // toggleSpinner(true);
    listDeliveryTypes(access_token)
      .then((res) => {
        setDeliveryTypes(res.data.data);
      })
      .catch((res) => {
        console.log(res);
        if (res && res.response && res.response.status === 401) {
          refreshAccessToken();
        }
      });
    // toggleSpinner(false);
  }, [access_token, refreshAccessToken]);

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        var opts = {
          errorCorrectionLevel: "H",
          type: "application/octet-stream",
          quality: 1,
          margin: 1,
          color: {
            dark: "#000",
            light: "#FFF",
          },
        };
        setCurrid(window.location.pathname.split("/")[2]);
        const response = await QRCode.toDataURL(curr_id, opts);
        var url = response.replace(/^data:image\/[^;]+/, "data:application/octet-stream");
        setImageUrl(url);
      } catch (error) {
        console.log(error);
      }
    };
    generateQrCode();
  }, [curr_id, access_token, refreshAccessToken]);

  const getCustomerData = (e) => {
    setHistoryData([]);
    toggleSpinner(true);
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

  // const downloadQR = (e) => {
  //   htmlToImage.toPng(document.getElementById("my-node")).then(function (dataUrl) {
  //     download(dataUrl, "my-node.png");
  //   });
  // };

  const orderType = (id) => {
    let nameItem = deliveryTypes.find((item) => item.delivery_type === id);
    return nameItem && nameItem.name;
  };

  const orderProducts = (id) => {
    let nameItem = products.find((item) => item.product_type === id);
    return nameItem && nameItem.name;
  };

  const onCapture = () => {
    toPng(document.getElementById("chaiuserqr")).then(function (dataUrl) {
      saveAs(dataUrl, currUser.name + "qrcode.jpg");
    });
  };

  return (
    <div className="main-container">
      {!spinner ? (
        <>
          <Paper className="AssignUsers__sub" elevation={2}>
            <div style={{ backgroundColor: "white" }} id="chaiuserqr">
              <img className="Users__logo-image" src={DailyMilkFreshLogo} alt="this is logo"></img> <br></br>
              <div>
                {imageUrl ? (
                  <div>
                    <img width="350px" height="350px" src={imageUrl} alt="img" />
                  </div>
                ) : null}
                {currUser.address}
              </div>
            </div>
            <div className="Users__refresh-button " onClick={onCapture}>
              Customer Unique Scan Code - Download
            </div>{" "}
          </Paper>

          <Paper className="Users__top">
            <h4>Existing Delivery Details:</h4>
            {currentOrder.map((cuser, index) => {
              return (
                <>
                  <hr></hr>
                  <div>Selected Product: {orderProducts(cuser.product_type)} </div>
                  <div>Selected DeliveryType: {orderType(cuser.delivery_type)}</div>
                  <div>Selected Quantity {cuser.quantity}</div>
                </>
              );
            })}
          </Paper>

          <AssignSingleUser currUser={currUser}></AssignSingleUser>

          <CustomerHistory></CustomerHistory>
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
